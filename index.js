// Import Firebase methods
import { 
    auth, 
    createUserWithEmailAndPassword, 
    signInWithEmailAndPassword, 
    onAuthStateChanged, 
    sendEmailVerification, 
    signOut, 
    signInWithPopup, 
    GoogleAuthProvider,
    db,  
    addDoc, 
    collection,getDocs , doc, setDoc,updateDoc,serverTimestamp,
     deleteDoc, query,  orderBy,  onSnapshot,Timestamp
} from "./firebase.js";

// Initialize Google Auth Provider
const provider = new GoogleAuthProvider();

// Function to validate email format
const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};

// Function to validate password strength
const isValidPassword = (password) => {
    const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}$/;
    return passwordRegex.test(password);
};

let signUp = async () => {
    let name = document.getElementById("name").value;
    let number = document.getElementById("number").value;
    let email = document.getElementById("email").value;
    let password = document.getElementById("password").value;

    let userData = { name, number, email, password };
    console.log(userData);

    // Validate email and password
    if (!isValidEmail(email)) {
        alert("Please enter a valid email address.");
        return;
    }

    if (!isValidPassword(password)) {
        alert("Password must be at least 6 characters long and include at least one uppercase letter, one lowercase letter, and one number.");
        return;
    }

//  -----------------set doc---------
try {
    // Sign up the user and get the user object
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    const docRef = doc(db, "userdata", user.uid); // Now `user` is defined
    await setDoc(docRef, {
        ...userData,
        uId: user.uid
    });

    console.log("Document written with ID:", docRef.id);
    alert("Signup Successful");
    window.location.href = "index.html"; 
} catch (error) {
    console.error("Error:", error.message);
    alert("Error: " + error.message);
}



};

// Add event listener for Sign Up button
let sign_Up = document.getElementById("sign_Up");
if (sign_Up) {
    sign_Up.addEventListener("click", signUp);
}

// Sign In function
let sign_In = (event) => {
    event.preventDefault(); // Prevent form submission if using form elements

    let email = document.getElementById("email").value;
    let password = document.getElementById("password").value;

    signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            const user = userCredential.user;
            alert("Signed in successfully");
            window.location.href = "index.html";
        })
        .catch((error) => {
            console.error("Error:", error.message);
            alert("Error: " + error.message);
        });
};

// Add event listener to Sign In button
let signInButton = document.getElementById("signIn");
if (signInButton) {
    signInButton.addEventListener("click", sign_In);
}

// Monitor authentication state changes
onAuthStateChanged(auth, (user) => {
    if (user) {
        console.log("User is signed in:", user);
    } else {
        console.log("No user is signed in");
    }
});

// Function to send email verification
let sendMail = () => {
    if (auth.currentUser) {
        sendEmailVerification(auth.currentUser)
            .then(() => {
                alert("Email verification sent");
            })
            .catch((error) => {
                console.error("Error sending verification email:", error.message);
            });
    } else {
        alert("No user is currently signed in.");
    }
};

// Add event listener to Email Verification button
let verification = document.getElementById("verify");
if (verification) {
    verification.addEventListener("click", sendMail);
}

// Sign Out function
let signout = () => {
    signOut(auth)
        .then(() => {
            console.log("Sign-out successful.");
            window.location.href = "signin.html"; // Redirect to sign-in page after successful sign-out
        })
        .catch((error) => {
            console.error("Error during sign-out:", error.message);
        });
};

// Add event listener to Sign Out button
let sign_out = document.getElementById("logout");
if (sign_out) {
    sign_out.addEventListener("click", signout);
}

// Google Sign-In function
const googleSignin = () => {
    signInWithPopup(auth, provider)
        .then((result) => {
            const user = result.user;
            alert("User signed in successfully");
            window.location.href = "main.html"; // Redirect to your main page
        })
        .catch((error) => {
            const errorMessage = error.message;
            console.error("Error during Google sign-in:", error);
            alert(`You are not Registered ${errorMessage}`);
        });
};

// Add event listener for Google Sign-In button
const googleBtn = document.getElementById("google");
if (googleBtn) {
    googleBtn.addEventListener("click", googleSignin);
}
let getData = async()=>
{
    const querySnapshot = await getDocs(collection(db, "users"));
    querySnapshot.forEach((doc) => {
      console.log(`${doc.id} => ${doc.data()}`);
    });
}
getData()
const Update = document.getElementById("update");
if (googleBtn) {
    Update.addEventListener("click", UpdateProfile);
}
let UpdateProfile = async () => {
    let name = document.getElementById("name").value;
    let phone = document.getElementById("phone").value;
    let password = document.getElementById("password").value;

    if (auth.currentUser) {
        let id = auth.currentUser.uid;

        try {
            const washingtonRef = doc(db, "userdata", id);
            await updateDoc(washingtonRef, { name,
                 phone, 
                 password,
                 timestamp: serverTimestamp(),
                }
                );
            alert("Updated");
        } catch (e) {
            console.error("Error updating document:", e);
        }
    } else {
        alert("You must be signed in to update your profile.");
    }
};
// Attach event listener for update button
let update = document.getElementById("update");
if (update) {
    update.addEventListener("click", UpdateProfile); // Attach event listener once
}

let deleteAccount=async()=>
{
  let id = auth.currentUser.uid
  console.log(id);
  await deleteDoc(doc(db, "userdata", id));
  alert("Delete Successfully")
}

let deleteButton = document.getElementById("delete");
if (deleteButton) {
    deleteButton.addEventListener("click", deleteAccount);
}


// POST APP 

