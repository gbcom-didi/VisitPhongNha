import importBusinesses from './googlePlacesImporter.js';

async function runContinuousImport() {
  console.log('🔄 Starting continuous Google Places import...');
  
  let rounds = 0;
  const maxRounds = 10; // Limit to prevent infinite loops
  
  while (rounds < maxRounds) {
    try {
      console.log(`\n🚀 Round ${rounds + 1}/${maxRounds}`);
      await importBusinesses();
      rounds++;
      
      // Wait 30 seconds between rounds to respect rate limits
      console.log('⏳ Waiting 30 seconds before next round...');
      await new Promise(resolve => setTimeout(resolve, 30000));
      
    } catch (error) {
      console.error(`❌ Round ${rounds + 1} failed:`, error);
      rounds++;
      // Wait longer on error
      await new Promise(resolve => setTimeout(resolve, 60000));
    }
  }
  
  console.log('\n✅ Continuous import completed!');
}

runContinuousImport();