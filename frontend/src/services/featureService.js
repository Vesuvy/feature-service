import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api/v1';

// СОЗДАНИЕ ФИЧИ
export const createFeature = async (featureData) => {
    try {
        const response = await axios.post(`${API_URL}/features`, featureData, {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`,
                'Content-Type': 'application/json'
            }
        });
        return response.data.feature;
    } catch (error) {
        throw new Error(error.response?.data?.message || 'Failed to create feature');
    }
};

// ПОЛУЧЕНИЕ АНАЛИТИКИ
export const getFeatureAnalytics = async () => {

    try {
        const response = await axios.get(`${API_URL}/analytics`, {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`,
                'Content-Type': 'application/json'
            }
        });
        return response.data.feature;
    } catch (error) {
        throw new Error(error.response?.data?.message || 'Failed to fetch analytics')
    }
};

// ПОЛУЧЕНИЕ ПОДРОБНОЙ АНАЛИТИКИ
export const getFeatureDetailedAnalytics = async (featureId) => {
    const response = await api.get(`/features/${featureId}/detailed-analytics`);
    return response.data;
};

// ПОЛУЧЕНИЕ СПИСКА ФИЧ
export const getFeatures = async () => {
    try {
        const response = await axios.get(`${API_URL}/features`, {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        });
        return response.data.features || [];
    } catch (error) {
        throw new Error(error.response?.data?.message || 'Failed to fetch features');
    }
};

// УДАЛЕНИЕ ФИЧИ
export const deleteFeature = async (id) => {
    try {
        await axios.delete(`${API_URL}/features/${id}`, {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        });
        return true;
    } catch (error) {
        throw new Error(error.response?.data?.message || 'Failed to delete feature');
    }
};

// ПОЛУЧЕНИЕ ФИЧИ ПО ID
export const getFeatureById = async (id) => {
    try {
        const response = await axios.get(`${API_URL}/features/${id}`, {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        });
        return response.data.feature;
    } catch (error) {
        throw new Error(error.response?.data?.message || 'Feature not found');
    }
};

// ОБНОВЛЕНИЕ ФИЧИ
export const updateFeature = async (id, featureData) => {
    try {
        const response = await axios.put(`${API_URL}/features/${id}`, featureData, {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`,
                'Content-Type': 'application/json'
            }
        });
        return response.data.feature;
    } catch (error) {
        throw new Error(error.response?.data?.message || 'Failed to update feature');
    }
};

// ПОЛУЧЕНИЕ ФИЧ ПО КАТЕГОРИИ
export const getFeaturesByCategory = async (categoryId) => {
    try {
        const response = await axios.get(`${API_URL}/categories/${categoryId}/features`, {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        });
        return response.data.features || [];
    } catch (error) {
        throw new Error(error.response?.data?.message || 'Failed to fetch features by category');
    }
};