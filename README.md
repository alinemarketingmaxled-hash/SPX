# SPX Engenharia — site institucional

Site estático (HTML + CSS + JS puro, sem framework) para a SPX Engenharia.
O único passo de build minifica os dois assets; servir a pasta já funciona.

```
.
├── index.html                 página principal
├── 404.html                   página de erro
├── servicos-e-regioes.html    diretório de serviços por região (SEO)
├── conteudo/dados.mjs         TODO fato do site mora aqui
├── variantes.py               gera as larguras das fotos de obra
├── gerar.mjs                  monta as páginas internas a partir dos dados
├── build.mjs                  minifica o CSS e o JS
├── fontes.py                  baixa e corta as fontes do Google
├── sitemap.xml, llms.txt      gerados por gerar.mjs
├── servicos/*.html            uma página por serviço (gerado)
├── obras/*.html               uma página por projeto (gerado)
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

## Publicar

O `vercel.json` desliga a etapa de build no servidor: os arquivos `.min` já
estão versionados, então não há o que construir lá. O deploy é só servir o que
está no repositório — um passo a menos para falhar.

Isso importa porque o `package.json` tem um script `build`. Sem o
`buildCommand: ""`, a Vercel enxerga esse script, tenta rodar
`npm install && npm run build`, e uma falha de instalação derruba um deploy
que nem precisava existir.

Rode `node gerar.mjs && node build.mjs` **antes de commitar**, não durante o
deploy.

## Como o site é montado

O site tem duas metades. A home, o 404 e a página de diretório são escritas à
mão. Todo o resto — serviços, projetos, sobre, arquitetos, dúvidas, atuação,
contato, privacidade — é **gerado** a partir de um arquivo só.

```bash
npm run site     # node build.mjs && node gerar.mjs, na ordem certa
```

**A ordem importa.** `build.mjs` minifica o CSS e o JS e grava
`assets/versao.json` com o resumo do conteúdo de cada um; `gerar.mjs` lê esse
arquivo e carimba o `?v=` nas páginas.

### Por que o ?v= sai do conteúdo

Esse número já foi escrito à mão, e isso quebrou o site em produção. Mudei o
CSS várias vezes sem lembrar de subir o número: quem já tinha visitado recebeu
**o HTML novo com a folha de estilo velha em cache**, e a página apareceu com
imagem gigante e texto apagado — sem que houvesse nada errado no código.

Agora a versão é o resumo (SHA-256, 8 caracteres) do arquivo minificado. Mudou
um byte, muda a URL, o navegador busca de novo. Não tem como esquecer.

### conteudo/dados.mjs é a fonte da verdade

Nome da empresa, CNPJ, CREA, serviços, projetos, números, regiões, perguntas
frequentes: tudo mora nesse arquivo. Mudou lá, mudou no site inteiro — página,
menu, rodapé, dados estruturados e sitemap.

**Campo marcado como `FALTA` não vira texto.** O gerador omite e lista a
pendência no fim do build. Nunca inventa. Isso é proposital: número de CREA,
CNPJ ou metragem de obra errados numa página pública custam mais caro que a
ausência deles. Um projeto sem tipo, atuação e foto nem chega a virar página.

O menu e o rodapé também saem de lá e são costurados nas páginas escritas à
mão pelos marcadores `<!--MENU-->`, `<!--RODAPE-->` e `<!--SCHEMA-->` —
assim as duas metades nunca divergem.

```bash
npm install     # só na primeira vez (esbuild)
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

### A folha do cronograma

A folha não é papel branco: é vidro fosco. Fundo em
`rgba(228,231,233,.82)` com `backdrop-filter`, deixando a seção escura
aparecer por trás em vez de brigar com ela.

Isso obriga a recalcular os tons de dentro. A transparência sobre o fundo da
seção (`#070C11`) resulta em `#BCC0C2`, e é **contra essa cor** que o
contraste precisa fechar, não contra branco — o cinza secundário original
tinha 3,27 ali e sumia. Os tons vivem em variáveis no topo do `.folha`
(`--papel-fraco`, `--papel-rotulo`, `--papel-azul`), todos acima de 4,5.

Navegador sem `backdrop-filter` recebe `#BCC0C2` opaco por um `@supports not`:
a mesma cor, sem o desfoque.

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

### Arquitetura de páginas

