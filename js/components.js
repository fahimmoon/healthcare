document.addEventListener('DOMContentLoaded', function() {
    // Determine if we're in the root or pages directory
    const isInPages = window.location.pathname.includes('/pages/');
    const basePath = isInPages ? '../components/' : './components/';

    const components = [
        { id: 'welcome-placeholder', path: basePath + 'welcome/welcome.html', priority: true },
        { id: 'navbar-placeholder', path: basePath + 'navbar/navbar.html' },
        { id: 'hero-placeholder', path: basePath + 'hero/hero.html' },
        { id: 'services-placeholder', path: basePath + 'services/services.html' },
        { id: 'team-placeholder', path: basePath + 'team/team.html' },
        { id: 'testimonials-placeholder', path: basePath + 'testimonials/testimonials.html' },
        { id: 'resources-placeholder', path: basePath + 'resources/resources.html' },
        { id: 'booking-placeholder', path: basePath + 'booking/booking.html' },
        { id: 'newsletter-placeholder', path: basePath + 'newsletter/newsletter.html' },
        { id: 'footer-placeholder', path: basePath + 'footer/footer.html' },
        { id: 'chatbot-placeholder', path: basePath + 'chatbot/chatbot.html' }
    ];

    let componentsLoaded = 0;
    const totalComponents = components.length;

    // Load priority components first
    components
        .filter(comp => comp.priority)
        .forEach(component => {
            loadComponent(component);
        });

    // Then load the rest
    components
        .filter(comp => !comp.priority)
        .forEach(component => {
            loadComponent(component);
        });

    function loadComponent(component) {
        fetch(component.path)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                return response.text();
            })
            .then(data => {
                const element = document.getElementById(component.id);
                if (element) {
                    element.innerHTML = data;
                    componentsLoaded++;
                    
                    if (component.id === 'navbar-placeholder') {
                        initializeNavbar();
                    }

                    // Initialize chatbot only after all components are loaded
                    if (componentsLoaded === totalComponents) {
                        console.log('All components loaded, initializing chatbot...');
                        if (typeof initializeChatbot === 'function') {
                            setTimeout(initializeChatbot, 100);
                        }
                    }
                }
            })
            .catch(error => console.error(`Error loading ${component.path}:`, error));
    }

    function initializeNavbar() {
        updateNavbarState();
        setupNavbarLinks();
    }

    function setupNavbarLinks() {
        const navLinks = document.querySelectorAll('.navbar a');
        navLinks.forEach(link => {
            if (isInPages) {
                if (!link.getAttribute('href').startsWith('http') && !link.getAttribute('href').startsWith('#')) {
                    link.href = '../' + link.getAttribute('href');
                }
            }
        });
    }

    function updateNavbarState() {
        const currentUser = JSON.parse(localStorage.getItem('currentUser'));
        const authRequired = document.querySelectorAll('.auth-required');
        const userOnly = document.querySelectorAll('.user-only');
        
        if (currentUser) {
            authRequired.forEach(el => el.style.display = 'none');
            userOnly.forEach(el => el.style.display = 'block');
        } else {
            authRequired.forEach(el => el.style.display = 'block');
            userOnly.forEach(el => el.style.display = 'none');
        }
    }

    components.forEach(loadComponent);

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

    // Listen for auth state changes
    window.addEventListener('storage', function(e) {
        if (e.key === 'currentUser') {
            updateNavbarState();
        }
    });
});

function logout() {
    localStorage.removeItem('currentUser');
    window.location.href = '../index.html';
}
