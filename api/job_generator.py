import random
from models import JobListing


COMPANY_DESCRIPTIONS = {
    "tech": "A technology company that develops software solutions to help organizations manage processes more efficiently and scale their operations.",
    "business": "A business services firm that provides operational and advisory solutions to help organizations improve performance and manage complex projects."
}

COMPANY_SIZES = [
    "50-100 employees",
    "100-500 employees",
    "500+ employees"
]

COMPENSATION_LEVELS = [
    "Market aligned",
    "Competitive for the market"
]

LOCATIONS = [
    "Remote",
    "Mostly in-office"
]

DEI_STATEMENTS = {
    "current": "In the company's most recent annual public filing (10-K), it states: We are committed to fostering a diverse and inclusive workplace where all employees feel valued and respected.",
    "removed": "In prior annual public filings (10-K), the company stated: We are committed to fostering a diverse and inclusive workplace. This language does not appear in the company's most recent filing.",
    "none": "No additional information provided."
}


def generate_job_listing(seed: int) -> JobListing:
    """
    Generate a deterministic job listing based on a seed value.
    Same seed always produces the same job listing.
    """
    random.seed(seed)

    return JobListing(
        company_description=random.choice(list(COMPANY_DESCRIPTIONS.values())),
        company_size=random.choice(COMPANY_SIZES),
        compensation=random.choice(COMPENSATION_LEVELS),
        location=random.choice(LOCATIONS),
        dei_statement=random.choice(list(DEI_STATEMENTS.values()))
    )


def generate_job_comparisons(participant_id: str, count: int = 5) -> list[dict]:
    """
    Generate a list of job comparison pairs for a participant.
    Results are deterministic based on participant_id.
    """
    # Convert participant_id to a base seed
    base_seed = hash(participant_id) % 1000000

    comparisons = []
    for i in range(count):
        job1 = generate_job_listing(base_seed + i * 2)
        job2 = generate_job_listing(base_seed + i * 2 + 1)

        comparisons.append({
            "id": i,
            "job1": job1.model_dump(),
            "job2": job2.model_dump()
        })

    return comparisons
