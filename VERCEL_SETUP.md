# Vercel Frontend Setup Guide

## ⚠️ IMPORTANT: Environment Variable Required

Your frontend **MUST** have the `VITE_API_URL` environment variable set in Vercel for it to work in production.

## 🔧 How to Set Environment Variable in Vercel

### Step 1: Go to Your Vercel Project
1. Open [Vercel Dashboard](https://vercel.com/dashboard)
2. Select your frontend project

### Step 2: Add Environment Variable
1. Go to **Settings** → **Environment Variables**
2. Click **Add New**
3. Add the following:
   - **Key:** `VITE_API_URL`
   - **Value:** `https://your-backend-url.vercel.app/api`
     - Replace `your-backend-url.vercel.app` with your actual backend Vercel URL
   - **Environment:** Select all (Production, Preview, Development)
4. Click **Save**

### Step 3: Redeploy
1. Go to **Deployments** tab
2. Click the **⋯** (three dots) on the latest deployment
3. Click **Redeploy**
4. Or push a new commit to trigger a redeploy

## 🔍 How to Find Your Backend URL

1. Go to your backend project in Vercel
2. Copy the deployment URL (e.g., `https://ethara-backend.vercel.app`)
3. Add `/api` at the end: `https://ethara-backend.vercel.app/api`
4. This is what you set as `VITE_API_URL`

## ✅ Verification

After setting the environment variable and redeploying:

1. Open your frontend URL in browser
2. Open browser console (F12)
3. You should see: `🔗 API Base URL: https://your-backend-url.vercel.app/api`
4. If you see `NOT SET`, the environment variable is not configured correctly

## 🐛 Troubleshooting

### Issue: Still seeing localhost URL
**Solution:** 
- Make sure you redeployed after adding the environment variable
- Check that the variable name is exactly `VITE_API_URL` (case-sensitive)
- Verify it's set for the correct environment (Production)

### Issue: Network Error in console
**Solution:**
- Verify your backend URL is correct
- Check that backend is deployed and running
- Test backend health: `https://your-backend-url.vercel.app/api/health`
- Check CORS settings on backend

### Issue: CORS errors
**Solution:**
- Backend CORS is configured to allow all origins
- If still having issues, check `backend/app.js` CORS configuration

## 📝 Quick Checklist

- [ ] Backend is deployed to Vercel
- [ ] Backend URL is known (e.g., `https://ethara-backend.vercel.app`)
- [ ] `VITE_API_URL` is set in Vercel frontend project
- [ ] Value is: `https://your-backend-url.vercel.app/api` (with /api at end)
- [ ] Frontend is redeployed after adding environment variable
- [ ] Browser console shows correct API URL (not localhost)
- [ ] Backend health check works: `/api/health`

## 🎯 Example Configuration

**Backend URL:** `https://ethara-backend.vercel.app`

**Environment Variable:**
```
VITE_API_URL=https://ethara-backend.vercel.app/api
```

**Note:** Always include `/api` at the end of the backend URL!
