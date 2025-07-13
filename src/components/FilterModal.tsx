import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { SlidersHorizontal } from 'lucide-react';

interface FilterOptions {
  status?: string[];
  role?: string[];
  category?: string[];
  dateRange?: string;
  enabled?: boolean[];
}

interface FilterModalProps {
  type: 'users' | 'permissions' | 'files' | 'trash';
  onFilterApply: (filters: FilterOptions) => void;
  children?: React.ReactNode;
}

export const FilterModal = ({ type, onFilterApply, children }: FilterModalProps) => {
  const [open, setOpen] = useState(false);
  const [filters, setFilters] = useState<FilterOptions>({});

  const handleApplyFilters = () => {
    onFilterApply(filters);
    setOpen(false);
  };

  const handleClearFilters = () => {
    setFilters({});
    onFilterApply({});
    setOpen(false);
  };

  const renderUserFilters = () => (
    <>
      <div className="space-y-3">
        <Label>Status</Label>
        <div className="space-y-2">
          {['Active', 'Inactive', 'Suspended'].map((status) => (
            <div key={status} className="flex items-center space-x-2">
              <Checkbox
                id={`status-${status}`}
                checked={filters.status?.includes(status) || false}
                onCheckedChange={(checked) => {
                  if (checked) {
                    setFilters(prev => ({
                      ...prev,
                      status: [...(prev.status || []), status]
                    }));
                  } else {
                    setFilters(prev => ({
                      ...prev,
                      status: prev.status?.filter(s => s !== status) || []
                    }));
                  }
                }}
              />
              <Label htmlFor={`status-${status}`}>{status}</Label>
            </div>
          ))}
        </div>
      </div>
      <div className="space-y-3">
        <Label>Role</Label>
        <div className="space-y-2">
          {['Admin', 'Moderator', 'User'].map((role) => (
            <div key={role} className="flex items-center space-x-2">
              <Checkbox
                id={`role-${role}`}
                checked={filters.role?.includes(role) || false}
                onCheckedChange={(checked) => {
                  if (checked) {
                    setFilters(prev => ({
                      ...prev,
                      role: [...(prev.role || []), role]
                    }));
                  } else {
                    setFilters(prev => ({
                      ...prev,
                      role: prev.role?.filter(r => r !== role) || []
                    }));
                  }
                }}
              />
              <Label htmlFor={`role-${role}`}>{role}</Label>
            </div>
          ))}
        </div>
      </div>
    </>
  );

  const renderPermissionFilters = () => (
    <>
      <div className="space-y-3">
        <Label>Category</Label>
        <div className="space-y-2">
          {['File Management', 'Collaboration', 'Administration', 'Security'].map((category) => (
            <div key={category} className="flex items-center space-x-2">
              <Checkbox
                id={`category-${category}`}
                checked={filters.category?.includes(category) || false}
                onCheckedChange={(checked) => {
                  if (checked) {
                    setFilters(prev => ({
                      ...prev,
                      category: [...(prev.category || []), category]
                    }));
                  } else {
                    setFilters(prev => ({
                      ...prev,
                      category: prev.category?.filter(c => c !== category) || []
                    }));
                  }
                }}
              />
              <Label htmlFor={`category-${category}`}>{category}</Label>
            </div>
          ))}
        </div>
      </div>
      <div className="space-y-3">
        <Label>Status</Label>
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="enabled"
              checked={filters.enabled?.includes(true) || false}
              onCheckedChange={(checked) => {
                if (checked) {
                  setFilters(prev => ({
                    ...prev,
                    enabled: [...(prev.enabled || []), true]
                  }));
                } else {
                  setFilters(prev => ({
                    ...prev,
                    enabled: prev.enabled?.filter(e => e !== true) || []
                  }));
                }
              }}
            />
            <Label htmlFor="enabled">Enabled</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="disabled"
              checked={filters.enabled?.includes(false) || false}
              onCheckedChange={(checked) => {
                if (checked) {
                  setFilters(prev => ({
                    ...prev,
                    enabled: [...(prev.enabled || []), false]
                  }));
                } else {
                  setFilters(prev => ({
                    ...prev,
                    enabled: prev.enabled?.filter(e => e !== false) || []
                  }));
                }
              }}
            />
            <Label htmlFor="disabled">Disabled</Label>
          </div>
        </div>
      </div>
    </>
  );

  const renderDateFilter = () => (
    <div className="space-y-3">
      <Label>Date Range</Label>
      <Select
        value={filters.dateRange || ''}
        onValueChange={(value) => setFilters(prev => ({ ...prev, dateRange: value }))}
      >
        <SelectTrigger>
          <SelectValue placeholder="Select date range" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="today">Today</SelectItem>
          <SelectItem value="week">This Week</SelectItem>
          <SelectItem value="month">This Month</SelectItem>
          <SelectItem value="year">This Year</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children || (
          <Button variant="outline" size="sm">
            <SlidersHorizontal className="w-4 h-4 mr-2" />
            Filter
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Filter Options</DialogTitle>
          <DialogDescription>
            Apply filters to refine your search results.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-6 py-4">
          {type === 'users' && renderUserFilters()}
          {type === 'permissions' && renderPermissionFilters()}
          {(type === 'files' || type === 'trash') && renderDateFilter()}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={handleClearFilters}>
            Clear All
          </Button>
          <Button onClick={handleApplyFilters}>
            Apply Filters
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};