#!/usr/bin/env python
from aws_cdk import (
    App,
    Stack,
    Duration,
    CfnOutput,
    RemovalPolicy,
)
from aws_cdk.aws_apigateway import (
    RestApi,
    LambdaIntegration,
    CorsOptions,
)
from aws_cdk.aws_lambda import (
    Function,
    Runtime,
    Code,
)
from aws_cdk.aws_dynamodb import (
    Table,
    AttributeType,
    BillingMode,
    ProjectionType,
)
from aws_cdk.aws_iam import (
    Role,
    ServicePrincipal,
    ManagedPolicy,
    PolicyStatement,
    CanonicalUserPrincipal,
)
from aws_cdk.aws_s3 import (
    Bucket,
    BlockPublicAccess,
)
from aws_cdk.aws_cloudfront import (
    Distribution,
    ViewerProtocolPolicy,
    AllowedMethods,
    CachePolicy,
    OriginSslPolicy,
)
from aws_cdk.aws_cloudfront_origins import (
    HttpOrigin,
    S3BucketOrigin,
)
from aws_cdk.aws_s3_deployment import BucketDeployment, Source


class NewsStack(Stack):
    def __init__(self, scope: App, id: str, **kwargs):
        super().__init__(scope, id, **kwargs)

        table_name = "Articles"
        
        articles_table = Table(
            self, "ArticlesTable",
            table_name=table_name,
            partition_key={
                "name": "articleId",
                "type": AttributeType.STRING
            },
            billing_mode=BillingMode.PAY_PER_REQUEST,
            removal_policy=RemovalPolicy.DESTROY,
        )

        articles_table.add_global_secondary_index(
            index_name="categoryIndex",
            partition_key={
                "name": "category",
                "type": AttributeType.STRING
            },
            sort_key={
                "name": "date",
                "type": AttributeType.STRING
            },
            projection_type=ProjectionType.ALL,
        )

        lambda_role = Role(
            self, "LambdaExecutionRole",
            assumed_by=ServicePrincipal("lambda.amazonaws.com"),
            managed_policies=[
                ManagedPolicy.from_aws_managed_policy_name(
                    "service-role/AWSLambdaBasicExecutionRole"
                )
            ]
        )

        articles_table.grant_read_data(lambda_role)

        list_articles_fn = Function(
            self, "ListArticlesHandler",
            function_name="listArticlesHandler",
            runtime=Runtime.NODEJS_20_X,
            handler="listArticlesHandler.handler",
            code=Code.from_asset("dist/handlers"),
            role=lambda_role,
            environment={
                "TABLE_NAME": table_name,
                "AWS_NODEJS_CONNECTION_REUSE_ENABLED": "1"
            },
            memory_size=256,
            timeout=Duration.seconds(10),
        )

        get_article_fn = Function(
            self, "GetArticleHandler",
            function_name="getArticleHandler",
            runtime=Runtime.NODEJS_20_X,
            handler="getArticleHandler.handler",
            code=Code.from_asset("dist/handlers"),
            role=lambda_role,
            environment={
                "TABLE_NAME": table_name,
                "AWS_NODEJS_CONNECTION_REUSE_ENABLED": "1"
            },
            memory_size=256,
            timeout=Duration.seconds(10),
        )

        filter_by_category_fn = Function(
            self, "FilterByCategoryHandler",
            function_name="filterByCategoryHandler",
            runtime=Runtime.NODEJS_20_X,
            handler="filterByCategoryHandler.handler",
            code=Code.from_asset("dist/handlers"),
            role=lambda_role,
            environment={
                "TABLE_NAME": table_name,
                "AWS_NODEJS_CONNECTION_REUSE_ENABLED": "1"
            },
            memory_size=256,
            timeout=Duration.seconds(10),
        )

        api = RestApi(
            self, "NewsApi",
            rest_api_name="News API",
            description="API for The Daily Chronicle news website",
            default_cors_preflight_options=CorsOptions(
                allow_origins=["*"],
                allow_methods=["GET", "OPTIONS"],
                allow_headers=["Content-Type", "Authorization"],
                max_age=Duration.days(1),
            ),
        )

        articles = api.root.add_resource("articles")

        articles.add_method(
            "GET",
            LambdaIntegration(list_articles_fn),
            request_parameters={
                "method.request.querystring.category": False,
                "method.request.querystring.search": False,
            }
        )

        article_by_id = articles.add_resource("{id}")
        article_by_id.add_method(
            "GET",
            LambdaIntegration(get_article_fn),
        )

        frontend_bucket = Bucket(
            self, "FrontendBucket",
            bucket_name="news-frontend-assets-unique12345",
            public_read_access=False,
            block_public_access=BlockPublicAccess.BLOCK_ALL,
            removal_policy=RemovalPolicy.DESTROY,
        )

        BucketDeployment(
            self, "FrontendDeployment",
            sources=[Source.asset("../frontend/dist")],
            destination_bucket=frontend_bucket,
        )

        distribution = Distribution(
            self, "NewsDistribution",
            default_root_object="index.html",
            default_behavior={
                "origin": S3BucketOrigin(frontend_bucket),
                "viewer_protocol_policy": ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
                "cache_policy": CachePolicy.CACHING_OPTIMIZED,
            },
        )

        backend_origin = HttpOrigin(
            f"{api.rest_api_id}.execute-api.{self.region}.amazonaws.com",
            origin_ssl_protocols=[OriginSslPolicy.TLS_V1_2],
        )

        distribution.add_behavior(
            "/api/*",
            backend_origin,
            viewer_protocol_policy=ViewerProtocolPolicy.HTTPS_ONLY,
            cache_policy=CachePolicy.CACHING_DISABLED,
            allowed_methods=AllowedMethods.ALLOW_ALL,
        )

        CfnOutput(self, "ApiEndpoint", value=api.url)
        CfnOutput(self, "FrontendURL", value=f"https://{distribution.domain_name}")
        CfnOutput(self, "DynamoDBTableName", value=table_name)


app = App()
NewsStack(app, "NewsStack")
app.synth()
