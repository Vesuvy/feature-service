import React, { useState, useEffect } from 'react';
import { Container, Typography, Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, IconButton, CircularProgress, Alert, Dialog, DialogTitle, DialogContent, DialogActions, Button } from '@mui/material';
import { Visibility } from '@mui/icons-material';
import { getFeatureAnalytics, getFeatureDetailedAnalytics } from '../services/featureService';

const AnalyticsPage = () => {
    const [features, setFeatures] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [dialogOpen, setDialogOpen] = useState(false);
    const [selectedFeatureId, setSelectedFeatureId] = useState(null);
    const [detailedData, setDetailedData] = useState(null);
    const [dialogLoading, setDialogLoading] = useState(false);
    const [dialogError, setDialogError] = useState('');

    useEffect(() => {
        const fetchFeatures = async () => {
            try {
                const data = await getFeatureAnalytics();
                setFeatures(data);
            } catch (err) {
                setError(err.message || 'Ошибка при загрузке аналитики');
            } finally {
                setLoading(false);
            }
        };
        fetchFeatures();
    }, []);

    const handleOpenDialog = async (featureId) => {
        setSelectedFeatureId(featureId);
        setDialogOpen(true);
        setDialogLoading(true);
        setDialogError('');
        try {
            const data = await getFeatureDetailedAnalytics(featureId);
            setDetailedData(data);
        } catch (err) {
            setDialogError(err.message || 'Ошибка при загрузке детальной аналитики');
        } finally {
            setDialogLoading(false);
        }
    };

    const handleCloseDialog = () => {
        setDialogOpen(false);
        setSelectedFeatureId(null);
        setDetailedData(null);
        setDialogError('');
    };

    return (
        <Container maxWidth="lg">
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h4" component="h1">
                    Аналитика использования фич
                </Typography>
            </Box>
            {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}
            {loading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                    <CircularProgress />
                </Box>
            ) : (
                <TableContainer component={Paper}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Фича</TableCell>
                                <TableCell>Количество использований</TableCell>
                                <TableCell>Количество ошибок</TableCell>
                                <TableCell>Среднее время выполнения (мс)</TableCell>
                                <TableCell align="right">Действия</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {features.length > 0 ? (
                                features.map((feature) => (
                                    <TableRow key={feature.id}>
                                        <TableCell>{feature.name}</TableCell>
                                        <TableCell>{feature.usageCount}</TableCell>
                                        <TableCell>{feature.errorCount}</TableCell>
                                        <TableCell>{feature.avgExecutionTime.toFixed(2)}</TableCell>
                                        <TableCell align="right">
                                            <IconButton color="primary" onClick={() => handleOpenDialog(feature.id)}>
                                                <Visibility />
                                            </IconButton>
                                        </TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={5} align="center">
                                        Нет данных
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>
            )}
            <Dialog open={dialogOpen} onClose={handleCloseDialog} maxWidth="md" fullWidth>
                <DialogTitle>Детальная аналитика для {detailedData?.name}</DialogTitle>
                <DialogContent>
                    {dialogLoading ? (
                        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                            <CircularProgress />
                        </Box>
                    ) : dialogError ? (
                        <Alert severity="error">{dialogError}</Alert>
                    ) : (
                        <Box>
                            <Typography>Количество использований: {detailedData?.usageCount}</Typography>
                            <Typography>Количество ошибок: {detailedData?.errorCount}</Typography>
                            <Typography>Среднее время выполнения: {detailedData?.avgExecutionTime.toFixed(2)} мс</Typography>
                            <Typography variant="h6" sx={{ mt: 2 }}>Статистика по методам запросов</Typography>
                            <TableContainer component={Paper}>
                                <Table>
                                    <TableHead>
                                        <TableRow>
                                            <TableCell>Метод</TableCell>
                                            <TableCell>Количество</TableCell>
                                            <TableCell>Количество ошибок</TableCell>
                                            <TableCell>Среднее время выполнения (мс)</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {detailedData?.methods?.map((method, index) => (
                                            <TableRow key={index}>
                                                <TableCell>{method.method}</TableCell>
                                                <TableCell>{method.count}</TableCell>
                                                <TableCell>{method.errorCount}</TableCell>
                                                <TableCell>{method.avgExecutionTime.toFixed(2)}</TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </Box>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDialog}>Закрыть</Button>
                </DialogActions>
            </Dialog>
        </Container>
    );
};

export default AnalyticsPage;