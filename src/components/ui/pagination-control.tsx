import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import {
    ChevronLeft,
    ChevronRight,
    ChevronsLeft,
    ChevronsRight,
} from 'lucide-react';
import { PaginationState } from '@tanstack/react-table';
import { Dispatch, SetStateAction, useMemo } from 'react';
import { cn } from '@/lib/utils';

interface Props {
    className?: string;
    itemCount: number;
    pagination: PaginationState;
    setPagination: Dispatch<SetStateAction<PaginationState>>;
}

export const PaginationControl = ({
    className,
    itemCount,
    pagination,
    setPagination,
}: Props) => {
    const currentPage = useMemo(() => pagination.pageIndex + 1, [pagination]);
    const pageCount = useMemo(
        () => Math.ceil(itemCount / pagination.pageSize),
        [itemCount, pagination],
    );
    const start = useMemo(
        () => pagination.pageIndex * pagination.pageSize + 1,
        [pagination],
    );
    const end = useMemo(
        () =>
            Math.min(
                (pagination.pageIndex + 1) * pagination.pageSize,
                itemCount,
            ),
        [pagination, itemCount],
    );

    const getPageNumbers = () => {
        const delta = 2;
        const range = [];
        const rangeWithDots = [];

        for (
            let i = Math.max(2, currentPage - delta);
            i <= Math.min(pageCount - 1, currentPage + delta);
            i++
        ) {
            range.push(i);
        }

        if (currentPage - delta > 2) {
            rangeWithDots.push(1, '...');
        } else {
            rangeWithDots.push(1);
        }

        rangeWithDots.push(...range);

        if (currentPage + delta < pageCount - 1) {
            rangeWithDots.push('...', pageCount);
        } else {
            if (pageCount > 1) {
                rangeWithDots.push(pageCount);
            }
        }

        return rangeWithDots.filter(
            (item, index, arr) => arr.indexOf(item) === index,
        );
    };

    const pageSizeOptions = [10, 20, 30, 50, 100];

    if (pageCount <= 1 && itemCount <= 10) return null;

    return (
        <div
            className={cn(
                'flex flex-col items-center justify-between gap-6 lg:flex-row',
                className,
            )}
        >
            <div className="flex flex-col items-center gap-4 sm:flex-row">
                <div className="text-muted-foreground text-sm whitespace-nowrap">
                    Showing{' '}
                    <span className="text-foreground font-semibold">
                        {start}
                    </span>{' '}
                    to{' '}
                    <span className="text-foreground font-semibold">{end}</span>{' '}
                    of{' '}
                    <span className="text-foreground font-semibold">
                        {itemCount}
                    </span>{' '}
                    results
                </div>

                <div className="flex items-center space-x-2">
                    <span className="text-muted-foreground text-sm whitespace-nowrap">
                        Rows per page:
                    </span>
                    <Select
                        value={pagination.pageSize.toString()}
                        onValueChange={(value) =>
                            setPagination((prev) => ({
                                ...prev,
                                pageSize: Number(value),
                                pageIndex: 0,
                            }))
                        }
                    >
                        <SelectTrigger className="h-8 w-20">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            {pageSizeOptions.map((size) => (
                                <SelectItem key={size} value={size.toString()}>
                                    {size}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
            </div>

            {pageCount > 1 && (
                <div className="flex items-center space-x-2">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() =>
                            setPagination((prev) => ({ ...prev, pageIndex: 0 }))
                        }
                        disabled={currentPage === 1}
                        className="h-9 w-9 p-0 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        <ChevronsLeft className="h-4 w-4" />
                    </Button>

                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() =>
                            setPagination((prev) => ({
                                ...prev,
                                pageIndex: Math.max(0, prev.pageIndex - 1),
                            }))
                        }
                        disabled={pagination.pageIndex === 0}
                        className="h-9 px-3 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        <ChevronLeft className="mr-1 h-4 w-4" />
                        Previous
                    </Button>

                    <div className="flex items-center space-x-1">
                        {getPageNumbers().map((pageNumber, index) => (
                            <div key={index}>
                                {pageNumber === '...' ? (
                                    <span className="text-muted-foreground flex h-9 w-9 items-center justify-center text-sm font-medium">
                                        ...
                                    </span>
                                ) : (
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() =>
                                            setPagination((prev) => ({
                                                ...prev,
                                                pageIndex:
                                                    (pageNumber as number) - 1,
                                            }))
                                        }
                                        className={cn(
                                            'h-9 w-9 p-0 text-sm font-semibold transition-all duration-200',
                                            currentPage === pageNumber
                                                ? 'border-primary/30 bg-primary/10 text-primary hover:bg-primary/20 hover:text-primary shadow-sm'
                                                : 'text-muted-foreground hover:bg-muted/50 hover:text-foreground',
                                        )}
                                    >
                                        {pageNumber}
                                    </Button>
                                )}
                            </div>
                        ))}
                    </div>

                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() =>
                            setPagination((prev) => ({
                                ...prev,
                                pageIndex: Math.min(
                                    pageCount - 1,
                                    prev.pageIndex + 1,
                                ),
                            }))
                        }
                        disabled={pagination.pageIndex >= pageCount - 1}
                        className="h-9 px-3 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        Next
                        <ChevronRight className="ml-1 h-4 w-4" />
                    </Button>

                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() =>
                            setPagination((prev) => ({
                                ...prev,
                                pageIndex: pageCount - 1,
                            }))
                        }
                        disabled={currentPage === pageCount}
                        className="h-9 w-9 p-0 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        <ChevronsRight className="h-4 w-4" />
                    </Button>
                </div>
            )}

            {pageCount > 1 && (
                <div className="border-border mt-4 flex items-center justify-center border-t pt-4 lg:hidden">
                    <span className="text-muted-foreground text-sm">
                        Page{' '}
                        <span className="text-foreground font-semibold">
                            {currentPage}
                        </span>{' '}
                        of{' '}
                        <span className="text-foreground font-semibold">
                            {pageCount}
                        </span>
                    </span>
                </div>
            )}
        </div>
    );
};
