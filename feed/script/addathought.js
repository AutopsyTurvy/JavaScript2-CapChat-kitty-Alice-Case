


// feed/script/addathought.js

import { API_POSTS } from "../../src/script/constants.mjs";  
import * as storage from "../../src/storage/index.mjs";  

/**
 * Initializes the detailed thoughts form submission process (sends posts to the feed).
 * 
 * - Attaches an event listener to the form.
 * - Retrieves and validates input the fields.
 * - Formats data correctly before submission.
 * - Sends a POST request to create a new post in the API.
 * - Redirects the user to the feed upon successful submission, so the user can see their post.
 *
 * @listens DOMContentLoaded - Ensures the script runs only after the DOM is fully loaded.
 */
document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("detailedThoughtsForm");

    if (!form) {
        console.error("Detailed Thoughts form not found!");
        return;
    }

  

    /**
     * Handles the submission of the "Detailed Thoughts" form.
     *
     * - Extracts form data.
     * - Ensures required fields are provided via errors and alerts.
     * - Structures the post data correctly before sending.
     * - Sends a request to the API to create the post.
     * - Handles errors and redirects upon successfully making the post.
     *
     * @async
     * @param {Event} event - The form submission event.
     * @returns {Promise<void>} Resolves when the post is successfully created and the user is redirected to the feed page.
     *
     * @example
     * <form id="detailedThoughtsForm">
     *    <input name="title" required>
     *    <textarea name="thought"></textarea>
     *    <input name="tags">
     *    <input name="imageUrl">
     * </form>
     */
    form.addEventListener("submit", async (event) => {
        event.preventDefault();
      

        // Retrieves and formats the form data
        const formData = new FormData(event.target);
        let postData = Object.fromEntries(formData.entries());

        

        // Validates the title
        if (!postData.title.trim()) {
            alert("Title is required!");
            return;
        }

        // Ensures body content is provided in the form
        if (!postData.thought || postData.thought.trim() === "") {
            console.warn("⚠️ Body (thought) is empty, setting default value.");
            postData.body = "No additional content provided.";
        } else {
            postData.body = postData.thought.trim();
        }

        // Processes tags if they exist- these will later be seen on the dropdown on the feed page
        if (postData.tags && typeof postData.tags === "string") {
            postData.tags = postData.tags.split(",").map(tag => tag.trim());
        }

        if (!Array.isArray(postData.tags)) {
            postData.tags = [];
        }

        // Processes the image URL if provided (optional)
        if (postData.imageUrl && postData.imageUrl.trim() !== "") {
            postData.media = { url: postData.imageUrl.trim(), alt: "User uploaded image" };
        } else {
            delete postData.media;
        }

        // Removes unused fields before sending to avoid errors
        delete postData.thought;
        delete postData.imageUrl;

        

        // Retrieves authentication tokens
        const token = storage.get("Token");
        const apiKey = storage.get("ApiKey");

        if (!token || !apiKey) {
            console.error("Missing API Key or Token!");
            alert("Authentication error. Please log in again.");
            window.location.href = "/index.html";
            return;
        }

        try {
            // Sends a POST request to create the new post
            const response = await fetch(API_POSTS, {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "X-Noroff-API-Key": apiKey,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(postData),
            });

         
            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`Failed to create post: ${response.statusText} - ${errorText}`);
            }

            const result = await response.json();
            



            // redirects the user upon successful creation of a post! 
            alert("Post created successfully!");
            window.location.href = "/feed/index-feed.html";
        } catch (error) {
            console.error("Error creating post:", error);
            alert("Failed to create post. Check console for details.");
        }
    });
});
