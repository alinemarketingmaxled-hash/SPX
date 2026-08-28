<?php
/**
 * Página de uma obra: /obras/{slug}
 *
 * Só existe para projeto com tipo, atuação e fotos confirmados. Sem isso o
 * WordPress devolve 404 em vez de publicar uma página de obra com lacuna —
 * portfólio pela metade convence menos do que portfólio menor.
 */

if (!defined('ABSPATH')) { exit; }

$slug = get_post_field('post_name', get_queried_object_id());
$p = null;
foreach (spx_projetos() as $cand) {
  if ($cand['slug'] === $slug) { $p = $cand; break; }
}
if (!$p) { status_header(404); nocache_headers(); get_template_part('404'); return; }

$tipo = spx_falta($p['tipo']) ? 'obra' : mb_strtolower($p['tipo'], 'UTF-8');

$spx = [
  'title'     => $p['nome'] . ' · ' . $p['regiao'] . ', São Paulo | ' . spx('empresa.nome'),
  'descricao' => $p['nome'] . ': ' . $tipo . ' na região ' . $p['regiao'] . ', em São Paulo, '
    . 'com atuação da SPX Engenharia em ' . mb_strtolower($p['atuacao'], 'UTF-8') . '.',
  'h1'        => $p['nome'] . ' · ' . $p['regiao'],
  'trilha'    => [['nome' => 'Início', 'url' => '/'], ['nome' => 'Projetos', 'url' => '/obras'],
                  ['nome' => $p['nome'], 'url' => '/obras/' . $p['slug']]],
  'schema'    => [['@type' => 'CreativeWork', 'name' => $p['nome'], 'about' => $p['tipo'],
                   'creator' => ['@id' => spx_id_empresa()],
                   'locationCreated' => ['@type' => 'Place', 'name' => $p['regiao'] . ', São Paulo']]],
];
spx_cabecalho($spx);

$ficha = '';
foreach ([['Região', 'regiao'], ['Cidade', 'cidade'], ['Tipo de obra', 'tipo'],
          ['Atuação da SPX', 'atuacao'], ['Período', 'periodo']] as $l) {
  if (spx_falta($p[$l[1]])) { continue; }
  $ficha .= '<div><dt>' . spx_esc($l[0]) . '</dt><dd>' . spx_esc($p[$l[1]]) . '</dd></div>';
}
?>
<section class="sec wrap" data-reveal>
  <dl class="ficha-obra"><?php echo $ficha; ?></dl>
</section>
<?php
if (!spx_falta($p['escopo'])) {
  echo spx_secao('Escopo executado', '<ul class="marcada">' . spx_lista($p['escopo']) . '</ul>', 'claro');
}
foreach ([['O desafio', 'desafio'], ['A solução', 'solucao'], ['Resultado', 'resultado']] as $o) {
  if (spx_falta($p[$o[1]])) { continue; }
  echo spx_secao($o[0], '<p class="lead">' . spx_esc($p[$o[1]]) . '</p>');
}

$galeria = '<div class="galeria-obra">';
foreach ($p['fotos'] as $f) {
  $galeria .= '<img src="' . esc_url(spx_img($f . '-960.webp')) . '" srcset="'
    . esc_attr(spx_img($f . '-480.webp') . ' 480w, ' . spx_img($f . '-640.webp') . ' 640w, '
               . spx_img($f . '-960.webp') . ' 960w') . '"
    sizes="(max-width:700px) 100vw, 33vw" alt="' . esc_attr($p['nome'] . ', ' . $tipo
    . ' executada pela SPX Engenharia ' . $p['regiao'] . ', São Paulo') . '"
    loading="lazy" decoding="async" width="960" height="1363">';
}
echo spx_secao('Registro da obra', $galeria . '</div>');

echo spx_chamada(spx('chamadas.projeto'));
get_footer();
