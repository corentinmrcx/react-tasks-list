import React from 'react';
import { AppBar, Toolbar, Typography, Avatar } from '@mui/material';
import ListAltIcon from '@mui/icons-material/ListAlt';

export default function Header() {
  return (
    <AppBar position="static">
      <Toolbar>
        <Avatar sx={{ bgcolor: 'purple', mr: 2 }}>
          <ListAltIcon />
        </Avatar>
        <Typography variant="h5" component="div">
          Tasklists manager!
        </Typography>
      </Toolbar>
    </AppBar>
  );
}
