import React, { useState, useEffect } from 'react';
import { MapPin, UtensilsCrossed, Mountain, AlertTriangle, Star, Clock, ArrowLeft, Thermometer, Sparkles, Bot, WifiOff, Map, Sunrise, Sun, Sunset, Droplets, CloudRain, Calendar, ExternalLink, Send, MessageSquare, Trash2, Building, FileText, Printer, Footprints, Mic, Loader2 } from 'lucide-react';

// --- FUNÇÕES AUXILIARES, DADOS DE CLIMA, HOSPEDAGENS E ETAPAS ---
const getWeekNumber = (date) => {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  d.setUTCDate(d.getUTCDate() + 4 - (d.getUTCDay() || 7));
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  const weekNo = Math.ceil((((d - yearStart) / 86400000) + 1) / 7);
  return weekNo;
};
const formatDate = (date) => date.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' });
const parseTime = (timeStr) => {
    const hoursMatch = timeStr.match(/(\d+)h/);
    const minMatch = timeStr.match(/(\d+)min/);
    const hours = hoursMatch ? parseInt(hoursMatch[1], 10) : 0;
    const minutes = minMatch ? parseInt(minMatch[1], 10) : 0;
    return hours * 60 + minutes;
};
const weeklyHistoricalWeatherBase = {
  1: { min: 19, max: 28, chanceChuva: 75, umidade: 82 }, 2: { min: 19, max: 28, chanceChuva: 70, umidade: 80 }, 3: { min: 18, max: 27, chanceChuva: 60, umidade: 77 }, 4: { min: 16, max: 26, chanceChuva: 40, umidade: 72 }, 5: { min: 13, max: 24, chanceChuva: 25, umidade: 65 }, 6: { min: 11, max: 23, chanceChuva: 20, umidade: 62 }, 7: { min: 10, max: 23, chanceChuva: 20, umidade: 62 }, 8: { min: 12, max: 25, chanceChuva: 15, umidade: 57 }, 9: { min: 14, max: 26, chanceChuva: 35, umidade: 65 }, 10: { min: 16, max: 27, chanceChuva: 50, umidade: 72 }, 11: { min: 17, max: 27, chanceChuva: 65, umidade: 77 }, 12: { min: 18, max: 28, chanceChuva: 70, umidade: 82 },
};
const cityModifiers = {
  'Guararema': { temp: 0, umidade: 2, chuva: 0 }, 'Santa Branca': { temp: -1, umidade: -3, chuva: 5 }, 'Paraibuna': { temp: -1, umidade: 0, chuva: 5 }, 'Redenção da Serra': { temp: -2, umidade: -5, chuva: 10 }, 'Taubaté': { temp: 1, umidade: 5, chuva: -5 }, 'Pindamonhangaba': { temp: 1, umidade: 5, chuva: -5 }, 'Aparecida': { temp: 2, umidade: 7, chuva: -10 },
};
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
        min: `${minTemp}°C`, max: `${maxTemp}°C`,
        horarios: [ { hora: "07h", temp: `${minTemp + 1}°C` }, { hora: "12h", temp: `${maxTemp - 1}°C` }, { hora: "17h", temp: `${maxTemp - 2}°C` } ],
        chanceChuva: `${Math.max(0, baseWeather.chanceChuva + mod.chuva)}%`, umidade: `${Math.max(0, baseWeather.umidade + mod.umidade)}%`
      };
    }
  }
  return weatherData;
};
const weeklyCityHistoricalWeather = generateWeatherData();
const hospedagensPorCidade = {
  "Mogi das Cruzes": [ { nome: "IBIS HOTEL", km: 0.0, foraDaRota: 0.4, fone: "(11)2813-3800", contato: "WHATSAPP" }, { nome: "POUSADA WG CARVALHO", km: 0.0, foraDaRota: 0.7, fone: "(11)4791-3216", contato: "WILSON" }, { nome: "POUSADA TOKIO PLAZA", km: 0.0, foraDaRota: 1.2, fone: "(11)94203-1000", contato: "RECEPÇÃO" }, { nome: "HOTEL MALBOR", km: 0.0, foraDaRota: 2.2, fone: "(11)4735-7300", contato: "RECEPÇÃO" } ],
  "Guararema": [ { nome: "RECANTO DAS ACACIAS", km: 25.0, foraDaRota: 0.0, fone: "(11)99972-5212", contato: "TANIAH" }, { nome: "RECANTO CHEIO DE CHEIRO", km: 25.0, foraDaRota: 0.0, fone: "(11)99959-4186", contato: "REGIANE" }, { nome: "CASA MARIA FUMAÇA", km: 26.0, foraDaRota: 0.2, fone: "(11)991695-2087", contato: "EMILIA" }, { nome: "HOSPEDARIA SÃO BENEDITO", km: 26.6, foraDaRota: 0.4, fone: "(11)97217-9138", contato: "PADRE BIRA" }, { nome: "POUSADA CALIL", km: 26.6, foraDaRota: 0.9, fone: "(11)95311-0920", contato: "ELAINE" }, { nome: "POUSADA SAPUCAIA", km: 26.6, foraDaRota: 2.1, fone: "(11)97221-6812", contato: "DANIEL" }, { nome: "CASA DO VALE", km: 27.6, foraDaRota: 0.7, fone: "(11)97451-0454", contato: "SHEILA" }, { nome: "CENTRO DE APOIO D'AJUDA", km: 27.9, foraDaRota: 0.0, fone: "(11)97392-4192", contato: "MARIA NEVES" } ],
  "Santa Branca": [ { nome: "ESPAÇO MANGANAGUA", km: 36.5, foraDaRota: 0.0, fone: "(11)97302-0535", contato: "JOSE" }, { nome: "CHÁCARA MIRANTE DO RIO", km: 45.5, foraDaRota: 0.0, fone: "(12)99622-4810", contato: "FÁTIMA" }, { nome: "POUSADA PEDALAMOS CICLOTURISMO", km: 46.0, foraDaRota: 0.08, fone: "(12)98162-6122", contato: "PEDRO CAMPOS" }, { nome: "POUSADA CORAÇÃO PEREGRINO", km: 46.3, foraDaRota: 0.015, fone: "(12)99792-7116", contato: "ANA CAROLINA" }, { nome: "POUSADA REMANSO ROTA DA LUZ", km: 46.3, foraDaRota: 0.02, fone: "(12)99761-9794", contato: "MARIA JOSE" }, { nome: "HOSPEDAGEM JASMO", km: 46.4, foraDaRota: 0.35, fone: "(12)99764-8346", contato: "JASMO" }, { nome: "HOSTEL GARDEN ALBUQUERQUE", km: 46.6, foraDaRota: 2.0, fone: "(12)99147-6194", contato: "RECEPÇÃO" }, { nome: "CHACARA CAMBUCI HOSPEDADGEM", km: 46.6, foraDaRota: 2.0, fone: "(12)98122-1519", contato: "GU BRAGA" }, { nome: "SITIO REMANSO DO VALE", km: 46.6, foraDaRota: 4.0, fone: "(12)99761-9794", contato: "MARIA JOSE" }, { nome: "POUSADA SANTA JULIA", km: 53.0, foraDaRota: 0.0, fone: "(12)98221-9558", contato: "MARCOS" }, { nome: "POUSADA SITIO DO VALDIR", km: 55.1, foraDaRota: 0.0, fone: "(12)99612-4564", contato: "VALDIR" } ],
  "Paraibuna": [ { nome: "POUSADA SITIO RECANTO DAS FLORES", km: 82.7, foraDaRota: 3.7, fone: "(12)99105-4807", contato: "VERA" }, { nome: "POUSADA VILA DE LUCA", km: 83.1, foraDaRota: 0.0, fone: "(12)99657-9363", contato: "RECEPÇÃO" }, { nome: "POUSADA NATHALIA CANELLA", km: 83.1, foraDaRota: 7.0, fone: "(12)99605-6263", contato: "NATHALIA" }, { nome: "POUSADA TRES RIOS", km: 83.1, foraDaRota: 0.45, fone: "(11)99425-5286", contato: "ANA MARIA" }, { nome: "POUSADA RECANTO BOA VENTURA", km: 91.7, foraDaRota: 0.0, fone: "(12)98814-9940", contato: "PAULO/Neuza" }, { nome: "POUSADA CAXAMBU", km: 92.0, foraDaRota: 0.0, fone: "(12)98836-9937", contato: "CLEBER" }, { nome: "RANCHO NOSSA SENHORA APARECIDA", km: 93.0, foraDaRota: 0.0, fone: "(12)99735-7114", contato: "NEIDE" }, { nome: "RENAISSANCE CHALÉS", km: 96.3, foraDaRota: 0.0, fone: "(11)93008-0331", contato: "ELIZETE" } ],
  "Redenção da Serra": [ { nome: "POUSADA DOS PEREIRAS", km: 108.0, foraDaRota: 0.0, fone: "(12)99721-8999", contato: "DANIEL" }, { nome: "POUSADA DA MARLENE", km: 111.7, foraDaRota: 0.0, fone: "(12)99709-4837", contato: "MARLENE" }, { nome: "RECANTO BELA VISTA", km: 111.7, foraDaRota: 6.2, fone: "(12)99611-8522", contato: "ANTONIO" }, { nome: "POUSADA ROTA DA FÉ", km: 113.1, foraDaRota: 0.15, fone: "(12)99143-9362", contato: "REGINA" }, { nome: "POUSADA DO JAPONES", km: 114.1, foraDaRota: 0.0, fone: "(11)99143-8855", contato: "MICHELE" }, { nome: "POUSADA DO LOUZADA", km: 111.7, foraDaRota: 3.8, fone: "(12)99749-2003", contato: "LOUZADA" }, { nome: "POUSADA DO INACIO", km: 114.0, foraDaRota: 0.0, fone: "(12)99769-5497", contato: "DANI" }, { nome: "RANCHO DOS PÁSSAROS", km: 114.4, foraDaRota: 0.0, fone: "(12)99731-1196", contato: "CARLINHOS" }, { nome: "POUSADA PRIMAVERA", km: 114.6, foraDaRota: 0.0, fone: "(12)98835-0552", contato: "RICARDO" } ],
  "Taubaté": [ { nome: "FAZENDA BOA ESPERANÇA", km: 142.0, foraDaRota: 2.8, fone: "(12)99726-8225", contato: "ADRIANA" }, { nome: "POUSADA PARADA DA ROTA", km: 144.9, foraDaRota: 0.2, fone: "(12)99131-4248", contato: "JANDIRO" }, { nome: "HOTEL SAN MICHEL", km: 146.4, foraDaRota: 1.2, fone: "(12)99158-8718", contato: "RECEPÇÃO" }, { nome: "HOTEL SÃO NICOLAU", km: 146.8, foraDaRota: 1.1, fone: "(12)99141-0653", contato: "RECEPÇÃO" }, { nome: "POUSADA PRIMAVERA TAUBATÉ", km: 146.4, foraDaRota: 1.2, fone: "(12)3632-1313", contato: "MARILAH" }, { nome: "CARLTON PLAZA BAOBA", km: 146.8, foraDaRota: 2.1, fone: "(12)99702-5754", contato: "VIVIAN" } ],
  "Pindamonhangaba": [ { nome: "SITIO 4 MILHAS", km: 167.5, foraDaRota: 0.0, fone: "(12)99728-7044", contato: "HELEN ROSE" }, { nome: "SAGRADO CORAÇÕES", km: 171.1, foraDaRota: 0.5, fone: "(12)99760-2310", contato: "RECEPÇÃO" }, { nome: "PIRAPOUL HOTEL", km: 171.1, foraDaRota: 1.9, fone: "(12)99794-2605", contato: "RECEPÇÃO" }, { nome: "RECANTO MONA", km: 171.1, foraDaRota: 2.0, fone: "(12)99103-6112", contato: "GLAUCIA" }, { nome: "VALE HOSTEL", km: 171.1, foraDaRota: 2.2, fone: "(12)99102-7709", contato: "MICHELI" }, { nome: "PINDA PLAZA HOTEL", km: 172.6, foraDaRota: 0.0, fone: "(12)99627-8080", contato: "RECEPÇÃO" }, { nome: "POLIS HOTEL", km: 176.0, foraDaRota: 0.2, fone: "(12)3641-2249", contato: "RECEPÇÃO" } ],
  "Aparecida": [ { nome: "POUSADA SANTINHA", km: 188.5, foraDaRota: 0.0, fone: "(12)3646-3000", contato: "RECEPÇÃO" }, { nome: "APARECIDA HOTEL", km: 194.0, foraDaRota: 0.0, fone: "(12)3105-7015", contato: "RECEPÇÃO" }, { nome: "HOTEL BENFICA", km: 196.5, foraDaRota: 0.0, fone: "(12)3105-2794", contato: "RECEPÇÃO" }, { nome: "POUSADA JOVIMAR", km: 197.0, foraDaRota: 0.0, fone: "(12)99631-4234", contato: "THALITA" }, { nome: "POUSADA ITAGUAÇU", km: 198.5, foraDaRota: 0.0, fone: "(12)98845-5475", contato: "FELIPE" }, { nome: "HOTEL SÃO RAFAEL", km: 198.9, foraDaRota: 0.0, fone: "(12)98312-9384", contato: "EVERSON" }, { nome: "HOTEL SANTO AFONSO", km: 200.0, foraDaRota: 0.0, fone: "(12)99667-7415", contato: "RECEPÇÃO" } ]
};
const etapasData = [
  { id: 1, titulo: "Etapa 1: Mogi das Cruzes a Guararema", cidadeOrigem: "Mogi das Cruzes", cidadeDestino: "Guararema", distancia: "24 km", pontoReferenciaInicio: ["Estação Estudantes", "Praça do Terminal Rodoviário Geraldo Scavone"], pontoReferenciaTermino: ["Estação Ferroviária de Guararema"], cidadesDaEtapa: [ { nome: "Mogi das Cruzes", url: "https://www.mogidascruzes.sp.gov.br/" }, { nome: "Guararema", url: "https://guararema.sp.gov.br/turismo" } ], mapaUrl: "https://www.google.com/maps/dir/Estação+Estudantes+-+Mogi+das+Cruzes,+SP/Estação+Ferroviária+de+Guararema+-+Guararema,+SP", altimetriaImgUrl: "/altimetria-etapa-1.jpg", tempoEstimado: "5h 24min", paradaRefeicao: "90min",
    itinerario: [ "Siga para leste na R. Prof. Álvaro Pavan em direção à Av. Gov. Adhemar de Barros.",
      "Vire à direita na Av. Francisco Rodrigues Filho/Rod. Henrique Eroles e siga por aproximadamente 16 km, passando por Sabaúna.",
      "Na rotatória em Sabaúna, pegue a 2ª saída para a Estr. Mun. Argemiro de Souza Melo.",
      "Continue na Estr. Mun. Romeu Tanganelli e depois na R. Padre Cícero.",
      "Vire à direita na R. Cel. Ramalho, chegando à Estação Ferroviária de Guararema." ],
    pontosDeApoio: [ { nome: "Lanchonete na Rodoviária", km: "Início", tipo: "Lanchonete" }, { nome: "Habbib's", km: "0", tipo: "Restaurante" }, { nome: "Padaria Santo Trigo", km: "0", tipo: "Padaria" }, { nome: "Padaria 2B", km: "11,9", tipo: "Padaria" }, { nome: "Restaurante Lucia", km: "11,9", tipo: "Restaurante" }, { nome: "Bica D'agua Santo Alberto", km: "14", tipo: "Ponto de Água" }, { nome: "Estação Ferroviária Luiz Carlos (Vila Turística)", km: "17", tipo: "Comércio diverso" }, { nome: "Mercado do Gomes", km: "25,9", tipo: "Mercado" }, ],
    altimetria: "O trajeto começa em área urbana e segue para estradas de terra com ondulações suaves. A maior parte do percurso é plana, com algumas subidas e descidas leves, característico da transição da serra para o vale.",
    dificuldades: [ "Longo trecho em estrada de asfalto no início, o que pode ser desgastante.", "Trechos rurais com menor infraestrutura e pontos de apoio.", "Sinal de celular pode ser instável em áreas mais afastadas." ],
    recomendacoes: [ "Comece cedo para evitar o sol forte.", "Use calçados confortáveis e já amaciados.", "Leve um chapéu ou boné e aplique protetor solar." ],
    oQueLevar: "Leve no mínimo 2 litros de água, frutas (banana, maçã), barras de cereal, castanhas e um sanduíche leve. Ideal para se reabastecer nos comércios em Sabaúna (km 11,9)."
  },
  { id: 2, titulo: "Etapa 2: Guararema a Santa Branca", cidadeOrigem: "Guararema", cidadeDestino: "Santa Branca", distancia: "21.6 km", pontoReferenciaInicio: ["Estação Ferroviária de Guararema"], pontoReferenciaTermino: ["Praça Matriz de Santa Branca"], cidadesDaEtapa: [ { nome: "Guararema", url: "https://guararema.sp.gov.br/turismo" }, { nome: "Santa Branca", url: "https://www.santabranca.sp.gov.br/turismo" } ], mapaUrl: "https://www.google.com/maps/dir/Estação+Ferroviária+de+Guararema+-+Guararema,+SP/Praça+Matriz+de+Santa+Branca+-+Santa+Branca,+SP", altimetriaImgUrl: "/altimetria-etapa-2.jpg", tempoEstimado: "5h 11min", paradaRefeicao: "90min",
    itinerario: [ "Siga pela Rua da Ajuda e continue para a Estr. Mun. Dr. Hércules Campagnoli.",
      "Percorra a estrada principal, que é em grande parte de terra, por áreas rurais.",
      "Ao se aproximar de Santa Branca, a estrada se torna pavimentada.",
      "Entre na cidade e siga pela R. Brigadeiro Aguiar e depois R. Maj. Goulart até chegar à Praça Matriz." ],
    pontosDeApoio: [ { nome: "Lanchonete Santa Rita", km: "26,6", tipo: "Lanchonete" }, { nome: "Padaria Manhãs do Sol", km: "27,7", tipo: "Padaria" }, { nome: "Restaurante 2 Irmãos", km: "27,75", tipo: "Restaurante" }, { nome: "Mercadinho Campagnoli", km: "29,2", tipo: "Mercado" }, { nome: "Bar do Fábio", km: "33,3", tipo: "Bar" }, { nome: "Mercado Cafeteria Beija-Flor", km: "36,5", tipo: "Mercado/Cafeteria" }, ],
    altimetria: "Esta etapa apresenta maior variação de altitude, com subidas e descidas mais acentuadas em estradas de terra. É um trecho que exige mais fisicamente, passando por áreas de mata e fazendas.",
    dificuldades: [ "Distância longa combinada com altimetria desafiadora.", "Trechos de estrada de terra que podem ter lama ou poeira, dependendo do tempo.", "Isolamento maior, com menos pontos de apoio diretos na rota." ],
    recomendacoes: [ "Use bastões de caminhada para ajudar nas subidas e dar estabilidade nas descidas.", "Gerencie bem sua energia e faça pausas curtas para descanso.", "Certifique-se de que sua mochila está bem ajustada para evitar desconforto." ],
    oQueLevar: "Essencial levar mais água (cerca de 3 litros). Reforce a alimentação com carboidratos de absorção lenta (sanduíches integrais), e tenha à mão alimentos energéticos como rapadura, chocolate amargo e frutas secas."
  },
  { id: 3, titulo: "Etapa 3: Santa Branca a Paraibuna", cidadeOrigem: "Santa Branca", cidadeDestino: "Paraibuna", distancia: "40.5 km", pontoReferenciaInicio: ["Praça Matriz de Santa Branca"], pontoReferenciaTermino: ["Ponte do Vigor"], cidadesDaEtapa: [ { nome: "Santa Branca", url: "https://www.santabranca.sp.gov.br/turismo" }, { nome: "Paraibuna", url: "https://www.paraibuna.sp.gov.br/turismo" } ], mapaUrl: "https://www.google.com/maps/dir/Praça+Matriz+de+Santa+Branca+-+Santa+Branca,+SP/Ponte+do+Vigor+-+Paraibuna,+SP", altimetriaImgUrl: "/altimetria-etapa-3.jpg", tempoEstimado: "9h 30min", paradaRefeicao: "90min",
    itinerario: [ "Saia da Praça Matriz e siga em direção à zona rural pela Estr. de Santa Branca.",
      "O caminho segue majoritariamente por estradas de terra que contornam a represa de Paraibuna.",
      "O percurso é longo e com muitas curvas, passando por diversas propriedades rurais.",
      "Continue seguindo a sinalização da Rota da Luz até chegar à Ponte do Vigor, sobre um dos braços da represa." ],
    pontosDeApoio: [ { nome: "Bar do Fim do Mundo", km: "42", tipo: "Bar" }, { nome: "Restaurante Fogo de Ouro", km: "43,3", tipo: "Restaurante" }, { nome: "Restaurante Vilela", km: "45", tipo: "Restaurante" }, { nome: "Padaria Sol Nascente", km: "45", tipo: "Padaria" }, { nome: "Café do Peregrino", km: "46,8", tipo: "Cafeteria" }, { nome: "Pesqueiro Agua Limpa", km: "54,1", tipo: "Pesqueiro/Restaurante" }, ],
    altimetria: "O percurso segue o contorno da represa de Paraibuna, apresentando muitas curvas e um sobe e desce constante. As paisagens são o destaque, mas a irregularidade do terreno exige atenção.",
    dificuldades: [ "Trechos com acostamento estreito ou inexistente em estradas vicinais.", "O sobe e desce constante pode ser cansativo.", "A travessia de pontes e trechos próximos à rodovia principal requer cuidado." ],
    recomendacoes: [ "Aprecie a vista da represa, um dos pontos altos da Rota.", "Caminhe pela contramão para melhor visualização dos veículos.", "Planeje sua parada principal na cidade de Paraibuna, que tem boa estrutura." ],
    oQueLevar: "Mantenha a hidratação. É uma boa etapa para levar isotônicos para repor os sais minerais. Leve lanches práticos, pois a maior parte dos pontos de apoio se concentra no final da etapa, já em Paraibuna."
  },
  { id: 4, titulo: "Etapa 4: Paraibuna a Redenção da Serra", cidadeOrigem:"Paraibuna", cidadeDestino: "Redenção da Serra", distancia: "31.6 km", pontoReferenciaInicio: ["Ponte do Vigor"], pontoReferenciaTermino: ["Estátua Monumento da Abolição"], cidadesDaEtapa: [ { nome: "Paraibuna", url: "https://www.paraibuna.sp.gov.br/turismo" }, { nome: "Redenção da Serra", url: "https://www.redencaodaserra.sp.gov.br/turismo" } ], mapaUrl: "https://www.google.com/maps/dir/Ponte+do+Vigor+-+Paraibuna,+SP/Estátua+Monumento+da+Abolição+-+Redenção+da+Serra,+SP", altimetriaImgUrl: "/altimetria-etapa-4.jpg", tempoEstimado: "7h 40min", paradaRefeicao: "90min",
    itinerario: [  "A partir da Ponte do Vigor, siga pela Estr. do Itapeva.",
      "Continue pela Estr. Bairro Bragança, um longo trecho rural com subidas e descidas.",
      "O caminho passará por áreas de pasto e eucalipto.",
      "Ao chegar em Redenção da Serra, siga pela Estr. Mun. Paraibuna e R. Cel. Manoel Bento até o centro.",
      "O ponto final é a Estátua Monumento da Abolição." ],
    pontosDeApoio: [ { nome: "Mercadinho Piratininga", km: "82,9", tipo: "Mercado" }, { nome: "Restaurante Caxambú", km: "83", tipo: "Restaurante" }, { nome: "Restaurante Serra de Paraibu", km: "83", tipo: "Restaurante" }, { nome: "Empório Itapeva", km: "83,3", tipo: "Empório" }, { nome: "Mercado Municipal Paraibuna", km: "83,2", tipo: "Mercado" }, { nome: "Bar do Torresmo", km: "88", tipo: "Bar" }, { nome: "Mercadinho do Dinho", km: "91", tipo: "Mercado" }, ],
    altimetria: "Etapa longa e considerada uma das mais difíceis em termos de altimetria. Há subidas longas e íngremes, especialmente na primeira metade, seguidas por descidas que também exigem esforço. O ganho de elevação é significativo.",
    dificuldades: [ "A mais longa de todas as etapas.", "Altimetria exigente, com subidas que testam o preparo físico.", "Poucos pontos de apoio entre a saída de Paraibuna e a chegada em Redenção da Serra." ],
    recomendacoes: [ "Esta é a etapa 'rainha'. Comece o mais cedo possível.", "Controle o ritmo desde o início para não se esgotar nas primeiras subidas.", "Aproveite a chegada à 'cidade velha' de Redenção da Serra, um local de grande valor histórico e beleza." ],
    oQueLevar: "É o dia para a mochila mais abastecida. Aumente a quantidade de água para 3-4 litros. Leve comida suficiente para duas refeições (além dos lanches), como sanduíches reforçados, macarrão de pote (se tiver como aquecer) ou comida liofilizada."
  },
  { id: 5, titulo: "Etapa 5: Redenção da Serra a Taubaté", cidadeOrigem:"Redenção da Serra", cidadeDestino: "Taubaté", distancia: "33.6 km", pontoReferenciaInicio: ["Estátua Monumento da Abolição"], pontoReferenciaTermino: ["Igreja Nossa Senhora da Imaculada Conceição"], cidadesDaEtapa: [ { nome: "Redenção da Serra", url: "https://www.redencaodaserra.sp.gov.br/turismo" }, { nome: "Taubaté", url: "https://www.taubate.sp.gov.br/" } ], mapaUrl: "https://www.google.com/maps/dir/Estátua+Monumento+da+Abolição+-+Redenção+da+Serra,+SP/Igreja+Nossa+Senhora+da+Imaculada+Conceição+-+Taubaté,+SP", altimetriaImgUrl: "/altimetria-etapa-5.jpg", tempoEstimado: "8h 06min", paradaRefeicao: "90min",
    itinerario: [ "Siga para o sul e pegue a Rod. Maj. Gabriel Ortiz Monteiro.",
      "Continue pela Estr. Mun. Jambeiro e Estr. Bairro da Samambaia, descendo a serra.",
      "O percurso passa por áreas rurais e de agricultura.",
      "Continue pela Estr. do morro grande e Estr. Antônio de Angelis, aproximando-se da área urbana de Taubaté.",
      "Ao chegar em Taubaté, siga pela R. Imaculada Conceição até a Igreja." ],
    pontosDeApoio: [ { nome: "Restaurante Paraiso", km: "111,7", tipo: "Restaurante" }, { nome: "Bar do Pescador", km: "113", tipo: "Bar" }, { nome: "Armazem Na. Sra. Aparecida", km: "125,7", tipo: "Armazém" }, { nome: "Cafeteria Maetá", km: "140,5", tipo: "Cafeteria" }, ],
    altimetria: "O percurso começa a descer a serra em direção ao Vale do Paraíba. Predominam as descidas, algumas longas e contínuas, em estradas de terra. O cenário muda, tornando-se mais rural e agrícola à medida que se aproxima de Taubaté.",
    dificuldades: [ "Descidas longas podem sobrecarregar os joelhos e a parte da frente dos pés.", "A transição para a área mais urbanizada de Taubaté pode ter tráfego de veículos.", "O calor tende a ser mais intenso no vale." ],
    recomendacoes: [ "Use bastões de caminhada para aliviar o impacto nas descidas.", "Faça alongamentos focados nos músculos da panturrilha e coxa.", "Atenção redobrada ao entrar em vias mais movimentadas perto do destino." ],
    oQueLevar: "A hidratação continua sendo chave. Como a etapa tem mais descidas, o desgaste é diferente. Leve alimentos leves e de fácil digestão. Aproveite os pontos de apoio no caminho, que começam a ficar mais frequentes."
  },
  { id: 6, titulo: "Etapa 6: Taubaté a Pindamonhangaba", cidadeOrigem:"Taubaté", cidadeDestino: "Pindamonhangaba", distancia: "21.2 km", pontoReferenciaInicio: ["Igreja Nossa Senhora da Imaculada Conceição"], pontoReferenciaTermino: ["Parque da Cidade"], cidadesDaEtapa: [ { nome: "Taubaté", url: "https://www.taubate.sp.gov.br/" }, { nome: "Pindamonhangaba", url: "https://www.pindamonhangaba.sp.gov.br/" } ], mapaUrl: "https://www.google.com/maps/dir/Igreja+Nossa+Senhora+da+Imaculada+Conceição+-+Taubaté,+SP/Parque+da+Cidade+-+Pindamonhangaba,+SP", altimetriaImgUrl: "/altimetria-etapa-6.jpg", tempoEstimado: "4h 50min", paradaRefeicao: "90min",
    itinerario: [  "Saia da igreja e siga pelas ruas do distrito de Quiririm.",
      "Pegue a Rod. Amador Bueno da Veiga (SP-103) em direção a Pindamonhangaba.",
      "O trajeto segue por áreas urbanas e industriais, paralelas à Rodovia Presidente Dutra.",
      "Ao entrar em Pindamonhangaba, siga as avenidas principais até chegar ao Parque da Cidade." ],
    pontosDeApoio: [ { nome: "Mercado Panorama", km: "146,2", tipo: "Mercado" }, { nome: "Padaria Campos Elíseos", km: "146,4", tipo: "Padaria" }, { nome: "Empório Ipiranga", km: "146,9", tipo: "Empório" }, { nome: "Padaria Paraíso Taubaté", km: "154,1", tipo: "Padaria" }, { nome: "Supermercado Regina", km: "158,2", tipo: "Supermercado" }, { nome: "Apoio Sr. Paulo/Dona Dolores", km: "161,5", tipo: "Ponto de Apoio" }, { nome: "Restaurante do Paizão", km: "162", tipo: "Restaurante" }, ],
    altimetria: "Etapa predominantemente plana, atravessando o coração do Vale do Paraíba. O percurso intercala áreas urbanas, rurais e industriais. É uma caminhada de 'ligação' entre as duas cidades, sem grandes desafios de elevação.",
    dificuldades: [ "Monotonia do terreno plano para alguns peregrinos.", "Longos trechos sob o sol, com poucas sombras.", "Atravessar áreas urbanas com trânsito e ruído." ],
    recomendacoes: [ "É uma etapa para reflexão, aproveitando a paisagem plana e a proximidade do destino final.", "Mantenha um ritmo constante.", "Aproveite a grande oferta de comércio para se reabastecer ou fazer uma refeição mais completa." ],
    oQueLevar: "A necessidade de carregar muita coisa diminui. Leve água, mas saiba que encontrará muitos pontos de venda. Lanches leves são suficientes. É um bom dia para tomar um caldo de cana ou açaí em algum comércio local."
  },
  { id: 7, titulo: "Etapa Final: Pindamonhangaba a Aparecida", cidadeOrigem: "Pindamonhangaba", cidadeDestino: "Aparecida", distancia: "28.7 km", pontoReferenciaInicio: ["Parque da Cidade"], pontoReferenciaTermino: ["Entrada Principal do Santuário de Aparecida"], cidadesDaEtapa: [ { nome: "Pindamonhangaba", url: "https://www.pindamonhangaba.sp.gov.br/" }, { nome: "Aparecida", url: "https://www.aparecida.sp.gov.br/portal/turismo/" } ], mapaUrl: "https://www.google.com/maps/dir/Parque+da+Cidade+-+Pindamonhangaba,+SP/Santuário+Nacional+de+Nossa+Senhora+Aparecida+-+Aparecida,+SP", altimetriaImgUrl: "/altimetria-etapa-7.jpg", tempoEstimado: "6h 30min", paradaRefeicao: "90min",
    itinerario: [ "Saia do Parque da Cidade e siga em direção à Rod. Ver. Abel Fabrício Dias.",
      "Continue pela Rod. Antiga SP-66, também conhecida como Rota dos Romeiros.",
      "Este trecho é praticamente todo plano e segue paralelo à Rodovia Presidente Dutra.",
      "O caminho passará pela cidade de Roseira antes de chegar a Aparecida.",
      "Ao entrar em Aparecida, siga as placas em direção ao Santuário Nacional." ],
    pontosDeApoio: [ { nome: "Caldo de Cana do Japa", km: "186,5", tipo: "Lanchonete" }, { nome: "Pesqueiro Restaurante A Familia", km: "188", tipo: "Restaurante" }, { nome: "Pousada Jovimar", km: "197", tipo: "Pousada/Apoio" }, { nome: "Santuário de Aparecida", km: "201", tipo: "Destino Final com ampla estrutura" }, ],
    altimetria: "A última etapa é majoritariamente plana, seguindo a 'Rota dos Romeiros' paralela à Via Dutra. O caminho é bem demarcado e o terreno não oferece dificuldades. A emoção de se aproximar do Santuário é o grande motivador.",
    dificuldades: [ "Ansiedade e cansaço acumulado podem pesar.", "O trecho final dentro de Aparecida pode ser movimentado, com grande fluxo de pessoas e veículos.", "O sol forte em um caminho com pouca sombra." ],
    recomendacoes: [ "Saboreie cada passo da reta final. A jornada está terminando.", "Hidrate-se bem, mesmo na euforia da chegada.", "Ao avistar a Basílica, pare por um momento para agradecer e refletir sobre sua peregrinação.", "No Santuário, procure o 'Apoio ao Turista' para informações." ],
    oQueLevar: "Leve o essencial: água, um lanche rápido e seus documentos. O foco do dia não é o esforço físico, mas a conclusão espiritual e emocional da jornada. Carregue principalmente gratidão no coração."
  }
];

