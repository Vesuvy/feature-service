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
        { text: 'Фичи', icon: <FeatureIcon />, path: '/admin/features' },
        { text: 'Категории Фич', icon: <CategoryIcon />, path: '/admin/categories' },

        { text: 'Группы Пользователей', icon: <TagIcon />, path: '/admin/tags' },

        { text: 'Аналитика', icon: <AnalyticsIcon />, path: '/admin/analytics' },

        { text: 'Расписание', icon: <DashboardIcon />, path: '/admin/dashboard' }
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