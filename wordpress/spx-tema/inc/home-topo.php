<?php
/**
 * Peças que só existem no <body> da home, antes do menu: a barra de progresso
 * de leitura, os padrões de hachura que a folha de cronograma usa como
 * preenchimento e a planta de canteiro ao fundo.
 *
 * Os <pattern> precisam existir no documento para o fill="url(#hx)" do desenho
 * achar o que pintar — sem eles a folha do cronograma sai sem trama.
 */

if (!defined('ABSPATH')) { exit; }
?>
<div class="progresso" aria-hidden="true"></div>

<svg width="0" height="0" style="position:absolute" aria-hidden="true"><defs>
<pattern id="hx" width="9" height="9" patternTransform="rotate(25)" patternUnits="userSpaceOnUse">
  <line x1="0" y1="0" x2="0" y2="9" stroke="#8C9296" stroke-width="2.6"/>
</pattern>
<pattern id="hxd" width="9" height="9" patternTransform="rotate(25)" patternUnits="userSpaceOnUse">
  <line x1="0" y1="0" x2="0" y2="9" stroke="#6E90AE" stroke-width="2.6"/>
</pattern>
</defs></svg>

<img class="canteiro" src="<?php echo esc_url(spx_img('canteiro.svg')); ?>" width="1600" height="900" alt="" aria-hidden="true" loading="lazy" decoding="async">
