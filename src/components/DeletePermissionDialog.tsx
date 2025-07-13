import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Trash2, AlertTriangle } from 'lucide-react';
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

interface DeletePermissionDialogProps {
  permission: Permission | null;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (permissionId: string) => void;
}

export const DeletePermissionDialog = ({ permission, isOpen, onClose, onConfirm }: DeletePermissionDialogProps) => {
  const { toast } = useToast();

  const handleConfirm = () => {
    if (!permission) return;

    try {
      onConfirm(permission.id);
      toast({
        title: "Success",
        description: `Permission "${permission.name}" has been deleted`
      });
      onClose();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete permission",
        variant: "destructive"
      });
    }
  };

  if (!permission) return null;

  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-destructive" />
            Delete Permission
          </AlertDialogTitle>
          <AlertDialogDescription className="space-y-2">
            <p>
              Are you sure you want to delete the permission <strong>"{permission.name}"</strong>?
            </p>
            <div className="bg-destructive/10 p-3 rounded-md border border-destructive/20">
              <p className="text-sm text-destructive font-medium">
                Warning: This action cannot be undone.
              </p>
              <ul className="text-sm text-destructive mt-2 space-y-1">
                <li>• This will remove the permission from all {permission.usersWithPermission} users</li>
                <li>• Any features dependent on this permission will be affected</li>
                <li>• This action is permanent and cannot be reversed</li>
              </ul>
            </div>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleConfirm}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            <Trash2 className="w-4 h-4 mr-2" />
            Delete Permission
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}; 