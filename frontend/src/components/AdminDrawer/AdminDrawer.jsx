import React, { useState } from 'react';
import { Drawer, List, ListItem, ListItemIcon, ListItemText, Divider } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import {
    Dashboard as DashboardIcon,
    Category as CategoryIcon,
    Flag as FeatureIcon,
    People as UserIcon,
    Settings as SettingsIcon
} from '@mui/icons-material';

const drawerWidth = 240;

const AdminDrawer = () => {
    const [mobileOpen, setMobileOpen] = useState(false);
    const navigate = useNavigate();

    const handleDrawerToggle = () => {
        setMobileOpen(!mobileOpen);
    };

    const menuItems = [
        { text: 'Дашборд', icon: <DashboardIcon />, path: '/admin' },
        { text: 'Категории', icon: <CategoryIcon />, path: '/categories' },
        { text: 'Фичи', icon: <FeatureIcon />, path: '/features' },
        { text: 'Пользователи', icon: <UserIcon />, path: '/users' },
        { text: 'Настройки', icon: <SettingsIcon />, path: '/settings' }
    ];

    return (
        <Box
            component="nav"
            sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
        >
            <Drawer
                variant="permanent"
                sx={{
                    '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
                }}
                open
            >
                <Toolbar />
                <Divider />
                <List>
                    {menuItems.map((item) => (
                        <ListItem
                            button
                            key={item.text}
                            onClick={() => navigate(item.path)}
                        >
                            <ListItemIcon>{item.icon}</ListItemIcon>
                            <ListItemText primary={item.text} />
                        </ListItem>
                    ))}
                </List>
            </Drawer>
        </Box>
    );
};

export default AdminDrawer;