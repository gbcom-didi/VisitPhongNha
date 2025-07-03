import { db } from './db';
import { businesses, categories } from '@shared/schema';
import { eq, or } from 'drizzle-orm';

const GOOGLE_PLACES_API_KEY = process.env.VITE_GOOGLE_MAPS_API_KEY || process.env.GOOGLE_PLACES_API_KEY || 'AIzaSyB9BiGD__jK5zG6owJJVL37bqh_S-1wf34';
const PHONG_NHA_LOCATION = '17.5985,106.2636'; // Phong Nha coordinates
const SEARCH_RADIUS = 50000; // 50km radius

interface PlaceSearchResult {
  place_id: string;
  name: string;
  formatted_address: string;
  geometry: {
    location: {
      lat: number;
      lng: number;
    };
  };
  types: string[];
  business_status?: string;
}

interface PlaceDetailsResult {
  place_id: string;
  name: string;
  formatted_address: string;
  formatted_phone_number?: string;
  international_phone_number?: string;
  website?: string;
  url?: string;
  opening_hours?: {
    weekday_text: string[];
    open_now: boolean;
  };
  geometry: {
    location: {
      lat: number;
      lng: number;
    };
  };
  types: string[];
  rating?: number;
  user_ratings_total?: number;
  price_level?: number;
  photos?: Array<{
    photo_reference: string;
    height: number;
    width: number;
  }>;
  editorial_summary?: {
    overview: string;
  };
  reviews?: Array<{
    author_name: string;
    rating: number;
    text: string;
    time: number;
  }>;
}

// Business names from the CSV
const businessNames = [
  'A Trần - cơm gà xối mỡ',
  'Amanda Hotel Quảng Bình',
  'Aumori Hostel',
  'Balanha',
  'Bamboo\'s House',
  'Bánh khoái Tứ Quý',
  'Bao Ninh Beach',
  'Bao Ninh beach Resort',
  'BinBin Homestay Đồng Hới Quảng Bình',
  'Bún Bò Huế',
  'Casual beer restaurant',
  'Celina Peninsula Resort- Resort đẹp Quảng Bình',
  'Chạy Lập Farmstay',
  'Coffee Lyly 89',
  'Cối Xay Gió Homestay Quảng Bình',
  'Danh Lam Homestay(tân hoá.quảng bình)',
  'Dark Cave',
  'Dolphin Homestay',
  'Dozy Hostel',
  'Duy Tân Resort Quảng Bình',
  'East Hill - Phong Nha',
  'Elements Collection',
  'En Cave',
  'Fami Homestay',
  'Geminai Restaurant',
  'Genkan Vegan Cafe',
  'Gold Coast Hotel Resort & Spa',
  'GREEN RIVER',
  'Greenfield Homestay',
  'Ha Linh Restaurant',
  'Hải Âu Hotel and Apartment',
  'Hang Sơn Đoòng',
  'Hang Trạ Ang',
  'Hang Va Cave',
  'HiQ Villa',
  'Homestay hoàng dương',
  'Homestay Hùng Liên',
  'Hưng Phát Bungalow',
  'Jungalo Collection.',
  'Jungle Boss Trekking Tours Headquarters',
  'Karst Villas Phong Nha',
  'Khách sạn Trung Trầm',
  'Lena Homestay & Villa',
  'Lotus Restaurant - Phong Nha',
  'Lực Giáng',
  'Manli Resort',
  'Mê Công Cafe',
  'Melia Vinpearl Quảng Bình',
  'Mia\'s House',
  'Mộc Hoa Viên/Restaurant',
  'Mộc Nhiên Quán',
  'Monkey Bridge Farm',
  'Nam Long Plus hotel',
  'Nava Hotel & Resort',
  'Nem Lụi - Bún Thịt Nướng LyLy 1',
  'New Beach - OVAN',
  'Newlife Homestay( thiện tâm homestay)',
  'Nguyen Shack Retreat',
  'Nhà hàng Bình Thiên Đường',
  'Nhà hàng Chang My',
  'Nhà hàng Khánh Thuỷ',
  'Nhà Hàng Ngà Danh',
  'Nhà Hàng Phương Nam II',
  'Nhà Hàng Vườn Anh Tuấn',
  'Nhà nghỉ Đồi Sim',
  'Nhà vườn Thuyền Trưởng (The Captain\'s Garden House)',
  'Ninh Cottage',
  'Oxalis Adventure Tours',
  'Phong Nha - Ke Bang National Park',
  'Phong Nha Botanic Garden',
  'Phong Nha Dawn Homestay',
  'Phong Nha Escape Bungalow',
  'Phong Nha Farmstay',
  'Phong nha funky beach',
  'Phong Nha Motorbike tour',
  'Phong Nha Palafita Bungalow',
  'Pub with cold beer',
  'Quán Ăn 86 Tâm Thịnh Popular restaurant',
  'Regal Collection House',
  'RiverView HomeStay',
  'Rumba',
  'Sea Star Resort Quang Binh',
  'Sealand homestay',
  'Sun Spa Resort',
  'Sunflower Nhật Lệ',
  'SUSHI CÔ MO',
  'Tân Hóa Rural Homestay',
  'Thai Binh Street Food and Drink',
  'Thai Hoang Villa',
  'The Duck Stop',
  'The Duck Tang Farm Quang Binh',
  'Thien Truc Hotel',
  'Tú Làn Lodge',
  'TuTu\'s Homestay Phong Nha',
  'voco Quang Binh Resort by IHG',
  'Wildlife and Jungle Adventure - ECOFOOT',
  'Wyndham Quang Binh Golf & Beach Resort'
];

