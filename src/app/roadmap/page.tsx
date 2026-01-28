import { AllLearningPathsGrid } from './all-learning-path-grid';
import { AllLearningPathsHero } from './all-learning-path-hero';

export default function LearningPathsPage() {
    return (
        <div className="bg-background min-h-screen">
            <AllLearningPathsHero />
            <AllLearningPathsGrid />
        </div>
    );
}
