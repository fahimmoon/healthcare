function showWelcomeModal() {
    const modal = document.getElementById('welcomeModal');
    if (modal) {
        // Reset the welcome flag for testing
        localStorage.removeItem('welcomeShown');
        
        // Show modal with slight delay
        setTimeout(() => {
            modal.style.display = 'block'; // Force display
            requestAnimationFrame(() => {
                modal.classList.add('show');
            });
        }, 1000);
    }
}

function closeWelcomeModal() {
    const modal = document.getElementById('welcomeModal');
    if (modal) {
        modal.classList.remove('show');
        setTimeout(() => {
            modal.style.display = 'none';
        }, 300);
        localStorage.setItem('welcomeShown', 'true');
    }
}

// Initialize immediately after DOM load
document.addEventListener('DOMContentLoaded', showWelcomeModal);
