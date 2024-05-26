import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiSearch, FiUser, FiHome, FiLogOut } from 'react-icons/fi';
import { RiAddLine } from 'react-icons/ri';
import ImageGrid from './ImageGrid';
import ProfileSection from './ProfileSection';
import fetchWithToken from '../FetchWithToken';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './Homepage.css';
import './Modal.css';

const backend_url = 'http://127.0.0.1:8000/';

function Home() {
  const [isProfileActive, setIsProfileActive] = useState(false);
  const [showModal, setShowModal] = useState(false); // State variable for modal toggle
  const [image, setImage] = useState(null);
  const [description, setDescription] = useState('');
  const navigate = useNavigate();

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };

  const handleSubmit = () => {
    // Create a new FormData object
    const formData = new FormData();
    formData.append('image', image); // Append the image file to the FormData
    formData.append('image_desc', description); // Append the description to the FormData

    // Send a POST request to the backend API
    fetchWithToken(backend_url + 'add-image/', {
      method: 'POST',
      body: formData,
    })
      .then(response => {
        if (response.ok) {
          // Image uploaded successfully
          toast.success('Image uploaded successfully!', {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
          });
        } else {
          // Failed to upload image
          throw new Error("Failed to upload image.");
        }
      })
      .catch(error => {
        toast.error('Error uploading image: ' + error.message, {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
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

  const handleLogout = () => {
    localStorage.clear();
    sessionStorage.clear();
    // Split the cookies string into individual cookies
    var cookies = document.cookie.split(";");

    // Loop through each cookie and set its expiration date in the past to delete it
    cookies.forEach(function(cookie) {
      var cookieParts = cookie.split("=");
      var cookieName = cookieParts[0].trim();
      document.cookie = cookieName + "=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    });

    toast.success('Never Say Never, See you soon!', {
      position: "top-right",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    });

    // Redirect to the login page
    setTimeout(() => {
      navigate('/');
    }, 3000);
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
          {isProfileActive ? (
            <FiHome onClick={toggleProfile} /> // Home icon when profile is active
          ) : (
            <FiUser onClick={toggleProfile} /> // Profile icon when profile is not active
          )}
          <FiLogOut onClick={handleLogout} >logout</FiLogOut>
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
      <ToastContainer />
    </div>
  );
}

export default Home;
