import { AppBar, Toolbar, Typography, Box, Button, Container } from '@mui/material';
import { Link } from 'react-router-dom';

function Navbar() {
    return (
        <AppBar position="static" sx={{
            backgroundColor: '#3e3e3e',
            boxShadow: 'none',
            py: 1,
        }}>
            <Toolbar sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    px: { xs: 0, sm: 0 }, // убираем лишние отступы
                }}>
                    <Toolbar sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        maxWidth: 1200,
                        width: '100%',
                        mx: 'auto',
                        px: { xs: 2, sm: 3, md: 4, lg: 6 },
                    }}>
                        <Typography
                            variant="h6"
                            component={Link}
                            to="/api/v1"
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

                        <Box sx={{ display: 'flex', gap: 3 }}>
                            <Button className="navbar__NavLink"
                                    component={Link}
                                    to="/api/v1"
                                    color="inherit"
                                    sx={{ textTransform: 'none' }}
                            >
                                Главная
                            </Button>
                            <Button className="navbar__NavLink"
                                    component={Link}
                                    to="/api/v1/docs"
                                    color="inherit"
                                    sx={{ textTransform: 'none' }}
                            >
                                Документация
                            </Button>
                            <Button
                                component={Link}
                                to="/api/v1/registration"
                                color="inherit"
                                sx={{ textTransform: 'none' }}
                            >
                                Регистрация
                            </Button>
                            <Button
                                component={Link}
                                to="/api/v1/login"
                                color="inherit"
                                sx={{ textTransform: 'none' }}
                            >
                                Вход
                            </Button>
                        </Box>
                    </Toolbar>
                </Toolbar>

        </AppBar>
    );
}

export default Navbar;