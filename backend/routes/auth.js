const express = require('express');
const jwt = require('jsonwebtoken'); // For generating the JWT token
const dotenv = require('dotenv');

dotenv.config();
const router = express.Router();

// Hardcoded admin credentials (you can replace this with a database check in production)
const ADMIN_USERNAME = process.env.ADMIN_USERNAME;
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;

// Admin login route
router.post('/adminlogin', (req, res) => {
  const { username, password } = req.body;

  // Check if username and password are provided
  if (!username || !password) {
    return res.status(400).json({ message: 'Username and password are required' });
  }

  // Simple validation check (hardcoded username and password)
  if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
    // Generate a JWT token
    const token = jwt.sign({ username }, process.env.JWT_SECRET, { expiresIn: '1h' });

    return res.json({ message: 'Login successful', token });
  }

  // If credentials are incorrect
  return res.status(401).json({ message: 'Invalid credentials' });
});

module.exports = router;
