import { cityNames } from "./js/cities.js";
import { chicagoYmd } from "./js/clock.js";
import { filterShows } from "./js/filter.js";
import { API_BASE } from "./js/config.js";

const listEl = document.getElementById("list");
const emptyEl = document.getElementById("empty");
const statusEl = document.getElementById("status");
const problemsEl = document.getElementById("filter-problems");
const detailEl = document.getElementById("detail");
const form = document.getElementById("filters");

let catalog = { shows: [], disclaimer: "" };
let today = chicagoYmd();

function opt(value, label) {
  const o = document.createElement("option");
  o.value = value;
  o.textContent = label;
  return o;
}

function fillCitySelects(shows) {
  const citySel = document.getElementById("city");
  const originSel = document.getElementById("origin");
  const savedCity = citySel.value;
  const savedOrigin = originSel.value;
  citySel.length = 1;
  originSel.length = 1;
  const citiesInData = [...new Set(shows.map((s) => s.city).filter(Boolean))].sort((a, b) =>
    a.localeCompare(b)
  );
  for (const c of citiesInData) citySel.append(opt(c, c));
  for (const c of cityNames()) originSel.append(opt(c, c));
  if (savedCity) citySel.value = savedCity;
  if (savedOrigin) originSel.value = savedOrigin;
}

function selectedFilters() {
  const classic = document.getElementById("classic").checked;
  const origin = document.getElementById("origin").value;
  const radius = document.getElementById("radius");
  return {
    dateFrom: document.getElementById("date-from").value,
    dateTo: document.getElementById("date-to").value,
    city: document.getElementById("city").value,
    classicTrucksWelcome: classic || undefined,
    originCity: origin,
    radiusMiles: origin ? Number(radius.value) : null
  };
}

function fee(label) {
  return label || "Not listed";
}

function card(show) {
  const el = document.createElement("article");
  el.className = "card" + (show.status === "cancelled" ? " cancelled" : "");
  el.id = `show-${show.id}`;
  el.innerHTML = `
    <div class="card-top">
      <p class="when">${escapeHtml(show.date_label)}${show.end_date_label && show.end_date !== show.date ? " – " + escapeHtml(show.end_date_label) : ""} · ${escapeHtml(show.start_time_label)}–${escapeHtml(show.end_time_label)}</p>
      <div class="tags">
        ${show.status === "cancelled" ? '<span class="tag tag-cancelled">Cancelled</span>' : ""}
        ${show.classic_trucks_welcome ? '<span class="tag tag-classic">Classic trucks welcome</span>' : ""}
        ${show.is_test ? '<span class="tag tag-test">TEST</span>' : ""}
        ${show._distance_miles != null ? `<span class="tag">${show._distance_miles} mi</span>` : ""}
      </div>
    </div>
    <h2>${escapeHtml(show.title)}</h2>
    <dl class="facts">
      <div><dt>Address</dt><dd>${escapeHtml(show.full_address)}</dd></div>
      <div><dt>Venue</dt><dd>${escapeHtml(show.venue_name || "Not listed")}</dd></div>
      <div><dt>Spectator fee</dt><dd>${escapeHtml(fee(show.spectator_fee_label))}</dd></div>
      <div><dt>Car-entry fee</dt><dd>${escapeHtml(fee(show.car_entry_fee_label))}</dd></div>
      <div><dt>Rain</dt><dd>${escapeHtml(show.rain || "Not listed")}</dd></div>
      <div><dt>Last confirmed</dt><dd>${escapeHtml(show.last_confirmed || "Not listed")}</dd></div>
    </dl>
    <div class="card-actions">
      <a href="${escapeAttr(show.organizer_page_url)}" rel="noopener noreferrer">Organizer page</a>
      <a href="${escapeAttr(show.directions_url)}" rel="noopener noreferrer">Directions</a>
      <a href="${escapeAttr(reportHref(show))}">Report a problem</a>
      <a href="?show=${encodeURIComponent(show.id)}">Open listing</a>
    </div>
  `;
  return el;
}

