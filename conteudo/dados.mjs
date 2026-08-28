/**
 * FONTE ÚNICA DE VERDADE DO SITE.
 *
 * Todo fato sobre a SPX vive aqui: nome, CNPJ, serviços, projetos, números.
 * As páginas são geradas a partir deste arquivo por `node gerar.mjs`, e os
 * dados estruturados que o Google e as IAs leem saem daqui também. Mudou aqui,
 * mudou no site inteiro — página, rodapé, schema e sitemap.
 *
 * ---------------------------------------------------------------------------
 * COMO PREENCHER
 *
 * Campos com o valor `FALTA` ainda não foram confirmados. O gerador NUNCA
 * inventa: campo que está `FALTA` simplesmente não aparece na página, e o
 * build lista tudo que falta no fim. Preencha e rode `node gerar.mjs`.
 *
 * Números e credenciais só entram no ar depois de conferidos. Errar CNPJ ou
 * CNPJ numa página pública é problema sério; deixar de fora não é.
 * ---------------------------------------------------------------------------
 */

/** marcador de dado ainda não confirmado — o gerador omite tudo que for isto */
export const FALTA = Symbol('falta confirmar');
export const falta = (v) => v === FALTA || v === undefined || v === null || v === '';

/**
 * História da empresa, confirmada por você no questionário:
 * fundada pelo Wesley sozinho, um ano de operação, começou por reforma e
 * manutenção, e a especialidade é obra sem parar a operação do cliente.
 * Nada aqui é preenchimento: cada frase saiu de uma resposta sua.
 */
export const historia = [
  { n: '01', titulo: 'Nove anos antes do CNPJ',
    texto: 'A SPX é nova, o engenheiro não. O responsável técnico passou nove anos em obra ' +
           'antes de abrir a empresa, e é essa bagagem que a SPX aplica desde a primeira ' +
           'visita técnica.' },
  { n: '02', titulo: 'Aberta por quem responde por ela',
    texto: 'A empresa foi aberta pelo próprio engenheiro responsável, sozinho. Quem assina a ' +
           'ART é quem atende, orça e vai ao canteiro — não há camada entre o cliente e quem ' +
           'decide.' },
  { n: '03', titulo: 'Começou pelo que ninguém quer fazer',
    texto: 'O primeiro trabalho foi reforma e manutenção: obra pequena, prazo curto, cliente ' +
           'em cima. É onde se aprende a trabalhar sem atrapalhar, e foi de lá que veio a ' +
           'especialidade da casa.' },
  { n: '04', titulo: 'Obra sem parar a operação',
    texto: 'Loja aberta, escritório ocupado, prédio em funcionamento. A SPX executa na janela ' +
           'que a operação permite, com controle de poeira e ruído e a área liberada limpa a ' +
           'cada turno.' },
];

/**
 * Segmentos atendidos. Entram no `knowsAbout` da empresa: é o que faz um
 * agente de busca entender que "reforma de clínica" e "obra de restaurante"
 * são coisas que a SPX faz, mesmo sem uma página só para cada uma.
 */
export const segmentos = [
  'Escritórios corporativos', 'Comércio e varejo', 'Restaurantes e cafés',
  'Clínicas e laboratórios', 'Data center e CPD', 'Hotelaria e hospedagem',
  'Educação e treinamento', 'Áreas comuns de condomínio',
  'Retrofit em ambiente ocupado', 'Manutenção predial',
];

export const empresa = {
  nome: 'SPX Engenharia',
  razaoSocial: FALTA,            // razão social do contrato social
  cnpj: FALTA,                   // só publicar depois de conferir
  segmento: 'Engenharia civil',
  base: 'São Paulo, SP',
  atuacao: 'São Paulo e região metropolitana',
  endereco: FALTA,               // rua, número, bairro, CEP — ou FALTA se não atende no local
  telefone: '+55 11 95275-1874',
  whatsapp: '5511952751874',
  email: 'contato@spxengenharia.com.br',
  dominio: 'https://spxengenharia.com.br',
  instagram: FALTA,              // endereço completo do perfil
  linkedin: FALTA,
  horario: 'Segunda a sexta, das 8h às 18h',

  /* A frase que define a empresa em uma linha. É ela que uma IA cita quando
     perguntam "o que é a SPX Engenharia". Factual, sem adjetivo de venda. */
  definicao: 'A SPX Engenharia é uma empresa de engenharia civil com base em São Paulo, ' +
    'que planeja, gerencia e executa obras corporativas e comerciais.',

  /* O que a empresa vende, na ordem em que precisa ser entendida. */
  proposta: 'Engenharia, gestão e execução conduzidas pela mesma equipe, do ' +
    'levantamento à entrega.',
};

export const responsavel = {
  nome: FALTA,                   // nome completo do engenheiro responsável
  titulo: 'Engenheiro civil',
  formacao: FALTA,               // curso e instituição
  anosExperiencia: 9,            // confirmado: experiência profissional, não idade da empresa
  especialidades: FALTA,         // lista, ex.: ['Obra corporativa', 'Retrofit em ambiente ocupado']
  foto: FALTA,                   // caminho da foto profissional em img/
  resumo: FALTA,                 // 2 a 3 frases sobre a trajetória
};

/**
 * Números do site.
 *
 * `validado: false` mantém o número fora das páginas. O que está validado
 * aparece com a redação exata de `rotulo` — e o rótulo importa: "9 anos de
 * experiência do engenheiro responsável" é verdade; "9 anos de mercado" não é
 * a mesma afirmação e não foi confirmada.
 */
export const numeros = [
  { chave: 'anos', icone: 'anos',   valor: 9,  prefixo: '+',
    rotulo: 'anos de experiência do engenheiro responsável',
    validado: true },
  /* A SPX tem um ano. Os dois números abaixo são da trajetória do engenheiro
     responsável, não do CNPJ — e o rótulo diz isso. Publicar "+40 obras
     entregues" seco ao lado de uma empresa de um ano é o tipo de coisa que o
     cliente confere e não fecha; dito certo, é uma força: nove anos de campo
     numa empresa nova. */
  { chave: 'obras', icone: 'obras',  valor: 40, prefixo: '+',
    rotulo: 'obras na trajetória do responsável técnico',
    validado: true },
  { chave: 'area', icone: 'area',   valor: 42, sufixo: ' mil m²',
    rotulo: 'construídos ao longo dessa trajetória',
    validado: true },
  { chave: 'etapas', icone: 'cronograma', valor: 7,
    rotulo: 'etapas, do levantamento à entrega',
    validado: true },
];

/** Etapas do processo. É o que diferencia engenharia de mão de obra. */
export const processo = [
  { icone: 'visita', camada: 'engenharia', n: '01', nome: 'Levantamento',
    texto: 'Visita ao local, medição, registro das condições existentes e das restrições do ' +
           'condomínio ou do shopping. Nada é orçado sem ver a obra de perto.' },
  { icone: 'orcamento', camada: 'engenharia', n: '02', nome: 'Orçamento',
    texto: 'Proposta técnica com todos os serviços discriminados, quantidades e critérios de ' +
           'medição. Sem verba aberta e sem "a definir".' },
  { icone: 'planejamento', camada: 'gestao', n: '03', nome: 'Planejamento',
    texto: 'Cronograma físico-financeiro com as frentes amarradas entre si, caminho crítico ' +
           'identificado e desembolso previsto por etapa.' },
  { icone: 'compat', camada: 'engenharia', n: '04', nome: 'Coordenação',
    texto: 'Compatibilização entre arquitetura, estrutura, elétrica, hidráulica, climatização ' +
           'e incêndio antes de a equipe subir, para o conflito aparecer no papel e não na parede.' },
  { icone: 'execucao', camada: 'execucao', n: '05', nome: 'Execução',
    texto: 'Equipe própria e fornecedores coordenados pela mesma engenharia que orçou e ' +
           'planejou, com responsável técnico nomeado.' },
  { icone: 'acompanha', camada: 'gestao', n: '06', nome: 'Controle',
    texto: 'Medição semanal do avanço contra o cronograma, registro fotográfico e relatório ' +
           'de desvio enquanto ainda dá para corrigir.' },
  { icone: 'entrega', camada: 'execucao', n: '07', nome: 'Entrega',
    texto: 'Vistoria conjunta, lista de pendências fechada, as built e manuais das instalações.' },
];

