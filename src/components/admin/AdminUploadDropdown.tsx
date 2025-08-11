import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Upload, File, Folder } from 'lucide-react';
import { useAdminUpload } from '@/hooks/useAdminUpload';

export const AdminUploadDropdown: React.FC = () => {
  const { handleFileUpload, handleFolderUpload } = useAdminUpload();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button className="bg-primary hover:bg-primary/90">
          <Upload className="w-4 h-4 mr-2" />
          Upload
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        <DropdownMenuItem onClick={handleFileUpload} className="cursor-pointer">
          <File className="w-4 h-4 mr-2" />
          Upload Files
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleFolderUpload} className="cursor-pointer">
          <Folder className="w-4 h-4 mr-2" />
          Upload Folder
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}; 