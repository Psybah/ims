import { ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { BreadcrumbItem } from '@/lib/types';

interface BreadcrumbNavProps {
  items: BreadcrumbItem[];
  onNavigate: (path: string) => void;
}

export function BreadcrumbNav({ items, onNavigate }: BreadcrumbNavProps) {
  return (
    <nav className="flex items-center space-x-1 text-sm text-muted-foreground">
      {items.map((item, index) => (
        <div key={item.id || 'root'} className="flex items-center">
          {index > 0 && <ChevronRight className="h-4 w-4 mx-1" />}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onNavigate(item.id === null ? '/' : item.id)}
            className={`h-auto p-1 hover:bg-muted ${
              index === items.length - 1
                ? 'text-foreground font-medium'
                : 'text-muted-foreground'
            }`}
          >
            {item.name}
          </Button>
        </div>
      ))}
    </nav>
  );
}