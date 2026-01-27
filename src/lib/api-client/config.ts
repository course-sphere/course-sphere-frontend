import { type CreateAxiosDefaults } from 'axios';
import { DEFAULT_API_URL, DEFAUlT_TIME_OUT } from './constants';

const API_URL = process.env.NEXT_PUBLIC_API_URL || DEFAULT_API_URL;

export const config: CreateAxiosDefaults = {
    baseURL: API_URL,
    timeout: DEFAUlT_TIME_OUT,
    headers: {
        'Content-Type': 'application/json',
    },
};
