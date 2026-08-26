/**
 * Gera as páginas internas do site a partir de conteudo/dados.mjs.
 *
 *   node gerar.mjs
 *
 * O que sai daqui: /sobre, /servicos e as oito páginas de serviço, /obras e as
 * páginas de projeto, /para-arquitetos, /duvidas, /atuacao, /privacidade,
 * além de sitemap.xml e llms.txt.
 *
 * A home (index.html) continua sendo escrita à mão — ela tem componentes que
 * não valem a pena generalizar. O menu e o rodapé, porém, saem daqui e são
 * costurados nela também, para nunca divergirem.
 *
 * REGRA QUE NÃO SE QUEBRA: campo marcado como FALTA não vira texto. Some da
 * página e entra no relatório do fim. Inventar dado de obra ou CNPJ é o
 * tipo de erro que custa contrato.
 */
import { mkdirSync, writeFileSync, readFileSync, existsSync } from 'node:fs';
import { dirname } from 'node:path';
import { empresa, responsavel, numeros, processo, camadas, servicos, projetos,
         duvidas, temas, acervo, chamadas, regioes, historia, falta } from './conteudo/dados.mjs';

const SITE = empresa.dominio.replace(/\/+$/, '');
/* proporções das fotos usadas como fundo, para declarar width e height e o
   layout não pular enquanto a imagem carrega */
const DIMENSOES = {
  'sala-reuniao-azul':[1127,1600], 'recepcao-marmore':[1600,1066], 'lounge-recepcao':[1067,1600],
  'mesa-vista-sp':[960,1280], 'estante-espinha-peixe':[1200,1600], 'restaurante-fachada':[720,1280],
  'banheiro-marmore':[1200,1600], 'lavabo-azul':[1067,1600], 'cozinha-marcenaria':[900,1600],
  'restaurante-salao':[720,1280], 'lavabo-terracota':[1200,1600],
};
/* as versões vêm do resumo do conteúdo dos arquivos, escrito por build.mjs */
let VERSAO_CSS, VERSAO_JS;
try {
  ({ css: VERSAO_CSS, js: VERSAO_JS } = JSON.parse(readFileSync('assets/versao.json', 'utf8')));
} catch {
  console.error('assets/versao.json não existe. Rode `node build.mjs` antes, ou `npm run site`.');
  process.exit(1);
}
/* uma foto e uma peça diferentes por serviço, para as oito páginas não
   parecerem a mesma coisa repetida */
const FUNDOS_SERVICO = ['sala-reuniao-azul', 'restaurante-salao', 'estante-espinha-peixe', 'cozinha-marcenaria', 'mesa-vista-sp', 'lavabo-terracota', 'recepcao-marmore', 'lounge-recepcao'];

const pendencias = new Set();   /* o mesmo bloco repete em toda página; conta uma vez */
const paginas = [];

const anota = (onde, oque) => pendencias.add(`${onde}: ${oque}`);
const dim = (arq) => DIMENSOES[arq] || [1200, 1600];
/* só as larguras que existem em disco: a geração pula largura >= a original */
const larguras = (arq) => [480, 640, 768, 960].filter((w) => w < dim(arq)[0])
  .map((w) => `/img/${arq}-${w}.webp ${w}w`).join(', ');
/* O cabeçalho interno mostra a foto inteira num painel à direita. Existiu
   antes um recorte horizontal (capa-*) para uma faixa larga e baixa; saiu
   junto com a faixa, porque cortava a obra a ponto de sobrar um fragmento.
   As medidas abaixo batem com a largura do painel em cada faixa do CSS, e não
   por acaso: 290 no celular e 380 no tablet são os maiores valores que ainda
   fazem o navegador escolher a variante de 768 em vez da de 960 nas telas
   densas daquele tamanho. A de 960 pesa o dobro sem mostrar mais nitidez. */
