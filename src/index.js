import './styles/tailwind.css'; // Import Tailwind CSS styles

// Function to load the HTML content dynamically
const loadPage = async (page) => {
    const response = await fetch(`./pages/${page}.html`);
    const content = await response.text();
    document.getElementById('app').innerHTML = content;
};

// Initialize app
const initApp = () => {
    const app = document.createElement('div');
    app.id = 'app';
    document.body.appendChild(app);

    // Load the initial page based on the URL
    const page = window.location.pathname.split('/').pop().replace('.html', '') || 'index';
    loadPage(page);
};

// Run the app
initApp();
