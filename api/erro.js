/**
 * Recebe erros de JavaScript que aconteceram no navegador de quem visita.
 *
 * Não guarda nada e não usa serviço de fora: escreve no log da Vercel, que
 * fica em Deployments -> Runtime Logs. É o suficiente para saber que alguma
 * coisa quebrou num aparelho que você não tem em mãos.
 *
 * De propósito não registra IP, nome nem nada digitado — só o que ajuda a
 * reproduzir o problema.
 */
const TETO_TEXTO = 400;

function corta(v, max) {
  return String(v == null ? '' : v).replace(/\s+/g, ' ').trim().slice(0, max);
}

export default function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ erro: 'Use POST.' });
  }
  const c = typeof req.body === 'string' ? JSON.parse(req.body || '{}') : (req.body || {});
  console.error('[erro no navegador]', JSON.stringify({
    mensagem: corta(c.mensagem, TETO_TEXTO),
    origem: corta(c.origem, 200),
    linha: Number(c.linha) || 0,
    coluna: Number(c.coluna) || 0,
    pagina: corta(c.pagina, 200),
    pilha: corta(c.pilha, 900),
    navegador: corta(req.headers['user-agent'], 200),
    tela: corta(c.tela, 20),
  }));
  res.status(204).end();
}
