from mangum import Mangum
from .main import app

# Mangum wraps the FastAPI app for AWS Lambda/Vercel  
# Strip /api prefix since Vercel routes /api/* to this function
_mangum_handler = Mangum(app, lifespan="off")

def handler(event, context):
    # Log the path for debugging
    print(f"Request path: {event.get('rawPath', event.get('path', 'unknown'))}")
    
    # Strip /api prefix if present
    if 'rawPath' in event and event['rawPath'].startswith('/api'):
        event['rawPath'] = event['rawPath'][4:] or '/'
    if 'path' in event and event['path'].startswith('/api'):
        event['path'] = event['path'][4:] or '/'
    
    return _mangum_handler(event, context)
