import React from 'react';
import { AppBar, Toolbar, Typography, IconButton, Avatar } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';

const AdminAppBar = ({ onDrawerToggle }) => {
    return (
        <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
            <Toolbar>
                <IconButton
                    color="inherit"
                    edge="start"
                    onClick={onDrawerToggle}
                    sx={{ mr: 2 }}
                >
                    <MenuIcon />
                </IconButton>

                <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
                    Feature Toggle Admin
                </Typography>

                <Avatar sx={{ bgcolor: 'secondary.main' }}>A</Avatar>
            </Toolbar>
        </AppBar>
    );
};

export default AdminAppBar;