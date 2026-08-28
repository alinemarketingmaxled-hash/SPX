<?php
/**
 * Painel de edição do site — menu "SPX" no WordPress.
 *
 * Foi feito para responder à pergunta que motivou a migração: poder trocar
 * texto, telefone, serviço e pergunta sem depender de ninguém. O que está
 * salvo aqui vale sobre o padrão do tema; campo deixado em branco significa
 * "não mexi", e o padrão continua valendo — nunca apaga texto do site sem
 * querer.
 */

if (!defined('ABSPATH')) { exit; }

function spx_menu_admin() {
  add_menu_page('SPX Engenharia', 'SPX', 'manage_options', 'spx',
                'spx_tela_empresa', 'dashicons-admin-home', 3);
  add_submenu_page('spx', 'Empresa e contato', 'Empresa', 'manage_options', 'spx', 'spx_tela_empresa');
  add_submenu_page('spx', 'Responsável técnico', 'Responsável', 'manage_options',
                   'spx-responsavel', 'spx_tela_responsavel');
  add_submenu_page('spx', 'Serviços', 'Serviços', 'manage_options', 'spx-servicos', 'spx_tela_servicos');
  add_submenu_page('spx', 'Dúvidas frequentes', 'Dúvidas', 'manage_options', 'spx-duvidas', 'spx_tela_duvidas');
  add_submenu_page('spx', 'Solicitações recebidas', 'Solicitações', 'manage_options',
                   'edit.php?post_type=spx_solicitacao');
  add_submenu_page('spx', 'O que ainda falta', 'O que falta', 'manage_options',
                   'spx-pendencias', 'spx_tela_pendencias');
}
add_action('admin_menu', 'spx_menu_admin');

/** Grava um punhado de campos dentro de spx_dados, preservando o resto. */
function spx_salvar($secao, $campos) {
  if (!isset($_POST['spx_salvar']) || !current_user_can('manage_options')) { return false; }
  check_admin_referer('spx_salvar_' . $secao);
  $dados = get_option('spx_dados', []);
  if (!is_array($dados)) { $dados = []; }
  foreach ($campos as $chave => $rotulo) {
    $v = isset($_POST['spx'][$chave]) ? wp_unslash($_POST['spx'][$chave]) : '';
    $v = trim(wp_strip_all_tags($v));
    /* branco = não mexi. Para apagar de verdade existe o botão de restaurar
       o padrão, e não deixar o campo vazio sem querer. */
    if ($v === '') { unset($dados[$secao][$chave]); continue; }
    $dados[$secao][$chave] = $v;
  }
  update_option('spx_dados', $dados);
  echo '<div class="notice notice-success is-dismissible"><p>Salvo. As páginas já estão com o texto novo.</p></div>';
  return true;
}

function spx_campo($secao, $chave, $rotulo, $ajuda = '', $linhas = 1) {
  $dados = get_option('spx_dados', []);
  $atual = isset($dados[$secao][$chave]) ? $dados[$secao][$chave] : '';
  $padrao = spx($secao . '.' . $chave);
  $mostrar = spx_falta($padrao) ? '(ainda não preenchido)' : $padrao;
  echo '<tr><th scope="row"><label for="spx-' . esc_attr($chave) . '">' . esc_html($rotulo) . '</label></th><td>';
  if ($linhas > 1) {
    echo '<textarea class="large-text" rows="' . intval($linhas) . '" id="spx-' . esc_attr($chave)
      . '" name="spx[' . esc_attr($chave) . ']">' . esc_textarea($atual) . '</textarea>';
  } else {
    echo '<input class="regular-text" type="text" id="spx-' . esc_attr($chave)
      . '" name="spx[' . esc_attr($chave) . ']" value="' . esc_attr($atual) . '">';
  }
  echo '<p class="description">' . ($ajuda ? esc_html($ajuda) . '<br>' : '')
    . '<b>Em uso hoje:</b> ' . esc_html(mb_strimwidth((string) $mostrar, 0, 160, '…')) . '</p>';
  echo '</td></tr>';
}

