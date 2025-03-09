document.addEventListener('DOMContentLoaded', function() {
    // Check if user is already logged in
    const currentUser = localStorage.getItem('currentUser');
    if (currentUser) {
        window.location.href = '../index.html';
        return;
    }

    document.getElementById('loginForm').addEventListener('submit', function(e) {
        e.preventDefault();

        const username = document.getElementById('username').value.trim();
        const password = document.getElementById('password').value;

        try {
            const users = JSON.parse(localStorage.getItem('users') || '[]');
            const user = users.find(u => u.username === username && u.password === password);

            if (user) {
                // Store user data in session
                localStorage.setItem('currentUser', JSON.stringify(user));
                // Dispatch storage event for navbar update
                window.dispatchEvent(new Event('storage'));
                alert('Login successful!');
                setTimeout(() => {
                    window.location.href = '../index.html';
                }, 500);
            } else {
                alert('Invalid username or password. Please try again.');
            }
        } catch (error) {
            console.error('Error during login:', error);
            alert('An error occurred during login. Please try again.');
        }
    });
});
