import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Activity, CheckCircle, XCircle, Clock } from 'lucide-react';
import { useHealthStatusQuery } from '@/api/admin';

export const SystemHealth: React.FC = () => {
  const { data: healthStatus, isLoading, error, dataUpdatedAt } = useHealthStatusQuery();

  if (isLoading) {
    return (
      <Card className="shadow-md border-0">
        <CardHeader className="pb-3 sm:pb-6">
          <CardTitle className="flex items-center text-base sm:text-lg">
            <Activity className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
            System Health
          </CardTitle>
          <CardDescription className="text-xs sm:text-sm hidden sm:block">
            System status monitoring
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="flex items-center space-x-3 p-3 rounded-lg bg-muted/50 animate-pulse">
            <div className="w-8 h-8 bg-muted rounded-full"></div>
            <div className="flex-1 space-y-2">
              <div className="h-4 bg-muted rounded w-1/2"></div>
              <div className="h-3 bg-muted rounded w-3/4"></div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="shadow-md border-0">
        <CardHeader className="pb-3 sm:pb-6">
          <CardTitle className="flex items-center text-base sm:text-lg">
            <Activity className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
            System Health
          </CardTitle>
          <CardDescription className="text-xs sm:text-sm hidden sm:block">
            System status monitoring
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="flex items-center space-x-3 p-3 rounded-lg border border-red-200 bg-red-50">
            <XCircle className="w-6 h-6 text-red-500 flex-shrink-0" />
            <div className="flex-1">
              <p className="text-sm font-medium text-red-800">Health Check Failed</p>
              <p className="text-xs text-red-600">Unable to connect to health endpoint</p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  const isHealthy = healthStatus?.status === 'UP';
  const lastUpdated = dataUpdatedAt ? new Date(dataUpdatedAt) : new Date();
  
  const getStatusDisplay = (status: string) => {
    switch (status) {
      case 'UP':
        return 'Operational';
      case 'DOWN':
        return 'Service Degraded';
      case 'MAINTENANCE':
        return 'Under Maintenance';
      default:
        return 'Unknown Status';
    }
  };
  
  const getStatusDescription = (status: string) => {
    switch (status) {
      case 'UP':
        return 'All systems operational';
      case 'DOWN':
        return 'System experiencing issues';
      case 'MAINTENANCE':
        return 'Scheduled maintenance in progress';
      default:
        return 'Unable to determine system status';
    }
  };

  return (
    <Card className="shadow-md border-0">
      <CardHeader className="pb-3 sm:pb-6">
        <CardTitle className="flex items-center text-base sm:text-lg">
          <Activity className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
          System Health
        </CardTitle>
        <CardDescription className="text-xs sm:text-sm hidden sm:block">
          Real-time system status
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-0 space-y-4">
        {/* Main Status */}
        <div className={`flex items-center space-x-3 p-3 rounded-lg border ${
          isHealthy 
            ? 'border-green-200 bg-green-50' 
            : 'border-red-200 bg-red-50'
        }`}>
          {isHealthy ? (
            <CheckCircle className="w-6 h-6 text-green-500 flex-shrink-0" />
          ) : (
            <XCircle className="w-6 h-6 text-red-500 flex-shrink-0" />
          )}
          <div className="flex-1">
            <div className="flex items-center justify-between">
              <p className={`text-sm font-medium ${
                isHealthy ? 'text-green-800' : 'text-red-800'
              }`}>
                System Status
              </p>
              <Badge 
                variant={isHealthy ? "default" : "destructive"}
                className="text-xs"
              >
                {getStatusDisplay(healthStatus?.status || 'UNKNOWN')}
              </Badge>
            </div>
            <p className={`text-xs ${
              isHealthy ? 'text-green-600' : 'text-red-600'
            }`}>
              {getStatusDescription(healthStatus?.status || 'UNKNOWN')}
            </p>
          </div>
        </div>

        {/* Last Updated */}
        <div className="flex items-center space-x-2 text-xs text-muted-foreground">
          <Clock className="w-3 h-3" />
          <span>
            Last checked: {lastUpdated.toLocaleTimeString()}
          </span>
        </div>

        {/* Additional Status Info */}
        <div className="grid grid-cols-1 gap-2 text-xs">
          <div className="flex justify-between items-center">
            <span className="text-muted-foreground">Auto-refresh</span>
            <Badge variant="outline" className="text-xs">
              30s
            </Badge>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-muted-foreground">Health endpoint</span>
            <code className="text-xs bg-muted px-1 py-0.5 rounded">
              /api/v1/health
            </code>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
