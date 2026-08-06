/**
 * Шейдеры секции Bypass: поток частиц трафика.
 *
 * Частица — затухающая линия: капсула с закруглёнными концами, яркая у головы
 * и сходящая на нет к хвосту. Ни кружка, ни отдельного ореола у головы:
 * кометный вид (раздувающийся факел) читался огнём, вариант «кружок со следом» —
 * составным объектом. Вспышка появляется только в момент удара о преграду.
 *
 * Два аддитивных прохода (`ONE, ONE`) — это свет, а не покрытие:
 * 1. дальний фон — полноэкранный треугольник;
 * 2. частицы — инстансы квадов, один draw call на весь поток.
 *
 * Преграды в кадре нет вовсе: частицы гаснут, упираясь в невидимое.
 */

export const COMET_VERT = `#version 300 es
in vec2 position;   // единичный квад: x 0…1 (1 — голова), y −0.5…0.5
in vec2 iHead;      // голова частицы в логических px, начало — левый верхний угол
in vec3 iShape;     // длина линии, полутолщина, яркость
in vec2 iState;     // яркость линии (0 — погашена) и сила вспышки удара

uniform vec2 uResolution;
uniform float uGlowSpread; // во сколько раз квад выше кружка — под ореол

out vec3 vSize;   // длина линии, полувысота квада, полутолщина — всё в px
out vec2 vUv;
out float vBright;
out float vFlash;

void main() {
  float len = iShape.x;
  float coreR = iShape.y;
  float halfH = coreR * uGlowSpread;

  /*
   * Запас квада за головой — в пикселях от размера ореола, а не в долях длины:
   * у короткой частицы доля даёт пару пикселей, ореол упирается в кромку и
   * кружок читается срезанным прямоугольником.
   */
  float pad = halfH;

  vUv = vec2(position.x * (len + pad) / len, position.y * 2.0);
  vSize = vec3(len, halfH, coreR);
  vBright = iShape.z * iState.x;
  vFlash = iState.y;

  vec2 px = iHead + vec2(-len + position.x * (len + pad), position.y * halfH * 2.0);
  vec2 clip = vec2(px.x / uResolution.x * 2.0 - 1.0, 1.0 - px.y / uResolution.y * 2.0);

  // Погасшие и не вспыхивающие частицы схлопываются в точку, чтобы не тратить
  // фрагменты
  float visible = step(0.001, max(iState.x, iState.y));
  gl_Position = vec4(mix(vec2(-2.0), clip, visible), 0.0, 1.0);
}
`

export const COMET_FRAG = `#version 300 es
precision highp float;

in vec3 vSize;
in vec2 vUv;
in float vBright;
in float vFlash;

uniform vec3 uIce;

out vec4 fragColor;

/*
 * Расстояние до отрезка: линия рисуется капсулой, поэтому её концы скруглены
 * сами собой. Прежний вариант обрывал след у головы шагом step(u, 1.0) и давал
 * видимую ступеньку — эта форма такого шва не имеет по построению.
 */
float capsule(vec2 p, float len, float w) {
  float x = clamp(p.x, -len, 0.0);
  return length(p - vec2(x, 0.0)) / w;
}

void main() {
  float len = vSize.x;
  float halfH = vSize.y;
  float w = vSize.z;

  // Координаты в пикселях от головы: только так толщина линии и радиус вспышки
  // не зависят от того, во сколько раз квад длиннее своей высоты
  vec2 d = vec2((vUv.x - 1.0) * len, vUv.y * halfH);

  /*
   * Затухание к хвосту. Степень, а не прямая пропорция: на линейном спаде
   * линия читается ровной чёрточкой — яркость должна быть собрана у головы,
   * иначе не видно, куда частица летит.
   */
  float along = pow(clamp(1.0 + d.x / len, 0.0, 1.0), 1.9);

  // Дисперсия по толщине канала: узкий красный, широкий синий
  vec3 line = vec3(
    exp(-pow(capsule(d, len, w * 0.88), 2.0)),
    exp(-pow(capsule(d, len, w), 2.0)),
    exp(-pow(capsule(d, len, w * 1.18), 2.0))
  ) * along * vBright;

  /*
   * Вспышка удара: живёт только в момент гибели частицы и стоит ровно в голове.
   * Ядро плюс широкий холодный спад — иначе получается плоское белое пятно.
   */
  float r = length(d);
  /*
   * Радиусы вспышки увязаны с высотой квада (halfH = w · GLOW_SPREAD): широкий
   * спад обязан затухнуть до нуля внутри квада, иначе вокруг удара виден
   * светлый прямоугольник — свет обрезан кромкой.
   */
  float burst = exp(-pow(r / (w * 2.2), 2.0)) * 1.5 + exp(-pow(r / (w * 4.5), 2.0)) * 0.42;
  vec3 flash = mix(vec3(1.0), uIce, clamp(r / (w * 6.0), 0.0, 1.0)) * burst * vFlash;

  vec3 col = 1.0 - exp(-(line * 1.6 + flash) * 1.35);

  fragColor = vec4(col, clamp(max(max(col.r, col.g), col.b), 0.0, 1.0));
}
`

