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
 * página e entra no relatório do fim. Inventar dado de obra, CREA ou CNPJ é o
 * tipo de erro que custa contrato.
 */
import { mkdirSync, writeFileSync, readFileSync, existsSync } from 'node:fs';
import { dirname } from 'node:path';
import { empresa, responsavel, numeros, processo, servicos, projetos,
         duvidas, chamadas, regioes, falta } from './conteudo/dados.mjs';

const SITE = empresa.dominio.replace(/\/+$/, '');
const VERSAO = 'v=7';
const pendencias = new Set();   /* o mesmo bloco repete em toda página; conta uma vez */
const paginas = [];

const anota = (onde, oque) => pendencias.add(`${onde}: ${oque}`);
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
      <img class="marca so-escuro" src="/img/logo-spx.webp" width="300" height="72" alt="" aria-hidden="true"><img class="marca so-claro" src="/img/logo-spx-negativa.webp" width="300" height="72" alt="" aria-hidden="true">
    </a>
    ${MENU.map(item).join('\n    ')}
    <a href="/contato" class="cta">Visita técnica</a>
    <button class="nav-btn" type="button" data-acao="tema" aria-label="Alternar tema">
      <svg viewBox="0 0 24 24" class="sol" aria-hidden="true"><circle cx="12" cy="12" r="4.2"/><path d="M12 2.5v2M12 19.5v2M2.5 12h2M19.5 12h2M5.1 5.1l1.4 1.4M17.5 17.5l1.4 1.4M18.9 5.1l-1.4 1.4M6.5 17.5l-1.4 1.4"/></svg>
      <svg viewBox="0 0 24 24" class="lua" aria-hidden="true"><path d="M20 14.5A8.5 8.5 0 0 1 9.5 4a8.5 8.5 0 1 0 10.5 10.5Z"/></svg>
    </button>
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
  if (!falta(responsavel.crea)) selo.push(esc(responsavel.crea));
  else anota('Rodapé', 'número do CREA do responsável técnico');
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
  </div>

  <div class="wordmark" id="wordmark" aria-hidden="true">
    <img class="wm base so-escuro" src="/img/logo-negativa.webp" width="723" height="304" alt="" loading="lazy" decoding="async">
    <img class="wm luz so-escuro" src="/img/logo-negativa.webp" width="723" height="304" alt="" loading="lazy" decoding="async">
    <img class="wm base so-claro" src="/img/logo.webp" width="723" height="304" alt="" loading="lazy" decoding="async">
    <img class="wm luz so-claro" src="/img/logo.webp" width="723" height="304" alt="" loading="lazy" decoding="async">
  </div>

  <div class="rod-fim">
    <span>${selo.join(' · ')}</span>
    <span style="display:flex;gap:20px;flex-wrap:wrap"><a href="/privacidade">Privacidade</a><a href="/duvidas">Dúvidas</a><a href="/contato">Contato</a></span>
  </div>
