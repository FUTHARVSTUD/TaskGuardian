import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import axiosInstance from './axiosConfig';

const PrivateRoute = ({ children }) => {
    const [isLoading, setIsLoading] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
        const authenticate = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) {
                    setIsAuthenticated(false);
                    return;
                }

                // Verify the token with the backend
                const response = await axiosInstance.get('http://localhost:3000/api/auth/verify', { // Adjust URL as needed
                    headers: { Authorization: `Bearer ${token}` }
                });

                if (response.status === 200) {
                    setIsAuthenticated(true);
                } else {
                    setIsAuthenticated(false);
                }

            } catch (error) {
                setIsAuthenticated(false);
                console.error('Authentication error:', error);
            } finally {
                setIsLoading(false);
            }
        };

        authenticate();
    }, []);

    if (isLoading) {
        return <div>Loading...</div>; // Display a loading state
    }

    return isAuthenticated ? children : <Navigate to="/login" replace />;
};

export default PrivateRoute;
