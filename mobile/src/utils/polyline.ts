/**
 * Decode Google Maps polyline string into coordinates
 * Based on Google's Encoded Polyline Algorithm
 * https://developers.google.com/maps/documentation/utilities/polylinealgorithm
 */

export interface Coordinate {
  latitude: number;
  longitude: number;
}

export function decodePolyline(encoded: string): Coordinate[] {
  if (!encoded) {
    return [];
  }

  const coordinates: Coordinate[] = [];
  let index = 0;
  let lat = 0;
  let lng = 0;

  while (index < encoded.length) {
    // Decode latitude
    let shift = 0;
    let result = 0;
    let byte;

    do {
      byte = encoded.charCodeAt(index++) - 63;
      result |= (byte & 0x1f) << shift;
      shift += 5;
    } while (byte >= 0x20);

    const dlat = result & 1 ? ~(result >> 1) : result >> 1;
    lat += dlat;

    // Decode longitude
    shift = 0;
    result = 0;

    do {
      byte = encoded.charCodeAt(index++) - 63;
      result |= (byte & 0x1f) << shift;
      shift += 5;
    } while (byte >= 0x20);

    const dlng = result & 1 ? ~(result >> 1) : result >> 1;
    lng += dlng;

    coordinates.push({
      latitude: lat / 1e5,
      longitude: lng / 1e5,
    });
  }

  return coordinates;
}

/**
 * Decode multiple polylines and combine them
 * Useful for route steps
 */
export function decodeMultiplePolylines(polylines: string[]): Coordinate[] {
  return polylines.flatMap((polyline) => decodePolyline(polyline));
}

