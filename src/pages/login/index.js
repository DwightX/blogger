import './index.css';

document.getElementById('loginForm').addEventListener('submit', function (e) {
  e.preventDefault(); // Prevent the default form submission

  // Get the values from the input fields
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;

  // Send a POST request to the API
  fetch('https://node-api-atjf.onrender.com/auth', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      email: email,
      password: password,
    }),
  })
  .then((response) => {
    if (!response.ok) {
      throw new Error('Network response was not ok ' + response.statusText);
    }
    return response.json();
  })
  .then((data) => {
    // Store the token in localStorage or sessionStorage
    if (data.token) {
      localStorage.setItem('authToken', data.token);
      console.log('Token saved to localStorage');
    }
    // Redirect to the dashboard
    window.location.href = '../dashboard';
  })
  .catch((error) => {
    console.error('Error:', error); // Handle any errors
  });
});
