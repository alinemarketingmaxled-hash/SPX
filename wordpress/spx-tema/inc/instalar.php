<?php
/**
 * Instalação: ao ativar o tema, o site já sobe pronto.
 *
 * Cria as páginas com os endereços certos, os registros de serviço e projeto,
 * define a home e regrava os links permanentes. Sem isso, ativar o tema daria
 * um site vazio e alguém teria que criar dez páginas à mão com o slug exato —
 * e um slug errado quebra o menu e a URL que o Google já conhece.
 */

if (!defined('ABSPATH')) { exit; }

function spx_paginas_do_site() {
  return [
    'sobre'               => 'Sobre a SPX',
    'servicos'            => 'Serviços',
    'obras'               => 'Projetos',
    'atuacao'             => 'Onde atuamos',
    'contato'             => 'Contato',
    'duvidas'             => 'Dúvidas frequentes',
    'para-arquitetos'     => 'Para arquitetos',
    'privacidade'         => 'Política de privacidade',
    'servicos-e-regioes'  => 'Serviços e regiões atendidas',
  ];
}

function spx_ao_ativar() {
  /* home */
  $home = get_page_by_path('inicio');
  if (!$home) {
    $id = wp_insert_post(['post_type' => 'page', 'post_status' => 'publish',
                          'post_title' => 'Início', 'post_name' => 'inicio']);
    $home = get_post($id);
  }
  update_option('show_on_front', 'page');
  update_option('page_on_front', $home->ID);

  foreach (spx_paginas_do_site() as $slug => $titulo) {
    if (get_page_by_path($slug)) { continue; }
    wp_insert_post(['post_type' => 'page', 'post_status' => 'publish',
                    'post_title' => $titulo, 'post_name' => $slug]);
  }

  /* um registro por serviço, com o slug que já está indexado */
  spx_registrar_tipos();
  foreach (spx('servicos') as $s) {
    if (get_page_by_path($s['slug'], OBJECT, 'spx_servico')) { continue; }
    wp_insert_post(['post_type' => 'spx_servico', 'post_status' => 'publish',
                    'post_title' => $s['nome'], 'post_name' => $s['slug']]);
  }
  foreach (spx_projetos() as $p) {
    if (get_page_by_path($p['slug'], OBJECT, 'spx_projeto')) { continue; }
    wp_insert_post(['post_type' => 'spx_projeto', 'post_status' => 'publish',
                    'post_title' => $p['nome'], 'post_name' => $p['slug']]);
  }

  /* endereços sem /index.php/ no meio */
  $estrutura = get_option('permalink_structure');
  if (!$estrutura) { update_option('permalink_structure', '/%postname%/'); }
  flush_rewrite_rules();
}
add_action('after_switch_theme', 'spx_ao_ativar');
