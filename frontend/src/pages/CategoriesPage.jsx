import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {Container,Typography,Box,Button,Table,TableBody,TableCell,TableContainer,TableHead,TableRow,Paper,IconButton,CircularProgress,Alert} from '@mui/material';
import { Add, Edit, Delete } from '@mui/icons-material';
import { getCategories, deleteCategory } from '../services/categoryService';
import AdminLayout from '../layouts/AdminLayout';

const CategoriesPage = () => {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const data = await getCategories();
                setCategories(data);
            } catch (err) {
                setError(err.message || 'Ошибка при загрузке категорий');
            } finally {
                setLoading(false);
            }
        };

        fetchCategories();
    }, []);

    const handleDelete = async (id) => {
        if (!window.confirm('Вы уверены, что хотите удалить эту категорию?')) return;

        try {
            await deleteCategory(id);
            setCategories(categories.filter(cat => cat.id !== id));
        } catch (err) {
            setError(err.message || 'Ошибка при удалении категории');
        }
    };

    return (
            <Container maxWidth="lg">
                <Box sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    mb: 3
                }}>
                    <Typography variant="h4" component="h1">
                        Управление категориями
                    </Typography>
                    <Button
                        variant="contained"
                        startIcon={<Add />}
                        onClick={() => navigate('/admin/categories/createCategory')}
                    >
                        Добавить категорию
                    </Button>
                </Box>

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
                    <TableContainer component={Paper}>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>ID</TableCell>
                                    <TableCell>Название</TableCell>
                                    <TableCell>Описание</TableCell>
                                    <TableCell>Дата создания</TableCell>
                                    <TableCell align="right">Действия</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {categories.length > 0 ? (
                                    categories.map((category) => (
                                        <TableRow key={category.id}>
                                            <TableCell>{category.id}</TableCell>
                                            <TableCell>{category.name}</TableCell>
                                            <TableCell>{category.description || '-'}</TableCell>
                                            <TableCell>
                                                {new Date(category.createdAt).toLocaleDateString()}
                                            </TableCell>
                                            <TableCell align="right">
                                                <IconButton
                                                    color="primary"
                                                    onClick={() => navigate(`/categories/edit/${category.id}`)}
                                                >
                                                    <Edit />
                                                </IconButton>
                                                <IconButton
                                                    color="error"
                                                    onClick={() => handleDelete(category.id)}
                                                >
                                                    <Delete />
                                                </IconButton>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                ) : (
                                    <TableRow>
                                        <TableCell colSpan={5} align="center">
                                            Нет созданных категорий
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </TableContainer>
                )}
            </Container>
    );
};

export default CategoriesPage;