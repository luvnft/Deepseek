export default async (req, res) => {
    try {
        // Conectare la DeepSeek
        const deepseekResponse = await fetch('https://api.deepseek.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${process.env.DEEPSEEK_API_KEY}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                model: 'deepseek-chat',
                messages: [{
                    role: 'user',
                    content: req.body.prompt
                }],
                temperature: 0.3
            })
        });

        const data = await deepseekResponse.json();
        res.status(200).json({ reply: data.choices[0].message.content });
        
    } catch (error) {
        res.status(500).json({ reply: 'Eroare procesare cerere' });
    }
};
