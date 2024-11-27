// src/components/Profile.j
import React, { useState } from 'react';
import '../styles.css';

const Profile = ({ user }) => {
  const [name, setName] = useState(user.username);
  const [email, setEmail] = useState(user.email);

  return (
    <div className="page-container">
      <div className="profile-info">
        <div className="form-group">
          <label htmlFor="name">Username:</label>
          <p>{name}</p>
        </div>
        <div className="form-group">
          <label htmlFor="email">Email:</label>
          <p>{email}</p>
        </div>
      </div>
    </div>
  );
};

export default Profile;
