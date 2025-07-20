import { FileItem } from "@/lib/types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Eye,
  Download,
  MoreVertical,
  Folder,
  FileText,
  Image,
  FileSpreadsheet,
  Presentation,
  File as LucideFile,
} from "lucide-react";

interface FileRowProps {
  item: FileItem;
  onItemClick: (item: FileItem) => void;
  onDownload: (item: FileItem) => void;
}

export function FileRow({ item, onItemClick, onDownload }: FileRowProps) {
  const getFileIcon = (item: FileItem) => {
    if (item.type === "folder")
      return <Folder className="w-4 h-4 text-blue-600" />;
    const fileType = item.fileType?.toLowerCase() || "";
    if (fileType.includes("pdf"))
      return <FileText className="w-4 h-4 text-gray-600" />;
    if (fileType.includes("image"))
      return <Image className="w-4 h-4 text-gray-600" />;
    if (fileType.includes("excel") || fileType.includes("spreadsheet"))
      return <FileSpreadsheet className="w-4 h-4 text-green-600" />;
    if (fileType.includes("powerpoint") || fileType.includes("presentation"))
      return <Presentation className="w-4 h-4 text-orange-600" />;
    return <LucideFile className="w-4 h-4 text-gray-600" />;
  };

  const itemName = item.name ? item.name : item.fileName;

  return (
    <div className="border-b hover:bg-muted/50 cursor-pointer transition-colors group">
      {/* Mobile Layout */}
      <div className="lg:hidden p-3 sm:p-4" onClick={() => onItemClick(item)}>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2 sm:space-x-3 min-w-0 flex-1">
            {getFileIcon(item)}
            <div className="min-w-0 flex-1">
              <p className="text-sm sm:text-base font-medium truncate">
                {itemName}
              </p>
              <div className="flex items-center space-x-2 text-xs sm:text-sm text-muted-foreground">
                <span>{item.type === "folder" ? "Folder" : item.fileType}</span>
                {item.fileSize && (
                  <>
                    <span>•</span>
                    <span>{(item.fileSize / 1024).toFixed(2)} KB</span>
                  </>
                )}
                <span>•</span>
                <span>{new Date(item.updatedAt).toLocaleDateString()}</span>
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-1">
            <Badge variant="outline" className="text-xs">
              Private
            </Badge>
            <DropdownMenu>
              <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-6 w-6 sm:h-8 sm:w-8 p-0"
                >
                  <MoreVertical className="w-3 h-3 sm:w-4 sm:h-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="end"
                className="bg-background border z-50"
              >
                <DropdownMenuItem
                  onClick={(e) => {
                    e.stopPropagation();
                    onItemClick(item);
                  }}
                >
                  <Eye className="w-4 h-4 mr-2" />
                  View
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={(e) => {
                    e.stopPropagation();
                    onDownload(item);
                  }}
                >
                  <Download className="w-4 h-4 mr-2" />
                  Download
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
      {/* Desktop Layout */}
      <div
        className="hidden lg:grid lg:grid-cols-6 gap-4 p-4"
        onClick={() => onItemClick(item)}
      >
        <div className="flex items-center space-x-2">
          {getFileIcon(item)}
          <span className="text-sm font-medium truncate">{itemName}</span>
        </div>
        <div className="text-sm text-muted-foreground">
          {item.type === "folder" ? "Folder" : item.fileType}
        </div>
        <div className="text-sm text-muted-foreground">
          {item.fileSize ? `${(item.fileSize / 1024).toFixed(2)} KB` : "-"}
        </div>
        <div className="text-sm text-muted-foreground">
          {new Date(item.updatedAt).toLocaleDateString()}
        </div>
        <div>
          <Badge variant="outline">Private</Badge>
        </div>
        <div className="flex justify-end">
          <DropdownMenu>
            <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
              <Button
                variant="ghost"
                size="sm"
                className="opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <MoreVertical className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              className="bg-background border z-50"
            >
              <DropdownMenuItem
                onClick={(e) => {
                  e.stopPropagation();
                  onItemClick(item);
                }}
              >
                <Eye className="w-4 h-4 mr-2" />
                View
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={(e) => {
                  e.stopPropagation();
                  onDownload(item);
                }}
              >
                <Download className="w-4 h-4 mr-2" />
                Download
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  );
}
