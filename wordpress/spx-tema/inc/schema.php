<?php
/**
 * Dados estruturados (schema.org) em um único @graph por página.
 *
 * É a parte do site que faz um buscador — e um agente de IA — entender que a
 * SPX é uma construtora de São Paulo, quais serviços executa, em que regiões,
 * e quem responde tecnicamente. Cada entidade tem um @id fixo, então o grafo
 * de uma página conversa com o das outras em vez de repetir empresas soltas.
 *
 * Nada aqui é inventado: o que não estiver confirmado nos dados simplesmente
 * não entra no grafo. Um CNPJ errado no schema é pior do que CNPJ nenhum.
 */

if (!defined('ABSPATH')) { exit; }

/** @id da empresa. Fixo, para todas as páginas apontarem para a mesma. */
function spx_id_empresa() { return spx_site() . '/#organizacao'; }
function spx_id_pessoa()  { return spx_site() . '/#responsavel'; }

/**
 * speakable marca o trecho que um assistente de voz deve ler em voz alta
 * quando alguém pergunta o que a empresa faz.
 */
function spx_falado() {
  return [
    '@type' => 'SpeakableSpecification',
    'cssSelector' => ['h1', '.resposta-direta p', '.mapa-txt .lead', '.topo-lead'],
  ];
}

/**
 * Endereço oficial da página que está sendo servida — o que vai na canônica.
 *
 * Cada página aponta para si mesma. Canônica fixa apontando o site inteiro
 * para a home é erro comum e caro: tira todas as páginas internas do índice
 * do Google, porque cada uma passa a declarar que a versão boa dela é outra.
 */
function spx_url_atual() {
  if (is_front_page()) { return trailingslashit(home_url('/')); }
  $id = get_queried_object_id();
  if ($id && is_singular()) { return get_permalink($id); }
  global $wp;
  $caminho = isset($wp->request) ? $wp->request : '';
  return home_url('/' . ltrim($caminho, '/'));
}

/**
 * A empresa. Só entra no grafo o que está confirmado — razão social, CNPJ,
 * endereço e perfis sociais aparecem quando existirem, e o painel avisa
 * enquanto não existirem.
 */
function spx_schema_organizacao() {
  $e = spx('empresa');
  $r = spx('responsavel');
  $site = spx_site();

  $regioes = [];
  foreach (spx('regioes') as $grupo) {
    foreach ($grupo as $n) { $regioes[] = ['@type' => 'Place', 'name' => $n]; }
  }

  $conhece = [];
  foreach (spx_servicos() as $s) { $conhece[] = $s['nome']; }
  foreach (spx('segmentos') as $g) { $conhece[] = $g; }

  $catalogo = [];
  foreach (spx_servicos() as $sv) {
    $catalogo[] = [
      '@type' => 'Offer',
      'itemOffered' => [
        '@type' => 'Service', 'name' => $sv['nome'], 'description' => $sv['resumo'],
        'url' => $site . '/servicos/' . $sv['slug'],
        'areaServed' => ['@type' => 'AdministrativeArea', 'name' => $e['atuacao']],
      ],
    ];
  }

  $o = [
    '@type' => 'GeneralContractor',
    '@id' => spx_id_empresa(),
    'name' => $e['nome'],
    'description' => $e['definicao'],
    'url' => $site . '/',
    'logo' => spx_img('logo.webp'),
    'image' => spx_img('og.jpg'),
    'telephone' => $e['telefone'],
    'email' => $e['email'],
    'areaServed' => $regioes,
    /* serviços e segmentos juntos: é assim que um agente de busca liga
       "reforma de clínica" ou "obra de restaurante" à SPX sem existir uma
       página só para cada combinação */
    'knowsAbout' => $conhece,
    'foundingDate' => '2025',
    'openingHours' => 'Mo-Fr 08:00-18:00',
    'hasOfferCatalog' => [
      '@type' => 'OfferCatalog',
      'name' => 'Serviços de engenharia da SPX',
      'itemListElement' => $catalogo,
    ],
  ];

  if (!spx_falta($r['nome'])) {
    $o['founder']  = ['@id' => spx_id_pessoa()];
    $o['employee'] = ['@id' => spx_id_pessoa()];
  }
  if (!spx_falta($e['razaoSocial'])) { $o['legalName'] = $e['razaoSocial']; }
  else { spx_anota('Schema Organization', 'razão social (legalName)'); }
  if (!spx_falta($e['cnpj'])) { $o['taxID'] = $e['cnpj']; }

  $perfis = [];
  foreach (['instagram', 'linkedin'] as $k) {
    if (!spx_falta($e[$k])) { $perfis[] = $e[$k]; }
  }
  if ($perfis) { $o['sameAs'] = $perfis; }

  $endereco = ['@type' => 'PostalAddress', 'addressLocality' => 'São Paulo',
               'addressRegion' => 'SP', 'addressCountry' => 'BR'];
  if (!spx_falta($e['endereco'])) { $endereco['streetAddress'] = $e['endereco']; }
  else { spx_anota('Schema Organization', 'endereço (streetAddress) — ou confirmar que a SPX não atende no local'); }
  $o['address'] = $endereco;

  return $o;
}

