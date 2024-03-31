const express = require('express');
const router = express.Router();
const Task = require('../models/task');
const authMiddleware = require('../middleware/authMiddleware');

// Helper function to check authorization
const authorize = (allowedRoles) => {
    return (req, res, next) => {
        if (!allowedRoles.includes(req.user.role)) {
            return res.status(403).json({ error: 'Forbidden' });
        }
        next();
    }
}

// Create Task (Managers and Admins)
router.post('/', authMiddleware, authorize(['manager', 'admin']), async (req, res) => {
    try {
        const newTask = new Task({
            ...req.body,
        });
        const savedTask = await newTask.save();
        res.status(201).json(savedTask);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Get All Tasks 
router.get('/', authMiddleware, async (req, res) => {
    try {
        // Authorization: Only admins can see all tasks
        if (req.user.role !== 'admin') {
            // Regular users and managers can only view tasks assigned to them
            const tasks = await Task.find({ assignedTo: req.user.userId });
            return res.json(tasks);
        }

        const tasks = await Task.find();
        res.json(tasks);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Get Task by ID
router.get('/:id', authMiddleware, async (req, res) => {
    try {
        const task = await Task.findById(req.params.id);
        if (!task) {
            return res.status(404).json({ error: 'Task not found' });
        }

        // Authorization: Ensure user can access this specific task
        if (req.user.role !== 'admin' && req.user.userId.toString() !== task.assignedTo.toString()) {
            return res.status(403).json({ error: 'Forbidden' });
        }

        res.json(task);

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Update Task by ID
router.put('/:id', authMiddleware, async (req, res) => {
    try {
        const task = await Task.findById(req.params.id);
        if (!task) {
            return res.status(404).json({ error: 'Task not found' });
        }

        // Authorization: 
        if (req.user.role === 'regular' && req.user.userId.toString() !== task.assignedTo.toString()) {
            return res.status(403).json({ error: 'Forbidden' });
        }

        // Allow updates to defined fields
        const allowedUpdates = ['title', 'description', 'status'];
        const requestedUpdates = Object.keys(req.body);
        const isValidUpdate = requestedUpdates.every(update => allowedUpdates.includes(update));

        if (!isValidUpdate) {
            return res.status(400).json({ error: 'Invalid updates' });
        }

        requestedUpdates.forEach(update => task[update] = req.body[update]);
        await task.save();

        res.json(task);

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Delete Task by ID
router.delete('/:id', authMiddleware, authorize(['manager', 'admin']), async (req, res) => {
    try {
        const task = await Task.findByIdAndDelete(req.params.id);
        if (!task) {
            return res.status(404).json({ error: 'Task not found' });
        }

        res.json({ message: 'Task deleted successfully' });

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// ...other routes...

// Assign Task to User (Managers and Admins)
router.put('/:taskId/assign', authMiddleware, authorize(['manager', 'admin']), async (req, res) => {
    try {
        const { userId } = req.body;
        if (!userId) {
            return res.status(400).json({ error: 'User ID is required' });
        }

        // 1. Check if the user to be assigned to exists
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        // 2. Find the task
        const task = await Task.findById(req.params.taskId);
        if (!task) {
            return res.status(404).json({ error: 'Task not found' });
        }

        // 3. Update and save
        task.assignedTo = userId;
        await task.save();

        res.json({ message: 'Task assigned successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message });
    }
});


module.exports = router;
