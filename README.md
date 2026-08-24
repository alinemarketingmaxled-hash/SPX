# SPX Engenharia — site institucional

Site estático (HTML + CSS + JS puro, sem framework) para a SPX Engenharia.
O único passo de build minifica os dois assets; servir a pasta já funciona.

```
.
├── index.html                 página principal
├── 404.html                   página de erro
├── servicos-e-regioes.html    diretório de serviços por região (SEO)
├── build.mjs                  minifica o CSS e o JS
├── fontes.py                  baixa e corta as fontes do Google
├── site.mjs                   carimba o endereço do site e gera o sitemap
├── sitemap.xml                gerado por site.mjs
├── api/
│   ├── contato.js             recebe o formulário e manda o e-mail
│   ├── erro.js                registra erro de JavaScript no log da Vercel
│   └── status.js              endereço leve para o monitor bater
├── .github/workflows/         monitor de disponibilidade e backup semanal
├── .env.example               nomes das variáveis, sem nenhum valor
├── assets/
│   ├── css/spx.css            sistema de design + componentes + seções (fonte)
│   ├── css/spx.min.css        o que as páginas carregam (gerado)
│   ├── css/fontes/*.woff2     fontes servidas do próprio domínio, já cortadas
│   ├── js/spx.js              comportamento compartilhado (fonte)
│   └── js/spx.min.js          o que as páginas carregam (gerado)
└── img/
    ├── *.webp                 fotos reais das obras, com variantes de largura
    └── ph/*.svg               renders de apoio, se alguma foto faltar
```

Para rodar localmente:

```bash
python3 -m http.server 8080   # ou: npx http-server -p 8080 .
```

## Build

Edite sempre `assets/css/spx.css` e `assets/js/spx.js`; os arquivos `.min`
são gerados e não devem ser editados à mão.

```bash
npm install     # só na primeira vez (esbuild)
node build.mjs  # depois de qualquer mudança no CSS ou no JS
```

Se mudar o CSS ou o JS, suba também o número de versão do `?v=` nas três
páginas, para o navegador de quem já visitou pegar o arquivo novo.

Embutir o CSS dentro do HTML foi testado e piorou: o documento cresce e o
navegador demora mais para descobrir a foto do topo, que é o maior elemento
pintado. Arquivo externo minificado com cache longo rende mais.

### Fontes

As fontes (Chakra Petch e Barlow) são servidas do próprio domínio, em
`assets/css/fontes/`, e os `@font-face` ficam no começo de `spx.css`. Isso
evita abrir duas conexões novas (`fonts.googleapis.com` e `fonts.gstatic.com`)
no primeiro acesso — em rede móvel esse era, de longe, o maior custo da
página.

São só cinco arquivos, 52 KB no total, cortados para o alfabeto que o site
escreve (português inteiro, mais a pontuação e as setas em uso):

| Fonte | Onde entra |
| --- | --- |
| Barlow 400 | texto corrido |
| Barlow 600 | destaque dentro do texto, `<b>` e `<strong>` |
| Chakra Petch 500 | rótulos e legendas |
| Chakra Petch 600 | menu, botões e subtítulos |
| Chakra Petch 700 | títulos |

```bash
pip install fonttools brotli
python3 fontes.py   # baixa do Google, corta os glifos e reescreve os @font-face
node build.mjs
```

A lista `PESOS` dentro de `fontes.py` é a fonte da verdade. **Se você usar um
peso que não está lá**, o navegador engorda ou afina a letra sozinho e a forma
sai diferente do desenho original. Por isso o CSS normaliza `b`/`strong` para
600 e alguns rótulos para 500 — assim nenhum peso fora da lista é pedido.

As fontes não são pré-carregadas de propósito: testado, o `preload` de fonte
rouba banda da foto do topo e o LCP piora de 2,4 s para 4,5 s. Com
`font-display: swap` o texto aparece na hora na fonte do sistema e troca
depois.

## Sistema de design

Tudo é controlado por variáveis CSS no topo de `assets/css/spx.css`.
Trocar a marca inteira é mexer em um bloco só:

