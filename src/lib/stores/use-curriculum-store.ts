import { create } from 'zustand';
import {
    DraftLesson,
    DraftLessonItem,
    LessonItemType,
} from '@/lib/service/lesson';
import { generateId } from '@/lib/utils';

interface CurriculumState {
    lessons: DraftLesson[];
    activeLessonId: string | null;
    activeMaterialId: string | null;
    setActiveItem: (lessonId: string, materialId: string | null) => void;
    setLessons: (lessons: DraftLesson[]) => void;
    addLesson: () => void;
    updateLessonTitle: (lessonId: string, title: string) => void;
    addMaterial: (
        lessonId: string,
        type: LessonItemType,
    ) => DraftLessonItem | null;
    updateMaterialTitle: (
        lessonId: string,
        materialId: string,
        title: string,
    ) => void;
    deleteMaterial: (lessonId: string, materialId: string) => void;
    reorderMaterials: (lessonId: string, newItems: DraftLessonItem[]) => void;
    updateMaterialData: (
        lessonId: string,
        materialId: string,
        data: Partial<DraftLessonItem>,
    ) => void;
}

export const useCurriculumStore = create<CurriculumState>((set, get) => ({
    lessons: [],
    activeLessonId: null,
    activeMaterialId: null,
    setActiveItem: (lessonId, materialId) =>
        set({ activeLessonId: lessonId, activeMaterialId: materialId }),

    setLessons: (lessons) => set({ lessons }),

    addLesson: () => {
        const newLesson: DraftLesson = {
            id: generateId('lesson'),
            title: 'New Section',
            sort_order: get().lessons.length + 1,
            items: [],
        };
        set({ lessons: [...get().lessons, newLesson] });
    },

    updateLessonTitle: (lessonId, title) => {
        set({
            lessons: get().lessons.map((l) =>
                l.id === lessonId ? { ...l, title } : l,
            ),
        });
    },

    addMaterial: (lessonId, type) => {
        const { lessons } = get();
        const lesson = lessons.find((l) => l.id === lessonId);
        if (!lesson) return null;

        const newItem: DraftLessonItem = {
            id: generateId('mat'),
            title: `New ${type}`,
            item_type: type,
            sort_order: lesson.items.length + 1,
            is_required: true,
            is_preview: false,
        };

        set({
            lessons: lessons.map((l) =>
                l.id === lessonId ? { ...l, items: [...l.items, newItem] } : l,
            ),
            activeLessonId: lessonId,
            activeMaterialId: newItem.id,
        });

        return newItem;
    },

    updateMaterialTitle: (lessonId, materialId, title) => {
        set({
            lessons: get().lessons.map((l) =>
                l.id === lessonId
                    ? {
                          ...l,
                          items: l.items.map((i) =>
                              i.id === materialId ? { ...i, title } : i,
                          ),
                      }
                    : l,
            ),
        });
    },

    deleteMaterial: (lessonId, materialId) => {
        const { activeMaterialId } = get();
        set({
            lessons: get().lessons.map((l) =>
                l.id === lessonId
                    ? {
                          ...l,
                          items: l.items.filter((i) => i.id !== materialId),
                      }
                    : l,
            ),
            activeMaterialId:
                activeMaterialId === materialId ? null : activeMaterialId,
        });
    },

    reorderMaterials: (lessonId, newItems) => {
        const updatedItems = newItems.map((item, index) => ({
            ...item,
            sort_order: index + 1,
        }));
        set({
            lessons: get().lessons.map((l) =>
                l.id === lessonId ? { ...l, items: updatedItems } : l,
            ),
        });
    },

    updateMaterialData: (lessonId, materialId, data) => {
        set({
            lessons: get().lessons.map((l) => {
                if (l.id !== lessonId) return l;
                return {
                    ...l,
                    items: l.items.map((item) =>
                        item.id === materialId ? { ...item, ...data } : item,
                    ),
                };
            }),
        });
    },
}));
