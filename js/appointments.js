document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('appointmentForm');

    if (form) {
        // Set minimum date to today
        const dateInput = document.getElementById('appointmentDate');
        if (dateInput) {
            const today = new Date().toISOString().split('T')[0];
            dateInput.min = today;
        }

        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const formData = {
                id: Date.now(), // Unique ID for the appointment
                fullName: document.getElementById('fullName').value,
                email: document.getElementById('email').value,
                phone: document.getElementById('phone').value,
                date: document.getElementById('appointmentDate').value,
                time: document.getElementById('appointmentTime').value,
                type: document.getElementById('consultationType').value,
                notes: document.getElementById('notes').value,
                createdAt: new Date().toISOString()
            };

            // Save to localStorage
            saveAppointment(formData);

            // Show success message and clear form
            showSuccessMessage();
        });
    }
});

function saveAppointment(appointmentData) {
    try {
        // Get existing appointments or initialize empty array
        const existingAppointments = JSON.parse(localStorage.getItem('appointments')) || [];
        
        // Add new appointment
        existingAppointments.push(appointmentData);
        
        // Save back to localStorage
        localStorage.setItem('appointments', JSON.stringify(existingAppointments));
        
        return true;
    } catch (error) {
        console.error('Error saving appointment:', error);
        return false;
    }
}

function showSuccessMessage() {
    const form = document.getElementById('appointmentForm');
    
    form.innerHTML = `
        <div class="text-center">
            <i class="fas fa-check-circle text-success fa-3x mb-3"></i>
            <h3>Thank you!</h3>
            <p>Your appointment has been successfully booked. You will receive a confirmation email shortly.</p>
            <p class="text-muted small mb-4">Appointment reference: #${Date.now().toString().slice(-6)}</p>
            <div class="d-flex gap-3 justify-content-center">
                <button class="btn btn-gradient" onclick="window.location.reload()">
                    <i class="fas fa-calendar-plus me-2"></i>Book Another Appointment
                </button>
                <button class="btn btn-outline-primary" onclick="viewAppointments()">
                    <i class="fas fa-list me-2"></i>View My Appointments
                </button>
            </div>
        </div>
    `;
}

function viewAppointments() {
    try {
        const appointments = JSON.parse(localStorage.getItem('appointments')) || [];
        const form = document.getElementById('appointmentForm');
        
        if (appointments.length === 0) {
            form.innerHTML = `
                <div class="text-center">
                    <p>No appointments found.</p>
                    <button class="btn btn-gradient" onclick="window.location.reload()">
                        <i class="fas fa-calendar-plus me-2"></i>Book an Appointment
                    </button>
                </div>
            `;
            return;
        }

        const appointmentsList = appointments.map(apt => `
            <div class="appointment-item p-3 mb-3 border rounded bg-dark">
                <h5 class="mb-2">${apt.type}</h5>
                <p class="mb-1"><i class="fas fa-calendar me-2"></i>${new Date(apt.date).toLocaleDateString()}</p>
                <p class="mb-1"><i class="fas fa-clock me-2"></i>${apt.time}</p>
                <p class="mb-0 text-muted small">Ref: #${apt.id.toString().slice(-6)}</p>
            </div>
        `).join('');

        form.innerHTML = `
            <div class="my-appointments">
                <h4 class="mb-4">My Appointments</h4>
                ${appointmentsList}
                <button class="btn btn-gradient mt-3" onclick="window.location.reload()">
                    <i class="fas fa-calendar-plus me-2"></i>Book Another Appointment
                </button>
            </div>
        `;
    } catch (error) {
        console.error('Error viewing appointments:', error);
    }
}
