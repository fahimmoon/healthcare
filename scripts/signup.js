document.getElementById('signupForm').addEventListener('submit', function(e) {
    e.preventDefault();

    // Get form values
    const fullName = document.getElementById('fullName').value.trim();
    const email = document.getElementById('email').value.trim();
    const username = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value;

    // Basic validation
    if (password.length < 6) {
        alert('Password must be at least 6 characters long');
        return;
    }

    const userData = {
        fullName,
        email,
        username,
        password
    };

    try {
        const users = JSON.parse(localStorage.getItem('users') || '[]');
        
        // Check if username or email already exists
        if (users.some(user => user.username === username)) {
            alert('Username already exists!');
            return;
        }
        if (users.some(user => user.email === email)) {
            alert('Email already registered!');
            return;
        }

        users.push(userData);
        localStorage.setItem('users', JSON.stringify(users));
        
        alert('Signup successful! Please login.');
        window.location.href = '../pages/login.html';
    } catch (error) {
        console.error('Error during signup:', error);
        alert('An error occurred during signup. Please try again.');
    }
});
