import { useEffect, useState } from 'react';

const useServiceWorker = (swPath, onNotification, onAuthentication, onUnauthenticated, onTokenRefreshed, onLogout) => {
  const [isRegistered, setIsRegistered] = useState(false);

  useEffect(() => {
    if (!('serviceWorker' in navigator)) {
      setIsRegistered(true);
      return;
    }

    const handleMessage = (event) => {
      if (event.data.type === 'notification' && event.data.notification && onNotification) {
        onNotification(event.data.notification);
      }
      if (event.data.type === 'authentication' && onAuthentication) {
        onAuthentication();
      }
      if (event.data.type === 'unauthenticated' && onUnauthenticated) {
        onUnauthenticated();
      }
      if (event.data.type === 'token-refreshed' && onTokenRefreshed) {
        onTokenRefreshed();
      }
      if (event.data.type === 'logout' && onLogout) {
        onLogout();
      }
    };

    navigator.serviceWorker.addEventListener('message', handleMessage);

    navigator.serviceWorker
      .register(swPath)
      .then(() => {
        setIsRegistered(true);
      })
      .catch((error) => {
        console.error('Erreur lors de l\'enregistrement du service worker:', error);
        setIsRegistered(true);
      });

    return () => {
      navigator.serviceWorker.removeEventListener('message', handleMessage);
    };
  }, []);

  return isRegistered;
};

export default useServiceWorker;
