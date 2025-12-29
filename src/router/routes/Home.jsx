import React from 'react';
import { Box, Button, Stack, Typography, Modal, TextField } from '@mui/material';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import RefreshIcon from '@mui/icons-material/Refresh';
import AddIcon from '@mui/icons-material/Add';
import { useDispatch } from 'react-redux';
import { addNotification } from '../../store/slices/notification.js';
import { useGetTaskListsQuery, useCreateTaskListMutation } from '../../store/api';

export default function Home() {
  const dispatch = useDispatch();
  const [openModal, setOpenModal] = React.useState(false);
  const [title, setTitle] = React.useState('');

  const { data: taskListsData, error, isLoading, refetch } = useGetTaskListsQuery();
  const [createTaskList, { isLoading: isCreating }] = useCreateTaskListMutation();

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

  const handleOpenModal = () => {
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setTitle('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    try {
      await createTaskList({ title }).unwrap();
      dispatch(addNotification({
        content: 'Liste de tâches créée avec succès',
        type: 'success',
      }));
      handleCloseModal();
    } catch (err) {
      dispatch(addNotification({
        content: 'Erreur lors de la création de la liste',
        type: 'error',
      }));
      console.error('Erreur lors de la création de la liste de tâches:', err);
    }
  };

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
          onClick={handleOpenModal}
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

      <Modal
        open={openModal}
        onClose={handleCloseModal}
        aria-labelledby="modal-title"
      >
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 400,
            bgcolor: 'background.paper',
            boxShadow: 24,
            p: 4,
            borderRadius: 2,
          }}
        >
          <Typography id="modal-title" variant="h6" component="h2" sx={{ mb: 2 }}>
            Créer une nouvelle liste de tâches
          </Typography>
          <form onSubmit={handleSubmit}>
            <TextField
              fullWidth
              label="Titre de la liste"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              autoFocus
              required
              sx={{ mb: 2 }}
            />
            <Stack direction="row" spacing={2} justifyContent="flex-end">
              <Button onClick={handleCloseModal}>
                Annuler
              </Button>
              <Button
                type="submit"
                variant="contained"
                disabled={isCreating || !title.trim()}
              >
                {isCreating ? 'Création...' : 'Créer'}
              </Button>
            </Stack>
          </form>
        </Box>
      </Modal>
    </Box>
  );
}
