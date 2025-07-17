import { FileItem } from '@/lib/types';
import { FileRow } from './FileRow';

interface FileListProps {
  items: FileItem[];
  onItemClick: (item: FileItem) => void;
  onDownload: (item: FileItem) => void;
}

export function FileList({ items, onItemClick, onDownload }: FileListProps) {
  if (!items.length) {
    return <div className="p-4 text-center text-muted-foreground">No files or folders found.</div>;
  }
  return (
    <div>
      {items.map((item) => (
        <FileRow key={item.id} item={item} onItemClick={onItemClick} onDownload={onDownload} />
      ))}
    </div>
  );
} 