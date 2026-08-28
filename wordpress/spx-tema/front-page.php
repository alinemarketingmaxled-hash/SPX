<?php
/**
 * Página inicial.
 *
 * A home é escrita à mão, e não montada por componentes como as internas: tem
 * hero com foto em rodízio, faixa de segmentos, carrossel do acervo e o
 * formulário — cada bloco com um arranjo próprio. O HTML veio como estava,
 * trocando só endereço de imagem e de link pelas funções do WordPress:
 * reescrever de cabeça uma página tantas vezes ajustada é onde entra erro.
 */

if (!defined('ABSPATH')) { exit; }

$e = spx('empresa');

$spx = [
  'title'     => 'SPX Engenharia | Obras Corporativas, Retrofit e Varejo em São Paulo',
  'descricao' => 'A SPX Engenharia executa obras corporativas, comerciais, reformas e retrofit em São Paulo e região. Solicite uma avaliação da sua obra.',
  'visual'    => 'pag-inicio',
  /* sem h1 no cabeçalho: a home tem o dela dentro do hero */
  'schema'    => array_filter([
    spx_schema_pessoa(),
    ['@type' => 'WebSite', '@id' => spx_site() . '/#site', 'name' => $e['nome'],
     'url' => spx_site() . '/', 'publisher' => ['@id' => spx_id_empresa()],
     'inLanguage' => 'pt-BR'],
  ]),
];
spx_cabecalho($spx);
?>


<header class="hero" id="obras">
  <div class="hero-fundo" id="heroFundo" aria-hidden="true">
    <img class="ativa" src="<?php echo esc_url(spx_img('sala-reuniao-azul-640.webp')); ?>"
         srcset="<?php echo esc_attr(spx_srcset('img/sala-reuniao-azul-480.webp 480w, sala-reuniao-azul-640.webp 640w, sala-reuniao-azul-960.webp 960w')); ?>"
         sizes="100vw" width="960" height="1363"
         alt="Sala de reunião com parede azul" fetchpriority="high" decoding="async">
  </div>
  <div class="hero-veu" aria-hidden="true"></div>

  <div class="wrap hero-corpo">
    <div class="hero-top" data-reveal>
      <h1>Engenharia e execução de obras corporativas em São Paulo<em>Seu projeto. Nossa engenharia.</em></h1>
      <div>
        <p class="lead">Planejamento, gerenciamento, execução e entrega conduzidos por uma única equipe.<br>Faria Lima, Paulista, Jardins, Brooklin, Alphaville e demais polos da Grande São Paulo.</p>
        <div class="hero-acoes">
          <a class="btn" href="<?php echo esc_url(home_url('/obras')); ?>">Ver projetos realizados ↗</a>
          <a class="btn btn-ghost" href="<?php echo esc_url(home_url('/contato')); ?>">Solicitar avaliação da obra</a>
        </div>
      </div>
    </div>
  </div>

  <div class="wrap hero-base">
    <div class="ficha">
      <div><b data-conta="9" data-prefixo="+" data-sufixo=" anos">+9 anos</b><span>De experiência em engenharia</span></div>
      <div><b data-conta="40" data-prefixo="+">+40</b><span>Obras entregues</span></div>
      <div><b data-conta="42" data-sufixo=" mil m²">42 mil m²</b><span>Construídos</span></div>
    </div>
    <div class="hero-setas">
      <button type="button" data-hero="ant" aria-label="Foto anterior">
        <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M15 5l-7 7 7 7"/></svg>
      </button>
      <button type="button" data-hero="prox" aria-label="Próxima foto">
        <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9 5l7 7-7 7"/></svg>
      </button>
    </div>
  </div>
</header>

<section class="segmentos" id="segmentos" aria-label="Segmentos atendidos">
  <div class="seg-esteira"><div class="seg-track" id="segTrilho"></div></div>
</section>

<section class="sec" id="arquivo">
  <div class="wrap centro" data-reveal>
    <p class="eyebrow">Do executivo à inauguração</p>
    <h2 style="margin-top:20px">O projeto sai da planta<br>e vira realidade.</h2>
  </div>
  <div class="beamwrap" id="beamwrap">
    <div class="beam" aria-hidden="true"><span class="rot esq">Projeto</span><span class="rot dir">Entregue</span></div>
    <div class="track" id="track"></div>
  </div>
</section>

