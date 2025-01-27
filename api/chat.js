// chat.js
export default async (req, res) => {
  // Permitem numai metoda POST
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).json({ message: `Method ${req.method} Not Allowed` });
  }

  try {
    // Apelăm API-ul DeepSeek
    const apiResponse = await fetch('https://api.deepseek.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.DEEPSEEK_API_KEY}`, // Cheia ta reală
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'deepseek-chat',
        messages: [
          { role: 'system', content: 'Răspunde în română.' },
          { role: 'user', content: req.body.prompt }
        ],
        temperature: 0.7
      })
    });

    const data = await apiResponse.json();

    // Permitem CORS (dacă accesezi de pe alt domeniu)
    res.setHeader('Access-Control-Allow-Origin', '*');

    // Trimitem mesajul primit de la DeepSeek
    res.status(200).json({ reply: data.choices[0].message.content });
  } catch (error) {
    console.error('Eroare la chat.js:', error);
    res.status(500).json({ reply: 'Eroare internă la apelarea DeepSeek' });
  }
};
