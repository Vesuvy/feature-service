import React, { useState, useEffect } from 'react';
import { Modal, Box, Typography, TextField, Button, CircularProgress, Alert } from '@mui/material';
import { createTag, updateTag } from '../../services/tagService'; // Предполагается, что вы создадите этот сервис

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

const TagModal = ({ open, handleClose, tag }) => {
    const [formData, setFormData] = useState({
        title: '',
        desc: '',
        // Добавьте другие поля тега, если они есть в модели
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (tag) {
            setFormData({
                title: tag.title || '',
                desc: tag.desc || '',
                // Заполните другие поля при редактировании
            });
        } else {
            setFormData({
                title: '',
                desc: '',
                // Сбросьте другие поля при добавлении
            });
        }
        setError(null);
    }, [tag, open]);

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
            if (tag) {
                // Логика обновления тега
                await updateTag(tag.id, formData); // Предполагается, что updateTag будет реализован в tagService
            } else {
                // Логика создания тега
                await createTag(formData); // Предполагается, что createTag будет реализован в tagService
            }
            handleClose(); // Закрываем модальное окно после успешного сохранения
        } catch (err) {
            setError(err.message || 'Ошибка при сохранении тега');
            console.error('Error saving tag:', err);
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
                <Typography id="modal-title" variant="h6" component="h2" sx={{ mb: 2 }} color="black">
                    {tag ? 'Редактировать тег' : 'Добавить тег'}
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
                {/* Добавьте другие поля формы для тега */}
                <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
                    <Button onClick={handleClose} color="secondary">
                        Отмена
                    </Button>
                    <Button type="submit" variant="contained" disabled={loading}>
                        {loading ? <CircularProgress size={24} /> : (tag ? 'Сохранить изменения' : 'Добавить')}
                    </Button>
                </Box>
            </Box>
        </Modal>
    );
};

export default TagModal;