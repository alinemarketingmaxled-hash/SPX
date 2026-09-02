<?php
/**
 * Blocos de página reaproveitados. São a tradução um-a-um dos componentes do
 * gerador do site estático: mesmo HTML, mesmas classes, mesmo CSS.
 *
 * Todos devolvem string em vez de imprimir, para poderem ser encaixados uns
 * dentro dos outros como eram antes.
 */

if (!defined('ABSPATH')) { exit; }

/* --------------------------------------------------------- texto e listas */

/**
 * Resposta direta: pergunta como título, resposta na primeira frase. É o
 * formato que vira trecho em destaque no Google e é o que uma IA copia
 * quando alguém pergunta. Sem rodeio antes da resposta.
 */
function spx_resposta_direta($pergunta, $resposta, $fatos = [], $ic = '', $foto = null) {
  $itens = '';
  foreach ($fatos as $f) { $itens .= '<li>' . spx_esc($f) . '</li>'; }
  $lista = $fatos ? '<ul class="fatos">' . $itens . '</ul>' : '';
  $icone = $ic ? '<span class="rd-ico">' . spx_icone($ic) . '</span>' : '';
  $img = '';
  if ($foto) {
    $d = spx_dim($foto);
    $img = '<div class="rd-foto"><img src="' . esc_url(spx_img($foto . '-640.webp')) . '"
      srcset="' . esc_attr(spx_larguras($foto)) . '"
      sizes="(max-width:900px) 92vw, 46vw" width="' . $d[0] . '" height="' . $d[1] . '"
      alt="" loading="lazy" decoding="async"></div>';
  }
  return '
<section class="sec wrap" data-reveal>
  <div class="resposta-direta' . ($foto ? ' rd-painel' : '') . '">
    <div class="rd-txt">
      <div class="rd-cab">' . $icone . '
        <h2>' . spx_esc($pergunta) . '</h2>
      </div>
      <p>' . spx_esc($resposta) . '</p>
      ' . $lista . '
    </div>
    ' . $img . '
  </div>
</section>';
}

function spx_secao($titulo, $dentro, $classe = '') {
  return '<section class="sec wrap ' . esc_attr($classe) . '"><h2>' . spx_esc($titulo) . '</h2>' . $dentro . '</section>';
}

/** Faixa de chamada solta, com uma frase e um botão. */
function spx_chamada($texto, $rotulo = 'Solicitar visita técnica') {
  return '<section class="sec wrap cta-faixa" data-reveal>
  <p class="cta-frase">' . spx_esc($texto) . '</p>
  <a class="btn btn-acc" href="' . esc_url(home_url('/contato')) . '">' . spx_esc($rotulo) . '&nbsp;↗</a>
</section>';
}

/** Barra de chamada colada no bloco de cima, como nos modelos. */
function spx_barra_cta($pergunta, $rotulo, $url = '/contato') {
  return '<div class="barra-cta">
  <p>' . spx_esc($pergunta) . '</p>
  <a class="btn btn-acc" href="' . esc_url(home_url($url)) . '">' . spx_esc($rotulo) . '&nbsp;↗</a>
</div>';
}

/**
 * Linha do tempo numerada com fio ligando as etapas. É o padrão que mais se
 * repete nas referências, e resolve bem o processo de sete passos.
 */
function spx_linha_tempo($etapas) {
  $out = '<ol class="linha-tempo">';
  foreach ($etapas as $e) {
    $out .= '
  <li>
    <span class="lt-marca">' . spx_icone($e['icone']) . '<b>' . spx_esc($e['n']) . '</b></span>
    <div class="lt-txt"><h3>' . spx_esc($e['nome']) . '</h3><p>' . spx_esc($e['texto']) . '</p></div>
  </li>';
  }
  return $out . '</ol>';
}

