// TypeScript types matching the FastAPI backend models

export enum WorkPreference {
  REMOTE = "Remote",
  HYBRID = "Hybrid",
  IN_PERSON = "In-person",
  NO_PREFERENCE = "No strong preference",
}

export enum SalaryRange {
  BELOW_50K = "Below $50,000",
  RANGE_50K_75K = "$50,000 - $75,000",
  RANGE_75K_100K = "$75,000 - $100,000",
  RANGE_100K_150K = "$100,000 - $150,000",
  ABOVE_150K = "$150,000+",
  FLEXIBLE = "I'm flexible",
}

export interface ParticipantCreate {
  email: string;
  name: string;
  zip_code: string;
  position: string;
  work_preference: WorkPreference;
  salary_range: SalaryRange;
}

export interface ParticipantResponse {
  _id: string;
  email: string;
  name: string;
  zip_code: string;
  position: string;
  work_preference: WorkPreference;
  salary_range: SalaryRange;
  created_at: string;
}

export interface JobListing {
  company_description: string;
  company_size: string;
  compensation: string;
  location: string;
  dei_statement: string;
}

export interface JobComparison {
  id: number;
  job1: JobListing;
  job2: JobListing;
}

export interface ComparisonResponse {
  participant_id: string;
  comparison_id: number;
  selected_job: 1 | 2;
  job1: JobListing;  // The first job listing shown
  job2: JobListing;  // The second job listing shown
}

export interface ComparisonRecord {
  _id: string;
  participant_id: string;
  comparison_id: number;
  selected_job: number;
  job1: JobListing;  // The first job listing shown
  job2: JobListing;  // The second job listing shown
  created_at: string;
}

export interface Stats {
  total_participants: number;
  total_responses: number;
}

export interface CreateParticipantResponse {
  participant_id: string;
  message: string;
}
