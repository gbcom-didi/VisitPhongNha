import fs from 'fs';
import { parse } from 'csv-parse/sync';
import { db } from './server/db.ts';
import { businesses, categories } from './shared/schema.ts';
import { eq, sql } from 'drizzle-orm';

console.log('Starting business database overhaul...');

// Function to format phone numbers to +84 format
function formatPhoneNumber(phone) {
  if (!phone || phone.trim() === '') return null;
  
  // Remove all non-digit characters
  let cleaned = phone.replace(/\D/g, '');
  
  // Handle different formats
  if (cleaned.startsWith('84')) {
    return '+' + cleaned;
  } else if (cleaned.startsWith('0')) {
    return '+84' + cleaned.substring(1);
  } else if (cleaned.length >= 9) {
    return '+84' + cleaned;
  }
  
  return null;
}

// Function to map category names to IDs
async function getCategoryMapping() {
  const categoriesData = await db.select().from(categories);
  const mapping = {};
  
  categoriesData.forEach(cat => {
    // Create mappings for different variations
    mapping[cat.name.toLowerCase()] = cat.id;
    mapping[cat.slug] = cat.id;
  });
  
  // Additional mappings based on CSV content
  mapping['accommodation'] = categoriesData.find(c => c.name === 'Accommodation')?.id;
  mapping['food & drink'] = categoriesData.find(c => c.name === 'Food & Drink')?.id;
  mapping['adventure'] = categoriesData.find(c => c.name === 'Adventure')?.id;
  mapping['attractions'] = categoriesData.find(c => c.name === 'Attractions')?.id;
  mapping['caves'] = categoriesData.find(c => c.name === 'Caves')?.id;
  mapping['street food'] = categoriesData.find(c => c.name === 'Street Food')?.id;
  
  return mapping;
}

// Function to clean and convert coordinate values
function cleanCoordinate(value) {
  if (!value || value.trim() === '') return null;
  const parsed = parseFloat(value);
  return isNaN(parsed) ? null : parsed.toString();
}

// Function to clean numeric values
function cleanNumeric(value) {
  if (!value || value.trim() === '') return null;
  const parsed = parseFloat(value);
  return isNaN(parsed) ? null : parsed;
}

// Function to clean array fields
function cleanArray(value) {
  if (!value || value.trim() === '') return [];
  return value.split(',').map(item => item.trim()).filter(item => item !== '');
}

async function main() {
  try {
    console.log('Reading CSV file...');
    const csvContent = fs.readFileSync('./attached_assets/VPN-Business_List_IMPORT_03 - Business_List_IMPORT_03_1753843629227.csv', 'utf-8');
    
    console.log('Parsing CSV data...');
    const records = parse(csvContent, {
      columns: true,
      skip_empty_lines: true,
      trim: true
    });
    
    console.log(`Found ${records.length} businesses to import`);
    
    // Get category mapping
    const categoryMapping = await getCategoryMapping();
    console.log('Category mapping:', categoryMapping);
    
    // Step 1: Remove all existing business relationships and businesses
    console.log('Removing business-category relationships...');
    await db.execute(sql`DELETE FROM business_categories`);
    console.log('Removing guestbook business references...');
    await db.execute(sql`UPDATE guestbook_entries SET related_place_id = NULL WHERE related_place_id IS NOT NULL`);
    console.log('Removing user likes relationships...');
    await db.execute(sql`DELETE FROM user_likes`);
    console.log('Removing all existing businesses...');
    const deletedCount = await db.delete(businesses);
    console.log(`Deleted ${deletedCount?.length || 'all'} existing businesses`);
    
    // Step 2: Import new businesses
    console.log('Starting import of new businesses...');
    let successCount = 0;
    let errorCount = 0;
    
    for (let i = 0; i < records.length; i++) {
      const record = records[i];
      
      try {
        // Map category name to ID
        const categoryName = record.categories?.toLowerCase();
        const categoryId = categoryMapping[categoryName] || null;
        
        if (!categoryId) {
          console.log(`Warning: No category mapping found for "${record.categories}" - skipping business: ${record.name}`);
          errorCount++;
          continue;
        }
        
        // Prepare business data
        const businessData = {
          name: record.name || 'Unnamed Business',
          description: record.description || null,
          address: record.address || null,
          phone: formatPhoneNumber(record.phone),
          email: record.email || null,
          website: record.website || null,
          latitude: cleanCoordinate(record.latitude),
          longitude: cleanCoordinate(record.longitude),
          categoryId: categoryId,
          imageUrl: record.image_url || null,
          gallery: cleanArray(record.gallery),
          tags: cleanArray(record.tags),
          rating: cleanNumeric(record.rating),
          reviewCount: cleanNumeric(record.review_count) ? parseInt(record.review_count) : null,
          googleMapsUrl: record.google_maps_url || null,
          bookingType: record.booking_type === 'affiliate' ? 'affiliate' : 'none',
          affiliateLink: record.booking_type === 'affiliate' ? (record.affiliate_link || 'https://www.agoda.com/partners/partnersearch.aspx?pcs=1&cid=1945129&hl=en-us') : null,
          directBookingContact: null,
          enquiryFormEnabled: false,
          featuredText: null,
          isVerified: true,
          isRecommended: false,
          isPremium: false,
          priceRange: null,
          amenities: []
        };
        
        // Insert business
        const [insertedBusiness] = await db.insert(businesses).values(businessData).returning();
        
        console.log(`✓ Imported: ${businessData.name} (ID: ${insertedBusiness.id})`);
        successCount++;
        
      } catch (error) {
        console.error(`✗ Error importing business "${record.name}":`, error.message);
        errorCount++;
      }
    }
    
    console.log('\n=== IMPORT SUMMARY ===');
    console.log(`Successfully imported: ${successCount} businesses`);
    console.log(`Errors: ${errorCount}`);
    console.log(`Total processed: ${records.length}`);
    console.log('Database overhaul completed!');
    
  } catch (error) {
    console.error('Fatal error during import:', error);
    process.exit(1);
  }
}

main().catch(console.error);