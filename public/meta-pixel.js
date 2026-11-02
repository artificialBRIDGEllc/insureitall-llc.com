/*
 * INSUREitALL - Meta Pixel (dataset 1456788026637585)
 * Loaded site-wide from src/routes/__root.tsx.
 * Events: PageView (incl. SPA route changes), ViewContent (/enroll),
 *         Lead content_name=enroll_click (Sunfire click-out, goal A),
 *         Contact (tel: tap, goal B), Lead content_name=callback_request (/lead submit, goal C).
 * Never add health info, plan names, or form values to these events.
 */
(function () {
  if (window.fbq) return;
  !function (f, b, e, v, n, t, s) {
    if (f.fbq) return; n = f.fbq = function () {
      n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments);
    };
    if (!f._fbq) f._fbq = n; n.push = n; n.loaded = !0; n.version = '2.0'; n.queue = [];
    t = b.createElement(e); t.async = !0; t.src = v;
    s = b.getElementsByTagName(e)[0]; s.parentNode.insertBefore(t, s);
  }(window, document, 'script', 'https://connect.facebook.net/en_US/fbevents.js');

  fbq('init', '1456788026637585');
  fbq('track', 'PageView');

  // Standard "Lead" does not reach Meta from this site (verified 2026-11-02), so each
  // conversion is also sent as a custom event; ads optimize on custom conversions built on them.
  var lastEnroll = 0;
  function enrollClick() {
    var now = Date.now();
    if (now - lastEnroll < 1500) return; // link click + window.open can both fire for one click
    lastEnroll = now;
    fbq('track', 'Lead', { content_name: 'enroll_click' });
    fbq('trackCustom', 'EnrollClick');
  }

  var isEnroll = function () { return /^\/enroll\/?$/.test(location.pathname); };
  if (isEnroll()) fbq('track', 'ViewContent', { content_name: 'enroll_page' });

  var lastPath = location.pathname;
  function onRoute() {
    if (location.pathname === lastPath) return;
    lastPath = location.pathname;
    fbq('track', 'PageView');
    if (isEnroll()) fbq('track', 'ViewContent', { content_name: 'enroll_page' });
  }
  ['pushState', 'replaceState'].forEach(function (m) {
    var orig = history[m];
    history[m] = function () { var r = orig.apply(this, arguments); setTimeout(onRoute, 0); return r; };
  });
  window.addEventListener('popstate', onRoute);

  document.addEventListener('click', function (e) {
    var a = e.target && e.target.closest && e.target.closest('a[href]');
    if (!a) return;
    var href = a.getAttribute('href') || '';
    if (href.indexOf('tel:') === 0) {
      fbq('track', 'Contact', { content_name: 'phone_call' });
      fbq('trackCustom', 'PhoneTap');
    } else if (/sunfire/i.test(href)) {
      enrollClick();
    }
  }, true);

  // /enroll opens Sunfire via a leave-site dialog that may use window.open instead of a link.
  var origOpen = window.open;
  window.open = function (url) {
    try { if (url && /sunfire/i.test(String(url))) enrollClick(); } catch (err) {}
    return origOpen.apply(this, arguments);
  };

  document.addEventListener('submit', function (e) {
    var form = e.target;
    if (form && /\/lead/.test(form.getAttribute('action') || location.pathname)) {
      fbq('track', 'Lead', { content_name: 'callback_request' });
      fbq('trackCustom', 'CallbackRequest');
    }
  }, true);
})();
