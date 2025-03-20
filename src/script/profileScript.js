


// src/script/profileScript.js





import { API_POSTS } from "./constants.mjs";
import * as storage from "../storage/index.mjs";


// This is the profile page- some of the most integral functions of the site are found on this page:
/**
 * Loads the user's profile and fetches their posts when the page is fully loaded.
 * - Retrieves the user profile from local storage and renders it onto the page (name, email, avatar, banner)..
 * - Redirects to the login page if no valid profile is found.
 * - Fetches and displays user-created posts under the profile information
 *
 * @listens DOMContentLoaded - Ensures the profile loads only when the DOM is fully ready for it.
 */
document.addEventListener("DOMContentLoaded", async () => {
    console.log("Loading your profile...");

    const profileSection = document.getElementById("profile-section");
    const postsContainer = document.getElementById("user-posts-container");

    // Retrieves stored profile data from local storage
    const storedProfile = storage.get("Profile");

    // Redirects to login if no valid profile is found so user might try to log in instead
    if (!storedProfile || !storedProfile.name) {
        console.warn("⚠️ No profile data found. Redirecting to login.");
        alert("No profile data found. Please log in.");
        window.location.href = "/pages/login.html";
        return;
    }

    // Dynamically populates the profile section with the information given in the registration form
    profileSection.innerHTML = `
        <h1>Welcome, ${storedProfile.name}!</h1>
        <p>Email: ${storedProfile.email}</p>
        <img id="avatar" class="profile-avatar" src="${storedProfile.avatar || '/assets/defaultavatar.jpg'}" alt="User Avatar">
        <img id="banner" class="profile-banner" src="${storedProfile.banner || '/assets/defaultbanner.jpg'}" alt="User Banner">
    `;

    // Ensures the posts container exists before fetching the user posts
    if (!postsContainer) {
        console.error("User posts container not found!");
        return;
    }

    // Fetches and display the user's posts, providing they have made them:
    await fetchUserPosts(storedProfile.name, postsContainer);
});





/**
 * Fetches all posts from the API and filters them to only include posts
 *  that have been created by the specified user/ the logged in user.
 * 
 * - Retrieves authentication tokens from local storage.
 * - Sends a GET request to the API to fetch all posts with the author, comments and reactions on the post.
 * - Filters the posts to include only those authored by the provided username.
 * - Calls `renderUserPosts()` to display the filtered posts under the profile data.
 * 
 *
 * @async
 * @param {string} username - The username of the logged-in user whose posts should be retrieved and shown.
 * @param {HTMLElement} postsContainer - The DOM element where the user's created posts will be rendered.
 * @returns {Promise<void>} Resolves when posts are successfully fetched and displayed!
 *
 * @example
 * fetchUserPosts("Usernumber2", document.getElementById("user-posts-container"));
 */
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




// The code below renders the user's posts onto the page:

/**
 * Renders a list of user posts into the inner html of the profile page.
 *
 * - Creates the heading "Your Posts".
 * - Displays a message if no posts are found.
 * - Iterates over the posts and creates individual cards for each one, displaying them neatly and responsively.
 * - Includes an edit and delete button for posts belonging to the logged-in user.
 * - Adds relevant event listeners for editing and deleting posts.
 *
 * @param {Array<Object>} posts - The list of posts to be displayed on the profile page.
 * @param {HTMLElement} container - The DOM element where posts should be rendered.
 *
 * @example
 * renderUserPosts(userPosts, document.getElementById("user-posts-container"));
 */
function renderUserPosts(posts, container) {
    container.innerHTML = "<h2 class='user-posts-header'>Your Posts</h2>";

    if (posts.length === 0) {
        container.innerHTML += "<p>No posts found.</p>";
        return;
    }

    posts.forEach(post => {
        const postElement = document.createElement("div");
        postElement.classList.add("user-post-card");

        const loggedInUser = storage.get("Profile").name;

        postElement.innerHTML = `
            <div class="user-post-content">
                <img src="${post.media?.url || '/assets/defaultavatar.jpg'}" 
                     alt="Post Image" class="user-post-image">
                <div class="user-post-details">
                    <h3>${post.title || "Untitled Post"}</h3>
                    <p>${post.body || "No content available."}</p>
                    <small>Created on: ${new Date(post.created).toLocaleString()}</small>
                    <a href="/feed/post-details.html?id=${post.id}" 
                       class="view-post-button">View Post</a>
                    ${post.author.name === loggedInUser ? `
                        <button class="edit-post-button" data-id="${post.id}">Edit</button>
                        <button class="delete-post-button" data-id="${post.id}">Delete</button>
                    ` : ""}
                </div>
            </div>
        `;

        container.appendChild(postElement);
    });

    // Attaches event listeners to edit buttons- (edit button calls the edit modal.)
    document.querySelectorAll(".edit-post-button").forEach(button => {
        button.addEventListener("click", (event) => {
            const postId = event.target.dataset.id;
            openEditForm(postId);
        });
    });

    // Attach event listeners to delete buttons
    document.querySelectorAll(".delete-post-button").forEach(button => {
        button.addEventListener("click", (event) => {
            const postId = event.target.dataset.id;
            deletePost(postId);
        });
    });
}







