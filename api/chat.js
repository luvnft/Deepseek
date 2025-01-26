export default async (req, res) => {
    try {
        const apiResponse = await fetch('https://api.deepseek.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${process.env.DEEPSEEK_API_KEY}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                model: 'deepseek-chat',
                messages: [
                    { 
                        role: 'system', 
                        content: 'Răspunde în română. Folosește un stil prietenos și emoji-uri când este potrivit.'
                    },
                    { role: 'user', content: req.body.prompt }
                ],
                temperature: 0.7,
                max_tokens: 500
            })
        });

        const data = await apiResponse.json();
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.status(200).json({ reply: data.choices[0].message.content });
    } catch (error) {
        res.status(500).json({ reply: 'Eroare internă a serverului' });
    }
};
