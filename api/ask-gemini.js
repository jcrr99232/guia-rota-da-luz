export const config = {
  runtime: 'edge',
};

export default async function handler(req) {
  // 1. Recebe a pergunta do seu aplicativo React
  const { prompt } = await req.json();

  // 2. Lê a chave de API secreta do ambiente da Vercel
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    return new Response(JSON.stringify({ error: 'Chave de API não configurada' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  // 3. Define o endpoint que estava dando 404
  const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${apiKey}`;

  // 4. Prepara a chamada para o Google
  const payload = {
    contents: [{ role: "user", parts: [{ text: prompt }] }],
    generationConfig: { temperature: 0.7, topK: 40, topP: 0.95 }
  };

  try {
    // 5. O servidor Vercel chama o Google
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      const errorBody = await response.json();
      console.error("Google API Error:", errorBody);
      throw new Error(`Google API falhou com status: ${response.status}`);
    }

    const result = await response.json();
    const responseText = result.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!responseText) {
      throw new Error("Resposta da API do Google em formato inválido.");
    }

    // 6. Envia a resposta de volta para o seu aplicativo React
    return new Response(JSON.stringify({ response: responseText }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
