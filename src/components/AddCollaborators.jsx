import React, { useMemo, useState } from 'react';
import {
  Autocomplete,
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
} from '@mui/material';
import { useDispatch } from 'react-redux';
import { useAddCollaboratorMutation, useGetUsersQuery } from '../store/api';
import { addNotification } from '../store/slices/notification';

const buildUserLabel = (user) => {
  const fullName = [user.firstname, user.lastname].filter(Boolean).join(' ');
  return fullName || user.name || user.login || 'Utilisateur';
};

export default function AddCollaborators({ taskListId, open, onClose }) {
  const { data: usersPage1, isLoading: isLoadingPage1 } = useGetUsersQuery(1);
  const { data: usersPage2, isLoading: isLoadingPage2 } = useGetUsersQuery(2);
  const { data: usersPage3, isLoading: isLoadingPage3 } = useGetUsersQuery(3);
  const [addCollaborator, { isLoading: isSaving }] = useAddCollaboratorMutation();
  const [selectedUsers, setSelectedUsers] = useState([]);
  const dispatch = useDispatch();

  const allUsers = useMemo(() => {
    const merged = [
      ...(usersPage1?.['hydra:member'] || []),
      ...(usersPage2?.['hydra:member'] || []),
      ...(usersPage3?.['hydra:member'] || []),
    ];
    const seen = new Set();
    return merged.filter((user) => {
      if (seen.has(user.id)) return false;
      seen.add(user.id);
      return true;
    });
  }, [usersPage1, usersPage2, usersPage3]);

  const isLoadingUsers = isLoadingPage1 || isLoadingPage2 || isLoadingPage3;

  const handleClose = () => {
    setSelectedUsers([]);
    onClose();
  };

  const handleSubmit = async () => {
    if (!selectedUsers.length) return;

    try {
      await Promise.all(
        selectedUsers.map((user) => addCollaborator({ taskListId, userId: user.id }).unwrap())
      );
      dispatch(addNotification({
        content: 'Collaborateurs ajoutés avec succès',
        type: 'success',
      }));
      handleClose();
    } catch (err) {
      dispatch(addNotification({
        content: 'Erreur lors de l\'ajout des collaborateurs',
        type: 'error',
      }));
      console.error('Erreur lors de l\'ajout des collaborateurs:', err);
    }
  };

  return (
    <Dialog open={open} onClose={handleClose} fullWidth>
      <DialogTitle>Ajouter des collaborateurs</DialogTitle>
      <DialogContent>
        <Box sx={{ mt: 1 }}>
          <Autocomplete
            multiple
            options={allUsers}
            value={selectedUsers}
            loading={isLoadingUsers}
            isOptionEqualToValue={(option, value) => option.id === value.id}
            getOptionLabel={buildUserLabel}
            onChange={(event, newValue) => setSelectedUsers(newValue)}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Utilisateurs"
                placeholder="Sélectionner des collaborateurs"
                InputProps={{
                  ...params.InputProps,
                  endAdornment: (
                    <>
                      {isLoadingUsers ? <CircularProgress color="inherit" size={20} /> : null}
                      {params.InputProps.endAdornment}
                    </>
                  ),
                }}
              />
            )}
          />
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Annuler</Button>
        <Button onClick={handleSubmit} variant="contained" disabled={isSaving || !selectedUsers.length}>
          {isSaving ? 'Ajout...' : 'Ajouter'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
