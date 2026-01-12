import { googleMapsClient, callGoogleMapsAPI } from './googleMaps';
import { config } from '../config';
import { Coordinates, Address, GeocodeResult } from '../types';

/**
 * Geocode an address to coordinates
 * Biased towards Hyderabad for better accuracy
 */
export async function geocodeAddress(address: string): Promise<GeocodeResult> {
  try {
    const response = await callGoogleMapsAPI(() =>
      googleMapsClient.geocode({
        params: {
          address,
          key: config.googleMapsApiKey,
          // Bias results towards Hyderabad
          components: { country: 'IN' },
          region: 'in',
        },
      })
    );

    if (response.data.results.length === 0) {
      return {
        success: false,
        error: 'Address not found',
      };
    }

    const result = response.data.results[0];
    
    // Check if result is reasonably close to Hyderabad
    const location = result.geometry.location;
    const distance = calculateDistance(
      config.hyderabad.lat,
      config.hyderabad.lng,
      location.lat,
      location.lng
    );

    // Warn if address is far from Hyderabad (> 100km)
    if (distance > 100000) {
      console.warn(`Address "${address}" is ${(distance/1000).toFixed(1)}km from Hyderabad`);
    }

    return {
      success: true,
      address: {
        formatted: result.formatted_address,
        coordinates: {
          lat: location.lat,
          lng: location.lng,
        },
      },
    };
  } catch (error: any) {
    console.error('Geocoding error:', error.message);
    return {
      success: false,
      error: error.message || 'Failed to geocode address',
    };
  }
}

/**
 * Reverse geocode coordinates to an address
 */
export async function reverseGeocode(
  lat: number,
  lng: number
): Promise<GeocodeResult> {
  try {
    const response = await callGoogleMapsAPI(() =>
      googleMapsClient.reverseGeocode({
        params: {
          latlng: { lat, lng },
          key: config.googleMapsApiKey,
        },
      })
    );

    if (response.data.results.length === 0) {
      return {
        success: false,
        error: 'Location not found',
      };
    }

    const result = response.data.results[0];

    return {
      success: true,
      address: {
        formatted: result.formatted_address,
        coordinates: { lat, lng },
      },
    };
  } catch (error: any) {
    console.error('Reverse geocoding error:', error.message);
    return {
      success: false,
      error: error.message || 'Failed to reverse geocode location',
    };
  }
}

/**
 * Get place autocomplete suggestions
 * Biased towards Hyderabad
 */
export async function getPlaceAutocomplete(input: string) {
  try {
    const response = await callGoogleMapsAPI(() =>
      googleMapsClient.placeAutocomplete({
        params: {
          input,
          key: config.googleMapsApiKey,
          // Bias towards Hyderabad - location must be a string "lat,lng"
          location: `${config.hyderabad.lat},${config.hyderabad.lng}`,
          radius: config.hyderabad.radius,
          // Components must be an array of strings
          components: ['country:in'],
        },
      })
    );

    return {
      success: true,
      predictions: response.data.predictions.map((p) => ({
        description: p.description,
        placeId: p.place_id,
        mainText: p.structured_formatting.main_text,
        secondaryText: p.structured_formatting.secondary_text,
      })),
    };
  } catch (error: any) {
    console.error('Place autocomplete error:', error.message);
    return {
      success: false,
      predictions: [],
      error: error.message || 'Failed to get place suggestions',
    };
  }
}

/**
 * Get coordinates from place ID
 */
export async function getPlaceDetails(placeId: string): Promise<GeocodeResult> {
  try {
    const response = await callGoogleMapsAPI(() =>
      googleMapsClient.placeDetails({
        params: {
          place_id: placeId,
          key: config.googleMapsApiKey,
          fields: ['formatted_address', 'geometry'],
        },
      })
    );

    const result = response.data.result;

    return {
      success: true,
      address: {
        formatted: result.formatted_address || '',
        coordinates: {
          lat: result.geometry?.location.lat || 0,
          lng: result.geometry?.location.lng || 0,
        },
      },
    };
  } catch (error: any) {
    console.error('Place details error:', error.message);
    return {
      success: false,
      error: error.message || 'Failed to get place details',
    };
  }
}

/**
 * Calculate distance between two coordinates in meters
 * Using Haversine formula
 */
function calculateDistance(
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number
): number {
  const R = 6371e3; // Earth's radius in meters
  const φ1 = (lat1 * Math.PI) / 180;
  const φ2 = (lat2 * Math.PI) / 180;
  const Δφ = ((lat2 - lat1) * Math.PI) / 180;
  const Δλ = ((lng2 - lng1) * Math.PI) / 180;

  const a =
    Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
    Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c;
}

