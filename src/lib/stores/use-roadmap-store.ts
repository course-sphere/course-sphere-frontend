import { create } from 'zustand';
import {
    Connection,
    Edge,
    EdgeChange,
    Node,
    NodeChange,
    addEdge,
    OnNodesChange,
    OnEdgesChange,
    applyNodeChanges,
    applyEdgeChanges,
    MarkerType,
} from '@xyflow/react';

export type CourseNodeData = {
    courseId: string;
    title: string;
    thumbnailUrl?: string;
    level: string;
    categories?: string[];
    instructorName?: string;
};

export type CourseNode = Node<CourseNodeData>;

interface RoadmapState {
    roadmapId: string | null;
    isCreating: boolean;
    nodes: CourseNode[];
    edges: Edge[];

    setRoadmapId: (id: string | null) => void;
    setIsCreating: (status: boolean) => void;

    onNodesChange: OnNodesChange<CourseNode>;
    onEdgesChange: OnEdgesChange;

    addNodeToCanvas: (
        courseId: string,
        nodeData: CourseNodeData,
        position: { x: number; y: number },
    ) => void;
    connectEdgesOnCanvas: (connection: Connection) => Edge | null;
    removeNode: (nodeId: string) => void;
    removeEdge: (edgeId: string) => void;
}

export const useRoadmapStore = create<RoadmapState>((set, get) => ({
    roadmapId: null,
    isCreating: false,
    nodes: [],
    edges: [],

    setRoadmapId: (id) => set({ roadmapId: id }),
    setIsCreating: (status) => set({ isCreating: status }),

    onNodesChange: (changes: NodeChange<CourseNode>[]) => {
        set({ nodes: applyNodeChanges(changes, get().nodes) as CourseNode[] });
    },

    onEdgesChange: (changes: EdgeChange[]) => {
        set({ edges: applyEdgeChanges(changes, get().edges) });
    },

    addNodeToCanvas: (courseId, nodeData, position) => {
        const newNode: CourseNode = {
            id: `node-${courseId}-${Date.now()}`,
            type: 'courseNode',
            position,
            data: nodeData,
        };
        set({ nodes: [...get().nodes, newNode] });
    },

    connectEdgesOnCanvas: (connection: Connection) => {
        if (!connection.source || !connection.target) return null;

        const newEdgeId = `edge-${Date.now()}`;
        const newEdge: Edge = {
            ...connection,
            id: newEdgeId,
            animated: true,
            style: { stroke: '#3b82f6', strokeWidth: 2 },
            markerEnd: {
                type: MarkerType.ArrowClosed,
                width: 20,
                height: 20,
                color: '#3b82f6',
            },
        };

        set({ edges: addEdge(newEdge, get().edges) });
        return newEdge;
    },

    removeNode: (nodeId) => {
        set({ nodes: get().nodes.filter((n) => n.id !== nodeId) });
    },
    removeEdge: (edgeId) => {
        set({ edges: get().edges.filter((e) => e.id !== edgeId) });
    },
}));
