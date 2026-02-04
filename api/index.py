from .main import app
from starlette.types import ASGIApp, Receive, Scope, Send

# Export app for Vercel's ASGI support
# Vercel recognizes 'app' as the ASGI application
__all__ = ['app']
