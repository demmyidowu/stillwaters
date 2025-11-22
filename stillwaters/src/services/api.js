import axios from 'axios';
import { Platform } from 'react-native';

// Use localhost for iOS simulator, 10.0.2.2 for Android emulator
const BASE_URL = Platform.select({
    ios: 'http://localhost:3000',
    android: 'http://10.0.2.2:3000',
    default: 'http://localhost:3000',
});

const api = axios.create({
    baseURL: BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

export const sendMessage = async (question) => {
    try {
        const response = await api.post('/api/chat', { question });
        return response.data;
    } catch (error) {
        console.error('API Error:', error);
        throw error;
    }
};

export default api;
