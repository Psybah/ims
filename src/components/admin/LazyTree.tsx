import {
  Loader,
  ChevronDown,
  ChevronRight,
  Folder,
  FileIcon,
} from "lucide-react";
import { useState } from "react";

interface TreeNode {
  id: string;
  name?: string;
  fileName?: string;
  type: "folder" | "file";
  parentId: string | null;
}

interface LazyTreeProps {
  node: TreeNode;
  level: number;
  getChildren: (node: TreeNode) => Promise<TreeNode[]>;
  selectedId: string;
  onSelect: (id: string) => void;
}

export const LazyTree: React.FC<LazyTreeProps> = ({
  node,
  level,
  getChildren,
  selectedId,
  onSelect,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [children, setChildren] = useState<TreeNode[] | null>(null);
  const [loading, setLoading] = useState(false);

  const toggle = async () => {
    if (!isExpanded && children === null) {
      setLoading(true);
      try {
        const result = await getChildren(node);
        const sortedResult = result.sort((a, b) => {
          if (a.type === "folder" && b.type === "file") {
            return 1;
          } else if (a.type === "file" && b.type === "folder") {
            return -1;
          }

          return -1;
        });
        setChildren(sortedResult);
      } finally {
        setLoading(false);
      }
    }

    setIsExpanded(!isExpanded);
  };

  const renderItem = () => {
    const isFolder = node.type === "folder";
    const nodeName = isFolder ? node.name : node.fileName;

    return (
      <>
        <div style={{ marginLeft: level * 16 }}>
          <div
            className={`flex items-center gap-1 cursor-pointer rounded px-1 ${
              selectedId === node.id ? "bg-primary/10" : ""
            }`}
            onClick={() => {
              if (!isFolder) {
                onSelect(node.id);
              }
            }}
          >
            {isFolder ? (
              <span
                onClick={(e) => {
                  e.stopPropagation();
                  toggle();
                }}
              >
                {isExpanded ? (
                  <ChevronDown className="w-4 h-4" />
                ) : (
                  <ChevronRight className="w-4 h-4" />
                )}
              </span>
            ) : (
              <span style={{ width: 16 }} />
            )}
            {isFolder ? (
              <Folder className="w-4 h-4 text-blue-600 mr-1" />
            ) : (
              <FileIcon className="w-4 h-4 text-gray-600 mr-1" />
            )}
            <span onClick={() => onSelect(node.id)} className="truncate">
              {nodeName}
            </span>
          </div>
        </div>
      </>
    );
  };

  return (
    <div className="space-y-2">
      {renderItem()}

      {loading && (
        <div style={{ marginLeft: (level + 1) * 24 }}>
          <Loader className="w-3 h-3 animate-spin" />
        </div>
      )}

      {isExpanded &&
        children?.map((child) => (
          <LazyTree
            key={child.id}
            node={child}
            level={level + 1}
            getChildren={getChildren}
            selectedId={selectedId}
            onSelect={onSelect}
          />
        ))}
    </div>
  );
};

interface LazyTreeItemProps {
  node: TreeNode;
  isExpanded: boolean;
  toggle: () => void;
  level: number;
  selectedId: LazyTreeProps["selectedId"];
  onSelect: LazyTreeProps["onSelect"];
}

const LazyTreeItem: React.FC<LazyTreeItemProps> = ({
  node,
  level,
  isExpanded,
  toggle,
  selectedId,
  onSelect,
}) => {
  const isFolder = node.type === "folder";
  const nodeName = isFolder ? node.name : node.fileName;

  return (
    <>
      <div
        style={{ marginLeft: level * 16 }}
        onClick={() => {
          if (!isFolder) {
            onSelect(node.id);
          }
        }}
      >
        <div
          className={`flex items-center gap-1 cursor-pointer rounded px-1 ${
            selectedId === node.id ? "bg-primary/10" : ""
          }`}
        >
          {isFolder ? (
            <span
              onClick={(e) => {
                e.stopPropagation();
                toggle();
              }}
            >
              {isExpanded ? (
                <ChevronDown className="w-4 h-4" />
              ) : (
                <ChevronRight className="w-4 h-4" />
              )}
            </span>
          ) : (
            <span style={{ width: 16 }} />
          )}
          {isFolder ? (
            <Folder className="w-4 h-4 text-blue-600 mr-1" />
          ) : (
            <FileIcon className="w-4 h-4 text-gray-600 mr-1" />
          )}
          <span onClick={() => onSelect(node.id)} className="truncate">
            {nodeName}
          </span>
        </div>
      </div>
    </>
  );
};