/**
 * As três camadas do trabalho. Cada etapa do processo acima pertence a uma
 * delas pelo campo `camada` — é assim que o diagrama da página de serviços
 * sabe o que mostrar quando alguém clica numa das bolas. A numeração não fica
 * contínua dentro de cada camada (engenharia é 01, 02 e 04) e isso é
 * proposital: mostra que as camadas se cruzam ao longo da obra em vez de
 * acontecerem uma depois da outra.
 */
export const camadas = [
  { id: 'engenharia', nome: 'Engenharia', papel: 'O que fazer', icone: 'projeto',
    texto: 'Define o escopo antes de existir preço: o que está lá hoje, o que vai ser feito e ' +
           'como as disciplinas se encaixam entre si.' },
  { id: 'gestao', nome: 'Gestão', papel: 'Como fazer', icone: 'cronograma',
    texto: 'Amarra prazo e desembolso e mede o avanço contra o previsto enquanto ainda dá ' +
           'tempo de corrigir.' },
  { id: 'execucao', nome: 'Execução', papel: 'Fazer acontecer', icone: 'execucao',
    texto: 'Põe a equipe em obra sob a mesma engenharia que orçou e planejou, e fecha a ' +
           'entrega documentada.' },
];

/**
 * SERVIÇOS — cada um vira uma página em /servicos/<slug>.
 *
 * `confirmar: true` marca serviço que o material estratégico cita mas que
 * ainda não foi confirmado como algo que a SPX executa hoje. Esses ficam de
 * fora do site até você confirmar: prometer serviço que não se entrega custa
 * mais caro que não aparecer na busca por ele.
 */
