import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

import { apiClient, ApiError } from '@/lib/api/axios-config';
import {
    CreateRoadmapPayload,
    MoveRoadmapCoursePayload,
    RoadmapAggregated,
    RoadmapDetailRaw,
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
        string,
        ApiError | Error,
        { id: string; payload: MoveRoadmapCoursePayload }
    >({
        mutationFn: async ({ id, payload }) => {
            return await apiClient.post<
                string,
                string,
                MoveRoadmapCoursePayload
            >(`/roadmap/${id}/move-course`, payload);
        },
        onError: (error) => {
            toast.error(error.message || 'Failed to connect courses');
        },
    });
};

export const useGetAllRoadmapsAggregated = () => {
    return useQuery<RoadmapAggregated[], ApiError | Error>({
        queryKey: ['roadmaps-aggregated'],
        queryFn: async () => {
            const ids = await apiClient.get<string[], string[]>('/roadmap/');
            if (!ids || !Array.isArray(ids) || ids.length === 0) return [];

            const promises = ids.map(async (id) => {
                try {
                    const detail = await apiClient.get<
                        RoadmapDetailRaw,
                        RoadmapDetailRaw
                    >(`/roadmap/${id}`);
                    return {
                        id,
                        author_id: detail.author_id,
                        position: detail.position,
                        title: detail.title,
                        description: detail.description,
                        courseIds: detail.courses || [],
                        courseCount: (detail.courses || []).length,
                    } as RoadmapAggregated;
                } catch (error) {
                    console.error(`Failed to fetch roadmap ${id}`, error);
                    return null;
                }
            });

            const results = await Promise.all(promises);

            return results.filter(Boolean) as RoadmapAggregated[];
        },
        staleTime: 1000 * 60 * 5,
    });
};
