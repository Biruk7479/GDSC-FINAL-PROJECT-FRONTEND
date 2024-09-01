let carId;
// Function to get query parameters from the URL
function getQueryParams() {
    const params = {};
    const queryString = window.location.search.slice(1);
    const pairs = queryString.split('&');
    pairs.forEach(pair => {
        const [key, value] = pair.split('=');
        params[decodeURIComponent(key)] = decodeURIComponent(value);
    });
    return params;
}

// Function to populate the form with car details
async function populateForm() {
    const params = getQueryParams();

    // If carId exists in the query parameters, fill the hidden input
    if (params.carId) {
        carId = params.carId;

        const response = await fetch(`https://gdsc-final-project-backend.onrender.com/api/car/${carId}`);
        const cars = await response.json();
        const car = cars.car;

        document.getElementById('car-make').value = car.make;
        document.getElementById('car-model').value = car.model;
        document.getElementById('car-category').value = car.category;
        document.getElementById('car-price').value = car.price_for_3_days;
        document.getElementById('car-availability').value = car.availability;
        document.getElementById('car-location').value = car.location;
        document.getElementById('car-image').value = car.imageUrl;
        document.getElementById('car-seats').value = car.seats;
        document.getElementById('car-transmission').value = car.transmission;

    } else {
        alert('Car ID not found!');
    }
}

// Call the populateForm function when the page loads
window.onload = populateForm;

/////////////////////////// Event Listener for submitting update form

document.getElementById('update-form').addEventListener('submit', async function (event) {
    event.preventDefault();

    // Create an object to hold the form data
    const formData = {
        "make": document.getElementById('car-make').value,
        "model": document.getElementById('car-model').value,
        "category": document.getElementById('car-category').value,
        "price_for_3_days": document.getElementById('car-price').value,
        "availability": document.getElementById('car-availability').value,
        "location": document.getElementById('car-location').value,
        "seats": document.getElementById('car-seats').value,
        "transmission": document.getElementById('car-transmission').value,
    };

    // You can now use this object to send data to the server
    console.log(formData);

    try {
        const token = localStorage.getItem('authToken');
        // Send the form data to the API
        const response = await fetch(`https://gdsc-final-project-backend.onrender.com/api/car/${carId}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`, // Add the token to the request header
            },
            body: JSON.stringify(formData)
        });

        // Check if the response is okay (status in the range 200-299)
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        // Parse the JSON response
        const data = await response.json();
        console.log('Success:', data); // Handle the success response
        alert("Update Successfull!");

    } catch (error) {
        console.error('Error:', error); // Handle any errors
    }
});


///////// Function to handle Login and Signup on the header and the Post button for Admins

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
        dash.innerHTML = `<a class="navbar-link"> Logged in as ${email} (${role}) </a>`

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


userDash();