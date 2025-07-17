import React, { useState } from 'react';
import { BreadcrumbNav } from '@/components/BreadcrumbNav';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Folder, File as FileIcon, ChevronDown, ChevronRight, Plus, Edit, Trash2, Users, User } from 'lucide-react';

// --- Demo Data ---
const mockFolders = [
  {
    id: 'root', name: 'Root', type: 'folder', parentId: null, children: [
      {
        id: 'finance', name: 'Finance', type: 'folder', parentId: 'root', children: [
          { id: 'payroll', name: 'Payroll', type: 'folder', parentId: 'finance', children: [
            { id: 'payroll.xlsx', name: 'payroll.xlsx', type: 'file', parentId: 'payroll' }
          ] },
          { id: 'budget.pdf', name: 'budget.pdf', type: 'file', parentId: 'finance' },
        ]
      },
      {
        id: 'hr', name: 'HR', type: 'folder', parentId: 'root', children: [
          { id: 'policies.docx', name: 'policies.docx', type: 'file', parentId: 'hr' },
        ]
      },
      { id: 'readme.txt', name: 'readme.txt', type: 'file', parentId: 'root' },
    ]
  }
];
const mockGroups = [
  { id: 'g1', name: 'Finance Team' },
  { id: 'g2', name: 'HR Team' },
  { id: 'g3', name: 'Executives' },
];
const mockUsers = [
  { id: 'u1', name: 'Alice Johnson' },
  { id: 'u2', name: 'Bob Smith' },
  { id: 'u3', name: 'Carol Lee' },
  { id: 'u4', name: 'David Kim' },
];
const mockPermissions = [
  { resourceId: 'finance', subjectId: 'g1', subjectType: 'group', permission: 'edit', inherited: false },
  { resourceId: 'finance', subjectId: 'g3', subjectType: 'group', permission: 'view', inherited: true },
  { resourceId: 'payroll', subjectId: 'g1', subjectType: 'group', permission: 'view', inherited: true },
  { resourceId: 'hr', subjectId: 'g2', subjectType: 'group', permission: 'edit', inherited: false },
  { resourceId: 'budget.pdf', subjectId: 'u2', subjectType: 'user', permission: 'view', inherited: false },
  { resourceId: 'payroll.xlsx', subjectId: 'u3', subjectType: 'user', permission: 'edit', inherited: false },
];
const permissionLevels = [
  { value: 'view', label: 'View' },
  { value: 'edit', label: 'Edit' },
  { value: 'delete', label: 'Delete' },
];

function getFolderPathById(tree, id, path = []) {
  for (const node of tree) {
    if (node.id === id) return [...path, { name: node.name, id: node.id }];
    if (node.children) {
      const res = getFolderPathById(node.children, id, [...path, { name: node.name, id: node.id }]);
      if (res) return res;
    }
  }
  return null;
}

function flattenTree(tree) {
  let result = [];
  for (const node of tree) {
    result.push(node);
    if (node.children) result = result.concat(flattenTree(node.children));
  }
  return result;
}

