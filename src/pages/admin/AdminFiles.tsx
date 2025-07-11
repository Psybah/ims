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
  Archive,
  Trash2
} from 'lucide-react';
import { BreadcrumbNav } from '@/components/BreadcrumbNav';
import { FileViewModal } from '@/components/FileViewModal';
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
  const { toast } = useToast();
  const { files, addFile, addFolder, deleteFile, sortFiles } = useFileStorage();

  // Add owner and avatar info to files for admin view
  const filesWithOwner = files.map(file => ({
    ...file,
    owner: file.owner || getRandomUser().name,
    avatar: file.avatar || getRandomUser().avatar,
  }));

  // Filter files based on current path and search term
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
        });
        
        toast({
          title: "Files uploaded successfully",
          description: `${uploadedFiles.length} file(s) uploaded to ${currentPath || 'root'} folder.`,
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

  const handleBulkActions = () => {
    toast({
      title: "Bulk actions",
      description: "Bulk file management options would appear here.",
    });
  };

  const handleSystemCleanup = () => {
    toast({
      title: "System cleanup",
      description: "System cleanup and optimization would start here.",
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

  const handleArchive = (file: FileItem) => {
    toast({
      title: "Archive file",
      description: `${file.name} would be archived.`,
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
            <Button onClick={handleUpload} variant="default" size="sm">
              <Upload className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
              <span className="text-sm">Upload</span>
            </Button>
            <Button onClick={handleNewFolder} variant="outline" size="sm">
              <FolderPlus className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
              <span className="text-sm">New Folder</span>
            </Button>
          </div>
          <div className="flex items-center space-x-2">
            <Button onClick={handleBulkActions} variant="outline" size="sm">
              <Archive className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
              <span className="text-sm hidden sm:inline">Bulk Actions</span>
              <span className="text-sm sm:hidden">Bulk</span>
            </Button>
            <Button onClick={handleSystemCleanup} variant="outline" size="sm">
              <Trash2 className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
              <span className="text-sm hidden sm:inline">System Cleanup</span>
              <span className="text-sm sm:hidden">Cleanup</span>
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
                    <DropdownMenuItem onClick={(e) => {
                      e.stopPropagation();
                      handleArchive(item);
                    }}>
                      <Archive className="w-4 h-4 mr-2" />
                      Archive
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
                    <DropdownMenuItem onClick={(e) => {
                      e.stopPropagation();
                      handleArchive(item);
                    }}>
                      <Archive className="w-4 h-4 mr-2" />
                      Archive
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
    </div>
  );
};

export default AdminFiles;