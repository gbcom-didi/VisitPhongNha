import fs from 'fs';
import pkg from 'pg';
const { Pool } = pkg;

// Database connection
const pool = new Pool({
  connectionString: process.env.DATABASE_URL
});

// Category mapping based on business name/type
function assignCategory(name, address, phone, website) {
  const nameLower = name.toLowerCase();
  const addressLower = address.toLowerCase();
  
  // Hotels, resorts, homestays, hostels, villas
  if (nameLower.includes('hotel') || nameLower.includes('resort') || 
      nameLower.includes('homestay') || nameLower.includes('hostel') ||
      nameLower.includes('villa') || nameLower.includes('bungalow') ||
      nameLower.includes('lodge') || nameLower.includes('farmstay') ||
      nameLower.includes('collection house') || nameLower.includes('ecostay')) {
    return 1; // Accommodation
  }
  
  // Restaurants, cafes, food places
  if (nameLower.includes('restaurant') || nameLower.includes('cafe') ||
      nameLower.includes('pub') || nameLower.includes('sushi') ||
      nameLower.includes('bún bò') || nameLower.includes('bánh khoái') ||
      nameLower.includes('cơm gà') || nameLower.includes('nem lụi') ||
      nameLower.includes('quán ăn') || nameLower.includes('street food') ||
      nameLower.includes('food') || nameLower.includes('drink')) {
    return 8; // Food & Drink
  }
  
  // Adventure and tour companies
  if (nameLower.includes('tour') || nameLower.includes('adventure') ||
      nameLower.includes('trekking') || nameLower.includes('zipline') ||
      nameLower.includes('jungle boss') || nameLower.includes('duck stop') ||
      nameLower.includes('duck tang') || nameLower.includes('oxalis') ||
      nameLower.includes('motorbike') || nameLower.includes('wildlife')) {
    return 4; // Adventure
  }
  
  // Caves and natural attractions
  if (nameLower.includes('cave') || nameLower.includes('hang') ||
      nameLower.includes('national park') || nameLower.includes('botanic garden') ||
      nameLower.includes('monkey bridge') || nameLower.includes('dark cave')) {
    return 9; // Caves (or could be 3 for general Attraction)
  }
  
  // Default to Restaurant for food-related or Accommodation for stays
  if (nameLower.includes('nhà hàng') || nameLower.includes('quán')) {
    return 2; // Restaurant
  }
  
  // Default to Accommodation for anything that looks like lodging
  return 1; // Accommodation (default)
}

// Generate appropriate description based on category and name
function generateDescription(name, category, address, rating, reviewCount) {
  const nameParts = name.split(' ');
  const location = address.includes('Phong Nha') ? 'Phong Nha' : 
                  address.includes('Đồng Hới') ? 'Đồng Hới' : 
                  address.includes('Bố Trạch') ? 'Bố Trạch' : 'Quảng Bình';
  
  switch(category) {
    case 1: // Accommodation
      if (name.toLowerCase().includes('resort')) {
        return `Luxury resort offering comfortable accommodations in ${location}. ${rating ? `Rated ${rating}/5 by ${reviewCount} guests.` : ''} Experience authentic Vietnamese hospitality with modern amenities.`;
      } else if (name.toLowerCase().includes('homestay')) {
        return `Authentic homestay experience in ${location}. ${rating ? `Rated ${rating}/5 by ${reviewCount} guests.` : ''} Stay with local families and discover traditional Vietnamese culture.`;
      } else if (name.toLowerCase().includes('hotel')) {
        return `Comfortable hotel accommodation in ${location}. ${rating ? `Rated ${rating}/5 by ${reviewCount} guests.` : ''} Convenient location with quality service and amenities.`;
      } else {
        return `Quality accommodation in ${location}. ${rating ? `Rated ${rating}/5 by ${reviewCount} guests.` : ''} Perfect base for exploring the natural wonders of Phong Nha region.`;
      }
      
    case 8: // Food & Drink
    case 2: // Restaurant
      if (name.toLowerCase().includes('cafe')) {
        return `Local cafe serving fresh coffee and Vietnamese specialties in ${location}. ${rating ? `Rated ${rating}/5 by ${reviewCount} customers.` : ''} Perfect spot to relax and enjoy authentic flavors.`;
      } else if (name.toLowerCase().includes('pub')) {
        return `Popular pub offering cold drinks and local atmosphere in ${location}. ${rating ? `Rated ${rating}/5 by ${reviewCount} visitors.` : ''} Great place to unwind after exploring.`;
      } else {
        return `Authentic Vietnamese restaurant in ${location} serving traditional local cuisine. ${rating ? `Rated ${rating}/5 by ${reviewCount} diners.` : ''} Experience genuine Vietnamese flavors and hospitality.`;
      }
      
    case 4: // Adventure
      if (name.toLowerCase().includes('tour')) {
        return `Professional tour operator offering exciting adventures in ${location}. ${rating ? `Rated ${rating}/5 by ${reviewCount} adventurers.` : ''} Discover hidden caves, jungles, and natural wonders with expert guides.`;
      } else {
        return `Adventure activity provider in ${location}. ${rating ? `Rated ${rating}/5 by ${reviewCount} participants.` : ''} Experience thrilling outdoor activities in the stunning Phong Nha landscape.`;
      }
      
    case 9: // Caves
    case 3: // Attraction
      return `Natural attraction showcasing the incredible beauty of ${location}. ${rating ? `Rated ${rating}/5 by ${reviewCount} visitors.` : ''} Explore stunning cave systems and pristine landscapes in UNESCO World Heritage site.`;
      
    default:
      return `Popular destination in ${location}. ${rating ? `Rated ${rating}/5 by ${reviewCount} visitors.` : ''} Discover the authentic charm and natural beauty of the Phong Nha region.`;
  }
}

