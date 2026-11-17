/* Shared club-form config. Loaded by /alerts/ and /caney-creek-alerts/.
   CUTOVER is one edit: paste the club's Brevo Simple HTML form URL into CLUB_FORM_URL
   below, then commit and push this file (see CLUB-SETUP.md). Leave it empty until then.

   While empty:
     - QR visitors to /alerts/?src=caney-creek* stay on Blue Chip's Houston car show alerts form.
     - A direct visit to /caney-creek-alerts/ is sent to /alerts/ (query string kept).
   When set to the club form URL:
     - /alerts/?src=caney-creek* redirects here (query string, including src, is kept).
     - This page shows the club form and posts only to that URL.
   Never paste Blue Chip's sibforms.com URL here.
*/
var CLUB_FORM_URL = '';
