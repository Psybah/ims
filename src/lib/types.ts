// Shared types for the file management system

export interface FileItem {
  id: string;
  name?: string;
  fileName?: string;
  type: "file" | "folder";
  fileType?: string;
  fileSize?: number;
  filePath?: string;
  parentId?: string | null;
  createdAt: string;
  updatedAt: string;
  webContentLink?: string;
  webViewLink?: string;
  // Modal-specific fields
  size?: string; // Formatted size for display
  modified: string; // Formatted date for display
  content?: string; // File content for preview
  mimeType?: string; // MIME type for preview
}

export interface BreadcrumbItem {
  name: string;
  id: string | null;
}

export interface User {
  id: string;
  fullName: string;
  email: string;
  role: string;
  phoneNumber: string | null;
  createdAt: string;
  updatedAt: string;
}
