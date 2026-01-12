# BusTracker Backend API

Address-to-address bus routing API for Hyderabad using Google Maps Platform.

## Setup

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Configure environment variables:**
   ```bash
   cp .env.example .env
   ```
   Then edit `.env` and add your Google Maps API key.

3. **Start development server:**
   ```bash
   npm run dev
   ```

The API will be available at `http://localhost:3000`

## API Endpoints

### POST /api/route
Get transit route between two locations.

**Request body:**
```json
{
  "from": "HITEC City, Hyderabad",
  "to": "Charminar, Hyderabad",
  "departureTime": "2024-01-15T09:00:00Z",
  "mode": "transit"
}
```

**Response:**
```json
{
  "success": true,
  "routes": [
    {
      "summary": "Route via bus 65",
      "duration": "45m",
      "distance": "15.2km",
      "steps": [...]
    }
  ],
  "from": {...},
  "to": {...}
}
```

### GET /api/geocode?address=...
Convert address to coordinates.

### GET /api/places/autocomplete?input=...
Get place suggestions for autocomplete.

### GET /api/health
Health check endpoint.

## Testing

Test the API using curl or Postman:

```bash
# Health check
curl http://localhost:3000/api/health

# Get route
curl -X POST http://localhost:3000/api/route \
  -H "Content-Type: application/json" \
  -d '{
    "from": "HITEC City, Hyderabad",
    "to": "Charminar, Hyderabad"
  }'
```

## Google Maps API Setup

1. Go to https://console.cloud.google.com
2. Create a new project
3. Enable these APIs:
   - Directions API
   - Geocoding API
   - Places API
4. Create an API key in Credentials
5. Add the key to your `.env` file

## Project Structure

```
src/
├── config/          # Configuration
├── controllers/     # Request handlers
├── services/        # Business logic
│   ├── googleMaps.ts    # Google Maps client
│   ├── geocoding.ts     # Geocoding service
│   └── directions.ts    # Directions service
├── routes/          # API routes
├── middleware/      # Express middleware
├── types/           # TypeScript types
└── index.ts         # Server entry point
```

