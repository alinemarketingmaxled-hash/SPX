<?php
/**
 * Política de privacidade: /privacidade
 *
 * O controlador é a razão social quando ela existir. Enquanto não existir, o
 * texto usa o nome fantasia e o painel avisa: a LGPD exige que o titular saiba
 * exatamente qual pessoa jurídica trata os dados dele, e inventar uma razão
 * social aqui seria pior do que a falta.
 */

if (!defined('ABSPATH')) { exit; }

$e = spx('empresa');
$controlador = spx_falta($e['razaoSocial']) ? $e['nome'] : $e['razaoSocial'];
if (spx_falta($e['razaoSocial']) || spx_falta($e['cnpj'])) {
  spx_anota('Política de privacidade', 'razão social e CNPJ do controlador — a LGPD exige que o '
    . 'titular saiba exatamente qual pessoa jurídica trata os dados dele');
}

$spx = [
  'title'     => 'Política de privacidade e tratamento de dados | ' . $e['nome'],
  'descricao' => 'Como a SPX Engenharia trata os dados enviados pelo site, para que servem, '
    . 'por quanto tempo ficam e como exercer os direitos previstos na LGPD.',
  'h1'        => 'Política de privacidade',
  'fundo'     => 'lavabo-azul',
  'visual'    => 'pag-privacidade',
  'trilha'    => [['nome' => 'Início', 'url' => '/'], ['nome' => 'Privacidade', 'url' => '/privacidade']],
];
spx_cabecalho($spx);

$mail = '<a href="mailto:' . esc_attr($e['email']) . '">' . spx_esc($e['email']) . '</a>';
?>

<section class="sec wrap" data-reveal>
  <p class="lead">Esta política explica quais dados o site da <?php echo spx_esc($e['nome']); ?> coleta, para
  que servem e o que você pode exigir sobre eles, conforme a Lei Geral de Proteção de Dados
  (Lei 13.709/2018).</p>
</section>

<?php
echo spx_secao('Quem trata os seus dados', '<p class="lead">O controlador dos dados é '
  . spx_esc($controlador) . (spx_falta($e['cnpj']) ? '' : ', CNPJ ' . spx_esc($e['cnpj']))
  . ', com contato em ' . $mail . '.</p>', 'claro');

echo spx_secao('O que é coletado', '
  <p class="lead">Só o que você digita no formulário de visita técnica:</p>
  <ul class="marcada"><li>Nome</li><li>Empresa</li><li>E-mail</li><li>Telefone</li>
  <li>Tipo de obra, área aproximada e o contexto que você escrever</li></ul>
  <p class="lead">O site não usa cookie de rastreamento por padrão. Se a medição de audiência
  estiver ativada, ela é anônima e não identifica você individualmente.</p>');

echo spx_secao('Para que serve', '<ul class="marcada">
  <li>Responder ao seu contato e agendar a visita técnica</li>
  <li>Elaborar orçamento e proposta</li>
  <li>Manter o histórico da negociação</li></ul>
  <p class="lead">A base legal é o seu pedido de contato e o interesse legítimo em responder a
  ele. Os dados não são vendidos, alugados nem cedidos para terceiros com fim comercial.</p>', 'claro');

echo spx_secao('Com quem é compartilhado', '<p class="lead">Apenas com os prestadores necessários para
  o site funcionar: a hospedagem e o serviço de envio de e-mail. Nenhum deles usa esses dados
  para finalidade própria.</p>');

echo spx_secao('Por quanto tempo fica', '<p class="lead">Enquanto durar a negociação e pelo prazo em
  que a lei exigir a guarda de documento comercial e fiscal. Passado isso, os dados são
  eliminados.</p>', 'claro');

echo spx_secao('Os seus direitos', '
  <p class="lead">A LGPD garante a você, a qualquer momento:</p>
  <ul class="marcada"><li>Confirmar se tratamos dados seus e acessá-los</li>
  <li>Corrigir dado incompleto ou desatualizado</li>
  <li>Pedir anonimização, bloqueio ou eliminação</li>
  <li>Pedir a portabilidade</li>
  <li>Revogar o consentimento</li>
  <li>Saber com quem os dados foram compartilhados</li></ul>
  <p class="lead">Para exercer qualquer um deles, escreva para ' . $mail . '.
  A resposta é dada no prazo legal.</p>');

echo spx_secao('Segurança', '<p class="lead">O site trafega inteiramente em HTTPS. As credenciais dos
  serviços usados pelo formulário ficam em variáveis de ambiente do servidor, nunca no código
  publicado.</p>', 'claro');

echo spx_secao('Mudanças nesta política', '<p class="lead">Se ela mudar, a versão nova passa a valer
  a partir da publicação nesta mesma página.</p>');

get_footer();