// For editing your posts/ posts created by the user:
/**
 * Opens the edit form modal for the specific post.
 *
 * - Retrieves authentication tokens from local storage.
 * - Fetches the selected post data from the API.
 * - Populates the edit form fields with the post details for ease of editing,
 * - Displays the edit modal for the user to modify the post however they see fit.
 * 
 *
 * @async
 * @param {string} postId - The ID of the post to be edited by the user.
 * @returns {Promise<void>} Resolves when the post data is successfully retrieved and displayed in the modal.
 *
 * @example
 * openEditForm("2468"); // Opens the edit form for post with ID 2468
 */
function openEditForm(postId) {
    console.log(`Editing post: ${postId}`);

    const token = storage.get("Token");
    const apiKey = storage.get("ApiKey");

    if (!token || !apiKey) {
        alert("Authentication error. Please log in again.");
        window.location.href = "/index.html";
        return;
    }

    fetch(`${API_POSTS}/${postId}`, {
        method: "GET",
        headers: {
            "Authorization": `Bearer ${token}`,
            "X-Noroff-API-Key": apiKey,
            "Content-Type": "application/json",
        }
    })
    .then(response => {
        if (!response.ok) {
            throw new Error(`Failed to fetch post details: ${response.statusText}`);
        }
        return response.json();
    })
    .then(responseData => {
        const post = responseData.data;
        console.log("Populating edit modal with post data:", post);

        document.getElementById("editPostId").value = post.id || "";
        document.getElementById("editTitle").value = post.title || "";
        document.getElementById("editBody").value = post.body || "";
        document.getElementById("editTags").value = post.tags?.length ? post.tags.join(", ") : "";
        document.getElementById("editImageUrl").value = post.media?.url || "";




        //-----------------------
        // Shows the edit modal
        document.getElementById("edit-post-modal").style.display = "block";
    })
    .catch(error => {
        console.error("Error fetching post data:", error);
        alert("Failed to load post data. Please try again.");
    });
}







/**
 * Deletes a user post from the API after user confirmation of wishing to do so.
 *
 * - Retrieves authentication tokens from local storage.
 * - Confirms with the user before proceeding with deletion of the post
 * - Sends a DELETE request to the API to remove said post.
 * - If successful, the user will be alerted and the page refreshed, to show the rest of the user posts.
 * - Handles and logs errors if the deletion somehow fails.
 *
 * @async
 * @param {string} postId - The ID of the post to be deleted.
 * @returns {Promise<void>} Resolves when the post is successfully deleted and the UI is updated.
 *
 * @example
 * deletePost("2468"); // Deletes post with ID 2468
 */
async function deletePost(postId) {
    const token = storage.get("Token");
    const apiKey = storage.get("ApiKey");

    if (!token || !apiKey) {
        alert("Authentication error. Please log in again.");
        window.location.href = "/index.html";
        return;
    }

    // Confirms with the user before deleting the post
    const confirmDelete = confirm("Are you sure you want to delete this post?");
    if (!confirmDelete) return;

    try {
        const response = await fetch(`${API_POSTS}/${postId}`, {
            method: "DELETE",
            headers: {
                "Authorization": `Bearer ${token}`,
                "X-Noroff-API-Key": apiKey
            }
        });

        if (!response.ok) {
            throw new Error("Failed to delete post");
        }

        alert("Post deleted successfully!");

        // Refreshes the user's posts after deletion to show remaining posts:
        fetchUserPosts(storage.get("Profile").name, document.getElementById("user-posts-container"));

    } catch (error) {
        console.error("Error deleting post:", error);
        alert("Failed to delete post. Please try again.");
    }
}





/**
 * Handles the submission of the edit post form- for editing the user's posts
 *
 * - Prevents the default form submission.
 * - Retrieves and validates the post ID.
 * - Ensures the body text does not exceed 280 characters and alerts the user if it is.
 * - Processes tags and image URL if provided by the user (not required to make a post)
 * - Sends an API request to update the post.
 * - Displays success or error messages based on the outcome of editing.
 * - Refreshes the user's posts upon successful update, so the user can see all of their posts and the changes they made
 *
 * @async
 * @param {Event} event - The form submission event.
 * @returns {Promise<void>} Resolves when the post update process is completed.
 *
 * @example
 * document.getElementById("editPostForm").addEventListener("submit", updatePost);
 */