| URL | O que é |
| --- | --- |
| `/` | home |
| `/servicos` + 8 páginas | uma por serviço, com o que é, para quem, o que executa, etapas, diferenciais e FAQ |
| `/obras` + páginas de projeto | cases; cada projeto só é publicado com tipo, atuação e fotos confirmados |
| `/sobre` | posicionamento, números validados, responsável técnico e dados institucionais |
| `/para-arquitetos` | página comercial para escritórios de arquitetura |
| `/duvidas` | central de perguntas, com resposta objetiva na primeira frase |
| `/atuacao` | regiões atendidas |
| `/contato` | formulário e canais diretos |
| `/privacidade` | política de privacidade e LGPD |
| `/servicos-e-regioes` | diretório com 1.064 combinações de serviço e região |

### Cada página tem um visual próprio

A identidade não muda — preto, cinza esbranquiçado, azul-cimento, trama de
planta ao fundo. O que muda é o ritmo. Cada página gerada recebe uma classe no
`<body>` (`pag-servicos`, `pag-obras`, …) e o CSS trata cada uma:

| Página | Tratamento |
| --- | --- |
| `/servicos` | Índice numerado grande, como sumário de caderno técnico, e a esteira de fotos |
| `/obras` | A esteira abre a página, logo abaixo do título |
| `/sobre` | O posicionamento entra como faixa de vidro escura, não clara |
| `/para-arquitetos` | Trama de planta reforçada no topo, feito papel vegetal |
| `/duvidas` | O título acompanha a rolagem enquanto as perguntas passam |
| `/atuacao` | A faixa clara vira bloco invertido |
| `/servicos/*` | Traço de acento sob o título |
| `/privacidade` | Sem alternância de faixa: leitura contínua |

### Cabeçalho com foto, no painel da direita

Toda página abre com o título à esquerda e a obra num painel encostado na
borda direita, sumindo para a esquerda num degradê. O menu flutua por cima: a
foto sobe por baixo dele até o topo da tela.

**A foto aparece inteira.** Antes o cabeçalho era uma faixa larga e baixa com a
foto atrás do texto, e para caber ali a obra era recortada a ponto de sobrar um
pedaço: uma prateleira, um canto de parede. Como as fotos das obras são
verticais e a faixa era 2,6:1, sobravam menos de 30% da altura da imagem.

Agora o painel usa `object-fit:contain` — nenhuma foto é cortada, seja ela em pé
(a maioria) ou deitada (a recepção em mármore). E cada `<img>` define a própria
largura (`height:100%; width:auto`, encostada à direita), o que faz a máscara
funcionar: presa ao painel, ela apagava sempre a mesma faixa, e numa foto
estreita a fatia apagada caía fora da imagem, deixando a borda esquerda em corte
seco. Presa à foto, o degradê sempre começa na borda dela.

**O texto não fica mais sobre a foto**, então o cabeçalho deixou de forçar a
paleta clara nos dois temas. É o que faz o tema claro funcionar ali: título
escuro sobre fundo claro, com a foto ao lado em vez de atrás.

Existiu antes uma família `img/capa-*.webp`, recortada na proporção da faixa por
um `capas.py`. Saiu junto com a faixa. No lugar entrou `variantes.py`, que gera
as larguras das fotos inteiras:

```bash
python3 variantes.py   # depois de trocar ou acrescentar foto de obra
```

Quatro larguras por foto: 480, 640, 768 e 960 — e nunca uma largura maior que a
original, porque ampliar foto de obra não acrescenta detalhe nenhum, só peso. A
de 768 entrou com este cabeçalho: no tamanho do painel, num aparelho de tela
densa, 640 fica mole e 960 pesa o dobro à toa.

**O vão entre o título e a foto é preenchido pela própria imagem.** Uma foto em
pé só cresce até onde a altura do cabeçalho deixa, então alargar o painel não
alarga a foto — o que preenche aquele trecho é a mesma imagem esticada por trás,
borrada forte e sumindo para a esquerda antes de chegar no título. Nítida, ela
entrava em desalinho com a da frente e o cabeçalho virava imagem dupla; borrada,
sobra a luz e a cor daquela obra ocupando o vão.

A URL do fundo vem do JavaScript e é exatamente a que o `<img>` já baixou
(`currentSrc`), então vira `background-image` **sem custar um pedido novo à
rede**. Antes de a imagem resolver, `currentSrc` vem vazio — daí a repetição no
`load`.

A foto nítida tem teto de largura (`max-width:min(46vw,540px)`). O painel é
largo por causa do fundo borrado, mas sem o teto a recepção em mármore, que é
deitada, chegava a 760px e passava por cima do título.