| Grupo | Tokens |
| --- | --- |
| Superfícies | `--bg`, `--bg-2`, `--sup`, `--sup-2` |
| Traços | `--linha`, `--linha-forte`, `--trama` |
| Texto | `--txt`, `--txt-2`, `--txt-3` |
| Acento | `--acc`, `--acc-2`, `--acc-suave` |
| Inversão | `--inv-bg`, `--inv-txt` (botões, pílula da nav) |
| Bloco invertido | `--bl-*` (a seção "Raio de atuação") |
| Ritmo | `--e1` … `--e8`, `--gutter`, `--raio`, `--maxw` |
| Tipografia | `--display`, `--corpo`, `--t-hero`, `--t-h2`, `--t-lead` |

### Dois temas

O site tem tema escuro e tema claro ("modo planta"). A escolha:

1. abre sempre no escuro — fundo preto e acento azul grafite são o padrão da marca;
2. pode ser trocada no botão da barra de navegação;
3. fica salva em `localStorage` (`spx-tema`);
4. é aplicada antes da pintura por um script inline no `<head>`, então não pisca.

Nenhum componente tem cor fixa: todos usam os tokens semânticos, e o
"bloco invertido" sempre contrasta com a página — claro sobre o site escuro,
escuro sobre o site claro.

### Topo com as obras ao fundo

O topo é uma foto em tela cheia que troca sozinha a cada 6,5 segundos, com
setas para avançar manualmente. As seis fotos em destaque estão listadas em
`assets/js/spx.js`, no módulo `heroFotos` (constante `destaque`). A faixa de
números por cima é vidro fosco; o topo mantém a paleta clara nos dois temas,
porque está sempre sobre imagem.

### Logo

A marca vive em quatro arquivos derivados do original enviado pela empresa:

| Arquivo | Onde entra |
| --- | --- |
| `img/logo.webp` | assinatura do rodapé no tema claro |
| `img/logo-negativa.webp` | assinatura do rodapé no tema escuro |
| `img/logo-spx.webp` | marca do menu no tema escuro (pílula clara) |
| `img/logo-spx-negativa.webp` | marca do menu no tema claro (pílula escura) |
| `img/favicon.png` | ícone da aba, recortado do X em treliça |

Os `.png` de mesmo nome continuam no repositório como original de trabalho,
mas as páginas carregam só os `.webp`: a marca do menu, que aparece com 23 px
de altura, saiu de 69 KB para 8 KB, e a assinatura do rodapé de 79 KB para
19 KB e agora carrega em modo preguiçoso.

O fundo foi removido preservando os traços internos da treliça. A versão
negativa inverte só os tons escuros, então as letras ficam brancas e a
treliça mantém o cinza e os traços claros do original — a arte não foi
redesenhada.

As classes `.so-escuro` e `.so-claro` fazem a troca conforme o tema.

### Segmentos atendidos

A seção `#segmentos` é uma esteira que anda sozinha para a esquerda, sem
título, e pausa quando o cursor entra. A lista é renderizada duas vezes para
o laço não ter emenda. Os itens ficam na constante `SEGMENTOS` do módulo
`segmentos`, em `assets/js/spx.js`: cada entrada é
`[linha 1, linha 2, path do ícone]`. Para acrescentar um segmento, basta
adicionar uma linha. Com `prefers-reduced-motion` a esteira para e vira
rolagem manual.

### Folha de cronograma

O bloco `#folhaCronograma`, dentro do Método, monta um resumo do cronograma
com as dez frentes, duração e barra de período. Os dados ficam na constante
`FRENTES` do módulo `cronograma`, em `assets/js/spx.js`, e as barras são
calculadas a partir das datas de início e término. Cada etapa do método
aponta, logo abaixo do prazo, quais frentes do cronograma ela cobre — e ao
passar o cursor, o dedo ou o foco do teclado sobre a etapa, essas frentes
acendem na folha e as demais escurecem. O vínculo é declarado no atributo
`data-frentes` de cada `.passo`, separado por barra vertical. As cores
da folha são fixas, de papel impresso, e não seguem os tokens.

Com o cursor sobre a folha, ela inclina em três dimensões acompanhando o
ponteiro, com um brilho que segue a mesma posição e a sombra abrindo. O
efeito é desligado no toque e com `prefers-reduced-motion`.

### Faixas claras e fundo de canteiro

