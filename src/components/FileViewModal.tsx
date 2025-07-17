import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Download, 
  Edit, 
  Trash2,
  File,
  FileText,
  Image,
  FileSpreadsheet,
  Presentation,
  AlertCircle,
  ExternalLink,
  Save,
  X
} from 'lucide-react';
import { FileItem } from '@/lib/types';
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';

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
  const fileType = file.fileType?.toLowerCase() || '';
  const mimeType = file.mimeType || '';

  // Images - use webViewLink for preview, webContentLink for download
  if (mimeType.startsWith('image/') || fileType.includes('image')) {
    return (
      <div className="flex items-center justify-center bg-muted/30 rounded-lg p-4">
        {file.webViewLink ? (
          <iframe 
            src={file.webViewLink}
            className="w-full h-96 border-0 rounded-lg"
            title={file.name}
            onError={(e) => {
              e.currentTarget.style.display = 'none';
              e.currentTarget.nextElementSibling?.classList.remove('hidden');
            }}
          />
        ) : (
          <div className="text-center">
            <AlertCircle className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
            <p className="text-sm text-muted-foreground">Image preview not available</p>
            {file.webContentLink && (
              <Button 
                onClick={() => window.open(file.webContentLink, '_blank')} 
                variant="outline" 
                size="sm"
                className="mt-2"
              >
                <Download className="h-4 w-4 mr-2" />
                Download Image
              </Button>
            )}
          </div>
        )}
      </div>
    );
  }

  // PDFs - use webViewLink for preview
  if (mimeType === 'application/pdf' || fileType.includes('pdf')) {
    return (
      <div className="h-96 bg-muted/30 rounded-lg overflow-hidden">
        {file.webViewLink ? (
        <iframe 
            src={file.webViewLink}
          className="w-full h-full border-0"
          title={file.name}
        />
        ) : (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
              <p className="text-sm text-muted-foreground">PDF preview not available</p>
              {file.webContentLink && (
                <Button 
                  onClick={() => window.open(file.webContentLink, '_blank')} 
                  variant="outline" 
                  size="sm"
                  className="mt-2"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Download PDF
                </Button>
              )}
            </div>
          </div>
        )}
      </div>
    );
  }

  // Text files - try to fetch content from webContentLink
  if (mimeType.startsWith('text/') || fileType.includes('text') || fileType.includes('json') || fileType.includes('xml') || fileType.includes('csv')) {
      return (
        <ScrollArea className="h-96 bg-muted/30 rounded-lg p-4">
        <pre className="text-sm whitespace-pre-wrap font-mono">
          <TextFileViewer url={file.webContentLink} />
        </pre>
        </ScrollArea>
      );
  }

  // Office documents and other files
  return (
    <div className="flex items-center justify-center h-64 bg-muted/30 rounded-lg">
      <div className="text-center">
        <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
        <p className="text-sm text-muted-foreground">Preview not available for this file type</p>
        <p className="text-xs text-muted-foreground mt-1">Download the file to view its contents</p>
        <div className="flex flex-col space-y-2 mt-3">
          {file.webContentLink && (
            <Button 
              onClick={() => window.open(file.webContentLink, '_blank')} 
              variant="outline" 
              size="sm"
            >
              <Download className="h-4 w-4 mr-2" />
              Download File
            </Button>
          )}
          {file.webViewLink && (
            <Button 
              onClick={() => window.open(file.webViewLink, '_blank')} 
              variant="outline" 
              size="sm"
            >
              <ExternalLink className="h-4 w-4 mr-2" />
              Open in Google Drive
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

// Component to fetch and display text file content
const TextFileViewer = ({ url }: { url?: string }) => {
  const [content, setContent] = useState<string>('Loading...');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!url) {
      setContent('No URL available');
      return;
    }

    fetch(url)
      .then(response => response.text())
      .then(text => setContent(text))
      .catch(err => {
        console.error('Failed to fetch text content:', err);
        setError('Failed to load text content');
        setContent('Error loading content');
      });
  }, [url]);

  if (error) {
    return <span className="text-red-500">{error}</span>;
  }

  return <span>{content}</span>;
};

export function FileViewModal({ 
  file, 
  isOpen, 
  onClose, 
  onDownload, 
  onEdit, 
  onDelete 
}: FileViewModalProps) {
  const [isRenaming, setIsRenaming] = useState(false);
  const [newFileName, setNewFileName] = useState('');
  const { toast } = useToast();

  if (!file) return null;

  const FileIcon = getFileIcon(file.fileType);

  const handleRename = () => {
    if (!newFileName.trim()) {
      toast({
        title: "Invalid name",
        description: "File name cannot be empty.",
        variant: "destructive",
      });
      return;
    }

    // TODO: Implement backend rename API call here
    // For now, show a message that its not implemented
    toast({
      title: "Rename not implemented",
      description: "File rename functionality is not yet supported by the backend.",
      variant: "destructive",
    });
    
    setIsRenaming(false);
    setNewFileName('');
  };

  const startRename = () => {
    setNewFileName(file.name);
    setIsRenaming(true);
  };

  const cancelRename = () => {
    setIsRenaming(false);
    setNewFileName('');
  };

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
              {isRenaming ? (
                <div className="space-y-2">
                  <Label htmlFor="newFileName" className="text-sm font-medium">New file name:</Label>
                  <div className="flex space-x-2">
                    <Input
                      id="newFileName"
                      value={newFileName}
                      onChange={(e) => setNewFileName(e.target.value)}
                      className="flex-1"
                      autoFocus
                    />
                    <Button onClick={handleRename} size="sm">
                      <Save className="h-4 w-4 mr-1" />
                      Save
                    </Button>
                    <Button onClick={cancelRename} variant="outline" size="sm">
                      <X className="h-4 w-4 mr-1" />
                      Cancel
                    </Button>
                  </div>
                </div>
              ) : (
                <>
              <h3 className="text-lg font-medium">{file.name}</h3>
              <div className="flex items-center space-x-2 mt-1">
                {file.fileType && (
                  <Badge variant="secondary" className={getFileTypeColor(file.fileType)}>
                    {file.fileType}
                  </Badge>
                )}
                <span className="text-sm text-muted-foreground">{file.size || 'Unknown size'}</span>
              </div>
                </>
              )}
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
              {file.webViewLink && (
                <Button 
                  onClick={() => window.open(file.webViewLink, '_blank')} 
                  variant="outline" 
                  size="sm"
                >
                  <ExternalLink className="h-4 w-4 mr-2" />
                  View in Google Drive
                </Button>
              )}
              <Button onClick={startRename} variant="outline" size="sm">
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