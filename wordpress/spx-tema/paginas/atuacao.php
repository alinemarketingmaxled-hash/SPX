<?php
/**
 * Onde a SPX atua: /atuacao
 *
 * O título da seção do mapa é a pergunta e o primeiro parágrafo é a resposta.
 * Havia antes um bloco de resposta direta acima do mapa dizendo a mesma coisa;
 * ele saiu do desenho, mas a pergunta e a resposta continuam na página — é o
 * que o Google recorta em destaque e o que uma IA copia.
 */

if (!defined('ABSPATH')) { exit; }

$e = spx('empresa');
$regioes = spx('regioes');
$servicos = spx_servicos();

$todas = [];
foreach ($regioes as $grupo) { foreach ($grupo as $n) { $todas[] = $n; } }

$lista = [];
foreach ($todas as $i => $n) {
  $lista[] = ['@type' => 'ListItem', 'position' => $i + 1,
    'item' => ['@type' => 'Place', 'name' => $n,
      'containedInPlace' => ['@type' => 'AdministrativeArea', 'name' => 'São Paulo, SP']]];
}

$spx = [
  'title'     => 'Onde a SPX Engenharia atua | São Paulo e região metropolitana',
  'descricao' => 'Regiões atendidas pela SPX Engenharia: capital paulista e Grande São Paulo, '
    . 'com obra corporativa, comercial, retrofit e manutenção predial.',
  'h1'        => 'Onde a SPX atua',
  'lead'      => 'A base da SPX é São Paulo capital, e o atendimento cobre a cidade e a região '
    . 'metropolitana. Obra corporativa exige engenheiro em campo com frequência. Por isso o '
    . 'raio de atuação é definido pela distância que permite acompanhar de verdade, e não '
    . 'por marketing.',
  'fundo'     => 'restaurante-fachada',
  'visual'    => 'pag-atuacao',
  'trilha'    => [['nome' => 'Início', 'url' => '/'], ['nome' => 'Onde atuamos', 'url' => '/atuacao']],
  'schema'    => [['@type' => 'CollectionPage', 'name' => 'Regiões atendidas pela SPX Engenharia',
    'speakable' => spx_falado(), 'about' => ['@id' => spx_id_empresa()],
    'mainEntity' => ['@type' => 'ItemList', 'name' => 'Regiões atendidas',
      'numberOfItems' => count($todas), 'itemListElement' => $lista]]],
];
spx_cabecalho($spx);
?>

<section class="sec wrap mapa-secao">
  <h2>Quais regiões a <?php echo spx_esc($e['nome']); ?> atende?</h2>
  <div class="mapa-grid">
    <div class="mapa-arte" aria-hidden="true">
<?php echo spx_mapa_svg(); ?>
    </div>
    <div class="mapa-txt" data-reveal>
      <p class="lead">A <?php echo spx_esc($e['nome']); ?> atende <?php echo spx_esc($e['atuacao']); ?>:
      <?php echo count($regioes['São Paulo capital']); ?> regiões na capital e
      <?php echo count($regioes['Grande São Paulo']); ?> cidades da Grande São Paulo,
      listadas abaixo. A avaliação é feita no local, com visita técnica antes de qualquer
      orçamento, e o raio é definido pela distância que permite acompanhar a obra, não por área
      comercial. A maior parte do portfólio está nos polos corporativos e nos bairros de varejo
      de alto padrão.</p>
<?php foreach ($regioes as $grupo => $nomes) : ?>
      <h3 class="mapa-grupo"><?php echo spx_esc($grupo); ?></h3>
      <ul class="grade-regioes"><?php echo spx_lista($nomes); ?></ul>
<?php endforeach; ?>
    </div>
  </div>
</section>

<?php
echo spx_secao('O que significa atender uma região', '
  <p class="sub-secao">Atender não é ter o nome do bairro numa lista. É o que a SPX faz em campo,
  do primeiro contato à entrega.</p>
  ' . spx_cartoes_icone([
    ['icone' => 'visita', 'titulo' => 'Visita antes do orçamento',
     'texto' => 'Um engenheiro vai ao local, mede e levanta as restrições do prédio, do condomínio ou do shopping antes de qualquer número.'],
    ['icone' => 'execucao', 'titulo' => 'Engenheiro em campo',
     'texto' => 'Obra corporativa exige presença com frequência. O raio de atuação é a distância que permite isso de verdade.'],
    ['icone' => 'acompanha', 'titulo' => 'Medição semanal',
     'texto' => 'Avanço medido contra o cronograma, com registro fotográfico e relatório de desvio enquanto ainda dá para corrigir.'],
    ['icone' => 'entrega', 'titulo' => 'Entrega documentada',
     'texto' => 'Vistoria conjunta, lista de pendências fechada, as built e manuais das instalações.'],
  ], 4), 'claro');
?>

<!-- Um convite só, centrado numa faixa de vidro. Antes daqui saíam três blocos
     dizendo a mesma coisa: um título "Não achou a sua região?", o parágrafo
     abaixo dele e ainda a barra genérica de visita técnica. -->
<section class="sec wrap vidro cta-central" data-reveal>
<?php echo spx_cartao_chamada('Sua obra fica fora dessa lista?',
  'Obra fora da lista é avaliada caso a caso, conforme porte e prazo. Conte onde é e o que '
  . 'precisa ser feito: a SPX responde se atende ou não.',
  'Entrar em contato sobre a obra', '/contato', 'local'); ?>
</section>

<?php get_footer();