Qualquer seção que receba a classe `.claro` reescreve os tokens semânticos e
vira uma faixa cinza esbranquiçada, sangrando de ponta a ponta. Todo componente
dentro dela acompanha sozinho, sem regra nova. Hoje são duas: Serviços e
Dúvidas.

A classe `.vidro` faz o mesmo com uma faixa de vidro escuro: fundo profundo,
brilho difuso em duas manchas e trama diagonal fina. É a do Método, onde a
folha branca de cronograma precisa de contraste. Nenhuma das duas pode usar
`overflow: hidden`, que recortaria o fundo na largura do conteúdo.

O desenho de canteiro (`img/canteiro.svg` — guindastes, prédios em obra,
andaimes e tapume) fica fixo no rodapé da janela, atrás de tudo, com opacidade
entre 7% e 13%. Ele só aparece nas faixas escuras, porque as claras têm fundo
próprio.

### Componentes reutilizáveis

`.btn` (`.btn-ghost`, `.btn-acc`, `.btn-bloco`) · `.card` · `.eyebrow` · `.lead`
`.selo` · `.pill` · `.pill-live` · `.cantos` (cantos de desenho técnico no hover)
`.compromisso` (cartão de compromisso de contrato)
`.cabeca` (título + apoio) · `.sec` / `.sec-linha` / `.wrap` · `.ficha` (faixa de números)

Qualquer elemento com `data-reveal` entra animado ao rolar
(`data-atraso="1|2|3"` escalona a entrada). Sem JavaScript, o conteúdo
aparece normalmente — a classe de animação só é adicionada pelo script.

## Imagens

As fotos das obras ficam em `img/`, em `.webp` com no máximo 1600 px no lado
maior — 15 ambientes. Cada foto tem variantes de 480, 640 e 960 px de largura,
oferecidas por `srcset`, para o celular não baixar a versão grande. A variante
só existe quando é menor que o original, e o `srcset` montado pelo JS consulta
o mapa `DIM` para não pedir um arquivo que não foi gerado. Cada `<img>` traz
também `data-ph="img/ph/<nome>.svg"`: se algum arquivo faltar, o site mostra um
render de apoio em vez de imagem quebrada.

| Arquivo | Ambiente |
| --- | --- |
| `img/sala-reuniao-azul.webp` | Sala de reunião · parede azul |
| `img/recepcao-marmore.webp` | Recepção · balcão em mármore |
| `img/lounge-recepcao.webp` | Lounge de espera · balcão em pedra |
| `img/mesa-vista-sp.webp` | Sala de reunião · vista São Paulo |
| `img/estante-espinha-peixe.webp` | Escritório · estante e piso espinha de peixe |
| `img/cozinha-marcenaria.webp` | Copa · marcenaria e bancada |
| `img/banheiro-marmore.webp` | Banheiro · marcenaria ripada |
| `img/lavabo-bordo.webp` | Lavabo · meia-parede em bordô |
| `img/lavabo-azul.webp` | Lavabo · azulejo metrô e azul |
| `img/lavabo-terracota.webp` | Lavabo · terracota e porcelanato |
| `img/restaurante-fachada.webp` | Restaurante · salão e fachada |
| `img/restaurante-salao.webp` | Restaurante · salão |
| `img/restaurante-cozinha.webp` | Restaurante · cozinha à vista |
| `img/restaurante-pratos.webp` | Restaurante · painel de pratos |
| `img/restaurante-bar.webp` | Restaurante · bar e mesas |

As quatro primeiras aparecem no leque do topo (`index.html`, `#leque`); a lista
completa alimenta a esteira do acervo (`assets/js/spx.js`, constante `obras`).

Para trocar ou acrescentar uma foto: salve o `.webp` em `img/` e, se for um
ambiente novo, adicione a linha correspondente na constante `obras`. Os
originais em alta resolução não ficam no repositório — só as versões web.

## Formulário de visita técnica

O formulário valida enquanto se digita e, ao enviar, faz um `POST` em JSON
para `/api/contato`, que manda o e-mail. Existem três desfechos, e nenhum
deles perde o contato:

