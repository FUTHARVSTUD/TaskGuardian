const express = require('express');
const router = express.Router();
const User = require('../models/user');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Registration Route
router.post('/register', async (req, res) => {
    try {
        // 1. Check if the user already exists
        const existingUser = await User.findOne({ username: req.body.username });
        if (existingUser) {
            return res.status(400).json({ error: 'Username already exists' });
        }

        // 2. Hash the password
        const hashedPassword = await bcrypt.hash(req.body.password, 10);

        // 3. Create a new user
        const newUser = new User({
            username: req.body.username,
            password: hashedPassword,
            role: 'regular'
        });

        // 4. Save the user
        await newUser.save();

        res.status(201).json({ message: 'User created successfully' });

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Login Route
router.post('/login', async (req, res) => {
    try {
        // 1. Find the user
        const user = await User.findOne({ username: req.body.username });
        if (!user) {
            return res.status(400).json({ error: 'Incorrect username or password' });
        }

        // 2. Compare passwords
        const isPasswordValid = await bcrypt.compare(req.body.password, user.password);
        if (!isPasswordValid) {
            return res.status(400).json({ error: 'Incorrect username or password' });
        }

        // 3. Generate JWT
        const token = jwt.sign({ userId: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });

        res.json({ token });

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
