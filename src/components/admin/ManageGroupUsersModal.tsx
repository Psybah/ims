import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Users, Loader2, UserPlus, UserMinus, Search } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useUsersQuery, useAddUsersToGroupMutation, useRemoveUserFromGroupMutation } from '@/api/admin';

interface SecurityGroup {
  id: string;
  name: string;
  description: string;
  members: any[];
}

interface User {
  id: string;
  fullName: string;
  email: string;
  role: string;
}

interface ManageGroupUsersModalProps {
  group: SecurityGroup | null;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onUsersUpdate?: (groupId: string, addedUsers: string[], removedUsers: string[]) => void;
}

export const ManageGroupUsersModal: React.FC<ManageGroupUsersModalProps> = ({
  group,
  isOpen,
  onOpenChange,
  onUsersUpdate
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUserIds, setSelectedUserIds] = useState<string[]>([]);
  const [isUpdating, setIsUpdating] = useState(false);
  const [activeTab, setActiveTab] = useState('add');
  
  const { toast } = useToast();
  const { data: allUsers = [], isLoading: usersLoading } = useUsersQuery();
  const addUsersToGroupMutation = useAddUsersToGroupMutation();
  const removeUserFromGroupMutation = useRemoveUserFromGroupMutation();

  // Get current member IDs
  const currentMemberIds = group?.members.map(member => member.accountId || member.id) || [];

  // Filter users based on tab and search
  const availableUsers = allUsers.filter(user => 
    !currentMemberIds.includes(user.id) &&
    (user.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
     user.email.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const currentMembers = allUsers.filter(user => 
    currentMemberIds.includes(user.id) &&
    (user.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
     user.email.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  useEffect(() => {
    if (isOpen) {
      setSelectedUserIds([]);
      setSearchTerm('');
      setActiveTab('add');
    }
  }, [isOpen]);

  const handleUserSelection = (userId: string, checked: boolean) => {
    if (checked) {
      setSelectedUserIds(prev => [...prev, userId]);
    } else {
      setSelectedUserIds(prev => prev.filter(id => id !== userId));
    }
  };

  const handleSelectAll = (users: User[], checked: boolean) => {
    if (checked) {
      setSelectedUserIds(users.map(user => user.id));
    } else {
      setSelectedUserIds([]);
    }
  };

  const handleSubmit = async () => {
    if (!group || selectedUserIds.length === 0) return;

    setIsUpdating(true);
    try {
      if (activeTab === 'add') {
        // Add users to group
        await addUsersToGroupMutation.mutateAsync({ 
          groupId: group.id, 
          userIds: selectedUserIds 
        });
        toast({
          title: "Users Added",
          description: `Successfully added ${selectedUserIds.length} user(s) to "${group.name}".`,
        });
      } else {
        // Remove users from group (one by one since API only supports single user removal)
        for (const userId of selectedUserIds) {
          try {
            await removeUserFromGroupMutation.mutateAsync({ 
              groupId: group.id, 
              userId: userId 
            });
          } catch (error: any) {
            // If remove endpoint doesn't exist, show a warning
            if (error.message?.includes('not yet available')) {
              toast({
                title: "Feature Not Available",
                description: "Remove user functionality is not yet implemented in the backend.",
                variant: "destructive",
              });
              return;
            }
            throw error;
          }
        }
        toast({
          title: "Users Removed",
          description: `Successfully removed ${selectedUserIds.length} user(s) from "${group.name}".`,
        });
      }

      // Notify parent component
      if (onUsersUpdate) {
        onUsersUpdate(
          group.id, 
          activeTab === 'add' ? selectedUserIds : [], 
          activeTab === 'remove' ? selectedUserIds : []
        );
      }

      setSelectedUserIds([]);
      onOpenChange(false);
    } catch (error: any) {
      console.error('Error managing group users:', error);
      toast({
        title: "Error",
        description: `Failed to ${activeTab === 'add' ? 'add' : 'remove'} users. Please try again.`,
        variant: "destructive",
      });
    } finally {
      setIsUpdating(false);
    }
  };

  const getUsersForCurrentTab = () => {
    return activeTab === 'add' ? availableUsers : currentMembers;
  };

  const getSelectedUsersForCurrentTab = () => {
    const users = getUsersForCurrentTab();
    return users.filter(user => selectedUserIds.includes(user.id));
  };

  if (!group) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Users className="w-5 h-5" />
            Manage Users - {group.name}
          </DialogTitle>
          <DialogDescription>
            Add or remove users from this security group.
          </DialogDescription>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="add" className="flex items-center gap-2">
              <UserPlus className="w-4 h-4" />
              Add Users ({availableUsers.length})
            </TabsTrigger>
            <TabsTrigger value="remove" className="flex items-center gap-2">
              <UserMinus className="w-4 h-4" />
              Remove Users ({currentMembers.length})
            </TabsTrigger>
          </TabsList>

          <div className="space-y-4 mt-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="Search users..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9"
              />
            </div>

            {/* Selection Summary */}
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">
                {selectedUserIds.length} user(s) selected
              </span>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => handleSelectAll(getUsersForCurrentTab(), selectedUserIds.length === 0)}
              >
                {selectedUserIds.length === getUsersForCurrentTab().length ? 'Deselect All' : 'Select All'}
              </Button>
            </div>

            <TabsContent value="add" className="mt-0">
              {usersLoading ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="w-6 h-6 animate-spin" />
                  <span className="ml-2">Loading users...</span>
                </div>
              ) : availableUsers.length > 0 ? (
                <div className="max-h-80 overflow-y-auto border rounded-lg">
                  <div className="space-y-0">
                    {availableUsers.map((user) => (
                      <div
                        key={user.id}
                        className="flex items-center space-x-3 p-3 hover:bg-muted/50 border-b last:border-b-0"
                      >
                        <Checkbox
                          id={`add-user-${user.id}`}
                          checked={selectedUserIds.includes(user.id)}
                          onCheckedChange={(checked) => 
                            handleUserSelection(user.id, checked as boolean)
                          }
                        />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium truncate">
                                {user.fullName}
                              </p>
                              <p className="text-sm text-muted-foreground truncate">
                                {user.email}
                              </p>
                            </div>
                            <div className="flex-shrink-0 ml-2">
                              <Badge 
                                variant="outline" 
                                className={`text-xs ${
                                  user.role === 'SUPER_ADMIN' 
                                    ? 'bg-red-100 text-red-800 border-red-200' 
                                    : user.role === 'ADMIN'
                                    ? 'bg-orange-100 text-orange-800 border-orange-200'
                                    : 'bg-blue-100 text-blue-800 border-blue-200'
                                }`}
                              >
                                {user.role === 'SUPER_ADMIN' ? 'Super Admin' : 
                                 user.role === 'ADMIN' ? 'Admin' : 'Member'}
                              </Badge>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <UserPlus className="w-8 h-8 mx-auto mb-2 opacity-50" />
                  <p>No users available to add to this group.</p>
                </div>
              )}
            </TabsContent>

            <TabsContent value="remove" className="mt-0">
              {currentMembers.length > 0 ? (
                <div className="max-h-80 overflow-y-auto border rounded-lg">
                  <div className="space-y-0">
                    {currentMembers.map((user) => (
                      <div
                        key={user.id}
                        className="flex items-center space-x-3 p-3 hover:bg-muted/50 border-b last:border-b-0"
                      >
                        <Checkbox
                          id={`remove-user-${user.id}`}
                          checked={selectedUserIds.includes(user.id)}
                          onCheckedChange={(checked) => 
                            handleUserSelection(user.id, checked as boolean)
                          }
                        />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium truncate">
                                {user.fullName}
                              </p>
                              <p className="text-sm text-muted-foreground truncate">
                                {user.email}
                              </p>
                            </div>
                            <div className="flex-shrink-0 ml-2">
                              <Badge 
                                variant="outline" 
                                className={`text-xs ${
                                  user.role === 'SUPER_ADMIN' 
                                    ? 'bg-red-100 text-red-800 border-red-200' 
                                    : user.role === 'ADMIN'
                                    ? 'bg-orange-100 text-orange-800 border-orange-200'
                                    : 'bg-blue-100 text-blue-800 border-blue-200'
                                }`}
                              >
                                {user.role === 'SUPER_ADMIN' ? 'Super Admin' : 
                                 user.role === 'ADMIN' ? 'Admin' : 'Member'}
                              </Badge>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <UserMinus className="w-8 h-8 mx-auto mb-2 opacity-50" />
                  <p>No users in this group to remove.</p>
                </div>
              )}
            </TabsContent>
          </div>
        </Tabs>

        <DialogFooter className="flex-col sm:flex-row gap-2">
          <Button 
            type="button" 
            variant="outline" 
            onClick={() => onOpenChange(false)}
            disabled={isUpdating}
            className="w-full sm:w-auto"
          >
            Cancel
          </Button>
          <Button 
            type="button"
            onClick={handleSubmit}
            disabled={isUpdating || selectedUserIds.length === 0}
            className="w-full sm:w-auto"
          >
            {isUpdating ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                {activeTab === 'add' ? 'Adding...' : 'Removing...'}
              </>
            ) : (
              <>
                {activeTab === 'add' ? (
                  <UserPlus className="w-4 h-4 mr-2" />
                ) : (
                  <UserMinus className="w-4 h-4 mr-2" />
                )}
                {activeTab === 'add' ? 'Add Users' : 'Remove Users'}
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};


