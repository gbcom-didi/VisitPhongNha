
import { X } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import type { Category } from '@shared/schema';

interface FilterDialogProps {
  isOpen: boolean;
  onClose: () => void;
  categories: Category[];
  selectedCategory: number | null;
  onCategoryChange: (categoryId: number | null) => void;
  selectedTags?: string[];
  onTagsChange?: (tags: string[]) => void;
}

export function FilterDialog({
  isOpen,
  onClose,
  categories,
  selectedCategory,
  onCategoryChange,
  selectedTags = [],
  onTagsChange
}: FilterDialogProps) {
  const handleCategorySelect = (categoryId: number | null) => {
    onCategoryChange(categoryId);
    // If "All" is selected, also clear tags and URL parameters
    if (categoryId === null) {
      if (onTagsChange) {
        onTagsChange([]);
      }
      // Clear URL parameters by navigating to clean /explore path
      window.history.replaceState({}, '', '/explore');
    }
  };

  

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center text-xl font-semibold">Filters</DialogTitle>
        </DialogHeader>
        
        <div className="py-2 max-h-96 overflow-y-auto">
          <h3 className="text-lg font-semibold mb-4 text-gray-900">Categories</h3>
          
          <div className="space-y-3">
            {/* All Categories */}
            <Button
              variant={selectedCategory === null && selectedTags.length === 0 ? "default" : "outline"}
              className={`w-full justify-start h-8 text-left text-sm ${
                selectedCategory === null && selectedTags.length === 0
                  ? "bg-mango-yellow hover:bg-mango-yellow/90 text-white border-mango-yellow" 
                  : "border-gray-200 hover:bg-gray-50"
              }`}
              onClick={() => handleCategorySelect(null)}
            >
              All
            </Button>

            {/* Category Grid */}
            <div className="grid grid-cols-2 gap-1.5">
              {categories.map((category) => {
                const isSelected = selectedCategory === category.id;
                return (
                  <Button
                    key={category.id}
                    variant={isSelected ? "default" : "outline"}
                    className={`justify-start h-8 text-left text-sm px-2 ${
                      isSelected 
                        ? "bg-mango-yellow hover:bg-mango-yellow/90 text-white border-mango-yellow" 
                        : "border-gray-200 hover:bg-gray-50"
                    }`}
                    onClick={() => handleCategorySelect(category.id)}
                  >
                    <span className="truncate text-xs">{category.name}</span>
                  </Button>
                );
              })}
            </div>
          </div>
        </div>

        
      </DialogContent>
    </Dialog>
  );
}

function getCategoryIcon(slug: string): string {
  const iconMap: Record<string, string> = {
    'kiting': '🪁',
    'food-drink': '🍽',
    'street-food': '🍜',
    'accommodation': '🏠',
    'transport': '🚗',
    'activities': '⚡',
    'shopping': '🛒',
    'health': '⚕',
    'education': '📚',
    'entertainment': '🎪',
    'services': '🔧',
    'atm': '💳',
    'beaches': '🏖',
    'temples': '🏛',
    'nature': '🌲',
    'landmarks': '🗿',
    'cuisine': '🍴',
    'vineyards': '🍇',
    'historic-sites': '🏺'
  };
  
  return iconMap[slug] || '📍';
}
