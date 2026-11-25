#!/usr/bin/env python3
"""Árbol de la web: cada ruta, qué lleva y cómo se conecta con las demás.

Lee el HTML ya prerenderizado (la carpeta de despliegue) sin navegador: título,
descripción, h1, idioma, noindex y todos los enlaces internos, separados en
cabecera/menú, contenido y pie. Calcula quién enlaza a quién, páginas huérfanas
(solo se llega desde el menú o el pie), callejones (no llevan a ningún sitio
desde el contenido) y enlaces rotos. Añade la historia de git de cada archivo.

Uso: python3 arbol.py <carpeta-deploy> [historia.json]  →  arbol.html aquí mismo.
"""
import collections, datetime, json, os, sys
from html.parser import HTMLParser
from urllib.parse import urlsplit, unquote

AQUI = os.path.dirname(os.path.abspath(__file__))
DEP = sys.argv[1]
HIST = sys.argv[2] if len(sys.argv) > 2 else os.path.join(AQUI, 'historia.json')
DOMINIO = 'tonykansaiguide.com'
SALTAR = {'assets', 'v7', 'v8', 'letra'}


class Lector(HTMLParser):
    def __init__(self):
        super().__init__(convert_charrefs=True)
        self.zona = []          # pila: header / nav / footer / main
        self.enl = []           # (href, texto, zona)
        self.a = None
        self.titulo = self.h1 = self.desc = self.lang = ''
        self.noindex = False
        self._en = None

    def handle_starttag(self, tag, attrs):
        at = dict(attrs)
        if tag == 'html': self.lang = at.get('lang', '')
        if tag in ('header', 'footer', 'nav'): self.zona.append(tag)
        if tag == 'meta' and at.get('name') == 'description': self.desc = at.get('content', '')
        if tag == 'meta' and at.get('name') == 'robots' and 'noindex' in (at.get('content') or ''): self.noindex = True
        if tag == 'title': self._en = 'titulo'
        if tag == 'h1' and not self.h1: self._en = 'h1'
        if tag == 'a' and at.get('href'):
            z = 'pie' if 'footer' in self.zona else 'menú' if ('header' in self.zona or 'nav' in self.zona) else 'contenido'
            self.a = [at['href'], '', z]

    def handle_endtag(self, tag):
        if tag in ('header', 'footer', 'nav') and tag in self.zona:
            while self.zona and self.zona.pop() != tag: pass
        if tag in ('title', 'h1'): self._en = None
        if tag == 'a' and self.a:
            self.enl.append(tuple(self.a)); self.a = None

    def handle_data(self, data):
        d = data
        if self._en == 'titulo': self.titulo += d
        elif self._en == 'h1': self.h1 += d
        if self.a is not None: self.a[1] += d


def ruta_de(rel):
    rel = rel.replace(os.sep, '/')
    return '/' + rel[:-len('index.html')] if rel.endswith('index.html') else '/' + rel


def normal(href, desde):
    """Devuelve la ruta interna normalizada o None si es externa / ancla / mailto."""
    if href.startswith(('mailto:', 'tel:', 'javascript:', 'data:', '#', 'whatsapp:')): return None
    u = urlsplit(href)
    if u.netloc and u.netloc.replace('www.', '') != DOMINIO: return None
    p = unquote(u.path or '')
    if not p: return None
    if not p.startswith('/'):
        base = desde if desde.endswith('/') else desde.rsplit('/', 1)[0] + '/'
        p = os.path.normpath(base + p).replace(os.sep, '/') + ('/' if p.endswith('/') else '')
    if p.startswith('/api/') or p.rsplit('/', 1)[-1].count('.') and not p.endswith('.html'): return None
    return p


