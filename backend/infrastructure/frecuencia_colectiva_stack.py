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
    Cors,
    CorsOptions,
    MockIntegration,
    IntegrationResponse,
    MethodResponse,
)
from aws_cdk.aws_lambda import (
    Function,
    Runtime,
    Code,
)
from aws_cdk.aws_lambda_nodejs import NodejsFunction
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
    Function as CloudFrontFunction,
    FunctionCode,
    FunctionEventType,
    FunctionAssociation,
)
from aws_cdk.aws_cloudfront_origins import (
    HttpOrigin,
    S3BucketOrigin,
)
from aws_cdk.aws_s3_deployment import BucketDeployment, Source
from aws_cdk.aws_cloudfront import S3OriginAccessControl, Signing
from aws_cdk.aws_ses import EmailIdentity
from cdk_nag import NagSuppressions


class FrecuenciaColectivaStack(Stack):
    def __init__(self, scope: App, id: str, **kwargs):
        super().__init__(scope, id, **kwargs)

        articles_table = Table(
            self, "ArticlesTable",
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

        lambda_role.add_to_policy(
            PolicyStatement(
                actions=["ses:SendEmail", "ses:SendRawEmail", "ses:SendTemplatedEmail"],
                resources=["*"],
            )
        )

        NagSuppressions.add_resource_suppressions(lambda_role, [
            {
                "id": "AwsSolutions-IAM5",
                "reason": "SES permissions require wildcard resource for email sending - email identity is verified via SES console"
            }
        ])

        NagSuppressions.add_resource_suppressions(articles_table, [
            {
                "id": "AwsSolutions-DDB3",
                "reason": "Point-in-time recovery not required for development environment - articles are seeded from external source"
            }
        ])

        list_articles_fn = Function(
            self, "ListArticlesHandler",
            runtime=Runtime.NODEJS_20_X,
            handler="listArticlesHandler.handler",
            code=Code.from_asset("dist/handlers"),
            role=lambda_role,
            environment={
                "TABLE_NAME": articles_table.table_name,
                "AWS_NODEJS_CONNECTION_REUSE_ENABLED": "1"
            },
            memory_size=256,
            timeout=Duration.seconds(10),
        )

        get_article_fn = Function(
            self, "GetArticleHandler",
            runtime=Runtime.NODEJS_20_X,
            handler="getArticleHandler.handler",
            code=Code.from_asset("dist/handlers"),
            role=lambda_role,
            environment={
                "TABLE_NAME": articles_table.table_name,
                "AWS_NODEJS_CONNECTION_REUSE_ENABLED": "1"
            },
            memory_size=256,
            timeout=Duration.seconds(10),
        )

        filter_by_category_fn = Function(
            self, "FilterByCategoryHandler",
            runtime=Runtime.NODEJS_20_X,
            handler="filterByCategoryHandler.handler",
            code=Code.from_asset("dist/handlers"),
            role=lambda_role,
            environment={
                "TABLE_NAME": articles_table.table_name,
                "AWS_NODEJS_CONNECTION_REUSE_ENABLED": "1"
            },
            memory_size=256,
            timeout=Duration.seconds(10),
        )

        import os

        contact_fn = Function(
            self, "ContactHandler",
            runtime=Runtime.NODEJS_20_X,
            handler="contactHandler.handler",
            code=Code.from_asset("dist/handlers"),
            role=lambda_role,
            environment={
                "CONTACT_EMAIL": os.getenv("CONTACT_EMAIL", "contact@frecuenciacolectiva.com"),
                "AWS_NODEJS_CONNECTION_REUSE_ENABLED": "1",
                "AWS_REGION": os.getenv("AWS_REGION", "us-east-1"),
            },
            memory_size=256,
            timeout=Duration.seconds(10),
        )

        NagSuppressions.add_resource_suppressions([list_articles_fn, get_article_fn, filter_by_category_fn, contact_fn], [
            {
                "id": "AwsSolutions-L1",
                "reason": "NODEJS_20_X is the current LTS runtime - using latest would require Node.js 22 which may not be available in all Lambda@Edge regions"
            }
        ])

        api = RestApi(
            self, "NewsApi",
            rest_api_name="News API",
            description="API for The Daily Chronicle news website",
            default_cors_preflight_options=CorsOptions(
                allow_origins=Cors.ALL_ORIGINS,
                allow_methods=Cors.ALL_METHODS,
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

        contact = api.root.add_resource("contact")
        contact.add_method(
            "POST",
            LambdaIntegration(contact_fn),
        )

        frontend_bucket_log = Bucket(
            self, "FrontendBucketLogs",
            public_read_access=False,
            block_public_access=BlockPublicAccess.BLOCK_ALL,
            removal_policy=RemovalPolicy.DESTROY,
        )

        frontend_bucket = Bucket(
            self, "FrontendBucket",
            public_read_access=False,
            block_public_access=BlockPublicAccess.BLOCK_ALL,
            removal_policy=RemovalPolicy.DESTROY,
            server_access_logs_bucket=frontend_bucket_log,
        )

        origin_access_control = S3OriginAccessControl(
            self, "FrontendOAC",
            signing=Signing.SIGV4_ALWAYS,
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
                "origin": S3BucketOrigin.with_origin_access_control(frontend_bucket, origin_access_control=origin_access_control),
                "viewer_protocol_policy": ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
                "cache_policy": CachePolicy.CACHING_OPTIMIZED,
            },
            log_bucket=frontend_bucket_log,
        )

        NagSuppressions.add_resource_suppressions(frontend_bucket, [
            {
                "id": "AwsSolutions-S10",
                "reason": "Bucket policy is managed by CloudFront OAC - HTTPS is enforced at distribution level"
            }
        ])

        NagSuppressions.add_resource_suppressions(frontend_bucket_log, [
            {
                "id": "AwsSolutions-S10",
                "reason": "Access logs bucket does not require SSL - it only receives access logs from CloudFront"
            }
        ])

        spa_rewrite_function = CloudFrontFunction(
            self, "SpaRewriteFunction",
            code=FunctionCode.from_inline(r"""
            function handler(event) {
                var request = event.request;
                var uri = request.uri;

                if (uri.match(/\.[^/]+$/)) {
                    return request;
                }

                request.uri = "/index.html";
                return request;
            }
            """),
        )

        distribution.add_behavior(
            "/*",
            S3BucketOrigin.with_origin_access_control(frontend_bucket, origin_access_control=origin_access_control),
            viewer_protocol_policy=ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
            cache_policy=CachePolicy.CACHING_OPTIMIZED,
            function_associations=[
                FunctionAssociation(
                    function=spa_rewrite_function,
                    event_type=FunctionEventType.VIEWER_REQUEST,
                )
            ],
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
        CfnOutput(self, "DynamoDBTableName", value=articles_table.table_name)
        CfnOutput(self, "FrontendBucketName", value=frontend_bucket.bucket_name)
        CfnOutput(self, "DistributionId", value=distribution.distribution_id)
