import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Upload,
  Search,
  Download,
  MoreVertical,
  FolderPlus,
  ArrowUpDown,
  Folder,
  FileText,
  Image,
  FileSpreadsheet,
  Presentation,
  File,
  Eye,
  ChevronDown,
  Edit,
  Trash,
} from 'lucide-react';
import { BreadcrumbNav } from '@/components/BreadcrumbNav';
import { FileViewModal } from '@/components/FileViewModal';
import { UploadProgress } from '@/components/UploadProgress';
import { EmptyState } from '@/components/EmptyState';
import { EditFileModal } from '@/components/EditFileModal';
import { useToast } from '@/hooks/use-toast';
import { useFileStorage, type FileItem } from '@/hooks/useFileStorage';

// Nigerian names for admin users
const adminUsers = [
  { name: 'Adebayo Okonkwo', avatar: 'AO' },
  { name: 'Chinedu Emeka', avatar: 'CE' },
  { name: 'Amina Yusuf', avatar: 'AY' },
];

const getRandomUser = () => adminUsers[Math.floor(Math.random() * adminUsers.length)];

const getFileIcon = (item: FileItem) => {
  if (item.type === 'folder') return Folder;
  
  const fileType = item.fileType?.toLowerCase() || '';
  if (fileType.includes('pdf')) return FileText;
  if (fileType.includes('image') || fileType.includes('jpg') || fileType.includes('png')) return Image;
  if (fileType.includes('excel') || fileType.includes('spreadsheet')) return FileSpreadsheet;
  if (fileType.includes('powerpoint') || fileType.includes('presentation')) return Presentation;
  return File;
};

