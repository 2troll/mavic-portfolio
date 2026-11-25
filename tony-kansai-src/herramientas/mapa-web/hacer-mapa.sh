#!/bin/sh
# Mapa de todas las rutas de la web: captura del móvil, fallos y la historia de git.
# Uso: herramientas/mapa-web/hacer-mapa.sh   (tarda ~15 min; abre http://localhost:5194/)
set -e
AQUI=$(cd "$(dirname "$0")" && pwd); WEB=$(cd "$AQUI/../.." && pwd); DEP=$(mktemp -d)
cd "$WEB" && npm run build >/dev/null && cp -R dist/. "$DEP/" && node scripts/rutas-estaticas.mjs "$DEP" >/dev/null 2>&1
(cd "$DEP" && python3 -m http.server 5193 >/dev/null 2>&1 &) ; sleep 1
git -C "$WEB/.." log --date=short --format='@@%h|%ad|%s' --name-only -- tony-kansai-src > "$AQUI/git.txt"
python3 - "$AQUI" <<'PY'
import json,sys
S=sys.argv[1]; C=[];A={};cur=None
for l in open(S+'/git.txt'):
    l=l.rstrip('\n')
    if l.startswith('@@'):
        h,d,m=l[2:].split('|',2); cur={'h':h,'d':d,'m':m,'n':0}; C.append(cur)
    elif l and cur:
        cur['n']+=1; A.setdefault(l.replace('tony-kansai-src/','',1),[]).append(len(C)-1)
json.dump({'commits':C,'archivos':A},open(S+'/historia.json','w'))
PY
mkdir -p "$AQUI/fotos" && rm -f "$AQUI"/fotos/*
node "$AQUI/auditar.mjs" "$DEP" "$AQUI"
python3 "$AQUI/generar.py"
python3 "$AQUI/arbol.py" "$DEP" "$AQUI/historia.json"
echo "Abre: cd $AQUI && python3 -m http.server 5194  →  http://localhost:5194/"
echo "Recuerda: npm run build reescribe páginas de public/ con fechas nuevas; revisa git status antes de commitear."
