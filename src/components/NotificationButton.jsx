import React from 'react';
import Badge from '@mui/material/Badge';
import NotificationsIcon from '@mui/icons-material/Notifications';
import { useSelector, useDispatch } from 'react-redux';

const NotificationButton = () => {
  const notifications = useSelector(state => state.notifications.notifications);

  return(
    <Badge badgeContent={notifications.length} color="error">
      <NotificationsIcon color="white" />
    </Badge>
    );

}

export default NotificationButton;