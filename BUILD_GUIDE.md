# 🚀 Building Custom Development Client - Complete Guide

## ✅ Prerequisites Done:
- ✅ EAS CLI installed
- ✅ eas.json created
- ✅ app.json configured with maps plugin

## 📋 Next Steps (Do These Manually):

### Step 1: Login to Expo

```bash
cd mobile
eas login
```

**What to do:**
- If you have an Expo account: Enter your credentials
- If you don't: It will guide you to create one at expo.dev (it's FREE!)

### Step 2: Configure Your Project

```bash
eas build:configure
```

This creates project configuration. Just accept the defaults.

### Step 3: Build for Android

```bash
eas build --profile development --platform android
```

**What happens:**
- Uploads your project to Expo servers
- Builds a custom APK with maps support
- Takes about 15-20 minutes
- You'll get a download link when done

**Note:** You can watch the build progress at expo.dev

### Step 4: Download & Install

Once complete:
1. You'll get a download link in terminal
2. Open that link on your Android phone
3. Download the APK
4. Install it (you may need to allow "Install from Unknown Sources")

### Step 5: Run Your App

Back on your computer:

```bash
cd mobile
npx expo start --dev-client
```

Then:
- Open the NEW app you just installed (not Expo Go!)
- Scan the QR code
- Your app loads with full maps support! 🗺️

---

## 🎯 What You're Building:

A custom version of your app called "BusTracker" that includes:
- ✅ All Expo features
- ✅ React Native Maps (native)
- ✅ Google Maps integration
- ✅ Your complete app code

## ⏱️ Timeline:

- Login & Configure: 2 minutes
- Build on Expo servers: 15-20 minutes
- Download & Install: 2 minutes
- **Total: ~20-25 minutes**

## 💡 Tips:

1. **Keep terminal open** - Don't close it during build
2. **Free tier is fine** - No payment needed for development builds
3. **First build is slowest** - Future builds are faster
4. **Can build iOS too** - If you have a Mac (optional)

## 🐛 Troubleshooting:

### "Not logged in"
```bash
eas login
```

### "Project not configured"
```bash
eas build:configure
```

### "Build failed"
- Check terminal output for specific error
- Most common: Missing Android API key in app.json
- Run: `eas build --profile development --platform android --clear-cache`

## 📱 After Installation:

1. **Delete Expo Go** (optional) - You won't need it anymore
2. **Use your custom app** - It's like Expo Go but with your native modules
3. **Develop normally** - `npx expo start --dev-client` and scan QR code

---

## 🎊 Benefits of Custom Dev Client:

- ✅ Full native module support (maps, camera, etc.)
- ✅ Faster development (no rebuild for JS changes)
- ✅ Production-like experience
- ✅ Can share with testers
- ✅ Stepping stone to production build

---

## 🚀 Ready to Build?

Run these commands in terminal:

```bash
cd mobile
eas login
eas build:configure
eas build --profile development --platform android
```

Then wait for the build to complete!

**I'll wait here - let me know when it's done or if you hit any issues!** 🎯

