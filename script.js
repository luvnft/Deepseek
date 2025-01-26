const chatbox = document.getElementById('chatbox');
const userInput = document.getElementById('userInput');
const sendButton = document.getElementById('sendButton');

// Adaugă mesaj în chatbox
function addMessage(message, isUser) {
    const messageElement = document.createElement('div');
    messageElement.classList.add('message', isUser ? 'user' : 'bot');
    messageElement.textContent = message;
    chatbox.appendChild(messageElement);
    chatbox.scrollTop = chatbox.scrollHeight; // Scroll automat
}

// Trimite mesaj la API
async function sendMessage() {
    const userMessage = userInput.value.trim();
    if (!userMessage) return;

    addMessage(userMessage, true); // Adaugă mesajul utilizatorului
    userInput.value = ''; // Golește input-ul

    try {
        const response = await fetch('https://api.deepseek.com/v1/chat', {
            method: 'POST',
            headers: {
                'Authorization': 'Bearer sk-6979331d22bf4934a5c5dcff4903d843',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                prompt: userMessage,
                max_tokens: 150
            })
        });

        const data = await response.json();
        const botMessage = data.choices[0].text.trim();
        addMessage(botMessage, false); // Adaugă răspunsul chatbot-ului
    } catch (error) {
        addMessage('A apărut o eroare. Te rog încearcă din nou.', false);
    }
}

// Evenimente
sendButton.addEventListener('click', sendMessage);
userInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') sendMessage();
});
