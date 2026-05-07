# 🚀 AI-MedLab Complete Deployment Guide

**Project:** AI-MedLab - Healthcare Management Platform  
**Components:** Frontend (React), Backend (Flask), ML Models (Python), Database (MongoDB)

---

## 📋 Pre-Deployment Checklist

Before starting, ensure you have:

- [ ] GitHub account with your code pushed
- [ ] MongoDB Atlas free account
- [ ] Firebase project
- [ ] Stripe account
- [ ] Groq API account (free)
- [ ] Vercel account (for hosting)
- [ ] All services created and API keys ready
- [ ] No sensitive data in repository
- [ ] `.gitignore` has `.env` files

---

## ⏱️ TOTAL DEPLOYMENT TIME: ~2-3 hours

---

# PART 1: EXTERNAL SERVICES SETUP

## Step 1️⃣ MongoDB Atlas (Database) - 15 minutes

### 1.1 Create MongoDB Account
```
Go to: https://www.mongodb.com/cloud/atlas
Click: "Start Free"
Sign up with email/Google
```

### 1.2 Create Cluster
```
1. Click "Create" button
2. Choose "Free" tier
3. Select your nearest region
4. Cluster name: ai-medlab-cluster
5. Click "Create Cluster" (wait 3-5 minutes)
```

### 1.3 Create Database User
```
1. Go to "Database Access" in left menu
2. Click "Add New User"
3. Username: MongoUser
4. Password: Create strong password (SAVE THIS!)
5. Click "Add User"
```

### 1.4 Allow Network Access
```
1. Go to "Network Access" in left menu
2. Click "Add IP Address"
3. Choose: "Allow Access from Anywhere" (0.0.0.0/0)
4. Click "Confirm"
```

### 1.5 Get Connection String
```
1. Click "Databases" in left menu
2. Click "Connect" button
3. Choose "Connect your application"
4. Copy the connection string
5. Replace <username> with: MongoUser
6. Replace <password> with your password
7. Remove ?retryWrites=true&w=majority
```

**Your MongoDB URL should look like:**
```
mongodb+srv://MongoUser:YourPassword123@ai-medlab-cluster.mongodb.net/
```

✅ **SAVE THIS URL** - You'll need it for backend `.env`

---

## Step 2️⃣ Firebase (Google Authentication) - 15 minutes

### 2.1 Create Firebase Project
```
Go to: https://console.firebase.google.com/
Click: "Add Project"
Project name: AI-MedLab
Continue through setup
Enable Google Analytics (optional)
Click: "Create Project"
```

### 2.2 Enable Google Sign-In
```
1. Go to "Authentication" (left sidebar)
2. Click "Get Started"
3. Click "Google" provider
4. Toggle: "Enable"
5. Add project support email
6. Click "Save"
```

### 2.3 Get Firebase Config
```
1. Click gear icon (Settings) top right
2. Click "Project settings"
3. Scroll down to "Your apps"
4. Click web app icon (</> )
5. Copy the config object
6. Should contain: apiKey, projectId, appId, etc.
```

**Your Firebase config should look like:**
```
{
  apiKey: "AIzaSyD...",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abc123def456"
}
```

✅ **SAVE THIS CONFIG** - You'll need it for frontend `.env`

---

## Step 3️⃣ Stripe (Payment Processing) - 10 minutes

### 3.1 Create Stripe Account
```
Go to: https://dashboard.stripe.com/register
Sign up with email
Complete KYC verification (provide business details)
```

### 3.2 Get API Keys
```
1. Click "Developers" (top right)
2. Click "API Keys"
3. You'll see two keys:
   - Publishable Key (pk_test_... or pk_live_...)
   - Secret Key (sk_test_... or sk_live_...)
4. Copy both
```

✅ **SAVE BOTH KEYS**
- Publishable Key → frontend `.env`
- Secret Key → backend `.env`

---

## Step 4️⃣ Groq API (Chatbot) - 5 minutes

### 4.1 Create Groq Account
```
Go to: https://console.groq.com/
Sign up with email/GitHub
Verify email
```

### 4.2 Create API Key
```
1. Click "Keys" in left sidebar
2. Click "Create New API Key"
3. Name: AI-MedLab
4. Copy the key (starts with gsk_...)
```

✅ **SAVE THIS KEY** - You'll need it for frontend `.env`

---

## Step 5️⃣ Email Service (Gmail) - 5 minutes

