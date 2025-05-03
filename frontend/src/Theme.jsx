import { createTheme } from '@mui/material/styles';

const theme = createTheme({
    palette: {
        primary: {
            main: '#ffffff', // Белый цвет для primary
            contrastText: '#000000', // Черный текст для контраста
        },
        secondary: {
            main: '#f50057', // Пример вторичного цвета
        },
    },
});

export default theme;