import fs from 'fs';
import pkg from 'pg';
const { Pool } = pkg;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL
});

// Category mapping function
function assignCategory(name, address, phone, website) {
  const nameLower = name.toLowerCase();
  
  if (nameLower.includes('hotel') || nameLower.includes('resort') || 
      nameLower.includes('homestay') || nameLower.includes('hostel') ||
      nameLower.includes('villa') || nameLower.includes('bungalow') ||
      nameLower.includes('lodge') || nameLower.includes('farmstay') ||
      nameLower.includes('collection house') || nameLower.includes('ecostay')) {
    return 1; // Accommodation
  }
  
  if (nameLower.includes('restaurant') || nameLower.includes('cafe') ||
      nameLower.includes('pub') || nameLower.includes('sushi') ||
      nameLower.includes('bún bò') || nameLower.includes('bánh khoái') ||
      nameLower.includes('cơm gà') || nameLower.includes('nem lụi') ||
      nameLower.includes('quán ăn') || nameLower.includes('street food') ||
      nameLower.includes('food') || nameLower.includes('drink')) {
    return 8; // Food & Drink
  }
  
  if (nameLower.includes('tour') || nameLower.includes('adventure') ||
      nameLower.includes('trekking') || nameLower.includes('zipline') ||
      nameLower.includes('jungle boss') || nameLower.includes('duck stop') ||
      nameLower.includes('duck tang') || nameLower.includes('oxalis') ||
      nameLower.includes('motorbike') || nameLower.includes('wildlife')) {
    return 4; // Adventure
  }
  
  if (nameLower.includes('cave') || nameLower.includes('hang') ||
      nameLower.includes('national park') || nameLower.includes('botanic garden') ||
      nameLower.includes('monkey bridge') || nameLower.includes('dark cave')) {
    return 9; // Caves
  }
  
  if (nameLower.includes('nhà hàng') || nameLower.includes('quán')) {
    return 2; // Restaurant
  }
  
  return 1; // Default to Accommodation
}

// Generate description
function generateDescription(name, category, address, rating, reviewCount) {
  const location = address.includes('Phong Nha') ? 'Phong Nha' : 
                  address.includes('Đồng Hới') ? 'Đồng Hới' : 
                  address.includes('Bố Trạch') ? 'Bố Trạch' : 'Quảng Bình';
  
  const ratingText = rating && reviewCount ? `Rated ${rating}/5 by ${reviewCount} guests.` : '';
  
  switch(category) {
    case 1: // Accommodation
      if (name.toLowerCase().includes('resort')) {
        return `Luxury resort offering comfortable accommodations in ${location}. ${ratingText} Experience authentic Vietnamese hospitality with modern amenities.`;
      } else if (name.toLowerCase().includes('homestay')) {
        return `Authentic homestay experience in ${location}. ${ratingText} Stay with local families and discover traditional Vietnamese culture.`;
      } else {
        return `Quality accommodation in ${location}. ${ratingText} Perfect base for exploring the natural wonders of Phong Nha region.`;
      }
    case 8:
    case 2:
      return `Authentic Vietnamese restaurant in ${location} serving traditional local cuisine. ${ratingText} Experience genuine Vietnamese flavors and hospitality.`;
    case 4:
      return `Professional adventure provider in ${location}. ${ratingText} Discover hidden caves, jungles, and natural wonders with expert guides.`;
    case 9:
      return `Natural attraction showcasing the incredible beauty of ${location}. ${ratingText} Explore stunning cave systems and pristine landscapes.`;
    default:
      return `Popular destination in ${location}. ${ratingText} Discover the authentic charm and natural beauty of the Phong Nha region.`;
  }
}

