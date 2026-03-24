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

    return useMutation<void, ApiError | Error, WithdrawPayload>({
        mutationFn: async (payload) => {
            return await apiClient.post<void, void, WithdrawPayload>(
                '/payment/withdraw',
                payload,
            );
        },
        onSuccess: () => {
            toast.success('Yêu cầu rút tiền thành công!');
            queryClient.invalidateQueries({ queryKey: ['wallet'] });
            queryClient.invalidateQueries({ queryKey: ['wallet-histories'] });
        },
        onError: (error) => {
            toast.error(error.message || 'Lỗi khi rút tiền');
        },
    });
};

export const usePaymentCallback = () => {
    const queryClient = useQueryClient();

    return useMutation<string, ApiError | Error, PaymentCallbackPayload>({
        mutationFn: async (payload) => {
            return await apiClient.post<string, string, PaymentCallbackPayload>(
                '/payment/callback',
                payload,
            );
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['wallet'] });
            queryClient.invalidateQueries({ queryKey: ['wallet-histories'] });
        },
        onError: (error) => {
            toast.error(error.message || 'Error when update money');
        },
    });
};
