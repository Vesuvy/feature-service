import React from 'react';
import { Outlet } from 'react-router-dom';
import { Box, CssBaseline, Toolbar, Container } from '@mui/material';
import AdminDrawer from '../components/AdminDrawer/AdminDrawer';

const AdminLayout = () => {
    return (
        <Box sx={{ display: '' }}>
            <AdminDrawer />

            <Box component="main" sx={{ flexGrow: 1, p: 1 }}>
                <Toolbar /> {/* Для отступа под AppBar */}
                <Outlet />
            </Box>
        </Box>
    );
};

export default AdminLayout;