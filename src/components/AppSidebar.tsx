import { useState } from 'react';
import { 
  LayoutDashboard, 
  Files, 
  Users, 
  Settings, 
  Shield, 
  Trash2, 
  UserPlus,
  Building2,
  Mail,
  HardDrive
} from 'lucide-react';
import { NavLink, useLocation } from 'react-router-dom';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  useSidebar,
} from '@/components/ui/sidebar';
import { useAuth } from '@/contexts/AuthContext';

const adminItems = [
  { title: 'Dashboard', url: '/admin/dashboard', icon: LayoutDashboard },
  { title: 'Files', url: '/admin/files', icon: Files },
  { title: 'Users', url: '/admin/users', icon: Users },
  { title: 'Permissions', url: '/admin/permissions', icon: Shield },
  { title: 'Trash', url: '/admin/trash', icon: Trash2 },
  { title: 'Invite Users', url: '/admin/invite', icon: UserPlus },
  { title: 'Organization', url: '/admin/organization', icon: Building2 },
  { title: 'Settings', url: '/admin/settings', icon: Settings },
];

const userItems = [
  { title: 'Dashboard', url: '/dashboard', icon: LayoutDashboard },
  { title: 'My Files', url: '/files', icon: Files },
  { title: 'Shared', url: '/shared', icon: Users },
];

export function AppSidebar() {
  const { state } = useSidebar();
  const location = useLocation();
  const { user } = useAuth();
  const currentPath = location.pathname;

  const items = user?.role === 'admin' ? adminItems : userItems;
  const isActive = (path: string) => currentPath === path;
  const collapsed = state === 'collapsed';

  return (
    <Sidebar
      className={collapsed ? 'w-14' : 'w-64'}
      collapsible="icon"
    >
      <SidebarHeader className="border-b border-sidebar-border p-4">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
            <HardDrive className="w-5 h-5 text-white" />
          </div>
          {!collapsed && (
            <div>
              <h2 className="font-semibold text-sidebar-foreground">File Management</h2>
              <p className="text-xs text-sidebar-foreground/70 capitalize">{user?.role} Portal</p>
            </div>
          )}
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink
                      to={item.url}
                      className={({ isActive }) =>
                        `flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors ${
                          isActive
                            ? 'bg-sidebar-accent text-sidebar-accent-foreground font-medium'
                            : 'text-sidebar-foreground hover:bg-sidebar-accent/50'
                        }`
                      }
                    >
                      <item.icon className="w-5 h-5 flex-shrink-0" />
                      {!collapsed && <span>{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}