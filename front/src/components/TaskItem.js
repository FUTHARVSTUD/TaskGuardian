import React from 'react';
import EditTask from './EditTask';
import AssignTask from './AssignTask';
import axiosInstance from './axiosConfig';
import { useState } from 'react';
import { UserContext } from '../context/UserContext';


const TaskItem = ({ task }) => {

    const [isEditModalOpen, setIsEditModalOpen] = useState(false);

    const handleEditClick = () => {
        setIsEditModalOpen(true);
    };

    const handleEditClose = () => {
        setIsEditModalOpen(false);
    };

    const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);

    const handleAssignClick = () => {
        setIsAssignModalOpen(true);
    };

    const handleAssignClose = () => {
        setIsAssignModalOpen(false);
    };

    const handleDeleteClick = async () => {
        if (!window.confirm('Are you sure you want to delete this task?')) {
            return;  // Cancel if the user isn't sure
        }

        try {
            const token = localStorage.getItem('token');
            await axiosInstance.delete(`http://localhost:3000/api/tasks/${task._id}`, { // Adjust URL as needed
                headers: { Authorization: `Bearer ${token}` }
            });

            // Update tasks list (e.g., refetch tasks)
        } catch (error) {
            console.error('Error deleting task:', error);
            // Handle the error (display a message, etc.) 
        }
    };

    return (
        <div className={isAssignModalOpen ? 'task-assign-modal-overlay' : ''}>
            <div className={isAssignModalOpen ? 'task-assign-modal fadeIn' : 'task-assign-modal'}>
                <h3>{task.title}</h3>
                <p>{task.description}</p>
                <p>Status: {task.status}</p>

                {(user && (user.role === 'admin' || user.role === 'manager')) && (
                    <> {/* Fragment for grouping */}
                        <button key={task._id + '-edit'} onClick={handleEditClick}>Edit</button>
                        <button key={task._id + '-assign'} onClick={handleAssignClick}>Assign</button>
                        <button key={task._id + '-delete'} onClick={handleDeleteClick}>Delete</button>
                    </>
                )}

                {isEditModalOpen && (
                    <EditTask taskId={task._id} onEditComplete={handleEditClose} />
                )}

                {isAssignModalOpen && (
                    <AssignTask taskId={task._id} onAssignComplete={handleAssignClose} />
                )}
            </div>
        </div>
    );
};

export default TaskItem;
