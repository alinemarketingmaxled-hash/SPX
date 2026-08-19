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

### Componentes reutilizáveis

`.btn` (`.btn-ghost`, `.btn-acc`, `.btn-bloco`) · `.card` · `.eyebrow` · `.lead`
`.selo` · `.pill` · `.pill-live` · `.cantos` (cantos de desenho técnico no hover)
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
