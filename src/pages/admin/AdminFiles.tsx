import React, { useState } from 'react';
import { FileList } from '@/components/FileList';
import { FileToolbar } from '@/components/FileToolbar';
import { FileSearchSort } from '@/components/FileSearchSort';
import { BreadcrumbNav } from '@/components/BreadcrumbNav';
import { FileViewModal } from '@/components/FileViewModal';
import { UploadProgress } from '@/components/UploadProgress';
import type { FileItem, BreadcrumbItem } from '@/lib/types';
import {
  useFoldersQuery,
  useFolderByIdQuery,
  useCreateFolderMutation,
  useUploadFileMutation,
  useDeleteFileMutation,
} from '@/api/files';

const AdminFiles = () => {
  // State for navigation, search, sort, modals, uploads
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'name' | 'modified' | 'size'>('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [currentFolder, setCurrentFolder] = useState<{ id: string | null; name: string } | null>(null);
  const [breadcrumbs, setBreadcrumbs] = useState<BreadcrumbItem[]>([{ name: 'Root', id: null }]);
  const [selectedFile, setSelectedFile] = useState<FileItem | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [uploads, setUploads] = useState<any[]>([]);

  // Backend data
  const { data: rootFolders, isLoading: loadingRoot } = useFoldersQuery();
  const { data: folderData, isLoading: loadingFolder } = useFolderByIdQuery(currentFolder?.id || '', {
    enabled: !!currentFolder,
  });
  const createFolderMutation = useCreateFolderMutation();
  const uploadFileMutation = useUploadFileMutation();
  const deleteFileMutation = useDeleteFileMutation();

  // Type guards for folderData
  const folderChildren: FileItem[] = (folderData && Array.isArray((folderData as any).children)) ? (folderData as any).children : [];
  const folderFiles: FileItem[] = (folderData && Array.isArray((folderData as any).files)) ? (folderData as any).files : [];
  const folders: FileItem[] = currentFolder ? folderChildren : (rootFolders as FileItem[]) || [];
  const files: FileItem[] = currentFolder ? folderFiles : [];
  const items: FileItem[] = [...folders, ...files];

  // Search and sort logic
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

  // Breadcrumb navigation
  const handleNavigate = (pathId: string) => {
    if (pathId === '/' || pathId === '') {
      setCurrentFolder(null);
      setBreadcrumbs([{ name: 'Root', id: null }]);
    } else {
      const clickedIndex = breadcrumbs.findIndex(item => item.id === pathId);
      if (clickedIndex !== -1) {
        setBreadcrumbs(breadcrumbs.slice(0, clickedIndex + 1));
        setCurrentFolder({ id: pathId, name: breadcrumbs[clickedIndex].name });
      }
    }
    setSearchTerm('');
  };

  // File/folder click
  const handleItemClick = (item: FileItem) => {
    if (item.type === 'folder') {
      setCurrentFolder({ id: item.id, name: item.name });
      setBreadcrumbs([...breadcrumbs, { name: item.name, id: item.id }]);
    } else {
      setSelectedFile({
        ...item,
        size: item.fileSize ? `${(item.fileSize / 1024).toFixed(2)} KB` : undefined,
        modified: item.updatedAt || '',
      });
      setIsModalOpen(true);
    }
  };

  // Upload logic
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
  const updateUpload = (id: string, progress: number, status = 'uploading', error?: string) => {
    setUploads((prev) =>
      prev.map((u) =>
        u.id === id ? { ...u, progress, status, error } : u
      )
    );
  };
  const removeUpload = (id: string) => {
    setUploads((prev) => prev.filter((u) => u.id !== id));
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
            await uploadFileMutation.mutateAsync({
              file,
              parentId: currentFolder ? currentFolder.id || undefined : undefined,
              onUploadProgress: (event: ProgressEvent) => {
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
    // Not implemented: folder upload UI
    alert('Folder upload not implemented in this UI.');
  };

  const handleNewFolder = () => {
    const folderName = prompt('Enter folder name:');
    if (folderName && folderName.trim()) {
      createFolderMutation.mutate({ folderName: folderName.trim(), parentId: currentFolder ? currentFolder.id || undefined : undefined });
    }
  };

  const handleStarred = () => {
    alert('Starred files not implemented in this UI.');
  };
      
  const handleDownload = (item: FileItem) => {
    window.open(item.webContentLink, '_blank');
  };

  const handleSort = (newSortBy: 'name' | 'modified' | 'size') => {
    if (sortBy === newSortBy) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(newSortBy);
      setSortOrder('asc');
    }
  };

  // Upload progress handlers
  const handleCancelUpload = (id: string) => removeUpload(id);
  const handleDismissUpload = (id: string) => removeUpload(id);

  return (
    <div className="space-y-4 sm:space-y-6 p-4">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-3 lg:space-y-0">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold">File Management</h1>
          <BreadcrumbNav items={breadcrumbs} onNavigate={handleNavigate} />
        </div>
        <FileToolbar
          onUpload={handleUpload}
          onUploadFolder={handleUploadFolder}
          onNewFolder={handleNewFolder}
          onStarred={handleStarred}
        />
      </div>
      <FileSearchSort
        searchTerm={searchTerm}
        onSearch={setSearchTerm}
        sortBy={sortBy}
        sortOrder={sortOrder}
        onSort={handleSort}
      />
      {(loadingRoot || loadingFolder) ? (
        <div>Loading...</div>
      ) : (
        <FileList
          items={sortedItems}
          onItemClick={handleItemClick}
          onDownload={handleDownload}
        />
      )}
      <FileViewModal
        file={selectedFile}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onDownload={handleDownload}
        onEdit={() => {}}
        onDelete={() => {}}
      />
      <UploadProgress
        uploads={uploads}
        onCancel={handleCancelUpload}
        onDismiss={handleDismissUpload}
      />
    </div>
  );
};

export default AdminFiles;