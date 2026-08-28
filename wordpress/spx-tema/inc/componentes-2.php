<?php
/**
 * Blocos que dependem de dados editáveis: a órbita das três camadas, o
 * carrossel do acervo, a grade de tipos de obra e o mosaico de fotos.
 *
 * Estes não puderam virar arte pronta como o prédio e o mapa: mudam sozinhos
 * quando o processo, as camadas ou o acervo forem editados no painel.
 */

if (!defined('ABSPATH')) { exit; }

/**
 * Órbita: a SPX no centro e as três camadas girando em volta. Clicar numa
 * delas mostra, ao lado, só as etapas do processo daquela camada — o campo
 * `camada` de cada etapa é quem faz a divisão, então mexer nele muda o
 * diagrama sozinho.
 *
 * São abas de verdade (tablist/tabpanel): quem navega por teclado percorre as
 * bolas com as setas e o leitor de tela anuncia qual camada abriu.
 */
function spx_orbita() {
  $camadas = spx('camadas');
  $processo = spx('processo');

  $grupos = [];
  foreach ($camadas as $c) {
    $c['etapas'] = array_values(array_filter($processo, function ($e) use ($c) {
      return isset($e['camada']) && $e['camada'] === $c['id'];
    }));
    $grupos[] = $c;
  }

  /* As três posições no anel. A conta sai daqui e vira left/top em % do palco:
     porcentagem dentro de `translate` resolveria contra a própria bola, que é
     pequena, e as três acabariam empilhadas em cima da marca. */
  $ang = [-90, 30, 150];  /* topo, direita-baixo, esquerda-baixo */
  $raio = 0.34;           /* fração do lado do palco, do centro à bola */
  $pos = function ($a) use ($raio) {
    $r = deg2rad($a);
    return [
      'x' => number_format(50 + $raio * 100 * cos($r), 2, '.', ''),
      'y' => number_format(50 + $raio * 100 * sin($r), 2, '.', ''),
    ];
  };

  $raios = '';
  foreach ($ang as $a) {
    $p = $pos($a);
    $raios .= '<path class="orbita-raio" data-raio="' . $a . '" opacity=".22"
                d="M160 160L' . number_format($p['x'] * 3.2, 1, '.', '') . ' '
                . number_format($p['y'] * 3.2, 1, '.', '') . '"/>';
  }

  $bolas = '';
  foreach ($grupos as $i => $c) {
    $p = $pos($ang[$i]);
    $bolas .= '
      <button class="orbita-bola" type="button" role="tab" data-orbita-bola
              id="camada-' . esc_attr($c['id']) . '" aria-controls="painel-camada" data-raio="' . $ang[$i] . '"
              style="left:' . $p['x'] . '%;top:' . $p['y'] . '%"
              data-nome="' . esc_attr($c['nome']) . '" data-papel="' . esc_attr($c['papel']) . '"
              aria-selected="' . ($i === 0 ? 'true' : 'false') . '" tabindex="' . ($i === 0 ? '0' : '-1') . '">
        <span class="ob-ico">' . spx_icone($c['icone']) . '</span>
        <b>' . spx_esc($c['nome']) . '</b>
      </button>';
  }

  $partes = '';
  foreach ($grupos as $i => $c) {
    $etapas = '';
    foreach ($c['etapas'] as $e) {
      $etapas .= '
        <li><span class="oe-n">' . spx_esc($e['n']) . '</span>
          <span class="oe-ico" aria-hidden="true">' . spx_icone($e['icone']) . '</span>
          <span class="oe-txt"><b>' . spx_esc($e['nome']) . '</b><span>' . spx_esc($e['texto']) . '</span></span>
        </li>';
    }
    $partes .= '
    <div class="orbita-parte" data-orbita-parte="' . esc_attr($c['id']) . '"' . ($i ? ' hidden' : '') . '>
      <p class="orbita-papel"><b>' . spx_esc($c['nome']) . '</b><span>' . spx_esc($c['papel']) . '</span></p>
      <p class="orbita-resumo">' . spx_esc($c['texto']) . '</p>
      <ol class="orbita-etapas">' . $etapas . '</ol>
    </div>';
  }

  $anel = round($raio * 320);
  return '
<div class="orbita" data-orbita>
  <div class="orbita-palco">
    <svg class="orbita-fio" viewBox="0 0 320 320" aria-hidden="true">
      <g fill="none" stroke="currentColor">
        <circle cx="160" cy="160" r="' . $anel . '" opacity=".14"/>
        <circle cx="160" cy="160" r="' . $anel . '" opacity=".34" stroke-dasharray="2 9" class="orbita-anel"/>
        <circle cx="160" cy="160" r="78" opacity=".1"/>
        ' . $raios . '
      </g>
    </svg>

    <span class="orbita-nucleo" aria-hidden="true">SPX</span>

    <div class="orbita-bolas" role="tablist" aria-label="As três camadas do trabalho da SPX">
      ' . $bolas . '
    </div>
  </div>

  <div class="orbita-painel" id="painel-camada" role="tabpanel"
       aria-labelledby="camada-' . esc_attr($grupos[0]['id']) . '" tabindex="0">
    ' . $partes . '
  </div>
</div>';
}

