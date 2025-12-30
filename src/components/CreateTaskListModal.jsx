import React, { useState } from 'react';
import { Box, Button, Modal, TextField, Stack, Typography } from '@mui/material';
import { useDispatch } from 'react-redux';
import PropTypes from 'prop-types';
import { useCreateTaskListMutation } from '../store/api';
import { addNotification } from '../store/slices/notification';

export default function CreateTaskListModal({ open, onClose }) {
  const [title, setTitle] = useState('');
  const [createTaskList, { isLoading: isCreating }] = useCreateTaskListMutation();
  const dispatch = useDispatch();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    try {
      await createTaskList({ title }).unwrap();
      dispatch(addNotification({
        content: 'Liste de tâches créée avec succès',
        type: 'success',
      }));
      setTitle('');
      onClose();
    } catch (err) {
      dispatch(addNotification({
        content: 'Erreur lors de la création de la liste',
        type: 'error',
      }));
      console.error('Erreur lors de la création de la liste de tâches:', err);
    }
  };

  const handleClose = () => {
    setTitle('');
    onClose();
  };

  return (
    <Modal
      open={open}
      onClose={handleClose}
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
            <Button onClick={handleClose}>
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
  );
}

CreateTaskListModal.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
};
