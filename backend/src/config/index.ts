import dotenv from 'dotenv';

dotenv.config();

export const config = {
  port: process.env.PORT || 3000,
  nodeEnv: process.env.NODE_ENV || 'development',
  googleMapsApiKey: process.env.GOOGLE_MAPS_API_KEY || '',
  corsOrigin: process.env.CORS_ORIGIN || '*',
  
  // Hyderabad coordinates for biasing searches
  hyderabad: {
    lat: 17.3850,
    lng: 78.4867,
    radius: 50000, // 50km radius
  },
};

// Validate required config
if (!config.googleMapsApiKey) {
  console.warn('⚠️  WARNING: GOOGLE_MAPS_API_KEY is not set in .env file');
  console.warn('   The API will not work without a valid Google Maps API key');
  console.warn('   Please create a .env file based on .env.example');
}

