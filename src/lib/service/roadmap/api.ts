import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

import { apiClient, ApiError } from '@/lib/api/axios-config';
import {
    CreateRoadmapPayload,
    MoveRoadmapCoursePayload,
    UpdateRoadmapPayload,
} from '@/lib/service/roadmap';

export const useCreateRoadmap = () => {
    return useMutation<string, ApiError | Error, CreateRoadmapPayload>({
        mutationFn: async (payload) => {
            return await apiClient.post<string, string, CreateRoadmapPayload>(
                '/roadmap/',
                payload,
            );
        },
        onSuccess: () => {
            toast.success('Create roadmap successfully');
        },
        onError: (error) => {
            toast.error(
                error.message || 'Error occurred while creating roadmap',
            );
        },
    });
};

export const useUpdateRoadmap = () => {
    const queryClient = useQueryClient();

    return useMutation<
        void,
        ApiError | Error,
        { id: string; data: UpdateRoadmapPayload }
    >({
        mutationFn: async ({ id, data }) => {
            await apiClient.patch<void, void, UpdateRoadmapPayload>(
                `/roadmap/${id}`,
                data,
            );
        },
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({
                queryKey: ['roadmap', variables.id],
            });
        },
        onError: (error) => {
            toast.error(error.message || 'Failed to update roadmap info');
        },
    });
};

export const useAddRoadmapCourse = () => {
    return useMutation<
        void,
        ApiError | Error,
        { id: string; courseId: string }
    >({
        mutationFn: async ({ id, courseId }) => {
            await apiClient.post(`/roadmap/${id}`, { course_id: courseId });
        },
        onError: (error) => {
            toast.error(error.message || 'Failed to add course to roadmap');
        },
    });
};

export const useMoveRoadmapCourse = () => {
    return useMutation<
        void,
        ApiError | Error,
        { id: string; payload: MoveRoadmapCoursePayload }
    >({
        mutationFn: async ({ id, payload }) => {
            await apiClient.post(`/roadmap/${id}/move`, payload);
        },
        onError: (error) => {
            toast.error(error.message || 'Failed to connect courses');
        },
    });
};
