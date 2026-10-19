// Iconos de las experiencias y socios sin logo propio (Lucide, licencia ISC).
// Sustituyen al kanji suelto, que no decía nada a quien no lee japonés.
import { Swords, Shield, Camera, Aperture, Shirt, Flower2, Crown, Leaf, Slice, ChefHat, Hammer, Wifi, Sprout, Ribbon, Flame, Gift, Smartphone, type LucideIcon } from 'lucide-react'

export const ICONO_EXP: Record<string, LucideIcon> = {
  samurai: Swords, shogun: Shield, flytographer: Camera, snapkyoto: Aperture, wargo: Shirt, yumeyakata: Flower2,
  miyabi: Crown, camellia: Leaf, towerknives: Slice, cookingsun: ChefHat, hamanasu: Hammer, japanwireless: Wifi, yokotake: Sprout, domyo: Ribbon,
  okamoto: Shirt, nakamura: Flame, japaneid: Gift, japanwirelessesim: Smartphone,
}
