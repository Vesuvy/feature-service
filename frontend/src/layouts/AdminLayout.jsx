import React from 'react';
import { Outlet } from 'react-router-dom';
import { Box, CssBaseline, Toolbar, Container } from '@mui/material';
import AdminDrawer from '../components/AdminDrawer/AdminDrawer';

const AdminLayout = () => {
    return (
        <Box sx={{ display: 'flex' }}>
            <AdminDrawer />

            <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
                <Toolbar /> {/* Для отступа под AppBar */}
                <Outlet />
            </Box>
        </Box>
    );
};

export default AdminLayout;