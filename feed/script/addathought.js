


// feed/script/addathought.js



import { API_POSTS } from "../../src/script/constants.mjs";  
import * as storage from "../../src/storage/index.mjs";  


document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("detailedThoughtsForm");

    if (!form) {
        console.error("Detailed Thoughts form not found!");
        return;
    }

    console.log("Found detailed thoughts form.");

    form.addEventListener("submit", async (event) => {
        event.preventDefault();
        console.log(" Submitting new post...");

       
        const formData = new FormData(event.target);
        let postData = Object.fromEntries(formData.entries());

        console.log("Raw form data collected:", [...formData.entries()]);

    
        if (!postData.title.trim()) {
            alert("Title is required!");
            return;
        }

        
        if (!postData.thought || postData.thought.trim() === "") {
            console.warn("⚠️ Body (thought) is empty, setting default value.");
            postData.body = "No additional content provided.";
        } else {
            postData.body = postData.thought.trim();
        }

       
        if (postData.tags && typeof postData.tags === "string") {
            postData.tags = postData.tags.split(",").map(tag => tag.trim());
        }

   
        if (!Array.isArray(postData.tags)) {
            postData.tags = [];
        }

      
        if (postData.imageUrl && postData.imageUrl.trim() !== "") {
            postData.media = { url: postData.imageUrl.trim(), alt: "User uploaded image" };
        } else {
            delete postData.media; 
        }

       
        delete postData.thought;
        delete postData.imageUrl;

        console.log("Final postData before sending:", JSON.stringify(postData, null, 2));

        const token = storage.get("Token");
        const apiKey = storage.get("ApiKey");

        if (!token || !apiKey) {
            console.error("Missing API Key or Token!");
            alert("Authentication error. Please log in again.");
            window.location.href = "/index.html";
            return;
        }

        try {
            const response = await fetch(API_POSTS, {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "X-Noroff-API-Key": apiKey,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(postData),
            });

            console.log("Response status:", response.status);
            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`Failed to create post: ${response.statusText} - ${errorText}`);
            }

            const result = await response.json();
            console.log(" Post created successfully:", result.data);

            alert("Post created successfully!");
            window.location.href = "/feed/index-feed.html";
        } catch (error) {
            console.error("Error creating post:", error);
            alert("Failed to create post. Check console for details.");
        }
    });
});
