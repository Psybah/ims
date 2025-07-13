import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Shield, Users, Calendar, User, Lock, Unlock } from 'lucide-react';

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

interface ViewPermissionModalProps {
  permission: Permission | null;
  isOpen: boolean;
  onClose: () => void;
}

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

export const ViewPermissionModal = ({ permission, isOpen, onClose }: ViewPermissionModalProps) => {
  if (!permission) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Shield className="w-5 h-5" />
            Permission Details
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="space-y-2">
            <h3 className="text-lg font-semibold">{permission.name}</h3>
            <p className="text-sm text-muted-foreground">{permission.description}</p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                  <Shield className="w-4 h-4" />
                  Category
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Badge variant={getCategoryVariant(permission.category)}>
                  {permission.category}
                </Badge>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                  {permission.enabled ? <Unlock className="w-4 h-4" /> : <Lock className="w-4 h-4" />}
                  Status
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className={`flex items-center gap-2 ${permission.enabled ? 'text-green-600' : 'text-red-600'}`}>
                  {permission.enabled ? 'Active' : 'Disabled'}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                  <Users className="w-4 h-4" />
                  Users
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-sm">
                  {permission.usersWithPermission} users have this permission
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  Modified
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-sm">{permission.lastModified}</div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <User className="w-4 h-4" />
                Created By
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-sm">{permission.createdBy}</div>
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
}; 