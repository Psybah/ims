import { ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface BreadcrumbItem {
  name: string;
  path: string;
}

interface BreadcrumbNavProps {
  items: BreadcrumbItem[];
  onNavigate: (path: string) => void;
}

export function BreadcrumbNav({ items, onNavigate }: BreadcrumbNavProps) {
  return (
    <nav className="flex items-center space-x-1 text-sm text-muted-foreground">
      <Button
        variant="ghost"
        size="sm"
        onClick={() => onNavigate('')}
        className="h-auto p-1 hover:bg-muted"
      >
        Home
      </Button>
      
      {items.map((item, index) => (
        <div key={item.path} className="flex items-center">
          <ChevronRight className="h-4 w-4 mx-1" />
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onNavigate(item.path)}
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