export const FIELD_VERT = `#version 300 es
in vec2 position;
void main() {
  gl_Position = vec4(position, 0.0, 1.0);
}
`

export const FIELD_FRAG = `#version 300 es
precision highp float;

uniform vec2  uResolution;
uniform float uWallX;
uniform float uCenterY;
uniform float uBand;
uniform float uDpr;
uniform float uCharge;  // 1 — поток ещё не проходит, 0 — прошёл
uniform vec3  uIce;

out vec4 fragColor;

float hash21(vec2 p) {
  p = fract(p * vec2(123.34, 456.21));
  p += dot(p, p + 45.32);
  return fract(p.x * p.y);
}

void main() {
  vec2 px = vec2(gl_FragCoord.x, uResolution.y - gl_FragCoord.y) / uDpr;
  float h = uResolution.y / uDpr;
  float dy = px.y - uCenterY;

  vec3 col = vec3(0.0);

  /*
   * Дальняя пыль обжитой стороны. Нужна не сама по себе: она задаёт, что слева
   * пространство живое, и тем самым делает тьму справа пустотой, а не просто
   * чёрным полем. Самой преграды в кадре нет — на неё указывает только то, что
   * поток до неё доходит, а дальше нет ничего.
   */
  float dust = 0.0;
  vec2 cell = floor(px / 26.0);
  if (hash21(cell) > 0.88) {
    vec2 c = (cell + 0.5 + (vec2(hash21(cell + 1.7), hash21(cell + 5.3)) - 0.5) * 0.7) * 26.0;
    dust = exp(-pow(length(px - c) / 1.2, 2.0)) * (0.05 + 0.18 * hash21(cell + 9.1));
  }
  float livedIn = mix(smoothstep(uWallX + 10.0, uWallX - 240.0, px.x), 1.0, 1.0 - uCharge);
  dust *= livedIn * exp(-pow(dy / (uBand * 0.9), 2.0));
  col += mix(vec3(1.0), uIce, 0.5) * dust;

  /*
   * Вспышки прорыва здесь нет и не будет: любое свечение в точке преграды —
   * это снова источник света посреди кадра, из-за которого был отвергнут
   * прошлый вариант. Событие несут сами частицы, которые начинают проходить.
   */

  // Правило кромок: свет не должен обрываться на границе секции
  col *= 1.0 - smoothstep(h * 0.30, h * 0.5, abs(px.y - h * 0.5));

  col = 1.0 - exp(-col * 1.25);
  fragColor = vec4(col, clamp(max(max(col.r, col.g), col.b), 0.0, 1.0));
}
`
