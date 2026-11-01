// 변시 법전 오프라인 저장 — 판 7d51098138
var CACHE = 'lawbook-7d51098138';
var FILES = ["index.html", "manifest.webmanifest", "p00.json", "p01.json", "p02.json", "p03.json", "p04.json", "p05.json", "p06.json", "sansb.woff2", "serif.woff2", "apple-touch-icon.png", "icon-192.png", "icon-512.png", "maskable-512.png"];
self.addEventListener('install', function (e) {
  e.waitUntil(caches.open(CACHE).then(function (c) { return c.addAll(FILES); }).then(function () { return self.skipWaiting(); }));
});
self.addEventListener('activate', function (e) {
  e.waitUntil(caches.keys().then(function (ks) {
    return Promise.all(ks.filter(function (k) { return k.indexOf('lawbook-') === 0 && k !== CACHE; }).map(function (k) { return caches.delete(k); }));
  }).then(function () { return self.clients.claim(); }));
});
self.addEventListener('fetch', function (e) {
  if (e.request.method !== 'GET') return;
  var u = new URL(e.request.url);
  if (u.origin !== location.origin) return;
  if (e.request.mode === 'navigate') {   // 화면: 인터넷이 되면 새 판, 안 되면 저장본
    e.respondWith(fetch(e.request).then(function (r) {
      if (r.ok) { var cp = r.clone(); caches.open(CACHE).then(function (c) { c.put('index.html', cp); }); } return r;
    }).catch(function () { return caches.match('index.html'); }));
    return;
  }
  e.respondWith(caches.match(e.request, { ignoreSearch: true }).then(function (r) { return r || fetch(e.request); }));
});
