import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  UserPlus,
  Mail,
  Clock,
  CheckCircle,
  XCircle,
  MoreVertical,
  Copy,
  RefreshCw,
  Trash2
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

// Mock data for invitations
const mockInvitations = [
  {
    id: '1',
    email: 'john.smith@company.com',
    role: 'User',
    status: 'Pending',
    sentBy: 'Admin',
    sentDate: '2024-01-15',
    expiresAt: '2024-01-22',
    inviteLink: 'https://app.example.com/invite/abc123'
  },
  {
    id: '2',
    email: 'sarah.johnson@company.com',
    role: 'Moderator',
    status: 'Accepted',
    sentBy: 'Admin',
    sentDate: '2024-01-14',
    expiresAt: '2024-01-21',
    inviteLink: 'https://app.example.com/invite/def456'
  },
  {
    id: '3',
    email: 'mike.davis@company.com',
    role: 'User',
    status: 'Expired',
    sentBy: 'Admin',
    sentDate: '2024-01-10',
    expiresAt: '2024-01-17',
    inviteLink: 'https://app.example.com/invite/ghi789'
  }
];

const AdminInvite = () => {
  const [invitations, setInvitations] = useState(mockInvitations);
  const [formData, setFormData] = useState({
    emails: '',
    role: '',
    message: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSendInvites = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.emails.trim() || !formData.role) {
      toast({
        title: "Missing information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));

      const emails = formData.emails.split('\n').filter(email => email.trim());
      const newInvitations = emails.map((email, index) => ({
        id: `${Date.now()}-${index}`,
        email: email.trim(),
        role: formData.role,
        status: 'Pending',
        sentBy: 'Admin',
        sentDate: new Date().toISOString().split('T')[0],
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        inviteLink: `https://app.example.com/invite/${Math.random().toString(36).substr(2, 9)}`
      }));

      setInvitations(prev => [...newInvitations, ...prev]);
      
      toast({
        title: "Invitations sent",
        description: `Successfully sent ${emails.length} invitation(s).`,
      });

      setFormData({ emails: '', role: '', message: '' });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to send invitations. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopyLink = (link: string) => {
    navigator.clipboard.writeText(link);
    toast({
      title: "Link copied",
      description: "Invitation link copied to clipboard.",
    });
  };

  const handleResendInvite = (id: string) => {
    setInvitations(prev => prev.map(inv => 
      inv.id === id 
        ? { 
            ...inv, 
            sentDate: new Date().toISOString().split('T')[0],
            expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
            status: 'Pending'
          }
        : inv
    ));
    
    toast({
      title: "Invitation resent",
      description: "The invitation has been sent again.",
    });
  };

  const handleDeleteInvite = (id: string) => {
    setInvitations(prev => prev.filter(inv => inv.id !== id));
    toast({
      title: "Invitation deleted",
      description: "The invitation has been removed.",
      variant: "destructive",
    });
  };

  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'Pending':
        return 'secondary';
      case 'Accepted':
        return 'default';
      case 'Expired':
        return 'destructive';
      default:
        return 'outline';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Pending':
        return Clock;
      case 'Accepted':
        return CheckCircle;
      case 'Expired':
        return XCircle;
      default:
        return Clock;
    }
  };

  const pendingCount = invitations.filter(inv => inv.status === 'Pending').length;
  const acceptedCount = invitations.filter(inv => inv.status === 'Accepted').length;
  const expiredCount = invitations.filter(inv => inv.status === 'Expired').length;

  return (
    <div className="space-y-6">
      <div className="flex flex-col space-y-3 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold">Invite Users</h1>
          <p className="text-sm sm:text-base text-muted-foreground">
            Send invitations to new users and manage pending invites
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pendingCount}</div>
            <p className="text-xs text-muted-foreground">Awaiting response</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Accepted</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{acceptedCount}</div>
            <p className="text-xs text-muted-foreground">Successfully joined</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Expired</CardTitle>
            <XCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{expiredCount}</div>
            <p className="text-xs text-muted-foreground">Need to resend</p>
          </CardContent>
        </Card>
      </div>

      {/* Send Invitations Form */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <UserPlus className="w-5 h-5" />
            <span>Send New Invitations</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSendInvites} className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="emails">Email Addresses *</Label>
                <Textarea
                  id="emails"
                  placeholder="Enter email addresses (one per line)&#10;john@example.com&#10;jane@example.com"
                  value={formData.emails}
                  onChange={(e) => setFormData(prev => ({ ...prev, emails: e.target.value }))}
                  className="min-h-[100px]"
                  required
                />
                <p className="text-xs text-muted-foreground">
                  Enter one email address per line
                </p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="role">Role *</Label>
                <Select
                  value={formData.role}
                  onValueChange={(value) => setFormData(prev => ({ ...prev, role: value }))}
                  required
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select role for invitees" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="User">User</SelectItem>
                    <SelectItem value="Moderator">Moderator</SelectItem>
                    <SelectItem value="Admin">Admin</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="message">Custom Message (Optional)</Label>
              <Textarea
                id="message"
                placeholder="Add a personal message to your invitation..."
                value={formData.message}
                onChange={(e) => setFormData(prev => ({ ...prev, message: e.target.value }))}
                rows={3}
              />
            </div>
            <Button type="submit" disabled={isLoading} className="w-full sm:w-auto">
              <Mail className="w-4 h-4 mr-2" />
              {isLoading ? "Sending..." : "Send Invitations"}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Invitations Table */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Invitations</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Email</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Sent Date</TableHead>
                  <TableHead>Expires</TableHead>
                  <TableHead className="w-[50px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {invitations.map((invitation) => {
                  const StatusIcon = getStatusIcon(invitation.status);
                  return (
                    <TableRow key={invitation.id}>
                      <TableCell className="font-medium">{invitation.email}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{invitation.role}</Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <StatusIcon className="w-4 h-4" />
                          <Badge variant={getStatusVariant(invitation.status)}>
                            {invitation.status}
                          </Badge>
                        </div>
                      </TableCell>
                      <TableCell>{invitation.sentDate}</TableCell>
                      <TableCell>{invitation.expiresAt}</TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <MoreVertical className="w-4 h-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => handleCopyLink(invitation.inviteLink)}>
                              <Copy className="w-4 h-4 mr-2" />
                              Copy Link
                            </DropdownMenuItem>
                            {invitation.status === 'Pending' && (
                              <DropdownMenuItem onClick={() => handleResendInvite(invitation.id)}>
                                <RefreshCw className="w-4 h-4 mr-2" />
                                Resend
                              </DropdownMenuItem>
                            )}
                            <DropdownMenuItem 
                              className="text-destructive"
                              onClick={() => handleDeleteInvite(invitation.id)}
                            >
                              <Trash2 className="w-4 h-4 mr-2" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminInvite;