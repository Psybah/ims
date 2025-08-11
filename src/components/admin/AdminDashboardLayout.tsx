import React from 'react';

interface AdminDashboardLayoutProps {
  children: React.ReactNode;
}

export const AdminDashboardLayout: React.FC<AdminDashboardLayoutProps> = ({ children }) => {
  return (
    <div className="space-y-4 sm:space-y-6">
      {children}
    </div>
  );
}; 