from mangum import Mangum
from .main import app

# Mangum wraps the FastAPI app for AWS Lambda/Vercel
# Use api_gateway_base_path to handle /api prefix
handler = Mangum(app, lifespan="off", api_gateway_base_path="/api")
