import { useQuery } from '@tanstack/react-query';
import { apiV2 } from '@/lib/api';
import { FileItem } from '@/lib/types';

export function useFilesQuery(currentFolderId: string | null) {
  return useQuery<FileItem[]>({
    queryKey: ['filesAndFolders', currentFolderId],
    queryFn: async () => {
      if (currentFolderId) {
        const response = await apiV2.get(`/files/folders/${currentFolderId}?resourceType=FOLDER`);
        const folderContent = response.data.data;
        const combinedItems: FileItem[] = [];
        if (folderContent.children) {
          combinedItems.push(...folderContent.children.map((f: any) => ({ ...f, type: 'folder' })));
        }
        if (folderContent.files) {
          combinedItems.push(...folderContent.files.map((f: any) => ({ ...f, name: f.fileName, type: 'file' })));
        }
        return combinedItems;
      } else {
        const response = await apiV2.get('/files/folders');
        return response.data.data;
      }
    },
  });
} 