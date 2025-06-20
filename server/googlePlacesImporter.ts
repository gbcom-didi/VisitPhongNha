import { storage } from './storage';

interface PlaceDetails {
  place_id: string;
  name: string;
  formatted_address?: string;
  formatted_phone_number?: string;
  website?: string;
  rating?: number;
  user_ratings_total?: number;
  photos?: Array<{ photo_reference: string; width: number; height: number }>;
  opening_hours?: {
    open_now: boolean;
    periods: Array<{
      open: { day: number; time: string };
      close?: { day: number; time: string };
    }>;
    weekday_text: string[];
  };
  price_level?: number;
  types?: string[];
  geometry?: {
    location: { lat: number; lng: number };
  };
  reviews?: Array<{
    author_name: string;
    rating: number;
    text: string;
    time: number;
  }>;
  international_phone_number?: string;
  url?: string;
}

class GooglePlacesImporter {
  private apiKey: string;
  private baseUrl = 'https://maps.googleapis.com/maps/api/place';

  constructor() {
    this.apiKey = process.env.GOOGLE_PLACES_API_KEY!;
    if (!this.apiKey) {
      throw new Error('GOOGLE_PLACES_API_KEY is required');
    }
  }

  async searchPlace(businessName: string, location: string = "Phan Rang, Vietnam"): Promise<string | null> {
    try {
      // Try multiple search variations for better matching
      const searchQueries = [
        `${businessName} ${location}`,
        `${businessName} Ninh Thuan Vietnam`,
        `${businessName} Phan Rang Ninh Thuan`,
        businessName, // Try just the business name
      ];

      for (const query of searchQueries) {
        const searchUrl = `${this.baseUrl}/textsearch/json?query=${encodeURIComponent(query)}&key=${this.apiKey}`;
        
        const response = await fetch(searchUrl);
        const data = await response.json();

        if (data.status === 'OK' && data.results?.length > 0) {
          // Filter results to prioritize those in Vietnam or with relevant location
          const vietnamResults = data.results.filter((result: any) => 
            result.formatted_address?.includes('Vietnam') ||
            result.formatted_address?.includes('Ninh Thuan') ||
            result.formatted_address?.includes('Phan Rang')
          );
          
          if (vietnamResults.length > 0) {
            return vietnamResults[0].place_id;
          }
          
          // Fallback to first result if no Vietnam-specific results
          return data.results[0].place_id;
        }
      }
      
      return null;
    } catch (error) {
      console.error(`Error searching for ${businessName}:`, error);
      return null;
    }
  }

  async getPlaceDetails(placeId: string): Promise<PlaceDetails | null> {
    try {
      const fields = [
        'place_id', 'name', 'formatted_address', 'formatted_phone_number',
        'international_phone_number', 'website', 'rating', 'user_ratings_total',
        'photos', 'opening_hours', 'price_level', 'types', 'geometry',
        'reviews', 'url'
      ].join(',');

      const detailsUrl = `${this.baseUrl}/details/json?place_id=${placeId}&fields=${fields}&key=${this.apiKey}`;
      
      const response = await fetch(detailsUrl);
      const data = await response.json();

      if (data.status === 'OK' && data.result) {
        return data.result;
      }
      return null;
    } catch (error) {
      console.error(`Error getting details for place ${placeId}:`, error);
      return null;
    }
  }

  getPhotoUrl(photoReference: string, maxWidth: number = 800): string {
    return `${this.baseUrl}/photo?maxwidth=${maxWidth}&photoreference=${photoReference}&key=${this.apiKey}`;
  }

  mapPriceLevelToRange(priceLevel?: number): string {
    switch (priceLevel) {
      case 0: return '$';
      case 1: return '$';
      case 2: return '$$';
      case 3: return '$$$';
      case 4: return '$$$$';
      default: return '$$';
    }
  }

  extractOperatingHours(openingHours?: any): any {
    if (!openingHours?.weekday_text) return null;
    
    const hours: any = {};
    const dayNames = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
    
    openingHours.weekday_text.forEach((dayText: string, index: number) => {
      const dayName = dayNames[index];
      if (dayText.includes('Closed')) {
        hours[dayName] = 'Closed';
      } else {
        const timeMatch = dayText.match(/(\d{1,2}:\d{2}\s?[AP]M)\s*–\s*(\d{1,2}:\d{2}\s?[AP]M)/);
        if (timeMatch) {
          hours[dayName] = `${timeMatch[1]} - ${timeMatch[2]}`;
        }
      }
    });
    
    return Object.keys(hours).length > 0 ? hours : null;
  }

