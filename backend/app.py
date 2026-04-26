#!/usr/bin/env python
import os
from dotenv import load_dotenv
from aws_cdk import App, Aspects
from infrastructure.frecuencia_colectiva_stack import FrecuenciaColectivaStack
from cdk_nag import AwsSolutionsChecks, NagSuppressions

load_dotenv()

account = os.getenv("AWS_ACCOUNT")
region = os.getenv("AWS_REGION", "us-east-1")
stack_suffix = os.getenv("STACK_SUFFIX", "")

if not account:
    raise ValueError("AWS_ACCOUNT environment variable is required. Set it in .env file.")

app = App()
stack = FrecuenciaColectivaStack(app, f"FrecuenciaColectivaStack{stack_suffix}", env={
    "account": account,
    "region": region
})

NagSuppressions.add_stack_suppressions(stack, [
    {"id": "AwsSolutions-IAM4", "reason": "AWS managed policies are required for Lambda execution role and API Gateway CloudWatch logging"},
    {"id": "AwsSolutions-IAM5", "reason": "Wildcard permissions are required for CDKBucketDeployment and SES email sending - scoped to specific resources"},
    {"id": "AwsSolutions-APIG2", "reason": "Request validation is optional for public news API - input is query parameters only"},
    {"id": "AwsSolutions-APIG4", "reason": "Public news API does not require authorization - articles are publicly readable"},
    {"id": "AwsSolutions-COG4", "reason": "Cognito authorizer not required for public news API"},
    {"id": "AwsSolutions-CFR4", "reason": "TLS v1.2 is enforced at CloudFront viewer connection level"},
    {"id": "AwsSolutions-S10", "reason": "S3 bucket SSL is managed by CloudFront OAC - HTTPS enforced at distribution level"},
    {"id": "AwsSolutions-APIG1", "reason": "API Gateway access logging is optional for development"},
    {"id": "AwsSolutions-APIG6", "reason": "CloudWatch logging is optional for development API"},
    {"id": "AwsSolutions-L1", "reason": "CDK internal Lambda functions use NODEJS_20_X runtime for compatibility"},
    {"id": "AwsSolutions-CFR1", "reason": "Geo restrictions not required for global news website"},
    {"id": "AwsSolutions-CFR2", "reason": "WAF integration not required for development environment"},
])

Aspects.of(app).add(AwsSolutionsChecks())
app.synth()