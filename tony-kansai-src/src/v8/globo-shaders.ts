// Shaders del globo realista (v8). Mismas ideas que el globo del estudio del
// Golfo: día y noche con el sol de este momento, nubes VIIRS de NASA donde la
// nube tiene que ser blanca Y neutra (si no, desiertos y hielo salen como velo).

/** Máscara de nubes compartida por la Tierra (sombras) y la esfera de nubes. */
const NUBES_GLSL = /* glsl */ `
uniform sampler2D uNubes, uNubes2, uReserva, uDiaG;
uniform float uModoNubes; // 0 sin nubes, 1 VIIRS en vivo (ayer + anteayer), 2 reserva empaquetada
uniform float uNubesOp;

// VIIRS en color real: la nube es clara y sin color. Las franjas sin pasada
// del satélite llegan en negro: ahí no hay dato (valido = 0).
float mascaraVIIRS(vec3 m, out float valido) {
  float mn = min(m.r, min(m.g, m.b));
  float mx = max(m.r, max(m.g, m.b));
  valido = step(0.04, mx);
  return smoothstep(0.42, 0.82, mn) * (1.0 - smoothstep(0.05, 0.15, mx - mn));
}

float alfaNube(vec2 uv) {
  if (uModoNubes < 0.5) return 0.0;
  if (uModoNubes > 1.5) return texture2D(uReserva, uv).r;
  float v1, v2;
  float a1 = mascaraVIIRS(texture2D(uNubes, uv).rgb, v1);
  float a2 = mascaraVIIRS(texture2D(uNubes2, uv).rgb, v2);
  // Los huecos entre pasadas de ayer se rellenan con anteayer.
  float a = mix(a2 * v2, a1, v1);
  // Hielo y nieve también son blancos y neutros: si Blue Marble ya es blanco
  // ahí, no es nube. (uDiaG llega en lineal; se pasa a sRGB aproximado.)
  vec3 d = pow(texture2D(uDiaG, uv).rgb, vec3(1.0 / 2.2));
  float dmn = min(d.r, min(d.g, d.b));
  float hielo = smoothstep(0.45, 0.7, dmn) * (1.0 - smoothstep(0.06, 0.16, max(d.r, max(d.g, d.b)) - dmn));
  a *= 1.0 - 0.85 * hielo;
  // El banco de hielo marino del océano Austral no está en Blue Marble.
  float lat = (uv.y - 0.5) * 180.0;
  return a * (1.0 - 0.6 * smoothstep(58.0, 75.0, abs(lat)));
}
`

export const VERT_MUNDO = /* glsl */ `
varying vec2 vUv;
varying vec3 vNw;
varying vec3 vPw;
void main() {
  vUv = uv;
  vNw = normalize(mat3(modelMatrix) * normal);
  vec4 w = modelMatrix * vec4(position, 1.0);
  vPw = w.xyz;
  gl_Position = projectionMatrix * viewMatrix * w;
}
`

/**
 * La Tierra. uCaja = lonO, lonE, latS, latN de uDia: la esfera entera o el
 * parche de Japón, que trae su propia foto pero comparte noche y nubes.
 */
