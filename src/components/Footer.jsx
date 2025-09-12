import React, { useContext } from 'react';
import { AppBar, Toolbar, IconButton, Box } from '@mui/material';
import Brightness2Icon from '@mui/icons-material/Brightness2';
import LightModeIcon from '@mui/icons-material/LightMode';
import { ThemeContext } from '../context/theme/index.js';
import NotificationButton from './NotificationButton.jsx';

export default function Footer() {
  const { mode, toggleTheme } = useContext(ThemeContext);

  return (
    <AppBar position="fixed" color="primary" sx={{ top: 'auto', bottom: 0 }}>
      <Toolbar sx={{ justifyContent: 'space-between' }}>
        <IconButton color="inherit" onClick={toggleTheme}>
          {mode === 'light' ? <Brightness2Icon /> : <LightModeIcon />}
        </IconButton>
        <Box sx={{ flexGrow: 1 }} />
        <NotificationButton />
      </Toolbar>
    </AppBar>
  );
}
