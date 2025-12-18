import React from 'react';
import { IconButton, Avatar } from '@mui/material';
import { useGetAuthenticatedUserQuery } from '../store/api';

export default function UserButton() {
  const { data: user } = useGetAuthenticatedUserQuery();

  if (!user) {
    return null;
  }

  return (
    <IconButton>
      <Avatar src={user.avatar} alt={user.name || user.login} />
    </IconButton>
  );
}
