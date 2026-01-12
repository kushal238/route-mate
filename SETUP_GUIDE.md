# 🚀 Complete Setup Guide - BusTracker MVP

Follow these steps to get your BusTracker app running!

## Step 1: Google Maps Platform Setup (10 minutes)

### 1.1 Create Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Click "Select a Project" → "New Project"
3. Name it: **BusTracker**
4. Click "Create"

### 1.2 Enable Billing

1. Go to "Billing" in the left menu
2. Click "Link a Billing Account" or "Add Billing Account"
3. Enter your credit/debit card details
4. **Don't worry**: You get $200 free credit monthly!
5. Set a budget alert:
   - Go to "Budgets & alerts"
   - Create budget: $50/month
   - Enable email alerts

### 1.3 Enable Required APIs

1. Go to "APIs & Services" → "Enable APIs and Services"
2. Search and enable each of these (click the "Enable" button):
   - ✅ **Directions API**
   - ✅ **Geocoding API**
   - ✅ **Places API**
   - ✅ **Maps SDK for Android**
   - ✅ **Maps SDK for iOS** (if you have an iPhone)

### 1.4 Create API Keys

You need **2 API keys**:

#### Backend API Key:
1. Go to "APIs & Services" → "Credentials"
2. Click "Create Credentials" → "API Key"
3. Copy the key and save it somewhere safe
4. Click "Edit" on the key
5. Under "Application restrictions": Select "IP addresses"
6. For now, select "Don't restrict" (we'll add restrictions later)
7. Under "API restrictions": Select "Restrict key"
8. Check: Directions API, Geocoding API, Places API
9. Click "Save"

#### Android API Key:
1. Create another API key
2. Under "Application restrictions": Select "Android apps"
3. For now, select "Don't restrict" (we'll add package name later)
4. Under "API restrictions": Check "Maps SDK for Android"
5. Click "Save"

---

## Step 2: Backend Setup (5 minutes)

### 2.1 Install Dependencies

```bash
cd backend
npm install
```

### 2.2 Configure API Key

1. Open `backend/.env` file
2. Replace `your_api_key_here` with your **Backend API Key**:

```env
GOOGLE_MAPS_API_KEY=AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXX
PORT=3000
NODE_ENV=development
CORS_ORIGIN=*
```

3. Save the file

### 2.3 Start Backend Server

```bash
npm run dev
```

You should see:
```
🚍 BusTracker API Server
========================
🌍 Server running on port 3000
📍 Environment: development
🔑 API Key configured: ✅ Yes
```

### 2.4 Test Backend

Open a new terminal and run:

```bash
curl http://localhost:3000/api/health
```

Expected response:
```json
{
  "status": "ok",
  "timestamp": "2024-...",
  "service": "BusTracker API"
}
```

✅ **Backend is working!**

---

## Step 3: Mobile App Setup (5 minutes)

### 3.1 Install Dependencies

```bash
cd mobile
npm install
```

### 3.2 Find Your Computer's IP Address

**On Mac:**
```bash
ipconfig getifaddr en0
```

**On Windows:**
```bash
ipconfig
```
Look for "IPv4 Address" (e.g., 192.168.1.100)

**On Linux:**
```bash
hostname -I
```

### 3.3 Update API URL

1. Open `mobile/src/services/api.ts`
2. Find this line:
```typescript
const API_BASE_URL = 'http://192.168.1.100:3000/api';
```
3. Replace `192.168.1.100` with YOUR computer's IP address
4. Save the file

### 3.4 Add Android API Key

1. Open `mobile/app.json`
2. Find this section:
```json
"android": {
  "config": {
    "googleMaps": {
      "apiKey": "YOUR_ANDROID_GOOGLE_MAPS_API_KEY"
    }
  }
}
```
3. Replace `YOUR_ANDROID_GOOGLE_MAPS_API_KEY` with your **Android API Key**
4. Save the file

---

## Step 4: Run the App (2 minutes)

### 4.1 Start Expo

```bash
npx expo start
```

You'll see a QR code in the terminal.

### 4.2 Install Expo Go

**Android:** [Get it from Play Store](https://play.google.com/store/apps/details?id=host.exp.exponent)

**iOS:** [Get it from App Store](https://apps.apple.com/app/expo-go/id982107779)

### 4.3 Open the App

**Android:**
1. Open Expo Go app
2. Tap "Scan QR code"
3. Point camera at the QR code in your terminal

**iOS:**
1. Open Camera app
2. Point at the QR code
3. Tap the notification to open in Expo Go

### 4.4 Wait for Build

The app will take 30-60 seconds to build and load.

---

## Step 5: Test the App! 🎉

### First Test:

1. **Tap the GPS icon** next to "From" field
2. Allow location permission when asked
3. Your current location should appear
4. Type in "To" field: **Charminar, Hyderabad**
5. Tap **Find Routes**
6. Wait a few seconds
7. You should see route options! 🚌

### More Test Cases:

Try these popular Hyderabad routes:

1. **HITEC City** → **Charminar**
2. **Secunderabad Railway Station** → **Gachibowli**
3. **Ameerpet** → **ECIL**
4. **Madhapur** → **Dilsukhnagar**

---

## 🐛 Common Issues & Fixes

### "Cannot connect to server"

**Problem:** App can't reach backend

**Fix:**
1. Make sure backend is running (`npm run dev`)
2. Check phone and computer are on **same WiFi**
3. Verify IP address in `api.ts` is correct
4. Try turning off any VPN

### "API key not configured"

**Problem:** Backend can't access Google Maps

**Fix:**
1. Check `.env` file has the correct API key
2. Restart backend server
3. Verify key has no extra spaces or quotes

### "No routes found"

**Problem:** Google can't find bus routes

**Fix:**
1. Use popular landmarks (HITEC City, Charminar, etc.)
2. Make sure both addresses are in Hyderabad
3. Try adding "Hyderabad" to the addresses

### Location permission denied

**Fix:**
1. Go to Phone Settings → Apps → Expo Go
2. Tap Permissions → Location
3. Select "While using the app"

### App won't load on Android

**Fix:**
1. Make sure you added Android API key to `app.json`
2. Verify "Maps SDK for Android" is enabled in Google Cloud

---

## 📱 How to Use the App

### Finding a Route:

1. **Enter Starting Point:**
   - Type an address, OR
   - Tap GPS icon for current location

2. **Enter Destination:**
   - Start typing
   - Select from suggestions

3. **Get Routes:**
   - Tap "Find Routes"
   - Wait 2-3 seconds

4. **View Options:**
   - See multiple routes
   - Compare time and transfers
   - Tap any route for details

5. **Read Directions:**
   - See step-by-step instructions
   - Walking segments
   - Bus numbers and stops
   - Transfer points

---

## 🎓 Next Steps

Now that your MVP is working:

### Immediate Todos:
- [ ] Test with different Hyderabad addresses
- [ ] Share with friends for feedback
- [ ] Note any bugs or issues

### Future Enhancements:
- [ ] Add map visualization
- [ ] Show routes on Google Maps
- [ ] Add favorite/recent routes
- [ ] Real-time bus tracking
- [ ] Fare estimation

### Going to Production:
- [ ] Restrict API keys (add package names)
- [ ] Deploy backend to cloud (Railway, Render, Heroku)
- [ ] Build standalone APK for Android
- [ ] Submit to Play Store

---

## 💡 Pro Tips

1. **Save API Costs:**
   - API calls are cached in Google's systems
   - Similar routes use less quota
   - Test with same routes multiple times

2. **Better Results:**
   - Use major landmarks for better accuracy
   - Include "Hyderabad" in addresses
   - Be specific (e.g., "HITEC City Phase 2")

3. **Development:**
   - Keep backend terminal open to see API logs
   - Shake phone to open Expo dev menu
   - Press 'r' in Expo terminal to reload app

---

## ✅ Checklist

Before asking for help, verify:

- [ ] Backend server is running
- [ ] See "🔑 API Key configured: ✅ Yes" in backend logs
- [ ] Phone and computer on same WiFi
- [ ] IP address in `api.ts` is correct
- [ ] Google Maps APIs are enabled
- [ ] Billing is enabled in Google Cloud
- [ ] Android API key added to `app.json`
- [ ] Tested with `curl http://localhost:3000/api/health`

---

## 🎉 Congratulations!

You now have a working bus routing app!

**What you've built:**
- ✅ Full-stack mobile app
- ✅ Address-to-address routing
- ✅ Multi-modal directions
- ✅ Google Maps integration
- ✅ Production-ready architecture

**Time to celebrate! 🎊**

Try it with your daily commute and see how it works!

