
import { db } from './server/db.js';
import { businesses } from './shared/schema.js';

async function listBusinessNames() {
  try {
    console.log('Fetching all business names from the database...');
    
    const businessList = await db
      .select({ 
        id: businesses.id,
        name: businesses.name 
      })
      .from(businesses)
      .orderBy(businesses.name);
    
    console.log(`\n📋 Found ${businessList.length} businesses in the database:\n`);
    
    businessList.forEach((business, index) => {
      console.log(`${index + 1}. ${business.name} (ID: ${business.id})`);
    });
    
    console.log(`\n✅ Total: ${businessList.length} businesses`);
    process.exit(0);
  } catch (error) {
    console.error('Error fetching businesses:', error);
    process.exit(1);
  }
}

listBusinessNames();
