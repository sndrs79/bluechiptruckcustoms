import { normalizeCityName } from "./text.js";

/**
 * Bundled Greater Houston / Southeast Texas city coordinates.
 * Used for the distance-radius filter. No geocoding API, no Nominatim, no paid map.
 * Coordinates are approximate city-center values from public geographic facts.
 * Shows or origins not in this table cannot be distance-filtered and must
 * not be silently treated as in-range.
 */
export const REGION = "Greater Houston / Southeast Texas";

export const CITIES = [
  { name: "Houston", state: "TX", lat: 29.7604, lng: -95.3698, aliases: ["htx", "downtown houston", "houston tx"] },
  { name: "Conroe", state: "TX", lat: 30.3119, lng: -95.4561, aliases: [] },
  { name: "The Woodlands", state: "TX", lat: 30.1658, lng: -95.4613, aliases: ["woodlands"] },
  { name: "Spring", state: "TX", lat: 30.0799, lng: -95.4172, aliases: [] },
  { name: "Tomball", state: "TX", lat: 30.0972, lng: -95.6161, aliases: [] },
  { name: "Cypress", state: "TX", lat: 29.9691, lng: -95.6972, aliases: [] },
  { name: "Katy", state: "TX", lat: 29.7858, lng: -95.8245, aliases: [] },
  { name: "Sugar Land", state: "TX", lat: 29.6197, lng: -95.6349, aliases: ["sugarland"] },
  { name: "Missouri City", state: "TX", lat: 29.6186, lng: -95.5377, aliases: [] },
  { name: "Stafford", state: "TX", lat: 29.6161, lng: -95.5577, aliases: [] },
  { name: "Pearland", state: "TX", lat: 29.5636, lng: -95.2860, aliases: [] },
  { name: "Pasadena", state: "TX", lat: 29.6911, lng: -95.2091, aliases: [] },
  { name: "Baytown", state: "TX", lat: 29.7355, lng: -94.9774, aliases: [] },
  { name: "League City", state: "TX", lat: 29.5075, lng: -95.0949, aliases: [] },
  { name: "Galveston", state: "TX", lat: 29.3013, lng: -94.7977, aliases: [] },
  { name: "Texas City", state: "TX", lat: 29.3838, lng: -94.9027, aliases: [] },
  { name: "Humble", state: "TX", lat: 29.9988, lng: -95.2622, aliases: [] },
  { name: "Kingwood", state: "TX", lat: 30.0502, lng: -95.1847, aliases: [] },
  { name: "Cleveland", state: "TX", lat: 30.3416, lng: -95.0924, aliases: [] },
  { name: "Huntsville", state: "TX", lat: 30.7235, lng: -95.5508, aliases: [] },
  { name: "Willis", state: "TX", lat: 30.4249, lng: -95.4799, aliases: [] },
  { name: "Montgomery", state: "TX", lat: 30.3883, lng: -95.6963, aliases: [] },
  { name: "Magnolia", state: "TX", lat: 30.2094, lng: -95.7508, aliases: [] },
  { name: "Brenham", state: "TX", lat: 30.1669, lng: -96.3977, aliases: [] },
  { name: "Bryan", state: "TX", lat: 30.6744, lng: -96.3700, aliases: [] },
  { name: "College Station", state: "TX", lat: 30.6280, lng: -96.3344, aliases: [] },
  { name: "Navasota", state: "TX", lat: 30.3877, lng: -96.0877, aliases: [] },
  { name: "Richmond", state: "TX", lat: 29.5822, lng: -95.7608, aliases: [] },
  { name: "Rosenberg", state: "TX", lat: 29.5572, lng: -95.8086, aliases: [] },
  { name: "Friendswood", state: "TX", lat: 29.5294, lng: -95.2010, aliases: [] },
  { name: "Alvin", state: "TX", lat: 29.4238, lng: -95.2441, aliases: [] },
  { name: "Angleton", state: "TX", lat: 29.1694, lng: -95.4319, aliases: [] },
  { name: "Lake Jackson", state: "TX", lat: 29.0339, lng: -95.4344, aliases: [] },
  { name: "Freeport", state: "TX", lat: 28.9541, lng: -95.3597, aliases: [] },
  { name: "Beaumont", state: "TX", lat: 30.0802, lng: -94.1266, aliases: [] },
  { name: "Port Arthur", state: "TX", lat: 29.8850, lng: -93.9399, aliases: [] },
  { name: "Orange", state: "TX", lat: 30.0930, lng: -93.7365, aliases: [] },
  { name: "Nederland", state: "TX", lat: 29.9744, lng: -94.0005, aliases: [] },
  { name: "Groves", state: "TX", lat: 29.9483, lng: -93.9171, aliases: [] },
  { name: "Lumberton", state: "TX", lat: 30.2660, lng: -94.1999, aliases: [] },
  { name: "Dayton", state: "TX", lat: 30.0466, lng: -94.8852, aliases: [] },
  { name: "Liberty", state: "TX", lat: 30.0577, lng: -94.7955, aliases: [] },
  { name: "Anahuac", state: "TX", lat: 29.7730, lng: -94.6827, aliases: [] },
  { name: "Crosby", state: "TX", lat: 29.9116, lng: -95.0627, aliases: [] },
  { name: "La Porte", state: "TX", lat: 29.6658, lng: -95.0194, aliases: [] },
  { name: "Deer Park", state: "TX", lat: 29.7052, lng: -95.1238, aliases: [] },
  { name: "Seabrook", state: "TX", lat: 29.5641, lng: -95.0255, aliases: [] },
  { name: "Kemah", state: "TX", lat: 29.5425, lng: -95.0202, aliases: [] },
  { name: "Dickinson", state: "TX", lat: 29.4608, lng: -95.0513, aliases: [] },
  { name: "Santa Fe", state: "TX", lat: 29.3780, lng: -95.1058, aliases: [] },
  { name: "Bellaire", state: "TX", lat: 29.7058, lng: -95.4588, aliases: [] },
  { name: "West University Place", state: "TX", lat: 29.7180, lng: -95.4338, aliases: ["west university", "west u"] },
  { name: "Jersey Village", state: "TX", lat: 29.8908, lng: -95.5630, aliases: [] },
  { name: "Brookshire", state: "TX", lat: 29.7861, lng: -95.9511, aliases: [] },
  { name: "Waller", state: "TX", lat: 30.0566, lng: -95.9266, aliases: [] },
  { name: "Hempstead", state: "TX", lat: 30.0974, lng: -96.0788, aliases: [] },
  { name: "Prairie View", state: "TX", lat: 30.0930, lng: -95.9877, aliases: [] },
  { name: "New Caney", state: "TX", lat: 30.1552, lng: -95.2113, aliases: [] },
  { name: "Porter", state: "TX", lat: 30.1016, lng: -95.2374, aliases: [] },
  { name: "Splendora", state: "TX", lat: 30.2327, lng: -95.1677, aliases: [] },
  { name: "Huffman", state: "TX", lat: 30.0708, lng: -95.0974, aliases: [] },
  { name: "Bay City", state: "TX", lat: 28.9828, lng: -95.9694, aliases: [] },
  { name: "Wharton", state: "TX", lat: 29.3116, lng: -96.1027, aliases: [] },
  { name: "El Campo", state: "TX", lat: 29.1966, lng: -96.2697, aliases: [] },
  { name: "Sealy", state: "TX", lat: 29.7808, lng: -96.1572, aliases: [] },
  { name: "Fulshear", state: "TX", lat: 29.6930, lng: -95.8997, aliases: [] },
  { name: "Needville", state: "TX", lat: 29.3994, lng: -95.8377, aliases: [] },
  { name: "Hitchcock", state: "TX", lat: 29.3486, lng: -95.0160, aliases: [] },
  { name: "La Marque", state: "TX", lat: 29.3688, lng: -94.9713, aliases: ["lamarque"] },
  { name: "Webster", state: "TX", lat: 29.5377, lng: -95.1183, aliases: [] },
  { name: "Clear Lake", state: "TX", lat: 29.5623, lng: -95.1238, aliases: ["clear lake city"] },
  { name: "Channelview", state: "TX", lat: 29.7761, lng: -95.1147, aliases: [] },
  { name: "Jacinto City", state: "TX", lat: 29.7675, lng: -95.2338, aliases: [] },
  { name: "Galena Park", state: "TX", lat: 29.7336, lng: -95.2302, aliases: [] },
  { name: "South Houston", state: "TX", lat: 29.6630, lng: -95.2355, aliases: [] },
  { name: "Alief", state: "TX", lat: 29.7088, lng: -95.5933, aliases: [] },
  { name: "Memorial", state: "TX", lat: 29.7636, lng: -95.5477, aliases: ["memorial city"] },
  { name: "Oak Ridge North", state: "TX", lat: 30.1605, lng: -95.4444, aliases: [] },
  { name: "Shenandoah", state: "TX", lat: 30.1802, lng: -95.4560, aliases: [] },
  { name: "Cut and Shoot", state: "TX", lat: 30.3333, lng: -95.3558, aliases: ["cut & shoot"] },
  { name: "Shepherd", state: "TX", lat: 30.4977, lng: -94.9966, aliases: [] },
  { name: "Livingston", state: "TX", lat: 30.7110, lng: -94.9327, aliases: [] },
  { name: "Silsbee", state: "TX", lat: 30.3494, lng: -94.1780, aliases: [] },
  { name: "Vidor", state: "TX", lat: 30.1316, lng: -94.0132, aliases: [] },
  { name: "Bridge City", state: "TX", lat: 30.0205, lng: -93.8435, aliases: [] },
  { name: "Winnie", state: "TX", lat: 29.8202, lng: -94.3841, aliases: [] },
  { name: "Mont Belvieu", state: "TX", lat: 29.8477, lng: -94.8908, aliases: ["montbelvieu"] },
  { name: "Pinehurst", state: "TX", lat: 30.1736, lng: -95.3963, aliases: [] }
];

export function findCity(name, state) {
  const n = normalizeCityName(name);
  if (!n) return null;
  const st = String(state || "TX").trim().toUpperCase() || "TX";
  const matches = CITIES.filter((c) => {
    if (c.state !== st) return false;
    if (normalizeCityName(c.name) === n) return true;
    return (c.aliases || []).some((a) => normalizeCityName(a) === n);
  });
  return matches[0] || null;
}

export function coordsForCity(name, state) {
  const city = findCity(name, state);
  return city ? { lat: city.lat, lng: city.lng, city: city.name, state: city.state } : null;
}

export function cityNames() {
  return CITIES.map((c) => c.name).sort((a, b) => a.localeCompare(b));
}
