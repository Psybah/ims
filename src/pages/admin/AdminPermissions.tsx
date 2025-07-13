import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
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
  Shield,
  Search,
  Plus,
  MoreVertical,
  SlidersHorizontal,
  Lock,
  Unlock,
  Eye,
  Edit,
  Trash2
} from 'lucide-react';
import { AddPermissionModal } from '@/components/AddPermissionModal';
import { FilterModal } from '@/components/FilterModal';
import { ViewPermissionModal } from '@/components/ViewPermissionModal';
import { EditPermissionModal } from '@/components/EditPermissionModal';
import { ManageUsersModal } from '@/components/ManageUsersModal';
import { DeletePermissionDialog } from '@/components/DeletePermissionDialog';

// Types and interfaces
interface Permission {
  id: string;
  name: string;
  description: string;
  category: string;
  enabled: boolean;
  usersWithPermission: number;
  createdBy: string;
  lastModified: string;
}

interface FilterState {
  category?: string[];
  enabled?: boolean[];
}

// Mock data for demonstration
const mockPermissions = [
  {
    id: '1',
    name: 'File Upload',
    description: 'Allows users to upload new files to the system',
    category: 'File Management',
    enabled: true,
    usersWithPermission: 45,
    createdBy: 'Admin',
    lastModified: '2024-01-15'
  },
  {
    id: '2',
    name: 'File Download',
    description: 'Enables downloading of files from the system',
    category: 'File Management',
    enabled: true,
    usersWithPermission: 50,
    createdBy: 'Admin',
    lastModified: '2024-01-14'
  },
  {
    id: '3',
    name: 'Share Files',
    description: 'Permission to share files with other users',
    category: 'Collaboration',
    enabled: true,
    usersWithPermission: 35,
    createdBy: 'Admin',
    lastModified: '2024-01-13'
  },
  {
    id: '4',
    name: 'Delete Files',
    description: 'Ability to permanently delete files',
    category: 'File Management',
    enabled: false,
    usersWithPermission: 8,
    createdBy: 'Admin',
    lastModified: '2024-01-12'
  },
  {
    id: '5',
    name: 'View Analytics',
    description: 'Access to system analytics and reports',
    category: 'Administration',
    enabled: true,
    usersWithPermission: 12,
    createdBy: 'Admin',
    lastModified: '2024-01-11'
  },
];

