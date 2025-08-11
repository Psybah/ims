import React from 'react';
import { AdminDashboardLayout } from '@/components/admin/AdminDashboardLayout';
import { AdminDashboardContent } from '@/components/admin/AdminDashboardContent';

const AdminDashboard: React.FC = () => {
  return (
    <AdminDashboardLayout>
      <AdminDashboardContent />
    </AdminDashboardLayout>
  );
};

export default AdminDashboard;