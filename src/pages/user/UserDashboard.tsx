import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Files, 
  Upload, 
  Download, 
  Share2, 
  Clock, 
  Star,
  FolderOpen,
  Image,
  FileText,
  Video
} from 'lucide-react';

const UserDashboard: React.FC = () => {
  const stats = [
    {
      title: 'My Files',
      value: '156',
      description: 'Total files uploaded',
      icon: Files,
      color: 'text-blue-600'
    },
    {
      title: 'Storage Used',
      value: '2.4 GB',
      description: 'of 10 GB available',
      icon: FolderOpen,
      color: 'text-green-600'
    },
    {
      title: 'Starred Files',
      value: '8',
      description: 'Your favorite files',
      icon: Star,
      color: 'text-purple-600'
    }
  ];

  const recentFiles = [
    {
      name: 'Lagos_Business_Proposal.pdf',
      type: 'pdf',
      size: '2.4 MB',
      modified: '2 hours ago'
    },
    {
      name: 'Abuja_Conference_Photo.jpg',
      type: 'image',
      size: '1.8 MB',
      modified: '5 hours ago'
    },
    {
      name: 'Kano_Meeting_Notes.docx',
      type: 'document',
      size: '156 KB',
      modified: '1 day ago'
    },
    {
      name: 'Port_Harcourt_Presentation.mp4',
      type: 'video',
      size: '45 MB',
      modified: '2 days ago'
    }
  ];

  const getFileIcon = (type: string) => {
    switch (type) {
      case 'pdf': return <FileText className="w-5 h-5 text-file-pdf" />;
      case 'image': return <Image className="w-5 h-5 text-file-img" />;
      case 'video': return <Video className="w-5 h-5 text-file-video" />;
      case 'document': return <FileText className="w-5 h-5 text-file-doc" />;
      default: return <Files className="w-5 h-5" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">My Workspace</h1>
          <p className="text-muted-foreground">
            Access and manage your files
          </p>
        </div>
        <div className="flex space-x-3">
          <Button variant="outline" onClick={() => {
            const input = document.createElement('input');
            input.type = 'file';
            input.webkitdirectory = true;
            input.multiple = true;
            input.onchange = (e) => {
              const files = Array.from((e.target as HTMLInputElement).files || []);
              if (files.length > 0) {
                alert(`Folder with ${files.length} file(s) selected for upload.`);
              }
            };
            input.click();
          }}>
            <Download className="w-4 h-4 mr-2" />
            Upload Folder
          </Button>
          <Button className="bg-gradient-primary" onClick={() => {
            const input = document.createElement('input');
            input.type = 'file';
            input.multiple = true;
            input.accept = '*/*';
            input.onchange = (e) => {
              const files = Array.from((e.target as HTMLInputElement).files || []);
              if (files.length > 0) {
                alert(`${files.length} file(s) selected for upload.`);
              }
            };
            input.click();
          }}>
            <Upload className="w-4 h-4 mr-2" />
            Upload Files
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat, index) => (
          <Card key={index} className="shadow-md border-0">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.title}
              </CardTitle>
              <stat.icon className={`h-5 w-5 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">{stat.value}</div>
              <p className="text-xs text-muted-foreground">{stat.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Files */}
        <Card className="lg:col-span-2 shadow-md border-0">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Clock className="w-5 h-5 mr-2" />
              Recent Files
            </CardTitle>
            <CardDescription>
              Files you've worked with recently
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentFiles.map((file, index) => (
                <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors cursor-pointer">
                  <div className="flex items-center space-x-3">
                    {getFileIcon(file.type)}
                    <div>
                      <p className="text-sm font-medium text-foreground">{file.name}</p>
                      <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                        <span>{file.size}</span>
                        <span>•</span>
                        <span>{file.modified}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button variant="ghost" size="sm">
                      <Star className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card className="shadow-md border-0">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>
              Common file operations
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button 
              className="w-full justify-start bg-gradient-primary" 
              size="sm"
              onClick={() => {
                const input = document.createElement('input');
                input.type = 'file';
                input.multiple = true;
                input.accept = '*/*';
                input.onchange = (e) => {
                  const files = Array.from((e.target as HTMLInputElement).files || []);
                  if (files.length > 0) {
                    alert(`${files.length} file(s) selected for upload.`);
                  }
                };
                input.click();
              }}
            >
              <Upload className="w-4 h-4 mr-2" />
              Upload New File
            </Button>
            <Button 
              variant="outline" 
              className="w-full justify-start" 
              size="sm"
              onClick={() => {
                const folderName = prompt('Enter folder name:');
                if (folderName && folderName.trim()) {
                  alert(`"${folderName}" folder created successfully.`);
                }
              }}
            >
              <FolderOpen className="w-4 h-4 mr-2" />
              Create Folder
            </Button>
            <Button 
              variant="outline" 
              className="w-full justify-start" 
              size="sm"
              onClick={() => alert('Showing your starred files.')}
            >
              <Star className="w-4 h-4 mr-2" />
              Starred Files
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Storage Usage */}
      <Card className="shadow-md border-0">
        <CardHeader>
          <CardTitle>Storage Usage</CardTitle>
          <CardDescription>
            Monitor your storage consumption
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Used Space</span>
              <span className="text-sm text-muted-foreground">2.4 GB of 10 GB</span>
            </div>
            <div className="w-full bg-muted rounded-full h-2">
              <div className="bg-gradient-primary h-2 rounded-full" style={{ width: '24%' }}></div>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-file-doc rounded-full"></div>
                <span>Documents: 1.2 GB</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-file-img rounded-full"></div>
                <span>Images: 800 MB</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-file-video rounded-full"></div>
                <span>Videos: 300 MB</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-file-audio rounded-full"></div>
                <span>Others: 100 MB</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default UserDashboard;