/** Lista numerada em linhas escuras, com ícone e número à esquerda. */
function spx_lista_numerada($itens) {
  $out = '<ol class="lista-num">';
  foreach ($itens as $k => $i) {
    $out .= '
  <li><span class="ln-n">' . str_pad((string) ($k + 1), 2, '0', STR_PAD_LEFT) . '</span>
    <span class="ln-ico">' . spx_icone($i['icone']) . '</span>
    <span class="ln-txt"><b>' . spx_esc($i['titulo']) . '</b><span>' . spx_esc($i['texto']) . '</span></span>
  </li>';
  }
  return $out . '</ol>';
}

/** Lista de perguntas em <details>, usada fora da página de dúvidas. */
function spx_perguntas($pares) {
  $out = '<div class="faq-lista">';
  foreach ($pares as $p) {
    $out .= '<details class="q-item"><summary>' . spx_esc($p[0]) . '</summary><p>' . spx_esc($p[1]) . '</p></details>';
  }
  return $out . '</div>';
}

/* ------------------------------------------------------------- cartões */

/**
 * Cartão que vira. As duas faces existem no HTML o tempo todo — o giro é
 * `rotateY` com `backface-visibility`, e não troca de conteúdo — então quem
 * usa leitor de tela recebe frente e verso mesmo sem enxergar a animação.
 *
 * O botão é uma peça separada, e não o cartão inteiro: com o cartão sendo o
 * botão, o nome acessível dele virava todo o texto das duas faces e a WCAG
 * reprova quando o nome não contém o rótulo visível.
 */
function spx_cartao_vira($frente, $verso, $rotulo = 'Ver as informações', $id = '') {
  /* As duas faces existem no HTML o tempo todo — o giro é rotateY com
     backface-visibility, e não troca de conteúdo — então quem usa leitor de
     tela recebe frente e verso mesmo sem enxergar a animação.

     Com $id o botão sai daqui e vai para a coluna do texto, do outro lado do
     cabeçalho; quem liga um ao outro é o aria-controls. */
  $botao = $id ? '' : '<button class="vira-btn" type="button" data-vira-btn aria-pressed="false">'
    . spx_esc($rotulo) . '<i aria-hidden="true">↻</i></button>';
  return '<div class="vira" data-vira' . ($id ? ' id="' . esc_attr($id) . '"' : '') . '>
  <div class="vira-caixa" data-vira-palco>
    <div class="vira-face vira-frente">' . $frente . '</div>
    <div class="vira-face vira-verso">' . $verso . '</div>
  </div>
  ' . $botao . '
</div>';
}

/** O mesmo botão, do outro lado do cabeçalho. O aria-controls é o que liga um
    ao outro — para o JavaScript achar o cartão e para o leitor de tela dizer o
    que aquele botão comanda. */
function spx_vira_botao($id, $rotulo) {
  return '<button class="btn btn-fio vira-solto" type="button" data-vira-btn
    aria-controls="' . esc_attr($id) . '" aria-pressed="false">' . spx_esc($rotulo)
    . '<i aria-hidden="true">↻</i></button>';
}

/** A foto que preenche a frente do cartão da abertura. É a maior imagem acima
    da dobra nessas páginas, então entra com prioridade alta e sem lazy. */
function spx_foto_cartao($arq) {
  $d = spx_dim($arq);
  return '<span class="vira-foto"><img src="' . esc_url(spx_img($arq . '-640.webp')) . '"
        srcset="' . esc_attr(spx_larguras($arq)) . '" sizes="' . esc_attr(SPX_TAM_TOPO) . '"
        width="' . $d[0] . '" height="' . $d[1] . '" alt=""
        fetchpriority="high" decoding="async"></span>';
}

function spx_cartao_chamada($titulo, $apoio, $rotulo, $url = '/contato', $ic = 'conversa') {
  return '
<div class="cartao-cta">
  <span class="cc-ico">' . spx_icone($ic) . '</span>
  <b>' . spx_esc($titulo) . '</b>
  <span class="cc-apoio">' . spx_esc($apoio) . '</span>
  <a class="btn btn-acc" href="' . esc_url(home_url($url)) . '">' . spx_esc($rotulo) . '&nbsp;↗</a>
</div>';
}

