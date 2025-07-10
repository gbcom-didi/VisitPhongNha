
import { db } from './server/db.js';
import { sql } from 'drizzle-orm';

async function runMigrations() {
  console.log('Running database migrations...');
  
  try {
    // Check if rate_limits table exists, if not create it
    console.log('Creating rate_limits table if it does not exist...');
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS rate_limits (
        id SERIAL PRIMARY KEY,
        identifier VARCHAR(255) NOT NULL,
        action VARCHAR(50) NOT NULL,
        count INTEGER DEFAULT 1,
        window_start TIMESTAMP DEFAULT NOW(),
        created_at TIMESTAMP DEFAULT NOW()
      )
    `);
    
    // Check if is_spam column exists in guestbook_comments, if not add it
    console.log('Adding is_spam column to guestbook_comments if it does not exist...');
    await db.execute(sql`
      ALTER TABLE guestbook_comments 
      ADD COLUMN IF NOT EXISTS is_spam BOOLEAN DEFAULT false
    `);
    
    console.log('✅ Database migrations completed successfully!');
  } catch (error) {
    console.error('❌ Migration failed:', error);
    throw error;
  }
}

runMigrations()
  .then(() => {
    console.log('All migrations completed');
    process.exit(0);
  })
  .catch((error) => {
    console.error('Migration failed:', error);
    process.exit(1);
  });
