# Google Login & Authentication Setup Guide

## Issue Fixed ✅

**Root Cause:** Backend URL mismatch
- Backend was running on port **5000**
- Frontend was trying to connect to port **5001**
- Updated `.env`: `VITE_BACKEND_URL=http://127.0.0.1:5000`

---

## Google Login Setup

### Prerequisites
1. Firebase project already configured (✅ Already set up)
2. Google OAuth credentials configured (✅ Already set up)
3. Backend and Frontend running on correct ports (✅ Just fixed)

### What Happens During Google Login

```
1. User clicks "Login with Google" button
   ↓
2. Firebase Sign-in popup appears
   ↓
3. User selects Google account and logs in
   ↓
4. Frontend receives Google ID Token
   ↓
5. Frontend sends ID Token to Backend: POST /login { id_token }
   ↓
6. Backend verifies token with Firebase Admin SDK
   ↓
7. Backend creates JWT access token
   ↓
8. Frontend stores token in localStorage
   ↓
9. User logged in! ✅
```

---

## Troubleshooting

### Error: "Network Error" or "Connection Refused"

**Solution:** Make sure backend is running on port 5000
```bash
cd backend
python app.py
```

Check:
- Backend should show: `Running on http://0.0.0.0:5000`
- Frontend `.env` should have: `VITE_BACKEND_URL=http://127.0.0.1:5000`

### Error: "Invalid Firebase Token"

**Solution:** Check Firebase credentials are loaded

Look in backend console for:
- `[Firebase] Initialized successfully!` ✅ (Good)
- `[Firebase Init Error]` ❌ (Problem - missing env variables)

If you see init error, ensure backend `.env` has all Firebase variables:
```env
FIREBASE_TYPE=service_account
FIREBASE_PROJECT_ID=ai-medlab-a4cbd
FIREBASE_PRIVATE_KEY_ID=...
FIREBASE_PRIVATE_KEY=...
FIREBASE_CLIENT_EMAIL=...
FIREBASE_CLIENT_ID=...
FIREBASE_AUTH_URI=...
FIREBASE_TOKEN_URI=...
FIREBASE_AUTH_PROVIDER_CERT_URL=...
FIREBASE_CLIENT_CERT_URL=...
FIREBASE_UNIVERSE_DOMAIN=...
```

### Error: CORS Policy Error

**Solution:** Backend CORS is already configured for localhost

If you get CORS errors:
1. Check backend console for CORS errors
2. Clear browser cache (Ctrl+Shift+Delete)
3. Hard refresh page (Ctrl+Shift+R)

### Error: Firebase Popup Blocked

**Solution:** Browser blocked the popup

- Check if popup is being blocked by browser
- Look for popup notification in address bar
- Allow popups for localhost:5173
- Try a different browser

---

## How to Test Google Login

### Step 1: Make Sure All Services Are Running
```bash
# Terminal 1: Backend
cd backend && python app.py

# Terminal 2: Frontend
cd frontend && npm run dev

# Terminal 3: Model Service (optional for this test)
cd models && python app.py
```

### Step 2: Open Frontend
Go to: http://localhost:5173

### Step 3: Click "Login with Google"
- You should see Google sign-in popup
- Select your Google account
- You should be logged in!

### Step 4: Check Console for Debugging
1. Open DevTools: F12
2. Go to "Console" tab
3. Look for messages like:
   - `✓ Groq API Key loaded successfully` (Chatbot)
   - Log/register successful messages
   - Any error messages

### Step 5: Check Backend Logs
Look in backend terminal for:
- `[Firebase Login] Successfully verified token for email: ...`
- Any error messages

---

## Ports Reference

| Service | Port | URL |
|---------|------|-----|
| Frontend | 5173 | http://localhost:5173 |
| Backend API | 5000 | http://localhost:5000 |
| Model Service | 5002 | http://localhost:5002 |

---

## Common Issues Summary

| Issue | Cause | Solution |
|-------|-------|----------|
| Connection refused | Backend not running | Run `python app.py` in backend |
| Wrong port | `.env` mismatch | Check `VITE_BACKEND_URL=http://127.0.0.1:5000` |
| Firebase error | Missing env vars | Check backend `.env` has all Firebase variables |
| CORS blocked | Browser/server | Clear cache, hard refresh, check CORS config |
| Popup blocked | Browser security | Allow popups for localhost |
| Token invalid | Firebase not initialized | Check backend logs for Firebase init |

---

## Firebase Console

For Firebase configuration, check:
https://console.firebase.google.com/project/ai-medlab-a4cbd

---

## Need Help?

Check these files for more info:
- Backend login: [backend/app.py](../../backend/app.py#L446)
- Frontend login: [frontend/src/components/form/Accountform.jsx](../../frontend/src/components/form/Accountform.jsx#L247)
- Environment setup: [CHATBOT_SETUP.md](./CHATBOT_SETUP.md)