| Resposta do servidor | O que a pessoa vê |
| --- | --- |
| **200** | "Solicitação enviada." O e-mail já saiu. |
| **400 / 429** | O formulário continua aberto, com o motivo escrito embaixo. |
| **503, 502 ou rede caída** | "Solicitação registrada", com os botões de WhatsApp e e-mail **já preenchidos** com tudo que foi respondido. |

O terceiro caso é de propósito. Enquanto o envio por e-mail não estiver
configurado — ou se ele falhar num dia ruim — a pessoa não fica na mão: é um
clique para o WhatsApp com o briefing pronto. E há um limite de 12 segundos:
se o servidor travar, a página desiste e mostra os botões em vez de deixar
alguém olhando para "Enviando…".

### Ligar o envio por e-mail

Sem isso o site funciona, mas cada contato exige o clique no WhatsApp.

1. Crie conta em **resend.com** (o plano gratuito cobre 3.000 e-mails/mês) e
   gere uma API key.
2. Na Vercel, no projeto → **Settings → Environment Variables**, crie:

   | Nome | Valor |
   | --- | --- |
   | `RESEND_API_KEY` | a chave gerada (`re_...`) |
   | `CONTATO_PARA` | `contato@spxengenharia.com.br` |
   | `CONTATO_DE` | só depois de verificar o domínio no Resend |

3. Faça um novo deploy (variável nova só vale a partir do próximo).
4. Confira em `/api/status`: o campo `email` tem que estar `true`.

Os nomes estão em `.env.example`, **sem valores**. A chave nunca entra no
repositório: o `.gitignore` bloqueia `.env` e derivados.

### O que protege o formulário

- **Campo isca** (`.isca`), invisível na tela e fora da ordem de tabulação.
  Só robô preenche; quando vem preenchido, a função responde "deu certo" sem
  mandar nada, para o robô não aprender.
- **Limite de 5 envios por hora** por IP.
- **Validação no servidor** além da do navegador: tamanho máximo por campo,
  formato de e-mail, campos obrigatórios.
- Erro do provedor de e-mail vai para o log, **nunca para a resposta** — a
  mensagem de erro de uma API às vezes carrega detalhe da conta.

Telefone, WhatsApp e e-mail de contato estão em `index.html` (seção
`#contato`, rodapé e menu) e no plano B de `assets/js/spx.js`.

## Credenciais

Não existe nenhuma senha, chave ou token no repositório — pode abrir para
quem quiser. O que é secreto mora em um lugar só: **Vercel → Settings →
Environment Variables**, que só o dono do projeto lê.

Se algum dia uma chave vazar num commit, trocar o arquivo não resolve: o
histórico do git guarda tudo. O certo é **revogar a chave no provedor** e
gerar outra.

## Medição, erros e monitoramento

### Google Analytics

Está pronto, desligado. Em cada página existe:

```html
<meta name="ga-id" content="">
```

Cole ali o `G-XXXXXXXXXX` da sua propriedade do GA4 e pronto — o script sobe
sozinho. **Enquanto estiver vazio, nada de terceiro é carregado e nenhum
cookie é criado**, o que mantém o site limpo para quem não quer medir.

Três eventos já vão configurados, que é o que importa num site de obra:

| Evento | Quando dispara |
| --- | --- |
| `solicitar_visita` | envio do formulário (com o tipo de obra) |
| `clique_whatsapp` | qualquer link de WhatsApp |
| `clique_telefone` | qualquer link de telefone |

Para pegar o ID: analytics.google.com → Administrador → Fluxos de dados →
criar fluxo da Web com o endereço do site → copiar o "ID da métrica".

### Rastreamento de erro

`assets/js/spx.js` escuta `error` e `unhandledrejection` e manda para
`/api/erro`, que só escreve no **log da Vercel** (Deployments → Runtime
Logs). Sem serviço de fora, sem custo, sem cadastro.

Registra o necessário para reproduzir — mensagem, arquivo, linha, pilha,
navegador, tamanho da tela — e **nada do que foi digitado**, nem IP. Para no
terceiro erro da sessão, porque a partir daí é sempre o mesmo em looping.

### Monitor de disponibilidade

`.github/workflows/uptime.yml` bate no site a cada 15 minutos. Três falhas
seguidas e ele **abre uma issue** aqui no repositório — o GitHub te manda
e-mail. Quando volta, fecha sozinho.

