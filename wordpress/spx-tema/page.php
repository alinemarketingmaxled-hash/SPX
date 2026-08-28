<?php
/**
 * Despachante das páginas fixas.
 *
 * Cada endereço do site tem um arquivo em paginas/. Uma página criada no
 * WordPress sem arquivo correspondente cai no caso final e é impressa com o
 * conteúdo do editor — assim dá para criar página nova pelo painel sem mexer
 * em código, e sem que isso quebre as páginas que têm layout próprio.
 */

if (!defined('ABSPATH')) { exit; }

$slug = get_post_field('post_name', get_queried_object_id());
$arquivo = get_template_directory() . '/paginas/' . $slug . '.php';

if ($slug && file_exists($arquivo)) {
  require $arquivo;
  return;
}

/* página avulsa: título e conteúdo do editor, dentro da moldura do site */
the_post();
$spx = [
  'title'     => wp_get_document_title(),
  'descricao' => wp_trim_words(wp_strip_all_tags(get_the_content()), 28, ''),
  'h1'        => get_the_title(),
  'trilha'    => [['nome' => 'Início', 'url' => '/'],
                  ['nome' => get_the_title(), 'url' => '/' . $slug]],
];
spx_cabecalho($spx);
?>
<section class="sec wrap" data-reveal>
  <div class="texto-editor"><?php the_content(); ?></div>
</section>
<?php get_footer();
