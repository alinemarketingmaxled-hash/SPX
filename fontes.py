#!/usr/bin/env python3
"""Baixa as fontes do Google, corta o que o site não usa e grava no repositório.

    pip install fonttools brotli
    python3 fontes.py
    node build.mjs          # regrava o spx.min.css

Servir as fontes do próprio domínio evita abrir duas conexões novas
(fonts.googleapis.com e fonts.gstatic.com) antes do primeiro texto aparecer.
Cortar os glifos que o site nunca escreve derruba cada arquivo pela metade.

A lista PESOS é a fonte da verdade: só entra o que aparece de fato na tela.
Se você usar um peso novo no CSS, acrescente aqui e rode de novo, senão o
navegador engorda a letra por conta própria e o resultado fica torto.
"""
import pathlib, re, subprocess, sys, urllib.request

# família, peso, estilo — conferido com o que o navegador realmente pinta
PESOS = [
    ('Barlow', 400, 'normal'),
    ('Barlow', 600, 'normal'),
    ('Chakra Petch', 500, 'normal'),
    ('Chakra Petch', 600, 'normal'),
    ('Chakra Petch', 700, 'normal'),
]
# português inteiro, mais a pontuação e as setas que o site usa
FAIXAS = ('U+0020-007E,U+00A0-00FF,U+2010-2015,U+2018-201E,U+2022,U+2026,'
          'U+2039-203A,U+20AC,U+2122,U+2190-2199,U+2713')
# o Google só devolve woff2 para quem se declara navegador moderno
NAVEGADOR = ('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 '
             '(KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36')
PASTA = pathlib.Path('assets/css/fontes')
CSS = pathlib.Path('assets/css/spx.css')


def baixa(url):
    pedido = urllib.request.Request(url, headers={'User-Agent': NAVEGADOR})
    return urllib.request.urlopen(pedido, timeout=60).read()


def url_do_google():
    familias = {}
    for familia, peso, _ in PESOS:
        familias.setdefault(familia, []).append(peso)
    partes = ['family=%s:wght@%s' % (f.replace(' ', '+'), ';'.join(map(str, sorted(p))))
              for f, p in familias.items()]
    return 'https://fonts.googleapis.com/css2?' + '&'.join(partes) + '&display=swap'


def main():
    css_google = baixa(url_do_google()).decode()
    # o Google divide cada peso em vários alfabetos; o "latin" já traz todos os
    # acentos do português, então os outros blocos são descartados aqui
    blocos = {}
    for sub, bloco in re.findall(r'/\* (\S+) \*/\n(@font-face \{.*?\n\})', css_google, re.S):
        if sub != 'latin':
            continue
        chave = (re.search(r"font-family: '([^']+)'", bloco).group(1),
                 int(re.search(r'font-weight: (\d+)', bloco).group(1)),
                 re.search(r'font-style: (\w+)', bloco).group(1))
        blocos[chave] = re.search(r'url\((https://[^)]+)\)', bloco).group(1)

    PASTA.mkdir(parents=True, exist_ok=True)
    for antigo in PASTA.glob('*.woff2'):
        antigo.unlink()

    faces, total = [], 0
    for chave in PESOS:
        familia, peso, estilo = chave
        if chave not in blocos:
            sys.exit('O Google não devolveu %s %s %s' % chave)
        bruto = PASTA / 'bruto.woff2'
        bruto.write_bytes(baixa(blocos[chave]))
        nome = '%s-%d%s.woff2' % (familia.lower().replace(' ', '-'), peso,
                                  '-italico' if estilo == 'italic' else '')
        subprocess.run(['pyftsubset', str(bruto), '--output-file=' + str(PASTA / nome),
                        '--flavor=woff2', '--unicodes=' + FAIXAS,
                        '--layout-features=kern,liga,calt', '--no-hinting',
                        '--desubroutinize'], check=True)
        corte = (PASTA / nome).stat().st_size
        print('%-34s %3d KB -> %3d KB' % (nome, len(bruto.read_bytes()) // 1024, corte // 1024))
        total += corte
        bruto.unlink()
        faces.append("@font-face{font-family:'%s';font-style:%s;font-weight:%d;"
                     "font-display:swap;src:url(fontes/%s) format('woff2')}"
                     % (familia, estilo, peso, nome))

    cabecalho = ('/* Fontes servidas do próprio domínio e cortadas para o alfabeto que o\n'
                 '   site escreve. Não edite à mão: rode `python3 fontes.py`. */\n')
    estilo = re.sub(r'^[\s\S]*?(?=/\* =)', '', CSS.read_text())
    CSS.write_text(cabecalho + '\n'.join(faces) + '\n\n' + estilo)
    print('%d fontes, %d KB no total' % (len(faces), total // 1024))


if __name__ == '__main__':
    main()
