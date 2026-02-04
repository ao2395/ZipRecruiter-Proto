# Deploy to Vercel - Full Stack (Frontend + Backend)

## ✅ What I've Set Up

1. **requirements.txt** - Python dependencies (replaces Poetry for Vercel)
2. **vercel.json** - Configuration for serverless Python backend
3. **mangum** - Adapter to run FastAPI on Vercel serverless
4. **Updated main.py** - Added Mangum handler for Vercel

## 🚀 Deployment Steps

### 1. Push to GitHub
```bash
git add .
git commit -m "Setup for Vercel deployment"
git push
```

### 2. Deploy to Vercel
1. Go to https://vercel.com
2. Import your GitHub repository
3. Vercel will auto-detect Next.js

### 3. Add Environment Variables in Vercel Dashboard
Go to **Settings → Environment Variables** and add:

**Required:**
- `MONGODB_URL` = `your-mongodb-atlas-connection-string`
- `DATABASE_NAME` = `ziprecruiter_experiment`
- `FRONTEND_URL` = `https://your-app.vercel.app` (or `*` for development)

**Optional:**
- `NEXT_PUBLIC_API_URL` = leave empty (uses rewrites)

### 4. Deploy
Click **Deploy** and Vercel will:
- Build your Next.js frontend
- Deploy your FastAPI backend as serverless functions
- Both will be accessible on the same domain!

## 🔗 URLs After Deployment

- **Frontend**: `https://your-app.vercel.app`
- **Backend API**: `https://your-app.vercel.app/api/`
- **API Docs**: `https://your-app.vercel.app/api/docs`

## 🧪 Local Development (No Changes)

```bash
# Option 1: Run both with one command
npm run dev:all

# Option 2: Run separately
npm run api  # Terminal 1
npm run dev  # Terminal 2
```

## ⚠️ Important Notes

1. **MongoDB Atlas Required**: Vercel serverless functions need a cloud database
   - Free tier available at https://www.mongodb.com/atlas
   
2. **CORS**: Make sure `FRONTEND_URL` matches your Vercel domain

3. **Cold Starts**: First API request may be slow (serverless warmup)

## 🐛 Troubleshooting

**API routes not working?**
- Check Environment Variables in Vercel dashboard
- Look at Function Logs in Vercel dashboard

**MongoDB connection failed?**
- Verify `MONGODB_URL` is set correctly
- Check MongoDB Atlas allows connections from anywhere (0.0.0.0/0)

**Build failed?**
- Check build logs in Vercel
- Ensure all dependencies are in `requirements.txt`
