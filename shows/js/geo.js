/** Haversine distance in miles. Earth radius 3958.7613 miles. */
const EARTH_MILES = 3958.7613;

function toRad(deg) {
  return (deg * Math.PI) / 180;
}

export function milesBetween(lat1, lng1, lat2, lng2) {
  if (![lat1, lng1, lat2, lng2].every((n) => Number.isFinite(Number(n)))) {
    return null;
  }
  const a1 = Number(lat1);
  const o1 = Number(lng1);
  const a2 = Number(lat2);
  const o2 = Number(lng2);
  const dLat = toRad(a2 - a1);
  const dLng = toRad(o2 - o1);
  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(a1)) * Math.cos(toRad(a2)) * Math.sin(dLng / 2) ** 2;
  const miles = 2 * EARTH_MILES * Math.asin(Math.min(1, Math.sqrt(h)));
  return miles;
}

export function isInRadius(origin, point, radiusMiles) {
  const radius = Number(radiusMiles);
  if (!Number.isFinite(radius) || radius < 0) return false;
  const d = milesBetween(origin.lat, origin.lng, point.lat, point.lng);
  if (d == null) return false;
  // Inclusive at the exact radius. Never return out-of-range results.
  return d <= radius + 1e-9;
}