### 5.1 Enable Gmail App Password
```
1. Go to: https://myaccount.google.com/apppasswords
   (Requires 2-Factor Authentication enabled)
2. Select: Mail
3. Select: Windows Computer
4. Generate password (you'll get 16 characters)
5. Copy the password
```

✅ **SAVE THIS PASSWORD** - You'll need it for backend `.env`

---

# PART 2: ENVIRONMENT VARIABLES

## Step 6️⃣ Backend Environment Setup

### 6.1 Create `.env` file in backend folder

**File location:** `backend/.env`

```env
# ============== DATABASE ==============
DBURL=mongodb+srv://MongoUser:YourPassword123@ai-medlab-cluster.mongodb.net/

# ============== EMAIL (Gmail) ==============
HOST_EMAIL=your_email@gmail.com
PASSWORD=your_16_char_app_password
PORT=587

# ============== STRIPE ==============
STRIPE_SECRET_KEY=sk_test_123456789... (your Stripe secret key)

# ============== JWT SECRET ==============
SECRET=your_random_secret_key_12345

# ============== DOMAIN ==============
DOMAIN=http://localhost:5000
# After deployment: DOMAIN=https://your-backend-domain.com

# ============== OPTIONAL ==============
WHATSAPP=your_whatsapp_token (optional)
```

### 6.2 Verify `.gitignore` has `.env`

Open `backend/.gitignore` and add if missing:
```
.env
```

✅ **Never commit `.env` to Git!**

---

## Step 7️⃣ Frontend Environment Setup

### 7.1 Create `.env` file in frontend folder

**File location:** `frontend/.env`

```env
# ============== BACKEND API ==============
VITE_BACKEND_URL=http://localhost:5000
# After deployment: VITE_BACKEND_URL=https://your-backend-domain.com

# ============== ML MODELS ==============
VITE_MODEL_URL=http://localhost:5002
# After deployment: VITE_MODEL_URL=https://your-models-domain.com

# ============== STRIPE ==============
VITE_PUBLICATION_KEY=pk_test_123456789... (your Stripe publishable key)

# ============== FIREBASE ==============
VITE_FIREBASE_API_KEY=AIzaSyD...
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=1:123456789:web:abc123def456

# ============== GROQ CHATBOT ==============
VITE_GROQ_API_KEY=gsk_... (your Groq API key)

# ============== JITSI VIDEO CALLS ==============
VITE_JAAS_APP_ID=your_jitsi_app_id

# ============== CLOUDINARY (Image uploads) ==============
VITE_CLOUDINARY_NAME=your_cloudinary_name
VITE_CLOUDINARY_UPLOAD_PRESET=your_upload_preset
```

### 7.2 Verify `.gitignore` has `.env`

Open `frontend/.gitignore` and add if missing:
```
.env
```

✅ **Never commit `.env` to Git!**

---

# PART 3: DEPLOY TO VERCEL

## Step 8️⃣ Push Code to GitHub

```bash
# Open terminal in project root (c:\Users\dell\Downloads\AI-MedLab)

# Initialize Git (if not already done)
git init

# Add all files
git add .

# Commit
git commit -m "Ready for production deployment"

# Push to GitHub
git push origin main
```

---

## Step 9️⃣ Deploy Backend to Vercel

### 9.1 Create Vercel Account
```
Go to: https://vercel.com/
Sign up with GitHub
Authorize Vercel to access your repositories
```

### 9.2 Import Backend Project
```
1. Go to Vercel Dashboard
2. Click "Add New..." → "Project"
3. Select your AI-MedLab repository
4. Click "Import"
```

### 9.3 Configure Backend
```
1. Root Directory: Select "backend"
2. Framework: Select "Other"
3. Build Command: (leave empty or use below)
   npm install -g gunicorn && pip install -r requirements.txt
4. Output Directory: (leave empty)
5. Environment Variables: Click "Add"
```

### 9.4 Add Environment Variables

**Add these variables to Vercel (from your backend/.env):**

```
DBURL=mongodb+srv://MongoUser:...
HOST_EMAIL=your_email@gmail.com
PASSWORD=your_app_password
STRIPE_SECRET_KEY=sk_test_...
SECRET=your_random_key
DOMAIN=(will update after deployment)
WHATSAPP=(optional)
```

### 9.5 Deploy
```
1. Click "Deploy"
2. Wait for deployment (2-5 minutes)
3. You'll get URL like: https://ai-medlab-backend.vercel.app
4. SAVE THIS URL
```

### 9.6 Update DOMAIN Variable
```
1. Go to Settings → Environment Variables
2. Find "DOMAIN"
3. Change value to your Vercel URL: https://ai-medlab-backend.vercel.app
4. Save
5. Redeploy from "Deployments" tab
```