// Category mapping based on Google Places types
const categoryMapping: Record<string, string> = {
  // Accommodation
  'lodging': 'accommodation',
  'campground': 'accommodation',
  'rv_park': 'accommodation',
  
  // Food & Drink
  'restaurant': 'food-drink',
  'food': 'food-drink',
  'meal_takeaway': 'food-drink',
  'meal_delivery': 'food-drink',
  'cafe': 'food-drink',
  'bar': 'food-drink',
  'night_club': 'food-drink',
  'bakery': 'food-drink',
  
  // Street Food (if specified in business name)
  'street_food': 'street-food',
  
  // Attractions/Tours
  'tourist_attraction': 'attractions',
  'amusement_park': 'attractions',
  'aquarium': 'attractions',
  'art_gallery': 'attractions',
  'museum': 'attractions',
  'zoo': 'attractions',
  'park': 'attractions',
  'natural_feature': 'attractions',
  'establishment': 'attractions',
  'point_of_interest': 'attractions',
  'travel_agency': 'tours',
  
  // Recreation
  'gym': 'recreation',
  'spa': 'recreation',
  'beauty_salon': 'recreation',
  'hair_care': 'recreation',
  
  // Services
  'atm': 'atm',
  'bank': 'atm',
  'hospital': 'medical',
  'doctor': 'medical',
  'dentist': 'medical',
  'pharmacy': 'pharmacy',
  'supermarket': 'supermarket',
  'convenience_store': 'supermarket',
  'grocery_or_supermarket': 'supermarket',
  'shopping_mall': 'shopping',
  'clothing_store': 'shopping',
  'electronics_store': 'mobile-phone',
  'car_repair': 'mechanic',
  'gas_station': 'mechanic'
};

function mapGoogleTypesToCategory(types: string[], businessName: string): string {
  // Check business name for specific keywords
  const nameLower = businessName.toLowerCase();
  
  if (nameLower.includes('cave') || nameLower.includes('hang')) return 'caves';
  if (nameLower.includes('waterfall') || nameLower.includes('thác')) return 'waterfall';
  if (nameLower.includes('beach') || nameLower.includes('bãi biển')) return 'attractions';
  if (nameLower.includes('park') || nameLower.includes('vườn quốc gia')) return 'parks';
  if (nameLower.includes('tour') || nameLower.includes('adventure')) return 'tours';
  if (nameLower.includes('massage')) return 'massage';
  if (nameLower.includes('market') || nameLower.includes('chợ')) return 'market';
  if (nameLower.includes('street food') || nameLower.includes('bánh') || nameLower.includes('bún') || nameLower.includes('cơm')) return 'street-food';
  if (nameLower.includes('cafe') || nameLower.includes('coffee')) return 'cafe';
  
  // Map Google types to our categories
  for (const type of types) {
    if (categoryMapping[type]) {
      return categoryMapping[type];
    }
  }
  
  // Default fallback based on common patterns
  if (types.includes('lodging')) return 'accommodation';
  if (types.includes('restaurant') || types.includes('food')) return 'food-drink';
  if (types.includes('tourist_attraction')) return 'attractions';
  
  return 'attractions'; // Default fallback
}

function generateDescription(placeDetails: PlaceDetailsResult): string {
  if (placeDetails.editorial_summary?.overview) {
    return placeDetails.editorial_summary.overview;
  }
  
  const name = placeDetails.name;
  const types = placeDetails.types;
  const location = 'Phong Nha, Quang Binh Province';
  
  // Generate description based on types
  if (types.includes('lodging')) {
    return `${name} offers comfortable accommodation in ${location}. Experience authentic Vietnamese hospitality in this well-located property.`;
  } else if (types.includes('restaurant') || types.includes('food')) {
    return `${name} serves delicious local cuisine in ${location}. Enjoy authentic Vietnamese flavors and fresh ingredients.`;
  } else if (types.includes('tourist_attraction')) {
    return `${name} is a popular attraction in ${location}. Discover the natural beauty and cultural significance of this remarkable destination.`;
  } else if (types.includes('travel_agency')) {
    return `${name} provides expert tour services in ${location}. Explore the wonders of Phong Nha with experienced local guides.`;
  }
  
  return `${name} is located in ${location}. A quality establishment serving the local community and visitors.`;
}

