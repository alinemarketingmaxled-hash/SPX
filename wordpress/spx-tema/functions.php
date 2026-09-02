<?php
/**
 * Tema SPX Engenharia.
 *
 * O tema não usa nenhum plugin, nem gratuito nem pago: tudo o que ele precisa
 * está aqui dentro. É de propósito — plugin é a parte do WordPress que
 * envelhece e abre buraco de segurança, e o site inteiro cabe em PHP nativo.
 */

if (!defined('ABSPATH')) { exit; }

define('SPX_VERSAO', '1.0.0');

require_once get_template_directory() . '/inc/dados.php';
require_once get_template_directory() . '/inc/ajuda.php';
require_once get_template_directory() . '/inc/icones.php';
require_once get_template_directory() . '/inc/componentes.php';
require_once get_template_directory() . '/inc/componentes-2.php';
require_once get_template_directory() . '/inc/arte.php';
require_once get_template_directory() . '/inc/schema.php';
require_once get_template_directory() . '/inc/dominio.php';
require_once get_template_directory() . '/inc/conteudo-tipos.php';
require_once get_template_directory() . '/inc/formulario.php';
require_once get_template_directory() . '/inc/admin.php';
require_once get_template_directory() . '/inc/instalar.php';

/* --------------------------------------------------------- pendências */

/**
 * Registra uma informação que ainda falta. Aparece no painel, nunca na tela
 * de quem visita o site. É o mesmo aviso que o gerador do site estático dava
 * ao final de cada build.
 */
function spx_anota($onde, $oque) {
  $GLOBALS['spx_pendencias'][$onde . ': ' . $oque] = true;
}

function spx_pendencias() {
  return isset($GLOBALS['spx_pendencias']) ? array_keys($GLOBALS['spx_pendencias']) : [];
}

/* ------------------------------------------------------------- tema */

function spx_suporte() {
  add_theme_support('post-thumbnails');
  add_theme_support('html5', ['search-form', 'style', 'script']);
  /* sem 'title-tag' de propósito: cada página tem um título escrito à mão,
     medido para caber nos ~60 caracteres que o Google mostra, e o gerador
     automático do WordPress atropelaria isso */
}
add_action('after_setup_theme', 'spx_suporte');

function spx_assets() {
  $dir = get_template_directory_uri();
  /* A folha vai EMBUTIDA, como no site estático, e pelo mesmo motivo: como
     arquivo à parte ela bloqueia a pintura e a página fica em branco esperando
     um segundo pedido. Medido no Lighthouse com 4G lento, isso é a diferença
     entre 96 e 100 de desempenho.
     wp_register_style + wp_add_inline_style mantém o identificador 'spx' vivo
     para quem depender dele, sem enfileirar o arquivo. */
  wp_register_style('spx', false, [], SPX_VERSAO);
  wp_enqueue_style('spx');
  $folha = get_template_directory() . '/assets/css/spx.css';
  if (is_readable($folha)) {
    wp_add_inline_style('spx', file_get_contents($folha));
  } else {
    /* se o arquivo sumir, é melhor a página sair feia e funcionando do que sem
       estilo nenhum e sem explicação */
    wp_enqueue_style('spx-arquivo', $dir . '/assets/css/spx.css', [], SPX_VERSAO);
  }
  wp_enqueue_script('spx', $dir . '/assets/js/spx.js', [], SPX_VERSAO, true);
  /* o JavaScript é o mesmo do site estático: só precisa saber onde moram as
     imagens, para onde mandar o formulário e qual o contato atual da empresa,
     senão a saída de emergência do formulário apontaria para o telefone que
     estava certo no dia em que o arquivo foi escrito */
  $e = spx('empresa');
  wp_localize_script('spx', 'SPX_WP', [
    'img'   => $dir . '/img/',
    'zap'   => preg_replace('/\D/', '', $e['whatsapp']),
    'email' => $e['email'],
    'erro'  => admin_url('admin-ajax.php?action=spx_erro'),
  ]);
}
add_action('wp_enqueue_scripts', 'spx_assets');

/**
 * O tema é escuro e ponto. O seletor de tema saiu do site quando ficou claro
 * que a versão clara era outro site para manter, com outro jogo de fotos e
 * outro conjunto de contrastes para conferir.
 */
function spx_classe_html($saida) {
  return $saida . ' data-tema="escuro"';
}
add_filter('language_attributes', 'spx_classe_html');

/**
 * Emojis do WordPress fora: são dois pedidos de rede e ~15 KB de JavaScript
 * num site que não usa nenhum.
 */
function spx_limpar_cabecalho() {
  remove_action('wp_head', 'print_emoji_detection_script', 7);
  remove_action('wp_print_styles', 'print_emoji_styles');
  remove_action('wp_head', 'wp_generator');
  remove_action('wp_head', 'wlwmanifest_link');
  remove_action('wp_head', 'rsd_link');
  remove_action('wp_head', 'wp_shortlink_wp_head');
}
add_action('init', 'spx_limpar_cabecalho');

/* --------------------------------------------------- páginas do site */

/**
 * Devolve o identificador da página atual, no mesmo vocabulário que o site
 * estático usava: 'index', 'sobre', 'servicos', 'servico', 'obras'…
 */
function spx_pagina_atual() {
  if (is_front_page()) { return 'index'; }
  if (is_singular('spx_servico')) { return 'servico'; }
  if (is_404()) { return '404'; }
  $p = get_post_field('post_name', get_queried_object_id());
  return $p ? $p : 'pagina';
}

/**
 * Menu principal. Não usa wp_nav_menu: os seis destinos são fixos e fazem
 * parte da estrutura do site, não do conteúdo. Ter isso num menu editável
 * significaria alguém poder apagar /servicos sem perceber.
 */
function spx_menu_itens() {
  return [
    ['/servicos', 'Serviços'],
    ['/obras', 'Projetos'],
    ['/sobre', 'Sobre'],
    ['/para-arquitetos', 'Arquitetos'],
    ['/duvidas', 'Dúvidas'],
  ];
}

/**
 * Abre a página com os dados do cabeçalho.
 *
 * Existe porque o get_header() do WordPress carrega o header.php dentro de uma
 * função: variável criada no template da página não chega lá. O jeito de
 * atravessar é o escopo global, e passar por aqui deixa isso explícito em vez
 * de virar um $GLOBALS solto no meio de cada arquivo.
 */
function spx_cabecalho($spx = []) {
  $GLOBALS['spx'] = $spx;
  get_header();
}

/** Só as larguras de tela usadas nos <link rel=preload> do cabeçalho. */
function spx_preload_foto($fundo) {
  if (!$fundo) { return ''; }
  return '<link rel="preload" as="image" href="' . esc_url(spx_img($fundo . '-640.webp')) . '"
      imagesrcset="' . esc_attr(spx_larguras($fundo)) . '" imagesizes="' . esc_attr(SPX_TAM_TOPO) . '" fetchpriority="high">';
}