<section class="sec wrap claro" id="servicos">
  <div class="cabeca" data-reveal>
    <div>
      <p class="eyebrow">O que executamos</p>
      <h2 style="margin-top:20px">Quatro frentes de<br>contrato, um só padrão.</h2>
    </div>
    <p class="lead" style="max-width:44ch">Do escopo fechado, com projeto executivo definido, ao contrato de manutenção recorrente. Sempre com o mesmo engenheiro responsável do início ao fim.</p>
  </div>
  <div class="servicos">
    <article class="card serv cantos" data-reveal>
      <div class="serv-cab"><span class="ico"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 21h18M5 21V8l7-5 7 5v13M10 21v-6h4v6"/></svg></span><h3>Obra corporativa</h3></div>
      <p>Sedes, andares e escritórios completos, do fit-out ao mobiliário fixo.</p>
      <ul><li>Layout e compatibilização</li><li>Marcenaria sob medida</li><li>Elétrica, dados e climatização</li><li>As-built e manuais na entrega</li></ul>
    </article>
    <article class="card serv cantos" data-reveal data-atraso="1">
      <div class="serv-cab"><span class="ico"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 9h18l-1.5-4.5h-15zM4.5 9v11h15V9M9 20v-6h6v6"/></svg></span><h3>Varejo e flagship</h3></div>
      <p>Loja nova, reforma de rede e padrão de bandeira replicado em escala.</p>
      <ul><li>Obra em shopping e rua</li><li>Fachada e aprovação legal</li><li>Roll-out multi-loja</li><li>Entrega em janela de inauguração</li></ul>
    </article>
    <article class="card serv cantos" data-reveal data-atraso="2">
      <div class="serv-cab"><span class="ico"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 20h16M6 20V6h8v14M14 11h4v9M9 9h2M9 13h2"/></svg></span><h3>Retrofit ocupado</h3></div>
      <p>Edifício em operação, equipes em atividade e obra executada na janela autorizada.</p>
      <ul><li>Trabalho noturno e fim de semana</li><li>Controle de poeira e ruído</li><li>Plano de risco com o condomínio</li><li>Área liberada limpa a cada turno</li></ul>
    </article>
    <article class="card serv cantos" data-reveal data-atraso="3">
      <div class="serv-cab"><span class="ico"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="m14.7 6.3 3 3M3 21l3.5-1 11-11-2.5-2.5-11 11zM17 3.5 20.5 7"/></svg></span><h3>Manutenção predial</h3></div>
      <p>Contrato recorrente com equipe residente e chamado com prazo fechado.</p>
      <ul><li>Preventiva e corretiva</li><li>Laudos e adequação de norma</li><li>Atendimento em até 48h</li><li>Relatório mensal por ativo</li></ul>
    </article>
  </div>
</section>

<?php echo spx_faixa_dupla(); ?>

<section class="sec wrap sec-linha" id="frentes">
  <div class="hub-grid">
    <div data-reveal>
      <p class="eyebrow">Coordenação</p>
      <h2 style="margin:20px 0">Seis frentes,<br>um só cronograma.</h2>
      <p class="lead">Civil, elétrica, hidráulica, climatização, automação e segurança do trabalho respondem a uma coordenação única. Cada medição passa pelo mesmo painel antes de virar avanço físico no relatório semanal.</p>
      <div style="display:flex;gap:12px;flex-wrap:wrap;margin-top:28px">
        <a class="btn" href="#metodo">Conhecer o método</a>
      </div>
    </div>
    <div class="hub" id="hub" data-reveal data-atraso="1">
      <svg class="lines" viewBox="0 0 520 480" aria-hidden="true">
        <circle cx="260" cy="240" r="150" fill="none" stroke="currentColor" stroke-opacity=".14" stroke-width="1"></circle>
        <g id="raios" stroke="currentColor" stroke-opacity=".18" stroke-width="1"></g>
        <g id="pulsos" stroke="#6E90AE" stroke-width="1.6" stroke-linecap="round" opacity=".9"></g>
      </svg>
    </div>
  </div>
</section>

