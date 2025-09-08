import React from 'react';
import { CssBaseline } from '@mui/material';
import { Provider } from 'react-redux';
import ThemeProvider from './context/theme/Provider.jsx';
import useTheme from './hooks/useTheme';
import lightTheme from './themes/lightTheme';
import darkTheme from './themes/darkTheme';

import Header from './components/Header.jsx';
import Main from './components/Main.jsx';
import Footer from './components/Footer.jsx';
import store from './store/index.js';

export default function App() {
  const { theme, mode, toggleTheme } = useTheme(lightTheme, darkTheme, 'light');

  return (
    <ThemeProvider>
      <Provider store={store}>
        <CssBaseline />
        <Header />
        <Main />
        <Footer />
      </Provider>
    </ThemeProvider>
  );
}