// Import Firebase methods
import { 
    auth, 
    createUserWithEmailAndPassword, 
    signInWithEmailAndPassword, 
    signOut, 
    signInWithPopup, 
    GoogleAuthProvider,
    db,  
    collection,getDocs , doc, setDoc,serverTimestamp
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
    event.preventDefault();

    let email = document.getElementById("email").value;
    let password = document.getElementById("password").value;

    // Debug: Log input values
    console.log("Email:", email, "Password:", password);

    signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            const user = userCredential.user;
            console.log("Signed in user:", user);
            alert("Signed in successfully");
            window.location.href = "index.html";
        })
        .catch((error) => {
            console.error("Error Code:", error.code);
            console.error("Error Message:", error.message);
            alert(`Error: ${error.message} (Code: ${error.code})`);
        });
};

let signInButton = document.getElementById("signIn");
console.log("Sign-In Button:", signInButton);

if (signInButton) {
    signInButton.addEventListener("click", sign_In);
} else {
    console.error("Sign-In Button not found in the DOM.");
}

let getData = async()=>
    {
        const querySnapshot = await getDocs(collection(db, "users"));
        querySnapshot.forEach((doc) => {
          console.log(`${doc.id} => ${doc.data()}`);
        });
    }
    getData()

// Start here    ------------------------------ 
const googleSignin = () => {
    signInWithPopup(auth, provider)
        .then((result) => {
            const user = result.user;
            alert(user, "User signed in successfully");
            window.location.href = "index.html"; // Redirect after login
        })
        .catch((error) => {
            console.error("Error during Google sign-in:", error);
            alert(`You are not Registered: ${error.message}`);
        });
};

// Add event listener for Google Sign-In button
const googleBtn = document.getElementById("google");
if (googleBtn) {
    googleBtn.addEventListener("click", googleSignin);
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





