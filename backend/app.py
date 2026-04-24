#!/usr/bin/env python
import os
from dotenv import load_dotenv
from aws_cdk import App
from infrastructure.frecuencia_colectiva_stack import FrecuenciaColectivaStack

load_dotenv()

account = os.getenv("AWS_ACCOUNT")
region = os.getenv("AWS_REGION", "us-east-1")
stack_suffix = os.getenv("STACK_SUFFIX", "")

if not account:
    raise ValueError("AWS_ACCOUNT environment variable is required. Set it in .env file.")

app = App()
FrecuenciaColectivaStack(app, f"FrecuenciaColectivaStack{stack_suffix}", env={
    "account": account,
    "region": region
})
app.synth()