<section class="sec wrap vidro" id="metodo">
  <div class="cabeca" data-reveal>
    <div>
      <p class="eyebrow">Etapas do processo</p>
      <h2 style="margin-top:20px">Cinco etapas,<br>nenhuma surpresa.</h2>
    </div>
    <p class="lead" style="max-width:44ch">O mesmo procedimento em todas as obras, da visita técnica à garantia. O andamento é documentado e enviado periodicamente, sem necessidade de cobrança.</p>
  </div>
  <div class="passos">
    <article class="passo" data-reveal tabindex="0" data-etapa="01 · Visita técnica"
           data-frentes="" data-nota="Levantamento em campo, antes do cronograma existir.">
      <h3>Visita técnica</h3>
      <p>Engenheiro em campo, levantamento de interferências e restrições do condomínio.</p>
      <span class="prazo">48h para agendar</span>
      <span class="passo-fase">No cronograma · levantamento e restrições</span>
    </article>
    <article class="passo" data-reveal data-atraso="1" tabindex="0" data-etapa="02 · Proposta"
           data-frentes="" data-nota="O cronograma inteiro é emitido junto da proposta.">
      <h3>Proposta</h3>
      <p>Proposta técnica detalhada, com todos os serviços inclusos e composição de BDI aberta.</p>
      <span class="prazo">5 dias úteis</span>
      <span class="passo-fase">No cronograma · emissão e aprovação</span>
    </article>
    <article class="passo" data-reveal data-atraso="2" tabindex="0" data-etapa="03 · Mobilização"
           data-frentes="Limpeza e proteção|Demolição e construção">
      <h3>Mobilização</h3>
      <p>Cronograma físico-financeiro, montagem de canteiro, documentação de acesso e compras de prazo longo.</p>
      <span class="prazo">Semana 1</span>
      <span class="passo-fase">No cronograma · limpeza, proteção e demolição</span>
    </article>
    <article class="passo" data-reveal data-atraso="3" tabindex="0" data-etapa="04 · Execução"
           data-frentes="Sprinklers|Impermeabilização|Instalações elétricas|Revestimentos|Instalações hidráulicas|Drywall|Piso elevado">
      <h3>Execução</h3>
      <p>Seis frentes coordenadas, relatório semanal com foto e avanço por disciplina.</p>
      <span class="prazo">Toda sexta</span>
      <span class="passo-fase">No cronograma · instalações, drywall e revestimentos</span>
    </article>
    <article class="passo" data-reveal data-atraso="3" tabindex="0" data-etapa="05 · Entrega"
           data-frentes="Pintura">
      <h3>Entrega</h3>
      <p>Vistoria com checklist, as-built, manuais e garantia contratual ativa.</p>
      <span class="prazo">Chamado em 48h</span>
      <span class="passo-fase">No cronograma · pintura, vistoria e as-built</span>
    </article>
  </div>

  <div class="cronograma" data-reveal>
    <div class="cronograma-texto">
      <h3>Por que o cronograma<br>vem antes da obra.</h3>
      <p>Obra sem cronograma é obra sem prazo. Cada frente entra com duração, predecessora e
      janela definidas antes de a primeira equipe subir, e é isso que permite prever a entrega,
      dimensionar equipe e cobrar avanço com número na mão.</p>
      <p>O documento sai junto da proposta e é atualizado toda sexta com o avanço físico medido
      em obra.</p>
      <p class="cronograma-dica">Passe o cursor ou toque numa etapa acima para ver as frentes
      que ela cobre no cronograma.</p>
    </div>
    <div class="folha" id="folhaCronograma"></div>
  </div>
</section>

<section class="sec cover" id="atuacao">
  <div class="brumas" aria-hidden="true"><span></span><span></span><span></span></div>
  <div class="wrap cover-in" data-reveal>
    <span class="selo">Raio de atuação</span>
    <h2 style="margin:26px 0 0">Onde a sua operação estiver,<br>a SPX já montou canteiro.</h2>
    <p class="lead" style="margin-top:18px">Equipe própria na Grande São Paulo e coordenação residente em obra fora do raio metropolitano.</p>
    <div class="pills" id="pills">
      <span class="pill"><i>FL</i>Faria Lima</span>
      <span class="pill"><i>BR</i>Berrini</span>
      <span class="pill"><i>VO</i>Vila Olímpia</span>
      <span class="pill"><i>PN</i>Pinheiros</span>
      <span class="pill"><i>AL</i>Alphaville</span>
      <span class="pill"><i>GRU</i>Guarulhos</span>
      <span class="pill"><i>SBC</i>São Bernardo</span>
      <span class="pill"><i>OSA</i>Osasco</span>
      <span class="pill"><i>CPQ</i>Campinas</span>
      <span class="pill extra"><i>STA</i>Santo André</span>
      <span class="pill extra"><i>BAR</i>Barueri</span>
      <span class="pill extra"><i>SJC</i>São José dos Campos</span>
      <span class="pill extra"><i>SOR</i>Sorocaba</span>
      <span class="pill extra"><i>RP</i>Ribeirão Preto</span>
      <button class="pill mais" id="maisPill" type="button" aria-expanded="false">+31 cidades</button>
    </div>
    <div class="nums">
      <span><b data-conta="40" data-prefixo="+">+40</b> obras entregues</span><s aria-hidden="true">/</s>
      <span><b data-conta="42" data-sufixo=" mil">42 mil</b> m² construídos</span><s aria-hidden="true">/</s>
      <span><b data-conta="9" data-prefixo="+">+9</b> anos de experiência em engenharia</span><s aria-hidden="true">/</s>
      <span><b data-conta="0">0</b> acidentes com afastamento</span>
    </div>
  </div>
