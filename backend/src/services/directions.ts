import { TravelMode, TransitMode } from '@googlemaps/google-maps-services-js';
import { googleMapsClient, callGoogleMapsAPI, formatDuration, formatDistance } from './googleMaps';
import { config } from '../config';
import { Coordinates, Route, RouteStep } from '../types';

/**
 * Get transit directions between two points
 */
export async function getTransitDirections(
  origin: Coordinates,
  destination: Coordinates,
  departureTime?: Date
): Promise<Route[]> {
  try {
    const params: any = {
      origin: `${origin.lat},${origin.lng}`,
      destination: `${destination.lat},${destination.lng}`,
      key: config.googleMapsApiKey,
      mode: TravelMode.transit,
      transit_mode: [TransitMode.bus, TransitMode.rail, TransitMode.subway], // Allow all transit types
      alternatives: true, // Get multiple route options
      region: 'in',
      language: 'en', // Ensure English responses
    };

    // Add departure time if provided, otherwise use current time
    if (departureTime) {
      params.departure_time = Math.floor(departureTime.getTime() / 1000);
    } else {
      params.departure_time = 'now';
    }

    const response = await callGoogleMapsAPI(() =>
      googleMapsClient.directions({ params })
    );

    if (response.data.routes.length === 0) {
      throw new Error('No transit routes found');
    }

    // Parse and format routes
    const routes: Route[] = response.data.routes.map((route) => {
      const leg = route.legs[0];
      
      // Calculate transfer count and walking distance
      let transferCount = 0;
      let walkingDistance = 0;
      let lastStepType = '';

      const steps: RouteStep[] = leg.steps.map((step, index) => {
        const stepType = step.travel_mode === 'TRANSIT' ? 
          (step.transit_details?.line.vehicle.type === 'BUS' ? 'bus' : 'metro') : 
          'walk';

        // Count transfers (when switching between transit vehicles)
        if (stepType !== 'walk' && lastStepType !== 'walk' && lastStepType !== '') {
          transferCount++;
        }
        lastStepType = stepType;

        // Sum walking distance
        if (stepType === 'walk') {
          walkingDistance += step.distance.value;
        }

        // Build route step
        const routeStep: RouteStep = {
          type: stepType,
          instruction: step.html_instructions.replace(/<[^>]*>/g, ''), // Remove HTML tags
          distance: step.distance.text,
          duration: step.duration.text,
          distanceMeters: step.distance.value,
          durationSeconds: step.duration.value,
          polyline: step.polyline.points,
        };

        // Add transit-specific information
        if (step.transit_details) {
          const transit = step.transit_details;
          routeStep.busNumber = transit.line.short_name || transit.line.name;
          routeStep.busName = transit.line.name;
          routeStep.departureStop = transit.departure_stop.name;
          routeStep.arrivalStop = transit.arrival_stop.name;
          routeStep.departureTime = transit.departure_time.text;
          routeStep.arrivalTime = transit.arrival_time.text;
          routeStep.numStops = transit.num_stops;
        }

        return routeStep;
      });

      return {
        summary: route.summary,
        duration: leg.duration.text,
        durationSeconds: leg.duration.value,
        distance: leg.distance.text,
        distanceMeters: leg.distance.value,
        steps,
        overviewPolyline: route.overview_polyline.points,
        departureTime: leg.departure_time?.text,
        arrivalTime: leg.arrival_time?.text,
        transferCount,
        walkingDistance: formatDistance(walkingDistance),
      };
    });

    // Sort routes by duration (fastest first)
    routes.sort((a, b) => a.durationSeconds - b.durationSeconds);

    return routes;
  } catch (error: any) {
    console.error('Directions error:', error.message);
    throw new Error(error.message || 'Failed to get transit directions');
  }
}

/**
 * Get walking directions between two points
 */
export async function getWalkingDirections(
  origin: Coordinates,
  destination: Coordinates
): Promise<Route> {
  try {
    const response = await callGoogleMapsAPI(() =>
      googleMapsClient.directions({
        params: {
          origin: `${origin.lat},${origin.lng}`,
          destination: `${destination.lat},${destination.lng}`,
          key: config.googleMapsApiKey,
          mode: TravelMode.walking,
          region: 'in',
        },
      })
    );

    if (response.data.routes.length === 0) {
      throw new Error('No walking route found');
    }

    const route = response.data.routes[0];
    const leg = route.legs[0];

    const steps: RouteStep[] = leg.steps.map((step) => ({
      type: 'walk',
      instruction: step.html_instructions.replace(/<[^>]*>/g, ''),
      distance: step.distance.text,
      duration: step.duration.text,
      distanceMeters: step.distance.value,
      durationSeconds: step.duration.value,
      polyline: step.polyline.points,
    }));

    return {
      summary: 'Walking route',
      duration: leg.duration.text,
      durationSeconds: leg.duration.value,
      distance: leg.distance.text,
      distanceMeters: leg.distance.value,
      steps,
      overviewPolyline: route.overview_polyline.points,
      transferCount: 0,
      walkingDistance: leg.distance.text,
    };
  } catch (error: any) {
    console.error('Walking directions error:', error.message);
    throw new Error(error.message || 'Failed to get walking directions');
  }
}

