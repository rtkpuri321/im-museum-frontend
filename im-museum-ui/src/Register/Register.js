import React, { useState } from 'react';
import './Register.css';

const Register = () => {
  const [formData, setFormData] = useState({
    email: '',
    username: '',
    password: '',
    repassword: '',
    profile_pic: '',
    interests: '',
  });

  const [repasswordError, setRepasswordError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleTogglePassword = () => {
    setShowPassword(!showPassword);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Check if password and retype password match
    if (formData.password !== formData.repassword) {
      setRepasswordError('Passwords do not match');
      return;
    }
    setRepasswordError('');
    // Handle form submission (e.g., send data to server)
    console.log(formData);
  };

  return (
    <div>
        <h2 style={{color: 'black'}}>Register with Im-Museum</h2>
        <div className="register-form-container" style={{ backgroundColor: 'lightblue', color: 'white', padding: '20px', borderRadius: '10px' }}>
        <form onSubmit={handleSubmit} className='register-form'>
            <div className='row'>
                <div className="col-md-6">
                    <div className="form-group">
                        <label>Email:</label>
                        <input type="email" name="email" value={formData.email} onChange={handleChange} required />
                    </div>
                </div>
                <div className="col-md-6">
                    <div className="form-group">
                        <label>Username:</label>
                        <input type="text" name="username" value={formData.username} onChange={handleChange} required />
                    </div>
                </div>
            </div>
            <div className='row'>
                <div className="col-md-6">
                    <div className="form-group">
                        <label>Password:</label>
                        <input type={showPassword ? 'text' : 'password'} name="password" value={formData.password} onChange={handleChange} required />
                    </div>
                </div>
                <div className="col-md-6">
                    <div className="form-group">
                        <label>Retype Password:</label>
                        <input type={showPassword ? 'text' : 'password'} name="repassword" value={formData.repassword} onChange={handleChange} required />
                        {repasswordError && <span className="error">{repasswordError}</span>}
                    </div>
                </div>
            </div>
            <div className='row'>
                <div className="col-md-6">
                    <div className="form-group">
                        <label>Profile pic:</label>
                        <input type="file" name="profile_pic" accept="image/*" value={formData.profile_pic} onChange={handleChange} />
                    </div>
                </div>
                <label style={{ marginLeft: '10px', fontSize: '11px' }}>
                    <input type="checkbox" onChange={handleTogglePassword} />
                    Show Password
                </label>
            </div>
            <div className="form-group">
                <label>Your Interests:</label>
                <textarea name="interests" value={formData.interests} onChange={handleChange} />
            </div>
            <button type="submit">Register</button>
        </form>
        </div>
    </div>
  );
};

export default Register;
