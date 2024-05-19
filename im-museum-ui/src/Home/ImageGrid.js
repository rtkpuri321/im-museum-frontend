// ImageGrid.js
import React, { useState, useEffect } from 'react';
import fetchWithToken from '../FetchWithToken';
import './ImageGrid.css';

const backend_url = 'http://127.0.0.1:8000/';

function ImageGrid() {
  const [userImages, setUserImages] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetchWithToken(backend_url + 'get-image/', {
          method: 'GET'
        });
        if (!response.ok) {
          throw new Error('Network response was not ok.');
        }
        const data = await response.json();
        if (data.status) {
          setUserImages(data.images);
        } else {
          throw new Error('API response status is not true.');
        }
      } catch (error) {
        console.error(error.message);
      }
    };

    fetchUserData();
  }, []);

  const handleLike = async (imageId) => {
      try {
          // Send a POST request to the backend API to like or unlike the image
          const response = await fetchWithToken(backend_url + 'image/like/', {
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

  return (
    <div className="image-grid">
      {userImages ? (userImages.map(image => (
        <div key={image.image_id} className="image-item-grid">
          <div className="image-post-grid">
            <div className="user-info-grid">
              {/* {userData.avatarUrl ? (
                <img id="post_owner_image" src={userData.avatarUrl} alt="Avatar" />
              ) : (
                <i id="post_owner_image_fa" className="fa fa-user"></i>
              )} */}
              {/* <p>{userData.username}</p> */}
            </div>
            <div className="image-content-grid">
              <img src={image.converted_image_link} alt={image.image_desc} />
            </div>
            <div className="interaction-grid">
              <p>{image.image_desc}</p>
              <div className="action-buttons-grid">
                <button onClick={() => handleLike(image.image_id)}>❤️ Like {image.image_likes ? `(${image.image_likes})` : ''}</button>
                <button onClick={() => handleComment(image.image_id, 'Comments on photos.')}>💬 Comments</button>
                <button onClick={() => handleShare(image.converted_image_link)}>📤 Share</button>
              </div>
            </div>
            <div className='add_comment-grid'>
                  <input type="text" placeholder="Add a comment..." />
                </div>
          </div>
        </div>         
      ))
    ):(
      <p>Loading...</p>
    )}
    </div>
  );
}

export default ImageGrid;
