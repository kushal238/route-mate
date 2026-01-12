import express from 'express';
import cors from 'cors';
import { config } from './config';
import routes from './routes';
import { errorHandler } from './middleware/errorHandler';

const app = express();

// Middleware
app.use(cors({ origin: config.corsOrigin }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} ${req.method} ${req.path}`);
  next();
});

// Routes
app.use('/api', routes);

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    name: 'BusTracker API',
    version: '1.0.0',
    description: 'Address-to-address bus routing for Hyderabad',
    endpoints: {
      route: 'POST /api/route',
      geocode: 'GET /api/geocode?address=...',
      reverseGeocode: 'GET /api/reverse-geocode?lat=...&lng=...',
      placeAutocomplete: 'GET /api/places/autocomplete?input=...',
      placeDetails: 'GET /api/places/details?placeId=...',
      health: 'GET /api/health',
    },
  });
});

// Error handler (must be last)
app.use(errorHandler);

// Start server
app.listen(config.port, () => {
  console.log('');
  console.log('🚍 BusTracker API Server');
  console.log('========================');
  console.log(`🌍 Server running on port ${config.port}`);
  console.log(`📍 Environment: ${config.nodeEnv}`);
  console.log(`🔑 API Key configured: ${config.googleMapsApiKey ? '✅ Yes' : '❌ No'}`);
  console.log('');
  console.log(`📡 API endpoints available at:`);
  console.log(`   http://localhost:${config.port}/api`);
  console.log('');
  
  if (!config.googleMapsApiKey || config.googleMapsApiKey === 'your_api_key_here') {
    console.log('⚠️  WARNING: Google Maps API key not configured!');
    console.log('   Please create a .env file with your API key');
    console.log('   See .env.example for template');
    console.log('');
  }
});

