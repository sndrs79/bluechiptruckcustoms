import { coordsForCity } from "./cities.js";
import { isPastShow, isIsoDate } from "./clock.js";
import { isInRadius, milesBetween } from "./geo.js";
import { normalizeCityName, normalizeTitle } from "./text.js";
import { displayFee } from "./fees.js";

/**
 * Client-side and unit-tested filters.
 * Default: upcoming only, soonest first. Past shows are hidden.
 * Cancelled shows stay visible when upcoming, clearly marked.
 * Distance must only return in-range results; unknown coordinates are excluded.
 */
export function filterShows(shows, options = {}, todayYmd) {
  const opts = options || {};
  const list = Array.isArray(shows) ? shows.slice() : [];
  const problems = [];
  let rows = list;

  const includePast = opts.includePast === true;
  if (!includePast) {
    rows = rows.filter((s) => !isPastShow(s, todayYmd));
  }

  if (opts.dateFrom && isIsoDate(opts.dateFrom)) {
    rows = rows.filter((s) => (s.end_date || s.date) >= opts.dateFrom);
  }
  if (opts.dateTo && isIsoDate(opts.dateTo)) {
    rows = rows.filter((s) => s.date <= opts.dateTo);
  }

  if (opts.city) {
    const want = normalizeCityName(opts.city);
    rows = rows.filter((s) => normalizeCityName(s.city) === want);
  }

  if (opts.classicTrucksWelcome === true) {
    rows = rows.filter((s) => Boolean(s.classic_trucks_welcome));
  }

  if (opts.status) {
    rows = rows.filter((s) => s.status === opts.status);
  }

  let excludedNoCoords = 0;
  const radius = opts.radiusMiles != null && opts.radiusMiles !== "" ? Number(opts.radiusMiles) : null;
  const originName = opts.originCity || opts.fromCity;
  if (originName && radius != null) {
    if (!Number.isFinite(radius) || radius < 0) {
      problems.push("Distance radius must be a number of miles, 0 or greater.");
      rows = [];
    } else {
      const origin = coordsForCity(originName, opts.originState || "TX");
      if (!origin) {
        problems.push(
          `“${originName}” is not in the bundled Greater Houston / Southeast Texas city table, so a distance filter cannot run. Pick a listed city. No results are shown, rather than a guessed list.`
        );
        rows = [];
      } else {
        const kept = [];
        for (const s of rows) {
          const point = coordsOfShow(s);
          if (!point) {
            excludedNoCoords += 1;
            continue;
          }
          if (isInRadius(origin, point, radius)) {
            kept.push({
              ...s,
              _distance_miles: roundMiles(milesBetween(origin.lat, origin.lng, point.lat, point.lng))
            });
          }
        }
        rows = kept;
      }
    }
  }

  rows.sort((a, b) => {
    const ad = a.date || "";
    const bd = b.date || "";
    if (ad !== bd) return ad < bd ? -1 : 1;
    const at = a.start_time || "";
    const bt = b.start_time || "";
    if (at !== bt) return at < bt ? -1 : 1;
    return String(a.title || "").localeCompare(String(b.title || ""));
  });

  return {
    shows: rows,
    count: rows.length,
    excludedNoCoords,
    problems
  };
}

export function hasCoords(show) {
  const lat = show.lat;
  const lng = show.lng;
  if (lat == null || lng == null || lat === "" || lng === "") return false;
  return Number.isFinite(Number(lat)) && Number.isFinite(Number(lng));
}

export function coordsOfShow(show) {
  if (hasCoords(show)) {
    return { lat: Number(show.lat), lng: Number(show.lng) };
  }
  return coordsForCity(show.city, show.state || "TX");
}

function roundMiles(n) {
  if (n == null) return null;
  return Math.round(n * 10) / 10;
}

export function publicFeeView(show) {
  return {
    spectator_fee_label: displayFee(show.spectator_fee),
    car_entry_fee_label: displayFee(show.car_entry_fee)
  };
}

export function directionsUrl(show) {
  const parts = [
    show.street_address,
    show.city,
    [show.state, show.zip].filter(Boolean).join(" ")
  ]
    .filter(Boolean)
    .join(", ");
  if (!parts) return "";
  return "https://maps.google.com/?q=" + encodeURIComponent(parts);
}

export function matchesQuery(show, q) {
  const needle = normalizeTitle(q);
  if (!needle) return true;
  const hay = normalizeTitle(
    [show.title, show.city, show.venue_name, show.street_address, show.organizer_name].join(" ")
  );
  return hay.includes(needle);
}
