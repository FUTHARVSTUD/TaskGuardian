const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: {
        type: String,
        enum: ['admin', 'manager', 'regular'],
        default: 'regular'
    }
});

// Hash the password before saving a new user
userSchema.pre('save', async function (next) {
    // Only hash if the password is new or being modified
    if (!this.isModified('password')) return next();

    this.password = await bcrypt.hash(this.password, 10);
    next();
});

module.exports = mongoose.model('User', userSchema);
