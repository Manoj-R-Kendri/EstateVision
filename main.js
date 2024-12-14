// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

function initializeApp() {
    // Set up event listeners
    const sendButton = document.getElementById('send-button');
    const userInput = document.getElementById('user-input');
    const chatForm = document.getElementById('chat-form');

    if (sendButton && userInput && chatForm) {
        // Button click handler
        sendButton.addEventListener('click', handleMessage);

        // Form submit handler
        chatForm.addEventListener('submit', function(e) {
            e.preventDefault();
            handleMessage();
        });

        // Enter key handler
        userInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                e.preventDefault();
                handleMessage();
            }
        });
    }

    // Initialize charts
    fetchAndUpdateCharts();
}

function handleMessage() {
    const userInput = document.getElementById('user-input');
    const message = userInput.value.trim();
    
    if (!message) return;
    
    // Show user message
    addChatMessage(message, 'user');
    userInput.value = '';

    // Send message to server
    fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: message })
    })
    .then(response => response.json())
    .then(data => {
        addChatMessage(data.response, 'assistant');
    })
    .catch(error => {
        console.error('Error:', error);
        addChatMessage('Sorry, there was an error processing your request.', 'assistant');
    });
}

function addChatMessage(message, sender) {
    const chatMessages = document.getElementById('chat-messages');
    const messageDiv = document.createElement('div');
    messageDiv.className = 'mb-4';
    
    const messageContent = document.createElement('div');
    messageContent.className = sender === 'user' ? 'user-message' : 'assistant-message';
    messageContent.textContent = message;
    
    messageDiv.appendChild(messageContent);
    chatMessages.appendChild(messageDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

function fetchAndUpdateCharts() {
    fetch('/api/market-data')
        .then(response => response.json())
        .then(data => {
            createPriceTrendsChart(data.price_trends);
            createPropertyTypesChart(data.property_types);
        })
        .catch(error => {
            console.error('Error fetching market data:', error);
        });
}

function createPriceTrendsChart(data) {
    const ctx = document.getElementById('priceTrendsChart');
    if (!ctx) return;

    new Chart(ctx, {
        type: 'line',
        data: {
            labels: data.map(item => item.month),
            datasets: [{
                label: 'Average Price',
                data: data.map(item => item.price),
                borderColor: '#3b82f6',
                backgroundColor: 'rgba(59, 130, 246, 0.1)',
                borderWidth: 2,
                fill: true
            }]
        },
        options: {
            responsive: true,
            scales: {
                yAxes: [{
                    ticks: {
                        callback: function(value) {
                            return '$' + value.toLocaleString();
                        }
                    }
                }]
            }
        }
    });
}

function createPropertyTypesChart(data) {
    const ctx = document.getElementById('propertyTypesChart');
    if (!ctx) return;

    new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: data.map(item => item.type),
            datasets: [{
                data: data.map(item => item.count),
                backgroundColor: [
                    '#3b82f6',
                    '#10b981',
                    '#f59e0b',
                    '#ef4444'
                ]
            }]
        },
        options: {
            responsive: true,
            legend: {
                position: 'bottom'
            }
        }
    });
}
