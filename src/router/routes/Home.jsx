import React, { useState } from 'react';
import { Box, Button, Typography } from '@mui/material';
import RefreshIcon from '@mui/icons-material/Refresh';
import AddIcon from '@mui/icons-material/Add';
import { useGetTaskListsQuery } from '../../store/api';
import CreateTaskListModal from '../../components/CreateTaskListModal';
import TaskListsList from '../../components/TaskListsList';
import NotificationButtons from '../../components/NotificationButtons';

export default function Home() {
  const [openModal, setOpenModal] = useState(false);
  const { data: taskListsData, refetch } = useGetTaskListsQuery();

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mt: 3, gap: 3 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        <Typography variant="h6">
          Nombre de listes de tâches : {taskListsData?.['hydra:member']?.length || 0}
        </Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={() => setOpenModal(true)}
        >
          Nouvelle liste
        </Button>
        <Button
          variant="contained"
          startIcon={<RefreshIcon />}
          onClick={() => refetch()}
        >
          Actualiser
        </Button>
      </Box>

      <NotificationButtons />

      <TaskListsList />

      <CreateTaskListModal 
        open={openModal} 
        onClose={() => setOpenModal(false)} 
      />
    </Box>
  );
}