</footer>`;
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
  if (!falta(responsavel.crea)) {
    p.hasCredential = { '@type': 'EducationalOccupationalCredential',
                        credentialCategory: 'Registro profissional', name: responsavel.crea };
  }
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

const schemaTrilha = (trilha) => ({
  '@type': 'BreadcrumbList',
  itemListElement: trilha.map((t, i) => ({ '@type': 'ListItem', position: i + 1,
    name: t.nome, item: SITE + t.url })),
});

/* --------------------------------------------------------------- moldura */
function pagina({ url, arquivo, title, descricao, h1, trilha = [], corpo, schema = [] }) {
  const grafo = [schemaOrganizacao(), ...schema].filter(Boolean);
  if (trilha.length > 1) grafo.push(schemaTrilha(trilha));
  const migalhas = trilha.length > 1
    ? `<nav class="migalhas wrap" aria-label="Você está em">${trilha.map((t, i) =>
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
<link rel="stylesheet" href="/assets/css/spx.min.css?${VERSAO}">
<script>
/* aplica o tema antes da pintura para não piscar */
(function(){try{var t=localStorage.getItem('spx-tema')||'escuro';document.documentElement.setAttribute('data-tema',t);}catch(e){}})();
</script>
<script type="application/ld+json">
${JSON.stringify({ '@context': 'https://schema.org', '@graph': grafo }, null, 1)}
</script>
</head>
<body>
<a class="pular" href="#conteudo">Pular para o conteúdo</a>
<div class="hatch" aria-hidden="true"></div>
${menu(trilha[1] ? trilha[1].url : url)}
<main id="conteudo">
${migalhas}
<header class="sec wrap topo-interno">
  <h1>${esc(h1)}</h1>
</header>
${corpo}
</main>
${rodape()}
<script src="/assets/js/spx.min.js?${VERSAO}" defer></script>
</body>
</html>
`;
  mkdirSync(dirname(arquivo), { recursive: true });
  writeFileSync(arquivo, html);
  paginas.push({ url, arquivo });
  return html;
}

/* blocos reaproveitados nas páginas */
const secao = (titulo, dentro, classe = '') =>
  `<section class="sec wrap ${classe}"><h2>${esc(titulo)}</h2>${dentro}</section>`;

const chamada = (texto, rotulo = 'Solicitar visita técnica') =>
  `<section class="sec wrap cta-faixa" data-reveal>
  <p class="cta-frase">${esc(texto)}</p>
  <a class="btn btn-acc" href="/contato">${esc(rotulo)} ↗</a>
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
    schema: [schemaServico(s), schemaPerguntas(s.faq)],
    corpo: `
<section class="sec wrap" data-reveal>
  <p class="lead">${esc(s.oQueE)}</p>
</section>

${secao('Para quem é', `<ul class="marcada">${lista(s.paraQuem)}</ul>`, 'claro')}

${secao('O que a SPX executa', `<ul class="grade-servicos">${lista(s.executa)}</ul>`)}

${secao('Como funciona', `<ol class="etapas">${processo.map((e) =>
  `<li><span class="etapa-n">${e.n}</span><b>${esc(e.nome)}</b><p>${esc(e.texto)}</p></li>`).join('')}</ol>`, 'claro')}

${secao('Diferenciais', `<ul class="marcada">${lista(s.diferenciais)}</ul>`)}

${secao('Dúvidas sobre ' + s.nome.toLowerCase(), perguntas(s.faq), 'claro')}

${secao('Outros serviços', `<ul class="grade-servicos">${relacionados.map((o) =>
  `<li><a href="/servicos/${o.slug}"><b>${esc(o.nome)}</b><span>${esc(o.resumo)}</span></a></li>`).join('')}</ul>`)}

${chamada(s.cta)}`,
  });
}

/* ------------------------------------------------------- índice de serviços */
pagina({
  url: '/servicos', arquivo: 'servicos.html',
  title: 'Serviços de engenharia e execução de obras | SPX Engenharia',
  descricao: 'Obras corporativas e comerciais, retrofit, reformas, gerenciamento, manutenção, ' +
    'projetos e laudos. Engenharia, gestão e execução pela mesma equipe, em São Paulo e região.',
  h1: 'Serviços de engenharia, gestão e execução',
  trilha: [{ nome: 'Início', url: '/' }, { nome: 'Serviços', url: '/servicos' }],
  corpo: `
<section class="sec wrap" data-reveal>
  <p class="lead">${esc(empresa.proposta)} A SPX não vende mão de obra: vende a engenharia que
  decide o que fazer, a gestão que mantém o prazo e a execução que entrega.</p>
</section>

${secao('O que a SPX faz', `<ul class="grade-servicos grande">${servicosPublicaveis.map((s) =>
  `<li><a href="/servicos/${s.slug}"><b>${esc(s.nome)}</b><span>${esc(s.resumo)}</span></a></li>`).join('')}</ul>`)}

${secao('Como trabalhamos', `<ol class="etapas">${processo.map((e) =>
  `<li><span class="etapa-n">${e.n}</span><b>${esc(e.nome)}</b><p>${esc(e.texto)}</p></li>`).join('')}</ol>`, 'claro')}

${chamada(chamadas.orcamento)}`,
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
    sizes="(max-width:700px) 100vw, 33vw" alt="${esc(p.nome)} — ${esc(falta(p.tipo) ? 'obra' : p.tipo.toLowerCase())} executada pela SPX Engenharia ${esc(p.regiao)}, São Paulo"
    loading="lazy" decoding="async" width="960" height="1363">`).join('')}</div>`)}
