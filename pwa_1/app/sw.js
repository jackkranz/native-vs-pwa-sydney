self.addEventListener('install', () => {
  console.log('Service Worker Installed');
})

self.addEventListener('activate', event => {
  event.waitUntil(clients.claim());
});

self.addEventListener('fetch', event => {
  event.respondWith(fetch(event.request).then(response => {
    console.log('This is after the response',);
    return response;
  }));
});