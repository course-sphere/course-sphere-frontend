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
import { CourseDetailResponse } from '../course';

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

export const useGetRoadmapDetail = (id: string) => {
    return useQuery<RoadmapDetailRaw, ApiError | Error>({
        queryKey: ['roadmap-detail', id],
        queryFn: async () => {
            return await apiClient.get<RoadmapDetailRaw, RoadmapDetailRaw>(
                `/roadmap/${id}`,
            );
        },
        enabled: !!id,
    });
};

export const useGetMultipleCourses = (courseIds: string[]) => {
    return useQuery<CourseDetailResponse[], ApiError | Error>({
        queryKey: ['roadmap-courses', courseIds],
        queryFn: async () => {
            if (!courseIds || courseIds.length === 0) return [];
            const promises = courseIds.map((id) =>
                apiClient.get<CourseDetailResponse, CourseDetailResponse>(
                    `/course/${id}`,
                ),
            );
            return await Promise.all(promises);
        },
        enabled: !!courseIds && courseIds.length > 0,
    });
};

export const useApplyRoadmap = () => {
    return useMutation<void, ApiError | Error, string>({
        mutationFn: async (id) => {
            await apiClient.post(`/roadmap/${id}/apply`, {});
        },
        onSuccess: () => {
            toast.success('Successfully enrolled in the roadmap!');
        },
        onError: (error) => {
            toast.error(error.message || 'Failed to enroll roadmap');
        },
    });
};
