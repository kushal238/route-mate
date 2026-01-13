import axios from 'axios';
import { RouteResponse, PlacePrediction, Coordinates } from '../types';

// TODO: Update this to your backend URL
// For Android emulator: use 10.0.2.2 to reach host machine
// For physical device: use your Mac's IP (get with: ipconfig getifaddr en0)
const API_BASE_URL = 'http://10.0.2.2:3000/api'; // Android emulator special IP

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request/response interceptors for debugging
api.interceptors.request.use(
  (config) => {
    console.log('API Request:', config.method?.toUpperCase(), config.url);
    return config;
  },
  (error) => {
    console.error('API Request Error:', error);
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => {
    console.log('API Response:', response.status, response.config.url);
    return response;
  },
  (error) => {
    console.error('API Response Error:', error.response?.status, error.message);
    return Promise.reject(error);
  }
);

export interface GetRouteParams {
  from: string | Coordinates;
  to: string | Coordinates;
  departureTime?: string;
  mode?: 'transit' | 'walking';
}

/**
 * Get transit route between two locations
 */
export async function getRoute(params: GetRouteParams): Promise<RouteResponse> {
  try {
    const response = await api.post<RouteResponse>('/route', params);
    return response.data;
  } catch (error: any) {
    console.error('Get route error:', error);
    return {
      success: false,
      routes: [],
      from: { formatted: '', coordinates: { lat: 0, lng: 0 } },
      to: { formatted: '', coordinates: { lat: 0, lng: 0 } },
      error: error.response?.data?.error || error.message || 'Failed to get route',
    };
  }
}

/**
 * Get place autocomplete suggestions
 */
export async function getPlaceAutocomplete(
  input: string
): Promise<PlacePrediction[]> {
  try {
    if (!input || input.length < 2) {
      return [];
    }

    const response = await api.get('/places/autocomplete', {
      params: { input },
    });

    if (response.data.success) {
      return response.data.predictions;
    }
    return [];
  } catch (error: any) {
    console.error('Place autocomplete error:', error);
    return [];
  }
}

/**
 * Geocode an address
 */
export async function geocodeAddress(address: string) {
  try {
    const response = await api.get('/geocode', {
      params: { address },
    });
    return response.data;
  } catch (error: any) {
    console.error('Geocode error:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Reverse geocode coordinates
 */
export async function reverseGeocode(lat: number, lng: number) {
  try {
    const response = await api.get('/reverse-geocode', {
      params: { lat, lng },
    });
    return response.data;
  } catch (error: any) {
    console.error('Reverse geocode error:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Health check
 */
export async function checkHealth() {
  try {
    const response = await api.get('/health');
    return response.data;
  } catch (error: any) {
    console.error('Health check error:', error);
    throw error;
  }
}

export default api;

