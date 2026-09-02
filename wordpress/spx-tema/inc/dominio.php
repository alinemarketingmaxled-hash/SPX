<?php
/**
 * Domínio oficial: canônica e redirecionamento 301.
 *
 * Duas coisas diferentes que costumam ser confundidas:
 *
 * 1. A tag canônica diz ao Google qual é o endereço oficial de cada página.
 *    Ela já existe em todas as páginas do site e aponta para a própria página
 *    — é a forma correta, e não uma canônica fixa na home: canônica apontando
 *    todo mundo para o mesmo lugar tira as páginas internas do índice.
 *
 * 2. O redirect 301 resolve o caso de haver mais de um endereço servindo o
 *    mesmo site — com e sem www, dois domínios, o .vercel.app junto do
 *    domínio próprio. Sem ele, o Google vê duas cópias do site e divide a
 *    autoridade entre elas. A canônica ajuda, mas o 301 é o que resolve.
 *
 * O endereço oficial é o que estiver em Configurações → Geral. Quem chegar
 * por outro host cai aqui e é redirecionado, uma vez só, com 301.
 */

if (!defined('ABSPATH')) { exit; }

/**
 * Redireciona qualquer host que não seja o oficial, preservando o caminho e a
 * query. 301 é permanente: é o código que transfere a autoridade do endereço
 * antigo para o novo. Nunca 302 aqui — 302 diz ao Google que a mudança é
 * temporária e ele mantém o endereço antigo no índice.
 */
/**
 * Endereços que saíram do site e ainda podem ter link apontando para eles.
 *
 * /servicos-e-regioes era o cruzamento de cada serviço com cada região: 1.064
 * itens de lista formados por 27 frases repetidas. A política de spam do
 * Google chama isso pelo nome — repetir as mesmas palavras com tanta
 * frequência que soa artificial — e o risco não ficava na página: ação manual
 * por spam atinge o domínio. A página saiu, e quem chegar pelo endereço antigo
 * é levado para /atuacao, que é onde as regiões têm texto de verdade em volta.
 *
 * 301 e não 302: o 302 diz ao Google que a mudança é temporária, e ele mantém
 * o endereço antigo no índice.
 */
function spx_redirecionar_apagados() {
  if (is_admin() || wp_doing_ajax()) { return; }
  global $wp;
  $caminho = trim(isset($wp->request) ? $wp->request : '', '/');
  $mapa = ['servicos-e-regioes' => '/atuacao'];
  if (isset($mapa[$caminho])) {
    wp_redirect(home_url($mapa[$caminho]), 301);
    exit;
  }
}
add_action('template_redirect', 'spx_redirecionar_apagados', 1);

function spx_forcar_dominio() {
  if (is_admin() || wp_doing_ajax() || (defined('WP_CLI') && WP_CLI)) { return; }
  if (empty($_SERVER['HTTP_HOST']) || empty($_SERVER['REQUEST_URI'])) { return; }

  $oficial = wp_parse_url(home_url('/'), PHP_URL_HOST);
  $veio    = strtolower(sanitize_text_field(wp_unslash($_SERVER['HTTP_HOST'])));
  $veio    = preg_replace('/:\d+$/', '', $veio);

  /* ambiente local não entra nessa: redirecionar localhost para o domínio de
     produção deixaria o site impossível de testar */
  if (in_array($veio, ['localhost', '127.0.0.1', '::1'], true)) { return; }
  if (!$oficial || $veio === strtolower($oficial)) { return; }

  $destino = home_url(sanitize_text_field(wp_unslash($_SERVER['REQUEST_URI'])));
  wp_redirect($destino, 301);
  exit;
}
add_action('template_redirect', 'spx_forcar_dominio', 1);

/**
 * O WordPress publica uma canônica própria em wp_head. O tema já escreve a
 * dele no header.php, então a do núcleo sai — duas tags canônicas na mesma
 * página é o tipo de coisa que faz o Google ignorar as duas.
 */
function spx_uma_canonica_so() {
  remove_action('wp_head', 'rel_canonical');
}
add_action('init', 'spx_uma_canonica_so');
