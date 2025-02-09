// Import Firebase methods
import {
auth,
    db,
    addDoc,
    collection, getDocs,serverTimestamp, query, orderBy,where
} from "./firebase.js";



let addPost = async () => {
    // Check if user is signed in
    const user = auth.currentUser; // 'auth' is your Firebase auth instance
    if (!user) {
        alert("Please sign in to add a post.");
        return;
    }

    // Fetch input values
    let title = document.getElementById("title").value.trim();
    let description = document.getElementById("description").value.trim();
    let category = document.getElementById("category").value.trim().toLowerCase();

    // Validate inputs
    if (!title || !description || !category) {
        alert("Please fill out all fields.");
        return;
    }

    try {
        // Add the post to Firestore
        const docRef = await addDoc(collection(db, "Post"), {
            title: title,
            description: description,
            category: category,
            userId: user.uid, // Store the user ID to associate the post with the user
            ServerTimestamp: serverTimestamp()
        });
        console.log("Document written with ID:", docRef.id);
        alert("Post added successfully!");
        getAllPost(); // Refresh posts after adding
    } catch (error) {
        console.error("Error adding post:", error);
        alert("Failed to add post. Please try again.");
    }
};

// Attach event listener
document.getElementById("button").addEventListener('click', addPost);



let getAllPost = async () => {
    const q = query(collection(db, "Post"), orderBy('ServerTimestamp', 'desc'));
    let postListElement = document.getElementById("post_data");

    if (!postListElement) {
        console.error("post_data element not found in the DOM.");
        return;
    }

    postListElement.innerHTML = `<p>Loading posts...</p>`; // Show loading indicator

    try {
        const querySnapshot = await getDocs(q);
        postListElement.innerHTML = ""; // Clear previous results

        if (querySnapshot.empty) {
            postListElement.innerHTML = `<p>No posts found.</p>`;
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
        alert("Failed to fetch posts. Please try again.");
    }
};

// Load all posts on page load
getAllPost();


const searchByCategory = async () => {
    const categoryInput = document.getElementById("searchCategory").value.trim().toLowerCase();
    console.log(categoryInput)
    const postListElement = document.getElementById("post_data");

    if (!categoryInput) {
        alert("Please enter a category to search.");
        return;
    }

    postListElement.innerHTML = `<p>Loading...</p>`; // Show loading indicator

    try {
        const q = query(collection(db, "Post"), where("category", "==", categoryInput));
        const querySnapshot = await getDocs(q);

        postListElement.innerHTML = ""; // Clear previous results

        if (querySnapshot.empty) {
            postListElement.innerHTML = `<p>No posts found for category: ${categoryInput}</p>`;
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
                    <h3 class="card ">${postData.title}</h3>
                    <p class="card">${postData.description}</p>
                    <small class="badge">${postData.category}</small>
                </div>
                <br />
                `;
        });
    } catch (error) {
        console.error("Error fetching posts by category:", error);
        alert("Failed to fetch posts. Please try again.");
    }
};

document.getElementById("searchBtn").addEventListener("click", searchByCategory);
