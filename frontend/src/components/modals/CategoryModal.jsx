import React, { useState, useEffect } from 'react';
import { Modal, Box, Typography, TextField, Button, CircularProgress, Alert } from '@mui/material';
import { createCategory, updateCategory } from '../../services/categoryService';

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

const CategoryModal = ({ open, handleClose, category }) => {
    const [formData, setFormData] = useState({
        title: '',
        desc: '',
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (category) {
            setFormData({
                title: category.title || '',
                desc: category.desc || '',
            });
        } else {
            setFormData({
                title: '',
                desc: '',
            });
        }
        setError(null);
    }, [category, open]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        try {
            if (category) {
                // Логика обновления категории
                await updateCategory(category.id, formData);
            } else {
                // Логика создания категории
                await createCategory(formData);
            }
            handleClose(); // Закрываем модальное окно после успешного сохранения
        } catch (err) {
            setError(err.message || 'Ошибка при сохранении категории');
            console.error('Error saving category:', err);
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
                    {category ? 'Редактировать категорию' : 'Добавить категорию'}
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
                <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
                    <Button onClick={handleClose} color="secondary">
                        Отмена
                    </Button>
                    <Button type="submit" variant="contained" disabled={loading}>
                        {loading ? <CircularProgress size={24} /> : (category ? 'Сохранить изменения' : 'Добавить')}
                    </Button>
                </Box>
            </Box>
        </Modal>
    );
};

export default CategoryModal;