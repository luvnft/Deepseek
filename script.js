async function sendMessageToDeepSeek(prompt) {
    try {
        const response = await fetch('https://api.deepseek.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${process.env.API_KEY}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                model: 'deepseek-chat', // Specifică modelul
                messages: [
                    { role: 'system', content: 'You are a helpful assistant.' }, // Context sistem
                    { role: 'user', content: prompt }, // Mesaj utilizator
                ],
                max_tokens: 150, // Limitează numărul de token-uri
                temperature: 0.7, // Controlul creativității
                stream: false // Dezactivează streaming
            }),
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        return data.choices[0].message.content; // Returnează răspunsul chatbot-ului
    } catch (error) {
        console.error('Eroare la trimiterea mesajului:', error);
        return 'A apărut o eroare. Te rog încearcă din nou.'; // Mesaj de eroare pentru utilizator
    }
}
