import { AllCoursesHero } from './all-courses-hero';
import { AllCoursesGrid } from './all-courses-grid';

export default function AllCoursesPage() {
    return (
        <div className="bg-background min-h-screen">
            <AllCoursesHero />
            <AllCoursesGrid />
        </div>
    );
}
