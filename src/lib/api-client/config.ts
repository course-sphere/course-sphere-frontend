import { type CreateAxiosDefaults } from 'axios';
import { DEFAULT_API_URL, DEFAUlT_TIME_OUT } from './constants';
import { createAuthClient } from 'better-auth/react';
import {
    jwtClient,
    twoFactorClient,
    usernameClient,
} from 'better-auth/client/plugins';

const API_URL = process.env.NEXT_PUBLIC_API_URL || DEFAULT_API_URL;

export const config: CreateAxiosDefaults = {
    baseURL: API_URL,
    timeout: DEFAUlT_TIME_OUT,
    headers: {
        'Content-Type': 'application/json',
    },
};

export const authConfig: Parameters<typeof createAuthClient>[0] = {
    baseURL: `${API_URL}/auth`,
    plugins: [jwtClient(), usernameClient(), twoFactorClient()],
};
