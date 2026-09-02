<?php
/**
 * Dúvidas frequentes: /duvidas
 *
 * O cartão fica ao lado do título e a foto é o fundo da primeira tela. Antes
 * o cartão ficava numa seção abaixo do cabeçalho, com a foto num painel à
 * direita: eram dois blocos disputando a mesma faixa da tela.
 */

if (!defined('ABSPATH')) { exit; }

$e = spx('empresa');
$duvidas = spx('duvidas');
$temas = spx('temas');

/* um ícone diferente por pergunta, em rodízio, para a lista não virar uma
   parede de blocos iguais */
$icoDuvida = ['empresa', 'corporativa', 'retrofit', 'reforma', 'gerencia', 'projeto', 'compat',
              'art', 'local', 'proposta', 'visita', 'cronograma', 'execucao', 'laudo'];

$spx = [
  'title'     => 'Dúvidas frequentes sobre obras corporativas | SPX Engenharia',
  'descricao' => 'Respostas objetivas sobre o que a SPX Engenharia faz, como funciona a visita '
    . 'técnica, prazo, orçamento, obra em ambiente ocupado e responsabilidade técnica.',
  'h1'        => 'Dúvidas frequentes.',
  'h1b'       => 'Respondidas pela engenharia.',
  'preloadFoto' => 'lounge-recepcao',
  'visual'    => 'pag-duvidas',
  /* Mesma abertura das páginas de serviço: um painel só, texto de um lado e o
     cartão do outro. A foto era o fundo da tela inteira e passou para dentro
     do cartão, com a marca num selo de vidro sobre ela — atrás do texto ela
     brigava com a leitura, e o cartão ficava um retângulo escuro no meio. */
  'ladoTopo'  => spx_cartao_vira(
    spx_foto_cartao('lounge-recepcao') . '
      <span class="vira-selo vira-selo-marca">
        <img src="' . esc_url(spx_img('logo-negativa.webp')) . '" width="723" height="304"
          alt="' . esc_attr(spx('empresa.nome')) . '" decoding="async">
        <span class="vira-legenda">Engenharia · Gestão · Execução</span>
      </span>', '
      <span class="vira-titulo">A SPX em três linhas</span>
      <ul class="marcas-fato">
        <li>' . spx_icone('local') . '<span>Atua em São Paulo capital e na região metropolitana.</span></li>
        <li>' . spx_icone('execucao') . '<span>Executa obra corporativa, comercial, retrofit, reforma, gerenciamento, manutenção, projeto e laudo.</span></li>
        <li>' . spx_icone('art') . '<span>Cada obra tem engenheiro responsável nomeado, com ART, antes da assinatura do contrato.</span></li>
      </ul>', 'Ver o que a SPX faz', 'cartao-spx'),
  'topoExtra' => '
    <h2 class="topo-pergunta">O que a ' . spx_esc($e['nome']) . ' faz?</h2>
    <p class="lead topo-lead">' . spx_esc($e['definicao']) . ' ' . spx_esc($e['proposta']) . '
    As perguntas que mais chegam estão respondidas de forma direta abaixo. Para obra com prazo
    crítico, concorrência ou adequação de norma, envie o contexto completo.</p>
    <p class="topo-acoes">' . spx_vira_botao('cartao-spx', 'Ver o que a SPX faz') . '</p>',
  'trilha'    => [['nome' => 'Início', 'url' => '/'], ['nome' => 'Dúvidas', 'url' => '/duvidas']],
  'schema'    => [
    spx_schema_perguntas($duvidas),
    ['@type' => 'QAPage', 'speakable' => spx_falado(), 'about' => ['@id' => spx_id_empresa()]],
  ],
];
spx_cabecalho($spx);
?>

<section class="sec wrap faq-central">
  <div class="faq-topo">
    <h2>Perguntas e respostas</h2>
    <div class="faq-busca">
      <label for="faqBusca" class="so-leitor">Buscar nas perguntas</label>
      <svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="11" cy="11" r="6.5"/><path d="m16 16 4.5 4.5"/></svg>
      <input id="faqBusca" type="search" placeholder="Buscar por palavra: prazo, ocupado, ART…"
             autocomplete="off" data-faq-busca>
    </div>
    <p class="faq-vazio" data-faq-vazio hidden>Nenhuma pergunta com esse termo.
    <a href="<?php echo esc_url(home_url('/contato')); ?>">Pergunte diretamente à equipe</a>.</p>
  </div>
<?php
foreach ($temas as $i => $t) {
  /* o tema lista as perguntas pelo enunciado; aqui elas voltam a encontrar a
     própria resposta na lista completa */
  $pares = [];
  foreach ($t[1] as $q) {
    foreach ($duvidas as $d) {
      if ($d[0] === $q) { $pares[] = $d; break; }
    }
  }
  echo '<div class="faq-tema" data-faq-tema>
    <h3><span class="faq-tema-n">' . str_pad((string) ($i + 1), 2, '0', STR_PAD_LEFT) . '</span>'
    . spx_esc($t[0]) . '</h3>
    <div class="faq-lista">';
  foreach ($pares as $k => $par) {
    $ico = $icoDuvida[($i * 4 + $k) % count($icoDuvida)];
    echo '<details class="q-item com-ico" data-faq-item><summary>' . spx_icone($ico)
      . '<span>' . spx_esc($par[0]) . '</span></summary><p>' . spx_esc($par[1]) . '</p></details>';
  }
  echo '</div>
  </div>';
}
?>
</section>

<?php
echo spx_chamada(spx('chamadas.orcamento'));
get_footer();
