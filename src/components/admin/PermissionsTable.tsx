import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table';
import { Users, User, MoreVertical, Edit, Trash2 } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface Permission {
  subjectType: 'user' | 'group';
  subjectId: string;
  permissions: string[];
  inherited: boolean;
}

interface Group {
  id: string;
  name: string;
}

interface User {
  id: string;
  name: string;
}

interface PermissionsTableProps {
  permissions: Permission[];
  groups: Group[];
  users: User[];
  onEdit: (permission: Permission) => void;
  onRemove: (permission: Permission) => void;
}

function InheritanceIndicator({ inherited }: { inherited: boolean }) {
  if (!inherited) return null;
  return <span className="ml-2 text-xs text-muted-foreground italic">Inherited</span>;
}

export const PermissionsTable: React.FC<PermissionsTableProps> = ({ 
  permissions, 
  groups, 
  users, 
  onEdit, 
  onRemove 
}) => {
  // Responsive: card view on mobile
  if (typeof window !== 'undefined' && window.innerWidth < 768) {
    return (
      <div className="space-y-3">
        {permissions.map(p => {
          const subject = p.subjectType === 'group' ? groups.find(g => g.id === p.subjectId) : users.find(u => u.id === p.subjectId);
          return (
            <div key={p.subjectType + '-' + p.subjectId} className="border rounded-lg p-3 flex flex-col gap-2 bg-white">
              <div className="flex items-center gap-2">
                {p.subjectType === 'group' ? <Users className="w-4 h-4 text-purple-600" /> : <User className="w-4 h-4 text-green-600" />}
                <span className="font-medium">{subject?.name}</span>
                <span className="text-xs capitalize text-muted-foreground">{p.subjectType}</span>
                <InheritanceIndicator inherited={p.inherited} />
                <div className="ml-auto">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button size="icon" variant="ghost"><MoreVertical className="w-4 h-4" /></Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => onEdit(p)}><Edit className="w-4 h-4 mr-2" />Edit</DropdownMenuItem>
                      {!p.inherited && <DropdownMenuItem onClick={() => onRemove(p)}><Trash2 className="w-4 h-4 mr-2" />Delete</DropdownMenuItem>}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
              <div className="flex flex-wrap gap-1">
                {p.permissions.map(perm => <Badge key={perm} variant="secondary">{perm}</Badge>)}
                <InheritanceIndicator inherited={p.inherited} />
              </div>
            </div>
          );
        })}
      </div>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Subject</TableHead>
          <TableHead>Type</TableHead>
          <TableHead>Permissions</TableHead>
          <TableHead className="w-16"></TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {permissions.map(p => {
          const subject = p.subjectType === 'group' ? groups.find(g => g.id === p.subjectId) : users.find(u => u.id === p.subjectId);
          return (
            <TableRow key={p.subjectType + '-' + p.subjectId}>
              <TableCell className="flex items-center gap-2">
                {p.subjectType === 'group' ? <Users className="w-4 h-4 text-purple-600" /> : <User className="w-4 h-4 text-green-600" />}
                <span>{subject?.name}</span>
              </TableCell>
              <TableCell>
                <span className="capitalize">{p.subjectType}</span>
              </TableCell>
              <TableCell>
                <div className="flex flex-wrap gap-1">
                  {p.permissions.map(perm => <Badge key={perm} variant="secondary">{perm}</Badge>)}
                  <InheritanceIndicator inherited={p.inherited} />
                </div>
              </TableCell>
              <TableCell>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon"><MoreVertical className="w-4 h-4" /></Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => onEdit(p)}><Edit className="w-4 h-4 mr-2" />Edit</DropdownMenuItem>
                    {!p.inherited && <DropdownMenuItem onClick={() => onRemove(p)}><Trash2 className="w-4 h-4 mr-2" />Delete</DropdownMenuItem>}
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
}; 