**O `sizes` de cada `<img>` bate com a largura do painel em cada faixa do CSS**,
e os números não são estéticos: 290 no celular e 380 no tablet são os maiores
valores que ainda fazem o navegador escolher a variante de 768 em vez da de 960.

**As outras fotos do rodízio só entram depois do `load`.** Elas ficam dentro da
tela, então `loading="lazy"` não segura nada: o navegador baixava as quatro de
uma vez e as três seguintes disputavam banda com a primeira, que é o maior
elemento pintado. Medido, custava 0,6 s de LCP e a nota caía de 96 para 93 — e a
primeira troca só acontece 6,5 s depois de a página abrir.

**A peça de engenharia em 3D saiu daqui.** Eram seis desenhos em CSS puro —
cubo, viga I, treliça, lajes, sextavado, malha — girando devagar no canto
direito do cabeçalho, um por página. Aquele canto agora é da foto, e os dois
disputando o mesmo espaço ficava sujo. O código foi removido inteiro em vez de
ficar escondido por CSS: peça que não aparece em página nenhuma é peso morto no
arquivo e armadilha para quem for mexer depois. Está no histórico do git se um
dia voltar a fazer sentido.

### Tamanho do carrossel

O cartão da frente ocupa **32% da largura no computador, 44% no tablet e 74%
no celular**. Vinha pequeno demais no desktop para o que é a peça principal da
página de projetos.

O afastamento dos cartões laterais é proporcional à largura do cartão, não um
número fixo: com tamanhos que variam tanto entre telas, valor fixo deixava os
vizinhos colados no celular e perdidos no monitor grande.

### Fotos que só carregam quando a seção se aproxima

`data-adiar` num bloco, `data-fonte` nas imagens dentro dele. O adiamento
nativo do navegador começa a baixar cedo demais: numa página com foto grande
no topo, as imagens de baixo disputam banda com ela e atrasam o maior elemento
pintado. Medido em `/obras`: 95 caía para 92 sem isso.

Usado no carrossel e no mosaico de fotos.

### Tipos de obra com fotos que abrem ao clicar

Na página de serviços, clicar num cartão abre as fotos daquele tipo de obra
logo abaixo da grade. São **abas de verdade** (`tablist` / `tabpanel`), com
setas do teclado percorrendo os cartões, então quem navega sem mouse entende o
que abriu e onde.

As fotos são montadas só no momento em que a aba abre: nenhuma delas é baixada
antes de alguém pedir.

A atribuição de foto a serviço segue o **tipo de espaço que a imagem mostra**.
Um restaurante entra em obras comerciais porque é isso que se vê; nenhuma foto
é apresentada como sendo de um projeto específico, porque isso não foi
confirmado.

### Sem moldura externa

Os blocos não ficam dentro de uma caixa: cada cartão tem a sua própria borda e
a barra de chamada é uma faixa solta logo abaixo. Moldura em volta de conteúdo
que já tem borda cria duas bordas concêntricas e aperta tudo por dentro.

### Blocos da página de serviços

Cada assunto é um bloco **sem moldura**: o conteúdo respira na página e a barra
de chamada vem logo abaixo, amarrada ao assunto que acabou de ser lido. A
moldura fechada existiu por um tempo e saiu — apertava a leitura e disputava
atenção com os cartões que já têm borda própria.

| Componente | O que é |
| --- | --- |
| `barraCta()` | faixa com a pergunta à esquerda e o botão à direita |
| `blocoDuplo()` | conteúdo à esquerda, arte técnica à direita |
| `listaNumerada()` | linhas com número, ícone fino e um fio embaixo — sem caixa |
| `predioFio()` | prédio isométrico em fio de arame sobre grade de planta |
| `orbitaSPX()` | a marca no centro e as três camadas em volta, clicáveis |
| `faixaDupla()` | duas tiras cruzadas com a marca passando em sentidos opostos |

**`orbitaSPX()` é um `tablist` de verdade.** As três bolas — Engenharia, Gestão
e Execução — são `role="tab"`, e o painel ao lado é o `tabpanel`. Clicar numa
bola mostra só as etapas do processo daquela camada; as setas percorrem as
bolas e trocam o painel no foco. Quem decide qual etapa entra em qual camada é
o campo `camada` de cada item de `processo`, em `conteudo/dados.mjs` — o
diagrama não tem lista própria.

