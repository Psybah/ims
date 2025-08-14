import { ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { BreadcrumbItem } from '@/lib/types';

interface BreadcrumbNavProps {
  items: BreadcrumbItem[];
  onNavigate: (path: string) => void;
}

export function BreadcrumbNav({ items, onNavigate }: BreadcrumbNavProps) {
  return (
    <nav className="flex items-center space-x-1 text-sm mb-4">
      {items.map((item, index) => (
        <div key={item.id || 'root'} className="flex items-center">
          {index > 0 && <ChevronRight className="h-4 w-4 mx-1 text-muted-foreground" />}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onNavigate(item.id === null ? '/' : item.id)}
            className={`h-auto p-1 font-medium ${
              index === items.length - 1 
                ? 'text-primary hover:text-primary/80' 
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            {item.name}
          </Button>
        </div>
      ))}
    </nav>
  );
}