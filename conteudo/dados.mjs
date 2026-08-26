/**
 * FONTE ÚNICA DE VERDADE DO SITE.
 *
 * Todo fato sobre a SPX vive aqui: nome, CREA, serviços, projetos, números.
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
 * Números e credenciais só entram no ar depois de conferidos. Errar CREA ou
 * CNPJ numa página pública é problema sério; deixar de fora não é.
 * ---------------------------------------------------------------------------
 */

/** marcador de dado ainda não confirmado — o gerador omite tudo que for isto */
export const FALTA = Symbol('falta confirmar');
export const falta = (v) => v === FALTA || v === undefined || v === null || v === '';

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
  crea: FALTA,                   // número completo, com a UF: "CREA-SP 1234567890"
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
  { chave: 'obras', icone: 'obras',  valor: 40, prefixo: '+',
    rotulo: 'obras entregues',
    validado: false,   // o material chama de "referência aproximada"
    nota: 'Confirmar se são obras da SPX ou da trajetória do responsável.' },
  { chave: 'area', icone: 'area',   valor: 42, sufixo: ' mil m²',
    rotulo: 'construídos',
    validado: false,
    nota: 'Confirmar o que a métrica mede: área executada pela SPX, ou somada à trajetória do responsável?' },
];

/** Etapas do processo. É o que diferencia engenharia de mão de obra. */
export const processo = [
  { icone: 'visita', n: '01', nome: 'Levantamento',
    texto: 'Visita ao local, medição, registro das condições existentes e das restrições do ' +
           'condomínio ou do shopping. Nada é orçado sem ver a obra de perto.' },
  { icone: 'orcamento', n: '02', nome: 'Orçamento',
    texto: 'Proposta técnica com todos os serviços discriminados, quantidades e critérios de ' +
           'medição. Sem verba aberta e sem "a definir".' },
  { icone: 'planejamento', n: '03', nome: 'Planejamento',
    texto: 'Cronograma físico-financeiro com as frentes amarradas entre si, caminho crítico ' +
           'identificado e desembolso previsto por etapa.' },
  { icone: 'compat', n: '04', nome: 'Coordenação',
    texto: 'Compatibilização entre arquitetura, estrutura, elétrica, hidráulica, climatização ' +
           'e incêndio antes de a equipe subir, para o conflito aparecer no papel e não na parede.' },
  { icone: 'execucao', n: '05', nome: 'Execução',
    texto: 'Equipe própria e fornecedores coordenados pela mesma engenharia que orçou e ' +
           'planejou, com responsável técnico nomeado.' },
  { icone: 'acompanha', n: '06', nome: 'Controle',
    texto: 'Medição semanal do avanço contra o cronograma, registro fotográfico e relatório ' +
           'de desvio enquanto ainda dá para corrigir.' },
  { icone: 'entrega', n: '07', nome: 'Entrega',
    texto: 'Vistoria conjunta, lista de pendências fechada, as built e manuais das instalações.' },
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
