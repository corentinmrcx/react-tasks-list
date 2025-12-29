import React from 'react';
import { Box, Typography, List, ListItem, ListItemText, ListItemButton, IconButton, Paper } from '@mui/material';
import { Link } from 'wouter';
import DeleteIcon from '@mui/icons-material/Delete';
import StarIcon from '@mui/icons-material/Star';
import { useSelector, useDispatch } from 'react-redux';
import { useGetTaskListsQuery, useDeleteTaskListMutation } from '../store/api';
import { addNotification } from '../store/slices/notification';

export default function TaskListsList() {
  const currentUser = useSelector(state => state.auth.user);
  const { data: taskListsData, error, isLoading, refetch } = useGetTaskListsQuery();
  const [deleteTaskList] = useDeleteTaskListMutation();
  const dispatch = useDispatch();

  const handleDeleteTaskList = async (id, listTitle) => {
    if (!window.confirm(`Êtes-vous sûr de vouloir supprimer la liste "${listTitle}" ?`)) {
      return;
    }

    try {
      await deleteTaskList(id).unwrap();
      dispatch(addNotification({
        content: 'Liste de tâches supprimée avec succès',
        type: 'success',
      }));
      refetch();
    } catch (err) {
      dispatch(addNotification({
        content: 'Erreur lors de la suppression de la liste',
        type: 'error',
      }));
      console.error('Erreur lors de la suppression de la liste de tâches:', err);
    }
  };

  if (isLoading) {
    return <Typography>Chargement...</Typography>;
  }

  if (error) {
    return <Typography color="error">Erreur lors du chargement des listes</Typography>;
  }

  if (taskListsData?.['hydra:member']?.length === 0) {
    return <Typography color="text.secondary">Aucune liste de tâches</Typography>;
  }

  return (
    <Box sx={{ width: '100%', maxWidth: 800, mt: 2 }}>
      <Typography variant="h5" sx={{ mb: 2 }}>
        Mes listes de tâches
      </Typography>
      <List>
        {taskListsData?.['hydra:member']?.map((taskList) => {
          const listId = taskList['@id'].split('/').pop();
          const isOwner = taskList.owner?.['@id'] === currentUser?.['@id'];
          
          return (
            <Paper key={taskList['@id']} sx={{ mb: 1 }}>
              <ListItem
                disablePadding
                secondaryAction={
                  <IconButton 
                    edge="end" 
                    aria-label="delete"
                    onClick={(e) => {
                      e.preventDefault();
                      handleDeleteTaskList(listId, taskList.title);
                    }}
                  >
                    <DeleteIcon />
                  </IconButton>
                }
              >
                <ListItemButton component={Link} to={`/lists/${listId}`}>
                  <ListItemText 
                    primary={
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        {taskList.title}
                        {isOwner && (
                          <StarIcon color="primary" fontSize="small" titleAccess="Propriétaire" />
                        )}
                      </Box>
                    }
                  />
                </ListItemButton>
              </ListItem>
            </Paper>
          );
        })}
      </List>
    </Box>
  );
}
