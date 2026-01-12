# Build Custom Dev Client for Maps

## What You Need to Do

The map code is now uncommented, but you need to build a **custom development client** because `react-native-maps` requires native modules that aren't in the standard Expo Go app.

## Steps to Build

### 1. Login to EAS (if you haven't already)

```bash
cd /Users/kushalagarwal/BusTracker/mobile
eas login
```

Enter your Expo account credentials when prompted.

### 2. Configure the Build (if needed)

The `eas.json` file is already configured. You can check it:

```bash
cat eas.json
```

Should show:
```json
{
  "build": {
    "development": {
      "developmentClient": true,
      "distribution": "internal",
      "android": {
        "buildType": "apk"
      }
    }
  }
}
```

### 3. Start the Build

```bash
eas build --profile development --platform android
```

**What happens:**
- EAS will ask if you want to create a new build
- Say **yes**
- Build starts on Expo's cloud servers
- Takes ~15-20 minutes
- You'll get a download link for the APK when done

### 4. Install the APK

Once the build completes:
1. Download the APK to your phone (link will be shown in terminal)
2. Install it (may need to allow "Install from Unknown Sources")
3. The app icon will say "BusTracker" (not "Expo Go")

### 5. Run with Dev Client

```bash
npx expo start --dev-client
```

Then scan the QR code with your **new BusTracker app** (not Expo Go).

## What's Different?

**Before (Expo Go):**
- ❌ Maps crashed with `RNMapsAirModule` error
- ✅ Fast to test other features

**After (Custom Dev Client):**
- ✅ Maps work perfectly
- ✅ All native modules work
- ⚠️ Need to rebuild if you add new native dependencies

## Expected Build Output

```
✔ Build finished
├ Build URL: https://expo.dev/accounts/.../builds/...
└ APK URL: https://expo.dev/artifacts/...apk
```

## Troubleshooting

**If build fails:**
1. Make sure you're logged in: `eas whoami`
2. Check app.json has correct bundleIdentifier
3. Try: `eas build:configure` then build again

**If map still doesn't work:**
1. Make sure you installed the NEW APK (not using Expo Go)
2. Check if Google Maps API key is in app.json (line 33-36)
3. Run `npx expo start --dev-client` (not `npx expo start`)

## Testing the Map

Once installed:
1. Search for a route
2. Tap on a route card to expand it
3. Tap **"View on Map"** button
4. Should see:
   - Green marker at origin
   - Red marker at destination
   - Color-coded route lines (green=walk, blue=bus, purple=metro)

## What the Map Shows

- **Origin**: Green pin
- **Destination**: Red pin  
- **Walking segments**: Green dashed lines
- **Bus segments**: Blue solid lines
- **Metro segments**: Purple solid lines
- **Auto-zoom**: Fits entire route on screen

Ready to build? Run:
```bash
cd /Users/kushalagarwal/BusTracker/mobile
eas login
eas build --profile development --platform android
```