✅ **SAVE BACKEND URL** - You'll need it for frontend

---

## Step 🔟 Deploy Frontend to Vercel

### 10.1 Update Frontend `.env`
```
Edit: frontend/.env

Change:
VITE_BACKEND_URL=http://localhost:5000

To your Vercel backend URL:
VITE_BACKEND_URL=https://ai-medlab-backend.vercel.app
```

### 10.2 Commit and Push
```bash
git add frontend/.env
git commit -m "Update backend URL for production"
git push origin main
```

### 10.3 Import Frontend to Vercel
```
1. Go to Vercel Dashboard
2. Click "Add New..." → "Project"
3. Select AI-MedLab repository again
4. Click "Import"
```

### 10.4 Configure Frontend
```
1. Root Directory: Select "frontend"
2. Framework: Select "Vite"
3. Build Command: npm run build
4. Output Directory: dist
5. Environment Variables: Click "Add"
```

### 10.5 Add Environment Variables

**Add all variables from your frontend/.env:**

```
VITE_BACKEND_URL=https://ai-medlab-backend.vercel.app
VITE_MODEL_URL=http://localhost:5002 (update later)
VITE_PUBLICATION_KEY=pk_test_...
VITE_FIREBASE_API_KEY=AIzaSyD...
VITE_FIREBASE_AUTH_DOMAIN=...
VITE_FIREBASE_PROJECT_ID=...
VITE_FIREBASE_STORAGE_BUCKET=...
VITE_FIREBASE_MESSAGING_SENDER_ID=...
VITE_FIREBASE_APP_ID=...
VITE_GROQ_API_KEY=gsk_...
VITE_JAAS_APP_ID=...
VITE_CLOUDINARY_NAME=...
VITE_CLOUDINARY_UPLOAD_PRESET=...
```

### 10.6 Deploy
```
1. Click "Deploy"
2. Wait for deployment (3-10 minutes)
3. You'll get URL like: https://ai-medlab-frontend.vercel.app
4. SAVE THIS URL
```

✅ **DEPLOYMENT COMPLETE!**

---

# PART 4: DEPLOY ML MODELS

## Step 1️⃣1️⃣ Option A: Deploy on Railway.app (RECOMMENDED)

### 11.1 Create Railway Account
```
Go to: https://railway.app/
Sign up with GitHub
Authorize Railway
```

### 11.2 Create New Project
```
1. Click "New Project"
2. Select "Deploy from GitHub"
3. Find and select: AI-MedLab
```

### 11.3 Configure Deployment
```
1. Select "root" directory: models
2. Environment: Python
3. Add Environment Variables:
   PORT=5002
```

### 11.4 Deploy
```
1. Click "Deploy"
2. Wait for completion
3. You'll get URL like: https://your-models.railway.app
4. SAVE THIS URL
```

### 11.5 Update Frontend `.env`
```
Edit: frontend/.env

Change:
VITE_MODEL_URL=http://localhost:5002

To:
VITE_MODEL_URL=https://your-models.railway.app
```

### 11.6 Redeploy Frontend
```
1. Commit and push:
   git add frontend/.env
   git commit -m "Update model URL"
   git push origin main

2. Go to Vercel Dashboard
3. Find frontend project
4. Go to "Deployments" tab
5. Click "Redeploy" on latest deployment
```

---

## Option B: Deploy Locally on Your Server

If you want to run locally:

```bash
# Terminal 1: Model Service
cd models
python -m venv venv
venv\Scripts\activate  # Windows
pip install -r requirements.txt
python app.py
# Will run on port 5002

# Terminal 2: Backend (already on Vercel)
# No need to run locally

# Terminal 3: Frontend (already on Vercel)
# No need to run locally
```

---

# PART 5: TESTING & VERIFICATION

## Step 1️⃣2️⃣ Test Backend Health

```bash
# In PowerShell
curl https://your-backend-url.vercel.app/health

# Should return: {"status": "ok"}
```

---

## Step 1️⃣3️⃣ Test Frontend Loading

```
Open: https://your-frontend.vercel.app
Check: Page loads without errors
Open browser console (F12) - no major errors
```

---

## Step 1️⃣4️⃣ Full User Journey Test

### Test 1: User Registration
```
1. Go to frontend URL
2. Click "Sign Up"
3. Fill form with test data
4. Click "Register"
5. Check email for verification link
6. Verify account
```

