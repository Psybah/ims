import { apiV1, apiV2 } from "@/lib/api";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

// Types
export interface AdminDashboardData {
  totalUsers: number;
  totalFiles: {
    totalFiles: number;
    totalSize: number;
  };
}

export interface User {
  id: string;
  fullName: string;
  email: string;
  phoneNumber: string | null;
  role: 'ADMIN' | 'MEMBER' | 'SUPER_ADMIN';
  createdAt: string;
  updatedAt: string;
}

export interface SecurityGroup {
  id: string;
  name: string;
  description: string;
  createdAt: string;
  updatedAt: string;
  members: any[];
  acls: any[];
}

// API Functions
export const getAdminDashboard = async (): Promise<AdminDashboardData> => {
  const { data } = await apiV1.get('/users/admin/dashboard');
  return data.data;
};

export const getUsers = async (): Promise<User[]> => {
  const { data } = await apiV1.get('/users');
  return data.data.users;
};

export const getSecurityGroups = async (): Promise<SecurityGroup[]> => {
  const { data } = await apiV1.get('/security-group');
  return data.data.securityGroups;
};

export const createUser = async (userData: {
  fullName: string;
  email: string;
  password: string;
  phoneNumber?: string;
  role: 'ADMIN' | 'MEMBER';
}) => {
  const { data } = await apiV1.post('/users/add-user', userData);
  return data;
};

export const createSecurityGroup = async (groupData: {
  name: string;
  description: string;
}) => {
  const { data } = await apiV1.post('/security-group', groupData);
  return data;
};

export const getHealthStatus = async () => {
  const { data } = await apiV1.get('/health');
  return data;
};

export const addUsersToGroup = async (groupId: string, userIds: string[]) => {
  const { data } = await apiV1.post(`/security-group/${groupId}/add-user`, { userIds });
  return data;
};

// Note: Remove user endpoint is not documented in backend-documentation.md
// This is a placeholder for future implementation
export const removeUserFromGroup = async (groupId: string, userId: string) => {
  // TODO: Implement when backend endpoint becomes available
  console.warn('Remove user from group endpoint not yet implemented in backend');
  throw new Error('Remove user from group functionality not yet available');
};

// React Query Hooks
export const useAdminDashboardQuery = () => {
  return useQuery({
    queryKey: ['admin-dashboard'],
    queryFn: getAdminDashboard,
    refetchInterval: 30000, // Refresh every 30 seconds
  });
};

export const useUsersQuery = () => {
  return useQuery({
    queryKey: ['users'],
    queryFn: getUsers,
    refetchInterval: 60000, // Refresh every minute
  });
};

export const useSecurityGroupsQuery = () => {
  return useQuery({
    queryKey: ['security-groups'],
    queryFn: getSecurityGroups,
    refetchInterval: 60000, // Refresh every minute
  });
};

export const useCreateUserMutation = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: createUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      queryClient.invalidateQueries({ queryKey: ['admin-dashboard'] });
    },
  });
};

export const useCreateSecurityGroupMutation = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: createSecurityGroup,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['security-groups'] });
    },
  });
};

export const useHealthStatusQuery = () => {
  return useQuery({
    queryKey: ['health-status'],
    queryFn: getHealthStatus,
    refetchInterval: 30000, // Check every 30 seconds
  });
};

export const useAddUsersToGroupMutation = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ groupId, userIds }: { groupId: string; userIds: string[] }) => 
      addUsersToGroup(groupId, userIds),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['security-groups'] });
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
  });
};

export const useRemoveUserFromGroupMutation = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ groupId, userId }: { groupId: string; userId: string }) => 
      removeUserFromGroup(groupId, userId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['security-groups'] });
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
  });
}; 