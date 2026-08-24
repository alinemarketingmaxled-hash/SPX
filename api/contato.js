/**
 * Recebe a solicitação de visita técnica e envia por e-mail.
 *
 * A chave do provedor NUNCA fica no repositório: vem das variáveis de
 * ambiente do projeto na Vercel (Settings -> Environment Variables).
 *
 *   RESEND_API_KEY   chave da conta em resend.com          (obrigatória)
 *   CONTATO_PARA     e-mail que recebe                      (obrigatória)
 *   CONTATO_DE       remetente verificado no provedor       (opcional)
 *
 * Sem essas variáveis a função responde 503 e a página cai no plano B:
 * mostra os botões de WhatsApp e e-mail já preenchidos. Ou seja, o
 * formulário funciona desde o primeiro deploy, e passa a mandar e-mail
 * sozinho assim que as variáveis existirem.
 */

const CAMPOS = {
  nome:      { obrigatorio: true,  max: 120,  rotulo: 'Nome' },
  empresa:   { obrigatorio: true,  max: 160,  rotulo: 'Empresa' },
  email:     { obrigatorio: true,  max: 160,  rotulo: 'E-mail' },
  telefone:  { obrigatorio: false, max: 40,   rotulo: 'Telefone' },
  tipo:      { obrigatorio: true,  max: 80,   rotulo: 'Tipo de obra' },
  area:      { obrigatorio: false, max: 20,   rotulo: 'Área aproximada (m²)' },
  mensagem:  { obrigatorio: false, max: 4000, rotulo: 'Contexto da obra' },
};
const EMAIL = /^[^\s@]+@[^\s@]+\.[a-z]{2,}$/i;

/* controle simples de repetição: o mesmo IP não manda mais que 5 por hora.
   Em função sem estado isso vale só enquanto a instância estiver quente,
   o que já corta a maior parte do envio automático. */
const JANELA = 60 * 60 * 1000;
const TETO = 5;
const recentes = new Map();

function passouDoLimite(ip, agora) {
  const marcas = (recentes.get(ip) || []).filter((t) => agora - t < JANELA);
  if (marcas.length >= TETO) return true;
  marcas.push(agora);
  recentes.set(ip, marcas);
  if (recentes.size > 500) {
    for (const [chave, ts] of recentes) {
      if (!ts.some((t) => agora - t < JANELA)) recentes.delete(chave);
    }
  }
  return false;
}

function limpa(valor, max) {
  return String(valor == null ? '' : valor).replace(/\s+/g, ' ').trim().slice(0, max);
}

function escapa(texto) {
  return texto.replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ erro: 'Use POST.' });
  }

  const corpo = typeof req.body === 'string' ? JSON.parse(req.body || '{}') : (req.body || {});

  /* campo isca: fica escondido na página, então só robô preenche.
     Responde como se tivesse dado certo para não ensinar o robô. */
  if (limpa(corpo.site, 80)) return res.status(200).json({ ok: true });

  const dados = {};
  const faltando = [];
  for (const [nome, regra] of Object.entries(CAMPOS)) {
    dados[nome] = limpa(corpo[nome], regra.max);
    if (regra.obrigatorio && !dados[nome]) faltando.push(regra.rotulo);
  }
  if (dados.email && !EMAIL.test(dados.email)) faltando.push('E-mail válido');
  if (faltando.length) {
    return res.status(400).json({ erro: 'Faltou preencher: ' + faltando.join(', ') + '.' });
  }

  const ip = (req.headers['x-forwarded-for'] || '').split(',')[0].trim() || 'desconhecido';
  if (passouDoLimite(ip, Date.now())) {
    return res.status(429).json({ erro: 'Muitas solicitações seguidas. Tente de novo mais tarde.' });
  }

  const chave = process.env.RESEND_API_KEY;
  const para = process.env.CONTATO_PARA;
  if (!chave || !para) {
    /* ainda não configurado: a página mostra WhatsApp e e-mail no lugar */
    return res.status(503).json({ erro: 'Envio por e-mail ainda não configurado.' });
  }

  const linhas = Object.entries(CAMPOS)
    .map(([nome, regra]) => `<tr><td style="padding:4px 14px 4px 0;color:#666">${regra.rotulo}</td>` +
      `<td style="padding:4px 0"><b>${escapa(dados[nome]) || '—'}</b></td></tr>`)
    .join('');

  try {
    const resposta = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { Authorization: `Bearer ${chave}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        from: process.env.CONTATO_DE || 'Site SPX <onboarding@resend.dev>',
        to: [para],
        reply_to: dados.email,
        subject: `Visita técnica · ${dados.empresa || dados.nome}`,
        html: `<h2 style="font-family:sans-serif">Solicitação de visita técnica</h2>
<table style="font-family:sans-serif;font-size:14px;border-collapse:collapse">${linhas}</table>
<p style="font-family:sans-serif;font-size:12px;color:#888">Enviado pelo formulário do site.</p>`,
      }),
    });
    if (!resposta.ok) {
      /* o texto do provedor pode conter detalhe da conta: fica só no log */
      console.error('Resend respondeu', resposta.status, await resposta.text());
      return res.status(502).json({ erro: 'Não foi possível enviar agora.' });
    }
  } catch (e) {
    console.error('Falha ao falar com o provedor de e-mail:', e.message);
    return res.status(502).json({ erro: 'Não foi possível enviar agora.' });
  }

  return res.status(200).json({ ok: true });
}
