import { googlePlacesImporter } from './googlePlacesImporter';

async function runImport() {
  console.log('Starting Google Places import script...');
  try {
    await googlePlacesImporter.importAllBusinesses();
    console.log('Import completed successfully');
    process.exit(0);
  } catch (error) {
    console.error('Import failed:', error);
    process.exit(1);
  }
}

runImport();