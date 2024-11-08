import './index.css'
import 'bootstrap-icons/font/bootstrap-icons.css';


const submitPost = document.getElementById("submit")

async function fetchBlogPosts() {
    try {
        const response = await fetch('https://node-api-atjf.onrender.com/post', {
            method: 'GET',
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem('authToken'),
                'Content-Type': 'application/json',
            },
        });
    
        if (!response.ok) {
            throw new Error('Network response was not ok ' + response.statusText);
        }
    
        const blogPost = await response.json();
        const blogPostSection = document.getElementById("blog-post-section");
    
        // Clear existing posts to prevent duplicates
        blogPostSection.innerHTML = '';
    
        // Store current post ID for modal
        let currentPostId = null;
        let currentPostContainer = null;
    
        blogPost.forEach(post => {
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
        
            // Create calendar icon
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
        
            // Create and style edit button
            const editButton = document.createElement("button");
            editButton.className = "px-4 py-2 text-sm font-medium text-gray-900 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500";
            editButton.innerHTML = "Edit";
        
            // Create and style delete button
            const deleteModalOpen = document.createElement("button");
            deleteModalOpen.className = "px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500";
            deleteModalOpen.innerHTML = "Delete";
        
            // Set data attributes
            deleteModalOpen.setAttribute("data-post-id", post._id);
            editButton.setAttribute("data-post-id", post._id);
        
            // Add event listeners
            deleteModalOpen.addEventListener("click", () => {
                currentPostId = post._id;
                currentPostContainer = blogPostContainer;
                const modalOverlay = document.getElementById('modalOverlay');
                modalOverlay.classList.remove('hidden');
            });
    
            editButton.addEventListener("click", () => {
                const modalOverlay = document.getElementById('editModalOverlay');
                const titleField = document.getElementById('editModalTitle');
                const bodyField = document.getElementById('editModalBody');
                
                // Populate the modal with the current post's title and body
                titleField.value = post.title;
                bodyField.value = post.body;
                currentPostId = post._id;
                currentPostContainer = blogPostContainer;
    
                // Show the edit modal
                modalOverlay.classList.remove('hidden');
            });
        
            // Assemble the card structure
            dateWrapper.append(calendarIcon, blogPostDate);
            headerContent.append(blogPostTitle, dateWrapper);
            cardHeader.append(headerContent);
            cardContent.append(blogPostBody);
            cardFooter.append(editButton, deleteModalOpen);
        
            // Assemble the main container
            blogPostContainer.append(cardHeader, cardContent, cardFooter);
        
            // Add to the blog section
            blogPostSection.append(blogPostContainer);
        });
    
        // Modal event listeners (outside forEach loop)
        const deletePostBtn = document.getElementById('deletePostBtn');
        const cancelDeleteBtn = document.getElementById('cancelDeleteBtn');
        const cancelEditBtn = document.getElementById('cancelEditBtn');
        const saveChangesBtn = document.getElementById('saveChangesBtn');
        const modalOverlay = document.getElementById('modalOverlay');
        const editModalOverlay = document.getElementById('editModalOverlay');
        
        // Function to close modal and reset current post data
        const closeModal = () => {
            modalOverlay.classList.add('hidden');
            editModalOverlay.classList.add('hidden');
            currentPostId = null;
            currentPostContainer = null;
        };
    
        // Single event listener for delete confirmation
        deletePostBtn.addEventListener('click', () => {
            if (currentPostId && currentPostContainer) {
                modalOverlay.classList.add('hidden');
                deletePost(currentPostId, currentPostContainer);
                currentPostId = null;
                currentPostContainer = null;
            }
        });
    
        // Save changes event listener for edit modal
        saveChangesBtn.addEventListener('click', () => {
            const titleField = document.getElementById('editModalTitle').value;
            const bodyField = document.getElementById('editModalBody').value;
            if (currentPostId) {
                // Here you would send a PUT request or update the post logic
                editPost(currentPostId, titleField, bodyField);
                closeModal();
            }
        });
    
        // Add event listener for cancel button in edit modal
        cancelEditBtn.addEventListener('click', closeModal);
    
        // Add event listener for cancel button in delete modal
        cancelDeleteBtn.addEventListener('click', closeModal);
    
        // Optional: Close modal when clicking outside
        modalOverlay.addEventListener('click', (e) => {
            if (e.target === modalOverlay) {
                closeModal();
            }
        });
        editModalOverlay.addEventListener('click', (e) => {
            if (e.target === editModalOverlay) {
                closeModal();
            }
        });
    
    } catch (error) {
        console.error('Error:', error);
    }
    
}

// Create new posts
async function createNewPost(event) {
    event.preventDefault(); // Prevent form submission if button is in a form
    
    const titleField = document.getElementById("titleField");
    const bodyField = document.getElementById("bodyField");

    try {
        const response = await fetch('https://node-api-atjf.onrender.com/post', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                title: titleField.value,
                body: bodyField.value,
            })
        });

        if (!response.ok) {
            throw new Error('Network response was not ok ' + response.statusText);
        }

        const data = await response.json();
        console.log(data);
        
        // Clear the form fields
        titleField.value = '';
        bodyField.value = '';
        
        // Refresh the posts
        await fetchBlogPosts();
        
    } catch (error) {
        console.error('Error:', error);
    }
}
// Create new post
async function editPost(currentPostId,titleField,bodyField) {
    
    try {
        const response = await fetch(`https://node-api-atjf.onrender.com/post/${currentPostId}`, {
            method: 'PUT',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                title: titleField,
                body: bodyField,
            })
        });

        if (!response.ok) {
            throw new Error('Network response was not ok ' + response.statusText);
        }

        const data = await response.text();
        console.log(data);
        
        // Clear the form fields
        titleField = '';
        bodyField = '';
        
        // Refresh the posts
        await fetchBlogPosts();
        
    } catch (error) {
        console.error('Error:', error);
    }
}
// Delete post
async function deletePost(postId, containerElement) {
    try {
        const response = await fetch(`https://node-api-atjf.onrender.com/post/${postId}`, {
            method: 'DELETE',
        });

        if (!response.ok) {
            throw new Error('Network response was not ok ' + response.statusText);
        }

        // Remove the post from the DOM after successful deletion
        containerElement.remove();
        
    } catch (error) {
        console.error('Error:', error);
    }
}

// Add event listener to submit button
if (submitPost) {
    submitPost.addEventListener("click", createNewPost);
}



// Close modal on overlay click
modalOverlay.addEventListener('click', (e) => {
  if (e.target === modalOverlay) {
    modalOverlay.classList.add('hidden');
  }
});
// Initial fetch of blog posts
fetchBlogPosts();