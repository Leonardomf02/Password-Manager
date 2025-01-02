const { client } = require('../config/db');
const bcrypt = require('bcryptjs');

// Registers a new user in the database
const registerUser = async (name, email, password, res) => {
  const minPasswordLength = 12; // Minimum length for the password
  const maxPasswordLength = 20; // Maximum length for the password

  // Check if the password length is within the allowed range
  if (password.length < minPasswordLength || password.length > maxPasswordLength) {
    console.error(`Password length error: Password must be between ${minPasswordLength} and ${maxPasswordLength} characters long.`);
    return res.status(400).json({ error: `Password must be between ${minPasswordLength} and ${maxPasswordLength} characters long.` });
  }

  // Check password complexity (must contain at least one lowercase letter, one uppercase letter, one number, and one special character)
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+={}\[\]:;"'<>,.?/\\|-]).+$/;
  if (!passwordRegex.test(password)) {
    console.error("Password complexity error: Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character.");
    return res.status(400).json({ error: "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character." });
  }

  // Hash the user's password
  let hashedPassword;
  try {
    hashedPassword = await bcrypt.hash(password, 10);
  } catch (hashError) {
    console.error("Error hashing password:", hashError);
    return res.status(500).json({ error: "Error hashing password" });
  }

  // SQL query to insert the new user into the database
  const query = `
    INSERT INTO users (name, email, password)
    VALUES ($1, $2, $3) 
    RETURNING id, name, email, role;
  `;
  const values = [name, email, hashedPassword];

  // Check if the client is initialized correctly
  if (!client || typeof client.query !== 'function') {
    console.error('Database client not initialized correctly.');
    return res.status(500).json({ error: 'Database client is not properly initialized' });
  }

  try {
    const result = await client.query(query, values);
    
    console.log('New user registered:', {
      id: result.rows[0].id,
      name: result.rows[0].name,
      email: result.rows[0].email,
    });
  
    return res.status(201).json(result.rows[0]); // Respond with user details
  } catch (error) {
    console.error('Error registering new user:', error.message || error);
    return res.status(500).json({ error: error.message || 'Failed to register user' });
  }
};

module.exports = { registerUser };
