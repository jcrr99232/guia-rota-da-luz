import React, { useState, useEffect } from 'react';
import { MapPin, UtensilsCrossed, Mountain, AlertTriangle, Star, Clock, Soup, ArrowLeft, Thermometer, Sparkles, Bot, WifiOff, Map, Sunrise, Sun, Sunset, Droplets, CloudRain, Calendar, ExternalLink } from 'lucide-react';

// --- FUNÇÕES AUXILIARES ---

// Calcula a semana do ano a partir de uma data
const getWeekNumber = (date) => {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  d.setUTCDate(d.getUTCDate() + 4 - (d.getUTCDay() || 7));
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  const weekNo = Math.ceil((((d - yearStart) / 86400000) + 1) / 7);
  return weekNo;
};

// Formata a data para dd/mm/aaaa
const formatDate = (date) => {
  return date.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' });
};

// Converte strings de tempo (ex: "5h 39min") para minutos
const parseTime = (timeStr) => {
    const hoursMatch = timeStr.match(/(\d+)h/);
    const minMatch = timeStr.match(/(\d+)min/);
    const hours = hoursMatch ? parseInt(hoursMatch[1], 10) : 0;
    const minutes = minMatch ? parseInt(minMatch[1], 10) : 0;
    return hours * 60 + minutes;
};

// --- GERAÇÃO DINÂMICA DE DADOS METEOROLÓGICOS ---

// Dados base por semana (como tínhamos antes)
const weeklyHistoricalWeatherBase = {
  1: { min: 19, max: 28, chanceChuva: 75, umidade: 82 }, 2: { min: 19, max: 28, chanceChuva: 70, umidade: 80 }, 3: { min: 18, max: 27, chanceChuva: 60, umidade: 77 }, 4: { min: 16, max: 26, chanceChuva: 40, umidade: 72 }, 5: { min: 13, max: 24, chanceChuva: 25, umidade: 65 }, 6: { min: 11, max: 23, chanceChuva: 20, umidade: 62 }, 7: { min: 10, max: 23, chanceChuva: 20, umidade: 62 }, 8: { min: 12, max: 25, chanceChuva: 15, umidade: 57 }, 9: { min: 14, max: 26, chanceChuva: 35, umidade: 65 }, 10: { min: 16, max: 27, chanceChuva: 50, umidade: 72 }, 11: { min: 17, max: 27, chanceChuva: 65, umidade: 77 }, 12: { min: 18, max: 28, chanceChuva: 70, umidade: 82 },
};

// Modificadores para simular microclimas de cada cidade
const cityModifiers = {
  'Guararema': { temp: 0, umidade: 2, chuva: 0 },
  'Santa Branca': { temp: -1, umidade: -3, chuva: 5 },
  'Paraibuna': { temp: -1, umidade: 0, chuva: 5 },
  'Redenção da Serra': { temp: -2, umidade: -5, chuva: 10 },
  'Taubaté': { temp: 1, umidade: 5, chuva: -5 },
  'Pindamonhangaba': { temp: 1, umidade: 5, chuva: -5 },
  'Aparecida': { temp: 2, umidade: 7, chuva: -10 },
};

// Função para gerar o objeto de dados final
const generateWeatherData = () => {
  const weatherData = {};
  for (let week = 1; week <= 52; week++) {
    const month = Math.ceil(week / 4.33);
    const baseWeather = weeklyHistoricalWeatherBase[month] || weeklyHistoricalWeatherBase[8];
    weatherData[week] = {};

    for (const city in cityModifiers) {
      const mod = cityModifiers[city];
      const minTemp = baseWeather.min + mod.temp;
      const maxTemp = baseWeather.max + mod.temp;
      
      weatherData[week][city] = {
        min: `${minTemp}°C`,
        max: `${maxTemp}°C`,
        horarios: [
          { hora: "07h", temp: `${minTemp + 1}°C` },
          { hora: "12h", temp: `${maxTemp - 1}°C` },
          { hora: "17h", temp: `${maxTemp - 2}°C` }
        ],
        chanceChuva: `${Math.max(0, baseWeather.chanceChuva + mod.chuva)}%`,
        umidade: `${Math.max(0, baseWeather.umidade + mod.umidade)}%`
      };
    }
  }
  return weatherData;
};

const weeklyCityHistoricalWeather = generateWeatherData();


