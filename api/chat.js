export default async (req, res) => {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).json({ message: `Metoda ${req.method} nepermisă` });
  }

  try {
    const systemPrompt = `
      Acționezi ca asistent virtual profesional pentru salonul de înfrumusețare Stelmina.
      Servicii disponibile:
      1. Manichiură (150-300 lei)
      2. Coafură (200-500 lei)
      3. Machiaj (250-400 lei)
      4. Îngrijire facială (300-600 lei)

      Instrucțiuni stricte:
      - Folosește doar informațiile de mai sus
      - Răspunsuri concise în română (maxim 3 propoziții)
      - Întreabă mereu de nume, dată, oră și serviciu specific
      - Nu inventa prețuri sau servicii
      - Folosește emoji-uri moderat (maxim 2 per răspuns)
      - Dacă nu știi răspunsul, spune că vei verifica și propune contactarea telefonului salonului
    `;

    const apiResponse = await fetch('https://api.deepseek.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.DEEPSEEK_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'deepseek-chat',
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: req.body.prompt }
        ],
        temperature: 0.3,
        max_tokens: 150,
        top_p: 0.9,
        frequency_penalty: 0.5
      })
    });

    if (!apiResponse.ok) {
      throw new Error(`DeepSeek Error: ${apiResponse.statusText}`);
    }

    const data = await apiResponse.json();
    
    res.setHeader('Access-Control-Allow-Origin', '*');
    
    const cleanReply = data.choices[0].message.content
      .replace(/【.*?】/g, '') // Elimină markdown special
      .trim();

    res.status(200).json({ reply: cleanReply });

  } catch (error) {
    console.error('Eroare API:', {
      error: error.message,
      requestBody: req.body,
      timestamp: new Date().toISOString()
    });
    
    res.status(500).json({ 
      reply: '⏳ Momentan avem dificultăți tehnice. Vă rugăm să încercați mai târziu sau să ne contactați telefonic.'
    });
  }
};
