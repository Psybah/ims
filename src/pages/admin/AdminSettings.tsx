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
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import {
  Settings,
  Mail,
  Bell,
  Database,
  Download,
  Upload,
  Trash2,
  AlertTriangle,
  Save,
  RefreshCw,
  Shield,
  Monitor,
  Palette,
  Globe
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const AdminSettings = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [emailSettings, setEmailSettings] = useState({
    smtpHost: 'smtp.example.com',
    smtpPort: '587',
    smtpUser: 'admin@example.com',
    smtpPassword: '••••••••',
    fromEmail: 'noreply@example.com',
    fromName: 'File Management System'
  });

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
      await new Promise(resolve => setTimeout(resolve, 3000));
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
      await new Promise(resolve => setTimeout(resolve, 2000));
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

      {/* Email Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Mail className="w-5 h-5" />
            <span>Email Configuration</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="smtpHost">SMTP Host</Label>
              <Input
                id="smtpHost"
                value={emailSettings.smtpHost}
                onChange={(e) => setEmailSettings(prev => ({ ...prev, smtpHost: e.target.value }))}
                placeholder="smtp.example.com"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="smtpPort">SMTP Port</Label>
              <Input
                id="smtpPort"
                value={emailSettings.smtpPort}
                onChange={(e) => setEmailSettings(prev => ({ ...prev, smtpPort: e.target.value }))}
                placeholder="587"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="smtpUser">SMTP Username</Label>
              <Input
                id="smtpUser"
                value={emailSettings.smtpUser}
                onChange={(e) => setEmailSettings(prev => ({ ...prev, smtpUser: e.target.value }))}
                placeholder="username@example.com"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="smtpPassword">SMTP Password</Label>
              <Input
                id="smtpPassword"
                type="password"
                value={emailSettings.smtpPassword}
                onChange={(e) => setEmailSettings(prev => ({ ...prev, smtpPassword: e.target.value }))}
                placeholder="••••••••"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="fromEmail">From Email</Label>
              <Input
                id="fromEmail"
                type="email"
                value={emailSettings.fromEmail}
                onChange={(e) => setEmailSettings(prev => ({ ...prev, fromEmail: e.target.value }))}
                placeholder="noreply@example.com"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="fromName">From Name</Label>
              <Input
                id="fromName"
                value={emailSettings.fromName}
                onChange={(e) => setEmailSettings(prev => ({ ...prev, fromName: e.target.value }))}
                placeholder="System Notifications"
              />
            </div>
          </div>

          <div className="flex justify-end space-x-2">
            <Button variant="outline">
              Test Connection
            </Button>
            <Button 
              onClick={() => handleSaveSettings('Email')} 
              disabled={isLoading}
            >
              <Save className="w-4 h-4 mr-2" />
              Save Email Settings
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

      {/* System Maintenance */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Database className="w-5 h-5" />
            <span>System Maintenance</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label>Backup Frequency</Label>
              <Select
                value={systemSettings.backupFrequency}
                onValueChange={(value) => setSystemSettings(prev => ({ ...prev, backupFrequency: value }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="hourly">Hourly</SelectItem>
                  <SelectItem value="daily">Daily</SelectItem>
                  <SelectItem value="weekly">Weekly</SelectItem>
                  <SelectItem value="monthly">Monthly</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Log Level</Label>
              <Select
                value={systemSettings.logLevel}
                onValueChange={(value) => setSystemSettings(prev => ({ ...prev, logLevel: value }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="error">Error</SelectItem>
                  <SelectItem value="warn">Warning</SelectItem>
                  <SelectItem value="info">Info</SelectItem>
                  <SelectItem value="debug">Debug</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            <Button 
              onClick={handleSystemBackup}
              disabled={isLoading}
              className="w-full"
            >
              <Download className="w-4 h-4 mr-2" />
              Create Backup
            </Button>
            <Button 
              onClick={handleSystemRestore}
              disabled={isLoading}
              variant="outline"
              className="w-full"
            >
              <Upload className="w-4 h-4 mr-2" />
              Restore Backup
            </Button>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive" className="w-full">
                  <Trash2 className="w-4 h-4 mr-2" />
                  Reset System
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle className="flex items-center space-x-2">
                    <AlertTriangle className="w-5 h-5 text-destructive" />
                    <span>Reset System to Factory Defaults</span>
                  </AlertDialogTitle>
                  <AlertDialogDescription>
                    This action will permanently delete all data, users, files, and settings. 
                    This cannot be undone. Make sure you have a backup before proceeding.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={handleSystemReset}
                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                  >
                    Reset System
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </CardContent>
      </Card>

      {/* System Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Monitor className="w-5 h-5" />
            <span>System Information</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div className="space-y-1">
              <Label className="text-xs text-muted-foreground">Version</Label>
              <p className="text-sm font-medium">v2.1.0</p>
            </div>
            <div className="space-y-1">
              <Label className="text-xs text-muted-foreground">Environment</Label>
              <Badge variant="outline">Production</Badge>
            </div>
            <div className="space-y-1">
              <Label className="text-xs text-muted-foreground">Uptime</Label>
              <p className="text-sm font-medium">15 days, 3 hours</p>
            </div>
            <div className="space-y-1">
              <Label className="text-xs text-muted-foreground">Last Backup</Label>
              <p className="text-sm font-medium">2024-01-15 03:00</p>
            </div>
            <div className="space-y-1">
              <Label className="text-xs text-muted-foreground">Storage Used</Label>
              <p className="text-sm font-medium">2.3 GB / 10 GB</p>
            </div>
            <div className="space-y-1">
              <Label className="text-xs text-muted-foreground">Active Users</Label>
              <p className="text-sm font-medium">47</p>
            </div>
            <div className="space-y-1">
              <Label className="text-xs text-muted-foreground">Total Files</Label>
              <p className="text-sm font-medium">1,247</p>
            </div>
            <div className="space-y-1">
              <Label className="text-xs text-muted-foreground">Database Size</Label>
              <p className="text-sm font-medium">156 MB</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminSettings;