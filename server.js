// server.js
const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config(); // Load environment variables

const taskRoutes = require('./routes/taskRoutes');
const authRoutes = require('./routes/authRoutes');
// ... (Middleware, error handling logic)

mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        const app = express();
        // ... middlewares ...

        app.use('/api/tasks', taskRoutes)
        app.use('/api/auth', authRoutes)
        app.listen(3000, () => console.log('Server Started'));
    })
    .catch(err => console.error('DB Connection Error', err));

// models/user.js
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    username: { type: String, require: true, unique: true },
    password: { type: String, require: true },
    role: { type: String, enum: ['admin', 'manager', 'regular'], default: 'regular' },
});

userSchema.pre('save', async function (next) {
    this.password = await bcrypt.hash(this.password, 10);
    next();
});

module.exports = mongoose.model('User', userSchema);

// routes/authRoutes.js
// ... Logic for login, registration with JWT generation

// routes/taskRoutes.js
const router = require('express').Router();
const authMiddleware = require('../middleware/authMiddleware'); // JWT Verification

// ... CRUD, task assignment routes with authorization checks