${chamada(chamadas.projeto)}`,
  });
}

/* --------------------------------------------------------- índice de obras */
pagina({
  url: '/obras', arquivo: 'obras.html',
  title: 'Projetos realizados | SPX Engenharia',
  descricao: 'Obras corporativas e comerciais executadas pela SPX Engenharia em São Paulo: ' +
    'Avenida Paulista, Jardins e Brooklin.',
  h1: 'Projetos realizados',
  trilha: [{ nome: 'Início', url: '/' }, { nome: 'Projetos', url: '/obras' }],
  corpo: `
<section class="sec wrap" data-reveal>
  <p class="lead">Obras conduzidas pela SPX em São Paulo, com a atuação da engenharia
  descrita em cada uma.</p>
</section>
${projetosPublicaveis.length
  ? secao('Obras', `<ul class="grade-obras">${projetosPublicaveis.map((p) =>
      `<li><a href="/obras/${p.slug}"><b>${esc(p.nome)}</b><span>${esc(p.regiao)} · ${esc(p.atuacao)}</span></a></li>`).join('')}</ul>`)
  : secao('Obras', '<p class="lead">As páginas de projeto entram no ar assim que o escopo e as fotos de cada obra forem confirmados.</p>')}
${chamada(chamadas.projeto)}`,
});

/* ------------------------------------------------------------------ sobre */
const blocoResponsavel = () => {
  if (falta(responsavel.nome)) {
    anota('Página /sobre', 'seção do responsável técnico inteira — nome, formação, CREA, ' +
      'especialidades, resumo e foto. É o que sustenta a autoridade técnica do site.');
    return '';
  }
  const linhas = [['Formação', responsavel.formacao], ['Registro', responsavel.crea],
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
  const linhas = [['Empresa', empresa.nome], ['Razão social', empresa.razaoSocial],
                  ['CNPJ', empresa.cnpj], ['Segmento', empresa.segmento],
                  ['Base', empresa.base], ['Área de atuação', empresa.atuacao],
                  ['Endereço', empresa.endereco],
                  ['Responsável técnico', responsavel.nome], ['Registro', responsavel.crea],
                  ['Telefone', empresa.telefone], ['E-mail', empresa.email],
                  ['Atendimento', empresa.horario]].filter(([, v]) => !falta(v));
  return `<dl class="ficha-obra ficha-larga">${linhas.map(([r, v]) =>
    `<div><dt>${esc(r)}</dt><dd>${esc(v)}</dd></div>`).join('')}</dl>`;
};

const numerosValidados = numeros.filter((n) => {
  if (!n.validado) anota(`Número "${n.rotulo}"`, n.nota + ' Fora do site até confirmar.');
  return n.validado;
});

pagina({
  url: '/sobre', arquivo: 'sobre.html',
  title: `Sobre a ${empresa.nome} | Engenharia de obras corporativas em São Paulo`,
  descricao: `${empresa.definicao} Quem somos, como trabalhamos, área de atuação e responsabilidade técnica.`,
  h1: `Sobre a ${empresa.nome}`,
  trilha: [{ nome: 'Início', url: '/' }, { nome: 'Sobre', url: '/sobre' }],
  schema: [schemaPessoa(), { '@type': 'AboutPage', name: `Sobre a ${empresa.nome}`,
                             mainEntity: { '@id': idEmpresa } }].filter(Boolean),
  corpo: `
<section class="sec wrap" data-reveal>
  <p class="lead">${esc(empresa.definicao)} ${esc(empresa.proposta)}</p>
</section>

${secao('Posicionamento', `
  <p class="lead">Engenharia, gestão e execução são três coisas diferentes, e a maioria dos
  problemas de obra nasce quando estão em mãos diferentes. Na SPX estão na mesma: quem levanta
  é quem orça, quem orça é quem planeja, quem planeja é quem executa e responde.</p>
  <ul class="marcada"><li><b>Engenharia</b> — o que fazer, como fazer e o que a norma exige</li>
  <li><b>Gestão</b> — cronograma, coordenação, medição e controle de desvio</li>
  <li><b>Execução</b> — equipe em campo, com responsável técnico nomeado</li></ul>`, 'claro')}

${numerosValidados.length ? secao('A SPX em números',
  `<div class="numeros-grade">${numerosValidados.map((n) =>
    `<div><b data-conta="${n.valor}"${n.prefixo ? ` data-prefixo="${n.prefixo}"` : ''}${n.sufixo ? ` data-sufixo="${n.sufixo}"` : ''}>${n.prefixo || ''}${n.valor}${n.sufixo || ''}</b><span>${esc(n.rotulo)}</span></div>`).join('')}</div>`) : ''}

