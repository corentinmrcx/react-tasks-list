import React, { useState } from 'react';
import { Avatar, Box, Button, CircularProgress, Dialog, DialogActions, DialogContent, DialogTitle, Typography } from '@mui/material';
import { useLocation, useParams } from 'wouter';
import { AvatarGroup } from '@mui/material';
import { Delete, Edit } from '@mui/icons-material';
import { useDeleteTaskListMutation, useGetTaskListCollaboratorsQuery, useGetTaskListQuery, useUpdateTaskListMutation } from '../../store/api';
import { useDispatch } from 'react-redux';
import { addNotification } from '../../store/slices/notification';
import AddCollaborators from '../../components/AddCollaborators';
import TaskListEdit from '../../components/TaskListEdit';

export default function TaskListDetails() {
  const { id } = useParams();
  const [, setLocation] = useLocation();
  const { data: taskList, isLoading } = useGetTaskListQuery(id);
  const { data: collaborators, isLoading: isLoadingCollaborators } = useGetTaskListCollaboratorsQuery(id);
  const [deleteTaskList] = useDeleteTaskListMutation();
  const [updateTaskList] = useUpdateTaskListMutation();
  const [openDialog, setOpenDialog] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [isAddCollaboratorsOpen, setIsAddCollaboratorsOpen] = useState(false);
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

          <Box sx={{ display: 'flex', alignItems: 'center', minHeight: 40 }}>
            {isLoadingCollaborators ? (
              <CircularProgress size={24} />
            ) : (
              <>
                {collaborators?.['hydra:member']?.length ? (
                  <AvatarGroup>
                    {collaborators['hydra:member'].map((collaborator) => (
                      <Avatar
                        key={collaborator.id}
                        src={`https://iut-rcc-infoapi.univ-reims.fr/tasks/api/users/${collaborator.id}/avatar`}
                        alt={collaborator.name || collaborator.login}
                      />
                    ))}
                  </AvatarGroup>
                ) : (
                  <Typography variant="body2" color="text.secondary">
                    Aucun collaborateur
                  </Typography>
                )}
              </>
            )}
          </Box>
          
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
            {isEditMode && (
              <Button
                variant="outlined"
                onClick={() => setIsAddCollaboratorsOpen(true)}
              >
                Ajouter des collaborateurs
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
        <AddCollaborators
          taskListId={id}
          open={isAddCollaboratorsOpen}
          onClose={() => setIsAddCollaboratorsOpen(false)}
        />
      </Box>
    </>
  );
}
