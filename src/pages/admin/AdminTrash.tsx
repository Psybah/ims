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
  Clock,
  Loader2
} from 'lucide-react';
import { FilterModal } from '@/components/FilterModal';
import { useToast } from '@/hooks/use-toast';
import { useTrashItemsQuery, useTrashAnalysisQuery, useRestoreTrashItemMutation } from '@/api/trash';
import { transformTrashItem, getRetentionStatus, formatFileSize } from '@/lib/trash-utils';

const AdminTrash = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({});
  const { toast } = useToast();

  // API Queries
  const { data: trashItems = [], isLoading: isLoadingTrash, error: trashError } = useTrashItemsQuery();
  const { data: analysis, isLoading: isLoadingAnalysis, error: analysisError } = useTrashAnalysisQuery();
  const restoreMutation = useRestoreTrashItemMutation();

  // Transform backend data to frontend format
  const transformedItems = trashItems.map(transformTrashItem);

  // Filter files based on search term
  const filteredFiles = transformedItems.filter(file =>
    file.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    file.deletedBy.toLowerCase().includes(searchTerm.toLowerCase()) ||
    file.originalPath.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Calculate analytics
  const totalFiles = transformedItems.length;
  const totalSize = transformedItems.reduce((acc, file) => {
    if (file.size !== 'Folder' && file.size !== 'Unknown') {
      const sizeInBytes = parseInt(file.size.split(' ')[0]) * 1024; // Rough conversion
      return acc + sizeInBytes;
    }
    return acc;
  }, 0);

  const restoreFile = async (id: string) => {
    const item = transformedItems.find(item => item.id === id);
    if (!item) return;

    try {
      await restoreMutation.mutateAsync({
        trashId: id,
        type: item.itemType,
        itemId: item.fileId || item.folderId || ''
      });
      
      toast({
        title: "File restored",
        description: `${item.name} has been restored successfully.`,
      });
    } catch (error) {
      toast({
        title: "Restore failed",
        description: "Failed to restore the file. Please try again.",
        variant: "destructive",
      });
    }
  };

  const permanentlyDelete = (id: string) => {
    // TODO: Implement permanent delete when backend endpoint is available
    toast({
      title: "Delete permanently",
      description: "Permanent delete functionality will be implemented when backend endpoint is available.",
      variant: "destructive",
    });
  };

  const emptyTrash = () => {
    // TODO: Implement empty trash when backend endpoint is available
    toast({
      title: "Empty trash",
      description: "Empty trash functionality will be implemented when backend endpoint is available.",
      variant: "destructive",
    });
  };

  if (trashError || analysisError) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <AlertTriangle className="h-12 w-12 text-destructive mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">Error loading trash data</h3>
          <p className="text-muted-foreground">Please try refreshing the page.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold">Trash Management</h1>
          <p className="text-muted-foreground">Manage deleted files and folders</p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            onClick={emptyTrash}
            className="text-destructive hover:text-destructive"
          >
            <Trash2 className="w-3 h-3 sm:w-4 sm:h-4 mr-2" />
            <span className="hidden sm:inline">Empty Trash</span>
          </Button>
        </div>
      </div>

      {/* Analytics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs sm:text-sm font-medium">Total Files</CardTitle>
            <Archive className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-xl sm:text-2xl font-bold">
              {isLoadingAnalysis ? <Loader2 className="h-6 w-6 animate-spin" /> : analysis?.totalItems || totalFiles}
            </div>
            <p className="text-xs text-muted-foreground">
              Files in trash
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs sm:text-sm font-medium">Freed Space</CardTitle>
            <Archive className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-xl sm:text-2xl font-bold">
              {isLoadingAnalysis ? <Loader2 className="h-6 w-6 animate-spin" /> : formatFileSize(analysis?.freedSpace || totalSize)}
            </div>
            <p className="text-xs text-muted-foreground">
              Space recovered
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
              {isLoadingTrash ? <Loader2 className="h-6 w-6 animate-spin" /> : 
                transformedItems.filter(f => f.retentionDays <= 7).length}
            </div>
            <p className="text-xs text-muted-foreground">
              Files expiring in 7 days
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
              <FilterModal type="trash" onFilterApply={(filters) => setFilters(filters)} />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {isLoadingTrash ? (
            <div className="flex items-center justify-center h-32">
              <Loader2 className="h-8 w-8 animate-spin" />
            </div>
          ) : (
            <>
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
                                <DropdownMenuItem 
                                  onClick={() => restoreFile(file.id)}
                                  disabled={restoreMutation.isPending}
                                >
                                  <RotateCcw className="w-4 h-4 mr-2" />
                                  {restoreMutation.isPending ? 'Restoring...' : 'Restore File'}
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
                              <DropdownMenuItem 
                                onClick={() => restoreFile(file.id)}
                                disabled={restoreMutation.isPending}
                              >
                                <RotateCcw className="w-4 h-4 mr-2" />
                                {restoreMutation.isPending ? 'Restoring...' : 'Restore File'}
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
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminTrash;