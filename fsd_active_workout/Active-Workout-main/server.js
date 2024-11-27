// server.js
const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const app = express();

app.use(express.json()); // Middleware to parse JSON bodies
app.use(cors()); // For handling Cross-Origin Resource Sharing

// MongoDB connection (replace with your actual DB connection details)
mongoose.connect('mongodb://localhost:27017/your-database', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

// User schema (simplified)
const UserSchema = new mongoose.Schema({
  username: String,
  email: String,
  password: String, // Store password in hashed form
});

const User = mongoose.model('User', UserSchema);

// Middleware to authenticate users using JWT
const authenticate = (req, res, next) => {
  const token = req.header('x-auth-token');
  if (!token) return res.status(401).json({ message: 'Access denied' });

  try {
    const decoded = jwt.verify(token, 'your-secret-key'); // Secret key for JWT
    req.user = decoded; // Store decoded user information in req.user
    next();
  } catch (error) {
    res.status(400).json({ message: 'Invalid token' });
  }
};

// Password update route
app.put('/update-password', authenticate, async (req, res) => {
  const { password } = req.body;
  const userId = req.user.id; // Get user ID from the JWT token

  if (!password) {
    return res.status(400).json({ message: 'Password is required' });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10); // Hash the password
    await User.findByIdAndUpdate(userId, { password: hashedPassword }); // Update the password in DB
    res.status(200).json({ message: 'Password updated successfully!' });
  } catch (error) {
    console.error('Error updating password:', error);
    res.status(500).json({ message: 'Error updating password', error });
  }
});

// Start the server
app.listen(5000, () => {
  console.log('Server running on port 5000');
});
