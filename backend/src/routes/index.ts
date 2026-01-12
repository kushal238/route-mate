import { Router } from 'express';
import { getRoute } from '../controllers/routeController';
import {
  geocode,
  reverseGeocodeHandler,
  placeAutocomplete,
  placeDetailsHandler,
} from '../controllers/geocodeController';

const router = Router();

// Route endpoints
router.post('/route', getRoute);

// Geocoding endpoints
router.get('/geocode', geocode);
router.get('/reverse-geocode', reverseGeocodeHandler);

// Places endpoints
router.get('/places/autocomplete', placeAutocomplete);
router.get('/places/details', placeDetailsHandler);

// Health check endpoint
router.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    service: 'BusTracker API',
  });
});

export default router;

