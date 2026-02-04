from motor.motor_asyncio import AsyncIOMotorClient, AsyncIOMotorDatabase
from pydantic_settings import BaseSettings
from typing import Optional
import os
from dotenv import load_dotenv

load_dotenv()


class Settings(BaseSettings):
    mongodb_url: str = os.getenv("MONGODB_URL", "mongodb://localhost:27017")
    database_name: str = os.getenv("DATABASE_NAME", "ziprecruiter_experiment")
    frontend_url: str = os.getenv("FRONTEND_URL", "http://localhost:3000")


settings = Settings()


class Database:
    client: Optional[AsyncIOMotorClient] = None
    db: Optional[AsyncIOMotorDatabase] = None


db = Database()


async def connect_to_mongo():
    """Connect to MongoDB"""
    print(f"Connecting to MongoDB at {settings.mongodb_url}")
    db.client = AsyncIOMotorClient(settings.mongodb_url)
    db.db = db.client[settings.database_name]
    print(f"Connected to database: {settings.database_name}")


async def close_mongo_connection():
    """Close MongoDB connection"""
    if db.client:
        db.client.close()
        print("Closed MongoDB connection")


def get_database() -> AsyncIOMotorDatabase:
    """Get database instance"""
    if db.db is None:
        raise Exception("Database not initialized")
    return db.db
