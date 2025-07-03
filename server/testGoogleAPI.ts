const GOOGLE_PLACES_API_KEY = 'AIzaSyB9BiGD__jK5zG6owJJVL37bqh_S-1wf34';

async function testAPI() {
  try {
    // Test a simple geocoding request first
    const geocodeUrl = `https://maps.googleapis.com/maps/api/geocode/json?address=Phong+Nha+Vietnam&key=${GOOGLE_PLACES_API_KEY}`;
    console.log('Testing Geocoding API...');
    
    const geocodeResponse = await fetch(geocodeUrl);
    const geocodeData = await geocodeResponse.json();
    console.log('Geocoding result:', JSON.stringify(geocodeData, null, 2));
    
    // Test Places API - simple nearby search
    const placesUrl = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=17.5985,106.2636&radius=10000&key=${GOOGLE_PLACES_API_KEY}`;
    console.log('\nTesting Places API...');
    
    const placesResponse = await fetch(placesUrl);
    const placesData = await placesResponse.json();
    console.log('Places result:', JSON.stringify(placesData, null, 2));
    
  } catch (error) {
    console.error('API test failed:', error);
  }
}

testAPI();