document.addEventListener('DOMContentLoaded', function() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    
    if (!currentUser) {
        window.location.href = 'login.html';
        return;
    }

    // Display user information
    document.getElementById('fullNameDisplay').textContent = currentUser.fullName;
    document.getElementById('emailDisplay').textContent = currentUser.email;
    document.getElementById('usernameDisplay').textContent = currentUser.username;

    // Update sidebar name
    document.getElementById('sidebarName').textContent = currentUser.fullName;

    // Initialize tooltips and popovers
    const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    tooltipTriggerList.map(function (tooltipTriggerEl) {
        return new bootstrap.Tooltip(tooltipTriggerEl);
    });

    // Add active class handling for sidebar
    const pills = document.querySelectorAll('.nav-link');
    pills.forEach(pill => {
        pill.addEventListener('click', function() {
            pills.forEach(p => p.classList.remove('active'));
            this.classList.add('active');
        });
    });

    // Load user settings
    loadUserSettings();
    
    // Load appointments
    loadUserAppointments();

    // Add settings event listeners
    document.getElementById('emailNotifications').addEventListener('change', updateUserSettings);
    document.getElementById('darkMode').addEventListener('change', updateUserSettings);

    // Load notifications
    loadNotifications();

    // Initialize new features
    loadJournalEntries();
    loadWellnessTips();
    updateMetricsChart();

    // Add mood selector functionality
    document.querySelectorAll('.btn-mood').forEach(btn => {
        btn.addEventListener('click', function() {
            document.querySelectorAll('.btn-mood').forEach(b => b.classList.remove('active'));
            this.classList.add('active');
        });
    });
});

function loadUserSettings() {
    const settings = JSON.parse(localStorage.getItem('userSettings')) || {
        emailNotifications: true,
        darkMode: false
    };

    document.getElementById('emailNotifications').checked = settings.emailNotifications;
    document.getElementById('darkMode').checked = settings.darkMode;
    
    // Apply dark mode if enabled
    if (settings.darkMode) {
        document.body.classList.add('dark-mode');
    }
}

function updateUserSettings() {
    const settings = {
        emailNotifications: document.getElementById('emailNotifications').checked,
        darkMode: document.getElementById('darkMode').checked
    };

    localStorage.setItem('userSettings', JSON.stringify(settings));
    
    // Apply dark mode changes immediately
    if (settings.darkMode) {
        document.body.classList.add('dark-mode');
    } else {
        document.body.classList.remove('dark-mode');
    }
}

function loadUserAppointments() {
    const appointments = JSON.parse(localStorage.getItem('appointments')) || [];
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    const appointmentsList = document.getElementById('appointmentsList');

    // Filter appointments for current user
    const userAppointments = appointments.filter(apt => apt.email === currentUser.email);

    if (userAppointments.length === 0) {
        appointmentsList.innerHTML = `
            <div class="text-center text-muted">
                <p>No appointments scheduled yet.</p>
            </div>
        `;
        return;
    }

    // Sort appointments by date
    userAppointments.sort((a, b) => new Date(a.date) - new Date(b.date));

    // Display appointments
    appointmentsList.innerHTML = userAppointments.map(apt => `
        <div class="appointment-card">
            <div class="appointment-header">
                <h5 class="mb-1">${apt.type}</h5>
                <span class="badge ${getStatusBadgeClass(apt.date)}">${getAppointmentStatus(apt.date)}</span>
            </div>
            <div class="appointment-details">
                <p class="mb-1"><i class="fas fa-calendar me-2"></i>${new Date(apt.date).toLocaleDateString()}</p>
                <p class="mb-1"><i class="fas fa-clock me-2"></i>${apt.time}</p>
                <p class="mb-0 text-muted small">Reference: #${apt.id.toString().slice(-6)}</p>
            </div>
        </div>
    `).join('');
}

function getAppointmentStatus(date) {
    const appointmentDate = new Date(date);
    const today = new Date();
    
    if (appointmentDate < today) return 'Completed';
    if (appointmentDate.toDateString() === today.toDateString()) return 'Today';
    return 'Upcoming';
}

function getStatusBadgeClass(date) {
    const status = getAppointmentStatus(date);
    switch (status) {
        case 'Completed': return 'bg-secondary';
        case 'Today': return 'bg-primary';
        default: return 'bg-success';
    }
}

function logout() {
    localStorage.removeItem('currentUser');
    window.location.href = '../index.html';
}

// Edit Profile Fields
function enableEdit(button) {
    const field = button.closest('.profile-field');
    const span = field.querySelector('span');
    const currentValue = span.textContent;
    
    span.innerHTML = `
        <input type="text" class="form-control edit-input" value="${currentValue}">
        <button class="btn btn-sm btn-save" onclick="saveEdit(this)">
            <i class="fas fa-check"></i>
        </button>
    `;
    button.style.display = 'none';
}

