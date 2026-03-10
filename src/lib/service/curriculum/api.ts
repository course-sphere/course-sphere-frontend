import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { generateId } from '@/lib/utils';
// import { apiClient, ApiError } from '@/lib/api/axios-config';

import {
    Material,
    CreateMaterialPayload,
    UpdateMaterialPayload,
    MoveMaterialPayload,
} from './type';

import { DraftLesson, LessonItemType } from '@/lib/service/lesson';

let MOCK_DB: Material[] = [
    {
        id: 'mat-1',
        title: 'Welcome to the course',
        kind: 'video',
        lesson: 'Lesson 1: Intro',
        position: 1,
        is_required: true,
    },
    {
        id: 'mat-2',
        title: 'Installation Guide',
        kind: 'text',
        lesson: 'Lesson 1: Intro',
        position: 2,
        is_required: true,
    },
    {
        id: 'mat-3',
        title: 'Routing & Layouts',
        kind: 'video',
        lesson: 'Lesson 2: Advanced',
        position: 1,
        is_required: true,
    },
];

const mapKindToType = (kind: string): LessonItemType => {
    if (kind === 'text') return 'reading';
    return kind as LessonItemType;
};

// GET data and transform from flat (course -> lessonMaterial) to tree (course -> lesson --> lessonMaterial)
export const useGetCurriculum = (courseId: string) => {
    return useQuery<DraftLesson[], Error>({
        queryKey: ['curriculum', courseId],
        queryFn: async () => {
            console.log(`[GET] Materials for course: ${courseId}`);
            await new Promise((res) => setTimeout(res, 800));

            // const materials = await apiClient.get<never, Material[]>(`/course/${courseId}/material`);
            const materials = [...MOCK_DB];

            const lessonMap = new Map<string, DraftLesson>();

            materials.forEach((mat) => {
                const lessonName = mat.lesson || 'Uncategorized';

                if (!lessonMap.has(lessonName)) {
                    lessonMap.set(lessonName, {
                        id: lessonName,
                        title: lessonName,
                        sort_order: lessonMap.size + 1,
                        items: [],
                    });
                }

                lessonMap.get(lessonName)!.items.push({
                    id: mat.id,
                    title: mat.title,
                    item_type: mapKindToType(mat.kind),
                    sort_order: mat.position,
                    is_required: mat.is_required,
                    is_preview: false,
                });
            });

            const sortedLessons = Array.from(lessonMap.values());
            sortedLessons.forEach((lesson) => {
                lesson.items.sort((a, b) => a.sort_order - b.sort_order);
            });

            return sortedLessons;
        },
        enabled: !!courseId,
    });
};

export const useCreateMaterial = (courseId: string) => {
    const queryClient = useQueryClient();

    return useMutation<Material, Error, CreateMaterialPayload>({
        mutationFn: async (payload) => {
            console.log('Create Material Payload:', payload);
            await new Promise((res) => setTimeout(res, 800));

            // return await apiClient.post<CreateMaterialPayload, Material>(`/course/${courseId}/material`, payload);

            const newMat: Material = {
                ...payload,
                id: generateId('mat'),
                position:
                    MOCK_DB.filter((m) => m.lesson === payload.lesson).length +
                    1,
            };
            MOCK_DB.push(newMat);
            return newMat;
        },
        onSuccess: () => {
            toast.success('Material added!');
            queryClient.invalidateQueries({
                queryKey: ['curriculum', courseId],
            });
        },
    });
};

export const useUpdateMaterial = (courseId: string) => {
    const queryClient = useQueryClient();

    return useMutation<
        Material,
        Error,
        { materialId: string; payload: UpdateMaterialPayload }
    >({
        mutationFn: async ({ materialId, payload }) => {
            console.log(`Update Material ${materialId}:`, payload);
            await new Promise((res) => setTimeout(res, 600));

            // return await apiClient.patch<UpdateMaterialPayload, Material>(`/material/${materialId}`, payload);

            const index = MOCK_DB.findIndex((m) => m.id === materialId);
            if (index !== -1) {
                MOCK_DB[index] = { ...MOCK_DB[index], ...payload };
            }
            return MOCK_DB[index];
        },
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ['curriculum', courseId],
            });
        },
    });
};

export const useDeleteMaterial = (courseId: string) => {
    const queryClient = useQueryClient();

    return useMutation<void, Error, string>({
        mutationFn: async (materialId) => {
            console.log(`Delete Material ${materialId}`);
            await new Promise((res) => setTimeout(res, 600));

            // await apiClient.delete(`/material/${materialId}`);

            MOCK_DB = MOCK_DB.filter((m) => m.id !== materialId);
        },
        onSuccess: () => {
            toast.success('Material removed');
            queryClient.invalidateQueries({
                queryKey: ['curriculum', courseId],
            });
        },
    });
};

export const useMoveMaterial = (courseId: string) => {
    const queryClient = useQueryClient();

    return useMutation<
        void,
        Error,
        { materialId: string; payload: MoveMaterialPayload }
    >({
        mutationFn: async ({ materialId, payload }) => {
            console.log(`[POST] Move Material ${materialId}:`, payload);
            await new Promise((res) => setTimeout(res, 500));

            // await apiClient.post<MoveMaterialPayload, any>(`/material/${materialId}/move`, payload);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ['curriculum', courseId],
            });
        },
        onError: () => {
            toast.error('Failed to save position. Syncing with server...');
            queryClient.invalidateQueries({
                queryKey: ['curriculum', courseId],
            });
        },
    });
};
