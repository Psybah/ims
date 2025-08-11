import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, Files, HardDrive, Activity } from 'lucide-react';
import { useAdminDashboardQuery, useHealthStatusQuery } from '@/api/admin';

interface StatItem {
  title: string;
  value: string;
  change?: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  loading?: boolean;
}

export const AdminStats: React.FC = () => {
  const { data: dashboardData, isLoading: dashboardLoading, error: dashboardError } = useAdminDashboardQuery();
  const { data: healthStatus, isLoading: healthLoading, error: healthError } = useHealthStatusQuery();

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const stats: StatItem[] = [
    {
      title: 'Total Users',
      value: dashboardLoading ? '...' : dashboardError ? 'Error' : dashboardData?.totalUsers?.toString() || '0',
      icon: Users,
      color: 'text-blue-600',
      loading: dashboardLoading
    },
    {
      title: 'Total Files',
      value: dashboardLoading ? '...' : dashboardError ? 'Error' : dashboardData?.totalFiles?.totalFiles?.toString() || '0',
      icon: Files,
      color: 'text-green-600',
      loading: dashboardLoading
    },
    {
      title: 'Storage Used',
      value: dashboardLoading ? '...' : dashboardError ? 'Error' : formatFileSize(dashboardData?.totalFiles?.totalSize || 0),
      icon: HardDrive,
      color: 'text-orange-600',
      loading: dashboardLoading
    },
    {
      title: 'System Health',
      value: healthLoading ? '...' : healthError ? 'Offline' : 
        healthStatus?.status === 'UP' ? 'Healthy' : 
        healthStatus?.status === 'DOWN' ? 'Degraded' : 'Unknown',
      icon: Activity,
      color: healthStatus?.status === 'UP' ? 'text-green-600' : 'text-red-600',
      loading: healthLoading
    }
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
      {stats.map((stat, index) => (
        <Card key={index} className="shadow-md border-0">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-1 sm:pb-2">
            <CardTitle className="text-xs sm:text-sm font-medium text-muted-foreground">
              {stat.title}
            </CardTitle>
            <stat.icon className={`h-4 w-4 sm:h-5 sm:w-5 ${stat.color} ${stat.loading ? 'animate-pulse' : ''}`} />
          </CardHeader>
          <CardContent className="pt-1 sm:pt-0">
            <div className={`text-lg sm:text-2xl font-bold text-foreground ${stat.loading ? 'animate-pulse' : ''}`}>
              {stat.value}
            </div>
            {stat.change && (
              <div className="flex items-center text-xs text-muted-foreground">
                <span className="text-green-600">{stat.change}</span>
                <span className="ml-1 hidden sm:inline">from last month</span>
              </div>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}; 