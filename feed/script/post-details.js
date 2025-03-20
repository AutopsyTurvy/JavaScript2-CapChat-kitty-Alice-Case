


// feed/script/post-details.js



import { API_POSTS } from "../../src/script/constants.mjs";
import * as storage from "../../src/storage/index.mjs";

/**
 * - Fetches the details of a specific post based on the ID found in the URL.
 * 
 * - Extracts the post ID from the URL parameters.
 * - Retrieves authentication tokens.
 * - Fetches post data including author, comments, and reactions.
 * - Calls `renderPostDetails()` to display the fetched post.
 * - Handles missing or incorrect post IDs with appropriate feedback.
 * 
 * @async
 * @returns {Promise<void>} Resolves when the post details are successfully retrieved and displayed.
 *
 * @example
 * fetchPostDetails();
 */
async function fetchPostDetails() {
    const postContainer = document.querySelector(".post-details-container");

    // Checks if the post container is present before attempting to fetch data
    if (!postContainer) {
        console.warn("No .post-details-container found. Exiting fetchPostDetails.");
        return;
    }

    try {
        

        // Retrieves the post ID from the URL parameters
        const params = new URLSearchParams(window.location.search);
        const postId = params.get("id");

        if (!postId) {
            console.error("No post ID found in URL.");
            postContainer.innerHTML = "<h1>Post Not Found</h1>";
            return;
        }

        // Retrieves authentication tokens from local storage
        const token = storage.get("Token");
        const apiKey = storage.get("ApiKey");

        if (!token || !apiKey) {
            console.error("Missing API Key or Token!");
            alert("Authentication error. Please log in again.");
            window.location.href = "/index.html";
            return;
        }

        // Fetches the post details from the API
        const response = await fetch(`${API_POSTS}/${postId}?_author=true&_comments=true&_reactions=true`, {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${token}`,
                "X-Noroff-API-Key": apiKey,
                "Content-Type": "application/json",
            },
        });

        if (!response.ok) {
            throw new Error(`Failed to fetch post: ${response.statusText}`);
        }

        const result = await response.json();
        

        // Calls function to render post details onto the page
        renderPostDetails(result.data);
    } catch (error) {
        console.error("Error fetching post details:", error);
    }
}

/**
 * Renders the details of a post onto the page.
 *
 * - Displays the post image, title, body, author name, and created date.
 * - Shows the number of comments and reactions (Will add ability to comment a little later if there's time).
 * - Includes a "Back to Feed" button so the user can easily return to feed page.
 * - Handles missing or broken images by providing a default fallback.
 *
 * @param {Object} post - The post object retrieved from the API.
 * @param {string} post.title - The title of the post.
 * @param {string} post.body - The main content/body of the post.
 * @param {Object} post.media - Media object containing the post image URL.
 * @param {string} [post.media.url] - The URL of the post image.
 * @param {Object} post.author - The author of the post.
 * @param {string} [post.author.name] - The name of the author.
 * @param {string} post.created - The creation date of the post.
 * @param {Object} post._count - Object containing post stats.
 * @param {number} [post._count.comments] - Number of comments on the post.
 * @param {number} [post._count.reactions] - Number of reactions on the post.
 *
 * @example
 * renderPostDetails(post);
 */
function renderPostDetails(post) {
    const postContainer = document.querySelector(".post-details-container");

    if (!postContainer) {
        console.error("Post details container not found!");
        return;
    }

    // Handles missing post media and sets a default fallback image, as does the profile and feed page
    const postImage = post.media?.url && post.media.url !== "null" 
        ? post.media.url 
        : "/assets/defaultavatar.jpg";

    const postTitle = post.title || "Untitled Post";
    const postBody = post.body || "No content available.";
    const postDate = new Date(post.created).toLocaleString();
    const authorName = post.author?.name || "Unknown Author";
    const commentsCount = post._count?.comments || 0;
    const reactionsCount = post._count?.reactions || 0;

    // Generates the post details layout
    postContainer.innerHTML = `
        <div class="post-card">
            <img src="${postImage}" alt="Post Image" class="post-image"
                 onerror="this.onerror=null;this.src='/assets/defaultavatar.jpg';">
            <h1 class="post-title">${postTitle}</h1>
            <p class="post-body">${postBody}</p>
            <small class="post-meta">By: ${authorName} | Created on: ${postDate}</small>
            <div class="post-stats">
                <p>💬 ${commentsCount} Comments | ❤️ ${reactionsCount} Reactions</p>
            </div>
            <a href="/feed/index-feed.html" class="back-button">← Back to Feed</a>
        </div>
    `;
}

/**
 * Ensures that post details are fetched when the page loads.
 *
 * - Listens for `DOMContentLoaded` and runs `fetchPostDetails()` if the container exists.
 *
 * @listens DOMContentLoaded
 *
 * @example
 * // Automatically runs when the page loads
 * document.addEventListener("DOMContentLoaded", () => {
 *     if (document.querySelector(".post-details-container")) {
 *         fetchPostDetails();
 *     }
 * });
 */
document.addEventListener("DOMContentLoaded", () => {
    if (document.querySelector(".post-details-container")) {
        fetchPostDetails();
    }
});
