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
  Filter,
  Lock,
  Unlock,
  Eye,
  Edit,
  Trash2
} from 'lucide-react';

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
  const [permissions, setPermissions] = useState(mockPermissions);

  const filteredPermissions = permissions.filter(permission =>
    permission.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    permission.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Permission Management</h1>
          <p className="text-muted-foreground">
            Configure and manage system permissions and access controls
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline">
            <Shield className="w-4 h-4 mr-2" />
            Bulk Update
          </Button>
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            Add Permission
          </Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Permissions</CardTitle>
            <Shield className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{permissions.length}</div>
            <p className="text-xs text-muted-foreground">
              System-wide permissions
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active</CardTitle>
            <Unlock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {permissions.filter(p => p.enabled).length}
            </div>
            <p className="text-xs text-muted-foreground">
              Currently enabled
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Disabled</CardTitle>
            <Lock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
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
            <Filter className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
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
          <div className="flex items-center justify-between">
            <CardTitle>Permission Settings</CardTitle>
            <div className="flex items-center space-x-2">
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search permissions..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8 w-64"
                />
              </div>
              <Button variant="outline" size="sm">
                <Filter className="w-4 h-4 mr-2" />
                Filter
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
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
                        <DropdownMenuItem>
                          <Eye className="w-4 h-4 mr-2" />
                          View Details
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Edit className="w-4 h-4 mr-2" />
                          Edit Permission
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Shield className="w-4 h-4 mr-2" />
                          Manage Users
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-destructive">
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
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminPermissions;