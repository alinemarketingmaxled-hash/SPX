<?php
/**
 * Formulário de visita técnica.
 *
 * Recebe o envio, valida campo a campo, guarda a solicitação no banco e manda
 * o e-mail. A tradução da função que rodava na Vercel — com uma diferença a
 * favor: aqui a solicitação fica registrada no WordPress mesmo que o envio do
 * e-mail falhe, então nenhum contato se perde por causa do servidor de e-mail.
 *
 * Nenhuma credencial mora neste arquivo nem em qualquer outro do tema. O
 * WordPress manda pela função de e-mail do próprio servidor; se um dia for
 * usado um provedor externo, a chave vai em wp-config.php, que fica fora do
 * repositório.
 */

if (!defined('ABSPATH')) { exit; }

/** Campos aceitos, com limite de tamanho. O que não está aqui é descartado. */
function spx_campos_form() {
  return [
    'nome'     => ['obrigatorio' => true,  'max' => 120,  'rotulo' => 'Nome'],
    'empresa'  => ['obrigatorio' => true,  'max' => 160,  'rotulo' => 'Empresa'],
    'email'    => ['obrigatorio' => true,  'max' => 160,  'rotulo' => 'E-mail'],
    'telefone' => ['obrigatorio' => false, 'max' => 40,   'rotulo' => 'Telefone'],
    'tipo'     => ['obrigatorio' => true,  'max' => 80,   'rotulo' => 'Tipo de obra'],
    'area'     => ['obrigatorio' => false, 'max' => 20,   'rotulo' => 'Área aproximada (m²)'],
    'mensagem' => ['obrigatorio' => false, 'max' => 4000, 'rotulo' => 'Contexto da obra'],
  ];
}

/**
 * Teto de cinco envios por hora, por IP. Não substitui um antispam de
 * verdade, mas corta a maior parte do envio automático sem pedir captcha a
 * quem só quer marcar uma visita.
 */
function spx_passou_do_limite($ip) {
  $chave = 'spx_env_' . md5($ip);
  $marcas = get_transient($chave);
  if (!is_array($marcas)) { $marcas = []; }
  $agora = time();
  $marcas = array_values(array_filter($marcas, function ($t) use ($agora) {
    return $agora - $t < HOUR_IN_SECONDS;
  }));
  if (count($marcas) >= 5) { return true; }
  $marcas[] = $agora;
  set_transient($chave, $marcas, HOUR_IN_SECONDS);
  return false;
}

function spx_ip() {
  $ip = isset($_SERVER['REMOTE_ADDR']) ? $_SERVER['REMOTE_ADDR'] : '0.0.0.0';
  return sanitize_text_field(wp_unslash($ip));
}

/**
 * Recebe o formulário. Responde em JSON porque é o que o JavaScript da página
 * espera: 200 mostra o agradecimento, 400 devolve o erro para corrigir, e
 * qualquer outra coisa faz a página cair no plano B — os botões de WhatsApp e
 * e-mail já preenchidos com o que a pessoa digitou.
 */
