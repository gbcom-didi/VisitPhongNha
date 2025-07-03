import { db } from "./db.js";
import { businesses, businessCategories, categories } from "@shared/schema";
import { eq } from "drizzle-orm";
import fs from 'fs';
import path from 'path';

// Read the CSV file
const csvPath = path.join(process.cwd(), 'attached_assets', 'Business List Schema IMPORT 01 - business_list_template (1)_1751518694473.csv');

function parseCSV(csvContent: string) {
  const lines = csvContent.split('\n').filter(line => line.trim());
  const headers = lines[0].split(',');
  
  return lines.slice(1).map(line => {
    const values = [];
    let current = '';
    let inQuotes = false;
    
    for (let i = 0; i < line.length; i++) {
      const char = line[i];
      if (char === '"') {
        inQuotes = !inQuotes;
      } else if (char === ',' && !inQuotes) {
        values.push(current.trim());
        current = '';
      } else {
        current += char;
      }
    }
    values.push(current.trim());
    
    // Create object from headers and values
    const obj: any = {};
    headers.forEach((header, index) => {
      obj[header.trim()] = values[index] || '';
    });
    
    return obj;
  });
}

// Category mapping based on business names and types
function getCategorySlug(name: string, address: string, description: string): string {
  const lowerName = name.toLowerCase();
  const lowerAddress = address.toLowerCase();
  const lowerDesc = description.toLowerCase();
  const combined = `${lowerName} ${lowerAddress} ${lowerDesc}`;
  
  // Check for specific patterns
  if (combined.includes('cave') || combined.includes('grotto') || lowerName.includes('phong nha') && 
      (combined.includes('national park') || combined.includes('cave'))) {
    return 'caves';
  } else if (combined.includes('hotel') || combined.includes('resort') || combined.includes('homestay') || 
             combined.includes('hostel') || combined.includes('lodge') || combined.includes('farmstay') ||
             combined.includes('bungalow') || combined.includes('house') && (combined.includes('captain') || combined.includes('mountain'))) {
    return 'accommodation';
  } else if (combined.includes('restaurant') || combined.includes('nhà hàng') || combined.includes('cafe') || 
             combined.includes('coffee') || combined.includes('pub') || combined.includes('bar') ||
             lowerName.includes('family restaurant') || lowerName.includes('vegan cafe')) {
    return 'food-drink';
  } else if (lowerName.includes('bánh') || lowerName.includes('bún') || lowerName.includes('nem') || 
             lowerName.includes('phở') || combined.includes('street food')) {
    return 'street-food';
  } else if (combined.includes('tour') || combined.includes('adventure') || combined.includes('motorbike') ||
             combined.includes('trek') || combined.includes('oxalis') || lowerName.includes('monkey bridge')) {
    return 'recreation';
  } else if (combined.includes('beach') || combined.includes('park') || combined.includes('temple') || 
             combined.includes('museum') || combined.includes('market') || combined.includes('pagoda') ||
             combined.includes('botanic') || combined.includes('garden') || combined.includes('elements')) {
    return 'attractions';
  }
  
  return 'attractions'; // Default category
}

