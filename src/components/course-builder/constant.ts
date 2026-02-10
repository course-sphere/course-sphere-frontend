// This file define hardcode interface and data for create course progress - NOT related to API integration
export interface Step {
    id: number;
    title: string;
    description: string;
}

export const STEPS: Step[] = [
    { id: 1, title: 'Basic Info', description: 'Course details' },
    { id: 2, title: 'Media', description: 'Thumbnail & video' },
    { id: 3, title: 'Pricing', description: 'Set your price' },
    { id: 4, title: 'Goals', description: 'Learning objectives' },
    { id: 5, title: 'Curriculum', description: 'Build content' },
    { id: 6, title: 'Review', description: 'Submit course' },
];
