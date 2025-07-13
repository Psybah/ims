import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Trash2,
  Search,
  RotateCcw,
  MoreVertical,
  SlidersHorizontal,
  Archive,
  AlertTriangle,
  Clock
} from 'lucide-react';

// Mock data for demonstration
const mockTrashedFiles = [
  {
    id: '1',
    name: 'Old_Budget_2023.xlsx',
    type: 'Excel',
    size: '2.3 MB',
    deletedBy: 'John Doe',
    deletedDate: '2024-01-15',
    originalPath: '/finances/budgets/',
    retentionDays: 15,
    avatar: '/placeholder.svg'
  },
  {
    id: '2',
    name: 'Outdated_Presentation.pptx',
    type: 'PowerPoint',
    size: '8.1 MB',
    deletedBy: 'Jane Smith',
    deletedDate: '2024-01-12',
    originalPath: '/marketing/presentations/',
    retentionDays: 18,
    avatar: '/placeholder.svg'
  },
  {
    id: '3',
    name: 'Draft_Report.docx',
    type: 'Word',
    size: '1.7 MB',
    deletedBy: 'Mike Johnson',
    deletedDate: '2024-01-10',
    originalPath: '/reports/drafts/',
    retentionDays: 20,
    avatar: '/placeholder.svg'
  },
  {
    id: '4',
    name: 'Test_Images.zip',
    type: 'Archive',
    size: '15.2 MB',
    deletedBy: 'Sarah Wilson',
    deletedDate: '2024-01-08',
    originalPath: '/assets/test/',
    retentionDays: 22,
    avatar: '/placeholder.svg'
  },
];

