import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api/v1';


// СОЗДАНИЕ
export const createCategory = async (categoryData) => {
    try {
        const response = await axios.post(`${API_URL}/categories`, categoryData, {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`,
                'Content-Type': 'application/json'
            }
        });
        return response.data.category;
    } catch (error) {
        throw new Error(error.response?.data?.message || 'Failed to create category');
    }
};


// СПИСОК
export const getCategories = async () => {
    try {
        const response = await axios.get(`${API_URL}/categories`, {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        });
        return response.data.categories || [];
    } catch (error) {
        throw new Error(error.response?.data?.message || 'Failed to fetch categories');
    }
};


// УДАЛЕНИЕ
export const deleteCategory = async (id) => {
    try {
        await axios.delete(`${API_URL}/categories/${id}`, {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        });
        return true;
    } catch (error) {
        throw new Error(error.response?.data?.message || 'Failed to delete category');
    }
};


// ПОЛУЧЕНИЕ КАТЕГОРИИ ПО ID
export const getCategoryById = async (id) => {
    try {
        const response = await axios.get(`${API_URL}/categories/${id}`, {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        });
        return response.data.category;
    } catch (error) {
        throw new Error(error.response?.data?.message || 'Category not found');
    }
};


// ОБНОВЛЕНИЕ
export const updateCategory = async (id, categoryData) => {
    try {
        const response = await axios.put(`${API_URL}/categories/${id}`, categoryData, {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`,
                'Content-Type': 'application/json'
            }
        });
        return response.data.category;
    } catch (error) {
        throw new Error(error.response?.data?.message || 'Failed to update category');
    }
};