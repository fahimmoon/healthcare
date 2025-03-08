document.addEventListener('DOMContentLoaded', function() {
    // Array of components to load
    const components = [
        { id: 'navbar-placeholder', path: './components/navbar/navbar.html' },
        { id: 'hero-placeholder', path: './components/hero/hero.html' },
        { id: 'services-placeholder', path: './components/services/services.html' },
        { id: 'testimonials-placeholder', path: './components/testimonials/testimonials.html' },
        { id: 'resources-placeholder', path: './components/resources/resources.html' },
        { id: 'booking-placeholder', path: './components/booking/booking.html' },
        { id: 'newsletter-placeholder', path: './components/newsletter/newsletter.html' },
        { id: 'footer-placeholder', path: './components/footer/footer.html' },
        { id: 'chat-placeholder', path: './components/chat/chat.html' }
    ];

    // Load all components
    components.forEach(component => {
        fetch(component.path)
            .then(response => response.text())
            .then(data => {
                document.getElementById(component.id).innerHTML = data;
                // Initialize chat bot if chat component is loaded
                if (component.id === 'chat-placeholder') {
                    new ChatBot();
                }
            })
            .catch(error => console.error(`Error loading ${component.path}:`, error));
    });

    // Sticky Navbar
    window.addEventListener('scroll', function() {
        const navbar = document.querySelector('.navbar');
        if (window.scrollY > 50) {
            navbar.classList.add('sticky');
        } else {
            navbar.classList.remove('sticky');
        }
    });

    // Close mobile menu on click
    document.addEventListener('click', function(e) {
        const navbar = document.querySelector('.navbar-collapse');
        if (navbar.classList.contains('show') && !e.target.closest('.navbar-collapse')) {
            document.querySelector('.navbar-toggler').click();
        }
    });
});
