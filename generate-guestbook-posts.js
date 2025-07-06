
const { db } = require('./server/db');
const { guestbookEntries, guestbookComments, businesses } = require('./shared/schema');

const samplePosts = [
  {
    authorId: "sample_user_1",
    authorName: "Sarah Johnson",
    message: "Just spent an incredible week in Phong Nha! The caves here are absolutely mind-blowing. Son Tra Cave was my favorite - the formations inside are like nothing I've ever seen. The local guides were so knowledgeable and made the experience even better. Already planning my next trip back!",
    nationality: "Australia",
    location: "https://maps.google.com/?q=Phong+Nha+Ke+Bang+National+Park",
    rating: 5,
    relatedPlaceName: "Sorrento Beach Club Vietnam and Kite Centre",
    comments: [
      {
        authorName: "Mike Chen",
        comment: "I completely agree! The cave systems here are unreal. Did you try the Dark Cave adventure too?"
      },
      {
        authorName: "Emma Wilson",
        comment: "Sarah, which guide company did you use? Planning a trip there next month!"
      }
    ]
  },
  {
    authorId: "sample_user_2", 
    authorName: "David Martinez",
    message: "Phong Nha exceeded all my expectations! The kitesurfing here is world-class. Perfect wind conditions and the most beautiful lagoon setting. Spent 5 days learning and now I'm completely hooked. The instructors were patient and professional. This place is a hidden gem for water sports!",
    nationality: "Spain",
    location: "https://maps.google.com/?q=My+Hoa+Lagoon+Kitesurfing",
    rating: 5,
    relatedPlaceName: "MyHoa Lagoon - Kiting Town",
    comments: [
      {
        authorName: "Lisa Park",
        comment: "The kiting conditions here are perfect! Which school did you train with?"
      },
      {
        authorName: "Tom Anderson",
        comment: "I've been thinking about trying kitesurfing. How beginner-friendly is it?"
      },
      {
        authorName: "David Martinez",
        comment: "@Tom Anderson Very beginner friendly! The instructors here are amazing and the lagoon is perfect for learning."
      }
    ]
  },
  {
    authorId: "sample_user_3",
    authorName: "Anna Kowalski", 
    message: "What an amazing cultural experience! Made my own traditional Vietnamese hat today and learned so much about the local craftsmanship. The artisans here have skills passed down through generations. It's incredible to see these traditions being preserved. Highly recommend this hands-on cultural experience!",
    nationality: "Poland",
    location: "https://maps.google.com/?q=Bong+Lai+Valley+Hat+Making",
    rating: 4,
    relatedPlaceName: "Quán Nướng Chinh",
    comments: [
      {
        authorName: "James Wilson",
        comment: "That sounds like such a unique experience! How long did it take to make the hat?"
      },
      {
        authorName: "Maria Santos",
        comment: "I love experiences like this where you can learn traditional crafts!"
      }
    ]
  },
  {
    authorId: "sample_user_4",
    authorName: "Chris Thompson",
    message: "The food scene here is absolutely incredible! Every meal has been a revelation. From street food to high-end restaurants, the flavors are out of this world. Had the best pho of my life this morning and discovered so many dishes I'd never tried before. Foodie paradise!",
    nationality: "Canada", 
    location: "https://maps.google.com/?q=Phan+Rang+Food+Street",
    rating: 5,
    relatedPlaceName: "Bánh xèo cô Luỹ",
    comments: [
      {
        authorName: "Sophie Martin",
        comment: "Yes! The bánh xèo here is amazing. Have you tried the local seafood yet?"
      },
      {
        authorName: "Roberto Silva",
        comment: "The Vietnamese cuisine here is so authentic and fresh. Every meal is an adventure!"
      },
      {
        authorName: "Chris Thompson", 
        comment: "@Sophie Martin Not yet but it's on my list! Any specific recommendations?"
      }
    ]
  },
  {
    authorId: "sample_user_5",
    authorName: "Yuki Tanaka",
    message: "Spent the day at Vinh Hy Bay and I'm still speechless. The crystal clear water, dramatic limestone cliffs, and peaceful atmosphere made it feel like paradise. Perfect for swimming and just relaxing. Brought my snorkeling gear and saw so many colorful fish. Nature at its finest!",
    nationality: "Japan",
    location: "https://maps.google.com/?q=Vinh+Hy+Bay+Vietnam",
    rating: 5,
    relatedPlaceName: "Vịnh Vĩnh Hy",
    comments: [
      {
        authorName: "Alex Johnson",
        comment: "Vinh Hy Bay is magical! The limestone formations are incredible."
      },
      {
        authorName: "Nina Petrov",
        comment: "Perfect spot for photography too. The sunset views are unreal!"
      }
    ]
  },
  {
    authorId: "sample_user_6",
    authorName: "Marcus Weber",
    message: "The adventure activities here are next level! Zip-lining through the jungle, cave exploration, and rock climbing - there's something for every adrenaline junkie. The guides prioritize safety while making sure you have the time of your life. Can't wait to come back for more adventures!",
    nationality: "Germany",
    location: "https://maps.google.com/?q=Phong+Nha+Adventure+Activities",
    rating: 4,
    relatedPlaceName: "Khu du lịch Hang Rái",
    comments: [
      {
        authorName: "Isabella Garcia",
        comment: "The zip-lining sounds amazing! How long are the lines?"
      },
      {
        authorName: "Kevin O'Connor",
        comment: "Safety is so important for adventure activities. Glad to hear they take it seriously!"
      },
      {
        authorName: "Marcus Weber",
        comment: "@Isabella Garcia The longest line is about 400 meters with stunning jungle views!"
      }
    ]
  },
  {
    authorId: "sample_user_7",
    authorName: "Priya Sharma",
    message: "As a solo female traveler, I felt completely safe and welcome here. The local community is so warm and helpful. Made friends with other travelers at the hostel and we explored together. The night market is fantastic - great food and lovely atmosphere. Perfect destination for solo adventures!",
    nationality: "India",
    location: "https://maps.google.com/?q=Ninh+Thuan+Night+Market",
    rating: 5,
    relatedPlaceName: "Ninh Thuan Tourist Night Market",
    comments: [
      {
        authorName: "Rachel Green",
        comment: "Solo travel here was amazing for me too! The community is so welcoming."
      },
      {
        authorName: "Ahmed Hassan",
        comment: "The night market is one of my favorite spots. So much delicious food!"
      },
      {
        authorName: "Priya Sharma",
        comment: "@Rachel Green Exactly! It's such an empowering experience traveling solo here."
      }
    ]
  },
  {
    authorId: "sample_user_8",
    authorName: "Oliver Smith",
    message: "The natural beauty here is absolutely stunning. Spent hours hiking through the national park and every turn revealed something more beautiful than the last. The biodiversity is incredible - saw so many unique plants and animals. A photographer's dream and nature lover's paradise!",
    nationality: "United Kingdom",
    location: "https://maps.google.com/?q=Phong+Nha+Ke+Bang+Hiking+Trails",
    rating: 5,
    relatedPlaceName: "Lo O stream",
    comments: [
      {
        authorName: "Camille Dubois",
        comment: "The hiking trails here are phenomenal! Which route did you take?"
      },
      {
        authorName: "Jake Morrison", 
        comment: "I'm bringing my camera gear next time. The wildlife photography opportunities must be incredible!"
      }
    ]
  },
  {
    authorId: "sample_user_9",
    authorName: "Elena Rossi",
    message: "What a perfect romantic getaway! My partner and I had the most magical time exploring the caves, enjoying sunset dinners, and staying at a beautiful eco-resort. The staff went above and beyond to make our anniversary special. The combination of adventure and relaxation was exactly what we needed!",
    nationality: "Italy", 
    location: "https://maps.google.com/?q=Amanoi+Resort+Vietnam",
    rating: 5,
    relatedPlaceName: "Amanoi",
    comments: [
      {
        authorName: "Daniel Kim",
        comment: "Sounds like the perfect anniversary trip! The sunsets here are incredibly romantic."
      },
      {
        authorName: "Grace Liu",
        comment: "The eco-resorts here are amazing! Great choice for a special celebration."
      },
      {
        authorName: "Elena Rossi",
        comment: "@Daniel Kim The sunsets from our resort were absolutely breathtaking! So romantic."
      }
    ]
  }
];