// --- COMPONENTES ---
const Card = ({ icon: Icon, title, children, colorClass }) => (
  <div className="bg-white rounded-xl shadow-md overflow-hidden mb-6">
    <div className={`p-4 ${colorClass} text-white flex items-center`}>
      <Icon className="h-6 w-6 mr-3" />
      <h3 className="text-lg font-bold">{title}</h3>
    </div>
    <div className="p-6 text-gray-700 leading-relaxed">{children}</div>
  </div>
);

const GeminiCard = ({ title, icon: Icon, isLoading, content, onGenerate, buttonText, isOnline }) => (
    <div className="bg-gradient-to-br from-blue-50 to-indigo-100 rounded-xl shadow-md overflow-hidden mb-6">
        <div className="p-4 bg-black bg-opacity-5 flex items-center">
            <Icon className="h-6 w-6 mr-3 text-indigo-600" />
            <h3 className="text-lg font-bold text-indigo-800">{title}</h3>
        </div>
        <div className="p-6">
            {!isOnline ? ( <div className="text-center text-gray-600"><WifiOff className="mx-auto h-8 w-8 mb-2" /><p>Funcionalidade indisponível offline.</p></div> ) : (
                <>
                    {isLoading && <div className="flex justify-center items-center"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-500"></div></div>}
                    {content && <div className="text-gray-800 leading-relaxed whitespace-pre-wrap">{content}</div>}
                    {!isLoading && !content && (
                        <button onClick={onGenerate} className="w-full flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all">
                            <Sparkles className="h-5 w-5 mr-2" />{buttonText}
                        </button>
                    )}
                </>
            )}
        </div>
    </div>
);


const PeregrinoIA = ({ isOnline, callGeminiAPI }) => {
  const [pergunta, setPergunta] = useState('');
  const [resposta, setResposta] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [nome, setNome] = useState('');
  const [contato, setContato] = useState('');
  const suggestedTopics = [ "Apresentação da Rota da Luz", "Como planejar a peregrinação", "Basílica de Nossa Senhora da Aparecida", "Informações contidas nesse App", ];
  const [currentTopicIndex, setCurrentTopicIndex] = useState(0);
  const [isFading, setIsFading] = useState(false);
  const [estaFalando, setEstaFalando] = useState(false);
  const [audio, setAudio] = useState(null); 
  const [isLoadingAudio, setIsLoadingAudio] = useState(false);

  useEffect(() => {
    if (!isLoading && !resposta) {
      const intervalId = setInterval(() => {
        setIsFading(true);
        setTimeout(() => {
          setCurrentTopicIndex(prevIndex => (prevIndex + 1) % suggestedTopics.length);
          setIsFading(false);
        }, 500);
      }, 3500);
      return () => clearInterval(intervalId);
    }
  }, [isLoading, resposta]);

  const handleClear = () => {
    setPergunta(''); setResposta(''); setNome(''); setContato('');
    if (audio) audio.pause(); // Adicionado para parar o áudio
    window.speechSynthesis.cancel();
    setEstaFalando(false);
  };

  const handleVoiceInput = () => {
      // Adiciona uma verificação para Firefox (desktop) e FxiOS (iOS)
    const userAgent = navigator.userAgent.toLowerCase();
    if (userAgent.includes('firefox') || userAgent.includes('fxios')) {
      alert("O recurso de voz não é totalmente compatível com o Firefox. Para a melhor experiência, por favor, utilize o Google Chrome ou Safari. A pergunta ao Peregrino IA pode ser digitada.");
      return;
    }
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    // A verificação original para outros navegadores sem suporte continua útil
    if (!SpeechRecognition) {
      alert("Desculpe, seu navegador não suporta a entrada por voz.");
      return;
    }
   
  const recognition = new SpeechRecognition();
    recognition.lang = 'pt-BR';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;
    setIsListening(true);
    setPergunta('Ouvindo...');
    recognition.onresult = (event) => {
      const speechToText = event.results[0][0].transcript;
      setPergunta(speechToText);
      setIsListening(false);
      recognition.stop();
    };
    recognition.onspeechend = () => {
      if(isListening) { setIsListening(false); recognition.stop(); }
    };
    recognition.onerror = (event) => {
      console.error("Erro no reconhecimento de voz:", event.error);
      if (event.error !== 'no-speech') { setPergunta(''); }
      setIsListening(false);
    };
    recognition.start();
  };

  const handleSpeakResponse = async (textToSpeak) => {
    if ((estaFalando || isLoadingAudio) && audio) {
      audio.pause();
      setEstaFalando(false);
      setIsLoadingAudio(false);
      return;
    }
    
    setIsLoadingAudio(true); // Ativa o spinner imediatamente
    
    try {
      const response = await fetch('/api/generate-audio', {
        method: 'POST',
        body: JSON.stringify({ text: textToSpeak })
      });

      if (!response.ok) {
        throw new Error('Falha ao gerar o áudio no backend.');
      }

      const audioBlob = await response.blob();
      const audioUrl = URL.createObjectURL(audioBlob);
      const newAudio = new Audio(audioUrl);
      setAudio(newAudio);
      
      // Espera o áudio estar pronto para tocar
      newAudio.oncanplaythrough = () => {
        setIsLoadingAudio(false); // Desativa o spinner
        setEstaFalando(true);     // Ativa a animação
        setTimeout(() => {
          newAudio.play();
        }, 250); // Atraso de 150 milissegundos
      };
      
      newAudio.onended = () => setEstaFalando(false);
      newAudio.onerror = () => {
        console.error("Erro ao tocar o áudio.");
        setEstaFalando(false);
        setIsLoadingAudio(false);
      };

    } catch (error) {
      console.error("Erro na função handleSpeakResponse:", error);
      alert("Desculpe, ocorreu um erro ao tentar gerar a voz.");
      setEstaFalando(false);
      setIsLoadingAudio(false);
    }
  };
  
  const handlePerguntar = async (question) => {
    if (!question.trim()) return;
    setIsLoading(true);
    setResposta('');
    if (audio) audio.pause();
    window.speechSynthesis.cancel();
    setEstaFalando(false);
        
    const prompt = `
      Você é o 'Peregrino IA', um especialista amigável e experiente sobre a Rota da Luz no Estado de São Paulo.
      Use o seguinte CONTEXTO para basear suas respostas:
      - Apresentação da Rota da Luz: Olá peregrino me chamo Antonio e sou voluntário da Associação dos Amigos da Rota da Luz, neste site você vai conhecer esse caminho que além das belezas naturais, tem Anjos que vão te acolher e cuidar de você, se você quer apenas conhecer a Rota da Luz por curiosidade, Bem vindo, mas se você quer conhecer pensando em ser um peregrino, vou te ajudar a planejar a sua peregrinação com muitas dicas e informações. Deixa eu te contar um pouco da história desse caminho: A Rota da Luz tem 201 Km, o tempo ideal pra percorrer a pé é de 7 dias, a média de caminhada por dia é de 30 Km. Sim, que ter preparo físico e também psicológico.
      - A Basílica de Nossa Senhora Aparecida, também conhecida como Santuário Nacional de Aparecida, é o maior santuário mariano do mundo e um importante centro de peregrinação religiosa no Brasil. Sua história está intrinsecamente ligada à descoberta da imagem de Nossa Senhora Aparecida no rio Paraíba do Sul, em 1717.
      - A imagem de Nossa Senhora Aparecida, inicialmente encontrada no rio, foi peça central na construção da devoção e da Basílica/Santuário. Ela é um símbolo da fé católica no Brasil e foi proclamada Padroeira do Brasil em 1930.
      - Este App oferece duas importantes ajudas aos peregrinos: A primeira delas está relacionada ao Módulo Pergunte ao Peregrino, no qual é possível tirar muitas dúvidas e obter conhecimentos importantes para serem utilizados na peregrinação da Rota da Luz o segundo Módulo proporciona ao peregrino a possibilidade de fazer um planejamento personalizado escolhendo o período da jornada, suas hospedagens e obter informações como a distância a ser percorrida a meteorologia baseada em médias históricas, acessar cards específicos de cada Etapa e conhecer as suas particularidades, como altimetria, pontos de apoio, dicas e desafios.  
      - A Rota da Luz é uma rota de peregrinação sinalizada no estado de São Paulo, Brasil.
      - Ela começa em Mogi das Cruzes e termina no Santuário Nacional de Aparecida.
      - A distância total é de aproximadamente 201 km, divididos em 7 etapas.
      - Não é recomendado fazer a Rota da Luz a pé em menos de 7 dias.
      - É recomendado que as caminhadas de peregrinação ocorram somente durante o dia.
      - O objetivo é oferecer uma alternativa segura para peregrinos que iam pela Rodovia Presidente Dutra.
      - A rota passa por 9 municípios: Mogi das Cruzes, Guararema, Santa Branca, Paraibuna, Redenção da Serra, Taubaté, Pindamonhangaba, Roseira e Aparecida.
      - A rota NÃO PASSA pela cidade de São Paulo. Ela percorre áreas rurais, cidades do interior e trechos da Serra do Mar.
      - A credencial oficial do peregrino pode ser retirada em Mogi das Cruzes.
      - É recomendado ter um bom preparo físico, especialmente para a etapa de Redenção da Serra.
      - Segue as hospedagens(hotel e pousada) por cidades: "Mogi das Cruzes": [ { nome: "IBIS HOTEL", km: 0.0, foraDaRota: 0.4, fone: "(11)2813-3800", contato: "WHATSAPP" }, { nome: "POUSADA WG CARVALHO", km: 0.0, foraDaRota: 0.7, fone: "(11)4791-3216", contato: "WILSON" }, { nome: "POUSADA TOKIO PLAZA", km: 0.0, foraDaRota: 1.2, fone: "(11)94203-1000", contato: "RECEPÇÃO" }, { nome: "HOTEL MALBOR", km: 0.0, foraDaRota: 2.2, fone: "(11)4735-7300", contato: "RECEPÇÃO" } ],
        "Guararema": [ { nome: "RECANTO DAS ACACIAS", km: 25.0, foraDaRota: 0.0, fone: "(11)99972-5212", contato: "TANIAH" }, { nome: "RECANTO CHEIO DE CHEIRO", km: 25.0, foraDaRota: 0.0, fone: "(11)99959-4186", contato: "REGIANE" }, { nome: "CASA MARIA FUMAÇA", km: 26.0, foraDaRota: 0.2, fone: "(11)991695-2087", contato: "EMILIA" }, { nome: "HOSPEDARIA SÃO BENEDITO", km: 26.6, foraDaRota: 0.4, fone: "(11)97217-9138", contato: "PADRE BIRA" }, { nome: "POUSADA CALIL", km: 26.6, foraDaRota: 0.9, fone: "(11)95311-0920", contato: "ELAINE" }, { nome: "POUSADA SAPUCAIA", km: 26.6, foraDaRota: 2.1, fone: "(11)97221-6812", contato: "DANIEL" }, { nome: "CASA DO VALE", km: 27.6, foraDaRota: 0.7, fone: "(11)97451-0454", contato: "SHEILA" }, { nome: "CENTRO DE APOIO D'AJUDA", km: 27.9, foraDaRota: 0.0, fone: "(11)97392-4192", contato: "MARIA NEVES" } ],
        "Santa Branca": [ { nome: "ESPAÇO MANGANAGUA", km: 36.5, foraDaRota: 0.0, fone: "(11)97302-0535", contato: "JOSE" }, { nome: "CHÁCARA MIRANTE DO RIO", km: 45.5, foraDaRota: 0.0, fone: "(12)99622-4810", contato: "FÁTIMA" }, { nome: "POUSADA PEDALAMOS CICLOTURISMO", km: 46.0, foraDaRota: 0.08, fone: "(12)98162-6122", contato: "PEDRO CAMPOS" }, { nome: "POUSADA CORAÇÃO PEREGRINO", km: 46.3, foraDaRota: 0.015, fone: "(12)99792-7116", contato: "ANA CAROLINA" }, { nome: "POUSADA REMANSO ROTA DA LUZ", km: 46.3, foraDaRota: 0.02, fone: "(12)99761-9794", contato: "MARIA JOSE" }, { nome: "HOSPEDAGEM JASMO", km: 46.4, foraDaRota: 0.35, fone: "(12)99764-8346", contato: "JASMO" }, { nome: "HOSTEL GARDEN ALBUQUERQUE", km: 46.6, foraDaRota: 2.0, fone: "(12)99147-6194", contato: "RECEPÇÃO" }, { nome: "CHACARA CAMBUCI HOSPEDADGEM", km: 46.6, foraDaRota: 2.0, fone: "(12)98122-1519", contato: "GU BRAGA" }, { nome: "SITIO REMANSO DO VALE", km: 46.6, foraDaRota: 4.0, fone: "(12)99761-9794", contato: "MARIA JOSE" }, { nome: "POUSADA SANTA JULIA", km: 53.0, foraDaRota: 0.0, fone: "(12)98221-9558", contato: "MARCOS" }, { nome: "POUSADA SITIO DO VALDIR", km: 55.1, foraDaRota: 0.0, fone: "(12)99612-4564", contato: "VALDIR" } ],
        "Paraibuna": [ { nome: "POUSADA SITIO RECANTO DAS FLORES", km: 82.7, foraDaRota: 3.7, fone: "(12)99105-4807", contato: "VERA" }, { nome: "POUSADA VILA DE LUCA", km: 83.1, foraDaRota: 0.0, fone: "(12)99657-9363", contato: "RECEPÇÃO" }, { nome: "POUSADA NATHALIA CANELLA", km: 83.1, foraDaRota: 7.0, fone: "(12)99605-6263", contato: "NATHALIA" }, { nome: "POUSADA TRES RIOS", km: 83.1, foraDaRota: 0.45, fone: "(11)99425-5286", contato: "ANA MARIA" }, { nome: "POUSADA RECANTO BOA VENTURA", km: 91.7, foraDaRota: 0.0, fone: "(12)98814-9940", contato: "PAULO/Neuza" }, { nome: "POUSADA CAXAMBU", km: 92.0, foraDaRota: 0.0, fone: "(12)98836-9937", contato: "CLEBER" }, { nome: "RANCHO NOSSA SENHORA APARECIDA", km: 93.0, foraDaRota: 0.0, fone: "(12)99735-7114", contato: "NEIDE" }, { nome: "RENAISSANCE CHALÉS", km: 96.3, foraDaRota: 0.0, fone: "(11)93008-0331", contato: "ELIZETE" } ],
        "Redenção da Serra": [ { nome: "POUSADA DOS PEREIRAS", km: 108.0, foraDaRota: 0.0, fone: "(12)99721-8999", contato: "DANIEL" }, { nome: "POUSADA DA MARLENE", km: 111.7, foraDaRota: 0.0, fone: "(12)99709-4837", contato: "MARLENE" }, { nome: "RECANTO BELA VISTA", km: 111.7, foraDaRota: 6.2, fone: "(12)99611-8522", contato: "ANTONIO" }, { nome: "POUSADA ROTA DA FÉ", km: 113.1, foraDaRota: 0.15, fone: "(12)99143-9362", contato: "REGINA" }, { nome: "POUSADA DO JAPONES", km: 114.1, foraDaRota: 0.0, fone: "(11)99143-8855", contato: "MICHELE" }, { nome: "POUSADA DO LOUZADA", km: 111.7, foraDaRota: 3.8, fone: "(12)99749-2003", contato: "LOUZADA" }, { nome: "POUSADA DO INACIO", km: 114.0, foraDaRota: 0.0, fone: "(12)99769-5497", contato: "DANI" }, { nome: "RANCHO DOS PÁSSAROS", km: 114.4, foraDaRota: 0.0, fone: "(12)99731-1196", contato: "CARLINHOS" }, { nome: "POUSADA PRIMAVERA", km: 114.6, foraDaRota: 0.0, fone: "(12)98835-0552", contato: "RICARDO" } ],
        "Taubaté": [ { nome: "FAZENDA BOA ESPERANÇA", km: 142.0, foraDaRota: 2.8, fone: "(12)99726-8225", contato: "ADRIANA" }, { nome: "POUSADA PARADA DA ROTA", km: 144.9, foraDaRota: 0.2, fone: "(12)99131-4248", contato: "JANDIRO" }, { nome: "HOTEL SAN MICHEL", km: 146.4, foraDaRota: 1.2, fone: "(12)99158-8718", contato: "RECEPÇÃO" }, { nome: "HOTEL SÃO NICOLAU", km: 146.8, foraDaRota: 1.1, fone: "(12)99141-0653", contato: "RECEPÇÃO" }, { nome: "POUSADA PRIMAVERA TAUBATÉ", km: 146.4, foraDaRota: 1.2, fone: "(12)3632-1313", contato: "MARILAH" }, { nome: "CARLTON PLAZA BAOBA", km: 146.8, foraDaRota: 2.1, fone: "(12)99702-5754", contato: "VIVIAN" } ],
        "Pindamonhangaba": [ { nome: "SITIO 4 MILHAS", km: 167.5, foraDaRota: 0.0, fone: "(12)99728-7044", contato: "HELEN ROSE" }, { nome: "SAGRADO CORAÇÕES", km: 171.1, foraDaRota: 0.5, fone: "(12)99760-2310", contato: "RECEPÇÃO" }, { nome: "PIRAPOUL HOTEL", km: 171.1, foraDaRota: 1.9, fone: "(12)99794-2605", contato: "RECEPÇÃO" }, { nome: "RECANTO MONA", km: 171.1, foraDaRota: 2.0, fone: "(12)99103-6112", contato: "GLAUCIA" }, { nome: "VALE HOSTEL", km: 171.1, foraDaRota: 2.2, fone: "(12)99102-7709", contato: "MICHELI" }, { nome: "PINDA PLAZA HOTEL", km: 172.6, foraDaRota: 0.0, fone: "(12)99627-8080", contato: "RECEPÇÃO" }, { nome: "POLIS HOTEL", km: 176.0, foraDaRota: 0.2, fone: "(12)3641-2249", contato: "RECEPÇÃO" } ],
        "Aparecida": [ { nome: "POUSADA SANTINHA", km: 188.5, foraDaRota: 0.0, fone: "(12)3646-3000", contato: "RECEPÇÃO" }, { nome: "APARECIDA HOTEL", km: 194.0, foraDaRota: 0.0, fone: "(12)3105-7015", contato: "RECEPÇÃO" }, { nome: "HOTEL BENFICA", km: 196.5, foraDaRota: 0.0, fone: "(12)3105-2794", contato: "RECEPÇÃO" }, { nome: "POUSADA JOVIMAR", km: 197.0, foraDaRota: 0.0, fone: "(12)99631-4234", contato: "THALITA" }, { nome: "POUSADA ITAGUAÇU", km: 198.5, foraDaRota: 0.0, fone: "(12)98845-5475", contato: "FELIPE" }, { nome: "HOTEL SÃO RAFAEL", km: 198.9, foraDaRota: 0.0, fone: "(12)98312-9384", contato: "EVERSON" }, { nome: "HOTEL SANTO AFONSO", km: 200.0, foraDaRota: 0.0, fone: "(12)99667-7415", contato: "RECEPÇÃO" } ]
      - "Etapa 1: Mogi das Cruzes a Guararema", cidadeOrigem: "Mogi das Cruzes", cidadeDestino: "Guararema", distancia: "24 km", pontoReferenciaInicio: ["Estação Estudantes", "Praça do Terminal Rodoviário Geraldo Scavone"], pontoReferenciaTermino: ["Estação Ferroviária de Guararema"]
      - Etapa 2: Guararema a Santa Branca", cidadeOrigem: "Guararema", cidadeDestino: "Santa Branca", distancia: "21.6 km", pontoReferenciaInicio: ["Estação Ferroviária de Guararema"], pontoReferenciaTermino: ["Praça Matriz de Santa Branca"]
      - Etapa 3: Santa Branca a Paraibuna", cidadeOrigem: "Santa Branca", cidadeDestino: "Paraibuna", distancia: "40.5 km", pontoReferenciaInicio: ["Praça Matriz de Santa Branca"], pontoReferenciaTermino: ["Ponte do Vigor"]
      - Etapa 4: Paraibuna a Redenção da Serra", cidadeOrigem:"Paraibuna", cidadeDestino: "Redenção da Serra", distancia: "31.6 km", pontoReferenciaInicio: ["Ponte do Vigor"], pontoReferenciaTermino: ["Estátua Monumento da Abolição"]
      - Etapa 5: Redenção da Serra a Taubaté", cidadeOrigem:"Redenção da Serra", cidadeDestino: "Taubaté", distancia: "33.6 km", pontoReferenciaInicio: ["Estátua Monumento da Abolição"], pontoReferenciaTermino: ["Igreja Nossa Senhora da Imaculada Conceição"]
      - Etapa 6: Taubaté a Pindamonhangaba", cidadeOrigem:"Taubaté", cidadeDestino: "Pindamonhangaba", distancia: "21.2 km", pontoReferenciaInicio: ["Igreja Nossa Senhora da Imaculada Conceição"], pontoReferenciaTermino: ["Parque da Cidade"]
      - Etapa 7 Final: Pindamonhangaba a Aparecida", cidadeOrigem: "Pindamonhangaba", cidadeDestino: "Aparecida", distancia: "28.7 km", pontoReferenciaInicio: ["Parque da Cidade"], pontoReferenciaTermino: ["Entrada Principal do Santuário de Aparecida"]

      Responda à seguinte pergunta de um peregrino de forma clara e útil, em no máximo 1 parágrafo, usando o contexto acima.
      PERGUNTA: "${question}"
      Ao final da sua resposta, inclua sempre, em uma nova linha, o aviso: 'Lembre-se: Sou uma IA. Sempre confirme informações importantes como horários e endereços. Boa caminhada a todos!'
      `;
     try {  
    // 1. OBTÉM A RESPOSTA DA IA PRIMEIRO
      const responseText = await callGeminiAPI(prompt);
      setResposta(responseText);

      // 2. AGORA, ENVIA TUDO PARA A PLANILHA
      const sheetData = { 
        pergunta: question, 
        nome: nome, 
        contato: contato,
        respostaIA: responseText // Inclui a resposta da IA
      };
      
      fetch('https://script.google.com/macros/s/AKfycbwMJI2o7Q0q9ymZvah_qm580IzZAUu4xa1zQlp8mbxCuqK3k6ColU8SHYrN1RRl11qgEA/exec', {
          method: 'POST',
          body: JSON.stringify(sheetData),
          headers: { 'Content-Type': 'text/plain;charset=utf-8' }
      }).then(response => response.json())
        .then(data => console.log(data.result === 'success' ? "Interação registrada." : "Falha ao registrar."))
        .catch(error => console.error("Erro de rede ao contatar Google Script:", error));

    } catch (error) {
      setResposta("Desculpe, não foi possível obter uma resposta no momento.");
      console.error("Error fetching Peregrino IA response:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleTopicClick = (topic) => {
    setPergunta(topic);
    handlePerguntar(topic);
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-lg h-full flex flex-col">
      <div className="text-center mb-2">
        <div className="w-full h-32 flex justify-center items-center">
            {estaFalando ? (
              <video 
                key="video"
                src="/peregrino-falando.mp4" 
                autoPlay 
                loop 
                muted
                playsInline
                className={"transition-all duration-500 ease-in-out rounded-full object-contain bg-gray-200 w-38 h-40"}
              />
            ) : (
              <img 
                key="image"
                src="/peregrino-ia.jpg" 
                alt="Avatar do Peregrino IA" 
                className="transition-all duration-500 ease-in-out h-24 w-auto"
              />
            )}
        </div>
        <h3 className="text-lg font-bold text-gray-800 flex items-center justify-center mt-2">
          <MessageSquare className="inline-block h-6 w-6 mr-2 text-purple-600" />
          Pergunte ao Peregrino IA
        </h3>
      </div>
      
      {isOnline ? (
        <div className="space-y-4 flex-grow flex flex-col">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <input 
              type="text" placeholder="Seu nome" value={nome} onChange={(e) => setNome(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-lg text-sm placeholder:text-gray-500 placeholder:text-xs" disabled={isLoading}
            />
            <input 
              type="text" placeholder="Seu e-mail ou WhatsApp" value={contato} onChange={(e) => setContato(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-lg text-sm placeholder:text-gray-500 placeholder:text-xs" disabled={isLoading}
            />
          </div>
          <div className="relative">
            <textarea
              value={pergunta}
              onChange={(e) => setPergunta(e.target.value)}
              placeholder="1.Preencha os dados acima; 2.Utilize o Microfone ou digite sua pergunta aqui; 3.Enviar; 4.Clique no Altofalante p/ ouvir a resposta."
              className="w-full p-2 pr-10 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-sm placeholder:text-gray-500 placeholder:text-xs"
              rows="2"
              disabled={isLoading || isListening}
            />
             
            <button 
              onClick={handleVoiceInput} 
              disabled={isLoading}
              className={`absolute right-2 top-2 p-1 rounded-full transition-colors ${isListening ? 'bg-red-500 text-white animate-pulse' : 'text-gray-400 hover:text-purple-600 hover:bg-gray-100'}`}
              title="Perguntar por voz"
            >
              <Mic className="h-5 w-5" />
            </button>
             
          </div>
          {!resposta && !isLoading && (
            <div className="text-center text-sm text-gray-500">
              <span>Sugestão: clique para ouvir sobre os temas </span>
              <button 
                onClick={() => handleTopicClick(suggestedTopics[currentTopicIndex])}
                className={`font-semibold text-purple-600 hover:text-purple-800 ml-1 p-1 rounded transition-opacity duration-500 ${isFading ? 'opacity-0' : 'opacity-100'}`}
                title="Clique para perguntar sobre este tema"
              >
                "{suggestedTopics[currentTopicIndex]}"
              </button>
            </div>
          )}
          <div className="flex items-center gap-2">
            <button onClick={() => handlePerguntar(pergunta)} disabled={isLoading || !pergunta.trim() || isListening || pergunta === 'Ouvindo...'} className="w-full flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 disabled:bg-gray-400 transition-all">
              {isLoading ? <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div> : <><Send className="h-5 w-5 mr-2" /> Enviar</>}
            </button>
            {(pergunta && pergunta !== 'Ouvindo...') || resposta ? (
              <button onClick={handleClear} disabled={isLoading} className="p-2 rounded-full bg-gray-200 hover:bg-red-200 disabled:bg-gray-100" title="Apagar pergunta e resposta">
                <Trash2 className={`h-5 w-5 ${isLoading ? 'text-gray-300' : 'text-gray-600 hover:text-red-600'}`} />
              </button>
            ) : null }
           {resposta && !isLoading && (
              <button onClick={() => handleSpeakResponse(resposta)} disabled={isLoading} className="p-2 rounded-full bg-gray-200 hover:bg-blue-200 disabled:bg-gray-200" title="Ouvir resposta">
                {isLoadingAudio ? (
                  <Loader2 className="h-5 w-5 animate-spin text-purple-600" />
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><path d="M15.54 8.46a5 5 0 0 1 0 7.07"/></svg>
                )}
              </button>
            )}
          </div>
          {resposta && !isLoading && (
             <div className="text-xs text-black-400 mt-2 text-center flex items-center justify-center">
               <span className="font-bold">Para ouvir a resposta, clique no ícone </span>
               <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mx-1"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><path d="M15.54 8.46a5 5 0 0 1 0 7.07"/></svg>
               <span className="font-bold"> nos botões acima.</span>
             </div>
          )}
          {resposta && (
            <div className="mt-4 p-3 bg-gray-50 rounded-lg border text-sm max-h-48 overflow-y-auto">
              <p className="text-gray-800 whitespace-pre-wrap">{resposta}</p>
            </div>
          )}
           
        </div>
      ) : (
         <div className="text-center text-gray-600 pt-4"><WifiOff className="mx-auto h-8 w-8 mb-2" /><p>Funcionalidade indisponível offline.</p></div>
      )}
    </div>
  );
};

const DistanciaCalculadaDisplay = ({ etapa, selecao }) => {
  // A lógica do 'if' agora acontece ANTES do return, que é o correto
  if (!selecao || !selecao.origem || !selecao.destino) {
    return null; // Não mostra nada se a seleção não estiver completa
  }

  const origem = hospedagensPorCidade[etapa.cidadeOrigem]?.find(h => h.nome === selecao.origem);
  const destino = hospedagensPorCidade[etapa.cidadeDestino]?.find(h => h.nome === selecao.destino);

  if (!origem || !destino) {
    return null; // Não mostra nada se não encontrar as hospedagens
  }

  const distanciaNaRota = Math.abs(destino.km - origem.km);
  const distanciaTotal = distanciaNaRota + origem.foraDaRota + destino.foraDaRota;
  const distanciaFormatada = distanciaTotal.toFixed(1);

  return (
    <div className="mt-2 text-center bg-blue-50 p-2 rounded-lg h-full flex flex-col justify-center">
      <p className="text-lg font-bold text-blue-600">{distanciaFormatada} km</p>
      <p className="text-xs font-semibold text-gray-700">porta a porta</p>
    </div>
  );
};


const EtapaDetalhes = ({ etapa, onBack, isOnline, callGeminiAPI, distanciaPersonalizada }) => {
  const [dicas, setDicas] = useState('');
  const [curiosidades, setCuriosidades] = useState('');
  const [isLoadingDicas, setIsLoadingDicas] = useState(false);
  const [isLoadingCuriosidades, setIsLoadingCuriosidades] = useState(false);
  
  const handleGerarDicas = async () => {
    setIsLoadingDicas(true);
    setDicas('');
    const prompt = `Aja como um guia experiente da Rota da Luz. Para a etapa '${etapa.titulo}', com dificuldades: ${etapa.dificuldades.join(', ')}, crie 3 dicas curtas, criativas e inspiradoras. Varie as dicas. Use tom encorajador. Formate como lista numerada.`;
    try {
        const responseText = await callGeminiAPI(prompt);
        setDicas(responseText);
    } catch (error) {
        setDicas("Desculpe, não foi possível gerar as dicas no momento.");
        console.error("Error fetching Gemini tips:", error);
    } finally {
        setIsLoadingDicas(false);
    }
  };

  const handleGerarCuriosidades = async () => {
    setIsLoadingCuriosidades(true);
    setCuriosidades('');
    const prompt = `Aja como um guia turístico local para a cidade de ${etapa.cidadeDestino}, SP. Para um peregrino a pé, descreva em 2 ou 3 parágrafos curtos: 1. Pontos turísticos. 2. Comidas típicas. 3. Eventos tradicionais. Use um tom acolhedor.`;
     try {
        const responseText = await callGeminiAPI(prompt);
        setCuriosidades(responseText);
    } catch (error) {
        setCuriosidades("Desculpe, não foi possível gerar as curiosidades no momento.");
        console.error("Error fetching Gemini curiosidades:", error);
    } finally {
        setIsLoadingCuriosidades(false);
    }
  };

  const weekNumber = getWeekNumber(etapa.date);
  const previsaoTempo = weeklyCityHistoricalWeather[weekNumber]?.[etapa.cidadeDestino] || weeklyCityHistoricalWeather[33]['Guararema'];

  return (
    <div className="p-4 sm:p-6 lg:p-8 animate-fade-in">
       <div className="flex flex-wrap justify-between items-center gap-y-4 mb-8 border-b pb-4 border-gray-200">
        <div className="flex-shrink-0">
          <button onClick={onBack} className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
              <ArrowLeft className="h-5 w-5 mr-2" />
              Voltar
          </button>
        </div>
        <div className="flex-grow text-center">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-800">{etapa.titulo}</h2>
          <p className="text-lg sm:text-xl text-blue-700 font-semibold mt-1">{formatDate(etapa.date)}</p>
        </div>
        <div className="flex-shrink-0">
          <img src="/logo-rota.jpeg" alt="Logotipo Rota da Luz" className="h-12 sm:h-16" />
        </div>
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
            <a href={`https://www.google.com/search?q=previsão+do+tempo+${etapa.cidadeDestino}`} target="_blank" rel="noopener noreferrer" className="mt-3 w-full inline-flex items-center justify-center px-2 py-1 border border-transparent text-xs font-medium rounded-md text-blue-700 bg-blue-100 hover:bg-blue-200">
                <ExternalLink className="h-3 w-3 mr-1" />
                Ver Previsão em Tempo Real
            </a>
        </div>
         <div className="bg-white p-4 rounded-lg shadow flex flex-col justify-between text-center">
          <div>
            <p className="text-3xl font-bold text-blue-500">{etapa.distancia}</p>
            <p className="font-semibold text-gray-600">Distância entre as cidades</p>
            <div className="text-xs text-gray-500 mt-1">
              <p>Início: {etapa.pontoReferenciaInicio.join(' / ')}</p>
              <p>Término: {etapa.pontoReferenciaTermino.join(' / ')}</p>
            </div>
          </div>
          <div className="mt-4 pt-4 border-t">
            <p className="text-3xl font-bold text-blue-500">
              {distanciaPersonalizada ? `${distanciaPersonalizada} km` : '- -'}
            </p>
            <p className="font-semibold text-gray-600">Distância entre as pousadas</p>
            <p className="text-xs text-gray-500">(se escolhidas na pág. inicial)</p>
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow"><p className="text-3xl font-bold text-blue-500">{etapa.tempoEstimado}</p><p className="font-semibold text-gray-600">Tempo de Caminhada</p><p className="text-xs text-gray-500">(entre as cidades)</p></div>
        <div className="bg-white p-4 rounded-lg shadow"><Clock className="mx-auto h-8 w-8 text-blue-500 mb-2" /><p className="font-bold text-gray-800">Início Sugerido</p><p className="text-lg text-gray-600">{etapa.horarioInicio}</p><p className="text-xs text-gray-500">(entre as cidades)</p><p className="text-xs text-gray-500">(Para chegar às 15:30)</p><p className="text-xs text-gray-500 mt-1">(Incluído {etapa.paradaRefeicao} para descanso e alimentação)</p></div>
      </div>
       <p className="text-center text-xs text-gray-500 mb-8 -mt-4 italic">*Previsão baseada em médias históricas. Consulte um serviço de meteorologia para dados em tempo real.</p>
      <div className="my-8">
        <GeminiCard title="Dicas do Peregrino com IA" icon={Bot} isLoading={isLoadingDicas} content={dicas} onGenerate={handleGerarDicas} buttonText="Gerar Dicas para esta Etapa" isOnline={isOnline} />
        <GeminiCard title="Descubra a Cidade Destino com IA" icon={Bot} isLoading={isLoadingCuriosidades} content={curiosidades} onGenerate={handleGerarCuriosidades} buttonText={`O que ver em ${etapa.cidadeDestino}?`} isOnline={isOnline} />
        {etapa.cidadesDaEtapa && etapa.cidadesDaEtapa.length > 0 && (
          <Card icon={Building} title="Descubra as Cidades da Etapa (sites das prefeituras)" colorClass="bg-gray-500">
            <div className="space-y-3">
              {etapa.cidadesDaEtapa.map((cidade) => (
                <a key={cidade.nome} href={cidade.url} target="_blank" rel="noopener noreferrer" className="flex items-center justify-between p-3 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors">
                  <span className="font-semibold text-gray-800">{cidade.nome}</span>
                  <ExternalLink className="h-5 w-5 text-gray-500" />
                </a>
              ))}
            </div>
          </Card>
        )}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div>
          <Card icon={MapPin} title="Itinerário (entre as cidades)" colorClass="bg-blue-500">
              <a href={etapa.mapaUrl} target="_blank" rel="noopener noreferrer" className="w-full mb-4 inline-flex items-center justify-center px-4 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-blue-700 bg-blue-100 hover:bg-blue-200 transition-all">
                  <Map className="h-6 w-6 mr-3" />
                  Abrir Rota no Google Maps
              </a>
              <details className="bg-gray-50 p-3 rounded-lg"><summary className="font-semibold cursor-pointer text-gray-700 hover:text-blue-600">Ver itinerário em texto</summary><ul className="mt-3 space-y-2 list-disc list-inside text-sm text-gray-600">{etapa.itinerario.map((passo, index) => <li key={index}>{passo}</li>)}</ul></details>
          </Card>
          <Card icon={UtensilsCrossed} title="Pontos de Apoio (Onde Comer)" colorClass="bg-green-500">
              <div className="space-y-3">{etapa.pontosDeApoio.map((ponto, index) => (<div key={index} className="p-3 bg-gray-50 rounded-lg"><p className="font-bold">{ponto.nome}</p><p className="text-sm text-gray-600">Tipo: {ponto.tipo} | KM Aprox: {ponto.km}</p></div>))}</div>
          </Card>
        </div>
        <div>
          <Card icon={Mountain} title="Altimetria" colorClass="bg-yellow-500">
            {etapa.altimetriaImgUrl && (
              <img src={etapa.altimetriaImgUrl} alt={`Gráfico de altimetria para ${etapa.titulo}`} className="w-full rounded-md mb-4"/>
            )}
            <p>{etapa.altimetria}</p>
          </Card>
          <Card icon={AlertTriangle} title="Dificuldades" colorClass="bg-red-500"><ul className="space-y-2 list-disc list-inside">{etapa.dificuldades.map((dificuldade, index) => <li key={index}>{dificuldade}</li>)}</ul></Card>
          <Card icon={Star} title="Recomendações e O Que Levar" colorClass="bg-indigo-500">
              <h4 className="font-bold mb-2">Recomendações:</h4><ul className="space-y-2 list-disc list-inside mb-4">{etapa.recomendacoes.map((rec, index) => <li key={index}>{rec}</li>)}</ul>
              <hr className="my-4"/><h4 className="font-bold mb-2">Sugestão para Comer/Beber:</h4><p>{etapa.oQueLevar}</p>
          </Card>
        </div>
      </div>
    </div>
  );
};

// --- NOVO COMPONENTE: ResumoRoteiro ---
const ResumoRoteiro = ({ allEtapas, selecoesHospedagem, onBack, hospedagensPorCidade, weeklyCityHistoricalWeather }) => {
  return (
    <div className="p-4 sm:p-6 lg:p-8 animate-fade-in">
      <div className="flex justify-between items-center mb-6 print:hidden">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-800">Resumo do Seu Roteiro</h1>
          <p className="text-gray-600">Este é o seu plano de peregrinação personalizado.</p>
        </div>
        <div className="flex gap-2">
           <button onClick={() => window.print()} className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-gray-600 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500">
              <Printer className="h-5 w-5 mr-2" />
              Imprimir
          </button>
          <button onClick={onBack} className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
              <ArrowLeft className="h-5 w-5 mr-2" />
              Voltar
          </button>
        </div>
      </div>

      <div className="overflow-x-auto bg-white rounded-lg shadow">
        <table className="w-full text-sm text-left text-gray-700">
          <thead className="text-xs text-gray-800 uppercase bg-gray-100">
            <tr>
              <th scope="col" className="px-4 py-3">Etapa</th>
              <th scope="col" className="px-4 py-3">Data</th>
              <th scope="col" className="px-4 py-3">Origem</th>
              <th scope="col" className="px-4 py-3">Destino</th>
              <th scope="col" className="px-4 py-3">Distância</th>
              <th scope="col" className="px-4 py-3 text-center">Clima (7h/12h/17h)</th>
            </tr>
          </thead>
          <tbody>
            {allEtapas.map(etapa => {
              const selecao = selecoesHospedagem[etapa.id] || {};
              const origem = hospedagensPorCidade[etapa.cidadeOrigem]?.find(h => h.nome === selecao.origem);
              const destino = hospedagensPorCidade[etapa.cidadeDestino]?.find(h => h.nome === selecao.destino);
              
              let distanciaCalculada = etapa.distancia;
              if (origem && destino) {
                const dist = Math.abs(destino.km - origem.km) + origem.foraDaRota + destino.foraDaRota;
                distanciaCalculada = `${dist.toFixed(1)} km`;
              }
              
              const weekNumber = getWeekNumber(etapa.date);
              const previsao = weeklyCityHistoricalWeather[weekNumber]?.[etapa.cidadeDestino] || weeklyCityHistoricalWeather[33]['Guararema'];

              return (
                <tr key={etapa.id} className="border-b hover:bg-gray-50">
                  <td className="px-4 py-4 font-bold">{etapa.id}</td>
                  <td className="px-4 py-4">{formatDate(etapa.date)}</td>
                  <td className="px-4 py-4">
                    <p className="font-semibold">{etapa.cidadeOrigem}</p>
                    <p className="text-xs text-gray-500">{origem?.nome || 'Não selecionado'}</p>
                    <p className="text-xs text-gray-500">{origem?.fone}</p>
                  </td>
                  <td className="px-4 py-4">
                    <p className="font-semibold">{etapa.cidadeDestino}</p>
                    <p className="text-xs text-gray-500">{destino?.nome || 'Não selecionado'}</p>
                    <p className="text-xs text-gray-500">{destino?.fone}</p>
                  </td>
                  <td className="px-4 py-4">
                    <p className="font-semibold">{distanciaCalculada}</p>
                    <p className="text-xs text-gray-500 italic">porta a porta</p>
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex gap-2 justify-start md:justify-center">
                      <span className="font-semibold bg-gray-100 px-2 py-1 rounded-md text-xs" title="Manhã (7h)">{previsao.horarios[0].temp}</span>
                      <span className="font-semibold bg-gray-100 px-2 py-1 rounded-md text-xs" title="Meio-dia (12h)">{previsao.horarios[1].temp}</span>
                      <span className="font-semibold bg-gray-100 px-2 py-1 rounded-md text-xs" title="Tarde (17h)">{previsao.horarios[2].temp}</span>
                    </div>
                    <p className="text-xs text-gray-500 text-center mt-1">Chuva: {previsao.chanceChuva}</p>
                    <p className="text-xs text-gray-500 italic text-center">médias históricas</p>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default function App() {
  const [selectedEtapa, setSelectedEtapa] = useState(null);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [showOfflineToast, setShowOfflineToast] = useState(false);
  const [startDate, setStartDate] = useState(new Date(2025, 7, 22));
  const [selecoesHospedagem, setSelecoesHospedagem] = useState({});
  const [modoResumo, setModoResumo] = useState(false);

  const handleHospedagemChange = (etapaId, tipo, nomeHospedagem) => {
    setSelecoesHospedagem(prevState => {
      const newState = { ...prevState };
      if (!newState[etapaId]) { newState[etapaId] = {}; }
      
      if (tipo === 'destino' && etapaId < etapasData.length) {
        const proximaEtapaId = etapaId + 1;
        if (!newState[proximaEtapaId]) {
            newState[proximaEtapaId] = {};
        }
        newState[proximaEtapaId].origem = nomeHospedagem;
      }
      
      newState[etapaId][tipo] = nomeHospedagem;
      return newState;
    });
  };

  const callGeminiAPI = async (prompt) => {
    const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
    if (!apiKey) return "ERRO: A chave de API do Gemini não foi configurada.";
    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;
    const payload = {
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      generationConfig: { temperature: 0.7, topK: 40, topP: 0.95 }
    };
    const response = await fetch(apiUrl, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
    if (!response.ok) {
      const errorBody = await response.json();
      console.error("API call failed:", errorBody);
      throw new Error(`API call failed with status: ${response.status}`);
    }
    const result = await response.json();
    if (result.candidates && result.candidates[0]?.content?.parts[0]?.text) {
      return result.candidates[0].content.parts[0].text;
    } else {
      console.error("Invalid response structure from API:", result);
      throw new Error("Estrutura de resposta inválida da API.");
    }
  };

  const handleDateChange = (e) => {
    const [year, month, day] = e.target.value.split('-').map(Number);
    setStartDate(new Date(year, month - 1, day));
  };
  
  const calculateEtapaData = () => {
    return etapasData.map((etapa, index) => {
        const etapaDate = new Date(startDate);
        etapaDate.setDate(startDate.getDate() + index);
        const arrivalTime = 15.5;
        const walkTime = parseTime(etapa.tempoEstimado) / 60;
        const breakTime = parseTime(etapa.paradaRefeicao) / 60;
        const startTimeDecimal = arrivalTime - walkTime - breakTime;
        const startHour = Math.floor(startTimeDecimal);
        const startMinute = Math.round((startTimeDecimal - startHour) * 60);
        const formattedStartTime = `${String(startHour).padStart(2, '0')}:${String(startMinute).padStart(2, '0')}`;
        return { ...etapa, date: etapaDate, horarioInicio: formattedStartTime };
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
        }).catch(error => { console.log('ServiceWorker registration failed: ', error); });
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

  useEffect(() => {
    if (selectedEtapa) {
      window.scrollTo(0, 0);
    }
  }, [selectedEtapa]);

  const isPlanningComplete = allEtapas.every(etapa => 
    selecoesHospedagem[etapa.id]?.origem && selecoesHospedagem[etapa.id]?.destino
  );

  if (modoResumo) {
    return <ResumoRoteiro 
             allEtapas={allEtapas}
             selecoesHospedagem={selecoesHospedagem}
             onBack={() => setModoResumo(false)}
             hospedagensPorCidade={hospedagensPorCidade} // Correção: Passando a prop
             weeklyCityHistoricalWeather={weeklyCityHistoricalWeather} // Correção: Passando a prop
           />;
  }

  if (selectedEtapa) {
    const selecao = selecoesHospedagem[selectedEtapa.id] || {};
    let distanciaPersonalizada = null;
    
    if (selecao.origem && selecao.destino) {
      const origem = hospedagensPorCidade[selectedEtapa.cidadeOrigem]?.find(h => h.nome === selecao.origem);
      const destino = hospedagensPorCidade[selectedEtapa.cidadeDestino]?.find(h => h.nome === selecao.destino);
      if (origem && destino) {
        const dist = Math.abs(destino.km - origem.km) + origem.foraDaRota + destino.foraDaRota;
        distanciaPersonalizada = dist.toFixed(1);
      }
    }

    return <EtapaDetalhes 
             etapa={selectedEtapa} 
             onBack={() => setSelectedEtapa(null)} 
             isOnline={isOnline} 
             callGeminiAPI={callGeminiAPI}
             distanciaPersonalizada={distanciaPersonalizada} // Passa o resultado já calculado
           />;
  }

  return (
    <div className="min-h-screen bg-gray-100 font-sans">
      <header className="bg-white shadow-md sticky top-0 z-10">
         <div className="container mx-auto px-4 py-3 flex justify-center items-center">
            <div className="text-center">
                <h1 className="text-2xl sm:text-4xl font-extrabold text-blue-800">Guia da Rota da Luz</h1>
                <p className="text-gray-600 mt-1 text-xs sm:text-base">Seu guia para a peregrinação à Aparecida.</p>
            </div>
        </div>
      </header>
      
      <main className="container mx-auto p-4 sm:p-6 lg:p-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8 items-start">
          <div className="flex justify-center items-center lg:col-span-1">
            <a href="https://www.amigosdarotadaluz.org/" target="_blank" rel="noopener noreferrer" title="Visitar site da AARL" className="flex flex-col items-center gap-2 text-center">
              <img src="/favicon-aarl.jpeg" alt="Logotipo AARL Ampliado" className="h-40 sm:h-40 lg:h-48" />
              <span className="text-xs text-gray-500 font-semibold">Link para o site da AARL</span>
            </a>
          </div>
          <div className="lg:col-span-1 h-full">
            <PeregrinoIA isOnline={isOnline} callGeminiAPI={callGeminiAPI} />
          </div>
          <div className="bg-white p-6 rounded-xl shadow-lg lg:col-span-1">
              <h3 className="text-lg font-bold text-gray-800 mb-2">Planejamento Personalizado</h3>
              <ol className="list-decimal list-inside text-sm text-gray-600 space-y-1 mb-4">
                  <li>Escolha a data de início da peregrinação.</li>
                  <li>Selecione as pousadas para cada etapa.</li>
                  <li>Clique no botão verde para "Gerar Roteiro Personalizado".</li>
                  <li>Abaixo, explore todas as Etapas, conheça as cidades, dicas e desafios de cada trecho".</li>
              </ol>
              <label htmlFor="start-date" className="block text-sm font-bold text-gray-800 mb-2">
                  1. Escolha a data de início:
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
        
        <div className="bg-white p-6 rounded-xl shadow-lg mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
            <Footprints className="h-6 w-6 mr-3 text-blue-600"/>
            2. Selecione suas Hospedagens
          </h2>
          <div className="space-y-4">
            {allEtapas.map((etapa, index) => {
              const selecaoAtual = selecoesHospedagem[etapa.id] || {};
              const origemAnterior = index > 0 ? selecoesHospedagem[allEtapas[index - 1].id]?.destino : undefined;
              
              return (
                <div key={etapa.id} className="grid grid-cols-1 md:grid-cols-4 gap-4 border-t pt-4 first:border-t-0 first:pt-0 items-center">
                  <div className="md:col-span-1">
                    <p className="font-bold text-blue-600">ETAPA {etapa.id}</p>
                    <p className="text-sm text-gray-500">{etapa.titulo}</p>
                  </div>
                  <div className="md:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Origem em {etapa.cidadeOrigem}</label>
                      <select 
                        value={origemAnterior || selecaoAtual.origem || ''}
                        onChange={(e) => handleHospedagemChange(etapa.id, 'origem', e.target.value)}
                        disabled={index > 0}
                        className="mt-1 w-full p-2 border border-gray-300 rounded-md disabled:bg-gray-100"
                      >
                        <option value="">Selecione...</option>
                        {hospedagensPorCidade[etapa.cidadeOrigem]?.map(h => <option key={h.nome} value={h.nome}>{h.nome}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Destino em {etapa.cidadeDestino}</label>
                      <select 
                        value={selecaoAtual.destino || ''}
                        onChange={(e) => handleHospedagemChange(etapa.id, 'destino', e.target.value)}
                        className="mt-1 w-full p-2 border border-gray-300 rounded-md"
                      >
                        <option value="">Selecione...</option>
                        {hospedagensPorCidade[etapa.cidadeDestino]?.map(h => <option key={h.nome} value={h.nome}>{h.nome}</option>)}
                      </select>
                    </div>
                  </div>
                   <div className="md:col-span-1">
                    <DistanciaCalculadaDisplay etapa={etapa} selecao={selecoesHospedagem[etapa.id]} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="my-8 text-center">
          <button 
            onClick={() => setModoResumo(true)}
            disabled={!isPlanningComplete}
            className="inline-flex items-center px-8 py-4 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:bg-gray-400 disabled:cursor-not-allowed transition-all"
            title={isPlanningComplete ? "Gerar resumo do seu roteiro" : "Selecione a origem e o destino de todas as 7 etapas para habilitar"}
          >
            <FileText className="h-5 w-5 mr-3" />
            {isPlanningComplete ? "3 - Gerar Roteiro Personalizado" : "3 - Planeje todas as Etapas para Gerar"}
          </button>
        </div>

        <h2 className="text-2xl font-bold text-gray-800 mb-4 mt-8 text-center">4 - Clique em uma etapa para ver os detalhes completos</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {allEtapas.map(etapa => {
            const weekNumber = getWeekNumber(etapa.date);
            const previsao = weeklyCityHistoricalWeather[weekNumber]?.[etapa.cidadeDestino] || weeklyCityHistoricalWeather[33]['Guararema'];
            return (
              <button
                key={etapa.id}
                onClick={() => setSelectedEtapa(etapa)}
                className="bg-white rounded-xl shadow-lg p-6 text-left hover:shadow-2xl hover:-translate-y-1 transform transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                <p className="text-sm font-bold text-blue-600">ETAPA {etapa.id}</p>
                <h3 className="text-xl font-bold text-gray-800 mt-1">{etapa.titulo}</h3>
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <div className="flex justify-between items-center text-gray-600">
                    <span className="text-sm font-semibold">{formatDate(etapa.date)}</span>
                    <span className="text-sm font-semibold bg-blue-100 text-blue-800 py-1 px-2 rounded-full">{etapa.distancia}</span>
                  </div>
                  <div className="flex items-center justify-center mt-3 text-orange-600">
                      <Thermometer className="h-5 w-5 mr-1" />
                      <span className="text-sm font-semibold">{previsao.min} / {previsao.max}</span>
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
        <img src="/logo-rota.jpeg" alt="Logotipo Rota da Luz" className="h-16 mx-auto mb-4" />
        <p>Desenvolvido para auxiliar os peregrinos da Rota da Luz.</p>
        <p>Boa caminhada!</p>
      </footer>
    </div>
  );
}
