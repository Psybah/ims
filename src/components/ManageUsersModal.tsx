import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Shield, Users, Search, UserPlus, UserMinus, Save, X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

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

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  hasPermission: boolean;
}

interface ManageUsersModalProps {
  permission: Permission | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (permissionId: string, userIds: string[]) => void;
}

// Mock users data - in a real app, this would come from an API
const mockUsers: User[] = [
  { id: '1', name: 'John Doe', email: 'john@example.com', role: 'Admin', hasPermission: true },
  { id: '2', name: 'Jane Smith', email: 'jane@example.com', role: 'User', hasPermission: false },
  { id: '3', name: 'Bob Johnson', email: 'bob@example.com', role: 'User', hasPermission: true },
  { id: '4', name: 'Alice Brown', email: 'alice@example.com', role: 'Editor', hasPermission: false },
  { id: '5', name: 'Charlie Wilson', email: 'charlie@example.com', role: 'User', hasPermission: true },
  { id: '6', name: 'Diana Davis', email: 'diana@example.com', role: 'Admin', hasPermission: false },
  { id: '7', name: 'Eve Martinez', email: 'eve@example.com', role: 'Editor', hasPermission: true },
  { id: '8', name: 'Frank Taylor', email: 'frank@example.com', role: 'User', hasPermission: false },
];

export const ManageUsersModal = ({ permission, isOpen, onClose, onSave }: ManageUsersModalProps) => {
  const [users, setUsers] = useState<User[]>(mockUsers);
  const [searchTerm, setSearchTerm] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  // Filter users based on search term
  const filteredUsers = users.filter(user => 
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const usersWithPermission = users.filter(user => user.hasPermission);
  const usersWithoutPermission = users.filter(user => !user.hasPermission);

  const handleUserToggle = (userId: string) => {
    setUsers(prevUsers =>
      prevUsers.map(user =>
        user.id === userId
          ? { ...user, hasPermission: !user.hasPermission }
          : user
      )
    );
  };

  const handleSubmit = async () => {
    if (!permission) return;

    setIsSubmitting(true);
    try {
      const userIds = users.filter(user => user.hasPermission).map(user => user.id);
      onSave(permission.id, userIds);
      
      toast({
        title: "Success",
        description: "User permissions updated successfully"
      });
      onClose();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update user permissions",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setUsers(mockUsers);
    setSearchTerm('');
    onClose();
  };

  if (!permission) return null;

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[80vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Shield className="w-5 h-5" />
            Manage Users - {permission.name}
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                  <UserPlus className="w-4 h-4" />
                  With Permission
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">
                  {usersWithPermission.length}
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                  <UserMinus className="w-4 h-4" />
                  Without Permission
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-red-600">
                  {usersWithoutPermission.length}
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-2">
            <Label>Search Users</Label>
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by name or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8"
              />
            </div>
          </div>

          <ScrollArea className="h-[300px]">
            <div className="space-y-2">
              {filteredUsers.map((user) => (
                <Card key={user.id} className="p-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <Checkbox
                        checked={user.hasPermission}
                        onCheckedChange={() => handleUserToggle(user.id)}
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-sm">{user.name}</span>
                          <Badge variant="secondary" className="text-xs">
                            {user.role}
                          </Badge>
                        </div>
                        <p className="text-xs text-muted-foreground truncate">
                          {user.email}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center">
                      {user.hasPermission ? (
                        <div className="flex items-center text-green-600">
                          <UserPlus className="w-4 h-4 mr-1" />
                          <span className="text-xs">Granted</span>
                        </div>
                      ) : (
                        <div className="flex items-center text-red-600">
                          <UserMinus className="w-4 h-4 mr-1" />
                          <span className="text-xs">Denied</span>
                        </div>
                      )}
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </ScrollArea>

          <div className="flex justify-end space-x-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={isSubmitting}
            >
              <X className="w-4 h-4 mr-2" />
              Cancel
            </Button>
            <Button onClick={handleSubmit} disabled={isSubmitting}>
              <Save className="w-4 h-4 mr-2" />
              {isSubmitting ? 'Saving...' : 'Save Changes'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}; 