"""
Vercel Serverless Function Entry Point
This file is required for Vercel to detect and deploy the FastAPI app
"""
from .main import app
from mangum import Mangum

# Vercel serverless handler
handler = Mangum(app, lifespan="off")
