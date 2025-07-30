import fs from 'fs';
import { parse } from 'csv-parse/sync';
import { db } from './server/db.ts';
import { businesses, categories, businessCategories } from './shared/schema.ts';
import { eq, sql } from 'drizzle-orm';

console.log('Populating business categories junction table...');

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
  mapping['tour'] = categoriesData.find(c => c.name === 'Tour')?.id;
  mapping['cave'] = categoriesData.find(c => c.name === 'Cave')?.id;
  mapping['attraction'] = categoriesData.find(c => c.name === 'Attraction')?.id;
  
  return mapping;
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
    
    console.log(`Found ${records.length} businesses in CSV`);
    
    // Get category mapping
    const categoryMapping = await getCategoryMapping();
    console.log('Category mapping:', categoryMapping);
    
    // Get all businesses from database
    const businessesData = await db.select({ id: businesses.id, name: businesses.name }).from(businesses);
    console.log(`Found ${businessesData.length} businesses in database`);
    
    // Clear existing business-category relationships
    console.log('Clearing existing business-category relationships...');
    await db.execute(sql`DELETE FROM business_categories`);
    
    // Create a map of business names to IDs for matching
    const businessNameToId = new Map();
    businessesData.forEach(business => {
      businessNameToId.set(business.name.toLowerCase().trim(), business.id);
    });
    
    let successCount = 0;
    let errorCount = 0;
    
    // Process each CSV record
    for (let i = 0; i < records.length; i++) {
      const record = records[i];
      
      try {
        // Find matching business by name
        const businessName = record.name?.toLowerCase().trim();
        const businessId = businessNameToId.get(businessName);
        
        if (!businessId) {
          console.log(`Warning: No business found with name "${record.name}"`);
          errorCount++;
          continue;
        }
        
        // Map category name to ID
        const categoryName = record.categories?.toLowerCase().trim();
        const categoryId = categoryMapping[categoryName];
        
        if (!categoryId) {
          console.log(`Warning: No category mapping found for "${record.categories}" for business: ${record.name}`);
          errorCount++;
          continue;
        }
        
        // Insert business-category relationship
        await db.insert(businessCategories).values({
          businessId: businessId,
          categoryId: categoryId
        });
        
        console.log(`✓ Added category "${record.categories}" to business "${record.name}"`);
        successCount++;
        
      } catch (error) {
        console.error(`✗ Error processing business "${record.name}":`, error.message);
        errorCount++;
      }
    }
    
    console.log('\n=== CATEGORY POPULATION SUMMARY ===');
    console.log(`Successfully added: ${successCount} business-category relationships`);
    console.log(`Errors: ${errorCount}`);
    console.log(`Total processed: ${records.length}`);
    
    // Verify results
    const categoryStats = await db
      .select({
        categoryName: categories.name,
        businessCount: sql`COUNT(${businessCategories.businessId})::int`
      })
      .from(categories)
      .leftJoin(businessCategories, eq(categories.id, businessCategories.categoryId))
      .groupBy(categories.id, categories.name)
      .orderBy(categories.name);
    
    console.log('\n=== CATEGORY STATISTICS ===');
    categoryStats.forEach(stat => {
      console.log(`${stat.categoryName}: ${stat.businessCount} businesses`);
    });
    
    console.log('Business categories population completed!');
    
  } catch (error) {
    console.error('Fatal error during category population:', error);
    process.exit(1);
  }
}

main().catch(console.error);