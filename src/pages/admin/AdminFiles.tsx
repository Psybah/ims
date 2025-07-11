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
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">File Management</h1>
          <BreadcrumbNav 
            items={getBreadcrumbItems()} 
            onNavigate={handleNavigate}
          />
        </div>
        <div className="flex items-center space-x-2">
          <Button onClick={handleUpload} variant="default">
            <Upload className="w-4 h-4 mr-2" />
            Upload
          </Button>
          <Button onClick={handleNewFolder} variant="outline">
            <FolderPlus className="w-4 h-4 mr-2" />
            New Folder
          </Button>
          <Button onClick={handleBulkActions} variant="outline">
            <Archive className="w-4 h-4 mr-2" />
            Bulk Actions
          </Button>
          <Button onClick={handleSystemCleanup} variant="outline">
            <Trash2 className="w-4 h-4 mr-2" />
            System Cleanup
          </Button>
        </div>
      </div>

      {/* Search and Controls */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="relative">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search files and owners..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 w-80"
            />
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                <ArrowUpDown className="w-4 h-4 mr-2" />
                Sort by {sortBy} ({sortOrder})
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
      <div className="border rounded-lg">
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