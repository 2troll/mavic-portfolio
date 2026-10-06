#!/usr/bin/env python3
"""Versión web de los sellos: recorta al círculo, quita el papel (la tinta pasa a
alfa) y tiñe del rojo de la web (#c0281b). Entrada scripts/sellos-gen/*.png,
salida public/v9/sellos/*.webp (320 px)."""
from pathlib import Path
from PIL import Image, ImageOps
import numpy as np

RAIZ = Path(__file__).resolve().parent.parent
SALE = RAIZ / 'public/v9/sellos'; SALE.mkdir(parents=True, exist_ok=True)
for f in sorted((RAIZ / 'scripts/sellos-gen').glob('*.png')):
    a = np.asarray(Image.open(f).convert('RGB')).astype(float)
    # Tinta = cuánto se aleja del papel por el lado del verde/azul (el rojo se queda alto).
    papel = np.median(a.reshape(-1, 3), axis=0)
    tinta = np.clip(((papel[1] - a[..., 1]) + (papel[2] - a[..., 2])) / 2 / 120, 0, 1)
    # Percentiles en vez de mín/máx: una mancha suelta del papel no agranda el recorte.
    ys, xs = np.where(tinta > 0.4)
    m = 12
    y0, y1 = int(np.percentile(ys, 0.3)) - m, int(np.percentile(ys, 99.7)) + m
    x0, x1 = int(np.percentile(xs, 0.3)) - m, int(np.percentile(xs, 99.7)) + m
    y0, x0 = max(y0, 0), max(x0, 0)
    lado = max(y1 - y0, x1 - x0); cy, cx = (y0 + y1) // 2, (x0 + x1) // 2
    t = tinta[max(cy - lado // 2, 0):cy + lado // 2, max(cx - lado // 2, 0):cx + lado // 2]
    rgba = np.zeros(t.shape + (4,), np.uint8); rgba[..., 0], rgba[..., 1], rgba[..., 2] = 0xc0, 0x28, 0x1b
    t = np.clip((t - 0.15) / 0.85, 0, 1)  # fuera el grano del papel: pesaba más que la tinta
    rgba[..., 3] = (t ** 0.8 * 255).astype(np.uint8)
    Image.fromarray(rgba, 'RGBA').resize((320, 320), Image.LANCZOS).save(SALE / f'{f.stem}.webp', 'WEBP', quality=86, method=6)
    print(f.stem, (SALE / f'{f.stem}.webp').stat().st_size // 1024, 'KB')
