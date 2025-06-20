
const fetch = require('node-fetch');

async function updateUserRole() {
  try {
    // First, get your user ID by email
    const response = await fetch('http://localhost:5000/api/admin/users', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      console.log('Note: This requires admin access. You may need to manually update the database.');
      return;
    }

    const users = await response.json();
    const user = users.find(u => u.email === 'glenbowdencom@gmail.com');
    
    if (!user) {
      console.log('User not found');
      return;
    }

    // Update role to admin
    const updateResponse = await fetch(`http://localhost:5000/api/admin/users/${user.id}/role`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ role: 'admin' }),
    });

    if (updateResponse.ok) {
      console.log('Role updated successfully to admin');
    } else {
      console.log('Failed to update role');
    }
  } catch (error) {
    console.error('Error:', error.message);
  }
}

updateUserRole();
