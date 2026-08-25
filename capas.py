#!/usr/bin/env python3
"""Gera os recortes horizontais usados no cabeçalho das páginas internas.

    pip install pillow
    python3 capas.py

As fotos das obras são verticais. O cabeçalho de uma página interna é uma
faixa larga e baixa: usar a foto inteira ali faz o navegador baixar uma imagem
grande e jogar fora quase todos os pixels no recorte. Medido, isso custava
1,3 s de LCP.

Estes recortes são feitos na proporção da faixa e ficam por volta de 35 KB,
metade do peso da foto vertical equivalente. O recorte pega um pouco acima do
centro, onde costuma estar o assunto da foto.
"""
import os
from PIL import Image

FOTOS = ['sala-reuniao-azul', 'recepcao-marmore', 'lounge-recepcao', 'mesa-vista-sp',
         'estante-espinha-peixe', 'restaurante-fachada', 'banheiro-marmore', 'lavabo-azul',
         'cozinha-marcenaria', 'restaurante-salao', 'lavabo-terracota']
PROPORCAO = 1600 / 620      # a mesma da faixa no CSS
LARGURAS = [768, 1280]
ALTO = 0.34                 # de onde recortar na vertical: 0 = topo, 1 = base

os.chdir(os.path.join(os.path.dirname(os.path.abspath(__file__)), 'img'))
for nome in FOTOS:
    im = Image.open(nome + '.webp')
    altura = round(im.width / PROPORCAO)
    topo = max(round((im.height - altura) * ALTO), 0)
    corte = im.crop((0, topo, im.width, min(topo + altura, im.height)))
    for larg in LARGURAS:
        # ampliar um pouco não incomoda: a faixa fica sob um véu escuro
        c = corte.resize((larg, round(corte.height * larg / corte.width)), Image.LANCZOS)
        arq = 'capa-%s-%d.webp' % (nome, larg)
        c.save(arq, 'WEBP', quality=76 if larg == 768 else 74, method=6)
        print('%-40s %3d KB' % (arq, os.path.getsize(arq) // 1024))
