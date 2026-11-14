/**
 * API base for the public show list.
 *
 * ***** GROK BUILD STEP — do this ONLY after the pages.dev server is live *****
 * Confirm or replace the API_BASE value below with the hostname Wrangler prints.
 * Leave it as-is if Wrangler’s host is already https://carshow-finder.pages.dev.
 * This is the only JavaScript constant for the API URL (line 18).
 * If the hostname is different, also update the hardcoded List a show / Report
 * a problem links in shows/index.html and shows/badge/index.html, and the
 * connect-src host in App Builder’s optional _headers file (not included in
 * this pack — GitHub Pages does not honor it).
 *
 * Canonical URLs on /shows/ and /shows/badge/ stay on
 * https://bluechiptruckcustoms.com/… — do not point them at *.pages.dev.
 * CORS already allows https://bluechiptruckcustoms.com and
 * https://www.bluechiptruckcustoms.com; do not add the Pages host as a CORS origin.
 */
export const API_BASE = "https://carshow-finder.pages.dev";
