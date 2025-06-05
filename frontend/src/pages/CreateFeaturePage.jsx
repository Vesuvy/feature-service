import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Typography, Box, TextField, Button, Alert, MenuItem, Select, InputLabel, FormControl } from '@mui/material';
import { createFeature } from '../services/featureService';
import { getCategories } from '../services/categoryService';

const CreateFeaturePage = () => {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [categoryId, setCategoryId] = useState('');
    const [categories, setCategories] = useState([]);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchCategories = async () => {
            setLoading(true);
            try {
                const data = await getCategories();
                setCategories(data);
            } catch (err) {
                setError('Не удалось загрузить категории');
            } finally {
                setLoading(false);
            }
        };

        fetchCategories();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess(false);

        try {
            await createFeature({
                name,
                description,
                category_id: categoryId
            });

            setSuccess(true);
            setName('');
            setDescription('');
            setCategoryId('');

            setTimeout(() => navigate('/api/v1/admin/features'), 1500);
        } catch (err) {
            setError(err.message || 'Ошибка при создании фичи');
        }
    };

    return (
            <Container maxWidth="md">
                <Box sx={{ mt: 4 }}>
                    <Typography variant="h4" component="h1" gutterBottom>
                        Создание новой фичи
                    </Typography>

                    {error && (
                        <Alert severity="error" sx={{ mb: 3 }}>
                            {error}
                        </Alert>
                    )}

                    {success && (
                        <Alert severity="success" sx={{ mb: 3 }}>
                            Фича успешно создана!
                        </Alert>
                    )}

                    <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
                        <TextField
                            label="Название фичи"
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
                            required
                            margin="normal"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            inputProps={{ maxLength: 255 }}
                        />

                        <FormControl fullWidth margin="normal" required>
                            <InputLabel id="category-select-label">Категория</InputLabel>
                            <Select
                                labelId="category-select-label"
                                value={categoryId}
                                label="Категория"
                                onChange={(e) => setCategoryId(e.target.value)}
                                disabled={loading}
                            >
                                <MenuItem value="">
                                    <em>Выберите категорию</em>
                                </MenuItem>
                                {categories.map((category) => (
                                    <MenuItem key={category.id} value={category.id}>
                                        {category.name}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>

                        <Box sx={{ mt: 2 }}>
                            <Button
                                variant="text"
                                onClick={() => navigate('/api/v1/admin/createCategory')}
                            >
                                + Создать новую категорию
                            </Button>
                        </Box>

                        <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
                            <Button
                                variant="outlined"
                                color="secondary"
                                onClick={() => navigate('/api/v1/admin/features')}
                            >
                                Отмена
                            </Button>

                            <Button
                                type="submit"
                                variant="contained"
                                color="primary"
                                disabled={!name.trim() || !description.trim() || !categoryId}
                            >
                                Создать фичу
                            </Button>
                        </Box>
                    </Box>
                </Box>
            </Container>
    );
};

export default CreateFeaturePage;