async function importAllBusinesses() {
  try {
    const csvContent = fs.readFileSync('attached_assets/Google Map API Search - Google_Maps_Business_Input (1)_1751585966548.csv', 'utf8');
    const lines = csvContent.split('\n').filter(line => line.trim());
    
    let added = 0;
    let updated = 0;
    
    // Process each line starting from row 2 (skip header)
    for (let i = 1; i < lines.length; i++) {
      const line = lines[i].trim();
      if (!line) continue;
      
      // Simple CSV parsing for this specific format
      const match = line.match(/^"?([^",]+)"?,([^,]*),([^,]+),([^,]+),([^,]*),([^,]*),(".*?"|[^,]*),([^,]*),([^,]*),([^,]*),([^,]+),([^,]+)(?:,([^,]*),([^,]*),([^,]*),([^,]*))?/);
      if (!match) continue;
      
      const [, name, , latitude, longitude, rating, reviewCount, address, , website, phone, googleMapsUrl, mainImageURL] = match;
      
      if (!name || !latitude || !longitude) continue;
      
      console.log(`Processing: ${name}`);
      
      // Check if exists
      const existing = await pool.query('SELECT id FROM businesses WHERE name = $1', [name]);
      
      const categoryId = assignCategory(name, address, phone, website);
      const description = generateDescription(name, categoryId, address, rating, reviewCount);
      
      const cleanRating = rating && rating.trim() && rating !== '' ? parseFloat(rating) : null;
      const cleanReviewCount = reviewCount && reviewCount.trim() && reviewCount !== '' ? parseInt(reviewCount) : 0;
      const cleanImageUrl = mainImageURL && mainImageURL.trim() && mainImageURL !== '' ? mainImageURL.trim() : null;
      const cleanWebsite = website && website.trim() && website !== '' ? website.trim() : null;
      const cleanPhone = phone && phone.trim() && phone !== '' ? phone.trim() : null;
      const cleanGoogleMapsUrl = googleMapsUrl && googleMapsUrl.trim() && googleMapsUrl !== '' ? googleMapsUrl.trim() : null;
      
      if (existing.rows.length > 0) {
        // Update existing
        await pool.query(`
          UPDATE businesses SET 
            description = $1, address = $2, latitude = $3, longitude = $4, 
            phone = $5, website = $6, image_url = $7, 
            rating = $8, review_count = $9, google_maps_url = $10
          WHERE name = $11
        `, [
          description, address.replace(/"/g, ''), latitude, longitude,
          cleanPhone, cleanWebsite, cleanImageUrl,
          cleanRating, cleanReviewCount, cleanGoogleMapsUrl, name
        ]);
        
        // Update category
        const businessId = existing.rows[0].id;
        await pool.query('DELETE FROM business_categories WHERE business_id = $1', [businessId]);
        await pool.query('INSERT INTO business_categories (business_id, category_id) VALUES ($1, $2)', [businessId, categoryId]);
        
        updated++;
        console.log(`Updated: ${name}`);
      } else {
        // Insert new
        const result = await pool.query(`
          INSERT INTO businesses (
            name, description, address, latitude, longitude, phone, website, image_url, 
            rating, review_count, google_maps_url, tags, price_range, 
            amenities, booking_type, is_verified, is_recommended
          ) VALUES (
            $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17
          ) RETURNING id
        `, [
          name, description, address.replace(/"/g, ''), latitude, longitude,
          cleanPhone, cleanWebsite, cleanImageUrl,
          cleanRating, cleanReviewCount, cleanGoogleMapsUrl,
          '{}', null, '{}', 'none', false, false
        ]);
        
        // Add category
        const businessId = result.rows[0].id;
        await pool.query('INSERT INTO business_categories (business_id, category_id) VALUES ($1, $2)', [businessId, categoryId]);
        
        added++;
        console.log(`Added: ${name}`);
      }
    }
    
    const finalCount = await pool.query('SELECT COUNT(*) FROM businesses');
    console.log(`\nImport Complete!`);
    console.log(`Added: ${added} new businesses`);
    console.log(`Updated: ${updated} existing businesses`);
    console.log(`Total businesses in database: ${finalCount.rows[0].count}`);
    
  } catch (error) {
    console.error('Import failed:', error);
  } finally {
    await pool.end();
  }
}

importAllBusinesses();