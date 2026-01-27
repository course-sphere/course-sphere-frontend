import axios, {
    AxiosError,
    type AxiosResponse,
    type InternalAxiosRequestConfig,
} from 'axios';
import { authConfig, config } from './config';
import { createAuthClient } from 'better-auth/react';

export const apiClient = axios.create(config);

apiClient.interceptors.request.use(
    (config: InternalAxiosRequestConfig): InternalAxiosRequestConfig => {
        console.log(`${config.method?.toUpperCase()} ${config.url}`);
        return config;
    },
    (error: AxiosError): Promise<AxiosError> => {
        console.error('Request Error:', error);
        return Promise.reject(error);
    },
);

apiClient.interceptors.response.use(
    (response: AxiosResponse): AxiosResponse => {
        return response;
    },
    (error: AxiosError): Promise<AxiosResponse> => {
        return Promise.reject(error);
    },
);

export const authClient = createAuthClient(authConfig);
