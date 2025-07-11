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
      case 'upload': return <Upload className="w-3 h-3 sm:w-4 sm:h-4 text-green-600" />;
      case 'download': return <Download className="w-3 h-3 sm:w-4 sm:h-4 text-blue-600" />;
      case 'view': return <Eye className="w-3 h-3 sm:w-4 sm:h-4 text-gray-600" />;
      case 'share': return <Users className="w-3 h-3 sm:w-4 sm:h-4 text-purple-600" />;
      default: return <Activity className="w-3 h-3 sm:w-4 sm:h-4" />;
    }
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-foreground">Admin Dashboard</h1>
          <p className="text-sm text-muted-foreground hidden sm:block">
            Overview of your file management system
          </p>
        </div>
        <Button className="bg-gradient-primary self-start sm:self-auto">
          <Upload className="w-3 h-3 sm:w-4 sm:h-4 mr-2" />
          <span className="text-sm sm:text-base">Upload Files</span>
        </Button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
        {stats.map((stat, index) => (
          <Card key={index} className="shadow-md border-0">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-1 sm:pb-2">
              <CardTitle className="text-xs sm:text-sm font-medium text-muted-foreground">
                {stat.title}
              </CardTitle>
              <stat.icon className={`h-4 w-4 sm:h-5 sm:w-5 ${stat.color}`} />
            </CardHeader>
            <CardContent className="pt-1 sm:pt-0">
              <div className="text-lg sm:text-2xl font-bold text-foreground">{stat.value}</div>
              <div className="flex items-center text-xs text-muted-foreground">
                <TrendingUp className="w-2 h-2 sm:w-3 sm:h-3 mr-1 text-green-600" />
                <span className="text-green-600">{stat.change}</span>
                <span className="ml-1 hidden sm:inline">from last month</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        {/* Recent Activity */}
        <Card className="shadow-md border-0">
          <CardHeader className="pb-3 sm:pb-6">
            <CardTitle className="flex items-center text-base sm:text-lg">
              <Activity className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
              Recent Activity
            </CardTitle>
            <CardDescription className="text-xs sm:text-sm hidden sm:block">
              Latest file operations by users
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="space-y-3 sm:space-y-4">
              {recentActivity.map((activity, index) => (
                <div key={index} className="flex items-center space-x-3 p-2 sm:p-3 rounded-lg bg-muted/50">
                  <div className="flex-shrink-0">
                    {getActivityIcon(activity.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs sm:text-sm font-medium text-foreground">
                      <span className="font-semibold">{activity.user}</span>{' '}
                      {activity.action}{' '}
                      <span className="font-medium truncate">{activity.file}</span>
                    </p>
                    <div className="flex items-center text-xs text-muted-foreground">
                      <Clock className="w-2 h-2 sm:w-3 sm:h-3 mr-1" />
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
          <CardHeader className="pb-3 sm:pb-6">
            <CardTitle className="flex items-center text-base sm:text-lg">
              <AlertTriangle className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
              System Alerts
            </CardTitle>
            <CardDescription className="text-xs sm:text-sm hidden sm:block">
              Important notifications and warnings
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="space-y-3 sm:space-y-4">
              <div className="flex items-start space-x-2 sm:space-x-3 p-2 sm:p-3 rounded-lg bg-warning/10 border border-warning/20">
                <AlertTriangle className="w-3 h-3 sm:w-4 sm:h-4 text-warning mt-0.5" />
                <div className="min-w-0 flex-1">
                  <p className="text-xs sm:text-sm font-medium text-foreground">Storage Limit Warning</p>
                  <p className="text-xs text-muted-foreground">
                    You're using 85% of your storage quota
                  </p>
                  <Badge variant="outline" className="mt-1 sm:mt-2 text-xs">
                    Action Required
                  </Badge>
                </div>
              </div>

              <div className="flex items-start space-x-2 sm:space-x-3 p-2 sm:p-3 rounded-lg bg-destructive/10 border border-destructive/20">
                <AlertTriangle className="w-3 h-3 sm:w-4 sm:h-4 text-destructive mt-0.5" />
                <div className="min-w-0 flex-1">
                  <p className="text-xs sm:text-sm font-medium text-foreground">Failed Backup</p>
                  <p className="text-xs text-muted-foreground">
                    Last backup failed on March 15, 2024
                  </p>
                  <Badge variant="destructive" className="mt-1 sm:mt-2 text-xs">
                    Critical
                  </Badge>
                </div>
              </div>

              <div className="flex items-start space-x-2 sm:space-x-3 p-2 sm:p-3 rounded-lg bg-success/10 border border-success/20">
                <Activity className="w-3 h-3 sm:w-4 sm:h-4 text-success mt-0.5" />
                <div className="min-w-0 flex-1">
                  <p className="text-xs sm:text-sm font-medium text-foreground">System Update</p>
                  <p className="text-xs text-muted-foreground">
                    Security update completed successfully
                  </p>
                  <Badge variant="outline" className="mt-1 sm:mt-2 text-xs border-success text-success">
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