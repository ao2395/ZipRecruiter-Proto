"""
Vercel Serverless Function Entry Point
This file is required for Vercel to detect and deploy the FastAPI app
"""
import sys
from pathlib import Path

# Add the api directory to the path so we can import modules
sys.path.insert(0, str(Path(__file__).parent))

from main import app
from mangum import Mangum

# Vercel serverless handler
handler = Mangum(app, lifespan="off")
