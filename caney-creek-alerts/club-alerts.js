/* Caney Creek NJROTC Booster Club signup page.
   No third-party code, no cookies, no storage, no secrets.
   Reads CLUB_FORM_URL from config.js (same file /alerts/ loads).
   - Empty / missing: location.replace to /alerts/ (query preserved). Nothing is posted.
   - Set: clone the form template, set action to that URL, show status + validation.
   Never posts to Blue Chip's sibforms URL, even if it is pasted into the config by mistake. */
(function () {
  'use strict';

  var BLUE_CHIP_FORM_MARKER = '7080b12e.sibforms.com';
  var params = new URLSearchParams(window.location.search);
  var clubUrl = (typeof CLUB_FORM_URL === 'string') ? CLUB_FORM_URL.trim() : '';
  var root = document.getElementById('club-signup');
  var note = document.getElementById('club-redirect-note');
  var statusBox = document.getElementById('form-status');
  var errorBox = document.getElementById('form-errors');

  function isUsableClubUrl(url) {
    if (!url) return false;
    if (url.indexOf(BLUE_CHIP_FORM_MARKER) !== -1) return false;
    return /^https:\/\//i.test(url);
  }

  if (!isUsableClubUrl(clubUrl)) {
    window.location.replace('/alerts/' + window.location.search);
    return;
  }

  if (root) root.setAttribute('data-club-form-url', clubUrl);

  var template = document.getElementById('club-form-template');
  if (!template) return;
  var node = template.content.cloneNode(true);
  var form = node.querySelector('#club-alerts-form');
  form.setAttribute('action', clubUrl);
  if (note) note.hidden = true;
  // Insert the form after the error box (before privacy line / redirect note).
  var privacy = document.getElementById('privacy-line');
  if (privacy) privacy.parentNode.insertBefore(node, privacy);
  else (root || document.getElementById('main')).appendChild(node);

  form = document.getElementById('club-alerts-form');
  var email = document.getElementById('EMAIL');
  var consent = document.getElementById('OPT_IN');
  var submit = document.getElementById('club-alerts-submit');

  var messages = {
    'check-email': ['ok', 'Almost done. Check your inbox for an email from the Caney Creek NJROTC Booster Club and click the confirmation link. If you do not see it in a few minutes, check your spam or promotions folder.'],
    'confirmed': ['ok', 'You are on the club\'s list. Thanks. You will get alerts about the Caney Creek car show, and every email has an unsubscribe link.'],
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

  window.addEventListener('pageshow', function () { submit.disabled = false; submit.textContent = 'Get the alerts'; });
})();
