let accessToken = null;
let refreshToken = null;

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

self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);

  if (url.pathname.endsWith('/auth') && event.request.method === 'POST') {
    event.respondWith(
      fetch(event.request)
        .then(async (response) => {
          if (response.ok) {
            const data = await response.json();

            if (data.accessToken) accessToken = data.accessToken;
            if (data.refreshToken) refreshToken = data.refreshToken;

            const client = await self.clients.get(event.clientId);
            if (client) {
              client.postMessage({
                type: 'notification',
                notification: { content: 'Authentification réussie', type: 'success' }
              });
            }

            const dataWithoutJWT = { ...data };
            delete dataWithoutJWT.accessToken;
            delete dataWithoutJWT.refreshToken;

            return new Response(JSON.stringify(dataWithoutJWT), {
              status: response.status,
              statusText: response.statusText,
              headers: response.headers
            });
          }

          return response;
        })
        .catch(async (error) => {
          console.error('Erreur d\'authentification:', error);
          const client = await self.clients.get(event.clientId);
          if (client) {
            client.postMessage({
              type: 'notification',
              notification: { content: 'Erreur lors de l\'authentification', type: 'error' }
            });
          }
          return new Response(JSON.stringify({ error: 'Erreur réseau' }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
          });
        })
    );
  }
  else if (url.hostname === 'iut-rcc-infoapi.univ-reims.fr' && accessToken) {
    const headers = new Headers(event.request.headers);
    headers.set('Authorization', `Bearer ${accessToken}`);

    const authenticatedRequest = new Request(event.request, { headers });
    event.respondWith(fetch(authenticatedRequest));
  }
});