paginas = {}
for raiz, dirs, files in os.walk(DEP):
    dirs[:] = [d for d in dirs if d not in SALTAR]
    for f in files:
        if not f.endswith('.html') or f == '200.html': continue
        rel = os.path.relpath(os.path.join(raiz, f), DEP)
        r = ruta_de(rel)
        L = Lector()
        try: L.feed(open(os.path.join(raiz, f), encoding='utf-8', errors='replace').read())
        except Exception as e: print('aviso', r, e)
        paginas[r] = L

existe = set(paginas)
def resolver(p):
    if p in existe: return p
    if not p.endswith('/') and p + '/' in existe: return p + '/'
    if p.endswith('/') and p[:-1] in existe: return p[:-1]
    return None

sale = {}; entra = collections.defaultdict(lambda: collections.defaultdict(set)); rotos = collections.defaultdict(set)
for r, L in paginas.items():
    vistos = {}
    for href, txt, z in L.enl:
        p = normal(href, r)
        if not p: continue
        q = resolver(p)
        if not q: rotos[r].add(p); continue
        if q == r: continue
        t = ' '.join(txt.split())[:70]
        # una entrada por destino; si sale en varias zonas, gana «contenido»
        if q not in vistos or (z == 'contenido' and vistos[q][1] != 'contenido'): vistos[q] = (t, z)
        entra[q][z].add(r)
    sale[r] = vistos

hist = json.load(open(HIST)) if os.path.exists(HIST) else {'commits': [], 'archivos': {}}
C, A = hist['commits'], hist['archivos']

def archivo(r):
    rr = r.lstrip('/')
    f = f'public/{rr}index.html' if (rr == '' or rr.endswith('/')) else f'public/{rr}'
    return f if f in A else None

nodos = {}
for r, L in paginas.items():
    f = archivo(r); idx = A.get(f, []) if f else []
    s = sale[r]
    porz = collections.Counter(z for _, z in s.values())
    e = entra.get(r, {})
    desde_cont = len(e.get('contenido', ()))
    desde_todo = len(set().union(*e.values())) if e else 0
    avisos = []
    if r not in ('/', '/index.html') and desde_todo == 0: avisos.append('nadie enlaza aquí')
    elif desde_cont == 0 and desde_todo: avisos.append('solo se llega por el menú o el pie')
    if porz.get('contenido', 0) == 0: avisos.append('el contenido no lleva a ninguna página')
    if rotos.get(r): avisos.append(f'{len(rotos[r])} enlaces rotos')
    nodos[r] = {
        't': ' '.join(L.titulo.split())[:120], 'h1': ' '.join(L.h1.split())[:120], 'd': L.desc[:220], 'l': L.lang,
        'ni': L.noindex, 'sale': [[q, t, z] for q, (t, z) in sorted(s.items())],
        'entra': {z: sorted(v) for z, v in e.items()}, 'rotos': sorted(rotos.get(r, ())),
        'nc': len(idx), 'ul': C[idx[0]]['d'] if idx else '', 'um': C[idx[0]]['m'][:120] if idx else '',
        'tipo': 'estática' if f else 'React', 'av': avisos,
    }

sem = collections.Counter()
for c in C:
    d = datetime.date.fromisoformat(c['d']); sem[(d - datetime.timedelta(days=d.weekday())).isoformat()] += 1
datos = {'nodos': nodos, 'semanas': sorted(sem.items()), 'ultimos': [[c['d'], c['m'][:150]] for c in C[:80]],
         'total': len(C), 'desde': C[-1]['d'] if C else '', 'hasta': C[0]['d'] if C else ''}
pl = open(os.path.join(AQUI, 'arbol-plantilla.html'), encoding='utf-8').read()
open(os.path.join(AQUI, 'arbol.html'), 'w', encoding='utf-8').write(
    pl.replace('/*DATOS*/null', json.dumps(datos, ensure_ascii=False).replace('</', '<\\/')))
cuenta = collections.Counter(a.split(' ')[0] if a[0].isdigit() else a for n in nodos.values() for a in n['av'])
print(len(nodos), 'páginas ·', sum(len(v) for v in sale.values()), 'conexiones ·', dict(cuenta))
