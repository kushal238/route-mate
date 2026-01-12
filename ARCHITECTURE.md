# 📱 BusTracker - User Flow & App Structure

## User Journey

```
┌─────────────────────────────────────────────────┐
│                                                 │
│  User opens app                                 │
│  ↓                                              │
│  📍 HomeScreen                                  │
│  • Enter "From" address (or use GPS)            │
│  • Enter "To" address                           │
│  • See autocomplete suggestions                 │
│  • Tap "Find Routes"                            │
│  ↓                                              │
│  ⏳ Loading (2-3 seconds)                       │
│  ↓                                              │
│  🚌 RouteResultsScreen                          │
│  • See multiple route options                   │
│  • Compare duration, transfers, walking         │
│  • Tap to expand for details                    │
│  • Read step-by-step directions                 │
│  ↓                                              │
│  ✅ User follows route to destination           │
│                                                 │
└─────────────────────────────────────────────────┘
```

## Architecture Flow

```
┌──────────────┐
│  Mobile App  │
│  (React      │
│   Native)    │
└──────┬───────┘
       │ HTTP Request
       │ (WiFi/Mobile Data)
       ↓
┌──────────────┐
│  Backend API │
│  (Node.js)   │
└──────┬───────┘
       │ Google Maps API Call
       │ (HTTPS)
       ↓
┌──────────────┐
│  Google Maps │
│  Platform    │
│  • Directions│
│  • Geocoding │
│  • Places    │
└──────┬───────┘
       │ Response
       │
       ↓
┌──────────────┐
│ Formatted    │
│ Route Data   │
└──────┬───────┘
       │
       ↓
┌──────────────┐
│ Display to   │
│ User         │
└──────────────┘
```

## Data Flow Example

### 1. User Input
```
From: "HITEC City, Hyderabad"
To: "Charminar, Hyderabad"
```

### 2. Mobile → Backend
```json
POST /api/route
{
  "from": "HITEC City, Hyderabad",
  "to": "Charminar, Hyderabad",
  "mode": "transit"
}
```

### 3. Backend → Google Maps
```
1. Geocode "HITEC City" → (17.4474, 78.3772)
2. Geocode "Charminar" → (17.3616, 78.4747)
3. Get Directions (transit mode)
```

### 4. Google Maps → Backend
```json
{
  "routes": [
    {
      "legs": [
        {
          "steps": [
            { "type": "WALKING", "distance": "500m" },
            { "type": "TRANSIT", "line": "Bus 65" },
            { "type": "WALKING", "distance": "200m" }
          ]
        }
      ]
    }
  ]
}
```

### 5. Backend → Mobile (Formatted)
```json
{
  "success": true,
  "routes": [
    {
      "duration": "45m",
      "distance": "15.2km",
      "transferCount": 0,
      "steps": [
        {
          "type": "walk",
          "instruction": "Walk to HITEC City bus stop",
          "duration": "6m",
          "distance": "500m"
        },
        {
          "type": "bus",
          "busNumber": "65",
          "departureStop": "HITEC City",
          "arrivalStop": "Charminar",
          "duration": "35m",
          "numStops": 15
        },
        {
          "type": "walk",
          "instruction": "Walk to destination",
          "duration": "4m",
          "distance": "200m"
        }
      ]
    }
  ]
}
```

### 6. Display to User
```
┌─────────────────────────────┐
│  Route 1 - 45 minutes       │
│  15.2 km • 0 transfers      │
│  🚶 Walking: 700m           │
├─────────────────────────────┤
│  🚶 Walk 6m to bus stop     │
│  🚌 Bus 65 (15 stops)       │
│     HITEC City → Charminar  │
│  🚶 Walk 4m to destination  │
└─────────────────────────────┘
```

## Tech Stack Layers

