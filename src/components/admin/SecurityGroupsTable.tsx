import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
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
  MoreVertical,
  Users,
  Edit,
  Trash2,
  UserPlus,
  UserMinus,
  Calendar
} from 'lucide-react';
import { useSecurityGroupsQuery } from '@/api/admin';
import { formatDistanceToNow } from 'date-fns';

interface SecurityGroup {
  id: string;
  name: string;
  description: string;
  createdAt: string;
  updatedAt: string;
  members: any[];
  acls: any[];
}

interface SecurityGroupsTableProps {
  onEditGroup?: (group: SecurityGroup) => void;
  onDeleteGroup?: (group: SecurityGroup) => void;
  onManageUsers?: (group: SecurityGroup) => void;
}

export const SecurityGroupsTable: React.FC<SecurityGroupsTableProps> = ({
  onEditGroup,
  onDeleteGroup,
  onManageUsers
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const { data: securityGroups = [], isLoading, error } = useSecurityGroupsQuery();

  const filteredGroups = securityGroups.filter(group =>
    group.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    group.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Shield className="w-5 h-5 mr-2" />
            Security Groups
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center space-x-4 p-4 border rounded-lg animate-pulse">
                <div className="w-10 h-10 bg-muted rounded-full"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-muted rounded w-1/4"></div>
                  <div className="h-3 bg-muted rounded w-1/2"></div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Shield className="w-5 h-5 mr-2" />
            Security Groups
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            Failed to load security groups
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col space-y-3 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
          <div>
            <CardTitle className="flex items-center text-lg">
              <Shield className="w-5 h-5 mr-2" />
              Security Groups
            </CardTitle>
            <p className="text-sm text-muted-foreground mt-1">
              Manage access control groups and their members
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="Search groups..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9 w-full sm:w-64"
              />
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {filteredGroups.length === 0 ? (
          <div className="text-center py-8">
            <Shield className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">No Security Groups Found</h3>
            <p className="text-muted-foreground mb-4">
              {searchTerm 
                ? `No groups match "${searchTerm}"`
                : 'Create your first security group to organize users and permissions'
              }
            </p>
          </div>
        ) : (
          <>
            {/* Desktop Table View */}
            <div className="hidden md:block">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Group Name</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Members</TableHead>
                    <TableHead>Permissions</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead className="w-16"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredGroups.map((group) => (
                    <TableRow key={group.id}>
                      <TableCell>
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                            <Shield className="w-4 h-4 text-purple-600" />
                          </div>
                          <div>
                            <p className="font-medium">{group.name}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <p className="text-sm text-muted-foreground max-w-xs truncate">
                          {group.description || 'No description'}
                        </p>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                          <Users className="w-3 h-3 mr-1" />
                          {group.members?.length || 0}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                          {group.acls?.length || 0} ACLs
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center text-sm text-muted-foreground">
                          <Calendar className="w-3 h-3 mr-1" />
                          {formatDistanceToNow(new Date(group.createdAt), { addSuffix: true })}
                        </div>
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreVertical className="w-4 h-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => onManageUsers?.(group)}>
                              <UserPlus className="w-4 h-4 mr-2" />
                              Manage Users
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => onEditGroup?.(group)}>
                              <Edit className="w-4 h-4 mr-2" />
                              Edit Group
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                              onClick={() => onDeleteGroup?.(group)}
                              className="text-red-600"
                            >
                              <Trash2 className="w-4 h-4 mr-2" />
                              Delete Group
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
            <div className="md:hidden space-y-4">
              {filteredGroups.map((group) => (
                <Card key={group.id} className="border border-border">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center space-x-3 flex-1">
                        <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                          <Shield className="w-5 h-5 text-purple-600" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-medium text-sm truncate">{group.name}</h3>
                          <p className="text-xs text-muted-foreground truncate">
                            {group.description || 'No description'}
                          </p>
                          <div className="flex items-center space-x-4 mt-2">
                            <Badge variant="outline" className="text-xs bg-blue-50 text-blue-700 border-blue-200">
                              <Users className="w-3 h-3 mr-1" />
                              {group.members?.length || 0}
                            </Badge>
                            <Badge variant="outline" className="text-xs bg-green-50 text-green-700 border-green-200">
                              {group.acls?.length || 0} ACLs
                            </Badge>
                          </div>
                          <div className="flex items-center text-xs text-muted-foreground mt-1">
                            <Calendar className="w-3 h-3 mr-1" />
                            Created {formatDistanceToNow(new Date(group.createdAt), { addSuffix: true })}
                          </div>
                        </div>
                      </div>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="flex-shrink-0">
                            <MoreVertical className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => onManageUsers?.(group)}>
                            <UserPlus className="w-4 h-4 mr-2" />
                            Manage Users
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => onEditGroup?.(group)}>
                            <Edit className="w-4 h-4 mr-2" />
                            Edit Group
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            onClick={() => onDeleteGroup?.(group)}
                            className="text-red-600"
                          >
                            <Trash2 className="w-4 h-4 mr-2" />
                            Delete Group
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
};


