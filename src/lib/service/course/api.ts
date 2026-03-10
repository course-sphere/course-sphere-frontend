import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { apiClient, ApiError } from '@/lib/api/axios-config';
import { CourseDetailResponse, CourseInitFormData } from '@/lib/service/course';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

const MOCK_ID = '0e0a1ef0-3599-4101-ac45-f4bde3939160';

let MOCK_COURSE_DB: CourseDetailResponse = {
    id: MOCK_ID,
    title: 'Introduction to Calculus',
    subtitle:
        'Master the fundamentals of limits, derivatives, and integrals in this comprehensive guide.',
    description:
        '<p>This course will teach you everything you need to know about <strong>Calculus</strong>. No prior advanced math required!</p>',
    category: [{ id: '1', text: 'Mathematics' }],
    level: 'beginner',
    thumbnail_url:
        'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?q=80&w=2000&auto=format&fit=crop',
    promo_video_url: null,
    is_free: false,
    price: 49.99,
    discount_price: 0,
    prerequisites: [],
    requirements: ['Basic Algebra'],
    learning_objectives: ['Understand limits', 'Calculate derivatives'],
    target_audience: ['High school students', 'College freshmen'],
    instructor: {
        id: 'ins-1',
        name: 'Nam Dang',
        avatar_url: 'https://github.com/shadcn.png',
    },
    status: 'draft',
    rating: 0,
    rating_count: 0,
    enrolled_students: 0,
    total_video_duration_minutes: 0,
    total_coding_exercises: 0,
    total_file_resources: 0,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
};

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

export const useGetCourseDetail = (courseId: string) => {
    return useQuery<CourseDetailResponse, ApiError | Error>({
        queryKey: ['course', courseId],
        queryFn: async () => {
            await new Promise((res) => setTimeout(res, 800));
            // return await apiClient.get<never, CourseDetailResponse>(`/course/${courseId}`);
            if (courseId === MOCK_ID) return MOCK_COURSE_DB;
            throw new Error('Course not found');
        },
        enabled: !!courseId,
    });
};

export const useUpdateCourse = (courseId: string) => {
    const queryClient = useQueryClient();

    return useMutation<
        CourseDetailResponse,
        ApiError | Error,
        Partial<CourseDetailResponse>
    >({
        mutationFn: async (dataToUpdate) => {
            console.log(dataToUpdate);
            await new Promise((res) => setTimeout(res, 800));

            MOCK_COURSE_DB = { ...MOCK_COURSE_DB, ...dataToUpdate };

            // return await apiClient.patch<Partial<CourseDetailResponse>, CourseDetailResponse>(`/course/${courseId}`, dataToUpdate);

            return MOCK_COURSE_DB;
        },
        onSuccess: () => {
            toast.success('Saved changes!');
            queryClient.invalidateQueries({ queryKey: ['course', courseId] });
        },
        onError: () => {
            toast.error('Failed to save changes');
        },
    });
};