function VSCodeFolderTree({ tree, selectedId, onSelect }) {
  const [expanded, setExpanded] = useState(() => new Set(['root']));
  const toggle = id => setExpanded(prev => {
    const next = new Set(prev);
    next.has(id) ? next.delete(id) : next.add(id);
    return next;
  });
  const renderNode = (node, level = 0) => {
    const isFolder = node.type === 'folder';
    const isExpanded = expanded.has(node.id);
    return (
      <div key={node.id} style={{ marginLeft: level * 16 }}>
        <div className={`flex items-center gap-1 cursor-pointer rounded px-1 ${selectedId === node.id ? 'bg-primary/10' : ''}`}
          onClick={() => isFolder ? toggle(node.id) : onSelect(node.id)}
        >
          {isFolder ? (
            <span onClick={e => { e.stopPropagation(); toggle(node.id); }}>
              {isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
            </span>
          ) : <span style={{ width: 16 }} />}
          {isFolder ? <Folder className="w-4 h-4 text-blue-600 mr-1" /> : <FileIcon className="w-4 h-4 text-gray-600 mr-1" />}
          <span onClick={() => onSelect(node.id)} className="truncate">{node.name}</span>
        </div>
        {isFolder && isExpanded && node.children && (
          <div>{node.children.map(child => renderNode(child, level + 1))}</div>
        )}
      </div>
    );
  };
  return <div>{tree.map(node => renderNode(node))}</div>;
}

function InheritanceIndicator({ inherited }) {
  return inherited ? (
    <Badge variant="outline" className="text-xs ml-2">Inherited</Badge>
  ) : (
    <Badge variant="secondary" className="text-xs ml-2">Overridden</Badge>
  );
}

function PermissionsTable({ permissions, groups, users, onEdit, onRemove }) {
  return (
    <table className="w-full text-sm border mt-4">
      <thead>
        <tr className="bg-muted/30">
          <th className="text-left p-2">User/Group</th>
          <th className="text-left p-2">Type</th>
          <th className="text-left p-2">Permission</th>
          <th className="text-left p-2">Inheritance</th>
          <th className="p-2"></th>
        </tr>
      </thead>
      <tbody>
        {permissions.map(p => {
          const subject = p.subjectType === 'group' ? groups.find(g => g.id === p.subjectId) : users.find(u => u.id === p.subjectId);
          return (
            <tr key={p.subjectType + '-' + p.subjectId} className="border-b">
              <td className="p-2 flex items-center gap-2">
                {p.subjectType === 'group' ? <Users className="w-4 h-4 text-purple-600" /> : <User className="w-4 h-4 text-green-600" />}
                {subject?.name}
              </td>
              <td className="p-2 capitalize">{p.subjectType}</td>
              <td className="p-2 capitalize">{p.permission}</td>
              <td className="p-2"><InheritanceIndicator inherited={p.inherited} /></td>
              <td className="p-2 flex gap-2">
                <Button size="sm" variant="outline" onClick={() => onEdit(p)}><Edit className="w-4 h-4" /></Button>
                {!p.inherited && (
                  <Button size="sm" variant="destructive" onClick={() => onRemove(p)}><Trash2 className="w-4 h-4" /></Button>
                )}
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}

export default function AdminPermissions() {
  const [selectedResourceId, setSelectedResourceId] = useState('root');
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [editPermission, setEditPermission] = useState(null);
  // Add/Edit dialog state
  const [selectedSubjectType, setSelectedSubjectType] = useState('user');
  const [selectedSubjectId, setSelectedSubjectId] = useState('');
  const [selectedPerm, setSelectedPerm] = useState('view');

  // Flattened list for easy lookup
  const allNodes = flattenTree(mockFolders);
  const selectedNode = allNodes.find(n => n.id === selectedResourceId);
  const folderPath = getFolderPathById(mockFolders, selectedResourceId) || [];
  // Filter permissions for selected resource
  const resourcePerms = mockPermissions.filter(p => p.resourceId === selectedResourceId);

  // Responsive sidebar collapse (mock: always open for now)
  // TODO: Add real responsive/collapsible logic if needed

  return (
    <div className="flex h-[80vh]">
      {/* VSCode-style Folder/File Tree Sidebar */}
      <div className="w-72 border-r p-4 bg-muted/10 overflow-y-auto">
        <h2 className="font-bold mb-4">Folders & Files</h2>
        <VSCodeFolderTree tree={mockFolders} selectedId={selectedResourceId} onSelect={setSelectedResourceId} />
      </div>
      {/* Main Panel */}
      <div className="flex-1 p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold mb-1">Permissions</h1>
            <BreadcrumbNav items={folderPath} onNavigate={id => setSelectedResourceId(id)} />
          </div>
          <Button onClick={() => setShowAddDialog(true)} variant="default">
            <Plus className="w-4 h-4 mr-2" /> Add Permission
          </Button>
        </div>
        <PermissionsTable
          permissions={resourcePerms}
          groups={mockGroups}
          users={mockUsers}
          onEdit={perm => {
            setEditPermission(perm);
            setSelectedSubjectType(perm.subjectType);
            setSelectedSubjectId(perm.subjectId);
            setSelectedPerm(perm.permission);
            setShowEditDialog(true);
          }}
          onRemove={perm => {
            // Remove logic (mock)
            alert(`Remove permission for ${perm.subjectType} ${perm.subjectId}`);
          }}
        />
      </div>
      {/* Add Permission Dialog */}
      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Permission</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="block mb-1 font-medium">Type</label>
              <Select value={selectedSubjectType} onValueChange={setSelectedSubjectType}>
                <SelectTrigger><SelectValue placeholder="Select type" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="user">User</SelectItem>
                  <SelectItem value="group">Group</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="block mb-1 font-medium">{selectedSubjectType === 'user' ? 'User' : 'Group'}</label>
              <Select value={selectedSubjectId} onValueChange={setSelectedSubjectId}>
                <SelectTrigger><SelectValue placeholder={`Select ${selectedSubjectType}`} /></SelectTrigger>
                <SelectContent>
                  {(selectedSubjectType === 'user' ? mockUsers : mockGroups).map(s => (
                    <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="block mb-1 font-medium">Permission</label>
              <Select value={selectedPerm} onValueChange={setSelectedPerm}>
                <SelectTrigger><SelectValue placeholder="Select permission" /></SelectTrigger>
                <SelectContent>
                  {permissionLevels.map(l => (
                    <SelectItem key={l.value} value={l.value}>{l.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setShowAddDialog(false)}>Cancel</Button>
              <Button onClick={() => {
                // Add logic (mock)
                alert(`Add ${selectedPerm} for ${selectedSubjectType} ${selectedSubjectId}`);
                setShowAddDialog(false);
              }}>Add</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
      {/* Edit Permission Dialog */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Permission</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="block mb-1 font-medium">Permission</label>
              <Select value={selectedPerm} onValueChange={setSelectedPerm}>
                <SelectTrigger><SelectValue placeholder="Select permission" /></SelectTrigger>
                <SelectContent>
                  {permissionLevels.map(l => (
                    <SelectItem key={l.value} value={l.value}>{l.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setShowEditDialog(false)}>Cancel</Button>
              <Button onClick={() => {
                // Edit logic (mock)
                alert(`Edit permission to ${selectedPerm} for ${selectedSubjectType} ${selectedSubjectId}`);
                setShowEditDialog(false);
              }}>Save</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}