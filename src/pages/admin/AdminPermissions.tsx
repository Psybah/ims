import React, { useState, useEffect } from "react";
import { BreadcrumbNav } from "@/components/BreadcrumbNav";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import {
  Folder,
  File as FileIcon,
  ChevronDown,
  ChevronRight,
  Plus,
  Edit,
  Trash2,
  Users,
  User,
  MoreVertical,
  Check,
  ChevronLeft,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
  TableCaption,
} from "@/components/ui/table";
import { EmptyState } from "@/components/EmptyState";
import { PermissionsTable } from "@/components/admin/PermissionsTable";
import { VSCodeFolderTree } from "@/components/admin/VSCodeFolderTree";
import { useSidebar } from "@/components/ui/sidebar";
import {
  fetchFolderById,
  useFolderByIdQuery,
  useFoldersQuery,
} from "@/api/files";
import { LazyTree } from "@/components/admin/LazyTree";

// --- Demo Data ---
interface TreeNode {
  id: string;
  name: string;
  type: "folder" | "file";
  parentId: string | null;
  children?: TreeNode[];
}

interface MockPermission {
  resourceId: string;
  subjectId: string;
  subjectType: "user" | "group";
  permissions: string[];
  inherited: boolean;
}

const mockFolders: TreeNode[] = [
  {
    id: "root",
    name: "Root",
    type: "folder" as const,
    parentId: null,
    children: [
      {
        id: "finance",
        name: "Finance",
        type: "folder" as const,
        parentId: "root",
        children: [
          {
            id: "payroll",
            name: "Payroll",
            type: "folder" as const,
            parentId: "finance",
            children: [
              {
                id: "payroll.xlsx",
                name: "payroll.xlsx",
                type: "file" as const,
                parentId: "payroll",
              },
            ],
          },
          {
            id: "budget.pdf",
            name: "budget.pdf",
            type: "file" as const,
            parentId: "finance",
          },
        ],
      },
      {
        id: "hr",
        name: "HR",
        type: "folder" as const,
        parentId: "root",
        children: [
          {
            id: "policies.docx",
            name: "policies.docx",
            type: "file" as const,
            parentId: "hr",
          },
        ],
      },
      {
        id: "readme.txt",
        name: "readme.txt",
        type: "file" as const,
        parentId: "root",
      },
    ],
  },
];
const mockGroups = [
  { id: "g1", name: "Finance Team" },
  { id: "g2", name: "HR Team" },
  { id: "g3", name: "Executives" },
];
const mockUsers = [
  { id: "u1", name: "Alice Johnson" },
  { id: "u2", name: "Bob Smith" },
  { id: "u3", name: "Carol Lee" },
  { id: "u4", name: "David Kim" },
];
const mockPermissions: MockPermission[] = [
  {
    resourceId: "finance",
    subjectId: "g1",
    subjectType: "group" as const,
    permissions: ["edit", "view"],
    inherited: false,
  },
  {
    resourceId: "finance",
    subjectId: "g3",
    subjectType: "group" as const,
    permissions: ["view"],
    inherited: true,
  },
  {
    resourceId: "payroll",
    subjectId: "g1",
    subjectType: "group" as const,
    permissions: ["view"],
    inherited: true,
  },
  {
    resourceId: "hr",
    subjectId: "g2",
    subjectType: "group" as const,
    permissions: ["edit", "delete"],
    inherited: false,
  },
  {
    resourceId: "budget.pdf",
    subjectId: "u2",
    subjectType: "user" as const,
    permissions: ["view"],
    inherited: false,
  },
  {
    resourceId: "payroll.xlsx",
    subjectId: "u3",
    subjectType: "user" as const,
    permissions: ["edit", "delete"],
    inherited: false,
  },
];
const permissionLevels = [
  { value: "view", label: "View" },
  { value: "edit", label: "Edit" },
  { value: "delete", label: "Delete" },
];