function spx_tela_empresa() {
  $campos = ['nome' => 'Nome', 'razaoSocial' => 'Razão social', 'cnpj' => 'CNPJ',
             'telefone' => 'Telefone', 'whatsapp' => 'WhatsApp', 'email' => 'E-mail',
             'endereco' => 'Endereço', 'base' => 'Base', 'atuacao' => 'Área de atuação',
             'horario' => 'Horário', 'instagram' => 'Instagram', 'linkedin' => 'LinkedIn',
             'definicao' => 'Definição', 'proposta' => 'Proposta'];
  spx_salvar('empresa', $campos);
  ?>
  <div class="wrap">
    <h1>Empresa e contato</h1>
    <p>Estes dados aparecem no rodapé de todas as páginas, na página de contato e nos dados
    estruturados que o Google lê. Deixar em branco mantém o texto que já está no ar.</p>
    <form method="post"><?php wp_nonce_field('spx_salvar_empresa'); ?>
      <table class="form-table" role="presentation">
        <?php
        spx_campo('empresa', 'nome', 'Nome');
        spx_campo('empresa', 'razaoSocial', 'Razão social', 'Como está no CNPJ. Sem isso, a política de privacidade não pode nomear o controlador dos dados.');
        spx_campo('empresa', 'cnpj', 'CNPJ', 'Aparece no rodapé e nos dados estruturados.');
        spx_campo('empresa', 'telefone', 'Telefone', 'Formato +55 11 90000-0000.');
        spx_campo('empresa', 'whatsapp', 'WhatsApp', 'Só números, com 55 na frente.');
        spx_campo('empresa', 'email', 'E-mail');
        spx_campo('empresa', 'endereco', 'Endereço', 'Deixe em branco se a SPX não atende no local.');
        spx_campo('empresa', 'base', 'Base');
        spx_campo('empresa', 'atuacao', 'Área de atuação');
        spx_campo('empresa', 'horario', 'Horário');
        spx_campo('empresa', 'instagram', 'Instagram', 'Endereço completo, com https://');
        spx_campo('empresa', 'linkedin', 'LinkedIn', 'Endereço completo, com https://');
        spx_campo('empresa', 'definicao', 'Definição da empresa', 'Uma frase. É a definição que o site repete em todo lugar e que o Google usa como resposta.', 3);
        spx_campo('empresa', 'proposta', 'Proposta', 'Uma frase sobre como a SPX trabalha.', 3);
        ?>
      </table>
      <p><label for="spx-para"><b>E-mail que recebe as solicitações</b></label><br>
        <input class="regular-text" type="email" id="spx-para" name="spx_contato_para"
               value="<?php echo esc_attr(get_option('spx_contato_para', '')); ?>">
        <br><span class="description">Em branco, usa o e-mail da empresa acima.</span></p>
      <?php submit_button('Salvar', 'primary', 'spx_salvar'); ?>
    </form>
  </div>
  <?php
  if (isset($_POST['spx_salvar']) && isset($_POST['spx_contato_para'])) {
    update_option('spx_contato_para', sanitize_email(wp_unslash($_POST['spx_contato_para'])));
  }
}

function spx_tela_responsavel() {
  spx_salvar('responsavel', ['nome' => '', 'titulo' => '', 'formacao' => '',
                             'anosExperiencia' => '', 'resumo' => '']);
  ?>
  <div class="wrap">
    <h1>Responsável técnico</h1>
    <p><b>Enquanto o nome estiver em branco, a seção do responsável não aparece no site e o
    engenheiro não entra nos dados estruturados.</b> Isso é de propósito: autoridade técnica
    anônima não vale para o Google nem para quem vai contratar. É o item que mais falta hoje.</p>
    <form method="post"><?php wp_nonce_field('spx_salvar_responsavel'); ?>
      <table class="form-table" role="presentation">
        <?php
        spx_campo('responsavel', 'nome', 'Nome completo');
        spx_campo('responsavel', 'titulo', 'Título');
        spx_campo('responsavel', 'formacao', 'Formação', 'Curso e instituição.');
        spx_campo('responsavel', 'anosExperiencia', 'Anos de experiência');
        spx_campo('responsavel', 'resumo', 'Resumo', 'Duas ou três frases sobre a trajetória.', 4);
        ?>
      </table>
      <?php submit_button('Salvar', 'primary', 'spx_salvar'); ?>
    </form>
  </div>
  <?php
}

/**
 * Serviços e dúvidas são listas, e listas com campo a campo no admin viram
 * uma tela ilegível. Aqui elas são editadas como texto estruturado, com o
 * formato explicado na própria tela.
 */