async function generateGuestbookPosts() {
  try {
    console.log('Starting guestbook post generation...');
    
    // Get all businesses to find related place IDs
    const allBusinesses = await db.select().from(businesses);
    console.log(`Found ${allBusinesses.length} businesses in database`);
    
    for (const post of samplePosts) {
      console.log(`Creating post by ${post.authorName}...`);
      
      // Find the related business ID
      let relatedPlaceId = null;
      if (post.relatedPlaceName) {
        const relatedBusiness = allBusinesses.find(b => 
          b.name.toLowerCase().includes(post.relatedPlaceName.toLowerCase()) ||
          post.relatedPlaceName.toLowerCase().includes(b.name.toLowerCase())
        );
        if (relatedBusiness) {
          relatedPlaceId = relatedBusiness.id;
          console.log(`  Found related place: ${relatedBusiness.name} (ID: ${relatedPlaceId})`);
        } else {
          console.log(`  Related place "${post.relatedPlaceName}" not found, using random business`);
          relatedPlaceId = allBusinesses[Math.floor(Math.random() * allBusinesses.length)].id;
        }
      }
      
      // Create the guestbook entry
      const [newEntry] = await db.insert(guestbookEntries).values({
        authorId: post.authorId,
        authorName: post.authorName,
        message: post.message,
        nationality: post.nationality,
        location: post.location,
        relatedPlaceId: relatedPlaceId,
        rating: post.rating,
        status: 'approved',
        isSpam: false,
        ipAddress: '127.0.0.1',
        userAgent: 'Sample Data Generator'
      }).returning();
      
      console.log(`  Created entry with ID: ${newEntry.id}`);
      
      // Create comments for this entry
      for (const comment of post.comments) {
        await db.insert(guestbookComments).values({
          entryId: newEntry.id,
          authorId: `comment_user_${Math.random().toString(36).substr(2, 9)}`,
          authorName: comment.authorName,
          comment: comment.comment,
          status: 'approved',
          isSpam: false,
          ipAddress: '127.0.0.1'
        });
        console.log(`    Added comment by ${comment.authorName}`);
      }
    }
    
    console.log('\n✅ Successfully generated 9 guestbook posts with comments!');
    console.log('You can view them on the guestbook page.');
    
  } catch (error) {
    console.error('❌ Error generating guestbook posts:', error);
  }
}

// Run the generation
generateGuestbookPosts().then(() => {
  process.exit(0);
}).catch((error) => {
  console.error('Script failed:', error);
  process.exit(1);
});
