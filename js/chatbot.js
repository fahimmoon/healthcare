function initializeChatbot() {
    console.log('Initializing chatbot...');
    
    // Wait for DOM to be fully updated
    setTimeout(() => {
        const chatbot = document.querySelector('.chatbot');
        const toggleButton = document.querySelector('.chatbot-toggle');
        const minimizeButton = document.querySelector('.chatbot-minimize');
        const input = document.querySelector('.chatbot-input input');
        const sendButton = document.querySelector('.send-button');
        const messagesContainer = document.querySelector('.chatbot-messages');
        const typingIndicator = document.querySelector('.typing-indicator');

        if (!chatbot || !toggleButton) {
            console.error('Required chatbot elements not found:', {
                chatbot: !!chatbot,
                toggleButton: !!toggleButton,
                minimizeButton: !!minimizeButton,
                input: !!input,
                sendButton: !!sendButton,
                messagesContainer: !!messagesContainer
            });
            return;
        }

        // Toggle chatbot
        toggleButton.addEventListener('click', () => {
            chatbot.classList.toggle('active');
            const badge = document.querySelector('.notification-badge');
            if (badge) {
                badge.classList.add('d-none');
            }
        });

        // Minimize chatbot
        minimizeButton.addEventListener('click', (e) => {
            e.stopPropagation();
            chatbot.classList.remove('active');
        });

        function sendMessage(message = null) {
            const messageText = message || input.value.trim();
            if (messageText) {
                addMessage(messageText, 'user');
                input.value = '';
                showTypingIndicator();

                // Check if it's an emergency action
                if (handleEmergencyAction(messageText)) {
                    hideTypingIndicator();
                    return;
                }

                // Check if it's an emergency message
                if (isEmergencyMessage(messageText)) {
                    setTimeout(() => {
                        hideTypingIndicator();
                        const response = {
                            message: "This seems urgent. I'll connect you with immediate help:\n\n" +
                                    "🚨 24/7 Crisis Line: 1-800-HEALTH\n" +
                                    "🚑 Emergency Services: 911\n" +
                                    "💬 Crisis Text Line: Text 'HELP' to 741741",
                            suggestions: [
                                "📞 Call Crisis Line",
                                "🚑 Call Emergency Services",
                                "💬 Text Crisis Line",
                                "Connect to Crisis Team"
                            ]
                        };
                        addMessage(response.message, 'bot');
                        addSuggestions(response.suggestions);
                    }, 1000);
                    return;
                }

                // Handle normal messages
                setTimeout(() => {
                    const response = getBotResponse(messageText);
                    hideTypingIndicator();
                    addMessage(response.message, 'bot');
                    if (response.suggestions) {
                        addSuggestions(response.suggestions);
                    }
                }, 1500);
            }
        }

        function showTypingIndicator() {
            typingIndicator.classList.remove('d-none');
        }

        function hideTypingIndicator() {
            typingIndicator.classList.add('d-none');
        }

        function addSuggestions(suggestions) {
            const suggestionsDiv = document.createElement('div');
            suggestionsDiv.classList.add('suggestions');
            suggestions.forEach(suggestion => {
                const btn = document.createElement('button');
                btn.classList.add('suggestion-btn');
                btn.textContent = suggestion;
                btn.addEventListener('click', () => {
                    // Handle emergency actions directly
                    if (suggestion.includes('Call Crisis Line')) {
                        window.location.href = 'tel:1-800-HEALTH';
                    } else if (suggestion.includes('Emergency Services')) {
                        window.location.href = 'tel:911';
                    } else if (suggestion.includes('Text Crisis')) {
                        window.location.href = 'sms:741741?body=HELP';
                    } else {
                        sendMessage(suggestion);
                    }
                });
                suggestionsDiv.appendChild(btn);
            });
            messagesContainer.appendChild(suggestionsDiv);
            messagesContainer.scrollTop = messagesContainer.scrollHeight;
        }

        function addMessage(text, sender) {
            const messageDiv = document.createElement('div');
            messageDiv.classList.add('message', `${sender}-message`);
            messageDiv.textContent = text;
            messagesContainer.appendChild(messageDiv);
            messagesContainer.scrollTop = messagesContainer.scrollHeight;
        }

        let appointmentContext = {
            inProgress: false,
            step: 0,
            type: null,
            date: null,
            time: null,
            email: null
        };

        function resetAppointmentContext() {
            appointmentContext = {
                inProgress: false,
                step: 0,
                type: null,
                date: null,
                time: null,
                email: null
            };
        }

        function getBotResponse(message) {
            const lowerMessage = message.toLowerCase();

            // Handle ongoing appointment booking
            if (appointmentContext.inProgress) {
                return handleAppointmentFlow(message);
            }

            // Emergency handling - Highest priority
            if (lowerMessage.includes('emergency') || 
                lowerMessage.includes('crisis') || 
                lowerMessage.includes('suicide') ||
                lowerMessage.includes('urgent help')) {
                return {
                    message: "This seems urgent. Please take immediate action:\n\n" +
                            "🚨 24/7 Crisis Line: 1-800-HEALTH (tap to call)\n" +
                            "🚑 Emergency Services: 911\n" +
                            "💬 Crisis Text Line: Text 'HELP' to 741741\n\n" +
                            "Do you need me to connect you directly to our crisis team?",
                    suggestions: [
                        "📞 Call Crisis Line Now",
                        "🚑 Call Emergency Services",
                        "💬 Text Crisis Line",
                        "Connect to Crisis Team"
                    ],
                    urgent: true
                };
            }

            // Anxiety handling
            if (lowerMessage.includes('anxious') || lowerMessage.includes('anxiety')) {
                return {
                    message: "I understand you're feeling anxious. Let me help:\n\n" +
                            "1. Would you like to try a quick breathing exercise?\n" +
                            "2. Would you like to speak with a therapist?\n" +
                            "3. Would you like to learn about anxiety management techniques?\n" +
                            "4. Do you need immediate support?",
                    suggestions: [
                        "Start Breathing Exercise",
                        "Talk to Therapist Now",
                        "Anxiety Management Tips",
                        "Need Urgent Help"
                    ]
                };
            }

            // Depression handling
            if (lowerMessage.includes('depress')) {
                return {
                    message: "I'm here to support you through this. Let's explore some options:\n\n" +
                            "1. Would you like to speak with a mental health professional?\n" +
                            "2. Would you like to learn about depression management?\n" +
                            "3. Would you like information about our support groups?\n" +
                            "4. Do you need immediate assistance?",
                    suggestions: [
                        "Speak to Professional",
                        "Depression Management",
                        "Join Support Group",
                        "Urgent Support"
                    ]
                };
            }

            // Appointment booking - Make it clearer
            if (lowerMessage.includes('appointment') || lowerMessage.includes('book') || 
                lowerMessage.includes('schedule') || lowerMessage.includes('therapist')) {
                appointmentContext.inProgress = true;
                return {
                    message: "I'll help you schedule an appointment. What type of session would you prefer?",
                    suggestions: [
                        "💬 Initial Consultation (30 min)",
                        "🔄 Follow-up Session (45 min)",
                        "👥 Therapy Session (60 min)",
                        "🆘 Emergency Session (immediate)"
                    ]
                };
            }

            // Common greetings
            if (lowerMessage.match(/^(hi|hello|hey|greetings)/)) {
                return {
                    message: "Hello! I'm here to help you with your mental health needs. How are you feeling today?",
                    suggestions: ["I'm feeling anxious", "Feeling depressed", "Need urgent help", "Book appointment"]
                };
            }
            
            // Mental health conditions
            if (lowerMessage.includes('anxiety')) {
                return {
                    message: "I understand you're experiencing anxiety. How can I help you today?",
                    suggestions: ["Anxiety symptoms", "Coping techniques", "Talk to therapist", "Emergency support"]
                };
            }
            
            if (lowerMessage.includes('depression')) {
                if (lowerMessage.includes('symptoms')) {
                    return {
                        message: "Depression symptoms can include persistent sadness, loss of interest, changes in sleep patterns, and difficulty concentrating. Would you like to discuss your symptoms with a professional?",
                        suggestions: ["Talk to a therapist", "Learn about treatment options", "Get emergency support"]
                    };
                } else if (lowerMessage.includes('help') || lowerMessage.includes('cope')) {
                    return {
                        message: "Managing depression often requires a combination of professional help, lifestyle changes, and support. We can help you with:\n1. Professional counseling\n2. Lifestyle management\n3. Support groups\nWhat would you like to know more about?",
                        suggestions: ["Professional counseling", "Lifestyle management", "Support groups"]
                    };
                } else {
                    return {
                        message: "I hear you talking about depression. This is a serious condition, but remember you're not alone. Would you like to:\n1. Talk to a therapist\n2. Learn about treatment options\n3. Get emergency support",
                        suggestions: ["Talk to a therapist", "Learn about treatment options", "Get emergency support"]
                    };
                }
            }
            
            // Appointment related
            if (lowerMessage.includes('appointment') || lowerMessage.includes('schedule') || lowerMessage.includes('book')) {
                if (lowerMessage.includes('cancel') || lowerMessage.includes('reschedule')) {
                    return {
                        message: "I can help you modify your appointment. Please provide your booking reference number, or call us at +1-234-567-8900 for immediate assistance.",
                        suggestions: ["Provide booking reference", "Call scheduling team"]
                    };
                } else {
                    return {
                        message: "I can help you schedule an appointment. We have both in-person and virtual sessions available. Would you prefer to:\n1. Book online now\n2. Call our scheduling team\n3. Learn about our services first",
                        suggestions: ["Book online now", "Call scheduling team", "Learn about services"]
                    };
                }
            }
            
            // Emergency situations
            if (lowerMessage.includes('emergency') || lowerMessage.includes('crisis') || lowerMessage.includes('suicide')) {
                return {
                    message: "If you're experiencing a mental health emergency, please immediately:\n1. Call our 24/7 crisis line: 1-800-HEALTH\n2. Contact emergency services: 911\n3. Text 'HELP' to 741741\nYour life matters, and help is available.",
                    suggestions: ["Call crisis line", "Contact emergency services", "Text 'HELP' to 741741"]
                };
            }
            
            // Insurance and payment
            if (lowerMessage.includes('insurance') || lowerMessage.includes('cost') || lowerMessage.includes('price')) {
                return {
                    message: "We accept most major insurance plans and offer flexible payment options. Would you like to:\n1. Verify your insurance coverage\n2. Learn about our payment plans\n3. Discuss self-pay rates",
                    suggestions: ["Verify insurance coverage", "Learn about payment plans", "Discuss self-pay rates"]
                };
            }
            
            // Default responses with conversation continuity
            const defaultResponses = [
                "I'm here to support your mental health journey. Could you tell me more about what's on your mind?",
                "How can I assist you with your mental wellness today?",
                "I want to help you effectively. Could you provide more details about your concerns?",
                "Your mental health is important to us. What specific support are you looking for?"
            ];
            
            return {
                message: defaultResponses[Math.floor(Math.random() * defaultResponses.length)],
                suggestions: ["Book appointment", "Emergency help", "Mental health resources", "Contact support"]
            };
        }

        function handleAppointmentFlow(message) {
            // Add error handling for edge cases
            try {
                if (message.toLowerCase() === "cancel booking") {
                    resetAppointmentContext();
                    return {
                        message: "Booking cancelled. How else can I help you?",
                        suggestions: ["Book another appointment", "Need help", "Contact support"]
                    };
                }

                switch(appointmentContext.step) {
                    case 0: // Type selection
                        appointmentContext.type = message;
                        appointmentContext.step++;
                        return {
                            message: `Great choice! When would you like to schedule your ${message}?`,
                            suggestions: ["Today", "Tomorrow", "Next Week", "Show all available slots"]
                        };

                    case 1: // Date handling
                        const date = handleDateSelection(message);
                        if (!date) {
                            return {
                                message: "Please select a valid date:",
                                suggestions: ["Today", "Tomorrow", "Next Week", "Cancel booking"]
                            };
                        }

                        appointmentContext.date = date;
                        const availableSlots = window.appointmentManager.getAvailableSlots(date);
                        
                        if (!availableSlots.length) {
                            return {
                                message: "Sorry, no slots available for this date. Please choose another date:",
                                suggestions: ["Today", "Tomorrow", "Next Week", "Cancel booking"]
                            };
                        }

                        appointmentContext.step++;
                        return {
                            message: "Please select your preferred time:",
                            suggestions: availableSlots.map(slot => {
                                const hour = parseInt(slot.time);
                                return `${hour}:00 ${hour >= 12 ? 'PM' : 'AM'}`;
                            }).concat(["Cancel booking"])
                        };

                    case 2: // Time selection
                        appointmentContext.time = message;
                        appointmentContext.step++;
                        return {
                            message: "Please enter your email address to confirm the booking:",
                            suggestions: ["Cancel booking"]
                        };

                    case 3: // Email confirmation
                        if (!isValidEmail(message)) {
                            return {
                                message: "Please enter a valid email address:",
                                suggestions: ["Cancel booking"]
                            };
                        }

                        appointmentContext.email = message;
                        const booking = window.appointmentManager.bookAppointment(appointmentContext);
                        
                        if (booking.success) {
                            const confirmation = {
                                message: `Perfect! Your appointment is confirmed.\n\n` +
                                        `Reference: ${booking.reference}\n` +
                                        `Date: ${booking.details.date}\n` +
                                        `Type: ${booking.details.type}\n\n` +
                                        `A confirmation email has been sent to ${booking.details.email}.\n\n` +
                                        `Would you like to do anything else?`,
                                suggestions: ["Book another appointment", "Need help", "That's all, thanks"]
                            };
                            resetAppointmentContext();
                            return confirmation;
                        } else {
                            return {
                                message: booking.message,
                                suggestions: ["Choose another time", "Cancel booking"]
                            };
                        }
                }
            } catch (error) {
                console.error('Appointment flow error:', error);
                resetAppointmentContext();
                return {
                    message: "I apologize, but there was an error processing your request. Let's start over. How can I help you?",
                    suggestions: ["Book appointment", "Need help", "Emergency support"]
                };
            }
        }

        function handleDateSelection(message) {
            const today = new Date();
            if (message.toLowerCase() === "today") {
                return today.toISOString().split('T')[0];
            } else if (message.toLowerCase() === "tomorrow") {
                const tomorrow = new Date(today);
                tomorrow.setDate(today.getDate() + 1);
                return tomorrow.toISOString().split('T')[0];
            } else if (message.toLowerCase() === "next week") {
                const nextWeek = new Date(today);
                nextWeek.setDate(today.getDate() + 7);
                return nextWeek.toISOString().split('T')[0];
            }
            return null;
        }

        function isValidEmail(email) {
            return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
        }

        // Add emergency handling
        function handleEmergencyAction(action) {
            // Handle emergency actions
            const crisisTeam = {
                phone: '1-800-HEALTH',
                emergency: '911',
                textLine: '741741'
            };

            switch(action) {
                case 'Call Crisis Line Now':
                case '📞 Call Crisis Line':
                    window.location.href = `tel:${crisisTeam.phone}`;
                    break;
                case 'Call Emergency Services':
                case '🚑 Call Emergency Services':
                    window.location.href = `tel:${crisisTeam.emergency}`;
                    break;
                case 'Text Crisis Line':
                case '💬 Text Crisis Line':
                    window.location.href = `sms:${crisisTeam.textLine}?body=HELP`;
                    break;
                case 'Connect to Crisis Team':
                    connectToCrisisTeam();
                    break;
                default:
                    return false;
            }
            return true;
        }

        function connectToCrisisTeam() {
            addMessage("Connecting you to our crisis team...", 'bot');
            // Simulate connection to crisis team
            setTimeout(() => {
                const booking = window.appointmentManager.handleEmergencyBooking('emergency@healthconnect.com');
                if (booking.success) {
                    addMessage("Our crisis team has been notified and will contact you immediately. " +
                              "In the meantime, please call 1-800-HEALTH for immediate support.", 'bot');
                } else {
                    addMessage("Please call our crisis line immediately at 1-800-HEALTH", 'bot');
                }
            }, 1000);
        }

        // Add this function to check if a message is emergency-related
        function isEmergencyMessage(message) {
            const emergencyKeywords = ['emergency', 'crisis', 'suicide', 'urgent', 'help now', 'immediate'];
            return emergencyKeywords.some(keyword => message.toLowerCase().includes(keyword));
        }

        // Event listeners
        sendButton.addEventListener('click', sendMessage);
        input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                sendMessage();
            }
        });

        // Show initial notification
        setTimeout(() => {
            const badge = document.querySelector('.notification-badge');
            if (badge) {
                badge.classList.remove('d-none');
            }
        }, 2000);
    }, 100); // Small delay to ensure DOM is updated
}

// Remove DOMContentLoaded event listener since we're calling from components.js