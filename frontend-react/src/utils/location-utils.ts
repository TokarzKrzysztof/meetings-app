import { UserLocation } from 'src/models/user-location';

export const getDistanceFromLatLonInKm = (loc1: UserLocation, loc2: UserLocation) => {
  const R = 6371; // Radius of the earth in km
  const dLat = deg2rad(loc2.lat - loc1.lat); // deg2rad below
  const dLon = deg2rad(loc2.lng - loc1.lng);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(loc1.lat)) *
      Math.cos(deg2rad(loc2.lat)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const d = R * c; // Distance in km
  return d;
};

const deg2rad = (deg: number) => {
  return deg * (Math.PI / 180);
};
