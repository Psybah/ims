import { apiV2 } from '@/lib/api';
import type { AxiosProgressEvent } from 'axios';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { FileItem } from '@/lib/types';

export const createFolder = (folderName: string, parentId?: string) => {
  const url = parentId
    ? `/files/create/folder/${parentId}?resourceType=FOLDER`
    : `/files/create/folder?resourceType=FOLDER`;
  return apiV2.post(url, { folderName });
};

export const uploadFile = (file: File, parentId?: string, onUploadProgress?: (progressEvent: AxiosProgressEvent) => void) => {
  const formData = new FormData();
  formData.append('files', file);
  const url = parentId
    ? `/files/upload/file/${parentId}?resourceType=FILE`
    : `/files/upload/file?resourceType=FILE`;
  return apiV2.post(url, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
    onUploadProgress,
  });
};

export const uploadFolder = (files: FileList, parentId?: string, onUploadProgress?: (progressEvent: AxiosProgressEvent) => void) => {
  const formData = new FormData();
  const structure: Record<string, { path: string; name: string }> = {};
  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    formData.append('files[]', file);
    const relPath = file.webkitRelativePath || file.name;
    const lastSlash = relPath.lastIndexOf('/');
    const path = lastSlash !== -1 ? `/${relPath.substring(0, lastSlash)}` : '/';
    structure[relPath] = {
      path,
      name: file.name,
    };
  }
  formData.append('structure', JSON.stringify(structure));
  const url = parentId
    ? `/files/upload/folder/${parentId}?resourceType=FOLDER`
    : `/files/upload/folder?resourceType=FOLDER`;
  return apiV2.post(url, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
    onUploadProgress,
  });
};

export const deleteFileOrFolder = (itemId: string, itemType: 'file' | 'folder') => {
  const endpoint = itemType === 'file' ? `/files/file/${itemId}` : `/files/folder/${itemId}`;
  return apiV2.delete(endpoint);
};

// Fetch all root folders
export const fetchFolders = async () => {
  const { data } = await apiV2.get('/files/folders');
  return data.data;
};

// Fetch a folder by ID (with its files and children)
export const fetchFolderById = async (folderId: string) => {
  const { data } = await apiV2.get(`/files/folders/${folderId}?resourceType=FOLDER`);
  return data.data;
};

// Delete a file
export const deleteFile = async (fileId: string) => {
  const { data } = await apiV2.delete(`/files/file/${fileId}?resourceType=FILE`);
  return data;
};

// --- React Query Hooks ---

interface CreateFolderArgs {
  folderName: string;
  parentId?: string;
}

interface UploadFileArgs {
  file: File;
  parentId?: string;
  onUploadProgress?: (e: any) => void;
}

export const useFoldersQuery = () =>
  useQuery({ queryKey: ['folders'], queryFn: fetchFolders });

export const useFolderByIdQuery = (folderId: string, options = {}) =>
  useQuery({ queryKey: ['folder', folderId], queryFn: () => fetchFolderById(folderId), enabled: !!folderId, ...options });

export const useCreateFolderMutation = () => {
  const queryClient = useQueryClient();
  return useMutation<any, unknown, CreateFolderArgs>({
    mutationFn: ({ folderName, parentId }) => createFolder(folderName, parentId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['folders'] });
    },
  });
};

export const useUploadFileMutation = () => {
  const queryClient = useQueryClient();
  return useMutation<any, unknown, UploadFileArgs>({
    mutationFn: ({ file, parentId, onUploadProgress }) => uploadFile(file, parentId, onUploadProgress),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['folders'] });
    },
  });
};

export const useDeleteFileMutation = () => {
  const queryClient = useQueryClient();
  return useMutation<any, unknown, string>({
    mutationFn: (fileId: string) => deleteFile(fileId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['folders'] });
    },
  });
}; 