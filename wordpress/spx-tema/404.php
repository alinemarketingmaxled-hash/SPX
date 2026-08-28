<?php
/**
 * Página de erro 404. Leva noindex: endereço que não existe não deve entrar
 * no índice do Google, e rodapé curto — é página de saída, a grade inteira de
 * links competiria com os dois botões que interessam.
 */

if (!defined('ABSPATH')) { exit; }

$spx = [
  'title'       => 'Página não encontrada · SPX Engenharia',
  'descricao'   => 'Essa página saiu de planta. Volte para a home da SPX Engenharia ou fale direto com a equipe técnica.',
  'visual'      => 'corpo-erro',
  'noindex'     => true,
  'rodapeCurto' => true,
];
spx_cabecalho($spx);
?>
<svg width="0" height="0" style="position:absolute" aria-hidden="true"><defs>
<pattern id="hx" width="9" height="9" patternTransform="rotate(25)" patternUnits="userSpaceOnUse">
  <line x1="0" y1="0" x2="0" y2="9" stroke="#8C9296" stroke-width="2.6"/>
</pattern>
</defs></svg>

<img class="canteiro" src="<?php echo esc_url(spx_img('canteiro.svg')); ?>" width="1600" height="900" alt="" aria-hidden="true" loading="lazy" decoding="async">

<div class="erro"><?php /* o <main id="conteudo"> vem do cabeçalho */ ?>
  <div class="wrap">
    <p class="codigo">404</p>
    <p class="eyebrow centro">Erro 404 · endereço não localizado</p>
    <h1 style="margin:20px auto 0;max-width:20ch">Esta página não está disponível.</h1>
    <p class="lead centro" style="margin:16px auto 0">O endereço pode ter mudado ou a página foi removida. Retorne à página inicial ou fale com a equipe técnica.</p>
    <div class="acoes">
      <a class="btn" href="/">Voltar à página inicial</a>
      <a class="btn btn-ghost" href="<?php echo esc_url(home_url('/#contato')); ?>">Falar com a equipe</a>
    </div>
    <div class="atalhos">
      <a href="<?php echo esc_url(home_url('/#arquivo')); ?>">Arquivo de obras</a>
      <a href="<?php echo esc_url(home_url('/#servicos')); ?>">Serviços</a>
      <a href="<?php echo esc_url(home_url('/#metodo')); ?>">Método SPX</a>
      <a href="<?php echo esc_url(home_url('/#atuacao')); ?>">Raio de atuação</a>
      <a href="<?php echo esc_url(home_url('/#duvidas')); ?>">Dúvidas frequentes</a>
    </div>
  </div>
  <div class="pecas" id="pecas"></div>
</div>
<?php get_footer();
