import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { apiClient, ApiError } from '@/lib/api/axios-config';
import {
    WalletResponse,
    WalletHistory,
    CreatePaymentPayload,
    PaymentCallbackPayload,
    WithdrawPayload,
} from '@/lib/service/wallet';

export const useGetWallet = () => {
    return useQuery<WalletResponse, ApiError | Error>({
        queryKey: ['wallet'],
        queryFn: async () => {
            return await apiClient.get<WalletResponse, WalletResponse>(
                '/payment/wallet/',
            );
        },
    });
};

export const useGetWalletHistories = () => {
    return useQuery<WalletHistory[], ApiError | Error>({
        queryKey: ['wallet-histories'],
        queryFn: async () => {
            return await apiClient.get<WalletHistory[], WalletHistory[]>(
                '/payment/wallet/histories',
            );
        },
    });
};

export const useCreatePaymentLink = () => {
    return useMutation<string, ApiError | Error, CreatePaymentPayload>({
        mutationFn: async (payload) => {
            return await apiClient.post<string, string, CreatePaymentPayload>(
                '/payment/',
                payload,
            );
        },
        onError: (error) => {
            toast.error(error.message || 'Failed to create payment link');
        },
    });
};

export const useWithdraw = () => {
    const queryClient = useQueryClient();
    return useMutation<string, ApiError | Error, WithdrawPayload>({
        mutationFn: async (payload) => {
            return await apiClient.post<string, string, WithdrawPayload>(
                '/payment/withdraw',
                payload,
            );
        },
        onSuccess: () => {
            toast.success('Withdrawal request submitted successfully');
            queryClient.invalidateQueries({ queryKey: ['wallet'] });
            queryClient.invalidateQueries({ queryKey: ['wallet-histories'] });
        },
        onError: (error) => {
            toast.error(error.message || 'Failed to process withdrawal');
        },
    });
};

export const usePaymentCallback = () => {
    return useMutation<string, ApiError | Error, PaymentCallbackPayload>({
        mutationFn: async (payload) => {
            return await apiClient.post<string, string, PaymentCallbackPayload>(
                '/payment/callback',
                payload,
            );
        },
    });
};
