<?php
/**
 * Rodapé de todas as páginas, mais o botão flutuante do WhatsApp.
 *
 * O botão sai daqui porque o rodapé é a peça costurada em toda página — assim
 * ele aparece em todas sem markup repetido em vinte arquivos.
 */

if (!defined('ABSPATH')) { exit; }

$e = spx('empresa');
$zap = preg_replace('/\D/', '', $e['whatsapp']);
?>
</main>

<footer class="wrap rodape">
  <div class="rod-grid" data-reveal>
    <div>
      <p style="max-width:34ch;font-size:15px"><?php echo spx_esc($e['definicao']); ?></p>
      <div class="soc">
<?php
/* A linha só afirma o que está confirmado: sem o endereço do perfil, o ícone
   não aparece — link social quebrado é pior do que não ter link. */
if (!spx_falta($e['instagram'])) : ?>
        <a href="<?php echo esc_url($e['instagram']); ?>" rel="noopener" aria-label="Instagram da SPX Engenharia"><svg width="17" height="17" viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none"/></svg></a>
<?php else : spx_anota('Rodapé', 'endereço do Instagram'); endif;
if (!spx_falta($e['linkedin'])) : ?>
        <a href="<?php echo esc_url($e['linkedin']); ?>" rel="noopener" aria-label="LinkedIn da SPX Engenharia"><svg width="17" height="17" viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="4"/><path d="M8 11v6M8 7.6v.1M12 17v-3.2a2 2 0 0 1 4 0V17"/></svg></a>
<?php else : spx_anota('Rodapé', 'endereço do LinkedIn'); endif; ?>
        <a href="https://wa.me/<?php echo esc_attr($zap); ?>" rel="noopener" aria-label="WhatsApp da SPX Engenharia"><svg width="17" height="17" viewBox="0 0 24 24" aria-hidden="true"><path d="M20.5 12a8.5 8.5 0 1 1-4.2-7.3L21 3.5l-1.2 4.6A8.4 8.4 0 0 1 20.5 12Z"/><path d="M9 9.4c.5 2.2 2.4 4.1 4.6 4.6l1.1-1.2 1.8.8-.5 1.6c-3.4.5-7.2-3.3-6.7-6.7l1.6-.5.8 1.8z"/></svg></a>
      </div>
    </div>

    <div><h3>Serviços</h3><ul>
<?php foreach (array_slice(spx_servicos(), 0, 5) as $s) :
  printf('<li><a href="%s">%s</a></li>', esc_url(home_url('/servicos/' . $s['slug'])), spx_esc($s['nome']));
endforeach; ?>
      <li><a href="<?php echo esc_url(home_url('/servicos')); ?>">Todos os serviços</a></li></ul></div>

    <div><h3>Projetos</h3><ul>
<?php
/* projetos publicáveis, não todos: o rodapé chegou a linkar três obras que o
   site nunca escreve porque faltam tipo, atuação e fotos — eram 54 links
   internos apontando para 404 */
foreach (spx_projetos() as $p) {
  printf('<li><a href="%s">%s</a></li>', esc_url(home_url('/obras/' . $p['slug'])), spx_esc($p['nome']));
} ?>
      <li><a href="<?php echo esc_url(home_url('/obras')); ?>">Todos os projetos</a></li>
      <li><a href="<?php echo esc_url(home_url('/atuacao')); ?>">Onde atuamos</a></li></ul></div>

    <div><h3>Empresa</h3><ul>
      <li><a href="<?php echo esc_url(home_url('/sobre')); ?>">Sobre a SPX</a></li>
      <li><a href="<?php echo esc_url(home_url('/para-arquitetos')); ?>">Para arquitetos</a></li>
      <li><a href="<?php echo esc_url(home_url('/duvidas')); ?>">Dúvidas frequentes</a></li>
      <li><a href="<?php echo esc_url(home_url('/servicos-e-regioes')); ?>">Serviços por região</a></li>
      <li><a href="<?php echo esc_url(home_url('/contato')); ?>">Contato</a></li></ul></div>

    <div class="wordmark" id="wordmark" aria-hidden="true">
      <img class="wm base" src="<?php echo esc_url(spx_img('logo-negativa.webp')); ?>" width="723" height="304" alt="" loading="lazy" decoding="async">
      <img class="wm luz" src="<?php echo esc_url(spx_img('logo-negativa.webp')); ?>" width="723" height="304" alt="" loading="lazy" decoding="async">
    </div>
  </div>

  <div class="rod-fim">
    <span><?php
      $selo = ['© <span data-ano>' . esc_html(date('Y')) . '</span> ' . spx_esc($e['nome'])];
      if (!spx_falta($e['cnpj'])) { $selo[] = 'CNPJ ' . spx_esc($e['cnpj']); }
      else { spx_anota('Rodapé', 'CNPJ'); }
      $selo[] = spx_esc($e['base']);
      echo implode(' · ', $selo);
    ?></span>
    <span style="display:flex;gap:20px;flex-wrap:wrap"><a href="<?php echo esc_url(home_url('/privacidade')); ?>">Privacidade</a><a href="<?php echo esc_url(home_url('/duvidas')); ?>">Dúvidas</a><a href="<?php echo esc_url(home_url('/contato')); ?>">Contato</a></span>
  </div>
</footer>

<a class="zap" href="https://wa.me/<?php echo esc_attr($zap); ?>" rel="noopener"
   aria-label="Falar com a <?php echo esc_attr($e['nome']); ?> no WhatsApp" data-zap>
  <!-- a marca do WhatsApp desenhada de verdade, cheia. A aproximação feita a
       traço não lia como o aplicativo: virava um círculo com um risco dentro. -->
  <svg viewBox="0 0 24 24" class="zap-marca" aria-hidden="true"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.174.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347M12.05 21.785h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"/></svg>
  <span><?php echo spx_esc(str_replace('+55 ', '', $e['telefone'])); ?> · WhatsApp</span>
</a>

<?php wp_footer(); ?>
</body>
</html>