Antes de valer: troque `SITE` no topo do arquivo pelo endereço real e
confirme em **Settings → Actions → General** que *Workflow permissions* está
em *Read and write permissions*.

### Backup automático

`.github/workflows/backup.yml` empacota o site todo num `.zip` toda
segunda-feira e guarda por 90 dias em **Actions → Backup semanal →
Artifacts**. O histórico do git já é um backup; este é a cópia pronta para
baixar e abrir sem instalar nada.

## Telas

O site foi conferido em celular (320 a 430 px), celular deitado, tablet em
pé e deitado, notebook e monitor grande, nas duas páginas. Os cortes:

| Largura | O que muda |
| --- | --- |
| até 560 px | pílula do menu compacta, rodapé em uma coluna, botões cheios |
| até 620 px | a folha de cronograma vira lista: nome em cima, barra embaixo |
| até 700 px | tudo em uma coluna; os três números do topo ficam lado a lado |
| até 900 px | topo em uma coluna, método em duas, rodapé em duas |
| até 980 px | menu vira gaveta |
| até 1080 px | serviços em duas colunas, dúvidas em duas |
| até 1280 px | método em três etapas por linha |
| acima | layout cheio, cinco etapas em linha |

Em telas de toque (`pointer: coarse`), os links do rodapé e o acordeão
ganham altura de alvo, independente da largura. Em celular deitado o topo
encolhe para caber na tela.

No celular a página é enxugada de propósito, para não virar uma rolagem sem
fim: os itens dos cards de serviço somem, as cinco etapas do método viram
uma lista de uma linha cada, a folha de cronograma perde a coluna de período
para uma barra abaixo do nome, o formulário vai a duas colunas, os canais de
contato perdem a linha de apoio e o bloco lateral das dúvidas fica só com o
título, os números e o botão. O conteúdo completo continua no tablet e no
computador.

## SEO

O que está no site:

- **Dados estruturados** em JSON-LD no `<head>` do `index.html`, tipo
  `GeneralContractor`: nome, descrição, telefone, e-mail, cidades atendidas,
  catálogo de serviços e horário. É o formato que o Google lê para montar o
  painel de empresa.
- **Bloco de serviços e regiões** no fim do rodapé (`.seo`), com 48 termos
  organizados em serviços, regiões e buscas frequentes. É um acordeão de
  verdade, aberto por quem quiser: texto escondido de leitor humano é
  penalizado pelo Google como spam.
- **Página de diretório** `servicos-e-regioes.html`, com 1.064 combinações de
  serviço e região (28 serviços × 38 regiões), agrupadas por área, com índice
  navegável no topo. Foi feita como página própria, e não empilhada no rodapé
  da home, porque a política do Google trata "blocos de texto listando cidades
  e regiões" dentro de uma página comum como excesso de palavras-chave. Como
  página de cobertura, com título, introdução, hierarquia e navegação, é o
  formato que o Google aceita. Para mexer na lista, edite as constantes
  `GRUPOS` e `SERVICOS` no gerador e regere a página.
- **Meta descrição, Open Graph e Twitter Card**, com a imagem de
  compartilhamento em `img/og.jpg` (1200x630, gerada de uma foto real com a
  logo).
- **`sitemap.xml`**, com as duas páginas indexáveis, e **robots.txt**
  apontando para ele e bloqueando a página de erro.
- **`<link rel="canonical">` e `og:url`** em endereço absoluto nas duas
  páginas, e a imagem de compartilhamento também em endereço absoluto.

### Trocar o endereço do site

Canonical, `og:url`, imagem de compartilhamento e sitemap precisam do
endereço absoluto, e ele está em um só lugar:

```bash
node site.mjs                                   # usa spxengenharia.com.br
node site.mjs https://spx-engenharia.vercel.app # ou o endereço que for
```

Roda quantas vezes quiser, não duplica nada. **Rode de novo no dia em que o
domínio próprio entrar no ar** — endereço canônico errado atrapalha mais do
que ajudar.

### Search Console

1. **search.google.com/search-console** → Adicionar propriedade → *Prefixo do
   URL* com o endereço do site.