A numeração não fica contínua dentro de cada camada (Engenharia mostra 01, 02 e
04) e isso é proposital: as camadas se cruzam ao longo da obra em vez de
acontecerem uma depois da outra, e esconder isso seria desenhar um processo que
não é o que acontece.

**As bolas não giram.** Só o anel tracejado gira. Alvo que se mexe é alvo que
não se acerta, ainda mais no dedo — e no `prefers-reduced-motion` até o anel
para.

**`predioFio()`: só a cobertura aparece inteira.** Nos pavimentos intermediários
desenha-se apenas a aresta da frente. Com o losango completo em todos os
andares o desenho vira uma pilha de chevrons, não um volume fechado.

**`faixaDupla()`: a marca entra invertida em relação ao menu.** No menu a marca
fica sobre a cápsula clara, então usa a tinta preta (`logo-spx.webp`). Na faixa
o fundo é escuro no tema escuro, então quem entra é a de tinta clara
(`logo-spx-negativa.webp`). Trocar isso deixa a marca invisível — já aconteceu.
As duas tiras são `aria-hidden`: quem não enxerga já ouviu o nome da empresa no
topo e no rodapé, e repetir vinte vezes só atrapalha.

O vão entre seções nas páginas internas é menor que na home (`--e6` no lugar
de `--e8`). A home respira mais porque cada bloco dela é uma peça inteira;
aqui o conteúdo é denso, e o vão grande fazia a página parecer vazia entre um
assunto e outro.

### Componentes vindos das referências

Os modelos que a SPX enviou repetiam alguns padrões nos três conjuntos. Os que
se repetiam foram os escolhidos, e viraram componentes reutilizáveis no
gerador em vez de marcação copiada página a página:

| Componente | Onde entra |
| --- | --- |
| `linhaTempo()` | processo de sete etapas, em `/servicos`, `/sobre`, `/para-arquitetos` e cada serviço |
| `cartoesIcone()` | serviços, garantias de contrato, pilares e o que muda para o escritório |
| `numerosCartao()` | a SPX em números |
| `convite()` | faixa de "ainda com dúvidas?" antes da chamada final |
| `icone()` | 32 ícones técnicos de traço, no mesmo desenho do resto do site |
| Mapa com alfinetes | `/atuacao`, com pulso escalonado e as regiões em pílulas ao lado |

Os ícones são SVG inline no gerador, não fonte de ícone nem sprite: são
conteúdo de página, mudam junto com o texto, e não custam requisição.

Duas armadilhas que apareceram:

- **`<dl>` com `<div>` aninhado é inválido.** Na ficha institucional o ícone
  precisava ficar ao lado de `<dt>` e `<dd>`, e envolver os dois num segundo
  `<div>` derrubou a acessibilidade de 100 para 91. A solução foi grade CSS
  com o ícone ocupando as duas linhas da primeira coluna.
- **Alvo de toque nos marcadores.** Os pontos do carrossel tinham 8 px; o
  mínimo é 24. Recheio transparente resolve sem engordar o desenho.

### Carrossel em profundidade (página de projetos)

A página de projetos abre com um carrossel onde o cartão do meio fica de
frente e inteiro, e os dos lados giram para dentro e recuam. Setas, marcadores,
teclado, arraste no dedo e troca automática que para assim que a pessoa assume
o controle.

O JavaScript calcula a transformação de cada cartão pela distância até o
centro; o CSS só cuida do tempo e da curva. Fora do segundo vizinho o cartão
sai de cena, porque manter tudo composto custa à toa.

Cada cartão é um `<article>` de verdade com título e texto, então quem usa
leitor de tela recebe a lista completa mesmo sem enxergar o efeito. Só o
cartão da frente recebe foco de teclado.

**As fotos entram por `data-fonte`, e só quando a seção se aproxima.** O lazy
do navegador começava a baixá-las cedo demais: os oito cartões competiam com a
foto do topo, que é o maior elemento pintado, e custavam meio segundo de LCP
(nota 95 para 90). Ficam travadas em 480w porque num cartão de 340 px a
variante maior não aparece na tela, só na conta.

### A esteira de fotos

O carrossel de polaroides da home é reaproveitado por `esteira()` no gerador.
O JavaScript procura `#beamwrap` e `#track`, então basta existir um por
página. A foto da esquerda aparece como planta e vira obra pronta ao cruzar o
meio da tela.

Os caminhos das imagens montadas em JavaScript são **absolutos** (`/img/...`).
Relativos apontariam para `/servicos/img/...` nas páginas dentro de pastas.

