import { Box, Typography, Button } from '@mui/material';
import { Link } from 'react-router-dom';

const Header = () => {
    return (
        <Box sx={{
            bgcolor: '#1A2027',
            color: 'white',
            py: 10,
            px: 3,
            textAlign: 'center'
        }}>
            <Box sx={{
                maxWidth: 800,
                mx: 'auto'
            }}>
                <Typography
                    variant="h3"
                    component="h1"
                    gutterBottom
                    sx={{
                        fontWeight: 700,
                        mb: 3
                    }}
                >
                    <strong>Привет! Это feature toggle сервис.</strong>
                </Typography>
                <Typography variant="h6" sx={{ mb: 3 }}>
                    github: VESUVY
                </Typography>
                <Typography variant="body1" sx={{ mb: 4 }}>
                    Этот сервис позволяет управлять функциональными возможностями вашего приложения,
                    включая/выключая их для определенных пользователей или групп.
                </Typography>
                <Button
                    component={Link}
                    to="/auth"
                    variant="contained"
                    size="large"
                    sx={{
                        bgcolor: '#4CAF50',
                        '&:hover': {
                            bgcolor: '#3e8e41'
                        }
                    }}
                >
                    Регистрация / Вход
                </Button>
            </Box>
        </Box>
    );
}

export default Header;