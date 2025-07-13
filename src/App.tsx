import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import { LoginForm } from "@/components/LoginForm";
import { DashboardLayout } from "@/components/DashboardLayout";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminFiles from "./pages/admin/AdminFiles";
import AdminUsers from "./pages/admin/AdminUsers";
import AdminPermissions from "./pages/admin/AdminPermissions";
import AdminTrash from "./pages/admin/AdminTrash";
import AdminInvite from "./pages/admin/AdminInvite";
import AdminOrganization from "./pages/admin/AdminOrganization";
import AdminSettings from "./pages/admin/AdminSettings";
import UserDashboard from "./pages/user/UserDashboard";
import UserFiles from "./pages/user/UserFiles";

import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const ProtectedRoute = ({ children, requireAdmin = false }: { children: React.ReactNode; requireAdmin?: boolean }) => {
  const { user } = useAuth();
  
  if (!user) {
    return <LoginForm />;
  }
  
  if (requireAdmin && user.role !== 'admin') {
    return <Navigate to="/dashboard" replace />;
  }
  
  return <DashboardLayout>{children}</DashboardLayout>;
};

const AppRoutes = () => {
  const { user } = useAuth();
  
  if (!user) {
    return <LoginForm />;
  }
  
  return (
    <Routes>
      {/* User Routes */}
      <Route path="/dashboard" element={
        <ProtectedRoute>
          <UserDashboard />
        </ProtectedRoute>
      } />
      <Route path="/files" element={
        <ProtectedRoute>
          <UserFiles />
        </ProtectedRoute>
      } />
      
      {/* Admin Routes */}
      <Route path="/admin/dashboard" element={
        <ProtectedRoute requireAdmin>
          <AdminDashboard />
        </ProtectedRoute>
      } />
      <Route path="/admin/files" element={
        <ProtectedRoute requireAdmin>
          <AdminFiles />
        </ProtectedRoute>
      } />
      <Route path="/admin/users" element={
        <ProtectedRoute requireAdmin>
          <AdminUsers />
        </ProtectedRoute>
      } />
      <Route path="/admin/permissions" element={
        <ProtectedRoute requireAdmin>
          <AdminPermissions />
        </ProtectedRoute>
      } />
      <Route path="/admin/trash" element={
        <ProtectedRoute requireAdmin>
          <AdminTrash />
        </ProtectedRoute>
      } />
      <Route path="/admin/invite" element={
        <ProtectedRoute requireAdmin>
          <AdminInvite />
        </ProtectedRoute>
      } />
      <Route path="/admin/organization" element={
        <ProtectedRoute requireAdmin>
          <AdminOrganization />
        </ProtectedRoute>
      } />
      <Route path="/admin/settings" element={
        <ProtectedRoute requireAdmin>
          <AdminSettings />
        </ProtectedRoute>
      } />
      
      {/* Redirect root to appropriate dashboard */}
      <Route path="/" element={
        <Navigate to={user.role === 'admin' ? '/admin/dashboard' : '/dashboard'} replace />
      } />
      
      {/* 404 Route */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <AppRoutes />
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
