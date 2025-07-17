import { useState, useEffect } from 'react';
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
  Users,
  Search,
  UserPlus,
  MoreVertical,
  Filter,
  Shield,
  UserCheck,
  UserX,
  Mail
} from 'lucide-react';
import { EmptyState } from '@/components/EmptyState';
import { AddUserModal } from '@/components/AddUserModal';
import { EditUserModal } from '@/components/EditUserModal';
import { ChangeRoleModal } from '@/components/ChangeRoleModal';
import { FilterModal } from '@/components/FilterModal';
import { apiV1 } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';

interface User {
  id: string;
  fullName: string;
  email: string;
  role: string;
  phoneNumber: string | null;
  createdAt: string;
  updatedAt: string;
}

interface FilterState {
  status?: string[];
  role?: string[];
}

const AdminUsers = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isRoleModalOpen, setIsRoleModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [userToEdit, setUserToEdit] = useState<User | null>(null);
  const [filters, setFilters] = useState<FilterState>({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const { toast } = useToast();

  const fetchUsers = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await apiV1.get('/users');
      setUsers(response.data.data.users);
    } catch (err: any) {
      console.error("Failed to fetch users:", err);
      setError(err);
      setUsers([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleAddUser = (newUser: User) => {
    setUsers(prev => [...prev, newUser]);
    fetchUsers(); // Refresh list after adding user
  };

  const handleEditUser = (userId: string, updatedUser: Partial<User>) => {
    setUsers(prev => prev.map(user => 
      user.id === userId ? { ...user, ...updatedUser } : user
    ));
    fetchUsers(); // Refresh list after editing user
  };

  const handleChangeRole = (userId: string, newRole: string) => {
    setUsers(prev => prev.map(user => 
      user.id === userId ? { ...user, role: newRole } : user
    ));
    fetchUsers(); // Refresh list after changing role
  };

  const handleSuspendUser = (userId: string) => {
    // This functionality is not directly supported by the backend API as per backend-documentation.md
    // You might need to implement a separate API endpoint for this or handle it client-side if it's just a UI state.
    toast({
      title: "Action Not Supported",
      description: "Suspending/Activating users is not directly supported by the current API. Please implement a backend endpoint for this.",
      variant: "destructive",
    });
  };

  const handleFilterApply = (newFilters: FilterState) => {
    setFilters(newFilters);
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase());
    // The backend API does not provide a 'status' field for users, only 'role'.
    // Filtering by status will not work as expected with the current backend.
    const matchesStatus = true; // Assuming all users are 'Active' from backend perspective
    const matchesRole = !filters.role?.length || filters.role.includes(user.role);
    return matchesSearch && matchesStatus && matchesRole;
  });

  const getRoleVariant = (role: string) => {
    switch (role) {
      case 'SUPER_ADMIN':
        return 'destructive';
      case 'ADMIN':
        return 'default';
      case 'MEMBER':
        return 'secondary';
      default:
        return 'outline';
    }
  };

  // The backend API does not provide a 'status' field for users.
  // This function will always return 'default' for now.
  const getStatusVariant = (status: string) => {
    return 'default';
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex flex-col space-y-3 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold">User Management</h1>
          <p className="text-sm sm:text-base text-muted-foreground">
            Manage user accounts, roles, and permissions
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <AddUserModal onUserAdd={handleAddUser} />
        </div>
      </div>

      <div className="grid gap-3 grid-cols-2 sm:gap-4 lg:grid-cols-4 lg:gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs sm:text-sm font-medium">Total Users</CardTitle>
            <Users className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-xl sm:text-2xl font-bold">{users.length}</div>
            <p className="text-xs text-muted-foreground">
              Registered accounts
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs sm:text-sm font-medium">Active Users</CardTitle>
            <UserCheck className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-xl sm:text-2xl font-bold">
              {/* Assuming all fetched users are active as per backend API */}
              {users.length}
            </div>
            <p className="text-xs text-muted-foreground">
              100% of total (based on API data)
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs sm:text-sm font-medium">Admins</CardTitle>
            <Shield className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-xl sm:text-2xl font-bold">
              {users.filter(u => u.role === 'ADMIN' || u.role === 'SUPER_ADMIN').length}
            </div>
            <p className="text-xs text-muted-foreground">
              Administrative access
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs sm:text-sm font-medium">Members</CardTitle>
            <UserX className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-xl sm:text-2xl font-bold">
              {users.filter(u => u.role === 'MEMBER').length}
            </div>
            <p className="text-xs text-muted-foreground">
              Standard users
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col space-y-3 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
            <CardTitle className="text-lg sm:text-xl">All Users</CardTitle>
            <div className="flex items-center space-x-2">
              <div className="relative flex-1 sm:flex-none">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search users..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8 w-full sm:w-64"
                />
              </div>
              <FilterModal type="users" onFilterApply={handleFilterApply} />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading && <div className="p-4 text-center text-muted-foreground">Loading users...</div>}
          {error && <div className="p-4 text-center text-destructive">Error loading users: {error.message}</div>}
          {!isLoading && !error && filteredUsers.length === 0 && (
            <EmptyState
              icon={Users}
              title="No users found"
              description={
                searchTerm 
                  ? "No users match your search criteria. Try adjusting your search terms."
                  : "There are no users in the system yet. Add your first user to get started."
              }
              actionLabel={!searchTerm ? "Add User" : undefined}
              onAction={!searchTerm ? () => {
                // AddUserModal is embedded in the header, so we'll disable this action
                // Users can click the Add User button in the header instead
              } : undefined}
            />
          )}

          {/* Desktop Table View */}
          {!isLoading && !error && filteredUsers.length > 0 && (
            <div className="hidden lg:block">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>User</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Created At</TableHead>
                    <TableHead className="w-[50px]"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredUsers.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>
                      <div className="flex items-center space-x-3">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={user.avatar} />
                          <AvatarFallback>
                            {user.fullName.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium">{user.fullName}</div>
                          <div className="text-sm text-muted-foreground">{user.email}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={getRoleVariant(user.role)}>
                        {user.role}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant={getStatusVariant('Active')}>
                        Active
                      </Badge>
                    </TableCell>
                    <TableCell>{new Date(user.createdAt).toLocaleDateString()}</TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreVertical className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => {
                            setUserToEdit(user);
                            setIsEditModalOpen(true);
                          }}>
                            Edit User
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => {
                            setSelectedUser(user);
                            setIsRoleModalOpen(true);
                          }}>
                            Change Role
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            className="text-destructive"
                            onClick={() => handleSuspendUser(user.id)}
                          >
                            Suspend User (Not Implemented)
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
                                </TableBody>
                </Table>
              </div>
            )}

            {/* Mobile Card View */}
            {!isLoading && !error && filteredUsers.length > 0 && (
              <div className="lg:hidden space-y-3">
            {filteredUsers.map((user) => (
              <Card key={user.id} className="p-3">
                <div className="flex items-center space-x-3">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={user.avatar} />
                    <AvatarFallback>
                      {user.fullName.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <h3 className="font-medium text-sm truncate">{user.fullName}</h3>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreVertical className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => {
                            setUserToEdit(user);
                            setIsEditModalOpen(true);
                          }}>
                            Edit User
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => {
                            setSelectedUser(user);
                            setIsRoleModalOpen(true);
                          }}>
                            Change Role
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            className="text-destructive"
                            onClick={() => handleSuspendUser(user.id)}
                          >
                            Suspend User (Not Implemented)
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                    
                    <p className="text-xs text-muted-foreground truncate mb-2">
                      {user.email}
                    </p>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Badge variant={getRoleVariant(user.role)} className="text-xs">
                          {user.role}
                        </Badge>
                        <Badge variant={getStatusVariant('Active')} className="text-xs">
                          Active
                        </Badge>
                      </div>
                      
                      <div className="flex items-center space-x-3 text-xs text-muted-foreground">
                        {/* Files and Storage not available from backend */}
                      </div>
                    </div>
                    
                    <div className="mt-2 text-xs text-muted-foreground">
                      Created At: {new Date(user.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                </div>
              </Card>
            ))}
            </div>
          )}
        </CardContent>
      </Card>
      
      <EditUserModal 
        user={userToEdit}
        isOpen={isEditModalOpen}
        onOpenChange={setIsEditModalOpen}
        onUserUpdate={handleEditUser}
      />
      <ChangeRoleModal 
        open={isRoleModalOpen}
        onOpenChange={setIsRoleModalChangeRole}
        user={selectedUser}
        onRoleChange={handleChangeRole}
      />
    </div>
  );
};

export default AdminUsers;