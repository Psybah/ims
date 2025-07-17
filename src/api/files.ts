import { apiV2 } from '@/lib/api';
import type { AxiosProgressEvent } from 'axios';

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