function spx_tela_lista($secao, $titulo, $explicacao, $formato) {
  if (isset($_POST['spx_salvar']) && current_user_can('manage_options')) {
    check_admin_referer('spx_salvar_' . $secao);
    $bruto = wp_unslash($_POST['spx_json']);
    $novo = json_decode($bruto, true);
    if (json_last_error() === JSON_ERROR_NONE && is_array($novo)) {
      $dados = get_option('spx_dados', []);
      if (!is_array($dados)) { $dados = []; }
      $dados[$secao] = $novo;
      update_option('spx_dados', $dados);
      echo '<div class="notice notice-success is-dismissible"><p>Salvo.</p></div>';
    } else {
      echo '<div class="notice notice-error"><p>O texto não está no formato certo e '
        . '<b>nada foi salvo</b>. O site continua como estava. Erro: '
        . esc_html(json_last_error_msg()) . '</p></div>';
    }
  }
  $atual = spx($secao);
  ?>
  <div class="wrap">
    <h1><?php echo esc_html($titulo); ?></h1>
    <p><?php echo wp_kses_post($explicacao); ?></p>
    <p><b>Formato:</b> <?php echo wp_kses_post($formato); ?></p>
    <form method="post"><?php wp_nonce_field('spx_salvar_' . $secao); ?>
      <textarea name="spx_json" rows="28" style="width:100%;font-family:monospace;font-size:12px"><?php
        echo esc_textarea(wp_json_encode($atual, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES));
      ?></textarea>
      <?php submit_button('Salvar', 'primary', 'spx_salvar'); ?>
    </form>
  </div>
  <?php
}

function spx_tela_servicos() {
  spx_tela_lista('servicos', 'Serviços',
    'Cada item da lista vira uma página em <code>/servicos/…</code>. Mexer no <code>slug</code> '
    . 'muda o endereço da página — e endereço que já foi indexado pelo Google não deve mudar '
    . 'sem necessidade.',
    'uma lista, um bloco por serviço, com nome, slug, resumo, o que executa, para quem é e as perguntas.');
}

function spx_tela_duvidas() {
  spx_tela_lista('duvidas', 'Dúvidas frequentes',
    'As perguntas da página <code>/duvidas</code>. Elas também alimentam o bloco de perguntas '
    . 'que o Google mostra direto no resultado de busca.',
    'uma lista de pares — primeiro a pergunta, depois a resposta.');
}

/**
 * O que ainda falta. É o mesmo aviso que o gerador do site estático imprimia
 * ao final de cada build, agora numa tela: informação que ninguém confirmou
 * não vai para o site, e a lista é o lembrete do que está de fora.
 */
function spx_tela_pendencias() {
  /* renderiza as páginas em memória só para colher os avisos */
  $GLOBALS['spx_pendencias'] = [];
  spx_schema_organizacao();
  spx_schema_pessoa();
  spx_bloco_responsavel();
  foreach (spx('projetos') as $p) {
    $falta = [];
    foreach (['tipo', 'atuacao'] as $c) { if (spx_falta($p[$c])) { $falta[] = $c; } }
    $semFoto = spx_falta($p['fotos']) || !count($p['fotos']);
    if ($falta || $semFoto) {
      spx_anota('Projeto ' . $p['nome'],
        trim(($falta ? 'faltam ' . implode(' e ', $falta) : '') . ($semFoto ? '; faltam as fotos' : ''), '; ')
        . ' — a página não é publicada enquanto isso');
    }
  }
  foreach (spx('servicos') as $s) {
    if (!empty($s['confirmar'])) { spx_anota('Serviço "' . $s['nome'] . '"', $s['confirmar']); }
  }
  foreach (spx('numeros') as $n) {
    if (empty($n['validado'])) { spx_anota('Número "' . $n['rotulo'] . '"', $n['nota'] . ' Fora do site até confirmar.'); }
  }
  $e = spx('empresa');
  foreach (['instagram' => 'endereço do Instagram', 'linkedin' => 'endereço do LinkedIn',
            'cnpj' => 'CNPJ'] as $k => $rot) {
    if (spx_falta($e[$k])) { spx_anota('Rodapé', $rot); }
  }
  $lista = spx_pendencias();
  ?>
  <div class="wrap">
    <h1>O que ainda falta</h1>
    <p>Estas informações <b>não estão no site</b> porque ninguém confirmou. Nada aqui foi
    inventado para preencher espaço — é a diferença entre "não sei" e "chutei", e é o que
    impede o site de afirmar um CNPJ ou um dado técnico errado.</p>
    <?php if (!$lista) : ?>
      <p><b>Nada pendente.</b></p>
    <?php else : ?>
      <ol><?php foreach ($lista as $p) { echo '<li>' . esc_html($p) . '</li>'; } ?></ol>
    <?php endif; ?>
  </div>
  <?php
}
