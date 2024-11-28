const { 
  createPassword, 
  getPasswords, 
  getPasswordById, 
  updatePassword, 
  deletePassword 
} = require('../models/passwordModel');
const { client } = require('../config/db');
const jwt = require('jsonwebtoken');
const { encrypt, decrypt } = require('../utils/crypto');
const bcrypt = require('bcryptjs');

// Handles password creation
const createPasswordHandler = async (req, res) => {
  const { service, username, password, notes, url, protected } = req.body;
  const userId = req.user.id;

  try {
    console.log('Creating password for user:', userId);
    const encryptedPassword = encrypt(password);

    const newPassword = await createPassword(
      userId, 
      service, 
      username, 
      encryptedPassword, 
      notes, 
      url, 
      protected
    );
    console.log('Password created successfully:', newPassword);
    res.status(201).json(newPassword);
  } catch (error) {
    console.error('Error creating password:', error);
    res.status(500).json({ message: 'Error creating password', error });
  }
};

// Handles fetching all passwords
const getPasswordsHandler = async (req, res) => {
  const userId = req.user.id;

  try {
    console.log('Fetching passwords for user:', userId);
    const passwords = await getPasswords(userId);
    res.status(200).json(passwords);
  } catch (error) {
    console.error('Error fetching passwords:', error);
    res.status(500).json({ message: 'Error fetching passwords', error });
  }
};

// Reveals a password after verifying the master password
const revealPasswordHandler = async (req, res) => {
  const { password: masterPassword } = req.body;
  const userId = req.user.id;
  const { passwordId } = req.params;

  try {
    console.log('Revealing password for:', { userId, passwordId });

    // Retrieves the user's master password hash
    const userQuery = 'SELECT password FROM users WHERE id = $1';
    const userResult = await client.query(userQuery, [userId]);

    if (!userResult.rows.length) {
      console.log('User not found:', userId);
      return res.status(404).json({ message: 'User not found' });
    }

    console.log('Fetched user password hash:', userResult.rows[0].password);

    const isPasswordValid = await bcrypt.compare(masterPassword, userResult.rows[0].password);
    console.log('Master password match:', isPasswordValid);

    if (!isPasswordValid) {
      console.log('Invalid master password for user:', userId);
      return res.status(401).json({ message: 'Invalid master password' });
    }

    const savedPassword = await getPasswordById(passwordId, userId);

    if (!savedPassword || !savedPassword.password) {
      console.log('Password not found or invalid for passwordId:', passwordId);
      return res.status(404).json({ message: 'Password not found or invalid' });
    }

    console.log('Encrypted password retrieved:', savedPassword.password);
    const revealedPassword = decrypt(savedPassword.password);

    console.log('Password revealed successfully:', revealedPassword);
    res.status(200).json({ password: revealedPassword });
  } catch (error) {
    console.error('Error revealing password:', error);
    res.status(500).json({ message: 'Error revealing password', error });
  }
};

// Handles password updates
const updatePasswordHandler = async (req, res) => {
  const { passwordId } = req.params;
  const { service, username, password, notes, url, protected } = req.body;
  const userId = req.user.id;

  try {
    console.log('Updating password for:', { userId, passwordId });
    const encryptedPassword = encrypt(password);

    const updatedPassword = await updatePassword(
      passwordId, 
      userId, 
      service, 
      username, 
      encryptedPassword, 
      notes, 
      url, 
      protected
    );
    if (!updatedPassword) {
      console.log('Password not found for update:', { userId, passwordId });
      return res.status(404).json({ message: 'Password not found' });
    }
    console.log('Password updated successfully:', updatedPassword);
    res.status(200).json(updatedPassword);
  } catch (error) {
    console.error('Error updating password:', error);
    res.status(500).json({ message: 'Error updating password', error });
  }
};

// Handles password deletion
const deletePasswordHandler = async (req, res) => {
  const { passwordId } = req.params;
  const userId = req.user.id;

  try {
    console.log('Deleting password for:', { userId, passwordId });
    const deletedPassword = await deletePassword(passwordId, userId);
    if (!deletedPassword) {
      console.log('Password not found for deletion:', { userId, passwordId });
      return res.status(404).json({ message: 'Password not found' });
    }
    console.log('Password deleted successfully:', deletedPassword);
    res.status(200).json({ message: 'Password deleted successfully', id: deletedPassword.id });
  } catch (error) {
    console.error('Error deleting password:', error);
    res.status(500).json({ message: 'Error deleting password', error });
  }
};

// Authenticates requests using JWT
const authenticate = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');

  if (!token) {
    console.log('No token provided');
    return res.status(401).json({ message: 'No token provided' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log('User authenticated:', decoded);
    req.user = decoded;
    next();
  } catch (error) {
    console.log('Invalid or expired token');
    res.status(401).json({ message: 'Invalid or expired token' });
  }
};

module.exports = { 
  createPasswordHandler, 
  getPasswordsHandler, 
  revealPasswordHandler, 
  updatePasswordHandler, 
  deletePasswordHandler, 
  authenticate 
};
