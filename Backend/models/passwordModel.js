const { client } = require('../config/db');
const { decrypt } = require('../utils/crypto');

// Create a new password entry for the user
const createPassword = async (userId, service, username, password, notes, url, protected) => {
  const query = `
    INSERT INTO passwords (user_id, service, username, password, notes, url, protected)
    VALUES ($1, $2, $3, $4, $5, $6, $7)
    RETURNING id, service, username, password, notes, url, protected, created_at, updated_at;
  `;
  const values = [userId, service, username, password, notes || null, url || null, protected || false];
  
  const result = await client.query(query, values);
  return result.rows[0];
};

// Retrieve all passwords for a specific user
const getPasswords = async (userId) => {
  const query = `
    SELECT id, service, username, password, notes, url, protected, created_at, updated_at 
    FROM passwords 
    WHERE user_id = $1;
  `;
  const result = await client.query(query, [userId]);

  return result.rows.map((password) => {
    if (!password.protected) {
      try {
        // Attempt to decrypt if not protected
        password.password = decrypt(password.password);
      } catch (error) {
        console.error(`Error decrypting password for ID ${password.id}:`, error);
        password.password = null;
      }
    } else {
      password.password = null;
    }

    return password;
  });
};

// Retrieve a specific password by ID for a user
const getPasswordById = async (passwordId, userId) => {
  const query = `
    SELECT id, service, username, password, notes, url, protected, created_at, updated_at
    FROM passwords
    WHERE id = $1 AND user_id = $2;
  `;
  const values = [passwordId, userId];

  const result = await client.query(query, values);
  const passwordDetails = result.rows[0];

  if (!passwordDetails) {
    console.log(`Password with ID ${passwordId} not found for user ${userId}`);
    return null;
  }

  // Log the fetched password details
  console.log('Password details fetched:', passwordDetails);

  if (passwordDetails.protected) {
    console.log(`Password with ID ${passwordId} is marked as protected.`);
    return passwordDetails; // Return without attempting decryption
  }

  try {
    const decryptedPassword = decrypt(passwordDetails.password);
    console.log('Password decrypted successfully:', decryptedPassword);

    return { ...passwordDetails, password: decryptedPassword };
  } catch (error) {
    console.error('Error decrypting password:', error);
    throw new Error('Failed to decrypt password');
  }
};

// Update an existing password for a user
const updatePassword = async (passwordId, userId, service, username, password, notes, url, protected) => {
  const query = `
    UPDATE passwords
    SET service = $1, username = $2, password = $3, notes = $4, url = $5, protected = $6, updated_at = NOW()
    WHERE id = $7 AND user_id = $8
    RETURNING id, service, username, password, notes, url, protected, created_at, updated_at;
  `;
  const values = [service, username, password, notes || null, url || null, protected, passwordId, userId];

  const result = await client.query(query, values);
  return result.rows[0];
};

// Delete a password by ID for a specific user
const deletePassword = async (passwordId, userId) => {
  const query = `
    DELETE FROM passwords
    WHERE id = $1 AND user_id = $2
    RETURNING id;
  `;
  const values = [passwordId, userId];

  const result = await client.query(query, values);
  return result.rows[0];
};

module.exports = { 
  createPassword, 
  getPasswords, 
  getPasswordById, 
  updatePassword, 
  deletePassword 
};