### Test 2: Google Login
```
1. Go to frontend URL
2. Click "Google Sign In"
3. Complete Google authentication
4. Should redirect to dashboard
5. Check user is logged in
```

### Test 3: Browse Medicines
```
1. Click "Medicines" menu
2. Browse list
3. Click on a medicine
4. View details
```

### Test 4: Add to Cart
```
1. Click "Add to Cart"
2. Go to "Cart" page
3. Verify medicine is in cart
4. Update quantity
```

### Test 5: Checkout & Payment
```
1. Click "Proceed to Checkout"
2. Fill shipping details
3. Click "Pay with Stripe"
4. Use test card: 4242 4242 4242 4242
5. Expiry: 12/25
6. CVC: 123
7. Complete payment
8. Should show success page
```

### Test 6: Doctor Login
```
1. Login as doctor account
2. Set availability
3. Update profile
```

### Test 7: Disease Prediction
```
1. Go to "Disease Prediction"
2. Select symptoms
3. Click "Predict"
4. Should show prediction
```

### Test 8: Chatbot
```
1. Click chatbot icon (bottom right)
2. Ask health question
3. Should get response
```

---

# PART 6: MONITORING & MAINTENANCE

## Important URLs to Bookmark

```
Frontend: https://your-frontend.vercel.app
Backend API: https://your-backend.vercel.app
Models API: https://your-models.railway.app

MongoDB: https://cloud.mongodb.com
Firebase: https://console.firebase.google.com
Stripe: https://dashboard.stripe.com
Groq: https://console.groq.com
Vercel: https://vercel.com/dashboard
Railway: https://railway.app/dashboard
```

---

## Useful Commands for Monitoring

### Check Vercel Logs
```
1. Go to Vercel Dashboard
2. Select project
3. Go to "Deployments"
4. Click on active deployment
5. View logs
```

### Check Backend Issues
```bash
# In PowerShell
curl -v https://your-backend.vercel.app/get_medicines
```

### Check Frontend Errors
```
1. Open frontend URL
2. Press F12 (Developer Tools)
3. Go to Console tab
4. Look for red errors
```

---

## Common Issues & Fixes

### ❌ 502 Bad Gateway
```
Cause: Backend crashed or not running
Fix: 
1. Check Vercel logs
2. Verify all .env variables are set
3. Check MongoDB connection
4. Redeploy backend
```

### ❌ CORS Error
```
Cause: Frontend can't connect to backend
Fix:
1. Verify VITE_BACKEND_URL in frontend/.env
2. Verify backend allows CORS
3. Check backend app.py CORS configuration
```

### ❌ Blank Frontend Page
```
Cause: API connection failed
Fix:
1. Open browser console (F12)
2. Check network errors
3. Verify backend URL
4. Check backend is running
```

### ❌ Payment Not Working
```
Cause: Stripe keys incorrect
Fix:
1. Check VITE_PUBLICATION_KEY in frontend
2. Check STRIPE_SECRET_KEY in backend
3. Use test keys (sk_test_, pk_test_)
4. Verify Stripe account
```

### ❌ Authentication Failing
```
Cause: Firebase config incorrect
Fix:
1. Verify VITE_FIREBASE_* in frontend/.env
2. Check Firebase domain whitelist
3. Verify Firebase project ID
```

---

## Performance Tips

1. **Enable Caching** in Vercel Settings
2. **Monitor API Usage** in Stripe/Groq dashboards
3. **Set up Error Tracking** (Sentry, LogRocket)
4. **Monitor MongoDB Usage** - stays within free tier limits
5. **Setup Auto-deployments** from GitHub

---

## Next Steps

1. ✅ Set up custom domain (optional)
2. ✅ Enable SSL/HTTPS (automatic on Vercel)
3. ✅ Setup automated backups for MongoDB
4. ✅ Configure CI/CD pipeline
5. ✅ Setup error tracking/monitoring
6. ✅ Plan scaling strategy

---

## Support Resources

- **Vercel Docs:** https://vercel.com/docs
- **MongoDB Docs:** https://docs.mongodb.com/
- **Flask Docs:** https://flask.palletsprojects.com/
- **Firebase Docs:** https://firebase.google.com/docs
- **Stripe Docs:** https://stripe.com/docs
- **Groq Docs:** https://console.groq.com/docs

---

**🎉 Your project is now LIVE in production!**

**Frontend URL:** https://your-frontend.vercel.app  
**Backend API:** https://your-backend.vercel.app  
**Models API:** https://your-models.railway.app

Monitor for any issues and celebrate! 🚀