### Central de dúvidas

A página de dúvidas não é uma lista corrida: as perguntas estão agrupadas em
quatro temas numerados, com **busca ao vivo** no topo. Digitar filtra perguntas
e respostas, ignora acento e marca o trecho encontrado no título; tema que fica
sem nenhuma pergunta some junto com o seu título.

O texto original de cada pergunta é guardado antes de qualquer marcação —
mexer direto no HTML corromperia a pergunta depois de algumas buscas.

### Poeira de obra nas laterais

Duas faixas estreitas presas nas bordas da tela, com partículas de 1 a 2 px
espalhadas em ladrilhos grandes. O ponto é o **raio do gradiente**, não o
tamanho do ladrilho — errar isso transforma poeira em bolhas gigantes.

Deslizam com a rolagem em três ritmos diferentes (10%, 22% e 38% da rolagem), e
é a diferença entre eles que dá profundidade. O JavaScript escreve **uma
variável só** (`--rolagem`) num quadro de animação; o CSS deriva as três
camadas dela e o navegador resolve na GPU, sem recálculo de layout.

Some abaixo de 560 px, onde não há margem sobrando, e com
`prefers-reduced-motion` para de deslizar.

### Botão do WhatsApp

Flutua no canto inferior direito de todas as páginas. Nada do verde padrão:
azul-cimento da marca, canto vivo como o da logo, trama por cima. Fechado é um
quadrado com o ícone; ao aproximar o cursor abre e mostra o texto. No toque já
nasce aberto, porque não existe passar o cursor.

Some quando o formulário está na tela — ali já existe um caminho, e dois
convites ao mesmo tempo viram ruído.

Sai junto do `rodape()` no gerador, que é o que é costurado em toda página. O
`404.html` não tem rodapé e carrega o botão no próprio arquivo.

### Dados estruturados

Saem todos de `dados.mjs`, num único `@graph` por página:

| Tipo | Onde |
| --- | --- |
| `GeneralContractor` | todas as páginas |
| `WebSite` | home |
| `Person` | home e `/sobre` (só existe quando o responsável estiver preenchido) |
| `Service` | cada página de serviço |
| `FAQPage` | `/duvidas`, `/para-arquitetos` e cada serviço |
| `BreadcrumbList` | toda página interna |
| `AboutPage`, `ContactPage` | `/sobre` e `/contato` |

A home **não** leva `FAQPage`: as perguntas dela são montadas por JavaScript, e
o Google exige que o conteúdo do schema esteja visível na página. Em `/duvidas`
as perguntas são estáticas, e lá o `FAQPage` vale.

### AEO — otimização para motores de resposta

Cada página de serviço abre com um bloco de **resposta direta**: a pergunta
que as pessoas realmente digitam como título, e a resposta **na primeira
frase**, sem rodeio antes. É o formato que o Google transforma em trecho em
destaque.

Embaixo vêm três **fatos verificáveis** por serviço — frases curtas e
autônomas, do tipo que se cita sem precisar do contexto ao redor.

Marcação `speakable` indica ao assistente de voz qual trecho ler em voz alta.

### GEO — otimização para IA generativa

O que faz uma IA citar a empresa é conseguir extrair afirmações factuais sem
ambiguidade. Por isso:

- `empresa.definicao` em `dados.mjs` é uma frase única, factual, sem adjetivo
  de venda — é ela que aparece como resposta em `/duvidas` e no `llms.txt`
- a mesma entidade (`@id`) amarra todas as páginas ao mesmo
  `GeneralContractor`, em vez de cada página declarar uma empresa solta
- `HowTo` descreve o processo de sete etapas como procedimento, não como texto
- o `llms.txt` traz, por serviço, a pergunta, a resposta, os fatos e a lista do
  que é executado

### llms.txt

`llms.txt` é um resumo do site em texto puro, para os robôs de IA lerem sem
interpretar HTML: identificação da empresa, serviços, processo, regiões e as
perguntas frequentes com resposta. Gerado junto com as páginas.

### Trocar o endereço do site

O endereço absoluto está em `dados.mjs`, no campo `empresa.dominio`. Mude lá e
rode `node gerar.mjs`: canonical, `og:url`, imagem de compartilhamento,
sitemap e llms.txt acompanham. **Rode de novo no dia em que o domínio próprio
entrar no ar** — endereço canônico errado atrapalha mais do que ajuda.

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
