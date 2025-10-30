import { GoogleAuth } from 'google-auth-library';

// Helper function to parse the body from a Node.js request
async function getBody(req) {
  return new Promise((resolve, reject) => {
    let body = '';
    req.on('data', chunk => {
      body += chunk.toString();
    });
    req.on('end', () => {
      try {
        resolve(JSON.parse(body));
      } catch (error) {
        reject(error);
      }
    });
    req.on('error', (error) => {
      reject(error);
    });
  });
}

export default async function handler(req, res) {
  // Responde apenas a requisições POST
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method Not Allowed' });
    return;
  }

  let prompt;
  try {
    // Usa o novo helper para ler a pergunta
    const body = await getBody(req);
    prompt = body.prompt;
  } catch (error) {
    res.status(400).json({ error: 'Invalid JSON body' });
    return;
  }

  const projectID = process.env.GOOGLE_PROJECT_ID;
  const clientEmail = process.env.GOOGLE_CLIENT_EMAIL;
  const privateKey = process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n');

  if (!projectID || !clientEmail || !privateKey) {
    res.status(500).json({ error: 'Credenciais do Google não configuradas corretamente' });
    return;
  }
  
  const vertexApiUrl = `https://us-central1-aiplatform.googleapis.com/v1/projects/${projectID}/locations/us-central1/publishers/google/models/gemini-1.0-pro:generateContent`;
  
  try {
    const auth = new GoogleAuth({
      credentials: {
        client_email: clientEmail,
        private_key: privateKey,
      },
      scopes: 'https://www.googleapis.com/auth/cloud-platform',
    });
    const authToken = await auth.getAccessToken();

    const payload = {
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      generationConfig: { temperature: 0.7 }
    };

    const response = await fetch(vertexApiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authToken}`
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

    // Usa res.status(200).json() para enviar a resposta
    res.status(200).json({ response: responseText });

  } catch (error) {
    console.error(error);
    // Usa res.status(500).json() para enviar o erro
    res.status(500).json({ error: error.message });
  }
}
