


// feed/script/post-details.js



import { API_POSTS } from "../../src/script/constants.mjs";
import * as storage from "../../src/storage/index.mjs";

async function fetchPostDetails() {
    const postContainer = document.querySelector(".post-details-container");

  
    if (!postContainer) {
        console.warn("No .post-details-container found. Exiting fetchPostDetails.");
        return;
    }

    try {
        console.log("Fetching post details...");

        const params = new URLSearchParams(window.location.search);
        const postId = params.get("id");

        if (!postId) {
            console.error("No post ID found in URL.");
            postContainer.innerHTML = "<h1>Post Not Found</h1>";
            return;
        }

        const token = storage.get("Token");
        const apiKey = storage.get("ApiKey");

        if (!token || !apiKey) {
            console.error("Missing API Key or Token!");
            alert("Authentication error. Please log in again.");
            window.location.href = "/index.html";
            return;
        }

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
        console.log("Post details retrieved:", result.data);

        renderPostDetails(result.data);
    } catch (error) {
        console.error("Error fetching post details:", error);
    }
}

function renderPostDetails(post) {
    const postContainer = document.querySelector(".post-details-container");

    if (!postContainer) {
        console.error("Post details container not found!");
        return;
    }

    const postImage = post.media?.url && post.media.url !== "null" 
        ? post.media.url 
        : "/assets/defaultavatar.jpg";

    const postTitle = post.title || "Untitled Post";
    const postBody = post.body || "No content available.";
    const postDate = new Date(post.created).toLocaleString();
    const authorName = post.author?.name || "Unknown Author";
    const commentsCount = post._count?.comments || 0;
    const reactionsCount = post._count?.reactions || 0;

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


document.addEventListener("DOMContentLoaded", () => {
    if (document.querySelector(".post-details-container")) {
        fetchPostDetails();
    }
});
