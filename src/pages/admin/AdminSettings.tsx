import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Settings,
  Bell,
  Save
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const AdminSettings = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    userRegistration: true,
    fileUploads: false,
    systemAlerts: true,
    weeklyReports: true,
    maintenanceMode: false
  });

  const [systemSettings, setSystemSettings] = useState({
    systemName: 'File Management Portal',
    defaultTheme: 'light',
    allowUserRegistration: true,
    maxUploadSize: '100',
    sessionTimeout: '24',
    backupFrequency: 'daily',
    logLevel: 'info'
  });

  const { toast } = useToast();

  const handleSaveSettings = async (section: string) => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      toast({
        title: "Settings saved",
        description: `${section} settings have been updated successfully.`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: `Failed to save ${section} settings.`,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSystemBackup = async () => {
    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 3000));
      toast({
        title: "Backup created",
        description: "System backup has been created successfully.",
      });
    } catch (error) {
      toast({
        title: "Backup failed",
        description: "Failed to create system backup.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSystemRestore = async () => {
    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 4000));
      toast({
        title: "System restored",
        description: "System has been restored from backup.",
      });
    } catch (error) {
      toast({
        title: "Restore failed",
        description: "Failed to restore system from backup.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSystemReset = async () => {
    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 5000));
      toast({
        title: "System reset",
        description: "System has been reset to factory defaults.",
        variant: "destructive",
      });
    } catch (error) {
      toast({
        title: "Reset failed",
        description: "Failed to reset system.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col space-y-3 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold">System Settings</h1>
          <p className="text-sm sm:text-base text-muted-foreground">
            Configure system-wide settings and preferences
          </p>
        </div>
      </div>

      {/* General System Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Settings className="w-5 h-5" />
            <span>General Settings</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="systemName">System Name</Label>
              <Input
                id="systemName"
                value={systemSettings.systemName}
                onChange={(e) => setSystemSettings(prev => ({ ...prev, systemName: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="defaultTheme">Default Theme</Label>
              <Select
                value={systemSettings.defaultTheme}
                onValueChange={(value) => setSystemSettings(prev => ({ ...prev, defaultTheme: value }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="light">Light</SelectItem>
                  <SelectItem value="dark">Dark</SelectItem>
                  <SelectItem value="auto">Auto (System)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="maxUploadSize">Max Upload Size (MB)</Label>
              <Select
                value={systemSettings.maxUploadSize}
                onValueChange={(value) => setSystemSettings(prev => ({ ...prev, maxUploadSize: value }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="10">10 MB</SelectItem>
                  <SelectItem value="50">50 MB</SelectItem>
                  <SelectItem value="100">100 MB</SelectItem>
                  <SelectItem value="500">500 MB</SelectItem>
                  <SelectItem value="1000">1 GB</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="sessionTimeout">Session Timeout (hours)</Label>
              <Select
                value={systemSettings.sessionTimeout}
                onValueChange={(value) => setSystemSettings(prev => ({ ...prev, sessionTimeout: value }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">1 hour</SelectItem>
                  <SelectItem value="8">8 hours</SelectItem>
                  <SelectItem value="24">24 hours</SelectItem>
                  <SelectItem value="168">1 week</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label>Allow User Registration</Label>
                <p className="text-sm text-muted-foreground">
                  Allow new users to register accounts
                </p>
              </div>
              <Switch
                checked={systemSettings.allowUserRegistration}
                onCheckedChange={(checked) => 
                  setSystemSettings(prev => ({ ...prev, allowUserRegistration: checked }))
                }
              />
            </div>
          </div>

          <div className="flex justify-end">
            <Button 
              onClick={() => handleSaveSettings('General')} 
              disabled={isLoading}
            >
              <Save className="w-4 h-4 mr-2" />
              Save General Settings
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Notification Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Bell className="w-5 h-5" />
            <span>Notification Settings</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label>Email Notifications</Label>
                <p className="text-sm text-muted-foreground">
                  Enable email notifications for system events
                </p>
              </div>
              <Switch
                checked={notificationSettings.emailNotifications}
                onCheckedChange={(checked) => 
                  setNotificationSettings(prev => ({ ...prev, emailNotifications: checked }))
                }
              />
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label>User Registration Notifications</Label>
                <p className="text-sm text-muted-foreground">
                  Notify admins when new users register
                </p>
              </div>
              <Switch
                checked={notificationSettings.userRegistration}
                onCheckedChange={(checked) => 
                  setNotificationSettings(prev => ({ ...prev, userRegistration: checked }))
                }
              />
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label>File Upload Notifications</Label>
                <p className="text-sm text-muted-foreground">
                  Notify admins of new file uploads
                </p>
              </div>
              <Switch
                checked={notificationSettings.fileUploads}
                onCheckedChange={(checked) => 
                  setNotificationSettings(prev => ({ ...prev, fileUploads: checked }))
                }
              />
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label>System Alerts</Label>
                <p className="text-sm text-muted-foreground">
                  Receive alerts for system errors and warnings
                </p>
              </div>
              <Switch
                checked={notificationSettings.systemAlerts}
                onCheckedChange={(checked) => 
                  setNotificationSettings(prev => ({ ...prev, systemAlerts: checked }))
                }
              />
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label>Weekly Reports</Label>
                <p className="text-sm text-muted-foreground">
                  Send weekly usage and activity reports
                </p>
              </div>
              <Switch
                checked={notificationSettings.weeklyReports}
                onCheckedChange={(checked) => 
                  setNotificationSettings(prev => ({ ...prev, weeklyReports: checked }))
                }
              />
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label>Maintenance Mode</Label>
                <p className="text-sm text-muted-foreground">
                  Put the system in maintenance mode
                </p>
              </div>
              <Switch
                checked={notificationSettings.maintenanceMode}
                onCheckedChange={(checked) => 
                  setNotificationSettings(prev => ({ ...prev, maintenanceMode: checked }))
                }
              />
            </div>
          </div>

          <div className="flex justify-end">
            <Button 
              onClick={() => handleSaveSettings('Notification')} 
              disabled={isLoading}
            >
              <Save className="w-4 h-4 mr-2" />
              Save Notification Settings
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminSettings;