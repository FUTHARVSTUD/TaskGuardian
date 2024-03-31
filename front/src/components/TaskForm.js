import React, { useState } from 'react';
import axiosInstance from './axiosConfig';

const TaskForm = () => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const token = localStorage.getItem('token');
            await axiosInstance.post('http://localhost:3000/api/tasks', { // Adjust URL as needed
                title,
                description
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });

            // Reset the form, update task list (refetch)
            setTitle('');
            setDescription('');

        } catch (error) {
            console.error('Error creating task:', error);
        }
    }

    return (
        <form onSubmit={handleSubmit}>
            <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Task Title" />
            <textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Description" />
            <button type="submit">Add Task</button>
        </form>
    );
};

export default TaskForm;
