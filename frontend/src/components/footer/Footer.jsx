import { Box, Typography, Link as MuiLink } from '@mui/material';
import GitHubIcon from '@mui/icons-material/GitHub';
import TelegramIcon from '@mui/icons-material/Telegram';

const Footer = () => {
    return (
        <Box component="footer" sx={{
            bgcolor: '#1A2027',
            color: 'white',
            py: 4,
            mt: 'auto'
        }}>
            <Box sx={{
                maxWidth: 1200,
                mx: 'auto',
                px: 3,
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
            }}>
                <Typography variant="body2">
                    © {new Date().getFullYear()} Feature Toggle Сервис
                </Typography>
                <Box sx={{ display: 'flex', gap: 2 }}>
                    <MuiLink
                        href="https://github.com/VESUVY"
                        target="_blank"
                        rel="noopener"
                        color="inherit"
                    >
                        <GitHubIcon fontSize="medium" />
                    </MuiLink>
                    <MuiLink
                        href="https://t.me/VESUVY"
                        target="_blank"
                        rel="noopener"
                        color="inherit"
                    >
                        <TelegramIcon fontSize="medium" />
                    </MuiLink>
                </Box>
            </Box>
        </Box>
    );
}

export default Footer;