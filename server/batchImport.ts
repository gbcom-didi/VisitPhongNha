import importBusinesses from './googlePlacesImporter.js';

async function runBatchImport() {
  console.log('🚀 Starting Google Places import in batches...');
  
  try {
    await importBusinesses();
    console.log('✅ Batch import completed successfully!');
  } catch (error) {
    console.error('❌ Batch import failed:', error);
  }
}

runBatchImport();