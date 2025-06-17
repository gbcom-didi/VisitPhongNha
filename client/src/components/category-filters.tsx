import { Button } from '@/components/ui/button';
import type { Category } from '@shared/schema';

interface CategoryFiltersProps {
  categories: Category[];
  selectedCategory: number | null;
  onCategoryChange: (categoryId: number | null) => void;
}

export function CategoryFilters({ categories, selectedCategory, onCategoryChange }: CategoryFiltersProps) {
  return (
    <div className="p-4 border-b border-gray-200">
      <div className="flex flex-wrap gap-2">
        <Button
          size="sm"
          variant={selectedCategory === null ? "default" : "outline"}
          className={selectedCategory === null 
            ? "bg-chili-red text-white hover:bg-red-600" 
            : "bg-gray-100 text-gray-700 hover:bg-gray-200"
          }
          onClick={() => onCategoryChange(null)}
        >
          All
        </Button>
        
        {categories.map((category) => (
          <Button
            key={category.id}
            size="sm"
            variant={selectedCategory === category.id ? "default" : "outline"}
            className={selectedCategory === category.id
              ? "text-white hover:opacity-90"
              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }
            style={selectedCategory === category.id ? {
              backgroundColor: category.color,
              borderColor: category.color
            } : {}}
            onClick={() => onCategoryChange(category.id)}
          >
            {category.name}
          </Button>
        ))}
      </div>
    </div>
  );
}
