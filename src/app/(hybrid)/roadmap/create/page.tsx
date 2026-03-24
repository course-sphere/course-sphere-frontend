'use client';

import { DragEvent, useRef, useState, useEffect } from 'react';
import {
    ReactFlow,
    Background,
    Controls,
    MiniMap,
    Connection,
    Edge,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';

import { CourseCustomNode } from '@/components/roadmap/course-custom-node';
import {
    useRoadmapStore,
    CourseNodeData,
} from '@/lib/stores/use-roadmap-store';
import { RoadmapInventory } from '@/components/roadmap/roadmap-inventory';
import { CourseResponse } from '@/lib/service/course';
import {
    useCreateRoadmap,
    useUpdateRoadmap,
    useAddRoadmapCourse,
    useMoveRoadmapCourse,
} from '@/lib/service/roadmap';
import { RoleGuard } from '@/components/layout/role-gaurd';

const nodeTypes = { courseNode: CourseCustomNode };

const DEFAULT_TITLE = 'Untitled Roadmap';
const DEFAULT_DESC = 'Add a detailed description for your roadmap here...';

export default function CreateRoadmapPage() {
    const {
        roadmapId,
        setRoadmapId,
        nodes,
        edges,
        onNodesChange,
        onEdgesChange,
        addNodeToCanvas,
        connectEdgesOnCanvas,
        removeEdge,
    } = useRoadmapStore();

    const reactFlowWrapper = useRef<HTMLDivElement>(null);
    const isFirstMount = useRef(true);

    const [isInitializing, setIsInitializing] = useState(true);
    const [title, setTitle] = useState(DEFAULT_TITLE);
    const [description, setDescription] = useState(DEFAULT_DESC);
    const [isPublishing, setIsPublishing] = useState(false);

    const { mutateAsync: createRoadmap } = useCreateRoadmap();
    const { mutateAsync: updateRoadmap } = useUpdateRoadmap();
    const { mutateAsync: addCourse } = useAddRoadmapCourse();
    const { mutateAsync: moveCourse } = useMoveRoadmapCourse();

    // AUTO-CREATE WORKSPACE
    useEffect(() => {
        if (!isFirstMount.current) return;
        isFirstMount.current = false;

        const initializeWorkspace = async () => {
            if (!roadmapId) {
                try {
                    const newId = await createRoadmap({
                        title: DEFAULT_TITLE,
                        description: DEFAULT_DESC,
                    });
                    setRoadmapId(newId);
                } catch (error) {
                    console.error('Initialization failed:', error);
                }
            }
            setIsInitializing(false);
        };

        initializeWorkspace();
    }, [roadmapId, createRoadmap, setRoadmapId]);

    // INVENTORY HANDLERS
    const handleUpdateTitle = async (newTitle: string) => {
        if (!roadmapId || newTitle.trim() === '') return;
        await updateRoadmap({
            id: roadmapId,
            data: { title: newTitle, description },
        });
        setTitle(newTitle);
    };

    const handleUpdateDescription = async (newDesc: string) => {
        if (!roadmapId) return;
        await updateRoadmap({
            id: roadmapId,
            data: { title, description: newDesc },
        });
        setDescription(newDesc);
    };

    const handlePublish = () => {
        setIsPublishing(true);
        setTimeout(() => {
            setIsPublishing(false);
            toast.success('Roadmap has been published successfully!');
        }, 1000);
    };

    // CANVAS HANDLERS
    const onDrop = async (event: DragEvent<HTMLDivElement>) => {
        event.preventDefault();
        const reactFlowBounds =
            reactFlowWrapper.current?.getBoundingClientRect();
        const courseDataStr = event.dataTransfer.getData(
            'application/reactflow',
        );

        if (!courseDataStr || !reactFlowBounds || !roadmapId) return;

        const course: CourseResponse = JSON.parse(courseDataStr);

        const position = {
            x: event.clientX - reactFlowBounds.left - 136,
            y: event.clientY - reactFlowBounds.top - 50,
        };

        const nodeData: CourseNodeData = {
            courseId: course.id,
            title: course.title,
            thumbnailUrl: course.thumbnail_url || '',
            level: course.level,
            categories: course.categories || [],
            instructorName: course.instructor?.name || 'Instructor',
        };

        addNodeToCanvas(course.id, nodeData, position);

        try {
            await addCourse({ id: roadmapId, courseId: course.id });
        } catch (error) {
            console.error('Failed to add course:', error);
        }
    };

    const onDragOver = (event: DragEvent<HTMLDivElement>) => {
        event.preventDefault();
        event.dataTransfer.dropEffect = 'move';
    };

    const onConnectFlow = async (connection: Connection) => {
        if (!roadmapId || !connection.source || !connection.target) return;

        const sourceNode = nodes.find((n) => n.id === connection.source);
        const targetNode = nodes.find((n) => n.id === connection.target);

        if (!sourceNode || !targetNode) return;

        const newEdge = connectEdgesOnCanvas(connection);

        if (newEdge) {
            try {
                await moveCourse({
                    id: roadmapId,
                    payload: {
                        current_id: targetNode.data.courseId,
                        prev_id: sourceNode.data.courseId,
                        next_id: '',
                    },
                });
            } catch {
                removeEdge(newEdge.id);
            }
        }
    };

    const isValidConnection = (connection: Connection | Edge) => {
        return connection.source !== connection.target;
    };

    if (isInitializing) {
        return (
            <div className="bg-background flex h-screen w-full items-center justify-center">
                <div className="text-muted-foreground flex flex-col items-center gap-4">
                    <Loader2 className="text-primary h-8 w-8 animate-spin" />
                    <p className="text-sm font-medium tracking-wide uppercase">
                        Initializing Workspace...
                    </p>
                </div>
            </div>
        );
    }

    return (
        <RoleGuard allowedRoles={['instructor', 'admin', 'student']}>
            <div className="bg-background flex h-screen w-full overflow-hidden">
                <RoadmapInventory
                    title={title}
                    description={description}
                    onUpdateTitle={handleUpdateTitle}
                    onUpdateDescription={handleUpdateDescription}
                    onPublish={handlePublish}
                    isPublishing={isPublishing}
                />

                <main
                    ref={reactFlowWrapper}
                    className="bg-dot-black/[0.1] dark:bg-dot-white/[0.1] relative flex-1"
                    onDrop={onDrop}
                    onDragOver={onDragOver}
                >
                    <ReactFlow
                        nodes={nodes}
                        edges={edges}
                        onNodesChange={onNodesChange}
                        onEdgesChange={onEdgesChange}
                        onConnect={onConnectFlow}
                        nodeTypes={nodeTypes}
                        isValidConnection={isValidConnection}
                        snapToGrid={true}
                        snapGrid={[16, 16]}
                        defaultEdgeOptions={{ type: 'smoothstep' }}
                        fitView
                    >
                        <Background
                            gap={24}
                            size={1}
                            color="#94a3b8"
                            className="opacity-20"
                        />
                        <Controls
                            className="border-border mb-6! ml-6! shadow-md"
                            showInteractive={false}
                        />
                        <MiniMap
                            zoomable
                            pannable
                            className="border-border right-6! bottom-6! rounded-xl border shadow-md"
                        />
                    </ReactFlow>
                </main>
            </div>
        </RoleGuard>
    );
}
