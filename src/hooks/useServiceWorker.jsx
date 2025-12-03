import { useEffect, useState } from 'react';

const useServiceWorker = (swPath, onNotification) => {
  const [isRegistered, setIsRegistered] = useState(false);

  useEffect(() => {
    if (!('serviceWorker' in navigator)) {
      setIsRegistered(true);
      return;
    }

    let registration = null;

    const registerServiceWorker = async () => {
      try {
        if (onNotification) {
          onNotification({ content: 'Initialisation du service worker...', type: 'info' });
        }

        registration = await navigator.serviceWorker.register(swPath);

        if (onNotification) {
          onNotification({ content: 'Service worker enregistré avec succès', type: 'success' });
        }

        if (registration.installing) {
          registration.installing.addEventListener('statechange', (e) => {
            console.log('Service Worker state:', e.target.state);
            if (e.target.state === 'activated') {
              if (onNotification) {
                onNotification({ content: 'Service worker activé', type: 'success' });
              }
              setIsRegistered(true);
            }
          });
        } else if (registration.active) {
          setIsRegistered(true);
        }

        registration.addEventListener('updatefound', () => {
          const newWorker = registration.installing;
          if (onNotification) {
            onNotification({ content: 'Mise à jour du service worker détectée', type: 'info' });
          }

          newWorker.addEventListener('statechange', () => {
            if (newWorker.state === 'activated') {
              if (onNotification) {
                onNotification({ content: 'Service worker mis à jour', type: 'success' });
              }
            }
          });
        });

      } catch (error) {
        console.error('Erreur lors de l\'enregistrement du service worker:', error);
        if (onNotification) {
          onNotification({ content: 'Erreur lors de l\'enregistrement du service worker', type: 'error' });
        }
        setIsRegistered(true);
      }
    };

    registerServiceWorker();
  }, []);

  return isRegistered;
};

export default useServiceWorker;

