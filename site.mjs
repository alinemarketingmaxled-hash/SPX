/**
 * Gera sitemap.xml e robots.txt e carimba o endereço do site nas páginas.
 *
 *   node site.mjs                              usa o endereço abaixo
 *   node site.mjs https://outro-dominio.com.br  usa o que você passar
 *
 * O Google precisa de endereço absoluto no <link rel=canonical>, no og:url,
 * na imagem de compartilhamento e no sitemap. Enquanto o domínio próprio não
 * entra, dá para apontar para o endereço da Vercel — só rode de novo depois.
 */
import { readFileSync, writeFileSync } from 'node:fs';

const SITE = (process.argv[2] || 'https://spxengenharia.com.br').replace(/\/+$/, '');
const PAGINAS = [
  { arquivo: 'index.html', caminho: '/', prioridade: '1.0', frequencia: 'weekly' },
  { arquivo: 'servicos-e-regioes.html', caminho: '/servicos-e-regioes', prioridade: '0.6', frequencia: 'monthly' },
];
const hoje = new Date().toISOString().slice(0, 10);

for (const { arquivo, caminho } of PAGINAS) {
  let html = readFileSync(arquivo, 'utf8');
  const url = SITE + caminho;
  /* remove o que uma execução anterior deixou, para poder rodar quantas vezes quiser */
  html = html.replace(/[ \t]*<link rel="canonical"[^>]*>\n/g, '')
             .replace(/[ \t]*<meta property="og:url"[^>]*>\n/g, '')
             .replace(/(<meta (?:property="og:image"|name="twitter:image") content=")[^"]*(")/g, `$1${SITE}/img/og.jpg$2`);
  /* logo depois do <title>, que toda página tem */
  html = html.replace(/(<\/title>\n)/,
    `$1<link rel="canonical" href="${url}">\n<meta property="og:url" content="${url}">\n`);
  writeFileSync(arquivo, html);
  console.log(arquivo, '->', url);
}

writeFileSync('sitemap.xml',
  '<?xml version="1.0" encoding="UTF-8"?>\n' +
  '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' +
  PAGINAS.map(({ caminho, prioridade, frequencia }) =>
    `  <url>\n    <loc>${SITE}${caminho}</loc>\n    <lastmod>${hoje}</lastmod>\n` +
    `    <changefreq>${frequencia}</changefreq>\n    <priority>${prioridade}</priority>\n  </url>`
  ).join('\n') + '\n</urlset>\n');

writeFileSync('robots.txt',
  'User-agent: *\nAllow: /\n\n' +
  '# a página de erro não deve entrar no índice\nDisallow: /404\n\n' +
  `Sitemap: ${SITE}/sitemap.xml\n`);

console.log('sitemap.xml e robots.txt gerados para', SITE);
