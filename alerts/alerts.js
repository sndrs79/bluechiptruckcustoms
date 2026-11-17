/* Signup page helper. No third-party code, no cookies, no storage, no secrets.
   0) if CLUB_FORM_URL (from /caney-creek-alerts/config.js) is non-empty AND ?src starts
      with caney-creek, immediately location.replace to /caney-creek-alerts/ (query preserved).
      While CLUB_FORM_URL is empty, do not redirect — Blue Chip's form stays in use.
   1) shows ?status= messages after Brevo redirects back here
   2) OPTIONAL, OFF BY DEFAULT: copies ?src / utm_* into a hidden SIGNUP_SOURCE field (see CAPTURE_SOURCE below)
   3) accessible inline validation (email + unchecked consent), then lets the browser POST to Brevo */
(function () {
  'use strict';
  // 0) Club-list cutover gate. Shared config is /caney-creek-alerts/config.js (loaded first).
  // Fail-safe: if the config script did not load, treat the URL as empty and stay here.
  var params = new URLSearchParams(window.location.search);
  var clubUrl = (typeof CLUB_FORM_URL === 'string') ? CLUB_FORM_URL.trim() : '';
  var src = (params.get('src') || '').toLowerCase();
  if (clubUrl && src.indexOf('caney-creek') === 0) {
    window.location.replace('/caney-creek-alerts/' + window.location.search);
    return;
  }

  // ---- Source capture flag --------------------------------------------------------------
  // Default FALSE: no SIGNUP_SOURCE field is added, so the POST contains only fields Brevo's own form uses.
  // Set to true ONLY after one test signup proves Brevo accepts an extra SIGNUP_SOURCE field and stores it
  // (needs a Text contact attribute named SIGNUP_SOURCE in Brevo). See README "Turning on source capture".
  var CAPTURE_SOURCE = false;
  // ---------------------------------------------------------------------------------------
  var form = document.getElementById('alerts-form');
  if (!form) return;
  var params = new URLSearchParams(window.location.search);
  var statusBox = document.getElementById('form-status');
  var errorBox = document.getElementById('form-errors');
  var email = document.getElementById('EMAIL');
  var consent = document.getElementById('OPT_IN');
  var submit = document.getElementById('alerts-submit');

  function clean(v) { return (v || '').replace(/[^A-Za-z0-9._-]/g, '').slice(0, 40); }

  // 2) source tracking (disabled unless CAPTURE_SOURCE is true)
  if (CAPTURE_SOURCE) {
    var parts = [];
    ['src', 'utm_source', 'utm_medium', 'utm_campaign'].forEach(function (k) {
      var v = clean(params.get(k));
      if (v) parts.push(k + '=' + v);
    });
    var hidden = document.createElement('input');
    hidden.type = 'hidden'; hidden.id = 'SIGNUP_SOURCE'; hidden.name = 'SIGNUP_SOURCE';
    hidden.value = parts.length ? parts.join(';') : 'website';
    form.appendChild(hidden);
  }

  // 1) status messages from Brevo redirect pages
  var messages = {
    'check-email': ['ok', 'Almost done. Check your inbox for an email from us and click the confirmation link. If you do not see it in a few minutes, check your spam or promotions folder.'],
    'confirmed': ['ok', 'You are on the list. Thanks. You will get about one email a month, and every email has an unsubscribe link.'],
    'error': ['err', 'Something went wrong and your signup was not saved. Please try again in a minute.']
  };
  var st = params.get('status');
  if (st && messages[st]) {
    statusBox.textContent = messages[st][1];
    statusBox.className = 'alerts-status alerts-status-' + messages[st][0];
    statusBox.hidden = false;
    if (st === 'confirmed' || st === 'check-email') form.hidden = true;
    statusBox.focus();
  }

  // 3) validation (turn off native bubbles only when JS is running; native `required` remains as fallback)
  form.noValidate = true;
  function setError(input, id, msg) {
    var el = document.getElementById(id);
    el.textContent = msg; el.hidden = false;
    input.setAttribute('aria-invalid', 'true');
  }
  function clearError(input, id) {
    var el = document.getElementById(id);
    el.textContent = ''; el.hidden = true;
    input.removeAttribute('aria-invalid');
  }
  email.addEventListener('input', function () { clearError(email, 'EMAIL-error'); });
  consent.addEventListener('change', function () { clearError(consent, 'OPT_IN-error'); });

  form.addEventListener('submit', function (e) {
    var problems = [];
    var value = email.value.trim();
    clearError(email, 'EMAIL-error'); clearError(consent, 'OPT_IN-error');
    if (!value) {
      setError(email, 'EMAIL-error', 'Enter your email address.');
      problems.push([email, 'Enter your email address.']);
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value)) {
      setError(email, 'EMAIL-error', 'That email address does not look right. Check it and try again.');
      problems.push([email, 'That email address does not look right.']);
    }
    if (!consent.checked) {
      setError(consent, 'OPT_IN-error', 'Please check the box to say you want these emails.');
      problems.push([consent, 'Check the box to say you want these emails.']);
    }
    if (problems.length) {
      e.preventDefault();
      errorBox.innerHTML = '';
      var p = document.createElement('p'); p.style.margin = '0';
      p.textContent = 'Please fix ' + (problems.length === 1 ? 'this' : 'these') + ' before submitting:';
      var ul = document.createElement('ul');
      problems.forEach(function (x) {
        var li = document.createElement('li'); var a = document.createElement('a');
        a.href = '#' + x[0].id; a.textContent = x[1];
        a.addEventListener('click', function (ev) { ev.preventDefault(); x[0].focus(); });
        li.appendChild(a); ul.appendChild(li);
      });
      errorBox.appendChild(p); errorBox.appendChild(ul);
      errorBox.hidden = false; errorBox.focus();
      return;
    }
    errorBox.hidden = true;
    submit.disabled = true; submit.textContent = 'Sending…';
  });

  // Back/forward cache: re-enable the button if the visitor returns to this page.
  window.addEventListener('pageshow', function () { submit.disabled = false; submit.textContent = 'Get the alerts'; });
})();
