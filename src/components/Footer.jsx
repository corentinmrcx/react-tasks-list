import React, { useContext } from 'react';
import { AppBar, Toolbar, IconButton, Box } from '@mui/material';
import Brightness2Icon from '@mui/icons-material/Brightness2';
import LightModeIcon from '@mui/icons-material/LightMode';
import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone';
import { ThemeContext } from '../context/theme/index.js';

export default function Footer() {
  const { mode, toggleTheme } = useContext(ThemeContext);

  return (
    <AppBar position="fixed" color="primary" sx={{ top: 'auto', bottom: 0 }}>
      <Toolbar sx={{ justifyContent: 'space-between' }}>
        <IconButton color="inherit" onClick={toggleTheme}>
          {mode === 'light' ? <Brightness2Icon /> : <LightModeIcon />}
        </IconButton>
        <Box sx={{ flexGrow: 1 }} />
        <IconButton color="inherit">
          <NotificationsNoneIcon />
        </IconButton>
      </Toolbar>
    </AppBar>
  );
}
