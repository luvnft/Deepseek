// pages/api/chat.js (exemplu Next.js)
export default async (req, res) => {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).json({ message: `Metoda ${req.method} nepermisă` });
  }

  try {
    // 1) Preluăm toată conversația (array de mesaje)
    const { conversation } = req.body;
    if(!conversation || !Array.isArray(conversation)) {
      throw new Error('Lipsește array-ul conversation');
    }

    // 2) Prompt de sistem: reguli
    const systemPrompt = `
      Acționezi ca asistent virtual profesional pentru salonul Stelmina.
      Servicii disponibile:
      1. Pensat (30 lei)
      2. Masaj Sculptural (250-300 lei)
      3. Îngrijire facială (300-600 lei)

      Instrucțiuni stricte:
      - Răspunsuri concise în română (max. 3 propoziții)
      - Cere nume, dată, oră, serviciu doar când utilizatorul vrea o programare
      - Nu inventa prețuri/servicii
      - Folosește moderat emoji (max 2)
      - Dacă nu știi, spune că vei verifica
    `;

    // 3) Construim array-ul complet de mesaje pentru model
    //    Adăugăm un "system" la început, apoi toată conversația user + assistant
    const messages = [
      { role: "system", content: systemPrompt },
      ...conversation // user & assistant messages
    ];

    // 4) Request la un model AI (ex. DeepSeek, OpenAI etc.)
    const apiResponse = await fetch('https://api.deepseek.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.DEEPSEEK_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'deepseek-chat',
        messages,
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
      .replace(/<\/?[^>]+(>|$)/g, '')
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
