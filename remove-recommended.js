
import { db } from './server/db.js';
import { businesses } from './shared/schema.js';

async function removeRecommendedFromAll() {
  try {
    console.log('Removing recommended status from all businesses...');
    
    const result = await db
      .update(businesses)
      .set({ isRecommended: false })
      .returning({ id: businesses.id, name: businesses.name });
    
    console.log(`Successfully updated ${result.length} businesses:`);
    result.forEach(business => {
      console.log(`- ${business.name} (ID: ${business.id})`);
    });
    
    console.log('All businesses are no longer recommended.');
    process.exit(0);
  } catch (error) {
    console.error('Error removing recommended status:', error);
    process.exit(1);
  }
}

removeRecommendedFromAll();