// Parse CSV and import businesses
async function importBusinesses() {
  try {
    const csvContent = fs.readFileSync('attached_assets/Google Map API Search - Google_Maps_Business_Input (1)_1751585966548.csv', 'utf8');
    const lines = csvContent.split('\n');
    
    // Skip header row
    for (let i = 1; i < lines.length; i++) {
      const line = lines[i].trim();
      if (!line) continue;
      
      // Parse CSV line (handling commas in quoted fields)
      const values = [];
      let current = '';
      let inQuotes = false;
      
      for (let char of line) {
        if (char === '"') {
          inQuotes = !inQuotes;
        } else if (char === ',' && !inQuotes) {
          values.push(current.trim());
          current = '';
        } else {
          current += char;
        }
      }
      values.push(current.trim());
      
      if (values.length < 11) continue; // Skip incomplete rows
      
      const [name, , latitude, longitude, rating, reviewCount, address, description, website, phone, googleMapsUrl, mainImageURL, galleryImage1, galleryImage2, galleryImage3, galleryImage4] = values;
      
      if (!name || !latitude || !longitude) continue;
      
      // Assign category
      const categoryId = assignCategory(name, address, phone, website);
      
      // Generate description
      const generatedDescription = generateDescription(name, categoryId, address, rating, reviewCount);
      
      // Prepare gallery array
      const gallery = [galleryImage1, galleryImage2, galleryImage3, galleryImage4]
        .filter(img => img && img.trim() && img !== '')
        .map(img => img.trim());
      
      // Check if business already exists
      const existingBusiness = await pool.query(
        'SELECT id FROM businesses WHERE name = $1',
        [name]
      );
      
      const businessData = {
        name: name.trim(),
        description: generatedDescription,
        address: address.trim(),
        latitude: latitude.trim(),
        longitude: longitude.trim(),
        phone: phone.trim() || null,
        website: website.trim() || null,
        imageUrl: mainImageURL.trim() || null,
        rating: rating && rating.trim() ? rating.trim() : null,
        reviewCount: reviewCount && reviewCount.trim() ? parseInt(reviewCount) || 0 : 0,
        googleMapsUrl: googleMapsUrl.trim() || null,
        gallery: gallery.length > 0 ? gallery : null,
        tags: [], // Empty tags array
        priceRange: null,
        amenities: [],
        bookingType: null,
        affiliateLink: null,
        directBookingContact: null,
        enquiryFormEnabled: false,
        featuredText: null,
        isVerified: false,
        isRecommended: false,
        bookingComUrl: null,
        agodaUrl: null
      };
      
      const assignedCategoryId = categoryId;
      
      if (existingBusiness.rows.length > 0) {
        // Update existing business
        const updateQuery = `
          UPDATE businesses SET 
            description = $1, address = $2, latitude = $3, longitude = $4, 
            phone = $5, website = $6, image_url = $7, 
            rating = $8, review_count = $9, google_maps_url = $10, gallery = $11
          WHERE name = $12
          RETURNING id
        `;
        
        const updateResult = await pool.query(updateQuery, [
          businessData.description, businessData.address, businessData.latitude, businessData.longitude,
          businessData.phone, businessData.website, businessData.imageUrl,
          businessData.rating, businessData.reviewCount, businessData.googleMapsUrl, 
          businessData.gallery, businessData.name
        ]);
        
        const businessId = updateResult.rows[0].id;
        
        // Update business category relationship
        await pool.query('DELETE FROM business_categories WHERE business_id = $1', [businessId]);
        await pool.query(
          'INSERT INTO business_categories (business_id, category_id) VALUES ($1, $2)',
          [businessId, assignedCategoryId]
        );
        
        console.log(`Updated: ${name}`);
      } else {
        // Insert new business
        const insertQuery = `
          INSERT INTO businesses (
            name, description, address, latitude, longitude, phone, website, image_url, 
            rating, review_count, google_maps_url, gallery, tags, price_range, 
            amenities, booking_type, affiliate_link, direct_booking_contact, enquiry_form_enabled, 
            featured_text, is_verified, is_recommended, booking_com_url, agoda_url
          ) VALUES (
            $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22, $23, $24
          ) RETURNING id
        `;
        
        const insertResult = await pool.query(insertQuery, [
          businessData.name, businessData.description, businessData.address, businessData.latitude, businessData.longitude,
          businessData.phone, businessData.website, businessData.imageUrl,
          businessData.rating, businessData.reviewCount, businessData.googleMapsUrl, businessData.gallery,
          businessData.tags, businessData.priceRange, businessData.amenities, businessData.bookingType,
          businessData.affiliateLink, businessData.directBookingContact, businessData.enquiryFormEnabled,
          businessData.featuredText, businessData.isVerified, businessData.isRecommended,
          businessData.bookingComUrl, businessData.agodaUrl
        ]);
        
        const businessId = insertResult.rows[0].id;
        
        // Create business category relationship
        await pool.query(
          'INSERT INTO business_categories (business_id, category_id) VALUES ($1, $2)',
          [businessId, assignedCategoryId]
        );
        
        console.log(`Added: ${name}`);
      }
    }
    
    // Get final count
    const countResult = await pool.query('SELECT COUNT(*) FROM businesses');
    console.log(`\nImport complete! Total businesses in database: ${countResult.rows[0].count}`);
    
  } catch (error) {
    console.error('Import failed:', error);
  } finally {
    await pool.end();
  }
}

// Run the import
importBusinesses();