/**
 * Grade de cartões com ícone. `extra` entra como último item — é por onde o
 * cartão de chamada ocupa a célula que sobraria vazia numa lista ímpar.
 */
function spx_cartoes_icone($itens, $colunas = 4, $extra = '') {
  $out = '<ul class="cartoes-icone" style="--colunas:' . intval($colunas) . '">';
  foreach ($itens as $i) {
    $temUrl = !empty($i['url']);
    $out .= '
  <li>' . ($temUrl ? '<a href="' . esc_url(home_url($i['url'])) . '">' : '<div>') . '
    ' . spx_icone($i['icone']) . '
    <b>' . spx_esc($i['titulo']) . '</b>
    <span>' . spx_esc($i['texto']) . '</span>
  ' . ($temUrl ? '</a>' : '</div>') . '</li>';
  }
  if ($extra) { $out .= '<li class="ci-cta">' . $extra . '</li>'; }
  return $out . '</ul>';
}

/** Bloco de duas colunas: conteúdo à esquerda, arte técnica à direita. */
function spx_bloco_duplo($esquerda, $direita, $invertido = false) {
  return '<div class="bloco-duplo' . ($invertido ? ' invertido' : '') . '">
  <div class="bd-txt">' . $esquerda . '</div>
  <div class="bd-arte" aria-hidden="true">' . $direita . '</div>
</div>';
}

/* --------------------------------------------------------- processo */

/**
 * Fluxo em serpentina: a primeira fileira corre para a direita, a segunda
 * volta para a esquerda, e um fio liga uma etapa na outra.
 *
 * As posições saem daqui, não do CSS: com sete etapas a segunda fileira tem
 * uma coluna a menos, e é a conta abaixo que decide onde cada uma cai.
 */
function spx_fluxo_serpente($etapas, $colunas = 4) {
  $out = '
<ol class="fluxo" style="--colunas:' . intval($colunas) . '">';
  $total = count($etapas);
  foreach ($etapas as $i => $e) {
    $linha = intdiv($i, $colunas) + 1;
    $dentro = $i % $colunas;
    /* fileira par corre ao contrário, daí a coluna espelhada */
    $col = ($linha % 2) ? $dentro + 1 : $colunas - $dentro;
    $ultimoDaFileira = ($dentro === $colunas - 1);
    $ultimo = ($i === $total - 1);
    $lig = $ultimo ? 'fim' : ($ultimoDaFileira ? 'desce' : (($linha % 2) ? 'dir' : 'esq'));
    $out .= '
  <li style="--col:' . $col . ';--lin:' . $linha . '" data-lig="' . $lig . '">
    <span class="fx-topo"><span class="fx-ico">' . spx_icone($e['icone']) . '</span><span class="fx-n">' . spx_esc($e['n']) . '</span></span>
    <b>' . spx_esc($e['nome']) . '</b>
    <span class="fx-txt">' . spx_esc($e['texto']) . '</span>
  </li>';
  }
  return $out . '</ol>';
}

/**
 * O processo numa faixa horizontal, com fio ligando as etapas. Mesma
 * informação da linha do tempo vertical, num formato que cabe na abertura de
 * uma página sem tomar uma tela inteira.
 */
function spx_faixa_processo($etapas) {
  $out = '
<ol class="proc-faixa">';
  foreach ($etapas as $e) {
    $out .= '
  <li>
    <span class="pf-marca">' . spx_icone($e['icone']) . '</span>
    <span class="pf-n">' . spx_esc($e['n']) . '</span>
    <b>' . spx_esc($e['nome']) . '</b>
  </li>';
  }
  return $out . '</ol>';
}

/**
 * Faixa de números colada na abertura: ícone, valor e rótulo em colunas.
 * É uma barra fechada, e não uma grade solta no meio do corpo.
 */
