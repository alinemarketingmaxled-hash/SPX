/* ============================================================
   SPX ENGENHARIA — comportamento compartilhado (index + 404)
   Cada módulo checa se o alvo existe, então o mesmo arquivo
   serve qualquer página do site.
   ============================================================ */
(function(){

/* Base das imagens. No site estático é /img/; dentro do tema do WordPress as
   fotos moram na pasta do tema, e o PHP informa o caminho em SPX_WP.img. O
   mesmo arquivo serve aos dois — sem isso seria um JavaScript para manter em
   dobro, e é justamente onde um erro passaria despercebido. */
var IMG = (window.SPX_WP && window.SPX_WP.img) || '/img/';
/* o telefone e o e-mail da saída de emergência do formulário — quando o envio
   falha, os botões de WhatsApp e e-mail precisam apontar para o contato atual,
   e não para o que estava certo no dia em que este arquivo foi escrito */
var ZAP   = (window.SPX_WP && window.SPX_WP.zap)   || '5511952751874';
var EMAIL = (window.SPX_WP && window.SPX_WP.email) || 'contato@spxengenharia.com.br';
var ERRO  = (window.SPX_WP && window.SPX_WP.erro)  || '/api/erro';
'use strict';

var reduz = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
/* monta a seção só quando ela chega perto da tela: no carregamento, o
   navegador não gasta tempo com blocos que ainda estão longe */
function aoAproximar(alvo, monta){
  if(!alvo) return;
  if(!('IntersectionObserver' in window)){ monta(); return; }
  var io = new IntersectionObserver(function(es){
    if(es[0].isIntersecting){ io.disconnect(); monta(); }
  }, {rootMargin:'600px 0px'});
  io.observe(alvo);
}

var DIM = {"banheiro-marmore":[1200,1600],"cozinha-marcenaria":[900,1600],"estante-espinha-peixe":[1200,1600],"lavabo-azul":[1067,1600],"lavabo-bordo":[1044,1600],"lavabo-terracota":[1200,1600],"lounge-recepcao":[1067,1600],"mesa-vista-sp":[960,1280],"recepcao-marmore":[1600,1066],"restaurante-bar":[720,1280],"restaurante-cozinha":[720,1280],"restaurante-fachada":[720,1280],"restaurante-pratos":[720,1280],"restaurante-salao":[720,1280],"sala-reuniao-azul":[1127,1600]};

var OBRAS = [
  ['sala-reuniao-azul','Sala de reunião · parede azul'],
  ['recepcao-marmore','Recepção · balcão em mármore'],
  ['lounge-recepcao','Lounge de espera · balcão em pedra'],
  ['mesa-vista-sp','Sala de reunião · vista São Paulo'],
  ['estante-espinha-peixe','Escritório · estante e piso espinha de peixe'],
  ['cozinha-marcenaria','Copa · marcenaria e bancada'],
  ['banheiro-marmore','Banheiro · marcenaria ripada'],
  ['lavabo-bordo','Lavabo · meia-parede em bordô'],
  ['lavabo-azul','Lavabo · azulejo metrô e azul'],
  ['lavabo-terracota','Lavabo · terracota e porcelanato'],
  ['restaurante-fachada','Restaurante · salão e fachada'],
  ['restaurante-salao','Restaurante · salão'],
  ['restaurante-cozinha','Restaurante · cozinha à vista'],
  ['restaurante-pratos','Restaurante · painel de pratos'],
  ['restaurante-bar','Restaurante · bar e mesas']
];

var $  = function(s,c){ return (c||document).querySelector(s); };
var $$ = function(s,c){ return Array.prototype.slice.call((c||document).querySelectorAll(s)); };

/* ---------------------------------------------- tema claro/escuro */
/* O site é escuro, e só. O alternador de tema saiu a pedido: o que sobra aqui
   é garantir o atributo mesmo se alguém tiver 'claro' guardado de antes, e
   limpar esse resto do navegador dele. */
(function tema(){
  document.documentElement.setAttribute('data-tema', 'escuro');
  try{ localStorage.removeItem('spx-tema'); }catch(e){}
})();

/* ---------------------------------------------- barra de progresso */
(function progresso(){
  var barra = $('.progresso');
  if(!barra) return;
  var pendente = false, curso = 0;
  function mede(){ curso = document.documentElement.scrollHeight - window.innerHeight; }
  function pinta(){
    barra.style.transform = 'scaleX(' + (curso > 0 ? Math.min(window.scrollY / curso, 1) : 0) + ')';
    pendente = false;
  }
  mede();
  window.addEventListener('resize', mede);
  if('ResizeObserver' in window) new ResizeObserver(mede).observe(document.body);
  window.addEventListener('scroll', function(){
    if(!pendente){ pendente = true; requestAnimationFrame(pinta); }
  }, {passive:true});
  pinta();
})();

/* ---------------------------------------------- menu mobile */
(function gaveta(){
  var painel = $('#gaveta');
  if(!painel) return;
  var abrir = $$('[data-acao="menu"]');
  var fechar = $$('[data-acao="fechar-menu"]');
  var ultimoFoco = null;

  function estado(aberta){
    painel.classList.toggle('aberta', aberta);
    painel.setAttribute('aria-hidden', String(!aberta));
    document.body.style.overflow = aberta ? 'hidden' : '';
    abrir.forEach(function(b){ b.setAttribute('aria-expanded', String(aberta)); });
    if(aberta){
      ultimoFoco = document.activeElement;
      var alvo = $('a,button', painel);
      if(alvo) alvo.focus();
    } else if(ultimoFoco){
      ultimoFoco.focus();
    }
  }
  abrir.forEach(function(b){ b.addEventListener('click', function(){ estado(true); }); });
  fechar.forEach(function(b){ b.addEventListener('click', function(){ estado(false); }); });
  $$('a', painel).forEach(function(a){ a.addEventListener('click', function(){ estado(false); }); });
  document.addEventListener('keydown', function(e){
    if(e.key === 'Escape' && painel.classList.contains('aberta')) estado(false);
  });
  window.addEventListener('resize', function(){
    if(window.innerWidth > 980 && painel.classList.contains('aberta')) estado(false);
  });
  estado(false);
})();

/* ---------------------------------------------- fallback de imagem */
(function imagens(){
  document.addEventListener('error', function(e){
    var img = e.target;
    if(img.tagName !== 'IMG' || !img.dataset.ph || img.dataset.trocada) return;
    img.dataset.trocada = '1';
    img.src = img.dataset.ph;
  }, true);
})();

/* ---------------------------------------------- fotos de fundo do topo */
(function heroFotos(){
  var caixa = $('#heroFundo');
  if(!caixa) return;
  /* as páginas internas trazem a própria lista no data-fotos; a home usa a
     lista padrão. Assim o mesmo módulo faz as fotos passarem em qualquer topo. */
  var destaque = (caixa.dataset.fotos || '').split(',').filter(Boolean);
  if(!destaque.length){
    destaque = ['sala-reuniao-azul','recepcao-marmore','mesa-vista-sp',
                'lounge-recepcao','estante-espinha-peixe','restaurante-fachada'];
  }
  var legendas = {};
  OBRAS.forEach(function(o){ legendas[o[0]] = o[1]; });

  /* Home e páginas internas usam a mesma coisa: a foto inteira, em pé. Havia
     um recorte horizontal só para o cabeçalho interno, que saiu junto com a
     faixa larga — cortava tanto a obra que sobrava um fragmento dela. */
  var LARGURAS = [480, 640, 768, 960];

  function medidas(arq){ return DIM[arq] || [1200,1600]; }
  /* só entram as larguras que existem em disco */
  function conjunto(arq){
    var limite = (DIM[arq] || [1200,1600])[0];
    return LARGURAS.filter(function(w){ return w < limite; })
      .map(function(w){ return IMG + arq + '-' + w + '.webp ' + w + 'w'; })
      .join(', ');
  }
  /* o `sizes` sai do próprio HTML: a home e o cabeçalho interno mostram a foto
     em caixas de largura bem diferente, e chutar 100vw nos dois faz o
     navegador baixar variante maior do que cabe */
  var TAM = (caixa.querySelector('img') || {}).sizes || '100vw';
  function marcacao(arq){
    var d = medidas(arq);
    return '<img src="' + IMG + arq + '-640.webp" srcset="' + conjunto(arq) + '"' +
      ' sizes="' + TAM + '" width="' + d[0] + '" height="' + d[1] + '"' +
      ' data-ph="' + IMG + 'ph/' + arq + '.svg"' +
      ' alt="' + (legendas[arq] || '') + '" loading="lazy" decoding="async">';
  }

  var fotos = $$('img', caixa);
  if(!fotos.length) return;
  var atual = 0;
  var painel = caixa.parentElement;

  /* o vão entre o título e a foto é preenchido pela própria imagem, esticada e
     apagada por trás. Aponta para `currentSrc`, o arquivo que o navegador já
     escolheu e baixou para o <img>: vira `background-image` sem custar um
     pedido novo. Antes de a imagem resolver, `currentSrc` vem vazio — daí a
     repetição no `load`. */
  function pinta(){
    var im = fotos[atual], url = im && (im.currentSrc || im.src);
    if(painel && url) painel.style.setProperty('--capa', 'url("' + url + '")');
  }
  fotos[0].classList.add('ativa');
  pinta();
  window.addEventListener('load', pinta);
  if(reduz) return;

  /* As outras fotos do rodízio só entram depois que a página carregou. Elas
     ficam dentro da tela, então `loading="lazy"` não segura nada: o navegador
     baixava as quatro de uma vez e as três seguintes disputavam banda com a
     primeira, que é o maior elemento pintado. Medido, custava 0,6 s de LCP —
     e a primeira troca só acontece 6,5 s depois de a página abrir. */
  function depois(fn){
    if(document.readyState === 'complete') setTimeout(fn, 400);
    else window.addEventListener('load', function(){ setTimeout(fn, 400); });
  }

  var relogio = null;
  function mostra(i){
    fotos[atual].classList.remove('ativa');
    atual = (i + fotos.length) % fotos.length;
    fotos[atual].classList.add('ativa');
    pinta();
  }
  function anda(passo){
    mostra(atual + passo);
    reinicia();
  }
  function reinicia(){
    clearInterval(relogio);
    relogio = setInterval(function(){ mostra(atual + 1); }, 6500);
  }

  depois(function(){
    caixa.insertAdjacentHTML('beforeend', destaque.slice(1).map(marcacao).join(''));
    fotos = $$('img', caixa);
    reinicia();
  });

  $$('[data-hero]').forEach(function(b){
    b.addEventListener('click', function(){ anda(b.dataset.hero === 'prox' ? 1 : -1); });
  });
  document.addEventListener('visibilitychange', function(){
    if(document.hidden) clearInterval(relogio); else if(fotos.length > 1) reinicia();
  });
})();

/* ---------------------------------------------- segmentos atendidos */
(function segmentos(){
  var track = $('#segTrilho');
  if(!track) return;

  var SEGMENTOS = [
    ['Escritórios','corporativos',      'M3 21h18M6 21V4h9v17M15 9h4v12M9 8h2.5M9 12h2.5M9 16h2.5'],
    ['Comercial','e varejo',            'M3 9h18l-1.6-4.5H4.6zM5 9v12h14V9M9 21v-6h6v6'],
    ['Restaurantes','e cafés',          'M7 3v8a2 2 0 0 0 4 0V3M9 11v10M16.5 3c-1.6 1.6-2.2 3.2-2.2 5.2s.7 2.8 2.2 2.8V21'],
    ['Clínicas e','laboratórios',       'M9 3h6M10 3v6l-5 10a2 2 0 0 0 1.8 3h10.4A2 2 0 0 0 19 19l-5-10V3M7.6 14h8.8'],
    ['Data center','e CPD',             'M4 4h16v6H4zM4 14h16v6H4zM7.5 7h.01M7.5 17h.01M11 7h5M11 17h5'],
    ['Hotelaria','e hospedagem',        'M3 18v-6h13a4 4 0 0 1 4 4v2M3 12V7M3 18h18v2M6.6 9.4h3.4'],
    ['Educação','e treinamento',        'M12 4 2 9l10 5 10-5zM6 11.6V17c0 1.6 3 3 6 3s6-1.4 6-3v-5.4'],
    ['Áreas comuns','de condomínio',    'M4 12V8a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v4M2 12h20v6H2zM6 18v2M18 18v2'],
    ['Retrofit em','ambiente ocupado',  'M4 21h16M7 21V6h10v15M10 10h4M10 14h4M12 2v3M9.5 4.5 12 2l2.5 2.5'],
    ['Manutenção','predial',            'm14.7 6.3 3 3M3 21l3.5-1 11-11-2.5-2.5-11 11zM17 3.5 20.5 7']
  ];

  function cartao(s){
    return '<article class="seg"><span class="seg-ico">' +
      '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="' + s[2] + '"/></svg></span>' +
      '<span class="seg-nome">' + s[0] + '<br>' + s[1] + '</span></article>';
  }
  /* a lista entra duplicada para o laço não ter emenda */
  var uma = SEGMENTOS.map(cartao).join('');
  track.innerHTML = uma + uma;
})();

/* ---------------------------------------------- acervo antes/depois */
(function acervo(){
  var track = $('#track');
  if(!track) return;
  aoAproximar($('#beamwrap'), function(){ monta(track); });

  function monta(track){
  var obras = OBRAS;
  var html = '';
  for(var v = 0; v < 2; v++){
    obras.forEach(function(o){
      var d = DIM[o[0]] || [1200,1600];
      var alt480 = Math.round(480 * d[1] / d[0]);
      html += '<figure class="frame"><img src="' + IMG + o[0] + '-480.webp"' +
              ' width="480" height="' + alt480 + '"' +
              ' srcset="' + IMG + o[0] + '-480.webp 480w, ' + IMG + o[0] + '-640.webp 640w"' +
              ' sizes="(max-width:900px) 250px, 320px"' +
              ' data-ph="' + IMG + 'ph/' + o[0] + '.svg"' +
              ' alt="' + o[1] + '" loading="lazy" decoding="async">' +
              '<span class="halftone"></span><figcaption class="tag">' + o[1] + '</figcaption></figure>';
    });
  }
  track.innerHTML = html;

  var frames = $$('.frame', track);
  var caixa = $('#beamwrap');
  var desloc = 0, pausado = false, ciclo = 0;
  /* o mouse não para mais a esteira: passar por cima dela é o que mais
     acontece na home, e a peça congelando a cada passada dava impressão de
     travamento. No toque continua parando, que ali é gesto deliberado. */
  caixa.addEventListener('touchstart', function(){ pausado = !pausado; }, {passive:true});

  /* as posições são medidas uma vez e recalculadas só no resize;
     ler o layout a cada quadro forçava reflow em trinta elementos */
  var meio = 0, centros = [];
  function medir(){
    ciclo = track.scrollWidth / 2;
    meio = caixa.offsetWidth / 2;
    centros = frames.map(function(f){ return f.offsetLeft + f.offsetWidth / 2; });
  }
  window.addEventListener('resize', medir);
  window.addEventListener('load', medir);
  setTimeout(medir, 150);

  var visivel = true;
  if('IntersectionObserver' in window){
    new IntersectionObserver(function(es){ visivel = es[0].isIntersecting; })
      .observe(caixa);
  }
  function anima(){
    if(visivel){
      if(!pausado && ciclo){
        desloc += 0.55;              /* da esquerda para a direita: planta → obra pronta */
        if(desloc >= 0) desloc -= ciclo;
      }
      track.style.transform = 'translateY(-50%) translateX(' + desloc + 'px)';
      for(var i = 0; i < frames.length; i++){
        var antes = (desloc + centros[i] - meio) < 0;
        if(frames[i].__antes !== antes){
          frames[i].__antes = antes;
          frames[i].classList.toggle('antes', antes);
        }
      }
    }
    requestAnimationFrame(anima);
  }
  if(reduz){ track.style.transform = 'translateY(-50%)'; }
  else{ requestAnimationFrame(anima); }
  }
})();

/* ---------------------------------------------- hub de frentes */
(function hub(){
  var caixa = $('#hub');
  if(!caixa) return;
  var raios = $('#raios'), pulsos = $('#pulsos');
  var frentes = [
    {n:'Civil',        p:'M4 20h16M6 20V9l6-4 6 4v11'},
    {n:'Elétrica',     p:'M13 3 5 14h6l-1 7 8-11h-6z'},
    {n:'Hidráulica',   p:'M12 3s6 6.4 6 10.4A6 6 0 0 1 6 13.4C6 9.4 12 3 12 3z'},
    {n:'Climatização', p:'M12 3v18M4.5 7.5l15 9M19.5 7.5l-15 9'},
    {n:'Automação',    p:'M5 8h14v10H5zM9 8V5h6v3M9 18v2M15 18v2'},
    {n:'Segurança',    p:'M12 3l8 3v6c0 5-3.4 8.3-8 9-4.6-.7-8-4-8-9V6z'}
  ];
  var CX = 260, CY = 240, R = 150;
  frentes.forEach(function(f,i){
    var a = (-90 + i*60) * Math.PI / 180;
    var x = CX + R*Math.cos(a), y = CY + R*Math.sin(a);
    raios.insertAdjacentHTML('beforeend','<line x1="'+CX+'" y1="'+CY+'" x2="'+x+'" y2="'+y+'"/>');
    pulsos.insertAdjacentHTML('beforeend','<line x1="'+CX+'" y1="'+CY+'" x2="'+x+'" y2="'+y+
      '" stroke-dasharray="18 '+(R-18)+'" stroke-dashoffset="'+R+
      '" style="animation:pulso 2.6s '+(i*0.42)+'s linear infinite"/>');
    var el = document.createElement('div');
    el.className = 'node';
    el.style.left = (x/520*100) + '%';
    el.style.top  = (y/480*100) + '%';
    el.innerHTML = '<div class="box"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" ' +
      'stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
      '<path d="'+f.p+'"/></svg></div><div class="lbl">'+f.n+'</div>';
    caixa.appendChild(el);
  });
  var centro = document.createElement('div');
  centro.className = 'node center';
  centro.style.left = '50%'; centro.style.top = '50%';
  centro.innerHTML = '<div class="box"><svg width="42" height="42" viewBox="0 0 48 48" aria-hidden="true">' +
    '<polygon points="6,8 16,8 42,40 32,40" fill="#6E90AE"/>' +
    '<polygon points="32,8 42,8 16,40 6,40" fill="#6E90AE"/></svg></div>' +
    '<div class="lbl">Coordenação SPX</div>';
  caixa.appendChild(centro);
  document.head.insertAdjacentHTML('beforeend','<style>@keyframes pulso{to{stroke-dashoffset:-'+R+'}}</style>');
})();

/* ---------------------------------------------- cidades extras */
(function cidades(){
  var botao = $('#maisPill');
  if(!botao) return;
  var extras = $$('.pill.extra');
  function alterna(){
    var abrindo = !extras[0].classList.contains('ver');
    extras.forEach(function(e,i){
      e.style.animationDelay = (i*45) + 'ms';
      e.classList.toggle('ver', abrindo);
    });
    botao.textContent = abrindo ? 'mostrar menos' : '+31 cidades';
    botao.setAttribute('aria-expanded', String(abrindo));
  }
  botao.addEventListener('click', alterna);
  botao.addEventListener('keydown', function(e){
    if(e.key === 'Enter' || e.key === ' '){ e.preventDefault(); alterna(); }
  });
})();

/* ---------------------------------------------- compromissos de contrato */
(function compromissos(){
  var caixa = $('#compromissos');
  if(!caixa) return;
  var itens = [
    ['Na proposta','Cronograma físico-financeiro, memorial descritivo e composição de BDI aberta acompanham toda proposta, antes de qualquer assinatura.'],
    ['Na execução','Engenheiro responsável com ART emitida para a obra, nomeado na proposta e presente em obra do início ao fim.'],
    ['Na entrega','Relatório semanal com registro fotográfico e avanço físico por disciplina, mais as-built e manuais no dia da vistoria.']
  ];
  caixa.innerHTML = itens.map(function(c,i){
    return '<article class="dep compromisso"><span class="etapa">' +
      String(i+1).padStart(2,'0') + ' · ' + c[0] + '</span><p>' + c[1] + '</p></article>';
  }).join('');
})();

/* ---------------------------------------------- dúvidas (FAQ) */
(function faq(){
  var lista = $('#faqLista');
  if(!lista) return;
  aoAproximar(lista.parentElement, monta);

  function monta(){
  /* As perguntas são curtas de propósito: numa coluna dessa largura, título de
     duas linhas deixa o cartão mais alto que os vizinhos e a fileira inteira
     cresce junto. A resposta é que carrega o detalhe.
     Nada aqui é invenção — cada resposta repete um compromisso que já está no
     processo, nos serviços ou nas garantias descritas no resto do site. */
  var perguntas = [
    ['Executam com o escritório funcionando?','Sim. É o nosso escopo principal. Trabalhamos em janela noturna ou de fim de semana, com isolamento acústico provisório, controle de poeira e liberação da área limpa antes da abertura.'],
    ['Como funciona a concorrência de preço?','Enviamos proposta com cronograma físico-financeiro, memorial e composição de BDI aberta. Se houver equalização com outros concorrentes, participamos da rodada técnica sem custo.'],
    ['Dá para começar antes do contrato?','Dá, com ordem de início por e-mail do responsável e escopo delimitado. Mobilizamos canteiro e compras de prazo longo enquanto o jurídico fecha, e o que for executado entra integralmente na medição.'],
    ['Qual o prazo de um orçamento?','Orçamento preliminar em até 5 dias úteis a partir da visita técnica. Proposta detalhada com projeto executivo em mãos: 10 dias úteis.'],
    ['Vocês orçam obra por telefone?','Não. Nenhuma obra é orçada sem visita ao local, com medição e registro das condições existentes e das restrições do condomínio ou do shopping.'],
    ['A proposta vem discriminada?','Serviço a serviço, com quantidades e critérios de medição. Sem verba aberta e sem "a definir".'],
    ['O cronograma vem com a proposta?','Vem junto dela, não depois de assinar: cronograma físico-financeiro com as frentes amarradas entre si, caminho crítico identificado e desembolso previsto por etapa.'],
    ['Vocês fazem o projeto ou só executam?','Executamos projeto de terceiros e também desenvolvemos o executivo com nossos projetistas parceiros. Compatibilização de disciplinas está sempre incluída.'],
    ['Quem coordena as disciplinas?','A compatibilização entre arquitetura, estrutura, elétrica, hidráulica, climatização e incêndio é feita antes de a equipe subir, para o conflito aparecer no papel e não na parede.'],
    ['A equipe é própria ou terceirizada?','Equipe própria e fornecedores coordenados pela mesma engenharia que orçou e planejou, com responsável técnico nomeado.'],
    ['Quem responde tecnicamente pela obra?','Engenheiro responsável com ART emitida para a obra, presente em obra e nomeado na proposta. Você sabe o nome antes de assinar.'],
    ['Como é medido o avanço da obra?','Medição semanal do avanço contra o cronograma, com registro fotográfico e relatório de desvio enquanto ainda dá para corrigir.'],
    ['O que é entregue no fim da obra?','Vistoria conjunta, lista de pendências fechada, as built e manuais das instalações — para a próxima intervenção não começar às cegas.'],
    ['Como é a garantia depois da entrega?','Cinco anos para estrutura e impermeabilização, um ano para acabamentos e instalações, conforme norma. Chamado de garantia é atendido em até 48 horas.'],
    ['Fazem manutenção depois da obra?','Fazemos, em contrato recorrente: preventiva e corretiva, laudos e adequação de norma, com prazo de atendimento fechado e relatório por ativo.'],
    ['Vocês trabalham com arquitetos?','Trabalhamos com escritórios de arquitetura executando o que foi desenhado, e apontando antes de a obra começar o que não vai caber.'],
    ['Vocês atendem fora da capital?','Atendemos São Paulo e a região metropolitana.'],
    ['E se a obra atrasar?','Multa por dia de atraso prevista em contrato, com as hipóteses de suspensão de prazo listadas de forma fechada, sem cláusula genérica de caso fortuito.']
  ];
  perguntas.forEach(function(q,i){
    var el = document.createElement('div');
    el.className = 'q';
    var id = 'resp-' + i;
    el.innerHTML = '<h3><button type="button" aria-expanded="false" aria-controls="' + id + '">' +
      '<span>' + q[0] + '</span><span class="sinal" aria-hidden="true">+</span></button></h3>' +
      '<div class="resp" id="' + id + '" role="region"><p>' + q[1] + '</p></div>';
    lista.appendChild(el);
  });
  $$('.q button').forEach(function(b){
    b.addEventListener('click', function(){
      var alvo = b.closest('.q');
      var abrindo = !alvo.classList.contains('aberta');
      $$('.q').forEach(function(o){
        o.classList.remove('aberta');
        o.querySelector('.resp').style.maxHeight = null;
        o.querySelector('button').setAttribute('aria-expanded','false');
      });
      if(abrindo){
        alvo.classList.add('aberta');
        b.setAttribute('aria-expanded','true');
        var r = alvo.querySelector('.resp');
        r.style.maxHeight = r.scrollHeight + 'px';
      }
    });
  });
  }
})();

/* ---------------------------------------------- folha de cronograma (resumo por frente) */
(function cronograma(){
  var folha = $('#folhaCronograma');
  if(!folha) return;
  aoAproximar(folha.closest('.cronograma') || folha, monta);

  function monta(){

  /* [frente, duração, início, término] — só as fases, sem as subtarefas */
  var FRENTES = [
    ['Limpeza e proteção',      '25 dias',   '16/06','21/07'],
    ['Demolição e construção',  '25,5 dias', '16/06','22/07'],
    ['Sprinklers',              '10 dias',   '01/07','15/07'],
    ['Impermeabilização',       '5 dias',    '11/07','18/07'],
    ['Instalações elétricas',   '22 dias',   '07/07','01/08'],
    ['Revestimentos',           '5,5 dias',  '18/07','31/07'],
    ['Instalações hidráulicas', '9,5 dias',  '22/07','04/08'],
    ['Drywall',                 '26 dias',   '24/07','29/08'],
    ['Piso elevado',            '8 dias',    '04/08','14/08'],
    ['Pintura',                 '40 dias',   '29/08','24/10']
  ];

  function dia(d){
    var p = d.split('/');
    return Date.UTC(2026, parseInt(p[1],10) - 1, parseInt(p[0],10)) / 86400000;
  }
  var INICIO = dia('16/06'), TOTAL = dia('24/10') - INICIO;

  var linhas = FRENTES.map(function(f){
    var esq = (dia(f[2]) - INICIO) / TOTAL * 100;
    var larg = Math.max((dia(f[3]) - dia(f[2])) / TOTAL * 100, 3);
    return '<tr data-frente="' + f[0] + '">' +
      '<td class="tarefa">' + f[0] + '</td>' +
      '<td class="dur">' + f[1] + '</td>' +
      '<td class="gantt"><span class="trilho"><i style="left:' + esq.toFixed(1) +
        '%;width:' + larg.toFixed(1) + '%"></i></span></td>' +
      '</tr>';
  }).join('');

  folha.innerHTML =
    '<div class="folha-cab">' +
      '<div><b>Cronograma físico-financeiro</b><span id="folhaLegenda">Obra corporativa · 10 frentes</span></div>' +
      '<div class="folha-selo">93,5 dias<span>jun a out</span></div>' +
    '</div>' +
    '<table class="folha-tabela">' +
      '<thead><tr><th>Frente</th><th>Duração</th><th>Período</th></tr></thead>' +
      '<tbody>' + linhas + '</tbody>' +
    '</table>' +
    '<div class="folha-pe"><span>Emitido com a proposta</span><span>Medido toda sexta</span></div>';

  /* passar o cursor (ou o dedo) numa etapa acende as frentes daquela etapa */
  var legenda = $('#folhaLegenda');
  var legendaPadrao = legenda ? legenda.textContent : '';
  var linhasEl = $$('tbody tr', folha);
  var passos = $$('.passo');

  function limpa(){
    folha.classList.remove('focada');
    linhasEl.forEach(function(tr){ tr.classList.remove('acesa'); });
    passos.forEach(function(p){ p.classList.remove('ativa'); });
    if(legenda) legenda.textContent = legendaPadrao;
  }
  function acende(passo){
    var alvos = (passo.dataset.frentes || '').split('|').filter(Boolean);
    folha.classList.add('focada');
    passos.forEach(function(p){ p.classList.toggle('ativa', p === passo); });
    linhasEl.forEach(function(tr){
      tr.classList.toggle('acesa', alvos.indexOf(tr.dataset.frente) >= 0);
    });
    if(legenda){
      legenda.textContent = passo.dataset.nota ||
        (passo.dataset.etapa + ' · ' + alvos.length + (alvos.length === 1 ? ' frente' : ' frentes'));
    }
  }
  /* no toque o navegador ainda simula mouseenter e mouseleave logo em seguida;
     a janela abaixo faz o toque mandar e os eventos de mouse serem ignorados */
  var toqueAte = 0;
  function noToque(){ return Date.now() < toqueAte; }

  passos.forEach(function(p){
    p.addEventListener('pointerdown', function(e){
      if(e.pointerType !== 'touch') return;
      toqueAte = Date.now() + 900;
      if(p.classList.contains('ativa')) limpa(); else acende(p);
    });
    ['mouseenter','focus'].forEach(function(ev){
      p.addEventListener(ev, function(){ if(!noToque()) acende(p); });
    });
    ['mouseleave','blur'].forEach(function(ev){
      p.addEventListener(ev, function(){ if(!noToque()) limpa(); });
    });
  });
  /* tocar fora das etapas apaga o destaque */
  document.addEventListener('pointerdown', function(e){
    if(e.pointerType === 'touch' && !e.target.closest('.passo')) limpa();
  });
  }
})();

/* ---------------------------------------------- a folha acompanha o cursor */
(function folhaInclina(){
  var folha = $('#folhaCronograma');
  if(!folha || reduz) return;

  var pendente = false, ex = 0, ey = 0, area = null;
  function aplica(){
    var r = area || folha.getBoundingClientRect();
    var px = (ex - r.left) / r.width - 0.5;      /* -0,5 à esquerda · +0,5 à direita */
    var py = (ey - r.top) / r.height - 0.5;
    folha.style.setProperty('--rx', (-py * 6.5).toFixed(2) + 'deg');
    folha.style.setProperty('--ry', (px * 8.5).toFixed(2) + 'deg');
    folha.style.setProperty('--bx', ((px + 0.5) * 100).toFixed(1) + '%');
    folha.style.setProperty('--by', ((py + 0.5) * 100).toFixed(1) + '%');
    pendente = false;
  }
  folha.addEventListener('pointerenter', function(){ area = folha.getBoundingClientRect(); });
  window.addEventListener('scroll', function(){ area = null; }, {passive:true});
  folha.addEventListener('pointermove', function(e){
    if(e.pointerType === 'touch') return;
    ex = e.clientX; ey = e.clientY;
    folha.classList.add('inclinada');
    if(!pendente){ pendente = true; requestAnimationFrame(aplica); }
  });
  folha.addEventListener('pointerleave', function(){
    folha.classList.remove('inclinada');
    area = null;
    folha.style.removeProperty('--rx');
    folha.style.removeProperty('--ry');
  });
})();

/* ---------------------------------------------- contadores */
(function contadores(){
  var alvos = $$('[data-conta]');
  if(!alvos.length) return;
  function formata(v, casas){
    return v.toLocaleString('pt-BR', {minimumFractionDigits:casas, maximumFractionDigits:casas});
  }
  function roda(el){
    var fim = parseFloat(el.dataset.conta);
    var casas = (el.dataset.conta.split('.')[1] || '').length;
    var pre = el.dataset.prefixo || '', pos = el.dataset.sufixo || '';
    if(reduz){ el.textContent = pre + formata(fim, casas) + pos; return; }
    var dur = 1200, ini = null;
    function passo(t){
      if(ini === null) ini = t;
      var p = Math.min((t - ini) / dur, 1);
      var e = 1 - Math.pow(1 - p, 3);
      el.textContent = pre + formata(fim * e, casas) + pos;
      if(p < 1) requestAnimationFrame(passo);
    }
    requestAnimationFrame(passo);
  }
  if(!('IntersectionObserver' in window)){ alvos.forEach(roda); return; }
  var obs = new IntersectionObserver(function(es){
    es.forEach(function(e){
      if(e.isIntersecting){ roda(e.target); obs.unobserve(e.target); }
    });
  }, {threshold:.6});
  alvos.forEach(function(el){ obs.observe(el); });
})();

/* ---------------------------------------------- formulário */
(function formulario(){
  var form = $('#formObra');
  if(!form) return;
  var campos = $$('.campo', form);

  function valida(c){
    var ctrl = c.querySelector('input,select,textarea');
    if(!ctrl || !ctrl.required) return true;
    var ok = ctrl.checkValidity() && String(ctrl.value).trim() !== '';
    c.classList.toggle('invalido', !ok);
    ctrl.setAttribute('aria-invalid', String(!ok));
    return ok;
  }
  campos.forEach(function(c){
    var ctrl = c.querySelector('input,select,textarea');
    if(ctrl) ctrl.addEventListener('blur', function(){ valida(c); });
  });

  var botao = $('button[type=submit]', form);
  var rotuloBotao = botao ? botao.textContent : '';
  var aviso = $('.form-nota', form);
  var avisoPadrao = aviso ? aviso.textContent : '';

  /* Dois desfechos possíveis: o servidor confirmou o envio, ou não deu — e aí
     a página entrega os mesmos dados prontos no WhatsApp e no e-mail, para
     ninguém perder o contato por causa de uma falha de rede. */
  function conclui(enviouSozinho){
    var titulo = $('#formTitulo'), texto = $('#formTexto');
    if(titulo) titulo.textContent = enviouSozinho ? 'Solicitação enviada' : 'Solicitação registrada';
    if(texto) texto.textContent = enviouSozinho
      ? 'A coordenação de obras recebeu as informações. O retorno é feito em até um dia útil.'
      : 'Falta só escolher o canal. A mensagem já vai preenchida com o que você respondeu.';
    form.classList.toggle('so-links', !enviouSozinho);
    form.classList.add('enviado');
    var painel = $('.form-ok', form);
    if(painel){ painel.setAttribute('tabindex','-1'); painel.focus(); }
  }

  function ocupado(sim){
    if(!botao) return;
    botao.disabled = sim;
    botao.textContent = sim ? 'Enviando…' : rotuloBotao;
  }

  form.addEventListener('submit', function(e){
    e.preventDefault();
    var ok = campos.map(valida).every(Boolean);
    if(!ok){
      var falho = $('.campo.invalido input,.campo.invalido select,.campo.invalido textarea', form);
      if(falho) falho.focus();
      return;
    }
    var d = new FormData(form);
    var texto =
      'Contato pelo site SPX\n' +
      'Nome: '     + (d.get('nome')     || '-') + '\n' +
      'Empresa: '  + (d.get('empresa')  || '-') + '\n' +
      'E-mail: '   + (d.get('email')    || '-') + '\n' +
      'Telefone: ' + (d.get('telefone') || '-') + '\n' +
      'Tipo de obra: ' + (d.get('tipo') || '-') + '\n' +
      'Área aproximada: ' + (d.get('area') || '-') + ' m²\n\n' +
      (d.get('mensagem') || '');

    var zap = $('#linkZap'), mail = $('#linkMail');
    if(zap)  zap.href  = 'https://wa.me/' + ZAP + '?text=' + encodeURIComponent(texto);
    if(mail) mail.href = 'mailto:' + EMAIL + '?subject=' +
      encodeURIComponent('Visita técnica · ' + (d.get('empresa') || d.get('nome'))) +
      '&body=' + encodeURIComponent(texto);

    var destino = form.dataset.endpoint;
    if(!destino || !window.fetch){ conclui(false); return; }

    var corpo = {};
    d.forEach(function(v,k){ corpo[k] = v; });
    ocupado(true);
    /* se o servidor demorar demais, não deixa a pessoa esperando */
    var desiste = setTimeout(function(){ ocupado(false); conclui(false); }, 12000);
    var resolvido = false;
    function encerra(enviou){
      if(resolvido) return;
      resolvido = true;
      clearTimeout(desiste);
      ocupado(false);
      conclui(enviou);
    }

    fetch(destino, {
      method:'POST',
      headers:{'Content-Type':'application/json'},
      body:JSON.stringify(corpo)
    }).then(function(r){
      if(r.ok) return encerra(true);
      if(r.status === 400 || r.status === 429){
        /* problema com o que foi digitado: melhor corrigir do que mandar torto */
        return r.json().catch(function(){ return {}; }).then(function(j){
          clearTimeout(desiste); resolvido = true; ocupado(false);
          if(aviso){ aviso.textContent = j.erro || 'Confira os campos e tente de novo.'; }
          form.classList.add('recusado');
        });
      }
      encerra(false);
    }).catch(function(){ encerra(false); });
  });

  /* qualquer digitação depois de um erro devolve o aviso normal */
  form.addEventListener('input', function(){
    if(!form.classList.contains('recusado')) return;
    form.classList.remove('recusado');
    if(aviso) aviso.textContent = avisoPadrao;
  });
})();

/* ---------------------------------------------- peças (404) */
(function pecas(){
  var caixa = $('#pecas');
  if(!caixa) return;
  var dados = [
    ['#10151A','#F2F1EE','M4 20h16M6 20V9l6-4 6 4v11'],
    ['#3A5570','#FFFFFF','M13 3 5 14h6l-1 7 8-11h-6z'],
    ['#9AA1A8','#000000','M3 21h18M6 21V8h5v13M14 21V3h4v18'],
    ['#D5D1C8','#000000','M12 3l8 3v6c0 5-3.4 8.3-8 9-4.6-.7-8-4-8-9V6z'],
    ['#6E90AE','#0A121A','M2 12h20M6 12V7h12v5M9 12v9M15 12v9'],
    ['#454B52','#F2F1EE','M3 18h18M5 18l3-9h8l3 9M9 9V5h6v4'],
    ['#1E2C3A','#6E90AE','M12 3s6 6.4 6 10.4A6 6 0 0 1 6 13.4C6 9.4 12 3 12 3z']
  ];
  var giros = [-6,4,-2,7,-4,3,-7];
  caixa.innerHTML = dados.map(function(p,i){
    return '<div class="peca" role="button" tabindex="0" aria-label="Derrubar peça" style="background:' + p[0] +
      ';transform:rotate(' + giros[i] + 'deg) translateY(' + (i%2 ? 10 : 0) + 'px)">' +
      '<svg viewBox="0 0 24 24" fill="none" stroke="' + p[1] + '" stroke-width="1.6" stroke-linecap="round" ' +
      'stroke-linejoin="round" aria-hidden="true"><path d="' + p[2] + '"/></svg></div>';
  }).join('');
  function derruba(p){
    if(p.classList.contains('cai')) return;
    p.classList.add('cai');
    setTimeout(function(){
      p.classList.remove('cai');
      p.style.animation = 'none';
      requestAnimationFrame(function(){ p.style.animation = ''; });
    }, 1000);
  }
  $$('.peca', caixa).forEach(function(p){
    p.addEventListener('click', function(){ derruba(p); });
    p.addEventListener('keydown', function(e){
      if(e.key === 'Enter' || e.key === ' '){ e.preventDefault(); derruba(p); }
    });
  });
})();

/* ---------------------------------------------- assinatura do rodapé */
(function wordmark(){
  var wm = $('#wordmark');
  if(!wm || reduz) return;
  wm.addEventListener('pointermove', function(e){
    var r = wm.getBoundingClientRect();
    wm.style.setProperty('--mx', (e.clientX - r.left) + 'px');
    wm.style.setProperty('--my', (e.clientY - r.top)  + 'px');
  });
})();

/* ---------------------------------------------- nav ativa */
(function spy(){
  var itens = $$('.navpill a.link');
  if(!itens.length || !('IntersectionObserver' in window)) return;
  var secoes = itens.map(function(a){
    var h = a.getAttribute('href');
    return h && h.charAt(0) === '#' ? document.querySelector(h) : null;
  }).filter(Boolean);
  if(!secoes.length) return;
  var obs = new IntersectionObserver(function(es){
    es.forEach(function(e){
      if(!e.isIntersecting) return;
      itens.forEach(function(a){
        a.classList.toggle('ativo', a.getAttribute('href') === '#' + e.target.id);
      });
    });
  }, {rootMargin:'-45% 0px -50% 0px'});
  secoes.forEach(function(s){ obs.observe(s); });
})();

/* ---------------------------------------------- revelação ao rolar */
(function reveal(){
  var alvos = $$('[data-reveal]');
  if(!alvos.length) return;
  if(reduz || !('IntersectionObserver' in window)){
    alvos.forEach(function(el){ el.classList.add('reveal','vis'); });
    return;
  }
  alvos.forEach(function(el){ el.classList.add('reveal'); });
  var obs = new IntersectionObserver(function(es){
    es.forEach(function(e){
      if(e.isIntersecting){ e.target.classList.add('vis'); obs.unobserve(e.target); }
    });
  }, {threshold:.12});
  alvos.forEach(function(el){ obs.observe(el); });
})();

/* ---------------------------------------------- ano corrente */
$$('[data-ano]').forEach(function(el){ el.textContent = new Date().getFullYear(); });

/* ---------------------------------------------- avisa quando algo quebra */
(function relatorErros(){
  /* Manda para /api/erro, que só escreve no log da Vercel. Nada de serviço
     de fora, nada de dado pessoal: só o necessário para reproduzir a falha.
     Três por sessão bastam — depois disso é sempre a mesma coisa em looping. */
  var restam = 3;
  function conta(dados){
    if(restam-- <= 0 || !window.fetch) return;
    dados.pagina = location.pathname;
    dados.tela = window.innerWidth + 'x' + window.innerHeight;
    try {
      var pacote = JSON.stringify(dados);
      if(navigator.sendBeacon){
        navigator.sendBeacon(ERRO, new Blob([pacote], {type:'application/json'}));
      } else {
        fetch(ERRO, {method:'POST', headers:{'Content-Type':'application/json'},
                            body:pacote, keepalive:true}).catch(function(){});
      }
    } catch(e){ /* se nem isso der, não vale derrubar a página por causa do aviso */ }
  }
  window.addEventListener('error', function(e){
    if(!e.message) return;                       /* erro de imagem entra em outro lugar */
    conta({mensagem:e.message, origem:e.filename, linha:e.lineno, coluna:e.colno,
           pilha:e.error && e.error.stack});
  });
  window.addEventListener('unhandledrejection', function(e){
    var m = e.reason && (e.reason.message || e.reason);
    conta({mensagem:'promessa rejeitada: ' + m, pilha:e.reason && e.reason.stack});
  });
})();

/* ---------------------------------------------- medição de audiência */
(function analise(){
  /* O identificador fica numa <meta> nas páginas, vazio por padrão. Enquanto
     estiver vazio nada é carregado — nenhum script de terceiro, nenhum cookie.
     Para ligar, cole o G-XXXXXXXXXX da propriedade do Google Analytics. */
  var meta = document.querySelector('meta[name="ga-id"]');
  var id = meta && meta.content.trim();
  if(!id || !/^G-[A-Z0-9]+$/i.test(id)) return;
  var s = document.createElement('script');
  s.async = true;
  s.src = 'https://www.googletagmanager.com/gtag/js?id=' + encodeURIComponent(id);
  document.head.appendChild(s);
  window.dataLayer = window.dataLayer || [];
  function gtag(){ window.dataLayer.push(arguments); }
  window.gtag = gtag;
  gtag('js', new Date());
  gtag('config', id, {anonymize_ip: true});

  /* o que interessa medir num site de obra: quem pede visita técnica */
  var form = document.querySelector('#formObra');
  if(form) form.addEventListener('submit', function(){
    gtag('event', 'solicitar_visita', {tipo_obra: (new FormData(form)).get('tipo') || ''});
  });
  document.querySelectorAll('a[href^="https://wa.me/"]').forEach(function(a){
    a.addEventListener('click', function(){ gtag('event', 'clique_whatsapp'); });
  });
  document.querySelectorAll('a[href^="tel:"]').forEach(function(a){
    a.addEventListener('click', function(){ gtag('event', 'clique_telefone'); });
  });
})();

/* ---------------------------------------------- botão flutuante do WhatsApp */
(function zap(){
  var botao = document.querySelector('[data-zap]');
  var form = document.querySelector('#formObra');
  if(!botao || !form || !('IntersectionObserver' in window)) return;
  /* com o formulário na tela o botão vira ruído: já existe um caminho ali */
  new IntersectionObserver(function(es){
    botao.classList.toggle('recolhido', es[0].isIntersecting);
  }, {threshold:0.12}).observe(form);

  /* o metal acende no clique e apaga sozinho: `pointerdown` e não `click`
     porque o clique já está saindo da página para o WhatsApp, e o efeito
     precisa aparecer antes disso */
  botao.addEventListener('pointerdown', function(){
    botao.classList.remove('metal');
    void botao.offsetWidth;          /* reinicia a animação se clicar de novo */
    botao.classList.add('metal');
  });
  botao.addEventListener('animationend', function(){ botao.classList.remove('metal'); });
})();

/* ---------------------------------------------- poeira de obra nas laterais */
(function poeira(){
  if(reduz || window.innerWidth < 561) return;
  /* uma variável só, lida pelo CSS: as três camadas se deslocam em ritmos
     diferentes a partir dela, e o navegador cuida do resto na GPU */
  var raiz = document.documentElement;
  var faixas = ['esq','dir'].map(function(lado){
    var d = document.createElement('div');
    d.className = 'poeira ' + lado;
    d.setAttribute('aria-hidden','true');
    d.innerHTML = '<i></i><i></i><i></i>';
    document.body.appendChild(d);
    return d;
  });
  if(!faixas.length) return;

  var pendente = false;
  function atualiza(){
    pendente = false;
    raiz.style.setProperty('--rolagem', String(Math.round(window.scrollY)));
  }
  window.addEventListener('scroll', function(){
    if(pendente) return;
    pendente = true;
    requestAnimationFrame(atualiza);
  }, {passive:true});
  atualiza();
})();

/* ---------------------------------------------- busca na central de dúvidas */
(function buscaDuvidas(){
  var campo = $('[data-faq-busca]');
  if(!campo) return;
  var itens = $$('[data-faq-item]');
  var temas = $$('[data-faq-tema]');
  var vazio = $('[data-faq-vazio]');
  /* guarda o texto original: marcar e desmarcar direto no HTML corromperia
     a pergunta depois de algumas buscas */
  itens.forEach(function(it){
    var t = it.querySelector('summary');
    it.__pergunta = t.textContent;
    it.__resposta = (it.querySelector('p') || {}).textContent || '';
  });

  function semAcento(t){
    return t.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  }
  function filtra(){
    var termo = semAcento(campo.value.trim());
    var achou = 0;
    itens.forEach(function(it){
      var alvo = semAcento(it.__pergunta + ' ' + it.__resposta);
      var casa = !termo || alvo.indexOf(termo) >= 0;
      it.hidden = !casa;
      if(casa) achou++;
      var titulo = it.querySelector('summary');
      if(!termo){ titulo.textContent = it.__pergunta; return; }
      /* destaca o trecho na pergunta, quando estiver nela */
      var pos = semAcento(it.__pergunta).indexOf(termo);
      if(pos < 0){ titulo.textContent = it.__pergunta; return; }
      titulo.textContent = '';
      titulo.appendChild(document.createTextNode(it.__pergunta.slice(0, pos)));
      var marca = document.createElement('mark');
      marca.textContent = it.__pergunta.slice(pos, pos + termo.length);
      titulo.appendChild(marca);
      titulo.appendChild(document.createTextNode(it.__pergunta.slice(pos + termo.length)));
    });
    /* tema sem nenhuma pergunta visível some junto com o título */
    temas.forEach(function(t){
      t.hidden = !$$('[data-faq-item]', t).some(function(i){ return !i.hidden; });
    });
    if(vazio) vazio.hidden = achou > 0;
  }
  campo.addEventListener('input', filtra);
  campo.addEventListener('search', filtra);
})();

/* ------------------------- carrossel em profundidade (página de projetos) -- */
(function capa3d(){
  var caixa = $('[data-capa3d]');
  if(!caixa) return;
  var itens = $$('[data-capa3d-item]');
  caixa.setAttribute('data-adiar', '');
  var pontos = $$('[data-capa3d-ponto]');
  if(itens.length < 2) return;
  var atual = 0, relogio = null;

  /* Quanto cada cartão se afasta, encolhe e gira conforme a distância até o
     centro. Fora do terceiro vizinho ele sai de cena: manter tudo na tela
     custa composição à toa e ninguém vê. */
  function coloca(){
    var largura = itens[0].offsetWidth;
    itens.forEach(function(el, i){
      var d = i - atual;
      var meta = itens.length;
      if(d > meta / 2) d -= meta;              /* dá a volta pelo caminho curto */
      if(d < -meta / 2) d += meta;
      var longe = Math.abs(d);
      var frente = longe === 0;
      el.classList.toggle('frente', frente);
      el.setAttribute('aria-hidden', frente ? 'false' : 'true');
      var link = el.querySelector('a');
      if(link) link.tabIndex = frente ? 0 : -1;
      if(longe > 2){
        el.style.opacity = '0';
        el.style.pointerEvents = 'none';
        el.style.transform = 'translate3d(-50%,-50%,-620px)';
        return;
      }
      var desloc = d * largura * 0.58;
      var recuo = longe * -Math.max(150, largura * 0.42);
      var giro = d === 0 ? 0 : (d > 0 ? -26 : 26);
      var escala = 1 - longe * 0.1;
      el.style.opacity = frente ? '1' : (longe === 1 ? '.7' : '.32');
      el.style.pointerEvents = frente ? 'auto' : 'none';
      el.style.zIndex = String(10 - longe);
      el.style.transform = 'translate3d(calc(-50% + ' + desloc + 'px),-50%,' + recuo + 'px)' +
                           ' rotateY(' + giro + 'deg) scale(' + escala + ')';
    });
    pontos.forEach(function(b, i){
      if(i === atual) b.setAttribute('aria-selected', 'true');
      else b.removeAttribute('aria-selected');
    });
  }

  function vai(i){
    atual = (i + itens.length) % itens.length;
    coloca();
  }
  function anda(passo){ vai(atual + passo); reinicia(); }

  /* troca sozinho, mas para assim que a pessoa assume o controle */
  function reinicia(){
    if(reduz) return;
    clearInterval(relogio);
    relogio = setInterval(function(){ vai(atual + 1); }, 5200);
  }
  function pausa(){ clearInterval(relogio); }

  $('[data-capa3d-ant]').addEventListener('click', function(){ anda(-1); });
  $('[data-capa3d-prox]').addEventListener('click', function(){ anda(1); });
  pontos.forEach(function(b, i){ b.addEventListener('click', function(){ vai(i); reinicia(); }); });

  /* o carrossel só para no foco do teclado, onde parar é o certo: quem
     navegou até ele quer ler. No mouse, segue andando. */
  caixa.addEventListener('focusin', pausa);

  /* setas do teclado quando o carrossel está em foco */
  caixa.addEventListener('keydown', function(e){
    if(e.key === 'ArrowLeft'){ e.preventDefault(); anda(-1); }
    if(e.key === 'ArrowRight'){ e.preventDefault(); anda(1); }
  });

  /* arrastar com o dedo */
  var x0 = null;
  caixa.addEventListener('touchstart', function(e){
    x0 = e.touches[0].clientX; pausa();
  }, {passive:true});
  caixa.addEventListener('touchend', function(e){
    if(x0 === null) return;
    var dx = e.changedTouches[0].clientX - x0;
    if(Math.abs(dx) > 42) anda(dx < 0 ? 1 : -1);
    else reinicia();
    x0 = null;
  }, {passive:true});

  /* clicar num cartão lateral traz ele para a frente */
  itens.forEach(function(el, i){
    el.addEventListener('click', function(){ if(i !== atual){ vai(i); reinicia(); } });
  });

  window.addEventListener('resize', coloca);
  coloca();
  reinicia();
})();

/* ------------------------- fotos que só carregam quando a seção se aproxima */
(function fotosAdiadas(){
  /* O adiamento nativo do navegador começa a baixar cedo demais: numa página
     com foto grande no topo, as imagens de baixo disputam banda com ela e
     atrasam o maior elemento pintado. Marcar o bloco com data-adiar dá o
     controle de quando a fila começa. */
  $$('[data-adiar]').forEach(function(bloco){
    aoAproximar(bloco, function(){
      $$('img[data-fonte]', bloco).forEach(function(im){
        im.src = im.dataset.fonte;
        im.srcset = im.dataset.fonte + ' 480w';
        im.removeAttribute('data-fonte');
      });
    });
  });
})();

/* -------------------- tipos de obra: clicar no cartão abre as fotos daquele */
(function abasDeObra(){
  $$('[data-obras]').forEach(function(caixa){
    var abas = $$('[data-obra-aba]', caixa);
    var painel = $('[data-obra-painel]', caixa);
    var fotos = $('[data-obra-fotos]', caixa);
    var titulo = $('[data-obra-titulo]', caixa);
    var link = $('[data-obra-link]', caixa);
    var fechar = $('[data-obra-fechar]', caixa);
    if(!abas.length || !painel) return;
    var aberta = null;
    var legendas = {};
    OBRAS.forEach(function(o){ legendas[o[0]] = o[1]; });

    function apaga(){
      abas.forEach(function(a){ a.setAttribute('aria-selected', 'false'); });
      painel.hidden = true;
      aberta = null;
    }
    function abre(aba){
      if(aberta === aba){ apaga(); return; }
      aberta = aba;
      abas.forEach(function(a){ a.setAttribute('aria-selected', String(a === aba)); });
      painel.setAttribute('aria-labelledby', aba.id);
      titulo.textContent = aba.dataset.nome;
      link.href = aba.dataset.url;
      /* as fotos entram só quando a aba abre: nenhuma delas é baixada à toa */
      fotos.innerHTML = aba.dataset.fotos.split(',').map(function(f){
        return '<figure><img src="' + IMG + f + '-480.webp" width="480" height="640"' +
               ' alt="' + (legendas[f] || '') + ', do arquivo da SPX Engenharia"' +
               ' loading="lazy" decoding="async"><figcaption>' +
               (legendas[f] || '') + '</figcaption></figure>';
      }).join('');
      painel.hidden = false;
    }

    abas.forEach(function(aba, i){
      aba.addEventListener('click', function(){ abre(aba); });
      /* setas percorrem as abas, como manda o padrão de tablist */
      aba.addEventListener('keydown', function(e){
        var passo = e.key === 'ArrowRight' ? 1 : e.key === 'ArrowLeft' ? -1 : 0;
        if(!passo) return;
        e.preventDefault();
        var alvo = abas[(i + passo + abas.length) % abas.length];
        abas.forEach(function(a){ a.tabIndex = -1; });
        alvo.tabIndex = 0;
        alvo.focus();
      });
    });
    if(fechar) fechar.addEventListener('click', function(){
      var voltar = aberta;
      apaga();
      if(voltar) voltar.focus();
    });
  });
})();

/* ÓRBITA · as três camadas girando em volta da marca. Clicar numa bola troca
   as etapas mostradas ao lado. É um tablist de verdade: as setas percorrem as
   bolas e a troca acontece no foco, como manda o padrão para aba automática.
   Uma camada fica sempre aberta — não há estado vazio para cair. */
(function orbita(){
  $$('[data-orbita]').forEach(function(caixa){
    var bolas = $$('[data-orbita-bola]', caixa);
    var partes = $$('[data-orbita-parte]', caixa);
    var painel = $('#painel-camada', caixa);
    var raios = $$('.orbita-raio', caixa);
    if(bolas.length !== partes.length || !painel) return;

    function abre(bola, focar){
      var id = bola.id.replace('camada-', '');
      bolas.forEach(function(b){
        var seu = b === bola;
        b.setAttribute('aria-selected', String(seu));
        b.tabIndex = seu ? 0 : -1;
      });
      partes.forEach(function(pt){ pt.hidden = pt.dataset.orbitaParte !== id; });
      painel.setAttribute('aria-labelledby', bola.id);
      /* o raio que liga o centro à bola escolhida acende junto */
      raios.forEach(function(r){
        r.classList.toggle('aceso', r.dataset.raio === bola.dataset.raio);
      });
      if(focar) bola.focus();
    }

    bolas.forEach(function(bola, i){
      bola.addEventListener('click', function(){ abre(bola, false); });
      bola.addEventListener('keydown', function(e){
        var passo = e.key === 'ArrowRight' || e.key === 'ArrowDown' ? 1
                  : e.key === 'ArrowLeft'  || e.key === 'ArrowUp'   ? -1 : 0;
        if(passo){
          e.preventDefault();
          abre(bolas[(i + passo + bolas.length) % bolas.length], true);
          return;
        }
        if(e.key === 'Home' || e.key === 'End'){
          e.preventDefault();
          abre(bolas[e.key === 'Home' ? 0 : bolas.length - 1], true);
        }
      });
    });
    abre(bolas[0], false);
  });
})();

/* CASA EM CORTE · a lista de ambientes troca o prédio ao lado, e cada alfinete
   abre a dica daquele pavimento.

   Duas coisas que a versão ingênua erra. A primeira: abrir uma dica sem fechar
   a anterior deixa três balões empilhados por cima do desenho. A segunda: ao
   trocar de ambiente, a dica aberta na cena antiga continua marcada como
   aberta, e ao voltar para ela o balão reaparece sozinho — por isso fechar
   tudo faz parte da troca, e não só do clique no alfinete. */
(function casaCorte(){
  $$('[data-corte]').forEach(function(caixa){
    var abas  = $$('[data-cc-aba]', caixa);
    var cenas = $$('[data-cc-cena]', caixa);
    var pinos = $$('[data-cc-pino]', caixa);
    var tpcs  = $$('[data-cc-topicos]', caixa);
    var painelTpc = $('.cc-topicos', caixa);
    var saindo;   /* temporizador do fechamento por hover, declarado aqui porque
                     fechaDicas() o cancela e roda antes do resto */
    if(!abas.length || abas.length !== cenas.length) return;

    function fechaDicas(){
      clearTimeout(saindo);
      caixa.removeAttribute('data-preso');
      pinos.forEach(function(p){
        p.setAttribute('aria-expanded', 'false');
        var d = document.getElementById(p.getAttribute('aria-controls'));
        if(d) d.hidden = true;
      });
      /* os tópicos voltam todos ao mesmo peso quando nenhum alfinete está
         aberto — o realce só existe enquanto há um pavimento em foco */
      if(painelTpc) painelTpc.removeAttribute('data-foco');
      $$('.cc-tpc-col', caixa).forEach(function(c){ c.classList.remove('aceso'); });
    }

    function abre(aba, focar){
      var id = aba.dataset.ccAba;
      fechaDicas();
      abas.forEach(function(a){
        var sua = a === aba;
        a.setAttribute('aria-selected', String(sua));
        a.tabIndex = sua ? 0 : -1;
      });
      cenas.forEach(function(c){ c.hidden = c.dataset.ccCena !== id; });
      tpcs.forEach(function(t){ t.hidden = t.dataset.ccTopicos !== id; });
      if(focar) aba.focus();
    }

    abas.forEach(function(aba, i){
      aba.addEventListener('click', function(){ abre(aba, false); });
      aba.addEventListener('keydown', function(e){
        var passo = e.key === 'ArrowRight' || e.key === 'ArrowDown' ? 1
                  : e.key === 'ArrowLeft'  || e.key === 'ArrowUp'   ? -1 : 0;
        if(passo){
          e.preventDefault();
          abre(abas[(i + passo + abas.length) % abas.length], true);
          return;
        }
        if(e.key === 'Home' || e.key === 'End'){
          e.preventDefault();
          abre(abas[e.key === 'Home' ? 0 : abas.length - 1], true);
        }
      });
    });

    /* Abre a dica de um alfinete. `fixa` distingue quem chegou pelo mouse de
       quem clicou: passar o mouse abre e sair fecha; clicar prende, e só outro
       clique, Esc ou um clique fora soltam. Sem essa diferença, quem clica
       para ler com calma perde o balão no primeiro movimento do mouse. */
    function abreDica(pino, fixa){
      var dica = document.getElementById(pino.getAttribute('aria-controls'));
      if(!dica) return;
      fechaDicas();
      pino.setAttribute('aria-expanded', 'true');
      dica.hidden = false;
      if(fixa) caixa.setAttribute('data-preso', '');
      /* a foto só é baixada quando a dica abre pela primeira vez: são sete
         fotos na página para mostrar, no máximo, uma de cada vez */
      var im = $('img[data-fonte]', dica);
      if(im){ im.src = im.dataset.fonte; im.removeAttribute('data-fonte'); }
      /* acende a coluna de tópicos do mesmo pavimento: o alfinete conta o
         detalhe de uma área e a coluna conta o que ela tem de diferente */
      var cena = pino.closest('[data-cc-cena]');
      var painel = cena && $('[data-cc-topicos="' + cena.dataset.ccCena + '"]', caixa);
      var col = painel && $('[data-cc-tpc-col="' + pino.dataset.ccAndar + '"]', painel);
      if(col && painelTpc){
        painelTpc.setAttribute('data-foco', '');
        col.classList.add('aceso');
      }
    }

    /* Só quem tem ponteiro fino ganha o hover. No toque não existe passar o
       mouse: o primeiro toque viraria hover e o segundo, clique — e a pessoa
       precisaria tocar duas vezes para abrir. */
    var temMouse = window.matchMedia('(hover:hover) and (pointer:fine)').matches;

    pinos.forEach(function(pino){
      var dica = document.getElementById(pino.getAttribute('aria-controls'));
      if(!dica) return;

      pino.addEventListener('click', function(){
        var aberta = pino.getAttribute('aria-expanded') === 'true';
        var presa = caixa.hasAttribute('data-preso');
        fechaDicas();
        /* clicar no alfinete de uma dica já presa fecha; se ela só estava
           aberta por hover, o clique prende */
        if(aberta && presa) return;
        abreDica(pino, true);
      });

      /* o teclado abre no foco, como o mouse abre no hover */
      pino.addEventListener('focus', function(){
        if(!caixa.hasAttribute('data-preso')) abreDica(pino, false);
      });

      if(!temMouse) return;

      [pino, dica].forEach(function(alvo){
        alvo.addEventListener('mouseenter', function(){
          clearTimeout(saindo);
          if(caixa.hasAttribute('data-preso')) return;
          if(pino.getAttribute('aria-expanded') !== 'true') abreDica(pino, false);
        });
        /* o atraso existe porque entre o alfinete e o balão há um vão: sem ele
           a dica fechava no meio do caminho e piscava */
        alvo.addEventListener('mouseleave', function(){
          if(caixa.hasAttribute('data-preso')) return;
          clearTimeout(saindo);
          saindo = setTimeout(fechaDicas, 160);
        });
      });
    });

    /* clicar fora e Esc fecham: balão que só fecha clicando de novo no mesmo
       alfinete prende quem abriu por engano */
    document.addEventListener('click', function(e){
      if(!caixa.contains(e.target)) fechaDicas();
    });
    caixa.addEventListener('keydown', function(e){
      if(e.key === 'Escape') fechaDicas();
    });

    abre(abas[0], false);
  });
})();

/* CARTÃO QUE VIRA · clicar mostra o outro lado. O estado fica no atributo
   `data-virado` do pai, e não numa classe do botão, porque é o pai que carrega
   a perspectiva — girar o elemento que também define a perspectiva achata o
   3D. `aria-pressed` conta o estado para quem não vê a animação. */
(function cartaoVira(){
  $$('[data-vira]').forEach(function(caixa){
    var botao = $('[data-vira-btn]', caixa);
    var palco = $('[data-vira-palco]', caixa);
    if(!botao) return;
    function vira(){
      var virado = caixa.hasAttribute('data-virado');
      if(virado) caixa.removeAttribute('data-virado');
      else caixa.setAttribute('data-virado', '');
      botao.setAttribute('aria-pressed', String(!virado));
    }
    botao.addEventListener('click', vira);
    /* clicar no cartão também vira, mas sem atrapalhar quem está selecionando
       texto ou clicando num link de dentro dele */
    if(palco) palco.addEventListener('click', function(e){
      if(e.target.closest('a,button')) return;
      if(String(getSelection())) return;
      vira();
    });
  });
})();

})();
