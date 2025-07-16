import { useState, useEffect } from 'react';

export interface FileItem {
  id: string;
  name: string;
  type: 'folder' | 'file';
  size?: string;
  modified: string;
  fileType?: string;
  parentPath?: string;
  owner?: string;
  avatar?: string;
  content?: string; // Base64 encoded file content
  mimeType?: string; // MIME type for proper display
}

const STORAGE_KEY = 'file_manager_data';

// Initial Nigerian-themed data
const initialData: FileItem[] = [
  {
    id: '1',
    name: 'Lagos_Project_Documents',
    type: 'folder',
    modified: '2024-01-15',
    parentPath: '',
  },
  {
    id: '2',
    name: 'Abuja_Conference_Images',
    type: 'folder',
    modified: '2024-01-14',
    parentPath: '',
  },
  {
    id: '3',
    name: 'Kano_Business_Proposal.pdf',
    type: 'file',
    size: '2.8 MB',
    modified: '2024-01-15',
    fileType: 'PDF Document',
    parentPath: '',
  },
  {
    id: '4',
    name: 'Ibadan_Budget_Analysis.xlsx',
    type: 'file',
    size: '1.9 MB',
    modified: '2024-01-14',
    fileType: 'Excel Spreadsheet',
    parentPath: '',
  },
  {
    id: '5',
    name: 'Port_Harcourt_Meeting_Notes.docx',
    type: 'file',
    size: '520 KB',
    modified: '2024-01-13',
    fileType: 'Word Document',
    parentPath: '',
  },
  {
    id: '6',
    name: 'Enugu_Market_Research.pptx',
    type: 'file',
    size: '4.2 MB',
    modified: '2024-01-12',
    fileType: 'PowerPoint Presentation',
    parentPath: '',
  },
  // Folder contents for Lagos_Project_Documents
  {
    id: '7',
    name: 'Contract_Agreement.pdf',
    type: 'file',
    size: '1.2 MB',
    modified: '2024-01-10',
    fileType: 'PDF Document',
    parentPath: 'Lagos_Project_Documents',
  },
  {
    id: '8',
    name: 'Financial_Report.xlsx',
    type: 'file',
    size: '890 KB',
    modified: '2024-01-09',
    fileType: 'Excel Spreadsheet',
    parentPath: 'Lagos_Project_Documents',
  },
  // Folder contents for Abuja_Conference_Images
  {
    id: '9',
    name: 'Conference_Photo_1.jpg',
    type: 'file',
    size: '2.1 MB',
    modified: '2024-01-08',
    fileType: 'JPEG Image',
    parentPath: 'Abuja_Conference_Images',
  },
  {
    id: '10',
    name: 'Speaker_Presentation.png',
    type: 'file',
    size: '1.5 MB',
    modified: '2024-01-08',
    fileType: 'PNG Image',
    parentPath: 'Abuja_Conference_Images',
  },
];

export const useFileStorage = () => {
  const [files, setFiles] = useState<FileItem[]>([]);

  // Load data from localStorage on mount
  useEffect(() => {
    const savedData = localStorage.getItem(STORAGE_KEY);
    if (savedData) {
      setFiles(JSON.parse(savedData));
    } else {
      setFiles(initialData);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(initialData));
    }
  }, []);

  // Save to localStorage whenever files change
  useEffect(() => {
    if (files.length > 0) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(files));
    }
  }, [files]);

  const addFile = (file: Omit<FileItem, 'id' | 'modified'>) => {
    const newFile: FileItem = {
      ...file,
      id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      modified: new Date().toISOString().split('T')[0],
    };
    setFiles(prev => [...prev, newFile]);
    return newFile;
  };

  const addFolder = (name: string, parentPath: string = '') => {
    const newFolder: FileItem = {
      id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      name,
      type: 'folder',
      modified: new Date().toISOString().split('T')[0],
      parentPath,
    };
    setFiles(prev => [...prev, newFolder]);
    return newFolder;
  };

  const deleteFile = (id: string) => {
    setFiles(prev => prev.filter(file => file.id !== id));
  };

  const updateFile = (id: string, updates: Partial<Omit<FileItem, 'id'>>) => {
    setFiles(prev => prev.map(file => 
      file.id === id 
        ? { ...file, ...updates, modified: new Date().toISOString().split('T')[0] }
        : file
    ));
  };

  const sortFiles = (files: FileItem[], sortBy: 'name' | 'modified' | 'size', sortOrder: 'asc' | 'desc') => {
    return [...files].sort((a, b) => {
      // Always put folders first
      if (a.type === 'folder' && b.type === 'file') return -1;
      if (a.type === 'file' && b.type === 'folder') return 1;
      
      let comparison = 0;
      switch (sortBy) {
        case 'name':
          comparison = a.name.localeCompare(b.name);
          break;
        case 'modified':
          comparison = new Date(a.modified).getTime() - new Date(b.modified).getTime();
          break;
        case 'size': {
          const aSize = a.size ? parseFloat(a.size.replace(/[^\d.]/g, '')) : 0;
          const bSize = b.size ? parseFloat(b.size.replace(/[^\d.]/g, '')) : 0;
          comparison = aSize - bSize;
          break;
        }
        default:
          comparison = 0;
      }
      
      return sortOrder === 'asc' ? comparison : -comparison;
    });
  };

  return {
    files,
    addFile,
    addFolder,
    deleteFile,
    updateFile,
    sortFiles,
  };
};