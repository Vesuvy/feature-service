import React from 'react';
import { Link } from 'react-router-dom';
import {
    Container,
    Typography,
    Box,
    Button
} from '@mui/material';

const HomePage = () => {
    return (
        <Container maxWidth="lg" sx={{ py: 4 }}>
            <Box sx={{ my: 4, textAlign: 'center' }}>
                <Typography variant="h3" component="h1" gutterBottom>
                    Feature Toggle Сервис
                </Typography>
                <Typography variant="h5" component="h2" gutterBottom>
                    Управление функциональными возможностями вашего приложения
                </Typography>
                <Typography variant="body1" paragraph sx={{ mt: 4, textAlign: 'center' }}>
                    Наш сервис позволяет безопасно развертывать новые функции, управлять их доступностью
                    для разных групп пользователей и отслеживать их влияние на производительность.
                </Typography>

                <Box sx={{ mt: 4, display: 'flex', justifyContent: 'center', gap: 2 }}>
                    <Button
                        variant="outlined"
                        color="violet"
                        component={Link}
                        to="/api/v1/login"
                        
                    >
                        Вход
                    </Button>
                    <Button
                        variant="contained"
                        color="primary"
                        component={Link}
                        to="/api/v1/registration"
                        size="large"
                        sx={{ minWidth: 200 }}
                    >
                        Регистрация
                    </Button>
                </Box>

                <Box sx={{ mt: 4 }}>
                    <Button
                        variant="outlined"
                        color="primary"
                        component="a"
                        href="/documentation"
                        target="_blank"
                        size="large"
                        sx={{ minWidth: 200 }}
                    >
                        Документация
                    </Button>
                </Box>
            </Box>
        </Container>
    );
};

export default HomePage;