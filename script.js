try {
    const response = await fetch('https://api.deepseek.com/v1/chat/completions', {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${process.env.API_KEY}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            model: 'deepseek-chat',
            messages: [
                { role: 'system', content: 'You are a helpful assistant.' },
                { role: 'user', content: prompt },
            ],
            stream: false,
        }),
    });

    const data = await response.json();

    console.log('DeepSeek API Response:', JSON.stringify(data, null, 2)); // Log răspunsul complet

    if (!response.ok) {
        return res.status(response.status).json({ error: data.error || 'Something went wrong' });
    }

    res.status(200).json(data);
} catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Internal server error' });
}