const AdminFiles = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPath, setCurrentPath] = useState('');
  const [selectedFile, setSelectedFile] = useState<FileItem | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [sortBy, setSortBy] = useState<'name' | 'modified' | 'size'>('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [uploads, setUploads] = useState<Array<{
    id: string;
    name: string;
    size: number;
    progress: number;
    status: 'uploading' | 'completed' | 'error';
    error?: string;
  }>>([]);

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editedFile, setEditedFile] = useState<FileItem | null>(null);
  const { toast } = useToast();
  const { files, addFile, addFolder, deleteFile, sortFiles, updateFile } = useFileStorage();

  // Add owner and avatar info to files for admin view
  const filesWithOwner = files.map(file => ({
    ...file,
    owner: file.owner || getRandomUser().name,
    avatar: file.avatar || getRandomUser().avatar,
  }));

  // Filter files based on current path and search term (exclude archived)
  const filteredFiles = filesWithOwner.filter(file => {
    const matchesPath = file.parentPath === currentPath;
    const matchesSearch = file.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         file.owner.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesPath && matchesSearch;
  });

  // Sort the filtered files
  const sortedFiles = sortFiles(filteredFiles, sortBy, sortOrder);

  // Get breadcrumb items
  const getBreadcrumbItems = () => {
    if (!currentPath) return [];
    const pathParts = currentPath.split('/').filter(Boolean);
    return pathParts.map((part, index) => ({
      name: part,
      path: pathParts.slice(0, index + 1).join('/')
    }));
  };

  const handleNavigate = (path: string) => {
    setCurrentPath(path);
    setSearchTerm('');
  };

  const handleItemClick = (item: FileItem) => {
    if (item.type === 'folder') {
      const newPath = currentPath ? `${currentPath}/${item.name}` : item.name;
      setCurrentPath(newPath);
    } else {
      setSelectedFile(item);
      setIsModalOpen(true);
    }
  };

  const handleUpload = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.multiple = true;
    input.accept = '*/*';
    
    input.onchange = (e) => {
      const uploadedFiles = Array.from((e.target as HTMLInputElement).files || []);
      if (uploadedFiles.length > 0) {
        const user = getRandomUser();
        
        uploadedFiles.forEach(file => {
          const uploadId = `upload-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
          
          // Add to upload progress
          setUploads(prev => [...prev, {
            id: uploadId,
            name: file.name,
            size: file.size,
            progress: 0,
            status: 'uploading'
          }]);
          
          // Simulate upload progress
          let progress = 0;
          const interval = setInterval(() => {
            progress += Math.random() * 15;
            if (progress >= 100) {
              progress = 100;
              clearInterval(interval);
              
              // Complete upload
              setUploads(prev => prev.map(upload => 
                upload.id === uploadId 
                  ? { ...upload, progress: 100, status: 'completed' as const }
                  : upload
              ));
              
              // Add file to storage
          const fileExtension = file.name.split('.').pop()?.toLowerCase() || '';
          let fileType = 'Document';
          
          if (['jpg', 'jpeg', 'png', 'gif', 'bmp'].includes(fileExtension)) {
            fileType = 'Image';
          } else if (['pdf'].includes(fileExtension)) {
            fileType = 'PDF Document';
          } else if (['doc', 'docx'].includes(fileExtension)) {
            fileType = 'Word Document';
          } else if (['xls', 'xlsx'].includes(fileExtension)) {
            fileType = 'Excel Spreadsheet';
          } else if (['ppt', 'pptx'].includes(fileExtension)) {
            fileType = 'PowerPoint Presentation';
          }
          
          addFile({
            name: file.name,
            type: 'file',
            size: `${(file.size / 1024 / 1024).toFixed(2)} MB`,
            fileType,
            parentPath: currentPath,
            owner: user.name,
            avatar: user.avatar,
          });
              
              // Auto-dismiss completed uploads after 3 seconds
              setTimeout(() => {
                setUploads(prev => prev.filter(upload => upload.id !== uploadId));
              }, 3000);
            } else {
              setUploads(prev => prev.map(upload => 
                upload.id === uploadId 
                  ? { ...upload, progress: Math.floor(progress) }
                  : upload
              ));
            }
          }, 200);
        });
        
        toast({
          title: "Upload started",
          description: `Uploading ${uploadedFiles.length} file(s)...`,
        });
      }
    };
    
    input.click();
  };

  const handleFolderUpload = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.webkitdirectory = true;
    input.multiple = true;
    
    input.onchange = (e) => {
      const uploadedFiles = Array.from((e.target as HTMLInputElement).files || []);
      if (uploadedFiles.length > 0) {
        const user = getRandomUser();
        
        // Track created folders to avoid duplicates
        const createdFolders = new Set<string>();
        
        uploadedFiles.forEach(file => {
          const relativePath = file.webkitRelativePath || file.name;
          const pathParts = relativePath.split('/');
          
          // Create folder structure
          let currentFolderPath = currentPath;
          for (let i = 0; i < pathParts.length - 1; i++) {
            const folderName = pathParts[i];
            const nextFolderPath = currentFolderPath ? `${currentFolderPath}/${folderName}` : folderName;
            
            if (!createdFolders.has(nextFolderPath)) {
              createdFolders.add(nextFolderPath);
              
              // Add folder to storage
              addFile({
                name: folderName,
                type: 'folder',
                size: '-',
                fileType: 'Folder',
                parentPath: currentFolderPath,
                owner: user.name,
                avatar: user.avatar,
              });
            }
            
            currentFolderPath = nextFolderPath;
          }
        });
        
        // Upload files
        uploadedFiles.forEach(file => {
          const uploadId = `upload-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
          const relativePath = file.webkitRelativePath || file.name;
          const pathParts = relativePath.split('/');
          const fileName = pathParts[pathParts.length - 1];
          
          // Determine the correct parent path for the file
          let parentFolderPath = currentPath;
          for (let i = 0; i < pathParts.length - 1; i++) {
            const folderName = pathParts[i];
            parentFolderPath = parentFolderPath ? `${parentFolderPath}/${folderName}` : folderName;
          }
          
          // Add to upload progress
          setUploads(prev => [...prev, {
            id: uploadId,
            name: fileName,
            size: file.size,
            progress: 0,
            status: 'uploading'
          }]);
          
          // Simulate upload progress
          let progress = 0;
          const interval = setInterval(() => {
            progress += Math.random() * 15;
            if (progress >= 100) {
              progress = 100;
              clearInterval(interval);
              
              // Complete upload
              setUploads(prev => prev.map(upload => 
                upload.id === uploadId 
                  ? { ...upload, progress: 100, status: 'completed' as const }
                  : upload
              ));
              
              // Add file to storage
              const fileExtension = fileName.split('.').pop()?.toLowerCase() || '';
              let fileType = 'Document';
              
              if (['jpg', 'jpeg', 'png', 'gif', 'bmp'].includes(fileExtension)) {
                fileType = 'Image';
              } else if (['pdf'].includes(fileExtension)) {
                fileType = 'PDF Document';
              } else if (['doc', 'docx'].includes(fileExtension)) {
                fileType = 'Word Document';
              } else if (['xls', 'xlsx'].includes(fileExtension)) {
                fileType = 'Excel Spreadsheet';
              } else if (['ppt', 'pptx'].includes(fileExtension)) {
                fileType = 'PowerPoint Presentation';
              }
              
              addFile({
                name: fileName,
                type: 'file',
                size: `${(file.size / 1024 / 1024).toFixed(2)} MB`,
                fileType,
                parentPath: parentFolderPath,
                owner: user.name,
                avatar: user.avatar,
              });
              
              // Auto-dismiss completed uploads after 3 seconds
              setTimeout(() => {
                setUploads(prev => prev.filter(upload => upload.id !== uploadId));
              }, 3000);
            } else {
              setUploads(prev => prev.map(upload => 
                upload.id === uploadId 
                  ? { ...upload, progress: Math.floor(progress) }
                  : upload
              ));
            }
          }, 200);
        });
        
        const totalFolders = createdFolders.size;
        toast({
          title: "Folder upload started",
          description: `Uploading ${uploadedFiles.length} file(s) in ${totalFolders} folder(s)...`,
        });
      }
    };
    
    input.click();
  };

  const handleNewFolder = () => {
    const folderName = prompt('Enter folder name:');
    if (folderName && folderName.trim()) {
      const user = getRandomUser();
      addFolder(folderName.trim(), currentPath);
      toast({
        title: "Folder created",
        description: `"${folderName}" folder created successfully.`,
      });
    }
  };

  const handleCancelUpload = (uploadId: string) => {
    setUploads(prev => prev.filter(upload => upload.id !== uploadId));
    toast({
      title: "Upload cancelled",
      description: "File upload has been cancelled.",
    });
  };

  const handleDismissUpload = (uploadId: string) => {
    setUploads(prev => prev.filter(upload => upload.id !== uploadId));
  };

  const handleDownload = (file: FileItem) => {
    if (file.type === 'folder') {
      toast({
        title: "Cannot download folder",
        description: "Folder downloads are not supported. Please download individual files.",
        variant: "destructive",
      });
      return;
    }

    // Create a simple text file for demo purposes
    const content = `This is a demo file: ${file.name}\nFile type: ${file.fileType || 'Unknown'}\nSize: ${file.size || 'Unknown'}\nModified: ${file.modified}`;
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    
    // Create a temporary download link
    const element = document.createElement('a');
    element.href = url;
    element.download = file.name;
    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
    
    // Clean up the URL object
    URL.revokeObjectURL(url);

    toast({
      title: "Download started",
      description: `Downloading ${file.name}...`,
    });
  };

  const handleEdit = (file: FileItem) => {
    setEditedFile(file);
    setIsEditModalOpen(true);
  };

  const handleDelete = (file: FileItem) => {
    deleteFile(file.id);
    toast({
      title: "File deleted",
      description: `${file.name} has been moved to trash.`,
      variant: "destructive",
    });
  };



  const handleSort = (newSortBy: 'name' | 'modified' | 'size') => {
    if (sortBy === newSortBy) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(newSortBy);
      setSortOrder('asc');
    }
  };

  const handleEditSave = (fileId: string, updates: { name: string; description?: string }) => {
    updateFile(fileId, { name: updates.name });
    setEditedFile(null);
    setIsEditModalOpen(false);
    toast({
      title: "File updated",
      description: `File updated successfully.`,
    });
  };

  const handleEditCancel = () => {
    setEditedFile(null);
    setIsEditModalOpen(false);
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-3 lg:space-y-0">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold">File Management</h1>
          <BreadcrumbNav 
            items={getBreadcrumbItems()} 
            onNavigate={handleNavigate}
          />
        </div>
        <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-2">
        <div className="flex items-center space-x-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="default" size="sm">
                  <Upload className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                  <span className="text-sm">Upload</span>
                  <ChevronDown className="w-3 h-3 sm:w-4 sm:h-4 ml-1" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={handleUpload}>
            <Upload className="w-4 h-4 mr-2" />
                  Upload Files
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleFolderUpload}>
            <FolderPlus className="w-4 h-4 mr-2" />
                  Upload Folders
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <Button onClick={handleNewFolder} variant="outline" size="sm">
              <FolderPlus className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
              <span className="text-sm">New Folder</span>
          </Button>
          </div>
        </div>
      </div>

      {/* Search and Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0">
        <div className="relative flex-1 sm:flex-none">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search files and owners..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 w-full sm:w-80"
            />
        </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
              <ArrowUpDown className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
              <span className="text-sm">Sort by {sortBy} ({sortOrder})</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => handleSort('name')}>
                Sort by Name
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleSort('modified')}>
                Sort by Date Modified
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleSort('size')}>
                Sort by Size
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

      {/* Empty State */}
      {filteredFiles.length === 0 && (
        <EmptyState
          title="No files found"
          description="Try adjusting your search or filters to find files."
          icon={FileText}
        />
      )}

      {/* Mobile Card Layout */}
      <div className="lg:hidden space-y-3">
        {sortedFiles.map((item) => {
          const IconComponent = getFileIcon(item);
          return (
            <div
              key={item.id}
              className="border rounded-lg p-3 hover:bg-muted/50 cursor-pointer transition-colors"
              onClick={() => handleItemClick(item)}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-3 flex-1 min-w-0">
                  <IconComponent className={`h-5 w-5 flex-shrink-0 ${
                    item.type === 'folder' ? 'text-blue-600' : 'text-gray-600'
                  }`} />
                  <div className="min-w-0 flex-1">
                    <h3 className="text-sm font-medium truncate">{item.name}</h3>
                    <div className="flex items-center space-x-2 mt-1">
                      <Avatar className="h-4 w-4">
                        <AvatarFallback className="text-xs">{item.avatar}</AvatarFallback>
                      </Avatar>
                      <span className="text-xs text-muted-foreground truncate">{item.owner}</span>
                    </div>
                  </div>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                      <MoreVertical className="w-4 h-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="bg-background border z-50">
                    <DropdownMenuItem onClick={(e) => {
                      e.stopPropagation();
                      if (item.type === 'folder') {
                        handleItemClick(item);
                      } else {
                        setSelectedFile(item);
                        setIsModalOpen(true);
                      }
                    }}>
                      <Eye className="w-4 h-4 mr-2" />
                      View
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={(e) => {
                      e.stopPropagation();
                      handleDownload(item);
                    }}>
                      <Download className="w-4 h-4 mr-2" />
                      Download
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={(e) => {
                      e.stopPropagation();
                      handleEdit(item);
                    }}>
                      <Edit className="w-4 h-4 mr-2" />
                      Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(item);
                    }}>
                      <Trash className="w-4 h-4 mr-2 text-red-500" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
              <div className="flex items-center justify-between mt-2 text-xs text-muted-foreground">
                <span>{item.type === 'folder' ? 'Folder' : item.fileType}</span>
                <div className="flex items-center space-x-2">
                  <span>{item.size || '-'}</span>
                  <Badge variant="outline" className="text-xs">Private</Badge>
                </div>
              </div>
              {item.modified && (
                <div className="text-xs text-muted-foreground mt-1">
                  Modified: {item.modified}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Desktop Table Layout */}
      <div className="hidden lg:block border rounded-lg">
        <div className="grid grid-cols-7 gap-4 p-4 border-b bg-muted/20 text-sm font-medium">
          <div>Name</div>
          <div>Type</div>
          <div>Size</div>
          <div>Owner</div>
          <div>Modified</div>
          <div>Status</div>
          <div></div>
        </div>
        {sortedFiles.map((item) => {
          const IconComponent = getFileIcon(item);
          return (
            <div
              key={item.id}
              className="grid grid-cols-7 gap-4 p-4 border-b hover:bg-muted/50 cursor-pointer transition-colors group"
              onClick={() => handleItemClick(item)}
            >
              <div className="flex items-center space-x-2">
                <IconComponent className={`h-4 w-4 ${
                  item.type === 'folder' ? 'text-blue-600' : 'text-gray-600'
                }`} />
                <span className="text-sm font-medium truncate">{item.name}</span>
              </div>
              <div className="text-sm text-muted-foreground">
                {item.type === 'folder' ? 'Folder' : item.fileType}
              </div>
              <div className="text-sm text-muted-foreground">{item.size || '-'}</div>
              <div className="flex items-center space-x-2">
                <Avatar className="h-6 w-6">
                  <AvatarFallback className="text-xs">{item.avatar}</AvatarFallback>
                </Avatar>
                <span className="text-sm truncate">{item.owner}</span>
              </div>
               <div className="text-sm text-muted-foreground">{item.modified}</div>
              <div className="flex items-center space-x-2">
                <Badge variant="outline">Private</Badge>
              </div>
              <div className="flex justify-end">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                    <Button variant="ghost" size="sm" className="opacity-0 group-hover:opacity-100 transition-opacity">
                      <MoreVertical className="w-4 h-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="bg-background border z-50">
                    <DropdownMenuItem onClick={(e) => {
                      e.stopPropagation();
                      if (item.type === 'folder') {
                        handleItemClick(item);
                      } else {
                        setSelectedFile(item);
                        setIsModalOpen(true);
                      }
                    }}>
                      <Eye className="w-4 h-4 mr-2" />
                      View
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={(e) => {
                      e.stopPropagation();
                      handleDownload(item);
                    }}>
                      <Download className="w-4 h-4 mr-2" />
                      Download
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={(e) => {
                      e.stopPropagation();
                      handleEdit(item);
                    }}>
                      <Edit className="w-4 h-4 mr-2" />
                      Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(item);
                    }}>
                      <Trash className="w-4 h-4 mr-2 text-red-500" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          );
        })}
      </div>

      {/* File View Modal */}
      <FileViewModal
        file={selectedFile ? {
          id: selectedFile.id,
          name: selectedFile.name,
          type: selectedFile.type,
          size: selectedFile.size,
          modified: selectedFile.modified,
          fileType: selectedFile.fileType
        } : null}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onDownload={(file) => handleDownload(selectedFile!)}
        onEdit={(file) => handleEdit(selectedFile!)}
        onDelete={(file) => handleDelete(selectedFile!)}
      />

      {/* Edit File Modal */}
      <EditFileModal
        file={editedFile}
        isOpen={isEditModalOpen}
        onClose={handleEditCancel}
        onSave={handleEditSave}
      />

      {/* Upload Progress */}
      <UploadProgress
        uploads={uploads}
        onCancel={handleCancelUpload}
        onDismiss={handleDismissUpload}
      />
    </div>
  );
};

export default AdminFiles;