<?php
/**
 * Artes do site: o prédio em fio de arame, o mapa de malha urbana e a faixa
 * dupla com a logo passando.
 *
 * São desenhos, não conteúdo: nenhum deles muda com o que for editado no
 * painel. Vêm prontos do gerador do site estático — inclusive o mapa, cujas
 * linhas saem de um gerador de semente fixa justamente para sair igual toda
 * vez. Copiar o SVG pronto é mais seguro do que reescrever a geometria.
 */

if (!defined('ABSPATH')) { exit; }

/**
 * Prédio isométrico em fio de arame. Só a laje de cobertura aparece inteira;
 * nos pavimentos intermediários desenha-se apenas a aresta da frente, senão o
 * desenho vira uma pilha de chevrons em vez de um volume fechado.
 */
function spx_predio_fio() {
  return '
<svg class="arte-predio" viewBox="0 0 320 400" role="img" aria-hidden="true">
  <defs>
    <linearGradient id="pf-fio" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="currentColor" stop-opacity="1"/>
      <stop offset=".5" stop-color="currentColor" stop-opacity=".7"/>
      <stop offset="1" stop-color="currentColor" stop-opacity=".34"/>
    </linearGradient>
    <linearGradient id="pf-face" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="currentColor" stop-opacity=".14"/>
      <stop offset="1" stop-color="currentColor" stop-opacity=".02"/>
    </linearGradient>
    <radialGradient id="pf-fade" cx="50%" cy="44%" r="60%">
      <stop offset="0" stop-color="#fff" stop-opacity=".85"/>
      <stop offset=".6" stop-color="#fff" stop-opacity=".3"/>
      <stop offset="1" stop-color="#fff" stop-opacity="0"/>
    </radialGradient>
    <mask id="pf-malha"><rect width="320" height="400" fill="url(#pf-fade)"/></mask>
    <radialGradient id="pf-brilho" cx="50%" cy="24%" r="44%">
      <stop offset="0" stop-color="currentColor" stop-opacity=".22"/>
      <stop offset="1" stop-color="currentColor" stop-opacity="0"/>
    </radialGradient>
  </defs>

  <ellipse cx="160" cy="140" rx="146" ry="126" fill="url(#pf-brilho)"/>

  <!-- malha de prancha, apagando para fora pela máscara -->
  <g fill="none" stroke="currentColor" stroke-width=".7" opacity=".5" mask="url(#pf-malha)">
    <path d="M0 0h320"/><path d="M0 0v400"/>
    <path d="M0 40h320"/><path d="M32 0v400"/>
    <path d="M0 80h320"/><path d="M64 0v400"/>
    <path d="M0 120h320"/><path d="M96 0v400"/>
    <path d="M0 160h320"/><path d="M128 0v400"/>
    <path d="M0 200h320"/><path d="M160 0v400"/>
    <path d="M0 240h320"/><path d="M192 0v400"/>
    <path d="M0 280h320"/><path d="M224 0v400"/>
    <path d="M0 320h320"/><path d="M256 0v400"/>
    <path d="M0 360h320"/><path d="M288 0v400"/>
    <path d="M0 400h320"/><path d="M320 0v400"/>
  </g>

  <!-- implantação: o lote em volta do prédio, tracejado, como em planta -->
  <path d="M160 265L284 327L160 389L36 327Z"
        fill="none" stroke="currentColor" stroke-width=".8" opacity=".26" stroke-dasharray="4 6"/>

  <!-- as duas faces visíveis, com preenchimento quase nulo só para dar volume -->
  <path d="M76 96L160 138L160 327L76 285Z"
        fill="url(#pf-face)" stroke="none"/>
  <path d="M244 96L160 138L160 327L244 285Z"
        fill="url(#pf-face)" stroke="none" opacity=".55"/>

  <g fill="none" stroke="url(#pf-fio)" stroke-width="1.1" stroke-linejoin="round">
    <path d="M160 54L244 96L160 138L76 96Z"/>
    <!-- pavimentos: só a aresta da frente -->
    <path d="M76 123L160 165L244 123"/>
    <path d="M76 150L160 192L244 150"/>
    <path d="M76 177L160 219L244 177"/>
    <path d="M76 204L160 246L244 204"/>
    <path d="M76 231L160 273L244 231"/>
    <path d="M76 258L160 300L244 258"/>
    <path d="M76 285L160 327L244 285"/>
    <!-- as três prumadas que se enxergam do volume -->
    <path d="M76 96v189M244 96v189"/>
    <path d="M160 138v189"/>
  </g>

  <g fill="none" stroke="currentColor" stroke-width=".8" opacity=".38">
    <path d="M132.0 124.0v189"/>
    <path d="M188.0 124.0v189"/>
    <path d="M104.0 110.0v189"/>
    <path d="M216.0 110.0v189"/>
  </g>

  <!-- casa de máquinas na cobertura: o detalhe que dá escala ao volume -->
  <g fill="none" stroke="currentColor" stroke-width=".9" opacity=".7">
    <path d="M160 34L190 49L160 64L130 49Z"/>
    <path d="M130 49v15M190 49v15M160 64v15"/>
    <path d="M130 64L160 79L190 64"/>
  </g>

  <!-- cota de altura à esquerda, com marca em cada pavimento -->
  <g fill="none" stroke="currentColor" stroke-width=".8" opacity=".4">
    <path d="M30 96v189"/>
    <path d="M25 96h10M25 285h10"/>
    <path d="M27 123h6"/>
    <path d="M27 150h6"/>
    <path d="M27 177h6"/>
    <path d="M27 204h6"/>
    <path d="M27 231h6"/>
    <path d="M27 258h6"/>
  </g>

  <!-- terreno -->
  <path d="M16 327h288" fill="none" stroke="currentColor"
        stroke-width="1" opacity=".5"/>

  <g fill="currentColor" opacity=".7">
    <circle cx="160" cy="54" r="2.3"/>
    <circle cx="76" cy="96" r="2.3"/>
    <circle cx="244" cy="96" r="2.3"/>
    <circle cx="160" cy="138" r="2.3"/>
    <circle cx="76" cy="285" r="2.3"/>
    <circle cx="244" cy="285" r="2.3"/>
    <circle cx="160" cy="327" r="2.3"/>
  </g>
</svg>';
}

