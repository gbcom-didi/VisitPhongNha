
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
}

export function FilterDialog({
  isOpen,
  onClose,
  categories,
  selectedCategory,
  onCategoryChange
}: FilterDialogProps) {
  const handleCategorySelect = (categoryId: number | null) => {
    onCategoryChange(categoryId);
  };

  const handleShowPlaces = () => {
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center text-xl font-semibold">Filters</DialogTitle>
        </DialogHeader>
        
        <div className="py-4">
          <h3 className="text-lg font-semibold mb-4 text-gray-900">Categories</h3>
          
          <div className="space-y-3">
            {/* All Categories */}
            <Button
              variant={selectedCategory === null ? "default" : "outline"}
              className={`w-full justify-start h-12 text-left ${
                selectedCategory === null 
                  ? "bg-gray-900 hover:bg-gray-800 text-white border-gray-900" 
                  : "border-gray-200 hover:bg-gray-50"
              }`}
              onClick={() => handleCategorySelect(null)}
            >
              <span className="mr-2">🌐</span>
              All
            </Button>

            {/* Category Grid */}
            <div className="grid grid-cols-2 gap-2">
              {categories.map((category) => {
                const isSelected = selectedCategory === category.id;
                return (
                  <Button
                    key={category.id}
                    variant={isSelected ? "default" : "outline"}
                    className={`justify-start h-12 text-left ${
                      isSelected 
                        ? "bg-gray-900 hover:bg-gray-800 text-white border-gray-900" 
                        : "border-gray-200 hover:bg-gray-50"
                    }`}
                    onClick={() => handleCategorySelect(category.id)}
                  >
                    <span className="mr-2">
                      {getCategoryIcon(category.slug)}
                    </span>
                    <span className="truncate">{category.name}</span>
                  </Button>
                );
              })}
            </div>
          </div>
        </div>

        <div className="pt-4 border-t">
          <Button
            onClick={handleShowPlaces}
            className="w-full bg-gray-900 hover:bg-gray-800 text-white h-12 text-base font-medium"
          >
            Show places
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function getCategoryIcon(slug: string): string {
  const iconMap: Record<string, string> = {
    'kiting': '🪁',
    'food-drink': '🍜',
    'accommodation': '🏨',
    'transport': '🚗',
    'activities': '🎯',
    'shopping': '🛍️',
    'health': '🏥',
    'education': '🎓',
    'entertainment': '🎭',
    'services': '🔧',
    'atm': '💳',
    'beaches': '🏖️',
    'temples': '🏛️',
    'nature': '🌿',
    'landmarks': '🏛️',
    'cuisine': '🍽️',
    'vineyards': '🍇',
    'historic-sites': '🏛️'
  };
  
  return iconMap[slug] || '📍';
}
