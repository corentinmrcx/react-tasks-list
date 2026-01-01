import React, { useState } from 'react';
import { Box, TextField, Button } from '@mui/material';
import { Add } from '@mui/icons-material';

export default function CreateTask({ onSubmit }) {
  const [label, setLabel] = useState('');

  const handleSubmit = () => {
    if (label.trim()) {
      onSubmit({
        label,
        checked: false,
        rank: 0,
      });
      setLabel('');
    }
  };

  return (
    <Box sx={{ display: 'flex', gap: 1, p: 2 }}>
      <TextField
        label="Nouvelle tache"
        value={label}
        onChange={(event) => setLabel(event.target.value)}
        fullWidth
        size="small"
      />
      <Button
        variant="contained"
        startIcon={<Add />}
        onClick={handleSubmit}
      >
        Ajouter
      </Button>
    </Box>
  );
}
