"""
Gera os ícones do site a partir do logo.

    python3 ferramentas/icones.py          (precisa de Pillow: pip install pillow)

Rode isto só quando o LOGO mudar. Os ícones são binários e não dá para ler um
diff deles; este arquivo é a receita, para ninguém ter de adivinhar depois como
foram feitos.

DUAS REGRAS QUE VALEM DINHEIRO AQUI

1. O Google só aceita ícone QUADRADO e MÚLTIPLO DE 48 px. O ícone anterior tinha
   128x128 — que não é múltiplo de 48 — e por isso podia ser recusado, deixando
   o globo cinza no lugar da marca no resultado da busca.

2. Abaixo de 32 px a treliça dentro do X vira sujeira: some a forma e sobra um
   borrão. Os tamanhos pequenos usam a silhueta cheia do X, sem detalhe interno.
   Ícone pequeno não é ícone grande reduzido.
"""
from PIL import Image
import struct, io, os

RAIZ = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
FUNDO = (11, 14, 16)        # --marca-carvao
CLARO = (242, 241, 238)     # --txt

fonte = Image.open(os.path.join(RAIZ, 'img/logo-negativa.png')).convert('RGBA')
X = fonte.crop((420, 0, 723, 200))
X = X.crop(X.getbbox())

def detalhado(lado, folga=0.16):
    """O X como ele é, com a treliça. A folga existe porque o Google e o Android
       recortam o ícone num círculo: traço encostado na borda some no corte."""
    livre = int(lado * (1 - folga * 2))
    p = X.copy(); p.thumbnail((livre, livre), Image.LANCZOS)
    t = Image.new('RGBA', (lado, lado), FUNDO + (255,))
    t.paste(p, ((lado - p.width) // 2, (lado - p.height) // 2), p)
    return t.convert('RGB')

def silhueta(lado, folga=0.14):
    """Só a forma do X, cheia. É o que sobrevive a 16 px."""
    livre = int(lado * (1 - folga * 2))
    a = X.getchannel('A').point(lambda v: 255 if v > 60 else 0)
    a = a.resize((livre, max(1, int(livre * X.height / X.width))), Image.LANCZOS)
    m = Image.new('RGBA', a.size, CLARO + (255,)); m.putalpha(a)
    t = Image.new('RGBA', (lado, lado), FUNDO + (255,))
    t.paste(m, ((lado - m.width) // 2, (lado - m.height) // 2), m)
    return t.convert('RGB')

def grava_ico(caminho, imagens):
    """Monta o .ico à mão porque o Pillow redimensiona UMA arte para todos os
       tamanhos, e aqui cada tamanho tem arte própria. PNG dentro de ICO é
       entendido por todo navegador atual."""
    partes = []
    for im in imagens:
        b = io.BytesIO(); im.save(b, format='PNG', optimize=True); partes.append(b.getvalue())
    saida = struct.pack('<HHH', 0, 1, len(partes))
    deslocamento = 6 + 16 * len(partes)
    for im, dados in zip(imagens, partes):
        saida += struct.pack('<BBBBHHII', im.width % 256, im.height % 256, 0, 0,
                             1, 32, len(dados), deslocamento)
        deslocamento += len(dados)
    with open(caminho, 'wb') as f:
        f.write(saida + b''.join(partes))

detalhado(192).save(os.path.join(RAIZ, 'img/favicon.png'), optimize=True)
detalhado(180).save(os.path.join(RAIZ, 'img/apple-touch-icon.png'), optimize=True)
grava_ico(os.path.join(RAIZ, 'favicon.ico'),
          [silhueta(16), silhueta(32), detalhado(48)])

print('img/favicon.png        192x192  (4 x 48, como o Google exige)')
print('img/apple-touch-icon   180x180')
print('favicon.ico            16 e 32 em silhueta, 48 detalhado')
