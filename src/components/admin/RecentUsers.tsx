import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Users, Clock, Mail, Phone } from 'lucide-react';
import { useUsersQuery } from '@/api/admin';
import { formatDistanceToNow } from 'date-fns';

export const RecentUsers: React.FC = () => {
  const { data: users, isLoading, error } = useUsersQuery();

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'SUPER_ADMIN':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'ADMIN':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'MEMBER':
        return 'bg-green-100 text-green-800 border-green-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getRoleLabel = (role: string) => {
    switch (role) {
      case 'SUPER_ADMIN':
        return 'Super Admin';
      case 'ADMIN':
        return 'Admin';
      case 'MEMBER':
        return 'Member';
      default:
        return role;
    }
  };

  if (isLoading) {
    return (
      <Card className="shadow-md border-0">
        <CardHeader className="pb-3 sm:pb-6">
          <CardTitle className="flex items-center text-base sm:text-lg">
            <Users className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
            Recent Users
          </CardTitle>
          <CardDescription className="text-xs sm:text-sm hidden sm:block">
            Latest registered users
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
            <Users className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
            Recent Users
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="text-center text-muted-foreground py-4">
            Failed to load users
          </div>
        </CardContent>
      </Card>
    );
  }

  const recentUsers = users?.slice(0, 5) || [];

  return (
    <Card className="shadow-md border-0">
      <CardHeader className="pb-3 sm:pb-6">
        <CardTitle className="flex items-center text-base sm:text-lg">
          <Users className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
          Recent Users
        </CardTitle>
        <CardDescription className="text-xs sm:text-sm hidden sm:block">
          Latest registered users
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="space-y-3 sm:space-y-4 max-h-80 overflow-y-auto pr-2 thin-scrollbar">
          {recentUsers.length === 0 ? (
            <div className="text-center text-muted-foreground py-4">
              No users found
            </div>
          ) : (
            recentUsers.map((user) => (
              <div key={user.id} className="flex items-center space-x-3 p-2 sm:p-3 rounded-lg bg-muted/50">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                    <span className="text-xs font-medium text-primary">
                      {user.fullName.split(' ').map(n => n[0]).join('').toUpperCase()}
                    </span>
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <p className="text-xs sm:text-sm font-medium text-foreground truncate">
                      {user.fullName}
                    </p>
                    <Badge 
                      variant="outline" 
                      className={`text-xs ${getRoleColor(user.role)}`}
                    >
                      {getRoleLabel(user.role)}
                    </Badge>
                  </div>
                  <div className="flex items-center text-xs text-muted-foreground mt-1">
                    <Mail className="w-2 h-2 sm:w-3 sm:h-3 mr-1" />
                    <span className="truncate">{user.email}</span>
                  </div>
                  {user.phoneNumber && (
                    <div className="flex items-center text-xs text-muted-foreground mt-1">
                      <Phone className="w-2 h-2 sm:w-3 sm:h-3 mr-1" />
                      <span>{user.phoneNumber}</span>
                    </div>
                  )}
                  <div className="flex items-center text-xs text-muted-foreground mt-1">
                    <Clock className="w-2 h-2 sm:w-3 sm:h-3 mr-1" />
                    <span>Joined {formatDistanceToNow(new Date(user.createdAt), { addSuffix: true })}</span>
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