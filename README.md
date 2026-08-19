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

As fotos das obras ficam em `img/` no formato `.webp`. Enquanto o arquivo real
não existir, o site carrega sozinho o render de apoio equivalente em `img/ph/`,
sem imagem quebrada — cada `<img>` traz `data-ph="img/ph/<nome>.svg"` e o
fallback entra no primeiro erro de carregamento.

Para publicar, basta salvar cada foto em `img/` com exatamente estes nomes:

| Arquivo | Ambiente |
| --- | --- |
| `img/sala-reuniao-azul.webp` | Sala de reunião · parede azul |
| `img/recepcao-marmore.webp` | Recepção · balcão em mármore |
| `img/estante-bordo.webp` | Sala privativa · estante em bordô |
| `img/mesa-vista-sp.webp` | Sala de reunião · vista São Paulo |
| `img/lounge-recepcao.webp` | Lounge de espera · cimento queimado |
| `img/cozinha-marcenaria.webp` | Copa · marcenaria e bancada |
| `img/lavabo-bordo.webp` | Lavabo · meia-parede em bordô |
| `img/lavabo-azul.webp` | Lavabo · azulejo metrô e azul |
| `img/lavabo-terracota.webp` | Lavabo · terracota e porcelanato |
| `img/banheiro-marmore.webp` | Banheiro · marcenaria ripada |

As quatro primeiras aparecem também no leque do topo (`index.html`, `#leque`);
a lista completa alimenta a esteira do acervo (`assets/js/spx.js`, constante
`obras`). Formato recomendado: `.webp`, proporção aproximada 3:2, lado maior
entre 1400 e 1800 px.

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
