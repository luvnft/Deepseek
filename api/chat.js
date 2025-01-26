export default async (req, res) => {
    try {
        // Logica DeepSeek + Firebase
        const response = await fetch('https://api.deepseek.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${process.env.DEEPSEEK_API_KEY}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                model: 'deepseek-chat',
                messages: [{
                    role: "user",
                    content: `Extrage intenția din: "${req.body.prompt}". 
                            Răspuns JSON: {intent: "programare|recomandare"}`
                }]
            })
        });
        
        const data = await response.json();
        res.status(200).json({ reply: data.choices[0].message.content });
    } catch(error) {
        res.status(500).json({ reply: "Eroare server" });
    }
};
