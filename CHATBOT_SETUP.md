# Chatbot API Setup Guide

## Current Setup: Groq API (FREE)

We've switched from Gemini to **Groq API** because it's:
- ✅ **100% Free** - No credit card needed
- ✅ **Faster** - Up to 30+ requests/min on free tier
- ✅ **Reliable** - No deprecation issues
- ✅ **Easy to setup** - Just need 1 API key

---

## 🚀 Get Your Free Groq API Key (2 minutes)

### Step 1: Go to Groq Console
1. Visit: https://console.groq.com/
2. Sign up with your email (or GitHub/Google)
3. Verify your email

### Step 2: Create API Key
1. Click on **"Keys"** in the left sidebar
2. Click **"Create New API Key"**
3. Name it: `AI-MedLab` (or anything you prefer)
4. Copy the key (starts with `gsk_`)

### Step 3: Add to Your `.env` File
Open `frontend/.env` and replace:

```env
VITE_GROQ_API_KEY=gsk_your-actual-api-key-here
```

Example:
```env
VITE_GROQ_API_KEY=gsk_abc123def456xyz789...
```

### Step 4: Restart Frontend
```bash
cd frontend
npm run dev
```

---

## ✨ Available Groq Models (all FREE)

You can change the model in `frontend/src/components/common/ChatBot.jsx` line ~120:

**Current Production Models (stable):**
- **llama-3.3-70b-versatile** (Current Recommended) - Best quality, good speed
- **llama-3.1-8b-instant** - Lightweight, faster

**Check Latest Models:**
Since Groq frequently updates models, always check the current list at:
https://console.groq.com/docs/models

To change, find this line and replace the model:
```javascript
model: "llama-3.3-70b-versatile", // Change this to another available model
```

### Why Models Keep Changing?
Groq continuously updates and optimizes their model lineup. Old versions get deprecated as newer, better versions are released. This is normal and expected in the rapidly evolving AI space.

---

## 🔒 Security Note

**DO NOT commit your API key to Git!**

Make sure `.env` is in `.gitignore`:
```
# In .gitignore (already added)
frontend/.env
```

---

## ❓ Troubleshooting

### "API Key is missing or not configured"
- Check `.env` file has the correct key
- Make sure you saved the file
- Restart frontend: `npm run dev`

### "Invalid API key"
- Get a fresh key from https://console.groq.com/keys
- Make sure it starts with `gsk_`

### Rate limit exceeded
- Free tier: 30 requests/min
- Wait a minute and try again
- Upgrade on Groq console if needed

### Still getting errors?
- Open browser console (F12)
- Check the error message
- You can also use curl to test:
  ```bash
  curl -X POST https://api.groq.com/openai/v1/chat/completions \
    -H "Authorization: Bearer YOUR_KEY" \
    -H "Content-Type: application/json" \
    -d '{"model":"mixtral-8x7b-32768","messages":[{"role":"user","content":"Hi"}]}'
  ```

---

## 📊 Comparison with Other Free Options

| Service | Free Tier | Speed | Notes |
|---------|-----------|-------|-------|
| **Groq** | ✅ 30 req/min | ⚡⚡⚡ Fast | No credit card needed |
| Gemini | ✅ 1000 req/day | ⚡⚡ Medium | Deprecated models |
| Claude | ✅ Limited | ⚡⚡ Medium | Needs signup |
| Ollama | ✅ Unlimited | ⚡ Variable | Runs locally |

---

## 🎯 Next Steps

1. Get your Groq API key
2. Update `.env` file
3. Restart frontend: `npm run dev`
4. Test chatbot on home page
5. Enjoy! 🎉

For more info: https://groq.com/