export const FRAG_TIERRA = /* glsl */ `
uniform sampler2D uDia, uNoche;
uniform vec4 uCaja;
uniform float uParche;
uniform float uNocheLocal; // 1: la noche trae su propio parche (Black Marble de Japón a 500 m)
uniform vec3 uSol;
uniform float uGiroNubes;
varying vec2 vUv;
varying vec3 vNw;
varying vec3 vPw;
${NUBES_GLSL}
void main() {
  float lon = mix(uCaja.x, uCaja.y, vUv.x), lat = mix(uCaja.z, uCaja.w, vUv.y);
  vec2 uvG = vec2((lon + 180.0) / 360.0, (lat + 90.0) / 180.0);
  vec4 tDia = texture2D(uDia, vUv);
  vec3 albedo = tDia.rgb;

  // El mar de Blue Marble es azul dominante; se decide en sRGB.
  vec3 s = pow(albedo, vec3(1.0 / 2.2));
  float mar = smoothstep(1.05, 1.35, s.b / max(max(s.r, s.g), 0.004));

  vec3 n = normalize(vNw);
  vec3 v = normalize(cameraPosition - vPw);
  float ndl = dot(n, uSol);
  float luz = smoothstep(-0.12, 0.22, ndl);

  vec3 dia = albedo * (0.05 + 1.08 * smoothstep(-0.06, 0.6, ndl));
  dia = mix(dia, dia * vec3(0.78, 0.9, 1.08), mar * 0.55);

  // Sombra de las nubes en el suelo (la esfera de nubes gira: se compensa).
  float sombra = alfaNube(uvG - vec2(uGiroNubes / 6.28318, 0.0)) * uNubesOp;
  dia *= 1.0 - 0.32 * sombra;

  // Reflejo del sol sólo sobre el agua: un punto vivo y un brillo ancho.
  vec3 h = normalize(uSol + v);
  float nh = max(dot(n, h), 0.0);
  float brillo = (pow(nh, 120.0) * 0.85 + pow(nh, 14.0) * 0.05) * mar * (1.0 - 0.8 * sombra);

  // Noche: Black Marble (luces de ciudad) y un claro de luna que deja leer la costa.
  vec3 tn = texture2D(uNoche, uNocheLocal > 0.5 ? vUv : uvG).rgb;
  vec3 noche = albedo * vec3(0.10, 0.13, 0.20) * 0.5 + tn * 0.35 + pow(tn, vec3(1.7)) * vec3(2.4, 1.8, 1.1);

  vec3 c = mix(noche, dia, luz);
  c += brillo * vec3(1.0, 0.92, 0.78) * smoothstep(0.0, 0.25, ndl);
  // Franja cálida del crepúsculo.
  c += vec3(1.0, 0.42, 0.14) * exp(-pow(ndl * 9.0, 2.0)) * 0.05;
  // Atmósfera vista de canto sobre la propia Tierra: azul claro de día.
  float fr = pow(1.0 - max(dot(n, v), 0.0), 3.0);
  c = mix(c, vec3(0.5, 0.72, 1.0) * (0.12 + 0.9 * luz), fr * (0.25 + 0.5 * luz));

  gl_FragColor = vec4(c, uParche > 0.5 ? tDia.a : 1.0);
  #include <colorspace_fragment>
}
`

export const FRAG_NUBES = /* glsl */ `
uniform vec3 uSol;
varying vec2 vUv;
varying vec3 vNw;
varying vec3 vPw;
${NUBES_GLSL}
void main() {
  float a = alfaNube(vUv) * uNubesOp;
  if (a < 0.004) discard;
  vec3 n = normalize(vNw);
  float ndl = dot(n, uSol);
  float luz = smoothstep(-0.15, 0.3, ndl);
  vec3 col = vec3(0.97, 0.98, 1.0) * (0.05 + 0.95 * luz);
  col += vec3(1.0, 0.5, 0.2) * exp(-pow(ndl * 8.0, 2.0)) * 0.12;
  // De noche las nubes apenas tapan las luces de las ciudades.
  gl_FragColor = vec4(col, a * (0.12 + 0.8 * luz));
  #include <colorspace_fragment>
}
`

/**
 * Halo de la atmósfera por la distancia mínima del rayo de vista al centro:
 * funciona igual desde lejos que con la cámara rozando el suelo, y se apaga a
 * cero en su borde exterior para no dejar un canto sobre el fondo claro.
 */
export const FRAG_HALO = /* glsl */ `
uniform vec3 uSol;
uniform float uOp;
varying vec2 vUv;
varying vec3 vNw;
varying vec3 vPw;
void main() {
  vec3 dir = normalize(vPw - cameraPosition);
  float t = -dot(cameraPosition, dir);
  vec3 p = cameraPosition + dir * t;
  float d = length(p);
  float k = clamp(1.0 - (d - 1.0) / 0.075, 0.0, 1.0);
  float lit = smoothstep(-0.35, 0.6, dot(normalize(p), uSol));
  float a = pow(k, 2.4) * (0.18 + 0.5 * lit) * uOp;
  gl_FragColor = vec4(vec3(0.42, 0.66, 1.0), a);
  #include <colorspace_fragment>
}
`
