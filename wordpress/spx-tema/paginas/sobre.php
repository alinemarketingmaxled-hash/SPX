<?php
/**
 * Sobre a SPX: /sobre
 *
 * A foto vira o fundo da primeira tela e tudo assenta centrado em cima dela.
 * A página chegou a dizer a mesma coisa duas vezes seguidas — o lead do
 * cabeçalho e a resposta direta logo abaixo eram o mesmo parágrafo, palavra
 * por palavra. Virou um texto só. A pergunta que abria o bloco removido é
 * agora o subtítulo do cabeçalho: continua sendo um h2 com a resposta na
 * primeira frase, que é o que o Google recorta em destaque.
 */

if (!defined('ABSPATH')) { exit; }

$e = spx('empresa');
$servicos = spx_servicos();
$numeros = spx_numeros();

$fatos = [
  'Base em ' . $e['base'] . ', com atuação em ' . $e['atuacao'] . '.',
  'Especialidade: obra executada sem parar a operação do cliente.',
  'Cronograma físico-financeiro entregue junto da proposta, não depois de assinar.',
  'Engenheiro responsável nomeado, com ART emitida antes da assinatura.',
  'Executa ' . count($servicos) . ' frentes, de obra corporativa a laudo e vistoria.',
];

$spx = [
  'title'     => 'Sobre a ' . $e['nome'] . ' | Engenharia de obras corporativas em São Paulo',
  'descricao' => 'A ' . $e['nome'] . ' planeja, gerencia e executa obras corporativas e comerciais em '
    . 'São Paulo. Quem somos, como trabalhamos e quem responde tecnicamente pela obra.',
  'h1'        => 'Sobre a ' . $e['nome'],
  'fundo'     => 'sala-reuniao-azul',
  'visual'    => 'pag-sobre',
  'fundoCheio' => true,
  'topoCentrado' => true,
  'topoExtra' => '
    <h2 class="topo-pergunta">O que é a ' . spx_esc($e['nome']) . '?</h2>
    <p class="lead topo-lead">' . spx_esc($e['definicao']) . ' ' . spx_esc($e['proposta']) . '
    A empresa tem um ano de operação e é conduzida pelo próprio engenheiro
    responsável, com nove anos de obra antes de abrir o CNPJ.</p>
    <ul class="fatos fatos-centro">' . spx_lista($fatos) . '</ul>',
  'trilha'    => [['nome' => 'Início', 'url' => '/'], ['nome' => 'Sobre', 'url' => '/sobre']],
  'schema'    => array_filter([
    spx_schema_pessoa(), spx_schema_processo(),
    ['@type' => 'AboutPage', 'name' => 'Sobre a ' . $e['nome'], 'speakable' => spx_falado(),
     'mainEntity' => ['@id' => spx_id_empresa()]],
  ]),
];
spx_cabecalho($spx);
?>

<section class="sec wrap" data-reveal>
  <?php echo $numeros ? spx_faixa_numeros($numeros) : ''; ?>
</section>

<?php
/* Linha do tempo centralizada: o fio desce pelo meio e cada marco pendura
   nele, com o texto de um lado e a foto do outro, trocando de lado a cada
   marco. As fotos são obra do acervo ao lado do marco, e não o registro dele
   — por isso a legenda diz o que a foto é de verdade, e é ela que vai também
   no alt. */
$hist = '';
foreach (spx('historia') as $h) {
  $foto = '';
  if (!spx_falta($h['foto'])) {
    $d = spx_dim($h['foto']);
    $foto = '
      <figure class="hi-foto">
        <img src="' . esc_url(spx_img($h['foto'] . '-640.webp')) . '"
          srcset="' . esc_attr(spx_larguras($h['foto'])) . '"
          sizes="(max-width:860px) 88vw, 40vw" width="' . $d[0] . '" height="' . $d[1] . '"
          alt="' . esc_attr($h['legenda']) . '" loading="lazy" decoding="async">
        <figcaption>' . spx_esc($h['legenda']) . '</figcaption>
      </figure>';
  }
  $hist .= '
    <li>
      <span class="hi-marca" aria-hidden="true"></span>
      <div class="hi-txt">
        <span class="hi-n">' . spx_esc($h['n']) . '</span>
        <b>' . spx_esc($h['titulo']) . '</b>
        <p>' . spx_esc($h['texto']) . '</p>
      </div>' . $foto . '
    </li>';
}
echo spx_secao('Como a SPX começou', '
  <p class="sub-secao">Uma empresa de um ano, tocada por um engenheiro com nove.</p>
  <ol class="historia">' . $hist . '</ol>', 'vidro faixa-vidro');

echo spx_bloco_responsavel();

echo spx_secao('Como trabalhamos', spx_faixa_processo(spx('processo')));

$grade = '<ul class="grade-servicos">';
foreach ($servicos as $s) {
  $grade .= '<li><a href="' . esc_url(home_url('/servicos/' . $s['slug'])) . '"><b>'
    . spx_esc($s['nome']) . '</b><span>' . spx_esc($s['resumo']) . '</span></a></li>';
}
echo spx_secao('O que a SPX executa', '
  <p class="sub-secao">' . count($servicos) . ' frentes, conduzidas pela mesma engenharia
  em ' . spx_esc($e['atuacao']) . '.</p>
  ' . $grade . '</ul>', 'claro');

echo spx_secao('Engenharia, gestão e execução na mesma mão', '
  <p class="lead">Engenharia, gestão e execução são três coisas diferentes, e a maioria dos
  problemas de obra nasce quando estão em mãos diferentes. Na SPX estão na mesma: quem levanta
  é quem orça, quem orça é quem planeja, quem planeja é quem executa e responde.</p>
  ' . spx_cartoes_icone([
    ['icone' => 'projeto', 'titulo' => 'Engenharia', 'texto' => 'O que fazer, como fazer e o que a norma exige.'],
    ['icone' => 'cronograma', 'titulo' => 'Gestão', 'texto' => 'Cronograma, coordenação, medição e controle de desvio.'],
    ['icone' => 'execucao', 'titulo' => 'Execução', 'texto' => 'Equipe em campo, com responsável técnico nomeado.'],
  ], 3));

echo spx_secao('Dados institucionais', spx_dados_institucionais());

echo spx_chamada_foto('lounge-recepcao', 'Vamos fazer<br>o seu projeto <em>acontecer</em>.',
  'Fale com um engenheiro da SPX.', 'Solicitar visita técnica');

get_footer();
