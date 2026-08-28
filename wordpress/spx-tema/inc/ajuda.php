<?php
/**
 * Utilitários do tema: acesso aos dados, imagens responsivas e escape.
 *
 * A regra que atravessa este arquivo é a mesma do site estático: nada que
 * esteja marcado como pendente vai para a tela. Onde o WordPress ainda não
 * tem um valor salvo, vale o padrão de inc/dados.php; onde nem lá existe,
 * o bloco inteiro deixa de ser impresso em vez de sair vazio ou inventado.
 */

if (!defined('ABSPATH')) { exit; }

/* ------------------------------------------------------------- dados */

/**
 * Lê um dado pelo caminho: spx('empresa.telefone'), spx('servicos').
 *
 * A ordem é sempre a mesma — primeiro o que foi salvo no painel, depois o
 * padrão do arquivo. É isso que faz o tema funcionar recém-instalado, antes
 * de alguém abrir o admin, e continuar funcionando depois que ela editar.
 */
function spx($caminho, $padrao = SPX_FALTA) {
  static $cache = null;
  if ($cache === null) {
    $salvo = get_option('spx_dados', []);
    $cache = is_array($salvo)
      ? spx_mesclar(spx_dados_padrao(), $salvo)
      : spx_dados_padrao();
  }
  $v = $cache;
  foreach (explode('.', $caminho) as $parte) {
    if (!is_array($v) || !array_key_exists($parte, $v)) { return $padrao; }
    $v = $v[$parte];
  }
  return $v;
}

/**
 * Mescla o que veio do painel por cima do padrão, sem deixar campo vazio
 * apagar informação boa: string em branco no admin significa "não mexi",
 * não "quero isso vazio no site".
 */
function spx_mesclar($padrao, $salvo) {
  foreach ($salvo as $k => $v) {
    if ($v === '' || $v === null) { continue; }
    if (is_array($v) && isset($padrao[$k]) && is_array($padrao[$k]) && !isset($v[0])) {
      $padrao[$k] = spx_mesclar($padrao[$k], $v);
    } else {
      $padrao[$k] = $v;
    }
  }
  return $padrao;
}

/** Escape de texto para dentro do HTML. */
function spx_esc($t) {
  return esc_html((string) $t);
}

/** Lista de <li> a partir de um array de textos. */
function spx_lista($itens) {
  $out = '';
  foreach ($itens as $i) { $out .= '<li>' . spx_esc($i) . '</li>'; }
  return $out;
}

/* ---------------------------------------------------------- imagens */

/**
 * Medidas originais de cada foto. Vão no width/height do <img> para o
 * navegador reservar o espaço antes de baixar a imagem — sem isso a página
 * salta enquanto carrega, e salto de layout conta contra no PageSpeed.
 */
function spx_dimensoes() {
  return [
    'sala-reuniao-azul' => [1127, 1600], 'recepcao-marmore' => [1600, 1066],
    'lounge-recepcao' => [1067, 1600],   'mesa-vista-sp' => [960, 1280],
    'estante-espinha-peixe' => [1200, 1600], 'restaurante-fachada' => [720, 1280],
    'banheiro-marmore' => [1200, 1600],  'lavabo-azul' => [1067, 1600],
    'cozinha-marcenaria' => [900, 1600], 'restaurante-salao' => [720, 1280],
    'lavabo-terracota' => [1200, 1600],
  ];
}

function spx_dim($arq) {
  $d = spx_dimensoes();
  return isset($d[$arq]) ? $d[$arq] : [1200, 1600];
}

/** URL de uma imagem do tema. */
function spx_img($arquivo) {
  return get_template_directory_uri() . '/img/' . $arquivo;
}

/**
 * srcset com as larguras que existem em disco. A geração pula qualquer
 * largura maior ou igual à original, então pedir por ela daria 404.
 */
function spx_larguras($arq) {
  $orig = spx_dim($arq)[0];
  $partes = [];
  foreach ([480, 640, 768, 960] as $w) {
    if ($w < $orig) { $partes[] = spx_img($arq . '-' . $w . '.webp') . ' ' . $w . 'w'; }
  }
  return implode(', ', $partes);
}

/**
 * Prefixa com a pasta de imagens do tema cada URL de uma lista de srcset.
 * Recebe 'a-480.webp 480w, a-640.webp 640w' e devolve a mesma lista com o
 * caminho completo — trocar a lista inteira de uma vez colocaria as vírgulas
 * dentro de uma URL só.
 */
function spx_srcset($lista) {
  $partes = [];
  foreach (explode(',', $lista) as $p) {
    $p = trim($p);
    if ($p === '') { continue; }
    $pedacos = explode(' ', $p, 2);
    $partes[] = spx_img($pedacos[0]) . (isset($pedacos[1]) ? ' ' . $pedacos[1] : '');
  }
  return implode(', ', $partes);
}

/** As medidas do painel de foto do cabeçalho, iguais às do CSS. */
const SPX_TAM_TOPO = '(min-width:1000px) min(44vw, 500px), 100vw';

/** A foto da página abre o rodízio, seguida de outras três da mesma família. */
function spx_fotos($arq) {
  $todas = array_keys(spx_dimensoes());
  $i = array_search($arq, $todas, true);
  if ($i === false) { $i = 0; }
  $saida = [$arq];
  foreach ([1, 2, 3] as $n) {
    $saida[] = $todas[($i + $n * 3) % count($todas)];
  }
  return array_values(array_unique($saida));
}

/* ----------------------------------------------------------- listas */

/**
 * Serviços publicáveis. Hoje todos passam; a função existe para o dia em que
 * um serviço depender de confirmação para poder ir ao ar.
 */
function spx_servicos() {
  return array_values(array_filter(spx('servicos'), function ($s) {
    return !spx_falta($s['nome']);
  }));
}

/**
 * Projeto só é publicado com tipo, atuação e fotos. Sem isso a página sairia
 * com lacuna ou com texto genérico fingindo ser descrição de obra real — e o
 * rodapé aprendeu a não linkar o que não existe.
 */
function spx_projetos() {
  return array_values(array_filter(spx('projetos'), function ($p) {
    if (spx_falta($p['tipo']) || spx_falta($p['atuacao'])) { return false; }
    return !spx_falta($p['fotos']) && count($p['fotos']) > 0;
  }));
}

/** Só entram no site os números confirmados. */
function spx_numeros() {
  return array_values(array_filter(spx('numeros'), function ($n) {
    return !empty($n['validado']);
  }));
}

/** Endereço do site sem a barra final. */
function spx_site() {
  return untrailingslashit(home_url('/'));
}
