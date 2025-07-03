
const { Pool } = require('@neondatabase/serverless');

async function listBusinessNames() {
  const pool = new Pool({ connectionString: process.env.DATABASE_URL });
  
  try {
    console.log('Connecting to database...');
    
    const result = await pool.query(`
      SELECT id, name 
      FROM businesses 
      ORDER BY name ASC
    `);
    
    console.log(`\n📋 Found ${result.rows.length} businesses in the database:\n`);
    
    result.rows.forEach((business, index) => {
      console.log(`${index + 1}. ${business.name} (ID: ${business.id})`);
    });
    
    console.log(`\n✅ Total: ${result.rows.length} businesses`);
    
  } catch (error) {
    console.error('Error fetching businesses:', error.message);
  } finally {
    await pool.end();
  }
}

listBusinessNames();
