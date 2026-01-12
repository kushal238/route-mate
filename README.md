# 🚍 BusTracker - Address-to-Address Bus Routing for Hyderabad

A mobile app that finds bus routes between any two addresses in Hyderabad, including walking directions and multi-leg journeys with transfers.

## ✨ Features

- **Address-to-Address Routing**: Enter any two addresses, not just bus stations
- **Multi-Modal Directions**: Walking + Bus + Transfers all in one route
- **Multiple Route Options**: Compare different routes by time and transfers
- **Current Location**: Use your GPS location as starting point
- **Step-by-Step Directions**: Clear instructions for each segment
- **Hyderabad Focused**: Optimized for Hyderabad's bus network

## 🏗️ Architecture

```
BusTracker/
├── backend/          # Node.js + Express API
│   └── src/
│       ├── services/    # Google Maps integration
│       ├── controllers/ # Request handlers
│       └── routes/      # API endpoints
│
└── mobile/           # React Native + Expo app
    └── src/
        ├── screens/     # UI screens
        ├── components/  # Reusable components
        ├── services/    # API client
        └── navigation/  # Navigation setup
```

## 📋 Prerequisites

1. **Node.js** (v18 or higher)
2. **npm** or **yarn**
3. **Google Maps Platform Account** with:
   - Directions API enabled
   - Geocoding API enabled
   - Places API enabled
   - Maps SDK for Android enabled
   - Billing enabled
4. **Expo Go app** on your phone (for testing)

## 🚀 Quick Start

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

## 📱 How to Use

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

## 🔑 Configuration

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

## 🧪 Testing

### Test Backend API

```bash
# Health check
curl http://localhost:3000/api/health

# Get route (replace addresses with real Hyderabad locations)
curl -X POST http://localhost:3000/api/route \
  -H "Content-Type: application/json" \
  -d '{
    "from": "HITEC City, Hyderabad",
    "to": "Charminar, Hyderabad"
  }'
```

### Test Cases for Hyderabad

Try these popular routes:
1. **HITEC City** → **Charminar** (Tech hub to old city)
2. **Secunderabad Railway Station** → **Gachibowli** (North to West)
3. **Banjara Hills** → **LB Nagar** (Central to Southeast)
4. **Ameerpet** → **ECIL** (Metro corridor)
5. **Madhapur** → **Dilsukhnagar** (IT area to shopping hub)

## 📊 API Endpoints

### POST /api/route
Get transit routes between two locations.

**Request:**
```json
{
  "from": "HITEC City, Hyderabad",
  "to": "Charminar, Hyderabad",
  "mode": "transit"
}
```

**Response:**
```json
{
  "success": true,
  "routes": [...],
  "from": {...},
  "to": {...}
}
```

### GET /api/places/autocomplete?input=...
Get place suggestions for autocomplete.

### GET /api/geocode?address=...
Convert address to coordinates.

### GET /api/health
Health check endpoint.

## 💰 Cost Estimate

With Google's 70% discount for Indian developers:

- **Directions API**: ~₹0.12 per request
- **Geocoding API**: ~₹0.12 per request  
- **Places Autocomplete**: ~₹0.07 per request
- **Free Monthly Credit**: ₹16,000 ($200)

**For 1000 users making 5 routes each:**
- 5000 direction requests = ~₹600
- 10000 geocoding requests = ~₹1200
- 20000 autocomplete requests = ~₹1400
- **Total**: ~₹3200/month (covered by free credit!)

## 🐛 Troubleshooting

### "No routes found"
- Verify addresses are in Hyderabad
- Check that Google Maps has bus data for those locations
- Try major landmarks instead of specific addresses

### "API key not configured"
- Make sure you've added your API key to `backend/.env`
- Restart the backend server after updating .env

### "Cannot connect to server"
- Check backend is running (`npm run dev` in backend folder)
- Verify API_BASE_URL in `mobile/src/services/api.ts` has correct IP
- Make sure phone and computer are on same WiFi network

### Location permission denied
- Go to phone Settings → Apps → Expo Go → Permissions
- Enable Location permission

### App crashes on Android
- Make sure you've added Google Maps API key to `app.json`
- The key must have "Maps SDK for Android" enabled

## 📈 Future Enhancements

- [ ] Map view with route overlay
- [ ] Real-time bus tracking
- [ ] Save favorite routes
- [ ] Offline mode with cached routes
- [ ] Fare estimation
- [ ] Departure time scheduling
- [ ] Multiple cities support
- [ ] Share routes with friends

## 🛠️ Tech Stack

**Backend:**
- Node.js + Express + TypeScript
- Google Maps Platform APIs
- Environment-based configuration

**Mobile:**
- React Native + Expo
- React Navigation
- React Native Paper (UI components)
- Axios (API calls)
- Expo Location (GPS)

## 📄 License

MIT License - feel free to use this for your projects!

## 🤝 Contributing

This is an MVP. Contributions welcome! Areas for improvement:
- Better error handling
- Caching layer
- Real-time tracking integration
- UI/UX enhancements
- Support for more cities

## 📞 Support

For issues or questions:
1. Check the Troubleshooting section above
2. Verify your Google Maps API key is properly configured
3. Ensure all required APIs are enabled in Google Cloud Console

## 🎉 Credits

Built with ❤️ for Hyderabad commuters

Powered by Google Maps Platform

