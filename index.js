// Import Firebase methods
import {
    db,
    collection,
    getDocs,
    query,
    orderBy,
    where
} from "./firebase.js";

// Function to get all posts
let getAllPosts = async () => {
    const postListElement = document.getElementById("post_data");

    if (!postListElement) {
        console.error("post_data element not found in the DOM.");
        return;
    }

    postListElement.innerHTML = "<p>Loading posts...</p>"; // Show loading message

    try {
        const q = query(collection(db, "Post"), orderBy('ServerTimestamp', 'desc'));
        const querySnapshot = await getDocs(q);

        postListElement.innerHTML = ""; // Clear previous posts

        if (querySnapshot.empty) {
            postListElement.innerHTML = "<p>No posts found.</p>";
            return;
        }

        querySnapshot.forEach((doc) => {
            const postData = doc.data();
            const timeString = postData.ServerTimestamp?.toDate().toLocaleString() || "No Timestamp";

            postListElement.innerHTML += `
                <div class="post-card">
                    <div class="card-header">
                        <p>Posted on: ${timeString}</p>
                    </div>
                    <h3>${postData.title}</h3>
                    <p>${postData.description}</p>
                    <small class="badge">${postData.category}</small>
                </div>`;
        });
    } catch (error) {
        console.error("Error fetching posts:", error);
        postListElement.innerHTML = "<p>Failed to fetch posts. Please try again.</p>";
    }
};

const searchByCategory = () => {
    const categoryInput = document.getElementById("searchCategory").value.trim().toLowerCase();
    const postListElement = document.getElementById("post_data");

    
    postListElement.innerHTML = "<p>Loading...</p>"; // Show loading message

    // Create a query to search posts by category
    const q = query(
        collection(db, "Post"),
        where("category", "==", categoryInput),
        orderBy("ServerTimestamp", "desc")
    );

    // Use `.then()` and `.catch()` to handle the Promise from `getDocs`
    getDocs(q)
        .then(querySnapshot => {
            postListElement.innerHTML = ""; // Clear previous posts

           

            querySnapshot.forEach(doc => {
                const postData = doc.data();
                const timeString = postData.ServerTimestamp?.toDate().toLocaleString() || "No Timestamp";

                postListElement.innerHTML += `
                    <div class="post-card">
                        <div class="card-header">
                            <p>Posted on: ${timeString}</p>
                        </div>
                        <h3>${postData.title}</h3>
                        <p>${postData.description}</p>
                        <small class="badge">${postData.category}</small>
                    </div>`;
            });
        })
        .catch(error => {
            console.error("Error fetching posts by category:", error);
            postListElement.innerHTML = "<p>Failed to fetch posts. Please try again.</p>";
        });
};

// Load all posts on page load
getAllPosts();

// Event listener for the search button
document.getElementById("searchBtn").addEventListener("click", searchByCategory);
