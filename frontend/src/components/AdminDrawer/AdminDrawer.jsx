import React from 'react';
import { Box, List, ListItem, ListItemIcon, ListItemText, Divider, Button } from '@mui/material';
import {
    Dashboard as DashboardIcon,
    Category as CategoryIcon,
    Flag as FeatureIcon,
    Analytics as AnalyticsIcon,
    Tag as TagIcon
} from '@mui/icons-material';
import { Link } from 'react-router-dom';

const drawerWidth = 240;

const AdminDrawer = () => {
    const menuItems = [
        { text: 'Аналитика', icon: <AnalyticsIcon />, path: '/api/v1/admin/analytics' },

        { text: 'Панель управления', icon: <DashboardIcon />, path: '/api/v1/admin/dashboard' }
    ];

    return (
        <Box
            component="nav"
            sx={{ width: { sm: 150 }, flexShrink: { sm: 0 } }}
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
                            <ListItemIcon sx={{ color: 'white' }}>{item.icon}</ListItemIcon>
                            <ListItemText primary={item.text}
                                          sx={{
                                              color: 'white', // Цвет текста
                                              '& .MuiTypography-root': {
                                                  color: 'white',
                                              },
                                          }}
                            />
                        </ListItem>
                    ))}
                </List>
            </Box>
        </Box>
    );
};

export default AdminDrawer;