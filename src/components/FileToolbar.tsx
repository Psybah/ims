import { Button } from "@/components/ui/button";        
import { Upload, FolderPlus, ChevronDown } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface FileToolbarProps {
  onUpload: () => void;
  onUploadFolder: () => void;
  onNewFolder: () => void;
  disabled?: boolean;
}

export function FileToolbar({
  onUpload,
  onUploadFolder,
  onNewFolder,
  disabled = false,
}: FileToolbarProps) {
  return (
    <div className="w-full grid grid-cols-2 gap-2 sm:w-auto sm:flex sm:space-x-2 sm:justify-end">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="default"
            size="sm"
            className="w-full sm:w-auto"
            disabled={disabled}
          >
            <Upload className="w-4 h-4 mr-2" />
            <span className="text-sm">Upload</span>
            <ChevronDown className="w-3 h-3 ml-1" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="w-48">
          <DropdownMenuItem onClick={onUpload} disabled={disabled}>
            <Upload className="w-4 h-4 mr-2" />
            Upload Files
          </DropdownMenuItem>
          <DropdownMenuItem onClick={onUploadFolder} disabled={disabled}>
            <Upload className="w-4 h-4 mr-2" />
            Upload Folder
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      
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
    </div>
  );
}