let addDocument = async () => {
    try {
      let title_input = document.getElementById("title");
      let desc_input = document.getElementById("description");
   
      title_input.style.display = "block";
      desc_input.style.display = "block";
      // Adding document to Firestore
      const docRef = await addDoc(collection(db, "Post"), {
        title: title_input.value,
        desc: desc_input.value,
        time: Timestamp.now(),
      });
  
      console.log("Successfully added document with ID: ", docRef.id);
  
      // Clear input fields
      title_input.value = '';
      desc_input.value = '';
    } catch (error) {
      console.log("Error adding document: ", error);
    }
  };
  // Add event listener to button
  let button = document.getElementById("button");
  button.addEventListener("click", addDocument);
  
// Function to fetch and display posts based on category
const fetchPosts = (category = null) => {
    try {
        let queryRef = query(collection(db, "Post"), orderBy("time", "desc"));

        // If a category is selected, filter posts by category
        if (category) {
            queryRef = query(queryRef, where("category", "==", category));  // Add category filter
        }

        const unsubscribe = onSnapshot(queryRef, (querySnapshot) => {
            let post_data = document.getElementById("post_data");
            post_data.innerHTML = '';  // Clear previous posts

            querySnapshot.forEach((doc) => {
                const data = doc.data();
                const timeString = data.time ? data.time.toDate().toLocaleString() : "No Timestamp";
                const currentUser = auth.currentUser;
                const userName = currentUser && currentUser.displayName;

                // Create post elements dynamically
                const postElement = document.createElement('div');
                postElement.classList.add('p-2', 'mb-2');
                postElement.setAttribute('data-id', doc.id);

                postElement.innerHTML = `
                    <div class="card-header d-flex">
                        <div class="name-time d-flex flex-column">
                            ${userName}
                            <div class="time">${timeString}</div>
                        </div>
                    </div>
                    <blockquote class="blockquote mb-0">
                        <p class="title">${data.title}</p>
                        <footer class="blockquote-footer description">${data.desc}</footer>
                    </blockquote>
                    <div class="card-footer d-flex justify-content-end">
                        <button type="button" class="ms-2 btn bg-primary text-light editBtn">Edit</button>
                        <button type="button" class="ms-2 btn btn-danger deleteBtn">Delete</button>
                    </div>
                `;

                // Append the post element to the post_data container
                post_data.appendChild(postElement);
            });

            // Attach event listeners for delete and edit buttons
            attachEventListeners();
        });

        return unsubscribe;
    } catch (error) {
        console.error("Error fetching posts:", error);
    }
};

// Call this function initially to display all posts
fetchPosts();  // Display all posts initially

// Function to handle category radio button selection
const handleCategoryChange = () => {
    const categoryRadios = document.querySelectorAll('input[name="category"]');
    
    categoryRadios.forEach(radio => {
        radio.addEventListener('change', (e) => {
            const selectedCategory = e.target.value;
            // Fetch posts based on the selected category
            fetchPosts(selectedCategory);  // Pass selected category to filter posts
        });
    });
};

// Initialize the category filter functionality
handleCategoryChange();




// Attach event listeners for delete and edit functionality
const attachEventListeners = () => {
    const post_data = document.getElementById("post_data");

    // Delete functionality
    post_data.addEventListener("click", async (e) => {
        if (e.target && e.target.classList.contains("deleteBtn")) {
            const postId = e.target.closest('.p-2').getAttribute('data-id');  // Ensure it gets the correct .p-2 (post card)
            if (postId) {
                try {
                    await deleteDoc(doc(db, "Post", postId)); // Delete from Firestore
                    alert("Post deleted successfully");
                } catch (error) {
                    console.error("Error deleting document:", error);
                    alert("Error deleting the post");
                }
            } else {
                alert("Post ID not found!");
            }
        }
    });

    // Edit functionality
    post_data.addEventListener("click", (e) => {
        if (e.target && e.target.classList.contains("editBtn")) {
            const postId = e.target.closest('.p-2').getAttribute('data-id'); // Ensure it gets the correct .p-2 (post card)
            const cardElement = e.target.closest('.p-2'); // Get the closest .p-2 for proper reference
            const currentTitle = cardElement.querySelector('.title').innerText;
            const currentDesc = cardElement.querySelector('.description').innerText;

            // Fill the edit form with current values
            document.getElementById("title").value = currentTitle;
            document.getElementById("description").value = currentDesc;

            // Attach the update function to the update button
            let updateButton = document.getElementById("update_post");
            if (updateButton) {
                updateButton.onclick = () => UpdatePost(postId, cardElement);
            }
        }
    });
};

// Update the post in Firestore and UI
let UpdatePost = async (postId, cardElement) => {
    let title = document.getElementById("title").value;
    let desc = document.getElementById("description").value;

    if (auth.currentUser) {
        try {
            // Get a reference to the specific post document in Firestore
            const postRef = doc(db, "Post", postId);
            await updateDoc(postRef, {
                title,
                desc,
                time: serverTimestamp(), // Optionally update the timestamp
            });

            alert("Post updated successfully");

            // After updating in Firestore, update the UI immediately
            const titleElement = cardElement.querySelector('.title');
            const descElement = cardElement.querySelector('.description');

            if (titleElement && descElement) {
                titleElement.innerText = title; // Update title in UI
                descElement.innerText = desc; // Update description in UI
            }
        } catch (error) {
            console.error("Error updating document:", error);
            alert("Error updating the post");
        }
    } else {
        alert("You must be signed in to update a post.");
    }
};


// Initialize post function



