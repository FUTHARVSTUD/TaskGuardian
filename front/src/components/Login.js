import React, { useState } from 'react';
import axiosInstance from './axiosConfig';


const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await axiosInstance.post('http://localhost:3000/api/auth/login', { // Adjust URL as needed
                username,
                password
            });

            localStorage.setItem('token', response.data.token);
            // Redirect to a 'dashboard' or main tasks page after successful authentication
            if (window.location !== undefined) {
                window.location.href = '/Tasks';
            }
        } catch (error) {
            setErrorMessage('Invalid username or password'); // Display error message
        }
    }

    return (
        <form onSubmit={handleSubmit}>
            {errorMessage && <p className="error">{errorMessage}</p>}
            <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} placeholder="Username" />
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" />
            <button type="submit">Login</button>
        </form>
    );
};

export default Login;
