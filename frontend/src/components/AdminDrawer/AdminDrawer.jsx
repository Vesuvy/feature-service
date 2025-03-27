import React from 'react';
import { Box, List, ListItem, ListItemIcon, ListItemText, Divider } from '@mui/material';
import {
    Dashboard as DashboardIcon,
    Category as CategoryIcon,
    Flag as FeatureIcon
} from '@mui/icons-material';
import { Link } from 'react-router-dom';

const drawerWidth = 240;

const AdminDrawer = () => {
    const menuItems = [
        { text: 'Дашборд', icon: <DashboardIcon />, path: '/admin/dashboard' },
        { text: 'Категории', icon: <CategoryIcon />, path: '/admin/categories' },
        { text: 'Фичи', icon: <FeatureIcon />, path: '/admin/features' }
    ];

    return (
        <Box
            component="nav"
            sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
        >
            <Box sx={{ width: drawerWidth }}>
                <Divider />
                <List>
                    {menuItems.map((item) => (
                        <ListItem
                            button
                            key={item.text}
                            component={Link}
                            to={item.path}
                        >
                            <ListItemIcon>{item.icon}</ListItemIcon>
                            <ListItemText primary={item.text} />
                        </ListItem>
                    ))}
                </List>
            </Box>
        </Box>
    );
};

export default AdminDrawer;