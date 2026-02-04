from fastapi import FastAPI
from mangum import Mangum
from .main import app as original_app

# Create a new app that mounts the original at /api
app = FastAPI()
app.mount("/api", original_app)

# Mangum wraps the FastAPI app for AWS Lambda/Vercel
handler = Mangum(app, lifespan="off")
