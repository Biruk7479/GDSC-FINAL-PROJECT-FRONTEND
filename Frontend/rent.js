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
        const newCar = await response.json();
        const car = newCar.car;

        document.getElementById('car-model').value = car.model;
        document.getElementById('car-category').value = car.category;
        document.getElementById('car-price').value = car.price_for_3_days;
    } else {
        alert('Car ID not found!');
    }
}

// Call the populateForm function when the page loads
window.onload = populateForm;

/////// Total cost calculator function

function calculateTotalCost(rentalDays) {
    const carPriceElement = document.getElementById('car-price');
    const price = Number(carPriceElement.value) / 3;

    // Check for valid input values
    if (isNaN(rentalDays) || isNaN(price) || rentalDays <= 0) {
        console.error('Invalid input detected.');
        document.getElementById('total-cost').value = ''; // Clear the value
        return; // Exit the function early
    }

    const totalCost = rentalDays * price;

    document.getElementById('total-cost').value = totalCost.toFixed(2); // Set value with reduced decimal places
}


///// Start Date and End date event listeners and validation

document.getElementById('start-date').addEventListener('change', updateRentalDays);
document.getElementById('end-date').addEventListener('change', updateRentalDays);

function updateRentalDays() {
    const startDateInput = document.getElementById('start-date');
    const endDateInput = document.getElementById('end-date');
    const rentalDaysInput = document.getElementById('rental-days');

    const startDate = new Date(startDateInput.value);
    const endDate = new Date(endDateInput.value);

    // Ensure both dates are valid
    if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
        rentalDaysInput.value = '';
        return;
    }

    // Validate that end date is after start date
    if (endDate <= startDate) {
        rentalDaysInput.value = '';
        alert('End date must be after start date.');
        return;
    }

    // Calculate the difference in days
    const timeDifference = endDate - startDate;
    const rentalDays = Math.ceil(timeDifference / (1000 * 60 * 60 * 24)); // Convert milliseconds to days

    // Set the rental days value
    rentalDaysInput.value = rentalDays;
    calculateTotalCost(rentalDays);
}


////////////////// Submit Form Handling

document.getElementById("rent-form").addEventListener('submit', async (e) => {
    e.preventDefault();

    const formData = {
        "user": localStorage.getItem('userId'),
        "car": carId,
        "pickupLocation": document.getElementById('pickup-location').value,
        "returnLocation": document.getElementById('return-location').value,
        "startDate": document.getElementById('start-date').value,
        "endDate": document.getElementById('end-date').value,
        "rentalDays": document.getElementById('rental-days').value,
        "totalCost": document.getElementById('total-cost').value
    };

    sendData(formData);
})

/////// Function to send form data with authorizatoin token in header

async function sendData(formData) {
    try {
        // Retrieve the token from localStorage (or wherever it's stored)
        const token = localStorage.getItem('authToken');

        const response = await fetch('https://gdsc-final-project-backend.onrender.com/api/booking', {
            method: 'POST', // Use 'POST' as a string
            headers: {
                'Content-Type': 'application/json', // Specify content type as JSON
                'Authorization': `Bearer ${token}` // Include the token in the Authorization header
            },
            body: JSON.stringify(formData) // Convert formData to JSON
        });

        // Check for response status
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const data = await response.json();
        console.log('Success:', data);
        window.location.href = 'user.html';
    } catch (error) {
        console.error('Error:', error);
    }
}



/////// Login and Signup on the header

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

        if(role == 'Admin') {
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