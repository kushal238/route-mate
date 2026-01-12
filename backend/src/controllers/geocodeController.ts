import { Request, Response } from 'express';
import { 
  geocodeAddress, 
  reverseGeocode, 
  getPlaceAutocomplete,
  getPlaceDetails 
} from '../services/geocoding';
import { isAPIKeyConfigured } from '../services/googleMaps';

/**
 * GET /api/geocode?address=...
 * Geocode an address to coordinates
 */
export async function geocode(req: Request, res: Response) {
  try {
    if (!isAPIKeyConfigured()) {
      return res.status(500).json({
        success: false,
        error: 'Google Maps API key is not configured',
      });
    }

    const { address } = req.query;

    if (!address || typeof address !== 'string') {
      return res.status(400).json({
        success: false,
        error: 'Address parameter is required',
      });
    }

    const result = await geocodeAddress(address);
    res.json(result);
  } catch (error: any) {
    console.error('Geocode error:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to geocode address',
    });
  }
}

/**
 * GET /api/reverse-geocode?lat=...&lng=...
 * Reverse geocode coordinates to address
 */
export async function reverseGeocodeHandler(req: Request, res: Response) {
  try {
    if (!isAPIKeyConfigured()) {
      return res.status(500).json({
        success: false,
        error: 'Google Maps API key is not configured',
      });
    }

    const { lat, lng } = req.query;

    if (!lat || !lng) {
      return res.status(400).json({
        success: false,
        error: 'Both lat and lng parameters are required',
      });
    }

    const latitude = parseFloat(lat as string);
    const longitude = parseFloat(lng as string);

    if (isNaN(latitude) || isNaN(longitude)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid coordinates',
      });
    }

    const result = await reverseGeocode(latitude, longitude);
    res.json(result);
  } catch (error: any) {
    console.error('Reverse geocode error:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to reverse geocode',
    });
  }
}

/**
 * GET /api/places/autocomplete?input=...
 * Get place autocomplete suggestions
 */
export async function placeAutocomplete(req: Request, res: Response) {
  try {
    if (!isAPIKeyConfigured()) {
      return res.status(500).json({
        success: false,
        predictions: [],
        error: 'Google Maps API key is not configured',
      });
    }

    const { input } = req.query;

    if (!input || typeof input !== 'string') {
      return res.status(400).json({
        success: false,
        predictions: [],
        error: 'Input parameter is required',
      });
    }

    const result = await getPlaceAutocomplete(input);
    res.json(result);
  } catch (error: any) {
    console.error('Place autocomplete error:', error);
    res.status(500).json({
      success: false,
      predictions: [],
      error: error.message || 'Failed to get place suggestions',
    });
  }
}

/**
 * GET /api/places/details?placeId=...
 * Get place details by place ID
 */
export async function placeDetailsHandler(req: Request, res: Response) {
  try {
    if (!isAPIKeyConfigured()) {
      return res.status(500).json({
        success: false,
        error: 'Google Maps API key is not configured',
      });
    }

    const { placeId } = req.query;

    if (!placeId || typeof placeId !== 'string') {
      return res.status(400).json({
        success: false,
        error: 'placeId parameter is required',
      });
    }

    const result = await getPlaceDetails(placeId);
    res.json(result);
  } catch (error: any) {
    console.error('Place details error:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to get place details',
    });
  }
}

