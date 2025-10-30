import { GoogleAuth } from 'google-auth-library'; // Importa a nova biblioteca


export default async function handler(req) {
  const { prompt } = await req.json();

  // Lê as novas credenciais
  const projectID = process.env.GOOGLE_PROJECT_ID;
  const clientEmail = process.env.GOOGLE_CLIENT_EMAIL;
  // Corrige o formato da chave privada que a Vercel armazena
  const privateKey = process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n');

  if (!projectID || !clientEmail || !privateKey) {
    return new Response(JSON.stringify({ error: 'Credenciais do Google não configuradas corretamente' }), {
      status: 500, headers: { 'Content-Type': 'application/json' },
    });
  }
  
  const vertexApiUrl = `https://us-central1-aiplatform.googleapis.com/v1/projects/${projectID}/locations/us-central1/publishers/google/models/gemini-1.5-flash-latest:generateContent`;
  
  try {
    // --- NOVA LÓGICA DE AUTENTICAÇÃO ---
    // Faz login como a "Conta de Serviço" (o robô)
    const auth = new GoogleAuth({
      credentials: {
        client_email: clientEmail,
        private_key: privateKey,
      },
      scopes: 'https://www.googleapis.com/auth/cloud-platform', // A permissão que precisamos
    });

    // Pega o "passe de segurança" temporário (o Token OAuth 2)
    const authToken = await auth.getAccessToken();
    // --- FIM DA NOVA LÓGICA ---

    const payload = {
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      generationConfig: { temperature: 0.7 }
    };

    const response = await fetch(vertexApiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authToken}` // Usa o novo token de segurança
      },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      const errorBody = await response.json();
      console.error("Google Vertex AI Error:", errorBody);
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
