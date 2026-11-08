/* Service worker AVM VTC : l'application s'ouvre même avec un réseau faible.
   Pensez à changer VERSION après une modification du site. */
var VERSION = "avm-v1";
var SHELL = ["./", "index.html", "style.css", "config.js", "script.js", "manifest.webmanifest",
  "assets/vendor/leaflet/leaflet.js", "assets/vendor/leaflet/leaflet.css",
  "assets/favicon.svg", "assets/nantes.svg", "assets/car.svg", "assets/icon-192.png", "assets/icon-512.png",
  "vtc-aeroport-nantes.html", "vtc-gare-nantes.html", "mentions-legales.html"];

self.addEventListener("install", function (e) {
  e.waitUntil(caches.open(VERSION).then(function (c) { return c.addAll(SHELL); }).then(function () { return self.skipWaiting(); }));
});
self.addEventListener("activate", function (e) {
  e.waitUntil(caches.keys().then(function (keys) {
    return Promise.all(keys.filter(function (k) { return k !== VERSION; }).map(function (k) { return caches.delete(k); }));
  }).then(function () { return self.clients.claim(); }));
});
// Fichiers du site : réseau d'abord (toujours à jour), cache si hors ligne.
self.addEventListener("fetch", function (e) {
  var url = new URL(e.request.url);
  if (e.request.method !== "GET" || url.origin !== location.origin) return;
  e.respondWith(fetch(e.request).then(function (res) {
    var copy = res.clone();
    caches.open(VERSION).then(function (c) { c.put(e.request, copy); });
    return res;
  }).catch(function () {
    return caches.match(e.request, { ignoreSearch: true }).then(function (r) { return r || caches.match("index.html"); });
  }));
});
