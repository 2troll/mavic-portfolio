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


# Cumbre exacta de cada monte (OpenStreetMap, natural=peak; en Hoshi no Buranko,
# el puente colgante). El mapStop de data.ts es el punto de encuentro o el
# inicio del sendero: con él el relieve y el hilo rojo no caían en la cumbre
# (hasta 5,8 km de error en Hoshi no Buranko y 4,5 km en Ponpon-yama).
CIMAS = {
    'mt-kongo': (34.41943, 135.67293),          # 金剛山 1125 m
    'mt-atago': (35.06005, 135.63429),          # 愛宕山 924 m (Kioto)
    'mt-hiei': (35.06687, 135.83410),           # 大比叡 848 m
    'mt-rokko': (34.77799, 135.26374),          # 六甲山最高峰 931 m
    'mt-maya': (34.73298, 135.20488),           # 摩耶山 699 m
    'mt-yoshino': (34.34139, 135.88795),        # 青根ヶ峰 858 m (la altitud de la ficha)
    'ponpon-mountain': (34.93521, 135.62382),   # ポンポン山 679 m
    'hoshi-no-buranko': (34.75285, 135.68531),  # 星のブランコ (puente)
}


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
    # Cuadro de 3 teselas z14 CENTRADO en la cumbre: se bajan 4×4 y se recorta.
    n = 2 ** 14
    fx = (lon + 180) / 360 * n
    fy = (1 - math.log(math.tan(math.radians(lat)) + 1 / math.cos(math.radians(lat))) / math.pi) / 2 * n
    x0, y0 = int(fx - 1.5), int(fy - 1.5)
    dem4 = Image.new('RGB', (1024, 1024))
    for j in range(4):
        for i in range(4):
            dem4.paste(Image.open(io.BytesIO(baja(f'https://cyberjapandata.gsi.go.jp/xyz/dem_png/14/{x0 + i}/{y0 + j}.png'))).convert('RGB'), (i * 256, j * 256))
            time.sleep(0.15)
    ox, oy = round((fx - 1.5 - x0) * 256), round((fy - 1.5 - y0) * 256)
    dem = dem4.crop((ox, oy, ox + 768, oy + 768))
    foto8 = Image.new('RGB', (2048, 2048))
    for j in range(8):
        for i in range(8):
            foto8.paste(Image.open(io.BytesIO(baja(f'https://cyberjapandata.gsi.go.jp/xyz/seamlessphoto/15/{2 * x0 + i}/{2 * y0 + j}.jpg'))).convert('RGB'), (i * 256, j * 256))
            time.sleep(0.15)
    foto = foto8.crop((2 * ox, 2 * oy, 2 * ox + 1536, 2 * oy + 1536))
    alturas = [h for h in (altura(*p) for p in dem.getdata()) if h is not None]
    # La web usa 256×256 vértices: se guarda a ese tamaño, con vecino más
    # cercano porque los colores codifican alturas y no se pueden promediar.
    dem.resize((256, 256), Image.NEAREST).save(SALIDA / f'{id_}-dem.png', optimize=True)
    foto.resize((1024, 1024), Image.LANCZOS).save(SALIDA / f'{id_}-foto.webp', quality=68)
    # La cumbre queda en el centro del cuadro (0–1), salvo el redondeo del recorte.
    px = (fx - x0) * 256 - ox
    py = (fy - y0) * 256 - oy
    px, py = px / 768, py / 768
    # Lado del cuadro en metros (3 teselas z14 a esa latitud).
    lado = 3 * 40075016.686 * math.cos(math.radians(lat)) / n
    return {'min': round(min(alturas), 1), 'max': round(max(alturas), 1), 'punto': [round(px, 4), round(py, 4)], 'lado': round(lado)}


def main():
    SALIDA.mkdir(parents=True, exist_ok=True)
    c = {**coords(), **CIMAS}
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
