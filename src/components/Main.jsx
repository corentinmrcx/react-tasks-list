import React from 'react';
import { Box, Button, Stack } from '@mui/material';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import {  useDispatch } from 'react-redux';
import { addNotification } from '../store/slices/notification.js';

export default function Main() {
  const dispatch = useDispatch();

  const handleAddNotification = (type) => {
    dispatch(addNotification({
      content: `Nouvelle notification de type ${type}`,
      type: type,
    }));
  };

  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
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
    </Box>
  );
}
