import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FiSearch, FiBell, FiUser, FiHome } from 'react-icons/fi'; // Import FiUser for profile icon
import { RiAddLine } from 'react-icons/ri';
import ImageGrid from './ImageGrid';
import ProfileSection from './ProfileSection';
import './Homepage.css';

function Home() {
  const [isProfileActive, setIsProfileActive] = useState(false);

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
        {isProfileActive ? <ProfileSection /> : <ImageGrid />} {/* Display ProfileSection when profile is active */}
        <RiAddLine className="add-button" />
      </main>
    </div>
  );
}

export default Home;
