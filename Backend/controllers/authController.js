const { registerUser } = require('../models/userModel');
const { client } = require('../config/db'); 
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Register a new user
const register = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    await registerUser(name, email, password, res);
  } catch (error) {
    console.error('Error in register controller:', error.message || error);
    res.status(500).json({ error: 'Internal server error' });
  }
};


// User login and JWT token generation
const login = async (req, res) => {
    const { email, password } = req.body;
  
    try {
      const result = await client.query('SELECT * FROM users WHERE email = $1', [email]);
  
      // Check if the user exists
      if (result.rows.length === 0) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      const user = result.rows[0];
  
      // Compare provided password with stored password hash
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(400).json({ message: 'Invalid credentials' });
      }
  
      // Generate JWT token
      const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });
  
      res.status(200).json({ token });
    } catch (error) {
      console.error('Login error: ', error);
      res.status(500).json({ message: 'Error logging in', error });
    }
  };

module.exports = { register, login };
