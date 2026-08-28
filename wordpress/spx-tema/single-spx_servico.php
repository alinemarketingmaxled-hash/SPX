<?php
/**
 * Página de um tipo de serviço: /servicos/reformas, /servicos/retrofit…
 *
 * O conteúdo sai dos dados do serviço, não do editor do WordPress. Cada
 * serviço é um registro com nome, resumo, o que executa, para quem é,
 * diferenciais e perguntas — editável no menu SPX. Isso mantém as oito
 * páginas com a mesma estrutura, que é o que faz o Google entender que são
 * oito serviços da mesma empresa e não oito textos soltos.
 */

if (!defined('ABSPATH')) { exit; }

$slug = get_post_field('post_name', get_queried_object_id());
$s = null;
foreach (spx_servicos() as $cand) {
  if ($cand['slug'] === $slug) { $s = $cand; break; }
}
if (!$s) { status_header(404); get_template_part('404'); return; }

/* nem todo serviço tem pendência: a chave só existe nos que têm */
if (!empty($s['confirmar'])) { spx_anota('Serviço "' . $s['nome'] . '"', $s['confirmar']); }

$foto = $s['fotos'][0];
$d = spx_dim($foto);

$spx = [
  'title'     => $s['title'],
  'descricao' => $s['descricao'],
  'h1'        => $s['h1'],
  'visual'    => 'pag-servico servico-' . $s['slug'],
  'trilha'    => [
    ['nome' => 'Início', 'url' => '/'],
    ['nome' => 'Serviços', 'url' => '/servicos'],
    ['nome' => $s['nome'], 'url' => '/servicos/' . $s['slug']],
  ],
  /* sem foto de topo: o lado direito do cabeçalho é do cartão que vira */
  'ladoTopo' => spx_cartao_vira('
      <span class="vira-tipo">Tipo de obra</span>
      <span class="vira-nome">' . spx_esc($s['nome']) . '</span>
      <span class="vira-foto"><img src="' . esc_url(spx_img($foto . '-640.webp')) . '" width="640"
        height="' . round(640 * $d[1] / $d[0]) . '"
        sizes="(max-width:999px) 92vw, 460px" alt="" loading="lazy" decoding="async"></span>',
    spx_infografico($s), 'Ver o que é ' . mb_strtolower($s['nome'], 'UTF-8')),
  'schema' => [
    spx_schema_servico($s),
    spx_schema_perguntas(array_merge([[$s['pergunta'], $s['resposta']]], $s['faq'])),
    ['@type' => 'WebPage', '@id' => spx_site() . '/servicos/' . $s['slug'] . '#pagina',
     'name' => $s['h1'], 'speakable' => spx_falado(), 'about' => ['@id' => spx_id_empresa()]],
  ],
];
spx_cabecalho($spx);

echo spx_resposta_direta($s['pergunta'], $s['resposta'], $s['fatos']);
?>

<section class="sec wrap" data-reveal>
  <h2><?php echo spx_esc($s['nome']); ?>: <em>o que é</em>, para quem e o que entra</h2>
  <div class="ficha-servico">
    <div class="fs-texto">
      <p class="lead"><?php echo spx_esc($s['oQueE']); ?></p>
      <h3>Para quem é</h3>
      <ul class="marcada"><?php echo spx_lista($s['paraQuem']); ?></ul>
    </div>
    <div class="fs-listas">
      <h3>O que a SPX executa</h3>
      <ul class="fs-itens"><?php echo spx_lista($s['executa']); ?></ul>
      <h3>Diferenciais</h3>
      <ul class="marcada"><?php echo spx_lista($s['diferenciais']); ?></ul>
    </div>
  </div>
</section>

<?php
$baixo = mb_strtolower($s['nome'], 'UTF-8');

echo spx_secao('Como a SPX conduz uma obra de ' . $baixo, '
  <p class="sub-secao">As sete etapas valem para qualquer obra da SPX, e é o mesmo
  engenheiro que responde por todas elas.</p>
  ' . spx_faixa_processo(spx('processo')));

echo spx_secao('Dúvidas sobre ' . $baixo,
  spx_perguntas($s['faq']) .
  spx_cartao_chamada('Ainda tem dúvida?', 'Fale direto com o engenheiro responsável.',
    'Enviar pergunta', '/contato', 'conversa'), 'claro');

/* Relacionados: os três primeiros serviços que não sejam este. Existe para a
   página não ser um beco sem saída — quem entrou por "retrofit" e queria
   "reforma" acha o caminho sem voltar ao menu. */
$relacionados = [];
foreach (spx_servicos() as $o) {
  if ($o['slug'] !== $s['slug']) { $relacionados[] = $o; }
  if (count($relacionados) === 3) { break; }
}
$grade = '<ul class="grade-servicos">';
foreach ($relacionados as $o) {
  $grade .= '<li><a href="' . esc_url(home_url('/servicos/' . $o['slug'])) . '"><b>'
    . spx_esc($o['nome']) . '</b><span>' . spx_esc($o['resumo']) . '</span></a></li>';
}
echo spx_secao('Outros serviços', $grade . '</ul>');

echo spx_chamada($s['cta']);

get_footer();
