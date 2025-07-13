import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Building2,
  Users,
  Globe,
  Shield,
  Upload,
  Save,
  Mail,
  Phone,
  MapPin,
  Calendar,
  HardDrive,
  Settings
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const AdminOrganization = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [orgData, setOrgData] = useState({
    name: 'Acme Corporation',
    description: 'A leading technology company focused on innovative solutions for modern businesses.',
    website: 'https://acme-corp.com',
    email: 'contact@acme-corp.com',
    phone: '+1 (555) 123-4567',
    address: '123 Tech Street, Silicon Valley, CA 94105',
    founded: '2015',
    industry: 'Technology',
    logo: '/placeholder.svg',
    timezone: 'America/Los_Angeles',
    currency: 'USD',
    language: 'English'
  });

  const [securitySettings, setSecuritySettings] = useState({
    twoFactorRequired: true,
    passwordPolicy: 'Strong',
    sessionTimeout: '24',
    ipRestriction: false,
    auditLogging: true
  });

  const [storageSettings, setStorageSettings] = useState({
    maxFileSize: '100',
    allowedTypes: 'pdf,doc,docx,xls,xlsx,ppt,pptx,jpg,png,gif',
    autoBackup: true,
    retentionPeriod: '90',
    encryptionEnabled: true
  });

  const { toast } = useToast();

  const handleSaveOrganization = async () => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      toast({
        title: "Organization updated",
        description: "Organization settings have been saved successfully.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save organization settings.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogoUpload = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        // In a real app, you'd upload the file and get a URL back
        const url = URL.createObjectURL(file);
        setOrgData(prev => ({ ...prev, logo: url }));
        toast({
          title: "Logo uploaded",
          description: "Organization logo has been updated.",
        });
      }
    };
    input.click();
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col space-y-3 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold">Organization Settings</h1>
          <p className="text-sm sm:text-base text-muted-foreground">
            Manage your organization information and preferences
          </p>
        </div>
      </div>

      {/* Organization Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Building2 className="w-5 h-5" />
            <span>Organization Overview</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Logo and Basic Info */}
          <div className="flex flex-col sm:flex-row sm:items-start space-y-4 sm:space-y-0 sm:space-x-6">
            <div className="flex flex-col items-center space-y-3">
              <Avatar className="w-24 h-24">
                <AvatarImage src={orgData.logo} />
                <AvatarFallback className="text-lg">
                  {orgData.name.split(' ').map(n => n[0]).join('')}
                </AvatarFallback>
              </Avatar>
              <Button onClick={handleLogoUpload} variant="outline" size="sm">
                <Upload className="w-4 h-4 mr-2" />
                Upload Logo
              </Button>
            </div>

            <div className="flex-1 grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="orgName">Organization Name</Label>
                <Input
                  id="orgName"
                  value={orgData.name}
                  onChange={(e) => setOrgData(prev => ({ ...prev, name: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="industry">Industry</Label>
                <Select
                  value={orgData.industry}
                  onValueChange={(value) => setOrgData(prev => ({ ...prev, industry: value }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Technology">Technology</SelectItem>
                    <SelectItem value="Healthcare">Healthcare</SelectItem>
                    <SelectItem value="Finance">Finance</SelectItem>
                    <SelectItem value="Education">Education</SelectItem>
                    <SelectItem value="Manufacturing">Manufacturing</SelectItem>
                    <SelectItem value="Retail">Retail</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2 sm:col-span-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={orgData.description}
                  onChange={(e) => setOrgData(prev => ({ ...prev, description: e.target.value }))}
                  rows={3}
                />
              </div>
            </div>
          </div>

          {/* Contact Information */}
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="website" className="flex items-center space-x-2">
                <Globe className="w-4 h-4" />
                <span>Website</span>
              </Label>
              <Input
                id="website"
                value={orgData.website}
                onChange={(e) => setOrgData(prev => ({ ...prev, website: e.target.value }))}
                placeholder="https://example.com"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email" className="flex items-center space-x-2">
                <Mail className="w-4 h-4" />
                <span>Contact Email</span>
              </Label>
              <Input
                id="email"
                type="email"
                value={orgData.email}
                onChange={(e) => setOrgData(prev => ({ ...prev, email: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone" className="flex items-center space-x-2">
                <Phone className="w-4 h-4" />
                <span>Phone</span>
              </Label>
              <Input
                id="phone"
                value={orgData.phone}
                onChange={(e) => setOrgData(prev => ({ ...prev, phone: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="founded" className="flex items-center space-x-2">
                <Calendar className="w-4 h-4" />
                <span>Founded</span>
              </Label>
              <Input
                id="founded"
                value={orgData.founded}
                onChange={(e) => setOrgData(prev => ({ ...prev, founded: e.target.value }))}
              />
            </div>
            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="address" className="flex items-center space-x-2">
                <MapPin className="w-4 h-4" />
                <span>Address</span>
              </Label>
              <Input
                id="address"
                value={orgData.address}
                onChange={(e) => setOrgData(prev => ({ ...prev, address: e.target.value }))}
              />
            </div>
          </div>

          {/* Localization */}
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="space-y-2">
              <Label htmlFor="timezone">Timezone</Label>
              <Select
                value={orgData.timezone}
                onValueChange={(value) => setOrgData(prev => ({ ...prev, timezone: value }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="America/Los_Angeles">Pacific Time</SelectItem>
                  <SelectItem value="America/Denver">Mountain Time</SelectItem>
                  <SelectItem value="America/Chicago">Central Time</SelectItem>
                  <SelectItem value="America/New_York">Eastern Time</SelectItem>
                  <SelectItem value="UTC">UTC</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="currency">Currency</Label>
              <Select
                value={orgData.currency}
                onValueChange={(value) => setOrgData(prev => ({ ...prev, currency: value }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="USD">USD ($)</SelectItem>
                  <SelectItem value="EUR">EUR (€)</SelectItem>
                  <SelectItem value="GBP">GBP (£)</SelectItem>
                  <SelectItem value="JPY">JPY (¥)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="language">Language</Label>
              <Select
                value={orgData.language}
                onValueChange={(value) => setOrgData(prev => ({ ...prev, language: value }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="English">English</SelectItem>
                  <SelectItem value="Spanish">Spanish</SelectItem>
                  <SelectItem value="French">French</SelectItem>
                  <SelectItem value="German">German</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Security Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Shield className="w-5 h-5" />
            <span>Security Settings</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label>Two-Factor Authentication</Label>
                <p className="text-sm text-muted-foreground">
                  Require all users to enable 2FA
                </p>
              </div>
              <Switch
                checked={securitySettings.twoFactorRequired}
                onCheckedChange={(checked) => 
                  setSecuritySettings(prev => ({ ...prev, twoFactorRequired: checked }))
                }
              />
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label>Audit Logging</Label>
                <p className="text-sm text-muted-foreground">
                  Log all user activities and system events
                </p>
              </div>
              <Switch
                checked={securitySettings.auditLogging}
                onCheckedChange={(checked) => 
                  setSecuritySettings(prev => ({ ...prev, auditLogging: checked }))
                }
              />
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label>IP Restriction</Label>
                <p className="text-sm text-muted-foreground">
                  Restrict access to specific IP addresses
                </p>
              </div>
              <Switch
                checked={securitySettings.ipRestriction}
                onCheckedChange={(checked) => 
                  setSecuritySettings(prev => ({ ...prev, ipRestriction: checked }))
                }
              />
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label>Password Policy</Label>
              <Select
                value={securitySettings.passwordPolicy}
                onValueChange={(value) => 
                  setSecuritySettings(prev => ({ ...prev, passwordPolicy: value }))
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Basic">Basic (8+ characters)</SelectItem>
                  <SelectItem value="Strong">Strong (12+ characters, mixed case, numbers)</SelectItem>
                  <SelectItem value="Strict">Strict (16+ characters, symbols required)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Session Timeout (hours)</Label>
              <Select
                value={securitySettings.sessionTimeout}
                onValueChange={(value) => 
                  setSecuritySettings(prev => ({ ...prev, sessionTimeout: value }))
                }
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
        </CardContent>
      </Card>

      {/* Storage Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <HardDrive className="w-5 h-5" />
            <span>Storage & File Settings</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label>Auto Backup</Label>
                <p className="text-sm text-muted-foreground">
                  Automatically backup files to cloud storage
                </p>
              </div>
              <Switch
                checked={storageSettings.autoBackup}
                onCheckedChange={(checked) => 
                  setStorageSettings(prev => ({ ...prev, autoBackup: checked }))
                }
              />
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label>Encryption</Label>
                <p className="text-sm text-muted-foreground">
                  Encrypt all files at rest and in transit
                </p>
              </div>
              <Switch
                checked={storageSettings.encryptionEnabled}
                onCheckedChange={(checked) => 
                  setStorageSettings(prev => ({ ...prev, encryptionEnabled: checked }))
                }
              />
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label>Max File Size (MB)</Label>
              <Select
                value={storageSettings.maxFileSize}
                onValueChange={(value) => 
                  setStorageSettings(prev => ({ ...prev, maxFileSize: value }))
                }
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
              <Label>Retention Period (days)</Label>
              <Select
                value={storageSettings.retentionPeriod}
                onValueChange={(value) => 
                  setStorageSettings(prev => ({ ...prev, retentionPeriod: value }))
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="30">30 days</SelectItem>
                  <SelectItem value="90">90 days</SelectItem>
                  <SelectItem value="180">180 days</SelectItem>
                  <SelectItem value="365">1 year</SelectItem>
                  <SelectItem value="-1">Indefinite</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2 sm:col-span-2">
              <Label>Allowed File Types</Label>
              <Input
                value={storageSettings.allowedTypes}
                onChange={(e) => 
                  setStorageSettings(prev => ({ ...prev, allowedTypes: e.target.value }))
                }
                placeholder="pdf,doc,docx,xls,xlsx,ppt,pptx,jpg,png,gif"
              />
              <p className="text-xs text-muted-foreground">
                Comma-separated file extensions without dots
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Save Button */}
      <div className="flex justify-end">
        <Button onClick={handleSaveOrganization} disabled={isLoading}>
          <Save className="w-4 h-4 mr-2" />
          {isLoading ? "Saving..." : "Save Changes"}
        </Button>
      </div>
    </div>
  );
};

export default AdminOrganization;