export const servicos = [
  {
    slug: 'obras-corporativas',
    fotos: ['sala-reuniao-azul', 'recepcao-marmore', 'lounge-recepcao', 'mesa-vista-sp', 'estante-espinha-peixe'],
    icone: 'corporativa',
    pergunta: 'O que é uma obra corporativa?',
    resposta: 'Obra corporativa é a construção ou reforma completa de um espaço de trabalho: layout, divisórias, forro, piso, instalações elétricas e de dados, climatização, iluminação, marcenaria e acabamento. A SPX Engenharia executa obras corporativas em São Paulo e região metropolitana, com engenharia própria do levantamento à entrega.',
    fatos: [
      'O prazo sai do cronograma físico-financeiro entregue junto com a proposta.',
      'A obra pode ser executada com o escritório em funcionamento, dividida em frentes por setor.',
      'Um engenheiro responsável é nomeado, com ART emitida para a obra, antes da assinatura.',
    ],
    nome: 'Obras corporativas',
    h1: 'Obras corporativas em São Paulo',
    title: 'Obra corporativa em São Paulo | SPX Engenharia',
    descricao: 'Planejamento, gerenciamento e execução de obras corporativas em São Paulo: ' +
      'escritórios, sedes e espaços administrativos, com engenharia própria do levantamento à entrega.',
    resumo: 'Escritórios, sedes e espaços administrativos executados com cronograma ' +
      'físico-financeiro e responsável técnico nomeado antes da assinatura.',
    oQueE: 'Obra corporativa é a construção ou reforma completa de um espaço de trabalho: ' +
      'layout, divisórias, forro, piso, instalações elétricas e de dados, climatização, ' +
      'iluminação, marcenaria e acabamento. Diferente de uma reforma residencial, ela é ' +
      'regida por prazo de contrato de locação, regras do condomínio e, quase sempre, pela ' +
      'operação do cliente que não pode parar.',
    paraQuem: ['Empresas montando ou mudando de sede', 'Escritórios em expansão ou redução de área',
               'Espaços administrativos de indústria e serviço', 'Coworkings e centros de treinamento',
               'Arquitetos com projeto pronto e sem executor'],
    executa: ['Layout e divisórias (drywall, vidro, marcenaria)', 'Forro e iluminação',
              'Instalações elétricas, lógica e telefonia', 'Climatização e exaustão',
              'Prevenção contra incêndio conforme exigência do prédio',
              'Pisos elevados, vinílicos, porcelanato e carpete',
              'Marcenaria corporativa sob medida', 'Pintura e acabamento',
              'Recepção, copa, sala de reunião e áreas de convivência'],
    diferenciais: ['Cronograma físico-financeiro entregue junto com a proposta, não depois',
                   'Compatibilização das disciplinas antes de a equipe subir',
                   'Interlocução única: quem orçou é quem executa',
                   'Relatório semanal de avanço medido contra o cronograma'],
    faq: [
      ['Vocês executam projeto feito por outro arquiteto?',
       'Sim. A SPX lê, compatibiliza e executa projeto de terceiros. A compatibilização entre ' +
       'as disciplinas acontece antes do início, e as divergências voltam para o autor do ' +
       'projeto antes de virarem retrabalho na obra.'],
      ['Dá para executar com o escritório funcionando?',
       'Sim. É a situação mais comum em obra corporativa. O trabalho é dividido em frentes por ' +
       'setor, com isolamento, controle de poeira e ruído e serviços críticos fora do horário ' +
       'comercial ou no fim de semana.'],
      ['Quanto tempo demora uma obra corporativa?',
       'Depende da área e do escopo. O prazo sai do cronograma feito na proposta, com as ' +
       'frentes amarradas e o caminho crítico identificado, e não de uma estimativa por metro quadrado.'],
    ],
    cta: 'Sua empresa precisa transformar um espaço? Converse com a SPX.',
  },
  {
    slug: 'obras-comerciais',
    fotos: ['restaurante-fachada', 'restaurante-salao', 'restaurante-cozinha', 'restaurante-pratos', 'restaurante-bar'],
    icone: 'varejo',
    pergunta: 'A SPX executa obra de loja em shopping?',
    resposta: 'Sim. A SPX Engenharia executa obras de varejo em rua e em shopping center em São Paulo, dentro da janela de horário liberada pela administração e com o projeto aprovado antes da mobilização.',
    fatos: [
      'O cronograma nasce amarrado à data de inauguração, com a folga identificada.',
      'A documentação e o projeto são submetidos à administração antes de qualquer serviço começar.',
      'Cozinha industrial, exaustão, gás e os pontos que a vigilância sanitária exige entram no escopo.',
    ],
    nome: 'Obras comerciais e varejo',
    h1: 'Obras comerciais e de varejo em São Paulo',
    title: 'Obra comercial e de varejo em São Paulo | SPX Engenharia',
    descricao: 'Execução de lojas, restaurantes e operações de varejo em rua e em shopping, ' +
      'com prazo de inauguração e regras de administração respeitados.',
    resumo: 'Lojas, flagships, restaurantes e quiosques, em rua e em shopping, com prazo de ' +
      'inauguração tratado como data de contrato.',
    oQueE: 'Obra de varejo tem uma diferença que muda tudo: existe uma data de inauguração ' +
      'que não se move. Em shopping, ainda há um manual de lojista, uma janela de trabalho ' +
      'definida pela administração e uma aprovação de projeto antes de qualquer serviço começar.',
    paraQuem: ['Redes abrindo ou reformando loja', 'Operações de alimentação',
               'Flagships e lojas conceito', 'Franqueados com projeto padrão da marca',
               'Quiosques e operações em corredor de shopping'],
    executa: ['Fachada, vitrine e comunicação visual', 'Layout de loja e área de vendas',
              'Cozinha industrial e área de produção', 'Instalações elétricas, hidráulicas e de gás',
              'Exaustão e climatização', 'Prevenção contra incêndio e rota de fuga',
              'Marcenaria de expositor e balcão', 'Piso, forro, iluminação cênica e acabamento'],
    diferenciais: ['Trabalho dentro da janela de horário da administração do shopping',
                   'Aprovação de projeto junto à administração antes da mobilização',
                   'Cronograma amarrado à data de inauguração, com folga identificada',
                   'Equipe dimensionada para virada de noite quando o prazo exige'],
    faq: [
      ['Vocês trabalham dentro do horário do shopping?',
       'Sim. A obra é planejada dentro da janela que a administração libera, normalmente à ' +
       'noite, e o cronograma já nasce contando com essa restrição.'],
      ['A SPX cuida da aprovação junto à administração?',
       'Sim. A documentação e o projeto são submetidos à administração antes da mobilização, ' +
       'porque começar sem aprovação é o caminho mais rápido para a obra ser embargada.'],
      ['Executam cozinha industrial?',
       'Sim, incluindo exaustão, instalação de gás e os pontos de água e esgoto que a ' +
       'vigilância sanitária exige.'],
    ],
    cta: 'Tem data de inauguração marcada? Fale com a SPX.',
  },
  {
    slug: 'retrofit',
    fotos: ['banheiro-marmore', 'lavabo-azul', 'lavabo-bordo', 'cozinha-marcenaria'],
    icone: 'retrofit',
    pergunta: 'O que é retrofit e dá para fazer com o prédio ocupado?',
    resposta: 'Retrofit é modernizar um imóvel existente sem demolir: trocar instalações no fim da vida útil, adequar o prédio a normas que mudaram e atualizar o acabamento. A SPX executa retrofit em ambiente ocupado em São Paulo, com a obra dividida em frentes e a área em serviço isolada.',
    fatos: [
      'A diferença para uma reforma é a profundidade: retrofit chega até a instalação.',
      'Serviços mais invasivos são programados para fora do horário comercial e para o fim de semana.',
      'As condições reais são levantadas antes do orçamento, porque prédio antigo raramente bate com a planta.',
    ],
    nome: 'Retrofit',
    h1: 'Retrofit de edifícios e escritórios em São Paulo',
    title: 'Retrofit em ambiente ocupado em São Paulo | SPX Engenharia',
    descricao: 'Retrofit de escritórios e edifícios em São Paulo, executado com o imóvel ' +
      'ocupado e a operação do cliente funcionando.',
    resumo: 'Atualizar um imóvel antigo, nas instalações, no layout, no acabamento e na norma, sem ' +
      'esvaziar o prédio.',
    oQueE: 'Retrofit é modernizar o que já existe em vez de demolir: trocar instalações que ' +
      'chegaram ao fim da vida útil, adequar o prédio a normas que mudaram desde a construção, ' +
      'melhorar desempenho térmico e de iluminação e atualizar o acabamento. A diferença mais ' +
      'dura em relação a uma obra nova é que quase sempre há gente trabalhando no andar de cima.',
    paraQuem: ['Edifícios comerciais dos anos 1970 a 2000', 'Escritórios com instalação no fim da vida útil',
               'Prédios que precisam se adequar a norma vigente', 'Proprietários preparando o imóvel para locação',
               'Empresas que herdaram um andar em mau estado'],
    executa: ['Substituição de instalações elétricas e hidráulicas',
              'Atualização de climatização', 'Adequação de prevenção contra incêndio',
              'Acessibilidade conforme NBR 9050', 'Recuperação de fachada e esquadria',
              'Renovação de forro, piso e iluminação', 'Modernização de áreas comuns e sanitários',
              'Reforço e recuperação estrutural pontual'],
    diferenciais: ['Obra fatiada em frentes que isolam o serviço da área ocupada',
                   'Controle de poeira, ruído e vibração com barreira e horário definido',
                   'Serviço crítico programado para fim de semana e feriado',
                   'Levantamento das condições reais antes do orçamento, porque prédio antigo sempre esconde surpresa'],
    faq: [
      ['Dá para fazer retrofit com o prédio ocupado?',
       'Sim. É o cenário mais comum. A obra é dividida por frente e por andar, com isolamento ' +
       'físico da área em serviço, controle de poeira e ruído e as etapas mais invasivas ' +
       'programadas para fora do horário comercial.'],
      ['Qual a diferença entre retrofit e reforma?',
       'Reforma altera o que está aparente. Retrofit vai até a instalação: troca o que chegou ' +
       'ao fim da vida útil e adequa o imóvel a normas que mudaram depois que ele foi construído.'],
      ['Como lidam com surpresa em prédio antigo?',
       'Levantando as condições reais antes de orçar, e prevendo no cronograma o tempo de ' +
       'investigação. Prédio antigo raramente bate com a planta original que existe no arquivo.'],
    ],
    cta: 'Precisa adaptar um espaço sem interromper a operação? Converse com a SPX.',
  },
  {
    slug: 'reformas',
    fotos: ['lavabo-terracota', 'lavabo-bordo', 'banheiro-marmore', 'cozinha-marcenaria'],
    icone: 'reforma',
    pergunta: 'Quanto tempo leva para receber um orçamento de reforma?',
    resposta: 'O orçamento preliminar da SPX Engenharia sai em até cinco dias úteis depois da visita técnica ao local. Nenhuma reforma é orçada sem essa visita.',
    fatos: [
      'A proposta vem discriminada por serviço, com quantidade e critério de medição.',
      'Reforma de escopo curto recebe cronograma, não estimativa.',
      'Havendo alteração de instalação ou de rota de fuga, a SPX nomeia responsável técnico com ART.',
    ],
    nome: 'Reformas',
    h1: 'Reforma de escritório e espaço comercial em São Paulo',
    title: 'Reforma comercial e de escritório em São Paulo | SPX Engenharia',
    descricao: 'Reforma de escritórios, salas comerciais e lojas em São Paulo, com escopo ' +
      'fechado, cronograma e responsável técnico.',
    resumo: 'Escopo delimitado, prazo curto e o mesmo rigor de uma obra completa: proposta ' +
      'discriminada, cronograma e medição.',
    oQueE: 'Reforma é a intervenção de escopo delimitado, um andar, um setor, uma área, que ' +
      'não mexe na estrutura nem troca todas as instalações do prédio. Escopo menor não ' +
      'significa controle menor: é justamente na reforma de prazo curto que a falta de ' +
      'planejamento aparece mais rápido.',
    paraQuem: ['Empresas renovando um andar ou setor', 'Salas comerciais entre locações',
               'Lojas em atualização de identidade', 'Clínicas e consultórios',
               'Espaços que precisam de mudança de layout'],
    executa: ['Mudança de layout e divisórias', 'Troca de piso, forro e iluminação',
              'Revisão de pontos elétricos e de dados', 'Pintura e acabamento',
              'Marcenaria sob medida', 'Reforma de copa, recepção e sanitário',
              'Impermeabilização pontual'],
    diferenciais: ['Proposta com todos os serviços discriminados, sem verba aberta',
                   'Prazo curto tratado com cronograma, não com estimativa',
                   'Uma equipe só, sem terceirização em cascata',
                   'Lista de pendências fechada antes da entrega'],
    faq: [
      ['Vocês fazem obra pequena?',
       'Sim, desde que o escopo seja definido. O que não fazemos é orçar sem visita: reforma ' +
       'orçada por telefone vira aditivo na segunda semana.'],
      ['Em quanto tempo sai o orçamento?',
       'O orçamento preliminar sai em até cinco dias úteis depois da visita técnica.'],
      ['Precisa de responsável técnico numa reforma?',
       'Sempre que houver alteração de instalação, de layout com implicação em rota de fuga ' +
       'ou exigência do condomínio. Na dúvida, a SPX nomeia responsável técnico com ART.'],
    ],
    cta: 'Solicite uma avaliação da sua obra.',
  },
  {
    slug: 'gerenciamento-de-obras',
    fotos: ['recepcao-marmore', 'restaurante-salao', 'estante-espinha-peixe', 'mesa-vista-sp'],
    icone: 'gerencia',
    pergunta: 'Dá para contratar só o gerenciamento da obra?',
    resposta: 'Sim. A SPX Engenharia gerencia obras executadas por terceiros em São Paulo, cobrindo cronograma, coordenação de fornecedores, conferência de medição em campo e controle de desvio, com responsável técnico nomeado.',
    fatos: [
      'A medição é conferida em obra, não aceita no papel.',
      'O desvio é reportado enquanto ainda dá para corrigir, não no fechamento.',
      'Na concorrência, o mesmo escopo vai para todos os concorrentes. Comparar escopos diferentes é comparar coisas diferentes.',
    ],
    nome: 'Gerenciamento de obras',
    h1: 'Gerenciamento de obras em São Paulo',
    title: 'Gerenciamento de obras em São Paulo | SPX Engenharia',
    descricao: 'Gerenciamento de obras em São Paulo: planejamento, coordenação de ' +
      'fornecedores, controle de cronograma e medição, com ou sem execução pela SPX.',
    resumo: 'Planejar, coordenar e medir a obra, inclusive quando quem executa é outro.',
    oQueE: 'Gerenciamento é a função de engenharia que existe entre o contratante e quem ' +
      'levanta a parede: montar o cronograma, coordenar as disciplinas, conferir medição, ' +
      'controlar desvio e responder tecnicamente pelo andamento. Pode ser contratado junto ' +
      'com a execução ou sozinho, para acompanhar obra tocada por terceiros.',
    paraQuem: ['Empresas sem engenharia própria', 'Contratantes com mais de um fornecedor na mesma obra',
               'Investidores acompanhando obra à distância', 'Arquitetos que querem o projeto executado como foi desenhado',
               'Quem já tem executor e precisa de controle independente'],
    executa: ['Cronograma físico-financeiro e caminho crítico',
              'Compatibilização entre as disciplinas de projeto',
              'Concorrência e análise técnica de propostas',
              'Coordenação de fornecedores e equipes em campo',
              'Conferência de medição e boletim de avanço',
              'Controle de desvio de prazo e de custo',
              'Relatório periódico com registro fotográfico',
              'Recebimento e conferência de entrega'],
    diferenciais: ['Medição conferida em campo, não aceita no papel',
                   'Desvio reportado enquanto ainda dá para corrigir',
                   'Análise técnica das propostas, e não só comparação de preço',
                   'Responsável técnico nomeado'],
    faq: [
      ['Dá para contratar só o gerenciamento?',
       'Sim. A SPX gerencia obra executada por terceiros, e nesse caso o papel é justamente ' +
       'defender o interesse de quem contrata na conferência de medição e de escopo.'],
      ['O que entra num relatório de acompanhamento?',
       'Avanço medido contra o cronograma previsto, desvios com causa identificada, registro ' +
       'fotográfico das frentes, pendências abertas e o que está previsto para o período seguinte.'],
      ['Como funciona a concorrência de preço?',
       'Com o mesmo escopo enviado a todos os concorrentes. Comparar propostas com escopos ' +
       'diferentes é comparar coisas diferentes, e é assim que a proposta mais barata vira a mais cara.'],
    ],
    cta: 'Sua obra precisa de engenharia acompanhando? Fale com a SPX.',
  },
  {
    slug: 'manutencao-predial',
    fotos: ['lounge-recepcao', 'banheiro-marmore', 'recepcao-marmore', 'lavabo-azul'],
    icone: 'manutencao',
    pergunta: 'A SPX faz manutenção predial para empresas?',
    resposta: 'Sim. A SPX Engenharia presta manutenção predial preventiva e corretiva para empresas em São Paulo, com plano por sistema, registro de cada intervenção e prazo de atendimento acordado em contrato.',
    fatos: [
      'Não é necessário ter feito a obra com a SPX: a manutenção começa por um levantamento das condições atuais.',
      'Preventiva evita a falha. Corretiva conserta depois, sempre mais cara e na hora errada.',
      'Cada intervenção é registrada, formando o histórico do imóvel.',
    ],
    nome: 'Manutenção predial',
    h1: 'Manutenção predial corporativa em São Paulo',
    title: 'Manutenção predial corporativa em São Paulo | SPX Engenharia',
    descricao: 'Manutenção predial preventiva e corretiva para empresas em São Paulo, com ' +
      'plano, registro e atendimento a chamado.',
    resumo: 'Preventiva com plano e registro, corretiva com prazo de atendimento definido.',
    oQueE: 'Manutenção predial é o que mantém instalação e acabamento funcionando depois que ' +
      'a obra acabou. Preventiva segue plano e calendário; corretiva atende chamado. As duas ' +
      'precisam de registro, porque manutenção sem histórico não permite prever nada.',
    paraQuem: ['Empresas com sede própria ou andar corporativo', 'Redes com várias unidades',
               'Administradoras de imóvel comercial', 'Operações que não podem parar'],
    executa: ['Plano de manutenção preventiva por sistema',
              'Elétrica, hidráulica e climatização', 'Reparo de acabamento, forro e pintura',
              'Marcenaria e serralheria', 'Impermeabilização e combate a infiltração',
              'Pequenas adequações de layout', 'Atendimento a chamado corretivo'],
    diferenciais: ['Plano por sistema, com periodicidade definida',
                   'Registro de cada intervenção, formando histórico do imóvel',
                   'Prazo de atendimento acordado em contrato',
                   'A mesma engenharia que executou a obra conhece o que está atrás da parede'],
    faq: [
      ['Atendem chamado urgente?',
       'Sim, dentro do prazo definido em contrato. O prazo varia conforme a criticidade do ' +
       'sistema e é acordado antes, não na hora do problema.'],
      ['Precisa ter feito a obra com vocês?',
       'Não. A manutenção pode começar com um levantamento das condições atuais do imóvel.'],
      ['O que é preventiva e o que é corretiva?',
       'Preventiva é a intervenção programada que evita a falha. Corretiva é a que conserta ' +
       'depois que ela aconteceu, sempre mais cara e sempre na hora errada.'],
    ],
    cta: 'Solicite uma avaliação do seu imóvel.',
  },
  {
    slug: 'projetos',
    fotos: ['sala-reuniao-azul', 'estante-espinha-peixe', 'mesa-vista-sp', 'lounge-recepcao'],
    icone: 'projeto',
    pergunta: 'A SPX faz projeto sem executar a obra?',
    resposta: 'Sim. A SPX Engenharia desenvolve projetos de engenharia, levantamento técnico, as built e compatibilização entre disciplinas em São Paulo, contratáveis separadamente da execução.',
    fatos: [
      'A compatibilização acontece antes da mobilização: conflito no papel custa uma linha, na parede custa uma semana.',
      'Imóvel sem planta confiável começa por levantamento técnico em campo.',
      'O as built é entregue junto com a obra, não meses depois.',
    ],
    nome: 'Projetos de engenharia',
    h1: 'Projetos de engenharia e compatibilização em São Paulo',
    title: 'Projetos de engenharia em São Paulo | SPX Engenharia',
    descricao: 'Projetos de engenharia, levantamento técnico, as built e compatibilização ' +
      'de disciplinas para obras corporativas e comerciais em São Paulo.',
    resumo: 'O desenho que a obra vai seguir, compatibilizado antes de a equipe subir.',
    oQueE: 'Projeto é onde o conflito custa barato. Um ponto de elétrica que bate com uma ' +
      'viga custa uma linha redesenhada no papel e custa uma semana de obra parada em campo. ' +
      'A compatibilização entre as disciplinas é a etapa que a maioria pula e que responde ' +
      'pela maior parte do retrabalho.',
    paraQuem: ['Obras que começam sem projeto executivo', 'Imóveis sem planta atualizada',
               'Projetos de arquitetura sem as disciplinas complementares',
               'Regularização que exige levantamento do que foi construído'],
    executa: ['Levantamento técnico e cadastro do existente',
              'Projeto de interiores e detalhamento executivo',
              'Projeto elétrico e de dados', 'Projeto hidrossanitário',
              'Projeto de climatização e exaustão', 'Projeto luminotécnico',
              'Projeto de prevenção contra incêndio',
              'Compatibilização entre as disciplinas', 'As built ao fim da obra'],
    diferenciais: ['Projeto feito por quem também executa, então o desenho é construtível',
                   'Compatibilização antes da mobilização, não durante a obra',
                   'As built entregue com a obra, e não meses depois'],
    faq: [
      ['Fazem projeto sem executar a obra?',
       'Sim. E também executam projeto de terceiros. As duas coisas são contratáveis separadamente.'],
      ['O que é as built?',
       'É a planta do que foi realmente construído, com as alterações que aconteceram durante ' +
       'a obra. Sem ela, a próxima intervenção começa às cegas.'],
      ['Meu imóvel não tem planta. Dá para começar?',
       'Sim, com levantamento técnico em campo. É o primeiro serviço em qualquer imóvel antigo ' +
       'sem documentação confiável.'],
    ],
    cta: 'Precisa de projeto antes da obra? Fale com a SPX.',
    confirmar: 'Confirmar quais disciplinas de projeto a SPX desenvolve internamente e quais ' +
               'são feitas por parceiro.',
  },
  {
    slug: 'consultoria-em-engenharia',
    fotos: ['restaurante-fachada', 'banheiro-marmore', 'recepcao-marmore', 'lavabo-terracota'],
    icone: 'laudo',
    pergunta: 'Preciso de laudo antes de alugar uma sala comercial?',
    resposta: 'É a hora mais barata de descobrir problema. A SPX Engenharia emite laudo técnico e vistoria de imóvel comercial em São Paulo, com registro fotográfico, conclusão objetiva e ART.',
    fatos: [
      'A vistoria antes da assinatura evita herdar instalação no fim da vida útil e adequação de norma fora do combinado.',
      'O parecer é técnico e independente de quem executou a obra.',
      'Laudo emitido por engenheiro habilitado, acompanhado de ART, tem validade legal.',
    ],
    nome: 'Consultoria e laudos',
    h1: 'Consultoria em engenharia, laudos e vistorias em São Paulo',
    title: 'Consultoria em engenharia e laudos técnicos em São Paulo | SPX Engenharia',
    descricao: 'Consultoria em engenharia, laudo técnico, vistoria e adequação de norma para ' +
      'imóveis corporativos e comerciais em São Paulo.',
    resumo: 'Parecer de engenheiro para decidir antes de contratar obra.',
    oQueE: 'Nem toda pergunta de engenharia vira obra. Avaliar se um imóvel serve antes de ' +
      'assinar a locação, entender por que a infiltração volta, saber o que a norma exige ' +
      'antes do auto de vistoria. Tudo isso é decisão que se toma com laudo, e sai muito ' +
      'mais barato do que descobrir depois.',
    paraQuem: ['Quem vai locar ou comprar imóvel comercial', 'Contratantes com patologia recorrente',
               'Empresas em processo de adequação de norma', 'Quem precisa de parecer independente sobre obra em andamento'],
    executa: ['Vistoria técnica de imóvel antes da locação',
              'Laudo de patologia construtiva', 'Laudo de infiltração e umidade',
              'Adequação a norma e regularização', 'Parecer técnico sobre obra de terceiros',
              'Avaliação de viabilidade de layout em imóvel existente',
              'Vistoria de entrega e de devolução de imóvel'],
    diferenciais: ['Parecer escrito, com registro fotográfico e conclusão objetiva',
                   'Emitido por engenheiro com responsabilidade técnica',
                   'Independente: o laudo diz o que encontrou, não o que vende obra'],
    faq: [
      ['Preciso de laudo antes de alugar uma sala comercial?',
       'É a hora mais barata de descobrir problema. Vistoria antes da assinatura evita herdar ' +
       'instalação no fim da vida útil e adequação de norma que não estava no combinado.'],
      ['Vocês fazem laudo de obra executada por outra empresa?',
       'Sim. O parecer é técnico e independente do executor.'],
      ['O laudo tem validade legal?',
       'Sim, quando emitido por engenheiro habilitado e acompanhado de ART.'],
    ],
    cta: 'Precisa de um parecer antes de decidir? Fale com a SPX.',
    confirmar: 'Confirmar quais laudos e vistorias a SPX emite e sob qual ART.',
  },
];

