/**
 * Rendering helpers shared by the public list (website-shows-page/shows/app.js)
 * and the tests. Pure string functions, no DOM, no network.
 * Copied to public/shows/js and website-shows-page/shows/js by scripts/sync-shared.mjs.
 *
 * Every dynamic value goes through escapeHtml. Imported text is untrusted.
 */
export const UNVERIFIED_LABEL = "Unverified \u2013 check with organizer";
export const TENTATIVE_LABEL = "Date tentative";

export function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

export function isUnverified(show) {
  return Boolean(show) && (show.unverified === true || show.verification === "unverified");
}

/** Only http(s) URLs may become links. Anything else renders as no link. */
export function safeHref(url) {
  const value = String(url ?? "").trim();
  return /^https?:\/\//i.test(value) ? value : "";
}

/** "8 a.m.\u201310 a.m.", "8 a.m. start", the scrub's raw time text, or "Time not listed". */
export function timeLabelOf(show) {
  const start = show.start_time_label || "";
  const end = show.end_time_label || "";
  if (start && end) return `${start}\u2013${end}`;
  if (start) return `${start} start`;
  if (end) return `until ${end}`;
  return show.time_text ? String(show.time_text) : "Time not listed";
}

/** The visible Unverified badge. Empty string for verified and organizer-submitted shows. */
export function unverifiedBadgeHtml(show) {
  if (!isUnverified(show)) return "";
  return `<span class="tag tag-unverified" data-unverified="true">${escapeHtml(UNVERIFIED_LABEL)}</span>`;
}

export function tentativeTagHtml(show) {
  if (!isUnverified(show) && !show.date_tentative) return "";
  return show.date_tentative ? `<span class="tag tag-tentative">${escapeHtml(TENTATIVE_LABEL)}</span>` : "";
}

/** Source link, shown only while a show is unverified. */
export function sourceLinkHtml(show, label = "Source page") {
  if (!isUnverified(show)) return "";
  const href = safeHref(show.source_url);
  if (!href) return "";
  return `<a class="source-link" href="${escapeHtml(href)}" rel="noopener noreferrer">${escapeHtml(label)}</a>`;
}

/** Notice paragraph for the listing detail view. */
export function unverifiedNoticeHtml(show) {
  if (!isUnverified(show)) return "";
  return `<p class="unverified-note" role="note">This listing was collected from public sources and has not been confirmed by the organizer. Check with the organizer before you go.${
    show.date_tentative ? " The date is tentative." : ""
  }</p>`;
}
