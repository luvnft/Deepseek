const chatbox = document.getElementById('chatbox');
const userInput = document.getElementById('userInput');
const sendButton = document.getElementById('sendButton');

function addMessage(message, isUser) {
    const messageElement = document.createElement('div');
    messageElement.classList.add('message', isUser ? 'user' : 'bot');
    messageElement.textContent = message;
    chatbox.appendChild(messageElement);
    chatbox.scrollTop = chatbox.scrollHeight;
}

async function sendMessage() {
    const userMessage = userInput.value.trim();
    if (!userMessage) return;

    addMessage(userMessage, true);
    userInput.value = '';

    try {
        const response = await fetch('/api/chat', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ prompt: userMessage }),
        });

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const data = await response.json();
        const botMessage = data.choices[0].text.trim();
        addMessage(botMessage, false);
    } catch (error) {
        addMessage('A apărut o eroare. Te rog încearcă din nou.', false);
    }
}

sendButton.addEventListener('click', sendMessage);
userInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') sendMessage();
});
