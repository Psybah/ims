import { FileItem } from '@/lib/types';
import { FileRow } from './FileRow';
import { ChevronUp, ChevronDown } from 'lucide-react';

interface FileListProps {
  items: FileItem[];
  onItemClick: (item: FileItem) => void;
  onDownload: (item: FileItem) => void;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  onSort?: (field: string) => void;
}

export function FileList({ 
  items, 
  onItemClick, 
  onDownload, 
  sortBy = 'name', 
  sortOrder = 'asc',
  onSort 
}: FileListProps) {
  if (!items.length) {
    return <div className="p-4 text-center text-muted-foreground">No files or folders found.</div>;
  }

  const getSortIcon = (field: string) => {
    if (sortBy !== field) return null;
    return sortOrder === 'asc' ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />;
  };

  return (
    <div className="border rounded-lg overflow-hidden">
      {/* Table Header */}
      <div className="bg-muted/50 border-b">
        <div className="hidden lg:grid lg:grid-cols-6 gap-4 p-4 text-sm font-medium text-muted-foreground">
          <div className="flex items-center">
            <button 
              className="flex items-center gap-1 hover:text-foreground transition-colors"
              onClick={() => onSort?.('name')}
            >
              Name
              {getSortIcon('name')}
            </button>
          </div>
          <div className="flex items-center">
            <button 
              className="flex items-center gap-1 hover:text-foreground transition-colors"
              onClick={() => onSort?.('type')}
            >
              Type
              {getSortIcon('type')}
            </button>
          </div>
          <div className="flex items-center">
            <button 
              className="flex items-center gap-1 hover:text-foreground transition-colors"
              onClick={() => onSort?.('size')}
            >
              Size
              {getSortIcon('size')}
            </button>
          </div>
          <div className="flex items-center">
            <button 
              className="flex items-center gap-1 hover:text-foreground transition-colors"
              onClick={() => onSort?.('modified')}
            >
              Modified
              {getSortIcon('modified')}
            </button>
          </div>
          <div className="flex items-center">
            Status
          </div>
          <div className="flex items-center justify-end">
            Actions
          </div>
        </div>
      </div>

      {/* Table Body */}
      <div>
        {items.map((item) => (
          <FileRow key={item.id} item={item} onItemClick={onItemClick} onDownload={onDownload} />
        ))}
      </div>
    </div>
  );
} 