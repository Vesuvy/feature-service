import React, { useState, useEffect } from 'react';
import { 
    Modal, Box, Typography, TextField, Button, Switch, 
    FormControlLabel, CircularProgress, Alert,
    Autocomplete, Chip
} from '@mui/material';
import { createFeature, updateFeature } from '../../services/featureService';
import { getCategories } from '../../services/categoryService';

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
};

const FeatureModal = ({ open, handleClose, feature }) => {
    const [formData, setFormData] = useState({
        title: '',
        desc: '',
        enabled: true,
    });
    const [selectedCategories, setSelectedCategories] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        // Загружаем категории при открытии модального окна
        const fetchCategories = async () => {
            try {
                const categoriesData = await getCategories();
                setCategories(categoriesData);
            } catch (err) {
                console.error('Error fetching categories:', err);
            }
        };

        if (open) {
            fetchCategories();
        }
    }, [open]);

    useEffect(() => {
        if (feature) {
            setFormData({
                title: feature.title || '',
                desc: feature.desc || '',
                enabled: feature.enabled !== undefined ? feature.enabled : true,
            });
            
            // Если редактируем существующую фичу, загружаем её категории
            const fetchFeatureCategories = async () => {
                try {
                    const featureCategories = await getFeatureCategories(feature.id);
                    // Находим полные объекты категорий по ID
                    const selectedCats = featureCategories.map(fc => 
                        categories.find(c => c.id === fc.id) || fc
                    );
                    setSelectedCategories(selectedCats);
                } catch (err) {
                    console.error('Error fetching feature categories:', err);
                }
            };
            
            if (feature.id && categories.length > 0) {
                fetchFeatureCategories();
            }
        } else {
            setFormData({
                title: '',
                desc: '',
                enabled: true,
            });
            setSelectedCategories([]);
        }
        setError(null);
    }, [feature, open, categories]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData({
            ...formData,
            [name]: type === 'checkbox' ? checked : value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        try {
            const featureData = {
                ...formData,
                categoryIds: selectedCategories.map(cat => cat.id)
            };
            
            if (feature) {
                // Логика обновления фичи
                await updateFeature(feature.id, featureData);
            } else {
                // Логика создания фичи
                await createFeature(featureData);
            }
            handleClose(); // Закрываем модальное окно после успешного сохранения
        } catch (err) {
            setError(err.message || 'Ошибка при сохранении фичи');
            console.error('Error saving feature:', err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal
            open={open}
            onClose={handleClose}
            aria-labelledby="modal-title"
            aria-describedby="modal-description"
        >
            <Box sx={style} component="form" onSubmit={handleSubmit}>
                <Typography id="modal-title" variant="h6" component="h2" sx={{ mb: 2 }}>
                    {feature ? 'Редактировать фичу' : 'Добавить фичу'}
                </Typography>
                {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
                <TextField
                    fullWidth
                    label="Название"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    required
                    sx={{ mb: 2 }}
                />
                <TextField
                    fullWidth
                    label="Описание"
                    name="desc"
                    value={formData.desc}
                    onChange={handleChange}
                    multiline
                    rows={4}
                    sx={{ mb: 2 }}
                />
                <FormControlLabel
                    control={
                        <Switch
                            checked={formData.enabled}
                            onChange={handleChange}
                            name="enabled"
                        />
                    }
                    label="Включена"
                    sx={{ 
                        mb: 2,
                        '& .MuiFormControlLabel-label': {
                            color: 'black'
                        }
                    }}
                    
                />
                
                {/* Выбор категорий */}
                <Autocomplete
                    multiple
                    id="categories"
                    options={categories}
                    value={selectedCategories}
                    onChange={(event, newValue) => setSelectedCategories(newValue)}
                    getOptionLabel={(option) => option.title}
                    renderInput={(params) => (
                        <TextField
                            {...params}
                            label="Категории"
                            placeholder="Выберите категории"
                        />
                    )}
                    renderTags={(value, getTagProps) =>
                        value.map((option, index) => (
                            <Chip
                                label={option.title}
                                {...getTagProps({ index })}
                                key={option.id}
                            />
                        ))
                    }
                    sx={{ mb: 2 }}
                />
                
                <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
                    <Button onClick={handleClose} color="secondary">
                        Отмена
                    </Button>
                    <Button type="submit" variant="contained" disabled={loading}>
                        {loading ? <CircularProgress size={24} /> : (feature ? 'Сохранить изменения' : 'Добавить')}
                    </Button>
                </Box>
            </Box>
        </Modal>
    );
};

export default FeatureModal;