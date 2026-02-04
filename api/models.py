from pydantic import BaseModel, EmailStr, Field
from typing import Optional
from datetime import datetime
from enum import Enum


class WorkPreference(str, Enum):
    REMOTE = "Remote"
    HYBRID = "Hybrid"
    IN_PERSON = "In-person"
    NO_PREFERENCE = "No strong preference"


class SalaryRange(str, Enum):
    BELOW_50K = "Below $50,000"
    RANGE_50K_75K = "$50,000 - $75,000"
    RANGE_75K_100K = "$75,000 - $100,000"
    RANGE_100K_150K = "$100,000 - $150,000"
    ABOVE_150K = "$150,000+"
    FLEXIBLE = "I'm flexible"


class ParticipantCreate(BaseModel):
    email: EmailStr
    name: str = Field(..., min_length=1)
    zip_code: str = Field(..., pattern=r"^\d{5}$")
    position: str = Field(..., min_length=1)
    work_preference: WorkPreference
    salary_range: SalaryRange


class ParticipantResponse(BaseModel):
    id: str = Field(..., alias="_id")
    email: EmailStr
    name: str
    zip_code: str
    position: str
    work_preference: WorkPreference
    salary_range: SalaryRange
    created_at: datetime

    class Config:
        populate_by_name = True


class JobListing(BaseModel):
    company_description: str
    company_size: str
    compensation: str
    location: str
    dei_statement: str


class JobComparison(BaseModel):
    id: int
    job1: JobListing
    job2: JobListing


class ComparisonResponse(BaseModel):
    participant_id: str
    comparison_id: int
    selected_job: int = Field(..., ge=1, le=2)  # Must be 1 or 2
    job1: JobListing  # The first job listing shown
    job2: JobListing  # The second job listing shown


class ComparisonRecord(BaseModel):
    id: str = Field(..., alias="_id")
    participant_id: str
    comparison_id: int
    selected_job: int
    job1: JobListing  # The first job listing shown
    job2: JobListing  # The second job listing shown
    created_at: datetime

    class Config:
        populate_by_name = True


class Stats(BaseModel):
    total_participants: int
    total_responses: int
