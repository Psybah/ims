import { useEffect, useState } from 'react';
import { Progress } from '@/components/ui/progress';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { X, Upload, CheckCircle, AlertCircle } from 'lucide-react';

interface UploadItem {
  id: string;
  name: string;
  size: number;
  progress: number;
  status: 'uploading' | 'completed' | 'error';
  error?: string;
}

interface UploadProgressProps {
  uploads: UploadItem[];
  onCancel: (id: string) => void;
  onDismiss: (id: string) => void;
}

export const UploadProgress = ({ uploads, onCancel, onDismiss }: UploadProgressProps) => {
  if (uploads.length === 0) return null;

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="fixed bottom-4 right-4 space-y-2 z-50 max-w-sm w-full">
      {uploads.map((upload) => (
        <Card key={upload.id} className="shadow-lg">
          <CardContent className="p-4">
            <div className="flex items-start justify-between space-x-3">
              <div className="flex items-center space-x-2 flex-1 min-w-0">
                {upload.status === 'uploading' && (
                  <Upload className="w-4 h-4 text-blue-500 animate-pulse flex-shrink-0" />
                )}
                {upload.status === 'completed' && (
                  <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                )}
                {upload.status === 'error' && (
                  <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0" />
                )}
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium truncate">{upload.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {formatFileSize(upload.size)}
                  </p>
                  {upload.status === 'error' && upload.error && (
                    <p className="text-xs text-red-500 mt-1">{upload.error}</p>
                  )}
                </div>
              </div>
              <Button
                size="sm"
                variant="ghost"
                className="h-6 w-6 p-0 flex-shrink-0"
                onClick={() => upload.status === 'uploading' ? onCancel(upload.id) : onDismiss(upload.id)}
              >
                <X className="w-3 h-3" />
              </Button>
            </div>
            
            {upload.status === 'uploading' && (
              <div className="mt-2 space-y-1">
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Uploading...</span>
                  <span>{upload.progress}%</span>
                </div>
                <Progress value={upload.progress} className="h-1" />
              </div>
            )}
            
            {upload.status === 'completed' && (
              <div className="mt-2">
                <div className="text-xs text-green-600">Upload completed</div>
                <Progress value={100} className="h-1 mt-1" />
              </div>
            )}
            
            {upload.status === 'error' && (
              <div className="mt-2">
                <div className="text-xs text-red-600">Upload failed</div>
                <Progress value={0} className="h-1 mt-1" />
              </div>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
};