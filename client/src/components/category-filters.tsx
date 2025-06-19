import { Button } from '@/components/ui/button';
import type { Category } from '@shared/schema';

interface CategoryFiltersProps {
  categories: Category[];
  selectedCategory: number | null;
  onCategoryChange: (categoryId: number | null) => void;
}

export function CategoryFilters({ categories, selectedCategory, onCategoryChange }: CategoryFiltersProps) {
  return (
    <div className="px-4 py-2 border-b border-gray-200 bg-gray-50">
      <div className="flex flex-wrap gap-1">
        <Button
          variant={selectedCategory === null ? "default" : "outline"}
          size="sm"
          onClick={() => onCategoryChange(null)}
          className={`h-7 px-3 text-xs ${selectedCategory === null ? "bg-tropical-aqua hover:bg-tropical-aqua/90" : ""}`}
        >
          All
        </Button>
        {categories.map((category) => (
          <Button
            key={category.id}
            variant={selectedCategory === category.id ? "default" : "outline"}
            size="sm"
            onClick={() => onCategoryChange(category.id)}
            className={`h-7 px-3 text-xs ${selectedCategory === category.id ? "bg-tropical-aqua hover:bg-tropical-aqua/90" : ""}`}
          >
            {category.name}
          </Button>
        ))}
      </div>
    </div>
  );
}