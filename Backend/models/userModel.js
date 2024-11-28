const client = require('../config/db');
const bcrypt = require('bcryptjs');

// Registers a new user in the database
const registerUser = async (name, email, password) => {
  // Hash the user's password
  const hashedPassword = await bcrypt.hash(password, 10);

  const query = `
    INSERT INTO users (name, email, password)
    VALUES ($1, $2, $3) 
    RETURNING id, name, email, role;
  `;
  const values = [name, email, hashedPassword];

  try {
    const result = await client.query(query, values);

    console.log('New user registered:', {
      id: result.rows[0].id,
      name: result.rows[0].name,
      email: result.rows[0].email,
    });

    return result.rows[0];
  } catch (error) {
    console.error('Error registering new user:', error);
    throw new Error('Failed to register user');
  }
};

module.exports = { registerUser };
