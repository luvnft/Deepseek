export default async (req, res) => {
    try {
        const response = await fetch('https://api.deepseek.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${process.env.DEEPSEEK_API_KEY}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                model: 'deepseek-chat',
                messages: [
                    { role: 'system', content: 'Răspunde în română. Esti asistentul virtual al salonului de infrumusetare Stelmina. Folosește emoji-uri și un stil prietenos. ' },
                    { role: 'user', content: req.body.prompt }
                ],
                temperature: 1.4,
                max_tokens: 500
            })
        });

        const data = await response.json();
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.status(200).json({ reply: data.choices[0].message.content });
    } catch (error) {
        res.status(500).json({ reply: 'Eroare internă a serverului' });
    }
};
