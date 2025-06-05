import React, { useState, useEffect } from 'react';
import { 
    Box, Typography, Button, Container, Grid, Paper, IconButton, 
    CircularProgress, Alert, Table, TableBody, TableCell, 
    TableContainer, TableHead, TableRow, Chip, Switch,
    FormControlLabel, Tooltip
} from '@mui/material';
import { Add, Edit, Delete, Category, LocalOffer } from '@mui/icons-material';
import AdminLayout from '../layouts/AdminLayout';
import { getFeatures, createFeature, updateFeature, deleteFeature } from '../services/featureService';
import { getCategories, createCategory, updateCategory, deleteCategory } from '../services/categoryService';
import { getTags, createTag, updateTag, deleteTag } from '../services/tagService'; 
import FeatureModal from '../components/modals/FeatureModal'; 
import CategoryModal from '../components/modals/CategoryModal';
import TagModal from '../components/modals/TagModal';

const AdminDashboardPage = () => {
    const [featureTagStatuses, setFeatureTagStatuses] = useState({});
    const [features, setFeatures] = useState([]);
    const [categories, setCategories] = useState([]);
    const [tags, setTags] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [featureModalOpen, setFeatureModalOpen] = useState(false);
    const [categoryModalOpen, setCategoryModalOpen] = useState(false);
    const [tagModalOpen, setTagModalOpen] = useState(false);

    const [selectedFeature, setSelectedFeature] = useState(null);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [selectedTag, setSelectedTag] = useState(null);

    /* БЫЛО
    const fetchData = async () => {
        setLoading(true);
        setError(null);
        try {
            const [featuresData, categoriesData, tagsData] = await Promise.all([
                getFeatures(),
                getCategories(),
                getTags(), 
            ]);
            setFeatures(featuresData);
            setCategories(categoriesData);
            setTags(tagsData);
        } catch (err) {
            setError(err.message || 'Ошибка при загрузке данных');
            console.error('Error fetching data:', err);
        } finally {
            setLoading(false);
        }
    }; 
    */

    const fetchData = async () => {
        try {
            setLoading(true);
            setError(null);
            
            // Получаем данные о фичах, категориях и тегах
            const [featuresData, categoriesData, tagsData] = await Promise.all([
                getFeatures(),
                getCategories(),
                getTags()
            ]);
            
            setFeatures(featuresData);
            setCategories(categoriesData);
            setTags(tagsData);
            
            // После получения фич и тегов, получаем статусы
            await fetchFeatureTagStatuses();
        } catch (err) {
            setError(err.message || 'Ошибка при загрузке данных');
            console.error('Error fetching data:', err);
        } finally {
            setLoading(false);
        }
    };

    // функция для получения статусов
    const fetchFeatureTagStatuses = async () => {
        try {
            setLoading(true);
            const statuses = {};
            
            // Для каждой фичи получаем статусы для тегов
            for (const feature of features) {
                const tagStatuses = await getFeatureTags(feature.id);
                statuses[feature.id] = {};
                
                // Преобразуем массив в объект для удобного доступа
                tagStatuses.forEach(status => {
                    statuses[feature.id][status.tagId] = status.isActive;
                });
            }
            
            setFeatureTagStatuses(statuses);
        } catch (err) {
            setError(err.message || 'Ошибка при получении статусов фич для тегов');
            console.error('Error fetching feature tag statuses:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    // --- Feature Handlers ---
    // Функция для получения категорий фичи
    const getFeatureCategories = async (featureId) => {
        try {
            return await getFeatureCategories(featureId);
        } catch (error) {
            console.error('Error fetching feature categories:', error);
            return [];
        }
    };

    const toggleFeatureForTags = async (featureId, tagIds, enabled) => {
        try {
            setLoading(true);
            setError(null);
            await toggleFeatureForTags(featureId, tagIds, enabled);
            // Обновляем состояние таблицы
            fetchFeatureTagStatuses();
        } catch (err) {
            setError(err.message || 'Ошибка при обновлении статуса фичи для тегов');
            console.error(`Toggle feature ${featureId} for tags ${tagIds} to ${enabled} error:`, err);
        } finally {
            setLoading(false);
        }
    };

    const handleAddFeature = () => {
        setSelectedFeature(null);
        setFeatureModalOpen(true);
    };

    const handleEditFeature = (feature) => {
        setSelectedFeature(feature);
        setFeatureModalOpen(true);
    };

    const handleDeleteFeature = async (featureId) => {
        if (!window.confirm('Вы уверены, что хотите удалить эту фичу?')) return;
        try {
            await deleteFeature(featureId);
            fetchData(); // Обновляем данные после удаления
        } catch (err) {
            setError(err.message || 'Ошибка при удалении фичи');
            console.error('Error deleting feature:', err);
        }
    };

    const handleFeatureModalClose = () => {
        setFeatureModalOpen(false);
        setSelectedFeature(null);
        fetchData(); // Обновляем данные после сохранения
    };

    // --- Category Handlers ---
    const handleAddCategory = () => {
        setSelectedCategory(null);
        setCategoryModalOpen(true);
    };

    const handleEditCategory = (category) => {
        setSelectedCategory(category);
        setCategoryModalOpen(true);
    };

    const handleDeleteCategory = async (categoryId) => {
        if (!window.confirm('Вы уверены, что хотите удалить эту категорию?')) return;
        try {
            await deleteCategory(categoryId);
            fetchData(); // Обновляем данные после удаления
        } catch (err) {
            setError(err.message || 'Ошибка при удалении категории');
            console.error('Error deleting category:', err);
        }
    };

    const handleCategoryModalClose = () => {
        setCategoryModalOpen(false);
        setSelectedCategory(null);
        fetchData(); // Обновляем данные после сохранения
    };

    // --- Tag Handlers ---
    const handleAddTag = () => {
        setSelectedTag(null);
        setTagModalOpen(true);
    };

    const handleEditTag = (tag) => {
        setSelectedTag(tag);
        setTagModalOpen(true);
    };

    const handleDeleteTag = async (tagId) => {
        if (!window.confirm('Вы уверены, что хотите удалить этот тег?')) return;
        try {
            await deleteTag(tagId); 
            fetchData(); // Обновляем данные после удаления
        } catch (err) {
            setError(err.message || 'Ошибка при удалении тега');
            console.error('Error deleting tag:', err);
        }
    };

    const handleTagModalClose = () => {
        setTagModalOpen(false);
        setSelectedTag(null);
        fetchData(); // Обновляем данные после сохранения
    };


    return (
        
            <Container maxWidth="false" sx={{ mt: 4, mb: 4, px: 3}}>
                <Typography variant="h4" component="h1" gutterBottom>
                    Административная панель
                </Typography>

                {error && (
                    <Alert severity="error" sx={{ mb: 3 }}>
                        {error}
                    </Alert>
                )}

                {loading ? (
                    <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                        <CircularProgress />
                    </Box>
                ) : (
                    <Grid container spacing={3}>
                        {/* Features Table */}
                        <Grid item xs={12} lg={6}>
                            <Paper sx={{ p: 3 }}>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                                    <Typography variant="h6">Фичи</Typography>
                                    <Button variant="contained" startIcon={<Add />} onClick={handleAddFeature}>
                                        Добавить фичу
                                    </Button>
                                </Box>
                                <TableContainer>
                                    <Table>
                                        <TableHead>
                                            <TableRow>
                                                <TableCell>Название</TableCell>
                                                <TableCell>Описание</TableCell>
                                                <TableCell>Включена</TableCell>
                                                <TableCell>Категории</TableCell>
                                                <TableCell>Действия</TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {features.length === 0 ? (
                                                <TableRow>
                                                    <TableCell colSpan={5} align="center">
                                                        Нет созданных фич
                                                    </TableCell>
                                                </TableRow>
                                            ) : (
                                                features.map(feature => {
                                                    const featureCategories = getFeatureCategories(feature.id);
                                                    return (
                                                        <TableRow key={feature.id}>
                                                            <TableCell>
                                                                <Typography variant="body1" fontWeight="medium">
                                                                    {feature.title}
                                                                </Typography>
                                                            </TableCell>
                                                            <TableCell>
                                                                <Typography variant="body2" color="text.secondary">
                                                                    {feature.desc}
                                                                </Typography>
                                                            </TableCell>
                                                            <TableCell>
                                                                <FormControlLabel
                                                                    control={
                                                                        <Switch 
                                                                            checked={feature.enabled} 
                                                                            onChange={(e) => {
                                                                                // Логика переключения фичи
                                                                                const updatedFeature = {...feature, enabled: e.target.checked};
                                                                                updateFeature(feature.id, updatedFeature);
                                                                            }}
                                                                        />
                                                                    }
                                                                    label={feature.enabled ? 'Вкл' : 'Выкл'}
                                                                />
                                                            </TableCell>
                                                            <TableCell>
                                                                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                                                                    {featureCategories.map(category => (
                                                                        <Chip 
                                                                            key={category.id}
                                                                            label={category.title}
                                                                            size="small"
                                                                            icon={<Category />}
                                                                            variant="outlined"
                                                                        />
                                                                    ))}
                                                                </Box>
                                                            </TableCell>
                                                            <TableCell>
                                                                <Tooltip title="Редактировать">
                                                                    <IconButton 
                                                                        size="small" 
                                                                        color="primary" 
                                                                        onClick={() => handleEditFeature(feature)}
                                                                    >
                                                                        <Edit fontSize="small" />
                                                                    </IconButton>
                                                                </Tooltip>
                                                                <Tooltip title="Удалить">
                                                                    <IconButton 
                                                                        size="small" 
                                                                        color="error" 
                                                                        onClick={() => handleDeleteFeature(feature.id)}
                                                                    >
                                                                        <Delete fontSize="small" />
                                                                    </IconButton>
                                                                </Tooltip>
                                                            </TableCell>
                                                        </TableRow>
                                                    );
                                                })
                                            )}
                                        </TableBody>
                                    </Table>
                                </TableContainer>
                            </Paper>
                        </Grid>


                        {/* Categories Table */}
                        <Grid item xs={12} lg={3}>
                            <Paper sx={{ p: 3 }}>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                                    <Typography variant="h6">Категории</Typography>
                                    <Button variant="contained" startIcon={<Add />} onClick={handleAddCategory}>
                                        Добавить
                                    </Button>
                                </Box>
                                <TableContainer>
                                    <Table size="small">
                                        <TableHead>
                                            <TableRow>
                                                <TableCell>Название</TableCell>
                                                <TableCell>Описание</TableCell>
                                                <TableCell>Действия</TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {categories.length === 0 ? (
                                                <TableRow>
                                                    <TableCell colSpan={3} align="center">
                                                        Нет категорий
                                                    </TableCell>
                                                </TableRow>
                                            ) : (
                                                categories.map(category => (
                                                    <TableRow key={category.id}>
                                                        <TableCell>
                                                            <Typography variant="body2" fontWeight="medium">
                                                                {category.title}
                                                            </Typography>
                                                        </TableCell>
                                                        <TableCell>
                                                            <Typography variant="body2" color="text.secondary">
                                                                {category.desc}
                                                            </Typography>
                                                        </TableCell>
                                                        <TableCell>
                                                            <IconButton 
                                                                size="small" 
                                                                color="primary" 
                                                                onClick={() => handleEditCategory(category)}
                                                            >
                                                                <Edit fontSize="small" />
                                                            </IconButton>
                                                            <IconButton 
                                                                size="small" 
                                                                color="error" 
                                                                onClick={() => handleDeleteCategory(category.id)}
                                                            >
                                                                <Delete fontSize="small" />
                                                            </IconButton>
                                                        </TableCell>
                                                    </TableRow>
                                                ))
                                            )}
                                        </TableBody>
                                    </Table>
                                </TableContainer>
                            </Paper>
                        </Grid>

                        {/* Tags Table */}
                        <Grid item xs={12} lg={3}>
                            <Paper sx={{ p: 3 }}>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                                    <Typography variant="h6">Теги</Typography>
                                    <Button variant="contained" startIcon={<Add />} onClick={handleAddTag}>
                                        Добавить
                                    </Button>
                                </Box>
                                <TableContainer>
                                    <Table size="small">
                                        <TableHead>
                                            <TableRow>
                                                <TableCell>Название</TableCell>
                                                <TableCell>Описание</TableCell>
                                                <TableCell>Действия</TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {tags.length === 0 ? (
                                                <TableRow>
                                                    <TableCell colSpan={3} align="center">
                                                        Нет тегов
                                                    </TableCell>
                                                </TableRow>
                                            ) : (
                                                tags.map(tag => (
                                                    <TableRow key={tag.id}>
                                                        <TableCell>
                                                            <Typography variant="body2" fontWeight="medium">
                                                                {tag.name || tag.title}
                                                            </Typography>
                                                        </TableCell>
                                                        <TableCell>
                                                            <Typography variant="body2" color="text.secondary">
                                                                {tag.desc}
                                                            </Typography>
                                                        </TableCell>
                                                        <TableCell>
                                                            <IconButton 
                                                                size="small" 
                                                                color="primary" 
                                                                onClick={() => handleEditTag(tag)}
                                                            >
                                                                <Edit fontSize="small" />
                                                            </IconButton>
                                                            <IconButton 
                                                                size="small" 
                                                                color="error" 
                                                                onClick={() => handleDeleteTag(tag.id)}
                                                            >
                                                                <Delete fontSize="small" />
                                                            </IconButton>
                                                        </TableCell>
                                                    </TableRow>
                                                ))
                                            )}
                                        </TableBody>
                                    </Table>
                                </TableContainer>
                            </Paper>
                        </Grid>

                        {/* Feature-Tag Relations */}
                        <Grid item xs={12}>
                            <Paper sx={{ p: 3 }}>
                                <Typography variant="h6" sx={{ mb: 2 }}>Настройка фич для тегов</Typography>
                                <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                                    Здесь вы можете настроить, какие фичи включены для определенных тегов
                                </Typography>
                                <TableContainer>
                                    <Table>
                                        <TableHead>
                                            <TableRow>
                                                <TableCell>Фича</TableCell>
                                                {tags.map(tag => (
                                                    <TableCell key={tag.id} align="center">
                                                        <Chip 
                                                            label={tag.title}
                                                            size="small"
                                                            icon={<LocalOffer />}
                                                            variant="outlined"
                                                        />
                                                    </TableCell>
                                                ))}
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {features.map(feature => (
                                                <TableRow key={feature.id}>
                                                    <TableCell>
                                                        <Typography variant="body2" fontWeight="medium">
                                                            {feature.title}
                                                        </Typography>
                                                    </TableCell>
                                                    {tags.map(tag => (
                                                        <TableCell key={tag.id} align="center">
                                                            <Switch
                                                                size="small"
                                                                checked={featureTagStatuses[feature.id]?.[tag.id] || false}
                                                                onChange={(e) => toggleFeatureForTags(feature.id, [tag.id], e.target.checked)}
                                                            />
                                                        </TableCell>
                                                    ))}
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </TableContainer>
                            </Paper>
                        </Grid>                        

                    </Grid>
                )}

                {/* Modals */}
                <FeatureModal
                    open={featureModalOpen}
                    handleClose={handleFeatureModalClose}
                    feature={selectedFeature}
                />
                <CategoryModal
                    open={categoryModalOpen}
                    handleClose={handleCategoryModalClose}
                    category={selectedCategory}
                />
                 <TagModal
                    open={tagModalOpen}
                    handleClose={handleTagModalClose}
                    tag={selectedTag}
                />

            </Container>
    );
};

export default AdminDashboardPage;