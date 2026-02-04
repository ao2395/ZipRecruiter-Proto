from fastapi import FastAPI, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
from datetime import datetime
from bson import ObjectId
from mangum import Mangum

try:
    # Relative imports for Vercel
    from .database import connect_to_mongo, close_mongo_connection, get_database, settings
    from .models import (
        ParticipantCreate,
        ParticipantResponse,
        JobComparison,
        ComparisonResponse,
        ComparisonRecord,
        Stats
    )
    from .job_generator import generate_job_comparisons
except ImportError:
    # Absolute imports for local development
    from database import connect_to_mongo, close_mongo_connection, get_database, settings
    from models import (
        ParticipantCreate,
        ParticipantResponse,
        JobComparison,
        ComparisonResponse,
        ComparisonRecord,
        Stats
    )
    from job_generator import generate_job_comparisons


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup
    await connect_to_mongo()
    yield
    # Shutdown
    await close_mongo_connection()


app = FastAPI(
    title="ZipRecruiter Experiment API",
    version="1.0.0",
    lifespan=lifespan
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all origins for Vercel
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
async def root():
    """Health check endpoint"""
    return {
        "message": "ZipRecruiter Experiment API",
        "status": "running",
        "version": "1.0.0"
    }


@app.post("/participants", response_model=dict, status_code=status.HTTP_201_CREATED)
async def create_participant(participant: ParticipantCreate):
    """Create a new participant"""
    db = get_database()

    # Check if email already exists
    existing = await db.participants.find_one({"email": participant.email})
    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered"
        )

    # Create participant document
    participant_dict = participant.model_dump()
    participant_dict["created_at"] = datetime.utcnow()

    result = await db.participants.insert_one(participant_dict)

    return {
        "participant_id": str(result.inserted_id),
        "message": "Participant created successfully"
    }


@app.get("/comparisons/{participant_id}", response_model=list[JobComparison])
async def get_comparisons(participant_id: str, count: int = 5):
    """Generate job comparisons for a participant"""
    db = get_database()

    # Verify participant exists
    try:
        participant = await db.participants.find_one({"_id": ObjectId(participant_id)})
    except Exception:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid participant ID format"
        )

    if not participant:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Participant not found"
        )

    # Generate comparisons
    comparisons = generate_job_comparisons(participant_id, count)

    return comparisons


@app.post("/responses", status_code=status.HTTP_201_CREATED)
async def submit_response(response: ComparisonResponse):
    """Submit a comparison response"""
    db = get_database()

    # Verify participant exists
    try:
        participant = await db.participants.find_one({"_id": ObjectId(response.participant_id)})
    except Exception:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid participant ID format"
        )

    if not participant:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Participant not found"
        )

    # Create response document
    response_dict = response.model_dump()
    response_dict["created_at"] = datetime.utcnow()

    await db.responses.insert_one(response_dict)

    return {"message": "Response recorded successfully"}


@app.get("/participants/{participant_id}/responses", response_model=list[ComparisonRecord])
async def get_participant_responses(participant_id: str):
    """Get all responses for a participant"""
    db = get_database()

    # Verify participant exists
    try:
        participant = await db.participants.find_one({"_id": ObjectId(participant_id)})
    except Exception:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid participant ID format"
        )

    if not participant:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Participant not found"
        )

    # Get responses
    cursor = db.responses.find({"participant_id": participant_id}).sort("comparison_id", 1)
    responses = []

    async for doc in cursor:
        doc["_id"] = str(doc["_id"])
        responses.append(ComparisonRecord(**doc))

    return responses


@app.get("/stats", response_model=Stats)
async def get_stats():
    """Get experiment statistics"""
    db = get_database()

    total_participants = await db.participants.count_documents({})
    total_responses = await db.responses.count_documents({})

    return Stats(
        total_participants=total_participants,
        total_responses=total_responses
    )


# Vercel serverless handler
handler = Mangum(app, lifespan="off")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000, reload=True)
