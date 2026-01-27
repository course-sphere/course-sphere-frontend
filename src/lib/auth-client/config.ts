import { createAuthClient } from 'better-auth/react';
import { DEFAULT_AUTH_URL } from './constants';

export const config: Parameters<typeof createAuthClient>[0] = {
    baseURL: process.env.NEXT_PUBLIC_AUTH_URL || DEFAULT_AUTH_URL,
};
