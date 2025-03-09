const questions = [
    {
        id: 1,
        text: "Over the last 2 weeks, how often have you felt little interest or pleasure in doing things?",
        options: [
            "Not at all",
            "Several days",
            "More than half the days",
            "Nearly every day"
        ]
    },
    {
        id: 2,
        text: "Over the last 2 weeks, how often have you felt down, depressed, or hopeless?",
        options: [
            "Not at all",
            "Several days",
            "More than half the days",
            "Nearly every day"
        ]
    },
    {
        id: 3,
        text: "How often do you feel nervous, anxious, or on edge?",
        options: [
            "Not at all",
            "Several days",
            "More than half the days",
            "Nearly every day"
        ]
    },
    // Add more questions as needed
];

let currentQuestion = 0;
let answers = [];

function startScreening() {
    const container = document.getElementById('questionContainer');
    container.innerHTML = '';
    showQuestion(0);
}

function showQuestion(index) {
    const question = questions[index];
    const container = document.getElementById('questionContainer');
    
    const questionDiv = document.createElement('div');
    questionDiv.className = 'question active';
    
    questionDiv.innerHTML = `
        <h3 class="mb-3">Question ${index + 1} of ${questions.length}</h3>
        <p class="question-text mb-4">${question.text}</p>
        <div class="options">
            ${question.options.map((option, i) => `
                <button class="option-btn" onclick="selectOption(${i})">
                    ${option}
                </button>
            `).join('')}
        </div>
        <div class="navigation-buttons">
            ${index > 0 ? `<button class="btn btn-outline-primary" onclick="showQuestion(${index - 1})">Previous</button>` : ''}
            ${index < questions.length - 1 ? 
                `<button class="btn btn-primary" onclick="nextQuestion()" id="nextBtn" disabled>Next</button>` :
                `<button class="btn btn-gradient" onclick="showResults()" id="finishBtn" disabled>Complete Screening</button>`
            }
        </div>
        <div class="progress mt-4">
            <div class="progress-bar bg-gradient" style="width: ${(index + 1) / questions.length * 100}%"></div>
        </div>
    `;
    
    container.innerHTML = '';
    container.appendChild(questionDiv);
}

function selectOption(optionIndex) {
    const buttons = document.querySelectorAll('.option-btn');
    buttons.forEach(btn => btn.classList.remove('selected'));
    buttons[optionIndex].classList.add('selected');
    
    answers[currentQuestion] = optionIndex;
    
    const nextBtn = document.getElementById('nextBtn');
    const finishBtn = document.getElementById('finishBtn');
    if (nextBtn) nextBtn.disabled = false;
    if (finishBtn) finishBtn.disabled = false;
}

function nextQuestion() {
    if (currentQuestion < questions.length - 1) {
        currentQuestion++;
        showQuestion(currentQuestion);
    }
}

function showResults() {
    const container = document.getElementById('questionContainer');
    const score = calculateScore();
    
    container.innerHTML = `
        <div class="results-screen text-center">
            <i class="fas fa-clipboard-check fa-3x mb-4 gradient-icon"></i>
            <h3>Screening Complete</h3>
            <p class="mb-4">Based on your responses, we recommend:</p>
            <div class="recommendation-card mb-4">
                ${getRecommendations(score)}
            </div>
            <div class="action-buttons">
                <a href="appointments.html" class="btn btn-gradient me-3">
                    Book Consultation
                </a>
                <button class="btn btn-outline-primary" onclick="startScreening()">
                    Retake Screening
                </button>
            </div>
        </div>
    `;
}

function calculateScore() {
    return answers.reduce((sum, answer) => sum + answer, 0);
}

function getRecommendations(score) {
    // Customize recommendations based on score
    if (score >= 8) {
        return `
            <div class="alert alert-warning">
                <i class="fas fa-exclamation-triangle me-2"></i>
                Consider scheduling a consultation with one of our mental health professionals for a more detailed evaluation.
            </div>
        `;
    } else if (score >= 4) {
        return `
            <div class="alert alert-info">
                <i class="fas fa-info-circle me-2"></i>
                We recommend exploring our self-help resources and considering a wellness check-up.
            </div>
        `;
    } else {
        return `
            <div class="alert alert-success">
                <i class="fas fa-check-circle me-2"></i>
                Your responses indicate you're managing well. Continue with your current self-care practices.
            </div>
        `;
    }
}
