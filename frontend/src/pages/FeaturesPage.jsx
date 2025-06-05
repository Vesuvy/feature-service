import React, { useState, useEffect } from 'react';
import {Box, Button, Container, Typography} from '@mui/material';
import FeatureCard from '../components/feature/FeatureCard';
import axios from 'axios';
import {Add} from "@mui/icons-material";
import {useNavigate} from "react-router-dom";

// Моковые данные для тестирования
const mockFeatures = [
    {
        id: 1,
        name: "Геолокация 2GIS",
        description: "описание ыдплплдв",
        enabled: true,
        createdAt: "2025-05-15T10:00:00Z",
        categories: [
            { id: 1, name: "Геолокация" },
            { id: 2, name: "Карты" }
        ]
    },
    {
        id: 2,
        name: "Онлайн-оплата",
        description: "оплата",
        enabled: false,
        createdAt: "2025-05-10T14:30:00Z",
        categories: [
            { id: 3, name: "Платежи" }
        ]
    },
    {
        id: 3,
        name: "Чат поддержки",
        description: "чат с поддержкой 123",
        enabled: true,
        createdAt: "2025-05-18T09:15:00Z",
        categories: [
            { id: 4, name: "Коммуникация" },
            { id: 5, name: "Поддержка" }
        ]
    }
];

// Флаг для переключения между моковыми данными и реальным API
const USE_MOCK_DATA = true;

const FeaturesPage = () => {
    const [features, setFeatures] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchFeatures = async () => {
            try {
                if (USE_MOCK_DATA) {
                    // Имитация задержки запроса
                    await new Promise(resolve => setTimeout(resolve, 800));
                    setFeatures(mockFeatures);
                } else {
                    // Реальный запрос к API
                    const response = await axios.get('/api/v1/admin/features');
                    setFeatures(response.data);
                }
                setError(null);
            } catch (error) {
                setError(USE_MOCK_DATA ? null : error.message);
                console.error('Error fetching features:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchFeatures();
    }, []);

    const handleEdit = (feature) => {
        console.log('Editing feature:', feature);
        // Редирект на страницу редактирования
    };

    const handleDelete = async (featureId) => {
        try {
            if (USE_MOCK_DATA) {
                // Имитация удаления
                await new Promise(resolve => setTimeout(resolve, 300));
                setFeatures(features.filter(f => f.id !== featureId));
                console.log(`Фича ${featureId} удалена (мок)`);
            } else {
                // Реальный запрос на удаление
                await axios.delete(`/api/v1/admin/features/${featureId}`);
                setFeatures(features.filter(f => f.id !== featureId));
            }
            setError(null);
        } catch (error) {
            setError(error.message);
            console.error('Error deleting feature:', error);
        }
    };

    if (loading) {
        return (
            <Container maxWidth="md" sx={{ py: 4 }}>
                <Typography>Загрузка...</Typography>
            </Container>
        );
    }

    if (error) {
        return (
            <Container maxWidth="md" sx={{ py: 4 }}>
                <Typography color="error">Ошибка: {error}</Typography>
            </Container>
        );
    }

    return (
        <Container maxWidth="md" sx={{ py: 4 }}>
            <Box sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                mb: 3
            }}>

                <Typography variant="h4" component="h1" gutterBottom>
                    Управление фичами
                </Typography>
                <Button
                    variant="contained"
                    startIcon={<Add />}
                    onClick={() => navigate('/api/v1/admin/createFeature')}
                >
                    Создать фичу
                </Button>

            </Box>


            {features.length === 0 ? (
                <Typography>Нет доступных фич</Typography>
            ) : (
                features.map(feature => (
                    <FeatureCard
                        key={feature.id}
                        feature={feature}
                        onEdit={handleEdit}
                        onDelete={handleDelete}
                    />
                ))
            )}
        </Container>
    );
};

export default FeaturesPage;