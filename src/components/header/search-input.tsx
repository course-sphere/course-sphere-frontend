import { useState } from 'react';
import { Input } from '../ui/input';
import { LoaderCircle, Search } from 'lucide-react';

export interface SearchInputProps {
    isLoading: boolean;
    onSearch: (query: string) => void;
}

export function SearchInput({ isLoading, onSearch }: SearchInputProps) {
    const [query, setQuery] = useState('');

    return (
        <div className="relative">
            <Input
                className="peer ps-9 pe-9"
                placeholder="Search..."
                type="search"
                value={query}
                onChange={(e) => {
                    setQuery(e.target.value);
                    onSearch(e.target.value);
                }}
            />
            <div className="text-muted-foreground/80 pointer-events-none absolute inset-y-0 start-0 flex items-center justify-center ps-3 peer-disabled:opacity-50">
                {isLoading ? (
                    <LoaderCircle
                        className="animate-spin"
                        size={16}
                        strokeWidth={2}
                        role="status"
                        aria-label="Loading..."
                    />
                ) : (
                    <Search size={16} strokeWidth={2} aria-hidden="true" />
                )}
            </div>
        </div>
    );
}
