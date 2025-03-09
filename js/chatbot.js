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

        function sendMessage() {
            const message = input.value.trim();
            if (message) {
                addMessage(message, 'user');
                input.value = '';
                setTimeout(() => {
                    const response = getBotResponse(message);
                    addMessage(response, 'bot');
                }, 1000);
            }
        }

        function addMessage(text, sender) {
            const messageDiv = document.createElement('div');
            messageDiv.classList.add('message', `${sender}-message`);
            messageDiv.textContent = text;
            messagesContainer.appendChild(messageDiv);
            messagesContainer.scrollTop = messagesContainer.scrollHeight;
        }

        function getBotResponse(message) {
            const lowerMessage = message.toLowerCase();
            if (lowerMessage.includes('anxiety')) {
                return "I understand you're experiencing anxiety. Would you like to schedule a consultation with one of our mental health professionals?";
            } else if (lowerMessage.includes('depression')) {
                return "I'm here to help. We have various resources and professional support available for managing depression. Would you like to learn more?";
            } else if (lowerMessage.includes('appointment')) {
                return "I can help you schedule an appointment. Please visit our booking section or call us at +1-234-567-8900.";
            } else {
                return "How can I assist you with your mental health and wellness needs today?";
            }
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