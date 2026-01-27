import { CourseCard, type CourseCardProps } from '@/components/course-card';
import { Button } from '@/components/ui/button';

const allCourses: CourseCardProps[] = [
    {
        id: '1',
        title: 'Web Development Mastery',
        tags: ['Web Development'],
        thumbnail: '',
        instructor: 'Alex Johnson',
        students: 12450,
        rating: 4.8,
        reviews: 1203,
        price: 79.99,
    },
    {
        id: '2',
        title: 'Data Science Fundamentals',
        tags: ['Data Science'],
        thumbnail: '',
        instructor: 'Sarah Chen',
        students: 8920,
        rating: 4.9,
        reviews: 856,
        price: 89.99,
    },
    {
        id: '3',
        title: 'Mobile App Development',
        tags: ['Mobile'],
        thumbnail: '',
        instructor: 'Mike Rodriguez',
        students: 6780,
        rating: 4.7,
        reviews: 642,
        price: 79.99,
    },
    {
        id: '4',
        title: 'UI/UX Design Principles',
        tags: ['Design'],
        thumbnail: '',
        instructor: 'Emma Wilson',
        students: 5430,
        rating: 4.9,
        reviews: 728,
        price: 69.99,
    },
    {
        id: '5',
        title: 'Advanced React Patterns',
        tags: ['Web Development'],
        thumbnail: '',
        instructor: 'Alex Johnson',
        students: 9200,
        rating: 4.8,
        reviews: 945,
        price: 79.99,
    },
    {
        id: '6',
        title: 'Python for Machine Learning',
        tags: ['Data Science'],
        thumbnail: '',
        instructor: 'Sarah Chen',
        students: 7650,
        rating: 4.9,
        reviews: 723,
        price: 89.99,
    },
    {
        id: '7',
        title: 'React Native Mastery',
        thumbnail: '',
        tags: ['Mobile'],
        instructor: 'Mike Rodriguez',
        students: 5120,
        rating: 4.7,
        reviews: 456,
        price: 79.99,
    },
    {
        id: '8',
        title: 'Figma Design Systems',
        tags: ['Design'],
        thumbnail: '',
        instructor: 'Emma Wilson',
        students: 4890,
        rating: 4.8,
        reviews: 612,
        price: 69.99,
    },
];

export default function Home() {
    return (
        <div className='mx-5'>
            {allCourses.map((course) => (
                <CourseCard {...course}></CourseCard>
            ))}
        </div>
    );
}
