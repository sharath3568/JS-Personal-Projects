import {
    signUp,
    signIn,
    getCurrentUser
} from "./auth.js";


// ================================
// DOM ELEMENTS
// ================================

const loginTab = document.querySelector("#loginTab");
const signupTab = document.querySelector("#signupTab");

const loginForm = document.querySelector("#login-form");
const signupForm = document.querySelector("#signup-form");

const loginMessage = document.querySelector("#login-message");
const signupMessage = document.querySelector("#signup-message");


// ================================
// SWITCH AUTH MODE
// ================================

function showLogin() {

    loginTab.classList.add("active");
    signupTab.classList.remove("active");

    loginForm.classList.remove("hidden");
    signupForm.classList.add("hidden");

    clearMessages();
}


function showSignup() {

    signupTab.classList.add("active");
    loginTab.classList.remove("active");

    signupForm.classList.remove("hidden");
    loginForm.classList.add("hidden");

    clearMessages();
}


function clearMessages() {

    loginMessage.textContent = "";
    signupMessage.textContent = "";
}


// ================================
// TAB EVENTS
// ================================

loginTab.addEventListener("click", showLogin);

signupTab.addEventListener("click", showSignup);


// ================================
// LOGIN
// ================================

loginForm.addEventListener("submit", async (event) => {

    event.preventDefault();

    const email =
        document.querySelector("#login-email").value.trim();

    const password =
        document.querySelector("#login-password").value;


    loginMessage.textContent = "Signing in...";

    const button =
        loginForm.querySelector(".primary-auth-button");

    button.disabled = true;


    try {

        await signIn(email, password);

        loginMessage.textContent =
            "Login successful.";

        console.log("User logged in successfully.");

        /*
         * We'll replace this with:
         *
         * showDashboard();
         *
         * in the next milestone.
         */

    }
    catch (error) {

        console.error(error);

        loginMessage.textContent =
            error.message;
    }
    finally {

        button.disabled = false;
    }
});


// ================================
// SIGNUP
// ================================

signupForm.addEventListener("submit", async (event) => {

    event.preventDefault();

    const name =
        document.querySelector("#signup-name").value.trim();

    const email =
        document.querySelector("#signup-email").value.trim();

    const password =
        document.querySelector("#signup-password").value;


    signupMessage.textContent =
        "Creating your account...";

    const button =
        signupForm.querySelector(".primary-auth-button");

    button.disabled = true;


    try {

        const data = await signUp(
            email,
            password,
            name
        );

        console.log("Signup result:", data);


        if (data.session) {

            signupMessage.textContent =
                "Account created successfully.";

        }
        else {

            signupMessage.textContent =
                "Account created. Please check your email to confirm your account.";

        }

    }
    catch (error) {

        console.error(error);

        signupMessage.textContent =
            error.message;
    }
    finally {

        button.disabled = false;
    }
});


// ================================
// CHECK EXISTING SESSION
// ================================

const currentUser = await getCurrentUser();

if (currentUser) {

    console.log(
        "Existing authenticated user:",
        currentUser.email
    );

    /*
     * We'll redirect/show the dashboard
     * here in the next step.
     */
}