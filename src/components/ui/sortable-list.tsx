'use client';

import React, { useMemo } from 'react';
import {
    DndContext,
    closestCenter,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
    DragEndEvent,
} from '@dnd-kit/core';
import {
    SortableContext,
    arrayMove,
    sortableKeyboardCoordinates,
    verticalListSortingStrategy,
    useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

interface BaseItem {
    id: string;
}

interface SortableListProps<T extends BaseItem> {
    items: T[];
    onReorder: (newItems: T[]) => void;
    renderItem: (
        item: T,
        dragHandleProps: Record<string, any> | undefined,
    ) => React.ReactNode;
}

export function SortableList<T extends BaseItem>({
    items,
    onReorder,
    renderItem,
}: SortableListProps<T>) {
    const itemIds = useMemo(() => items.map((item) => item.id), [items]);

    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: { distance: 5 },
        }),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        }),
    );

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;
        if (over && active.id !== over.id) {
            const oldIndex = items.findIndex((item) => item.id === active.id);
            const newIndex = items.findIndex((item) => item.id === over.id);
            onReorder(arrayMove(items, oldIndex, newIndex));
        }
    };

    return (
        <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
        >
            <SortableContext
                items={itemIds}
                strategy={verticalListSortingStrategy}
            >
                <div className="space-y-3">
                    {items.map((item) => (
                        <SortableItem key={item.id} id={item.id}>
                            {(dragHandleProps) =>
                                renderItem(item, dragHandleProps)
                            }
                        </SortableItem>
                    ))}
                </div>
            </SortableContext>
        </DndContext>
    );
}

interface SortableItemProps {
    id: string;
    children: (
        dragHandleProps: Record<string, any> | undefined,
    ) => React.ReactNode;
}

function SortableItem({ id, children }: SortableItemProps) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({ id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        zIndex: isDragging ? 50 : 1,
        opacity: isDragging ? 0.5 : 1,
        position: 'relative' as const,
    };

    return (
        <div ref={setNodeRef} style={style}>
            {children({ ...attributes, ...listeners })}
        </div>
    );
}
