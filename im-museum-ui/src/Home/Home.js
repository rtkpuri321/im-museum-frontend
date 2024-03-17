import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FiSearch, FiBell, FiUser, FiHome } from 'react-icons/fi'; // Import FiUser for profile icon
import { RiAddLine } from 'react-icons/ri';
import ImageGrid from './ImageGrid';
import ProfileSection from './ProfileSection';
import './Homepage.css';
import './Modal.css';

function Home() {
  const [isProfileActive, setIsProfileActive] = useState(false);
  const [showModal, setShowModal] = useState(false); // State variable for modal toggle
  const [image, setImage] = useState(null);
  const [description, setDescription] = useState('');

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };

  const handleSubmit = () => {
    // Handle image submission logic here
    console.log('Image:', image);
    console.log('Description:', description);
    // Reset state and close modal
    setImage(null);
    setDescription('');
    setShowModal(false);
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