/**
 * Mapa da atuação. Não é cartografia: é um diagrama de malha urbana. Não leva
 * nome de rua nem contorno de município de propósito — desenhar um traçado
 * inventado com cara de mapa oficial de São Paulo afirmaria uma coisa que o
 * desenho não sabe.
 */
function spx_mapa_svg() {
  return '
<svg viewBox="0 0 420 420" role="img">
  <defs>
    <radialGradient id="mp-fundo" cx="50%" cy="46%" r="62%">
      <stop offset="0" stop-color="currentColor" stop-opacity=".14"/>
      <stop offset="1" stop-color="currentColor" stop-opacity="0"/>
    </radialGradient>
    <radialGradient id="mp-fade" cx="50%" cy="50%" r="52%">
      <stop offset="0" stop-color="#fff" stop-opacity="1"/>
      <stop offset=".62" stop-color="#fff" stop-opacity=".85"/>
      <stop offset="1" stop-color="#fff" stop-opacity="0"/>
    </radialGradient>
    <mask id="mp-borda"><rect width="420" height="420" fill="url(#mp-fade)"/></mask>
    <radialGradient id="mp-halo">
      <stop offset="0" stop-color="currentColor" stop-opacity=".55"/>
      <stop offset=".45" stop-color="currentColor" stop-opacity=".16"/>
      <stop offset="1" stop-color="currentColor" stop-opacity="0"/>
    </radialGradient>
    <linearGradient id="mp-feixe" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="currentColor" stop-opacity=".5"/>
      <stop offset="1" stop-color="currentColor" stop-opacity="0"/>
    </linearGradient>
  </defs>

  <circle cx="210" cy="196" r="200" fill="url(#mp-fundo)"/>

  <g mask="url(#mp-borda)" fill="none" stroke="currentColor" stroke-linecap="round">
    <g stroke-width=".7">
      <path opacity="0.14" d="M-113.1 102.5Q202.8 228.1 519.1 352.8M-73.1 11.1Q245.1 132.7 546.2 291.9M-104.7 80.7Q210.4 209.1 514.9 361.0M-53.2 -46.4Q257.4 92.5 577.5 207.8M-170.0 266.6Q153.4 372.0 472.0 491.0M-130.7 143.6Q180.7 280.3 496.9 405.3M-121.8 127.8Q190.7 263.6 518.2 357.7M507.1 -21.3Q367.5 289.1 201.9 586.4M398.7 -78.3Q256.6 230.6 123.7 543.6M433.8 -59.8Q283.2 245.0 140.3 553.6M560.9 124.4Q245.1 263.1 -6.5 499.2M409.0 -82.5Q358.6 258.8 197.0 563.6M233.7 242.2l54.5 20.4M349.8 328.5l-11.4 30.7M400.0 294.5l61.9 30.7M35.2 303.0l-27.5 62.6M43.4 195.2l45.0 18.5M181.1 96.9l43.0 13.9M258.6 139.8l59.2 25.5M387.8 147.7l73.2 34.0M296.1 129.4l-10.1 27.7M62.2 291.0l-32.4 79.5M11.2 372.1l73.5 33.5M156.7 211.0l-14.2 37.0M151.2 49.8l61.4 27.4M63.3 139.7l-25.5 66.2M191.0 179.0l73.4 24.1M40.1 396.2l40.1 14.2M403.9 87.7l60.8 19.4M211.6 283.2l-26.7 63.3M54.4 25.5l-37.3 65.6M117.4 186.4l-12.8 27.5M389.9 252.3l82.7 41.4M33.8 368.7l-16.1 31.2M119.6 257.1l-89.6 20.2M307.1 307.9l-46.3 41.8M335.2 362.8l-26.4 7.2M18.2 360.3l-49.1 29.8M231.4 247.9l-20.6 24.5M124.5 326.2l46.2 23.6M228.3 15.2l35.4 19.3M409.4 237.6l-3.3 33.2"/>
      <path opacity="0.24" d="M-83.6 20.9Q245.0 111.7 557.0 249.1M-157.5 221.6Q166.5 326.0 479.2 460.5M-95.9 55.0Q228.8 156.7 545.4 281.3M-102.5 76.0Q215.3 198.1 519.0 352.0M-177.9 245.0Q138.9 369.3 443.1 522.0M438.3 -65.1Q295.3 243.9 187.0 566.8M480.3 -43.8Q352.6 271.3 211.6 580.8M235.6 -151.5Q95.9 158.5 -44.2 468.2M302.5 -118.6Q199.7 206.1 60.9 517.1M206.7 -164.1Q80.3 151.8 -71.7 456.3M424.3 -65.1Q295.9 250.2 136.2 550.9M82.3 -113.2Q190.3 213.4 196.2 557.2M299.4 -120.3Q257.2 217.1 197.6 552.0M485.1 -16.1Q178.0 131.2 -144.9 239.7M407.3 279.3l28.9 9.3M327.1 401.3l-16.6 42.5M88.3 338.2l-15.3 32.9M198.5 362.9l-11.3 25.8M274.6 244.7l-29.0 66.8M238.1 233.7l-31.7 87.3M110.4 194.6l49.8 23.9M118.1 56.1l82.3 37.6M87.3 216.3l74.4 39.5M333.7 182.4l-14.1 37.9M363.3 395.8l-17.0 32.2M233.6 158.1l30.4 11.6M344.8 185.1l67.1 19.4M302.7 390.7l-12.9 23.5M334.5 407.0l-32.3 70.9M162.9 165.9l-16.4 37.2M109.1 82.2l-26.6 63.7M100.0 79.0l25.9 11.8M162.1 136.5l-37.2 28.8M391.2 324.8l-48.2 40.0M287.7 196.8l17.7 50.4M209.1 175.3l10.7 53.3M290.4 303.4l-35.2 1.3M191.3 401.7l85.7 5.3M234.5 131.1l-91.0 20.4"/>
      <path opacity="0.34" d="M-50.2 -59.7Q263.6 71.5 584.0 185.7M-142.1 161.7Q159.9 318.8 475.5 446.3M-124.2 122.5Q176.6 282.1 492.6 408.7M-153.4 207.3Q154.7 353.1 480.8 452.4M-54.7 -27.0Q261.5 99.5 561.7 260.1M278.0 -127.8Q146.1 185.7 36.8 507.9M434.0 -62.7Q301.9 250.6 159.1 559.2M210.9 -164.0Q60.1 140.8 -74.0 453.4M372.0 -91.4Q256.5 228.6 119.5 540.0M416.4 -67.2Q274.3 241.8 115.3 542.4M493.0 -48.4Q376.8 271.1 259.0 590.1M577.4 114.8Q311.4 327.0 63.6 560.2M-141.2 172.0Q186.5 268.3 489.5 426.1M32.3 -91.3Q168.1 222.8 230.2 559.2M461.3 -21.4Q188.4 181.4 -80.8 389.2M355.7 105.8l-12.3 23.0M367.6 279.2l66.4 32.8M352.8 326.4l-9.1 25.8M386.4 119.1l-20.6 43.1M119.7 155.3l53.0 17.7M204.2 227.7l-36.7 67.1M49.2 36.4l-17.1 44.7M318.7 373.8l72.2 22.9M316.2 384.2l51.1 16.8M331.4 99.9l-25.0 67.6M62.2 52.5l55.5 19.5M400.7 100.9l36.9 18.9M82.3 352.0l-32.0 61.4M369.9 287.9l-21.0 63.9M126.1 349.9l35.4 17.4M303.9 261.4l-27.5 61.9M186.6 365.3l-8.4 24.7M181.0 49.0l29.2 10.3M339.2 326.8l-11.9 30.1M15.2 79.8l71.3 21.8M322.6 345.3l80.6 38.2M323.8 185.3l48.4 22.4M108.5 91.8l50.3 24.4M350.4 143.9l60.6 21.6M231.3 61.9l54.0 56.4M22.6 168.3l-39.2 65.9M168.7 330.2l-65.0 7.4M291.2 235.1l43.9 8.7M194.3 147.5l39.5 15.2M122.3 118.1l38.5 46.6M221.0 404.9l26.7 39.6M65.7 80.9l24.7 36.0M165.1 118.1l-3.0 60.5M93.5 46.4l-4.0 45.4M294.8 191.3l-37.9 47.3"/>
    </g>
    <path stroke-width="1.7" opacity=".46" d="M-79.0 17.7Q229.5 161.8 551.5 272.5M-141.2 171.6Q182.3 278.6 489.3 426.4M384.8 -84.3Q224.6 216.5 108.3 536.9M-19.0 -68.5Q134.8 237.4 213.5 570.5"/>
    <!-- o rio: a curva larga que nenhuma malha respeita -->
    <path d="M-20 96C90 150 120 250 96 330 78 388 120 430 200 440" stroke-width="3"
          opacity=".22"/>
    <path d="M-20 96C90 150 120 250 96 330 78 388 120 430 200 440" stroke-width="8"
          opacity=".07"/>
  </g>

  
  <g class="mapa-pino" style="--atraso:0.00s">
    <circle cx="168" cy="150" r="34" fill="url(#mp-halo)" stroke="none"/>
    <rect x="167" y="150" width="2" height="34" fill="url(#mp-feixe)" stroke="none"/>
    <circle cx="168" cy="150" r="16" class="mapa-onda"/>
    <path d="M168 159c0 0 8-7.6 8-13a8 8 0 1 0-16 0c0 5.4 8 13 8 13Z"/>
    <circle cx="168" cy="146" r="2.6" class="mapa-furo"/>
  </g>
  <g class="mapa-pino" style="--atraso:0.36s">
    <circle cx="236" cy="124" r="34" fill="url(#mp-halo)" stroke="none"/>
    <rect x="235" y="124" width="2" height="34" fill="url(#mp-feixe)" stroke="none"/>
    <circle cx="236" cy="124" r="16" class="mapa-onda"/>
    <path d="M236 133c0 0 8-7.6 8-13a8 8 0 1 0-16 0c0 5.4 8 13 8 13Z"/>
    <circle cx="236" cy="120" r="2.6" class="mapa-furo"/>
  </g>
  <g class="mapa-pino" style="--atraso:0.72s">
    <circle cx="204" cy="206" r="34" fill="url(#mp-halo)" stroke="none"/>
    <rect x="203" y="206" width="2" height="34" fill="url(#mp-feixe)" stroke="none"/>
    <circle cx="204" cy="206" r="16" class="mapa-onda"/>
    <path d="M204 215c0 0 8-7.6 8-13a8 8 0 1 0-16 0c0 5.4 8 13 8 13Z"/>
    <circle cx="204" cy="202" r="2.6" class="mapa-furo"/>
  </g>
  <g class="mapa-pino" style="--atraso:1.08s">
    <circle cx="280" cy="178" r="34" fill="url(#mp-halo)" stroke="none"/>
    <rect x="279" y="178" width="2" height="34" fill="url(#mp-feixe)" stroke="none"/>
    <circle cx="280" cy="178" r="16" class="mapa-onda"/>
    <path d="M280 187c0 0 8-7.6 8-13a8 8 0 1 0-16 0c0 5.4 8 13 8 13Z"/>
    <circle cx="280" cy="174" r="2.6" class="mapa-furo"/>
  </g>
  <g class="mapa-pino" style="--atraso:1.44s">
    <circle cx="140" cy="236" r="34" fill="url(#mp-halo)" stroke="none"/>
    <rect x="139" y="236" width="2" height="34" fill="url(#mp-feixe)" stroke="none"/>
    <circle cx="140" cy="236" r="16" class="mapa-onda"/>
    <path d="M140 245c0 0 8-7.6 8-13a8 8 0 1 0-16 0c0 5.4 8 13 8 13Z"/>
    <circle cx="140" cy="232" r="2.6" class="mapa-furo"/>
  </g>
  <g class="mapa-pino" style="--atraso:1.80s">
    <circle cx="248" cy="268" r="34" fill="url(#mp-halo)" stroke="none"/>
    <rect x="247" y="268" width="2" height="34" fill="url(#mp-feixe)" stroke="none"/>
    <circle cx="248" cy="268" r="16" class="mapa-onda"/>
    <path d="M248 277c0 0 8-7.6 8-13a8 8 0 1 0-16 0c0 5.4 8 13 8 13Z"/>
    <circle cx="248" cy="264" r="2.6" class="mapa-furo"/>
  </g>
  <g class="mapa-pino" style="--atraso:2.16s">
    <circle cx="186" cy="300" r="34" fill="url(#mp-halo)" stroke="none"/>
    <rect x="185" y="300" width="2" height="34" fill="url(#mp-feixe)" stroke="none"/>
    <circle cx="186" cy="300" r="16" class="mapa-onda"/>
    <path d="M186 309c0 0 8-7.6 8-13a8 8 0 1 0-16 0c0 5.4 8 13 8 13Z"/>
    <circle cx="186" cy="296" r="2.6" class="mapa-furo"/>
  </g>
</svg>';
}

