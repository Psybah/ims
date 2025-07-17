import { useQuery } from '@tanstack/react-query';
import { apiV2 } from '@/lib/api';

export type FileItem = {
  id: string;
  name: string; // For folders, this is 'name'. For files, this is 'fileName'.
  type: 'file' | 'folder';
  parentId: string | null; // ID of the parent folder, null for root items
  createdAt: string;
  updatedAt: string;
  // File specific properties
  fileType?: string; // Mime type for files
  size?: number; // File size in bytes
  filePath?: string; // Full path for files
  webContentLink?: string; // Download link for files
  webViewLink?: string; // View link for files
  // Folder specific properties
  fullPath?: string; // Full path for folders
};

export const useFileManagement = (currentFolderId: string | null) => {
  const { data, isLoading, error } = useQuery<FileItem[]>({ 
    queryKey: ['filesAndFolders', currentFolderId],
    queryFn: async () => {
      let response;
      if (currentFolderId) {
        // Fetch contents of a specific folder
        response = await apiV2.get(`/files/folders/${currentFolderId}?resourceType=FOLDER`);
        // Combine files and children (subfolders) from the response
        const files = response.data.data.files.map(file => ({
          ...file,
          name: file.fileName, // Map fileName to name for consistency
          type: 'file',
          parentId: file.folderId, // Map folderId to parentId
        }));
        const folders = response.data.data.children.map(folder => ({
          ...folder,
          type: 'folder',
          parentId: folder.parentId,
        }));
        return [...folders, ...files];
      } else {
        // Fetch root level folders
        response = await apiV2.get('/files/folders');
        // The API returns an array of folders directly under response.data.data
        return response.data.data.map(folder => ({
          ...folder,
          type: 'folder',
          parentId: folder.parentId,
        }));
      }
    },
  });

  // Placeholder for future functions like addFile, addFolder, deleteFile, etc.
  const addFile = async (file: File, parentId: string | null) => {
    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await apiV2.post(
        `/files/upload/file${parentId ? '/' + parentId : ''}?resourceType=FILE`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );
      queryClient.invalidateQueries({ queryKey: ['filesAndFolders'] });
      return response.data;
    } catch (error) {
      console.error('Error uploading file:', error);
      throw error;
    }
  };

  const addFolder = async (folderName: string, parentId: string | null) => {
    try {
      const response = await apiV2.post(
        `/files/create/folder${parentId ? '/' + parentId : ''}?resourceType=FOLDER`,
        { folderName }
      );
      // Invalidate queries to refetch files and folders after creation
      queryClient.invalidateQueries({ queryKey: ['filesAndFolders'] });
      return response.data;
    } catch (error) {
      console.error('Error creating folder:', error);
      throw error;
    }
  };

  const uploadFolder = async (files: FileList, parentId: string | null) => {
    try {
      const formData = new FormData();
      for (let i = 0; i < files.length; i++) {
        formData.append('files', files[i]);
      }

      const response = await apiV2.post(
        `/files/upload/folder${parentId ? '/' + parentId : ''}`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );
      queryClient.invalidateQueries({ queryKey: ['filesAndFolders'] });
      return response.data;
    } catch (error) {
      console.error('Error uploading folder:', error);
      throw error;
    }
  };
  const deleteFile = () => {};

  const deleteFileOrFolder = async (itemId: string, itemType: 'file' | 'folder') => {
    try {
      const endpoint = itemType === 'file' ? `/files/file/${itemId}` : `/files/folder/${itemId}`;
      await apiV2.delete(endpoint);
      queryClient.invalidateQueries({ queryKey: ['filesAndFolders'] });
      return true;
    } catch (error) {
      console.error(`Error deleting ${itemType}:`, error);
      throw error;
    }
  };

  const sortFiles = (files: FileItem[], sortBy: 'name' | 'modified' | 'size', sortOrder: 'asc' | 'desc') => {
    return [...files].sort((a, b) => {
      if (sortBy === 'name') {
        return sortOrder === 'asc' ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name);
      }
      // For now, modified and size sorting will be placeholders until we have real data for them
      // if (sortBy === 'modified') {
      //   return sortOrder === 'asc' ? new Date(a.modified).getTime() - new Date(b.modified).getTime() : new Date(b.modified).getTime() - new Date(a.modified).getTime();
      // }
      // if (sortBy === 'size') {
      //   return sortOrder === 'asc' ? (a.size || 0) - (b.size || 0) : (b.size || 0) - (a.size || 0);
      // }
      return 0;
    });
  };

  return {
    files: data || [],
    isLoading,
    error,
    addFile,
    addFolder,
    deleteFile,
    sortFiles,
  };
};