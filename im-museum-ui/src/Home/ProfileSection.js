import React, { useState, useEffect } from 'react';
import './ProfileSection.css'; // Import CSS file for styling

const backend_url = 'http://127.0.0.1:8000/';

function ProfileSection() {
  const [userData, setUserData] = useState(null);
  const [userImages, setUserImages] = useState(null);
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
          setUserImages(data.images);
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
          <div className="user-details">
            <div className="avatar">
            {userData.avatarUrl ? (
                <img src={userData.avatarUrl} alt="Avatar" />
            ) : (
              <i className="fa fa-user"></i>
            )}
            </div>
            <div className="user-info">
              <h2>{userData.username}</h2>
              <p>{userData.bio}</p>
              <ul className="user-stats">
                <li><strong>Posts:</strong> {userData.postsCount?userData.postsCount:0}</li>
                <li><strong>Followers:</strong> {userData.followersCount?userData.followersCount:0}</li>
                <li><strong>Following:</strong> {userData.followingCount?userData.followingCount:0}</li>
              </ul>
            </div>
          </div>
        </div>
      ) : error ? (
        <p className="error-msg">Error: {error}</p>
      ) : (
        <p className="loading-msg">Loading...</p>
      )}
      {userImages && (
        <div className="profile-images">
          <h3>My Image Museum</h3>
          <div className="images-container">
            {userImages.map(image => (
              <div key={image.image_id} className="image-item">
                <img src="https://cdn.pixabay.com/photo/2015/04/23/22/00/tree-736885_1280.jpg" alt={image.image_desc} />
                <p>{image.image_desc}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default ProfileSection;
