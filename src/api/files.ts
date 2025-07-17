import { apiV2 } from '@/lib/api';

export const createFolder = (folderName: string, parentId?: string) => {
  const url = parentId
    ? `/files/create/folder/${parentId}?resourceType=FOLDER`
    : `/files/create/folder?resourceType=FOLDER`;
  return apiV2.post(url, { folderName });
};

export const uploadFile = (file: File, parentId?: string) => {
  const formData = new FormData();
  formData.append('file', file);
  const url = parentId
    ? `/files/upload/file/${parentId}?resourceType=FILE`
    : `/files/upload/file?resourceType=FILE`;
  return apiV2.post(url, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
};

export const uploadFolder = (files: FileList, parentId?: string) => {
  const formData = new FormData();
  for (let i = 0; i < files.length; i++) {
    formData.append('files', files[i]);
  }
  const url = parentId
    ? `/files/upload/folder/${parentId}`
    : `/files/upload/folder`;
  return apiV2.post(url, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
};

export const deleteFileOrFolder = (itemId: string, itemType: 'file' | 'folder') => {
  const endpoint = itemType === 'file' ? `/files/file/${itemId}` : `/files/folder/${itemId}`;
  return apiV2.delete(endpoint);
}; 