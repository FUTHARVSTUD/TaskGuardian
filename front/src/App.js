import React, { useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './components/Login';
import Register from './components/Register';
import Tasks from './components/Tasks';
import PrivateRoute from './components/PrivateRoute';
import { GlobalProvider } from './context/UserState';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false); // Just for this example

  // ... Logic to check for existing token on app load

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route
          path="/tasks"
          element={
            <PrivateRoute isLoggedIn={isLoggedIn}>
              <Tasks />
            </PrivateRoute>
          }
        />
        {/* Add additional routes as needed */}
      </Routes>
    </BrowserRouter>
  );
}
export default App;
