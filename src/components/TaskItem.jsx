import React, { useState } from 'react';
import { Box, IconButton, Typography, Checkbox, TextField } from '@mui/material';
import { Delete, Edit, Check, Close } from '@mui/icons-material';

export default function TaskItem({ task, isEditMode, onUpdate, onDelete }) {
  const [isEditing, setIsEditing] = useState(false);
  const [label, setLabel] = useState(task.label || '');

  const handleToggleChecked = () => {
    onUpdate({ checked: !task.checked });
  };

  const handleSave = () => {
    onUpdate({ label });
    setIsEditing(false);
  };

  const handleCancel = () => {
    setLabel(task.label || '');
    setIsEditing(false);
  };

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', px: 1, py: 0.5 }}>
      <Checkbox
        checked={Boolean(task.checked)}
        onChange={handleToggleChecked}
        disabled={isEditing}
      />

      {isEditing ? (
        <>
          <TextField
            value={label}
            onChange={(event) => setLabel(event.target.value)}
            fullWidth
            size="small"
          />
          <IconButton onClick={handleSave} color="primary" size="small">
            <Check fontSize="small" />
          </IconButton>
          <IconButton onClick={handleCancel} size="small">
            <Close fontSize="small" />
          </IconButton>
        </>
      ) : (
        <>
          <Typography sx={{ flexGrow: 1 }}>
            {task.label}
          </Typography>

          {isEditMode && (
            <>
              <IconButton onClick={() => setIsEditing(true)} size="small">
                <Edit fontSize="small" />
              </IconButton>
              <IconButton onClick={onDelete} size="small" color="error">
                <Delete fontSize="small" />
              </IconButton>
            </>
          )}
        </>
      )}
    </Box>
  );
}
