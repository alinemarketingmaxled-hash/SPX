#!/usr/bin/env python3
"""Gera as variantes de largura das fotos de obra.

    pip install pillow
    python3 variantes.py

Cada foto de obra existe em 480, 640, 768 e 960 px de largura, e o `srcset` de
cada `<img>` lista só as que são menores que a original — ampliar foto de obra
não acrescenta detalhe nenhum, só peso.

A largura de 768 entrou quando o cabeçalho das páginas internas passou a
mostrar a foto inteira num painel à direita: naquele tamanho, num aparelho com
tela de alta densidade, 640 fica mole e 960 é quase o dobro do peso à toa.

O script não regrava variante que já existe. Para refazer uma, apague o arquivo
antes de rodar.
"""
import os
from PIL import Image

FOTOS = ['sala-reuniao-azul', 'recepcao-marmore', 'lounge-recepcao', 'mesa-vista-sp',
         'estante-espinha-peixe', 'restaurante-fachada', 'banheiro-marmore', 'lavabo-azul',
         'lavabo-bordo', 'cozinha-marcenaria', 'restaurante-salao', 'lavabo-terracota',
         'restaurante-bar', 'restaurante-cozinha', 'restaurante-pratos']
LARGURAS = [480, 640, 768, 960]
QUALIDADE = 74

os.chdir(os.path.join(os.path.dirname(os.path.abspath(__file__)), 'img'))
for nome in FOTOS:
    im = Image.open(nome + '.webp')
    for larg in LARGURAS:
        arq = '%s-%d.webp' % (nome, larg)
        if larg >= im.width:
            continue                      # ampliar não acrescenta detalhe
        if os.path.exists(arq):
            continue
        c = im.resize((larg, round(im.height * larg / im.width)), Image.LANCZOS)
        c.save(arq, 'WEBP', quality=QUALIDADE, method=6)
        print('%-40s %4d KB' % (arq, os.path.getsize(arq) // 1024))
