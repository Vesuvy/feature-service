import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material';
import { Link } from 'react-router-dom';

function Navbar() {
    return (
        <AppBar position="static" sx={{
            backgroundColor: '#1A2027',
            boxShadow: 'none',
            py: 1
        }}>
            <Toolbar sx={{
                display: 'flex',
                justifyContent: 'space-between',
                maxWidth: 1200,
                width: '100%',
                mx: 'auto'
            }}>
                <Typography
                    variant="h6"
                    component={Link}
                    to="/"
                    sx={{
                        fontWeight: 700,
                        color: 'white',
                        textDecoration: 'none',
                        '& strong': {
                            color: '#4CAF50'
                        }
                    }}
                >
                    <strong>FT</strong> Сервис
                </Typography>

                <Box sx={{ display: 'flex', gap: 2 }}>
                    <Button
                        component={Link}
                        to="/"
                        color="inherit"
                        sx={{ textTransform: 'none' }}
                    >
                        Главная
                    </Button>
                    <Button
                        component={Link}
                        to="/documentation"
                        color="inherit"
                        sx={{ textTransform: 'none' }}
                    >
                        Документация
                    </Button>
                    <Button
                        component={Link}
                        to="/registration"
                        color="inherit"
                        sx={{ textTransform: 'none' }}
                    >
                        Регистрация
                    </Button>
                    <Button
                        component={Link}
                        to="/login"
                        color="inherit"
                        sx={{ textTransform: 'none' }}
                    >
                        Вход
                    </Button>
                </Box>
            </Toolbar>
        </AppBar>
    );
}

export default Navbar;