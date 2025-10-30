export const config = {
  runtime: 'edge',
};

export default async function handler(req) {
  const { prompt } = await req.json();

  // Lendo as DUAS chaves secretas
  const apiKey = process.env.GEMINI_API_KEY;
  const projectID = process.env.GOOGLE_PROJECT_ID; // O ID do seu projeto

  if (!apiKey || !projectID) {
    return new Response(JSON.stringify({ error: 'API Key ou Project ID não configurados' }), {
      status: 500, headers: { 'Content-Type': 'application/json' },
    });
  }

  // --- NOVO ENDPOINT E PAYLOAD DA VERTEX AI ---
  // Note que o endereço do servidor e o modelo são diferentes
  const vertexApiUrl = `https://us-central1-aiplatform.googleapis.com/v1/projects/${projectID}/locations/us-central1/publishers/google/models/gemini-1.5-flash-latest:generateContent`;

  const payload = {
    contents: [{ role: "user", parts: [{ text: prompt }] }],
    generationConfig: { temperature: 0.7, topK: 40, topP: 0.95 }
  };
  // --- FIM DA MUDANÇA ---

  try {
    const response = await fetch(vertexApiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}` // Vertex AI usa 'Bearer Token' em vez de 'key='
      },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      const errorBody = await response.json();
      console.error("Google Vertex AI Error:", errorBody);
      // Tenta extrair a mensagem de erro específica
      const errorMessage = errorBody.error?.message || `Google API falhou com status: ${response.status}`;
      throw new Error(errorMessage);
    }

    const result = await response.json();
    const responseText = result.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!responseText) {
      throw new Error("Resposta da API do Google em formato inválido.");
    }

    return new Response(JSON.stringify({ response: responseText }), {
      status: 200, headers: { 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500, headers: { 'Content-Type': 'application/json' },
    });
  }
}
