import { Footer } from '@/components/footer';
import { BookOpen, Users, TrendingUp, Zap } from 'lucide-react';
import { notFound } from 'next/navigation';
import { DetailHero } from '@/app/course/[id]/detail-hero';
import { DetailCurriculum } from '@/app/course/[id]/detail-curriculum';
import { DetailInfo } from '@/app/course/[id]/detail-info';
import { getLearningPathById } from '@constant/sample-data';

interface LearningPathPageProps {
    params: Promise<{
        id: string;
    }>;
}

export default async function LearningPathPage(props: LearningPathPageProps) {
    const params = await props.params;
    const path = getLearningPathById(params.id);

    if (!path) {
        notFound();
    }

    const totalLessons = path.modules.reduce(
        (acc, module) => acc + module.lessons.length,
        0,
    );

    const totalHours = path.modules.reduce((acc, module) => {
        const pathHours = module.lessons.reduce((sum, lesson) => {
            const hours = parseInt(lesson.duration?.split(' ')[0] || '0');
            return sum + hours;
        }, 0);
        return acc + pathHours;
    }, 0);

    return (
        <div className="bg-background min-h-screen">
            <DetailHero
                type="learning-path"
                category={path.category}
                title={path.title}
                description={path.description}
                duration={path.duration}
                level={path.level}
                students={path.students}
                progress={path.progress}
                primaryActionLabel="Start Path"
                secondaryActionLabel="View Details"
            />
            <DetailCurriculum
                type="learning-path"
                modules={path.modules}
                totalLessons={totalLessons}
                totalHours={totalHours}
            />
            <DetailInfo
                type="learning-path"
                items={[
                    {
                        label: 'Total Lessons',
                        value: totalLessons,
                        icon: <BookOpen className="h-5 w-5" />,
                    },
                    {
                        label: 'Learners',
                        value: `${(path.students / 1000).toFixed(1)}k+`,
                        icon: <Users className="h-5 w-5" />,
                    },
                    {
                        label: 'Difficulty',
                        value: path.level,
                        icon: <TrendingUp className="h-5 w-5" />,
                    },
                    {
                        label: 'Estimated Time',
                        value: path.duration,
                        icon: <Zap className="h-5 w-5" />,
                    },
                ]}
            />
            <Footer />
        </div>
    );
}