/**
 * PROJETOS — cada um vira uma página em /obras/<slug>.
 *
 * Regra dura, e ela vem do próprio planejamento da SPX: metragem, valor,
 * prazo, quantidade de equipe, materiais e disciplinas NÃO entram sem
 * confirmação. Uma página de case com número inventado é pior que nenhuma
 * página: é a primeira coisa que um cliente corporativo checa.
 *
 * O gerador só publica o projeto que tiver, no mínimo: nome, região, tipo,
 * atuação e pelo menos uma foto. O resto aparece conforme for preenchido.
 */
export const projetos = [
  {
    slug: 'paulista',
    nome: 'Projeto Paulista',
    regiao: 'Avenida Paulista',
    cidade: 'São Paulo, SP',
    tipo: FALTA,                 // ex.: 'Obra corporativa' — confirmar
    atuacao: 'Gerenciamento e execução',   // confirmado no material estratégico
    periodo: 'A partir de 2023',           // confirmado no material estratégico
    escopo: FALTA,               // lista dos serviços executados
    desafio: FALTA,              // o problema real da obra, em 2 ou 3 frases
    solucao: FALTA,              // como a engenharia resolveu
    resultado: FALTA,            // o que o cliente ganhou, sem número não confirmado
    fotos: FALTA,                // ex.: ['sala-reuniao-azul', 'recepcao-marmore']
  },
  {
    slug: 'jardins',
    nome: 'Projeto Jardins',
    regiao: 'Jardins',
    cidade: 'São Paulo, SP',
    tipo: FALTA,
    atuacao: FALTA,
    periodo: FALTA,
    escopo: FALTA,
    desafio: FALTA,
    solucao: FALTA,
    resultado: FALTA,
    fotos: FALTA,
  },
  {
    slug: 'brooklin',
    nome: 'Projeto Brooklin',
    regiao: 'Brooklin',
    cidade: 'São Paulo, SP',
    tipo: FALTA,
    atuacao: FALTA,
    periodo: FALTA,
    escopo: FALTA,
    desafio: FALTA,
    solucao: FALTA,
    resultado: FALTA,
    fotos: FALTA,
  },
];

