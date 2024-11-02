const userDatabase = JSON.parse(localStorage.getItem('userDatabase')) || {
    "adminUser": { email: "capricereed334@gmail.com", password: "Xboxoneboy22!!", isAdmin: true }
};
localStorage.setItem('userDatabase', JSON.stringify(userDatabase));

function login() {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    if (userDatabase[username] && userDatabase[username].password === password) {
        alert("Login successful!");
        localStorage.setItem('loggedInUser', username);
        document.getElementById('form-container').style.display = 'none';
        document.getElementById('main-app').style.display = 'block';
        updateMainAppUI(username);

        if (userDatabase[username].isAdmin) {
            showAdminOptions();
        }
    } else {
        alert("Invalid username or password!");
    }
}

function showAdminOptions() {
    const adminControls = document.createElement('div');
    adminControls.innerHTML = `
        <h3>Admin Controls</h3>
        <input type="text" id="ban-username" placeholder="Username to ban">
        <button onclick="banUser()">Ban User</button>
    `;
    document.getElementById('main-app').appendChild(adminControls);
}

function banUser() {
    const usernameToBan = document.getElementById('ban-username').value;

    if (userDatabase[usernameToBan]) {
        delete userDatabase[usernameToBan];
        localStorage.setItem('userDatabase', JSON.stringify(userDatabase));
        alert(`${usernameToBan} has been banned.`);
    } else {
        alert("User not found.");
    }
}

function updateMainAppUI(username) {
    document.getElementById('welcome-message').innerText = `Welcome, ${username}!`;
    document.getElementById('logout-btn').style.display = 'block';
}