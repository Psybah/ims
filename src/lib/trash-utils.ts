import { TrashItem } from '@/api/trash';

// File type mapping
const FILE_TYPE_MAP: Record<string, string> = {
  'application/pdf': 'PDF',
  'application/msword': 'Word',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document': 'Word',
  'application/vnd.ms-excel': 'Excel',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': 'Excel',
  'application/vnd.ms-powerpoint': 'PowerPoint',
  'application/vnd.openxmlformats-officedocument.presentationml.presentation': 'PowerPoint',
  'text/plain': 'Text',
  'image/jpeg': 'Image',
  'image/png': 'Image',
  'image/gif': 'Image',
  'image/webp': 'Image',
  'video/mp4': 'Video',
  'video/avi': 'Video',
  'video/mov': 'Video',
  'audio/mpeg': 'Audio',
  'audio/wav': 'Audio',
  'application/zip': 'Archive',
  'application/x-rar-compressed': 'Archive',
};

// Format file size
export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 B';
  
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
};

// Get file type from MIME type
export const getFileType = (mimeType: string): string => {
  return FILE_TYPE_MAP[mimeType] || mimeType.split('/')[1]?.toUpperCase() || 'Unknown';
};

// Format date
export const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};

// Calculate retention days
export const calculateRetentionDays = (retentionExpiresAt: string | null): number => {
  if (!retentionExpiresAt) return 30; // Default retention period
  
  const now = new Date();
  const expiryDate = new Date(retentionExpiresAt);
  const diffTime = expiryDate.getTime() - now.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  return Math.max(0, diffDays);
};

// Get retention status
export const getRetentionStatus = (retentionDays: number) => {
  if (retentionDays <= 7) {
    return {
      text: `${retentionDays} days`,
      variant: 'destructive' as const,
      urgent: true
    };
  } else if (retentionDays <= 14) {
    return {
      text: `${retentionDays} days`,
      variant: 'secondary' as const,
      urgent: false
    };
  } else {
    return {
      text: `${retentionDays} days`,
      variant: 'default' as const,
      urgent: false
    };
  }
};

// Transform backend trash item to frontend format
export const transformTrashItem = (backendItem: TrashItem) => {
  const retentionDays = calculateRetentionDays(backendItem.retentionExpiresAt);
  
  return {
    id: backendItem.id,
    name: backendItem.itemType === 'FILE' ? 'File' : 'Folder', // We'll need to get actual file/folder name
    type: backendItem.itemType === 'FILE' ? 'File' : 'Folder',
    size: backendItem.itemType === 'FILE' ? 'Unknown' : 'Folder', // We'll need file size from file details
    deletedBy: backendItem.deletedBy.fullName,
    deletedDate: formatDate(backendItem.deletedAt),
    originalPath: backendItem.originalPath || '/',
    retentionDays,
    avatar: `/placeholder.svg`, // We'll need to get user avatar
    itemType: backendItem.itemType,
    fileId: backendItem.fileId,
    folderId: backendItem.folderId
  };
}; 