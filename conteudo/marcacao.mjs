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

/** Markdown → HTML. */
export function marcacao(texto) {
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
           && !/^(#{2,4}\s|\s*>|\s*[-*+]\s|\s*\d+[.)]\s|\s*(---|\*\*\*|___)\s*$)/.test(linhas[i])) {
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
