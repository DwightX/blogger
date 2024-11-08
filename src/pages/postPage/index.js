
import './index.css';
import 'bootstrap-icons/font/bootstrap-icons.css';



async function fetchBlogPosts(postID) {
    try {
        const response = await fetch(`http://localhost:4000/post/${postID}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            throw new Error('Network response was not ok ' + response.statusText);
        }

        const blogPosts = await response.json();
        const blogPostSection = document.getElementById("blogPostSection");
        
        // Clear existing posts to prevent duplicates
        blogPostSection.innerHTML = '';
        // blogPosts.forEach(post => {
            // Create main container with card styling
            const blogPostContainer = document.createElement("div");
            blogPostContainer.className = "bg-white rounded-lg overflow-hidden transition-transform hover:scale-[1.02] hover:shadow-xl";
        
            // Create card header
            const cardHeader = document.createElement("div");
            cardHeader.className = "p-6";
        
            // Create header content wrapper
            const headerContent = document.createElement("div");
            headerContent.className = "space-y-2";
        
            // Create and style title
            const blogPostTitle = document.createElement("h2");
            blogPostTitle.className = "text-xl font-bold text-blue-800 line-clamp-2";
            blogPostTitle.innerHTML = blogPosts.title;
        
            // Create date wrapper
            const dateWrapper = document.createElement("div");
            dateWrapper.className = "flex items-center space-x-2 text-gray-600";
        
            // Create calendar icon
            const calendarIcon = document.createElement("i");
            // calendarIcon.innerHTML = "<i class="bi bi-clock-history"></i>";
            calendarIcon.className = "bi bi-clock-history";
        
            // Create and style date
            const blogPostDate = document.createElement("span");

            function formatDate(dateStr) {
                const date = new Date(dateStr);
              
                const formattedDate = date.toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                });
            
                const formattedTime = date.toLocaleTimeString('en-US', {
                    hour: 'numeric',
                    minute: '2-digit',
                });
            
                return `${formattedDate}, ${formattedTime}`;
            }

            blogPostDate.className = "text-sm";
            blogPostDate.innerHTML = formatDate(blogPosts.date);
        
            // Create card content
            const cardContent = document.createElement("div");
            cardContent.className = "px-6 pb-4";
        
            // Create and style body text with excerpt
            const blogPostBody = document.createElement("p");
            blogPostBody.className = "text-gray-700 line-clamp-3 text-sm";
            blogPostBody.innerHTML = blogPosts.body;
        
            // Create card footer
            const cardFooter = document.createElement("div");
            cardFooter.className = "px-6 pb-6 flex justify-between items-center";
        
            // Create reading time estimate
            const readingTime = document.createElement("span");
            readingTime.className = "text-sm text-gray-600";
            const wordCount = blogPosts.body.split(/\s+/).length;
            readingTime.innerHTML = `${Math.ceil(wordCount / 200)} min read`;
        
            // Create and style view link
            // const viewLink = document.createElement("a");
            // viewLink.className = "px-4 py-2 text-sm font-medium text-blue-600 border border-blue-600 rounded-md hover:bg-blue-600 hover:text-white transition-colors";
            // viewLink.innerHTML = "Read More";
            // viewLink.href = `../postPage`;
            // viewLink.setAttribute("data-post-id", blogPosts._id);

            // Add event listener for view link
            // viewLink.addEventListener("click", (event) => {
            //     event.preventDefault();
            //     viewPost(blogPosts._id);
            // });
        
            // Assemble the card structure
            dateWrapper.append(calendarIcon, blogPostDate);
            headerContent.append(blogPostTitle, dateWrapper);
            cardHeader.append(headerContent);
            cardContent.append(blogPostBody);
            cardFooter.append(readingTime);
        
            // Assemble the main container
            blogPostContainer.append(cardHeader, cardContent, cardFooter);
        
            // Add to the blog section
            blogPostSection.appendChild(blogPostContainer);
        // });
    } catch (error) {
        console.error('Error:', error);
    }
}

function displayPost(post) {
    const postSection = document.getElementById("post-section");
    postSection.innerHTML = '';

    // Create article container
    const article = document.createElement("article");
    article.className = "p-8 bg-white";

    // Create header section
    const header = document.createElement("header");
    header.className = "mb-8";

    // Create and style title
    const title = document.createElement("h1");
    title.className = "text-4xl font-bold text-blue-800 mb-4";
    title.innerHTML = post.title;

    // Create meta information container
    const meta = document.createElement("div");
    meta.className = "flex items-center space-x-4 text-gray-600";

    // Create date element
    const date = document.createElement("time");
    date.className = "text-sm";
    date.innerHTML = post.date;

    // Add reading time estimate
    const readingTime = document.createElement("span");
    readingTime.className = "text-sm";
    readingTime.innerHTML = `${Math.ceil(post.body.split(' ').length / 200)} min read`;

    // Create divider
    const divider = document.createElement("span");
    divider.className = "text-gray-400";
    divider.innerHTML = "•";

    // Assemble meta information
    meta.append(date, divider, readingTime);

    // Create featured image (if available)
    if (post.image) {
        const imageContainer = document.createElement("div");
        imageContainer.className = "mb-8 -mx-8";
        const image = document.createElement("img");
        image.className = "w-full h-[400px] object-cover";
        image.src = post.image;
        image.alt = post.title;
        imageContainer.appendChild(image);
        header.append(title, meta, imageContainer);
    } else {
        header.append(title, meta);
    }

    // Create and style body content
    const content = document.createElement("div");
    content.className = "prose prose-lg max-w-none";
    
    // Split paragraphs and style them
    const paragraphs = post.body.split('\n\n');
    paragraphs.forEach(paragraph => {
        if (paragraph.trim()) {
            const p = document.createElement("p");
            p.className = "mb-6 text-gray-700 leading-relaxed";
            p.innerHTML = paragraph;
            content.appendChild(p);
        }
    });

    // Create tags section (if available)
    if (post.tags && post.tags.length > 0) {
        const tagsSection = document.createElement("div");
        tagsSection.className = "mt-8 pt-8 border-t border-gray-200";
        
        const tagsContainer = document.createElement("div");
        tagsContainer.className = "flex flex-wrap gap-2";
        
        post.tags.forEach(tag => {
            const tagSpan = document.createElement("span");
            tagSpan.className = "px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm";
            tagSpan.innerHTML = tag;
            tagsContainer.appendChild(tagSpan);
        });
        
        tagsSection.appendChild(tagsContainer);
        article.append(header, content, tagsSection);
    } else {
        article.append(header, content);
    }

    // Add share buttons
    const shareSection = document.createElement("div");
    shareSection.className = "mt-8 pt-8 border-t border-gray-200";
    shareSection.innerHTML = `
        <h2 class="text-lg font-semibold text-gray-900 mb-4">Share this post</h2>
        <div class="flex space-x-4">
            <button class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition">
                Twitter
            </button>
            <button class="px-4 py-2 bg-blue-800 text-white rounded-md hover:bg-blue-900 transition">
                Facebook
            </button>
            <button class="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition">
                Copy Link
            </button>
        </div>
    `;

    article.appendChild(shareSection);
    postSection.appendChild(article);
}

// Get post ID from URL
const params = new URLSearchParams(window.location.search);
const postID = params.get('id');

if (postID) {
    fetchBlogPosts(postID);
}