function spx_receber_contato() {
  $bruto = file_get_contents('php://input');
  $dados = json_decode($bruto, true);
  if (!is_array($dados)) { $dados = $_POST; }

  $nonce = isset($dados['spx_nonce']) ? $dados['spx_nonce'] : '';
  if (!wp_verify_nonce($nonce, 'spx_contato')) {
    wp_send_json(['erro' => 'A página ficou aberta tempo demais. Recarregue e tente de novo.'], 400);
  }

  /* campo isca: só robô preenche um campo escondido com rótulo pedindo para
     não preencher. Responde 200 para o robô achar que deu certo e não tentar
     de novo por outro caminho. */
  if (!empty($dados['site'])) { wp_send_json(['ok' => true], 200); }

  if (spx_passou_do_limite(spx_ip())) {
    wp_send_json(['erro' => 'Muitos envios seguidos. Tente novamente daqui a pouco.'], 429);
  }

  $limpo = [];
  foreach (spx_campos_form() as $chave => $regra) {
    $v = isset($dados[$chave]) ? $dados[$chave] : '';
    $v = trim(preg_replace('/\s+/u', ' ', wp_strip_all_tags((string) $v)));
    $v = mb_substr($v, 0, $regra['max'], 'UTF-8');
    if ($regra['obrigatorio'] && $v === '') {
      wp_send_json(['erro' => 'Preencha o campo ' . $regra['rotulo'] . '.'], 400);
    }
    $limpo[$chave] = $v;
  }
  if (!is_email($limpo['email'])) {
    wp_send_json(['erro' => 'Informe um e-mail válido.'], 400);
  }

  /* A solicitação é guardada antes do e-mail sair. Se o servidor de e-mail
     estiver fora do ar, o contato continua registrado no painel em vez de
     sumir — que é exatamente o caso em que perder um contato dói mais. */
  $id = wp_insert_post([
    'post_type'   => 'spx_solicitacao',
    'post_status' => 'private',
    'post_title'  => $limpo['empresa'] . ' · ' . $limpo['nome'],
    'post_content' => $limpo['mensagem'],
    'meta_input'  => [
      'spx_email' => $limpo['email'], 'spx_telefone' => $limpo['telefone'],
      'spx_tipo' => $limpo['tipo'], 'spx_area' => $limpo['area'],
      'spx_ip' => spx_ip(),
    ],
  ], true);

  $para = get_option('spx_contato_para');
  if (!$para || !is_email($para)) { $para = spx('empresa.email'); }

  $corpo = "Solicitação de visita técnica pelo site\n\n"
    . 'Nome: ' . $limpo['nome'] . "\n"
    . 'Empresa: ' . $limpo['empresa'] . "\n"
    . 'E-mail: ' . $limpo['email'] . "\n"
    . 'Telefone: ' . ($limpo['telefone'] ?: '-') . "\n"
    . 'Tipo de obra: ' . $limpo['tipo'] . "\n"
    . 'Área aproximada: ' . ($limpo['area'] ?: '-') . " m²\n\n"
    . ($limpo['mensagem'] ?: '(sem contexto adicional)') . "\n";

  $enviado = wp_mail($para, 'Visita técnica · ' . $limpo['empresa'], $corpo, [
    'Content-Type: text/plain; charset=UTF-8',
    'Reply-To: ' . $limpo['nome'] . ' <' . $limpo['email'] . '>',
  ]);

  if (!$enviado && !is_wp_error($id)) {
    /* guardado mas não enviado: para quem preencheu, a página deve cair no
       plano B e oferecer WhatsApp e e-mail, então isto não é 200 */
    wp_send_json(['erro' => 'Não foi possível enviar agora.'], 503);
  }
  wp_send_json(['ok' => true], 200);
}
add_action('wp_ajax_spx_contato', 'spx_receber_contato');
add_action('wp_ajax_nopriv_spx_contato', 'spx_receber_contato');

/**
 * Onde as solicitações ficam. Privado e sem endereço público: são dados de
 * quem pediu orçamento, não conteúdo do site.
 */
function spx_registrar_solicitacoes() {
  register_post_type('spx_solicitacao', [
    'labels' => ['name' => 'Solicitações', 'singular_name' => 'Solicitação',
                 'menu_name' => 'Solicitações'],
    'public' => false,
    'show_ui' => true,
    'show_in_menu' => false,
    'capability_type' => 'post',
    'supports' => ['title', 'editor', 'custom-fields'],
  ]);
}
add_action('init', 'spx_registrar_solicitacoes');

/**
 * Erros de JavaScript relatados pela própria página. Ficam num registro
 * curto, para dar para ver que algo quebrou sem depender de serviço externo.
 */
function spx_receber_erro() {
  $dados = json_decode(file_get_contents('php://input'), true);
  if (!is_array($dados)) { wp_send_json(['ok' => true], 200); }
  $log = get_option('spx_erros_js', []);
  if (!is_array($log)) { $log = []; }
  array_unshift($log, [
    'quando'   => current_time('mysql'),
    'mensagem' => sanitize_text_field(substr((string) ($dados['mensagem'] ?? ''), 0, 300)),
    'origem'   => esc_url_raw(substr((string) ($dados['origem'] ?? ''), 0, 300)),
    'linha'    => intval($dados['linha'] ?? 0),
  ]);
  update_option('spx_erros_js', array_slice($log, 0, 50), false);
  wp_send_json(['ok' => true], 200);
}
add_action('wp_ajax_spx_erro', 'spx_receber_erro');
add_action('wp_ajax_nopriv_spx_erro', 'spx_receber_erro');
