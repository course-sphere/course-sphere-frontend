import { useMutation, useQuery } from '@tanstack/react-query';
import { apiClient, ApiError } from '@/lib/api/axios-config';
import { CourseDetailResponse, CourseInitFormData } from '@/lib/service/course';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

export interface CreateCoursePayload {
    title: string;
    description: string;
    level: string;
    price: number;
    categories: string[];
    learning_objectives: string[];
    prerequisites: string[];
}

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
            const response = await apiClient.post<CreateCoursePayload, string>(
                '/course',
                payload,
            );

            return response;
        },
        onSuccess: (courseId) => {
            toast.success('Course created successfully!');
            router.push(`/dashboard/courses/${courseId}/overview`);
        },
        onError: (error) => {
            toast.error(
                error.message || 'Error occurred while creating course',
            );
        },
    });

    return { mutation };
};

export const useGetCourseDetail = (courseId: string) => {
    return useQuery<CourseDetailResponse, ApiError | Error>({
        queryKey: ['course', courseId],
        queryFn: async () => {
            const response = await apiClient.get<never, CourseDetailResponse>(
                `/courses/${courseId}`,
            );
            return response;
        },
        enabled: !!courseId,
        staleTime: 3 * 60 * 1000,
    });
};
