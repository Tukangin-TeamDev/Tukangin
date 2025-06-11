/**
 * Calculate distance between two coordinates using Haversine formula
 * @param lat1 Latitude of first point
 * @param lon1 Longitude of first point
 * @param lat2 Latitude of second point
 * @param lon2 Longitude of second point
 * @returns Distance in kilometers
 */
export const calculateDistance = (
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number => {
  // Radius of the Earth in kilometers
  const earthRadius = 6371;
  
  // Convert degrees to radians
  const toRadians = (degrees: number) => degrees * (Math.PI / 180);
  
  // Calculate differences
  const dLat = toRadians(lat2 - lat1);
  const dLon = toRadians(lon2 - lon1);
  
  // Calculate haversine formula
  const a = 
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRadians(lat1)) * Math.cos(toRadians(lat2)) * 
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  
  // Distance in kilometers
  const distance = earthRadius * c;
  
  return distance;
};

/**
 * Parse location string to coordinates
 * @param locationString Format: "lat,lng"
 * @returns Object with lat and lng
 */
export const parseLocation = (
  locationString: string
): { lat: number, lng: number } | null => {
  if (!locationString) return null;
  
  const parts = locationString.split(',');
  if (parts.length !== 2) return null;
  
  const lat = parseFloat(parts[0]);
  const lng = parseFloat(parts[1]);
  
  if (isNaN(lat) || isNaN(lng)) return null;
  
  return { lat, lng };
};

/**
 * Format coordinates to location string
 * @param lat Latitude
 * @param lng Longitude
 * @returns Location string in format "lat,lng"
 */
export const formatLocation = (lat: number, lng: number): string => {
  return `${lat},${lng}`;
};

/**
 * Calculate ETA based on distance
 * @param distance Distance in kilometers
 * @param speedKmh Average speed in km/h (default: 30)
 * @returns ETA in minutes
 */
export const calculateETA = (
  distance: number,
  speedKmh: number = 30
): number => {
  // Time in hours = distance / speed
  const timeHours = distance / speedKmh;
  
  // Convert to minutes
  const timeMinutes = Math.ceil(timeHours * 60);
  
  return timeMinutes;
};

/**
 * Check if location is within service radius
 * @param providerLat Provider latitude
 * @param providerLng Provider longitude
 * @param customerLat Customer latitude
 * @param customerLng Customer longitude
 * @param serviceRadius Service radius in kilometers
 * @returns Boolean indicating if within service radius
 */
export const isWithinServiceRadius = (
  providerLat: number,
  providerLng: number,
  customerLat: number,
  customerLng: number,
  serviceRadius: number
): boolean => {
  const distance = calculateDistance(
    providerLat,
    providerLng,
    customerLat,
    customerLng
  );
  
  return distance <= serviceRadius;
}; 