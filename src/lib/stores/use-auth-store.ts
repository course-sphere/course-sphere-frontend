import { create } from 'zustand';
import { Role } from '../service/user';

export interface User {
    id: string;
    name: string;
    email: string;
    image: string | null;
    role: Role;
}

interface AuthState {
    user: User | null;
    isAuthenticated: boolean;
    isCheckingAuth: boolean;
    setAuth: (user: User | null) => void;
    logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
    user: null,
    isAuthenticated: false,
    isCheckingAuth: true,
    setAuth: (user) =>
        set({ user, isAuthenticated: !!user, isCheckingAuth: false }),
    logout: () =>
        set({ user: null, isAuthenticated: false, isCheckingAuth: false }),
}));
