#!/usr/bin/env python
import os
from dotenv import load_dotenv
from aws_cdk import App
from infrastructure.news_stack import NewsStack

load_dotenv()

account = os.getenv("AWS_ACCOUNT")
region = os.getenv("AWS_REGION", "us-east-1")

if not account:
    raise ValueError("AWS_ACCOUNT environment variable is required. Set it in .env file.")

app = App()
NewsStack(app, "NewsStack", env={
    "account": account,
    "region": region
})
app.synth()