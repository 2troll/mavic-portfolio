import json, os, sys, collections, html
S = os.path.dirname(os.path.abspath(__file__))
SRC = os.path.abspath(os.path.join(S, '..', '..'))
datos = json.load(open(S + '/datos.json'))
hist = json.load(open(S + '/historia.json'))
C, A = hist['commits'], hist['archivos']

def fuente(ruta):
    """Archivo del repo que genera la ruta: HTML estático en public/ o la SPA (React)."""
    r = ruta.lstrip('/')
    cand = [f'public/{r}index.html' if (r == '' or r.endswith('/')) else f'public/{r}']
    for c in cand:
        if c in A or os.path.exists(os.path.join(SRC, c)):
            return c, 'estática'
    return None, 'React'

def problemas(r):
    out = []
    if r.get('fallo'): out.append(('roto', 'No carga: ' + r['fallo'][:80]))
    if r.get('estado') and r['estado'] >= 400: out.append(('roto', f"HTTP {r['estado']}"))
    a, m = r.get('ancho') or {}, r.get('movil') or {}
    if a.get('izq') is not None and a['izq'] < 40 and a.get('der', 0) > 1180: out.append(('izquierda', 'Texto de borde a borde en el PC (sin márgenes)'))
    if m.get('izq') is not None and m['izq'] < 8: out.append(('izquierda', f"Texto pegado al borde en el móvil ({m['izq']} px)"))
    if m.get('desborda'): out.append(('desborda', 'Se sale de la pantalla del móvil (scroll lateral)'))
    if a.get('letra', '').lower() in ('times', 'times new roman', 'serif'): out.append(('sin-estilo', 'Letra por defecto del navegador (sin diseño)'))
    reales = [x for x in m.get('malos', []) if 'bajo' in x['m'] or 'cortado' in x['m']]
    if reales: out.append(('botones', f"{len(reales)} botones bajos o con el texto cortado en el móvil"))
    if m.get('imgRotas'): out.append(('fotos', f"{m['imgRotas']} fotos que no cargan"))
    if r.get('errores'): out.append(('errores', f"{len(r['errores'])} errores de JavaScript"))
    return out

filas = []
for r in datos:
    f, tipo = fuente(r['ruta'])
    idx = A.get(f, []) if f else []
    m = r.get('movil') or {}
    seg = r['ruta'].strip('/').split('/')[0] or 'raíz'
    filas.append({
        'ruta': r['ruta'], 'foto': r.get('foto'), 'titulo': m.get('titulo', ''), 'h1': m.get('h1', ''),
        'lang': m.get('lang', ''), 'seccion': seg, 'cab': m.get('cabecera', ''), 'pie': m.get('pie', ''),
        'noindex': m.get('noindex', False), 'letra': m.get('letra', ''), 'tipo': tipo, 'archivo': f,
        'cambios': len(idx), 'primero': C[idx[-1]]['d'] if idx else '', 'ultimo': C[idx[0]]['d'] if idx else '',
        'ultMsg': C[idx[0]]['m'][:110] if idx else '', 'problemas': problemas(r), 'malos': m.get('malos', []),
        'errores': r.get('errores', [])[:3],
    })

semanas = collections.Counter()
import datetime
for c in C:
    d = datetime.date.fromisoformat(c['d']); semanas[(d - datetime.timedelta(days=d.weekday())).isoformat()] += 1
sem = sorted(semanas.items())
tipos = collections.Counter(c['m'].split(':')[0].split('(')[0] for c in C if ':' in c['m'][:20])
ultimos = [{'h': c['h'], 'd': c['d'], 'm': c['m'][:160]} for c in C[:60]]
calientes = sorted(((f, len(v)) for f, v in A.items() if f.startswith('src/') or f.startswith('scripts/')), key=lambda x: -x[1])[:15]
resumen = {'rutas': len(filas), 'commits': len(C), 'desde': C[-1]['d'], 'hasta': C[0]['d'], 'semanas': sem,
           'tipos': tipos.most_common(8), 'ultimos': ultimos, 'calientes': calientes}
plantilla = open(S + '/plantilla.html').read()
salida = plantilla.replace('/*DATOS*/null', json.dumps({'filas': filas, 'resumen': resumen}, ensure_ascii=False).replace('</', '<\\/'))
open(S + '/index.html', 'w').write(salida)
cnt = collections.Counter(p[0] for f in filas for p in f['problemas'])
print(len(filas), 'filas;', dict(cnt))