/**
 * Duas faixas cruzadas com a logo passando. Entra a marca de tinta clara,
 * invertida em relação ao menu, porque a tira é escura no tema escuro.
 */
function spx_faixa_dupla($classe = '') {
  $html = '
<section class="faixa-dupla SPXCLASSE" aria-hidden="true">
  <div class="fd-tira fd-ida">
    <div class="fd-corre"><span class="fd-peca">
    <img class="fd-marca" src=\'' . spx_img('logo-spx-negativa.webp') . '\' width="300" height="72" alt="" loading="lazy" decoding="async">
    <i>Engenharia · Gestão · Execução</i>
  </span><span class="fd-peca">
    <img class="fd-marca" src=\'' . spx_img('logo-spx-negativa.webp') . '\' width="300" height="72" alt="" loading="lazy" decoding="async">
    <i>Engenharia · Gestão · Execução</i>
  </span><span class="fd-peca">
    <img class="fd-marca" src=\'' . spx_img('logo-spx-negativa.webp') . '\' width="300" height="72" alt="" loading="lazy" decoding="async">
    <i>Engenharia · Gestão · Execução</i>
  </span><span class="fd-peca">
    <img class="fd-marca" src=\'' . spx_img('logo-spx-negativa.webp') . '\' width="300" height="72" alt="" loading="lazy" decoding="async">
    <i>Engenharia · Gestão · Execução</i>
  </span><span class="fd-peca">
    <img class="fd-marca" src=\'' . spx_img('logo-spx-negativa.webp') . '\' width="300" height="72" alt="" loading="lazy" decoding="async">
    <i>Engenharia · Gestão · Execução</i>
  </span><span class="fd-peca">
    <img class="fd-marca" src=\'' . spx_img('logo-spx-negativa.webp') . '\' width="300" height="72" alt="" loading="lazy" decoding="async">
    <i>Engenharia · Gestão · Execução</i>
  </span><span class="fd-peca">
    <img class="fd-marca" src=\'' . spx_img('logo-spx-negativa.webp') . '\' width="300" height="72" alt="" loading="lazy" decoding="async">
    <i>Engenharia · Gestão · Execução</i>
  </span><span class="fd-peca">
    <img class="fd-marca" src=\'' . spx_img('logo-spx-negativa.webp') . '\' width="300" height="72" alt="" loading="lazy" decoding="async">
    <i>Engenharia · Gestão · Execução</i>
  </span></div>
  </div>
  <div class="fd-tira fd-volta">
    <div class="fd-corre"><span class="fd-peca">
    <img class="fd-marca" src=\'' . spx_img('logo-spx-negativa.webp') . '\' width="300" height="72" alt="" loading="lazy" decoding="async">
    <i>Engenharia · Gestão · Execução</i>
  </span><span class="fd-peca">
    <img class="fd-marca" src=\'' . spx_img('logo-spx-negativa.webp') . '\' width="300" height="72" alt="" loading="lazy" decoding="async">
    <i>Engenharia · Gestão · Execução</i>
  </span><span class="fd-peca">
    <img class="fd-marca" src=\'' . spx_img('logo-spx-negativa.webp') . '\' width="300" height="72" alt="" loading="lazy" decoding="async">
    <i>Engenharia · Gestão · Execução</i>
  </span><span class="fd-peca">
    <img class="fd-marca" src=\'' . spx_img('logo-spx-negativa.webp') . '\' width="300" height="72" alt="" loading="lazy" decoding="async">
    <i>Engenharia · Gestão · Execução</i>
  </span><span class="fd-peca">
    <img class="fd-marca" src=\'' . spx_img('logo-spx-negativa.webp') . '\' width="300" height="72" alt="" loading="lazy" decoding="async">
    <i>Engenharia · Gestão · Execução</i>
  </span><span class="fd-peca">
    <img class="fd-marca" src=\'' . spx_img('logo-spx-negativa.webp') . '\' width="300" height="72" alt="" loading="lazy" decoding="async">
    <i>Engenharia · Gestão · Execução</i>
  </span><span class="fd-peca">
    <img class="fd-marca" src=\'' . spx_img('logo-spx-negativa.webp') . '\' width="300" height="72" alt="" loading="lazy" decoding="async">
    <i>Engenharia · Gestão · Execução</i>
  </span><span class="fd-peca">
    <img class="fd-marca" src=\'' . spx_img('logo-spx-negativa.webp') . '\' width="300" height="72" alt="" loading="lazy" decoding="async">
    <i>Engenharia · Gestão · Execução</i>
  </span></div>
  </div>
</section>';
  return str_replace(' SPXCLASSE', $classe ? ' ' . $classe : '', $html);
}
