export type MaterialKind = 'video' | 'text' | 'quiz' | 'coding' | 'file';

// GET course material
export interface Material {
    id: string;
    title: string;
    kind: MaterialKind;
    lesson: string;
    position: number;
    is_required: boolean;
    content?: string;
    required_peers?: number;
    required_score?: number;
}

// Payload POST (Create mateiral)
export interface CreateMaterialPayload {
    title: string;
    kind: MaterialKind;
    lesson: string;
    is_required: boolean;
    content?: string;
    required_peers?: number;
    required_score?: number;
}

// Payload PATCH (Update)
export type UpdateMaterialPayload = Partial<CreateMaterialPayload>;

// Payload POST (Move)
export interface MoveMaterialPayload {
    next_id: string | null;
    prev_id: string | null;
}
