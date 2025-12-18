let accessToken = null;
let refreshToken = null;

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
  refreshToken = null;
  await notifyClients('unauthenticated', {
    content: 'Session expirée, veuillez vous reconnecter',
    type: 'warning'
  });
}

async function refreshAccessToken() {
  if (!refreshToken) {
    return false;
  }

  try {
    console.log('Service Worker : rafraîchissement des jetons...');

    const response = await fetch('https://iut-rcc-infoapi.univ-reims.fr/tasks/api/auth/refresh', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ refreshToken })
    });

    console.log('Service Worker : Réponse du refresh:', response.status);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('Service Worker : Échec du rafraîchissement', errorData);
      await handleUnauthenticated();
      return false;
    }

    const data = await response.json();
    console.log('Service Worker : Nouveaux jetons reçus');

    const newAccessToken = data?.accessToken || data?.token || data?.access_token || data?.jwt;
    const newRefreshToken = data?.refreshToken || data?.refresh_token;

    if (newAccessToken) {
      accessToken = newAccessToken;
    }

    if (newRefreshToken) {
      refreshToken = newRefreshToken;
    }

    await notifyClients('token-refreshed', {
      content: 'Jetons d\'authentification rafraîchis',
      type: 'info'
    });

    console.log('Service Worker : Jetons rafraîchis avec succès');
    return true;
  } catch (error) {
    console.error('Erreur lors du rafraîchissement des jetons:', error);
    await handleUnauthenticated();
    return false;
  }
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

          const refreshTokenFromResponse = data?.refreshToken || data?.refresh_token;
          if (refreshTokenFromResponse) {
            refreshToken = refreshTokenFromResponse;
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
          delete dataWithoutJWT.refreshToken;
          delete dataWithoutJWT.refresh_token;

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

  if (url.pathname.endsWith('/logout') && event.request.method === 'POST') {
    event.respondWith((async () => {
      if (!accessToken) throw new Error('Non authentifié');

      const headers = new Headers(event.request.headers);
      headers.set('Authorization', `Bearer ${accessToken}`);

      const authenticatedRequest = new Request(event.request, {
        headers,
        mode: 'cors',
        credentials: 'same-origin'
      });

      try {
        const response = await fetch(authenticatedRequest);

        if (response.ok) {
          accessToken = null;
          refreshToken = null;

          await notifyClients('notification', {
            content: 'Déconnexion réussie',
            type: 'success'
          });
        }

        return response;
      } catch (error) {
        throw new Error('Erreur de déconnexion: ' + error.message);
      }
    })());
    return;
  }

  if (url.pathname.includes('/auth/refresh')) {
    return;
  }

  event.respondWith((async () => {
    if (!accessToken) {
      await handleUnauthenticated();
      return createJsonResponse({ error: 'Non authentifié' }, 401, 'Unauthorized');
    }

    const headers = new Headers(event.request.headers);
    headers.set('Authorization', `Bearer ${accessToken}`);

    const authenticatedRequest = new Request(event.request, {
      headers,
      mode: 'cors',
      credentials: 'same-origin'
    });

    try {
      const response = await fetch(authenticatedRequest);

      if (response.status === 401) {
        const refreshed = await refreshAccessToken();

        if (refreshed) {
          const newHeaders = new Headers(event.request.headers);
          newHeaders.set('Authorization', `Bearer ${accessToken}`);

          const retryRequest = new Request(event.request, {
            headers: newHeaders,
            mode: 'cors',
            credentials: 'same-origin'
          });
          return await fetch(retryRequest);
        } else {
          return response;
        }
      }

      return response;
    } catch (error) {
      console.error('Erreur lors de la requête:', error);
      return createJsonResponse({ error: 'Erreur réseau' }, 500, 'Internal Server Error');
    }
  })());
});
