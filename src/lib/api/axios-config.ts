import axios, {
    AxiosError,
    type AxiosInstance,
    type AxiosResponse,
} from 'axios';
import { useAuthStore } from '../stores/use-auth-store';
import { authClient } from '@/lib/api-client';
import { API_URL } from '../api-client/config';

const apiUrl = API_URL;

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

let tokenFetchPromise: Promise<string | null> | null = null;

apiClient.interceptors.request.use(
    async (config) => {
        // check store if it have token
        let token = useAuthStore.getState().jwtToken;

        if (!token) {
            if (!tokenFetchPromise) {
                tokenFetchPromise = authClient
                    .token()
                    .then(({ data, error }) => {
                        if (error || !data) {
                            console.error('Cannot get token', error);
                            return null;
                        }

                        const newToken = data.token;
                        useAuthStore.getState().setJwtToken(newToken);
                        return newToken;
                    })
                    .finally(() => {
                        tokenFetchPromise = null;
                    });
            }
            token = await tokenFetchPromise;
        }
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
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
            useAuthStore.getState().setJwtToken(null);
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
