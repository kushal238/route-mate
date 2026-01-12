# BusTracker - Address-to-Address Bus Routing for Hyderabad

A mobile app that finds bus routes between any two addresses in Hyderabad, including walking directions and multi-leg journeys with transfers.

## Features

- **Address-to-Address Routing**: Enter any two addresses, not just bus stations
- **Multi-Modal Directions**: Walking + Bus + Transfers all in one route
- **Multiple Route Options**: Compare different routes by time and transfers
- **Current Location**: Use your GPS location as starting point
- **Step-by-Step Directions**: Clear instructions for each segment
- **Hyderabad Focused**: Optimized for Hyderabad's bus network


## Prerequisites

1. **Node.js** (v18 or higher)
2. **npm** or **yarn**
3. **Google Maps Platform Account** with:
   - Directions API enabled
   - Geocoding API enabled
   - Places API enabled
   - Maps SDK for Android enabled
   - Billing enabled
4. **Expo Go app** on your phone (for testing)

## Quick Start

### 1. Backend Setup

```bash
cd backend

# Install dependencies
npm install

# Configure your API key
# Open .env file and replace 'your_api_key_here' with your actual Google Maps API key
nano .env

# Start the server
npm run dev
```

The API should now be running on `http://localhost:3000`

### 2. Mobile App Setup

```bash
cd mobile

# Install dependencies
npm install

# Update API URL
# Open src/services/api.ts and replace the API_BASE_URL with your computer's IP
# Find your IP:
#   Mac: ipconfig getifaddr en0
#   Windows: ipconfig (look for IPv4)
# Example: const API_BASE_URL = 'http://192.168.1.100:3000/api';

# Start the app
npx expo start
```

### 3. Run on Your Phone

1. Install **Expo Go** from Play Store (Android) or App Store (iOS)
2. Scan the QR code shown in the terminal
3. The app will load on your phone!

## How to Use

1. **Enter Addresses**:
   - Type starting point in "From" field
   - Or tap GPS icon to use current location
   - Type destination in "To" field

2. **Get Suggestions**:
   - As you type, you'll see address suggestions
   - Tap any suggestion to select it

3. **Find Routes**:
   - Tap "Find Routes" button
   - Wait a few seconds for results

4. **View Routes**:
   - See multiple route options sorted by duration
   - Each route shows: time, distance, transfers, walking distance
   - Tap any route to see step-by-step directions

5. **Read Directions**:
   - Walking segments with instructions
   - Bus numbers, stops, and number of stops
   - Timing for each segment

## Configuration

### Backend (.env)

```env
GOOGLE_MAPS_API_KEY=your_actual_api_key_here
PORT=3000
NODE_ENV=development
CORS_ORIGIN=*
```

### Mobile (src/services/api.ts)

```typescript
// Update this line with your computer's IP address
const API_BASE_URL = 'http://192.168.1.XXX:3000/api';
```

### Android Google Maps API Key

For maps to work on Android, add your API key to `mobile/app.json`:

```json
"android": {
  "config": {
    "googleMaps": {
      "apiKey": "YOUR_ANDROID_API_KEY_HERE"
    }
  }
}
```
