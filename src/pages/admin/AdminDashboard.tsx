import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { 
  Users, 
  Files, 
  HardDrive, 
  Activity, 
  Upload, 
  Download, 
  Eye, 
  TrendingUp,
  AlertTriangle,
  Clock,
  ChevronDown,
  FolderPlus
} from 'lucide-react';
import { UploadProgress } from '@/components/UploadProgress';
import { useToast } from '@/hooks/use-toast';
import { useFileStorage } from '@/hooks/useFileStorage';
import { useNavigate } from 'react-router-dom';

// Upload progress type
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

const AdminDashboard: React.FC = () => {
  const [uploads, setUploads] = useState<UploadItem[]>([]);
  const { toast } = useToast();
  const { addFile } = useFileStorage();
  const navigate = useNavigate();

  const handleUpload = () => {
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

  const stats = [
    {
      title: 'Total Users',
      value: '1,234',
      change: '+12%',
      icon: Users,
      color: 'text-blue-600'
    },
    {
      title: 'Total Files',
      value: '45,678',
      change: '+8%',
      icon: Files,
      color: 'text-green-600'
    },
    {
      title: 'Storage Used',
      value: '234 GB',
      change: '+15%',
      icon: HardDrive,
      color: 'text-orange-600'
    },
    {
      title: 'Active Sessions',
      value: '89',
      change: '+3%',
      icon: Activity,
      color: 'text-purple-600'
    }
  ];

  const recentActivity = [
    {
      user: 'Amina Yusuf',
      action: 'uploaded',
      file: 'quarterly-report.pdf',
      time: '2 minutes ago',
      type: 'upload'
    },
    {
      user: 'Chinedu Emeka',
      action: 'downloaded',
      file: 'client-presentation.pptx',
      time: '5 minutes ago',
      type: 'download'
    },
    {
      user: 'Adebayo Okonkwo',
      action: 'viewed',
      file: 'project-timeline.xlsx',
      time: '8 minutes ago',
      type: 'view'
    },
    {
      user: 'Kemi Adeleke',
      action: 'shared',
      file: 'design-assets.zip',
      time: '12 minutes ago',
      type: 'share'
    }
  ];

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'upload': return <Upload className="w-3 h-3 sm:w-4 sm:h-4 text-green-600" />;
      case 'download': return <Download className="w-3 h-3 sm:w-4 sm:h-4 text-blue-600" />;
      case 'view': return <Eye className="w-3 h-3 sm:w-4 sm:h-4 text-gray-600" />;
      case 'share': return <Users className="w-3 h-3 sm:w-4 sm:h-4 text-purple-600" />;
      default: return <Activity className="w-3 h-3 sm:w-4 sm:h-4" />;
    }
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-foreground">Admin Dashboard</h1>
          <p className="text-sm text-muted-foreground hidden sm:block">
            Overview of your file management system
          </p>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button className="bg-gradient-primary self-start sm:self-auto">
              <Upload className="w-3 h-3 sm:w-4 sm:h-4 mr-2" />
              <span className="text-sm sm:text-base">Upload</span>
              <ChevronDown className="w-3 h-3 sm:w-4 sm:h-4 ml-2" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={handleUpload}>
          <Upload className="w-4 h-4 mr-2" />
          Upload Files
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleFolderUpload}>
              <FolderPlus className="w-4 h-4 mr-2" />
              Upload Folders
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Upload Progress */}
      {uploads.length > 0 && (
        <UploadProgress
          uploads={uploads}
          onCancel={handleCancelUpload}
          onDismiss={handleDismissUpload}
        />
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
        {stats.map((stat, index) => (
          <Card key={index} className="shadow-md border-0">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-1 sm:pb-2">
              <CardTitle className="text-xs sm:text-sm font-medium text-muted-foreground">
                {stat.title}
              </CardTitle>
              <stat.icon className={`h-4 w-4 sm:h-5 sm:w-5 ${stat.color}`} />
            </CardHeader>
            <CardContent className="pt-1 sm:pt-0">
              <div className="text-lg sm:text-2xl font-bold text-foreground">{stat.value}</div>
              <div className="flex items-center text-xs text-muted-foreground">
                <TrendingUp className="w-2 h-2 sm:w-3 sm:h-3 mr-1 text-green-600" />
                <span className="text-green-600">{stat.change}</span>
                <span className="ml-1 hidden sm:inline">from last month</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        {/* Recent Activity */}
        <Card className="shadow-md border-0">
          <CardHeader className="pb-3 sm:pb-6">
            <CardTitle className="flex items-center text-base sm:text-lg">
              <Activity className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
              Recent Activity
            </CardTitle>
            <CardDescription className="text-xs sm:text-sm hidden sm:block">
              Latest file operations by users
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="space-y-3 sm:space-y-4">
              {recentActivity.map((activity, index) => (
                <div key={index} className="flex items-center space-x-3 p-2 sm:p-3 rounded-lg bg-muted/50">
                  <div className="flex-shrink-0">
                    {getActivityIcon(activity.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs sm:text-sm font-medium text-foreground">
                      <span className="font-semibold">{activity.user}</span>{' '}
                      {activity.action}{' '}
                      <span className="font-medium truncate">{activity.file}</span>
                    </p>
                    <div className="flex items-center text-xs text-muted-foreground">
                      <Clock className="w-2 h-2 sm:w-3 sm:h-3 mr-1" />
                      {activity.time}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* System Alerts */}
        <Card className="shadow-md border-0">
          <CardHeader className="pb-3 sm:pb-6">
            <CardTitle className="flex items-center text-base sm:text-lg">
              <AlertTriangle className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
              System Alerts
            </CardTitle>
            <CardDescription className="text-xs sm:text-sm hidden sm:block">
              Important notifications and warnings
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="space-y-3 sm:space-y-4">
              <div className="flex items-start space-x-2 sm:space-x-3 p-2 sm:p-3 rounded-lg bg-warning/10 border border-warning/20">
                <AlertTriangle className="w-3 h-3 sm:w-4 sm:h-4 text-warning mt-0.5" />
                <div className="min-w-0 flex-1">
                  <p className="text-xs sm:text-sm font-medium text-foreground">Storage Limit Warning</p>
                  <p className="text-xs text-muted-foreground">
                    You're using 85% of your storage quota
                  </p>
                  <Badge variant="outline" className="mt-1 sm:mt-2 text-xs">
                    Action Required
                  </Badge>
                </div>
              </div>

              <div className="flex items-start space-x-2 sm:space-x-3 p-2 sm:p-3 rounded-lg bg-destructive/10 border border-destructive/20">
                <AlertTriangle className="w-3 h-3 sm:w-4 sm:h-4 text-destructive mt-0.5" />
                <div className="min-w-0 flex-1">
                  <p className="text-xs sm:text-sm font-medium text-foreground">Failed Backup</p>
                  <p className="text-xs text-muted-foreground">
                    Last backup failed on March 15, 2024
                  </p>
                  <Badge variant="destructive" className="mt-1 sm:mt-2 text-xs">
                    Critical
                  </Badge>
                </div>
              </div>

              <div className="flex items-start space-x-2 sm:space-x-3 p-2 sm:p-3 rounded-lg bg-success/10 border border-success/20">
                <Activity className="w-3 h-3 sm:w-4 sm:h-4 text-success mt-0.5" />
                <div className="min-w-0 flex-1">
                  <p className="text-xs sm:text-sm font-medium text-foreground">System Update</p>
                  <p className="text-xs text-muted-foreground">
                    Security update completed successfully
                  </p>
                  <Badge variant="outline" className="mt-1 sm:mt-2 text-xs border-success text-success">
                    Completed
                  </Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboard;