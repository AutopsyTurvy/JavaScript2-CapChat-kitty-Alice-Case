


// src/script/profileScript.js


import { API_POSTS } from "./constants.mjs";  
import * as storage from "../storage/index.mjs"; 


document.addEventListener("DOMContentLoaded", async () => {
    console.log("Loading your profile...");

    const profileSection = document.getElementById("profile-section");
    const postsContainer = document.getElementById("user-posts-container");

    const storedProfile = storage.get("Profile");

    if (!storedProfile || !storedProfile.name) {
        console.warn("⚠️ No profile data found. Redirecting to login.");
        alert("No profile data found. Please log in.");
        window.location.href = "/pages/login.html";
        return;
    }

  
    profileSection.innerHTML = `
        <h1>Welcome, ${storedProfile.name}!</h1>
        <p>Email: ${storedProfile.email}</p>
        <img id="avatar" class="profile-avatar" src="${storedProfile.avatar || '/assets/defaultavatar.jpg'}" alt="User Avatar">
        <img id="banner" class="profile-banner" src="${storedProfile.banner || '/assets/defaultbanner.jpg'}" alt="User Banner">
    `;

    
    if (!postsContainer) {
        console.error("User posts container not found!");
        return;
    }

 
    await fetchUserPosts(storedProfile.name, postsContainer);
});

async function fetchUserPosts(username, postsContainer) {
    console.log(`Fetching posts for user: ${username}`);

    const token = storage.get("Token");
    const apiKey = storage.get("ApiKey");

    if (!token || !apiKey) {
        console.error("Missing API Key or Token!");
        return;
    }

    try {
        const response = await fetch(`${API_POSTS}?_author=true&_comments=true&_reactions=true`, {

            method: "GET",
            headers: {
                "Authorization": `Bearer ${token}`,
                "X-Noroff-API-Key": apiKey,
                "Content-Type": "application/json",
            },
        });

        if (!response.ok) {
            throw new Error(`Failed to fetch user posts: ${response.statusText}`);
        }

        const result = await response.json();
        const allPosts = result.data || [];
        const userPosts = allPosts.filter(post => post.author?.name === username);


        console.log("User posts retrieved:", userPosts);
        renderUserPosts(userPosts, postsContainer);
    } catch (error) {
        console.error("Error fetching user posts:", error);
    }
}














function renderUserPosts(posts, container) {
    container.innerHTML = "<h2>Your Posts</h2>";

    if (posts.length === 0) {
        container.innerHTML += "<p>No posts found.</p>";
        return;
    }

    container.style.display = "flex";
    container.style.flexWrap = "wrap";
    container.style.justifyContent = "center";
    container.style.gap = "20px";
    container.style.padding = "20px";

    posts.forEach(post => {
        const postElement = document.createElement("div");
        postElement.classList.add("user-post-card");

        postElement.innerHTML = `
            <div class="user-post-card-content">
                <img src="${post.media?.url || '/assets/defaultavatar.jpg'}" alt="Post Image" class="user-post-image">
                <div class="user-post-details">
                    <h3>${post.title || "Untitled Post"}</h3>
                    <p>${post.body || "No content available."}</p>
                    <small>Created on: ${new Date(post.created).toLocaleString()}</small>
                    <a href="/feed/post-details.html?id=${post.id}" class="view-post-button">View Post</a>
                </div>
            </div>
        `;

        container.appendChild(postElement);
    });
}

