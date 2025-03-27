import React from 'react';
import { Outlet } from 'react-router-dom';
import { Box, CssBaseline, Toolbar } from '@mui/material';
import AdminAppBar from '../components/AdminAppBar/AdminAppBar';
import AdminDrawer from '../components/AdminDrawer/AdminDrawer';

const AdminLayout = () => {
    return (
        <Box sx={{ display: 'flex' }}>
            <CssBaseline />
            <AdminAppBar />
            <AdminDrawer />

            <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
                <Toolbar /> {/* Для отступа под AppBar */}
                <Outlet />
            </Box>
        </Box>
    );
};

export default AdminLayout;