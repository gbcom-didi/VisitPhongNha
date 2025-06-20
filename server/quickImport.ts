import { googlePlacesImporter } from './googlePlacesImporter';
import { storage } from './storage';

async function runQuickImport() {
  console.log('Starting quick Google Places import...');
  
  try {
    // Focus on businesses more likely to be found - expanded list
    const targetBusinesses = [
      'Ninh Chu beach',
      'Phan Rang Market', 
      'Ninh Thuan Hospital',
      'Ninh Thuận Museum',
      'Amanoi',
      'ANARA Binh Tien Golf Club',
      'Khu du lịch Hang Rái',
      'Ninh Thuan Provincial General Hospital',
      'Ninh Thuan Tourist Night Market',
      'Ninh Thuan Stone Park',
      'Phan Rang Kite Center',
      'MyHoa Lagoon - Kiting Town',
      'OzFarm-Kiteboarding School',
      'Mirro Salt Lake',
      'Lo O stream',
      'Bãi biển Bình Tiên',
      'Hồ Đá Hang',
      'Bãi tắm Hòn Rùa',
      'Bãi Thùng',
      'Binh Son Beach'
    ];

    const businesses = await storage.getBusinesses();
    let successCount = 0;

    for (const business of businesses) {
      if (targetBusinesses.includes(business.name)) {
        console.log(`\n--- Processing: ${business.name} ---`);
        
        try {
          const success = await googlePlacesImporter.updateBusinessWithGoogleData(business.id, business.name);
          if (success) {
            successCount++;
            console.log(`✓ Successfully updated: ${business.name}`);
          } else {
            console.log(`✗ No data found for: ${business.name}`);
          }
        } catch (error) {
          console.error(`Failed to update ${business.name}:`, error);
        }

        // Add delay between requests
        await new Promise(resolve => setTimeout(resolve, 500));
      }
    }

    console.log(`\nQuick import completed: ${successCount} businesses updated`);
    process.exit(0);
  } catch (error) {
    console.error('Quick import failed:', error);
    process.exit(1);
  }
}

runQuickImport();