"""
Vercel Serverless Function Entry Point
"""
from .main import app

# For Vercel, we need to export a handler function
# Vercel's Python runtime will call this
def handler(event, context):
    """
    AWS Lambda handler format that Vercel expects
    """
    from mangum import Mangum
    asgi_handler = Mangum(app, lifespan="off")
    return asgi_handler(event, context)