const AdminPermissions = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [permissions, setPermissions] = useState<Permission[]>(mockPermissions);
  const [filters, setFilters] = useState<FilterState>({});
  
  // Modal states
  const [viewPermission, setViewPermission] = useState<Permission | null>(null);
  const [editPermission, setEditPermission] = useState<Permission | null>(null);
  const [manageUsersPermission, setManageUsersPermission] = useState<Permission | null>(null);
  const [deletePermission, setDeletePermission] = useState<Permission | null>(null);

  const handleAddPermission = (newPermission: Permission) => {
    setPermissions(prev => [newPermission, ...prev]);
  };

  const handleFilterApply = (newFilters: FilterState) => {
    setFilters(newFilters);
  };

  // Action handlers
  const handleViewPermission = (permission: Permission) => {
    setViewPermission(permission);
  };

  const handleEditPermission = (permission: Permission) => {
    setEditPermission(permission);
  };

  const handleManageUsers = (permission: Permission) => {
    setManageUsersPermission(permission);
  };

  const handleDeletePermission = (permission: Permission) => {
    setDeletePermission(permission);
  };

  // Modal handlers
  const handleEditSave = (updatedPermission: Permission) => {
    setPermissions(prev => 
      prev.map(p => p.id === updatedPermission.id ? updatedPermission : p)
    );
    setEditPermission(null);
  };

  const handleManageUsersSave = (permissionId: string, userIds: string[]) => {
    setPermissions(prev => 
      prev.map(p => 
        p.id === permissionId 
          ? { ...p, usersWithPermission: userIds.length }
          : p
      )
    );
    setManageUsersPermission(null);
  };

  const handleDeleteConfirm = (permissionId: string) => {
    setPermissions(prev => prev.filter(p => p.id !== permissionId));
    setDeletePermission(null);
  };

  const filteredPermissions = permissions.filter(permission => {
    const matchesSearch = permission.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         permission.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = !filters.category?.length || filters.category.includes(permission.category);
    const matchesEnabled = !filters.enabled?.length || filters.enabled.includes(permission.enabled);
    return matchesSearch && matchesCategory && matchesEnabled;
  });

  const togglePermission = (id: string) => {
    setPermissions(prev => 
      prev.map(permission => 
        permission.id === id 
          ? { ...permission, enabled: !permission.enabled }
          : permission
      )
    );
  };

  const getCategoryVariant = (category: string) => {
    switch (category) {
      case 'File Management':
        return 'default';
      case 'Collaboration':
        return 'secondary';
      case 'Administration':
        return 'destructive';
      default:
        return 'outline';
    }
  };

  const categoryCounts = permissions.reduce((acc, permission) => {
    acc[permission.category] = (acc[permission.category] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex flex-col space-y-3 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold">Permission Management</h1>
          <p className="text-sm sm:text-base text-muted-foreground">
            Configure and manage system permissions and access controls
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <AddPermissionModal onPermissionAdd={handleAddPermission} />
        </div>
      </div>

      <div className="grid gap-3 grid-cols-2 sm:gap-4 lg:grid-cols-4 lg:gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs sm:text-sm font-medium">Total Permissions</CardTitle>
            <Shield className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-xl sm:text-2xl font-bold">{permissions.length}</div>
            <p className="text-xs text-muted-foreground">
              System-wide permissions
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs sm:text-sm font-medium">Active</CardTitle>
            <Unlock className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-xl sm:text-2xl font-bold">
              {permissions.filter(p => p.enabled).length}
            </div>
            <p className="text-xs text-muted-foreground">
              Currently enabled
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs sm:text-sm font-medium">Disabled</CardTitle>
            <Lock className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-xl sm:text-2xl font-bold">
              {permissions.filter(p => !p.enabled).length}
            </div>
            <p className="text-xs text-muted-foreground">
              Temporarily disabled
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Categories</CardTitle>
            <SlidersHorizontal className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-xl sm:text-2xl font-bold">
              {Object.keys(categoryCounts).length}
            </div>
            <p className="text-xs text-muted-foreground">
              Permission groups
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col space-y-3 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
            <CardTitle className="text-lg sm:text-xl">Permission Settings</CardTitle>
            <div className="flex items-center space-x-2">
              <div className="relative flex-1 sm:flex-none">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search permissions..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8 w-full sm:w-64"
                />
              </div>
              <FilterModal type="permissions" onFilterApply={handleFilterApply} />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {/* Desktop Table View */}
          <div className="hidden lg:block">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Permission</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Users</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Last Modified</TableHead>
                <TableHead>Enabled</TableHead>
                <TableHead className="w-[50px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredPermissions.map((permission) => (
                <TableRow key={permission.id}>
                  <TableCell>
                    <div>
                      <div className="font-medium">{permission.name}</div>
                      <div className="text-sm text-muted-foreground">
                        {permission.description}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={getCategoryVariant(permission.category)}>
                      {permission.category}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm">
                      {permission.usersWithPermission} users
                    </span>
                  </TableCell>
                  <TableCell>
                    {permission.enabled ? (
                      <div className="flex items-center text-green-600">
                        <Unlock className="w-4 h-4 mr-1" />
                        Active
                      </div>
                    ) : (
                      <div className="flex items-center text-red-600">
                        <Lock className="w-4 h-4 mr-1" />
                        Disabled
                      </div>
                    )}
                  </TableCell>
                  <TableCell>{permission.lastModified}</TableCell>
                  <TableCell>
                    <Switch
                      checked={permission.enabled}
                      onCheckedChange={() => togglePermission(permission.id)}
                    />
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreVertical className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleViewPermission(permission)}>
                            <Eye className="w-4 h-4 mr-2" />
                            View Details
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleEditPermission(permission)}>
                            <Edit className="w-4 h-4 mr-2" />
                            Edit Permission
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleManageUsers(permission)}>
                            <Shield className="w-4 h-4 mr-2" />
                            Manage Users
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            className="text-destructive"
                            onClick={() => handleDeletePermission(permission)}
                          >
                            <Trash2 className="w-4 h-4 mr-2" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {/* Mobile Card View */}
          <div className="lg:hidden space-y-3">
            {filteredPermissions.map((permission) => (
              <Card key={permission.id} className="p-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2 mb-2">
                      <h3 className="font-medium text-sm truncate">{permission.name}</h3>
                      <Badge variant={getCategoryVariant(permission.category)} className="text-xs">
                        {permission.category}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground mb-3 line-clamp-2">
                      {permission.description}
                    </p>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <span className="text-xs text-muted-foreground">
                          {permission.usersWithPermission} users
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {permission.lastModified}
                        </span>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        {permission.enabled ? (
                          <div className="flex items-center text-green-600">
                            <Unlock className="w-3 h-3 mr-1" />
                            <span className="text-xs">Active</span>
                          </div>
                        ) : (
                          <div className="flex items-center text-red-600">
                            <Lock className="w-3 h-3 mr-1" />
                            <span className="text-xs">Disabled</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2 ml-2">
                    <Switch
                      checked={permission.enabled}
                      onCheckedChange={() => togglePermission(permission.id)}
                    />
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreVertical className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleViewPermission(permission)}>
                          <Eye className="w-4 h-4 mr-2" />
                          View Details
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleEditPermission(permission)}>
                          <Edit className="w-4 h-4 mr-2" />
                          Edit Permission
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleManageUsers(permission)}>
                          <Shield className="w-4 h-4 mr-2" />
                          Manage Users
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          className="text-destructive"
                          onClick={() => handleDeletePermission(permission)}
                        >
                          <Trash2 className="w-4 h-4 mr-2" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              </Card>
              ))}
          </div>
        </CardContent>
      </Card>

      {/* Modal Components */}
      <ViewPermissionModal
        permission={viewPermission}
        isOpen={!!viewPermission}
        onClose={() => setViewPermission(null)}
      />

      <EditPermissionModal
        permission={editPermission}
        isOpen={!!editPermission}
        onClose={() => setEditPermission(null)}
        onSave={handleEditSave}
      />

      <ManageUsersModal
        permission={manageUsersPermission}
        isOpen={!!manageUsersPermission}
        onClose={() => setManageUsersPermission(null)}
        onSave={handleManageUsersSave}
      />

      <DeletePermissionDialog
        permission={deletePermission}
        isOpen={!!deletePermission}
        onClose={() => setDeletePermission(null)}
        onConfirm={handleDeleteConfirm}
      />
    </div>
  );
};

export default AdminPermissions;