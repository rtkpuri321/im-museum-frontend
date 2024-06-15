import React, { useState, useEffect } from 'react';
import fetchWithToken from '../FetchWithToken';
import './ImageGrid.css';

const backend_url = 'http://127.0.0.1:8000/';

function ImageGrid() {
  const [userImages, setUserImages] = useState([]);
  const [comments, setComments] = useState({});
  const [showCommentsData, setShowCommentsData] = useState({});
  const [modalVisible, setModalVisible] = useState(false);
  const [currentImageId, setCurrentImageId] = useState(null);

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
      const response = await fetchWithToken(backend_url + 'image/like/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ image_id: imageId }),
      });

      if (!response.ok) {
        throw new Error('Failed to update like status for the image');
      }

      const responseData = await response.json();
      const newLikesCount = responseData.likes;

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

  const handleCommentChange = (imageId, commentText) => {
    setComments({ ...comments, [imageId]: commentText });
  };

  const handleComment = async (imageId) => {
    const comment = comments[imageId];
    if (!comment) return; // Prevent submitting empty comments

    try {
      const response = await fetchWithToken(backend_url + 'user-comments/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ image_id: imageId, comment }),
      });

      if (!response.ok) {
        throw new Error('Failed to add comment for the image');
      }
      
      setComments({ ...comments, [imageId]: '' });
    } catch (error) {
      console.error('Error adding comment for the image:', error.message);
    }
  };

  const handleDownload = (imageUrl) => {
    // Implement share functionality as per your requirements
  };

  const showComments = async (imageId) => {
    setCurrentImageId(imageId);
    setModalVisible(true);

    try {
      const response = await fetchWithToken(`${backend_url}user-comments/?image_id=${imageId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch comments for the image');
      }

      const responseData = await response.json();
      if (responseData.status) {
        setShowCommentsData({ ...showCommentsData, [imageId]: responseData.comments });
      } else {
        throw new Error('API response status is not true.');
      }
    } catch (error) {
      console.error('Error fetching comments for the image:', error.message);
    }
  };

  const closeModal = () => {
    setModalVisible(false);
    setCurrentImageId(null);
  };

  return (
    <div className="image-grid">
      {userImages.length ? (
        userImages.map(image => (
          <div key={image.image_id} className="image-item-grid">
            <div className="image-post-grid">
              <div className="user-info">
                    {image.profile_pic ? (
                      <img id="post_owner_image" src={image.profile_pic} alt="Avatar" />
                    ) : (
                      <i id="post_owner_image_fa" className="fa fa-user"></i>
                    )}
                    <p>{image.username}</p>
              </div>
              <div className="user-info-grid">
                {/* Add user info here if needed */}
              </div>
              <div className="image-content-grid">
                <img src={image.converted_image_link} alt={image.image_desc} />
              </div>
              <div className="interaction-grid">
                <p>{image.image_desc}</p>
                <div className="action-buttons-grid">
                  <button onClick={() => handleLike(image.image_id)}>❤️ Like {image.image_likes ? `(${image.image_likes})` : ''}</button>
                  <button onClick={() => showComments(image.image_id)}>💬 Comments</button>
                  <button onClick={() => handleDownload(image.converted_image_link)}>⬇️ Download</button>
                </div>
              </div>
              <div className='add_comment-grid'>
                <input
                  type="text"
                  placeholder="Add a comment..."
                  value={comments[image.image_id] || ''}
                  onChange={(e) => handleCommentChange(image.image_id, e.target.value)}
                />
                <button onClick={() => handleComment(image.image_id)}>Add comment</button>
              </div>
            </div>
          </div>
        ))
      ) : (
        <p>Loading...</p>
      )}

      {modalVisible && currentImageId && (
        <div className="modal">
          <div className="modal-content">
            <button className="close" onClick={closeModal}>&times;</button>
            <h2>Comments</h2>
            {showCommentsData[currentImageId]?.length ? (
              showCommentsData[currentImageId].map((comment, index) => (
                <div key={index} className="comment-item">
                  {comment.commenter_user_id.profile_pic ? (
                    <img 
                      src={comment.commenter_user_id.profile_pic} 
                      alt={`${comment.commenter_user_id.username}'s profile pic`} 
                      className="profile-pic"
                    />
                  ):(
                      <i id="post_owner_image_fa" className="fa fa-user"></i>
                    )
                  }
                  <p><strong>{comment.commenter_user_id.username}</strong>: {comment.comment}</p>
                </div>
              ))
            ) : (
              <p>No comments yet</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default ImageGrid;
