import { type CreateAxiosDefaults } from 'axios';
import { DEFAULT_API_URL, DEFAUlT_TIME_OUT } from './constants';

export const config: CreateAxiosDefaults = {
    baseURL: process.env.NEXT_PUBLIC_API_URL || DEFAULT_API_URL,
    timeout: DEFAUlT_TIME_OUT,
    headers: {
        'Content-Type': 'application/json',
    },
};
