import axios from 'axios';
import { getAuthToken } from '../util/auth';

const token = getAuthToken()

export const axiosInstanceJson = axios.create({
    baseURL: import.meta.env.VITE_API_URI || 'https://warehousemanagement-api-dev-bsg3fveyfaacdfe7.southeastasia-01.azurewebsites.net',
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
        'Authorization': token ? `Bearer ${token}` : '',
    },
});