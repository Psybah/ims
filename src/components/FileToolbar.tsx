import { Button } from "@/components/ui/button";        
import { Upload, FolderPlus, Star } from "lucide-react";

interface FileToolbarProps {
  onUpload: () => void;
  onUploadFolder: () => void;
  onNewFolder: () => void;
  onStarred: () => void;
  disabled?: boolean;
}

export function FileToolbar({
  onUpload,
  onUploadFolder,
  onNewFolder,
  onStarred,
  disabled = false,
}: FileToolbarProps) {
  return (
    <div className="w-full grid grid-cols-2 gap-2 sm:w-auto sm:flex sm:space-x-2 sm:justify-end">
      <Button
        onClick={onUpload}
        variant="default"
        size="sm"
        className="w-full sm:w-auto"
        disabled={disabled}
      >
        <Upload className="w-4 h-4 mr-2" />
        <span className="text-sm">Upload Files</span>
      </Button>
      <Button
        onClick={onUploadFolder}
        variant="outline"
        size="sm"
        className="w-full sm:w-auto"
        disabled={disabled}
      >
        <Upload className="w-4 h-4 mr-2" />
        <span className="text-sm">Upload Folder</span>
      </Button>
      <Button
        onClick={onNewFolder}
        variant="outline"
        size="sm"
        className="w-full sm:w-auto"
        disabled={disabled}
      >
        <FolderPlus className="w-4 h-4 mr-2" />
        <span className="text-sm">New Folder</span>
      </Button>
      <Button
        onClick={onStarred}
        variant="outline"
        size="sm"
        className="w-full sm:w-auto"
        disabled={disabled}
      >
        <Star className="w-4 h-4 mr-2" />
        <span className="text-sm">Starred</span>
      </Button>
    </div>
  );
}
