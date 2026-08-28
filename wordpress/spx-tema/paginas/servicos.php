<?php
/**
 * Índice de serviços: /servicos
 */

if (!defined('ABSPATH')) { exit; }

$e = spx('empresa');
$servicos = spx_servicos();

$partes = [];
foreach ($servicos as $s) {
  $partes[] = ['@type' => 'Service', 'name' => $s['nome'],
               'url' => spx_site() . '/servicos/' . $s['slug']];
}

$spx = [
  'title'     => 'Serviços de engenharia e execução de obras | SPX Engenharia',
  'descricao' => 'Obras corporativas e comerciais, retrofit, reformas, gerenciamento, manutenção '
    . 'e projetos. Engenharia, gestão e execução pela mesma equipe, em São Paulo.',
  'h1'        => 'Serviços de engenharia, gestão e execução',
  'lead'      => $e['proposta'] . ' A SPX não vende mão de obra: vende a engenharia que decide o que '
    . 'fazer, a gestão que mantém o prazo e a execução que entrega.',
  'fundo'     => 'estante-espinha-peixe',
  'visual'    => 'pag-servicos',
  'trilha'    => [['nome' => 'Início', 'url' => '/'], ['nome' => 'Serviços', 'url' => '/servicos']],
  'schema'    => [
    spx_schema_processo(),
    ['@type' => 'CollectionPage', 'name' => 'Serviços da SPX Engenharia',
     'speakable' => spx_falado(), 'about' => ['@id' => spx_id_empresa()],
     'hasPart' => $partes],
  ],
];
spx_cabecalho($spx);
?>

<section class="sec wrap" data-reveal>
  <h2>O que <em>executamos</em></h2>
  <p class="sub-secao">Soluções completas para cada tipo de necessidade.</p>
  <?php echo spx_cartoes_obra($servicos); ?>
  <?php echo spx_barra_cta('Qual desses serviços faz sentido para o seu projeto?', 'Solicitar avaliação'); ?>
</section>

<section class="sec wrap" data-reveal>
  <h2>Como <em>trabalhamos</em></h2>
  <p class="sub-secao">Toque numa das camadas para ver as etapas que ela responde.</p>
  <?php echo spx_orbita(); ?>
</section>

<?php echo spx_faixa_dupla(); ?>

<section class="sec wrap" data-reveal>
  <h2>O que vem junto,<br>em qualquer <em>serviço</em>.</h2>
  <?php echo spx_bloco_duplo(spx_lista_numerada([
    ['icone' => 'visita', 'titulo' => 'Visita técnica antes do orçamento', 'texto' => 'Nenhuma obra é orçada por telefone.'],
    ['icone' => 'proposta', 'titulo' => 'Proposta discriminada', 'texto' => 'Serviço a serviço, com quantidade e critério de medição.'],
    ['icone' => 'cronograma', 'titulo' => 'Cronograma físico-financeiro', 'texto' => 'Entregue junto da proposta, não depois de assinar.'],
    ['icone' => 'art', 'titulo' => 'Responsável técnico nomeado', 'texto' => 'Com ART emitida para a obra.'],
    ['icone' => 'relatorio', 'titulo' => 'Relatório semanal', 'texto' => 'Avanço medido contra o previsto, com registro fotográfico.'],
    ['icone' => 'asbuilt', 'titulo' => 'As built e manuais na entrega', 'texto' => 'Para a próxima intervenção não começar às cegas.'],
  ]), spx_predio_fio()); ?>
  <?php echo spx_barra_cta('Vamos começar o seu projeto?', 'Solicitar visita técnica'); ?>
</section>

<?php get_footer();
