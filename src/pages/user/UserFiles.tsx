import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
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
  Star
} from 'lucide-react';
import { BreadcrumbNav } from '@/components/BreadcrumbNav';
import { FileViewModal } from '@/components/FileViewModal';
import { useToast } from '@/hooks/use-toast';
import { useFileStorage, type FileItem } from '@/hooks/useFileStorage';

const getFileIcon = (item: FileItem) => {
  if (item.type === 'folder') return Folder;
  
  const fileType = item.fileType?.toLowerCase() || '';
  if (fileType.includes('pdf')) return FileText;
  if (fileType.includes('image') || fileType.includes('jpg') || fileType.includes('png')) return Image;
  if (fileType.includes('excel') || fileType.includes('spreadsheet')) return FileSpreadsheet;
  if (fileType.includes('powerpoint') || fileType.includes('presentation')) return Presentation;
  return File;
};

const UserFiles = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPath, setCurrentPath] = useState('');
  const [selectedFile, setSelectedFile] = useState<FileItem | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [sortBy, setSortBy] = useState<'name' | 'modified' | 'size'>('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const { toast } = useToast();
  const { files, addFile, addFolder, deleteFile, sortFiles } = useFileStorage();

  // Filter files based on current path and search term
  const filteredFiles = files.filter(file => {
    const matchesPath = file.parentPath === currentPath;
    const matchesSearch = file.name.toLowerCase().includes(searchTerm.toLowerCase());
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
    input.webkitdirectory = false;
    input.accept = '*/*';
    
    input.onchange = (e) => {
      const uploadedFiles = Array.from((e.target as HTMLInputElement).files || []);
      if (uploadedFiles.length > 0) {
        uploadedFiles.forEach(file => {
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
          });
        });
        
        toast({
          title: "Files uploaded successfully",
          description: `${uploadedFiles.length} file(s) uploaded to ${currentPath || 'root'} folder.`,
        });
      }
    };
    
    input.click();
  };

  const handleUploadFolder = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.webkitdirectory = true;
    input.multiple = true;
    
    input.onchange = (e) => {
      const uploadedFiles = Array.from((e.target as HTMLInputElement).files || []);
      if (uploadedFiles.length > 0) {
        uploadedFiles.forEach(file => {
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
          });
        });
        
        toast({
          title: "Folder uploaded successfully",
          description: `Folder with ${uploadedFiles.length} file(s) uploaded to ${currentPath || 'root'} folder.`,
        });
      }
    };
    
    input.click();
  };

  const handleNewFolder = () => {
    const folderName = prompt('Enter folder name:');
    if (folderName && folderName.trim()) {
      addFolder(folderName.trim(), currentPath);
      toast({
        title: "Folder created",
        description: `"${folderName}" folder created successfully.`,
      });
    }
  };

  const handleStarredFiles = () => {
    toast({
      title: "Starred Files",
      description: "Showing your starred files.",
    });
  };

  const handleDownload = (file: FileItem) => {
    toast({
      title: "Download started",
      description: `Downloading ${file.name}...`,
    });
  };


  const handleEdit = (file: FileItem) => {
    toast({
      title: "Rename file",
      description: `Rename dialog for ${file.name} would appear here.`,
    });
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

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="flex flex-col space-y-3 lg:flex-row lg:items-center lg:justify-between lg:space-y-0">
        <div className="min-w-0">
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold truncate">File Management</h1>
          <BreadcrumbNav 
            items={getBreadcrumbItems()} 
            onNavigate={handleNavigate}
          />
        </div>
        <div className="flex flex-col space-y-2 sm:flex-row sm:space-y-0 sm:space-x-2 lg:items-center">
          <div className="flex space-x-2">
            <Button onClick={handleUpload} variant="default" size="sm" className="flex-1 sm:flex-none">
              <Upload className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
              <span className="text-xs sm:text-sm">Upload Files</span>
            </Button>
            <Button onClick={handleUploadFolder} variant="outline" size="sm" className="flex-1 sm:flex-none">
              <Upload className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
              <span className="text-xs sm:text-sm">Upload Folder</span>
            </Button>
          </div>
          <div className="flex space-x-2">
            <Button onClick={handleNewFolder} variant="outline" size="sm" className="flex-1 sm:flex-none">
              <FolderPlus className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
              <span className="text-xs sm:text-sm">New Folder</span>
            </Button>
            <Button onClick={handleStarredFiles} variant="outline" size="sm" className="flex-1 sm:flex-none">
              <Star className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
              <span className="text-xs sm:text-sm">Starred</span>
            </Button>
          </div>
        </div>
      </div>

      {/* Search and Controls */}
      <div className="flex items-center justify-between space-x-2 sm:space-x-4">
        <div className="flex items-center space-x-2 sm:space-x-4 flex-1">
          <div className="relative flex-1 max-w-xs sm:max-w-sm">
            <Search className="absolute left-2 sm:left-3 top-2 sm:top-2.5 h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground" />
            <Input
              placeholder="Search files..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8 sm:pl-10 h-8 sm:h-10 text-sm"
            />
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="text-xs sm:text-sm">
                <ArrowUpDown className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                <span className="hidden sm:inline">Sort by {sortBy} ({sortOrder})</span>
                <span className="sm:hidden">Sort</span>
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
      </div>

      {/* File List */}
      <div className="border rounded-lg overflow-hidden">
        {/* Desktop Header */}
        <div className="hidden lg:grid lg:grid-cols-6 gap-4 p-4 border-b bg-muted/20 text-sm font-medium">
          <div>Name</div>
          <div>Type</div>
          <div>Size</div>
          <div>Modified</div>
          <div>Status</div>
          <div></div>
        </div>
        
        {/* File Items */}
        {sortedFiles.map((item) => {
          const IconComponent = getFileIcon(item);
          return (
            <div key={item.id} className="border-b hover:bg-muted/50 cursor-pointer transition-colors group">
              {/* Mobile Layout */}
              <div className="lg:hidden p-3 sm:p-4" onClick={() => handleItemClick(item)}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2 sm:space-x-3 min-w-0 flex-1">
                    <IconComponent className={`h-4 w-4 sm:h-5 sm:w-5 flex-shrink-0 ${
                      item.type === 'folder' ? 'text-blue-600' : 'text-gray-600'
                    }`} />
                    <div className="min-w-0 flex-1">
                      <p className="text-sm sm:text-base font-medium truncate">{item.name}</p>
                      <div className="flex items-center space-x-2 text-xs sm:text-sm text-muted-foreground">
                        <span>{item.type === 'folder' ? 'Folder' : item.fileType}</span>
                        {item.size && (
                          <>
                            <span>•</span>
                            <span>{item.size}</span>
                          </>
                        )}
                        <span>•</span>
                        <span>{item.modified}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Badge variant="outline" className="text-xs">Private</Badge>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                        <Button variant="ghost" size="sm" className="h-6 w-6 sm:h-8 sm:w-8 p-0">
                          <MoreVertical className="w-3 h-3 sm:w-4 sm:h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="bg-background border z-50">
                        <DropdownMenuItem onClick={(e) => {
                          e.stopPropagation();
                          if (item.type === 'file') {
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
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              </div>

              {/* Desktop Layout */}
              <div 
                className="hidden lg:grid lg:grid-cols-6 gap-4 p-4"
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
                <div className="text-sm text-muted-foreground">{item.modified}</div>
                <div>
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
                        if (item.type === 'file') {
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
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* File View Modal */}
      <FileViewModal
        file={selectedFile}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onDownload={handleDownload}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
    </div>
  );
};

export default UserFiles;