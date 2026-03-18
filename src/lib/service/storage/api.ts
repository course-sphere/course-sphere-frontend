import { apiClient } from '@/lib/api-client';
import { ApiError } from '@/lib/api/axios-config';
import { useMutation } from '@tanstack/react-query';
import { PresignedUrlRequest, PresignedUrlResponse } from './type';

export const useGetPresignedUrl = () => {
    return useMutation<
        PresignedUrlResponse,
        ApiError | Error,
        PresignedUrlRequest
    >({
        mutationFn: async (payload) => {
            return await apiClient.post<
                PresignedUrlResponse,
                PresignedUrlResponse,
                PresignedUrlRequest
            >('/storage/presign/', payload);
        },
    });
};

export const uploadFileToS3 = async (
    file: File,
    responseData: PresignedUrlResponse | { data: PresignedUrlResponse },
) => {
    const presign =
        'data' in responseData ? responseData.data : responseData;
    const formData = new FormData();
    Object.entries(presign.values).forEach(([key, value]) => {
        formData.append(key, value as string);
    });
    formData.append('file', file);
    const uploadRes = await fetch(presign.url, {
        method: 'POST',
        body: formData,
    });
    if (!uploadRes.ok) {
        throw new Error('Upload S3 thất bại!');
    }
    return `${presign.url}/${presign.values.key}`;
};
