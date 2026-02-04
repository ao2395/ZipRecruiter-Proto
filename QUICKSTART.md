# Quick Start Guide

## First Time Setup (5 minutes)

### 1. Install Backend Dependencies

```bash
cd api
poetry install
cp .env.example .env
# Edit .env with your MongoDB connection string
cd ..
```

### 2. Install Frontend Dependencies

```bash
npm install
```

### 3. Start MongoDB

**Local MongoDB:**
```bash
brew services start mongodb-community
```

**Or use MongoDB Atlas (cloud)** - add connection string to `api/.env`

## Running the App

### Option 1: Two Terminals (Recommended)

**Terminal 1 - Backend:**
```bash
cd api && poetry run uvicorn main:app --reload --port 8000
```

**Terminal 2 - Frontend:**
```bash
npm run dev
```

### Option 2: Single Command (requires tmux or screen)

Create a file `start.sh`:
```bash
#!/bin/bash
cd api && poetry run uvicorn main:app --reload --port 8000 &
npm run dev
```

Then run:
```bash
chmod +x start.sh
./start.sh
```

## Access the Application

- **Frontend**: http://localhost:3000
- **Backend API Docs**: http://localhost:8000/docs
- **Backend Health**: http://localhost:8000

## Test the Flow

1. Go to http://localhost:3000
2. Click "Try it now"
3. Fill out the questionnaire (use a test email)
4. Complete all 5 job comparisons
5. See the thank you page

## View Data in MongoDB

```bash
mongosh
use ziprecruiter_experiment
db.participants.find().pretty()
db.responses.find().pretty()
```

## Stop the Application

- Press `Ctrl+C` in both terminals
- Stop MongoDB: `brew services stop mongodb-community` (if using local)

## Troubleshooting

**Port already in use?**
```bash
# Kill process on port 8000
lsof -ti:8000 | xargs kill -9

# Kill process on port 3000
lsof -ti:3000 | xargs kill -9
```

**MongoDB not connecting?**
- Check MongoDB is running: `brew services list`
- Verify `.env` file in `api/` directory
- Test connection: `mongosh`

**API calls failing?**
- Ensure both servers are running
- Check browser console for errors
- Visit http://localhost:8000/docs to test API directly

## What's Next?

- Read full [README.md](README.md) for detailed documentation
- Modify job attributes in `api/job_generator.py`
- Customize UI in `components/experiment/`
- Add more shadcn components: `npx shadcn@latest add <component>`
