function fetchWithToken(url, options) {
    // Retrieve the access_token from cookies
    const cookies = document.cookie.split(';').map(cookie => cookie.split('='));
    const accessTokenCookie = cookies.find(cookie => cookie[0].trim() === 'access_token');
    const accessToken = accessTokenCookie ? accessTokenCookie[1] : null;
  
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