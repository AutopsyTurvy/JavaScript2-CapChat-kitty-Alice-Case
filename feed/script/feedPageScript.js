


// This should prevent the thought form from submitting 



import { API_POSTS } from "../../src/script/constants.mjs";
import * as storage from "../../src/storage/index.mjs";

let allPosts = []; 

async function fetchAndDisplayPosts() {
    try {
        console.log("Fetching posts for feed...");

        const token = storage.get("Token");
        const apiKey = storage.get("ApiKey");

        if (!token || !apiKey) {
            console.error("Missing API Key or Token!");
            alert("Authentication error. Please log in again.");
            window.location.href = "/index.html"; 
            return;
        }

        const response = await fetch(`${API_POSTS}?_author=true&_comments=true&_reactions=true`, {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${token}`,
                "X-Noroff-API-Key": apiKey,
                "Content-Type": "application/json",
            },
        });

        if (!response.ok) {
            throw new Error(`Failed to fetch posts: ${response.statusText}`);
        }

        const result = await response.json();
        console.log("Posts retrieved:", result.data);

       
        allPosts = result.data || [];

        if (allPosts.length === 0) {
            document.querySelector(".main-feed-container").innerHTML = "<h2>No posts available.</h2>";
            return;
        }

        renderPosts(allPosts);
        extractAndPopulateTags(allPosts); 
    } catch (error) {
        console.error("Error fetching posts:", error);
    }
}

function renderPosts(posts) {
    const feedContainer = document.querySelector(".feed-posts-container");

    if (!feedContainer) {
        console.error("Feed container not found!");
        return;
    }

    feedContainer.innerHTML = ""; 

    posts.forEach(post => {
        const postImage = post.media?.url && post.media.url !== "null" ? post.media.url : "/assets/defaultavatar.jpg";

        const postCard = document.createElement("div");
        postCard.classList.add("post-card");

        postCard.innerHTML = `
            <div class="post-content">
                <img src="${postImage}" alt="Post Image" class="post-image"
                     onerror="this.onerror=null;this.src='/assets/defaultavatar.jpg';">
                <div class="post-details">
                    <h2 class="post-title">${post.title || "Untitled Post"}</h2>
                    <p class="post-body">${post.body || "No content available."}</p>
                    <small class="post-date">Created on: ${new Date(post.created).toLocaleString()}</small>
                    <a href="/feed/post-details.html?id=${post.id}" class="view-post-button">View Post</a>
                </div>
            </div>
        `;

        feedContainer.appendChild(postCard);
    });
}


function extractAndPopulateTags(posts) {
    const tagDropdown = document.getElementById("tagDropdown");

    if (!tagDropdown) {
        console.error("Tag dropdown not found!");
        return;
    }

   
    let tags = posts
        .filter(post => Array.isArray(post.tags) && post.tags.length > 0) 
        .flatMap(post => post.tags); 

    
    let uniqueTags = [...new Set(tags)];

  
    tagDropdown.innerHTML = `<option value="">Filter by Tag</option>`;

    
    uniqueTags.forEach(tag => {
        const option = document.createElement("option");
        option.value = tag;
        option.textContent = tag.charAt(0).toUpperCase() + tag.slice(1); 
        tagDropdown.appendChild(option);
    });

    console.log("Available tags:", uniqueTags);
}


function filterPosts() {
    if (allPosts.length === 0) {
        console.warn("No posts available yet. Try again after posts load.");
        return;
    }

    const searchInput = document.getElementById("searchInput");
    if (!searchInput) {
        console.error("Search input field not found!");
        return;
    }

    const query = searchInput.value.toLowerCase();

    let filteredPosts = allPosts.filter(post =>
        post.title.toLowerCase().includes(query) || post.body.toLowerCase().includes(query)
    );

    renderPosts(filteredPosts);
}


function filterByTag() {
    if (allPosts.length === 0) {
        console.warn("No posts available yet. Try again after posts load.");
        return;
    }

    const tagDropdown = document.getElementById("tagDropdown");
    if (!tagDropdown) {
        console.error("Tag dropdown not found!");
        return;
    }

    const selectedTag = tagDropdown.value;

    if (!selectedTag) {
        renderPosts(allPosts); 
        return;
    }

    let filteredPosts = allPosts.filter(post =>
        Array.isArray(post.tags) && post.tags.includes(selectedTag)
    );

    renderPosts(filteredPosts);
}


document.addEventListener("DOMContentLoaded", async () => {
    await fetchAndDisplayPosts(); 

    const searchInput = document.getElementById("searchInput");
    if (searchInput) {
        searchInput.addEventListener("input", filterPosts);
    } else {
        console.error("Search input field missing in DOM!");
    }

    const tagDropdown = document.getElementById("tagDropdown");
    if (tagDropdown) {
        tagDropdown.addEventListener("change", filterByTag);
    } else {
        console.error("Tag dropdown missing in DOM!");
    }
});



document.addEventListener("DOMContentLoaded", fetchAndDisplayPosts);

