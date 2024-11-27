// routes/auth.js
const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const authenticate = require("../middleware/authenticate"); // Import the authenticate middleware
require("dotenv").config();

const router = express.Router();

// Register Route
router.post("/register", async (req, res) => {
    const { username, email, password } = req.body;
    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) return res.status(400).json({ msg: "User already exists" });

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = new User({ username, email, password: hashedPassword });
        await newUser.save();

        res.status(201).json({ msg: "Registration successful. Please log in." });
    } catch (error) {
        res.status(500).json({ msg: "Server error" });
    }
});

// Update Password Route (authenticated)
router.put('/update-password', authenticate, async (req, res) => {
    const { currentPassword, newPassword, confirmPassword } = req.body;
    const userId = req.user.id; // Get user ID from the JWT token

    // Validate that the passwords are provided
    if (!currentPassword || !newPassword || !confirmPassword) {
        return res.status(400).json({ message: 'All fields are required' });
    }

    // Check if the new password and confirm password match
    if (newPassword !== confirmPassword) {
        return res.status(400).json({ message: 'Passwords do not match' });
    }

    try {
        // Find the user
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Check if the current password matches
        const isMatch = await bcrypt.compare(currentPassword, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Current password is incorrect' });
        }

        // Hash the new password
        const hashedPassword = await bcrypt.hash(newPassword, 10);

        // Update the password in the database
        user.password = hashedPassword;
        await user.save();

        res.status(200).json({ message: 'Password updated successfully!' });
    } catch (error) {
        res.status(500).json({ message: 'Error updating password', error: error.message });
    }
});

// Login Route
router.post("/login", async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ msg: "Invalid credentials" });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ msg: "Invalid credentials" });

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "1h" });

        res.json({ token, user: { id: user._id, username: user.username, email: user.email } });
    } catch (error) {
        res.status(500).json({ msg: "Server error" });
    }
});

module.exports = router;
