import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.css'; // Import the CSS file for styling

const backend_url = 'http://127.0.0.1:8000/';

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleRegisterClick = () => {
        // Navigate to the register page
        navigate('/register');
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
    
        try {
            const response = await fetch(backend_url + 'login/', {
                method: 'POST',
                body: JSON.stringify({
                    username: username,
                    password: password,
                }),
                headers: {
                    'Content-Type': 'application/json'
                }
            });
    
            if (response.ok) {
                const data = await response.json();
                const { access_token } = data; // Assuming the access token is returned in the response data
    
                // Set the access token in cookies with an expiry time
                const expiryDate = new Date(Date.now() + (data.expires_in * 1000)); // Convert seconds to milliseconds
                document.cookie = `access_token=${access_token}; expires=${expiryDate.toUTCString()}; path=/`;
    
                // Redirect to the home page
                navigate('/home');
            } else {
                console.error('Login failed');
            }
    
            setUsername('');
            setPassword('');
        } catch (error) {
            console.error('Error:', error);
        }
    };    

    return (
    <div id='login-page'>
        <div id='header'><h1>Im-Museum</h1></div>
        <div className="login-container">
            <form onSubmit={handleSubmit} className="login-form">
                <div className="form-group">
                    <label htmlFor="username">Username:</label>
                    <input
                        type="text"
                        id="username"
                        value={username}
                        onChange={(event) => setUsername(event.target.value)}
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="password">Password:</label>
                    <input
                        type="password"
                        id="password"
                        value={password}
                        onChange={(event) => setPassword(event.target.value)}
                    />
                </div>
                <button type="submit">Login</button>
            </form>
            <div className="login-options">
                <button onClick={handleRegisterClick} className="register-button">Register</button><br/><br/>
                <div className="login-with-google">
                    <button className="google-login-button">
                        <i className="fa fa-google fa-fw"></i> Login with Google
                    </button>
                </div>
            </div>
        </div>
    </div>
    );
};

export default Login;
