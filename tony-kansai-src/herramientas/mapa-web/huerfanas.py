#!/usr/bin/env python3
"""Lista las páginas a las que solo se llega por el menú o el pie (lee arbol.html).

Uso: python3 huerfanas.py [prefijo]  →  ruta | título | idioma | quién enlaza por zona
"""
import json, os, sys

AQUI = os.path.dirname(os.path.abspath(__file__))
s = open(os.path.join(AQUI, 'arbol.html'), encoding='utf-8').read()
datos, _ = json.JSONDecoder().raw_decode(s[s.index('{"nodos"'):])
pref = sys.argv[1] if len(sys.argv) > 1 else '/'
for r, n in sorted(datos['nodos'].items()):
    if not r.startswith(pref) or n['ni'] or not n['av']: continue
    zonas = {z: len(v) for z, v in n['entra'].items()}
    print(r, '|', n['t'][:70], '|', n['l'], '|', zonas, '|', n['tipo'], '|', '; '.join(n['av']))
