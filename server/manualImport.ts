import { db } from './db';
import { businesses, categories } from '@shared/schema';
import { eq } from 'drizzle-orm';

// Business data with proper categorization and locations in Phong Nha area
const businessData = [
  // Accommodation
  {
    name: "Amanda Hotel Quảng Bình",
    category: "accommodation",
    description: "Amanda Hotel offers comfortable accommodation in Dong Hoi, Quang Binh Province. Experience authentic Vietnamese hospitality in this well-located property.",
    latitude: "17.4677",
    longitude: "106.6014",
    address: "Dong Hoi, Quang Binh Province, Vietnam",
    isActive: true,
    isPremium: false,
    isVerified: true
  },
  {
    name: "Aumori Hostel",
    category: "accommodation", 
    description: "Aumori Hostel provides budget-friendly accommodation for backpackers and travelers exploring Phong Nha.",
    latitude: "17.5985",
    longitude: "106.2636",
    address: "Phong Nha, Quang Binh Province, Vietnam",
    isActive: true,
    isPremium: false,
    isVerified: true
  },
  {
    name: "Bamboo's House",
    category: "accommodation",
    description: "Bamboo's House offers eco-friendly accommodation in a traditional Vietnamese setting near Phong Nha caves.",
    latitude: "17.5985",
    longitude: "106.2636",
    address: "Phong Nha, Quang Binh Province, Vietnam",
    isActive: true,
    isPremium: false,
    isVerified: true
  },
  {
    name: "Bao Ninh beach Resort",
    category: "accommodation",
    description: "Bao Ninh Beach Resort provides beachfront accommodation with stunning ocean views in Quang Binh.",
    latitude: "17.4833",
    longitude: "106.6167",
    address: "Bao Ninh Beach, Quang Binh Province, Vietnam",
    isActive: true,
    isPremium: true,
    isVerified: true
  },
  {
    name: "BinBin Homestay Đồng Hới Quảng Bình",
    category: "accommodation",
    description: "BinBin Homestay offers authentic local accommodation experience in Dong Hoi city center.",
    latitude: "17.4677",
    longitude: "106.6014", 
    address: "Dong Hoi, Quang Binh Province, Vietnam",
    isActive: true,
    isPremium: false,
    isVerified: true
  },
  {
    name: "Celina Peninsula Resort- Resort đẹp Quảng Bình",
    category: "accommodation",
    description: "Celina Peninsula Resort is a beautiful luxury resort offering premium accommodation in Quang Binh Province.",
    latitude: "17.4500",
    longitude: "106.6200",
    address: "Quang Binh Province, Vietnam",
    isActive: true,
    isPremium: true,
    isVerified: true
  },
  {
    name: "Chạy Lập Farmstay",
    category: "accommodation",
    description: "Chạy Lập Farmstay offers rural accommodation experience with farm activities and local culture immersion.",
    latitude: "17.5500",
    longitude: "106.2800",
    address: "Phong Nha, Quang Binh Province, Vietnam",
    isActive: true,
    isPremium: false,
    isVerified: true
  },
  {
    name: "Cối Xay Gió Homestay Quảng Bình",
    category: "accommodation",
    description: "Cối Xay Gió Homestay provides charming windmill-themed accommodation in Quang Binh.",
    latitude: "17.5200",
    longitude: "106.3000",
    address: "Quang Binh Province, Vietnam",
    isActive: true,
    isPremium: false,
    isVerified: true
  },
  {
    name: "Danh Lam Homestay(tân hoá.quảng bình)",
    category: "accommodation",
    description: "Danh Lam Homestay offers comfortable accommodation in Tan Hoa area of Quang Binh Province.",
    latitude: "17.5000",
    longitude: "106.2500",
    address: "Tan Hoa, Quang Binh Province, Vietnam",
    isActive: true,
    isPremium: false,
    isVerified: true
  },
  {
    name: "Dolphin Homestay",
    category: "accommodation",
    description: "Dolphin Homestay provides cozy accommodation with marine-themed decor near Phong Nha attractions.",
    latitude: "17.5985",
    longitude: "106.2636",
    address: "Phong Nha, Quang Binh Province, Vietnam",
    isActive: true,
    isPremium: false,
    isVerified: true
  },
  {
    name: "Dozy Hostel",
    category: "accommodation",
    description: "Dozy Hostel offers budget accommodation for backpackers exploring the Phong Nha region.",
    latitude: "17.5985",
    longitude: "106.2636",
    address: "Phong Nha, Quang Binh Province, Vietnam",
    isActive: true,
    isPremium: false,
    isVerified: true
  },
  {
    name: "Duy Tân Resort Quảng Bình",
    category: "accommodation",
    description: "Duy Tân Resort provides comfortable resort accommodation in Quang Binh Province.",
    latitude: "17.4800",
    longitude: "106.6100",
    address: "Quang Binh Province, Vietnam",
    isActive: true,
    isPremium: true,
    isVerified: true
  },
  {
    name: "East Hill - Phong Nha",
    category: "accommodation",
    description: "East Hill offers hillside accommodation with panoramic views of Phong Nha landscape.",
    latitude: "17.6100",
    longitude: "106.2700",
    address: "Phong Nha, Quang Binh Province, Vietnam",
    isActive: true,
    isPremium: true,
    isVerified: true
  },
  {
    name: "Elements Collection",
    category: "accommodation",
    description: "Elements Collection provides luxury accommodation with modern amenities in Phong Nha area.",
    latitude: "17.5985",
    longitude: "106.2636",
    address: "Phong Nha, Quang Binh Province, Vietnam",
    isActive: true,
    isPremium: true,
    isVerified: true
  },
  {
    name: "Fami Homestay",
    category: "accommodation",
    description: "Fami Homestay offers family-friendly accommodation with local hospitality in Phong Nha.",
    latitude: "17.5985",
    longitude: "106.2636",
    address: "Phong Nha, Quang Binh Province, Vietnam",
    isActive: true,
    isPremium: false,
    isVerified: true
  },
  {
    name: "Gold Coast Hotel Resort & Spa",
    category: "accommodation",
    description: "Gold Coast Hotel Resort & Spa provides luxury accommodation with spa services in Quang Binh.",
    latitude: "17.4700",
    longitude: "106.6000",
    address: "Quang Binh Province, Vietnam",
    isActive: true,
    isPremium: true,
    isVerified: true
  },
  {
    name: "Greenfield Homestay",
    category: "accommodation",
    description: "Greenfield Homestay offers eco-friendly accommodation surrounded by green fields near Phong Nha.",
    latitude: "17.5800",
    longitude: "106.2700",
    address: "Phong Nha, Quang Binh Province, Vietnam",
    isActive: true,
    isPremium: false,
    isVerified: true
  },
  {
    name: "Hải Âu Hotel and Apartment",
    category: "accommodation", 
    description: "Hải Âu Hotel and Apartment provides comfortable hotel and apartment accommodation in Dong Hoi.",
    latitude: "17.4677",
    longitude: "106.6014",
    address: "Dong Hoi, Quang Binh Province, Vietnam",
    isActive: true,
    isPremium: false,
    isVerified: true
  },
  {
    name: "HiQ Villa",
    category: "accommodation",
    description: "HiQ Villa offers luxury villa accommodation with premium amenities in Phong Nha area.",
    latitude: "17.6000",
    longitude: "106.2650",
    address: "Phong Nha, Quang Binh Province, Vietnam",
    isActive: true,
    isPremium: true,
    isVerified: true
  },
  {
    name: "Homestay hoàng dương",
    category: "accommodation",
    description: "Homestay Hoàng Dương provides authentic local accommodation experience in Quang Binh.",
    latitude: "17.5500",
    longitude: "106.2800",
    address: "Quang Binh Province, Vietnam",
    isActive: true,
    isPremium: false,
    isVerified: true
  },

  // Caves and Attractions
  {
    name: "Dark Cave",
    category: "caves",
    description: "Dark Cave is a spectacular cave system offering adventure activities like zip-lining and kayaking in Phong Nha.",
    latitude: "17.5827",
    longitude: "106.2442",
    address: "Phong Nha-Ke Bang National Park, Vietnam",
    isActive: true,
    isPremium: true,
    isVerified: true
  },
  {
    name: "En Cave",
    category: "caves",
    description: "En Cave is one of the world's largest caves, offering multi-day expedition experiences in pristine underground environments.",
    latitude: "17.4500",
    longitude: "106.1700",
    address: "Phong Nha-Ke Bang National Park, Vietnam",
    isActive: true,
    isPremium: true,
    isVerified: true
  },
  {
    name: "Hang Sơn Đoòng",
    category: "caves",
    description: "Hang Sơn Đoòng is the world's largest cave passage, offering exclusive expedition tours for the most adventurous travelers.",
    latitude: "17.4574",
    longitude: "106.1715",
    address: "Phong Nha-Ke Bang National Park, Vietnam",
    isActive: true,
    isPremium: true,
    isVerified: true
  },
  {
    name: "Hang Trạ Ang",
    category: "caves",
    description: "Hang Trạ Ang is a beautiful cave system with stunning formations and underground chambers in Phong Nha.",
    latitude: "17.5500",
    longitude: "106.2000",
    address: "Phong Nha-Ke Bang National Park, Vietnam",
    isActive: true,
    isPremium: false,
    isVerified: true
  },
  {
    name: "Hang Va Cave",
    category: "caves",
    description: "Hang Va Cave offers challenging cave exploration with beautiful formations and underground pools.",
    latitude: "17.4600",
    longitude: "106.1800",
    address: "Phong Nha-Ke Bang National Park, Vietnam",
    isActive: true,
    isPremium: true,
    isVerified: true
  },

  // Food & Drink
  {
    name: "A Trần - cơm gà xối mỡ",
    category: "street-food",
    description: "A Trần serves delicious traditional Vietnamese chicken rice with rich flavors and authentic local spices.",
    latitude: "17.5985",
    longitude: "106.2636", 
    address: "Phong Nha, Quang Binh Province, Vietnam",
    isActive: true,
    isPremium: false,
    isVerified: true
  },
  {
    name: "Bánh khoái Tứ Quý",
    category: "street-food",
    description: "Bánh khoái Tứ Quý specializes in traditional Vietnamese bánh khoái pancakes with fresh herbs and dipping sauce.",
    latitude: "17.4677",
    longitude: "106.6014",
    address: "Dong Hoi, Quang Binh Province, Vietnam",
    isActive: true,
    isPremium: false,
    isVerified: true
  },
  {
    name: "Bún Bò Huế",
    category: "street-food",
    description: "Authentic Bún Bò Huế restaurant serving spicy beef noodle soup from central Vietnam.",
    latitude: "17.5985",
    longitude: "106.2636",
    address: "Phong Nha, Quang Binh Province, Vietnam",
    isActive: true,
    isPremium: false,
    isVerified: true
  },
  {
    name: "Casual beer restaurant",
    category: "food-drink",
    description: "Casual beer restaurant offering cold beers and local Vietnamese dishes in a relaxed atmosphere.",
    latitude: "17.5985",
    longitude: "106.2636",
    address: "Phong Nha, Quang Binh Province, Vietnam",
    isActive: true,
    isPremium: false,
    isVerified: true
  },
  {
    name: "Coffee Lyly 89",
    category: "cafe",
    description: "Coffee Lyly 89 serves excellent Vietnamese coffee and light snacks in a cozy local setting.",
    latitude: "17.5985",
    longitude: "106.2636",
    address: "Phong Nha, Quang Binh Province, Vietnam",
    isActive: true,
    isPremium: false,
    isVerified: true
  },
  {
    name: "Geminai Restaurant",
    category: "food-drink",
    description: "Geminai Restaurant offers Vietnamese and international cuisine with fresh local ingredients.",
    latitude: "17.5985",
    longitude: "106.2636",
    address: "Phong Nha, Quang Binh Province, Vietnam",
    isActive: true,
    isPremium: false,
    isVerified: true
  },
  {
    name: "Genkan Vegan Cafe",
    category: "cafe",
    description: "Genkan Vegan Cafe serves healthy plant-based meals and organic coffee in an eco-friendly environment.",
    latitude: "17.5985",
    longitude: "106.2636",
    address: "Phong Nha, Quang Binh Province, Vietnam",
    isActive: true,
    isPremium: false,
    isVerified: true
  },
  {
    name: "Ha Linh Restaurant",
    category: "food-drink",
    description: "Ha Linh Restaurant serves traditional Vietnamese cuisine with family recipes and fresh ingredients.",
    latitude: "17.5985",
    longitude: "106.2636",
    address: "Phong Nha, Quang Binh Province, Vietnam",
    isActive: true,
    isPremium: false,
    isVerified: true
  },
  {
    name: "Lotus Restaurant - Phong Nha",
    category: "food-drink",
    description: "Lotus Restaurant offers Vietnamese and Asian fusion cuisine in a beautiful setting near Phong Nha caves.",
    latitude: "17.5985",
    longitude: "106.2636",
    address: "Phong Nha, Quang Binh Province, Vietnam",
    isActive: true,
    isPremium: true,
    isVerified: true
  },
  {
    name: "Mê Công Cafe",
    category: "cafe",
    description: "Mê Công Cafe serves Vietnamese coffee and local dishes with views of the Mekong Delta region.",
    latitude: "17.5985",
    longitude: "106.2636",
    address: "Phong Nha, Quang Binh Province, Vietnam",
    isActive: true,
    isPremium: false,
    isVerified: true
  },

  // Tours and Activities
  {
    name: "Jungle Boss Trekking Tours Headquarters",
    category: "tours",
    description: "Jungle Boss Trekking Tours provides expert guided tours and trekking adventures in Phong Nha jungles.",
    latitude: "17.5985",
    longitude: "106.2636",
    address: "Phong Nha, Quang Binh Province, Vietnam",
    isActive: true,
    isPremium: true,
    isVerified: true
  },
  {
    name: "Oxalis Adventure Tours",
    category: "tours",
    description: "Oxalis Adventure Tours specializes in cave expeditions and adventure tours in Phong Nha-Ke Bang National Park.",
    latitude: "17.5985",
    longitude: "106.2636",
    address: "Phong Nha, Quang Binh Province, Vietnam",
    isActive: true,
    isPremium: true,
    isVerified: true
  },
  {
    name: "Phong Nha Motorbike tour",
    category: "tours", 
    description: "Phong Nha Motorbike Tours offers scenic motorcycle tours through the beautiful countryside and cave areas.",
    latitude: "17.5985",
    longitude: "106.2636",
    address: "Phong Nha, Quang Binh Province, Vietnam",
    isActive: true,
    isPremium: false,
    isVerified: true
  },
  {
    name: "Wildlife and Jungle Adventure - ECOFOOT",
    category: "tours",
    description: "ECOFOOT provides eco-friendly wildlife and jungle adventures with sustainable tourism practices.",
    latitude: "17.5985",
    longitude: "106.2636",
    address: "Phong Nha, Quang Binh Province, Vietnam", 
    isActive: true,
    isPremium: true,
    isVerified: true
  },

  // Parks and Natural Attractions
  {
    name: "Bao Ninh Beach",
    category: "attractions",
    description: "Bao Ninh Beach offers pristine sandy beaches and clear waters perfect for swimming and relaxation.",
    latitude: "17.4833",
    longitude: "106.6167",
    address: "Bao Ninh, Quang Binh Province, Vietnam",
    isActive: true,
    isPremium: false,
    isVerified: true
  },
  {
    name: "Phong Nha - Ke Bang National Park",
    category: "parks",
    description: "Phong Nha-Ke Bang National Park is a UNESCO World Heritage site featuring spectacular caves and biodiversity.",
    latitude: "17.5827",
    longitude: "106.2442",
    address: "Phong Nha-Ke Bang National Park, Vietnam",
    isActive: true,
    isPremium: true,
    isVerified: true
  },
  {
    name: "Phong Nha Botanic Garden",
    category: "parks",
    description: "Phong Nha Botanic Garden showcases native flora and fauna of the region with educational trails.",
    latitude: "17.5985",
    longitude: "106.2636",
    address: "Phong Nha, Quang Binh Province, Vietnam",
    isActive: true,
    isPremium: false,
    isVerified: true
  }
];

