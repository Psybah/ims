import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogClose } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  X, 
  Download, 
  Share2, 
  Edit, 
  Trash2,
  File,
  FileText,
  Image,
  FileSpreadsheet,
  Presentation
} from 'lucide-react';
import { useState } from 'react';

interface FileItem {
  id: string;
  name: string;
  type: 'folder' | 'file';
  size?: string;
  modified: string;
  fileType?: string;
  isShared?: boolean;
}

interface FileViewModalProps {
  file: FileItem | null;
  isOpen: boolean;
  onClose: () => void;
  onDownload: (file: FileItem) => void;
  onShare: (file: FileItem) => void;
  onEdit: (file: FileItem) => void;
  onDelete: (file: FileItem) => void;
}

const getFileIcon = (fileType: string = '') => {
  const type = fileType.toLowerCase();
  if (type.includes('pdf') || type.includes('document')) return FileText;
  if (type.includes('image') || type.includes('jpg') || type.includes('png')) return Image;
  if (type.includes('spreadsheet') || type.includes('excel')) return FileSpreadsheet;
  if (type.includes('presentation') || type.includes('powerpoint')) return Presentation;
  return File;
};

const getFileTypeColor = (fileType: string = '') => {
  const type = fileType.toLowerCase();
  if (type.includes('pdf')) return 'bg-red-100 text-red-800';
  if (type.includes('image')) return 'bg-green-100 text-green-800';
  if (type.includes('spreadsheet')) return 'bg-blue-100 text-blue-800';
  if (type.includes('presentation')) return 'bg-purple-100 text-purple-800';
  if (type.includes('document')) return 'bg-indigo-100 text-indigo-800';
  return 'bg-gray-100 text-gray-800';
};

export function FileViewModal({ 
  file, 
  isOpen, 
  onClose, 
  onDownload, 
  onShare, 
  onEdit, 
  onDelete 
}: FileViewModalProps) {
  if (!file) return null;

  const FileIcon = getFileIcon(file.fileType);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="text-xl font-semibold">File Details</DialogTitle>
            <DialogClose asChild>
              <Button variant="ghost" size="sm">
                <X className="h-4 w-4" />
              </Button>
            </DialogClose>
          </div>
        </DialogHeader>

        <div className="space-y-6">
          {/* File Preview */}
          <div className="flex items-center space-x-4 p-6 bg-muted/30 rounded-lg">
            <div className="p-3 bg-background rounded-lg shadow-sm">
              <FileIcon className="h-12 w-12 text-muted-foreground" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-medium">{file.name}</h3>
              <div className="flex items-center space-x-2 mt-1">
                {file.fileType && (
                  <Badge variant="secondary" className={getFileTypeColor(file.fileType)}>
                    {file.fileType}
                  </Badge>
                )}
                {file.isShared && (
                  <Badge variant="outline">
                    <Share2 className="h-3 w-3 mr-1" />
                    Shared
                  </Badge>
                )}
              </div>
            </div>
          </div>

          {/* File Information */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-muted-foreground">Size</label>
              <p className="text-sm">{file.size || 'Unknown'}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">Modified</label>
              <p className="text-sm">{file.modified}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">Type</label>
              <p className="text-sm">{file.type === 'folder' ? 'Folder' : 'File'}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">Format</label>
              <p className="text-sm">{file.fileType || 'Unknown'}</p>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-between pt-4 border-t">
            <div className="flex space-x-2">
              <Button onClick={() => onDownload(file)} size="sm">
                <Download className="h-4 w-4 mr-2" />
                Download
              </Button>
              <Button onClick={() => onShare(file)} variant="outline" size="sm">
                <Share2 className="h-4 w-4 mr-2" />
                Share
              </Button>
              <Button onClick={() => onEdit(file)} variant="outline" size="sm">
                <Edit className="h-4 w-4 mr-2" />
                Rename
              </Button>
            </div>
            <Button 
              onClick={() => onDelete(file)} 
              variant="destructive" 
              size="sm"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Delete
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}