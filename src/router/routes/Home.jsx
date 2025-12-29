import React from 'react';
import { Box, Button, Stack, Typography } from '@mui/material';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import RefreshIcon from '@mui/icons-material/Refresh';
import { useDispatch } from 'react-redux';
import { addNotification } from '../../store/slices/notification.js';
import { useGetTaskListsQuery } from '../../store/api';

export default function Home() {
  const dispatch = useDispatch();

  const { data: taskListsData, error, isLoading, refetch } = useGetTaskListsQuery();

  React.useEffect(() => {
    if (isLoading) {
      console.log('Chargement des listes de tâches');
    } else if (error) {
      console.error('Erreur lors de la récupération des listes de tâches :', error);
    } else if (taskListsData) {
      console.log('Listes de tâches récupérées :', taskListsData);
    }
  }, [taskListsData, error, isLoading]);

  const handleAddNotification = (type) => {
    dispatch(addNotification({
      content: `Nouvelle notification de type ${type}`,
      type: type,
    }));
  };

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
    </Box>
  );
}
