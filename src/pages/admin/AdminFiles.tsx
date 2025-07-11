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
  Filter,
  Folder,
  FileText,
  Image,
  FileSpreadsheet,
  Presentation,
  File,
  Grid3X3,
  List,
  Eye,
  Archive,
  Trash2
} from 'lucide-react';
import { BreadcrumbNav } from '@/components/BreadcrumbNav';
import { FileViewModal } from '@/components/FileViewModal';
import { useToast } from '@/hooks/use-toast';

interface AdminFileItem {
  id: string;
  name: string;
  type: 'folder' | 'file';
  size?: string;
  owner: string;
  modified: string;
  fileType?: string;
  parentPath?: string;
  avatar: string;
}

// Mock data with Nigerian names and content
const mockAdminFiles: AdminFileItem[] = [
  {
    id: '1',
    name: 'Company_Documents',
    type: 'folder',
    owner: 'Adebayo Okonkwo',
    modified: '2024-01-15',
    parentPath: '',
    avatar: 'AO'
  },
  {
    id: '2',
    name: 'Finance_Reports',
    type: 'folder',
    owner: 'Chinedu Emeka',
    modified: '2024-01-14',
    parentPath: '',
    avatar: 'CE'
  },
  {
    id: '3',
    name: 'Kano_Operations_Manual.pdf',
    type: 'file',
    size: '5.8 MB',
    owner: 'Adebayo Okonkwo',
    modified: '2024-01-15',
    fileType: 'PDF Document',
    parentPath: '',
    avatar: 'AO'
  },
  {
    id: '4',
    name: 'Lagos_Financial_Analysis.xlsx',
    type: 'file',
    size: '3.2 MB',
    owner: 'Amina Yusuf',
    modified: '2024-01-14',
    fileType: 'Excel Spreadsheet',
    parentPath: '',
    avatar: 'AY'
  },
  {
    id: '5',
    name: 'Abuja_Project_Proposal.docx',
    type: 'file',
    size: '1.8 MB',
    owner: 'Chinedu Emeka',
    modified: '2024-01-13',
    fileType: 'Word Document',
    parentPath: '',
    avatar: 'CE'
  },
  {
    id: '6',
    name: 'Port_Harcourt_Presentation.pptx',
    type: 'file',
    size: '6.4 MB',
    owner: 'Amina Yusuf',
    modified: '2024-01-12',
    fileType: 'PowerPoint Presentation',
    parentPath: '',
    avatar: 'AY'
  },
  // Folder contents for Company_Documents
  {
    id: '7',
    name: 'HR_Policies.pdf',
    type: 'file',
    size: '2.1 MB',
    owner: 'Adebayo Okonkwo',
    modified: '2024-01-10',
    fileType: 'PDF Document',
    parentPath: 'Company_Documents',
    avatar: 'AO'
  },
  {
    id: '8',
    name: 'Employee_Handbook.docx',
    type: 'file',
    size: '1.5 MB',
    owner: 'Adebayo Okonkwo',
    modified: '2024-01-09',
    fileType: 'Word Document',
    parentPath: 'Company_Documents',
    avatar: 'AO'
  },
  // Folder contents for Finance_Reports
  {
    id: '9',
    name: 'Q4_Revenue_Report.xlsx',
    type: 'file',
    size: '2.8 MB',
    owner: 'Chinedu Emeka',
    modified: '2024-01-08',
    fileType: 'Excel Spreadsheet',
    parentPath: 'Finance_Reports',
    avatar: 'CE'
  },
  {
    id: '10',
    name: 'Budget_Allocation.xlsx',
    type: 'file',
    size: '1.9 MB',
    owner: 'Chinedu Emeka',
    modified: '2024-01-08',
    fileType: 'Excel Spreadsheet',
    parentPath: 'Finance_Reports',
    avatar: 'CE'
  },
];

const getFileIcon = (item: AdminFileItem) => {
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
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedFile, setSelectedFile] = useState<AdminFileItem | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { toast } = useToast();

  // Filter files based on current path and search term
  const filteredFiles = mockAdminFiles.filter(file => {
    const matchesPath = file.parentPath === currentPath;
    const matchesSearch = file.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         file.owner.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesPath && matchesSearch;
  });

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

  const handleItemClick = (item: AdminFileItem) => {
    if (item.type === 'folder') {
      const newPath = currentPath ? `${currentPath}/${item.name}` : item.name;
      setCurrentPath(newPath);
    } else {
      setSelectedFile(item);
      setIsModalOpen(true);
    }
  };

  const handleUpload = () => {
    toast({
      title: "Upload initiated",
      description: "File upload functionality would be implemented here.",
    });
  };

  const handleNewFolder = () => {
    toast({
      title: "New folder",
      description: "New folder creation would be implemented here.",
    });
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

  const handleDownload = (file: AdminFileItem) => {
    toast({
      title: "Download started",
      description: `Downloading ${file.name}...`,
    });
  };


  const handleEdit = (file: AdminFileItem) => {
    toast({
      title: "Rename file",
      description: `Rename dialog for ${file.name} would appear here.`,
    });
  };

  const handleDelete = (file: AdminFileItem) => {
    toast({
      title: "Delete file",
      description: `${file.name} would be moved to trash.`,
      variant: "destructive",
    });
  };

  const handleArchive = (file: AdminFileItem) => {
    toast({
      title: "Archive file",
      description: `${file.name} would be archived.`,
    });
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
          <Button variant="outline" size="sm">
            <Filter className="w-4 h-4 mr-2" />
            Sort
          </Button>
          <div className="flex border rounded-md">
            <Button
              variant={viewMode === 'grid' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('grid')}
              className="rounded-r-none"
            >
              <Grid3X3 className="w-4 h-4" />
            </Button>
            <Button
              variant={viewMode === 'list' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('list')}
              className="rounded-l-none"
            >
              <List className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* File Grid/List */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {filteredFiles.map((item) => {
            const IconComponent = getFileIcon(item);
            return (
              <div
                key={item.id}
                className="group relative p-4 border rounded-lg hover:bg-muted/50 cursor-pointer transition-colors"
                onClick={() => handleItemClick(item)}
              >
                <div className="flex flex-col items-center text-center space-y-2">
                  <div className={`p-3 rounded-lg ${
                    item.type === 'folder' 
                      ? 'bg-blue-100 text-blue-600' 
                      : 'bg-gray-100 text-gray-600'
                  }`}>
                    <IconComponent className="h-8 w-8" />
                  </div>
                  <div className="w-full">
                    <p className="text-sm font-medium truncate">{item.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {item.type === 'folder' ? 'Folder' : item.fileType}
                    </p>
                    <div className="flex items-center justify-center space-x-1 mt-1">
                      <Avatar className="h-4 w-4">
                        <AvatarFallback className="text-xs">{item.avatar}</AvatarFallback>
                      </Avatar>
                      <span className="text-xs text-muted-foreground truncate">{item.owner.split(' ')[0]}</span>
                    </div>
                    <p className="text-xs text-muted-foreground">{item.modified}</p>
                    {item.size && (
                      <p className="text-xs text-muted-foreground">{item.size}</p>
                    )}
                  </div>
                </div>
                
                {/* Dropdown Menu */}
                <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
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

              </div>
            );
          })}
        </div>
      ) : (
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
          {filteredFiles.map((item) => {
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
      )}

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