# ZipRecruiter Experiment Webapp

A web application implementing the ZipRecruiter MS Experiment Design for studying job seeker preferences through binary job comparisons.

## Architecture

- **Frontend**: Next.js 16 with TypeScript, React 19, shadcn/ui components
- **Backend**: FastAPI (Python) with MongoDB
- **State Management**: Zustand
- **Styling**: Tailwind CSS

## Prerequisites

- Node.js 20+ and npm
- Python 3.11+
- Poetry (Python package manager)
- MongoDB (local or cloud)

## Project Structure

```
ziprecruiter-proto/
├── api/                    # FastAPI backend
│   ├── main.py            # API endpoints
│   ├── models.py          # Pydantic models
│   ├── database.py        # MongoDB connection
│   ├── job_generator.py   # Job listing generation
│   ├── pyproject.toml     # Python dependencies
│   └── .env               # Environment variables (create from .env.example)
├── app/                    # Next.js pages
│   ├── page.tsx           # Landing page (Step 1)
│   ├── experiment/        # Experiment flow
│   │   ├── page.tsx       # Steps 2-3 (Questionnaire & Comparisons)
│   │   └── complete/      # Step 4 (Thank you page)
│   └── layout.tsx         # Root layout
├── components/
│   ├── ui/                # shadcn/ui components
│   └── experiment/        # Experiment-specific components
│       ├── QuestionnaireForm.tsx
│       ├── JobComparisonCard.tsx
│       └── ProgressIndicator.tsx
├── lib/
│   ├── api.ts             # Frontend API client
│   ├── types.ts           # TypeScript type definitions
│   ├── experimentStore.ts # Zustand state management
│   └── utils.ts           # Utility functions
└── next.config.ts         # Next.js config (API proxy)
```

## Setup Instructions

### 1. Backend Setup (FastAPI)

```bash
# Navigate to api directory
cd api

# Install Poetry if not already installed
curl -sSL https://install.python-poetry.org | python3 -

# Install dependencies
poetry install

# Create .env file from example
cp .env.example .env

# Edit .env and add your MongoDB connection string
# Example:
# MONGODB_URL=mongodb://localhost:27017
# DATABASE_NAME=ziprecruiter_experiment
# FRONTEND_URL=http://localhost:3000
```

### 2. Frontend Setup (Next.js)

```bash
# From project root (ziprecruiter-proto/)
npm install
```

### 3. MongoDB Setup

Option A: Local MongoDB
```bash
# Install MongoDB (macOS with Homebrew)
brew tap mongodb/brew
brew install mongodb-community

# Start MongoDB
brew services start mongodb-community
```

Option B: MongoDB Atlas (Cloud)
1. Create a free account at [mongodb.com/atlas](https://www.mongodb.com/atlas)
2. Create a cluster
3. Get connection string and add to `api/.env`

## Running the Application

You need to run **two separate processes**:

### Terminal 1: FastAPI Backend

```bash
cd api
poetry run uvicorn main:app --reload --port 8000
```

The API will be available at `http://localhost:8000`
- API Docs: `http://localhost:8000/docs`
- ReDoc: `http://localhost:8000/redoc`

### Terminal 2: Next.js Frontend

```bash
# From project root
npm run dev
```

The frontend will be available at `http://localhost:3000`

## How It Works

### API Proxy

Next.js automatically proxies requests from `/api/*` to the FastAPI backend (`http://localhost:8000/*`) via the configuration in `next.config.ts`.

This means:
- Frontend calls `/api/participants`
- Next.js proxies it to `http://localhost:8000/participants`
- FastAPI handles the request and returns JSON
- Frontend receives the response

### Experiment Flow

1. **Step 1**: Landing page with invitation text
2. **Step 2**: Questionnaire collecting:
   - Email
   - Name
   - ZIP code
   - Desired position
   - Work preference (Remote/Hybrid/In-person/No preference)
   - Salary range
3. **Step 3**: Binary job comparisons (5 comparisons)
   - Each comparison shows two job listings side-by-side
   - User selects preferred option
   - Choices are submitted to API
4. **Step 4**: Thank you message

### Data Flow

1. User submits questionnaire → API creates participant record → Returns participant_id
2. Frontend fetches job comparisons using participant_id → API generates deterministic job pairs
3. User selects jobs → Frontend submits each response to API → Stored in MongoDB
4. All comparisons completed → Redirect to thank you page

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/` | Health check |
| POST | `/participants` | Create new participant |
| GET | `/comparisons/{participant_id}` | Get job comparisons |
| POST | `/responses` | Submit comparison response |
| GET | `/participants/{participant_id}/responses` | Get participant responses |
| GET | `/stats` | Get experiment statistics |

## Development

### Adding shadcn/ui Components

```bash
npx shadcn@latest add <component-name>
```

Example:
```bash
npx shadcn@latest add dialog
```

### Database Collections

**participants**
```json
{
  "_id": ObjectId,
  "email": "user@example.com",
  "name": "John Doe",
  "zip_code": "12345",
  "position": "Software Engineer",
  "work_preference": "Remote",
  "salary_range": "$100,000 - $150,000",
  "created_at": "2024-01-01T00:00:00Z"
}
```

**responses**
```json
{
  "_id": ObjectId,
  "participant_id": "participant_object_id",
  "comparison_id": 0,
  "selected_job": 1,  // 1 or 2
  "created_at": "2024-01-01T00:00:00Z"
}
```

## Troubleshooting

### CORS Errors
- Ensure FastAPI is running on port 8000
- Check `FRONTEND_URL` in `api/.env` matches your frontend URL
- Verify CORS middleware in `api/main.py`

### MongoDB Connection Issues
- Check MongoDB is running: `brew services list` (macOS)
- Verify connection string in `api/.env`
- Test connection: `mongosh` (opens MongoDB shell)

### API Proxy Not Working
- Ensure both servers are running
- Check `next.config.ts` proxy configuration
- Restart Next.js dev server after config changes

### Type Errors
- Ensure types in `lib/types.ts` match `api/models.py`
- Run `npm run build` to check for TypeScript errors

## Testing

### Manual Testing Flow

1. Visit `http://localhost:3000`
2. Click "Try it now"
3. Fill out questionnaire with valid data
4. Complete all 5 job comparisons
5. Verify thank you page appears

### Check Data in MongoDB

```bash
mongosh

use ziprecruiter_experiment

# View all participants
db.participants.find().pretty()

# View all responses
db.responses.find().pretty()

# Get stats
db.participants.countDocuments()
db.responses.countDocuments()
```

### API Testing

Visit `http://localhost:8000/docs` for interactive API documentation where you can test endpoints directly.

## Production Deployment

### Backend (FastAPI)

Deploy to:
- **Render**: `render.yaml` config needed
- **Railway**: Automatic Python detection
- **Fly.io**: `fly.toml` config needed
- **AWS Lambda**: Use Mangum adapter

Environment variables needed:
- `MONGODB_URL`
- `DATABASE_NAME`
- `FRONTEND_URL` (production frontend URL)

### Frontend (Next.js)

Deploy to:
- **Vercel**: Automatic Next.js detection
- **Netlify**: Add build command
- **AWS Amplify**: Connect GitHub repo

Update `next.config.ts` rewrite destination to production API URL.

Environment variables needed:
- `NEXT_PUBLIC_API_URL` (if not using proxy)

## License

MIT

## Support

For issues or questions, please open an issue on GitHub.
