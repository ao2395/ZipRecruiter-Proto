# 🚀 Deploy Full Stack to Vercel

## ✅ Setup Complete

Your app is configured to run **both frontend and backend on Vercel** using:
- Next.js for frontend
- FastAPI as serverless functions for backend
- Mangum adapter to convert FastAPI to ASGI/Lambda format

## 📋 Deploy Steps

### 1. Push to GitHub
```bash
git add .
git commit -m "Ready for Vercel deployment"
git push
```

### 2. Import to Vercel
1. Go to https://vercel.com
2. Click "Add New Project"
3. Import your GitHub repository
4. Vercel will auto-detect Next.js ✅

### 3. Configure Environment Variables

In Vercel Dashboard → Settings → Environment Variables, add:

**Required:**
- `MONGODB_URL` = `mongodb+srv://username:password@cluster.mongodb.net/`
- `DATABASE_NAME` = `ziprecruiter_experiment`
- `FRONTEND_URL` = `*` (or your Vercel domain)

**Optional:**
- Leave `NEXT_PUBLIC_API_URL` empty (uses rewrites)

### 4. Deploy! 🎉

Click "Deploy" - Vercel will:
✅ Build Next.js frontend
✅ Deploy FastAPI backend as serverless functions
✅ Both accessible on same domain!

## 🌐 After Deployment

Your app will be live at: `https://your-app.vercel.app`

- Frontend: `https://your-app.vercel.app`
- Backend API: `https://your-app.vercel.app/api/`
- API Docs: `https://your-app.vercel.app/api/docs`

## 🧪 Test Locally First

```bash
# Run both frontend and backend
npm run dev:all

# Test at:
# - Frontend: http://localhost:3000
# - Backend: http://localhost:8000
```

## ⚠️ Important Notes

1. **MongoDB Atlas Required**
   - Vercel needs a cloud database (not local MongoDB)
   - Free tier: https://www.mongodb.com/atlas
   - Whitelist all IPs: `0.0.0.0/0`

2. **Cold Starts**
   - First API request may take 2-3 seconds (serverless warmup)
   - Subsequent requests are fast

3. **Serverless Limitations**
   - Max execution: 10 seconds (free tier), 60 seconds (pro)
   - Connections close after each request
   - That's why we use lazy MongoDB connections

## 🐛 Troubleshooting

**Build Failed?**
- Check Vercel build logs
- Ensure `requirements.txt` has all Python dependencies

**API 500 Errors?**
- Check Function Logs in Vercel dashboard
- Verify `MONGODB_URL` environment variable
- Make sure MongoDB Atlas allows connections from `0.0.0.0/0`

**CORS Issues?**
- Update `FRONTEND_URL` environment variable
- Or use `*` to allow all origins

**Can't find API routes?**
- API routes are at `/api/*` not `/`
- Check `vercel.json` routing configuration

## 📝 Files Changed

- `requirements.txt` - Python dependencies for Vercel
- `vercel.json` - Vercel configuration for serverless Python
- `api/main.py` - Added Mangum handler, changed CORS
- `api/database.py` - Lazy connection for serverless
- `package.json` - Dev scripts for local development

## 🎯 Next Steps

1. Deploy to Vercel
2. Test your experiment flow
3. Share the link with participants!

Enjoy your full-stack deployment! 🚀
