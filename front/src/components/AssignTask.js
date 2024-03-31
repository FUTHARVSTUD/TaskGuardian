// src/AssignTask.js
import React, { useState, useEffect } from 'react';
import axiosInstance from './axiosConfig';

const AssignTask = ({ taskId, onAssignComplete, refetchTasks }) => {
    const [users, setUsers] = useState([]);
    const [selectedUserId, setSelectedUserId] = useState('');

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await axiosInstance.get('http://localhost:3000/api/users', { // Adjust URL as needed
                    headers: { Authorization: `Bearer ${token}` }
                });
                setUsers(response.data);
            } catch (error) {
                console.error('Error fetching users:', error);
            }
        };
        fetchUsers();
    }, []);

    // ... Handle Submit with an API call to your '/task/:taskId/assign' backend route...
    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const token = localStorage.getItem('token');
            await axiosInstance.put(`http://localhost:3000/api/tasks/${taskId}/assign`, { // Adjust URL as needed
                userId: selectedUserId
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });

            onAssignComplete(); // Call to signal the assignment is done
            refetchTasks(); // Call to update the task list
        } catch (error) {
            console.error('Error assigning task:', error);
        }
    };


    return (
        <div>
            <select value={selectedUserId} onChange={(e) => setSelectedUserId(e.target.value)}>
                <option value="">Select User</option>
                {users.map(user => (
                    <option key={user._id} value={user._id}>
                        {user.username}
                    </option>
                ))}
            </select>
            <button onClick={handleSubmit}>Assign</button>
        </div>
    );
};

export default AssignTask;
