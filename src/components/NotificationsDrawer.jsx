import React from "react";
import { Drawer, Box, IconButton, Typography, Stack, Alert, Button } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import CloseIcon from "@mui/icons-material/Close";

export default function NotificationsDrawer({ open,
                                              onClose,
                                              notifications,
                                              onRemove,
                                              onClearAll,
                                            }) {
  return (
    <Drawer anchor="right" open={open} onClose={onClose}>
      <Box sx={{ width: 350, p: 2, display: "flex", flexDirection: "column" }}>
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
          <Typography variant="h6">Toutes les notifications</Typography>
          <IconButton onClick={onClose}><CloseIcon /></IconButton>
        </Box>
        <Button
          variant="contained"
          color="error"
          startIcon={<DeleteIcon />}
          onClick={onClearAll}
          sx={{ mb: 2 }}
        >
          Supprimer tout
        </Button>
        <Stack spacing={2} sx={{ overflowY: "auto", flexGrow: 1 }}>
          {notifications.length === 0 ? (
            <Typography color="text.secondary">Aucune notification</Typography>
          ) : (
            notifications.map((notif) => (
              <Alert
                key={notif.id}
                severity={notif.type}
                action={
                  <IconButton
                    aria-label="delete"
                    color="inherit"
                    size="small"
                    onClick={() => onRemove(notif.id)}
                  >
                    <DeleteIcon fontSize="inherit" />
                  </IconButton>
                }
                onClick={() => onRemove(notif.id)}
              >
                {notif.content}
                {!notif.visible && (
                  <Typography variant="caption" sx={{ ml: 1, opacity: 0.6 }}>
                    (cachée)
                  </Typography>
                )}
              </Alert>
            ))
          )}
        </Stack>
      </Box>
    </Drawer>
  );
}