  extractAmenities(types?: string[]): string[] {
    if (!types) return [];
    
    const amenityMap: Record<string, string> = {
      'wifi': 'Free WiFi',
      'parking': 'Parking Available',
      'wheelchair_accessible': 'Wheelchair Accessible',
      'air_conditioning': 'Air Conditioning',
      'outdoor_seating': 'Outdoor Seating',
      'takeout': 'Takeout Available',
      'delivery': 'Delivery Available',
      'credit_cards': 'Credit Cards Accepted',
      'restroom': 'Restrooms',
      'family_friendly': 'Family Friendly'
    };

    return types
      .filter(type => amenityMap[type])
      .map(type => amenityMap[type]);
  }

  async updateBusinessWithGoogleData(businessId: number, businessName: string): Promise<boolean> {
    try {
      console.log(`Fetching Google data for: ${businessName}`);
      
      // Search for the place
      const placeId = await this.searchPlace(businessName);
      if (!placeId) {
        console.log(`No place found for: ${businessName}`);
        return false;
      }

      // Get detailed information
      const placeDetails = await this.getPlaceDetails(placeId);
      if (!placeDetails) {
        console.log(`No details found for: ${businessName}`);
        return false;
      }

      // Prepare update data
      const updateData: any = {};

      // Basic information
      if (placeDetails.formatted_address) {
        updateData.address = placeDetails.formatted_address;
      }

      if (placeDetails.formatted_phone_number || placeDetails.international_phone_number) {
        updateData.phone = placeDetails.formatted_phone_number || placeDetails.international_phone_number;
      }

      if (placeDetails.website) {
        updateData.website = placeDetails.website;
      }

      // Location coordinates
      if (placeDetails.geometry?.location) {
        updateData.latitude = placeDetails.geometry.location.lat;
        updateData.longitude = placeDetails.geometry.location.lng;
      }

      // Rating and reviews
      if (placeDetails.rating) {
        updateData.rating = placeDetails.rating;
      }

      // Price range
      if (placeDetails.price_level !== undefined) {
        updateData.priceRange = this.mapPriceLevelToRange(placeDetails.price_level);
      }

      // Operating hours
      const operatingHours = this.extractOperatingHours(placeDetails.opening_hours);
      if (operatingHours) {
        updateData.operatingHours = operatingHours;
      }

      // Gallery - get up to 10 photos
      if (placeDetails.photos && placeDetails.photos.length > 0) {
        const gallery = placeDetails.photos
          .slice(0, 10)
          .map(photo => this.getPhotoUrl(photo.photo_reference, 800));
        updateData.gallery = gallery;
        
        // Set the first photo as the main image if not already set
        updateData.imageUrl = gallery[0];
      }

      // Amenities based on place types
      const amenities = this.extractAmenities(placeDetails.types);
      if (amenities.length > 0) {
        updateData.amenities = amenities;
      }

      // Tags based on place types
      if (placeDetails.types) {
        const tags = placeDetails.types
          .filter(type => !type.includes('establishment') && !type.includes('point_of_interest'))
          .map(type => type.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()))
          .slice(0, 5);
        updateData.tags = tags;
      }

      // Google Maps URL
      if (placeDetails.url) {
        updateData.directionsUrl = placeDetails.url;
      }

      // Mark as verified since it's from Google
      updateData.isVerified = true;

      // Update the business
      await storage.updateBusiness(businessId, updateData);
      
      console.log(`Successfully updated ${businessName} with Google data`);
      return true;

    } catch (error) {
      console.error(`Error updating business ${businessName}:`, error);
      return false;
    }
  }

  async importAllBusinesses(): Promise<void> {
    try {
      console.log('Starting Google Places import for all businesses...');
      
      const businesses = await storage.getBusinesses();
      console.log(`Found ${businesses.length} businesses to update`);

      let successCount = 0;
      let errorCount = 0;

      // Focus on businesses more likely to be found in Google Places
      const priorityBusinesses = [
        'Amanoi', 'Ninh Chu beach', 'Phan Rang Market', 'Ninh Thuan Hospital',
        'Ninh Thuận Museum', 'ANARA Binh Tien Golf Club', 'Khu du lịch Hang Rái'
      ];

      // Try priority businesses first
      for (const business of businesses) {
        try {
          // Add delay to respect API rate limits
          await new Promise(resolve => setTimeout(resolve, 200));
          
          const success = await this.updateBusinessWithGoogleData(business.id, business.name);
          if (success) {
            successCount++;
            console.log(`✓ Successfully updated: ${business.name}`);
          } else {
            errorCount++;
            console.log(`✗ Failed to find: ${business.name}`);
          }
        } catch (error) {
          console.error(`Failed to update ${business.name}:`, error);
          errorCount++;
        }

        // Stop after processing 20 businesses to avoid timeout
        if (successCount + errorCount >= 20) {
          console.log('Stopping after 20 businesses to avoid timeout...');
          break;
        }
      }

      console.log(`Import completed: ${successCount} successful, ${errorCount} failed`);
    } catch (error) {
      console.error('Error in importAllBusinesses:', error);
    }
  }
}

export const googlePlacesImporter = new GooglePlacesImporter();