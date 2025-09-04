import React from 'react';
import { Box, Button, Stack } from '@mui/material';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';

export default function Main() {
  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
      <Stack direction="row" spacing={2}>
        <Button variant="outlined" startIcon={<ErrorOutlineIcon />}>
          ERROR
        </Button>
        <Button variant="outlined" startIcon={<WarningAmberIcon />}>
          WARNING
        </Button>
        <Button variant="outlined" startIcon={<InfoOutlinedIcon />}>
          INFO
        </Button>
        <Button variant="outlined" startIcon={<CheckCircleOutlineIcon />}>
          SUCCESS
        </Button>
      </Stack>
    </Box>
  );
}
