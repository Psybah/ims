import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Users, Loader2, UserPlus, UserMinus, Mail, Phone } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { 
  useUsersQuery, 
  useAddUsersToGroupMutation, 
  useRemoveUserFromGroupMutation,
  type SecurityGroup,
  type User 
} from '@/api/admin';

interface ManageGroupMembersModalProps {
  group: SecurityGroup | null;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

export const ManageGroupMembersModal: React.FC<ManageGroupMembersModalProps> = ({
  group,
  isOpen,
  onOpenChange,
}) => {
  const [selectedUserIds, setSelectedUserIds] = useState<string[]>([]);
  const [usersToRemove, setUsersToRemove] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const { toast } = useToast();
  const { data: allUsers = [], isLoading: usersLoading } = useUsersQuery();
  const addUsersToGroupMutation = useAddUsersToGroupMutation();
  const removeUserFromGroupMutation = useRemoveUserFromGroupMutation();

  if (!group) return null;

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'SUPER_ADMIN':
        return 'bg-red-100 text-red-800';
      case 'ADMIN':
        return 'bg-orange-100 text-orange-800';
      case 'MEMBER':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getRoleLabel = (role: string) => {
    switch (role) {
      case 'SUPER_ADMIN':
        return 'Super Admin';
      case 'ADMIN':
        return 'Admin';
      case 'MEMBER':
        return 'Member';
      default:
        return role;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Users className="w-5 h-5" />
            Manage Group Members: {group.name}
          </DialogTitle>
          <DialogDescription>
            Add or remove users from this security group.
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 overflow-hidden">
          <div className="text-center py-8 text-muted-foreground">
            <Users className="w-8 h-8 mx-auto mb-2 opacity-50" />
            <p>Member management functionality coming soon...</p>
          </div>
        </div>

        <DialogFooter className="flex-col sm:flex-row gap-2">
          <Button 
            variant="outline" 
            onClick={() => onOpenChange(false)}
            className="w-full sm:w-auto"
          >
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