const TAM_TOPO = '(min-width:1000px) min(44vw, 500px), (min-width:700px) 380px, 290px';
/* a foto da página abre o rodízio, seguida de outras três da mesma família */
const fotos = (arq) => {
  const todas = Object.keys(DIMENSOES);
  const i = todas.indexOf(arq);
  return [arq, ...[1, 2, 3].map((n) => todas[(i + n * 3) % todas.length])]
    .filter((v, k, a) => a.indexOf(v) === k);
};
const esc = (t) => String(t).replace(/[&<>"]/g, (c) => ({ '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;' }[c]));
const lista = (itens) => itens.map((i) => `<li>${esc(i)}</li>`).join('');

/* ------------------------------------------------------------------ menu */
const MENU = [
  { url: '/servicos', nome: 'Serviços' },
  { url: '/obras', nome: 'Projetos' },
  { url: '/sobre', nome: 'Sobre' },
  { url: '/para-arquitetos', nome: 'Arquitetos' },
  { url: '/duvidas', nome: 'Dúvidas' },
];

function menu(atual) {
  const item = ({ url, nome }) =>
    `<a href="${url}" class="link${atual === url ? ' ativo' : ''}">${nome}</a>`;
  return `<nav class="nav" aria-label="Principal"><div class="wrap nav-in">
  <div class="navpill">
    <a href="/" class="navlogo" aria-label="${esc(empresa.nome)} · início">
      <img class="marca" src="/img/logo-spx.webp" width="300" height="72" alt="" aria-hidden="true"></a>
    ${MENU.map(item).join('\n    ')}
    <a href="/contato" class="cta">Contato</a>
    <button class="nav-btn nav-menu" type="button" data-acao="menu" aria-expanded="false" aria-controls="gaveta" aria-label="Abrir menu">
      <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 7h16M4 12h16M4 17h16"/></svg>
    </button>
  </div>
</div></nav>

<div class="gaveta" id="gaveta" aria-hidden="true" aria-label="Menu de navegação">
  <button class="gaveta-fechar" type="button" data-acao="fechar-menu" aria-label="Fechar menu">×</button>
  <p class="eyebrow">${esc(empresa.nome)}</p>
  <nav aria-label="Navegação mobile">
    ${MENU.map((m, i) => `<a href="${m.url}">${m.nome} <i>0${i + 1}</i></a>`).join('\n    ')}
    <a href="/atuacao">Onde atuamos <i>0${MENU.length + 1}</i></a>
  </nav>
  <div class="rodape-gaveta">
    <a class="btn" href="/contato">Agendar visita técnica</a>
    <a class="btn btn-ghost" href="tel:${empresa.telefone.replace(/\D/g, '')}">${esc(empresa.telefone.replace('+55 ', ''))}</a>
  </div>
</div>`;
}

/* --------------------------------------------------------- botão flutuante */
/* Sai junto do rodapé porque é o rodapé que é costurado em toda página — assim
   o botão aparece em todas sem markup duplicado em vinte arquivos. */
function botaoZap() {
  return `<a class="zap" href="https://wa.me/${empresa.whatsapp}" rel="noopener"
   aria-label="Falar com a ${esc(empresa.nome)} no WhatsApp" data-zap>
  <!-- a marca do WhatsApp desenhada de verdade, cheia. A aproximação feita a
       traço não lia como o aplicativo: virava um círculo com um risco dentro. -->
  <svg viewBox="0 0 24 24" class="zap-marca" aria-hidden="true"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.174.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347M12.05 21.785h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"/></svg>
  <span>${esc(empresa.telefone.replace('+55 ', ''))} · WhatsApp</span>
</a>`;
}

/* ---------------------------------------------------------------- rodapé */
function rodape() {
  const social = [];
  if (!falta(empresa.instagram)) social.push(`<a href="${empresa.instagram}" rel="noopener" aria-label="Instagram da SPX Engenharia"><svg width="17" height="17" viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none"/></svg></a>`);
  else anota('Rodapé', 'endereço do Instagram');
  if (!falta(empresa.linkedin)) social.push(`<a href="${empresa.linkedin}" rel="noopener" aria-label="LinkedIn da SPX Engenharia"><svg width="17" height="17" viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="4"/><path d="M8 11v6M8 7.6v.1M12 17v-3.2a2 2 0 0 1 4 0V17"/></svg></a>`);
  else anota('Rodapé', 'endereço do LinkedIn');
  social.push(`<a href="https://wa.me/${empresa.whatsapp}" rel="noopener" aria-label="WhatsApp da SPX Engenharia"><svg width="17" height="17" viewBox="0 0 24 24" aria-hidden="true"><path d="M20.5 12a8.5 8.5 0 1 1-4.2-7.3L21 3.5l-1.2 4.6A8.4 8.4 0 0 1 20.5 12Z"/><path d="M9 9.4c.5 2.2 2.4 4.1 4.6 4.6l1.1-1.2 1.8.8-.5 1.6c-3.4.5-7.2-3.3-6.7-6.7l1.6-.5.8 1.8z"/></svg></a>`);

  /* a linha final só afirma o que está confirmado */
  const selo = [`© <span data-ano>2026</span> ${esc(empresa.nome)}`];
  if (!falta(empresa.cnpj)) selo.push('CNPJ ' + esc(empresa.cnpj));
  else anota('Rodapé', 'CNPJ');
  selo.push(esc(empresa.base));

  return `<footer class="wrap rodape">
  <div class="rod-grid" data-reveal>
    <div>
      <p style="max-width:34ch;font-size:15px">${esc(empresa.definicao)}</p>
      <div class="soc">${social.join('')}</div>
    </div>
    <div><h3>Serviços</h3><ul>${servicos.slice(0, 5).map((s) =>
      `<li><a href="/servicos/${s.slug}">${esc(s.nome)}</a></li>`).join('')}
      <li><a href="/servicos">Todos os serviços</a></li></ul></div>
    <div><h3>Projetos</h3><ul>${projetos.map((p) =>
      `<li><a href="/obras/${p.slug}">${esc(p.nome)}</a></li>`).join('')}
      <li><a href="/atuacao">Onde atuamos</a></li></ul></div>
    <div><h3>Empresa</h3><ul>
      <li><a href="/sobre">Sobre a SPX</a></li>
      <li><a href="/para-arquitetos">Para arquitetos</a></li>
      <li><a href="/duvidas">Dúvidas frequentes</a></li>
      <li><a href="/servicos-e-regioes">Serviços por região</a></li>
      <li><a href="/contato">Contato</a></li></ul></div>

    <div class="wordmark" id="wordmark" aria-hidden="true">
      <img class="wm base" src="/img/logo-negativa.webp" width="723" height="304" alt="" loading="lazy" decoding="async">
      <img class="wm luz" src="/img/logo-negativa.webp" width="723" height="304" alt="" loading="lazy" decoding="async">
    </div>
  </div>

  <div class="rod-fim">
    <span>${selo.join(' · ')}</span>
    <span style="display:flex;gap:20px;flex-wrap:wrap"><a href="/privacidade">Privacidade</a><a href="/duvidas">Dúvidas</a><a href="/contato">Contato</a></span>
  </div>
</footer>
${botaoZap()}`;
}

/* ------------------------------------------------------- dados estruturados */
const idEmpresa = SITE + '/#organizacao';
const idPessoa = SITE + '/#responsavel';

function schemaOrganizacao() {
  const o = {
    '@type': 'GeneralContractor',
    '@id': idEmpresa,
    name: empresa.nome,
    description: empresa.definicao,
    url: SITE + '/',
    logo: SITE + '/img/logo.webp',
    image: SITE + '/img/og.jpg',
    telephone: empresa.telefone,
    email: empresa.email,
    areaServed: Object.values(regioes).flat().map((n) => ({ '@type': 'Place', name: n })),
    knowsAbout: servicos.map((s) => s.nome),
    openingHours: 'Mo-Fr 08:00-18:00',
  };
  if (!falta(empresa.razaoSocial)) o.legalName = empresa.razaoSocial;
  else anota('Schema Organization', 'razão social (legalName)');
  if (!falta(empresa.cnpj)) o.taxID = empresa.cnpj;
  const perfis = [empresa.instagram, empresa.linkedin].filter((u) => !falta(u));
  if (perfis.length) o.sameAs = perfis;
  const endereco = { '@type': 'PostalAddress', addressLocality: 'São Paulo',
                     addressRegion: 'SP', addressCountry: 'BR' };
  if (!falta(empresa.endereco)) endereco.streetAddress = empresa.endereco;
  else anota('Schema Organization', 'endereço (streetAddress) — ou confirmar que a SPX não atende no local');
  o.address = endereco;
  if (!falta(responsavel.nome)) o.employee = { '@id': idPessoa };
  return o;
}

function schemaPessoa() {
  if (falta(responsavel.nome)) {
    anota('Schema Person', 'nome completo do engenheiro responsável — sem ele não há como publicar a autoridade técnica');
    return null;
  }
  const p = {
    '@type': 'Person', '@id': idPessoa, name: responsavel.nome,
    jobTitle: responsavel.titulo, worksFor: { '@id': idEmpresa },
  };
  if (!falta(responsavel.foto)) p.image = SITE + '/img/' + responsavel.foto;
  if (!falta(responsavel.formacao)) p.alumniOf = responsavel.formacao;
  if (!falta(responsavel.especialidades)) p.knowsAbout = responsavel.especialidades;
  return p;
}

const schemaServico = (s) => ({
  '@type': 'Service', '@id': `${SITE}/servicos/${s.slug}#servico`,
  name: s.nome, description: s.descricao, serviceType: s.nome,
  provider: { '@id': idEmpresa },
  areaServed: { '@type': 'AdministrativeArea', name: 'São Paulo e região metropolitana' },
  hasOfferCatalog: { '@type': 'OfferCatalog', name: s.nome,
    itemListElement: s.executa.map((n) => ({ '@type': 'Offer',
      itemOffered: { '@type': 'Service', name: n } })) },
});

const schemaPerguntas = (pares) => ({
  '@type': 'FAQPage',
  mainEntity: pares.map(([p, r]) => ({ '@type': 'Question', name: p,
    acceptedAnswer: { '@type': 'Answer', text: r } })),
});

/* HowTo: o Google e as IAs entendem "como a SPX conduz uma obra" como um
   procedimento de sete passos, e não como um texto solto sobre processo. */
const schemaProcesso = () => ({
  '@type': 'HowTo',
  name: 'Como a SPX Engenharia conduz uma obra, do levantamento à entrega',
  description: 'Procedimento em sete etapas aplicado a toda obra corporativa ou ' +
    'comercial executada pela SPX Engenharia em São Paulo.',
  totalTime: 'P1D',
  step: processo.map((e, i) => ({
    '@type': 'HowToStep', position: i + 1, name: e.nome, text: e.texto,
    url: `${SITE}/servicos#${e.nome.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '')}`,
  })),
});

/* speakable marca o trecho que um assistente de voz deve ler em voz alta
   quando alguém pergunta o que a empresa faz */
const FALADO = {
  '@type': 'SpeakableSpecification',
  cssSelector: ['h1', '.resposta-direta p'],
};

const schemaTrilha = (trilha) => ({
  '@type': 'BreadcrumbList',
  itemListElement: trilha.map((t, i) => ({ '@type': 'ListItem', position: i + 1,
    name: t.nome, item: SITE + t.url })),
});

/* --------------------------------------------------------------- moldura */
function pagina({ url, arquivo, title, descricao, h1, trilha = [], corpo, schema = [],
                 visual = '', fundo = null, h1b = '', lead = '', ladoTopo = '' }) {
  const grafo = [schemaOrganizacao(), ...schema].filter(Boolean);
  if (trilha.length > 1) grafo.push(schemaTrilha(trilha));
  const migalhasHTML = trilha.length > 1
    ? `<nav class="migalhas" aria-label="Você está em">${trilha.map((t, i) =>
        i === trilha.length - 1
          ? `<span aria-current="page">${esc(t.nome)}</span>`
          : `<a href="${t.url}">${esc(t.nome)}</a>`).join('<i aria-hidden="true">/</i>')}</nav>`
    : '';

  const html = `<!DOCTYPE html>
<html lang="pt-BR" data-tema="escuro">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(title)}</title>
<link rel="canonical" href="${SITE}${url}">
<meta property="og:url" content="${SITE}${url}">
<meta name="description" content="${esc(descricao)}">
<meta name="theme-color" content="#000000">
<!-- Google Analytics: cole aqui o G-XXXXXXXXXX da sua propriedade.
     Vazio = nenhum script de terceiro e nenhum cookie são carregados. -->
<meta name="ga-id" content="">
<meta property="og:type" content="website">
<meta property="og:title" content="${esc(title)}">
<meta property="og:description" content="${esc(descricao)}">
<meta property="og:image" content="${SITE}/img/og.jpg">
<meta property="og:site_name" content="${esc(empresa.nome)}">
<meta property="og:locale" content="pt_BR">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="${esc(title)}">
<meta name="twitter:image" content="${SITE}/img/og.jpg">
<meta name="geo.region" content="BR-SP">
<meta name="geo.placename" content="São Paulo">
<link rel="icon" type="image/png" href="/img/favicon.png">
${fundo ? `<link rel="preload" as="image" href="/img/${fundo}-640.webp"
      imagesrcset="${larguras(fundo)}" imagesizes="${TAM_TOPO}" fetchpriority="high">\n` : ''}<link rel="stylesheet" href="/assets/css/spx.min.css?v=${VERSAO_CSS}">
<script>
/* aplica o tema antes da pintura para não piscar */
document.documentElement.setAttribute('data-tema','escuro');
</script>
<script type="application/ld+json">
${JSON.stringify({ '@context': 'https://schema.org', '@graph': grafo }, null, 1)}
</script>
</head>
<body class="${visual}">
<a class="pular" href="#conteudo">Pular para o conteúdo</a>
<div class="hatch" aria-hidden="true"></div>
${menu(trilha[1] ? trilha[1].url : url)}
<main id="conteudo">
<header class="topo-interno${fundo ? ' com-foto' : ''}">
${ladoTopo ? '  <div class="wrap topo-duplo">' : ''}
  <div class="${ladoTopo ? '' : 'wrap '}topo-in">
${migalhasHTML}
    <h1>${esc(h1)}${h1b ? `<em>${esc(h1b)}</em>` : ''}</h1>
${lead ? `    <p class="lead topo-lead">${esc(lead)}</p>` : ''}
  </div>
${ladoTopo ? `  <div class="topo-lado">${ladoTopo}</div>
  </div>` : ''}
${fundo ? `  <div class="topo-foto" aria-hidden="true">
    <div class="hero-fundo" id="heroFundo" data-fotos="${fotos(fundo).join(',')}">
      <img class="ativa" src="/img/${fundo}-640.webp"
           srcset="${larguras(fundo)}" sizes="${TAM_TOPO}"
           width="${dim(fundo)[0]}" height="${dim(fundo)[1]}" alt=""
           fetchpriority="high" decoding="async">
    </div>
    <div class="hero-veu"></div>
  </div>` : ''}
</header>
${corpo}
</main>
${rodape()}
<script src="/assets/js/spx.min.js?v=${VERSAO_JS}" defer></script>
</body>
</html>
`;
  mkdirSync(dirname(arquivo), { recursive: true });
  writeFileSync(arquivo, html);
  paginas.push({ url, arquivo });
  return html;
}

/* ---------------------------------------------------------------- ícones */
/* Traço de 1,6, sem preenchimento, 24x24: o mesmo desenho técnico do resto do
   site. Ficam aqui porque são conteúdo de página, não decoração de CSS. */
const ICONES = {
  visita:   '<path d="M12 21s7-6.3 7-11a7 7 0 1 0-14 0c0 4.7 7 11 7 11Z"/><circle cx="12" cy="10" r="2.6"/>',
  proposta: '<path d="M6 3h8l4 4v14H6z"/><path d="M14 3v4h4M9 12h6M9 16h6"/>',
  cronograma:'<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 10h18M8 3v4M16 3v4M7 14h5M7 17h8"/>',
  art:      '<path d="M12 3 4 6v6c0 4.4 3.4 8.5 8 9.5 4.6-1 8-5.1 8-9.5V6l-8-3Z"/><path d="m9 12 2 2 4-4"/>',
  relatorio:'<rect x="4" y="3" width="16" height="18" rx="2"/><path d="M8 8h8M8 12h8M8 16h4"/>',
  asbuilt:  '<path d="M3 20h18M5 20V9l7-5 7 5v11"/><path d="M10 20v-6h4v6"/>',
  corporativa:'<path d="M3 21h18M5 21V6h9v15M14 21V10h5v11"/><path d="M8 9h3M8 13h3M8 17h3"/>',
  varejo:   '<path d="M3 9h18l-1.4-4.2a1 1 0 0 0-1-.8H5.4a1 1 0 0 0-1 .8L3 9Z"/><path d="M5 9v11h14V9M10 20v-6h4v6"/>',
  retrofit: '<path d="M4 21h16M6 21V8l6-4 6 4v13"/><path d="M9 21v-5h6v5M9 11h2M13 11h2"/>',
  reforma:  '<path d="m14.5 6.5 3 3M3 21l3.5-1 11-11-2.5-2.5-11 11L3 21Z"/><path d="M17 3.5 20.5 7"/>',
  gerencia: '<circle cx="12" cy="12" r="8.5"/><path d="M12 7v5l3.5 2"/>',
  manutencao:'<path d="M14.7 6.3a4 4 0 0 1 5 5l-9 9-5-5 9-9Z"/><path d="m5 19 2-2"/>',
  projeto:  '<path d="M4 4h16v16H4z"/><path d="M4 9h16M9 9v11M13 13h7M13 17h7"/>',
  laudo:    '<circle cx="11" cy="11" r="6.5"/><path d="m16 16 4.5 4.5M9 11h4M11 9v4"/>',
  leitura:  '<path d="M4 5h6a2 2 0 0 1 2 2v13a2 2 0 0 0-2-2H4zM20 5h-6a2 2 0 0 0-2 2v13a2 2 0 0 1 2-2h6z"/>',
  compat:   '<circle cx="9" cy="12" r="5.5"/><circle cx="15" cy="12" r="5.5"/>',
  orcamento:'<path d="M12 3v18M8 7h6a2.5 2.5 0 0 1 0 5h-4a2.5 2.5 0 0 0 0 5h6"/>',
  planejamento:'<path d="M4 19V5M4 19h16"/><path d="M8 15h3v4H8zM13 9h3v10h-3z"/>',
  execucao: '<path d="M3 21h18M6 21v-8h4v8M14 21V7h4v14"/><path d="m6 13 4-4 4 4"/>',
  acompanha:'<path d="M2 12s3.6-6.5 10-6.5S22 12 22 12s-3.6 6.5-10 6.5S2 12 2 12Z"/><circle cx="12" cy="12" r="2.8"/>',
  entrega:  '<path d="M4 12.5 9 17.5 20 6.5"/>',
  anos:     '<circle cx="12" cy="12" r="8.5"/><path d="M12 7.5v5l3 1.8"/>',
  obras:    '<path d="M3 21h18M6 21V10l6-4 6 4v11"/><path d="m4 10 8-6 8 6"/>',
  area:     '<path d="M4 4h16v16H4z"/><path d="M4 9h5v5H4zM15 9h5M15 13h5M15 17h5"/>',
  foco:     '<circle cx="12" cy="12" r="8.5"/><circle cx="12" cy="12" r="4"/><circle cx="12" cy="12" r="1"/>',
  telefone: '<path d="M5 4h4l2 5-2.5 1.5a12 12 0 0 0 5 5L15 13l5 2v4a1 1 0 0 1-1.1 1A16 16 0 0 1 4 5.1 1 1 0 0 1 5 4Z"/>',
  email:    '<rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3.5 6.5 8.5 6 8.5-6"/>',
  local:    '<path d="M12 21s7-6.3 7-11a7 7 0 1 0-14 0c0 4.7 7 11 7 11Z"/><circle cx="12" cy="10" r="2.4"/>',
  relogio:  '<circle cx="12" cy="12" r="8.5"/><path d="M12 7v5h4.5"/>',
  empresa:  '<path d="M3 21h18M5 21V4h10v17M15 21V10h4v11"/><path d="M8 8h4M8 12h4M8 16h4"/>',
  sigilo:   '<rect x="5" y="10" width="14" height="10" rx="2"/><path d="M8 10V7a4 4 0 0 1 8 0v3"/>',
  conversa: '<path d="M20 14a3 3 0 0 1-3 3H8l-4 3V6a3 3 0 0 1 3-3h10a3 3 0 0 1 3 3z"/>',
};
const icone = (nome) =>
  `<svg class="ico-tec" viewBox="0 0 24 24" aria-hidden="true">${ICONES[nome] || ICONES.foco}</svg>`;

/* blocos reaproveitados nas páginas */
/* Resposta direta: pergunta como título, resposta na primeira frase. É o
   formato que vira trecho em destaque no Google e é o que uma IA copia
   quando alguém pergunta. Sem rodeio antes da resposta. */
const respostaDireta = (pergunta, resposta, fatos = []) => `
<section class="sec wrap resposta-direta" data-reveal>
  <h2>${esc(pergunta)}</h2>
  <p>${esc(resposta)}</p>
  ${fatos.length ? `<ul class="fatos">${fatos.map((f) => `<li>${esc(f)}</li>`).join('')}</ul>` : ''}
</section>`;

/* Linha do tempo numerada com fio ligando as etapas. É o padrão que mais se
   repete nas referências, e resolve bem o processo de sete passos. */
const linhaTempo = (etapas) => `<ol class="linha-tempo">${etapas.map((e) => `
  <li>
    <span class="lt-marca">${icone(e.icone)}<b>${e.n}</b></span>
    <div class="lt-txt"><h3>${esc(e.nome)}</h3><p>${esc(e.texto)}</p></div>
  </li>`).join('')}</ol>`;

/* Verso do cartão de serviço: infográfico, não parágrafo. Tudo o que aparece
   aqui é dado que já existe — o escopo é a lista `executa` do próprio serviço,
   a trilha é o processo de sete etapas, e os prazos são os compromissos que o
   site já assume em toda página. Nenhuma porcentagem inventada: sem número
   medido, gráfico de pizza é desenho bonito mentindo. */
const infografico = (s) => {
  const frentes = s.executa.length;
  return `
<span class="ig">
  <span class="ig-bloco">
    <span class="ig-rot">O que entra <b>${frentes} frente${frentes > 1 ? 's' : ''}</b></span>
    <span class="ig-barras" aria-hidden="true">${
      Array.from({ length: frentes }, (_, k) =>
        `<i style="--i:${k}"></i>`).join('')}</span>
    <span class="ig-lista">${s.executa.slice(0, 4).map((e) =>
      `<i>${esc(e)}</i>`).join('')}${frentes > 4 ? `<i class="ig-mais">+${frentes - 4}</i>` : ''}</span>
  </span>

  <span class="ig-bloco">
    <span class="ig-rot">Como anda <b>${processo.length} etapas</b></span>
    <span class="ig-trilha" aria-hidden="true">${processo.map((e) =>
      `<i><u>${e.n}</u></i>`).join('')}</span>
    <span class="ig-pe">Do levantamento à entrega, com medição semanal do avanço.</span>
  </span>

  <span class="ig-bloco">
    <span class="ig-rot">Prazos que a SPX assume</span>
    <span class="ig-chips">
      <i><b>5</b><u>dias úteis · orçamento preliminar</u></i>
      <i><b>10</b><u>dias úteis · proposta detalhada</u></i>
      <i><b>ART</b><u>emitida antes de assinar</u></i>
    </span>
  </span>
</span>`;
};

/* Cartão que vira. As duas faces existem no HTML o tempo todo — o giro é
   `rotateY` com `backface-visibility`, e não troca de conteúdo — então quem
   usa leitor de tela recebe frente e verso mesmo sem enxergar a animação.

   O botão é uma peça separada, e não o cartão inteiro: com o cartão sendo o
   botão, o nome acessível dele virava todo o texto das duas faces e a WCAG
   reprova quando o nome não contém o rótulo visível. Assim o botão tem o seu
   próprio texto, e clicar em qualquer lugar do cartão também vira. */
const cartaoVira = (frente, verso, rotulo = 'Ver as informações') => `
<div class="vira" data-vira>
  <div class="vira-caixa" data-vira-palco>
    <div class="vira-face vira-frente">${frente}</div>
    <div class="vira-face vira-verso">${verso}</div>
  </div>
  <button class="vira-btn" type="button" data-vira-btn aria-pressed="false">
    ${esc(rotulo)}<i aria-hidden="true">↻</i>
  </button>
</div>`;

/* Cartão de chamada do tamanho de um cartão da grade. Nos modelos ele ocupa a
   célula que sobra quando a lista tem número ímpar de itens — em vez de um
   retângulo vazio no canto, o convite entra ali. */
const cartaoChamada = (titulo, apoio, rotulo, url = '/contato', ic = 'conversa') => `
<div class="cartao-cta">
  <span class="cc-ico">${icone(ic)}</span>
  <b>${esc(titulo)}</b>
  <span class="cc-apoio">${esc(apoio)}</span>
  <a class="btn btn-acc" href="${url}">${esc(rotulo)} ↗</a>
</div>`;

/* Grade de cartões com ícone: usada para serviços e para listas de garantia. */
/* `extra` entra como último item da grade — é por onde o cartão de chamada
   ocupa a célula que sobraria vazia quando a lista tem número ímpar. */
const cartoesIcone = (itens, colunas = 4, extra = '') =>
  `<ul class="cartoes-icone" style="--colunas:${colunas}">${itens.map((i) => `
  <li>${i.url ? `<a href="${i.url}">` : '<div>'}
    ${icone(i.icone)}
    <b>${esc(i.titulo)}</b>
    <span>${esc(i.texto)}</span>
  ${i.url ? '</a>' : '</div>'}</li>`).join('')}${extra ? `<li class="ci-cta">${extra}</li>` : ''}</ul>`;

/* Bloco de duas colunas: conteúdo à esquerda, arte técnica à direita. É o
   arranjo dos três modelos da página de serviços. */
const blocoDuplo = (esquerda, direita, invertido = false) =>
  `<div class="bloco-duplo${invertido ? ' invertido' : ''}">
  <div class="bd-txt">${esquerda}</div>
  <div class="bd-arte" aria-hidden="true">${direita}</div>
</div>`;

/* Lista numerada em linhas escuras, com ícone e número à esquerda. */
const listaNumerada = (itens) => `<ol class="lista-num">${itens.map((i, k) => `
  <li><span class="ln-n">${String(k + 1).padStart(2, '0')}</span>
    <span class="ln-ico">${icone(i.icone)}</span>
    <span class="ln-txt"><b>${esc(i.titulo)}</b><span>${esc(i.texto)}</span></span>
  </li>`).join('')}</ol>`;

/* Fluxo em serpentina: a primeira fileira corre para a direita, a segunda
   volta para a esquerda, e um fio liga uma etapa na outra. É a mesma
   informação da linha do tempo vertical num desenho que cabe numa tela — e
   deixa claro que o processo é uma sequência, não uma lista solta.
   As posições saem daqui, não do CSS: com sete etapas a segunda fileira tem
   uma coluna a menos, e é a conta abaixo que decide onde cada uma cai. */
const fluxoSerpente = (etapas, colunas = 4) => `
<ol class="fluxo" style="--colunas:${colunas}">${etapas.map((e, i) => {
  const linha = Math.floor(i / colunas) + 1;
  const dentro = i % colunas;
  /* fileira par corre ao contrário, daí a coluna espelhada */
  const col = linha % 2 ? dentro + 1 : colunas - dentro;
  const ultimoDaFileira = dentro === colunas - 1;
  const ultimo = i === etapas.length - 1;
  const lig = ultimo ? 'fim' : ultimoDaFileira ? 'desce' : (linha % 2 ? 'dir' : 'esq');
  return `
  <li style="--col:${col};--lin:${linha}" data-lig="${lig}">
    <span class="fx-topo"><span class="fx-ico">${icone(e.icone)}</span><span class="fx-n">${e.n}</span></span>
    <b>${esc(e.nome)}</b>
    <span class="fx-txt">${esc(e.texto)}</span>
  </li>`;
}).join('')}</ol>`;

/* Faixa de números colada na abertura: ícone, valor e rótulo em colunas.
   É uma barra fechada, e não uma grade solta no meio do corpo: o número
   aparece junto do que ele qualifica. */
const faixaNumeros = (itens) => `
<div class="faixa-num">${itens.map((n) => `
  <div>
    <span class="fn-ico">${icone(n.icone)}</span>
    <b data-conta="${n.valor}"${n.prefixo ? ` data-prefixo="${n.prefixo}"` : ''}${n.sufixo ? ` data-sufixo="${n.sufixo}"` : ''}>${n.prefixo || ''}${n.valor}${n.sufixo || ''}</b>
    <span class="fn-rot">${esc(n.rotulo)}</span>
  </div>`).join('')}</div>`;

/* O processo numa faixa horizontal, com fio ligando as etapas. É a mesma
   informação da linha do tempo vertical, num formato que cabe na abertura de
   uma página sem tomar uma tela inteira. */
const faixaProcesso = (etapas) => `
<ol class="proc-faixa">${etapas.map((e) => `
  <li>
    <span class="pf-marca">${icone(e.icone)}</span>
    <span class="pf-n">${e.n}</span>
    <b>${esc(e.nome)}</b>
  </li>`).join('')}</ol>`;

/* Chamada final com foto de obra do lado: a última coisa da página é um
   convite, e ele fica mais forte com uma obra real ao lado do que sozinho
   numa caixa de texto. */
const chamadaFoto = (foto, titulo, apoio, rotulo, url = '/contato') => `
<section class="sec wrap" data-reveal>
  <div class="cta-foto" data-adiar>
    <div class="cf-foto">
      <img data-fonte="/img/${foto}-640.webp" width="${dim(foto)[0]}" height="${dim(foto)[1]}"
           alt="" aria-hidden="true" loading="lazy" decoding="async">
    </div>
    <div class="cf-txt">
      <p class="cf-titulo">${titulo}</p>
      <p class="cf-apoio">${esc(apoio)}</p>
      <a class="btn btn-acc" href="${url}">${esc(rotulo)} ↗</a>
    </div>
  </div>
</section>`;

/* Barra de chamada colada no bloco de cima, como nos modelos. */
const barraCta = (pergunta, rotulo, url = '/contato') => `
<div class="barra-cta">
  <p>${esc(pergunta)}</p>
  <a class="btn btn-acc" href="${url}">${esc(rotulo)} ↗</a>
</div>`;

/* Prédio em fio de arame, isométrico de verdade. O truque que faltava: só a
   laje de cobertura aparece inteira; nos pavimentos intermediários desenha-se
   apenas a aresta da frente, senão o desenho vira uma pilha de chevrons em vez
   de um volume fechado. O degradê escurece da cobertura para a base e a malha
   some para as bordas por máscara, em vez de terminar cortada. */
const predioFio = () => {
  const CX = 160, TOPO = 96, LAJE = 84, MEIA = 42, ANDAR = 27, PAVS = 7;
  const BASE = TOPO + PAVS * ANDAR;
  /* laje inteira: losango de 2:1 */
  const laje = (y) => `M${CX} ${y - MEIA}L${CX + LAJE} ${y}L${CX} ${y + MEIA}L${CX - LAJE} ${y}Z`;
  /* só as duas arestas da frente, que é o que se enxerga de um volume fechado */
  const frente = (y) => `M${CX - LAJE} ${y}L${CX} ${y + MEIA}L${CX + LAJE} ${y}`;
  /* montantes de fachada: dois por face, nas divisões de terço */
  const montante = (t, lado) => {
    const x = (CX + lado * (LAJE * t / 3)).toFixed(1);
    const y = (TOPO + MEIA * (1 - t / 3)).toFixed(1);
    return `<path d="M${x} ${y}v${PAVS * ANDAR}"/>`;
  };
  return `
<svg class="arte-predio" viewBox="0 0 320 400" role="img" aria-hidden="true">
  <defs>
    <linearGradient id="pf-fio" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="currentColor" stop-opacity="1"/>
      <stop offset=".5" stop-color="currentColor" stop-opacity=".7"/>
      <stop offset="1" stop-color="currentColor" stop-opacity=".34"/>
    </linearGradient>
    <linearGradient id="pf-face" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="currentColor" stop-opacity=".14"/>
      <stop offset="1" stop-color="currentColor" stop-opacity=".02"/>
    </linearGradient>
    <radialGradient id="pf-fade" cx="50%" cy="44%" r="60%">
      <stop offset="0" stop-color="#fff" stop-opacity=".85"/>
      <stop offset=".6" stop-color="#fff" stop-opacity=".3"/>
      <stop offset="1" stop-color="#fff" stop-opacity="0"/>
    </radialGradient>
    <mask id="pf-malha"><rect width="320" height="400" fill="url(#pf-fade)"/></mask>
    <radialGradient id="pf-brilho" cx="50%" cy="24%" r="44%">
      <stop offset="0" stop-color="currentColor" stop-opacity=".22"/>
      <stop offset="1" stop-color="currentColor" stop-opacity="0"/>
    </radialGradient>
  </defs>

  <ellipse cx="${CX}" cy="140" rx="146" ry="126" fill="url(#pf-brilho)"/>

  <!-- malha de prancha, apagando para fora pela máscara -->
  <g fill="none" stroke="currentColor" stroke-width=".7" opacity=".5" mask="url(#pf-malha)">
    ${Array.from({ length: 11 }, (_, k) =>
      `<path d="M0 ${k * 40}h320"/><path d="M${k * 32} 0v400"/>`).join('\n    ')}
  </g>

  <!-- implantação: o lote em volta do prédio, tracejado, como em planta -->
  <path d="M${CX} ${BASE + MEIA - 62}L${CX + 124} ${BASE + MEIA}L${CX} ${BASE + MEIA + 62}L${CX - 124} ${BASE + MEIA}Z"
        fill="none" stroke="currentColor" stroke-width=".8" opacity=".26" stroke-dasharray="4 6"/>

  <!-- as duas faces visíveis, com preenchimento quase nulo só para dar volume -->
  <path d="M${CX - LAJE} ${TOPO}L${CX} ${TOPO + MEIA}L${CX} ${BASE + MEIA}L${CX - LAJE} ${BASE}Z"
        fill="url(#pf-face)" stroke="none"/>
  <path d="M${CX + LAJE} ${TOPO}L${CX} ${TOPO + MEIA}L${CX} ${BASE + MEIA}L${CX + LAJE} ${BASE}Z"
        fill="url(#pf-face)" stroke="none" opacity=".55"/>

  <g fill="none" stroke="url(#pf-fio)" stroke-width="1.1" stroke-linejoin="round">
    <path d="${laje(TOPO)}"/>
    <!-- pavimentos: só a aresta da frente -->
    ${Array.from({ length: PAVS }, (_, k) =>
      `<path d="${frente(TOPO + (k + 1) * ANDAR)}"/>`).join('\n    ')}
    <!-- as três prumadas que se enxergam do volume -->
    <path d="M${CX - LAJE} ${TOPO}v${PAVS * ANDAR}M${CX + LAJE} ${TOPO}v${PAVS * ANDAR}"/>
    <path d="M${CX} ${TOPO + MEIA}v${PAVS * ANDAR}"/>
  </g>

  <g fill="none" stroke="currentColor" stroke-width=".8" opacity=".38">
    ${[1, 2].flatMap((t) => [-1, 1].map((lado) => montante(t, lado))).join('\n    ')}
  </g>

  <!-- casa de máquinas na cobertura: o detalhe que dá escala ao volume -->
  <g fill="none" stroke="currentColor" stroke-width=".9" opacity=".7">
    <path d="M${CX} ${TOPO - MEIA - 20}L${CX + 30} ${TOPO - MEIA - 5}L${CX} ${TOPO - MEIA + 10}L${CX - 30} ${TOPO - MEIA - 5}Z"/>
    <path d="M${CX - 30} ${TOPO - MEIA - 5}v15M${CX + 30} ${TOPO - MEIA - 5}v15M${CX} ${TOPO - MEIA + 10}v15"/>
    <path d="M${CX - 30} ${TOPO - MEIA + 10}L${CX} ${TOPO - MEIA + 25}L${CX + 30} ${TOPO - MEIA + 10}"/>
  </g>

  <!-- cota de altura à esquerda, com marca em cada pavimento -->
  <g fill="none" stroke="currentColor" stroke-width=".8" opacity=".4">
    <path d="M30 ${TOPO}v${PAVS * ANDAR}"/>
    <path d="M25 ${TOPO}h10M25 ${BASE}h10"/>
    ${Array.from({ length: PAVS - 1 }, (_, k) =>
      `<path d="M27 ${TOPO + (k + 1) * ANDAR}h6"/>`).join('\n    ')}
  </g>

  <!-- terreno -->
  <path d="M16 ${BASE + MEIA}h288" fill="none" stroke="currentColor"
        stroke-width="1" opacity=".5"/>

  <g fill="currentColor" opacity=".7">
    ${[[CX, TOPO - MEIA], [CX - LAJE, TOPO], [CX + LAJE, TOPO], [CX, TOPO + MEIA],
       [CX - LAJE, BASE], [CX + LAJE, BASE], [CX, BASE + MEIA]]
      .map(([x, y]) => `<circle cx="${x}" cy="${y}" r="2.3"/>`).join('\n    ')}
  </g>
</svg>`;
};

/* Órbita: a SPX no centro e as três camadas girando em volta. Clicar numa
   delas mostra, ao lado, só as etapas do processo daquela camada — o campo
   `camada` em conteudo/dados.mjs é quem faz a divisão, então mexer lá muda o
   diagrama sozinho. São abas de verdade (tablist/tabpanel): quem navega por
   teclado percorre as bolas com as setas, e o leitor de tela anuncia qual
   camada abriu. A primeira já vem aberta, para o bloco nunca ficar vazio. */
const orbitaSPX = () => {
  const grupos = camadas.map((c) => ({ ...c, etapas: processo.filter((e) => e.camada === c.id) }));
  /* as três posições no anel. A conta sai daqui e vira left/top em % do palco:
     porcentagem dentro de `translate` resolveria contra a própria bola, que é
     pequena, e as três acabariam empilhadas em cima da marca. */
  const ANG = [-90, 30, 150]; /* topo, direita-baixo, esquerda-baixo */
  const RAIO = 0.34;          /* fração do lado do palco, do centro à bola */
  const pos = (a) => {
    const r = (a * Math.PI) / 180;
    return { x: (50 + RAIO * 100 * Math.cos(r)).toFixed(2),
             y: (50 + RAIO * 100 * Math.sin(r)).toFixed(2) };
  };
  return `
<div class="orbita" data-orbita>
  <div class="orbita-palco">
    <svg class="orbita-fio" viewBox="0 0 320 320" aria-hidden="true">
      <g fill="none" stroke="currentColor">
        <circle cx="160" cy="160" r="${(RAIO * 320).toFixed(0)}" opacity=".14"/>
        <circle cx="160" cy="160" r="${(RAIO * 320).toFixed(0)}" opacity=".34" stroke-dasharray="2 9" class="orbita-anel"/>
        <circle cx="160" cy="160" r="78" opacity=".1"/>
        ${ANG.map((a) => {
          const { x, y } = pos(a);
          return `<path class="orbita-raio" data-raio="${a}" opacity=".22"
                d="M160 160L${(x * 3.2).toFixed(1)} ${(y * 3.2).toFixed(1)}"/>`;
        }).join('\n        ')}
      </g>
    </svg>

    <span class="orbita-nucleo" aria-hidden="true">SPX</span>

    <div class="orbita-bolas" role="tablist" aria-label="As três camadas do trabalho da SPX">
      ${grupos.map((c, i) => `
      <button class="orbita-bola" type="button" role="tab" data-orbita-bola
              id="camada-${c.id}" aria-controls="painel-camada" data-raio="${ANG[i]}"
              style="left:${pos(ANG[i]).x}%;top:${pos(ANG[i]).y}%"
              data-nome="${esc(c.nome)}" data-papel="${esc(c.papel)}"
              aria-selected="${i === 0 ? 'true' : 'false'}" tabindex="${i === 0 ? '0' : '-1'}">
        <span class="ob-ico">${icone(c.icone)}</span>
        <b>${esc(c.nome)}</b>
      </button>`).join('')}
    </div>
  </div>

  <div class="orbita-painel" id="painel-camada" role="tabpanel"
       aria-labelledby="camada-${grupos[0].id}" tabindex="0">
    ${grupos.map((c, i) => `
    <div class="orbita-parte" data-orbita-parte="${c.id}"${i ? ' hidden' : ''}>
      <p class="orbita-papel"><b>${esc(c.nome)}</b><span>${esc(c.papel)}</span></p>
      <p class="orbita-resumo">${esc(c.texto)}</p>
      <ol class="orbita-etapas">
        ${c.etapas.map((e) => `
        <li><span class="oe-n">${e.n}</span>
          <span class="oe-ico" aria-hidden="true">${icone(e.icone)}</span>
          <span class="oe-txt"><b>${esc(e.nome)}</b><span>${esc(e.texto)}</span></span>
        </li>`).join('')}
      </ol>
    </div>`).join('')}
  </div>
</div>`;
};

/* Faixa dupla: duas tiras cruzadas com a marca passando, uma para cada lado.
   Serve de respiro entre seções, e é a única peça da página em que a marca
   aparece grande. As duas tiras são inertes para leitor de tela: quem não
   enxerga já ouviu o nome da empresa no topo e no rodapé, repetir vinte vezes
   só atrapalha. */
const faixaDupla = (classe = '') => {
  /* a tira é escura no tema escuro, então quem entra é a marca de tinta clara.
     Invertido em relação ao menu, onde a marca fica sobre a cápsula clara. */
  const peca = `<span class="fd-peca">
    <img class="fd-marca" src="/img/logo-spx-negativa.webp" width="300" height="72" alt="" loading="lazy" decoding="async">
    <i>Engenharia · Gestão · Execução</i>
  </span>`;
  /* dobrado: a animação anda 50% e volta ao começo sem emenda visível */
  const tira = (dir) => `<div class="fd-tira fd-${dir}">
    <div class="fd-corre">${peca.repeat(8)}</div>
  </div>`;
  return `
<section class="faixa-dupla${classe ? ' ' + classe : ''}" aria-hidden="true">
  ${tira('ida')}
  ${tira('volta')}
</section>`;
};

/* Grade de serviços onde clicar num cartão abre as fotos daquele tipo de obra
   logo abaixo. São abas de verdade (tablist/tabpanel), então quem navega por
   teclado ou leitor de tela entende o que abriu e onde. */
const cartoesObra = (itens) => `
<div class="obras-abas" data-obras>
  <div class="obras-grade" role="tablist" aria-label="Tipos de obra">
    ${itens.map((s, i) => `
    <button class="obra-cartao" type="button" role="tab" data-obra-aba
            id="aba-${s.slug}" aria-controls="painel-obras" aria-selected="false"
            data-fotos="${s.fotos.join(',')}" data-nome="${esc(s.nome)}"
            data-url="/servicos/${s.slug}" tabindex="${i === 0 ? '0' : '-1'}">
      <span class="obra-ico">${icone(s.icone)}</span>
      <b>${esc(s.nome)}</b>
      <span class="obra-txt">${esc(s.resumo)}</span>
      <span class="obra-ver">Ver obras<i aria-hidden="true">+</i></span>
    </button>`).join('')}
  </div>
  <div class="obras-painel" id="painel-obras" role="tabpanel" data-obra-painel hidden>
    <div class="obras-cab">
      <p><b data-obra-titulo></b><span>Ambientes desse tipo, do arquivo da SPX.</span></p>
      <a class="btn" data-obra-link href="/servicos">Ver o serviço ↗</a>
      <button class="obras-fechar" type="button" data-obra-fechar aria-label="Fechar fotos">×</button>
    </div>
    <div class="obras-fotos" data-obra-fotos></div>
  </div>
</div>`;

/* Mosaico de fotos em faixas, como a coluna direita do modelo: as imagens
   empilhadas ocupam a altura da lista ao lado. */
const mosaicoFotos = (nomes) => `
<div class="mosaico" data-adiar>${nomes.map((f, i) => `
  <img data-fonte="/img/${f}-480.webp" sizes="(max-width:900px) 90vw, 300px"
       width="480" height="${Math.round(480 * dim(f)[1] / dim(f)[0])}" alt=""
       decoding="async" fetchpriority="low" style="--i:${i}">`).join('')}</div>`;

/* mapa de alfinetes, usado na atuação e nos projetos */
/* Mapa da atuação. Não é cartografia: é um diagrama de malha urbana. Não leva
   nome de rua nem contorno de município de propósito — desenhar um traçado
   inventado com cara de mapa oficial de São Paulo afirmaria uma coisa que o
   desenho não sabe. O que ele diz é o que é verdade: as obras se concentram
   num punhado de polos dentro de uma cidade densa.

   As linhas saem de um gerador com semente fixa, e não de Math.random: a build
   precisa sair byte a byte igual toda vez que rodar. */
const mapaSVG = () => {
  /* mulberry32: pequeno, determinístico, e espalha traço bem o bastante */
  let s = 0x9e3779b9;
  const rnd = () => {
    s |= 0; s = (s + 0x6D2B79F5) | 0;
    let t = Math.imul(s ^ (s >>> 15), 1 | s);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
  const n = (a, b) => a + rnd() * (b - a);
  const p2 = (v) => v.toFixed(1);

  /* uma via: começa fora da tela, atravessa com leve curvatura */
  const via = (ang, desvio, curva) => {
    const r = (ang * Math.PI) / 180;
    const cx = 210 + Math.cos(r + Math.PI / 2) * desvio;
    const cy = 210 + Math.sin(r + Math.PI / 2) * desvio;
    const dx = Math.cos(r) * 340, dy = Math.sin(r) * 340;
    const mx = cx + Math.cos(r + Math.PI / 2) * curva;
    const my = cy + Math.sin(r + Math.PI / 2) * curva;
    return `M${p2(cx - dx)} ${p2(cy - dy)}Q${p2(mx)} ${p2(my)} ${p2(cx + dx)} ${p2(cy + dy)}`;
  };

  /* um trecho curto de rua, do tamanho de uma ou duas quadras */
  const quadra = (ang) => {
    const r = ((ang + n(-6, 6)) * Math.PI) / 180;
    const x = n(10, 410), y = n(10, 410), c = n(26, 96);
    return `M${p2(x)} ${p2(y)}l${p2(Math.cos(r) * c)} ${p2(Math.sin(r) * c)}`;
  };

  /* A malha tem duas famílias de ângulo, como bairro que cresceu em épocas
     diferentes, mais vias soltas costurando as duas e um monte de trecho curto
     por cima — é o traço curto que dá densidade de cidade; só via longa lê
     como teia de aranha. */
  /* Três faixas de opacidade, e não uma opacidade por traço: assim a malha
     inteira cabe em três <path>, em vez de cento e trinta. Mesmo desenho na
     tela, um terço do peso no HTML e muito menos nó para o navegador pintar. */
  const FAIXAS = [.14, .24, .34];
  const balde = [[], [], []];
  const solta = (d) => balde[Math.floor(rnd() * 3)].push(d);
  for (let k = 0; k < 17; k++) solta(via(22 + n(-3, 3), n(-200, 200), n(-26, 26)));
  for (let k = 0; k < 15; k++) solta(via(114 + n(-4, 4), n(-190, 190), n(-22, 22)));
  for (let k = 0; k < 9; k++) solta(via(n(0, 180), n(-170, 170), n(-60, 60)));
  for (let k = 0; k < 64; k++) solta(quadra(k % 2 ? 22 : 114));
  for (let k = 0; k < 26; k++) solta(quadra(n(0, 180)));

  /* vias estruturais: mais grossas, é o que dá hierarquia à malha */
  const arterias = [via(22, -70, 18), via(22, 96, -22), via(114, -40, 24), via(70, 120, -40)];

  /* os polos onde as obras se concentram — posição livre, sem endereço */
  const polos = [[168, 150], [236, 124], [204, 206], [280, 178], [140, 236], [248, 268], [186, 300]];

  return `
<svg viewBox="0 0 420 420" role="img">
  <defs>
    <radialGradient id="mp-fundo" cx="50%" cy="46%" r="62%">
      <stop offset="0" stop-color="currentColor" stop-opacity=".14"/>
      <stop offset="1" stop-color="currentColor" stop-opacity="0"/>
    </radialGradient>
    <radialGradient id="mp-fade" cx="50%" cy="50%" r="52%">
      <stop offset="0" stop-color="#fff" stop-opacity="1"/>
      <stop offset=".62" stop-color="#fff" stop-opacity=".85"/>
      <stop offset="1" stop-color="#fff" stop-opacity="0"/>
    </radialGradient>
    <mask id="mp-borda"><rect width="420" height="420" fill="url(#mp-fade)"/></mask>
    <radialGradient id="mp-halo">
      <stop offset="0" stop-color="currentColor" stop-opacity=".55"/>
      <stop offset=".45" stop-color="currentColor" stop-opacity=".16"/>
      <stop offset="1" stop-color="currentColor" stop-opacity="0"/>
    </radialGradient>
    <linearGradient id="mp-feixe" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="currentColor" stop-opacity=".5"/>
      <stop offset="1" stop-color="currentColor" stop-opacity="0"/>
    </linearGradient>
  </defs>

  <circle cx="210" cy="196" r="200" fill="url(#mp-fundo)"/>

  <g mask="url(#mp-borda)" fill="none" stroke="currentColor" stroke-linecap="round">
    <g stroke-width=".7">
      ${balde.map((ds, i) => `<path opacity="${FAIXAS[i]}" d="${ds.join('')}"/>`).join('\n      ')}
    </g>
    <path stroke-width="1.7" opacity=".46" d="${arterias.join('')}"/>
    <!-- o rio: a curva larga que nenhuma malha respeita -->
    <path d="M-20 96C90 150 120 250 96 330 78 388 120 430 200 440" stroke-width="3"
          opacity=".22"/>
    <path d="M-20 96C90 150 120 250 96 330 78 388 120 430 200 440" stroke-width="8"
          opacity=".07"/>
  </g>

  ${polos.map(([x, y], i) => `
  <g class="mapa-pino" style="--atraso:${(i * 0.36).toFixed(2)}s">
    <circle cx="${x}" cy="${y}" r="34" fill="url(#mp-halo)" stroke="none"/>
    <rect x="${x - 1}" y="${y}" width="2" height="34" fill="url(#mp-feixe)" stroke="none"/>
    <circle cx="${x}" cy="${y}" r="16" class="mapa-onda"/>
    <path d="M${x} ${y + 9}c0 0 8-7.6 8-13a8 8 0 1 0-16 0c0 5.4 8 13 8 13Z"/>
    <circle cx="${x}" cy="${y - 4}" r="2.6" class="mapa-furo"/>
  </g>`).join('')}
</svg>`;
};

const secao = (titulo, dentro, classe = '') =>
  `<section class="sec wrap ${classe}"><h2>${esc(titulo)}</h2>${dentro}</section>`;

const chamada = (texto, rotulo = 'Solicitar visita técnica') =>
  `<section class="sec wrap cta-faixa" data-reveal>
  <p class="cta-frase">${esc(texto)}</p>
  <a class="btn btn-acc" href="/contato">${esc(rotulo)} ↗</a>
</section>`;

/* Carrossel em profundidade: o cartão do meio fica de frente e inteiro, os
   dos lados giram para dentro e recuam. Setas, marcadores e arraste no dedo.
   Cada cartão é um <article> de verdade, então quem usa leitor de tela recebe
   a lista completa mesmo sem enxergar o efeito. */
/* um ícone por pergunta, rodando na lista: sem repetir dois seguidos */
const ICO_DUVIDA = ['empresa','corporativa','retrofit','reforma','gerencia','projeto','compat','art',
                    'local','proposta','visita','cronograma','execucao','laudo'];

const carrossel = () => `
<section class="sec capa3d-bloco" aria-labelledby="acervoTitulo">
  <!-- O título saiu da tela, não do documento. Os cartões do carrossel são
       <h3>; sem um <h2> antes deles a página pula de h1 para h3, e leitor de
       tela que navega por títulos perde o nível do meio. -->
  <h2 id="acervoTitulo" class="so-leitor">Arquivo de obras da SPX Engenharia</h2>

  <div class="capa3d" data-capa3d>
    <button class="capa3d-seta ant" type="button" data-capa3d-ant aria-label="Obra anterior">
      <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M15 5l-7 7 7 7"/></svg>
    </button>

    <div class="capa3d-palco" data-capa3d-palco>
      ${acervo.map((o, i) => `
      <!-- As fotos entram por data-fonte, e só quando a seção se aproxima da
           tela. O lazy do navegador começava a baixá-las cedo demais: os oito
           cartões somavam centenas de KB competindo com a foto do topo, que é
           o maior elemento pintado, e custavam meio segundo de LCP. Ficam em
           480w porque no cartão de 340 px a variante maior não aparece. -->
      <article class="capa3d-item" data-capa3d-item aria-roledescription="slide"
               aria-label="${i + 1} de ${acervo.length}">
        <img data-fonte="/img/${o.foto}-480.webp"
             sizes="(max-width:700px) 78vw, 340px"
             width="480" height="${Math.round(480 * dim(o.foto)[1] / dim(o.foto)[0])}"
             alt="${esc(o.titulo)}, ${esc(o.linha.toLowerCase())}, obra executada pela SPX Engenharia"
             decoding="async" fetchpriority="low">
        <span class="capa3d-etiqueta">${esc(o.etiqueta)}</span>
        <div class="capa3d-corpo">
          <h3>${esc(o.titulo)}<span>${esc(o.linha)}</span></h3>
          <p>${esc(o.texto)}</p>
          <a class="btn btn-acc" href="/contato" tabindex="-1">Falar sobre uma obra assim ↗</a>
        </div>
      </article>`).join('')}
    </div>

    <button class="capa3d-seta prox" type="button" data-capa3d-prox aria-label="Próxima obra">
      <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9 5l7 7-7 7"/></svg>
    </button>
  </div>

  <div class="capa3d-pontos" data-capa3d-pontos role="tablist" aria-label="Escolher obra">
    ${acervo.map((o, i) => `<button type="button" role="tab" data-capa3d-ponto
      aria-label="${esc(o.titulo)}, ${esc(o.linha)}"${i === 0 ? ' aria-selected="true"' : ''}></button>`).join('')}
  </div>
</section>`;

const perguntas = (pares) =>
  `<div class="faq-lista">${pares.map(([p, r]) =>
    `<details class="q-item"><summary>${esc(p)}</summary><p>${esc(r)}</p></details>`).join('')}</div>`;

/* ------------------------------------------------------ páginas de serviço */
const servicosPublicaveis = servicos.filter((s) => {
  if (s.confirmar) anota(`Serviço "${s.nome}"`, s.confirmar);
  return true;
});

for (const s of servicosPublicaveis) {
  const trilha = [{ nome: 'Início', url: '/' }, { nome: 'Serviços', url: '/servicos' },
                  { nome: s.nome, url: '/servicos/' + s.slug }];
  const relacionados = servicos.filter((o) => o.slug !== s.slug).slice(0, 3);
  pagina({
    url: '/servicos/' + s.slug,
    arquivo: `servicos/${s.slug}.html`,
    title: s.title, descricao: s.descricao, h1: s.h1, trilha,
    visual: 'pag-servico servico-' + s.slug,
    /* sem foto de topo: o lado direito do cabeçalho é do cartão que vira */
    ladoTopo: cartaoVira(`
      <span class="vira-tipo">Tipo de obra</span>
      <span class="vira-nome">${esc(s.nome)}</span>
      <span class="vira-foto"><img src="/img/${s.fotos[0]}-640.webp" width="640"
        height="${Math.round(640 * dim(s.fotos[0])[1] / dim(s.fotos[0])[0])}"
        sizes="(max-width:999px) 92vw, 460px" alt="" loading="lazy" decoding="async"></span>`,
      infografico(s), `Ver o que é ${s.nome.toLowerCase()}`),
    schema: [schemaServico(s), schemaPerguntas([[s.pergunta, s.resposta], ...s.faq]),
             { '@type': 'WebPage', '@id': `${SITE}/servicos/${s.slug}#pagina`,
               name: s.h1, speakable: FALADO, about: { '@id': idEmpresa } }],
    corpo: `
${secao('Dúvidas sobre ' + s.nome.toLowerCase(), perguntas(s.faq) +
  cartaoChamada('Ainda tem dúvida?', 'Fale direto com o engenheiro responsável.',
    'Enviar pergunta', '/contato', 'conversa'), 'claro')}

${secao('Outros serviços', `<ul class="grade-servicos">${relacionados.map((o) =>
  `<li><a href="/servicos/${o.slug}"><b>${esc(o.nome)}</b><span>${esc(o.resumo)}</span></a></li>`).join('')}</ul>`)}

${chamada(s.cta)}`,
  });
}

/* ------------------------------------------------------- índice de serviços */
pagina({
  url: '/servicos', arquivo: 'servicos.html',
  fundo: 'estante-espinha-peixe',
  title: 'Serviços de engenharia e execução de obras | SPX Engenharia',
  descricao: 'Obras corporativas e comerciais, retrofit, reformas, gerenciamento, manutenção, ' +
    'projetos e laudos. Engenharia, gestão e execução pela mesma equipe, em São Paulo e região.',
  h1: 'Serviços de engenharia, gestão e execução',
  lead: `${empresa.proposta} A SPX não vende mão de obra: vende a engenharia que decide o que ` +
        'fazer, a gestão que mantém o prazo e a execução que entrega.',
  trilha: [{ nome: 'Início', url: '/' }, { nome: 'Serviços', url: '/servicos' }],
  schema: [schemaProcesso(), { '@type': 'CollectionPage', name: 'Serviços da SPX Engenharia',
    speakable: FALADO, about: { '@id': idEmpresa },
    hasPart: servicos.map((s) => ({ '@type': 'Service', name: s.nome,
      url: `${SITE}/servicos/${s.slug}` })) }],
  corpo: `
<section class="sec wrap" data-reveal>
  <h2>O que <em>executamos</em></h2>
  <p class="sub-secao">Soluções completas para cada tipo de necessidade.</p>
  ${cartoesObra(servicosPublicaveis)}
  ${barraCta('Qual desses serviços faz sentido para o seu projeto?', 'Solicitar avaliação')}
</section>

<section class="sec wrap" data-reveal>
  <h2>Como <em>trabalhamos</em></h2>
  <p class="sub-secao">Toque numa das camadas para ver as etapas que ela responde.</p>
  ${orbitaSPX()}
</section>

${faixaDupla()}

<section class="sec wrap" data-reveal>
  <h2>O que vem junto,<br>em qualquer <em>serviço</em>.</h2>
  ${blocoDuplo(listaNumerada([
    { icone: 'visita', titulo: 'Visita técnica antes do orçamento', texto: 'Nenhuma obra é orçada por telefone.' },
    { icone: 'proposta', titulo: 'Proposta discriminada', texto: 'Serviço a serviço, com quantidade e critério de medição.' },
    { icone: 'cronograma', titulo: 'Cronograma físico-financeiro', texto: 'Entregue junto da proposta, não depois de assinar.' },
    { icone: 'art', titulo: 'Responsável técnico nomeado', texto: 'Com ART emitida para a obra.' },
    { icone: 'relatorio', titulo: 'Relatório semanal', texto: 'Avanço medido contra o previsto, com registro fotográfico.' },
    { icone: 'asbuilt', titulo: 'As built e manuais na entrega', texto: 'Para a próxima intervenção não começar às cegas.' },
  ]), predioFio())}
  ${barraCta('Vamos começar o seu projeto?', 'Solicitar visita técnica')}
</section>`,
  visual: 'pag-servicos',
});

/* --------------------------------------------------------------- projetos */
const projetosPublicaveis = projetos.filter((p) => {
  const minimo = ['tipo', 'atuacao'].filter((c) => falta(p[c]));
  const semFoto = falta(p.fotos) || !p.fotos.length;
  if (minimo.length || semFoto) {
    anota(`Projeto ${p.nome}`,
      [minimo.length ? 'faltam ' + minimo.join(' e ') : null,
       semFoto ? 'faltam as fotos' : null].filter(Boolean).join('; ') +
      ' — a página não é publicada enquanto isso');
    return false;
  }
  return true;
});

for (const p of projetosPublicaveis) {
  const trilha = [{ nome: 'Início', url: '/' }, { nome: 'Projetos', url: '/obras' },
                  { nome: p.nome, url: '/obras/' + p.slug }];
  const ficha = [['Região', p.regiao], ['Cidade', p.cidade], ['Tipo de obra', p.tipo],
                 ['Atuação da SPX', p.atuacao], ['Período', p.periodo]]
    .filter(([, v]) => !falta(v));
  const opcional = (titulo, valor) => falta(valor) ? '' : secao(titulo, `<p class="lead">${esc(valor)}</p>`);
  pagina({
    url: '/obras/' + p.slug, arquivo: `obras/${p.slug}.html`,
    title: `${p.nome} · ${p.regiao}, São Paulo | ${empresa.nome}`,
    descricao: `${p.nome}: ${falta(p.tipo) ? 'obra' : p.tipo.toLowerCase()} na região ${p.regiao}, ` +
      `em São Paulo, com atuação da SPX Engenharia em ${String(p.atuacao).toLowerCase()}.`,
    h1: `${p.nome} · ${p.regiao}`, trilha,
    schema: [{ '@type': 'CreativeWork', name: p.nome, about: p.tipo,
               creator: { '@id': idEmpresa },
               locationCreated: { '@type': 'Place', name: `${p.regiao}, São Paulo` } }],
    corpo: `
<section class="sec wrap" data-reveal>
  <dl class="ficha-obra">${ficha.map(([r, v]) =>
    `<div><dt>${esc(r)}</dt><dd>${esc(v)}</dd></div>`).join('')}</dl>
</section>
${falta(p.escopo) ? '' : secao('Escopo executado', `<ul class="marcada">${lista(p.escopo)}</ul>`, 'claro')}
${opcional('O desafio', p.desafio)}
${opcional('A solução', p.solucao)}
${opcional('Resultado', p.resultado)}
${secao('Registro da obra', `<div class="galeria-obra">${p.fotos.map((f) =>
  `<img src="/img/${f}-960.webp" srcset="/img/${f}-480.webp 480w, /img/${f}-640.webp 640w, /img/${f}-960.webp 960w"
    sizes="(max-width:700px) 100vw, 33vw" alt="${esc(p.nome)}, ${esc(falta(p.tipo) ? 'obra' : p.tipo.toLowerCase())} executada pela SPX Engenharia ${esc(p.regiao)}, São Paulo"
    loading="lazy" decoding="async" width="960" height="1363">`).join('')}</div>`)}
${chamada(chamadas.projeto)}`,
  });
}

/* --------------------------------------------------------- índice de obras */
pagina({
  url: '/obras', arquivo: 'obras.html',
  /* sem foto de topo: aqui quem abre a página é o carrossel, e uma foto grande
     antes dele empurrava o portfólio inteiro para baixo da dobra */
  title: 'Projetos realizados | SPX Engenharia',
  descricao: 'Obras corporativas e comerciais executadas pela SPX Engenharia em São Paulo: ' +
    'Avenida Paulista, Jardins e Brooklin.',
  h1: 'Projetos realizados',
  trilha: [{ nome: 'Início', url: '/' }, { nome: 'Projetos', url: '/obras' }],
  corpo: `
${carrossel()}

${projetosPublicaveis.length
  ? secao('Obras', `<ul class="grade-obras">${projetosPublicaveis.map((p) =>
      `<li><a href="/obras/${p.slug}"><b>${esc(p.nome)}</b><span>${esc(p.regiao)} · ${esc(p.atuacao)}</span></a></li>`).join('')}</ul>`, 'claro')
  : ''}

<section class="sec wrap" data-reveal>
  <h2>O que a SPX <em>documenta</em><br>em toda obra</h2>
  <p class="sub-secao">Obra que não deixa registro não vira referência para a próxima.</p>
  ${blocoDuplo(listaNumerada([
      { icone: 'asbuilt', titulo: 'As built', texto: 'A planta do que foi realmente construído, com as alterações de campo.' },
      { icone: 'proposta', titulo: 'Memorial de acabamentos', texto: 'O que foi aplicado, onde, de qual fornecedor.' },
      { icone: 'relatorio', titulo: 'Manuais e garantias', texto: 'De cada equipamento e sistema instalado.' },
      { icone: 'acompanha', titulo: 'Registro fotográfico semanal', texto: 'O antes, o durante e o depois de cada frente.' },
      { icone: 'cronograma', titulo: 'Cronograma medido', texto: 'O previsto contra o realizado, semana a semana.' },
      { icone: 'entrega', titulo: 'Lista de pendências fechada', texto: 'Assinada na vistoria conjunta de entrega.' },
  ]), mosaicoFotos(['estante-espinha-peixe', 'banheiro-marmore', 'restaurante-salao']))}
</section>

<section class="sec wrap" data-reveal>
  <h2>Tipos de obra <em>no portfólio</em></h2>
  ${cartoesObra(servicos.slice(0, 8))}
  ${barraCta('Qual desses se parece com o seu projeto?', 'Solicitar avaliação')}
</section>

<section class="sec wrap" data-reveal>
  <h2>Onde essas obras <em>acontecem</em></h2>
  <div class="mapa-grid">
    <div class="mapa-arte" aria-hidden="true">${mapaSVG()}</div>
    <div class="mapa-txt">
      <p class="lead">A maior parte do portfólio está na capital, nos polos corporativos e nos
      bairros de varejo de alto padrão.</p>
      <ul class="grade-regioes">${lista(regioes['São Paulo capital'])}</ul>
      <p style="margin-top:var(--e3)"><a class="btn" href="/atuacao">Ver todas as regiões ↗</a></p>
    </div>
  </div>
</section>`,
  visual: 'pag-obras',
});

/* ------------------------------------------------------------------ sobre */
const blocoResponsavel = () => {
  if (falta(responsavel.nome)) {
    anota('Página /sobre', 'seção do responsável técnico inteira — nome, formação, ' +
      'especialidades, resumo e foto. É o que sustenta a autoridade técnica do site.');
    return '';
  }
  const linhas = [['Formação', responsavel.formacao],
                  ['Experiência', `${responsavel.anosExperiencia} anos em engenharia civil`],
                  ['Especialidades', falta(responsavel.especialidades) ? null : responsavel.especialidades.join(', ')]]
    .filter(([, v]) => !falta(v));
  return secao('Responsável técnico', `
  <div class="perfil">
    ${falta(responsavel.foto) ? '' : `<img class="perfil-foto" src="/img/${responsavel.foto}" alt="${esc(responsavel.nome)}, ${esc(responsavel.titulo)} responsável técnico da SPX Engenharia" width="420" height="520" loading="lazy" decoding="async">`}
    <div>
      <h3>${esc(responsavel.nome)}</h3>
      <p class="eyebrow">${esc(responsavel.titulo)}</p>
      ${falta(responsavel.resumo) ? '' : `<p class="lead">${esc(responsavel.resumo)}</p>`}
      <dl class="ficha-obra">${linhas.map(([r, v]) =>
        `<div><dt>${esc(r)}</dt><dd>${esc(v)}</dd></div>`).join('')}</dl>
    </div>
  </div>`, 'claro');
};

const dadosInstitucionais = () => {
  const linhas = [['empresa', 'Empresa', empresa.nome], ['empresa', 'Razão social', empresa.razaoSocial],
                  ['proposta', 'CNPJ', empresa.cnpj], ['projeto', 'Segmento', empresa.segmento],
                  ['local', 'Base', empresa.base], ['local', 'Área de atuação', empresa.atuacao],
                  ['local', 'Endereço', empresa.endereco],
                  ['art', 'Responsável técnico', responsavel.nome],
                  ['telefone', 'Telefone', empresa.telefone], ['email', 'E-mail', empresa.email],
                  ['relogio', 'Atendimento', empresa.horario]].filter(([, , v]) => !falta(v));
  /* dentro de <dl>, o <div> só pode conter <dt> e <dd>; envolver os dois num
     segundo <div> quebra a semântica da lista de definições */
  return `<dl class="ficha-icone">${linhas.map(([ic, r, v]) =>
    `<div>${icone(ic)}<dt>${esc(r)}</dt><dd>${esc(v)}</dd></div>`).join('')}</dl>`;
};

const numerosValidados = numeros.filter((n) => {
  if (!n.validado) anota(`Número "${n.rotulo}"`, n.nota + ' Fora do site até confirmar.');
  return n.validado;
});

pagina({
  url: '/sobre', arquivo: 'sobre.html',
  fundo: 'sala-reuniao-azul',
  visual: 'pag-sobre',
  title: `Sobre a ${empresa.nome} | Engenharia de obras corporativas em São Paulo`,
  descricao: `${empresa.definicao} Quem somos, como trabalhamos, área de atuação e responsabilidade técnica.`,
  h1: `Sobre a ${empresa.nome}`,
  lead: `${empresa.definicao} ${empresa.proposta}`,
  trilha: [{ nome: 'Início', url: '/' }, { nome: 'Sobre', url: '/sobre' }],
  schema: [schemaPessoa(), schemaProcesso(),
           { '@type': 'AboutPage', name: `Sobre a ${empresa.nome}`, speakable: FALADO,
             mainEntity: { '@id': idEmpresa } }].filter(Boolean),
  corpo: `
<section class="sec wrap" data-reveal>
  <ul class="marcas-fato">
    <li>${icone('local')}<span>Base em ${esc(empresa.base)}, com atuação em ${esc(empresa.atuacao)}.</span></li>
    <li>${icone('cronograma')}<span>Cronograma físico-financeiro entregue junto da proposta, não depois de assinar.</span></li>
    <li>${icone('art')}<span>Engenheiro responsável nomeado, com ART emitida para a obra, antes da assinatura.</span></li>
  </ul>
  ${numerosValidados.length ? faixaNumeros(numerosValidados) : ''}
</section>

${secao('Como a SPX começou', `
  <p class="sub-secao">Uma empresa de um ano, tocada por um engenheiro com nove.</p>
  <ol class="historia">${historia.map((h) => `
    <li><span class="hi-n">${h.n}</span>
      <div><b>${esc(h.titulo)}</b><p>${esc(h.texto)}</p></div>
    </li>`).join('')}</ol>`, 'vidro faixa-vidro')}

${blocoResponsavel()}

${secao('Como trabalhamos', faixaProcesso(processo))}

${secao('Dados institucionais', dadosInstitucionais())}

${chamadaFoto('lounge-recepcao', 'Vamos fazer<br>o seu projeto <em>acontecer</em>.',
  'Fale com um engenheiro da SPX.', 'Solicitar visita técnica')}`,
});

/* -------------------------------------------------------- para arquitetos */
pagina({
  url: '/para-arquitetos', arquivo: 'para-arquitetos.html',
  fundo: 'mesa-vista-sp',
  visual: 'pag-arquitetos',
  title: 'Execução de projeto para arquitetos em São Paulo | SPX Engenharia',
  descricao: 'A SPX executa o projeto do arquiteto: leitura, compatibilização, orçamento ' +
    'discriminado, planejamento, execução e acompanhamento, em São Paulo e região.',
  h1: 'Você cria o projeto. A SPX cuida da execução.',
  lead: 'Projeto bom executado por quem não entende de projeto vira outra coisa. A SPX ' +
        'trabalha com escritórios de arquitetura executando o que foi desenhado, e apontando ' +
        'antes da obra começar, o que não vai caber.',
  trilha: [{ nome: 'Início', url: '/' }, { nome: 'Para arquitetos', url: '/para-arquitetos' }],
  schema: [schemaPerguntas([
    ['A SPX executa projeto desenvolvido por outro arquiteto?',
     'Sim. A SPX lê, compatibiliza e executa projeto de terceiros, devolvendo as divergências ' +
     'ao autor do projeto antes do início da obra.'],
    ['O arquiteto continua acompanhando a obra?',
     'Sim. O acompanhamento do autor do projeto é bem-vindo e a comunicação é direta com a ' +
     'engenharia da obra.'],
  ])],
  corpo: `
${secao('O que a SPX faz com o seu projeto', fluxoSerpente([
  { icone: 'leitura', n: '01', nome: 'Leitura',
    texto: 'Estudo do projeto e das intenções de detalhe, para entender o que não pode ser negociado no acabamento.' },
  { icone: 'compat', n: '02', nome: 'Compatibilização',
    texto: 'Cruzamento com estrutura, elétrica, hidráulica, climatização e incêndio. As divergências voltam para você antes de virarem improviso em campo.' },
  { icone: 'orcamento', n: '03', nome: 'Orçamento',
    texto: 'Proposta discriminada por serviço, com quantidade e critério de medição, então dá para comparar linha a linha.' },
  { icone: 'planejamento', n: '04', nome: 'Planejamento',
    texto: 'Cronograma físico-financeiro com o caminho crítico identificado e as entregas de fornecedor amarradas.' },
  { icone: 'execucao', n: '05', nome: 'Execução',
    texto: 'Equipe coordenada pela mesma engenharia que orçou, com responsável técnico nomeado.' },
  { icone: 'acompanha', n: '06', nome: 'Acompanhamento',
    texto: 'Visita do autor do projeto sempre bem-vinda, com relatório semanal e registro fotográfico entre uma visita e outra.' },
  { icone: 'entrega', n: '07', nome: 'Entrega',
    texto: 'Vistoria conjunta, pendências fechadas e as built do que foi construído.' },
]), 'claro')}

${secao('O que muda para o escritório', cartoesIcone([
  { icone: 'conversa', titulo: 'Interlocução única', texto: 'Em obra, em vez de coordenar cinco fornecedores.' },
  { icone: 'compat', titulo: 'Divergência identificada', texto: 'No papel, não na parede levantada.' },
  { icone: 'orcamento', titulo: 'Orçamento que defende você', texto: 'Item por item, alinhado com o cliente.' },
  { icone: 'projeto', titulo: 'O detalhe desenhado', texto: 'Chega até a entrega, porque tem engenheiro conferindo.' },
  { icone: 'art', titulo: 'Responsabilidade técnica', texto: 'Da execução, é da SPX.' },
], 3, cartaoChamada('Precisa de agilidade e segurança no projeto?',
  'Fale com um engenheiro da SPX sobre o seu.', 'Falar com a SPX')))}

${secao('Dúvidas de quem projeta', perguntas([
  ['A SPX executa projeto desenvolvido por outro arquiteto?',
   'Sim. A SPX lê, compatibiliza e executa projeto de terceiros, devolvendo as divergências ao ' +
   'autor do projeto antes do início da obra.'],
  ['Vocês alteram o meu projeto?',
   'Não sem falar com você. Quando alguma solução não é construtível ou conflita com norma, a ' +
   'alternativa é proposta ao autor do projeto, que decide.'],
  ['O escritório continua acompanhando a obra?',
   'Sim. A visita do autor é bem-vinda em qualquer etapa, e o relatório semanal mantém o ' +
   'acompanhamento entre uma visita e outra.'],
  ['Vocês indicam a SPX para o meu cliente ou eu contrato?',
   'As duas formas funcionam: a SPX pode ser contratada pelo cliente final com o escritório ' +
   'coordenando o projeto, ou diretamente pelo escritório.'],
]) + cartaoChamada('Ainda tem dúvida?', 'Fale diretamente com um engenheiro da SPX.',
  'Enviar pergunta', '/contato', 'conversa'), 'claro')}
`,
});

/* ---------------------------------------------------------------- dúvidas */
pagina({
  url: '/duvidas', arquivo: 'duvidas.html',
  fundo: 'lounge-recepcao',
  visual: 'pag-duvidas',
  title: 'Dúvidas frequentes sobre obras corporativas | SPX Engenharia',
  descricao: 'Respostas objetivas sobre o que a SPX Engenharia faz, como funciona a visita ' +
    'técnica, prazo, orçamento, obra em ambiente ocupado e responsabilidade técnica.',
  h1: 'Dúvidas frequentes.',
  h1b: 'Respondidas pela engenharia.',
  trilha: [{ nome: 'Início', url: '/' }, { nome: 'Dúvidas', url: '/duvidas' }],
  schema: [schemaPerguntas(duvidas), { '@type': 'QAPage', speakable: FALADO,
           about: { '@id': idEmpresa } }],
  corpo: `
<section class="sec wrap" data-reveal>
  <div class="meio-a-meio">
    <div class="resposta-direta">
      <h2>O que a SPX Engenharia faz?</h2>
      <p>${esc(empresa.definicao + ' ' + empresa.proposta)}</p>
      <p class="lead" style="margin-top:var(--e3)">As perguntas que mais chegam, respondidas de
      forma direta. Para obra com prazo crítico, concorrência ou adequação de norma, envie o
      contexto completo.</p>
    </div>
    ${cartaoVira(`
      <span class="vira-marca">
        <img src="/img/logo-negativa.webp" width="723" height="304" alt="" loading="lazy" decoding="async">
        <span class="vira-legenda">Engenharia · Gestão · Execução</span>
      </span>`, `
      <span class="vira-titulo">A SPX em três linhas</span>
      <ul class="marcas-fato">
        <li>${icone('local')}<span>Atua em São Paulo capital e na região metropolitana.</span></li>
        <li>${icone('execucao')}<span>Executa obra corporativa, comercial, retrofit, reforma, gerenciamento, manutenção, projeto e laudo.</span></li>
        <li>${icone('art')}<span>Cada obra tem engenheiro responsável nomeado, com ART, antes da assinatura do contrato.</span></li>
      </ul>`, 'Ver o que a SPX faz')}
  </div>
</section>
<section class="sec wrap faq-central">
  <div class="faq-topo">
    <h2>Perguntas e respostas</h2>
    <div class="faq-busca">
      <label for="faqBusca" class="so-leitor">Buscar nas perguntas</label>
      <svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="11" cy="11" r="6.5"/><path d="m16 16 4.5 4.5"/></svg>
      <input id="faqBusca" type="search" placeholder="Buscar por palavra: prazo, ocupado, ART…"
             autocomplete="off" data-faq-busca>
    </div>
    <p class="faq-vazio" data-faq-vazio hidden>Nenhuma pergunta com esse termo.
    <a href="/contato">Pergunte diretamente à equipe</a>.</p>
  </div>
  ${temas.map((t, i) => {
    const pares = t[1].map((q) => duvidas.find((d) => d[0] === q)).filter(Boolean);
    return `<div class="faq-tema" data-faq-tema>
    <h3><span class="faq-tema-n">${String(i + 1).padStart(2, '0')}</span>${esc(t[0])}</h3>
    <div class="faq-lista">${pares.map(([q, r], k) =>
      `<details class="q-item com-ico" data-faq-item><summary>${icone(ICO_DUVIDA[(i * 4 + k) % ICO_DUVIDA.length])}<span>${esc(q)}</span></summary><p>${esc(r)}</p></details>`).join('')}</div>
  </div>`;
  }).join('')}
</section>
${chamada(chamadas.orcamento)}`,
});

/* ---------------------------------------------------------------- atuação */
pagina({
  url: '/atuacao', arquivo: 'atuacao.html',
  fundo: 'restaurante-fachada',
  visual: 'pag-atuacao',
  title: 'Onde a SPX Engenharia atua | São Paulo e região metropolitana',
  descricao: 'Regiões atendidas pela SPX Engenharia: capital paulista e Grande São Paulo, ' +
    'com obra corporativa, comercial, retrofit e manutenção predial.',
  h1: 'Onde a SPX atua',
  lead: 'A base da SPX é São Paulo capital, e o atendimento cobre a cidade e a região ' +
        'metropolitana. Obra corporativa exige engenheiro em campo com frequência. Por isso o ' +
        'raio de atuação é definido pela distância que permite acompanhar de verdade, e não ' +
        'por marketing.',
  trilha: [{ nome: 'Início', url: '/' }, { nome: 'Onde atuamos', url: '/atuacao' }],
  corpo: `
<section class="sec wrap mapa-secao">
  <h2>Onde essas obras acontecem</h2>
  <div class="mapa-grid">
    <div class="mapa-arte" aria-hidden="true">
${mapaSVG()}
    </div>
    <div class="mapa-txt" data-reveal>
      <p class="lead">A maior parte do portfólio está na capital, nos polos corporativos e nos
      bairros de varejo de alto padrão.</p>
      ${Object.entries(regioes).map(([grupo, nomes]) => `
      <h3 class="mapa-grupo">${esc(grupo)}</h3>
      <ul class="grade-regioes">${lista(nomes)}</ul>`).join('')}
    </div>
  </div>
</section>
${secao('Não achou a sua região?', `<p class="lead">Obra fora dessa lista é avaliada caso a
caso, conforme porte e prazo. <a href="/servicos-e-regioes">Veja a lista completa de serviços
por região</a> ou fale com a equipe.</p>`)}
${chamada(chamadas.obra)}`,
});

/* ------------------------------------------- menu e rodapé na home também */
/* A home é escrita à mão, mas menu e rodapé saem daqui. Os marcadores
   <!--MENU--> e <!--RODAPE--> dizem onde costurar, para as três coisas nunca
   divergirem. O mesmo vale para as outras páginas escritas à mão. */
for (const arquivo of ['index.html', '404.html', 'servicos-e-regioes.html']) {
  if (!existsSync(arquivo)) continue;
  let html = readFileSync(arquivo, 'utf8');
  if (!html.includes('<!--MENU-->') && !html.includes('<!--RODAPE-->')) continue;
  const atual = arquivo === 'index.html' ? '/' : '/' + arquivo.replace('.html', '');
  html = html.replace(/<!--MENU-->[\s\S]*?<!--\/MENU-->/,
                      '<!--MENU-->\n' + menu(atual) + '\n<!--/MENU-->');
  html = html.replace(/<!--RODAPE-->[\s\S]*?<!--\/RODAPE-->/,
                      '<!--RODAPE-->\n' + rodape() + '\n<!--/RODAPE-->');
  /* a faixa dupla da marca também sai daqui: é a mesma peça da página de
     serviços, e escrever de novo à mão seria duas versões para divergir */
  html = html.replace(/<!--FAIXA-->[\s\S]*?<!--\/FAIXA-->/,
                      '<!--FAIXA-->\n' + faixaDupla() + '\n<!--/FAIXA-->');
  /* carimba a versão dos assets também aqui, senão a home continua pedindo a
     folha antiga e o navegador de quem já visitou serve a que está em cache */
  html = html.replace(/spx\.min\.css\?v=[a-z0-9]+/g, 'spx.min.css?v=' + VERSAO_CSS)
             .replace(/spx\.min\.js\?v=[a-z0-9]+/g, 'spx.min.js?v=' + VERSAO_JS);
  /* A home leva Organization, Person e WebSite. Não leva FAQPage: as perguntas
     dela são montadas pelo JavaScript, e o Google exige que o que está no
     schema esteja visível na página. As perguntas em /duvidas são estáticas e
     lá o FAQPage vale. */
  if (html.includes('<!--SCHEMA-->')) {
    const grafo = [schemaOrganizacao(), schemaPessoa(), {
      '@type': 'WebSite', '@id': SITE + '/#site', name: empresa.nome, url: SITE + '/',
      publisher: { '@id': idEmpresa }, inLanguage: 'pt-BR',
    }].filter(Boolean);
    html = html.replace(/<!--SCHEMA-->[\s\S]*?<!--\/SCHEMA-->/,
      '<!--SCHEMA-->\n<script type="application/ld+json">\n' +
      JSON.stringify({ '@context': 'https://schema.org', '@graph': grafo }, null, 1) +
      '\n</script>\n<!--/SCHEMA-->');
  }
  writeFileSync(arquivo, html);
  console.log('costurado menu e rodapé em', arquivo);
}

/* ---------------------------------------------------------------- contato */
/* o formulário mora na home; é lido de lá para não existirem duas versões */
const home = readFileSync('index.html', 'utf8');
const formulario = /<form class="form" id="formObra"[\s\S]*?<\/form>/.exec(home);
if (!formulario) throw new Error('não achei o formulário em index.html');

pagina({
  url: '/contato', arquivo: 'contato.html',
  /* sem foto no topo: a mesma foto já está atrás do formulário logo abaixo,
     e duas cópias da mesma imagem na primeira tela é uma a mais */
  title: `Contato e visita técnica | ${empresa.nome}`,
  descricao: 'Solicite a visita técnica da SPX Engenharia. Orçamento preliminar em até cinco ' +
    'dias úteis depois da visita ao local, em São Paulo e região.',
  h1: 'Envie o contexto da obra.',
  h1b: 'A SPX cuida do resto.',
  trilha: [{ nome: 'Início', url: '/' }, { nome: 'Contato', url: '/contato' }],
  schema: [{ '@type': 'ContactPage', name: 'Contato', mainEntity: { '@id': idEmpresa } }],
  corpo: `
<section class="sec wrap contato-bloco" data-adiar>
  <div class="cb-foto" aria-hidden="true">
    <img data-fonte="/img/banheiro-marmore-960.webp" width="${dim('banheiro-marmore')[0]}"
         height="${dim('banheiro-marmore')[1]}" alt="" loading="lazy" decoding="async">
  </div>
  <div class="contato-grid">
    <div data-reveal>
      <p class="lead">A avaliação é feita no local. Um engenheiro visita, mede e levanta as
      restrições do prédio; o orçamento preliminar sai em até cinco dias úteis depois disso.</p>
      <ul class="garantias">
        <li>${icone('visita')}<div><b>Visita técnica sem compromisso</b><span>Um engenheiro vai ao local antes de qualquer número.</span></div></li>
        <li>${icone('relogio')}<div><b>Orçamento em até cinco dias úteis</b><span>Contado a partir da visita, não do primeiro contato.</span></div></li>
        <li>${icone('sigilo')}<div><b>Sigilo sobre o que você enviar</b><span>As informações são usadas apenas para a avaliação técnica.</span></div></li>
      </ul>
      <h2>Canais diretos</h2>
      <ul class="canais">
        <li><a href="https://wa.me/${empresa.whatsapp}" rel="noopener"><b>WhatsApp</b><span>${esc(empresa.telefone.replace('+55 ', ''))}</span></a></li>
        <li><a href="tel:${empresa.telefone.replace(/\D/g, '')}"><b>Telefone</b><span>${esc(empresa.telefone.replace('+55 ', ''))}</span></a></li>
        <li><a href="mailto:${empresa.email}"><b>E-mail</b><span>${esc(empresa.email)}</span></a></li>
      </ul>
      <p class="form-nota">${esc(empresa.horario)}. Obra em andamento: atendimento conforme escopo contratado.</p>
    </div>
    <div data-reveal data-atraso="1">
      <h2 class="so-leitor">Formulário de visita técnica</h2>
      ${formulario[0]}
    </div>
  </div>
</section>

${faixaDupla('pequena')}`,
  visual: 'pag-contato',
});

/* ------------------------------------------------------------ privacidade */
const controlador = falta(empresa.razaoSocial) ? empresa.nome : empresa.razaoSocial;
if (falta(empresa.razaoSocial) || falta(empresa.cnpj)) {
  anota('Política de privacidade', 'razão social e CNPJ do controlador — a LGPD exige que o ' +
    'titular saiba exatamente qual pessoa jurídica trata os dados dele');
}
pagina({
  url: '/privacidade', arquivo: 'privacidade.html',
  fundo: 'lavabo-azul',
  title: `Política de privacidade | ${empresa.nome}`,
  descricao: 'Como a SPX Engenharia trata os dados enviados pelo site, para que servem, ' +
    'por quanto tempo ficam e como exercer os direitos previstos na LGPD.',
  h1: 'Política de privacidade',
  trilha: [{ nome: 'Início', url: '/' }, { nome: 'Privacidade', url: '/privacidade' }],
  corpo: `
<section class="sec wrap" data-reveal>
  <p class="lead">Esta política explica quais dados o site da ${esc(empresa.nome)} coleta, para
  que servem e o que você pode exigir sobre eles, conforme a Lei Geral de Proteção de Dados
  (Lei 13.709/2018).</p>
</section>

${secao('Quem trata os seus dados', `<p class="lead">O controlador dos dados é
  ${esc(controlador)}${falta(empresa.cnpj) ? '' : `, CNPJ ${esc(empresa.cnpj)}`}, com contato em
  <a href="mailto:${empresa.email}">${esc(empresa.email)}</a>.</p>`, 'claro')}

${secao('O que é coletado', `
  <p class="lead">Só o que você digita no formulário de visita técnica:</p>
  <ul class="marcada"><li>Nome</li><li>Empresa</li><li>E-mail</li><li>Telefone</li>
  <li>Tipo de obra, área aproximada e o contexto que você escrever</li></ul>
  <p class="lead">O site não usa cookie de rastreamento por padrão. Se a medição de audiência
  estiver ativada, ela é anônima e não identifica você individualmente.</p>`)}

${secao('Para que serve', `<ul class="marcada">
  <li>Responder ao seu contato e agendar a visita técnica</li>
  <li>Elaborar orçamento e proposta</li>
  <li>Manter o histórico da negociação</li></ul>
  <p class="lead">A base legal é o seu pedido de contato e o interesse legítimo em responder a
  ele. Os dados não são vendidos, alugados nem cedidos para terceiros com fim comercial.</p>`, 'claro')}

${secao('Com quem é compartilhado', `<p class="lead">Apenas com os prestadores necessários para
  o site funcionar: a hospedagem e o serviço de envio de e-mail. Nenhum deles usa esses dados
  para finalidade própria.</p>`)}

${secao('Por quanto tempo fica', `<p class="lead">Enquanto durar a negociação e pelo prazo em
  que a lei exigir a guarda de documento comercial e fiscal. Passado isso, os dados são
  eliminados.</p>`, 'claro')}

${secao('Os seus direitos', `
  <p class="lead">A LGPD garante a você, a qualquer momento:</p>
  <ul class="marcada"><li>Confirmar se tratamos dados seus e acessá-los</li>
  <li>Corrigir dado incompleto ou desatualizado</li>
  <li>Pedir anonimização, bloqueio ou eliminação</li>
  <li>Pedir a portabilidade</li>
  <li>Revogar o consentimento</li>
  <li>Saber com quem os dados foram compartilhados</li></ul>
  <p class="lead">Para exercer qualquer um deles, escreva para
  <a href="mailto:${empresa.email}">${esc(empresa.email)}</a>. A resposta é dada no prazo legal.</p>`)}

${secao('Segurança', `<p class="lead">O site trafega inteiramente em HTTPS. As credenciais dos
  serviços usados pelo formulário ficam em variáveis de ambiente do servidor, nunca no código
  publicado.</p>`, 'claro')}

${secao('Mudanças nesta política', `<p class="lead">Se ela mudar, a versão nova passa a valer
  a partir da publicação nesta mesma página.</p>`)}`,
  visual: 'pag-privacidade',
});

/* ------------------------------------------------- sitemap, robots, llms */
const todas = [
  { url: '/', prioridade: '1.0', frequencia: 'weekly' },
  ...paginas.filter((p) => p.url !== '/privacidade')
            .map((p) => ({ url: p.url, prioridade: p.url.includes('/') && p.url.split('/').length > 2 ? '0.7' : '0.8',
                           frequencia: 'monthly' })),
  { url: '/privacidade', prioridade: '0.2', frequencia: 'yearly' },
  { url: '/servicos-e-regioes', prioridade: '0.5', frequencia: 'monthly' },
];
const hoje = new Date().toISOString().slice(0, 10);
writeFileSync('sitemap.xml',
  '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' +
  todas.map(({ url, prioridade, frequencia }) =>
    `  <url>\n    <loc>${SITE}${url}</loc>\n    <lastmod>${hoje}</lastmod>\n` +
    `    <changefreq>${frequencia}</changefreq>\n    <priority>${prioridade}</priority>\n  </url>`
  ).join('\n') + '\n</urlset>\n');

writeFileSync('robots.txt',
  'User-agent: *\nAllow: /\n\n# a página de erro não deve entrar no índice\nDisallow: /404\n\n' +
  `Sitemap: ${SITE}/sitemap.xml\n`);

/* llms.txt: um resumo em texto puro para os robôs de IA lerem sem interpretar HTML */
writeFileSync('llms.txt',
`# ${empresa.nome}

> ${empresa.definicao}

${empresa.proposta}

## Identificação
- Empresa: ${empresa.nome}
- Segmento: ${empresa.segmento}
- Base: ${empresa.base}
- Área de atuação: ${empresa.atuacao}
- Telefone: ${empresa.telefone}
- E-mail: ${empresa.email}
- Site: ${SITE}/
${falta(responsavel.nome) ? '' : `- Responsável técnico: ${responsavel.nome}\n`}
## Serviços
${servicos.map((s) => `### ${s.nome}
${s.pergunta ? `**${s.pergunta}** ${s.resposta}` : s.resumo}
${(s.fatos || []).map((f) => `- ${f}`).join('\n')}
Página: ${SITE}/servicos/${s.slug}
Executa: ${s.executa.join('; ')}.`).join('\n\n')}

## Como a SPX conduz uma obra
${processo.map((e) => `${Number(e.n)}. ${e.nome}: ${e.texto}`).join('\n')}

## Regiões atendidas
${Object.entries(regioes).map(([g, n]) => `- ${g}: ${n.join(', ')}`).join('\n')}

## Páginas
${todas.map((p) => `- ${SITE}${p.url}`).join('\n')}

## Perguntas frequentes
${duvidas.map(([p, r]) => `### ${p}\n${r}`).join('\n\n')}
`);

/* --------------------------------------------------------------- relatório */
console.log(`\n${paginas.length + 1} páginas geradas:`);
paginas.forEach((p) => console.log('  ', p.url.padEnd(34), p.arquivo));
console.log('   sitemap.xml, robots.txt, llms.txt');

const faltantes = [...pendencias];
if (faltantes.length) {
  console.log(`\n${faltantes.length} informações ainda faltam. Nada disso foi inventado —`);
  console.log('está fora das páginas até ser preenchido em conteudo/dados.mjs:\n');
  faltantes.forEach((p, i) => console.log(`  ${String(i + 1).padStart(2)}. ${p}`));
} else {
  console.log('\nNenhuma pendência: todos os campos estão preenchidos.');
}
