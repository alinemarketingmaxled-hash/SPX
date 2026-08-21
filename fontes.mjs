/**
 * Baixa as fontes do Google e as grava dentro do repositório.
 *
 *   node fontes.mjs
 *
 * Servir as fontes do próprio domínio evita duas conexões novas
 * (fonts.googleapis.com e fonts.gstatic.com) no primeiro acesso, que em rede
 * móvel custam caro. O resultado são os arquivos .woff2 em assets/css/fontes
 * e o bloco de @font-face no começo de assets/css/spx.css.
 *
 * Rode de novo se mudar a lista de pesos abaixo; depois rode `node build.mjs`.
 */
import { mkdirSync, writeFileSync, readFileSync } from 'node:fs';

const URL_CSS = 'https://fonts.googleapis.com/css2' +
  '?family=Chakra+Petch:ital,wght@0,500;0,600;0,700;1,700' +
  '&family=Barlow:wght@400;500;600&display=swap';
/* só os alfabetos que o site usa; o resto do CSS do Google é descartado */
const SUBCONJUNTOS = new Set(['latin', 'latin-ext']);
/* o Google devolve woff2 apenas para navegadores que declaram suportá-lo */
const NAVEGADOR = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 ' +
  '(KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36';

const css = await (await fetch(URL_CSS, { headers: { 'User-Agent': NAVEGADOR } })).text();
mkdirSync('assets/css/fontes', { recursive: true });

const faces = [];
for (const [, sub, bloco] of css.matchAll(/\/\* (\S+) \*\/\n(@font-face \{[\s\S]*?\n\})/g)) {
  if (!SUBCONJUNTOS.has(sub)) continue;
  const familia = /font-family: '([^']+)'/.exec(bloco)[1];
  const peso = /font-weight: (\d+)/.exec(bloco)[1];
  const estilo = /font-style: (\w+)/.exec(bloco)[1];
  const url = /url\((https:\/\/[^)]+)\)/.exec(bloco)[1];
  const nome = `${familia.toLowerCase().replace(/ /g, '-')}-${peso}` +
    `${estilo === 'italic' ? '-italico' : ''}-${sub}.woff2`;
  const fonte = Buffer.from(await (await fetch(url, { headers: { 'User-Agent': NAVEGADOR } })).arrayBuffer());
  writeFileSync('assets/css/fontes/' + nome, fonte);
  console.log(nome.padEnd(44), Math.round(fonte.length / 1024) + ' KB');
  faces.push(bloco.replace(url, 'fontes/' + nome));
}

const cabecalho = '/* Fontes servidas do próprio domínio: uma conexão a menos que abrir com\n' +
  '   fonts.googleapis.com e fonts.gstatic.com no primeiro acesso.\n' +
  '   Gerado por fontes.mjs a partir do CSS oficial do Google Fonts. */\n';
const arquivo = 'assets/css/spx.css';
const estilo = readFileSync(arquivo, 'utf8').replace(/^[\s\S]*?(?=\/\* =)/, '');
writeFileSync(arquivo, cabecalho + faces.join('\n') + '\n\n' + estilo);
console.log(`${faces.length} fontes gravadas em assets/css/spx.css`);
