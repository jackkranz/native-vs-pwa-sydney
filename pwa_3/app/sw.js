
const CACHE_NAME = "CACHE_NAME_4";
const cacheManifest = ["/", "/app.css", "/app.js"];

self.addEventListener("install", event => {
  console.log("Service Worker is installed");
  event.waitUntil(
    caches.open(CACHE_NAME).then(function(cache) {
      console.log("Opened cache");
      return cache.addAll(cacheManifest);
    })
  );
});

self.addEventListener("load", () => {
  console.log('load');
})

//control current page and WHITELIST Cache items
self.addEventListener("activate", function(event) {
  var cacheWhitelist = ["./"];
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


const cacheResponse = (request, response) => {
  caches.open(CACHE_NAME).then(c => {
    c.put(request, response);
  });
};

// Network First - POST
self.addEventListener("fetch", event => {
  if (event.request.method === "GET") {
    event.respondWith(
      fetch(event.request)
        .then(response => {
          cacheResponse(event.request, response.clone());
          return response;
        })
        .catch(error => {
          console.log(error);
          return caches.match(event.request);
        })
    );
  } else {
    if (event.request.method === "POST") {
      const req = event.request.clone();
   
      event.respondWith(fetch(event.request).catch(e => {
       
        self.clients.matchAll().then(clients => {
          clients.forEach(client => {
            if(client.focused === true){
            const u = req.url;
            const json = req.json().then(res => {
              client.postMessage({url:u,body: res});
            })
            }
          });
        });
        return new Error(e);
      }));
    }
  }
});
