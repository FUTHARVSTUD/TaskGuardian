import React, { useState } from 'react';
import axiosInstance from './axiosConfig';
import { useNavigate } from 'react-router-dom';

const Register = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await axiosInstance.post('http://localhost:3000/api/auth/register', { // Adjust URL as needed
                username,
                password
            });

            // Successful registration
            console.log('Registration successful:', response);
            // You may want to redirect to the login page or display a success message
            if (window.location !== undefined) {
                window.location.href = '/Tasks';
            }

        } catch (error) {
            if (error.response && error.response.data.error) {
                setErrorMessage(error.response.data.error); // Handle errors from the backend
            } else {
                setErrorMessage('Registration failed. Please try again.');
            }
        }
    }

    return (
        <form onSubmit={handleSubmit}>
            {errorMessage && <p className="error">{errorMessage}</p>}
            <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} placeholder="Username" />
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" />
            <button type="submit">Register</button>
        </form>
    );
};

export default Register;
