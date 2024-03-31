import React, { useState, useEffect } from 'react';
import axiosInstance from './axiosConfig';

const EditTask = ({ taskId, onEditComplete }) => { // Pass in required props
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [status, setStatus] = useState('');
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchTask = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await axiosInstance.get(`http://localhost:3000/api/tasks/${taskId}`, { // Adjust URL as needed
                    headers: { Authorization: `Bearer ${token}` }
                });
                setTitle(response.data.title);
                setDescription(response.data.description);
                setStatus(response.data.status);
            } catch (error) {
                console.error('Error fetching task:', error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchTask();
    }, [taskId]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            await axiosInstance.put(`http://localhost:3000/api/tasks/${taskId}`, { // Adjust URL as needed
                title,
                description,
                status
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });

            onEditComplete(); // Signal that the edit is complete

        } catch (error) {
            console.error('Error updating task:', error);
        }
    };

    if (isLoading) {
        return <div>Loading...</div>;
    }

    return (
        <form onSubmit={handleSubmit}>
            {/* Input fields for title, description, status */}
            <button type="submit">Save Changes</button>
        </form>
    );
};

export default EditTask;
