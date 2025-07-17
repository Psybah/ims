import { useMutation, useQueryClient } from '@tanstack/react-query';
import * as fileApi from '@/api/files';

export function useCreateFolder() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ name, parentId }: { name: string, parentId?: string }) =>
      fileApi.createFolder(name, parentId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['filesAndFolders'] });
    },
  });
}

export function useUploadFile() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ file, parentId }: { file: File, parentId?: string }) =>
      fileApi.uploadFile(file, parentId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['filesAndFolders'] });
    },
  });
}

export function useUploadFolder() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ files, parentId }: { files: FileList, parentId?: string }) =>
      fileApi.uploadFolder(files, parentId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['filesAndFolders'] });
    },
  });
}

export function useDeleteFileOrFolder() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ itemId, itemType }: { itemId: string, itemType: 'file' | 'folder' }) =>
      fileApi.deleteFileOrFolder(itemId, itemType),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['filesAndFolders'] });
    },
  });
} 