function saveEdit(button) {
    const field = button.closest('.profile-field');
    const input = field.querySelector('.edit-input');
    const editButton = field.querySelector('.btn-edit');
    const span = field.querySelector('span');
    
    span.textContent = input.value;
    editButton.style.display = 'inline-block';
    
    // Update user data in localStorage
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    const fieldId = span.id.replace('Display', '');
    currentUser[fieldId] = input.value;
    localStorage.setItem('currentUser', JSON.stringify(currentUser));
}

// Password Change
function showPasswordChangeModal() {
    const modal = new bootstrap.Modal(document.getElementById('passwordChangeModal'));
    modal.show();
}

function changePassword() {
    const currentPassword = document.getElementById('currentPassword').value;
    const newPassword = document.getElementById('newPassword').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    
    if (newPassword !== confirmPassword) {
        alert('New passwords do not match!');
        return;
    }
    
    // Here you would typically validate against the current password
    // and make an API call to update the password
    
    const modal = bootstrap.Modal.getInstance(document.getElementById('passwordChangeModal'));
    modal.hide();
    alert('Password changed successfully!');
}

// Notifications
function loadNotifications() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    const appointments = JSON.parse(localStorage.getItem('appointments')) || [];
    const userAppointments = appointments.filter(apt => apt.email === currentUser.email);
    const notificationsList = document.getElementById('notificationsList');
    
    const upcomingAppointments = userAppointments
        .filter(apt => new Date(apt.date) > new Date())
        .sort((a, b) => new Date(a.date) - new Date(b.date))
        .slice(0, 3);
    
    if (upcomingAppointments.length === 0) {
        notificationsList.innerHTML = '<p class="text-muted">No upcoming appointments</p>';
        return;
    }
    
    notificationsList.innerHTML = upcomingAppointments.map(apt => `
        <div class="notification-item">
            <i class="fas fa-calendar-alt text-primary"></i>
            <div class="notification-content">
                <p class="mb-1">Upcoming: ${apt.type}</p>
                <small class="text-muted">
                    ${new Date(apt.date).toLocaleDateString()} at ${apt.time}
                </small>
            </div>
        </div>
    `).join('');
}

// Health Metrics Functions
function saveMetrics() {
    const metrics = {
        date: new Date().toISOString(),
        stressLevel: document.getElementById('stressLevel').value,
        sleepQuality: document.getElementById('sleepQuality').value
    };

    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    const userMetrics = JSON.parse(localStorage.getItem(`metrics_${currentUser.email}`)) || [];
    userMetrics.push(metrics);
    localStorage.setItem(`metrics_${currentUser.email}`, JSON.stringify(userMetrics));
    updateMetricsChart();
}

function updateMetricsChart() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    const metrics = JSON.parse(localStorage.getItem(`metrics_${currentUser.email}`)) || [];
    // Implement chart visualization using your preferred charting library
}

// Journal Functions
function saveJournalEntry() {
    const entry = {
        date: new Date().toISOString(),
        text: document.getElementById('journalEntry').value,
        mood: document.querySelector('.btn-mood.active')?.dataset.mood || 'neutral'
    };

    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    const journal = JSON.parse(localStorage.getItem(`journal_${currentUser.email}`)) || [];
    journal.unshift(entry);
    localStorage.setItem(`journal_${currentUser.email}`, JSON.stringify(journal));
    loadJournalEntries();
    document.getElementById('journalEntry').value = '';
}

function loadJournalEntries() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    const journal = JSON.parse(localStorage.getItem(`journal_${currentUser.email}`)) || [];
    const container = document.getElementById('journalEntries');

    container.innerHTML = journal.map(entry => `
        <div class="journal-entry">
            <div class="entry-header">
                <span class="entry-date">${new Date(entry.date).toLocaleDateString()}</span>
                <span class="entry-mood">${getMoodEmoji(entry.mood)}</span>
            </div>
            <p class="entry-text">${entry.text}</p>
        </div>
    `).join('');
}

function loadWellnessTips() {
    const tips = [
        "Practice deep breathing exercises when feeling stressed",
        "Take regular breaks during work hours",
        "Stay hydrated throughout the day",
        "Try meditation for 5 minutes each morning",
        "Get at least 7 hours of sleep"
    ];

    const tipsContainer = document.getElementById('wellnessTips');
    tipsContainer.innerHTML = tips.map(tip => `
        <div class="tip-card">
            <i class="fas fa-lightbulb tip-icon"></i>
            <p>${tip}</p>
        </div>
    `).join('');
}
