import { useMutation, useQueryClient } from "@tanstack/react-query";
import * as fileApi from "@/api/files";

export function useCreateFolder() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ name, parentId }: { name: string; parentId?: string }) =>
      fileApi.createFolder(name, parentId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["filesAndFolders"] });
    },
  });
}

export function useUploadFile() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      file,
      parentId,
      onUploadProgress,
    }: {
      file: File;
      parentId?: string;
      onUploadProgress;
    }) => fileApi.uploadFile(file, parentId, onUploadProgress),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["filesAndFolders"] });
    },
  });
}

export function useUploadFolder() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      files,
      parentId,
      onUploadProgress,
    }: {
      files: FileList;
      parentId?: string;
      onUploadProgress;
    }) => fileApi.uploadFolder(files, parentId, onUploadProgress),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["filesAndFolders"] });
    },
  });
}

export function useDeleteFileOrFolder() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      itemId,
      itemType,
    }: {
      itemId: string;
      itemType: "file" | "folder";
    }) => fileApi.deleteFileOrFolder(itemId, itemType),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["filesAndFolders"] });
    },
  });
}
