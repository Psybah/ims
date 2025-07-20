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
    <div className="flex flex-col space-y-2 sm:flex-row sm:space-y-0 sm:space-x-2 lg:items-center">
      <div className="flex space-x-2">
        <Button
          onClick={onUpload}
          variant="default"
          size="sm"
          className="flex-1 sm:flex-none"
          disabled={disabled}
        >
          <Upload className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
          <span className="text-xs sm:text-sm">Upload Files</span>
        </Button>
        <Button
          onClick={onUploadFolder}
          variant="outline"
          size="sm"
          className="flex-1 sm:flex-none"
          disabled={disabled}
        >
          <Upload className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
          <span className="text-xs sm:text-sm">Upload Folder</span>
        </Button>
      </div>
      <div className="flex space-x-2">
        <Button
          onClick={onNewFolder}
          variant="outline"
          size="sm"
          className="flex-1 sm:flex-none"
          disabled={disabled}
        >
          <FolderPlus className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
          <span className="text-xs sm:text-sm">New Folder</span>
        </Button>
        <Button
          onClick={onStarred}
          variant="outline"
          size="sm"
          className="flex-1 sm:flex-none"
          disabled={disabled}
        >
          <Star className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
          <span className="text-xs sm:text-sm">Starred</span>
        </Button>
      </div>
    </div>
  );
}