/**
 * O engenheiro responsável. Sem o nome completo não há entidade: publicar
 * "Person" sem nome é publicar autoridade técnica anônima, que não vale nada
 * nem para o Google nem para quem vai contratar.
 */
function spx_schema_pessoa() {
  $r = spx('responsavel');
  if (spx_falta($r['nome'])) {
    spx_anota('Schema Person', 'nome completo do engenheiro responsável — sem ele não há como publicar a autoridade técnica');
    return null;
  }
  $p = [
    '@type' => 'Person', '@id' => spx_id_pessoa(), 'name' => $r['nome'],
    'jobTitle' => $r['titulo'], 'worksFor' => ['@id' => spx_id_empresa()],
  ];
  if (!spx_falta($r['foto']))           { $p['image'] = spx_img($r['foto']); }
  if (!spx_falta($r['formacao']))       { $p['alumniOf'] = $r['formacao']; }
  if (!spx_falta($r['especialidades'])) { $p['knowsAbout'] = $r['especialidades']; }
  return $p;
}

/** Um serviço, com o catálogo do que ele executa. */
function spx_schema_servico($s) {
  $ofertas = [];
  foreach ($s['executa'] as $n) {
    $ofertas[] = ['@type' => 'Offer', 'itemOffered' => ['@type' => 'Service', 'name' => $n]];
  }
  return [
    '@type' => 'Service', '@id' => spx_site() . '/servicos/' . $s['slug'] . '#servico',
    'name' => $s['nome'], 'description' => $s['descricao'], 'serviceType' => $s['nome'],
    'provider' => ['@id' => spx_id_empresa()],
    'areaServed' => ['@type' => 'AdministrativeArea', 'name' => 'São Paulo e região metropolitana'],
    'hasOfferCatalog' => ['@type' => 'OfferCatalog', 'name' => $s['nome'], 'itemListElement' => $ofertas],
  ];
}

/** Lista de perguntas e respostas. */
function spx_schema_perguntas($pares) {
  $qs = [];
  foreach ($pares as $p) {
    $qs[] = ['@type' => 'Question', 'name' => $p[0],
             'acceptedAnswer' => ['@type' => 'Answer', 'text' => $p[1]]];
  }
  return ['@type' => 'FAQPage', 'mainEntity' => $qs];
}

/**
 * HowTo: o Google e as IAs entendem "como a SPX conduz uma obra" como um
 * procedimento de sete passos, e não como um texto solto sobre processo.
 */
function spx_schema_processo() {
  $passos = [];
  foreach (spx('processo') as $i => $e) {
    $ancora = strtolower(remove_accents($e['nome']));
    $passos[] = [
      '@type' => 'HowToStep', 'position' => $i + 1,
      'name' => $e['nome'], 'text' => $e['texto'],
      'url' => spx_site() . '/servicos#' . $ancora,
    ];
  }
  return [
    '@type' => 'HowTo',
    'name' => 'Como a SPX Engenharia conduz uma obra, do levantamento à entrega',
    'description' => 'Procedimento em sete etapas aplicado a toda obra corporativa ou '
      . 'comercial executada pela SPX Engenharia em São Paulo.',
    'totalTime' => 'P1D',
    'step' => $passos,
  ];
}

/** Migalhas de pão, para o Google mostrar o caminho no resultado de busca. */
function spx_schema_trilha($trilha) {
  $itens = [];
  foreach ($trilha as $i => $t) {
    $itens[] = ['@type' => 'ListItem', 'position' => $i + 1,
                'name' => $t['nome'], 'item' => spx_site() . $t['url']];
  }
  return ['@type' => 'BreadcrumbList', 'itemListElement' => $itens];
}

/**
 * Monta o @graph da página: a empresa sempre, mais o que a página trouxer,
 * mais a trilha quando houver mais de um nível.
 */
function spx_json_ld($extra = [], $trilha = []) {
  $grafo = array_merge([spx_schema_organizacao()], array_filter($extra));
  if (count($trilha) > 1) { $grafo[] = spx_schema_trilha($trilha); }
  return wp_json_encode(
    ['@context' => 'https://schema.org', '@graph' => array_values($grafo)],
    JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES | JSON_PRETTY_PRINT
  );
}

/** Migalhas visíveis, acima do título. */
function spx_migalhas($trilha) {
  if (count($trilha) < 2) { return ''; }
  $partes = [];
  foreach ($trilha as $i => $t) {
    $partes[] = ($i === count($trilha) - 1)
      ? '<span aria-current="page">' . spx_esc($t['nome']) . '</span>'
      : '<a href="' . esc_url(home_url($t['url'])) . '">' . spx_esc($t['nome']) . '</a>';
  }
  return '<nav class="migalhas" aria-label="Você está em">'
    . implode('<i aria-hidden="true">/</i>', $partes) . '</nav>';
}