/**
 * Carrossel em profundidade: o cartão do meio fica de frente e inteiro, os dos
 * lados giram para dentro e recuam.
 *
 * Cada cartão é um <article> de verdade, então quem usa leitor de tela recebe
 * a lista completa mesmo sem enxergar o efeito. As fotos entram por data-fonte
 * e só quando a seção se aproxima da tela: o lazy do navegador começava a
 * baixá-las cedo demais e elas competiam com a foto do topo, que é o maior
 * elemento pintado.
 */
function spx_carrossel() {
  $acervo = spx('acervo');
  $total = count($acervo);

  $itens = '';
  $pontos = '';
  foreach ($acervo as $i => $o) {
    $d = spx_dim($o['foto']);
    $alt = round(480 * $d[1] / $d[0]);
    $itens .= '
      <article class="capa3d-item" data-capa3d-item aria-roledescription="slide"
               aria-label="' . ($i + 1) . ' de ' . $total . '">
        <img data-fonte="' . esc_url(spx_img($o['foto'] . '-480.webp')) . '"
             sizes="(max-width:700px) 78vw, 340px"
             width="480" height="' . $alt . '"
             alt="' . esc_attr($o['titulo'] . ', ' . mb_strtolower($o['linha'], 'UTF-8') . ', obra executada pela SPX Engenharia') . '"
             decoding="async" fetchpriority="low">
        <span class="capa3d-etiqueta">' . spx_esc($o['etiqueta']) . '</span>
        <div class="capa3d-corpo">
          <h3>' . spx_esc($o['titulo']) . '<span>' . spx_esc($o['linha']) . '</span></h3>
          <p>' . spx_esc($o['texto']) . '</p>
          <a class="btn btn-acc" href="' . esc_url(home_url('/contato')) . '" tabindex="-1">Falar sobre uma obra assim ↗</a>
        </div>
      </article>';
    $pontos .= '<button type="button" role="tab" data-capa3d-ponto
      aria-label="' . esc_attr($o['titulo'] . ', ' . $o['linha']) . '"' . ($i === 0 ? ' aria-selected="true"' : '') . '></button>';
  }

  return '
<section class="sec capa3d-bloco" aria-labelledby="acervoTitulo">
  <!-- O título saiu da tela, não do documento. Os cartões do carrossel são
       <h3>; sem um <h2> antes deles a página pula de h1 para h3, e leitor de
       tela que navega por títulos perde o nível do meio. -->
  <h2 id="acervoTitulo" class="so-leitor">Arquivo de obras da SPX Engenharia</h2>

  <div class="capa3d" data-capa3d>
    <button class="capa3d-seta ant" type="button" data-capa3d-ant aria-label="Obra anterior">
      <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M15 5l-7 7 7 7"/></svg>
    </button>

    <div class="capa3d-palco" data-capa3d-palco>' . $itens . '</div>

    <button class="capa3d-seta prox" type="button" data-capa3d-prox aria-label="Próxima obra">
      <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9 5l7 7-7 7"/></svg>
    </button>
  </div>

  <div class="capa3d-pontos" data-capa3d-pontos role="tablist" aria-label="Escolher obra">' . $pontos . '</div>
</section>';
}

/**
 * Grade de serviços onde clicar num cartão abre as fotos daquele tipo de obra
 * logo abaixo. São abas de verdade (tablist/tabpanel), então quem navega por
 * teclado ou leitor de tela entende o que abriu e onde.
 */
function spx_cartoes_obra($itens) {
  $grade = '';
  foreach ($itens as $i => $s) {
    $grade .= '
    <button class="obra-cartao" type="button" role="tab" data-obra-aba
            id="aba-' . esc_attr($s['slug']) . '" aria-controls="painel-obras" aria-selected="false"
            data-fotos="' . esc_attr(implode(',', $s['fotos'])) . '" data-nome="' . esc_attr($s['nome']) . '"
            data-url="' . esc_url(home_url('/servicos/' . $s['slug'])) . '" tabindex="' . ($i === 0 ? '0' : '-1') . '">
      <span class="obra-ico">' . spx_icone($s['icone']) . '</span>
      <b>' . spx_esc($s['nome']) . '</b>
      <span class="obra-txt">' . spx_esc($s['resumo']) . '</span>
      <span class="obra-ver">Ver obras<i aria-hidden="true">+</i></span>
    </button>';
  }
  return '
<div class="obras-abas" data-obras>
  <div class="obras-grade" role="tablist" aria-label="Tipos de obra">' . $grade . '</div>
  <div class="obras-painel" id="painel-obras" role="tabpanel" data-obra-painel hidden>
    <div class="obras-cab">
      <p><b data-obra-titulo></b><span>Ambientes desse tipo, do arquivo da SPX.</span></p>
      <a class="btn" data-obra-link href="' . esc_url(home_url('/servicos')) . '">Ver o serviço ↗</a>
      <button class="obras-fechar" type="button" data-obra-fechar aria-label="Fechar fotos">×</button>
    </div>
    <div class="obras-fotos" data-obra-fotos></div>
  </div>
</div>';
}

