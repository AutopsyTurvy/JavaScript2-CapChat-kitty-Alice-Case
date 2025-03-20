






// Quick Thought Form Submission Script
// feed/script/quick-thought.js

import { API_POSTS } from "../../src/script/constants.mjs";
import * as storage from "../../src/storage/index.mjs";

/**
 * Handles the submission of the Quick Thought form.
 *
 * - Prevents default form submission behavior.
 * - Retrieves the user authentication token and API key from local storage.
 * - Ensures the user is logged in before allowing a post to be made.
 * - Extracts the user's thought and submits it as a post with only a title.
 * - Displays an alert upon successful submission.
 * - Redirects the user to the feed page to view their post.
 *
 * @listens DOMContentLoaded - Ensures the script only runs when the page has fully loaded.
 */
document.addEventListener("DOMContentLoaded", () => {
    const thoughtForm = document.getElementById("thoughtsForm");

    if (!thoughtForm) {
        console.error("Quick Thought form not found!");
        return;
    }

   

    /**
     * Handles the Quick Thought submission.
     *
     * - Prevents form from submitting the traditional way.
     * - Ensures the user is authenticated.
     * - Retrieves input, ensures it's not empty, and submits it.
     * - Refreshes the feed after successful post submission.
     *
     * @async
     * @param {Event} event - The form submission event.
     * @returns {Promise<void>} Resolves when the post is successfully submitted.
     *
     * @example
     * document.getElementById("thoughtsForm").addEventListener("submit", submitQuickThought);
     */
    thoughtForm.addEventListener("submit", async (event) => {
        event.preventDefault();
       

        // Retrieve authentication tokens
        const token = storage.get("Token");
        const apiKey = storage.get("ApiKey");

        if (!token || !apiKey) {
            console.error("Missing API Key or Token!");
            alert("Authentication error. Please log in again.");
            window.location.href = "/index.html";
            return;
        }

        // Retrieve the user's input
        const thoughtInput = document.getElementById("thought");
        if (!thoughtInput) {
            console.error("Thought input field not found!");
            return;
        }

        const thoughtTitle = thoughtInput.value.trim();
        if (!thoughtTitle) {
            alert("You need to enter a thought before submitting!");
            return;
        }

        // Construct post data
        const quickThought = {
            title: thoughtTitle,
            body: "Quick Thought!", // Placeholder body to meet API requirements
            tags: ["quick-thought"], // Default tag
        };

        

        try {
            const response = await fetch(API_POSTS, {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "X-Noroff-API-Key": apiKey,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(quickThought),
            });

      
            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`Failed to submit quick thought: ${response.statusText} - ${errorText}`);
            }

            const result = await response.json();
           

            alert("Your Quick Thought has been shared!");
            
            // Clears the input field after submission
            thoughtInput.value = "";

            // Redirect to the feed page so the user can see the post they created
            window.location.href = "/feed/index-feed.html";
        } catch (error) {
            console.error("Error posting Quick Thought:", error);
            alert("Failed to submit Quick Thought. Please try again.");
        }
    });
});
