import React, { useState } from 'react';
import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, Typography } from '@mui/material';
import { useLocation, useParams } from 'wouter';
import { Delete } from '@mui/icons-material';
import { useDeleteTaskListMutation, useGetTaskListQuery } from '../../store/api';
import { useDispatch } from 'react-redux';
import { addNotification } from '../../store/slices/notification';

export default function TaskListDetails() {
  const { id } = useParams();
  const [, setLocation] = useLocation();
  const { data: taskList, isLoading } = useGetTaskListQuery(id);
  const [deleteTaskList] = useDeleteTaskListMutation();
  const [openDialog, setOpenDialog] = useState(false);
  const dispatch = useDispatch();

  const handleDelete = async () => {
    try {
      await deleteTaskList(id).unwrap();
      dispatch(addNotification({
        content: 'Liste de tâches supprimée avec succès',
        type: 'success',
      }));
      setLocation('/');
    } catch (err) {
      dispatch(addNotification({
        content: 'Erreur lors de la suppression de la liste',
        type: 'error',
      }));
      console.error('Erreur lors de la suppression:', err);
    }
  };

  if (isLoading || !taskList) {
    return <Typography sx={{ p: 2 }}>Chargement...</Typography>;
  }

  return (
    <>
      <Box sx={{ p: 2 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
          <Typography variant="h4">{taskList.title}</Typography>
          <Button color="error" startIcon={<Delete />} onClick={() => setOpenDialog(true)}>
            Supprimer
          </Button>
        </Box>

        <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
          <DialogTitle>Confirmer la suppression</DialogTitle>
          <DialogContent>
            Êtes-vous sûr de vouloir supprimer &quot;{taskList.title}&quot; ?
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenDialog(false)}>Annuler</Button>
            <Button onClick={handleDelete} color="error">Supprimer</Button>
          </DialogActions>
        </Dialog>
      </Box>
    </>
  );
}
