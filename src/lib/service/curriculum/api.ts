import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { apiClient } from '@/lib/api/axios-config';
import { generateId } from '@/lib/utils';

import {
    Material,
    CreateMaterialPayload,
    UpdateMaterialPayload,
    MoveMaterialPayload,
    MaterialKind,
} from './type';

import { DraftLesson, LessonItemType } from '@/lib/service/lesson';

const mapKindToType = (kind: string): LessonItemType => {
    if (kind === 'text') return 'reading';
    if (kind === 'assignment') return 'coding';
    return kind as LessonItemType;
};

export const mapTypeToKind = (type: LessonItemType): MaterialKind => {
    if (type === 'reading') return 'text';
    if (type === 'coding') return 'assignment';
    return type as MaterialKind;
};

export const useGetCurriculum = (courseId: string) => {
    return useQuery<DraftLesson[], Error>({
        queryKey: ['curriculum', courseId],
        queryFn: async () => {
            const { data: materials } = await apiClient.get<Material[]>(
                `/course/${courseId}/material`,
            );

            if (!materials || !Array.isArray(materials)) return [];

            const lessonMap = new Map<string, DraftLesson>();

            materials.forEach((mat) => {
                const lessonName = mat.lesson || 'Uncategorized';

                if (!lessonMap.has(lessonName)) {
                    lessonMap.set(lessonName, {
                        id: generateId('lesson'),
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
            const { data } = await apiClient.post<Material>(
                `/course/${courseId}/material`,
                payload,
            );
            return data;
        },
        onSuccess: () => {
            toast.success('Material added!');
            queryClient.invalidateQueries({
                queryKey: ['curriculum', courseId],
            });
        },
        onError: (err) => {
            toast.error('Failed to create material');
            console.error(err);
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
            const { data } = await apiClient.patch<Material>(
                `/material/${materialId}`,
                payload,
            );
            return data;
        },
        onSuccess: () => {
            toast.success('Saved successfully!');
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
            await apiClient.delete(`/material/${materialId}`);
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
            await apiClient.post(`/material/${materialId}/move`, payload);
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
