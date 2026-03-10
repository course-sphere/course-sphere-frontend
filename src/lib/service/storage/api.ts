import { useMutation } from '@tanstack/react-query';
//import axios from 'axios';
//import { apiClient } from '@/lib/api/axios-config';
import { toast } from 'sonner';

export const useUploadMedia = () => {
    return useMutation<string, Error, File>({
        mutationFn: async (file: File) => {
            console.log(file.name, file.type);

            await new Promise((res) => setTimeout(res, 1500));

            return URL.createObjectURL(file);

            /*
            const response = await apiClient.post<any, PresignResponse>('/media/presign', {
                fileName: file.name,
                contentType: file.type,
            });

            await axios.put(response.presignedUrl, file, {
                headers: {
                    'Content-Type': file.type,
                },
            });

            return response.fileUrl;
            */
        },
        onError: (error) => {
            console.error('Error S3:', error);
            toast.error(error.message || 'Error when upload file. Try again');
        },
    });
};