const AdminTrash = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [trashedFiles, setTrashedFiles] = useState(mockTrashedFiles);

  const filteredFiles = trashedFiles.filter(file =>
    file.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    file.deletedBy.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const restoreFile = (id: string) => {
    setTrashedFiles(prev => prev.filter(file => file.id !== id));
    // Here you would typically make an API call to restore the file
  };

  const permanentlyDelete = (id: string) => {
    setTrashedFiles(prev => prev.filter(file => file.id !== id));
    // Here you would typically make an API call to permanently delete the file
  };

  const getRetentionStatus = (days: number) => {
    if (days <= 7) {
      return { variant: 'destructive' as const, text: `${days} days left`, urgent: true };
    } else if (days <= 14) {
      return { variant: 'secondary' as const, text: `${days} days left`, urgent: false };
    } else {
      return { variant: 'outline' as const, text: `${days} days left`, urgent: false };
    }
  };

  const totalSize = trashedFiles.reduce((acc, file) => {
    const size = parseFloat(file.size.split(' ')[0]);
    return acc + size;
  }, 0);

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex flex-col space-y-3 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold">Trash Management</h1>
          <p className="text-sm sm:text-base text-muted-foreground">
            Manage deleted files and handle permanent deletion
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm" className="flex-1 sm:flex-none">
            <Archive className="w-3 h-3 sm:w-4 sm:h-4 mr-2" />
            <span className="hidden sm:inline">Bulk Restore</span>
            <span className="sm:hidden">Restore</span>
          </Button>
          <Button variant="destructive" size="sm" className="flex-1 sm:flex-none">
            <Trash2 className="w-3 h-3 sm:w-4 sm:h-4 mr-2" />
            <span className="hidden sm:inline">Empty Trash</span>
            <span className="sm:hidden">Empty</span>
          </Button>
        </div>
      </div>

      <div className="grid gap-3 grid-cols-2 sm:gap-4 lg:grid-cols-4 lg:gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs sm:text-sm font-medium">Deleted Files</CardTitle>
            <Trash2 className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-xl sm:text-2xl font-bold">{trashedFiles.length}</div>
            <p className="text-xs text-muted-foreground">
              Awaiting permanent deletion
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs sm:text-sm font-medium">Storage Freed</CardTitle>
            <Archive className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-xl sm:text-2xl font-bold">{totalSize.toFixed(1)} MB</div>
            <p className="text-xs text-muted-foreground">
              Can be recovered
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs sm:text-sm font-medium">Expiring Soon</CardTitle>
            <AlertTriangle className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-xl sm:text-2xl font-bold">
              {trashedFiles.filter(f => f.retentionDays <= 7).length}
            </div>
            <p className="text-xs text-muted-foreground">
              ≤ 7 days remaining
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs sm:text-sm font-medium">Retention Period</CardTitle>
            <Clock className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-xl sm:text-2xl font-bold">30</div>
            <p className="text-xs text-muted-foreground">
              Days default retention
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col space-y-3 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
            <CardTitle className="text-lg sm:text-xl">Deleted Files</CardTitle>
            <div className="flex items-center space-x-2">
              <div className="relative flex-1 sm:flex-none">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search deleted files..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8 w-full sm:w-64"
                />
              </div>
              <Button variant="outline" size="sm">
                <SlidersHorizontal className="w-4 h-4 mr-2" />
                Filter
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {/* Desktop Table View */}
          <div className="hidden lg:block">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Size</TableHead>
                  <TableHead>Deleted By</TableHead>
                  <TableHead>Deleted Date</TableHead>
                  <TableHead>Original Path</TableHead>
                  <TableHead>Retention</TableHead>
                  <TableHead className="w-[50px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredFiles.map((file) => {
                  const retentionStatus = getRetentionStatus(file.retentionDays);
                  return (
                    <TableRow key={file.id}>
                      <TableCell className="font-medium">{file.name}</TableCell>
                      <TableCell>{file.type}</TableCell>
                      <TableCell>{file.size}</TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <Avatar className="h-6 w-6">
                            <AvatarImage src={file.avatar} />
                            <AvatarFallback>
                              {file.deletedBy.split(' ').map(n => n[0]).join('')}
                            </AvatarFallback>
                          </Avatar>
                          <span>{file.deletedBy}</span>
                        </div>
                      </TableCell>
                      <TableCell>{file.deletedDate}</TableCell>
                      <TableCell>
                        <span className="text-sm text-muted-foreground">
                          {file.originalPath}
                        </span>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <Badge variant={retentionStatus.variant}>
                            {retentionStatus.text}
                          </Badge>
                          {retentionStatus.urgent && (
                            <AlertTriangle className="w-4 h-4 text-destructive" />
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <MoreVertical className="w-4 h-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => restoreFile(file.id)}>
                              <RotateCcw className="w-4 h-4 mr-2" />
                              Restore File
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                              className="text-destructive"
                              onClick={() => permanentlyDelete(file.id)}
                            >
                              <Trash2 className="w-4 h-4 mr-2" />
                              Delete Permanently
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>

          {/* Mobile Card View */}
          <div className="lg:hidden space-y-3">
            {filteredFiles.map((file) => {
              const retentionStatus = getRetentionStatus(file.retentionDays);
              return (
                <Card key={file.id} className="p-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-medium text-sm truncate">{file.name}</h3>
                        <div className="flex items-center space-x-1">
                          <Badge variant={retentionStatus.variant} className="text-xs">
                            {retentionStatus.text}
                          </Badge>
                          {retentionStatus.urgent && (
                            <AlertTriangle className="w-3 h-3 text-destructive" />
                          )}
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-3 mb-2">
                        <span className="text-xs text-muted-foreground">{file.type}</span>
                        <span className="text-xs text-muted-foreground">{file.size}</span>
                      </div>
                      
                      <div className="flex items-center space-x-2 mb-2">
                        <Avatar className="h-5 w-5">
                          <AvatarImage src={file.avatar} />
                          <AvatarFallback className="text-xs">
                            {file.deletedBy.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        <span className="text-xs text-muted-foreground">{file.deletedBy}</span>
                        <span className="text-xs text-muted-foreground">•</span>
                        <span className="text-xs text-muted-foreground">{file.deletedDate}</span>
                      </div>
                      
                      <p className="text-xs text-muted-foreground truncate">
                        Path: {file.originalPath}
                      </p>
                    </div>
                    
                    <div className="ml-2">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreVertical className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => restoreFile(file.id)}>
                            <RotateCcw className="w-4 h-4 mr-2" />
                            Restore File
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            className="text-destructive"
                            onClick={() => permanentlyDelete(file.id)}
                          >
                            <Trash2 className="w-4 h-4 mr-2" />
                            Delete Permanently
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminTrash;