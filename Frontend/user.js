
/// Function to display cars for Users

function displayUserCars(cars) {
    try {
        const carListContainer = document.getElementById("car-list");

        if (!carListContainer) {
            console.error("Element with id 'car-list' not found");
            return;
        }

        // Clear any existing content in the car list container
        carListContainer.innerHTML = "";

        cars.forEach(car => {
            const carItem = document.createElement("div");
            carItem.className = "car-item";

            carItem.innerHTML = `
                <img src="${car.imageUrl}" alt="${car.make} ${car.model}">
                <h3>${car.make} ${car.model}</h3>
                <p>Category: ${car.category}</p>
                <p>Price for 3 Days: $${car.price_for_3_days}</p>
                <p>Location: ${car.location}</p>
                <p>Seats: ${car.seats}</p>
                <p>Transmission: ${car.transmission}</p>
                </div>
                <div class="dropdown">
                <button class="dropdown-button">...</button>
                <div class="dropdown-content">
                    <a href="rent.html?carId=${car._id}" class="rent-link" data-id="${car.id}">Rent</a>
            </div>
            `;

            carListContainer.appendChild(carItem);
        });
    } catch (error) {
        console.error("Error fetching car data:", error);
    }
}

/// Function to display cars for guests

function displayGuestCars(cars) {
    try {
        const carListContainer = document.getElementById("car-list");

        if (!carListContainer) {
            console.error("Element with id 'car-list' not found");
            return;
        }

        // Clear any existing content in the car list container
        carListContainer.innerHTML = "";

        cars.forEach(car => {
            const carItem = document.createElement("div");
            carItem.className = "car-item";

            carItem.innerHTML = `
                <img src="${car.imageUrl}" alt="${car.make} ${car.model}">
                <h3>${car.make} ${car.model}</h3>
                <p>Category: ${car.category}</p>
                <p>Price for 3 Days: $${car.price_for_3_days}</p>
                <p>Location: ${car.location}</p>
                <p>Seats: ${car.seats}</p>
                <p>Transmission: ${car.transmission}</p>
                </div>
                <div class="dropdown">
                <button class="dropdown-button">...</button>
                <div class="dropdown-content">
                    <a href="#" onclick="alert('Please Log in to Rent cars.')" class="rent-link" data-id="${car.id}">Rent</a>
            </div>
            `;

            carListContainer.appendChild(carItem);
        });
    } catch (error) {
        console.error("Error fetching car data:", error);
    }
}

///// Function to display cars with additional CRUD operations for Admins

function displayAdminCars(cars) {

    try {
        const carListContainer = document.getElementById("car-list");

        if (!carListContainer) {
            console.error("Element with id 'car-list' not found");
            return;
        }

        // Clear any existing content in the car list container
        carListContainer.innerHTML = "";

        cars.forEach(car => {
            const carItem = document.createElement("div");
            carItem.className = "car-item";

            carItem.innerHTML = `
            <img src="${car.imageUrl}" alt="${car.make} ${car.model}">
            <h3>${car.make} ${car.model}</h3>
            <p>Category: ${car.category}</p>
            <p>Price for 3 Days: $${car.price_for_3_days}</p>
            <p>Location: ${car.location}</p>
            <p>Seats: ${car.seats}</p>
            <p>Transmission: ${car.transmission}</p>
            </div>
            <div class="dropdown">
                <button class="dropdown-button">...</button>
                <div class="dropdown-content">
                    <a href="rent.html?carId=${car._id}" class="rent-link" data-id="${car.id}">Rent</a>
                    <a href="update.html?carId=${car._id}" class="update-link" data-id="${car.id}">Update</a>
                    <a onclick="handleDelete(event, '${car._id}')" class="delete-link" data-id="${car.id}">Delete</a>
            </div>`;

            carListContainer.appendChild(carItem);
        });
    } catch (error) {
        console.error("Error fetching car data:", error);
    }

}

async function handleDelete(event, carId) {
    event.preventDefault();

    // Show a confirmation dialog
    const userConfirmed = confirm("Are you sure you want to delete this car?");

    if (userConfirmed) {
        // make an API call to delete the car
        const token = localStorage.getItem('authToken');
        const response = await fetch(`https://gdsc-final-project-backend.onrender.com/api/car/${carId}`, {
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

        console.log(`Car with ID ${carId} deleted.`);

        // refresh the page
        location.reload();
    }
}

/////// Function to handle Login and Signup on the header and the Post button for Admins

function userDash() {
    const dash = document.getElementById('header-actions');
    const createContainer = document.getElementById('admin-create');
    const bookingContainer = document.getElementById('admin-booking');
    const role = localStorage.getItem('role');
    const email = localStorage.getItem('userEmail');
    console.log(email);
    dash.innerHTML = '';
    createContainer.innerHTML = '';
    if (email) {
        dash.innerHTML = `<a class="navbar-link" href="login.html"> Logged in as ${email} (${role}) </a>`

        if (role == 'Admin') {
            bookingContainer.href = "booking.html";
            bookingContainer.innerHTML = 'Booking';
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
        const response = await fetch('https://gdsc-final-project-backend.onrender.com/api/car');

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();

        if (!Array.isArray(data.cars)) {
            console.error("Expected an array but got:", data.cars);
            return;
        }

        const cars = data.cars;
        if (role == 'Admin') {
            displayAdminCars(cars);
        } else if (role == 'User') {
            displayUserCars(cars);
        } else {
            displayGuestCars(cars);
        }

    } catch (err) {
        console.error(err.message);
    }
}

handler();
userDash();