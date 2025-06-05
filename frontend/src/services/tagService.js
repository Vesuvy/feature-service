import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api/v1';

const getToken = () => localStorage.getItem('token');

export const getTags = async () => {
    try {
        const response = await axios.get(`${API_URL}/admin/tags`, {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        });
        // Предполагается, что API возвращает массив тегов в response.data
        return response.data.tags || [];
    } catch (error) {
        throw new Error(error.response?.data?.error || 'Failed to fetch tags');
    }
};

export const createTag = async (tagData) => {
    try {
        const response = await axios.post(`${API_URL}/admin/tags`, tagData, {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`,
                'Content-Type': 'application/json'
            }
        });
        // Предполагается, что API возвращает созданный тег в response.data
        return response.data.tag;
    } catch (error) {
        throw new Error(error.response?.data?.error || 'Failed to create tag');
    }
};

export const updateTag = async (tagId, tagData) => {
    try {
        const response = await axios.put(`${API_URL}/admin/tags/${tagId}`, tagData, {
            headers: {
                'Authorization': `Bearer ${getToken()}`,
                'Content-Type': 'application/json'
            }
        });
        // Предполагается, что API возвращает обновленный тег в response.data
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.error || 'Failed to update tag');
    }
};

export const deleteTag = async (tagId) => {
    try {
        await axios.delete(`${API_URL}/admin/tags/${tagId}`, {
            headers: {
                'Authorization': `Bearer ${getToken()}`
            }
        });
        return true;
    } catch (error) {
        throw new Error(error.response?.data?.error || 'Failed to delete tag');
    }
};