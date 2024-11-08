import './index.css';

document.getElementById('loginForm').addEventListener('submit', function (e) {
    e.preventDefault(); // Prevent the default form submission

    // Get the values from the input fields
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    // Send a POST request to the API
    fetch('http://localhost:4000/auth', {
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
        window.location.href = '../dashboard';
        console.log('Success:', data); // Handle success response
      // Optionally redirect or update the UI based on the response
    })
    .catch((error) => {
      console.error('Error:', error); // Handle any errors
    });
  });