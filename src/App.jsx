import React from 'react';
import { CssBaseline } from '@mui/material';
import { Provider, useDispatch, useSelector } from 'react-redux';
import ThemeProvider from './context/theme/Provider.jsx';
import useTheme from './hooks/useTheme';
import lightTheme from './themes/lightTheme';
import darkTheme from './themes/darkTheme';

import Header from './components/Header.jsx';
import Main from './components/Main.jsx';
import Footer from './components/Footer.jsx';
import store from './store/index.js';
import Toast from './components/Toast.jsx';
import { hideNotification, removeNotification, addNotification } from './store/slices/notification.js';
import { setAuthenticated } from './store/slices/auth.js';
import useServiceWorker from './hooks/useServiceWorker';

function NotificationsHost() {
  const dispatch = useDispatch();
  const notifications = useSelector(state => state.notifications.notifications);
  const visibleNotification = notifications.find(n => n.visible);

  const handleHide = (id) => dispatch(hideNotification(id));
  const handleRemove = (id) => dispatch(removeNotification(id));

  return (
    <Toast
      notification={visibleNotification}
      autoHideDuration={3000}
      onClose={handleHide}
      onRemove={handleRemove}
    />
  );
}

function ServiceWorkerRegistrar() {
  const dispatch = useDispatch();

  useServiceWorker('/sw.js',
    (notification) => {
      dispatch(addNotification(notification));
    },
    () => {
      dispatch(setAuthenticated(true));
    },
    () => {
      dispatch(setAuthenticated(false));
    },
    () => {
      dispatch(addNotification({
        content: 'Jetons d\'authentification rafraîchis',
        type: 'info'
      }));
    }
  );

  return null;
}

export default function App() {
  useTheme(lightTheme, darkTheme, 'light');

  return (
    <ThemeProvider>
      <Provider store={store}>
        <CssBaseline />
        <Header />
        <ServiceWorkerRegistrar />
        <NotificationsHost />
        <Main />
        <Footer />
      </Provider>
    </ThemeProvider>
  );
}