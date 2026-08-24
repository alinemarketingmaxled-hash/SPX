/**
 * Endereço leve para o monitor de disponibilidade bater.
 * Responde rápido, sem tocar em nada, e diz se o envio de e-mail já está
 * configurado — assim o monitor avisa se alguém apagar a variável.
 */
export default function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store');
  res.status(200).json({
    ok: true,
    servico: 'spx-engenharia',
    email: Boolean(process.env.RESEND_API_KEY && process.env.CONTATO_PARA),
    em: new Date().toISOString(),
  });
}