export async function searchGooglePlaces(query: string): Promise<PlaceSearchResult[]> {
  try {
    console.log(`🔍 Searching Google Places for: "${query}"`);
    console.log(`🔑 Using API key: ${GOOGLE_PLACES_API_KEY?.substring(0, 10)}...`);
    
    // Use Text Search API with simplified query
    const searchQuery = encodeURIComponent(query + " Phong Nha Vietnam");
    const url = `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${searchQuery}&key=${GOOGLE_PLACES_API_KEY}`;
    
    console.log(`📡 API URL: ${url.replace(GOOGLE_PLACES_API_KEY, 'API_KEY_HIDDEN')}`);
    
    const response = await fetch(url);
    const data = await response.json();
    
    console.log(`📊 API Response status: ${data.status}`);
    if (data.error_message) {
      console.log(`❌ API Error message: ${data.error_message}`);
    }
    
    if (data.status !== 'OK') {
      console.log(`❌ Search failed for "${query}": ${data.status}`);
      if (data.status === 'REQUEST_DENIED') {
        throw new Error(`Google Places API REQUEST_DENIED: ${data.error_message || 'Check API key permissions and billing'}`);
      }
      return [];
    }
    
    console.log(`✅ Found ${data.results?.length || 0} results`);
    return data.results || [];
  } catch (error) {
    console.error(`❌ Error searching for "${query}":`, error);
    throw error;
  }
}

async function searchPlace(businessName: string): Promise<PlaceSearchResult | null> {
  try {
    const query = encodeURIComponent(`${businessName} Phong Nha Quang Binh Vietnam`);
    const url = `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${query}&location=${PHONG_NHA_LOCATION}&radius=${SEARCH_RADIUS}&key=${GOOGLE_PLACES_API_KEY}`;
    
    console.log(`🔍 Searching for: ${businessName}`);
    
    const response = await fetch(url);
    const data = await response.json();
    
    if (data.status !== 'OK') {
      console.log(`❌ Search failed for ${businessName}: ${data.status}`);
      return null;
    }
    
    if (data.results && data.results.length > 0) {
      console.log(`✅ Found ${businessName} with place_id: ${data.results[0].place_id}`);
      return data.results[0];
    }
    
    console.log(`⚠️ No results found for: ${businessName}`);
    return null;
  } catch (error) {
    console.error(`❌ Error searching for ${businessName}:`, error);
    return null;
  }
}

