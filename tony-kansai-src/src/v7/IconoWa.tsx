// Icono de WhatsApp para el botón de contacto: en móvil es lo único que se ve,
// y un sobre «✉» no dice que se abre WhatsApp.

export function IconoWa() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true" fill="currentColor">
      <path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2Zm0 18.2a8.2 8.2 0 0 1-4.2-1.2l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 1 1 12 20.2Zm4.5-6.1c-.2-.1-1.5-.7-1.7-.8-.2-.1-.4-.1-.6.1l-.8 1c-.1.2-.3.2-.5.1a6.7 6.7 0 0 1-3.3-2.9c-.3-.4.3-.4.7-1.4.1-.2 0-.3 0-.4l-.8-1.8c-.2-.5-.4-.4-.6-.4h-.5a1 1 0 0 0-.7.3 3 3 0 0 0-.9 2.2 5.1 5.1 0 0 0 1.1 2.7 11.6 11.6 0 0 0 4.5 4c1.7.7 2.3.8 3.2.6.5-.1 1.5-.6 1.7-1.2.2-.6.2-1.1.2-1.2-.1-.1-.3-.2-.5-.3Z" />
    </svg>
  )
}

/** Avión de papel de Telegram: Larion atiende por Telegram, no por WhatsApp. */
export function IconoTg() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true" fill="currentColor">
      <path d="M21.4 3.6 2.9 10.7c-1 .4-1 1.7 0 2l4.6 1.5 1.8 5.6c.3.8 1.3 1 1.9.4l2.6-2.5 4.8 3.5c.7.5 1.7.1 1.9-.7l3.1-15c.2-1-.8-1.8-1.7-1.4ZM9.6 14.3l-.5 3.3-1.2-3.9 9.6-6.2-7.9 6.8Z" />
    </svg>
  )
}

/** Icono según el canal del enlace: Telegram si va a t.me, WhatsApp si no. */
export function IconoCanal({ tg }: { tg?: boolean }) {
  return tg ? <IconoTg /> : <IconoWa />
}
