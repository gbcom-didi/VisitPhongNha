import { useState } from 'react';
import { Search, MapPin } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { BusinessCard } from '@/components/ui/business-card';
import { CategoryFilters } from './category-filters';
import type { BusinessWithCategory, Category } from '@shared/schema';

interface BusinessDirectoryProps {
  businesses: BusinessWithCategory[];
  categories: Category[];
  onBusinessClick?: (business: BusinessWithCategory) => void;
  onBusinessLike?: (business: BusinessWithCategory) => void;
  onBusinessHover?: (business: BusinessWithCategory) => void;
  selectedCategory: number | null;
  onCategoryChange: (categoryId: number | null) => void;
}

export function BusinessDirectory({ 
  businesses, 
  categories, 
  onBusinessClick, 
  onBusinessLike,
  onBusinessHover,
  selectedCategory,
  onCategoryChange
}: BusinessDirectoryProps) {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredBusinesses = businesses.filter((business) => {
    const matchesSearch = business.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         business.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         business.category?.name.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesSearch;
  });

  return (
    <div className="h-full bg-white flex flex-col md:h-screen">
      {/* Header */}
      <div className="p-4 border-b border-gray-200 bg-white sticky top-0 z-10 md:static">
        <h2 className="text-lg font-semibold text-gray-900 mb-3 font-questrial">Explore Ninh Thuan</h2>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            type="text"
            placeholder="Search places..."
            className="pl-10 pr-4"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Category Filters */}
      <CategoryFilters
        categories={categories}
        selectedCategory={selectedCategory}
        onCategoryChange={onCategoryChange}
      />

      {/* Results Count */}
      <div className="px-4 py-2 bg-gray-50 border-b border-gray-200">
        <p className="text-sm text-gray-600">
          {filteredBusinesses.length} {filteredBusinesses.length === 1 ? 'place' : 'places'} found
        </p>
      </div>

      {/* Business Listings */}
      <div className="flex-1 overflow-y-auto md:max-h-none max-h-[50vh]">
        <div className="divide-y divide-gray-100">
          {filteredBusinesses.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              <MapPin className="w-12 h-12 mx-auto mb-4 text-gray-300" />
              <p className="text-lg font-medium mb-2">No places found</p>
              <p className="text-sm">Try adjusting your search or filters</p>
            </div>
          ) : (
            filteredBusinesses.map((business) => (
              <BusinessCard
                key={business.id}
                business={business}
                onClick={onBusinessClick}
                onLike={onBusinessLike}
                onHover={onBusinessHover}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
}