

// Index.js



import { API_SOCIAL_URL } from 'constants.mjs';

console.log(API_SOCIAL_URL);









  if (path === "/feed/index.html") {
        post.getPosts()
            .then(posts => {
                console.log(posts);
    
            
                const postsContainer = document.getElementById('postsContainer');
    
                
                posts.forEach(post => {
                    const postElement = document.createElement('div');
                    postElement.className = 'card mb-3';
    
                    postElement.innerHTML = `
                        <div class="card-body">
                            <h5 class="card-title">${post.title}</h5>
                            <p class="card-text">${post.body}</p>
                        </div>
                    `;
    
                    postsContainer.appendChild(postElement);
                });
                
            })
            .catch(console.error);
    }