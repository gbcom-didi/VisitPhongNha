
const postgres = require('postgres');

async function updateUserRole() {
  try {
    // Use the DATABASE_URL from environment
    const connectionString = process.env.DATABASE_URL;
    if (!connectionString) {
      console.log('DATABASE_URL not found. Please set your database connection string.');
      return;
    }
    
    const sql = postgres(connectionString, { max: 1 });
    
    // Update user role directly in database
    const result = await sql`
      UPDATE users 
      SET role = 'admin', updated_at = NOW() 
      WHERE email = 'glenbowdencom@gmail.com'
      RETURNING id, email, role, "firstName", "lastName"
    `;
    
    if (result.length > 0) {
      console.log('✅ Successfully updated role to admin!');
      console.log('User details:', {
        id: result[0].id,
        email: result[0].email,
        role: result[0].role,
        name: `${result[0].firstName || ''} ${result[0].lastName || ''}`.trim()
      });
    } else {
      console.log('❌ User not found with email: glenbowdencom@gmail.com');
      
      // Let's check what users exist
      const users = await sql`
        SELECT id, email, role, "firstName", "lastName" 
        FROM users 
        LIMIT 5
      `;
      console.log('Existing users:');
      users.forEach(user => {
        console.log(`- ${user.email} (${user.role})`);
      });
    }
    
    await sql.end();
  } catch (error) {
    console.error('❌ Error updating role:', error.message);
  }
}

updateUserRole();