function spx_faixa_numeros($itens) {
  $out = '
<div class="faixa-num">';
  foreach ($itens as $n) {
    $pre = isset($n['prefixo']) && !spx_falta($n['prefixo']) ? $n['prefixo'] : '';
    $suf = isset($n['sufixo']) && !spx_falta($n['sufixo']) ? $n['sufixo'] : '';
    $out .= '
  <div>
    <span class="fn-ico">' . spx_icone($n['icone']) . '</span>
    <b data-conta="' . esc_attr($n['valor']) . '"'
      . ($pre ? ' data-prefixo="' . esc_attr($pre) . '"' : '')
      . ($suf ? ' data-sufixo="' . esc_attr($suf) . '"' : '') . '>'
      . spx_esc($pre . $n['valor'] . $suf) . '</b>
    <span class="fn-rot">' . spx_esc($n['rotulo']) . '</span>
  </div>';
  }
  return $out . '</div>';
}

/* ------------------------------------------------------------ fotos */

/**
 * Chamada final com foto de obra do lado: a última coisa da página é um
 * convite, e ele fica mais forte com uma obra real ao lado.
 *
 * O título aceita HTML porque as páginas destacam uma palavra com <em>.
 */
function spx_chamada_foto($foto, $titulo, $apoio, $rotulo, $url = '/contato') {
  $d = spx_dim($foto);
  return '
<section class="sec wrap" data-reveal>
  <div class="cta-foto" data-adiar>
    <div class="cf-foto">
      <img data-fonte="' . esc_url(spx_img($foto . '-640.webp')) . '" width="' . $d[0] . '" height="' . $d[1] . '"
           alt="" aria-hidden="true" loading="lazy" decoding="async">
    </div>
    <div class="cf-txt">
      <p class="cf-titulo">' . wp_kses($titulo, ['em' => [], 'br' => []]) . '</p>
      <p class="cf-apoio">' . spx_esc($apoio) . '</p>
      <a class="btn btn-acc" href="' . esc_url(home_url($url)) . '">' . spx_esc($rotulo) . '&nbsp;↗</a>
    </div>
  </div>
</section>';
}

/**
 * Verso do cartão de serviço: infográfico, não parágrafo. Tudo o que aparece
 * aqui é dado que já existe — o escopo é a lista `executa` do próprio serviço,
 * a trilha é o processo de sete etapas, e os prazos são os compromissos que o
 * site já assume em toda página. Nenhuma porcentagem inventada: sem número
 * medido, gráfico de pizza é desenho bonito mentindo.
 */
function spx_infografico($s) {
  $frentes = count($s['executa']);
  $processo = spx('processo');

  $barras = '';
  for ($k = 0; $k < $frentes; $k++) { $barras .= '<i style="--i:' . $k . '"></i>'; }

  $listaExecuta = '';
  foreach (array_slice($s['executa'], 0, 4) as $e) {
    $listaExecuta .= '<i>' . spx_esc($e) . '</i>';
  }
  if ($frentes > 4) { $listaExecuta .= '<i class="ig-mais">+' . ($frentes - 4) . '</i>'; }

  $trilha = '';
  foreach ($processo as $e) { $trilha .= '<i><u>' . spx_esc($e['n']) . '</u></i>'; }

  return '
<span class="ig">
  <span class="ig-bloco">
    <span class="ig-rot">O que entra <b>' . $frentes . ' frente' . ($frentes > 1 ? 's' : '') . '</b></span>
    <span class="ig-barras" aria-hidden="true">' . $barras . '</span>
    <span class="ig-lista">' . $listaExecuta . '</span>
  </span>

  <span class="ig-bloco">
    <span class="ig-rot">Como anda <b>' . count($processo) . ' etapas</b></span>
    <span class="ig-trilha" aria-hidden="true">' . $trilha . '</span>
    <span class="ig-pe">Do levantamento à entrega, com medição semanal do avanço.</span>
  </span>

  <span class="ig-bloco">
    <span class="ig-rot">Prazos que a SPX assume</span>
    <span class="ig-chips">
      <i><b>5</b><u>dias úteis · orçamento preliminar</u></i>
      <i><b>10</b><u>dias úteis · proposta detalhada</u></i>
      <i><b>ART</b><u>emitida antes de assinar</u></i>
    </span>
  </span>
</span>';
}
