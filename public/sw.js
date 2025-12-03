console.log('Service Worker initialisé');

self.addEventListener('install', (event) => {
  console.log('Service Worker : Installation');
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  console.log('Service Worker : Activation');
  event.waitUntil(self.clients.claim());
});

self.addEventListener('message', (event) => {
  console.log('Service Worker : Message reçu', event.data);
});

