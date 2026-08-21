# SPX Engenharia — site institucional

Site estático (HTML + CSS + JS puro, sem build e sem dependência de framework)
para a SPX Engenharia. Basta servir a pasta.

```
.
├── index.html            página principal
├── 404.html              página de erro
├── assets/
│   ├── css/spx.css       sistema de design + componentes + seções
│   └── js/spx.js         comportamento compartilhado pelas duas páginas
└── img/
    ├── *.webp            fotos reais das obras (coloque as suas aqui)
    └── ph/*.svg          renders de apoio, usados enquanto a foto não existe
```

Para rodar localmente:

```bash
npx http-server -p 8080 .   # ou: python3 -m http.server 8080
```

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
| `img/logo.png` | assinatura do rodapé no tema claro |
| `img/logo-negativa.png` | assinatura do rodapé no tema escuro |
| `img/logo-spx.png` | marca do menu no tema escuro (pílula clara) |
| `img/logo-spx-negativa.png` | marca do menu no tema claro (pílula escura) |
| `img/favicon.png` | ícone da aba, recortado do X em treliça |

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
maior — 15 ambientes, cerca de 1,7 MB no total. Cada `<img>` traz também
`data-ph="img/ph/<nome>.svg"`: se algum arquivo faltar, o site mostra um render
de apoio em vez de imagem quebrada.

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

O formulário valida em tempo real e, ao enviar, monta o briefing em texto e
oferece dois caminhos prontos: WhatsApp e e-mail. Não depende de backend.

Se você tiver um endpoint, adicione o atributo no formulário e ele passa a
receber um `POST` com JSON dos campos:

```html
<form id="formObra" data-endpoint="https://api.exemplo.com/leads" novalidate>
```

Telefone, WhatsApp e e-mail de contato estão em `index.html` (seção
`#contato`, rodapé e menu) e no fallback de `assets/js/spx.js` — troque os
números de exemplo pelos reais antes de publicar.

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
- **robots.txt** liberando o site inteiro.

**Falta fazer quando o domínio próprio entrar no ar** (hoje o endereço é o da
Vercel, e URL absoluta errada atrapalha em vez de ajudar):

1. Trocar `og:image` e `twitter:image` por URL absoluta.
2. Acrescentar `<link rel="canonical">` e `og:url`.
3. Criar `sitemap.xml` e apontá-lo no `robots.txt`.
4. Cadastrar o site no Google Search Console e no Perfil da Empresa no Google.

Os termos do bloco de SEO foram escolhidos por conhecimento do mercado, não
medidos no Google Trends — o ambiente onde o site foi construído não tem
acesso à internet aberta. Vale validar volume e concorrência no Planejador de
Palavras-chave do Google Ads antes de investir em conteúdo.

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