// --- DADOS ESTÁTICOS DAS ETAPAS ---
const etapasData = [
  { id: 1, titulo: "Etapa 1: Mogi das Cruzes a Guararema", cidadeDestino: "Guararema", mapaUrl: "https://www.google.com/maps/dir/Universidade+de+Mogi+das+Cruzes,+Avenida+Doutor+Cândido+Xavier+de+Almeida+e+Souza,+200,+Mogi+das+Cruzes+-+SP/Recanto+das+Acácias+Guararema+-+Nogueira,+Guararema+-+SP,+08900-000/@-23.473539,-46.166861,12z/data=!4m14m13!1m5!1m1!1s0x94ce7b54612e4d67:0x227a940e79753457!2m2!1d-46.1856893!2d-23.5358656!1m5!1m1!1s0x94cc537b989ba011:0x39a1a742f1f44d57!2m2!1d-46.0354162!2d-23.4111389!3e2?entry=ttu", distancia: "24,4 km", tempoEstimado: "5h 39min", paradaRefeicao: "45min",
    itinerario: [ "Siga na direção leste na R. Prof. Álvaro Pavan em direção a Av. Manoel Bezerra Lima Filho (200 m)", "Vire à esquerda na Av. Manoel Bezerra Lima Filho (130 m)", "Na rotatória, pegue a 2ª saída para a Av. Francisco Rodrigues Filho/Rod. General Euryale de Jesus Zerbine/Rod. Henrique Eroles (16,0 km)", "Curva suave à direita para permanecer na Rod. General Euryale de Jesus Zerbine/Rod. Henrique Eroles (88 m)", "Na rotatória, pegue a 1ª saída para a Est. Mun. Argemiro de Souza Melo (800 m)", "Vire à esquerda na Est. Mun. Romeu Tanganelli (2,1 km)", "Vire à esquerda na R. Ruth Do Prado Paula Lopes (700 m)", "Curva suave à direita para permanecer na R. Ruth Do Prado Paula Lopes (1,2 km)", "Vire à esquerda na R. José Fonseca Freire (3,1 km)", "Vire à esquerda (Estrada de uso restrito, 130 m)", "Curva suave à direita (Estrada de uso restrito, 87 m)", "Chegada: Recanto das Acácias Guararema, R. José Fonseca Freire - Nogueira, Guararema - SP" ],
    pontosDeApoio: [ { nome: "Lanchonete na Rodoviária", km: "Início", tipo: "Lanchonete" }, { nome: "Habbib's", km: "0", tipo: "Restaurante" }, { nome: "Padaria Santo Trigo", km: "0", tipo: "Padaria" }, { nome: "Padaria 2B", km: "11,9", tipo: "Padaria" }, { nome: "Restaurante Lucia", km: "11,9", tipo: "Restaurante" }, { nome: "Bica D'agua Santo Alberto", km: "14", tipo: "Ponto de Água" }, { nome: "Estação Ferroviária Luiz Carlos (Vila Turística)", km: "17", tipo: "Comércio diverso" }, { nome: "Mercado do Gomes", km: "25,9", tipo: "Mercado" }, ],
    altimetria: "O trajeto começa em área urbana e segue para estradas de terra com ondulações suaves. A maior parte do percurso é plana, com algumas subidas e descidas leves, característico da transição da serra para o vale.",
    dificuldades: [ "Longo trecho em estrada de asfalto no início, o que pode ser desgastante.", "Trechos rurais com menor infraestrutura e pontos de apoio.", "Sinal de celular pode ser instável em áreas mais afastadas." ],
    recomendacoes: [ "Comece cedo para evitar o sol forte.", "Use calçados confortáveis e já amaciados.", "Leve um chapéu ou boné e aplique protetor solar." ],
    oQueLevar: "Leve no mínimo 2 litros de água, frutas (banana, maçã), barras de cereal, castanhas e um sanduíche leve. Ideal para se reabastecer nos comércios em Sabaúna (km 11,9)."
  },
  { id: 2, titulo: "Etapa 2: Guararema a Santa Branca", cidadeDestino: "Santa Branca", mapaUrl: "https://www.google.com/maps/dir/Recanto+das+Acácias+Guararema+-+Nogueira,+Guararema+-+SP,+08900-000/Sítio+do+Valdir+(Rota+da+luz)+-+Estr.+De+Santa+Branca,+Paraibuna+-+SP/@-23.3274614,-46.0401833,12z/data=!4m14m13!1m5!1m1!1s0x94cc537b989ba011:0x39a1a742f1f44d57!2m2!1d-46.0354162!2d-23.4111389!1m5!1m1!1s0x94cc4f362145e69b:0xa1d5952f9b88b209!2m2!1d-45.928163!2d-23.242761!3e2?entry=ttu", distancia: "29,3 km", tempoEstimado: "6h 58min", paradaRefeicao: "60min",
    itinerario: [ "Siga na direção sul em direção a R. José Fonseca Freire (210 m)", "Vire à esquerda na R. José Fonseca Freire (850 m)", "Continue para R. Dr. Armindo (1,0 km)", "Vire à direita na R. Dr. Falcão (650 m)", "Continue para Rua d'Ajuda (350 m)", "Continue para Rua da Ajuda (180 m)", "Continue para Estr. Mun. Dr. Hércules Campagnoli (13,1 km)", "Vire à direita (150 m), depois à esquerda (94m), e à esquerda novamente (1,8 km)", "Vire à esquerda na EST PART FRANCISCO DE ASSIS DOS SANTOS NOGUEIRA (750 m)", "Curva suave à direita para permanecer na mesma estrada (400 m)", "Continue para R. Lauro T de Andrade (400 m), Rod. Maria T Couto de Oliveira (170 m), R. São Sebastião (160 m), e R. Independencia (600 m)", "Vire à esquerda na R. João Pessoa (44 m)", "Vire à direita na R. Cel. Joaquim Faria / Rod. Carvalho Pinto - Fazenda Caetê (150 m)", "Vire à direita na R. Cel. Antônio Francisco de Abreu / Rod. Carvalho Pinto - Fazenda Caetê (7,4 km)", "Curva suave à direita na Estr. De Santa Branca (900 m)", "Chegada: Sítio do Valdir (Rota da luz), Estr. De Santa Branca, Paraibuna - SP" ],
    pontosDeApoio: [ { nome: "Lanchonete Santa Rita", km: "26,6", tipo: "Lanchonete" }, { nome: "Padaria Manhãs do Sol", km: "27,7", tipo: "Padaria" }, { nome: "Restaurante 2 Irmãos", km: "27,75", tipo: "Restaurante" }, { nome: "Mercadinho Campagnoli", km: "29,2", tipo: "Mercado" }, { nome: "Bar do Fábio", km: "33,3", tipo: "Bar" }, { nome: "Mercado Cafeteria Beija-Flor", km: "36,5", tipo: "Mercado/Cafeteria" }, ],
    altimetria: "Esta etapa apresenta maior variação de altitude, com subidas e descidas mais acentuadas em estradas de terra. É um trecho que exige mais fisicamente, passando por áreas de mata e fazendas.",
    dificuldades: [ "Distância longa combinada com altimetria desafiadora.", "Trechos de estrada de terra que podem ter lama ou poeira, dependendo do tempo.", "Isolamento maior, com menos pontos de apoio diretos na rota." ],
    recomendacoes: [ "Use bastões de caminhada para ajudar nas subidas e dar estabilidade nas descidas.", "Gerencie bem sua energia e faça pausas curtas para descanso.", "Certifique-se de que sua mochila está bem ajustada para evitar desconforto." ],
    oQueLevar: "Essencial levar mais água (cerca de 3 litros). Reforce a alimentação com carboidratos de absorção lenta (sanduíches integrais), e tenha à mão alimentos energéticos como rapadura, chocolate amargo e frutas secas."
  },
  { id: 3, titulo: "Etapa 3: Santa Branca a Paraibuna", cidadeDestino: "Paraibuna", mapaUrl: "https://www.google.com/maps/dir/Sítio+do+Valdir+(Rota+da+luz)+-+Estr.+De+Santa+Branca,+Paraibuna+-+SP/Chororão+Combustíveis+-+Rua+Sebastião+Barreto+Silva,+13,+Paraibuna+-+SP/@-23.3134371,-45.8617513,12z/data=!4m14m13!1m5!1m1!1s0x94cc4f362145e69b:0xa1d5952f9b88b209!2m2!1d-45.928163!2d-23.242761!1m5!1m1!1s0x94cd811568205a61:0xc8f906f35a0f2b3b!2m2!1d-45.6601445!2d-23.3855325!3e2?entry=ttu", distancia: "27,7 km", tempoEstimado: "6h 38min", paradaRefeicao: "60min",
    itinerario: [ "Siga na direção noroeste na Estr. De Santa Branca (600 m)", "Curva acentuada à direita (1,9 km), depois vire à direita (230 m)", "Vire à esquerda em direção à Rod. Carvalho Pinto - Fazenda Caetê (200 m)", "Vire à direita na Rod. Carvalho Pinto - Fazenda Caetê (6,0 km)", "Continue para Estr. Fazenda Capela - Fazenda Caetê (1,6 km)", "Curva suave à direita (1,7 km), continue na Estr. Fazenda Capela - Fazenda Caetê (5,4 km)", "Vire à esquerda na Estr. De Santa Branca (5,9 km)", "Continue para R. Santa Branca (650 m)", "Vire à direita em direção à Av. Antônio Feliciano da Silva (160 m)", "Na rotatória, pegue a 1ª saída para a Av. Antônio Feliciano da Silva (500 m)", "Continue por Av. Central Sul (74 m), Av. São José (350 m), Av. Carlos Guimarães (650 m + 500 m)", "Continue para R. Maj. Soares (29 m), Av. Benedito Nogueira Santos (400 m)", "Vire à direita (600 m), depois à esquerda (46 m)", "Chegada: Chororão Combustíveis, Rua Sebastião Barreto Silva, 13, Paraibuna - SP" ],
    pontosDeApoio: [ { nome: "Bar do Fim do Mundo", km: "42", tipo: "Bar" }, { nome: "Restaurante Fogo de Ouro", km: "43,3", tipo: "Restaurante" }, { nome: "Restaurante Vilela", km: "45", tipo: "Restaurante" }, { nome: "Padaria Sol Nascente", km: "45", tipo: "Padaria" }, { nome: "Café do Peregrino", km: "46,8", tipo: "Cafeteria" }, { nome: "Pesqueiro Agua Limpa", km: "54,1", tipo: "Pesqueiro/Restaurante" }, ],
    altimetria: "O percurso segue o contorno da represa de Paraibuna, apresentando muitas curvas e um sobe e desce constante. As paisagens são o destaque, mas a irregularidade do terreno exige atenção.",
    dificuldades: [ "Trechos com acostamento estreito ou inexistente em estradas vicinais.", "O sobe e desce constante pode ser cansativo.", "A travessia de pontes e trechos próximos à rodovia principal requer cuidado." ],
    recomendacoes: [ "Aprecie a vista da represa, um dos pontos altos da Rota.", "Caminhe pela contramão para melhor visualização dos veículos.", "Planeje sua parada principal na cidade de Paraibuna, que tem boa estrutura." ],
    oQueLevar: "Mantenha a hidratação. É uma boa etapa para levar isotônicos para repor os sais minerais. Leve lanches práticos, pois a maior parte dos pontos de apoio se concentra no final da etapa, já em Paraibuna."
  },
  { id: 4, titulo: "Etapa 4: Paraibuna a Redenção da Serra", cidadeDestino: "Redenção da Serra", mapaUrl: "https://www.google.com/maps/dir/Chororão+Combustíveis+-+Rua+Sebastião+Barreto+Silva,+13,+Paraibuna+-+SP/Igreja+Matriz+de+Redenção+da+Serra+-+Centro,+Redenção+da+Serra+-+SP/@-23.3328221,-45.688827,12z/data=!4m14m13!1m5!1m1!1s0x94cd811568205a61:0xc8f906f35a0f2b3b!2m2!1d-45.6601445!2d-23.3855325!1m5!1m1!1s0x94cd632551060959:0x88981458e3381615!2m2!1d-45.4852932!2d-23.2842407!3e2?entry=ttu", distancia: "31,8 km", tempoEstimado: "7h 34min", paradaRefeicao: "60min",
    itinerario: [ "Siga na direção noroeste e vire à direita em direção à Av. Benedito Nogueira Santos (290 m + 46 m)", "Vire à esquerda na Av. Benedito Nogueira Santos (600 m)", "Continue para R. Maj. Soares (400 m), Av. Carlos Guimarães (29 m + 500 m), Av. São José (140 m)", "Vire à direita na Pte. da Vigor (100 m) e curva suave à direita na R. Maj. Santana (170 m)", "Vire à esquerda na R. Taubaté (230 m)", "Curva suave à direita na Av. Prof. Pedro de Calazans (2,8 km)", "Continue para Estr. Do Itapeva (4,2 km) e Estr. Bairro Bragança (7,3 km)", "Curva suave à direita (71 m), vire à direita (600 m), vire à direita (2,0 km), vire à direita (6,5 km)", "Vire à direita na Estr. Mun. Paraibuna (2,9 km)", "Vire à direita para permanecer na Estr. Mun. Paraibuna (2,2 km)", "Curva suave à esquerda para permanecer na Estr. Mun. Paraíbuna (180 m)", "Continue para R. Cel. Manoel Bento (550 m)", "Vire à direita (110 m)", "Chegada: Igreja Matriz de Redenção da Serra" ],
    pontosDeApoio: [ { nome: "Mercadinho Piratininga", km: "82,9", tipo: "Mercado" }, { nome: "Restaurante Caxambú", km: "83", tipo: "Restaurante" }, { nome: "Restaurante Serra de Paraibu", km: "83", tipo: "Restaurante" }, { nome: "Empório Itapeva", km: "83,3", tipo: "Empório" }, { nome: "Mercado Municipal Paraibuna", km: "83,2", tipo: "Mercado" }, { nome: "Bar do Torresmo", km: "88", tipo: "Bar" }, { nome: "Mercadinho do Dinho", km: "91", tipo: "Mercado" }, ],
    altimetria: "Etapa longa e considerada uma das mais difíceis em termos de altimetria. Há subidas longas e íngremes, especialmente na primeira metade, seguidas por descidas que também exigem esforço. O ganho de elevação é significativo.",
    dificuldades: [ "A mais longa de todas as etapas.", "Altimetria exigente, com subidas que testam o preparo físico.", "Poucos pontos de apoio entre a saída de Paraibuna e a chegada em Redenção da Serra." ],
    recomendacoes: [ "Esta é a etapa 'rainha'. Comece o mais cedo possível.", "Controle o ritmo desde o início para não se esgotar nas primeiras subidas.", "Aproveite a chegada à 'cidade velha' de Redenção da Serra, um local de grande valor histórico e beleza." ],
    oQueLevar: "É o dia para a mochila mais abastecida. Aumente a quantidade de água para 3-4 litros. Leve comida suficiente para duas refeições (além dos lanches), como sanduíches reforçados, macarrão de pote (se tiver como aquecer) ou comida liofilizada."
  },
  { id: 5, titulo: "Etapa 5: Redenção da Serra a Taubaté", cidadeDestino: "Taubaté", mapaUrl: "https://www.google.com/maps/dir/Igreja+Matriz+de+Redenção+da+Serra+-+Centro,+Redenção+da+Serra+-+SP/Comevap+-+Rod.+Oswaldo+Cruz,+KM+3+-+Cataguá,+Taubaté+-+SP/@-23.1672614,-45.568411,11z/data=!4m14m13!1m5!1m1!1s0x94cd632551060959:0x88981458e3381615!2m2!1d-45.4852932!2d-23.2842407!1m5!1m1!1s0x94cc58032746441b:0xb6398b1e94a86b3e!2m2!1d-45.5786657!2d-23.0487016!3e2?entry=ttu", distancia: "28,9 km", tempoEstimado: "6h 59min", paradaRefeicao: "60min",
    itinerario: [ "Siga na direção sul em direção a R. Cel. Manoel Bento (110 m)", "Vire à direita na R. Cel. Manoel Bento (180 m), depois à direita (500 m)", "Continue para Rodovia Major Gabriel Ortiz Monteiro (280 m)", "Vire à esquerda na Estr. Mun. Jambeiro (800 m)", "Curva suave à direita (2,5 km), depois curva suave à esquerda (1,4 km)", "Vire à direita (19 m), depois à direita novamente (2,1 km)", "Curva suave à esquerda (4,5 km)", "Continue para Estr. Bairro da Samambaia (1,3 km)", "Vire à esquerda (4,9 km)", "Continue para Estr. do morro grande (600 m)", "Vire à direita em direção à Estr. Antônio de Angelis (160 m)", "Vire à esquerda na Estr. Antônio de Angelis (8,9 km)", "Vire à direita na BR-383 (42 m)", "Na rotatória, pegue a 2ª saída para a Estr. Mun. Itapecirica (350 m)", "Chegada: Comevap, Rod. Oswaldo Cruz, KM 3 - Cataguá, Taubaté - SP" ],
    pontosDeApoio: [ { nome: "Restaurante Paraiso", km: "111,7", tipo: "Restaurante" }, { nome: "Bar do Pescador", km: "113", tipo: "Bar" }, { nome: "Armazem Na. Sra. Aparecida", km: "125,7", tipo: "Armazém" }, { nome: "Cafeteria Maetá", km: "140,5", tipo: "Cafeteria" }, ],
    altimetria: "O percurso começa a descer a serra em direção ao Vale do Paraíba. Predominam as descidas, algumas longas e contínuas, em estradas de terra. O cenário muda, tornando-se mais rural e agrícola à medida que se aproxima de Taubaté.",
    dificuldades: [ "Descidas longas podem sobrecarregar os joelhos e a parte da frente dos pés.", "A transição para a área mais urbanizada de Taubaté pode ter tráfego de veículos.", "O calor tende a ser mais intenso no vale." ],
    recomendacoes: [ "Use os bastões de caminhada para aliviar o impacto nas descidas.", "Faça alongamentos focados nos músculos da panturrilha e coxa.", "Atenção redobrada ao entrar em vias mais movimentadas perto do destino." ],
    oQueLevar: "A hidratação continua sendo chave. Como a etapa tem mais descidas, o desgaste é diferente. Leve alimentos leves e de fácil digestão. Aproveite os pontos de apoio no caminho, que começam a ficar mais frequentes."
  },
  { id: 6, titulo: "Etapa 6: Taubaté a Pindamonhangaba", cidadeDestino: "Pindamonhangaba", mapaUrl: "https://www.google.com/maps/dir/Comevap+-+Rod.+Oswaldo+Cruz,+KM+3+-+Cataguá,+Taubaté+-+SP/Pinda+Palace+Hotel+-+Av.+Amélia+Prata+Balarin,+N°26+-+Parque+das+Palmeiras,+Pindamonhangaba+-+SP/@-22.9877993,-45.5401915,12z/data=!4m14m13!1m5!1m1!1s0x94cc58032746441b:0xb6398b1e94a86b3e!2m2!1d-45.5786657!2d-23.0487016!1m5!1m1!1s0x94cc4f3e696f5b99:0x794eb8482430263!2m2!1d-45.4497645!2d-22.9261545!3e2?entry=ttu", distancia: "25,9 km", tempoEstimado: "5h 56min", paradaRefeicao: "45min",
    itinerario: [ "Siga na direção nordeste na Estr. Mun. Itapecirica (1,4 km)", "Na rotatória, pegue a 3ª saída (450 m) e continue para Av. José Belmiro dos Santos (850 m)", "Na rotatória, pegue a 1ª saída (1,0 km)", "Vire à esquerda na Estr. Amácio Mazaropi (400 m), depois à esquerda na Estr. Mun. dos Remédios (800 m)", "Siga pela zona urbana de Taubaté e depois por estradas vicinais e rurais em direção a Pindamonhangaba, conforme sinalização.", "O trajeto passa por diversas ruas e avenidas, incluindo Av. Dom Pedro I e Rod. Amador Bueno da Veiga.", "O final da etapa é na zona urbana de Pindamonhangaba.", "Chegada: Pinda Palace Hotel, Av. Amélia Prata Balarin, N°26 - Parque das Palmeiras, Pindamonhangaba - SP" ],
    pontosDeApoio: [ { nome: "Mercado Panorama", km: "146,2", tipo: "Mercado" }, { nome: "Padaria Campos Elíseos", km: "146,4", tipo: "Padaria" }, { nome: "Empório Ipiranga", km: "146,9", tipo: "Empório" }, { nome: "Padaria Paraíso Taubaté", km: "154,1", tipo: "Padaria" }, { nome: "Supermercado Regina", km: "158,2", tipo: "Supermercado" }, { nome: "Apoio Sr. Paulo/Dona Dolores", km: "161,5", tipo: "Ponto de Apoio" }, { nome: "Restaurante do Paizão", km: "162", tipo: "Restaurante" }, ],
    altimetria: "Etapa predominantemente plana, atravessando o coração do Vale do Paraíba. O percurso intercala áreas urbanas, rurais e industriais. É uma caminhada de 'ligação' entre as duas cidades, sem grandes desafios de elevação.",
    dificuldades: [ "Monotonia do terreno plano para alguns peregrinos.", "Longos trechos sob o sol, com poucas sombras.", "Atravessar áreas urbanas com trânsito e ruído." ],
    recomendacoes: [ "É uma etapa para reflexão, aproveitando a paisagem plana e a proximidade do destino final.", "Mantenha um ritmo constante.", "Aproveite a grande oferta de comércio para se reabastecer ou fazer uma refeição mais completa." ],
    oQueLevar: "A necessidade de carregar muita coisa diminui. Leve água, mas saiba que encontrará muitos pontos de venda. Lanches leves são suficientes. É um bom dia para tomar um caldo de cana ou açaí em algum comércio local."
  },
  { id: 7, titulo: "Etapa Final: Pindamonhangaba a Aparecida", cidadeDestino: "Aparecida", mapaUrl: "https://www.google.com/maps/dir/Pinda+Palace+Hotel+-+Av.+Amélia+Prata+Balarin,+N°26+-+Parque+das+Palmeiras,+Pindamonhangaba+-+SP/Santuário+Nacional+de+Aparecida+-+Aparecida,+SP/@-22.8885145,-45.3429393,12z/data=!4m14m13!1m5!1m1!1s0x94cc4f3e696f5b99:0x794eb8482430263!2m2!1d-45.4497645!2d-22.9261545!1m5!1m1!1s0x94cc44541334237b:0x564978853a0b3c6!2m2!1d-45.2321287!2d-22.851724!3e2?entry=ttu", distancia: "21,5 km", tempoEstimado: "4h 51min", paradaRefeicao: "45min",
    itinerario: [ "Siga na direção norte na Av. Amélia Prata Balarin em direção a Rod. Ver. Abel Fabrício Dias (26 m)", "Vire à direita na Rod. Ver. Abel Fabrício Dias (6,1 km)", "Na rotatória, continue em frente na Rod. Antiga Sp | 66 (4,0 km)", "Continue para Rod. Pres. Washington Luís (5,1 km)", "Curva suave à esquerda para permanecer na Rod. Pres. Washington Luís (5,5 km)", "Vire à esquerda na R. Itajubá (53 m)", "Continue para R. Itaguatiara (82 m)", "Vire à direita na Av. Itaú (60 m)", "Vire à esquerda na R. Itapeva (190 m)", "Vire à direita na R. Itacolomi (400 m)", "Chegada: Santuário Nacional de Aparecida (proximidades da R. Itacolomi)." ],
    pontosDeApoio: [ { nome: "Caldo de Cana do Japa", km: "186,5", tipo: "Lanchonete" }, { nome: "Pesqueiro Restaurante A Familia", km: "188", tipo: "Restaurante" }, { nome: "Pousada Jovimar", km: "197", tipo: "Pousada/Apoio" }, { nome: "Santuário de Aparecida", km: "201", tipo: "Destino Final com ampla estrutura" }, ],
    altimetria: "A última etapa é majoritariamente plana, seguindo a 'Rota dos Romeiros' paralela à Via Dutra. O caminho é bem demarcado e o terreno não oferece dificuldades. A emoção de se aproximar do Santuário é o grande motivador.",
    dificuldades: [ "Ansiedade e cansaço acumulado podem pesar.", "O trecho final dentro de Aparecida pode ser movimentado, com grande fluxo de pessoas e veículos.", "O sol forte em um caminho com pouca sombra." ],
    recomendacoes: [ "Saboreie cada passo da reta final. A jornada está terminando.", "Hidrate-se bem, mesmo na euforia da chegada.", "Ao avistar a Basílica, pare por um momento para agradecer e refletir sobre sua peregrinação.", "No Santuário, procure o 'Apoio ao Turista' para informações." ],
    oQueLevar: "Leve o essencial: água, um lanche rápido e seus documentos. O foco do dia não é o esforço físico, mas a conclusão espiritual e emocional da jornada. Carregue principalmente gratidão no coração."
  }
];

