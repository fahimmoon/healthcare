class AppointmentManager {
    constructor() {
        this.availableTimeSlots = this.generateTimeSlots();
    }

    generateTimeSlots() {
        const slots = [];
        const today = new Date();
        // Generate slots for next 7 days
        for (let i = 1; i < 8; i++) {
            const date = new Date(today);
            date.setDate(today.getDate() + i);
            if (date.getDay() !== 0) { // Exclude Sundays
                for (let hour = 9; hour < 17; hour++) { // 9 AM to 5 PM
                    slots.push({
                        date: date.toISOString().split('T')[0],
                        time: `${hour.toString().padStart(2, '0')}:00`,
                        available: true
                    });
                }
            }
        }
        return slots;
    }

    getAvailableSlots(date = null) {
        if (date) {
            return this.availableTimeSlots.filter(slot => 
                slot.date === date && slot.available
            );
        }
        return this.availableTimeSlots.filter(slot => slot.available);
    }

    formatAppointmentDate(date, time) {
        const formattedTime = time.includes('AM') || time.includes('PM') ? 
            time : 
            `${parseInt(time)}:00 ${parseInt(time) >= 12 ? 'PM' : 'AM'}`;
            
        return `${new Date(date).toLocaleDateString('en-US', { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
        })} at ${formattedTime}`;
    }

    bookAppointment(appointment) {
        const { date, time, type, email = null } = appointment;
        
        try {
            // Find and update the slot
            const slot = this.availableTimeSlots.find(
                slot => slot.date === date && slot.time === time && slot.available
            );
            
            if (!slot) {
                return {
                    success: false,
                    message: "Sorry, this time slot is no longer available. Please choose another time."
                };
            }

            // Book the slot
            slot.available = false;
            slot.bookedBy = email;
            slot.appointmentType = type;

            // Generate booking reference
            const bookingRef = this.generateBookingReference();

            // Store booking details
            this.saveBooking({
                reference: bookingRef,
                date,
                time,
                type,
                email,
                createdAt: new Date().toISOString()
            });

            // Send confirmation email (mock)
            this.sendConfirmationEmail(appointment.email, {
                reference: bookingRef,
                date: this.formatAppointmentDate(date, time),
                type: type
            });

            return {
                success: true,
                reference: bookingRef,
                message: "Appointment booked successfully!",
                details: {
                    date: this.formatAppointmentDate(date, time),
                    type,
                    reference: bookingRef,
                    email: email
                }
            };
        } catch (error) {
            console.error('Booking error:', error);
            return {
                success: false,
                message: "There was an error booking your appointment. Please try again."
            };
        }
    }

    generateBookingReference() {
        return 'HC-' + Math.random().toString(36).substr(2, 9).toUpperCase();
    }

    saveBooking(booking) {
        // Save to localStorage for demo purposes
        const bookings = JSON.parse(localStorage.getItem('bookings') || '[]');
        bookings.push(booking);
        localStorage.setItem('bookings', JSON.stringify(bookings));
    }

    getNextAvailableSlot(type) {
        const slot = this.availableTimeSlots.find(slot => slot.available);
        if (slot) {
            return {
                date: slot.date,
                time: slot.time,
                formatted: this.formatAppointmentDate(slot.date, slot.time)
            };
        }
        return null;
    }

    validateDateTime(date, time) {
        const slot = this.availableTimeSlots.find(
            slot => slot.date === date && slot.time === time && slot.available
        );
        return !!slot;
    }

    sendConfirmationEmail(email, details) {
        console.log('Sending confirmation email to:', email, details);
        // In real implementation, integrate with email service
    }

    handleEmergencyBooking(email) {
        try {
            const now = new Date();
            const bookingRef = this.generateBookingReference();
            
            // Store emergency booking
            this.saveBooking({
                reference: bookingRef,
                date: now.toISOString(),
                time: 'IMMEDIATE',
                type: 'Emergency Session',
                email,
                createdAt: now.toISOString(),
                emergency: true
            });

            // Notify crisis team (mock)
            this.notifyCrisisTeam(email, bookingRef);

            return {
                success: true,
                reference: bookingRef,
                message: "Emergency session initiated. Our crisis team will contact you immediately.",
                emergency: true
            };
        } catch (error) {
            console.error('Emergency booking error:', error);
            return {
                success: false,
                message: "Error processing emergency request. Please call our crisis line: 1-800-HEALTH"
            };
        }
    }

    notifyCrisisTeam(email, reference) {
        console.log('🚨 EMERGENCY: Notifying crisis team for', email, reference);
        // Implement actual crisis team notification
    }
}

window.appointmentManager = new AppointmentManager();
