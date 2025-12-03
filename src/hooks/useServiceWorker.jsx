import { useEffect, useState } from 'react';

const useServiceWorker = (swPath, onNotification) => {
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
