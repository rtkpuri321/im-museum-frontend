import React, { useState, useEffect } from 'react';
import './ProfileSection.css'; // Import CSS file for styling

const backend_url = 'http://127.0.0.1:8000/';

function ProfileSection() {
  const [userData, setUserData] = useState(null);
  const [userImages, setUserImages] = useState(null);
  const [error, setError] = useState(null);
  const [interests, setInterests] = useState([]);
  const [inputValue, setInputValue] = useState('');

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
          // Prefill interests textarea with user's existing interests
          if (data.user_data.interest) {
            setInterests(data.user_data.interest);
          }
        } else {
          throw new Error('API response status is not true.');
        }
      } catch (error) {
        setError(error.message);
      }
    };

    fetchUserData();
  }, []);



  const handleLike = async (imageId) => {
      try {
          // Send a POST request to the backend API to like or unlike the image
          const response = await fetch(backend_url + 'image/like/', {
              method: 'POST',
              headers: {
                  'Content-Type': 'application/json',
              },
              body: JSON.stringify({ image_id: imageId }),
          });

          // Check if the request was successful
          if (!response.ok) {
              throw new Error('Failed to update like status for the image');
          }

          // Parse the response JSON
          const responseData = await response.json();
          
          // Extract the new likes count from the response data
          const newLikesCount = responseData.likes;

          // Update the likes count in the UI
          const updatedImages = userImages.map(image => {
              if (image.image_id === imageId) {
                  return { ...image, image_likes: newLikesCount };
              }
              return image;
          });
          setUserImages(updatedImages);
      } catch (error) {
          console.error('Error updating like status for the image:', error.message);
      }
  };  

  const handleComment = (imageId, comment) => {
    // Send a request to add a comment to the image with the specified ID
  };

  const handleShare = (imageUrl) => {
    // Implement share functionality as per your requirements
  };

  const handleInputChange = (event) => {
    setInputValue(event.target.value);
  };

  const handleInputKeyDown = (event) => {
    if (event.key === 'Enter') {
      const value = event.target.value.trim();
      if (value && !interests.includes(value)) {
        setInterests([...interests, value]);
        setInputValue('');
      }
    }
  };

  const handleRemoveInterest = (interest) => {
    setInterests(interests.filter(item => item !== interest));
  };

  const AddInterest = async () => {
    try {
      const response = await fetch(backend_url+'add-user-interest/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          // Add any other headers as needed, such as authorization headers
        },
        body: JSON.stringify({ interest: interests }),
      });
  
      if (!response.ok) {
        throw new Error('Failed to add interest');
      }
  
      // Assuming your API returns a JSON response with a success message or updated data
      const responseData = await response.json();
  
      // Handle the API response as needed, such as updating state
      console.log(responseData); // Log the response for debugging or further processing
    } catch (error) {
      console.error('Error adding interest:', error.message);
    }
  };
  

  return (
    <div className="profile-section">
      {/* Select interests */}
      <div className="interest-box">
        <h3>Select Your Interests</h3>
        <textarea
          value={inputValue}
          onChange={handleInputChange}
          onKeyDown={handleInputKeyDown}
          placeholder="Type and press Enter to add interests"
        />
        <button style={{ width: '100px', height: '70px' }} onClick={() => AddInterest()}>Update interest</button>
        <div className="selected-interests">
          {interests.map((interest, index) => (
            <div key={index} className="selected-interest">
              <span>{interest}</span>
              <button style={{ width: '30px', height: '40px' }} onClick={() => handleRemoveInterest(interest)}>×</button>
            </div>
          ))}
        </div>
      </div>
      {/* User profile information */}
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
                <li><strong>Posts:</strong> {userData.postsCount ? userData.postsCount : 0}</li>
                <li><strong>Followers:</strong> {userData.followersCount ? userData.followersCount : 0}</li>
                <li><strong>Following:</strong> {userData.followingCount ? userData.followingCount : 0}</li>
              </ul>
            </div>
          </div>
        </div>
      ) : error ? (
        <p className="error-msg">Error: {error}</p>
      ) : (
        <p className="loading-msg">Loading...</p>
      )}

      {/* User images */}
      {userImages && (
        <div className="profile-images">
          <h3>My Image Museum</h3>
          <div className="images-container">
            {userImages.map(image => (
              <div key={image.image_id} className="image-item">
                <div className="image-post">
                  <div className="user-info">
                    {userData.avatarUrl ? (
                      <img id="post_owner_image" src={userData.avatarUrl} alt="Avatar" />
                    ) : (
                      <i id="post_owner_image_fa" className="fa fa-user"></i>
                    )}
                    <p>{userData.username}</p>
                  </div>
                  <div className="image-content">
                    <img src={image.converted_image_link} alt={image.image_desc} />
                  </div>
                  <div className="interaction">
                    <p>{image.image_desc}</p>
                    <div className="action-buttons">
                      <button onClick={() => handleLike(image.image_id)}>❤️ Like {image.image_likes ? `(${image.image_likes})` : ''}</button>
                      <button onClick={() => handleComment(image.image_id, 'Comments on photos.')}>💬 Comments</button>
                      <button onClick={() => handleShare(image.converted_image_link)}>📤 Share</button>
                    </div>
                  </div>
                  <div className='add_comment'>
                    <input type="text" placeholder="Add a comment..." />
                  </div>
                </div>
              </div>         
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default ProfileSection;
