import React from 'react';
import { IconButton, Avatar } from '@mui/material';
import { useGetAuthenticatedUserQuery, useLogoutUserMutation } from '../store/api';

export default function UserButton() {
  const { data: user } = useGetAuthenticatedUserQuery();
  const [logout] = useLogoutUserMutation();

  if (!user) {
    return null;
  }

  const handleLogout = () => {
    logout();
  };

  return (
    <IconButton onClick={handleLogout}>
      <Avatar src={user.avatar} alt={user.name || user.login} />
    </IconButton>
  );
}
