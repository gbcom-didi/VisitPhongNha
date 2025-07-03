import { db } from "./db.js";
import { businesses, businessCategories, categories } from "@shared/schema";
import { eq, and } from "drizzle-orm";
import fs from 'fs';
import path from 'path';

// Read the business list CSV
const csvPath = path.join(process.cwd(), 'attached_assets', 'Business List 01 ALL Names_1751509910803.csv');
const csvContent = fs.readFileSync(csvPath, 'utf-8');
const lines = csvContent.split('\n').filter(line => line.trim());
const businessNames = lines.slice(1).map(line => line.split(',')[0].replace(/"/g, '').trim()).filter(name => name);

// Category slug mapping
function getCategorySlug(name: string): string {
  const lowerName = name.toLowerCase();
  
  if (lowerName.includes('cave') || lowerName.includes('grotto') || lowerName.includes('phong nha')) {
    return 'caves';
  } else if (lowerName.includes('hotel') || lowerName.includes('resort') || lowerName.includes('homestay') || 
             lowerName.includes('hostel') || lowerName.includes('lodge') || lowerName.includes('farmstay')) {
    return 'accommodation';
  } else if (lowerName.includes('restaurant') || lowerName.includes('bar') || lowerName.includes('cafe') || 
             lowerName.includes('coffee')) {
    return 'food-drink';
  } else if (lowerName.includes('bánh') || lowerName.includes('bún') || lowerName.includes('cơm') || 
             lowerName.includes('phở') || lowerName.includes('street') || lowerName.includes('food truck')) {
    return 'street-food';
  } else if (lowerName.includes('tour') || lowerName.includes('guide') || lowerName.includes('adventure') || 
             lowerName.includes('trek') || lowerName.includes('bike') || lowerName.includes('kayak')) {
    return 'recreation';
  } else if (lowerName.includes('beach') || lowerName.includes('park') || lowerName.includes('temple') || 
             lowerName.includes('museum') || lowerName.includes('market') || lowerName.includes('pagoda')) {
    return 'attractions';
  }
  
  return 'attractions'; // Default category
}

// Generate coordinates around Phong Nha area
function generateCoordinates(): [string, string] {
  const baseLat = 17.5985;
  const baseLng = 106.2636;
  const variation = 0.1; // Roughly 11km radius
  
  const lat = baseLat + (Math.random() - 0.5) * variation;
  const lng = baseLng + (Math.random() - 0.5) * variation;
  
  return [lat.toFixed(8), lng.toFixed(8)];
}

// Image mapping for categories
function getImageForCategory(categorySlug: string): string {
  const imageMap: Record<string, string> = {
    'caves': 'https://images.unsplash.com/photo-1518837695005-2083093ee35b?w=800&h=600&fit=crop',
    'accommodation': 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800&h=600&fit=crop',
    'food-drink': 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&h=600&fit=crop',
    'street-food': 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&h=600&fit=crop',
    'recreation': 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800&h=600&fit=crop',
    'attractions': 'https://images.unsplash.com/photo-1539650116574-75c0c6d73c6e?w=800&h=600&fit=crop'
  };
  
  return imageMap[categorySlug] || imageMap['attractions'];
}

async function quickImportAll() {
  console.log('🚀 Quick import starting...');
  
  // Get all categories and existing businesses
  const allCategories = await db.query.categories.findMany();
  const existingBusinesses = await db.query.businesses.findMany();
  const existingNames = new Set(existingBusinesses.map(b => b.name));
  
  console.log(`📂 ${allCategories.length} categories, ${existingBusinesses.length} existing businesses`);
  
  // Prepare businesses to create
  const businessesToCreate = [];
  const businessCategoryRelations = [];
  
  let processed = 0;
  for (const businessName of businessNames) {
    if (existingNames.has(businessName)) {
      processed++;
      continue; // Skip existing businesses
    }
    
    const categorySlug = getCategorySlug(businessName);
    const category = allCategories.find(c => c.slug === categorySlug);
    
    if (!category) {
      console.error(`❌ Category not found: ${categorySlug} for business: ${businessName}`);
      continue;
    }
    
    const [latitude, longitude] = generateCoordinates();
    const imageUrl = getImageForCategory(categorySlug);
    
    const businessData = {
      name: businessName,
      description: `Experience authentic Vietnamese hospitality and local culture at ${businessName} in the beautiful Phong Nha region of Quang Binh Province.`,
      address: `${businessName}, Phong Nha, Quang Binh Province, Vietnam`,
      latitude,
      longitude,
      phone: '+84 232 3XXX XXX',
      website: `https://${businessName.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')}.vn`,
      imageUrl,
      rating: ((3.5 + Math.random() * 1.5).toFixed(1)),
      reviewCount: Math.floor(Math.random() * 200) + 10,
      priceRange: '$-$$',
      isVerified: true,
      isRecommended: Math.random() > 0.7,
      gallery: [imageUrl],
      tags: [categorySlug, 'phong-nha', 'quang-binh'],
      amenities: ['WiFi', 'Parking', 'English Speaking Staff']
    };
    
    businessesToCreate.push(businessData);
    processed++;
  }
  
  console.log(`➕ Creating ${businessesToCreate.length} new businesses...`);
  
  // Batch insert all new businesses
  if (businessesToCreate.length > 0) {
    const insertedBusinesses = await db.insert(businesses)
      .values(businessesToCreate)
      .returning({ id: businesses.id, name: businesses.name });
    
    console.log(`✅ Created ${insertedBusinesses.length} businesses`);
    
    // Create category relationships
    for (const business of insertedBusinesses) {
      const categorySlug = getCategorySlug(business.name);
      const category = allCategories.find(c => c.slug === categorySlug);
      
      if (category) {
        businessCategoryRelations.push({
          businessId: business.id,
          categoryId: category.id
        });
      }
    }
    
    if (businessCategoryRelations.length > 0) {
      await db.insert(businessCategories).values(businessCategoryRelations);
      console.log(`🔗 Created ${businessCategoryRelations.length} category relationships`);
    }
  }
  
  // Final count
  const finalCount = await db.query.businesses.findMany();
  console.log(`🏪 Total businesses in database: ${finalCount.length}`);
  
  return finalCount.length;
}

// Run if this file is executed directly
if (process.argv[1].endsWith('quickImport.ts')) {
  quickImportAll()
    .then((count) => {
      console.log(`🎉 Quick import completed! Total businesses: ${count}`);
      process.exit(0);
    })
    .catch((error) => {
      console.error('💥 Quick import failed:', error);
      process.exit(1);
    });
}

export default quickImportAll;