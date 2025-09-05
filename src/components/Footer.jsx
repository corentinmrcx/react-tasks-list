import React from 'react';
import { AppBar, Toolbar, IconButton, Box } from '@mui/material';
import Brightness2Icon from '@mui/icons-material/Brightness2';
import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone';

export default function Footer({ onToggleTheme }) {
  return (
    <AppBar position="fixed" color="primary" sx={{ top: 'auto', bottom: 0 }}>
      <Toolbar sx={{ justifyContent: 'space-between' }}>
        <IconButton color="inherit" onClick={onToggleTheme}>
          <Brightness2Icon />
        </IconButton>
        <Box sx={{ flexGrow: 1 }} />
        <IconButton color="inherit">
          <NotificationsNoneIcon />
        </IconButton>
      </Toolbar>
    </AppBar>
  );
}
