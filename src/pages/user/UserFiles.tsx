import { useState } from 'react';
import {
  Folder,
  FileText,
  Image,
  FileSpreadsheet,
  Presentation,
  File
} from 'lucide-react';
import { BreadcrumbNav } from '@/components/BreadcrumbNav';
import { FileViewModal } from '@/components/FileViewModal';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { FileItem, BreadcrumbItem } from '@/lib/types';
import {
  useCreateFolder,
  useUploadFile,
  useUploadFolder,
  useDeleteFileOrFolder
} from '@/hooks/useFiles';
import { FileList } from '@/components/FileList';
import { FileToolbar } from '@/components/FileToolbar';
import { FileSearchSort } from '@/components/FileSearchSort';
import { useFilesQuery } from '@/hooks/useFilesQuery';
import { UploadProgress } from '@/components/UploadProgress';

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
  const [currentFolderId, setCurrentFolderId] = useState<string | null>(null);
  const [currentPath, setCurrentPath] = useState<BreadcrumbItem[]>([{ name: 'Root', id: null }]);
  const [selectedFile, setSelectedFile] = useState<FileItem | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { toast } = useToast();
  const { token } = useAuth();
  const { data: items = [], isLoading, error } = useFilesQuery(currentFolderId);
  const [sortBy, setSortBy] = useState<'name' | 'modified' | 'size'>('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [uploads, setUploads] = useState([]);

  const createFolder = useCreateFolder();
  const uploadFile = useUploadFile();
  const uploadFolder = useUploadFolder();
  const deleteFileOrFolder = useDeleteFileOrFolder();

  // Helper to add upload item
  const addUpload = (file: File) => {
    const id = `${file.name}-${Date.now()}`;
    setUploads((prev) => [
      ...prev,
      {
        id,
        name: file.name,
        size: file.size,
        progress: 0,
        status: 'uploading',
      },
    ]);
    return id;
  };

  // Helper to update upload progress
  const updateUpload = (id, progress, status = 'uploading', error) => {
    setUploads((prev) =>
      prev.map((u) =>
        u.id === id ? { ...u, progress, status, error } : u
      )
    );
  };

  // Helper to remove upload
  const removeUpload = (id) => {
    setUploads((prev) => prev.filter((u) => u.id !== id));
  };

  // ...fetchItems logic will be replaced with useFilesQuery in next step

  const filteredItems = items.filter(item =>
    item.name?.toLowerCase().includes(searchTerm.toLowerCase()) || false
  );

  const sortItems = (itemsToSort: FileItem[], sortByKey: 'name' | 'modified' | 'size', sortOrderKey: 'asc' | 'desc') => {
    return [...itemsToSort].sort((a, b) => {
      if (sortByKey === 'name') {
        return sortOrderKey === 'asc' ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name);
      } else if (sortByKey === 'modified') {
        const dateA = new Date(a.updatedAt).getTime();
        const dateB = new Date(b.updatedAt).getTime();
        return sortOrderKey === 'asc' ? dateA - dateB : dateB - dateA;
      } else if (sortByKey === 'size') {
        const sizeA = a.fileSize || 0;
        const sizeB = b.fileSize || 0;
        return sortOrderKey === 'asc' ? sizeA - sizeB : sizeB - sizeA;
      }
      return 0;
    });
  };

  const sortedItems = sortItems(filteredItems, sortBy, sortOrder);

  const handleNavigate = (pathId: string) => {
    if (pathId === '/' || pathId === '') {
      setCurrentFolderId(null);
      setCurrentPath([{ name: 'Root', id: null }]);
    } else {
      const clickedIndex = currentPath.findIndex(item => item.id === pathId);
      if (clickedIndex !== -1) {
        setCurrentPath(currentPath.slice(0, clickedIndex + 1));
        setCurrentFolderId(pathId);
      }
    }
    setSearchTerm('');
  };

  const handleItemClick = (item: FileItem) => {
    if (item.type === 'folder') {
      setCurrentFolderId(item.id);
      setCurrentPath([...currentPath, { name: item.name, id: item.id }]);
    } else {
      setSelectedFile({
        ...item,
        size: item.fileSize ? `${(item.fileSize / 1024).toFixed(2)} KB` : undefined,
        modified: item.updatedAt || '',
      });
      setIsModalOpen(true);
    }
  };

  const handleUpload = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.multiple = true;
    input.onchange = async (e) => {
      const uploadedFiles = Array.from((e.target as HTMLInputElement).files || []);
      if (uploadedFiles.length > 0) {
        for (const file of uploadedFiles) {
          const uploadId = addUpload(file);
          try {
            await uploadFile.mutateAsync({
              file,
              parentId: currentFolderId || undefined,
              onUploadProgress: (event) => {
                const percent = event.total ? Math.round((event.loaded / event.total) * 100) : 0;
                updateUpload(uploadId, percent);
              },
            });
            updateUpload(uploadId, 100, 'completed');
            setTimeout(() => removeUpload(uploadId), 2000);
          } catch (error) {
            updateUpload(uploadId, 0, 'error', 'Upload failed');
          }
        }
      }
    };
    input.click();
  };

  const handleUploadFolder = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.webkitdirectory = true;
    input.multiple = true;
    input.onchange = async (e) => {
      const uploadedFiles = (e.target as HTMLInputElement).files;
      if (uploadedFiles && uploadedFiles.length > 0) {
        // Track as a single upload for the whole folder
        const totalSize = Array.from(uploadedFiles).reduce((sum, f) => sum + f.size, 0);
        const uploadId = `folder-${Date.now()}`;
        setUploads((prev) => [
          ...prev,
          {
            id: uploadId,
            name: 'Folder Upload',
            size: totalSize,
            progress: 0,
            status: 'uploading',
          },
        ]);
        try {
          await uploadFolder.mutateAsync({
            files: uploadedFiles,
            parentId: currentFolderId || undefined,
            onUploadProgress: (event) => {
              const percent = event.total ? Math.round((event.loaded / event.total) * 100) : 0;
              updateUpload(uploadId, percent);
            },
          });
          updateUpload(uploadId, 100, 'completed');
          setTimeout(() => removeUpload(uploadId), 2000);
        } catch (error) {
          updateUpload(uploadId, 0, 'error', 'Upload failed');
        }
      }
    };
    input.click();
  };

  const handleNewFolder = async () => {
    const folderName = prompt('Enter folder name:');
    if (folderName && folderName.trim()) {
      try {
        await createFolder.mutateAsync({ name: folderName.trim(), parentId: currentFolderId || undefined });
        toast({ title: "Folder created", description: `"${folderName}" folder created successfully.` });
      } catch (error: any) {
        toast({ title: "Error creating folder", description: error?.response?.data?.message || `Failed to create folder "${folderName}". Please try again.`, variant: "destructive" });
      }
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
    if (file.webContentLink) {
      window.open(file.webContentLink, '_blank');
    }
  };


  const handleEdit = (file: FileItem) => {
    toast({
      title: "Rename file",
      description: `Rename dialog for ${file.name} would appear here.`,
    });
  };

  const handleDelete = async (item: FileItem) => {
    try {
      await deleteFileOrFolder.mutateAsync({ itemId: item.id, itemType: item.type });
      toast({ title: "Item deleted", description: `${item.name} has been deleted successfully.`, variant: "destructive" });
    } catch (error) {
      toast({ title: "Error deleting item", description: `Failed to delete ${item.name}. Please try again.`, variant: "destructive" });
    }
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
            items={currentPath}
            onNavigate={handleNavigate}
          />
        </div>
        <FileToolbar
          onUpload={handleUpload}
          onUploadFolder={handleUploadFolder}
          onNewFolder={handleNewFolder}
          onStarred={handleStarredFiles}
        />
      </div>

      <FileSearchSort
        searchTerm={searchTerm}
        onSearch={setSearchTerm}
        sortBy={sortBy}
        sortOrder={sortOrder}
        onSort={handleSort}
      />

      {/* File List */}
      <FileList
        items={sortedItems}
        onItemClick={handleItemClick}
        onDownload={handleDownload}
      />

      <UploadProgress
        uploads={uploads}
        onCancel={removeUpload}
        onDismiss={removeUpload}
      />

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