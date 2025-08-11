import React from 'react';
import { AdminStats } from '@/components/admin/AdminStats';
import { RecentUsers } from '@/components/admin/RecentUsers';
import { SecurityGroups } from '@/components/admin/SecurityGroups';
import { AdminUploadDropdown } from '@/components/admin/AdminUploadDropdown';

export const AdminDashboardContent: React.FC = () => {
  return (
    <>
      {/* Header with Upload Dropdown */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">My Workspace</h1>
          <p className="text-muted-foreground">Manage your files and documents</p>
        </div>
        <AdminUploadDropdown />
      </div>

      {/* Stats Grid */}
      <AdminStats />


      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        {/* Recent Users */}
        <RecentUsers />

        {/* Security Groups */}
        <SecurityGroups />
      </div>
    </>
  );
}; 