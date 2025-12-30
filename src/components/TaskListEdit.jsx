import React, { useState } from "react";
import { Typography, Popover, TextField, Box, Button } from "@mui/material";
import PropTypes from 'prop-types';

export default function TaskListEdit({ title, onSave }) {
    const [anchorEl, setAnchorEl] = useState(null);
    const [newTitle, setNewTitle] = useState(title);

    const handleDoubleClick = (event) => {
        setAnchorEl(event.currentTarget);
        setNewTitle(title);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleSave = () => {
        onSave(newTitle);
        handleClose();
    };

    const open = Boolean(anchorEl);

    return (
        <Box>
            <Typography 
                variant="h4" 
                onDoubleClick={handleDoubleClick}
                sx={{ 
                    cursor: 'pointer',
                    userSelect: 'none',
                    padding: 1,
                    borderRadius: 1,
                    '&:hover': {
                        backgroundColor: 'action.hover',
                    }
                }}
            >
                {title}
            </Typography>

            <Popover 
                open={open} 
                anchorEl={anchorEl} 
                onClose={handleClose}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'left',
                }}
            >
                <Box sx={{ padding: 2, minWidth: 300 }}>
                    <TextField 
                        label="Titre" 
                        value={newTitle} 
                        onChange={(event) => setNewTitle(event.target.value)}
                        fullWidth
                        autoFocus
                        onKeyPress={(e) => {
                            if (e.key === 'Enter') {
                                handleSave();
                            }
                        }}
                    />
                    <Box sx={{ marginTop: 2, display: 'flex', gap: 1, justifyContent: 'flex-end' }}>
                        <Button onClick={handleClose}>
                            Annuler
                        </Button>
                        <Button variant="contained" onClick={handleSave}>
                            Enregistrer
                        </Button>
                    </Box>
                </Box>
            </Popover>
        </Box>
    );
}

TaskListEdit.propTypes = {
    title: PropTypes.string.isRequired,
    onSave: PropTypes.func.isRequired,
};
