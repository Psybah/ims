import { useState } from 'react';
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Plus, Check } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useSecurityGroupsQuery, useUsersQuery } from '@/api/admin';

interface AddPermissionModalProps {
  resourceId: string;
  resourceName: string;
  onPermissionAdd: (permission: any) => void;
}

export const AddPermissionModal = ({ resourceId, resourceName, onPermissionAdd }: AddPermissionModalProps) => {
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    subjectType: 'user' as 'user' | 'group',
    subjectId: '',
    permissions: ['view'] as string[],
  });
  const { toast } = useToast();

  // Fetch real users and security groups
  const { data: usersData } = useUsersQuery();
  const { data: securityGroupsData } = useSecurityGroupsQuery();

  const users = usersData?.map(user => ({
    id: user.id,
    name: user.fullName,
    email: user.email,
  })) || [];

  const securityGroups = securityGroupsData?.map(group => ({
    id: group.id,
    name: group.name,
    description: group.description,
  })) || [];

  const permissionLevels = [
    { value: "view", label: "View" },
    { value: "edit", label: "Edit" },
    { value: "delete", label: "Delete" },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // For now, simulate API call since no ACL endpoints exist
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const subjectName = formData.subjectType === 'user' 
        ? users.find(u => u.id === formData.subjectId)?.name 
        : securityGroups.find(g => g.id === formData.subjectId)?.name;

      const newPermission = {
        resourceId,
        subjectId: formData.subjectId,
        subjectType: formData.subjectType,
        permissions: formData.permissions,
        inherited: false,
      };

      onPermissionAdd(newPermission);
      
      toast({
        title: "Permission added",
        description: `${subjectName} now has ${formData.permissions.join(', ')} access to ${resourceName}.`,
      });

      setFormData({ subjectType: 'user', subjectId: '', permissions: ['view'] });
      setOpen(false);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add permission. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm">
          <Plus className="w-4 h-4 mr-2" />
          Add Permission
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add Permission</DialogTitle>
          <DialogDescription>
            Grant permissions to users or security groups for "{resourceName}".
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="subjectType" className="text-right">
                Type
              </Label>
              <Select
                value={formData.subjectType}
                onValueChange={(value) => setFormData(prev => ({ ...prev, subjectType: value as 'user' | 'group', subjectId: '' }))}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="user">User</SelectItem>
                  <SelectItem value="group">Security Group</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="subject" className="text-right">
                {formData.subjectType === 'user' ? 'User' : 'Group'}
              </Label>
              <Select
                value={formData.subjectId}
                onValueChange={(value) => setFormData(prev => ({ ...prev, subjectId: value }))}
                required
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder={`Select ${formData.subjectType}`} />
                </SelectTrigger>
                <SelectContent>
                  {(formData.subjectType === 'user' ? users : securityGroups).map((item) => (
                    <SelectItem key={item.id} value={item.id}>
                      {item.name}
                      {formData.subjectType === 'user' && (
                        <span className="text-muted-foreground ml-2">({(item as any).email})</span>
                      )}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-start gap-4">
              <Label className="text-right mt-2">
                Permissions
              </Label>
              <div className="col-span-3 flex flex-wrap gap-2">
                {permissionLevels.map((level) => (
                  <Button
                    key={level.value}
                    type="button"
                    variant={formData.permissions.includes(level.value) ? "default" : "outline"}
                    size="sm"
                    className="flex items-center gap-1"
                    onClick={() =>
                      setFormData(prev => ({
                        ...prev,
                        permissions: prev.permissions.includes(level.value)
                          ? prev.permissions.filter(p => p !== level.value)
                          : [...prev.permissions, level.value]
                      }))
                    }
                  >
                    {formData.permissions.includes(level.value) && (
                      <Check className="w-3 h-3" />
                    )}
                    {level.label}
                  </Button>
                ))}
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading || !formData.subjectId}>
              {isLoading ? "Adding..." : "Add Permission"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};