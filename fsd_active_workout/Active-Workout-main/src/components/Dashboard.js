// src/components/Dashboard.js
import React, { useState, useEffect } from 'react';
import { api } from '../axios';
import { Link } from 'react-router-dom';
import { Chart as ChartJS, CategoryScale, LinearScale, LineElement, PointElement, Title, Tooltip, Legend } from 'chart.js';
import { Line } from 'react-chartjs-2';
import '../styles/Dashboard.css';
import '../styles.css'
ChartJS.register(CategoryScale, LinearScale, LineElement, PointElement, Title, Tooltip, Legend);

const Dashboard = ({ user, logout }) => {
  const [workouts, setWorkouts] = useState([]);
  const [chartData, setChartData] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWorkouts = async () => {
      try {
        const response = await api.get('/workouts', {
          headers: { 'x-auth-token': localStorage.getItem('token') },
        });
        if (response.data) {
          setWorkouts(response.data);
          prepareChartData(response.data);
        }
      } catch (error) {
        console.error('Error fetching workouts:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchWorkouts();
  }, []);

  const prepareChartData = (workouts) => {
    if (!workouts || workouts.length === 0) {
      setChartData({
        labels: [],
        datasets: [],
      });
      return;
    }

    const dates = workouts.map((workout) => new Date(workout.date).toLocaleDateString());
    const calories = workouts.map((workout) => workout.caloriesBurned);
    const durations = workouts.map((workout) => workout.duration);

    setChartData({
      labels: dates,
      datasets: [
        {
          label: 'Calories Burned',
          data: calories,
          fill: false,
          borderColor: 'rgb(75, 192, 192)',
          tension: 0.1,
        },
        {
          label: 'Workout Duration (min)',
          data: durations,
          fill: false,
          borderColor: 'rgb(153, 102, 255)',
          tension: 0.1,
        },
      ],
    });
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div className="dashboard-container">

      {/* Workout List */}
      <div className="workout-list">
  <h3 className="center-heading">Workouts</h3>
  <ul>
    {workouts.length > 0 ? (
      workouts.map((workout) => (
        <li key={workout._id}>
          {workout.name} - {workout.duration} minutes - {workout.caloriesBurned} calories on{' '}
          {new Date(workout.date).toLocaleDateString()}
        </li>
      ))
    ) : (
      <p>No workouts found</p>
    )}
  </ul>
</div>


      {/* Chart Section */}
      <div className="chart-container">
        <h3>Workout Progress</h3>
        <div style={{ width: '80%', margin: '20px auto' }}>
          {/* Ensure chartData is properly structured */}
          {chartData.labels && chartData.labels.length > 0 ? (
            <Line data={chartData} />
          ) : (
            <p>No workout data available for the chart.</p>
          )}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="action-buttons">
        <Link to="/add-workout">
          <button className="btn-primary">Add New Workout</button>
        </Link>
        <Link to="/profile">
          <button className="btn-primary">Go to Profile</button>
        </Link>
        <Link to="/delete-workout">
          <button className="btn-danger">Delete Workout</button>
        </Link>
        <button onClick={logout} className="btn-secondary">
          Logout
        </button>
      </div>
    </div>
  );
};

export default Dashboard;