async function getCategoryId(categorySlug: string): Promise<number> {
  try {
    const [category] = await db
      .select()
      .from(categories)
      .where(eq(categories.slug, categorySlug))
      .limit(1);
    
    if (category) {
      return category.id;
    }
    
    // Default to attractions if category not found
    const [defaultCategory] = await db
      .select()
      .from(categories)
      .where(eq(categories.slug, 'attractions'))
      .limit(1);
    
    return defaultCategory?.id || 1;
  } catch (error) {
    console.error('Error getting category ID:', error);
    return 1;
  }
}

export async function importManualBusinesses(): Promise<void> {
  console.log('🚀 Starting manual import of Phong Nha businesses...');
  
  let successCount = 0;
  let failCount = 0;
  
  for (let i = 0; i < businessData.length; i++) {
    const business = businessData[i];
    console.log(`📋 Processing ${i + 1}/${businessData.length}: ${business.name}`);
    
    try {
      const categoryId = await getCategoryId(business.category);
      
      // Check if business already exists
      const existingBusiness = await db
        .select()
        .from(businesses)
        .where(eq(businesses.name, business.name))
        .limit(1);
      
      const businessRecord = {
        name: business.name,
        description: business.description,
        latitude: business.latitude,
        longitude: business.longitude,
        address: business.address,
        categoryId,
        isActive: business.isActive,
        isPremium: business.isPremium,
        isVerified: business.isVerified,
        isRecommended: false,
        imageUrl: getDefaultImage(business.category),
        tags: [business.category],
        createdAt: new Date(),
        updatedAt: new Date()
      };
      
      if (existingBusiness.length > 0) {
        console.log(`🔄 Updating existing business: ${business.name}`);
        await db
          .update(businesses)
          .set({
            ...businessRecord,
            updatedAt: new Date()
          })
          .where(eq(businesses.id, existingBusiness[0].id));
      } else {
        console.log(`➕ Creating new business: ${business.name}`);
        await db
          .insert(businesses)
          .values(businessRecord);
      }
      
      successCount++;
      console.log(`✅ Processed: ${business.name} (Category: ${business.category})`);
      
    } catch (error) {
      console.error(`❌ Failed to process ${business.name}:`, error);
      failCount++;
    }
  }
  
  console.log('\n📊 Import Summary:');
  console.log(`✅ Successfully imported: ${successCount} businesses`);
  console.log(`❌ Failed to import: ${failCount} businesses`);
  console.log(`📈 Success rate: ${((successCount / businessData.length) * 100).toFixed(1)}%`);
}

function getDefaultImage(category: string): string {
  const imageMap: Record<string, string> = {
    'accommodation': 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400',
    'caves': 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400',
    'food-drink': 'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400',
    'street-food': 'https://images.unsplash.com/photo-1563379091339-03246962d51d?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400',
    'cafe': 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400',
    'tours': 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400',
    'attractions': 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400',
    'parks': 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400'
  };
  
  return imageMap[category] || imageMap['attractions'];
}

export default importManualBusinesses;

// Run if this file is executed directly
if (process.argv[1].endsWith('manualImport.ts')) {
  importManualBusinesses()
    .then(() => {
      console.log('🎉 Manual import completed successfully!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('💥 Manual import failed:', error);
      process.exit(1);
    });
}