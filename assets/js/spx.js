/* ============================================================
   SPX ENGENHARIA — comportamento compartilhado (index + 404)
   Cada módulo checa se o alvo existe, então o mesmo arquivo
   serve qualquer página do site.
   ============================================================ */
(function(){
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
(function tema(){
  var raiz = document.documentElement;
  var salvo = null;
  try{ salvo = localStorage.getItem('spx-tema'); }catch(e){}
  aplica(salvo || 'escuro');   /* escuro é o padrão da marca */

  function aplica(t){
    raiz.setAttribute('data-tema', t);
    var meta = $('meta[name="theme-color"]');
    if(meta) meta.setAttribute('content', t === 'claro' ? '#F4F3EF' : '#000000');
    $$('[data-acao="tema"]').forEach(function(b){
      b.setAttribute('aria-label', t === 'claro' ? 'Ativar tema escuro' : 'Ativar tema claro');
      b.setAttribute('aria-pressed', String(t === 'claro'));
    });
  }
  $$('[data-acao="tema"]').forEach(function(b){
    b.addEventListener('click', function(){
      var novo = raiz.getAttribute('data-tema') === 'claro' ? 'escuro' : 'claro';
      aplica(novo);
      try{ localStorage.setItem('spx-tema', novo); }catch(e){}
    });
  });
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

  /* O topo da home usa a foto inteira, em pé. Os cabeçalhos internos são uma
     faixa larga e baixa, e para eles existem recortes próprios (capa-*), bem
     mais leves — a foto vertical ali jogaria fora quase todos os pixels. */
  var capa = caixa.dataset.capa === 'sim';
  var LARGURAS = capa ? [768, 1280] : [480, 640, 960];
  var PROP = 1600 / 620;

  function medidas(arq){
    return capa ? [1280, Math.round(1280 / PROP)] : (DIM[arq] || [1200,1600]);
  }
  /* só entram as larguras que existem em disco */
  function conjunto(arq){
    var limite = capa ? 1e4 : (DIM[arq] || [1200,1600])[0];
    return LARGURAS.filter(function(w){ return w < limite; })
      .map(function(w){ return '/img/' + (capa ? 'capa-' : '') + arq + '-' + w + '.webp ' + w + 'w'; })
      .join(', ');
  }
  /* a primeira foto já veio no HTML com prioridade alta; as outras entram aqui */
  caixa.insertAdjacentHTML('beforeend', destaque.slice(1).map(function(arq){
    var d = medidas(arq);
    var padrao = '/img/' + (capa ? 'capa-' : '') + arq + '-' + (capa ? 768 : 640) + '.webp';
    return '<img src="' + padrao + '" srcset="' + conjunto(arq) + '" sizes="100vw"' +
      ' width="' + d[0] + '" height="' + d[1] + '"' +
      (capa ? '' : ' data-ph="/img/ph/' + arq + '.svg"') +
      ' alt="' + (capa ? '' : (legendas[arq] || '')) + '" loading="lazy" decoding="async">';
  }).join(''));

  var fotos = $$('img', caixa);
  if(!fotos.length) return;
  var atual = 0;
  fotos[0].classList.add('ativa');
  if(reduz) return;

  var relogio = null;
  function mostra(i){
    fotos[atual].classList.remove('ativa');
    atual = (i + fotos.length) % fotos.length;
    fotos[atual].classList.add('ativa');
  }
  function anda(passo){
    mostra(atual + passo);
    reinicia();
  }
  function reinicia(){
    clearInterval(relogio);
    relogio = setInterval(function(){ mostra(atual + 1); }, 6500);
  }
  reinicia();

  $$('[data-hero]').forEach(function(b){
    b.addEventListener('click', function(){ anda(b.dataset.hero === 'prox' ? 1 : -1); });
  });
  document.addEventListener('visibilitychange', function(){
    if(document.hidden) clearInterval(relogio); else reinicia();
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
      html += '<figure class="frame"><img src="/img/' + o[0] + '-480.webp"' +
              ' width="480" height="' + alt480 + '"' +
              ' srcset="/img/' + o[0] + '-480.webp 480w, /img/' + o[0] + '-640.webp 640w"' +
              ' sizes="(max-width:900px) 250px, 320px"' +
              ' data-ph="/img/ph/' + o[0] + '.svg"' +
              ' alt="' + o[1] + '" loading="lazy" decoding="async">' +
              '<span class="halftone"></span><figcaption class="tag">' + o[1] + '</figcaption></figure>';
    });
  }
  track.innerHTML = html;

  var frames = $$('.frame', track);
  var caixa = $('#beamwrap');
  var desloc = 0, pausado = false, ciclo = 0;
  caixa.addEventListener('mouseenter', function(){ pausado = true; });
  caixa.addEventListener('mouseleave', function(){ pausado = false; });
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
    ['Na execução','Engenheiro responsável com ART registrada no CREA-SP, nomeado na proposta e presente em obra do início ao fim.'],
    ['Na entrega','Relatório semanal com registro fotográfico e avanço físico por disciplina, mais as-built e manuais no dia da vistoria.']
  ];
  caixa.innerHTML = itens.map(function(c,i){
    return '<article class="dep compromisso"><span class="etapa">' +
      String(i+1).padStart(2,'0') + ' · ' + c[0] + '</span><p>' + c[1] + '</p></article>';
  }).join('');
})();

