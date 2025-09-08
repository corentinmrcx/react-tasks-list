import React from 'react';
import { CssBaseline } from '@mui/material';
import ThemeProvider from './context/theme/Provider.jsx';
import useTheme from './hooks/useTheme';
import lightTheme from './themes/lightTheme';
import darkTheme from './themes/darkTheme';

import Header from './components/Header.jsx';
import Main from './components/Main.jsx';
import Footer from './components/Footer.jsx';

export default function App() {
  const { theme, mode, toggleTheme } = useTheme(lightTheme, darkTheme, 'light');

  return (
    <ThemeProvider>
      <CssBaseline />
      <Header />
      <Main />
      <Footer />
    </ThemeProvider>
  );
}