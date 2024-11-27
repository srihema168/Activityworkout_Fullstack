import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Auth from './components/Auth';
import Dashboard from './components/Dashboard';
import Profile from './components/Profile';
import Workout from './components/Workout';
import DeleteWorkout from './components/DeleteWorkout';

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const loggedInUser = localStorage.getItem('user');
    if (loggedInUser) setUser(JSON.parse(loggedInUser));
  }, []);

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };

  return (
    <Router>
      <Routes>
        <Route path="/" element={user ? <Navigate to="/dashboard" /> : <Auth setUser={setUser} />} />
        <Route path="/dashboard" element={user ? <Dashboard user={user} logout={logout} /> : <Navigate to="/" />} />
        <Route path="/add-workout" element={user ? <Workout user={user} /> : <Navigate to="/" />} />
        <Route path="/delete-workout" element={user ? <DeleteWorkout /> : <Navigate to="/" />} />
        <Route path="/profile" element={user ? <Profile user={user} /> : <Navigate to="/" />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;
