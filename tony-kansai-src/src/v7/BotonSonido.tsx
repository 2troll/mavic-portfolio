// Botón de sonido de la cabecera. Apagado por defecto; recuerda la elección.

import { useEffect, useState } from 'react'
import { alCambiar, enciende, estaEncendido, ponAmbiente, recuerda } from './sonido'
import type { Ambiente } from './sonido'

const ETIQUETA: Record<string, [string, string]> = {
  es: ['Activar sonido', 'Silenciar'], en: ['Turn sound on', 'Mute'],
  ar: ['تشغيل الصوت', 'كتم الصوت'], ru: ['Включить звук', 'Выключить звук'],
}

export function BotonSonido({ lang, ambiente }: { lang: string; ambiente: Ambiente }) {
  const [on, setOn] = useState(estaEncendido)
  useEffect(() => alCambiar(setOn), [])
  useEffect(() => { ponAmbiente(ambiente); recuerda() }, [ambiente])
  const [activar, silenciar] = ETIQUETA[lang] ?? ETIQUETA.en
  return (
    <button type="button" className={`v7-sonido ${on ? 'on' : ''}`} aria-pressed={on} aria-label={on ? silenciar : activar} title={on ? silenciar : activar}
      onClick={() => enciende(!on)}>
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M11 5 6 9H3v6h3l5 4V5z" fill="currentColor" stroke="none" />
        {on ? (
          <>
            <path className="v7-onda" d="M15.5 8.5a5 5 0 0 1 0 7" />
            <path className="v7-onda dos" d="M18.5 5.5a9 9 0 0 1 0 13" />
          </>
        ) : (
          <path d="m16 9 5 6m0-6-5 6" />
        )}
      </svg>
    </button>
  )
}
