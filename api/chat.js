export default async function handler(req, res) {
    const { prompt } = req.body;

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
                    { role: 'system', content: 'Răspunde în limba română.' },
                    { role: 'user', content: prompt }
                ],
                temperature: 0.7,
                max_tokens: 300
            })
        });

        const data = await response.json();
        res.status(200).json({ reply: data.choices[0].message.content });
    } catch (error) {
        res.status(500).json({ reply: 'Eroare internă' });
    }
}
