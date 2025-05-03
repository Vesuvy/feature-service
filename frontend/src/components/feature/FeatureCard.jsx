import {
    Card, CardContent, Typography, Chip, Box, Divider, Button
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

const FeatureCard = ({ feature, onEdit, onDelete }) => {
    return (
        <Card sx={{
            minWidth: 275,
            mb: 3,
            boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)',
            borderRadius: 2
        }}>
            <CardContent>
                <Box sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    mb: 2
                }}>
                    <Typography variant="h5" component="div">
                        {feature.name}
                    </Typography>
                    <Box>
                        <Button
                            startIcon={<EditIcon />}
                            onClick={() => onEdit(feature)}
                            sx={{ mr: 1 }}
                        >
                            Редактировать
                        </Button>
                        <Button
                            startIcon={<DeleteIcon />}
                            onClick={() => onDelete(feature.id)}
                            color="error"
                        >
                            Удалить
                        </Button>
                    </Box>
                </Box>

                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    {feature.description}
                </Typography>

                <Divider sx={{ my: 2 }} />

                <Typography variant="subtitle2" sx={{ mb: 1 }}>
                    Категории:
                </Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                    {feature.categories.map(category => (
                        <Chip
                            key={category.id}
                            label={category.name}
                            color="primary"
                            size="small"
                        />
                    ))}
                </Box>

                <Box sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    mt: 3
                }}>
                    <Typography variant="caption">
                        Создано: {new Date(feature.createdAt).toLocaleDateString()}
                    </Typography>
                    <Chip
                        label={feature.enabled ? 'Активна' : 'Неактивна'}
                        color={feature.enabled ? 'success' : 'default'}
                        size="small"
                    />
                </Box>
            </CardContent>
        </Card>
    );
};

export default FeatureCard;