import { googlePlacesImporter } from './googlePlacesImporter';
import { storage } from './storage';

async function runFullImport() {
  console.log('Starting comprehensive Google Places import...');
  
  try {
    const businesses = await storage.getBusinesses();
    let successCount = 0;
    let processedCount = 0;

    console.log(`Found ${businesses.length} total businesses`);

    for (const business of businesses) {
      processedCount++;
      console.log(`\n[${processedCount}/${businesses.length}] Processing: ${business.name}`);
      
      try {
        const success = await googlePlacesImporter.updateBusinessWithGoogleData(business.id, business.name);
        if (success) {
          successCount++;
          console.log(`✓ Updated: ${business.name}`);
        } else {
          console.log(`- No data: ${business.name}`);
        }
      } catch (error) {
        console.error(`✗ Error: ${business.name} - ${error.message}`);
      }

      // Rate limiting: 100ms between requests
      await new Promise(resolve => setTimeout(resolve, 100));

      // Progress update every 10 businesses
      if (processedCount % 10 === 0) {
        console.log(`--- Progress: ${processedCount}/${businesses.length} processed, ${successCount} successful ---`);
      }
    }

    console.log(`\n=== IMPORT COMPLETED ===`);
    console.log(`Total processed: ${processedCount}`);
    console.log(`Successfully updated: ${successCount}`);
    console.log(`Success rate: ${((successCount / processedCount) * 100).toFixed(1)}%`);

    process.exit(0);
  } catch (error) {
    console.error('Full import failed:', error);
    process.exit(1);
  }
}

runFullImport();