const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String },
    status: {
        type: String,
        enum: ['pending', 'inprogress', 'completed'],
        default: 'pending'
    },
    assignedTo: {  // Reference to the user this task is assigned to
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
});

module.exports = mongoose.model('Task', taskSchema);