${blocoResponsavel()}

${secao('Como trabalhamos', `<ol class="etapas">${processo.map((e) =>
  `<li><span class="etapa-n">${e.n}</span><b>${esc(e.nome)}</b><p>${esc(e.texto)}</p></li>`).join('')}</ol>`)}

${secao('O que executamos', `<ul class="grade-servicos">${servicos.map((s) =>
  `<li><a href="/servicos/${s.slug}"><b>${esc(s.nome)}</b><span>${esc(s.resumo)}</span></a></li>`).join('')}</ul>`, 'claro')}

${secao('Dados institucionais', dadosInstitucionais())}

${chamada(chamadas.obra)}`,
});

/* -------------------------------------------------------- para arquitetos */
pagina({
  url: '/para-arquitetos', arquivo: 'para-arquitetos.html',
  title: 'Execução de projeto para arquitetos em São Paulo | SPX Engenharia',
  descricao: 'A SPX executa o projeto do arquiteto: leitura, compatibilização, orçamento ' +
    'discriminado, planejamento, execução e acompanhamento, em São Paulo e região.',
  h1: 'Você cria o projeto. A SPX cuida da execução.',
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
<section class="sec wrap" data-reveal>
  <p class="lead">Projeto bom executado por quem não entende de projeto vira outra coisa. A SPX
  trabalha com escritórios de arquitetura executando o que foi desenhado — e apontando, antes
  da obra começar, o que não vai caber.</p>
</section>

${secao('O que a SPX faz com o seu projeto', `<ol class="etapas">
  <li><span class="etapa-n">01</span><b>Leitura</b><p>Estudo do projeto e das intenções de
  detalhe, para entender o que não pode ser negociado no acabamento.</p></li>
  <li><span class="etapa-n">02</span><b>Compatibilização</b><p>Cruzamento com estrutura,
  elétrica, hidráulica, climatização e incêndio. As divergências voltam para você antes de
  virarem improviso em campo.</p></li>
  <li><span class="etapa-n">03</span><b>Orçamento</b><p>Proposta discriminada por serviço, com
  quantidade e critério de medição — dá para comparar linha a linha.</p></li>
  <li><span class="etapa-n">04</span><b>Planejamento</b><p>Cronograma físico-financeiro com o
  caminho crítico identificado e as entregas de fornecedor amarradas.</p></li>
  <li><span class="etapa-n">05</span><b>Execução</b><p>Equipe coordenada pela mesma engenharia
  que orçou, com responsável técnico nomeado.</p></li>
  <li><span class="etapa-n">06</span><b>Acompanhamento</b><p>Visita do autor do projeto sempre
  bem-vinda, com relatório semanal e registro fotográfico entre uma visita e outra.</p></li>
  <li><span class="etapa-n">07</span><b>Entrega</b><p>Vistoria conjunta, pendências fechadas e
  as built do que foi construído.</p></li>
</ol>`, 'claro')}

${secao('O que muda para o escritório', `<ul class="marcada">
  <li>Interlocução única em obra, em vez de coordenar cinco fornecedores</li>
  <li>Divergência de projeto identificada no papel, não na parede levantada</li>
  <li>Orçamento que dá para defender junto ao cliente, item por item</li>
  <li>O detalhe desenhado chega até a entrega, porque tem engenheiro conferindo</li>
  <li>Responsabilidade técnica da execução é da SPX</li></ul>`)}

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
]), 'claro')}

${chamada(chamadas.arquiteto, 'Falar sobre um projeto')}`,
});

/* ---------------------------------------------------------------- dúvidas */
pagina({
  url: '/duvidas', arquivo: 'duvidas.html',
  title: 'Dúvidas frequentes sobre obras corporativas | SPX Engenharia',
  descricao: 'Respostas objetivas sobre o que a SPX Engenharia faz, como funciona a visita ' +
    'técnica, prazo, orçamento, obra em ambiente ocupado e responsabilidade técnica.',
  h1: 'Dúvidas frequentes',
  trilha: [{ nome: 'Início', url: '/' }, { nome: 'Dúvidas', url: '/duvidas' }],
  schema: [schemaPerguntas(duvidas)],
  corpo: `
<section class="sec wrap" data-reveal>
  <p class="lead">As perguntas que mais chegam, respondidas de forma direta. Para obra com
  prazo crítico, concorrência ou adequação de norma, envie o contexto completo.</p>
</section>
${secao('Perguntas e respostas', perguntas(duvidas))}
${chamada(chamadas.orcamento)}`,
});