export async function getPlaceDetails(placeId: string): Promise<PlaceDetailsResult | null> {
  try {
    const fields = 'place_id,name,formatted_address,formatted_phone_number,international_phone_number,website,url,opening_hours,geometry,types,rating,user_ratings_total,photos,editorial_summary,reviews';
    const url = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&fields=${fields}&key=${GOOGLE_PLACES_API_KEY}`;
    
    const response = await fetch(url);
    const data = await response.json();
    
    if (data.status !== 'OK') {
      console.log(`❌ Details fetch failed for place_id ${placeId}: ${data.status}`);
      return null;
    }
    
    return data.result;
  } catch (error) {
    console.error(`❌ Error fetching details for place_id ${placeId}:`, error);
    return null;
  }
}

async function getPhotoUrl(photoReference: string, maxWidth: number = 1600): Promise<string> {
  return `https://maps.googleapis.com/maps/api/place/photo?maxwidth=${maxWidth}&photo_reference=${photoReference}&key=${GOOGLE_PLACES_API_KEY}`;
}

export async function getPlacePhotos(photos: Array<{photo_reference: string, height: number, width: number}> | undefined): Promise<string[]> {
  if (!photos || photos.length === 0) {
    return [];
  }
  
  const photoUrls: string[] = [];
  
  // Get up to 5 photos
  for (let i = 0; i < Math.min(photos.length, 5); i++) {
    const photoUrl = await getPhotoUrl(photos[i].photo_reference);
    photoUrls.push(photoUrl);
  }
  
  return photoUrls;
}

async function processPhotos(photos: Array<{photo_reference: string, height: number, width: number}> | undefined): Promise<{imageUrl: string, gallery: string[]}> {
  if (!photos || photos.length === 0) {
    return { imageUrl: '', gallery: [] };
  }
  
  const photoUrls: string[] = [];
  
  // Get up to 5 photos
  for (let i = 0; i < Math.min(photos.length, 5); i++) {
    const photoUrl = await getPhotoUrl(photos[i].photo_reference);
    photoUrls.push(photoUrl);
  }
  
  return {
    imageUrl: photoUrls[0] || '',
    gallery: photoUrls.slice(1) // Photos 2-5 for gallery
  };
}

async function getCategoryId(categorySlug: string): Promise<number> {
  try {
    const [category] = await db
      .select()
      .from(categories)
      .where(eq(categories.slug, categorySlug))
      .limit(1);
    
    if (category) {
      return category.id;
    }
    
    // If category doesn't exist, default to attractions
    const [defaultCategory] = await db
      .select()
      .from(categories)
      .where(eq(categories.slug, 'attractions'))
      .limit(1);
    
    return defaultCategory?.id || 1;
  } catch (error) {
    console.error('Error getting category ID:', error);
    return 1; // Default fallback
  }
}

async function saveBusiness(placeDetails: PlaceDetailsResult, businessName: string): Promise<void> {
  try {
    const category = mapGoogleTypesToCategory(placeDetails.types, businessName);
    const categoryId = await getCategoryId(category);
    const { imageUrl, gallery } = await processPhotos(placeDetails.photos);
    const description = generateDescription(placeDetails);
    
    // Check if business already exists
    const existingBusiness = await db
      .select()
      .from(businesses)
      .where(
        or(
          eq(businesses.name, placeDetails.name),
          eq(businesses.googleMapsUrl, placeDetails.url || '')
        )
      )
      .limit(1);
    
    const businessData = {
      name: placeDetails.name,
      description,
      latitude: placeDetails.geometry.location.lat.toString(),
      longitude: placeDetails.geometry.location.lng.toString(),
      address: placeDetails.formatted_address,
      phone: placeDetails.formatted_phone_number || placeDetails.international_phone_number || null,
      website: placeDetails.website || null,
      hours: placeDetails.opening_hours?.weekday_text?.join('; ') || null,
      imageUrl,
      gallery,
      categoryId,
      rating: placeDetails.rating?.toString() || null,
      reviewCount: placeDetails.user_ratings_total || 0,
      googleMapsUrl: placeDetails.url || null,
      isActive: true,
      isPremium: false,
      isVerified: true,
      isRecommended: false,
      tags: placeDetails.types.filter(type => !['establishment', 'point_of_interest'].includes(type)),
      reviews: placeDetails.reviews ? JSON.stringify(placeDetails.reviews.slice(0, 5)) : null
    };
    
    if (existingBusiness.length > 0) {
      console.log(`🔄 Updating existing business: ${placeDetails.name}`);
      await db
        .update(businesses)
        .set({
          ...businessData,
          updatedAt: new Date()
        })
        .where(eq(businesses.id, existingBusiness[0].id));
    } else {
      console.log(`➕ Creating new business: ${placeDetails.name}`);
      await db
        .insert(businesses)
        .values(businessData);
    }
    
    console.log(`✅ Saved business: ${placeDetails.name} (Category: ${category})`);
  } catch (error) {
    console.error(`❌ Error saving business ${placeDetails.name}:`, error);
  }
}

export async function importBusinesses(): Promise<void> {
  console.log('🚀 Starting Google Places import for 97 businesses...');
  console.log(`📍 Search area: Phong Nha, Quang Binh (${PHONG_NHA_LOCATION})`);
  
  let successCount = 0;
  let failCount = 0;
  
  for (let i = 0; i < businessNames.length; i++) {
    const businessName = businessNames[i];
    console.log(`\n📋 Processing ${i + 1}/${businessNames.length}: ${businessName}`);
    
    try {
      // Step 1: Search for the place
      const searchResult = await searchPlace(businessName);
      if (!searchResult) {
        failCount++;
        continue;
      }
      
      // Step 2: Get detailed information
      const placeDetails = await getPlaceDetails(searchResult.place_id);
      if (!placeDetails) {
        failCount++;
        continue;
      }
      
      // Step 3: Save to database
      await saveBusiness(placeDetails, businessName);
      successCount++;
      
      // Rate limiting - wait 100ms between requests
      await new Promise(resolve => setTimeout(resolve, 100));
      
    } catch (error) {
      console.error(`❌ Failed to process ${businessName}:`, error);
      failCount++;
    }
  }
  
  console.log('\n📊 Import Summary:');
  console.log(`✅ Successfully imported: ${successCount} businesses`);
  console.log(`❌ Failed to import: ${failCount} businesses`);
  console.log(`📈 Success rate: ${((successCount / businessNames.length) * 100).toFixed(1)}%`);
}

// Export function for use in other files
export default importBusinesses;