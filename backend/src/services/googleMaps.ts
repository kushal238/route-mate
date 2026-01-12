import { Client } from '@googlemaps/google-maps-services-js';
import { config } from '../config';

// Initialize Google Maps client
export const googleMapsClient = new Client({});

/**
 * Helper to make Google Maps API calls with error handling
 */
export async function callGoogleMapsAPI<T>(
  apiCall: () => Promise<T>
): Promise<T> {
  try {
    return await apiCall();
  } catch (error: any) {
    console.error('Google Maps API Error:', error.response?.data || error.message);
    throw new Error(
      error.response?.data?.error_message || 
      'Failed to communicate with Google Maps API'
    );
  }
}

/**
 * Format duration from seconds to human-readable string
 */
export function formatDuration(seconds: number): string {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  
  if (hours > 0) {
    return `${hours}h ${minutes}m`;
  }
  return `${minutes}m`;
}

/**
 * Format distance from meters to human-readable string
 */
export function formatDistance(meters: number): string {
  if (meters < 1000) {
    return `${Math.round(meters)}m`;
  }
  return `${(meters / 1000).toFixed(1)}km`;
}

/**
 * Check if API key is configured
 */
export function isAPIKeyConfigured(): boolean {
  return config.googleMapsApiKey.length > 0 && 
         config.googleMapsApiKey !== 'your_api_key_here';
}

