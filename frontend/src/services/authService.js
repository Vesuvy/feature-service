import axios from 'axios';
import { jwtDecode } from 'jwt-decode';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5173';

export const login = async (email, password) => {
    const response = await axios.post(`${API_URL}/login`, { email, password });
    const { token } = response.data;

    localStorage.setItem('token', token);
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

    return jwtDecode(token);
};

const logout = () => {
    localStorage.removeItem('token');
    delete axios.defaults.headers.common['Authorization'];
};

const getCurrentUser = () => {
    const token = localStorage.getItem('token');
    return token ? jwtDecode(token) : null;
};

const isAuthenticated = () => {
    const user = getCurrentUser();
    return user && user.exp * 1000 > Date.now();
};

const isAdmin = () => {
    const user = getCurrentUser();
    return user && user.isAdmin;
};

export default {
    login,
    logout,
    getCurrentUser,
    isAuthenticated,
    isAdmin
};