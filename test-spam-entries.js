// Test script to create spam entries for testing the moderation system
const testEntries = [
  {
    // Normal entry - should be approved
    message: "Had an amazing experience exploring the caves at Phong Nha! The underground rivers were breathtaking.",
    nationality: "Australia",
    location: "Phong Nha Cave",
    authorName: "Sarah Johnson",
    type: "normal"
  },
  {
    // Promotional spam - should be flagged
    message: "AMAZING DEALS! Visit our website www.cheapdeals.com for the BEST PRICES on tours! Call us now at +84-123-456-789 for exclusive offers! Don't miss out! LIMITED TIME ONLY! Book now at https://bestdeals.com/phong-nha",
    nationality: "Vietnam", 
    location: "Phong Nha Town",
    authorName: "Marketing Bot",
    type: "promotional_spam"
  },
  {
    // Repetitive spam - should be flagged
    message: "Best tour best tour best tour! Amazing amazing amazing experience! Must visit must visit must visit! Book now book now book now!",
    nationality: "Thailand",
    location: "Phong Nha National Park", 
    authorName: "Spam Account",
    type: "repetitive_spam"
  },
  {
    // Contact info spam - should be flagged
    message: "Great place! Contact me at spammer@email.com or call +84-999-888-777 for amazing tour packages. WhatsApp: +84-111-222-333",
    nationality: "Singapore",
    location: "Paradise Cave",
    authorName: "Tour Spammer",
    type: "contact_spam"
  },
  {
    // Normal entry with some promotional language - borderline case
    message: "Visited Phong Nha last week and it was incredible! The boat tour through the caves was worth every penny. Highly recommend booking in advance during peak season.",
    nationality: "Canada",
    location: "Phong Nha-Ke Bang National Park",
    authorName: "Mike Chen",
    type: "borderline"
  }
];

console.log('Test entries for spam detection:');
testEntries.forEach((entry, index) => {
  console.log(`\n${index + 1}. ${entry.type.toUpperCase()}`);
  console.log(`Author: ${entry.authorName}`);
  console.log(`Message: ${entry.message.substring(0, 100)}...`);
});