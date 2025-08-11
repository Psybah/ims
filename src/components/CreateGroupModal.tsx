import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Users, Loader2, UserPlus } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useCreateSecurityGroupMutation } from '@/api/admin';

interface CreateGroupModalProps {
  onGroupCreate?: (group: any) => void;
}

export const CreateGroupModal: React.FC<CreateGroupModalProps> = ({ onGroupCreate }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
  });
  const [isCreatingGroup, setIsCreatingGroup] = useState(false);
  
  const { toast } = useToast();
  const createGroupMutation = useCreateSecurityGroupMutation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim()) {
      toast({
        title: "Validation Error",
        description: "Group name is required.",
        variant: "destructive",
      });
      return;
    }

    setIsCreatingGroup(true);
    
    try {
      // Create the group
      const createResponse = await createGroupMutation.mutateAsync({
        name: formData.name.trim(),
        description: formData.description.trim(),
      });

      const newGroup = createResponse.data.securityGroup;

      toast({
        title: "Success",
        description: `Security group "${formData.name}" created successfully. You can add members to the group later.`,
      });

      // Reset form and close modal
      setFormData({ name: '', description: '' });
      setIsOpen(false);
      
      // Notify parent component
      if (onGroupCreate) {
        onGroupCreate(newGroup);
      }
      
    } catch (error: any) {
      console.error('Error creating group:', error);
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to create security group. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsCreatingGroup(false);
    }
  };



  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="flex items-center gap-2">
          <UserPlus className="w-4 h-4" />
          <span className="hidden sm:inline">Create Group</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Users className="w-5 h-5" />
            Create Security Group
          </DialogTitle>
          <DialogDescription>
            Create a new security group for access control and organization.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Group Details */}
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="groupName">Group Name *</Label>
              <Input
                id="groupName"
                placeholder="e.g., Engineering Team, Marketing Department"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                required
                maxLength={100}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="groupDescription">Description</Label>
              <Textarea
                id="groupDescription"
                placeholder="Describe the purpose and scope of this security group..."
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                rows={3}
                maxLength={500}
              />
            </div>
          </div>

          {/* Info Note */}
          <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-sm text-blue-800">
              <strong>Note:</strong> You can add members to this group after creation through the security group management interface.
            </p>
          </div>

          <DialogFooter className="flex-col sm:flex-row gap-2">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => setIsOpen(false)}
              disabled={isCreatingGroup}
              className="w-full sm:w-auto"
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={isCreatingGroup || !formData.name.trim()}
              className="w-full sm:w-auto"
            >
              {isCreatingGroup ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Creating Group...
                </>
              ) : (
                <>
                  <Users className="w-4 h-4 mr-2" />
                  Create Group
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
