import { useState } from 'react';
import { Check, ChevronsUpDown, Loader2 } from 'lucide-react';
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover';
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from '@/components/ui/command';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useGetAllCourses } from '@/lib/service/course/api';

interface CoursePrerequisiteSelectProps {
    value: string;
    onChange: (value: string, title: string) => void;
}

export function CoursePrerequisiteSelect({
    value,
    onChange,
}: CoursePrerequisiteSelectProps) {
    const [open, setOpen] = useState(false);
    const [search, setSearch] = useState('');

    const { data: allCourses, isLoading } = useGetAllCourses();

    const filteredCourses = (allCourses || [])
        .filter((c) => c.title?.toLowerCase().includes(search.toLowerCase()))
        .slice(0, 5);

    const selectedCourse = allCourses?.find((c) => c.id === value);

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    type="button"
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    className="border-muted-foreground/20 hover:bg-muted/50 h-12 w-full justify-between font-normal shadow-sm"
                >
                    {selectedCourse ? (
                        <span className="text-foreground truncate pr-4 font-medium">
                            {selectedCourse.title}
                        </span>
                    ) : (
                        <span className="text-muted-foreground">
                            Link a prerequisite course...
                        </span>
                    )}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
            </PopoverTrigger>
            <PopoverContent
                className="border-muted-foreground/20 w-100 rounded-xl p-0 shadow-lg"
                align="start"
            >
                <Command shouldFilter={false}>
                    <CommandInput
                        placeholder="Type to search courses..."
                        value={search}
                        onValueChange={setSearch}
                        className="h-11"
                    />
                    <CommandList>
                        {isLoading && (
                            <div className="flex items-center justify-center py-6">
                                <Loader2 className="text-primary h-5 w-5 animate-spin" />
                            </div>
                        )}

                        {!isLoading && filteredCourses.length === 0 && (
                            <CommandEmpty className="text-muted-foreground py-6 text-center text-sm">
                                No courses found.
                            </CommandEmpty>
                        )}

                        <CommandGroup>
                            {filteredCourses.map((course) => (
                                <CommandItem
                                    key={course.id}
                                    value={course.id}
                                    className="cursor-pointer py-3"
                                    onSelect={() => {
                                        onChange(
                                            course.id === value
                                                ? ''
                                                : course.id,
                                            course.title,
                                        );
                                        setOpen(false);
                                    }}
                                >
                                    <Check
                                        className={cn(
                                            'text-primary mr-3 h-4 w-4 transition-opacity',
                                            value === course.id
                                                ? 'opacity-100'
                                                : 'opacity-0',
                                        )}
                                    />
                                    <div className="flex flex-col">
                                        <span className="font-medium">
                                            {course.title}
                                        </span>
                                        {course.subtitle && (
                                            <span className="text-muted-foreground mt-0.5 line-clamp-1 text-xs">
                                                {course.subtitle}
                                            </span>
                                        )}
                                    </div>
                                </CommandItem>
                            ))}
                        </CommandGroup>
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
    );
}
