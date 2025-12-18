import React from 'react';
import { AppBar, Toolbar, Typography, Avatar, Box } from '@mui/material';
import ListAltIcon from '@mui/icons-material/ListAlt';
import UserButton from './UserButton';

export default function Header() {
  return (
    <AppBar position="static">
      <Toolbar>
        <Avatar sx={{ bgcolor: 'purple', mr: 2 }}>
          <ListAltIcon />
        </Avatar>
        <Typography variant="h5" component="div" sx={{ flexGrow: 1 }}>
          Tasklists manager!
        </Typography>
        <UserButton />
      </Toolbar>
    </AppBar>
  );
}
