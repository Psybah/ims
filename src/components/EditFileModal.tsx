import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { FileItem } from '@/hooks/useFileStorage';

interface EditFileModalProps {
  isOpen: boolean;
  onClose: () => void;
  file: FileItem | null;
  onSave: (fileId: string, updates: { name: string; description?: string }) => void;
}

export const EditFileModal: React.FC<EditFileModalProps> = ({
  isOpen,
  onClose,
  file,
  onSave,
}) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');

  useEffect(() => {
    if (file) {
      setName(file.name);
      setDescription(''); // Add description field to FileItem interface if needed
    }
  }, [file]);

  const handleSave = () => {
    if (file && name.trim()) {
      onSave(file.id, {
        name: name.trim(),
        description: description.trim()
      });
      onClose();
    }
  };

  const handleClose = () => {
    setName('');
    setDescription('');
    onClose();
  };

  if (!file) return null;

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            Edit {file.type === 'folder' ? 'Folder' : 'File'}
          </DialogTitle>
          <DialogDescription>
            Update the {file.type === 'folder' ? 'folder' : 'file'} details below.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Name
            </Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="col-span-3"
              placeholder={`Enter ${file.type} name`}
            />
          </div>
          <div className="grid grid-cols-4 items-start gap-4">
            <Label htmlFor="description" className="text-right mt-2">
              Description
            </Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="col-span-3"
              placeholder="Optional description"
              rows={3}
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={handleClose}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={!name.trim()}>
            Save Changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}; 