/**
 * PERGUNTAS FREQUENTES — viram a página /duvidas e o FAQPage do schema.
 *
 * A primeira frase de cada resposta precisa responder sozinha. É assim que o
 * Google monta trecho em destaque e é assim que uma IA cita: ela pega a
 * primeira frase. "Sim. A SPX executa..." funciona; "Bom, depende..." não.
 */
export const duvidas = [
  ['O que a SPX Engenharia faz?',
   'A SPX Engenharia planeja, gerencia e executa obras corporativas e comerciais em São Paulo ' +
   'e região. O trabalho vai do levantamento em campo à entrega, com engenharia própria em ' +
   'todas as etapas.'],
  ['A SPX executa obras corporativas?',
   'Sim. Obra corporativa é o principal segmento da SPX: escritórios, sedes e espaços ' +
   'administrativos, incluindo layout, instalações, climatização, marcenaria e acabamento.'],
  ['A SPX trabalha com retrofit?',
   'Sim. A SPX executa retrofit em ambiente ocupado, com a obra dividida em frentes, ' +
   'isolamento da área em serviço e os serviços mais invasivos programados para fora do ' +
   'horário comercial.'],
  ['A SPX executa reforma de escritório?',
   'Sim. Reformas de escopo delimitado, um andar ou um setor, recebem o mesmo tratamento de ' +
   'uma obra completa: proposta discriminada, cronograma e medição.'],
  ['A SPX faz gerenciamento de obras?',
   'Sim, inclusive de obra executada por terceiros. O gerenciamento cobre cronograma, ' +
   'coordenação de fornecedores, conferência de medição e controle de desvio.'],
  ['A SPX trabalha com arquitetos?',
   'Sim. A SPX executa projeto desenvolvido por outro arquiteto, fazendo a compatibilização ' +
   'entre as disciplinas antes do início da obra e devolvendo as divergências ao autor do ' +
   'projeto antes que virem retrabalho.'],
  ['A SPX executa projeto desenvolvido por outro arquiteto?',
   'Sim. É uma das formas mais comuns de contratação: o arquiteto entrega o projeto e a SPX ' +
   'responde pela engenharia e pela execução.'],
  ['A SPX atende empresas?',
   'Sim. O trabalho da SPX é B2B: empresas, escritórios, redes de varejo, administradoras de ' +
   'imóvel e escritórios de arquitetura.'],
  ['A SPX atende São Paulo?',
   'Sim. A base é São Paulo capital, e o atendimento cobre a cidade e a região metropolitana.'],
  ['Como solicitar um orçamento?',
   'Pelo formulário do site, por WhatsApp ou por telefone. O orçamento preliminar sai em até ' +
   'cinco dias úteis depois da visita técnica ao local.'],
  ['Como funciona a visita técnica?',
   'Um engenheiro vai ao local, mede, registra as condições existentes e levanta as ' +
   'restrições do condomínio ou da administração. Nenhuma obra é orçada sem essa visita.'],
  ['Quanto tempo demora uma obra?',
   'Depende do escopo e da área. O prazo sai do cronograma físico-financeiro montado na ' +
   'proposta, com as frentes amarradas entre si e o caminho crítico identificado, e não de ' +
   'uma média por metro quadrado.'],
  ['A obra pode ser feita com o imóvel ocupado?',
   'Sim. É a situação mais comum nas obras da SPX. O trabalho é fatiado em frentes, com ' +
   'isolamento físico, controle de poeira e ruído e serviços críticos fora do horário comercial.'],
  ['Quem responde tecnicamente pela obra?',
   'Um engenheiro responsável nomeado antes da assinatura do contrato, com ART emitida para a obra.'],
];

/**
 * ACERVO — os cartões do carrossel da página de projetos.
 *
 * O texto descreve o que está na foto, não afirma nada sobre obra específica:
 * enquanto os projetos não forem confirmados, descrever a imagem é honesto e
 * afirmar autoria de um trabalho não é.
 */
