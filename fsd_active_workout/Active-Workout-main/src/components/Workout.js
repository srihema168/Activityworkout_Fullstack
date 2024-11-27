// src/components/Workout.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import { api } from '../axios';
import '../styles/workout.css'

const Workout = ({ user }) => {
  const [name, setName] = useState('');
  const [duration, setDuration] = useState('');
  const [caloriesBurned, setCaloriesBurned] = useState('');
  const [date, setDate] = useState('');
  const navigate = useNavigate(); // Initialize navigate

  const handleAddWorkout = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      await api.post(
        '/workouts',
        { name, duration, caloriesBurned, date },
        {
          headers: { 'x-auth-token': token },
        }
      );
      alert('Workout added successfully!');
      setName('');
      setDuration('');
      setCaloriesBurned('');
      setDate('');
      navigate('/dashboard'); // Redirect to dashboard
    } catch (error) {
      console.error('Error adding workout:', error);
    }
  };

  return (
    <div>
      <h2>Add a New Workout</h2>
      <form onSubmit={handleAddWorkout}>
        <div>
          <label>Workout Name</label>
          <input type="text" value={name} onChange={(e) => setName(e.target.value)} required />
        </div>
        <div>
          <label>Duration (minutes)</label>
          <input type="number" value={duration} onChange={(e) => setDuration(e.target.value)} required />
        </div>
        <div>
          <label>Calories Burned</label>
          <input type="number" value={caloriesBurned} onChange={(e) => setCaloriesBurned(e.target.value)} required />
        </div>
        <div>
          <label>Date</label>
          <input type="date" value={date} onChange={(e) => setDate(e.target.value)} required />
        </div>
        <button type="submit">Add Workout</button>
      </form>
    </div>
  );
};

export default Workout;
