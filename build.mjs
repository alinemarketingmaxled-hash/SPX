/**
 * Passo de build do site SPX.
 *
 *   node build.mjs
 *
 * Minifica assets/css/spx.css e assets/js/spx.js nos arquivos .min que as
 * páginas realmente carregam. Rode sempre depois de editar um dos dois; os
 * originais continuam sendo a fonte, nunca edite os minificados.
 *
 * Embutir o CSS na página foi testado e piorou: com o estilo dentro do HTML,
 * o documento fica grande e atrasa a descoberta da foto do topo, que é o
 * elemento de maior contentful paint. Arquivo externo minificado e com cache
 * longo rende mais.
 */
import { readFileSync, writeFileSync } from 'node:fs';
import { createRequire } from 'node:module';

// require em vez de import para que o esbuild possa vir tanto de node_modules
// local (npm install) quanto de uma instalação global apontada por NODE_PATH.
let transform;
try {
  ({ transform } = createRequire(import.meta.url)('esbuild'));
} catch {
  console.error('esbuild não encontrado. Rode: npm install');
  process.exit(1);
}

const css = readFileSync('assets/css/spx.css', 'utf8');
const cssMin = (await transform(css, { loader: 'css', minify: true })).code.trim();
writeFileSync('assets/css/spx.min.css', cssMin);

const js = readFileSync('assets/js/spx.js', 'utf8');
const jsMin = (await transform(js, { loader: 'js', minify: true, target: 'es2019' })).code;
writeFileSync('assets/js/spx.min.js', jsMin);

const kb = n => Math.round(n / 1024) + ' KB';
console.log(`CSS ${kb(css.length)} → ${kb(cssMin.length)}`);
console.log(`JS  ${kb(js.length)} → ${kb(jsMin.length)}`);
