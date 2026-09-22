/**
 * Lê os artigos de conteudo/artigos/*.md.
 *
 * COMO SE ESCREVE UM ARTIGO
 *
 * Um arquivo .md por artigo, com um cabeçalho entre duas linhas de três traços
 * e o texto abaixo:
 *
 *     ---
 *     titulo: Por que a obra do vizinho atrasou
 *     data: 2026-10-05
 *     resumo: Uma frase que aparece na lista e no Google. Até 160 letras.
 *     foto: sala-reuniao-azul
 *     ---
 *
 *     ## Primeiro assunto
 *
 *     Texto normal. **Negrito** e *itálico* funcionam.
 *
 * O nome do arquivo vira o endereço: `obra-atrasou.md` publica em
 * /blog/obra-atrasou. Escolha com cuidado — endereço publicado que muda depois
 * quebra link de quem compartilhou.
 *
 * NADA É INVENTADO AQUI TAMBÉM
 *
 * Artigo sem título, sem data ou sem texto não é publicado, e o gerador avisa.
 * Um artigo pela metade no ar é pior do que artigo nenhum.
 */
import { readdirSync, readFileSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { minutos } from './marcacao.mjs';

const PASTA = join(dirname(fileURLToPath(import.meta.url)), 'artigos');

/* O cabeçalho é `chave: valor` por linha, e só isso. Não é YAML de verdade e
   não precisa ser: lista e aninhamento não cabem num artigo, e aceitar YAML
   inteiro traria um analisador que ninguém aqui vai auditar. */
function cabecalho(bruto) {
  const campos = {};
  for (const l of bruto.split('\n')) {
    const m = l.match(/^([a-zA-Z]+)\s*:\s*(.*)$/);
    if (m) campos[m[1]] = m[2].trim();
  }
  return campos;
}

export function lerArtigos() {
  if (!existsSync(PASTA)) return { publicaveis: [], problemas: [] };
  const publicaveis = [], problemas = [];

  for (const arq of readdirSync(PASTA).filter((f) => f.endsWith('.md')).sort()) {
    const slug = arq.replace(/\.md$/, '');
    const texto = readFileSync(join(PASTA, arq), 'utf8');
    const m = texto.match(/^---\n([\s\S]*?)\n---\n?([\s\S]*)$/);
    if (!m) { problemas.push(`${arq}: falta o cabeçalho entre as linhas de três traços`); continue; }

    const c = cabecalho(m[1]);
    const corpo = m[2].trim();
    const faltando = ['titulo', 'data', 'resumo'].filter((k) => !c[k]);
    if (faltando.length) { problemas.push(`${arq}: falta ${faltando.join(', ')} no cabeçalho`); continue; }
    if (!corpo)          { problemas.push(`${arq}: o cabeçalho está certo mas não há texto abaixo dele`); continue; }
    if (!/^\d{4}-\d{2}-\d{2}$/.test(c.data)) {
      problemas.push(`${arq}: a data "${c.data}" precisa estar no formato 2026-10-05`); continue;
    }

    publicaveis.push({
      slug, titulo: c.titulo, data: c.data, resumo: c.resumo,
      foto: c.foto || '', corpo, minutos: minutos(corpo),
    });
  }
  /* mais novo primeiro: é a ordem que o leitor espera numa lista de artigos */
  publicaveis.sort((a, b) => b.data.localeCompare(a.data));
  return { publicaveis, problemas };
}

/** 5 de outubro de 2026 — data por extenso, como se lê em português. */
export function dataPorExtenso(iso) {
  const MESES = ['janeiro', 'fevereiro', 'março', 'abril', 'maio', 'junho', 'julho',
                 'agosto', 'setembro', 'outubro', 'novembro', 'dezembro'];
  const [a, m, d] = iso.split('-').map(Number);
  return `${d} de ${MESES[m - 1]} de ${a}`;
}
