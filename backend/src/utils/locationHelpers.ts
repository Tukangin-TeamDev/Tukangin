/**
 * Calculate distance between two coordinate points using haversine formula
 * @param lat1 Latitude of point 1
 * @param lon1 Longitude of point 1
 * @param lat2 Latitude of point 2
 * @param lon2 Longitude of point 2
 * @returns Distance in kilometers
 */
export const calculateDistance = (
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number => {
  const R = 6371; // Radius of Earth in kilometers
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;

  return distance;
};

/**
 * Parse location string to coordinates
 * @param locationString Format: "lat,lng"
 * @returns Object with lat and lng
 */
export const parseLocation = (locationString: string): { lat: number; lng: number } | null => {
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
 * Calculate ETA (Estimated Time of Arrival) based on current location and destination
 * @param origin Origin coordinates (provider's current location)
 * @param destination Destination coordinates (customer's location)
 * @param avgSpeedKmh Average speed in km/h, defaults to 30 km/h
 * @returns Estimated time of arrival as a Date object
 */
export const calculateETA = (
  origin: { latitude: number; longitude: number },
  destination: { latitude: number; longitude: number },
  avgSpeedKmh = 30
): Date => {
  const distance = calculateDistance(
    origin.latitude,
    origin.longitude,
    destination.latitude,
    destination.longitude
  );

  // Calculate travel time in milliseconds
  const travelTimeMs = (distance / avgSpeedKmh) * 60 * 60 * 1000;

  // Add travel time to current time to get ETA
  const eta = new Date();
  eta.setTime(eta.getTime() + travelTimeMs);

  return eta;
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
  const distance = calculateDistance(providerLat, providerLng, customerLat, customerLng);

  return distance <= serviceRadius;
};

/**
 * Get address from coordinates using geocoding service
 * @param latitude Latitude
 * @param longitude Longitude
 * @returns Promise with address string
 */
export const getAddressFromCoords = async (
  latitude: number,
  longitude: number
): Promise<string> => {
  // Implementation would typically use a geocoding service like Google Maps API
  // For now, just return the coordinates as a string
  return `${latitude}, ${longitude}`;
};

/**
 * Calculate region info for map display
 * @param latitude Center latitude
 * @param longitude Center longitude
 * @param latitudeDelta Optional latitude delta, defaults to 0.01
 * @param longitudeDelta Optional longitude delta, defaults to 0.01
 * @returns Region object for map display
 */
export const calculateRegion = (
  latitude: number,
  longitude: number,
  latitudeDelta = 0.01,
  longitudeDelta = 0.01
) => {
  return {
    latitude,
    longitude,
    latitudeDelta,
    longitudeDelta,
  };
};
