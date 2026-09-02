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
$foto_resposta = isset($s['fotos'][1]) ? $s['fotos'][1] : $foto;

/* O h1 quebra em duas cores: o que a SPX faz em branco, onde faz em acento.
   Os oito terminam em "em São Paulo", então o corte é sempre o mesmo — e o
   nome inteiro continua indo para o schema e para o <title>. */
$onde = ' em São Paulo';
$h1_corpo = $s['h1'];
$h1_onde = '';
if (substr($s['h1'], -strlen($onde)) === $onde) {
  $h1_corpo = substr($s['h1'], 0, -strlen($onde));
  $h1_onde = trim($onde);
}

$spx = [
  'title'       => $s['title'],
  'descricao'   => $s['descricao'],
  'h1'          => $h1_corpo,
  'h1b'         => $h1_onde,
  'lead'        => $s['resumo'],
  'preloadFoto' => $foto,
  'visual'      => 'pag-servico servico-' . $s['slug'],
  'trilha'    => [
    ['nome' => 'Início', 'url' => '/'],
    ['nome' => 'Serviços', 'url' => '/servicos'],
    ['nome' => $s['nome'], 'url' => '/servicos/' . $s['slug']],
  ],
  'topoExtra' => '    <p class="topo-acoes">'
    . spx_vira_botao('cartao-' . $s['slug'], 'Ver o que é ' . mb_strtolower($s['nome'], 'UTF-8'))
    . '</p>',
  /* Sem foto de topo: o lado direito do cabeçalho é do cartão que vira. A foto
     da obra preenche a frente e o nome do serviço vem por cima, num selo de
     vidro — a foto sozinha não diz de que serviço é a página. */
  'ladoTopo' => spx_cartao_vira(
    spx_foto_cartao($foto) . '
      <span class="vira-selo">
        <span class="vira-tipo">Tipo de obra</span>
        <span class="vira-nome">' . spx_esc($s['nome']) . '</span>
      </span>',
    spx_infografico($s), 'Ver o que é ' . mb_strtolower($s['nome'], 'UTF-8'),
    'cartao-' . $s['slug']),
  'schema' => [
    spx_schema_servico($s),
    spx_schema_perguntas(array_merge([[$s['pergunta'], $s['resposta']]], $s['faq'])),
    ['@type' => 'WebPage', '@id' => spx_site() . '/servicos/' . $s['slug'] . '#pagina',
     'name' => $s['h1'], 'speakable' => spx_falado(), 'about' => ['@id' => spx_id_empresa()]],
  ],
];
spx_cabecalho($spx);

echo spx_resposta_direta($s['pergunta'], $s['resposta'], $s['fatos'], $s['icone'], $foto_resposta);
?>

<section class="sec wrap" data-reveal>
  <h2 class="com-risco"><?php echo spx_esc($s['nome']); ?>: <em>o que é</em>, para quem e o que entra</h2>
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
/* Os três seguintes na lista, dando a volta — e não os três primeiros. Pegando
   sempre do começo, os últimos serviços nunca eram apontados por ninguém:
   manutenção, projetos e consultoria ficavam com UM link interno cada, contra
   26 dos outros. Página que ninguém aponta o Google trata como página que
   ninguém considera importante. */
$todos = spx_servicos();
$i0 = 0;
foreach ($todos as $k => $o) { if ($o['slug'] === $s['slug']) { $i0 = $k; break; } }
$relacionados = [];
foreach ([1, 2, 3] as $k) { $relacionados[] = $todos[($i0 + $k) % count($todos)]; }
$grade = '<ul class="grade-servicos">';
foreach ($relacionados as $o) {
  $grade .= '<li><a href="' . esc_url(home_url('/servicos/' . $o['slug'])) . '"><b>'
    . spx_esc($o['nome']) . '</b><span>' . spx_esc($o['resumo']) . '</span></a></li>';
}
echo spx_secao('Outros serviços', $grade . '</ul>');

echo spx_chamada($s['cta']);

get_footer();
