export interface Coordinates {
  lat: number;
  lng: number;
}

export interface Address {
  formatted: string;
  coordinates: Coordinates;
}

export interface RouteStep {
  type: 'walk' | 'bus' | 'metro';
  instruction: string;
  distance: string;
  duration: string;
  distanceMeters: number;
  durationSeconds: number;
  busNumber?: string;
  busName?: string;
  departureStop?: string;
  arrivalStop?: string;
  departureTime?: string;
  arrivalTime?: string;
  numStops?: number;
  polyline: string;
}

export interface Route {
  summary: string;
  duration: string;
  durationSeconds: number;
  distance: string;
  distanceMeters: number;
  steps: RouteStep[];
  overviewPolyline: string;
  departureTime?: string;
  arrivalTime?: string;
  transferCount: number;
  walkingDistance: string;
}

export interface RouteResponse {
  success: boolean;
  routes: Route[];
  from: Address;
  to: Address;
  error?: string;
}

export interface PlacePrediction {
  description: string;
  placeId: string;
  mainText: string;
  secondaryText: string;
}

