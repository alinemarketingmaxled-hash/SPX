/**
 * Sincroniza o tema WordPress com o site.
 *
 *   node wordpress/sincroniza.mjs
 *
 * O site estático e o tema mostram o mesmo conteúdo, e conteúdo escrito duas
 * vezes vira conteúdo diferente na terceira. Este script resolve a parte que
 * é mecânica:
 *
 *   1. reescreve spx-tema/inc/dados.php a partir de conteudo/dados.mjs
 *   2. copia a folha de estilo, o JavaScript e as fontes
 *   3. copia as imagens que o tema ainda não tem
 *
 * O que ele NÃO faz é portar template: quando uma página muda de desenho, o
 * arquivo em spx-tema/paginas/ tem de ser mexido à mão. Rode este script
 * depois de cada `npm run site` e antes de subir o tema.
 */
import { readFileSync, writeFileSync, copyFileSync, readdirSync, mkdirSync, existsSync, statSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const raiz = join(dirname(fileURLToPath(import.meta.url)), '..');
const tema = join(raiz, 'wordpress', 'spx-tema');

const dados = await import('../conteudo/dados.mjs');

/* ---------------------------------------------------------------- dados */

/* O marcador de pendência é um Symbol no JavaScript e uma constante no PHP.
   Sem essa tradução, tudo que está pendente viraria string vazia — e o tema
   perderia justamente o travão que impede o site de publicar dado que
   ninguém confirmou. */
const ESCAPA = (t) => String(t).replace(/\\/g, '\\\\').replace(/'/g, "\\'");

function php(v, nivel = 2) {
  const tab = '  '.repeat(nivel);
  const tabInterno = '  '.repeat(nivel + 1);
  if (v === dados.FALTA || v === undefined || v === null) return 'SPX_FALTA';
  if (typeof v === 'boolean') return v ? 'true' : 'false';
  if (typeof v === 'number') return String(v);
  if (typeof v === 'string') return `'${ESCAPA(v)}'`;
  if (Array.isArray(v)) {
    if (!v.length) return '[]';
    /* lista curta de textos simples cabe numa linha só e fica mais legível */
    const simples = v.every((x) => typeof x === 'string' && x.length < 40);
    if (simples && v.length <= 4) return `[${v.map((x) => php(x, 0)).join(', ')}]`;
    return `[\n${v.map((x) => tabInterno + php(x, nivel + 1)).join(',\n')},\n${tab}]`;
  }
  const chaves = Object.keys(v);
  if (!chaves.length) return '[]';
  return `[\n${chaves.map((k) =>
    `${tabInterno}'${ESCAPA(k)}' => ${php(v[k], nivel + 1)}`).join(',\n')},\n${tab}]`;
}

const BLOCOS = ['historia', 'segmentos', 'empresa', 'responsavel', 'numeros', 'processo',
                'camadas', 'servicos', 'projetos', 'duvidas', 'acervo', 'temas',
                'chamadas', 'regioes', 'ambientes'];

const faltando = BLOCOS.filter((b) => !(b in dados));
if (faltando.length) {
  console.error('conteudo/dados.mjs não exporta:', faltando.join(', '));
  process.exit(1);
}

const cabecalho = `<?php
/**
 * Dados da SPX Engenharia — fonte única de verdade do tema.
 *
 * GERADO por wordpress/sincroniza.mjs a partir de conteudo/dados.mjs. Não
 * edite este arquivo à mão: o conteúdo se altera em conteudo/dados.mjs (e
 * sincroniza de novo) ou no painel do WordPress, menu SPX. Quando não houver
 * valor salvo no painel, é este arquivo que responde.
 *
 * SPX_FALTA marca informação que ainda não foi confirmada. O tema não publica
 * nada marcado assim — é o mesmo travão que existe no site estático, e é o
 * que impede o site de afirmar CNPJ, endereço ou dado técnico inventado.
 */

if (!defined('ABSPATH')) { exit; }

/** Marcador de informação pendente. */
const SPX_FALTA = '__SPX_FALTA__';

/** true quando o valor ainda não foi confirmado. */
function spx_falta($v) {
  return $v === SPX_FALTA || $v === null || $v === '' || $v === [];
}

function spx_dados_padrao() {
  return [
`;

const corpo = BLOCOS.map((b) => `    '${b}' => ${php(dados[b], 2)},`).join('\n');
writeFileSync(join(tema, 'inc', 'dados.php'), cabecalho + corpo + '\n  ];\n}\n');

/* ---------------------------------------------------------------- assets */

const copia = (de, para) => {
  mkdirSync(dirname(para), { recursive: true });
  copyFileSync(de, para);
};

/* A folha e o JavaScript do tema são os MINIFICADOS do site: o tema carrega
   spx.css e spx.js pelos nomes sem .min, então o conteúdo é o minificado com
   o nome simples. Copiar o não-minificado dobraria o peso da página. */
copia(join(raiz, 'assets/css/spx.min.css'), join(tema, 'assets/css/spx.css'));
copia(join(raiz, 'assets/js/spx.min.js'), join(tema, 'assets/js/spx.js'));

let fontes = 0;
for (const f of readdirSync(join(raiz, 'assets/css/fontes'))) {
  copia(join(raiz, 'assets/css/fontes', f), join(tema, 'assets/css/fontes', f));
  fontes++;
}

let imagens = 0, novas = [];
for (const f of readdirSync(join(raiz, 'img'))) {
  const de = join(raiz, 'img', f), para = join(tema, 'img', f);
  if (statSync(de).isDirectory()) continue;
  const existia = existsSync(para);
  if (!existia || statSync(de).mtimeMs > statSync(para).mtimeMs) {
    copia(de, para);
    imagens++;
    if (!existia) novas.push(f);
  }
}

const kb = (p) => Math.round(statSync(p).size / 1024) + ' KB';
console.log(`inc/dados.php  ${BLOCOS.length} blocos, ${kb(join(tema, 'inc/dados.php'))}`);
console.log(`assets         CSS ${kb(join(tema, 'assets/css/spx.css'))} · JS ${kb(join(tema, 'assets/js/spx.js'))} · ${fontes} fontes`);
console.log(`img            ${imagens} copiadas${novas.length ? ' (' + novas.length + ' novas: ' + novas.slice(0, 6).join(', ') + (novas.length > 6 ? '…' : '') + ')' : ''}`);