function getFolderPathById(tree, id, path = []) {
  for (const node of tree) {
    if (node.id === id) return [...path, { name: node.name, id: node.id }];
    if (node.children) {
      const res = getFolderPathById(node.children, id, [
        ...path,
        { name: node.name, id: node.id },
      ]);
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

function InheritanceIndicator({ inherited }) {
  return inherited ? (
    <Badge variant="outline" className="text-xs ml-2">
      Inherited
    </Badge>
  ) : (
    <Badge variant="secondary" className="text-xs ml-2">
      Overridden
    </Badge>
  );
}

export default function AdminPermissions() {
  const { setOpen } = useSidebar();
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [editPermission, setEditPermission] = useState<MockPermission | null>(
    null
  );
  // Add/Edit dialog state
  const [selectedSubjectType, setSelectedSubjectType] = useState<
    "user" | "group"
  >("user");
  const [selectedSubjectId, setSelectedSubjectId] = useState("");
  const [selectedPerms, setSelectedPerms] = useState(["view"]);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [permissions, setPermissions] =
    useState<MockPermission[]>(mockPermissions);

  // Collapse sidebar when component mounts
  useEffect(() => {
    setOpen(false);
  }, [setOpen]);

  // Flattened list for easy lookup
  const folderPath = getFolderPathById(mockFolders, "root") || [];
  // Filter permissions for selected resource
  const resourcePerms = permissions.filter((p) => p.resourceId === "");

  // Convert MockPermission to Permission for the table component
  const tablePermissions = resourcePerms.map((p) => ({
    subjectType: p.subjectType,
    subjectId: p.subjectId,
    permissions: p.permissions,
    inherited: p.inherited,
  }));

  // Responsive sidebar toggle
  const isMobile = typeof window !== "undefined" && window.innerWidth < 768;

  const { data: rootFolders, isLoading: loadingRoot } = useFoldersQuery();
  const { data: folderData, isLoading: loadingFolder } = useFolderByIdQuery(
    "",
    {
      enabled: false,
    }
  );

  const currentFolder = null;

  const folderChildren: TreeNode[] =
    folderData && Array.isArray((folderData as any).children)
      ? (folderData as any).children
      : [];
  const folderFiles: TreeNode[] =
    folderData && Array.isArray((folderData as any).files)
      ? (folderData as any).files
      : [];
  const folders: TreeNode[] = currentFolder
    ? folderChildren
    : (rootFolders as TreeNode[]) || [];
  const files: TreeNode[] = currentFolder ? folderFiles : [];
  const rootNodes: TreeNode[] = [...folders, ...files];

  const [selectedResourceId, setSelectedResourceId] = useState(
    folders.length > 1 ? folders[0].id : ""
  );

  const getChildren = async (node: TreeNode) => {
    const result = await fetchFolderById(node.id);
    const children = result.children;
    const files = result.files;
    return [...files, ...children];
  };

  useEffect(() => {
    console.log(selectedResourceId);
  }, [selectedResourceId]);

  return (
    <div className="flex h-[80vh]">
      {/* VSCode-style Folder/File Tree Sidebar */}
      <div
        className={`w-72 border-r p-4 bg-muted/10 overflow-y-auto hidden md:block`}
      >
        <h2 className="font-bold mb-4">Folders & Files</h2>
        {rootNodes.map((node) => (
          <LazyTree
            key={node.id}
            node={node}
            getChildren={getChildren}
            level={0}
            selectedId={selectedResourceId}
            onSelect={(id) => setSelectedResourceId(id)}
          />
        ))}
      </div>
      {/* Mobile sidebar button */}
      {isMobile && (
        <Button
          className="fixed top-4 left-4 z-50 md:hidden"
          variant="outline"
          onClick={() => setMobileSidebarOpen(true)}
        >
          <Folder className="w-5 h-5 mr-2" /> Browse
        </Button>
      )}
      {/* Mobile sidebar overlay */}
      {isMobile && mobileSidebarOpen && (
        <VSCodeFolderTree
          tree={rootNodes}
          selectedId={selectedResourceId}
          onSelect={(id) => {
            setSelectedResourceId(id);
            setMobileSidebarOpen(false);
          }}
          mobileOpen={mobileSidebarOpen}
          setMobileOpen={setMobileSidebarOpen}
        />
      )}
      {/* Main Panel */}
      <div className="flex-1 p-2 sm:p-4 md:p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 gap-2">
          <div>
            <h1 className="text-2xl font-bold mb-1">Permissions</h1>
            <BreadcrumbNav
              items={folderPath}
              onNavigate={(id) => setSelectedResourceId(id)}
            />
          </div>
          <Button onClick={() => setShowAddDialog(true)} variant="default">
            <Plus className="w-4 h-4 mr-2" /> Add Permission
          </Button>
        </div>
        {resourcePerms.length === 0 ? (
          <EmptyState
            icon={Users}
            title="No Permissions Yet"
            description="No users or groups have explicit permissions for this file or folder. Add a permission to get started."
            actionLabel="Add Permission"
            onAction={() => setShowAddDialog(true)}
          />
        ) : (
          <PermissionsTable
            permissions={tablePermissions}
            groups={mockGroups}
            users={mockUsers}
            onEdit={(perm) => {
              const fullPerm = resourcePerms.find(
                (rp) =>
                  rp.subjectId === perm.subjectId &&
                  rp.subjectType === perm.subjectType
              );
              if (fullPerm) {
                setEditPermission(fullPerm);
                setSelectedSubjectType(perm.subjectType);
                setSelectedSubjectId(perm.subjectId);
                setSelectedPerms(perm.permissions);
                setShowEditDialog(true);
              }
            }}
            onRemove={(perm) => {
              // Remove logic (mock)
              setPermissions((prev) =>
                prev.filter(
                  (p) =>
                    !(
                      p.subjectId === perm.subjectId &&
                      p.subjectType === perm.subjectType &&
                      p.resourceId === selectedResourceId
                    )
                )
              );
            }}
          />
        )}
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
              <Select
                value={selectedSubjectType}
                onValueChange={(value) =>
                  setSelectedSubjectType(value as "user" | "group")
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="user">User</SelectItem>
                  <SelectItem value="group">Group</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="block mb-1 font-medium">
                {selectedSubjectType === "user" ? "User" : "Group"}
              </label>
              <Select
                value={selectedSubjectId}
                onValueChange={setSelectedSubjectId}
              >
                <SelectTrigger>
                  <SelectValue placeholder={`Select ${selectedSubjectType}`} />
                </SelectTrigger>
                <SelectContent>
                  {(selectedSubjectType === "user"
                    ? mockUsers
                    : mockGroups
                  ).map((s) => (
                    <SelectItem key={s.id} value={s.id}>
                      {s.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="block mb-1 font-medium">Permissions</label>
              <div className="flex flex-wrap gap-2">
                {permissionLevels.map((l) => (
                  <Button
                    key={l.value}
                    type="button"
                    variant={
                      selectedPerms.includes(l.value) ? "default" : "outline"
                    }
                    size="sm"
                    className="flex items-center gap-1"
                    onClick={() =>
                      setSelectedPerms((prev) =>
                        prev.includes(l.value)
                          ? prev.filter((p) => p !== l.value)
                          : [...prev, l.value]
                      )
                    }
                  >
                    {selectedPerms.includes(l.value) && (
                      <Check className="w-3 h-3 mr-1" />
                    )}
                    {l.label}
                  </Button>
                ))}
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setShowAddDialog(false)}>
                Cancel
              </Button>
              <Button
                onClick={() => {
                  // Add logic (mock)
                  setPermissions((prev) => [
                    ...prev,
                    {
                      resourceId: selectedResourceId,
                      subjectId: selectedSubjectId,
                      subjectType: selectedSubjectType,
                      permissions: selectedPerms,
                      inherited: false,
                    },
                  ]);
                  setShowAddDialog(false);
                }}
              >
                Add
              </Button>
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
              <label className="block mb-1 font-medium">Permissions</label>
              <div className="flex flex-wrap gap-2">
                {permissionLevels.map((l) => (
                  <Button
                    key={l.value}
                    type="button"
                    variant={
                      selectedPerms.includes(l.value) ? "default" : "outline"
                    }
                    size="sm"
                    className="flex items-center gap-1"
                    onClick={() =>
                      setSelectedPerms((prev) =>
                        prev.includes(l.value)
                          ? prev.filter((p) => p !== l.value)
                          : [...prev, l.value]
                      )
                    }
                  >
                    {selectedPerms.includes(l.value) && (
                      <Check className="w-3 h-3 mr-1" />
                    )}
                    {l.label}
                  </Button>
                ))}
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <Button
                variant="outline"
                onClick={() => setShowEditDialog(false)}
              >
                Cancel
              </Button>
              <Button
                onClick={() => {
                  // Edit logic (mock)
                  alert(
                    `Edit permissions to [${selectedPerms.join(
                      ", "
                    )}] for ${selectedSubjectType} ${selectedSubjectId}`
                  );
                  setShowEditDialog(false);
                }}
              >
                Save
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