/* ---------------------------------------------- dúvidas (FAQ) */
(function faq(){
  var A = $('#faqA'), B = $('#faqB');
  if(!A || !B) return;
  aoAproximar(A.parentElement, monta);

  function monta(){
  var perguntas = [
    ['Vocês executam com a loja ou o escritório funcionando?','Sim. É o nosso escopo principal. Trabalhamos em janela noturna ou de fim de semana, com isolamento acústico provisório, controle de poeira e liberação da área limpa antes da abertura.'],
    ['Como funciona a concorrência de preço?','Enviamos proposta com cronograma físico-financeiro, memorial e composição de BDI aberta. Se houver equalização com outros concorrentes, participamos da rodada técnica sem custo.'],
    ['Dá para começar antes do contrato assinado?','Dá, com ordem de início por e-mail do responsável e escopo delimitado. Mobilizamos canteiro e compras de prazo longo enquanto o jurídico fecha, e o que for executado entra integralmente na medição.'],
    ['Qual o prazo para receber um orçamento?','Orçamento preliminar em até 5 dias úteis a partir da visita técnica. Proposta detalhada com projeto executivo em mãos: 10 dias úteis.'],
    ['Vocês fazem o projeto ou só executam?','Executamos projeto de terceiros e também desenvolvemos o executivo com nossos projetistas parceiros. Compatibilização de disciplinas está sempre incluída.'],
    ['Quem responde tecnicamente pela obra?','Engenheiro responsável com ART registrada no CREA-SP, presente em obra e nomeado na proposta. Você sabe o nome antes de assinar.'],
    ['Como é a garantia depois da entrega?','Cinco anos para estrutura e impermeabilização, um ano para acabamentos e instalações, conforme norma. Chamado de garantia é atendido em até 48 horas.'],
    ['E se a obra atrasar?','Multa por dia de atraso prevista em contrato, com as hipóteses de suspensão de prazo listadas de forma fechada, sem cláusula genérica de caso fortuito.']
  ];
  perguntas.forEach(function(q,i){
    var el = document.createElement('div');
    el.className = 'q';
    var id = 'resp-' + i;
    el.innerHTML = '<h3><button type="button" aria-expanded="false" aria-controls="' + id + '">' +
      '<span>' + q[0] + '</span><span class="sinal" aria-hidden="true">+</span></button></h3>' +
      '<div class="resp" id="' + id + '" role="region"><p>' + q[1] + '</p></div>';
    (i % 2 === 0 ? A : B).appendChild(el);
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
    if(zap)  zap.href  = 'https://wa.me/5511952751874?text=' + encodeURIComponent(texto);
    if(mail) mail.href = 'mailto:contato@spxengenharia.com.br?subject=' +
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
        navigator.sendBeacon('/api/erro', new Blob([pacote], {type:'application/json'}));
      } else {
        fetch('/api/erro', {method:'POST', headers:{'Content-Type':'application/json'},
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

  caixa.addEventListener('mouseenter', pausa);
  caixa.addEventListener('mouseleave', reinicia);
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

})();
