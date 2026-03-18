import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

import { apiClient, ApiError } from '@/lib/api/axios-config';
import {
    CourseDetailResponse,
    CourseInitFormData,
    CourseMaterialItem,
    CourseResponse,
    CreateCoursePayload,
    UpdateCoursePayload,
} from '@/lib/service/course';

const mapToCreatePayload = (data: CourseInitFormData): CreateCoursePayload => ({
    title: data.title,
    description: data.description,
    level: data.level,
    price: data.is_free ? 0 : data.price,
    categories: data.categories.map((cat) => cat.text),
    learning_objectives: data.learning_objectives
        .map((obj) => obj.value)
        .filter((val) => val.trim() !== ''),
    prerequisites: data.prerequisites
        ? data.prerequisites.map((pre) => pre.course_id)
        : [],
});

export const useCreateCourse = () => {
    const router = useRouter();

    const mutation = useMutation<string, ApiError | Error, CourseInitFormData>({
        mutationFn: async (values) => {
            const payload = mapToCreatePayload(values);

            const response = await apiClient.post<
                string,
                string,
                CreateCoursePayload
            >('/course/', payload);

            return response;
        },
        onSuccess: (courseId) => {
            toast.success('Course created successfully!');
            router.push(`/course/${courseId}/overview`);
        },
        onError: (error) => {
            toast.error(
                error.message || 'Error occurred while creating course',
            );
        },
    });
    return { mutation };
};

export const useGetAllCourses = () => {
    return useQuery<CourseResponse[], ApiError | Error>({
        queryKey: ['all-courses'],
        queryFn: async () => {
            return await apiClient.get<CourseResponse[], CourseResponse[]>(
                '/course/',
            );
        },
        staleTime: 1000 * 60 * 10,
    });
};

export const useGetCourseDetail = (courseId: string) => {
    return useQuery<CourseDetailResponse, ApiError | Error>({
        queryKey: ['course', courseId],
        queryFn: async () => {
            return await apiClient.get<
                CourseDetailResponse,
                CourseDetailResponse
            >(`/course/${courseId}`);
        },
        enabled: !!courseId,
        staleTime: 1000 * 60 * 5,
    });
};

// Nhớ import UpdateCoursePayload vào sếp nhé
export const useUpdateCourse = (courseId: string) => {
    const queryClient = useQueryClient();

    return useMutation<
        CourseDetailResponse,
        ApiError | Error,
        UpdateCoursePayload
    >({
        mutationFn: async (dataToUpdate) => {
            console.log('Payload PATCH:', dataToUpdate);

            const response = await apiClient.patch<
                CourseDetailResponse,
                CourseDetailResponse,
                UpdateCoursePayload
            >(`/course/${courseId}`, dataToUpdate);

            return response;
        },
        onSuccess: () => {
            toast.success('Saved changes successfully!');
            queryClient.invalidateQueries({ queryKey: ['course', courseId] });
        },
        onError: (error) => {
            toast.error(
                error.message || 'Failed to save changes. Please try again.',
            );
        },
    });
};

export const useGetCourseMaterials = (courseId: string) => {
    return useQuery<CourseMaterialItem[], ApiError | Error>({
        queryKey: ['course-materials', courseId],
        queryFn: async () => {
            const res = await apiClient.get<
                CourseMaterialItem[],
                CourseMaterialItem[]
            >(`/course/${courseId}/material`);
            return Array.isArray(res) ? res : [];
        },
        enabled: !!courseId,
    });
};
