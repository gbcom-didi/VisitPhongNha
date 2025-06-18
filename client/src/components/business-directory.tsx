
import { useState } from 'react';
import { Search, MapPin, Filter } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { BusinessCard } from '@/components/ui/business-card';
import { FilterDialog } from './filter-dialog';
import type { BusinessWithCategory, Category } from '@shared/schema';

interface BusinessDirectoryProps {
  businesses: BusinessWithCategory[];
  categories: Category[];
  onBusinessClick?: (business: BusinessWithCategory) => void;
  onBusinessLike?: (business: BusinessWithCategory) => void;
  onBusinessHover?: (business: BusinessWithCategory) => void;
  onBusinessLeave?: () => void;
  selectedCategory: number | null;
  onCategoryChange: (categoryId: number | null) => void;
}

export function BusinessDirectory({ 
  businesses, 
  categories, 
  onBusinessClick, 
  onBusinessLike,
  onBusinessHover,
  onBusinessLeave,
  selectedCategory,
  onCategoryChange
}: BusinessDirectoryProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [isFilterDialogOpen, setIsFilterDialogOpen] = useState(false);

  const filteredBusinesses = businesses.filter((business) => {
    const matchesSearch = business.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         business.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         business.category?.name.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesSearch;
  });

  const selectedCategoryName = selectedCategory 
    ? categories.find(cat => cat.id === selectedCategory)?.name 
    : null;

  const handleFilterChange = (categoryId: number | null) => {
    onCategoryChange(categoryId);
    setIsFilterDialogOpen(false);
  };

  return (
    <div className="h-full bg-white flex flex-col md:h-screen">
      {/* Header */}
      <div className="p-4 border-b border-gray-200 bg-white sticky top-0 z-10 md:static">        
        {/* Search and Filter Row */}
        <div className="flex gap-2 mb-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              type="text"
              placeholder="Search places..."
              className="pl-10 pr-4 h-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Button
            variant="outline"
            onClick={() => setIsFilterDialogOpen(true)}
            className="flex items-center gap-2 px-4 h-8"
          >
            <Filter className="w-4 h-4" />
            Filters
          </Button>
        </div>

        {/* Horizontal Filter Buttons */}
        <div className="flex gap-1 overflow-x-auto pb-2 scrollbar-hide">
          <Button
            variant={selectedCategory === null ? "default" : "outline"}
            size="sm"
            onClick={() => onCategoryChange(null)}
            className={`h-6 px-2 text-xs whitespace-nowrap flex-shrink-0 min-w-fit ${
              selectedCategory === null ? "bg-chili-red hover:bg-red-600 text-white" : ""
            }`}
          >
            All
          </Button>
          {categories.map((category) => (
            <Button
              key={category.id}
              variant={selectedCategory === category.id ? "default" : "outline"}
              size="sm"
              onClick={() => onCategoryChange(category.id)}
              className={`h-6 px-2 text-xs whitespace-nowrap flex-shrink-0 min-w-fit ${
                selectedCategory === category.id ? "bg-chili-red hover:bg-red-600 text-white" : ""
              }`}
            >
              {category.name}
            </Button>
          ))}
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsFilterDialogOpen(true)}
            className="h-6 px-2 text-xs whitespace-nowrap flex-shrink-0 min-w-fit"
          >
            Filters
          </Button>
        </div>
      </div>

      {/* Results Count */}
      <div className="px-4 py-2 bg-gray-50 border-b border-gray-200">
        <p className="text-xs text-gray-600">
          {filteredBusinesses.length} {filteredBusinesses.length === 1 ? 'place' : 'places'} found
          {selectedCategoryName && (
            <span className="ml-1">
              • Filtered by <span className="font-medium">{selectedCategoryName}</span>
            </span>
          )}
        </p>
      </div>

      {/* Business Listings */}
      <div className="flex-1 overflow-y-auto">
        {filteredBusinesses.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            <MapPin className="w-12 h-12 mx-auto mb-4 text-gray-300" />
            <p className="text-lg font-medium mb-2">No places found</p>
            <p className="text-sm">Try adjusting your search or filters</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4 p-4">
            {filteredBusinesses.map((business) => (
              <BusinessCard
                key={business.id}
                business={business}
                onClick={onBusinessClick}
                onLike={onBusinessLike}
                onHover={onBusinessHover}
                onLeave={onBusinessLeave}
              />
            ))}
          </div>
        )}
      </div>

      {/* Filter Dialog */}
      <FilterDialog
        isOpen={isFilterDialogOpen}
        onClose={() => setIsFilterDialogOpen(false)}
        categories={categories}
        selectedCategory={selectedCategory}
        onCategoryChange={handleFilterChange}
      />
    </div>
  );
}
