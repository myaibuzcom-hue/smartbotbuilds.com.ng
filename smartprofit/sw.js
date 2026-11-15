// Bump VERSION whenever you change any file, so phones pick up the update.
const VERSION = 'smartprofit-v3';
const SHELL = ['./', './index.html', './manifest.json', './icon-192.png', './icon-512.png'];

self.addEventListener('install', function (e) {
  e.waitUntil(caches.open(VERSION).then(function (c) { return c.addAll(SHELL); }).then(function () { return self.skipWaiting(); }));
});

self.addEventListener('activate', function (e) {
  e.waitUntil(caches.keys().then(function (keys) {
    return Promise.all(keys.filter(function (k) { return k !== VERSION; }).map(function (k) { return caches.delete(k); }));
  }).then(function () { return self.clients.claim(); }));
});

self.addEventListener('fetch', function (e) {
  var r = e.request;
  if (r.method !== 'GET') return;
  var u = new URL(r.url);

  // The app page: try the network first so updates arrive, fall back to the saved copy offline.
  if (r.mode === 'navigate') {
    e.respondWith(fetch(r).then(function (res) {
      var copy = res.clone(); caches.open(VERSION).then(function (c) { c.put(r, copy); }); return res;
    }).catch(function () { return caches.match(r).then(function (m) { return m || caches.match('./'); }); }));
    return;
  }

  // Icons, manifest and fonts: saved copy first, then the network (and save it for next time).
  if (u.origin === location.origin || u.hostname === 'fonts.googleapis.com' || u.hostname === 'fonts.gstatic.com') {
    e.respondWith(caches.match(r).then(function (m) {
      return m || fetch(r).then(function (res) {
        if (res.ok || res.type === 'opaque') { var copy = res.clone(); caches.open(VERSION).then(function (c) { c.put(r, copy); }); }
        return res;
      });
    }));
  }
});
