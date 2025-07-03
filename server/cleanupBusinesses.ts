import { db } from './db';
import { businesses, businessCategories, userLikes, guestbookEntries, guestbookComments, guestbookEntryLikes, guestbookCommentLikes } from '@shared/schema';
import { sql, not, inArray } from 'drizzle-orm';
import fs from 'fs';

async function cleanupBusinesses() {
  console.log('🧹 Starting business cleanup...');
  
  // Read authentic business names from CSV extract
  const authenticBusinessNames = fs.readFileSync('authentic_business_names.txt', 'utf-8')
    .split('\n')
    .filter(name => name.trim() !== '')
    .map(name => name.trim());
  
  console.log(`📋 Found ${authenticBusinessNames.length} authentic businesses in CSV`);
  
  // Get current business count
  const currentBusinesses = await db.select({ name: businesses.name }).from(businesses);
  console.log(`📊 Current database has ${currentBusinesses.length} businesses`);
  
  // Find businesses to delete (not in authentic list)
  const businessesToDelete = currentBusinesses.filter(
    business => !authenticBusinessNames.includes(business.name)
  );
  
  console.log(`🗑️ Found ${businessesToDelete.length} businesses to delete`);
  
  if (businessesToDelete.length > 0) {
    const namesToDelete = businessesToDelete.map(b => b.name);
    
    // Get business IDs to delete
    const businessIdsToDelete = await db.select({ id: businesses.id })
      .from(businesses)
      .where(inArray(businesses.name, namesToDelete));
    
    const idsToDelete = businessIdsToDelete.map(b => b.id);
    
    console.log(`🔗 Cleaning up related records for ${idsToDelete.length} businesses...`);
    
    // Delete related records first to avoid foreign key constraints
    
    // Delete from user_likes (only if there are IDs to delete)
    if (idsToDelete.length > 0) {
      const deletedLikes = await db.delete(userLikes)
        .where(inArray(userLikes.businessId, idsToDelete));
      console.log(`   - Deleted user likes`);
    }
    
    // Delete guestbook related data step by step
    if (idsToDelete.length > 0) {
      // First get all guestbook entries related to these businesses
      const entriesToDelete = await db.select({ id: guestbookEntries.id })
        .from(guestbookEntries)
        .where(inArray(guestbookEntries.relatedPlaceId, idsToDelete));
      
      const entryIds = entriesToDelete.map(e => e.id);
      
      if (entryIds.length > 0) {
        console.log(`   - Found ${entryIds.length} guestbook entries to clean up`);
        
        // Get all comment IDs for these entries
        const commentsToDelete = await db.select({ id: guestbookComments.id })
          .from(guestbookComments)
          .where(inArray(guestbookComments.entryId, entryIds));
        
        const commentIds = commentsToDelete.map(c => c.id);
        
        if (commentIds.length > 0) {
          // Delete comment likes
          await db.delete(guestbookCommentLikes)
            .where(inArray(guestbookCommentLikes.commentId, commentIds));
          console.log(`   - Deleted comment likes`);
          
          // Delete comments
          await db.delete(guestbookComments)
            .where(inArray(guestbookComments.entryId, entryIds));
          console.log(`   - Deleted comments`);
        }
        
        // Delete entry likes
        await db.delete(guestbookEntryLikes)
          .where(inArray(guestbookEntryLikes.entryId, entryIds));
        console.log(`   - Deleted entry likes`);
        
        // Finally delete the entries
        await db.delete(guestbookEntries)
          .where(inArray(guestbookEntries.relatedPlaceId, idsToDelete));
        console.log(`   - Deleted guestbook entries`);
      }
    }
    
    // Delete business categories relationships
    await db.delete(businessCategories)
      .where(inArray(businessCategories.businessId, idsToDelete));
    console.log(`   - Deleted business category relationships`);
    
    // Now delete the businesses
    const result = await db.delete(businesses)
      .where(inArray(businesses.name, namesToDelete));
    
    console.log(`✅ Deleted ${businessesToDelete.length} non-authentic businesses`);
    
    // Show some examples of what was deleted
    console.log('📝 Examples of deleted businesses:');
    namesToDelete.slice(0, 10).forEach(name => console.log(`   - ${name}`));
    if (namesToDelete.length > 10) {
      console.log(`   ... and ${namesToDelete.length - 10} more`);
    }
  } else {
    console.log('✅ No businesses to delete - all are authentic!');
  }
  
  // Final count
  const finalBusinesses = await db.select({ name: businesses.name }).from(businesses);
  console.log(`🎉 Final database has ${finalBusinesses.length} authentic businesses`);
  
  console.log('✨ Cleanup complete!');
}

cleanupBusinesses().catch(console.error);