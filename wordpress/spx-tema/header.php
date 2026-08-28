<?php
/**
 * Cabeçalho de todas as páginas: <head>, menu e a abertura com foto.
 *
 * O conteúdo do <head> é escrito aqui, e não deixado para um plugin de SEO:
 * título, descrição, canônica, Open Graph e o grafo de dados estruturados são
 * a parte do site que faz o Google entender que a SPX é uma construtora de São
 * Paulo, e isso não fica na mão de um plugin que pode ser desativado.
 *
 * As variáveis abaixo são definidas pelo template da página antes de chamar
 * get_header(). Todas têm padrão, então uma página nova não quebra nada.
 */

if (!defined('ABSPATH')) { exit; }

$spx = wp_parse_args(isset($GLOBALS['spx']) ? $GLOBALS['spx'] : [], [
  'title'        => '',
  'descricao'    => '',
  'h1'           => '',
  'h1b'          => '',
  'lead'         => '',
  'trilha'       => [],
  'visual'       => '',
  'fundo'        => null,
  'ladoTopo'     => '',
  'fundoCheio'   => false,
  'topoCentrado' => false,
  'topoExtra'    => '',
  'schema'       => [],
  'noindex'      => false,
]);
?>
<!DOCTYPE html>
<html <?php language_attributes(); ?>>
<head>
<meta charset="<?php bloginfo('charset'); ?>">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title><?php echo spx_esc($spx['title']); ?></title>
<?php /* página que não vai ao índice não declara canônica: canônica de um
         endereço que não deve ser indexado é sinal contraditório */
if (!$spx['noindex']) : ?>
<link rel="canonical" href="<?php echo esc_url(spx_url_atual()); ?>">
<meta property="og:url" content="<?php echo esc_url(spx_url_atual()); ?>">
<?php endif; ?>
<meta name="description" content="<?php echo esc_attr($spx['descricao']); ?>">
<meta name="theme-color" content="#000000">
<?php if ($spx['noindex']) : ?>
<meta name="robots" content="noindex">
<?php endif; ?>
<meta property="og:type" content="website">
<meta property="og:title" content="<?php echo esc_attr($spx['title']); ?>">
<meta property="og:description" content="<?php echo esc_attr($spx['descricao']); ?>">
<meta property="og:image" content="<?php echo esc_url(spx_img('og.jpg')); ?>">
<meta property="og:site_name" content="<?php echo esc_attr(spx('empresa.nome')); ?>">
<meta property="og:locale" content="pt_BR">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="<?php echo esc_attr($spx['title']); ?>">
<meta name="twitter:image" content="<?php echo esc_url(spx_img('og.jpg')); ?>">
<meta name="geo.region" content="BR-SP">
<meta name="geo.placename" content="São Paulo">
<link rel="icon" type="image/png" href="<?php echo esc_url(spx_img('favicon.png')); ?>">
<?php
echo spx_preload_foto($spx['fundo']);
/* o tema é aplicado antes da pintura para a página não piscar clara */
?>
<script>document.documentElement.setAttribute('data-tema','escuro');</script>
<script type="application/ld+json">
<?php echo spx_json_ld($spx['schema'], $spx['trilha']); ?>
</script>
<?php wp_head(); ?>
</head>
<body <?php body_class($spx['visual']); ?>>
<a class="pular" href="#conteudo">Pular para o conteúdo</a>
<?php
/* a home tem três peças próprias antes do menu: barra de progresso, os padrões
   de hachura que o desenho do cronograma usa e a planta de canteiro ao fundo */
if (is_front_page()) { require get_template_directory() . '/inc/home-topo.php'; }
?>
<div class="hatch" aria-hidden="true"></div>

