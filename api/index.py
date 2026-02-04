"""
Vercel Serverless Function Entry Point
This file is required for Vercel to detect and deploy the FastAPI app
"""
from mangum import Mangum
from .main import app

# Create the Mangum handler for Vercel
handler = Mangum(app, lifespan="off")

# Make sure it's the default export
__all__ = ["handler"]