export const acervo = [
  { foto: 'sala-reuniao-azul', etiqueta: 'Obra corporativa', titulo: 'Sala de reunião',
    linha: 'Parede em azul profundo',
    texto: 'Marcenaria sob medida na parede de fundo, forro com iluminação embutida e persiana horizontal em toda a fachada.' },
  { foto: 'recepcao-marmore', etiqueta: 'Obra corporativa', titulo: 'Recepção',
    linha: 'Balcão em mármore',
    texto: 'Balcão em pedra natural, parede de acento em bordô e marcenaria de apoio alinhada ao piso vinílico.' },
  { foto: 'lounge-recepcao', etiqueta: 'Obra corporativa', titulo: 'Lounge de espera',
    linha: 'Balcão em pedra',
    texto: 'Área de espera com balcão em pedra, revestimento texturizado e iluminação rebaixada no forro.' },
  { foto: 'estante-espinha-peixe', etiqueta: 'Obra corporativa', titulo: 'Escritório',
    linha: 'Piso espinha de peixe',
    texto: 'Estante sob medida do piso ao teto e piso em espinha de peixe assentado no padrão contínuo da sala.' },
  { foto: 'mesa-vista-sp', etiqueta: 'Obra corporativa', titulo: 'Sala de reunião',
    linha: 'Vista São Paulo',
    texto: 'Mesa de reunião em madeira, luminária pendente linear e cortina em trilho ao longo de toda a esquadria.' },
  { foto: 'restaurante-fachada', etiqueta: 'Varejo e alimentação', titulo: 'Restaurante',
    linha: 'Salão e fachada',
    texto: 'Salão com fachada em vidro, iluminação cênica e acabamento aplicado dentro da janela de obra do imóvel.' },
  { foto: 'restaurante-salao', etiqueta: 'Varejo e alimentação', titulo: 'Salão',
    linha: 'Ambiente principal',
    texto: 'Layout de mesas, forro acústico e pontos elétricos distribuídos conforme a operação do salão.' },
  { foto: 'lavabo-terracota', etiqueta: 'Reforma', titulo: 'Lavabo',
    linha: 'Terracota e porcelanato',
    texto: 'Revestimento em terracota, cuba esculpida e instalação hidráulica refeita no ponto original.' },
];

/** As perguntas agrupadas por assunto, para a página de dúvidas ter índice. */
export const temas = [
  ['A empresa', ['O que a SPX Engenharia faz?', 'A SPX atende empresas?', 'A SPX atende São Paulo?',
                 'Quem responde tecnicamente pela obra?']],
  ['O que executamos', ['A SPX executa obras corporativas?', 'A SPX trabalha com retrofit?',
                        'A SPX executa reforma de escritório?', 'A SPX faz gerenciamento de obras?']],
  ['Trabalhar com arquitetos', ['A SPX trabalha com arquitetos?',
                                'A SPX executa projeto desenvolvido por outro arquiteto?']],
  ['Orçamento e prazo', ['Como solicitar um orçamento?', 'Como funciona a visita técnica?',
                         'Quanto tempo demora uma obra?', 'A obra pode ser feita com o imóvel ocupado?']],
];

/** CTAs por contexto — o mesmo botão em todo lugar converte menos. */
export const chamadas = {
  obra:      'Fale com a SPX sobre a sua obra.',
  empresa:   'Sua empresa precisa transformar um espaço? Converse com a SPX.',
  arquiteto: 'Você cria o projeto. A SPX cuida da execução.',
  orcamento: 'Solicite uma avaliação da sua obra.',
  projeto:   'Tem um projeto semelhante? Fale com a SPX Engenharia.',
  final:     'Sua próxima obra começa com planejamento.',
};

/** Regiões atendidas, para a página de atuação e o schema. */
export const regioes = {
  'São Paulo capital': ['Avenida Paulista', 'Jardins', 'Faria Lima', 'Itaim Bibi', 'Vila Olímpia',
    'Brooklin', 'Berrini', 'Chácara Santo Antônio', 'Pinheiros', 'Vila Madalena', 'Moema',
    'Santo Amaro', 'Centro', 'Barra Funda', 'Lapa', 'Tatuapé'],
  'Grande São Paulo': ['Alphaville', 'Barueri', 'Osasco', 'Guarulhos', 'São Bernardo do Campo',
    'Santo André', 'São Caetano do Sul', 'Diadema', 'Cotia', 'Taboão da Serra'],
};

/**
 * Ambientes em corte, para a página do arquiteto.
 *
 * Cada tipo é um prédio de três pavimentos aberto de frente, como casa de
 * boneca. `pecas` são os volumes desenhados em isométrico — x e y são o canto
 * da peça no piso, w e d as medidas em planta, h a altura. O piso de cada
 * pavimento tem 10 por 10.
 *
 * `t` diz o que a peça é, e é o que muda o traço no desenho:
 *   parede  divisória interna, sobe o pé-direito inteiro
 *   vidro   divisória envidraçada, tracejada e quase transparente
 *   equipa  equipamento — coifa, câmara fria, chiller, quadro
 *   banc    bancada e balcão, o volume mais cheio
 *   (nada)  móvel solto
 *
 * Os ambientes seguem as obras do acervo: a mesa comprida da sala de reunião,
 * a estante do piso ao teto, o balcão de recepção em marcenaria, o salão de
 * mesas do restaurante. Não é levantamento das fotos — é o mesmo tipo de
 * ambiente, desenhado em planta, para o corte mostrar o que a SPX executa.
 *
 * `topicos` é o que aquele pavimento tem de diferente dos outros. Cada linha
 * sai do que o serviço correspondente declara executar. Se a SPX não faz, não
 * entra aqui.
 */