</section>

<section class="sec wrap" id="clientes">
  <div class="cabeca" data-reveal>
    <div>
      <p class="eyebrow">Compromissos de contrato</p>
      <h2 style="margin-top:20px">O que entra por escrito<br>em toda obra.</h2>
    </div>
    <a class="btn btn-ghost" href="#arquivo">Ver o portfólio de obras →</a>
  </div>
  <div class="compromissos" id="compromissos"></div>
</section>

<section class="sec wrap claro" id="duvidas">
  <div class="faq-grid">
    <div class="faq-side" data-reveal>
      <h2>Dúvidas técnicas respondidas por engenheiro.</h2>
      <p class="lead" style="margin-top:18px;font-size:15px">As respostas ao lado cobrem as dúvidas mais frequentes. Para concorrências, laudos, adequação de norma ou obras com prazo crítico, envie o contexto completo. O atendimento é conduzido diretamente pelo engenheiro responsável.</p>
      <div class="faq-stats">
        <div><b data-conta="5" data-sufixo=" dias">5 dias</b><span>Orçamento preliminar</span></div>
        <div><b data-conta="98" data-sufixo="%">98%</b><span>Obras entregues no prazo</span></div>
      </div>
      <a class="btn btn-bloco" href="#contato">Falar com a equipe ↗</a>
      <p style="font-size:12px;color:var(--txt-3);margin-top:14px">Seg a sex, das 8h às 18h · obra 24h sob escopo</p>
    </div>
    <div class="faq-cols" id="faqLista" data-reveal data-atraso="1"></div>
  </div>
</section>

<section class="sec wrap sec-linha" id="contato">
  <div class="contato-grid">
    <div data-reveal>
      <p class="eyebrow">Visita técnica</p>
      <h2 style="margin:20px 0">Envie o contexto da obra.<br>A avaliação é feita no local.</h2>
      <p class="lead">Preencha as informações disponíveis; o que faltar é levantado na visita técnica. O retorno é feito em até um dia útil e o orçamento preliminar, em até cinco.</p>
      <div class="canais">
        <a class="canal" href="tel:+5511952751874">
          <span class="ico"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 4h4l2 5-2.5 1.5a12 12 0 0 0 5 5L15 13l5 2v4a1 1 0 0 1-1.1 1A16 16 0 0 1 4 5.1 1 1 0 0 1 5 4Z"/></svg></span>
          <span><b>(11) 95275-1874</b><span>Seg a sex, 8h às 18h</span></span>
        </a>
        <a class="canal" href="https://wa.me/5511952751874" rel="noopener">
          <span class="ico"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20.5 12a8.5 8.5 0 1 1-4.2-7.3L21 3.5l-1.2 4.6A8.4 8.4 0 0 1 20.5 12Z"/><path d="M9 9.4c.5 2.2 2.4 4.1 4.6 4.6l1.1-1.2 1.8.8-.5 1.6c-3.4.5-7.2-3.3-6.7-6.7l1.6-.5.8 1.8z"/></svg></span>
          <span><b>WhatsApp</b><span>Retorno em até 2 horas úteis</span></span>
        </a>
        <a class="canal" href="mailto:contato@spxengenharia.com.br">
          <span class="ico"><svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3.5 6.5 8.5 6 8.5-6"/></svg></span>
          <span><b>contato@spxengenharia.com.br</b><span>Concorrências e documentação</span></span>
        </a>
      </div>
    </div>

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
      <?php /* o nonce vai como campo comum: o JavaScript monta o corpo do envio a
         partir de todos os campos do formulário */ ?>
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
</section>


<?php get_footer();
