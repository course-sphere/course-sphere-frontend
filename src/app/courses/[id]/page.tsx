import { getCourseById } from '@constant/sample-data';
import { BookOpen, Users, Award, Globe } from 'lucide-react';
import { notFound } from 'next/navigation';
import { DetailCurriculum } from './detail-curriculum';
import { DetailHero } from './detail-hero';
import { DetailInfo } from './detail-info';

interface CoursePageProps {
    params: Promise<{
        id: string;
    }>;
}

export default async function CoursePage(props: CoursePageProps) {
    const { id } = await props.params;

    const course = getCourseById(id);

    if (!course) {
        notFound();
    }

    const totalLessons = course.modules.reduce(
        (acc, module) => acc + module.lessons.length,
        0,
    );

    return (
        <div className="bg-background min-h-screen">
            <DetailHero
                type="course"
                category={course.category}
                title={course.title}
                description={course.description}
                rating={course.rating}
                ratingCount={course.ratingCount}
                instructor={course.instructor}
                lastUpdated={course.lastUpdated}
                language={course.language}
                duration={course.duration}
                level={course.level}
                students={course.students}
                price={course.price}
            />
            <DetailCurriculum
                type="course"
                modules={course.modules}
                totalLessons={totalLessons}
                totalHours={Math.ceil(totalLessons * 0.75)}
            />
            <DetailInfo
                type="course"
                items={[
                    {
                        label: 'Lessons',
                        value: totalLessons,
                        icon: <BookOpen className="h-5 w-5" />,
                    },
                    {
                        label: 'Students Enrolled',
                        value: `${(course.students / 1000).toFixed(1)}k+`,
                        icon: <Users className="h-5 w-5" />,
                    },
                    {
                        label: 'Certificate',
                        value: 'Yes',
                        icon: <Award className="h-5 w-5" />,
                    },
                    {
                        label: 'Language',
                        value: course.language,
                        icon: <Globe className="h-5 w-5" />,
                    },
                ]}
            />
        </div>
    );
}
