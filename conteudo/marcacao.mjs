/**
 * Tradutor de Markdown para HTML — só o que um artigo de obra precisa.
 *
 * POR QUE ESCRITO À MÃO
 *
 * O projeto tem uma dependência só (esbuild) e tudo o mais é legível de ponta a
 * ponta. Um tradutor completo de Markdown resolveria casos que este site nunca
 * vai ter — tabela aninhada, HTML cru, nota de rodapé — e traria milhares de
 * linhas que ninguém aqui vai ler. Este cobre o que se escreve de fato:
 * títulos, parágrafos, negrito, itálico, listas, links, imagens, citação e
 * linha divisória.
 *
 * O QUE ELE NÃO FAZ, DE PROPÓSITO
 *
 * Não aceita HTML cru no meio do texto. Um artigo é conteúdo, não código: se
 * uma tag passasse daqui para a página, qualquer coisa colada de um editor
 * traria junto estilo quebrado — ou pior. Tudo que entra é escapado primeiro e
 * só a marcação reconhecida vira tag.
 */

const ESCAPA = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' };
const esc = (t) => String(t).replace(/[&<>"']/g, (c) => ESCAPA[c]);

/* Endereço de link e de imagem passa por um filtro próprio: `javascript:` num
   href é a forma mais velha de transformar texto em código executado. */
const endereco = (u) => {
  const limpo = String(u).trim();
  return /^(https?:\/\/|\/|mailto:|tel:|#)/i.test(limpo) ? esc(limpo) : '#';
};

/* Marcação dentro de uma linha. A ordem importa: o código cru vem primeiro e
   sai da frente, senão um asterisco dentro dele viraria negrito. */
function linha(t) {
  const guardados = [];
  let s = esc(t).replace(/`([^`]+)`/g, (_, c) => {
    guardados.push(`<code>${c}</code>`);
    return `\u0000${guardados.length - 1}\u0000`;
  });
  s = s
    .replace(/!\[([^\]]*)\]\(([^)\s]+)\)/g, (_, alt, u) =>
      `<img src="${endereco(u)}" alt="${alt}" loading="lazy" decoding="async">`)
    .replace(/\[([^\]]+)\]\(([^)\s]+)\)/g, (_, txt, u) =>
      `<a href="${endereco(u)}">${txt}</a>`)
    .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
    .replace(/(^|[^*])\*([^*\n]+)\*/g, '$1<em>$2</em>');
  return s.replace(/\u0000(\d+)\u0000/g, (_, i) => guardados[i]);
}

/* ------------------------------------------------------- blocos cercados */
/* Um artigo às vezes precisa de mais que parágrafo: uma lista que a pessoa
   marca, um bloco de perguntas. A tentação é colar o HTML pronto dentro do
   texto — e é exatamente o que este tradutor existe para impedir. Em vez
   disso, o .md descreve o CONTEÚDO numa cerca e o gerador desenha a peça.
   Nada que venha do texto vira tag; tudo continua escapado. */

/* Lista para marcar, com placar. O comportamento mora no spx.js, como o resto
   do site: nenhum onclick no meio do texto. */
function checklist(linhas) {
  const grupos = [];
  for (const l of linhas) {
    const g = l.match(/^#\s+(.*)$/);
    if (g) { grupos.push({ nome: g[1], itens: [] }); continue; }
    const it = l.match(/^\s*[-*+]\s+(.*)$/);
    if (it && grupos.length) grupos[grupos.length - 1].itens.push(it[1]);
  }
  const total = grupos.reduce((n, g) => n + g.itens.length, 0);
  if (!total) return '';
  const corpo = grupos.map((g) => `<fieldset class="chk-grupo">
      <legend>${linha(g.nome)}</legend>
      ${g.itens.map((t) =>
        `<label class="chk-item"><input type="checkbox"><span>${linha(t)}</span></label>`).join('\n      ')}
    </fieldset>`).join('\n    ');
  return `<div class="chk" data-checklist data-total="${total}">
    ${corpo}
    <div class="chk-placar">
      <progress class="chk-barra" max="${total}" value="0"></progress>
      <p class="chk-conta" role="status">0 de ${total} itens</p>
    </div>
  </div>`;
}

/* Perguntas e respostas dentro do artigo. Além de virar texto na página, elas
   saem daqui numa lista para o gerador marcar como FAQPage. */
function perguntas(linhas, coleta) {
  const pares = [];
  for (const l of linhas) {
    const p = l.match(/^#\s+(.*)$/);
    if (p) { pares.push([p[1], []]); continue; }
    if (l.trim() && pares.length) pares[pares.length - 1][1].push(l.trim());
  }
  const prontos = pares.map(([p, r]) => [p, r.join(' ')]).filter(([, r]) => r);
  if (!prontos.length) return '';
  coleta.perguntas = (coleta.perguntas || []).concat(prontos);
  return `<div class="art-perguntas">
    ${prontos.map(([p, r]) => `<div class="art-pergunta">
      <h3 id="${ancora(p)}">${linha(p)}</h3>
      <p>${linha(r)}</p>
    </div>`).join('\n    ')}
  </div>`;
}

/* Sequência de etapas que dependem uma da outra. É uma lista ordenada de
   verdade — quem usa leitor de tela ouve "1 de 4", que é exatamente a
   informação do desenho. As setas são forma em CSS, sem texto: seta que o
   leitor de tela lê em voz alta no meio da frase atrapalha mais que ajuda. */
function fluxo(linhas) {
  const passos = linhas
    .map((l) => (l.match(/^\s*[-*+]\s+(.*)$/) || [])[1])
    .filter(Boolean);
  if (passos.length < 2) return '';
  return `<ol class="art-fluxo">
    ${passos.map((t) => `<li class="art-fluxo-passo"><span>${linha(t)}</span></li>`).join('\n    ')}
  </ol>`;
}

/* A conta de quando pedir o material. Nasce escondida e o spx.js revela: sem
   JavaScript ela não calcula nada, e formulário que não responde é pior que
   formulário nenhum. Os números são de quem lê — nada sai do navegador. */
function prazo() {
  return `<div class="prazo" data-prazo hidden>
    <h3 class="prazo-tit">Até quando dá para pedir?</h3>
    <p class="prazo-ajuda">A data em que o material precisa estar na obra, menos o prazo
      que o fornecedor deu. O que sobra é o seu limite para fechar o pedido.</p>
    <div class="prazo-campos">
      <p class="prazo-campo">
        <label for="prazo-data">O material precisa estar na obra em</label>
        <input id="prazo-data" type="date" data-prazo-data>
      </p>
      <p class="prazo-campo">
        <label for="prazo-dias">Prazo do fornecedor</label>
        <span class="prazo-dupla">
          <input id="prazo-dias" type="number" min="1" max="365" step="1" inputmode="numeric"
                 placeholder="30" data-prazo-dias>
          <select aria-label="Contagem do prazo do fornecedor" data-prazo-tipo>
            <option value="uteis">dias úteis</option>
            <option value="corridos">dias corridos</option>
          </select>
        </span>
      </p>
      <p class="prazo-campo">
        <label for="prazo-folga">Folga que você quer ter</label>
        <span class="prazo-dupla">
          <input id="prazo-folga" type="number" min="0" max="90" step="1" inputmode="numeric"
                 value="5" data-prazo-folga>
          <span class="prazo-unidade">dias úteis</span>
        </span>
      </p>
    </div>
    <p class="prazo-saida" role="status" data-prazo-saida>Preencha os dois campos acima.</p>
    <p class="prazo-nota">A conta pula sábado e domingo. Feriado não — confira o calendário
      da obra antes de fechar a data.</p>
  </div>`;
}

/**
 * Markdown → HTML.
 *
 * `coleta` é preenchido com o que o gerador precisa saber do texto além do
 * HTML — hoje só as perguntas, para a marcação de FAQ.
 *
 * `pecas` traz o que depende do site e não cabe aqui: `pecas.foto(arq, legenda)`
 * desenha uma foto com as medidas e a descrição que moram no gerador. Sem ele,
 * o bloco :::foto não rende nada — este arquivo não sabe o que é uma obra.
 */
export function marcacao(texto, coleta = {}, pecas = {}) {
  const linhas = String(texto).replace(/\r\n?/g, '\n').split('\n');
  const saida = [];
  let i = 0;

  const lista = (ordenada) => {
    const marca = ordenada ? /^\s*\d+[.)]\s+(.*)$/ : /^\s*[-*+]\s+(.*)$/;
    const itens = [];
    while (i < linhas.length && marca.test(linhas[i])) {
      itens.push(`<li>${linha(linhas[i].match(marca)[1])}</li>`);
      i++;
    }
    const tag = ordenada ? 'ol' : 'ul';
    saida.push(`<${tag} class="art-lista">${itens.join('')}</${tag}>`);
  };

  while (i < linhas.length) {
    const l = linhas[i];

    if (!l.trim()) { i++; continue; }

    const cerca = l.match(/^:::(checklist|perguntas|fluxo|prazo|foto)(?:\s+(\S+))?\s*$/);
    if (cerca) {
      const dentro = [];
      i++;
      while (i < linhas.length && !/^:::\s*$/.test(linhas[i])) { dentro.push(linhas[i]); i++; }
      i++;                                     /* a linha que fecha a cerca */
      const legenda = dentro.join(' ').trim();
      saida.push(
        cerca[1] === 'checklist' ? checklist(dentro)
        : cerca[1] === 'perguntas' ? perguntas(dentro, coleta)
        : cerca[1] === 'fluxo' ? fluxo(dentro)
        : cerca[1] === 'prazo' ? prazo()
        : pecas.foto ? pecas.foto(cerca[2] || '', legenda) : '');
      continue;
    }

    const titulo = l.match(/^(#{2,4})\s+(.*)$/);
    if (titulo) {
      const n = titulo[1].length;                    /* ## vira h2, ### vira h3 */
      saida.push(`<h${n} id="${ancora(titulo[2])}">${linha(titulo[2])}</h${n}>`);
      i++; continue;
    }

    if (/^\s*(---|\*\*\*|___)\s*$/.test(l)) { saida.push('<hr>'); i++; continue; }

    if (/^\s*>\s?/.test(l)) {
      const partes = [];
      while (i < linhas.length && /^\s*>\s?/.test(linhas[i])) {
        partes.push(linhas[i].replace(/^\s*>\s?/, '')); i++;
      }
      saida.push(`<blockquote class="art-citacao"><p>${linha(partes.join(' '))}</p></blockquote>`);
      continue;
    }

    if (/^\s*[-*+]\s+/.test(l))    { lista(false); continue; }
    if (/^\s*\d+[.)]\s+/.test(l))  { lista(true);  continue; }

    /* parágrafo: junta até a linha em branco */
    const partes = [];
    while (i < linhas.length && linhas[i].trim()
           && !/^(#{2,4}\s|:::|\s*>|\s*[-*+]\s|\s*\d+[.)]\s|\s*(---|\*\*\*|___)\s*$)/.test(linhas[i])) {
      partes.push(linhas[i].trim()); i++;
    }
    const corpo = linha(partes.join(' '));
    /* imagem sozinha vira figura, não parágrafo com imagem dentro */
    saida.push(/^<img [^>]*>$/.test(corpo)
      ? `<figure class="art-figura">${corpo}</figure>`
      : `<p>${corpo}</p>`);
  }
  return saida.join('\n');
}

/** Âncora legível para um título, para dar link direto a uma seção. */
export function ancora(t) {
  return String(t).toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 60);
}

/** Quanto tempo se leva para ler. 200 palavras por minuto, mínimo de 1. */
export function minutos(texto) {
  return Math.max(1, Math.round(String(texto).trim().split(/\s+/).length / 200));
}
