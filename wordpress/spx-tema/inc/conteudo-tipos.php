<?php
/**
 * Tipos de conteúdo do site.
 *
 * Serviço e projeto são registros com estrutura fixa — nome, resumo, o que
 * executa, para quem é, fotos — e não texto livre. Ficam como tipos próprios
 * para o WordPress dar a URL certa (/servicos/reformas) e para o painel poder
 * listá-los, mas o conteúdo de cada um vem dos dados do tema.
 */

if (!defined('ABSPATH')) { exit; }

function spx_registrar_tipos() {
  register_post_type('spx_servico', [
    'labels' => [
      'name' => 'Serviços', 'singular_name' => 'Serviço',
      'menu_name' => 'Serviços', 'all_items' => 'Todos os serviços',
    ],
    'public' => true,
    'show_ui' => true,
    'show_in_menu' => false,          /* aparece dentro do menu SPX */
    'has_archive' => false,           /* o índice é a página /servicos */
    'exclude_from_search' => false,
    'rewrite' => ['slug' => 'servicos', 'with_front' => false],
    'supports' => ['title'],
    'menu_icon' => 'dashicons-hammer',
  ]);

  register_post_type('spx_projeto', [
    'labels' => [
      'name' => 'Projetos', 'singular_name' => 'Projeto',
      'menu_name' => 'Projetos', 'all_items' => 'Todos os projetos',
    ],
    'public' => true,
    'show_ui' => true,
    'show_in_menu' => false,
    'has_archive' => false,           /* o índice é a página /obras */
    'rewrite' => ['slug' => 'obras', 'with_front' => false],
    'supports' => ['title'],
    'menu_icon' => 'dashicons-building',
  ]);
}
add_action('init', 'spx_registrar_tipos');

/**
 * A página /servicos e as páginas /servicos/{slug} dividem o mesmo prefixo.
 * O WordPress resolve a página exata primeiro, mas só se ela existir — daí a
 * instalação criar as duas coisas de uma vez.
 */
function spx_permalink_servico($url, $post) {
  if ($post->post_type === 'spx_servico') {
    return home_url('/servicos/' . $post->post_name);
  }
  if ($post->post_type === 'spx_projeto') {
    return home_url('/obras/' . $post->post_name);
  }
  return $url;
}
add_filter('post_type_link', 'spx_permalink_servico', 10, 2);
