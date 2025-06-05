import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Container, Typography, Box, TextField, Button, Alert, CircularProgress } from '@mui/material';
import { getCategoryById, updateCategory } from '../services/categoryService';
import AdminLayout from '../layouts/AdminLayout';

const EditCategoryPage = () => {
    const { id } = useParams();
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const loadCategory = async () => {
            try {
                const category = await getCategoryById(Number(id));
                setName(category.name);
                setDescription(category.description || '');
            } catch (err) {
                setError(err.message || 'Ошибка при загрузке категории');
            } finally {
                setLoading(false);
            }
        };

        loadCategory();
    }, [id]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess(false);

        try {
            await updateCategory(Number(id), { name, description });
            setSuccess(true);
            setTimeout(() => navigate('/api/v1/admin/categories'), 1500);
        } catch (err) {
            setError(err.message || 'Ошибка при обновлении категории');
        }
    };

    if (loading) {
        return (
            <AdminLayout>
                <Container maxWidth="md">
                    <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                        <CircularProgress />
                    </Box>
                </Container>
            </AdminLayout>
        );
    }

    return (
        <AdminLayout>
            <Container maxWidth="md">
                <Box sx={{ mt: 4 }}>
                    <Typography variant="h4" component="h1" gutterBottom>
                        Редактирование категории
                    </Typography>

                    {error && (
                        <Alert severity="error" sx={{ mb: 3 }}>
                            {error}
                        </Alert>
                    )}

                    {success && (
                        <Alert severity="success" sx={{ mb: 3 }}>
                            Категория успешно обновлена! Перенаправляем...
                        </Alert>
                    )}

                    <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
                        <TextField
                            label="Название категории*"
                            variant="outlined"
                            fullWidth
                            required
                            margin="normal"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            inputProps={{ maxLength: 50 }}
                        />

                        <TextField
                            label="Описание"
                            variant="outlined"
                            fullWidth
                            multiline
                            rows={4}
                            margin="normal"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            inputProps={{ maxLength: 255 }}
                        />

                        <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
                            <Button
                                variant="outlined"
                                color="secondary"
                                onClick={() => navigate('/categories')}
                            >
                                Отмена
                            </Button>

                            <Button
                                type="submit"
                                variant="contained"
                                color="primary"
                                disabled={!name.trim()}
                            >
                                Сохранить изменения
                            </Button>
                        </Box>
                    </Box>
                </Box>
            </Container>
        </AdminLayout>
    );
};

export default EditCategoryPage;