export const ambientes = [
  {
    id: 'corporativo',
    nome: 'Escritório corporativo',
    servico: 'obras-corporativas',
    resumo: 'Laje corrida, salas de reunião e recepção — com a operação do cliente rodando ao lado.',
    andares: [
      {
        nome: 'Salas de reunião',
        dica: 'Divisória de vidro com perfil de alumínio, forro acústico e ponto de lógica em cada sala. O que costuma travar a entrega é o vidro: prazo de fábrica longo, e por isso entra no cronograma como caminho crítico.',
        topicos: [
          'Divisória de vidro com perfil de alumínio e porta pivotante',
          'Forro acústico onde a sala encosta na laje corrida',
          'Ponto de lógica e energia na mesa, não na parede',
          'O vidro tem prazo de fábrica: entra como caminho crítico',
        ],
        pecas: [
          { x: 5.2, y: .6, w: .22, d: 8.8, h: 2.35, t: 'vidro' },
          { x: .6, y: 4.6, w: 4.6, d: .22, h: 2.35, t: 'vidro' },
          { x: 1.2, y: 1.2, w: 3.2, d: 1.5, h: .74 },
          { x: 1.3, y: .6, w: .55, d: .55, h: 1.05 },
          { x: 2.3, y: .6, w: .55, d: .55, h: 1.05 },
          { x: 3.3, y: .6, w: .55, d: .55, h: 1.05 },
          { x: 1.3, y: 2.9, w: .55, d: .55, h: 1.05 },
          { x: 2.3, y: 2.9, w: .55, d: .55, h: 1.05 },
          { x: 3.3, y: 2.9, w: .55, d: .55, h: 1.05 },
          { x: 1.2, y: 5.4, w: 2.4, d: 1.2, h: .74 },
          { x: 1.4, y: 6.9, w: .55, d: .55, h: 1.05 },
          { x: 2.5, y: 6.9, w: .55, d: .55, h: 1.05 },
          { x: .6, y: 8.7, w: 4.2, d: .45, h: .95, t: 'banc' },
          { x: 6, y: 1, w: 3.2, d: .8, h: .74 },
          { x: 6, y: 3, w: 3.2, d: .8, h: .74 },
          { x: 6, y: 6.4, w: 3.2, d: .55, h: 1.15, t: 'banc' },
        ],
      },
      {
        nome: 'Laje corrida',
        dica: 'Bancadas em fileira, forro modular e piso elevado quando há cabeamento por baixo. Elétrica e lógica sobem juntas: refazer ponto depois do forro fechado custa duas vezes.',
        topicos: [
          'Bancada corrida com calha de energia e dados por baixo',
          'Forro modular, para manutenção sem quebrar nada',
          'Piso elevado quando o cabeamento passa embaixo',
          'Cabine de foco em drywall com porta acústica',
        ],
        pecas: [
          { x: .7, y: .8, w: 3.6, d: .85, h: .74, t: 'banc' },
          { x: .7, y: 2.5, w: 3.6, d: .85, h: .74, t: 'banc' },
          { x: .7, y: 4.2, w: 3.6, d: .85, h: .74, t: 'banc' },
          { x: .7, y: 5.9, w: 3.6, d: .85, h: .74, t: 'banc' },
          { x: .9, y: 1.8, w: .5, d: .5, h: .98 },
          { x: 2.1, y: 1.8, w: .5, d: .5, h: .98 },
          { x: 3.3, y: 1.8, w: .5, d: .5, h: .98 },
          { x: .9, y: 3.5, w: .5, d: .5, h: .98 },
          { x: 2.1, y: 3.5, w: .5, d: .5, h: .98 },
          { x: 3.3, y: 3.5, w: .5, d: .5, h: .98 },
          { x: 5.6, y: .8, w: 1.7, d: 1.7, h: 2.35, t: 'parede' },
          { x: 7.6, y: .8, w: 1.7, d: 1.7, h: 2.35, t: 'parede' },
          { x: 5.6, y: 3.4, w: 3.7, d: .9, h: .74, t: 'banc' },
          { x: 5.6, y: 5.4, w: 3.7, d: .9, h: .74, t: 'banc' },
          { x: 5.6, y: 7.6, w: 3.7, d: .55, h: 1.1, t: 'banc' },
          { x: .7, y: 8, w: 2.6, d: 1.2, h: .42 },
        ],
      },
      {
        nome: 'Recepção',
        dica: 'Balcão em marcenaria sob medida, iluminação embutida e a comunicação visual da marca. É a primeira área que o cliente vê pronta e a última que a SPX libera.',
        topicos: [
          'Balcão em marcenaria sob medida, com nicho de iluminação',
          'Painel de marca com sanca e luz indireta',
          'Piso de padrão diferente do resto do andar',
          'Última área liberada: é a que o cliente vê primeiro',
        ],
        pecas: [
          { x: 1, y: 1.2, w: 3.4, d: 1, h: 1.1, t: 'banc' },
          { x: 1, y: .5, w: 3.4, d: .3, h: 2.6, t: 'banc' },
          { x: 5.4, y: .6, w: .25, d: 5.4, h: 2.35, t: 'vidro' },
          { x: 6.2, y: 1.4, w: 1.2, d: 1.2, h: .78 },
          { x: 7.8, y: 1.4, w: 1.2, d: 1.2, h: .78 },
          { x: 6.2, y: 3.2, w: 1.2, d: 1.2, h: .78 },
          { x: 7.8, y: 3.2, w: 1.2, d: 1.2, h: .78 },
          { x: 6.8, y: 2.8, w: 1.4, d: .8, h: .38 },
          { x: 1, y: 4, w: 2.2, d: .9, h: .42 },
          { x: 1, y: 6.6, w: .3, d: 2.6, h: 1.6, t: 'vidro' },
          { x: 2.2, y: 7.4, w: 2.8, d: .6, h: 1.05, t: 'banc' },
          { x: 6, y: 6.6, w: 3, d: 2.4, h: .55 },
        ],
      },
    ],
  },
  {
    id: 'varejo',
    nome: 'Loja e varejo',
    servico: 'obras-comerciais',
    resumo: 'Vitrine, área de vendas e estoque — quase sempre dentro de shopping, com regra de horário.',
    andares: [
      {
        nome: 'Estoque e apoio',
        dica: 'Prateleira metálica, iluminação simples e ponto de força para o carregamento. Área que ninguém vê e que decide se a loja opera bem depois de aberta.',
        topicos: [
          'Prateleira metálica modulada pela caixa do produto',
          'Bancada de conferência com ponto de força e dados',
          'Iluminação simples, sem forro — o que importa é o lúmen',
          'Circulação livre para o carrinho, não para o cliente',
        ],
        pecas: [
          { x: .7, y: .8, w: .75, d: 7.4, h: 2.3, t: 'banc' },
          { x: 2.6, y: .8, w: .75, d: 7.4, h: 2.3, t: 'banc' },
          { x: 4.5, y: .8, w: .75, d: 7.4, h: 2.3, t: 'banc' },
          { x: 6.4, y: .8, w: .75, d: 7.4, h: 2.3, t: 'banc' },
          { x: 8.2, y: .8, w: 1, d: 2.6, h: .85, t: 'banc' },
          { x: 8.2, y: 4, w: 1, d: 1, h: .5 },
          { x: 8.2, y: 6, w: 1, d: 2.2, h: 1.9, t: 'equipa' },
        ],
      },
      {
        nome: 'Provadores',
        dica: 'Cabines em drywall com bandeira e espelho, e o forro recortado para a iluminação de prova. Cada cabine precisa do seu circuito: luz de prova puxada de emenda derruba o disjuntor no primeiro sábado.',
        topicos: [
          'Cabine em drywall com bandeira e reforço para o espelho',
          'Forro recortado para a luz de prova, com temperatura de cor própria',
          'Circuito por cabine, não um só para todas',
          'Banco e cabideiro embutidos, sem perder largura de cabine',
        ],
        pecas: [
          { x: .8, y: .8, w: 1.5, d: 1.9, h: 2.35, t: 'parede' },
          { x: 2.6, y: .8, w: 1.5, d: 1.9, h: 2.35, t: 'parede' },
          { x: 4.4, y: .8, w: 1.5, d: 1.9, h: 2.35, t: 'parede' },
          { x: 6.2, y: .8, w: 1.5, d: 1.9, h: 2.35, t: 'parede' },
          { x: .8, y: 3.4, w: 7, d: .45, h: .42 },
          { x: .8, y: 5.2, w: .3, d: 3.6, h: 1.6, t: 'vidro' },
          { x: 2.4, y: 5.6, w: 2.6, d: .6, h: 1.2, t: 'banc' },
          { x: 6, y: 4.4, w: 1.4, d: 3.8, h: 1.7, t: 'banc' },
          { x: 8.2, y: 4.4, w: 1, d: 3.8, h: .95, t: 'banc' },
        ],
      },
      {
        nome: 'Vitrine e vendas',
        dica: 'Fachada, comunicação visual e o caixa. Em shopping, a obra acontece na janela de horário do condomínio — e a documentação de acesso entra no cronograma antes do primeiro dia.',
        topicos: [
          'Fachada e vitrine com projeto aprovado pelo shopping',
          'Comunicação visual integrada ao forro e à iluminação de destaque',
          'Caixa com ponto de dados, energia estabilizada e cofre',
          'Obra na janela de horário do condomínio, com acesso documentado',
        ],
        pecas: [
          { x: .7, y: .5, w: 8.5, d: .28, h: 2.35, t: 'vidro' },
          { x: 1.2, y: 1.2, w: 1.5, d: 1.5, h: 1.4, t: 'banc' },
          { x: 3.4, y: 1.2, w: 1.5, d: 1.5, h: 1.4, t: 'banc' },
          { x: 5.6, y: 1.2, w: 1.5, d: 1.5, h: 1.4, t: 'banc' },
          { x: 1.2, y: 3.6, w: 3.2, d: .7, h: 1, t: 'banc' },
          { x: 5.6, y: 3.6, w: 3.4, d: .7, h: 1, t: 'banc' },
          { x: 1.2, y: 5.4, w: 3.2, d: .7, h: 1, t: 'banc' },
          { x: 6.4, y: 5.2, w: 2.6, d: 1, h: 1.05, t: 'banc' },
          { x: 6.4, y: 6.6, w: .6, d: .6, h: .5, t: 'equipa' },
          { x: .8, y: 7.4, w: 4.6, d: .5, h: 1.1, t: 'banc' },
        ],
      },
    ],
  },
  {
    id: 'restaurante',
    nome: 'Restaurante e café',
    servico: 'obras-comerciais',
    resumo: 'Salão, cozinha e a parte que ninguém desenha: exaustão, gordura e água quente.',
    andares: [
      {
        nome: 'Casa de máquinas',
        dica: 'Exaustão, ar-condicionado e caixa d\'água. É o pavimento que define o projeto inteiro do restaurante: se o duto de exaustão não tem por onde subir, a cozinha muda de lugar.',
        topicos: [
          'Prumada de exaustão da coifa até acima da cobertura',
          'Condensadoras com base isolada e afastamento de manutenção',
          'Reservatório com reserva de incêndio separada',
          'É aqui que o projeto do restaurante começa, não na decoração',
        ],
        pecas: [
          { x: 1, y: 1, w: 2.6, d: 2.6, h: 1.9, t: 'equipa' },
          { x: 4.4, y: 1, w: 2, d: 2, h: 1.5, t: 'equipa' },
          { x: 7, y: 1, w: 2, d: 2, h: 1.5, t: 'equipa' },
          { x: 1, y: 4.6, w: 1.1, d: 1.1, h: 2.4, t: 'equipa' },
          { x: 3, y: 4.6, w: 1.1, d: 1.1, h: 2.4, t: 'equipa' },
          { x: 5.6, y: 5, w: 3.4, d: 3, h: 1.2, t: 'equipa' },
          { x: 1, y: 7, w: 3.6, d: .35, h: 1.1, t: 'banc' },
          { x: .8, y: .8, w: .35, d: 8.4, h: .9, t: 'banc' },
        ],
      },
      {
        nome: 'Salão',
        dica: 'Mesas, forro e a iluminação que define a cara da casa. O ponto crítico é o conforto acústico: salão bonito e barulhento esvazia, e tratamento acústico se resolve no forro, antes de fechar.',
        topicos: [
          'Tratamento acústico dentro do forro, antes de fechar',
          'Bar com bancada, pia, gelo e ponto de dreno',
          'Iluminação em circuitos separados para o dia e a noite',
          'Piso com resistência a gordura e limpeza pesada',
        ],
        pecas: [
          { x: .8, y: .8, w: 1.3, d: 1.3, h: .74 },
          { x: 3, y: .8, w: 1.3, d: 1.3, h: .74 },
          { x: 5.2, y: .8, w: 1.3, d: 1.3, h: .74 },
          { x: .8, y: 3, w: 1.3, d: 1.3, h: .74 },
          { x: 3, y: 3, w: 1.3, d: 1.3, h: .74 },
          { x: 5.2, y: 3, w: 1.3, d: 1.3, h: .74 },
          { x: .8, y: 5.2, w: 1.3, d: 1.3, h: .74 },
          { x: 3, y: 5.2, w: 1.3, d: 1.3, h: .74 },
          { x: 5.2, y: 5.2, w: 1.3, d: 1.3, h: .74 },
          { x: 2.5, y: .5, w: .4, d: .4, h: 1 },
          { x: 4.7, y: .5, w: .4, d: .4, h: 1 },
          { x: 2.5, y: 2.7, w: .4, d: .4, h: 1 },
          { x: 4.7, y: 2.7, w: .4, d: .4, h: 1 },
          { x: 7.4, y: .8, w: 1.8, d: 5.4, h: 1.1, t: 'banc' },
          { x: 7.4, y: 6.6, w: 1.8, d: .5, h: 1.15, t: 'banc' },
          { x: .8, y: 7.4, w: 5.4, d: .6, h: 1.05, t: 'banc' },
        ],
      },
      {
        nome: 'Cozinha',
        dica: 'Cozinha industrial, câmara fria e ponto de gás. Piso, ralo e caimento são o que a vigilância olha primeiro — e refazer piso com a cozinha montada é obra duas vezes.',
        topicos: [
          'Piso monolítico com caimento e ralo linear conferidos na obra',
          'Coifa com make-up de ar e filtro de gordura',
          'Câmara fria com piso rebaixado e porta de fluxo',
          'Ponto de gás com teste de estanqueidade documentado',
        ],
        pecas: [
          { x: .7, y: .8, w: 3.6, d: .95, h: .9, t: 'banc' },
          { x: .7, y: 2.6, w: 3.6, d: .95, h: .9, t: 'banc' },
          { x: .7, y: 4.4, w: 3.6, d: .95, h: .9, t: 'banc' },
          { x: 1.1, y: .5, w: 2.8, d: .5, h: 2.4, t: 'equipa' },
          { x: 5.6, y: .8, w: 2.6, d: 2.6, h: 2.6, t: 'equipa' },
          { x: 5.6, y: 4, w: 2.6, d: 1, h: .9, t: 'banc' },
          { x: 5.6, y: 5.6, w: 2.6, d: 1, h: .9, t: 'banc' },
          { x: 8.4, y: .8, w: .8, d: 5.8, h: 2, t: 'banc' },
          { x: .7, y: 6.6, w: 5, d: 1.1, h: 1.05, t: 'banc' },
        ],
      },
    ],
  },
  {
    id: 'clinica',
    nome: 'Clínica e laboratório',
    servico: 'reformas',
    resumo: 'Consultórios, espera e as exigências de norma que decidem o layout antes da estética.',
    andares: [
      {
        nome: 'Administrativo',
        dica: 'Área de apoio, arquivo e sala técnica. Aqui entra o quadro elétrico dedicado: equipamento de diagnóstico costuma exigir circuito e aterramento próprios.',
        topicos: [
          'Quadro dedicado com circuito e aterramento para diagnóstico',
          'Sala técnica com rack, climatização própria e acesso restrito',
          'Arquivo com prateleira dimensionada para carga de papel',
          'Copa e vestiário separados do fluxo de paciente',
        ],
        pecas: [
          { x: .8, y: .8, w: 2.8, d: .9, h: .74, t: 'banc' },
          { x: .8, y: 2.6, w: 2.8, d: .9, h: .74, t: 'banc' },
          { x: 1.2, y: 1.8, w: .5, d: .5, h: .98 },
          { x: 2.6, y: 1.8, w: .5, d: .5, h: .98 },
          { x: 4.6, y: .8, w: .25, d: 5.4, h: 2.35, t: 'parede' },
          { x: 5.4, y: .8, w: .7, d: 5.2, h: 2.2, t: 'banc' },
          { x: 7, y: .8, w: 1.2, d: 1.8, h: 2, t: 'equipa' },
          { x: 8.6, y: .8, w: .6, d: 1.4, h: 1.9, t: 'equipa' },
          { x: 7, y: 3.4, w: 2.2, d: 2.4, h: 2.35, t: 'parede' },
          { x: .8, y: 7, w: 3.2, d: 1, h: .9, t: 'banc' },
          { x: 5, y: 7, w: 4.2, d: 1, h: .9, t: 'banc' },
        ],
      },
      {
        nome: 'Consultórios',
        dica: 'Divisórias com desempenho acústico, lavatório em cada sala e porta com vão livre de norma. A largura de porta e de corredor vem da acessibilidade, não do desenho: é o primeiro item que a compatibilização confere.',
        topicos: [
          'Divisória com lã e placa dupla, para o áudio não vazar de sala em sala',
          'Lavatório em cada consultório, com água quente',
          'Porta e corredor com vão livre de norma, não do desenho',
          'Piso e rodapé em canto arredondado, para higienização',
        ],
        pecas: [
          { x: .7, y: .8, w: 2.5, d: 3.2, h: 2.35, t: 'parede' },
          { x: 3.5, y: .8, w: 2.5, d: 3.2, h: 2.35, t: 'parede' },
          { x: 6.3, y: .8, w: 2.9, d: 3.2, h: 2.35, t: 'parede' },
          { x: 1, y: 4.6, w: 1.9, d: .85, h: .62 },
          { x: 3.8, y: 4.6, w: 1.9, d: .85, h: .62 },
          { x: 6.6, y: 4.6, w: 1.9, d: .85, h: .62 },
          { x: 1, y: 5.8, w: .8, d: .5, h: .85, t: 'banc' },
          { x: 3.8, y: 5.8, w: .8, d: .5, h: .85, t: 'banc' },
          { x: 6.6, y: 5.8, w: .8, d: .5, h: .85, t: 'banc' },
          { x: .7, y: 7, w: 8.5, d: .25, h: 1.15, t: 'banc' },
        ],
      },
      {
        nome: 'Recepção e espera',
        dica: 'Balcão, espera e circulação. Piso lavável, quina arredondada e iluminação sem ofuscamento — detalhes que a norma pede e que só aparecem no orçamento de quem já executou clínica.',
        topicos: [
          'Balcão com trecho rebaixado para atendimento sentado',
          'Espera com circulação livre para cadeira de rodas',
          'Sanitário acessível com barra e sinalização de emergência',
          'Iluminação difusa, sem ofuscamento sobre quem espera deitado',
        ],
        pecas: [
          { x: .8, y: 1, w: 3.2, d: 1, h: 1.1, t: 'banc' },
          { x: .8, y: .4, w: 3.2, d: .3, h: 2.5, t: 'banc' },
          { x: 5, y: .8, w: 4.2, d: .8, h: .45 },
          { x: 5, y: 2.4, w: 4.2, d: .8, h: .45 },
          { x: 5, y: 4, w: 4.2, d: .8, h: .45 },
          { x: 5, y: .4, w: 4.2, d: .25, h: 1.1, t: 'banc' },
          { x: .8, y: 3.4, w: 2.4, d: 2.4, h: 2.35, t: 'parede' },
          { x: .8, y: 6.6, w: .3, d: 2.6, h: 1.6, t: 'vidro' },
          { x: 2, y: 7.6, w: 3, d: .6, h: 1.05, t: 'banc' },
          { x: 6, y: 6.6, w: 3.2, d: 2.4, h: .5 },
        ],
      },
    ],
  },
];
