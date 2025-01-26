async function sendMessage() {
    const prompt = userInput.value.trim();
    addMessage(prompt, true);
    userInput.value = '';

    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/chat`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ prompt })
        });

        const data = await response.json();
        addMessage(data.reply, false);
    } catch (error) {
        addMessage('⚠️ Eroare de conexiune.', false);
    }
}
