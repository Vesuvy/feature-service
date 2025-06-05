import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api/v1';

// СОЗДАНИЕ ФИЧИ
export const createFeature = async (featureData) => {
    try {
        const response = await axios.post(`${API_URL}/admin/features`, featureData, {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`,
                'Content-Type': 'application/json'
            }
        });
        return response.data.feature;
    } catch (error) {
        throw new Error(error.response?.data?.error || 'Failed to create feature');
    }
};

// ПОЛУЧЕНИЕ СПИСКА ФИЧ
export const getFeatures = async () => {
    try {
        const response = await axios.get(`${API_URL}/admin/features`, {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        });
        return response.data.features || [];
    } catch (error) {
        throw new Error(error.response?.data?.error || 'Failed to fetch features');
    }
};

// УДАЛЕНИЕ ФИЧИ
export const deleteFeature = async (id) => {
    try {
        await axios.delete(`${API_URL}/admin/features/${id}`, {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        });
        return true;
    } catch (error) {
        throw new Error(error.response?.data?.error || 'Failed to delete feature');
    }
};

// ПОЛУЧЕНИЕ ФИЧИ ПО ID
export const getFeatureById = async (id) => {
    try {
        const response = await axios.get(`${API_URL}/admin/features/${id}`, {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        });
        return response.data.feature;
    } catch (error) {
        throw new Error(error.response?.data?.error || 'Feature not found');
    }
};

// ОБНОВЛЕНИЕ ФИЧИ
export const updateFeature = async (id, featureData) => {
    try {
        const response = await axios.put(`${API_URL}/admin/features/${id}`, featureData, {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`,
                'Content-Type': 'application/json'
            }
        });
        return response.data.feature;
    } catch (error) {
        throw new Error(error.response?.data?.error || 'Failed to update feature');
    }
};

// ПОЛУЧЕНИЕ ФИЧ ПО КАТЕГОРИИ
export const getFeaturesByCategory = async (categoryId) => {
    try {
        const response = await axios.get(`${API_URL}/admin/categories/${categoryId}/features`, {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        });
        return response.data.features || [];
    } catch (error) {
        throw new Error(error.response?.data?.error || 'Failed to fetch features by category');
    }
};

// ПОЛУЧЕНИЕ КАТЕГОРИЙ ФИЧИ
export const getFeatureCategories = async (featureId) => {
    try {
        const response = await axios.get(`${API_URL}/admin/features/${featureId}/categories`, {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        });
        return response.data.categories || [];
    } catch (error) {
        throw new Error(error.response?.data?.error || 'Failed to fetch feature categories');
    }
};

// УПРАВЛЕНИЕ ДОСТУПНОСТЬЮ ФИЧИ ДЛЯ ТЕГОВ
export const toggleFeatureForTags = async (featureId, tagIds, isActive) => {
    try {
        const response = await axios.post(`${API_URL}/admin/features/${featureId}/tags`, {
            tagIds,
            isActive
        }, {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`,
                'Content-Type': 'application/json'
            }
        });
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.error || 'Failed to toggle feature for tags');
    }
};

// ПОЛУЧЕНИЕ СТАТУСА ФИЧИ ДЛЯ ТЕГОВ
export const getFeatureTags = async (featureId) => {
    try {
        const response = await axios.get(`${API_URL}/admin/features/${featureId}/tags`, {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`,
                'Content-Type': 'application/json'
            }
        });
        return response.data.tagStatuses || [];
    } catch (error) {
        throw new Error(error.response?.data?.error || 'Failed to get feature tags');
    }
};


// АНАЛИТИКА
// ПОЛУЧЕНИЕ АНАЛИТИКИ
export const getFeatureAnalytics = async () => {
    try {
        const response = await axios.get(`${API_URL}/admin/features/analytics`, {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`,
                'Content-Type': 'application/json'
            }
        });
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.error || 'Failed to fetch analytics')
    }
};

// ПОЛУЧЕНИЕ ПОДРОБНОЙ АНАЛИТИКИ
export const getFeatureDetailedAnalytics = async (featureId) => {
    try {
        const response = await axios.get(`${API_URL}/features/${featureId}/detailed-analytics`, {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`,
                'Content-Type': 'application/json'
            }
        });
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.error || 'Failed to fetch detailed analytics');
    }
};

// ЛОГИРОВАНИЕ
export const logFeatureEvent = async (featureId, eventTypeId) => {
    await axios.post(`${API_URL}/features/${featureId}/events`, eventTypeId, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
    });
};