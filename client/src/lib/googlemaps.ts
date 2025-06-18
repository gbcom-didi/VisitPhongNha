export const GOOGLE_MAPS_CONFIG = {
  apiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY || '',
  center: { lat: 11.609051, lng: 109.146630 }, // Ninh Thuan coordinates
  zoom: 10,
  mapId: import.meta.env.VITE_GOOGLE_MAPS_MAP_ID || '',
};

// Interface for Google Places API data
export interface PlaceDetails {
  description?: string;
  rating?: number;
  user_ratings_total?: number;
  opening_hours?: {
    open_now?: boolean;
    weekday_text?: string[];
  };
  formatted_phone_number?: string;
  website?: string;
  photos?: Array<{
    photo_reference: string;
    height: number;
    width: number;
  }>;
}

// Function to search for a place and get its Place ID
export const searchPlaceByName = async (name: string, lat: number, lng: number): Promise<string | null> => {
  if (!window.google || !window.google.maps || !window.google.maps.places || !GOOGLE_MAPS_CONFIG.apiKey) {
    console.log('Google Maps Places API not available');
    return null;
  }

  try {
    const service = new google.maps.places.PlacesService(document.createElement('div'));
    
    return new Promise((resolve) => {
      const request = {
        query: name,
        location: new google.maps.LatLng(lat, lng),
        radius: 1000, // 1km radius
      };

      service.textSearch(request, (results, status) => {
        if (status === google.maps.places.PlacesServiceStatus.OK && results && results.length > 0) {
          resolve(results[0].place_id || null);
        } else {
          console.log(`Place search failed for ${name}: ${status}`);
          resolve(null);
        }
      });
    });
  } catch (error) {
    console.error('Error in searchPlaceByName:', error);
    return null;
  }
};

// Function to get detailed place information
export const getPlaceDetails = async (placeId: string): Promise<PlaceDetails | null> => {
  if (!window.google || !window.google.maps || !window.google.maps.places || !GOOGLE_MAPS_CONFIG.apiKey) {
    console.log('Google Maps Places API not available');
    return null;
  }

  try {
    const service = new google.maps.places.PlacesService(document.createElement('div'));
    
    return new Promise((resolve) => {
      const request = {
        placeId: placeId,
        fields: ['rating', 'user_ratings_total', 'opening_hours', 'formatted_phone_number', 'website', 'photos', 'editorial_summary']
      };

      service.getDetails(request, (place, status) => {
        if (status === google.maps.places.PlacesServiceStatus.OK && place) {
          resolve({
            description: place.editorial_summary?.overview,
            rating: place.rating,
            user_ratings_total: place.user_ratings_total,
            opening_hours: place.opening_hours,
            formatted_phone_number: place.formatted_phone_number,
            website: place.website,
            photos: place.photos?.map(photo => ({
              photo_reference: photo.photo_reference,
              height: photo.height,
              width: photo.width
            }))
          });
        } else {
          console.log(`Place details failed for ${placeId}: ${status}`);
          resolve(null);
        }
      });
    });
  } catch (error) {
    console.error('Error in getPlaceDetails:', error);
    return null;
  }
};

// Function to get photo URL from photo reference
export const getPhotoUrl = (photoReference: string, maxWidth: number = 400): string => {
  return `https://maps.googleapis.com/maps/api/place/photo?maxwidth=${maxWidth}&photoreference=${photoReference}&key=${GOOGLE_MAPS_CONFIG.apiKey}`;
};

export interface MapMarker {
  id: number;
  longitude: number;
  latitude: number;
  name: string;
  category: string;
  color: string;
}

export const getCategoryColor = (categorySlug: string): string => {
  const colorMap: Record<string, string> = {
    'stay': '#DDB097',
    'food-drink': '#F7BAAD',
    'kiting': '#3FC1C4',
    'surf': '#35949B',
    'things-to-do': '#A9D3D2',
    'atm': '#DD4327',
    'medical': '#DC2626',
    'market': '#059669',
    'supermarket': '#0891B2',
    'mechanic': '#7C3AED',
    'phone-repair': '#EA580C',
    'gym': '#BE185D',
    'massage': '#9333EA',
    'recreation': '#16A34A',
    'waterfall': '#0284C7',
    'attractions': '#C2410C',
    'pharmacy': '#DC2626',
    'mobile-phone': '#7C2D12',
  };

  return colorMap[categorySlug] || '#6B7280';
};