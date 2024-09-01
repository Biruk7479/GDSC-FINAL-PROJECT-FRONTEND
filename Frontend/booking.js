
/// Function to display cars for Users

function displayUserBooking(bookings) {
    try {
        const carListContainer = document.getElementById("car-list");

        if (!carListContainer) {
            console.error("Element with id 'car-list' not found");
            return;
        }

        // Clear any existing content in the car list container
        carListContainer.innerHTML = "";

        bookings.forEach(car => {
            const carItem = document.createElement("div");
            carItem.className = "car-item";

            carItem.innerHTML = `
                <p>User: ${booking.user}</p>
                <p>Car ID: ${booking.car}</p>
                <p>Start Date: ${new Date(booking.startDate).toLocaleDateString()}</p>
                <p>End Date: ${new Date(booking.endDate).toLocaleDateString()}</p>
                <p>Total Cost: $${booking.totalCost}</p>
                <p>Status: ${booking.status}</p>
                <p>Pickup Location: ${booking.pickupLocation}</p>
                <p>Return Location: ${booking.returnLocation}</p>
                <p>Created At: ${new Date(booking.createdAt).toLocaleDateString()}</p>
                </div>
                <div class="dropdown">
                <button class="dropdown-button">...</button>
                <div class="dropdown-content">
                 <a onclick="handleDelete(event, '${car._id}')" class="delete-link" data-id="${car.id}">Delete</a>
                </div>
                </div>`;

            carListContainer.appendChild(carItem);
        });
    } catch (error) {
        console.error("Error fetching car data:", error);
    }
}


/// Function to display all bookings for Admins

async function displayAdminBooking(bookings) {
    try {
        const carListContainer = document.getElementById("car-list");

        if (!carListContainer) {
            console.error("Element with id 'car-list' not found");
            return;
        }

        // Clear any existing content in the car list container
        carListContainer.innerHTML = "";

        const userPromises = bookings.map(booking => getUser(booking.user));
        const carPromises = bookings.map(booking => getCar(booking.car));

        const users = await Promise.all(userPromises);
        const cars = await Promise.all(carPromises);

        bookings.forEach((booking, index) => {
            const carItem = document.createElement("div");
            carItem.className = "car-item";

            const userss = users[index];
            const carss = cars[index];
            const user = userss.user;
            const car = carss.car;

            carItem.innerHTML = `
                <p>User: ${user ? user.username : 'N/A'}</p>
                <p>Car: ${car ? car.make + ' ' + car.model : 'N/A'}</p>
                <p>Start Date: ${new Date(booking.startDate).toLocaleDateString()}</p>
                <p>End Date: ${new Date(booking.endDate).toLocaleDateString()}</p>
                <p>Total Cost: $${booking.totalCost}</p>
                <p>Status: ${booking.status}</p>
                <p>Pickup Location: ${booking.pickupLocation}</p>
                <p>Return Location: ${booking.returnLocation}</p>
                <p>Created At: ${new Date(booking.createdAt).toLocaleDateString()}</p>
                </div>
                <div class="dropdown">
                <button class="dropdown-button">...</button>
                <div class="dropdown-content">
                <a onclick="handleDelete(event, '${booking._id}')" class="delete-link" data-id="${booking._id}">Delete</a>
                </div>
                </div>`;

            carListContainer.appendChild(carItem);

            
            
        });
    } catch (error) {
        console.error("Error fetching car data:", error);
    }
}

async function getUser(id) {
    try {
        const token = localStorage.getItem('authToken');

        const response = await fetch(`https://gdsc-final-project-backend.onrender.com/api/user/${id}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error(`Failed to fetch user with ID ${id}`);
        }

        const user = await response.json();
        return user;
    } catch (error) {
        console.error("Error fetching user data:", error);
    }
}

async function getCar(id) {
    try {
        const response = await fetch(`https://gdsc-final-project-backend.onrender.com/api/car/${id}`);

        if (!response.ok) {
            throw new Error(`Failed to fetch car with ID ${id}`);
        }

        const car = await response.json();
        return car;
    } catch (error) {
        console.error("Error fetching car data:", error);
    }
}

async function handleDelete(event, id) {
    event.preventDefault();

    // Show a confirmation dialog
    const userConfirmed = confirm("Are you sure you want to delete this car?");

    if (userConfirmed) {
        // make an API call to delete the car
        const token = localStorage.getItem('authToken');
        const response = await fetch(`https://gdsc-final-project-backend.onrender.com/api/booking/${id}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json', // Specify content type as JSON
                'Authorization': `Bearer ${token}` // Include the token in the Authorization header
            }
        });

        if (!response.ok) {
            alert('Delete Failed.');
            return null;
        }

        console.log(`Booking with ID ${id} deleted.`);

        // refresh the page
        location.reload();
    }
}




/////// Function to handle Login and Signup on the header and the Post button for Admins

function userDash() {
    const dash = document.getElementById('header-actions');
    const createContainer = document.getElementById('admin-create');
    const role = localStorage.getItem('role');
    const email = localStorage.getItem('userEmail');
    console.log(email);
    dash.innerHTML = '';
    createContainer.innerHTML = '';
    if (email) {
        dash.innerHTML = `<a class="navbar-link" href="login.html"> Logged in as ${email} (${role}) </a>`

        if (role == 'Admin') {
            createContainer.innerHTML = ` <button class="LoginSignup"> <a href="post.html"> Post-Car </a></button> `
        } else {
            createContainer.innerHTML = '';
        }

    }
    else {
        dash.innerHTML = `<a href='login.html' class="navbar-link">Login/Signup</a>`;
    }

}

///////// Fucntion that displays cars based on the role/////////////////////////////

async function handler() {
    try {
        const role = localStorage.getItem('role');
        const token = localStorage.getItem('authToken');
        const userId = localStorage.getItem('userId');

        const response = await fetch('https://gdsc-final-project-backend.onrender.com/api/booking', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json', // Specify content type as JSON
                'Authorization': `Bearer ${token}` // Include the token in the Authorization header
            }
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();

        if (!Array.isArray(data.bookings)) {
            console.error("Expected an array but got:", data.bookings);
            return;
        }

        const bookings = data.bookings;
        if (role == 'Admin') {
            displayAdminBooking(bookings);
        } else if (role == 'User') {
            bookings.filter(book => {
                book.user = userId;
            })
            displayUserBooking(bookings);
        } else {
            window.location.href = 'login.html';
        }

    } catch (err) {
        console.error(err.message);
    }
}

handler();
userDash();