document.getElementById("editPostForm")?.addEventListener("submit", async (event) => {
    event.preventDefault();

    // Retrieves and validates the post ID 
    const postIdInput = document.getElementById("editPostId");
    if (!postIdInput) {
        console.error("Post ID input not found.");
        alert("Error: Post ID not found.");
        return;
    }
    const postId = parseInt(postIdInput.value.trim(), 10);

    if (isNaN(postId) || postId <= 0) {
        alert("Invalid Post ID. Please try again.");
        return;
    }

    // Retrieves form values
    const titleInput = document.getElementById("editTitle");
    const bodyInput = document.getElementById("editBody");
    const tagsInput = document.getElementById("editTags");
    const imageUrlInput = document.getElementById("editImageUrl");

    if (!titleInput || !bodyInput || !tagsInput || !imageUrlInput) {
        console.error("One or more form inputs are missing.");
        alert("Error: Missing form fields. Please try again.");
        return;
    }

    const title = titleInput.value.trim();
    const body = bodyInput.value.trim();

    // Validates characters/ length of the body- warns the user that their form will not be accepted
    // if the do not shortn the length of their form/ post submission
    if (body.length > 280) {
        alert("Your post body exceeds 280 characters. Please shorten it.");
        return;
    }

    // Processes tags
    const tags = tagsInput.value
        .split(",")
        .map(tag => tag.trim())
        .filter(tag => tag !== "");

    // Constructs an updated post object based on changes
    const updatedPost = {
        title: title || "Untitled Post",
        body: body || "No additional content provided.",
        tags: tags.length ? tags : [],
    };

    // Adds a media object if an image URL is provided by user
    const imageUrl = imageUrlInput.value.trim();
    if (imageUrl) {
        updatedPost.media = { url: imageUrl, alt: "User updated image" };
    }

    console.log("Sending updated post data:", JSON.stringify(updatedPost, null, 2));

    // Retrieves authentication tokens from storage
    const token = storage.get("Token");
    const apiKey = storage.get("ApiKey");

    if (!token || !apiKey) {
        console.error("Missing API Key or Token!");
        alert("Authentication error. Please log in again.");
        window.location.href = "/index.html";
        return;
    }

    try {
        // Send PUT request to update the post:
        const response = await fetch(`${API_POSTS}/${postId}`, {
            method: "PUT",
            headers: {
                "Authorization": `Bearer ${token}`,
                "X-Noroff-API-Key": apiKey,
                "Content-Type": "application/json",
            },
            body: JSON.stringify(updatedPost),
        });

        console.log("API Response Status:", response.status);

        // Handle response errors in case the update fails
        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Failed to update post: ${errorText}`);
        }

        console.log("Post updated successfully!");
        alert("Post updated successfully!");

        // Closees the modal and refreshes the posts list so the user can see an ychanges they made
        const modal = document.getElementById("edit-post-modal");
        if (modal) {
            modal.style.display = "none";
        }

        fetchUserPosts(storage.get("Profile").name, document.getElementById("user-posts-container"));
    } catch (error) {
        console.error("Error updating post:", error);
        alert("Failed to update post. Check console for details.");
    }
});


// And lastly::

/**
 * This handles the closing of the edit post modal.
 *
 * - Adds an event listener to the button with the class `.close-button` to close the modal when clicked by the user.
 * - Closes the modal when clicking outside of it (background overlay/ any place in the background).
 * - Ensures the modal is hidden properly when dismissed because default behaviour
 * -  was initially for it to be open upon refresh of the page and for it to cover the profile info (not good!).
 * @example
 * // Automatically runs when the page loads
 * document.addEventListener("DOMContentLoaded", setupModalCloseHandlers);
 */
document.addEventListener("DOMContentLoaded", () => {
    const modal = document.getElementById("edit-post-modal");
    const closeButtons = document.querySelectorAll(".close-button");

    if (!modal) {
        console.error("Edit post modal not found in the DOM.");
        return;
    }

    // Adds event listeners to close buttons on the modal
    closeButtons.forEach(button => {
        button.addEventListener("click", () => {
            modal.style.display = "none";
        });
    });

    // Closees the modal if the user clicks outside of it or anywhere ont he background
    window.addEventListener("click", (event) => {
        if (event.target === modal) {
            modal.style.display = "none";
        }
    });
});

