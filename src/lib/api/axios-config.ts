import axios, {
    AxiosError,
    type AxiosInstance,
    type AxiosResponse,
} from 'axios';
import { getApiUrl } from './api-url';
import { useAuthStore } from '../stores/use-auth-store';

const apiUrl = getApiUrl();

export class ApiError extends Error {
    status?: number;

    constructor(message: string, status?: number) {
        super(message);
        this.name = 'ApiError';
        this.status = status;
    }
}

export const apiClient: AxiosInstance = axios.create({
    baseURL: apiUrl,
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
    },
});

apiClient.interceptors.request.use(
    (config) => {
        console.log(
            `[API Request] ${config.method?.toUpperCase()} ${config.url}`,
        );
        return config;
    },
    (error: AxiosError) => Promise.reject(error),
);

apiClient.interceptors.response.use(
    (response: AxiosResponse) => {
        return response.data;
    },
    (error: AxiosError) => {
        const status = error.response?.status;
        const errorData = error.response?.data;

        if (status === 401) {
            useAuthStore.getState().logout();
        }

        let message = 'Internal Server Error';

        if (typeof errorData === 'string' && errorData.trim() !== '') {
            message = errorData;
        } else if (
            errorData &&
            typeof errorData === 'object' &&
            'message' in errorData
        ) {
            message = String((errorData as Record<string, unknown>).message);
        } else if (error.message) {
            message = error.message;
        }
        return Promise.reject(new ApiError(message, status));
    },
);
