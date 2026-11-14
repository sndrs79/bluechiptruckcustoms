/** Calendar dates in America/Chicago, independent of the box/server zone. */
export const TIMEZONE = "America/Chicago";

export function chicagoYmd(at = new Date()) {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: TIMEZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit"
  }).formatToParts(at instanceof Date ? at : new Date(at));
  const get = (t) => parts.find((p) => p.type === t).value;
  return `${get("year")}-${get("month")}-${get("day")}`;
}

export function isIsoDate(value) {
  return /^\d{4}-\d{2}-\d{2}$/.test(String(value || ""));
}

export function isIsoTime(value) {
  return /^([01]\d|2[0-3]):[0-5]\d$/.test(String(value || ""));
}

/** A show is past when its end date (or start date if no end) is before today in Chicago. */
export function isPastShow(show, todayYmd) {
  const today = todayYmd || chicagoYmd();
  const end = show.end_date || show.endDate || show.date;
  if (!isIsoDate(end) || !isIsoDate(today)) return false;
  return end < today;
}

export function isUpcomingShow(show, todayYmd) {
  return !isPastShow(show, todayYmd);
}

export function formatDateWithYear(iso, timeZone = TIMEZONE) {
  if (!isIsoDate(iso)) return iso || "";
  const [y, m, d] = iso.split("-").map(Number);
  const utc = new Date(Date.UTC(y, m - 1, d, 18, 0, 0));
  return new Intl.DateTimeFormat("en-US", {
    timeZone,
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric"
  }).format(utc);
}

export function formatTime(hhmm) {
  if (!isIsoTime(hhmm)) return hhmm || "";
  const [h, min] = hhmm.split(":").map(Number);
  const ampm = h >= 12 ? "p.m." : "a.m.";
  const hr = h % 12 || 12;
  return min === 0 ? `${hr} ${ampm}` : `${hr}:${String(min).padStart(2, "0")} ${ampm}`;
}
