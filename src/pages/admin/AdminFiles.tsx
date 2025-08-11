import React, { useState } from "react";
import { FileList } from "@/components/FileList";
import { FileToolbar } from "@/components/FileToolbar";
import { FileSearchSort } from "@/components/FileSearchSort";
import { BreadcrumbNav } from "@/components/BreadcrumbNav";
import { FileViewModal } from "@/components/FileViewModal";
import { UploadProgress } from "@/components/UploadProgress";
import type { FileItem, BreadcrumbItem } from "@/lib/types";
import {
  useFoldersQuery,
  useFolderByIdQuery,
  useCreateFolderMutation,
  useUploadFileMutation,
  useUploadFolderMutation,
  useDeleteFileMutation,
} from "@/api/files";
import { useQueryClient } from "@tanstack/react-query";

const AdminFiles = () => {
  // State for navigation, search, sort, modals, uploads
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState<"name" | "modified" | "size">("name");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [currentFolder, setCurrentFolder] = useState<{
    id: string | null;
    name: string;
  } | null>(null);
  const [breadcrumbs, setBreadcrumbs] = useState<BreadcrumbItem[]>([
    { name: "Root", id: null },
  ]);
  const [selectedFile, setSelectedFile] = useState<FileItem | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [uploads, setUploads] = useState<any[]>([]);

  // Backend data
  const queryClient = useQueryClient();
  const { data: rootFolders, isLoading: loadingRoot } = useFoldersQuery();
  const { data: folderData, isLoading: loadingFolder } = useFolderByIdQuery(
    currentFolder?.id || ""
  );

  // Mutations
  const createFolderMutation = useCreateFolderMutation();
  const uploadFileMutation = useUploadFileMutation();
  const uploadFolderMutation = useUploadFolderMutation();
  const deleteFileMutation = useDeleteFileMutation();

  // Type guards for folderData
  const folderChildren: FileItem[] =
    folderData && Array.isArray((folderData as any).children)
      ? (folderData as any).children
      : [];
  const folderFiles: FileItem[] =
    folderData && Array.isArray((folderData as any).files)   
      ? (folderData as any).files
      : [];
  const folders: FileItem[] = currentFolder
    ? folderChildren
    : (rootFolders as FileItem[]) || [];
  const files: FileItem[] = currentFolder ? folderFiles : [];
  const items: FileItem[] = [...folders, ...files];

  // Search and sort logic
  const filteredItems = items.filter((item) => {
    if (item.name) {
      return item.name.toLowerCase().includes(searchTerm.toLowerCase());
    } else if (item.fileName) {
      return item.fileName.toLowerCase().includes(searchTerm.toLowerCase());
    }
    return false;
  });

  const sortItems = (
    itemsToSort: FileItem[],
    sortByKey: "name" | "modified" | "size",
    sortOrderKey: "asc" | "desc"
  ) => {
    return [...itemsToSort].sort((a, b) => {
      if (sortByKey === "name") {
        const aName = a.name ? a.name : a.fileName ?? "";
        const bName = b.name ? b.name : b.fileName ?? "";

        return sortOrderKey === "asc"
          ? aName.localeCompare(bName)
          : bName.localeCompare(aName);
      } else if (sortByKey === "modified") {
        const dateA = new Date(a.updatedAt).getTime();
        const dateB = new Date(b.updatedAt).getTime();
        return sortOrderKey === "asc" ? dateA - dateB : dateB - dateA;
      } else if (sortByKey === "size") {
        const sizeA = a.fileSize || 0;
        const sizeB = b.fileSize || 0;
        return sortOrderKey === "asc" ? sizeA - sizeB : sizeB - sizeA;
      }
      return 0;
    });
  };

  const sortedItems = sortItems(filteredItems, sortBy, sortOrder);

  // Breadcrumb navigation
  const handleNavigate = (pathId: string) => {
    if (pathId === "/" || pathId === "") {
      setCurrentFolder(null);
      setBreadcrumbs([{ name: "Root", id: null }]);
    } else {
      const clickedIndex = breadcrumbs.findIndex((item) => item.id === pathId);
      if (clickedIndex !== -1) {
        setBreadcrumbs(breadcrumbs.slice(0, clickedIndex + 1));
        setCurrentFolder({ id: pathId, name: breadcrumbs[clickedIndex].name });
      }
    }
    setSearchTerm("");
  };

  // File/folder click
  const handleItemClick = (item: FileItem) => {
    if (item.type === "folder") {
      setCurrentFolder({ id: item.id, name: item.name });
      setBreadcrumbs([...breadcrumbs, { name: item.name, id: item.id }]);
    } else {
      setSelectedFile({
        ...item,
        size: item.fileSize
          ? `${(item.fileSize / 1024).toFixed(2)} KB`
          : undefined,
        modified: item.updatedAt || "",
      });
      setIsModalOpen(true);
    }
  };

  // Download handler
  const handleDownload = (item: FileItem) => {
    if (item.webContentLink) {
      window.open(item.webContentLink, "_blank");
    }
  };

  // Sort handler
  const handleSort = (field: string) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(field as "name" | "modified" | "size");
      setSortOrder("asc");
    }
  };

  // Upload handlers
  const addUpload = (file: any) => {
    const id = `upload-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    setUploads((prev) => [
      ...prev,
      {
        id,
        name: file.name,
        size: file.size || 0,
        progress: 0,
        status: "uploading",
      },
    ]);
    return id;
  };

  const updateUpload = (
    id: string,
    progress: number,
    status = "uploading",
    error?: string
  ) => {
    setUploads((prev) =>
      prev.map((upload) =>
        upload.id === id
          ? { ...upload, progress, status, error }
          : upload
      )
    );
  };

  const removeUpload = (id: string) => {
    setUploads((prev) => prev.filter((upload) => upload.id !== id));
  };

  const handleCancelUpload = (uploadId: string) => {
    // Cancel upload logic here
    removeUpload(uploadId);
  };

  const handleDismissUpload = (uploadId: string) => {
    removeUpload(uploadId);
  };

  // File upload handler
  const handleUpload = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.multiple = true;
    input.onchange = async (e) => {
      const files = (e.target as HTMLInputElement).files;
      if (files) {
        for (const file of Array.from(files)) {
          const uploadId = addUpload(file);
          try {
            await uploadFileMutation.mutateAsync({
              file,
              parentId: currentFolder ? currentFolder.id : undefined,
              onUploadProgress(event: ProgressEvent) {
                const percent = event.total
                  ? Math.round((event.loaded / event.total) * 100)
                  : 0;
                updateUpload(uploadId, percent);
              },
            });
            updateUpload(uploadId, 100, "completed");
            
            // Invalidate and refetch queries to show new files
            if (currentFolder) {
              queryClient.invalidateQueries({ queryKey: ["folder", currentFolder.id] });
            } else {
              queryClient.invalidateQueries({ queryKey: ["folders"] });
            }
            
            setTimeout(() => removeUpload(uploadId), 2000);
          } catch (error) {
            updateUpload(uploadId, 0, "error", "Upload failed");
          }
        }
      }
    };
    input.click();
  };

  const handleUploadFolder = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.multiple = true;
    input.webkitdirectory = true;
    input.onchange = async (e) => {
      const selectedFolder = {
        name:
          (e.target as HTMLInputElement).files?.[0]?.webkitRelativePath?.split(
            "/"
          )[0] || "",
        files: (e.target as HTMLInputElement).files,
      };

      const uploadId = addUpload({ name: selectedFolder.name });

      try {
        await uploadFolderMutation.mutateAsync({
          files: selectedFolder.files,
          selectedFolder,
          parentId: currentFolder ? currentFolder.id : undefined,
          onUploadProgress(event: ProgressEvent) {
            const percent = event.total
              ? Math.round((event.loaded / event.total) * 100)
              : 0;
            updateUpload(uploadId, percent);
          },
        });

        updateUpload(uploadId, 100, "completed");

        // Invalidate and refetch queries to show new files
        if (currentFolder) {
          queryClient.invalidateQueries({ queryKey: ["folder", currentFolder.id] });
        } else {
          queryClient.invalidateQueries({ queryKey: ["folders"] });
        }
        
        setTimeout(() => removeUpload(uploadId), 2000);
      } catch (err) {
        updateUpload(uploadId, 0, "error", "Upload failed");
      }
    };
    input.click();
  };

  // New folder handler
  const handleNewFolder = async () => {
    const folderName = prompt("Enter folder name:");
    if (folderName) {
      try {
        await createFolderMutation.mutateAsync({
          folderName,
          parentId: currentFolder ? currentFolder.id : undefined,
        });
        
        // Invalidate and refetch queries to show new folder
        if (currentFolder) {
          queryClient.invalidateQueries({ queryKey: ["folder", currentFolder.id] });
        } else {
          queryClient.invalidateQueries({ queryKey: ["folders"] });
        }
      } catch (error) {
        console.error("Failed to create folder:", error);
      }
    }
  };

  // Starred handler
  const handleStarred = () => {
    // Implement starred functionality
  };

  return (
    <div className="space-y-4">
      {/* Upload buttons at the top - full width on mobile, top right on desktop */}
      <div className="w-full sm:flex sm:justify-end">
        <FileToolbar
          onUpload={handleUpload}
          onUploadFolder={handleUploadFolder}
          onNewFolder={handleNewFolder}      
          onStarred={handleStarred}
        />
      </div>

      {/* Breadcrumb navigation below upload buttons */}
      <BreadcrumbNav
        items={breadcrumbs}
        onNavigate={handleNavigate}
      />

      <FileSearchSort
        searchTerm={searchTerm}
        onSearch={setSearchTerm}
        sortBy={sortBy}
        sortOrder={sortOrder}
        onSort={handleSort}
      />
      {loadingRoot || loadingFolder ? (      
        <div>Loading...</div>
      ) : (
        <FileList
          items={sortedItems}
          onItemClick={handleItemClick}
          onDownload={handleDownload}
          sortBy={sortBy}
          sortOrder={sortOrder}
          onSort={handleSort}
        />
      )}
      <FileViewModal
        file={selectedFile}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onDownload={handleDownload}
        onEdit={() => {}}
        onDelete={() => {}}
      />
      <UploadProgress
        uploads={uploads}
        onCancel={handleCancelUpload}
        onDismiss={handleDismissUpload}
      />
    </div>
  );
};

export default AdminFiles;
