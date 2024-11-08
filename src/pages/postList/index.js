import './index.css';
import 'bootstrap-icons/font/bootstrap-icons.css';

const submitPost = document.getElementById("submit");

async function fetchBlogPosts() {
    try {
        const response = await fetch('https://node-api-atjf.onrender.com/post', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            throw new Error('Network response was not ok ' + response.statusText);
        }

        const blogPosts = await response.json();
        const blogPostSection = document.getElementById("blog-post-section");
        
        // Clear existing posts to prevent duplicates
        blogPostSection.innerHTML = '';

        blogPosts.forEach(post => {
            // Create main container with card styling
            const blogPostContainer = document.createElement("div");
            blogPostContainer.className = "ml-6 mb-6 w-full max-w-2xl rounded-lg border bg-white shadow-sm";
        
            // Create card header
            const cardHeader = document.createElement("div");
            cardHeader.className = "p-6";
        
            // Create header content wrapper
            const headerContent = document.createElement("div");
            headerContent.className = "flex items-center justify-between";
        
            // Create and style title
            const blogPostTitle = document.createElement("h2");
            blogPostTitle.className = "text-2xl font-bold text-gray-900";
            blogPostTitle.innerHTML = post.title;
        
            // Create date wrapper
            const dateWrapper = document.createElement("div");
            dateWrapper.className = "flex items-center space-x-2 text-gray-500";
        
            // Create calendar icon (using a simple ◷ character as placeholder)
            const calendarIcon = document.createElement("span");
            calendarIcon.innerHTML = "◷";
            calendarIcon.className = "h-4 w-4";
        
            // Create and style date
            const blogPostDate = document.createElement("span");
            blogPostDate.className = "text-sm";
            blogPostDate.innerHTML = post.date;
        
            // Create card content
            const cardContent = document.createElement("div");
            cardContent.className = "px-6 pb-4";
        
            // Create and style body text
            const blogPostBody = document.createElement("p");
            blogPostBody.className = "text-gray-600";
            blogPostBody.innerHTML = post.body;
        
            // Create card footer
            const cardFooter = document.createElement("div");
            cardFooter.className = "flex justify-end space-x-2 px-6 pb-6";
        
            // Create and style edit link
            const editLink = document.createElement("a");
            editLink.className = "px-4 py-2 text-sm font-medium text-gray-900 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500";
            editLink.innerHTML = "View";
            editLink.href = `../postPage`; // Adjust as needed
            editLink.setAttribute("data-post-id", post._id); // Set data attribute with post._id

            // Add event listener for view link
            editLink.addEventListener("click", (event) => {
                event.preventDefault(); // Prevent default anchor behavior
                viewPost(post._id); // Call viewPost with the post ID
            });
        
            // Assemble the card structure
            dateWrapper.append(calendarIcon, blogPostDate);
            headerContent.append(blogPostTitle, dateWrapper);
            cardHeader.append(headerContent);
            cardContent.append(blogPostBody);
            cardFooter.append(editLink);
        
            // Assemble the main container
            blogPostContainer.append(cardHeader, cardContent, cardFooter);
        
            // Add to the blog section
            blogPostSection.append(blogPostContainer);
        });
    } catch (error) {
        console.error('Error:', error);
    }
}

async function viewPost(postID) {
    try {
        // Redirect to the post page with the post ID in the URL
        window.location.href = `../postPage?id=${postID}`;
    } catch (error) {
        console.error('Error:', error);
    }
}

// Add event listener to submit button
if (submitPost) {
    submitPost.addEventListener("click", createNewPost);
}

// Initial fetch of blog posts
fetchBlogPosts();
