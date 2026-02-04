# ZipRecruiter Experiment API

FastAPI backend for the ZipRecruiter MS Experiment.

## Setup

1. Install Poetry if you haven't:
```bash
curl -sSL https://install.python-poetry.org | python3 -
```

2. Install dependencies:
```bash
poetry install
```

3. Create `.env` file (copy from `.env.example`):
```bash
cp .env.example .env
```

4. Update `.env` with your MongoDB connection string

## Running

```bash
poetry run uvicorn main:app --reload --port 8000
```

The API will be available at `http://localhost:8000`

## API Documentation

Once running, visit:
- Swagger UI: `http://localhost:8000/docs`
- ReDoc: `http://localhost:8000/redoc`

## Endpoints

- `POST /participants` - Create new participant
- `GET /comparisons/{participant_id}` - Get job comparisons
- `POST /responses` - Submit comparison response
- `GET /participants/{participant_id}/responses` - Get participant responses
- `GET /stats` - Get experiment statistics
