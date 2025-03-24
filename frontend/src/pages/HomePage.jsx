import React from 'react';
import { Link } from 'react-router-dom';
import { Button, Container, Typography, Box } from '@mui/material';

const HomePage = () => {
    return (
        <Container maxWidth="md">
            <Box sx={{ my: 4, textAlign: 'center' }}>
                <Typography variant="h3" component="h1" gutterBottom>
                    Feature Toggle Сервис
                </Typography>
                <Typography variant="h5" component="h2" gutterBottom>
                    Управление функциональными возможностями вашего приложения
                </Typography>
                <Typography variant="body1" paragraph>
                    Наш сервис позволяет безопасно развертывать новые функции, управлять их доступностью
                    для разных групп пользователей и отслеживать их влияние на производительность.
                </Typography>

                <Box sx={{ mt: 4, display: 'flex', justifyContent: 'center', gap: 2 }}>
                    <Button
                        variant="contained"
                        color="primary"
                        component={Link}
                        to="/login"
                        size="large"
                    >
                        Вход
                    </Button>
                    <Button
                        variant="outlined"
                        color="primary"
                        component={Link}
                        to="/registration"
                        size="large"
                    >
                        Регистрация
                    </Button>
                </Box>

                <Box sx={{ mt: 4 }}>
                    <Button
                        variant="text"
                        color="secondary"
                        component="a"
                        href="/documentation"
                        target="_blank"
                    >
                        Документация API (Swagger)
                    </Button>
                </Box>
            </Box>
        </Container>
    );
};

export default HomePage;