import React from 'react';
import Badge from '@mui/material/Badge';
import NotificationsIcon from '@mui/icons-material/Notifications';
import { useSelector, useDispatch } from 'react-redux';
import { addNotification } from '../store/slices/notification';


const NotificationButton = () => {
  const notifications = useSelector(state => state.notifications);
  const dispatch = useDispatch();

  const handleAddNotification = (type) => {
    dispatch(addNotification({
      content: `Nouvelle notification de type ${type}`,
      type: type,
    }));
  };

  return(
    <Badge badgeContent={notifications.length} color="error">
      <NotificationsIcon color="white" />
    </Badge>
    );

}

export default NotificationButton;