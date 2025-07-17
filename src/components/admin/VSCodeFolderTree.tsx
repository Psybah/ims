import React, { useState } from 'react';
import { Folder, File as FileIcon, ChevronDown, ChevronRight, ChevronLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface TreeNode {
  id: string;
  name: string;
  type: 'folder' | 'file';
  parentId: string | null;
  children?: TreeNode[];
}

interface VSCodeFolderTreeProps {
  tree: TreeNode[];
  selectedId: string | null;
  onSelect: (id: string) => void;
  mobileOpen: boolean;
  setMobileOpen: (open: boolean) => void;
}

export const VSCodeFolderTree: React.FC<VSCodeFolderTreeProps> = ({ 
  tree, 
  selectedId, 
  onSelect, 
  mobileOpen, 
  setMobileOpen 
}) => {
  const [expanded, setExpanded] = useState(() => new Set(['root']));
  
  const toggle = (id: string) => setExpanded(prev => {
    const next = new Set(prev);
    next.has(id) ? next.delete(id) : next.add(id);
    return next;
  });
  
  const renderNode = (node: TreeNode, level = 0) => {
    const isFolder = node.type === 'folder';
    const isExpanded = expanded.has(node.id);
    return (
      <div key={node.id} style={{ marginLeft: level * 16 }}>
        <div className={`flex items-center gap-1 cursor-pointer rounded px-1 ${selectedId === node.id ? 'bg-primary/10' : ''}`}
          onClick={() => { if (!isFolder) onSelect(node.id); }}
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
  
  // Mobile overlay
  if (mobileOpen) {
    return (
      <div className="fixed inset-0 z-40 bg-black/40 flex">
        <div className="w-64 bg-white p-4 overflow-y-auto">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold">Folders & Files</h2>
            <Button size="icon" variant="ghost" onClick={() => setMobileOpen(false)}>
              <ChevronLeft className="w-5 h-5" />
            </Button>
          </div>
          {tree.map(node => renderNode(node))}
        </div>
        <div className="flex-1" onClick={() => setMobileOpen(false)} />
      </div>
    );
  }
  
  return <div>{tree.map(node => renderNode(node))}</div>;
}; 