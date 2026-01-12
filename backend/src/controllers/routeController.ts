import { Request, Response } from 'express';
import { geocodeAddress, getPlaceDetails } from '../services/geocoding';
import { getTransitDirections, getWalkingDirections } from '../services/directions';
import { Coordinates, RouteRequest, RouteResponse } from '../types';
import { isAPIKeyConfigured } from '../services/googleMaps';

/**
 * Parse location input (can be address string or coordinates)
 */
async function parseLocation(
  location: string | Coordinates
): Promise<{ coordinates: Coordinates; formatted: string }> {
  // If it's already coordinates
  if (typeof location === 'object' && 'lat' in location && 'lng' in location) {
    return {
      coordinates: location,
      formatted: `${location.lat.toFixed(6)}, ${location.lng.toFixed(6)}`,
    };
  }

  // If it's an address string, geocode it
  const result = await geocodeAddress(location as string);
  if (!result.success || !result.address) {
    throw new Error(`Failed to geocode address: ${location}`);
  }

  return {
    coordinates: result.address.coordinates,
    formatted: result.address.formatted,
  };
}

/**
 * POST /api/route
 * Get transit route between two locations
 */
export async function getRoute(req: Request, res: Response) {
  try {
    // Check if API key is configured
    if (!isAPIKeyConfigured()) {
      return res.status(500).json({
        success: false,
        error: 'Google Maps API key is not configured. Please add it to .env file.',
        routes: [],
      });
    }

    const { from, to, departureTime, mode }: RouteRequest = req.body;

    // Validate input
    if (!from || !to) {
      return res.status(400).json({
        success: false,
        error: 'Both "from" and "to" locations are required',
        routes: [],
      });
    }

    // Parse origin and destination
    const origin = await parseLocation(from);
    const destination = await parseLocation(to);

    // Get routes based on mode
    let routes;
    if (mode === 'walking') {
      const route = await getWalkingDirections(
        origin.coordinates,
        destination.coordinates
      );
      routes = [route];
    } else {
      // Default to transit
      const departureDate = departureTime ? new Date(departureTime) : undefined;
      routes = await getTransitDirections(
        origin.coordinates,
        destination.coordinates,
        departureDate
      );
    }

    const response: RouteResponse = {
      success: true,
      routes,
      from: {
        formatted: origin.formatted,
        coordinates: origin.coordinates,
      },
      to: {
        formatted: destination.formatted,
        coordinates: destination.coordinates,
      },
    };

    res.json(response);
  } catch (error: any) {
    console.error('Route controller error:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to get route',
      routes: [],
    });
  }
}

