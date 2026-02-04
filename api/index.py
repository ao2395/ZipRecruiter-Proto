"""
Vercel Serverless Function Entry Point
This file is required for Vercel to detect and deploy the FastAPI app
"""
from main import handler

# Vercel will call this
app = handler
