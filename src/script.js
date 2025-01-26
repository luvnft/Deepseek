const chatbox = document.getElementById('chatbox');
const userInput = document.getElementById('userInput');
const sendButton = document.getElementById('sendButton');

// Adaugă mesaj în chat
function addMessage(content, isUser) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${isUser ? 'user' : 'bot'} p-3 rounded-lg max-w-[80%]`;
    messageDiv.textContent = content;
    chatbox.appendChild(messageDiv);
    chatbox.scrollTop = chatbox.scrollHeight;
}

// Trimite cerere la API
async function sendMessage() {
    const prompt = userInput.value.trim();
    if (!prompt) return;

    addMessage(prompt, true);
    userInput.value = '';
    
    try {
        const response = await fetch('/api/chat', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ prompt })
        });

        const data = await response.json();
        addMessage(data.reply, false);
    } catch (error) {
        addMessage('⚠️ Eroare de conexiune. Încearcă din nou.', false);
    }
}

// Evenimente
sendButton.addEventListener('click', sendMessage);
userInput.addEventListener('keypress', (e) => e.key === 'Enter' && sendMessage());
