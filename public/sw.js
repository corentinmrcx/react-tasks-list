let accessToken = null;

async function notifyClients(type, notification = null) {
  const clients = await self.clients.matchAll({ includeUncontrolled: true });
  clients.forEach(client => {
    client.postMessage({ type });
    if (notification) {
      client.postMessage({ type: 'notification', notification });
    }
  });
}

async function handleUnauthenticated() {
  accessToken = null;
  await notifyClients('unauthenticated', {
    content: 'Session expirée, veuillez vous reconnecter',
    type: 'warning'
  });
}

function createJsonResponse(data, status = 200, statusText = 'OK', headers = {}) {
  return new Response(JSON.stringify(data), {
    status,
    statusText,
    headers: {
      'Content-Type': 'application/json',
      ...headers
    }
  });
}

self.addEventListener('install', () => {
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

  if (url.hostname !== 'iut-rcc-infoapi.univ-reims.fr') {
    return;
  }

  if (url.pathname.endsWith('/auth') && event.request.method === 'POST') {
    event.respondWith(
      fetch(event.request)
        .then(async (response) => {
          if (!response.ok) {
            return response;
          }

          const data = await response.json();

          const tokenFromResponse = data?.accessToken || data?.token || data?.access_token || data?.jwt;
          if (tokenFromResponse) {
            accessToken = tokenFromResponse;
          }

          await notifyClients('authentication', {
            content: 'Authentification réussie',
            type: 'success'
          });

          const dataWithoutJWT = { ...data };
          delete dataWithoutJWT.accessToken;
          delete dataWithoutJWT.token;
          delete dataWithoutJWT.access_token;
          delete dataWithoutJWT.jwt;

          return createJsonResponse(
            dataWithoutJWT,
            response.status,
            response.statusText,
            Object.fromEntries(response.headers)
          );
        })
        .catch(async (error) => {
          console.error('Erreur d\'authentification:', error);

          const client = await self.clients.get(event.clientId);
          if (client) {
            client.postMessage({
              type: 'notification',
              notification: {
                content: 'Erreur lors de l\'authentification',
                type: 'error'
              }
            });
          }

          return createJsonResponse({ error: 'Erreur réseau' }, 500, 'Internal Server Error');
        })
    );
    return;
  }

  event.respondWith((async () => {
    if (!accessToken) {
      await handleUnauthenticated();
      return createJsonResponse({ error: 'Non authentifié' }, 401, 'Unauthorized');
    }

    const headers = new Headers(event.request.headers);
    headers.set('Authorization', `Bearer ${accessToken}`);

    const authenticatedRequest = new Request(event.request, { headers });

    try {
      const response = await fetch(authenticatedRequest);

      if (response.status === 401) {
        await handleUnauthenticated();
      }

      return response;
    } catch (error) {
      console.error('Erreur lors de la requête:', error);
      return createJsonResponse({ error: 'Erreur réseau' }, 500, 'Internal Server Error');
    }
  })( ));
});
