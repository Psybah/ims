import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { useFileStorage } from '@/hooks/useFileStorage';

interface UploadItem {
  id: string;
  name: string;
  size: number;
  progress: number;
  status: 'uploading' | 'completed' | 'error';
}

// Nigerian names for admin users
const adminUsers = [
  { name: 'Adebayo Okonkwo', avatar: 'AO' },
  { name: 'Chinedu Emeka', avatar: 'CE' },
  { name: 'Amina Yusuf', avatar: 'AY' },
];

const getRandomUser = () => adminUsers[Math.floor(Math.random() * adminUsers.length)];

export const useAdminUpload = () => {
  const [uploads, setUploads] = useState<UploadItem[]>([]);
  const { toast } = useToast();
  const { addFile } = useFileStorage();
  const navigate = useNavigate();

  const handleFileUpload = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.multiple = true;
    input.accept = '*/*';
    
    input.onchange = (e) => {
      const uploadedFiles = Array.from((e.target as HTMLInputElement).files || []);
      if (uploadedFiles.length > 0) {
        const user = getRandomUser();
        
        uploadedFiles.forEach(file => {
          const uploadId = `upload-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
          
          // Add to upload progress
          setUploads(prev => [...prev, {
            id: uploadId,
            name: file.name,
            size: file.size,
            progress: 0,
            status: 'uploading'
          }]);
          
          // Read file content
          const reader = new FileReader();
          reader.onload = (e) => {
            const fileContent = e.target?.result as string;
            
            // Simulate upload progress
            let progress = 0;
            const interval = setInterval(() => {
              progress += Math.random() * 15;
              if (progress >= 100) {
                progress = 100;
                clearInterval(interval);
                
                // Complete upload
                setUploads(prev => prev.map(upload => 
                  upload.id === uploadId 
                    ? { ...upload, progress: 100, status: 'completed' as const }
                    : upload
                ));
                
                // Add file to storage
                const fileExtension = file.name.split('.').pop()?.toLowerCase() || '';
                let fileType = 'Document';
                
                if (['jpg', 'jpeg', 'png', 'gif', 'bmp'].includes(fileExtension)) {
                  fileType = 'Image';
                } else if (['pdf'].includes(fileExtension)) {
                  fileType = 'PDF Document';
                } else if (['doc', 'docx'].includes(fileExtension)) {
                  fileType = 'Word Document';
                } else if (['xls', 'xlsx'].includes(fileExtension)) {
                  fileType = 'Excel Spreadsheet';
                } else if (['ppt', 'pptx'].includes(fileExtension)) {
                  fileType = 'PowerPoint Presentation';
                }
                
                addFile({
                  name: file.name,
                  type: 'file',
                  size: `${(file.size / 1024 / 1024).toFixed(2)} MB`,
                  fileType,
                  parentPath: '',
                  owner: user.name,
                  avatar: user.avatar,
                  content: fileContent,
                  mimeType: file.type,
                });
              
              // Auto-dismiss completed uploads after 3 seconds
              setTimeout(() => {
                setUploads(prev => prev.filter(upload => upload.id !== uploadId));
              }, 3000);
            } else {
              setUploads(prev => prev.map(upload => 
                upload.id === uploadId 
                  ? { ...upload, progress: Math.floor(progress) }
                  : upload
              ));
            }
          }, 200);
          };
          
          reader.onerror = () => {
            setUploads(prev => prev.map(upload => 
              upload.id === uploadId 
                ? { ...upload, status: 'error' as const, error: 'Failed to read file' }
                : upload
            ));
          };
          
          reader.readAsDataURL(file);
        });
        
        toast({
          title: "Upload started",
          description: `Uploading ${uploadedFiles.length} file(s)...`,
        });

        // Navigate to files page after starting upload
        setTimeout(() => {
          navigate('/admin/files');
        }, 1000);
      }
    };
    
    input.click();
  };

  const handleFolderUpload = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.webkitdirectory = true;
    input.multiple = true;
    
    input.onchange = (e) => {
      const uploadedFiles = Array.from((e.target as HTMLInputElement).files || []);
      if (uploadedFiles.length > 0) {
        const user = getRandomUser();
        
        // Track created folders to avoid duplicates
        const createdFolders = new Set<string>();
        
        uploadedFiles.forEach(file => {
          const relativePath = file.webkitRelativePath || file.name;
          const pathParts = relativePath.split('/');
          
          // Create folder structure
          let currentFolderPath = '';
          for (let i = 0; i < pathParts.length - 1; i++) {
            const folderName = pathParts[i];
            const nextFolderPath = currentFolderPath ? `${currentFolderPath}/${folderName}` : folderName;
            
            if (!createdFolders.has(nextFolderPath)) {
              createdFolders.add(nextFolderPath);
              
              // Add folder to storage
              addFile({
                name: folderName,
                type: 'folder',
                size: '-',
                fileType: 'Folder',
                parentPath: currentFolderPath,
                owner: user.name,
                avatar: user.avatar,
              });
            }
            
            currentFolderPath = nextFolderPath;
          }
        });
        
        // Upload files
        uploadedFiles.forEach(file => {
          const uploadId = `upload-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
          const relativePath = file.webkitRelativePath || file.name;
          const pathParts = relativePath.split('/');
          const fileName = pathParts[pathParts.length - 1];
          
          // Determine the correct parent path for the file
          let parentFolderPath = '';
          for (let i = 0; i < pathParts.length - 1; i++) {
            const folderName = pathParts[i];
            parentFolderPath = parentFolderPath ? `${parentFolderPath}/${folderName}` : folderName;
          }
          
          // Add to upload progress
          setUploads(prev => [...prev, {
            id: uploadId,
            name: fileName,
            size: file.size,
            progress: 0,
            status: 'uploading'
          }]);
          
          // Read file content
          const reader = new FileReader();
          reader.onload = (e) => {
            const fileContent = e.target?.result as string;
            
            // Simulate upload progress
            let progress = 0;
            const interval = setInterval(() => {
              progress += Math.random() * 15;
              if (progress >= 100) {
                progress = 100;
                clearInterval(interval);
                
                // Complete upload
                setUploads(prev => prev.map(upload => 
                  upload.id === uploadId 
                    ? { ...upload, progress: 100, status: 'completed' as const }
                    : upload
                ));
                
                // Add file to storage
                const fileExtension = fileName.split('.').pop()?.toLowerCase() || '';
                let fileType = 'Document';
                
                if (['jpg', 'jpeg', 'png', 'gif', 'bmp'].includes(fileExtension)) {
                  fileType = 'Image';
                } else if (['pdf'].includes(fileExtension)) {
                  fileType = 'PDF Document';
                } else if (['doc', 'docx'].includes(fileExtension)) {
                  fileType = 'Word Document';
                } else if (['xls', 'xlsx'].includes(fileExtension)) {
                  fileType = 'Excel Spreadsheet';
                } else if (['ppt', 'pptx'].includes(fileExtension)) {
                  fileType = 'PowerPoint Presentation';
                }
                
                addFile({
                  name: fileName,
                  type: 'file',
                  size: `${(file.size / 1024 / 1024).toFixed(2)} MB`,
                  fileType,
                  parentPath: parentFolderPath,
                  owner: user.name,
                  avatar: user.avatar,
                  content: fileContent,
                  mimeType: file.type,
                });
              
              // Auto-dismiss completed uploads after 3 seconds
              setTimeout(() => {
                setUploads(prev => prev.filter(upload => upload.id !== uploadId));
              }, 3000);
            } else {
              setUploads(prev => prev.map(upload => 
                upload.id === uploadId 
                  ? { ...upload, progress: Math.floor(progress) }
                  : upload
              ));
            }
          }, 200);
          };
          
          reader.onerror = () => {
            setUploads(prev => prev.map(upload => 
              upload.id === uploadId 
                ? { ...upload, status: 'error' as const, error: 'Failed to read file' }
                : upload
            ));
          };
          
          reader.readAsDataURL(file);
        });
        
        const totalFolders = createdFolders.size;
        toast({
          title: "Folder upload started",
          description: `Uploading ${uploadedFiles.length} file(s) in ${totalFolders} folder(s)...`,
        });

        // Navigate to files page after starting upload
        setTimeout(() => {
          navigate('/admin/files');
        }, 1000);
      }
    };
    
    input.click();
  };

  const handleCancelUpload = (uploadId: string) => {
    setUploads(prev => prev.filter(upload => upload.id !== uploadId));
  };

  const handleDismissUpload = (uploadId: string) => {
    setUploads(prev => prev.filter(upload => upload.id !== uploadId));
  };

  return {
    uploads,
    handleFileUpload,
    handleFolderUpload,
    handleCancelUpload,
    handleDismissUpload,
  };
}; 