#!/usr/bin/env python3
"""Vuelca un lote de traducciones {ingles: [es, ar, cs, ru]} en src/lib/dict/*.json."""
import json, sys, os
BASE = os.path.join(os.path.dirname(__file__), '..', 'src', 'lib', 'dict')
LANGS = ['es', 'ar', 'cs', 'ru']

def merge(batch):
    for i, lang in enumerate(LANGS):
        p = os.path.join(BASE, f'{lang}.json')
        data = json.load(open(p, encoding='utf-8'))
        for en, vals in batch.items():
            if len(vals) != 4:
                raise SystemExit(f'faltan traducciones para: {en}')
            data[en] = vals[i]
        json.dump(data, open(p, 'w', encoding='utf-8'), ensure_ascii=False, indent=1, sort_keys=True)
    print(f'{len(batch)} cadenas × {len(LANGS)} idiomas')

if __name__ == '__main__':
    merge(json.load(sys.stdin))
