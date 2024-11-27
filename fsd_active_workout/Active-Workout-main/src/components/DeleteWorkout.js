// src/pages/DeleteWorkout.j
// DeleteWorkout.js
// DeleteWorkout.js
import React, { useState, useEffect } from 'react';
import { api } from '../axios'; // Assuming axios instance is correctly set up
import { useNavigate } from 'react-router-dom';

const DeleteWorkout = () => {
  const [workouts, setWorkouts] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Fetch all workouts when component loads
  useEffect(() => {
    const fetchWorkouts = async () => {
      try {
        const response = await api.get('/workouts', {
          headers: { 'x-auth-token': localStorage.getItem('token') },
        });
        setWorkouts(response.data); // Populate the workouts state with the fetched data
      } catch (error) {
        console.error('Error fetching workouts:', error);
      } finally {
        setLoading(false); // Stop loading after data is fetched
      }
    };

    fetchWorkouts();
  }, []);

  // Delete workout by id
  const handleDelete = async (workoutId) => {
    try {
      await api.delete(`/workouts/${workoutId}`, {
        headers: { 'x-auth-token': localStorage.getItem('token') },
      });

      // Remove the deleted workout from the state
      setWorkouts(workouts.filter((workout) => workout._id !== workoutId));

      // Optionally, navigate back to the dashboard or refresh the page
      navigate('/dashboard'); // or you can just refresh the list without redirecting
    } catch (error) {
      console.error('Error deleting workout:', error);
      alert('Failed to delete workout.');
    }
  };

  if (loading) return <p>Loading workouts...</p>;

  return (
    <div className="delete-workout-container">
      <h2>Delete a Workout</h2>
      <ul>
        {workouts.length > 0 ? (
          workouts.map((workout) => (
            <li key={workout._id}>
              {workout.name} - {workout.duration} minutes - {workout.caloriesBurned} calories on{' '}
              {new Date(workout.date).toLocaleDateString()}
              <button
                onClick={() => handleDelete(workout._id)}
                className="btn-danger"
                style={{ marginLeft: '10px' }}
              >
                Delete
              </button>
            </li>
          ))
        ) : (
          <p>No workouts available to delete.</p>
        )}
      </ul>
    </div>
  );
};

export default DeleteWorkout;
