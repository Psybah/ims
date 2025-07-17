import { Input } from '@/components/ui/input';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ArrowUpDown, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface FileSearchSortProps {
  searchTerm: string;
  onSearch: (term: string) => void;
  sortBy: 'name' | 'modified' | 'size';
  sortOrder: 'asc' | 'desc';
  onSort: (sortBy: 'name' | 'modified' | 'size') => void;
}

export function FileSearchSort({ searchTerm, onSearch, sortBy, sortOrder, onSort }: FileSearchSortProps) {
  return (
    <div className="flex items-center justify-between space-x-2 sm:space-x-4">
      <div className="flex items-center space-x-2 sm:space-x-4 flex-1">
        <div className="relative flex-1 max-w-xs sm:max-w-sm">
          <Search className="absolute left-2 sm:left-3 top-2 sm:top-2.5 h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground" />
          <Input
            placeholder="Search files..."
            value={searchTerm}
            onChange={e => onSearch(e.target.value)}
            className="pl-8 sm:pl-10 h-8 sm:h-10 text-sm"
          />
        </div>
      </div>
      <div className="flex items-center space-x-2">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="text-xs sm:text-sm">
              <ArrowUpDown className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
              <span className="hidden sm:inline">Sort by {sortBy} ({sortOrder})</span>
              <span className="sm:hidden">Sort</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => onSort('name')}>Sort by Name</DropdownMenuItem>
            <DropdownMenuItem onClick={() => onSort('modified')}>Sort by Date Modified</DropdownMenuItem>
            <DropdownMenuItem onClick={() => onSort('size')}>Sort by Size</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
} 