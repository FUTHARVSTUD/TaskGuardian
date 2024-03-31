import React, { useState, useEffect } from 'react';
import AssignTask from './AssignTask';
import axiosInstance from './axiosConfig';
import TaskForm from './TaskForm';
import TaskItem from './TaskItem';

const Tasks = () => {
    const [tasks, setTasks] = useState([]);

    useEffect(() => {
        const fetchTasks = async () => {
            try {
                const token = localStorage.getItem('token'); // Get JWT from storage
                const response = await axiosInstance.get('http://localhost:3000/api/tasks', { // Adjust URL as needed
                    headers: { Authorization: `Bearer ${token}` }
                });
                setTasks(response.data);
            } catch (error) {
                console.error('Error fetching tasks:', error);
            }
        }
        fetchTasks();
    }, []);

    const handleAssignClose = (updatedTask) => {
        setTasks(prevTasks => prevTasks.map(task => {
            if (task._id === updatedTask._id) {
                return updatedTask;
            } else {
                return task;
            }
        }));
    };

    const refetchTasks = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axiosInstance.get('http://localhost:3000/api/tasks', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setTasks(response.data);
        } catch (error) {
            console.error('Error fetching tasks:', error);
        }
    };

    // ... Functions for creating a task, updating task status, etc.

    return (
        <div>
            <TaskForm />
            <h2>Task List</h2>
            {tasks.map(task => (
                <div key={task._id}> {/* Wrapper for task and modal */}
                    <TaskItem task={task} />
                    <AssignTask
                        taskId={task._id}
                        onAssignComplete={handleAssignClose}
                        refetchTasks={refetchTasks}
                    />
                </div>
            ))}
        </div>
    );
};

export default Tasks;
