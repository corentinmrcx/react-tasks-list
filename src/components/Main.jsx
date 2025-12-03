import React from 'react';
import { Box, Button, Stack } from '@mui/material';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import {  useDispatch, useSelector } from 'react-redux';
import { addNotification, hideNotification, removeNotification } from '../store/slices/notification.js';
import Toast from './Toast.jsx';
import { useGetAuthenticatedUserQuery } from '../store/api';
import LoginForm from './LoginForm';
import useServiceWorker from '../hooks/useServiceWorker';

export default function Main() {
  const dispatch = useDispatch();
  const notifications = useSelector(state => state.notifications.notifications);
  const visibleNotification = notifications.find(n => n.visible);
  const isServiceWorkerReady = useServiceWorker('/sw.js', (notification) => {
    dispatch(addNotification(notification));
  });

  const { data, error, isLoading } = useGetAuthenticatedUserQuery();

  React.useEffect(() => {
    if (isLoading) {
      console.log('Chargement des données');
    } else if (error) {
      console.error('Erreur lors de la récupération des données utilisateur :', error);
    } else if (data) {
      console.log('Données utilisateur récupérées :', data);
    }
  }, [data, error, isLoading]);

  if (!isServiceWorkerReady) {
    return null;
  }

  if (error) {
    return <LoginForm />;
  }

  const handleAddNotification = (type) => {
    dispatch(addNotification({
      content: `Nouvelle notification de type ${type}`,
      type: type,
    }));
  };

  const handleHide = (id) => dispatch(hideNotification(id));
  const handleRemove = (id) => dispatch(removeNotification(id));

  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
      <Stack direction="row" spacing={2}>
        <Button
          variant="outlined"
          startIcon={<ErrorOutlineIcon />}
          onClick={() => handleAddNotification('error')}
        >
          ERROR
        </Button>
        <Button
          variant="outlined"
          startIcon={<WarningAmberIcon />}
          onClick={() => handleAddNotification('warning')}
        >
          WARNING
        </Button>
        <Button
          variant="outlined"
          startIcon={<InfoOutlinedIcon />}
          onClick={() => handleAddNotification('info')}
        >
          INFO
        </Button>
        <Button
          variant="outlined"
          startIcon={<CheckCircleOutlineIcon />}
          onClick={() => handleAddNotification('success')}
        >
          SUCCESS
        </Button>
      </Stack>
      <Toast
        notification={visibleNotification}
        autoHideDuration={3000}
        onClose={handleHide}
        onRemove={handleRemove}
      />
    </Box>
  );
}
