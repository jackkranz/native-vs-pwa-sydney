const CACHE_NAME = "PWA_2_Cache";
const cacheManifest = ["/", "/app.css", "/app.js"];

// Install V2
self.addEventListener("install", event => {
  console.log("Service Worker is installed");
  event.waitUntil(
    caches.open(CACHE_NAME).then(function(cache) {
      console.log("Opened cache");
      return cache.addAll(cacheManifest);
    })
  );
});

//control current page and WHITELIST Cache items
self.addEventListener("activate", function(event) {
  var cacheWhitelist = ["/"];

  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );

  return self.clients.claim();
});

// Cache First add new requests
self.addEventListener('fetch', function(event) {
  event.respondWith(caches
    .match(event.request)
    .then(response => {
        if (response) {
          return response;
        }
        return fetch(event.request)
        .then(response => {

            var responseToCache = response.clone();
            caches.open(CACHE_NAME)
            .then(c => {
                c.put(event.request, responseToCache);
              });

            return response;
          }
        );
      })
    );
});