async function importCSVBusinesses() {
  console.log('🚀 Starting CSV import...');
  
  try {
    const csvContent = fs.readFileSync(csvPath, 'utf-8');
    const businessData = parseCSV(csvContent);
    
    console.log(`📋 Found ${businessData.length} businesses in CSV`);
    
    // Get all categories from database
    const allCategories = await db.query.categories.findMany();
    console.log(`📂 Found ${allCategories.length} categories in database`);
    
    let processed = 0;
    let created = 0;
    let updated = 0;
    let skipped = 0;
    
    for (const row of businessData) {
      try {
        const {
          name,
          latitude,
          longitude,
          rating,
          reviewCount,
          address,
          description,
          website,
          phone,
          googleMapsUrl,
          mainImageURL,
          galleryImage1,
          galleryImage2,
          galleryImage3,
          galleryImage4
        } = row;
        
        // Skip if no name
        if (!name || name.trim() === '') {
          skipped++;
          continue;
        }
        
        // Build gallery array from individual gallery images
        const gallery = [galleryImage1, galleryImage2, galleryImage3, galleryImage4]
          .filter(img => img && img.trim() !== '' && img !== mainImageURL)
          .join(',');
        
        const categorySlug = getCategorySlug(name, address || '', description || '');
        const category = allCategories.find(c => c.slug === categorySlug);
        
        if (!category) {
          console.warn(`⚠️ Category not found: ${categorySlug} for business: ${name}`);
          skipped++;
          continue;
        }
        
        // Check if business already exists
        const existingBusiness = await db.query.businesses.findFirst({
          where: (businesses, { eq }) => eq(businesses.name, name)
        });
        
        const businessUpdateData: any = {};
        
        // Only update fields that have values in CSV
        if (latitude && latitude !== '') businessUpdateData.latitude = latitude;
        if (longitude && longitude !== '') businessUpdateData.longitude = longitude;
        if (rating && rating !== '') businessUpdateData.rating = rating;
        if (reviewCount && reviewCount !== '') businessUpdateData.reviewCount = parseInt(reviewCount) || 0;
        if (address && address !== '') businessUpdateData.address = address;
        if (description && description !== '') businessUpdateData.description = description;
        if (website && website !== '') businessUpdateData.website = website;
        if (phone && phone !== '') businessUpdateData.phone = phone;
        if (googleMapsUrl && googleMapsUrl !== '') businessUpdateData.googleMapsUrl = googleMapsUrl;
        if (mainImageURL && mainImageURL !== '') businessUpdateData.imageUrl = mainImageURL;
        if (gallery) businessUpdateData.gallery = gallery.split(',');
        
        // Always update name (in case of corrections)
        businessUpdateData.name = name;
        
        let businessId: number;
        
        if (existingBusiness) {
          // Update existing business
          await db.update(businesses)
            .set(businessUpdateData)
            .where(eq(businesses.id, existingBusiness.id));
          businessId = existingBusiness.id;
          updated++;
          console.log(`🔄 Updated: ${name} (Category: ${categorySlug})`);
        } else {
          // Create new business with required defaults for missing fields
          const newBusinessData = {
            ...businessUpdateData,
            // Set defaults for required fields if not provided
            latitude: businessUpdateData.latitude || '17.5985',
            longitude: businessUpdateData.longitude || '106.2636',
            description: businessUpdateData.description || `Discover ${name} in the beautiful Phong Nha region.`,
            address: businessUpdateData.address || `${name}, Phong Nha, Quang Binh Province, Vietnam`,
            imageUrl: businessUpdateData.imageUrl || 'https://images.unsplash.com/photo-1539650116574-75c0c6d73c6e?w=800&h=600&fit=crop',
            isVerified: true,
            isActive: true
          };
          
          const [newBusiness] = await db.insert(businesses)
            .values(newBusinessData)
            .returning({ id: businesses.id });
          businessId = newBusiness.id;
          created++;
          console.log(`➕ Created: ${name} (Category: ${categorySlug})`);
        }
        
        // Ensure business-category relationship exists
        const existingRelation = await db.query.businessCategories.findFirst({
          where: (bc, { and, eq }) => and(
            eq(bc.businessId, businessId),
            eq(bc.categoryId, category.id)
          )
        });
        
        if (!existingRelation) {
          await db.insert(businessCategories).values({
            businessId,
            categoryId: category.id
          });
        }
        
        processed++;
        
        // Progress update every 10 businesses
        if (processed % 10 === 0) {
          console.log(`📊 Progress: ${processed}/${businessData.length} (${created} created, ${updated} updated, ${skipped} skipped)`);
        }
        
      } catch (error) {
        console.error(`❌ Failed to process business: ${row.name}:`, error);
        skipped++;
      }
    }
    
    console.log('\n✅ CSV import completed!');
    console.log(`📊 Final stats: ${processed} processed, ${created} created, ${updated} updated, ${skipped} skipped`);
    
    // Final database count
    const finalCount = await db.query.businesses.findMany();
    console.log(`🏪 Total businesses in database: ${finalCount.length}`);
    
    return {
      processed,
      created,
      updated,
      skipped,
      total: finalCount.length
    };
    
  } catch (error) {
    console.error('💥 CSV import failed:', error);
    throw error;
  }
}

// Run if this file is executed directly
if (process.argv[1].endsWith('csvImport.ts')) {
  importCSVBusinesses()
    .then((stats) => {
      console.log(`🎉 CSV import completed! Stats:`, stats);
      process.exit(0);
    })
    .catch((error) => {
      console.error('💥 CSV import failed:', error);
      process.exit(1);
    });
}

export default importCSVBusinesses;