/**
 * Mosaico de fotos em faixas, como a coluna direita do modelo: as imagens
 * empilhadas ocupam a altura da lista ao lado.
 */
function spx_mosaico_fotos($nomes) {
  $out = '<div class="mosaico" data-adiar>';
  foreach ($nomes as $i => $f) {
    $d = spx_dim($f);
    $out .= '
  <img data-fonte="' . esc_url(spx_img($f . '-480.webp')) . '" sizes="(max-width:900px) 90vw, 300px"
       width="480" height="' . round(480 * $d[1] / $d[0]) . '" alt=""
       decoding="async" fetchpriority="low" style="--i:' . $i . '">';
  }
  return $out . '</div>';
}

/**
 * Bloco do responsável técnico. Só sai do lugar quando o nome do engenheiro
 * estiver preenchido: é o que sustenta a autoridade técnica do site, e meio
 * bloco com "engenheiro responsável" sem nome não sustenta nada.
 */
function spx_bloco_responsavel() {
  $r = spx('responsavel');
  if (spx_falta($r['nome'])) {
    spx_anota('Página /sobre', 'seção do responsável técnico inteira — nome, formação, '
      . 'especialidades, resumo e foto. É o que sustenta a autoridade técnica do site.');
    return '';
  }

  $linhas = [];
  if (!spx_falta($r['formacao'])) { $linhas[] = ['Formação', $r['formacao']]; }
  if (!spx_falta($r['anosExperiencia'])) {
    $linhas[] = ['Experiência', $r['anosExperiencia'] . ' anos em engenharia civil'];
  }
  if (!spx_falta($r['especialidades'])) {
    $linhas[] = ['Especialidades', implode(', ', $r['especialidades'])];
  }
  $ficha = '';
  foreach ($linhas as $l) {
    $ficha .= '<div><dt>' . spx_esc($l[0]) . '</dt><dd>' . spx_esc($l[1]) . '</dd></div>';
  }

  $foto = spx_falta($r['foto']) ? '' :
    '<img class="perfil-foto" src="' . esc_url(spx_img($r['foto'])) . '" alt="'
    . esc_attr($r['nome'] . ', ' . $r['titulo'] . ' responsável técnico da SPX Engenharia')
    . '" width="420" height="520" loading="lazy" decoding="async">';

  return spx_secao('Responsável técnico', '
  <div class="perfil">
    ' . $foto . '
    <div>
      <h3>' . spx_esc($r['nome']) . '</h3>
      <p class="eyebrow">' . spx_esc($r['titulo']) . '</p>
      ' . (spx_falta($r['resumo']) ? '' : '<p class="lead">' . spx_esc($r['resumo']) . '</p>') . '
      <dl class="ficha-obra">' . $ficha . '</dl>
    </div>
  </div>', 'claro');
}

/**
 * Dados institucionais. Cada linha só aparece se estiver confirmada — é aqui
 * que a diferença entre "não sei" e "inventei" fica visível: faltando o CNPJ,
 * a linha do CNPJ simplesmente não existe.
 */
function spx_dados_institucionais() {
  $e = spx('empresa');
  $r = spx('responsavel');
  $linhas = [
    ['empresa', 'Empresa', $e['nome']],
    ['empresa', 'Razão social', $e['razaoSocial']],
    ['proposta', 'CNPJ', $e['cnpj']],
    ['projeto', 'Segmento', $e['segmento']],
    ['local', 'Base', $e['base']],
    ['local', 'Área de atuação', $e['atuacao']],
    ['local', 'Endereço', $e['endereco']],
    ['art', 'Responsável técnico', $r['nome']],
    ['telefone', 'Telefone', $e['telefone']],
    ['email', 'E-mail', $e['email']],
    ['relogio', 'Atendimento', $e['horario']],
  ];
  /* dentro de <dl>, o <div> só pode conter <dt> e <dd>; envolver os dois num
     segundo <div> quebra a semântica da lista de definições */
  $out = '<dl class="ficha-icone">';
  foreach ($linhas as $l) {
    if (spx_falta($l[2])) { continue; }
    $out .= '<div>' . spx_icone($l[0]) . '<dt>' . spx_esc($l[1]) . '</dt><dd>' . spx_esc($l[2]) . '</dd></div>';
  }
  return $out . '</dl>';
}
