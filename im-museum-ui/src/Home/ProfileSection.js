import React, { useState, useEffect } from 'react';

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
        <div>
          <p>ID: {userData.id}</p>
          <p>Mobile No: {userData.mobile_no || 'N/A'}</p>
          <p>Username: {userData.username}</p>
          <p>Email: {userData.email}</p>
          <p>Account No: {userData.account_no || 'N/A'}</p>
          <p>IFSC: {userData.ifsc || 'N/A'}</p>
          <p>VPA: {userData.vpa || 'N/A'}</p>
          <p>Subscribers Count: {userData.subscribers_count || 'N/A'}</p>
          <p>Status Flag: {userData.status_flag}</p>
          <p>Subscribers: {userData.subscribers.join(', ') || 'None'}</p>
          <p>Subscribed To: {userData.subscribed_to.join(', ') || 'None'}</p>
        </div>
      ) : error ? (
        <p>Error: {error}</p>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
}

export default ProfileSection;
