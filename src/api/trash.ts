import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiV1 } from '@/lib/api';

// Types
export interface TrashItem {
  id: string;
  accountId: string;
  folderId: string | null;
  fileId: string | null;
  deletedAt: string;
  originalPath: string | null;
  itemType: 'FILE' | 'FOLDER';
  retentionExpiresAt: string | null;
  deletedBy: {
    id: string;
    fullName: string;
    email: string;
    phoneNumber: string | null;
    role: string;
    createdAt: string;
    updatedAt: string;
  };
}

export interface TrashAnalysis {
  totalItems: number;
  freedSpace: number;
}

export interface RestoreResponse {
  restoredItem: {
    id: string;
    fileName: string;
    fileType: string;
    fileSize: number;
    filePath: string;
    encoding: string;
    deleted: boolean;
    webContentLink: string;
    webViewLink: string;
    version: number;
    metadata: any;
    folderId: string | null;
    accountId: string;
    uploadedAt: string;
    updatedAt: string;
  };
}

// API Functions
export const getTrashItems = async (): Promise<TrashItem[]> => {
  const response = await apiV1.get('/trash');
  return response.data.data;
};

export const getTrashAnalysis = async (): Promise<TrashAnalysis> => {
  const response = await apiV1.get('/trash/analysis');
  return response.data.data;
};

export const restoreTrashItem = async (
  trashId: string, 
  type: 'FILE' | 'FOLDER', 
  itemId: string
): Promise<RestoreResponse> => {
  const response = await apiV1.put(`/trash/restore/${trashId}`, {
    type,
    itemId
  });
  return response.data.data;
};

// React Query Hooks
export const useTrashItemsQuery = () => {
  return useQuery({
    queryKey: ['trash', 'items'],
    queryFn: getTrashItems,
  });
};

export const useTrashAnalysisQuery = () => {
  return useQuery({
    queryKey: ['trash', 'analysis'],
    queryFn: getTrashAnalysis,
  });
};

export const useRestoreTrashItemMutation = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ trashId, type, itemId }: { trashId: string; type: 'FILE' | 'FOLDER'; itemId: string }) =>
      restoreTrashItem(trashId, type, itemId),
    onSuccess: () => {
      // Invalidate and refetch trash data
      queryClient.invalidateQueries({ queryKey: ['trash'] });
    },
  });
}; 