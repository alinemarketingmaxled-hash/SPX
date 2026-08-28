<?php
/**
 * Índice de projetos: /obras
 *
 * Sem foto de topo: aqui quem abre a página é o carrossel, e uma foto grande
 * antes dele empurrava o portfólio inteiro para baixo da dobra.
 */

if (!defined('ABSPATH')) { exit; }

$regioes = spx('regioes');
$publicaveis = spx_projetos();

$spx = [
  'title'     => 'Projetos e obras realizadas em São Paulo | SPX Engenharia',
  'descricao' => 'Obras corporativas e comerciais executadas pela SPX Engenharia em São Paulo: '
    . 'escritórios, lojas, restaurantes e retrofit, do levantamento à entrega.',
  'h1'        => 'Projetos realizados',
  'visual'    => 'pag-obras',
  'trilha'    => [['nome' => 'Início', 'url' => '/'], ['nome' => 'Projetos', 'url' => '/obras']],
];
spx_cabecalho($spx);

echo spx_carrossel();

if ($publicaveis) {
  $grade = '<ul class="grade-obras">';
  foreach ($publicaveis as $p) {
    $grade .= '<li><a href="' . esc_url(home_url('/obras/' . $p['slug'])) . '"><b>'
      . spx_esc($p['nome']) . '</b><span>' . spx_esc($p['regiao']) . ' · ' . spx_esc($p['atuacao'])
      . '</span></a></li>';
  }
  echo spx_secao('Obras', $grade . '</ul>', 'claro');
}
?>

<section class="sec wrap" data-reveal>
  <h2>O que a SPX <em>documenta</em><br>em toda obra</h2>
  <p class="sub-secao">Obra que não deixa registro não vira referência para a próxima.</p>
  <?php echo spx_bloco_duplo(spx_lista_numerada([
    ['icone' => 'asbuilt', 'titulo' => 'As built', 'texto' => 'A planta do que foi realmente construído, com as alterações de campo.'],
    ['icone' => 'proposta', 'titulo' => 'Memorial de acabamentos', 'texto' => 'O que foi aplicado, onde, de qual fornecedor.'],
    ['icone' => 'relatorio', 'titulo' => 'Manuais e garantias', 'texto' => 'De cada equipamento e sistema instalado.'],
    ['icone' => 'acompanha', 'titulo' => 'Registro fotográfico semanal', 'texto' => 'O antes, o durante e o depois de cada frente.'],
    ['icone' => 'cronograma', 'titulo' => 'Cronograma medido', 'texto' => 'O previsto contra o realizado, semana a semana.'],
    ['icone' => 'entrega', 'titulo' => 'Lista de pendências fechada', 'texto' => 'Assinada na vistoria conjunta de entrega.'],
  ]), spx_mosaico_fotos(['estante-espinha-peixe', 'banheiro-marmore', 'restaurante-salao'])); ?>
</section>

<section class="sec wrap" data-reveal>
  <h2>Tipos de obra <em>no portfólio</em></h2>
  <?php echo spx_cartoes_obra(array_slice(spx_servicos(), 0, 8)); ?>
  <?php echo spx_barra_cta('Qual desses se parece com o seu projeto?', 'Solicitar avaliação'); ?>
</section>

<section class="sec wrap" data-reveal>
  <h2>Onde essas obras <em>acontecem</em></h2>
  <div class="mapa-grid">
    <div class="mapa-arte" aria-hidden="true"><?php echo spx_mapa_svg(); ?></div>
    <div class="mapa-txt">
      <p class="lead">A maior parte do portfólio está na capital, nos polos corporativos e nos
      bairros de varejo de alto padrão.</p>
      <ul class="grade-regioes"><?php echo spx_lista($regioes['São Paulo capital']); ?></ul>
      <p style="margin-top:var(--e3)"><a class="btn" href="<?php echo esc_url(home_url('/atuacao')); ?>">Ver todas as regiões ↗</a></p>
    </div>
  </div>
</section>

<?php get_footer();
