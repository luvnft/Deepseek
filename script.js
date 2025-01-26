const response = await fetch('https://api.deepseek.com/v1/chat/completions', {
    method: 'POST',
    headers: {
        'Authorization': `Bearer ${process.env.API_KEY}`,
        'Content-Type': 'application/json',
    },
    body: JSON.stringify({
        model: 'deepseek-chat', // Specific modelul
        messages: [
            { role: 'system', content: 'You are a helpful assistant.' }, // Context sistem
            { role: 'user', content: prompt }, // Mesaj utilizator
        ],
        stream: false // Opțiune pentru streaming
    }),
});
