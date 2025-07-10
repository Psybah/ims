import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Users, 
  Files, 
  HardDrive, 
  Activity, 
  Upload, 
  Download, 
  Eye, 
  TrendingUp,
  AlertTriangle,
  Clock
} from 'lucide-react';

const AdminDashboard: React.FC = () => {
  const stats = [
    {
      title: 'Total Users',
      value: '1,234',
      change: '+12%',
      icon: Users,
      color: 'text-blue-600'
    },
    {
      title: 'Total Files',
      value: '45,678',
      change: '+8%',
      icon: Files,
      color: 'text-green-600'
    },
    {
      title: 'Storage Used',
      value: '234 GB',
      change: '+15%',
      icon: HardDrive,
      color: 'text-orange-600'
    },
    {
      title: 'Active Sessions',
      value: '89',
      change: '+3%',
      icon: Activity,
      color: 'text-purple-600'
    }
  ];

  const recentActivity = [
    {
      user: 'Amina Yusuf',
      action: 'uploaded',
      file: 'quarterly-report.pdf',
      time: '2 minutes ago',
      type: 'upload'
    },
    {
      user: 'Chinedu Emeka',
      action: 'downloaded',
      file: 'client-presentation.pptx',
      time: '5 minutes ago',
      type: 'download'
    },
    {
      user: 'Adebayo Okonkwo',
      action: 'viewed',
      file: 'project-timeline.xlsx',
      time: '8 minutes ago',
      type: 'view'
    },
    {
      user: 'Kemi Adeleke',
      action: 'shared',
      file: 'design-assets.zip',
      time: '12 minutes ago',
      type: 'share'
    }
  ];

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'upload': return <Upload className="w-4 h-4 text-green-600" />;
      case 'download': return <Download className="w-4 h-4 text-blue-600" />;
      case 'view': return <Eye className="w-4 h-4 text-gray-600" />;
      case 'share': return <Users className="w-4 h-4 text-purple-600" />;
      default: return <Activity className="w-4 h-4" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Admin Dashboard</h1>
          <p className="text-muted-foreground">
            Overview of your file management system
          </p>
        </div>
        <Button className="bg-gradient-primary">
          <Upload className="w-4 h-4 mr-2" />
          Upload Files
        </Button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <Card key={index} className="shadow-md border-0">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.title}
              </CardTitle>
              <stat.icon className={`h-5 w-5 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">{stat.value}</div>
              <div className="flex items-center text-xs text-muted-foreground">
                <TrendingUp className="w-3 h-3 mr-1 text-green-600" />
                <span className="text-green-600">{stat.change}</span>
                <span className="ml-1">from last month</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activity */}
        <Card className="shadow-md border-0">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Activity className="w-5 h-5 mr-2" />
              Recent Activity
            </CardTitle>
            <CardDescription>
              Latest file operations by users
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivity.map((activity, index) => (
                <div key={index} className="flex items-center space-x-4 p-3 rounded-lg bg-muted/50">
                  <div className="flex-shrink-0">
                    {getActivityIcon(activity.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground">
                      <span className="font-semibold">{activity.user}</span>{' '}
                      {activity.action}{' '}
                      <span className="font-medium">{activity.file}</span>
                    </p>
                    <div className="flex items-center text-xs text-muted-foreground">
                      <Clock className="w-3 h-3 mr-1" />
                      {activity.time}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* System Alerts */}
        <Card className="shadow-md border-0">
          <CardHeader>
            <CardTitle className="flex items-center">
              <AlertTriangle className="w-5 h-5 mr-2" />
              System Alerts
            </CardTitle>
            <CardDescription>
              Important notifications and warnings
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-start space-x-3 p-3 rounded-lg bg-warning/10 border border-warning/20">
                <AlertTriangle className="w-4 h-4 text-warning mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-foreground">Storage Limit Warning</p>
                  <p className="text-xs text-muted-foreground">
                    You're using 85% of your storage quota
                  </p>
                  <Badge variant="outline" className="mt-2 text-xs">
                    Action Required
                  </Badge>
                </div>
              </div>

              <div className="flex items-start space-x-3 p-3 rounded-lg bg-destructive/10 border border-destructive/20">
                <AlertTriangle className="w-4 h-4 text-destructive mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-foreground">Failed Backup</p>
                  <p className="text-xs text-muted-foreground">
                    Last backup failed on March 15, 2024
                  </p>
                  <Badge variant="destructive" className="mt-2 text-xs">
                    Critical
                  </Badge>
                </div>
              </div>

              <div className="flex items-start space-x-3 p-3 rounded-lg bg-success/10 border border-success/20">
                <Activity className="w-4 h-4 text-success mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-foreground">System Update</p>
                  <p className="text-xs text-muted-foreground">
                    Security update completed successfully
                  </p>
                  <Badge variant="outline" className="mt-2 text-xs border-success text-success">
                    Completed
                  </Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboard;