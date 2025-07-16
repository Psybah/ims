import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Download, 
  Edit, 
  Trash2,
  File,
  FileText,
  Image,
  FileSpreadsheet,
  Presentation,
  AlertCircle
} from 'lucide-react';

interface FileItem {
  id: string;
  name: string;
  type: 'folder' | 'file';
  size?: string;
  modified: string;
  fileType?: string;
  content?: string;
  mimeType?: string;
}

interface FileViewModalProps {
  file: FileItem | null;
  isOpen: boolean;
  onClose: () => void;
  onDownload: (file: FileItem) => void;
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

const FilePreview = ({ file }: { file: FileItem }) => {
  if (!file.content) {
    return (
      <div className="flex items-center justify-center h-64 bg-muted/30 rounded-lg">
        <div className="text-center">
          <AlertCircle className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
          <p className="text-sm text-muted-foreground">No preview available</p>
          <p className="text-xs text-muted-foreground mt-1">Use the download button to view this file</p>
        </div>
      </div>
    );
  }

  const fileType = file.fileType?.toLowerCase() || '';
  const mimeType = file.mimeType || '';

  // Images
  if (mimeType.startsWith('image/') || fileType.includes('image')) {
    return (
      <div className="flex items-center justify-center bg-muted/30 rounded-lg p-4">
        <img 
          src={file.content} 
          alt={file.name}
          className="max-w-full max-h-96 object-contain rounded-lg shadow-sm"
        />
      </div>
    );
  }

  // PDFs
  if (mimeType === 'application/pdf' || fileType.includes('pdf')) {
    return (
      <div className="h-96 bg-muted/30 rounded-lg overflow-hidden">
        <iframe 
          src={file.content}
          className="w-full h-full border-0"
          title={file.name}
        />
      </div>
    );
  }

  // Text files
  if (mimeType.startsWith('text/') || fileType.includes('text')) {
    try {
      const textContent = atob(file.content.split(',')[1] || file.content);
      return (
        <ScrollArea className="h-96 bg-muted/30 rounded-lg p-4">
          <pre className="text-sm whitespace-pre-wrap font-mono">{textContent}</pre>
        </ScrollArea>
      );
    } catch (error) {
      return (
        <div className="flex items-center justify-center h-64 bg-muted/30 rounded-lg">
          <div className="text-center">
            <AlertCircle className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
            <p className="text-sm text-muted-foreground">Unable to display text content</p>
          </div>
        </div>
      );
    }
  }

  // Office documents
  if (fileType.includes('word') || fileType.includes('excel') || fileType.includes('powerpoint') || 
      fileType.includes('spreadsheet') || fileType.includes('presentation')) {
    return (
      <div className="flex items-center justify-center h-64 bg-muted/30 rounded-lg">
        <div className="text-center">
          <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
          <p className="text-sm text-muted-foreground">Preview not available for Office documents</p>
          <p className="text-xs text-muted-foreground mt-1">Download the file to view its contents</p>
        </div>
      </div>
    );
  }

  // Default fallback
  return (
    <div className="flex items-center justify-center h-64 bg-muted/30 rounded-lg">
      <div className="text-center">
        <File className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
        <p className="text-sm text-muted-foreground">Preview not available for this file type</p>
        <p className="text-xs text-muted-foreground mt-1">Download the file to view its contents</p>
      </div>
    </div>
  );
};

export function FileViewModal({ 
  file, 
  isOpen, 
  onClose, 
  onDownload, 
  onEdit, 
  onDelete 
}: FileViewModalProps) {
  if (!file) return null;

  const FileIcon = getFileIcon(file.fileType);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">File Preview</DialogTitle>
        </DialogHeader>

        <div className="flex-1 space-y-6 overflow-hidden">
          {/* File Header */}
          <div className="flex items-center space-x-4 p-4 bg-muted/30 rounded-lg">
            <div className="p-2 bg-background rounded-lg shadow-sm">
              <FileIcon className="h-8 w-8 text-muted-foreground" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-medium">{file.name}</h3>
              <div className="flex items-center space-x-2 mt-1">
                {file.fileType && (
                  <Badge variant="secondary" className={getFileTypeColor(file.fileType)}>
                    {file.fileType}
                  </Badge>
                )}
                <span className="text-sm text-muted-foreground">{file.size || 'Unknown size'}</span>
              </div>
            </div>
          </div>

          {/* File Preview */}
          <div className="flex-1 overflow-hidden">
            <FilePreview file={file} />
          </div>

          {/* File Information */}
          <div className="grid grid-cols-2 gap-4 p-4 bg-muted/30 rounded-lg">
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