2. Verificar. O caminho mais simples é o registro **TXT no DNS** do domínio;
   se estiver no endereço da Vercel, use a tag HTML e cole no `<head>` do
   `index.html`.
3. **Sitemaps** → enviar `sitemap.xml`.
4. **Inspeção de URL** → colar o endereço da home → *Solicitar indexação*.

**Erros de cobertura** aparecem em *Páginas*. Os três que mais aparecem e o
que significam:

| O que o relatório diz | O que é | O que fazer |
| --- | --- | --- |
| "Página com redirecionamento" | você enviou `/pagina` e o site responde em `/pagina/`, ou vice-versa | conferir se o `sitemap.xml` usa a mesma forma que o site serve (aqui, `cleanUrls` no `vercel.json`, sem barra no fim) |
| "Excluída pela tag noindex" | esperado no `404.html` | ignorar; só é problema se aparecer numa página de conteúdo |
| "Rastreada, no momento sem indexação" | o Google viu mas não achou que valia | conteúdo próprio e links internos apontando para ela resolvem; a página de diretório existe justamente para isso |

Vale cadastrar também o **Perfil da Empresa no Google** — para busca local,
"empresa de reforma comercial em São Paulo" costuma render mais que qualquer
ajuste de página.

### Palavras-chave

Os termos foram escolhidos por conhecimento do mercado, **não medidos**: o
ambiente onde o site foi construído não tem acesso à internet aberta. Antes
de investir em conteúdo, confira volume e concorrência no **Planejador de
Palavras-chave do Google Ads** (gratuito, exige conta) e, depois de algumas
semanas no ar, no relatório **Desempenho** do Search Console — que mostra os
termos pelos quais as pessoas realmente chegaram, que é dado de verdade, não
estimativa.

## Acessibilidade e desempenho

- Link "pular para o conteúdo", foco visível e navegação por teclado no menu,
  no acordeão, nas peças do 404 e no botão de cidades.
- `aria-expanded` / `aria-controls` nos componentes que abrem e fecham;
  `Esc` fecha o menu mobile.
- `prefers-reduced-motion` desliga todas as animações, inclusive a esteira do
  acervo e a contagem dos números.
- A esteira do acervo só anima quando está visível na tela.
- Sem framework, sem imagem pesada: os renders de apoio são SVG de ~4 KB.
- Folha de estilo de impressão embutida.

### O que segura o desempenho

- A foto do topo vem no HTML com `fetchpriority="high"` e um `<link rel=preload>`
  com o mesmo `srcset`, para o navegador começar a baixá-la antes de ler o CSS.
- Fontes no próprio domínio, sem terceiros no caminho crítico.
- Todo `<img>` declara `width` e `height`, então nada empurra o layout.
- Acervo, dúvidas e cronograma só são montados quando chegam perto da tela
  (`IntersectionObserver` com 600 px de folga).
- As animações leem o layout uma vez e guardam o resultado, em vez de forçar
  recálculo a cada quadro.
- Cache longo em `/assets` e `/img` pelo `vercel.json`; as fontes, que nunca
  mudam de nome, são `immutable` por um ano.

Medido com o Lighthouse em celular e rede lenta:

| | index | 404 | serviços e regiões |
| --- | --- | --- | --- |
| Desempenho | **97** | — | — |
| Acessibilidade | **100** | **100** | **100** |
| Boas práticas | **100** | **100** | **100** |
| SEO | **100** | 63 ¹ | **100** |

¹ A página de erro é `noindex` de propósito; é o único ponto que o Lighthouse
tira, e tirar seria errado.

LCP 2,4 s, TBT 0 ms, CLS 0,05. Para conferir o número real, rode o PageSpeed
Insights na URL publicada, não em localhost.

Duas coisas foram testadas e **pioraram**, não repita:

- **Embutir o CSS na página.** Com a folha inteira dentro do HTML o documento
  cresce e atrasa a descoberta da foto do topo. Só a parte crítica também não
  resolve: o que fica de fora chega depois e o layout pula (CLS foi de 0,04
  para 1,04, nota de 97 para 51).
- **`preload` das fontes.** Tira banda da foto do topo; o CLS melhora um
  pouco e o LCP piora bem mais.
