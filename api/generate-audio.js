import { TextToSpeechClient } from '@google-cloud/text-to-speech';

// Função principal que a Vercel irá executar
export default async function handler(request, response) {
  // 1. Verifica se o método é POST (segurança)
  if (request.method !== 'POST') {
    return response.status(405).json({ message: 'Apenas o método POST é permitido' });
  }

  try {
    // 2. Pega o texto enviado pelo aplicativo
    const { text } = JSON.parse(request.body);
    if (!text) {
      return response.status(400).json({ message: 'O texto é obrigatório' });
    }

    // 3. Configura o cliente da API do Google
    const client = new TextToSpeechClient({
      credentials: {
        client_email: process.env.VITE_GOOGLE_CLIENT_EMAIL,
        private_key: process.env.VITE_GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n'), // Corrige a formatação da chave
      },
      projectId: process.env.VITE_GOOGLE_PROJECT_ID,
    });

    // 4. Define as especificações do áudio (voz masculina, português)
    const audioRequest = {
      input: { text: text },
      voice: { languageCode: 'pt-BR', name: 'pt-BR-Wavenet-B' }, // Voz masculina de alta qualidade
      audioConfig: { audioEncoding: 'MP3' },
    };

    // 5. Chama a API do Google para gerar o áudio
    const [audioResponse] = await client.synthesizeSpeech(audioRequest);
    
    // 6. Envia o áudio de volta para o aplicativo
    response.setHeader('Content-Type', 'audio/mpeg');
    return response.status(200).send(audioResponse.audioContent);

  } catch (error) {
    console.error('Erro ao gerar áudio:', error);
    return response.status(500).json({ message: 'Falha ao gerar o áudio', error: error.message });
  }
}