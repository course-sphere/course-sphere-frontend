import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';

export function AllCoursesHero() {
    return (
        <section className="from-primary/5 to-background bg-linear-to-b px-4 py-16 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-7xl">
                <div className="space-y-6 text-center">
                    <Badge className="mx-auto">All Courses</Badge>
                    <h1 className="text-foreground text-4xl font-bold text-balance sm:text-5xl">
                        Expand Your Skills with 500+ Courses
                    </h1>
                    <p className="text-muted-foreground mx-auto max-w-2xl text-lg">
                        Learn from industry experts. Browse our complete catalog
                        of courses across web development, data science, design,
                        and more.
                    </p>

                    <div className="mx-auto mt-8 max-w-md">
                        <div className="relative" role="search">
                            <label
                                htmlFor="course-search"
                                className="sr-only"
                            >
                                Search courses
                            </label>
                            <Search
                                className="text-muted-foreground absolute top-1/2 left-3 h-5 w-5 -translate-y-1/2"
                                aria-hidden="true"
                            />
                            <Input
                                id="course-search"
                                type="search"
                                placeholder="Search courses..."
                                className="bg-background/70 py-3 pl-10 text-base shadow-sm"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
