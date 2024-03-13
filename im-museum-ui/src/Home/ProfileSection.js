import React, { useState, useEffect } from 'react';
import './ProfileSection.css'; // Import CSS file for styling

const backend_url = 'http://127.0.0.1:8000/';

function ProfileSection() {
  const [userData, setUserData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch(backend_url + 'user-details/', {
          method: 'GET'
        });
        if (!response.ok) {
          throw new Error('Network response was not ok.');
        }
        const data = await response.json();
        if (data.status) {
          setUserData(data.user_data);
        } else {
          throw new Error('API response status is not true.');
        }
      } catch (error) {
        setError(error.message);
      }
    };

    fetchUserData();
  }, []);

  return (
    <div className="profile-section">
      {userData ? (
        <div className="profile-info">
          <div className="avatar">
            <img src={userData.avatarUrl} alt="Avatar" />
            <p>{userData.user_name}</p>
          </div>
          <div className="user-details">
            <h2>{userData.username}</h2>
            <p>{userData.bio}</p>
            <ul>
              <li><strong>Posts:</strong> {userData.postsCount}</li>
              <li><strong>Followers:</strong> {userData.followersCount}</li>
              <li><strong>Following:</strong> {userData.followingCount}</li>
            </ul>
          </div>
        </div>
      ) : error ? (
        <p className="error-msg">Error: {error}</p>
      ) : (
        <p className="loading-msg">Loading...</p>
      )}
    </div>
  );
}

export default ProfileSection;
