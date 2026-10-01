#!/usr/bin/env python3
"""Hornea el relieve 3D de cada ruta de montaña con datos del 国土地理院 (GSI).

    python3 -m venv .venv && .venv/bin/pip install pillow
    .venv/bin/python scripts/hornear-montes.py

Por cada ruta descarga, alrededor de su punto (mapStop en src/lib/data.ts):
  - elevación  dem_png  z14, 3×3 teselas → public/v7/montes/<id>-dem.png (256 px, sin pérdida)
  - foto aérea seamlessphoto z15, 6×6 → public/v7/montes/<id>-foto.webp (1024 px)
y escribe public/v7/montes/montes.json con la altura mínima y máxima de cada uno.

Se hornea en vez de pedirlo en vivo: un archivo por monte carga antes y la web
no depende de que el servidor del GSI responda. Fuente obligatoria en la web:
«出典：国土地理院» (Instituto Geográfico de Japón).
"""
import io, json, math, re, sys, time, urllib.request
from pathlib import Path
from PIL import Image

RAIZ = Path(__file__).resolve().parent.parent
SALIDA = RAIZ / 'public/v7/montes'
MONTES = ['mt-kongo', 'mt-atago', 'mt-hiei', 'mt-rokko', 'mt-maya', 'mt-yoshino', 'ponpon-mountain', 'hoshi-no-buranko']
UA = {'User-Agent': 'TonyKansaiGuide/1.0 (tony@tonykansaiguide.com)'}


def coords():
    data = (RAIZ / 'src/lib/data.ts').read_text()
    bloque = data.split('export const HIKING_ROUTES = [')[1]
    res = {}
    for m in re.finditer(r"id: '([^']+)'.*?mapStop: \{ lat: ([\d.]+), lng: ([\d.]+) \}", bloque, re.S):
        res[m.group(1)] = (float(m.group(2)), float(m.group(3)))
    return res


def tesela(lat, lon, z):
    n = 2 ** z
    x = (lon + 180) / 360 * n
    y = (1 - math.log(math.tan(math.radians(lat)) + 1 / math.cos(math.radians(lat))) / math.pi) / 2 * n
    return int(x), int(y)


def baja(url):
    for intento in range(4):
        try:
            with urllib.request.urlopen(urllib.request.Request(url, headers=UA), timeout=20) as r:
                return r.read()
        except Exception as e:  # noqa: BLE001 — reintenta y, si no, falla con la URL
            if intento == 3:
                raise SystemExit(f'No baja {url}: {e}')
            time.sleep(2 * (intento + 1))


def altura(r, g, b):
    x = r * 65536 + g * 256 + b
    if x == 2 ** 23:
        return None  # sin dato (mar)
    return (x - 2 ** 24 if x > 2 ** 23 else x) * 0.01


def hornea(id_, lat, lon):
    cx, cy = tesela(lat, lon, 14)
    dem = Image.new('RGB', (768, 768))
    for j in range(3):
        for i in range(3):
            dem.paste(Image.open(io.BytesIO(baja(f'https://cyberjapandata.gsi.go.jp/xyz/dem_png/14/{cx - 1 + i}/{cy - 1 + j}.png'))).convert('RGB'), (i * 256, j * 256))
            time.sleep(0.15)
    foto = Image.new('RGB', (1536, 1536))
    for j in range(6):
        for i in range(6):
            foto.paste(Image.open(io.BytesIO(baja(f'https://cyberjapandata.gsi.go.jp/xyz/seamlessphoto/15/{2 * (cx - 1) + i}/{2 * (cy - 1) + j}.jpg'))).convert('RGB'), (i * 256, j * 256))
            time.sleep(0.15)
    alturas = [h for h in (altura(*p) for p in dem.getdata()) if h is not None]
    # La web usa 256×256 vértices: se guarda a ese tamaño, con vecino más
    # cercano porque los colores codifican alturas y no se pueden promediar.
    dem.crop((1, 1, 767, 767)).resize((256, 256), Image.NEAREST).save(SALIDA / f'{id_}-dem.png', optimize=True)
    foto.resize((1024, 1024), Image.LANCZOS).save(SALIDA / f'{id_}-foto.webp', quality=68)
    # Dónde cae el punto de la ruta dentro del cuadro (0–1), para el marcador.
    n = 2 ** 14
    px = ((lon + 180) / 360 * n - (cx - 1)) / 3
    py = ((1 - math.log(math.tan(math.radians(lat)) + 1 / math.cos(math.radians(lat))) / math.pi) / 2 * n - (cy - 1)) / 3
    # Lado del cuadro en metros (3 teselas z14 a esa latitud).
    lado = 3 * 40075016.686 * math.cos(math.radians(lat)) / n
    return {'min': round(min(alturas), 1), 'max': round(max(alturas), 1), 'punto': [round(px, 4), round(py, 4)], 'lado': round(lado)}


def main():
    SALIDA.mkdir(parents=True, exist_ok=True)
    c = coords()
    falta = [m for m in MONTES if m not in c]
    if falta:
        raise SystemExit(f'Sin mapStop en data.ts: {falta}')
    info = {}
    for id_ in MONTES:
        info[id_] = hornea(id_, *c[id_])
        print(id_, info[id_], flush=True)
    (SALIDA / 'montes.json').write_text(json.dumps(info, indent=1) + '\n')


if __name__ == '__main__':
    sys.exit(main())
