import { jwtDecode } from 'jwt-decode';

function fetchWithToken(url, options) {
    // Retrieve the access_token from cookies
    const cookies = document.cookie.split(';').map(cookie => cookie.split('='));
    const accessTokenCookie = cookies.find(cookie => cookie[0].trim() === 'access_token');
    const accessToken = accessTokenCookie ? accessTokenCookie[1] : null;
  
    // If the access token is missing, redirect to login
    if (!accessToken) {
      window.location.href = '/';
      return;
    }

    // Decode the token payload
    let decodedToken;
    try {
      decodedToken = jwtDecode(accessToken);
    } catch (error) {
      console.error('Invalid token:', error);
      window.location.href = '/';
      return;
    }

    // Check if the token is expired
    const currentTime = Math.floor(Date.now() / 1000);
    if (decodedToken.exp < currentTime) {
      window.location.href = '/';
      return;
    }

    // Include the access_token in the headers if available
    if (accessToken) {
      options.headers = {
        ...options.headers,
        'Authorization': `Bearer ${accessToken}`
      };
    }
  
    // Perform the fetch request with the modified options
    return fetch(url, options);
}


export default fetchWithToken;