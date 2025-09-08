import React from 'react';
import { ThemeContext } from './index.js';
import { ThemeProvider as MuiThemeProvider, CssBaseline } from '@mui/material';
import useTheme from '../../hooks/useTheme.jsx';
import lightTheme from '../../themes/lightTheme.jsx';
import darkTheme from '../../themes/darkTheme.jsx';

export default function ThemeProvider({ children }) {
  const { theme, mode, toggleTheme } = useTheme(lightTheme, darkTheme);

  return (
    <ThemeContext.Provider value={{ theme, mode, toggleTheme }}>
      <MuiThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </MuiThemeProvider>
    </ThemeContext.Provider>
  );
}