function renderDetail(show) {
  if (!show) {
    detailEl.hidden = true;
    detailEl.innerHTML = "";
    return;
  }
  detailEl.hidden = false;
  detailEl.innerHTML = `
    <p class="eyebrow">Listing</p>
    <p class="when">${escapeHtml(show.date_label)} · ${escapeHtml(show.start_time_label)}–${escapeHtml(show.end_time_label)}</p>
    <h2>${escapeHtml(show.title)}</h2>
    ${show.status === "cancelled" ? '<p class="tag tag-cancelled">Cancelled — this page stays up so a saved link still shows the status.</p>' : ""}
    <dl class="facts">
      <div><dt>Full street address</dt><dd>${escapeHtml(show.full_address)}</dd></div>
      <div><dt>Venue</dt><dd>${escapeHtml(show.venue_name || "Not listed")}</dd></div>
      <div><dt>Date (with year)</dt><dd>${escapeHtml(show.date_label)}${show.end_date_label && show.end_date !== show.date ? " – " + escapeHtml(show.end_date_label) : ""}</dd></div>
      <div><dt>Times</dt><dd>${escapeHtml(show.start_time_label)} to ${escapeHtml(show.end_time_label)}</dd></div>
      <div><dt>Spectator fee</dt><dd>${escapeHtml(fee(show.spectator_fee_label))}</dd></div>
      <div><dt>Car-entry fee</dt><dd>${escapeHtml(fee(show.car_entry_fee_label))}</dd></div>
      <div><dt>Rain date or rain or shine</dt><dd>${escapeHtml(show.rain || "Not listed")}</dd></div>
      <div><dt>Last confirmed</dt><dd>${escapeHtml(show.last_confirmed || "Not listed")}</dd></div>
      <div><dt>Organizer</dt><dd>${escapeHtml(show.organizer_name)}</dd></div>
      <div><dt>Classic trucks welcome</dt><dd>${show.classic_trucks_welcome ? "Yes (filter tag)" : "Not tagged"}</dd></div>
    </dl>
    <div class="card-actions">
      <a href="${escapeAttr(show.organizer_page_url)}" rel="noopener noreferrer">Organizer’s own page</a>
      <a href="${escapeAttr(show.directions_url)}" rel="noopener noreferrer">Directions (opens maps)</a>
      <a href="${escapeAttr(reportHref(show))}">Report a problem</a>
      <a href="/shows/">Back to the list</a>
    </div>
  `;
  detailEl.scrollIntoView({ block: "start" });
}

function render() {
  if (loadState !== "ok") return;
  const result = filterShows(catalog.shows || [], selectedFilters(), today);
  const params = new URLSearchParams(location.search);
  const wanted = params.get("show");
  const allForDetail = catalog.shows || [];
  const detail = wanted ? allForDetail.find((s) => s.id === wanted || s.slug === wanted) : null;

  if (detail && isHiddenPast(detail)) {
    renderDetail(detail);
  } else {
    renderDetail(detail && !isHiddenPast(detail) ? detail : wanted && detail ? detail : null);
  }

  listEl.innerHTML = "";
  for (const show of result.shows) listEl.append(card(show));
  if (!(catalog.shows || []).length) {
    emptyEl.hidden = false;
    emptyEl.textContent = "No upcoming shows are listed yet.";
  } else {
    emptyEl.textContent = "No upcoming shows match these filters.";
    emptyEl.hidden = result.count !== 0;
  }
  const cancelled = result.shows.filter((s) => s.status === "cancelled").length;
  statusEl.innerHTML = `<strong>${result.count}</strong> upcoming show${result.count === 1 ? "" : "s"}${
    cancelled ? `, including ${cancelled} cancelled` : ""
  }${result.excludedNoCoords ? `. ${result.excludedNoCoords} listing${result.excludedNoCoords === 1 ? " was" : "s were"} left out of the distance filter because they have no mapped city.` : "."}`;
  if (result.problems.length) {
    problemsEl.hidden = false;
    problemsEl.textContent = result.problems.join(" ");
  } else {
    problemsEl.hidden = true;
    problemsEl.textContent = "";
  }
}

function isHiddenPast(show) {
  return show && show.is_past && show.status !== "cancelled";
}

function reportHref(show) {
  const raw = show.report_url || "";
  if (/^https?:/i.test(raw)) return raw;
  const apiBase = String(API_BASE || "").replace(/\/+$/, "");
  const id = show.id || "";
  return `${apiBase}/shows/report/?id=${encodeURIComponent(id)}`;
}

function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}
function escapeAttr(value) {
  return escapeHtml(value).replaceAll("'", "&#39;");
}

document.getElementById("origin").addEventListener("change", () => {
  document.getElementById("radius").disabled = !document.getElementById("origin").value;
});
form.addEventListener("change", render);
form.addEventListener("submit", (e) => {
  e.preventDefault();
  render();
});

const LOAD_TIMEOUT_MS = 8000;
const errorEl = document.getElementById("load-error");
const retryBtn = document.getElementById("retry-shows");
let loadState = "loading";

function showLoadError() {
  loadState = "error";
  listEl.innerHTML = "";
  if (detailEl) {
    detailEl.hidden = true;
    detailEl.innerHTML = "";
  }
  emptyEl.hidden = true;
  if (errorEl) errorEl.hidden = false;
  statusEl.textContent = "";
}

function clearLoadError() {
  if (errorEl) errorEl.hidden = true;
}

async function loadShows() {
  loadState = "loading";
  clearLoadError();
  emptyEl.hidden = true;
  listEl.innerHTML = "";
  statusEl.textContent = "Loading shows…";
  const apiBase = String(API_BASE || "").replace(/\/+$/, "");
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), LOAD_TIMEOUT_MS);
  try {
    const res = await fetch(`${apiBase}/api/shows`, { cache: "no-store", signal: controller.signal });
    if (!res.ok) throw new Error("bad-status");
    const body = await res.json();
    if (!body || !Array.isArray(body.shows)) throw new Error("bad-json");
    catalog = body;
    if (catalog.today) today = catalog.today;
    loadState = "ok";
    fillCitySelects(catalog.shows || []);
    render();
  } catch {
    showLoadError();
  } finally {
    clearTimeout(timer);
  }
}

if (retryBtn) retryBtn.addEventListener("click", () => loadShows());

await loadShows();