/* ---------------------------------------------------------------- atuação */
pagina({
  url: '/atuacao', arquivo: 'atuacao.html',
  title: 'Onde a SPX Engenharia atua | São Paulo e região metropolitana',
  descricao: 'Regiões atendidas pela SPX Engenharia: capital paulista e Grande São Paulo, ' +
    'com obra corporativa, comercial, retrofit e manutenção predial.',
  h1: 'Onde a SPX atua',
  trilha: [{ nome: 'Início', url: '/' }, { nome: 'Onde atuamos', url: '/atuacao' }],
  corpo: `
<section class="sec wrap" data-reveal>
  <p class="lead">A base da SPX é São Paulo capital, e o atendimento cobre a cidade e a região
  metropolitana. Obra corporativa exige engenheiro em campo com frequência — por isso o raio de
  atuação é definido pela distância que permite acompanhar de verdade, e não por marketing.</p>
</section>
${Object.entries(regioes).map(([grupo, nomes], i) =>
  secao(grupo, `<ul class="grade-regioes">${lista(nomes)}</ul>`, i % 2 ? 'claro' : '')).join('\n')}
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
  title: `Contato e visita técnica | ${empresa.nome}`,
  descricao: 'Solicite a visita técnica da SPX Engenharia. Orçamento preliminar em até cinco ' +
    'dias úteis depois da visita ao local, em São Paulo e região.',
  h1: 'Envie o contexto da obra',
  trilha: [{ nome: 'Início', url: '/' }, { nome: 'Contato', url: '/contato' }],
  schema: [{ '@type': 'ContactPage', name: 'Contato', mainEntity: { '@id': idEmpresa } }],
  corpo: `
<section class="sec wrap" data-reveal>
  <p class="lead">A avaliação é feita no local. Um engenheiro visita, mede e levanta as
  restrições do prédio; o orçamento preliminar sai em até cinco dias úteis depois disso.</p>
</section>

<section class="sec wrap">
  <div class="contato-grid">
    <div data-reveal>
      <h2 class="so-leitor">Formulário de visita técnica</h2>
      ${formulario[0]}
    </div>
    <aside data-reveal data-atraso="1">
      <h2>Canais diretos</h2>
      <ul class="canais">
        <li><a href="https://wa.me/${empresa.whatsapp}" rel="noopener"><b>WhatsApp</b><span>${esc(empresa.telefone.replace('+55 ', ''))}</span></a></li>
        <li><a href="tel:${empresa.telefone.replace(/\D/g, '')}"><b>Telefone</b><span>${esc(empresa.telefone.replace('+55 ', ''))}</span></a></li>
        <li><a href="mailto:${empresa.email}"><b>E-mail</b><span>${esc(empresa.email)}</span></a></li>
      </ul>
      <p class="form-nota">${esc(empresa.horario)}. Obra em andamento: atendimento conforme escopo contratado.</p>
    </aside>
  </div>
</section>`,
});

/* ------------------------------------------------------------ privacidade */
const controlador = falta(empresa.razaoSocial) ? empresa.nome : empresa.razaoSocial;
if (falta(empresa.razaoSocial) || falta(empresa.cnpj)) {
  anota('Política de privacidade', 'razão social e CNPJ do controlador — a LGPD exige que o ' +
    'titular saiba exatamente qual pessoa jurídica trata os dados dele');
}
pagina({
  url: '/privacidade', arquivo: 'privacidade.html',
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
${falta(responsavel.nome) ? '' : `- Responsável técnico: ${responsavel.nome}${falta(responsavel.crea) ? '' : ` (${responsavel.crea})`}\n`}
## Serviços
${servicos.map((s) => `- [${s.nome}](${SITE}/servicos/${s.slug}): ${s.resumo}`).join('\n')}

## Como a SPX conduz uma obra
${processo.map((e) => `${Number(e.n)}. ${e.nome} — ${e.texto}`).join('\n')}

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
