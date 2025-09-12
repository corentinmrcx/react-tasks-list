import React, { useEffect } from 'react';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';

export default function Toast({ notification,
                                autoHideDuration = 3000,
                                onClose,
                                onRemove,
                              }) {
  const open = !!notification?.visible;

  if (!notification) return null;

  return (
    <Snackbar
      open={open}
      autoHideDuration={autoHideDuration}
      onClose={() => onClose(notification.id)}
      anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
    >
      <Alert
        onClose={() => onRemove(notification.id)}
        severity={notification.type || 'info'}
        variant="filled"
        sx={{ width: '100%', cursor: 'pointer' }}
        onClick={() => onClose(notification.id)}
      >
        {notification.content}
      </Alert>
    </Snackbar>
  );
}