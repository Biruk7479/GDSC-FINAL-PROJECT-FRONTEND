document.getElementById('add-car-form').addEventListener('submit', async (event) => {
    event.preventDefault();

    const formData = new FormData(event.target);
    const carData = {
        make: formData.get('make'),
        model: formData.get('model'),
        category: formData.get('category'),
        price_for_3_days: Number(formData.get('price_for_3_days')),
        availability: formData.get('availability') === 'true',
        location: formData.get('location'),
        imageUrl: formData.get('imageUrl'),
        seats: Number(formData.get('seats')),
        transmission: formData.get('transmission')
    };
   

    const token = localStorage.getItem('authToken'); // Retrieve the token from localStorage
    if (!token) {
        console.error('No token found in localStorage');}
    try {
        const response = await fetch('https://gdsc-final-project-backend.onrender.com/api/car', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`, // Add the token to the request header
            },
            body: JSON.stringify(carData),
            // body: JSON.stringify(mockData),
        });
        
        const result = await response.json();

        if (response.ok) {
            document.getElementById('response-message').textContent = 'Car added successfully!';
            document.getElementById('response-message').style.color = 'green';
        } else {
            document.getElementById('response-message').textContent = `Error: ${result.error || 'Failed to add car.'}`;
            document.getElementById('response-message').style.color = 'red';
        }
    } catch (error) {
        document.getElementById('response-message').textContent = `Error: ${error.message}`;
        document.getElementById('response-message').style.color = 'red';
    }
});


/////// Login and Signup on the header

function userDash() {
    const dash = document.getElementById('header-actions');
    const bookingContainer = document.getElementById('admin-booking');
    const role = localStorage.getItem('role');
    const email = localStorage.getItem('userEmail');
    dash.innerHTML = '';
    if (email) {
        if(role == 'Admin') {
        bookingContainer.href = "booking.html";
            bookingContainer.innerHTML = 'Booking';
        }
        dash.innerHTML = `<a class="navbar-link"> Logged in as ${email} (${role}) </a>`
    } else {
        dash.innerHTML = `<a href='login.html' class="navbar-link">Login/Signup</a>`;
    }
}

userDash();