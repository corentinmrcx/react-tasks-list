import React from 'react';
import { Box, Button, Stack, Typography } from '@mui/material';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import RefreshIcon from '@mui/icons-material/Refresh';
import {  useDispatch, useSelector } from 'react-redux';
import { addNotification, hideNotification, removeNotification } from '../store/slices/notification.js';
import { setAuthenticated } from '../store/slices/auth.js';
import Toast from './Toast.jsx';
import { useGetTaskListsQuery } from '../store/api';
import LoginForm from './LoginForm';
import useServiceWorker from '../hooks/useServiceWorker';

export default function Main() {
  const dispatch = useDispatch();
  const notifications = useSelector(state => state.notifications.notifications);
  const isAuthenticated = useSelector(state => state.auth.isAuthenticated);
  const visibleNotification = notifications.find(n => n.visible);

  const isServiceWorkerReady = useServiceWorker('/sw.js',
    (notification) => {
      dispatch(addNotification(notification));
    },
    () => {
      dispatch(setAuthenticated(true));
    },
    () => {
      dispatch(setAuthenticated(false));
    }
  );

  const { data: taskListsData, error, isLoading, refetch } = useGetTaskListsQuery(undefined, {
    skip: !isAuthenticated,
  });

  React.useEffect(() => {
    if (isLoading) {
      console.log('Chargement des listes de tâches');
    } else if (error) {
      console.error('Erreur lors de la récupération des listes de tâches :', error);
    } else if (taskListsData) {
      console.log('Listes de tâches récupérées :', taskListsData);
    }
  }, [taskListsData, error, isLoading]);

  if (!isServiceWorkerReady) {
    return null;
  }

  if (!isAuthenticated) {
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
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mt: 3, gap: 3 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        <Typography variant="h6">
          Nombre de listes de tâches : {taskListsData?.['hydra:member']?.length || 0}
        </Typography>
        <Button
          variant="contained"
          startIcon={<RefreshIcon />}
          onClick={() => refetch()}
        >
          Actualiser
        </Button>
      </Box>
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
