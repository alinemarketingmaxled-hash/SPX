<?php
/**
 * Contato e visita técnica: /contato
 *
 * Sem foto no topo: a mesma foto já está atrás do formulário logo abaixo, e
 * duas cópias da mesma imagem na primeira tela é uma a mais.
 */

if (!defined('ABSPATH')) { exit; }

$e = spx('empresa');
$d = spx_dim('banheiro-marmore');

$spx = [
  'title'     => 'Contato e visita técnica em São Paulo | ' . $e['nome'],
  'descricao' => 'Solicite a visita técnica da SPX Engenharia. Orçamento preliminar em até cinco '
    . 'dias úteis depois da visita ao local, em São Paulo e região.',
  'h1'        => 'Envie o contexto da obra.',
  'h1b'       => 'A SPX cuida do resto.',
  'visual'    => 'pag-contato',
  'trilha'    => [['nome' => 'Início', 'url' => '/'], ['nome' => 'Contato', 'url' => '/contato']],
  'schema'    => [['@type' => 'ContactPage', 'name' => 'Contato',
                   'mainEntity' => ['@id' => spx_id_empresa()]]],
];
spx_cabecalho($spx);

$zap = preg_replace('/\D/', '', $e['whatsapp']);
$tel = preg_replace('/\D/', '', $e['telefone']);
$curto = str_replace('+55 ', '', $e['telefone']);
?>

<section class="sec wrap contato-bloco" data-adiar>
  <div class="cb-foto" aria-hidden="true">
    <img data-fonte="<?php echo esc_url(spx_img('banheiro-marmore-960.webp')); ?>" width="<?php echo $d[0]; ?>"
         height="<?php echo $d[1]; ?>" alt="" loading="lazy" decoding="async">
  </div>
  <div class="contato-grid">
    <div data-reveal>
      <p class="lead">A avaliação é feita no local. Um engenheiro visita, mede e levanta as
      restrições do prédio; o orçamento preliminar sai em até cinco dias úteis depois disso.</p>
      <ul class="garantias">
        <li><?php echo spx_icone('visita'); ?><div><b>Visita técnica sem compromisso</b><span>Um engenheiro vai ao local antes de qualquer número.</span></div></li>
        <li><?php echo spx_icone('relogio'); ?><div><b>Orçamento em até cinco dias úteis</b><span>Contado a partir da visita, não do primeiro contato.</span></div></li>
        <li><?php echo spx_icone('sigilo'); ?><div><b>Sigilo sobre o que você enviar</b><span>As informações são usadas apenas para a avaliação técnica.</span></div></li>
      </ul>
      <h2>Canais diretos</h2>
      <ul class="canais">
        <li><a href="https://wa.me/<?php echo esc_attr($zap); ?>" rel="noopener"><b>WhatsApp</b><span><?php echo spx_esc($curto); ?></span></a></li>
        <li><a href="tel:<?php echo esc_attr($tel); ?>"><b>Telefone</b><span><?php echo spx_esc($curto); ?></span></a></li>
        <li><a href="mailto:<?php echo esc_attr($e['email']); ?>"><b>E-mail</b><span><?php echo spx_esc($e['email']); ?></span></a></li>
      </ul>
      <p class="form-nota"><?php echo spx_esc($e['horario']); ?>. Obra em andamento: atendimento conforme escopo contratado.</p>
    </div>
    <div data-reveal data-atraso="1">
      <h2 class="so-leitor">Formulário de visita técnica</h2>
      <form class="form" id="formObra" novalidate data-reveal data-atraso="1" data-endpoint="<?php echo esc_url(admin_url('admin-ajax.php?action=spx_contato')); ?>">
      <p class="eyebrow form-titulo">Solicitação de visita técnica</p>
      <div class="campos" style="margin-top:22px">
        <div class="campo">
          <label for="f-nome">Nome</label>
          <input id="f-nome" name="nome" type="text" required autocomplete="name" placeholder="Nome completo">
          <span class="erro-msg">Preencha seu nome.</span>
        </div>
        <div class="campo">
          <label for="f-empresa">Empresa</label>
          <input id="f-empresa" name="empresa" type="text" required autocomplete="organization" placeholder="Razão social ou marca">
          <span class="erro-msg">Preencha a empresa.</span>
        </div>
        <div class="campo">
          <label for="f-email">E-mail</label>
          <input id="f-email" name="email" type="email" required autocomplete="email" placeholder="voce@empresa.com.br">
          <span class="erro-msg">Informe um e-mail válido.</span>
        </div>
        <div class="campo">
          <label for="f-tel">Telefone</label>
          <input id="f-tel" name="telefone" type="tel" autocomplete="tel" placeholder="(11) 9 0000-0000">
        </div>
        <div class="campo">
          <label for="f-tipo">Tipo de obra</label>
          <select id="f-tipo" name="tipo" required>
            <option value="">Selecione</option>
            <option>Obra corporativa</option>
            <option>Varejo ou flagship</option>
            <option>Retrofit em ambiente ocupado</option>
            <option>Manutenção predial</option>
            <option>Ainda não sei</option>
          </select>
          <span class="erro-msg">Escolha o tipo de obra.</span>
        </div>
        <div class="campo">
          <label for="f-area">Área aproximada (m²)</label>
          <input id="f-area" name="area" type="number" min="0" step="10" placeholder="Ex.: 850">
        </div>
        <div class="campo full">
          <label for="f-msg">Contexto da obra</label>
          <textarea id="f-msg" name="mensagem" placeholder="Endereço, prazo desejado, se a operação continua funcionando, se já existe projeto executivo…"></textarea>
        </div>
      </div>
      <?php /* o nonce vai como campo comum porque o JavaScript monta o corpo do
               envio a partir de todos os campos do formulário */ ?>
      <input type="hidden" name="spx_nonce" value="<?php echo esc_attr(wp_create_nonce('spx_contato')); ?>">
      <div class="isca" aria-hidden="true">
        <label for="f-site">Não preencha este campo</label>
        <input id="f-site" name="site" type="text" tabindex="-1" autocomplete="off">
      </div>
      <div class="form-rodape">
        <p class="form-nota">As informações são encaminhadas diretamente à coordenação de obras.</p>
        <button class="btn btn-acc" type="submit">Solicitar visita técnica ↗</button>
      </div>
      <div class="form-ok" role="status">
        <svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="m8 12.3 2.7 2.7L16 9.5"/></svg>
        <h3 id="formTitulo">Solicitação enviada</h3>
        <p class="lead" id="formTexto" style="margin:12px auto 0;text-align:center">A coordenação de obras recebeu as informações. O retorno é feito em até um dia útil.</p>
        <div class="acoes">
          <a class="btn" id="linkZap" href="#" rel="noopener">Enviar pelo WhatsApp</a>
          <a class="btn btn-ghost" id="linkMail" href="#">Enviar por e-mail</a>
        </div>
      </div>
    </form>
    </div>
  </div>
</section>

<?php
echo spx_faixa_dupla('pequena');
get_footer();