```
┌────────────────────────────────────┐
│         User Interface             │
│  React Native + Paper Components   │
├────────────────────────────────────┤
│       State Management             │
│  React Hooks (useState, useEffect) │
├────────────────────────────────────┤
│        Navigation                  │
│      React Navigation              │
├────────────────────────────────────┤
│       API Client                   │
│    Axios + TypeScript              │
├────────────────────────────────────┤
│      Mobile Runtime                │
│      Expo + React Native           │
└────────────────────────────────────┘
              ↕
         HTTP/HTTPS
              ↕
┌────────────────────────────────────┐
│        API Routes                  │
│    Express Router                  │
├────────────────────────────────────┤
│      Controllers                   │
│   Request/Response Handlers        │
├────────────────────────────────────┤
│        Services                    │
│  Business Logic & Google API       │
├────────────────────────────────────┤
│      Node.js Server                │
│  Express + TypeScript              │
└────────────────────────────────────┘
              ↕
         HTTPS
              ↕
┌────────────────────────────────────┐
│    Google Maps Platform            │
│  • Directions API                  │
│  • Geocoding API                   │
│  • Places API                      │
└────────────────────────────────────┘
```

## Folder Structure Visual

```
BusTracker/
│
├── 📱 mobile/                  React Native App
│   ├── src/
│   │   ├── screens/            UI Screens
│   │   │   ├── HomeScreen      Input addresses
│   │   │   └── RouteResults    Display routes
│   │   │
│   │   ├── services/           External APIs
│   │   │   └── api.ts          Backend calls
│   │   │
│   │   ├── navigation/         Screen routing
│   │   │   └── AppNavigator    Stack navigator
│   │   │
│   │   └── types/              TypeScript
│   │       └── index.ts        Type definitions
│   │
│   ├── App.tsx                 App entry point
│   └── app.json                Expo config
│
└── 🖥️  backend/                Node.js API
    ├── src/
    │   ├── controllers/        Request handlers
    │   │   ├── routeController     Route logic
    │   │   └── geocodeController   Geocoding
    │   │
    │   ├── services/           Business logic
    │   │   ├── googleMaps      API client
    │   │   ├── geocoding       Address ↔ Coords
    │   │   └── directions      Route finding
    │   │
    │   ├── routes/             API endpoints
    │   │   └── index.ts        Route definitions
    │   │
    │   ├── middleware/         Express middleware
    │   ├── config/             Configuration
    │   └── types/              TypeScript
    │
    ├── .env                    Environment vars
    └── index.ts                Server entry
```

## API Request Flow

```
1. User Interaction
   HomeScreen: User enters addresses
   ↓
2. Input Validation
   Check both fields filled
   ↓
3. API Call
   api.ts: POST /api/route
   ↓
4. Backend Receives
   Express: routes/index.ts
   ↓
5. Controller Handles
   routeController.ts
   ↓
6. Service Processing
   geocoding.ts: Get coordinates
   directions.ts: Get routes
   ↓
7. Google Maps API
   Multiple API calls
   ↓
8. Format Response
   Convert to app format
   ↓
9. Send to Mobile
   JSON response
   ↓
10. Display Results
    RouteResultsScreen
```

## State Management Flow

```
HomeScreen State:
  ├── fromAddress: string
  ├── toAddress: string
  ├── fromSuggestions: PlacePrediction[]
  ├── toSuggestions: PlacePrediction[]
  ├── loading: boolean
  └── loadingLocation: boolean

User Action → setState → Re-render → UI Update

RouteResultsScreen State:
  └── expandedRoute: number | null

Tap Route → toggle expansion → animate
```

## Error Handling Flow

```
┌─────────────────────┐
│  Error Occurs       │
└──────┬──────────────┘
       │
       ├─ Network Error
       │  └─> "Cannot connect to server"
       │      → Check WiFi, backend running
       │
       ├─ Invalid Address
       │  └─> "Address not found"
       │      → Try different address
       │
       ├─ No Routes
       │  └─> "No routes found"
       │      → Suggest alternatives
       │
       ├─ API Key Error
       │  └─> "API not configured"
       │      → Check .env file
       │
       └─ Permission Denied
          └─> "Location permission needed"
              → Open settings
```

## Performance Optimization

```
┌────────────────────────┐
│  User Types Address    │
└───────┬────────────────┘
        │
        ├─> Debounce (300ms)
        │   • Reduce API calls
        │   • Better UX
        │
        └─> Autocomplete
            • Show suggestions
            • Limit to 5 results
            ↓
┌────────────────────────┐
│  User Selects Route    │
└───────┬────────────────┘
        │
        ├─> Cache results
        │   • Reduce redundant calls
        │   • Faster repeat searches
        │
        └─> Format response
            • Parse once
            • Store in state
```

This visual guide helps understand how all pieces fit together!