<nav class="nav" aria-label="Principal"><div class="wrap nav-in">
  <div class="navpill">
    <a href="<?php echo esc_url(home_url('/')); ?>" class="navlogo" aria-label="<?php echo esc_attr(spx('empresa.nome')); ?> · início">
      <img class="marca" src="<?php echo esc_url(spx_img('logo-spx.webp')); ?>" width="300" height="72" alt="" aria-hidden="true"></a>
    <?php
    $atual = isset($spx['trilha'][1]) ? $spx['trilha'][1]['url'] : '/' . spx_pagina_atual();
    foreach (spx_menu_itens() as $m) {
      printf('<a href="%s" class="link%s">%s</a>',
        esc_url(home_url($m[0])), $atual === $m[0] ? ' ativo' : '', spx_esc($m[1]));
    }
    ?>
    <a href="<?php echo esc_url(home_url('/contato')); ?>" class="cta">Contato</a>
    <button class="nav-btn nav-menu" type="button" data-acao="menu" aria-expanded="false" aria-controls="gaveta" aria-label="Abrir menu">
      <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 7h16M4 12h16M4 17h16"/></svg>
    </button>
  </div>
</div></nav>

<div class="gaveta" id="gaveta" aria-hidden="true" aria-label="Menu de navegação">
  <button class="gaveta-fechar" type="button" data-acao="fechar-menu" aria-label="Fechar menu">×</button>
  <p class="eyebrow"><?php echo spx_esc(spx('empresa.nome')); ?></p>
  <nav aria-label="Navegação mobile">
    <?php foreach (spx_menu_itens() as $i => $m) {
      printf('<a href="%s">%s <i>0%d</i></a>', esc_url(home_url($m[0])), spx_esc($m[1]), $i + 1);
    } ?>
    <a href="<?php echo esc_url(home_url('/atuacao')); ?>">Onde atuamos <i>0<?php echo count(spx_menu_itens()) + 1; ?></i></a>
  </nav>
  <div class="rodape-gaveta">
    <a class="btn" href="<?php echo esc_url(home_url('/contato')); ?>">Agendar visita técnica</a>
    <a class="btn btn-ghost" href="tel:<?php echo esc_attr(preg_replace('/\D/', '', spx('empresa.telefone'))); ?>"><?php
      echo spx_esc(str_replace('+55 ', '', spx('empresa.telefone'))); ?></a>
  </div>
</div>

<main id="conteudo">
<?php if ($spx['h1']) : ?>
<header class="topo-interno<?php
  echo $spx['fundo'] ? ' com-foto' : '';
  echo $spx['fundoCheio'] ? ' foto-fundo' : '';
  echo $spx['topoCentrado'] ? ' topo-centrado' : ''; ?>">
<?php if ($spx['ladoTopo']) : ?>  <div class="wrap topo-duplo"><?php endif; ?>
  <div class="<?php echo $spx['ladoTopo'] ? '' : 'wrap '; ?>topo-in">
<?php echo spx_migalhas($spx['trilha']); ?>
    <h1><?php echo spx_esc($spx['h1']);
        echo $spx['h1b'] ? '<em>' . spx_esc($spx['h1b']) . '</em>' : ''; ?></h1>
<?php if ($spx['lead']) : ?>    <p class="lead topo-lead"><?php echo spx_esc($spx['lead']); ?></p>
<?php endif; ?>
<?php echo $spx['topoExtra']; ?>
  </div>
<?php if ($spx['ladoTopo']) : ?>  <div class="topo-lado"><?php echo $spx['ladoTopo']; ?></div>
  </div><?php endif; ?>
<?php if ($spx['fundo']) : ?>  <div class="topo-foto" aria-hidden="true">
    <div class="hero-fundo" id="heroFundo" data-fotos="<?php echo esc_attr(implode(',', array_map(function ($f) { return spx_img($f); }, spx_fotos($spx['fundo'])))); ?>">
      <img class="ativa" src="<?php echo esc_url(spx_img($spx['fundo'] . '-640.webp')); ?>"
           srcset="<?php echo esc_attr(spx_larguras($spx['fundo'])); ?>" sizes="<?php echo esc_attr(SPX_TAM_TOPO); ?>"
           width="<?php echo spx_dim($spx['fundo'])[0]; ?>" height="<?php echo spx_dim($spx['fundo'])[1]; ?>" alt=""
           fetchpriority="high" decoding="async">
    </div>
    <div class="hero-veu"></div>
  </div>
<?php endif; ?>
</header>
<?php endif; ?>