// --- Components ---

const Card = ({ icon: Icon, title, children, colorClass }) => (
  <div className="bg-white rounded-xl shadow-md overflow-hidden mb-6">
    <div className={`p-4 ${colorClass} text-white flex items-center`}>
      <Icon className="h-6 w-6 mr-3" />
      <h3 className="text-lg font-bold">{title}</h3>
    </div>
    <div className="p-6 text-gray-700 leading-relaxed">
      {children}
    </div>
  </div>
);

const GeminiCard = ({ title, icon: Icon, isLoading, content, onGenerate, buttonText, isOnline }) => {
    if (!onGenerate) return null;

    return (
        <div className="bg-gradient-to-br from-blue-50 to-indigo-100 rounded-xl shadow-md overflow-hidden mb-6">
            <div className="p-4 bg-black bg-opacity-5 flex items-center">
                <Icon className="h-6 w-6 mr-3 text-indigo-600" />
                <h3 className="text-lg font-bold text-indigo-800">{title}</h3>
            </div>
            <div className="p-6">
                {!isOnline ? (
                    <div className="text-center text-gray-600">
                        <WifiOff className="mx-auto h-8 w-8 mb-2" />
                        <p>Funcionalidade indisponível offline. Conecte-se à internet para usar a IA.</p>
                    </div>
                ) : (
                    <>
                        {isLoading && <div className="flex justify-center items-center"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-500"></div></div>}
                        {content && <div className="text-gray-800 leading-relaxed whitespace-pre-wrap">{content}</div>}
                        {!isLoading && !content && (
                            <button
                                onClick={onGenerate}
                                className="w-full flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all"
                            >
                                <Sparkles className="h-5 w-5 mr-2" />
                                {buttonText}
                            </button>
                        )}
                    </>
                )}
            </div>
        </div>
    );
};


const EtapaDetalhes = ({ etapa, onBack, isOnline }) => {
  const [dicas, setDicas] = useState('');
  const [curiosidades, setCuriosidades] = useState('');
  const [isLoadingDicas, setIsLoadingDicas] = useState(false);
  const [isLoadingCuriosidades, setIsLoadingCuriosidades] = useState(false);
  
  const weekNumber = getWeekNumber(etapa.date);
  const previsaoTempo = weeklyCityHistoricalWeather[weekNumber]?.[etapa.cidadeDestino] || weeklyCityHistoricalWeather[33]['Guararema']; // Padrão para Agosto, Guararema


  // Function to call the Gemini API
  const callGeminiAPI = async (prompt) => {
    // This is a placeholder as API key management is required for deployment
    console.log("Chamando API Gemini com o prompt:", prompt);
    await new Promise(resolve => setTimeout(resolve, 1500));
    if (prompt.includes("dicas")) {
        return "1. Dica gerada pela IA: Mantenha-se hidratado.\n2. Dica 2: Use calçados confortáveis.\n3. Dica 3: Aproveite a paisagem.";
    }
    return `Curiosidades sobre ${etapa.cidadeDestino} geradas pela IA.`;
  };

  const handleGerarDicas = async () => {
    setIsLoadingDicas(true);
    setDicas('');
    const prompt = `Como um peregrino experiente da Rota da Luz, forneça 3 dicas inspiradoras e práticas para a etapa '${etapa.titulo}'. As dificuldades conhecidas são: ${etapa.dificuldades.join(', ')}. As dicas devem ser em formato de lista, curtas e focar em preparação mental e física para este trecho específico.`;
    try {
        const responseText = await callGeminiAPI(prompt);
        setDicas(responseText);
    } catch (error) {
        setDicas("Desculpe, não foi possível gerar as dicas no momento. Tente novamente mais tarde.");
        console.error("Error fetching Gemini tips:", error);
    } finally {
        setIsLoadingDicas(false);
    }
  };

  const handleGerarCuriosidades = async () => {
    setIsLoadingCuriosidades(true);
    setCuriosidades('');
    const prompt = `Para um peregrino que está chegando a pé na cidade de ${etapa.cidadeDestino}, descreva em um parágrafo curto (máximo 3 frases) os principais pontos de interesse, curiosidades ou o que fazer na cidade para aproveitar o local.`;
     try {
        const responseText = await callGeminiAPI(prompt);
        setCuriosidades(responseText);
    } catch (error) {
        setCuriosidades("Desculpe, não foi possível gerar as curiosidades no momento. Tente novamente mais tarde.");
        console.error("Error fetching Gemini curiosidades:", error);
    } finally {
        setIsLoadingCuriosidades(false);
    }
  };


  return (
    <div className="p-4 sm:p-6 lg:p-8 animate-fade-in">
            <button
                onClick={onBack}
                className="mb-6 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
                <ArrowLeft className="h-5 w-5 mr-2" />
                Voltar
            </button>
            
              
      <div className="text-center mb-8">
        <div className="flex justify-center items-center gap-4">
          <h2 className="text-3xl font-extrabold text-gray-800">{etapa.titulo}</h2>
          <img src="/logo-rota.jpeg" alt="Logotipo Rota da Luz" className="h-10" />
        </div>
        <p className="text-xl text-blue-700 font-semibold mt-2">{formatDate(etapa.date)}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8 text-center">
        <div className="bg-white p-4 rounded-lg shadow">
          <Thermometer className="mx-auto h-8 w-8 text-orange-500 mb-2" />
          <p className="font-bold text-gray-800">Previsão do Tempo</p>
          <p className="text-lg text-gray-600">{previsaoTempo.min} / {previsaoTempo.max}</p>
          <div className="grid grid-cols-3 gap-1 text-xs text-gray-500 mt-2 border-t pt-2">
            <span title="07h00"><Sunrise className="w-4 h-4 inline"/> {previsaoTempo.horarios[0].temp}</span>
            <span title="12h00"><Sun className="w-4 h-4 inline"/> {previsaoTempo.horarios[1].temp}</span>
            <span title="17h00"><Sunset className="w-4 h-4 inline"/> {previsaoTempo.horarios[2].temp}</span>
          </div>
          <div className="flex justify-around text-xs text-gray-500 mt-2 border-t pt-2">
            <span title="Umidade do Ar"><Droplets className="w-4 h-4 inline mr-1"/>{previsaoTempo.umidade}</span>
            <span title="Chance de Chuva"><CloudRain className="w-4 h-4 inline mr-1"/>{previsaoTempo.chanceChuva}</span>
          </div>
           <a 
                href={`https://www.google.com/search?q=previsão+do+tempo+${etapa.cidadeDestino}`}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-3 w-full inline-flex items-center justify-center px-2 py-1 border border-transparent text-xs font-medium rounded-md text-blue-700 bg-blue-100 hover:bg-blue-200"
             >
                <ExternalLink className="h-3 w-3 mr-1" />
                Ver Previsão em Tempo Real
            </a>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <p className="text-3xl font-bold text-blue-500">{etapa.distancia}</p>
          <p className="font-semibold text-gray-600">Distância</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <p className="text-3xl font-bold text-blue-500">{etapa.tempoEstimado}</p>
          <p className="font-semibold text-gray-600">Tempo de Caminhada</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <Clock className="mx-auto h-8 w-8 text-blue-500 mb-2" />
          <p className="font-bold text-gray-800">Início Sugerido</p>
          <p className="text-lg text-gray-600">{etapa.horarioInicio}</p>
          <p className="text-xs text-gray-500">(Para chegar às 15:30)</p>
        </div>
      </div>
       <p className="text-center text-xs text-gray-500 mb-8 -mt-4 italic">*Previsão baseada em médias históricas para a data selecionada. Consulte um serviço de meteorologia para dados em tempo real.</p>
      
      <div className="my-8">
        <GeminiCard 
            title="Dicas do Peregrino com IA"
            icon={Bot}
            isLoading={isLoadingDicas}
            content={dicas}
            onGenerate={handleGerarDicas}
            buttonText="Gerar Dicas para esta Etapa"
            isOnline={isOnline}
        />
        <GeminiCard 
            title="Descubra a Cidade com IA"
            icon={Bot}
            isLoading={isLoadingCuriosidades}
            content={curiosidades}
            onGenerate={handleGerarCuriosidades}
            buttonText={`O que ver em ${etapa.cidadeDestino}?`}
            isOnline={isOnline}
        />
      </div>


      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div>
          <Card icon={MapPin} title="Itinerário" colorClass="bg-blue-500">
             <a 
                href={etapa.mapaUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full mb-4 inline-flex items-center justify-center px-4 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-blue-700 bg-blue-100 hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all"
             >
                <Map className="h-6 w-6 mr-3" />
                Abrir Rota no Google Maps
             </a>
            <details className="bg-gray-50 p-3 rounded-lg">
              <summary className="font-semibold cursor-pointer text-gray-700 hover:text-blue-600">Ver itinerário em texto</summary>
              <ul className="mt-3 space-y-2 list-disc list-inside text-sm text-gray-600">
                {etapa.itinerario.map((passo, index) => <li key={index}>{passo}</li>)}
              </ul>
            </details>
          </Card>
          
          <Card icon={UtensilsCrossed} title="Pontos de Apoio (Onde Comer)" colorClass="bg-green-500">
            <div className="space-y-3">
              {etapa.pontosDeApoio.map((ponto, index) => (
                <div key={index} className="p-3 bg-gray-50 rounded-lg">
                  <p className="font-bold">{ponto.nome}</p>
                  <p className="text-sm text-gray-600">Tipo: {ponto.tipo} | KM Aprox: {ponto.km}</p>
                </div>
              ))}
            </div>
          </Card>
        </div>

        <div>
          <Card icon={Mountain} title="Altimetria" colorClass="bg-yellow-500">
            <p>{etapa.altimetria}</p>
          </Card>
          
          <Card icon={AlertTriangle} title="Dificuldades" colorClass="bg-red-500">
            <ul className="space-y-2 list-disc list-inside">
              {etapa.dificuldades.map((dificuldade, index) => <li key={index}>{dificuldade}</li>)}
            </ul>
          </Card>
          
          <Card icon={Star} title="Recomendações e O Que Levar" colorClass="bg-indigo-500">
            <h4 className="font-bold mb-2">Recomendações:</h4>
            <ul className="space-y-2 list-disc list-inside mb-4">
              {etapa.recomendacoes.map((rec, index) => <li key={index}>{rec}</li>)}
            </ul>
            <hr className="my-4"/>
            <h4 className="font-bold mb-2">Sugestão para Comer/Beber:</h4>
            <p>{etapa.oQueLevar}</p>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default function App() {
  const [selectedEtapa, setSelectedEtapa] = useState(null);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [showOfflineToast, setShowOfflineToast] = useState(false);
  const [startDate, setStartDate] = useState(new Date(2025, 7, 22)); // Padrão: 22 de Agosto de 2025

  const handleDateChange = (e) => {
    const [year, month, day] = e.target.value.split('-').map(Number);
    setStartDate(new Date(year, month - 1, day));
  };
  
  const calculateEtapaData = () => {
    return etapasData.map((etapa, index) => {
        const etapaDate = new Date(startDate);
        etapaDate.setDate(startDate.getDate() + index);

        const arrivalTime = 15.5; // 15:30
        const walkTime = parseTime(etapa.tempoEstimado) / 60;
        const breakTime = parseTime(etapa.paradaRefeicao) / 60;
        const startTimeDecimal = arrivalTime - walkTime - breakTime;
        
        const startHour = Math.floor(startTimeDecimal);
        const startMinute = Math.round((startTimeDecimal - startHour) * 60);
        const formattedStartTime = `${String(startHour).padStart(2, '0')}:${String(startMinute).padStart(2, '0')}`;

        return {
            ...etapa,
            date: etapaDate,
            horarioInicio: formattedStartTime,
        };
    });
  };
  
  const allEtapas = calculateEtapaData();

  useEffect(() => {
    const serviceWorkerString = `
      const CACHE_NAME = 'rota-da-luz-cache-v11';
      const urlsToCache = [ '/', '/favicon-aarl.jpeg', '/logo-rota.jpeg' ];
      self.addEventListener('install', e => e.waitUntil(caches.open(CACHE_NAME).then(c => c.addAll(urlsToCache))));
      self.addEventListener('fetch', e => e.respondWith(fetch(e.request).catch(() => caches.match(e.request.mode === 'navigate' ? '/' : e.request))));
      self.addEventListener('activate', e => e.waitUntil(caches.keys().then(keys => Promise.all(keys.map(key => key !== CACHE_NAME ? caches.delete(key) : undefined)))));
    `;

    if ('serviceWorker' in navigator) {
      const swBlob = new Blob([serviceWorkerString], { type: 'application/javascript' });
      const swUrl = URL.createObjectURL(swBlob);

      navigator.serviceWorker.register(swUrl)
        .then(registration => {
          console.log('ServiceWorker registration successful');
          if (!localStorage.getItem('offlineToastShownV10')) {
            setShowOfflineToast(true);
            localStorage.setItem('offlineToastShownV10', 'true');
            setTimeout(() => setShowOfflineToast(false), 5000);
          }
        }).catch(error => {
          console.log('ServiceWorker registration failed: ', error);
        });
    }

    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  if (selectedEtapa) {
    return <EtapaDetalhes etapa={selectedEtapa} onBack={() => setSelectedEtapa(null)} isOnline={isOnline} />;
  }

  return (
    <div className="min-h-screen bg-gray-100 font-sans">
      <header className="bg-white shadow-md sticky top-0 z-10">
        <div className="container mx-auto px-4 py-3"> {/* Removido flex, justify-center, items-center */}
            <div className="text-center">
                <h1 className="text-2xl sm:text-4xl font-extrabold text-blue-800">
                Guia da Rota da Luz
                </h1>
                <p className="text-gray-600 mt-1 text-xs sm:text-base">
                Seu guia para a peregrinação à Aparecida.
                </p>
            </div>            
        </div>
      </header>
      
      <main className="container mx-auto p-4 sm:p-6 lg:p-8">
          {/* NOVO GRID DE 3 COLUNAS */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8 items-center">

            {/* COLUNA 1: LOGO (ocupa 1 de 3 colunas) */}
            <div className="flex justify-center items-center">
              <a href="https://www.amigosdarotadaluz.org/" target="_blank" rel="noopener noreferrer" title="Visitar site da AARL">
                <img src="/favicon-aarl.jpeg" alt="Logotipo AARL Ampliado" className="h-32 sm:h-40 lg:h-48" />
              </a>
            </div>

            {/* COLUNAS 2 e 3: CALENDÁRIO (ocupa 2 de 3 colunas) */}
            <div className="bg-white p-6 rounded-xl shadow-lg lg:col-span-2">
                <label htmlFor="start-date" className="block text-lg font-bold text-gray-800 mb-2">
                    <Calendar className="inline-block h-6 w-6 mr-2 text-blue-600" />
                    Selecione a data de início da sua caminhada:
                </label>
                <input
                    type="date"
                    id="start-date"
                    value={startDate.toISOString().split('T')[0]}
                    onChange={handleDateChange}
                    className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
            </div>
          </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {allEtapas.map(etapa => {
            const weekNumber = getWeekNumber(etapa.date);
            const previsao = weeklyCityHistoricalWeather[weekNumber]?.[etapa.cidadeDestino] || weeklyCityHistoricalWeather[33]['Guararema']; // Padrão
            
            return (
              <button
                key={etapa.id}
                onClick={() => setSelectedEtapa(etapa)}
                className="bg-white rounded-xl shadow-lg p-6 text-left hover:shadow-2xl hover:-translate-y-1 transform transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <p className="text-sm font-bold text-blue-600">ETAPA {etapa.id}</p>
                <h3 className="text-xl font-bold text-gray-800 mt-1">{etapa.titulo}</h3>
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <div className="flex justify-between items-center text-gray-600">
                    <span className="text-sm font-semibold">{formatDate(etapa.date)}</span>
                    <span className="text-sm font-semibold bg-blue-100 text-blue-800 py-1 px-2 rounded-full">{etapa.distancia}</span>
                  </div>
                  <div className="flex items-center justify-center mt-3 text-orange-600">
                      <Thermometer className="h-5 w-5 mr-1" />
                      <span className="text-sm font-semibold">
                          {previsao.min} / {previsao.max}
                      </span>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </main>

      {showOfflineToast && (
        <div className="fixed bottom-5 left-1/2 -translate-x-1/2 bg-green-600 text-white py-2 px-4 rounded-lg shadow-lg animate-fade-in-out">
          <p>Aplicativo pronto para uso offline!</p>
        </div>
      )}

      {!isOnline && (
        <div className="fixed bottom-5 right-5 bg-gray-800 text-white py-2 px-4 rounded-lg shadow-lg flex items-center">
          <WifiOff className="h-5 w-5 mr-2" />
          <p>Você está offline.</p>
        </div>
      )}

       <footer className="text-center py-6 text-gray-500 text-sm">
        <img src="/logo-rota.jpeg" alt="Logotipo Rota da Luz" className="h-12 mx-auto mb-4" />
        <p>Desenvolvido para auxiliar os peregrinos da Rota da Luz.</p>
        <p>Boa caminhada!</p>
      </footer>
    </div>
  );
}