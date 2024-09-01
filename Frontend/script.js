// Retrieve role from localStorage
const role = localStorage.getItem('role');

// Function to handle Login and Signup on the header and the Post button for Admins
function userDash() {
    const dash = document.getElementById('header-actions');
    const createContainer = document.getElementById('admin-create');
    const bookingContainer = document.getElementById('admin-booking');
    const email = localStorage.getItem('userEmail');

    dash.innerHTML = '';
    createContainer.innerHTML = '';

    if (email) {
        dash.innerHTML = `<a class="navbar-link" href="login.html"> Logged in as ${email} (${role}) </a>`;

        if (role === 'Admin') {
            bookingContainer.href = "booking.html";
            bookingContainer.innerHTML = 'Booking';
            createContainer.innerHTML = `<button class="LoginSignup"><a href="post.html"> Post-Car </a></button>`;
        } else {
            createContainer.innerHTML = '';
        }
    } else {
        dash.innerHTML = `<a href='login.html' class="navbar-link">Login/Signup</a>`;
    }
}

// Call userDash function to update the UI based on the user's login status
userDash();

// Get the button element with class 'join'
const button2 = document.querySelector('.join');

button2.addEventListener('click', function () {
    const role = localStorage.getItem('role');
    if (role === 'User' || role === 'Admin') {
        window.location.href = 'user.html';
    } else {
        window.location.href = 'login.html';
    }
});