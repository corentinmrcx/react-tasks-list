import React, { useState } from 'react';
import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, Typography } from '@mui/material';
import { useLocation, useParams } from 'wouter';
import { Delete, Edit } from '@mui/icons-material';
import { useDeleteTaskListMutation, useGetTaskListQuery, useUpdateTaskListMutation } from '../../store/api';
import { useDispatch } from 'react-redux';
import { addNotification } from '../../store/slices/notification';
import TaskListEdit from '../../components/TaskListEdit';

export default function TaskListDetails() {
  const { id } = useParams();
  const [, setLocation] = useLocation();
  const { data: taskList, isLoading } = useGetTaskListQuery(id);
  const [deleteTaskList] = useDeleteTaskListMutation();
  const [updateTaskList] = useUpdateTaskListMutation();
  const [openDialog, setOpenDialog] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
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

  const handleSaveTitle = async (newTitle) => {
    try {
      await updateTaskList({ id, title: newTitle }).unwrap();
      dispatch(addNotification({
        content: 'Titre mis à jour avec succès',
        type: 'success',
      }));
    } catch (err) {
      dispatch(addNotification({
        content: 'Erreur lors de la mise à jour du titre',
        type: 'error',
      }));
      console.error('Erreur lors de la mise à jour:', err);
    }
  };

  if (isLoading || !taskList) {
    return <Typography sx={{ p: 2 }}>Chargement...</Typography>;
  }

  return (
    <>
      <Box sx={{ p: 2 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
          {isEditMode ? (
            <TaskListEdit title={taskList.title} onSave={handleSaveTitle} />
          ) : (
            <Typography variant="h4">{taskList.title}</Typography>
          )}
          
          <Box sx={{ display: 'flex', gap: 1 }}>
            {taskList.owner && (
              <Button 
                color="info"
                startIcon={<Edit />} 
                onClick={() => setIsEditMode(!isEditMode)}
              >
                {isEditMode ? 'Terminer' : 'Modifier'}
              </Button>
            )}
            {isEditMode && (
              <Button color="error" startIcon={<Delete />} onClick={() => setOpenDialog(true)}>
                Supprimer
              </Button>
            )}
          </Box>
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
