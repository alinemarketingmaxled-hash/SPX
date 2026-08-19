/* ============================================================
   SPX ENGENHARIA — comportamento compartilhado (index + 404)
   Cada módulo checa se o alvo existe, então o mesmo arquivo
   serve qualquer página do site.
   ============================================================ */
(function(){
'use strict';

var reduz = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
var $  = function(s,c){ return (c||document).querySelector(s); };
var $$ = function(s,c){ return Array.prototype.slice.call((c||document).querySelectorAll(s)); };

/* ---------------------------------------------- tema claro/escuro */
(function tema(){
  var raiz = document.documentElement;
  var salvo = null;
  try{ salvo = localStorage.getItem('spx-tema'); }catch(e){}
  var prefereClaro = window.matchMedia('(prefers-color-scheme: light)').matches;
  aplica(salvo || (prefereClaro ? 'claro' : 'escuro'));

  function aplica(t){
    raiz.setAttribute('data-tema', t);
    var meta = $('meta[name="theme-color"]');
    if(meta) meta.setAttribute('content', t === 'claro' ? '#F4F3EF' : '#06080A');
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
  var pendente = false;
  function pinta(){
    var h = document.documentElement.scrollHeight - window.innerHeight;
    barra.style.transform = 'scaleX(' + (h > 0 ? Math.min(window.scrollY / h, 1) : 0) + ')';
    pendente = false;
  }
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

/* ---------------------------------------------- leque do hero */
(function leque(){
  var caixa = $('#leque');
  if(!caixa) return;
  var cards = $$('.obra-card', caixa);
  var estreito = window.matchMedia('(max-width:700px)');
  function base(){
    var f = estreito.matches ? .62 : (window.innerWidth < 900 ? .8 : 1);
    return [{x:-372,r:-13,y:26},{x:-124,r:-5,y:0},{x:124,r:5,y:34},{x:372,r:13,y:8}]
      .map(function(b){ return {x:b.x*f, r:b.r, y:b.y*(estreito.matches ? .7 : 1)}; });
  }
  var pos = base();
  function posiciona(f){
    cards.forEach(function(c,i){
      var b = pos[i] || pos[pos.length-1];
      c.style.transform = 'translateX(calc(-50% + ' + (b.x*f) + 'px)) translateY(' + b.y + 'px) rotate(' + (b.r*f) + 'deg)';
    });
  }
  cards.forEach(function(c,i){ c.style.zIndex = (i === 1 || i === 2) ? 3 : 2; });
  posiciona(1);
  caixa.addEventListener('mouseenter', function(){ posiciona(1.18); });
  caixa.addEventListener('mouseleave', function(){ posiciona(1); });
  window.addEventListener('resize', function(){ pos = base(); posiciona(1); });
})();

/* ---------------------------------------------- acervo antes/depois */
(function acervo(){
  var track = $('#track');
  if(!track) return;
  var obras = [
    ['sala-reuniao-azul','Sala de reunião · corporativo'],
    ['recepcao-marmore','Recepção · balcão em mármore'],
    ['copa-marcenaria','Copa · marcenaria sob medida'],
    ['mesa-vista-sp','Reunião · vista São Paulo'],
    ['escritorio-vinho','Sala privativa · estante'],
    ['corredor-rosa','Circulação · painel em cor'],
    ['lounge-recepcao','Lounge de espera'],
    ['box-ripado','Área molhada · revestimento ripado']
  ];
  var html = '';
  for(var v = 0; v < 2; v++){
    obras.forEach(function(o){
      html += '<figure class="frame"><img src="img/' + o[0] + '.webp" data-ph="img/ph/' + o[0] + '.svg"' +
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

  function medir(){ ciclo = track.scrollWidth / 2; }
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
        desloc -= 0.55;
        if(Math.abs(desloc) >= ciclo) desloc += ciclo;
      }
      track.style.transform = 'translateY(-50%) translateX(' + desloc + 'px)';
      var feixe = caixa.getBoundingClientRect().left + caixa.offsetWidth / 2;
      frames.forEach(function(f){
        var r = f.getBoundingClientRect();
        f.classList.toggle('antes', (r.left + r.width / 2) - feixe < 0);
      });
    }
    requestAnimationFrame(anima);
  }
  if(reduz){ track.style.transform = 'translateY(-50%)'; }
  else{ requestAnimationFrame(anima); }
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
    '<polygon points="6,8 16,8 42,40 32,40" fill="#2E90B8"/>' +
    '<polygon points="32,8 42,8 16,40 6,40" fill="#2E90B8"/></svg></div>' +
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

/* ---------------------------------------------- depoimentos */
(function depoimentos(){
  var caixa = $('#colunas');
  if(!caixa) return;
  var deps = [
    ['Trocaram todo o piso da loja em quatro madrugadas. Abrimos no horário nos quatro dias.','Renata Alvim','Gerente de expansão · rede de varejo'],
    ['Único fornecedor que entregou o cronograma físico-financeiro na proposta, sem eu pedir.','Marcos Tanaka','Facilities · sede corporativa'],
    ['Reforma de dois andares com 300 pessoas trabalhando no prédio. Zero reclamação de ruído fora da janela combinada.','Cláudia Ferrer','Head de operações'],
    ['O relatório semanal com foto e avanço por frente virou o padrão que exijo de todo mundo agora.','Eduardo Brandão','Gerente de projetos'],
    ['Acharam interferência de elétrica que o projeto não previa e resolveram sem aditivo.','Patrícia Nunes','Coordenadora de obras'],
    ['Entregaram o as-built e os manuais no dia da vistoria. Nunca tinha acontecido comigo.','Rogério Sampaio','Diretor predial'],
    ['Flagship de 840 m² em quatro meses, com fachada aprovada pela prefeitura dentro do prazo.','Luciana Prado','Marketing · varejo de moda'],
    ['Equipe uniformizada, crachá, ASO em dia. A auditoria do condomínio passou sem apontamento.','Henrique Dias','Síndico profissional'],
    ['Pediram para adiantar a entrega em três semanas. Adiantaram duas e avisaram antes.','Fernanda Rocha','Incorporadora']
  ];
  function cartao(d){
    var ini = d[1].split(' ').map(function(p){ return p[0]; }).slice(0,2).join('');
    return '<article class="dep"><p>“' + d[0] + '”</p><div class="quem">' +
      '<span class="ini" aria-hidden="true">' + ini + '</span>' +
      '<span><b>' + d[1] + '</b><span>' + d[2] + '</span></span></div></article>';
  }
  var cols = [[],[],[]];
  deps.forEach(function(d,i){ cols[i%3].push(d); });
  caixa.innerHTML = cols.map(function(c){
    var bloco = c.map(cartao).join('');
    return '<div class="coluna">' + bloco + bloco + '</div>';
  }).join('');
})();

/* ---------------------------------------------- dúvidas (FAQ) */
(function faq(){
  var A = $('#faqA'), B = $('#faqB');
  if(!A || !B) return;
  var perguntas = [
    ['Vocês executam com a loja ou o escritório funcionando?','Sim. É o nosso escopo principal. Trabalhamos em janela noturna ou de fim de semana, com isolamento acústico provisório, controle de poeira e liberação da área limpa antes da abertura.'],
    ['Como funciona a concorrência de preço?','Enviamos proposta com cronograma físico-financeiro, memorial e composição de BDI aberta. Se houver equalização com outros concorrentes, participamos da rodada técnica sem custo.'],
    ['Dá para começar antes do contrato assinado?','Dá, com ordem de início por e-mail do responsável e escopo delimitado. Mobilizamos canteiro e compras de prazo longo enquanto o jurídico fecha, e o que for executado entra integralmente na medição.'],
    ['Qual o prazo para receber um orçamento?','Orçamento preliminar em até 5 dias úteis a partir da visita técnica. Proposta detalhada com projeto executivo em mãos: 10 dias úteis.'],
    ['Vocês fazem o projeto ou só executam?','Executamos projeto de terceiros e também desenvolvemos o executivo com nossos projetistas parceiros. Compatibilização de disciplinas está sempre incluída.'],
    ['Quem responde tecnicamente pela obra?','Engenheiro responsável com ART registrada no CREA-SP, presente em obra e nomeado na proposta. Você sabe o nome antes de assinar.'],
    ['Como é a garantia depois da entrega?','Cinco anos para estrutura e impermeabilização, um ano para acabamentos e instalações, conforme norma. Chamado de garantia é atendido em até 48 horas.'],
    ['E se a obra atrasar?','Multa por dia de atraso prevista em contrato, com as hipóteses de suspensão de prazo listadas de forma fechada — nada de cláusula genérica de caso fortuito.']
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
    if(zap)  zap.href  = 'https://wa.me/5511000000000?text=' + encodeURIComponent(texto);
    if(mail) mail.href = 'mailto:obras@spxengenharia.com.br?subject=' +
      encodeURIComponent('Visita técnica — ' + (d.get('empresa') || d.get('nome'))) +
      '&body=' + encodeURIComponent(texto);

    var destino = form.dataset.endpoint;
    if(destino){
      var corpo = {};
      d.forEach(function(v,k){ corpo[k] = v; });
      fetch(destino, {
        method:'POST',
        headers:{'Content-Type':'application/json'},
        body:JSON.stringify(corpo)
      }).catch(function(){ /* fallback: os links abaixo continuam valendo */ });
    }
    form.classList.add('enviado');
    var ok2 = $('.form-ok', form);
    if(ok2){ ok2.setAttribute('tabindex','-1'); ok2.focus(); }
  });
})();

/* ---------------------------------------------- peças (404) */
(function pecas(){
  var caixa = $('#pecas');
  if(!caixa) return;
  var dados = [
    ['#13181B','#F2F1EE','M4 20h16M6 20V9l6-4 6 4v11'],
    ['#1B6480','#FFFFFF','M13 3 5 14h6l-1 7 8-11h-6z'],
    ['#A9AAAC','#000000','M3 21h18M6 21V8h5v13M14 21V3h4v18'],
    ['#D5D1C8','#000000','M12 3l8 3v6c0 5-3.4 8.3-8 9-4.6-.7-8-4-8-9V6z'],
    ['#2E90B8','#00232F','M2 12h20M6 12V7h12v5M9 12v9M15 12v9'],
    ['#4A4F52','#F2F1EE','M3 18h18M5 18l3-9h8l3 9M9 9V5h6v4'],
    ['#0F3A4A','#2E90B8','M12 3s6 6.4 6 10.4A6 6 0 0 1 6 13.4C6 9.4 12 3 12 3z']
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

})();
