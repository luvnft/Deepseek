// api/chat.js
export default async (req, res) => {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).json({ message: `Metoda ${req.method} nepermisă` });
  }

  try {
    // Prompt de sistem pentru a limita ce poate chatbot-ul să răspundă
    const systemPrompt = `
      Acționezi ca asistent virtual profesional pentru salonul de înfrumusețare Stelmina.
      Servicii disponibile:
      1. Pensat (30 lei)
      2. Masaj Sculptural (250-300 lei)
      3. Îngrijire facială (300-600 lei)

      Instrucțiuni stricte:
      - Folosește doar informațiile de mai sus
      - Răspunsuri concise în română (maxim 3 propoziții)
      - Întreabă mereu de nume, dată, oră și serviciu specific
      - Nu inventa prețuri sau servicii
      - Folosește emoji-uri moderat (maxim 2 per răspuns)
      - Dacă nu știi răspunsul, spune că vei verifica și propune contactarea telefonului salonului
    `;

    // Faci un request la un model AI - exemplu: DeepSeek (sau alt provider)
    const apiResponse = await fetch('https://api.deepseek.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.DEEPSEEK_API_KEY}`, // ai nevoie de acest secret
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
    
    // CORS (dacă ai nevoie)
    res.setHeader('Access-Control-Allow-Origin', '*');
    
    // Curățăm răspunsul
    const cleanReply = data.choices[0].message.content
      .replace(/【.*?】/g, '') // Elimină eventuale semne
      .trim();

    // Returnăm JSON
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
