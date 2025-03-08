class ChatBot {
    constructor() {
        this.chatToggle = document.getElementById('chatToggle');
        this.chatContainer = document.querySelector('.chat-container');
        this.closeChat = document.getElementById('closeChat');
        this.messageInput = document.getElementById('messageInput');
        this.sendButton = document.getElementById('sendMessage');
        this.messagesContainer = document.getElementById('chatMessages');
        
        this.initializeEventListeners();
    }

    initializeEventListeners() {
        this.chatToggle.addEventListener('click', () => this.toggleChat());
        this.closeChat.addEventListener('click', () => this.toggleChat());
        this.sendButton.addEventListener('click', () => this.sendMessage());
        this.messageInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.sendMessage();
        });
    }

    toggleChat() {
        this.chatContainer.classList.toggle('active');
        if (this.chatContainer.classList.contains('active')) {
            this.messageInput.focus();
        }
    }

    sendMessage() {
        const message = this.messageInput.value.trim();
        if (!message) return;

        this.addMessage(message, 'user');
        this.messageInput.value = '';
        
        // Simulate bot response
        setTimeout(() => {
            this.botResponse(message);
        }, 1000);
    }

    addMessage(text, sender) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${sender}`;
        
        const content = document.createElement('div');
        content.className = 'message-content';
        content.textContent = text;

        if (sender === 'bot') {
            const icon = document.createElement('i');
            icon.className = 'fas fa-robot bot-icon';
            messageDiv.appendChild(icon);
        }

        messageDiv.appendChild(content);
        this.messagesContainer.appendChild(messageDiv);
        this.messagesContainer.scrollTop = this.messagesContainer.scrollHeight;
    }

    botResponse(userMessage) {
        // Simple response logic - can be expanded
        const responses = {
            'hello': 'Hi there! How can I assist you today?',
            'help': 'I can help you with booking appointments, finding resources, or answering questions about our services.',
            'appointment': 'Would you like to schedule an appointment? I can help you with that.',
            'default': "I'm here to help! Please let me know what you need assistance with."
        };

        const response = responses[userMessage.toLowerCase()] || responses.default;
        this.addMessage(response, 'bot');
    }
}

// Initialize chat bot when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new ChatBot();
});
