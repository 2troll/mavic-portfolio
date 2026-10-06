#!/usr/bin/env python3
"""Genera el dibujo de un sello rojo (estilo 御朱印) con Gemini (Nano Banana), SIN texto:
el kanji real lo pone la web encima. Respeta el tope mensual y apunta el gasto.
Uso: sello-gen.py NOMBRE "MOTIVO EN INGLÉS" [--modelo gemini-2.5-flash-image]
Salida: scripts/sellos-gen/NOMBRE.png (fuente; la versión web la saca sello-web.py)."""
import argparse, base64, json, os, sys, time, urllib.request
from pathlib import Path

D = Path(__file__).resolve().parent / "sellos-gen"
GASTO = Path.home() / "gemini-worker" / "gasto-imagenes.jsonl"
PRECIO = {"gemini-3-pro-image": 0.134, "gemini-3.1-flash-image": 0.067, "gemini-2.5-flash-image": 0.039}
TOPE_MES = float(os.environ.get("TOPE_MES_USD", "5"))
PROMPT = ("A single traditional Japanese temple stamp impression (goshuin / hanko seal) pressed in vermilion red ink on plain white paper. "
          "A round seal border, slightly imperfect like real ink, with a minimalist woodblock-style line illustration of {motivo} inside. "
          "Only vermilion red ink on white. Absolutely NO text, NO letters, NO kanji, NO characters, NO numbers anywhere. "
          "Flat top-down scan, centered, generous white margin, no shadows, no paper texture.")

def clave():
    for l in (Path.home() / ".claves/gemini.env").read_text().splitlines():
        if "=" in l and l.split("=")[0].strip() in ("GEMINI_API_KEY", "GOOGLE_API_KEY"):
            return l.split("=", 1)[1].strip().strip('"').strip("'")
    sys.exit("No encuentro la clave en ~/.claves/gemini.env")

def gastado():
    if not GASTO.exists(): return 0.0
    mes = time.strftime("%Y-%m")
    return sum(json.loads(l)["usd"] for l in GASTO.read_text().splitlines() if l.strip() and json.loads(l)["fecha"].startswith(mes))

def main():
    ap = argparse.ArgumentParser(); ap.add_argument("nombre"); ap.add_argument("motivo")
    ap.add_argument("--modelo", default="gemini-2.5-flash-image"); a = ap.parse_args()
    ya = gastado()
    if ya + PRECIO[a.modelo] > TOPE_MES: sys.exit(f"Tope mensual alcanzado: {ya:.2f} $ de {TOPE_MES:.2f} $.")
    body = {"contents": [{"parts": [{"text": PROMPT.format(motivo=a.motivo)}]}],
            "generationConfig": {"responseModalities": ["IMAGE"], "imageConfig": {"aspectRatio": "1:1"}}}
    req = urllib.request.Request(f"https://generativelanguage.googleapis.com/v1beta/models/{a.modelo}:generateContent",
                                 data=json.dumps(body).encode(), headers={"Content-Type": "application/json", "x-goog-api-key": clave()})
    for espera in (0, 20, 60):
        time.sleep(espera)
        try: r = json.load(urllib.request.urlopen(req, timeout=300)); break
        except urllib.error.HTTPError as e:
            if e.code not in (429, 500, 503, 504) or espera == 60: sys.exit(f"Error {e.code}: {e.read().decode()[:400]}")
    D.mkdir(exist_ok=True)
    for c in r.get("candidates", []):
        for p in c.get("content", {}).get("parts", []):
            if "inlineData" in p:
                (D / f"{a.nombre}.png").write_bytes(base64.b64decode(p["inlineData"]["data"]))
                with GASTO.open("a") as f:
                    f.write(json.dumps({"fecha": time.strftime("%Y-%m-%d %H:%M"), "modelo": a.modelo, "foto": f"sello-{a.nombre}.png", "usd": PRECIO[a.modelo]}) + "\n")
                print(f"{a.nombre}.png · {PRECIO[a.modelo]} $ · mes {ya + PRECIO[a.modelo]:.2f} $"); return
    sys.exit("Sin imagen en la respuesta: " + json.dumps(r)[:400])

if __name__ == "__main__": main()
