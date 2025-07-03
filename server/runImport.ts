import importBusinesses from './googlePlacesImporter.js';

importBusinesses()
  .then(() => {
    console.log('🎉 Import completed!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('💥 Import failed:', error);
    process.exit(1);
  });