import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FiSearch, FiBell, FiUser, FiHome } from 'react-icons/fi'; // Import FiUser for profile icon
import { RiAddLine } from 'react-icons/ri';
import ImageGrid from './ImageGrid';
import ProfileSection from './ProfileSection';
import './Homepage.css';
import './Modal.css';

const backend_url='http://127.0.0.1:8000/';

function Home() {
  const [isProfileActive, setIsProfileActive] = useState(false);
  const [showModal, setShowModal] = useState(false); // State variable for modal toggle
  const [image, setImage] = useState(null);
  const [description, setDescription] = useState('');

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };

  const handleSubmit = () => {
      // Create a new FormData object
      const formData = new FormData();
      formData.append('image', image); // Append the image file to the FormData
      formData.append('image_desc', description); // Append the description to the FormData

      // Send a POST request to the backend API
      fetch(backend_url + 'add-image/', {
          method: 'POST',
          body: formData,
      })
      .then(response => {
          if (response.ok) {
              // Image uploaded successfully
              console.log("Image uploaded successfully!");
          } else {
              // Failed to upload image
              throw new Error("Failed to upload image.");
          }
      })
      .catch(error => {
          console.error('Error uploading image:', error);
      })
      .finally(() => {
          // Clear the image and description inputs
          setImage(null);
          setDescription('');
          // Close the modal
          setShowModal(false);
      });
  };

  const toggleModal = () => {
    setShowModal(!showModal); // Toggle the state of the modal
  };

  const toggleProfile = () => {
    setIsProfileActive(!isProfileActive);
  };

  return (
    <div>
      <header className="header">
        <Link to="/home" className="title"><i>Im-Museum</i></Link>
        <div className="search-bar">
          <input type="text" placeholder="Search" />
          <FiSearch />
        </div>
        <div className="icons">
          <FiBell />
          {isProfileActive ? (
            <FiHome onClick={toggleProfile} /> // Home icon when profile is active
          ) : (
            <FiUser onClick={toggleProfile} /> // Profile icon when profile is not active
          )}
        </div>
      </header>
      <main>
        {isProfileActive ? <ProfileSection /> : <ImageGrid />}
        <RiAddLine className="add-button" onClick={toggleModal} />
        {showModal && (
          <div className="modal">
            <div className="modal-content">
              <button className="close" onClick={toggleModal}>&times;</button>
              <h2>Upload Image</h2>
              <input type="file" onChange={handleImageChange} />
              <textarea placeholder="Enter description..." value={description} onChange={(e) => setDescription(e.target.value)}></textarea>
              <button onClick={handleSubmit}>Submit</button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default Home;
