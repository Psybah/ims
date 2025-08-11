import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Shield, Users, Clock, FileText } from 'lucide-react';
import { useSecurityGroupsQuery } from '@/api/admin';
import { formatDistanceToNow } from 'date-fns';

export const SecurityGroups: React.FC = () => {
  const { data: securityGroups, isLoading, error } = useSecurityGroupsQuery();

  if (isLoading) {
    return (
      <Card className="shadow-md border-0">
        <CardHeader className="pb-3 sm:pb-6">
          <CardTitle className="flex items-center text-base sm:text-lg">
            <Shield className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
            Security Groups
          </CardTitle>
          <CardDescription className="text-xs sm:text-sm hidden sm:block">
            Access control groups
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="space-y-3 sm:space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center space-x-3 p-2 sm:p-3 rounded-lg bg-muted/50 animate-pulse">
                <div className="w-8 h-8 bg-muted rounded-full"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-muted rounded w-3/4"></div>
                  <div className="h-3 bg-muted rounded w-1/2"></div>
                </div>
              </div>
            ))}
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
            <Shield className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
            Security Groups
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="text-center text-muted-foreground py-4">
            Failed to load security groups
          </div>
        </CardContent>
      </Card>
    );
  }

  const recentGroups = securityGroups?.slice(0, 5) || [];

  return (
    <Card className="shadow-md border-0">
      <CardHeader className="pb-3 sm:pb-6">
        <CardTitle className="flex items-center text-base sm:text-lg">
          <Shield className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
          Security Groups
        </CardTitle>
        <CardDescription className="text-xs sm:text-sm hidden sm:block">
          Access control groups
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="space-y-3 sm:space-y-4 max-h-80 overflow-y-auto pr-2">
          {recentGroups.length === 0 ? (
            <div className="text-center text-muted-foreground py-4">
              No security groups found
            </div>
          ) : (
            recentGroups.map((group) => (
              <div key={group.id} className="flex items-center space-x-3 p-2 sm:p-3 rounded-lg bg-muted/50">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                    <Shield className="w-4 h-4 text-purple-600" />
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <p className="text-xs sm:text-sm font-medium text-foreground truncate">
                      {group.name}
                    </p>
                    <Badge 
                      variant="outline" 
                      className="text-xs bg-purple-100 text-purple-800 border-purple-200"
                    >
                      {group.members?.length || 0} members
                    </Badge>
                  </div>
                  <div className="flex items-center text-xs text-muted-foreground mt-1">
                    <FileText className="w-2 h-2 sm:w-3 sm:h-3 mr-1" />
                    <span className="truncate">{group.description}</span>
                  </div>
                  <div className="flex items-center text-xs text-muted-foreground mt-1">
                    <Users className="w-2 h-2 sm:w-3 sm:h-3 mr-1" />
                    <span>{group.members?.length || 0} members, {group.acls?.length || 0} permissions</span>
                  </div>
                  <div className="flex items-center text-xs text-muted-foreground mt-1">
                    <Clock className="w-2 h-2 sm:w-3 sm:h-3 mr-1" />
                    <span>Created {formatDistanceToNow(new Date(group.createdAt), { addSuffix: true })}</span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
}; 