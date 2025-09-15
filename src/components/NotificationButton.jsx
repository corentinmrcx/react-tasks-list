import React, { useState } from "react";
import Badge from "@mui/material/Badge";
import NotificationsIcon from "@mui/icons-material/Notifications";
import { useSelector, useDispatch } from "react-redux";
import NotificationsDrawer from "./NotificationsDrawer";
import { removeNotification, clearNotifications } from "../store/slices/notification";

export default function NotificationButton() {
  const notifications = useSelector(state => state.notifications.notifications);
  const badgeCount = notifications.length;
  const dispatch = useDispatch();
  const [drawerOpen, setDrawerOpen] = useState(false);

  const handleRemove = (id) => dispatch(removeNotification(id));
  const handleClearAll = () => dispatch(clearNotifications());

  return (
    <>
      <Badge
        badgeContent={badgeCount}
        color="error"
        onClick={() => setDrawerOpen(true)}
        sx={{ cursor: "pointer" }}
      >
        <NotificationsIcon />
      </Badge>
      <NotificationsDrawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        notifications={notifications}
        onRemove={handleRemove}
        onClearAll={handleClearAll}
      />
    </>
  );
}