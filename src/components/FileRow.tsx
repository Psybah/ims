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
    <div className="border-b hover:bg-muted/50 cursor-pointer transition-colors group overflow-hidden">
      {/* Mobile Layout */}
      <div className="lg:hidden p-2 sm:p-3" onClick={() => onItemClick(item)}>
        <div className="flex items-center justify-between">
          <div className="flex items-center min-w-0 flex-1">
            <div className="flex-shrink-0 mr-2 sm:mr-3">
              {getFileIcon(item)}
            </div>
            <div className="min-w-0 flex-1 overflow-hidden">
              <p className="text-sm sm:text-base font-medium truncate">
                {itemName}
              </p>
              <div className="flex flex-wrap items-center gap-x-1.5 text-xs sm:text-sm text-muted-foreground">
                <span className="truncate max-w-[100px] sm:max-w-none">
                  {item.type === "folder" ? "Folder" : item.fileType}
                </span>
                {item.fileSize && (
                  <>
                    <span>•</span>
                    <span className="whitespace-nowrap">
                      {item.fileSize > 1024 
                        ? `${(item.fileSize / 1024).toFixed(1)} MB` 
                        : `${item.fileSize} KB`}
                    </span>
                  </>
                )}
                <span>•</span>
                <span className="whitespace-nowrap">
                  {new Date(item.updatedAt).toLocaleDateString(undefined, {
                    month: 'short',
                    day: 'numeric',
                    year: new Date().getFullYear() !== new Date(item.updatedAt).getFullYear() ? '2-digit' : undefined
                  })}
                </span>
              </div>
            </div>
          </div>
          <div className="flex-shrink-0 ml-2">
            <Badge variant="outline" className="hidden xs:inline-flex text-[10px] h-5">
              Private
            </Badge>
            <DropdownMenu>
              <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-7 w-7 p-0 flex-shrink-0"
                >
                  <MoreVertical className="w-3.5 h-3.5" />
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
