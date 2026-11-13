// Builds full SVG documents (hero art, age art, the Fun Games tile) from the toy library.
import { TOYS, BRICK, star, carton } from "./toys.mjs";

const svg = (w, h, body, defs = "") =>
  `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">${defs ? `<defs>${defs}</defs>` : ""}${body}</svg>`;

const place = (inner, x, y, s = 1) => `<g transform="translate(${x} ${y}) scale(${s})">${inner}</g>`;

// ─── Hero slides (transparent, 1000 × 760) ──────────────────

const orbit = (cx, cy, r, color) =>
  `<circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="${color}" stroke-width="5" stroke-dasharray="4 16" stroke-linecap="round"/>`;

const sparkles = (pts) => pts.map(([x, y, r, c]) => star(x, y, r, c)).join("");

export const HERO_ART = {
  "starting-49": () => svg(1000, 760, `${orbit(520, 400, 330, BRICK.red)}
    ${place(TOYS.rocket([BRICK.blue, BRICK.red, BRICK.orange]), 380, -20, 1.15)}
    ${place(TOYS.top([BRICK.red, BRICK.yellow, BRICK.blue]), 120, 150, 0.6)}
    ${place(TOYS.blocks([BRICK.red, BRICK.blue, BRICK.green]), 700, 380, 0.7)}
    ${place(TOYS.teddy(["#B07A4F", "#F4D9B0", BRICK.red]), 150, 330, 1.05)}
    ${place(TOYS.car([BRICK.yellow, BRICK.red, BRICK.blue]), 470, 480, 0.75)}
    ${sparkles([[160, 90, 18, BRICK.yellow], [900, 120, 14, BRICK.green], [90, 560, 12, BRICK.blue], [930, 640, 16, BRICK.orange]])}`),
  vehicles: () => svg(1000, 760, `${orbit(500, 420, 320, BRICK.blue)}
    ${place(TOYS.plane([BRICK.blue, BRICK.red, BRICK.yellow]), 520, 40, 0.95)}
    ${place(TOYS.truck([BRICK.yellow, BRICK.orange, BRICK.blue]), 60, 170, 0.95)}
    ${place(TOYS.rcCar([BRICK.red, BRICK.yellow, BRICK.blue]), 300, 300, 1.25)}
    ${sparkles([[130, 120, 16, BRICK.yellow], [920, 470, 14, BRICK.green], [80, 650, 12, BRICK.red]])}`),
  birthday: () => svg(1000, 760, `${orbit(500, 400, 320, BRICK.orange)}
    ${place(TOYS.balloons([BRICK.red, BRICK.yellow, BRICK.blue]), 560, -10, 1.1)}
    ${place(TOYS.doll(["#F06EA9", "#4A2C20", BRICK.yellow]), 60, 250, 1.05)}
    ${place(TOYS.gift([BRICK.red, BRICK.yellow, BRICK.blue]), 330, 330, 1.05)}
    ${place(TOYS.teddy(["#E2A86C", "#FBE3C4", BRICK.blue]), 690, 420, 0.78)}
    ${sparkles([[140, 120, 18, BRICK.yellow], [470, 90, 14, BRICK.green], [940, 360, 12, BRICK.red]])}`),
  b2b: () => svg(1000, 760, `${orbit(520, 400, 320, BRICK.yellow)}
    ${place(TOYS.teddy(["#B07A4F", "#F4D9B0", BRICK.red]), 240, 90, 0.8)}
    ${carton(170, 400, 300, 230)}
    ${carton(520, 430, 260, 200)}
    ${carton(560, 260, 200, 150, "#E3AE73")}
    ${place(TOYS.ball([BRICK.orange, BRICK.blue, BRICK.green]), 570, 38, 0.6)}
    ${place(TOYS.car([BRICK.red, BRICK.yellow, BRICK.blue]), 80, 560, 0.55)}
    ${sparkles([[120, 140, 16, BRICK.yellow], [900, 150, 14, BRICK.green], [930, 620, 12, BRICK.red]])}`),
};

// ─── Age group art (transparent, 400 × 400) ─────────────────

export const AGE_ART = {
  "0-24-months": () => svg(400, 400, `${place(TOYS.stacker([BRICK.blue]), 10, 40, 0.8)}${place(TOYS.bunny(["#F7B8CF", "#FFF1F5", BRICK.blue]), 170, 120, 0.62)}`),
  "3-5-years": () => svg(400, 400, `${place(TOYS.blocks([BRICK.red, BRICK.blue, BRICK.green]), 10, 120, 0.6)}${place(TOYS.teddy(["#B07A4F", "#F4D9B0", BRICK.red]), 150, 40, 0.72)}`),
  "5-7-years": () => svg(400, 400, `${place(TOYS.dino([BRICK.green, BRICK.yellow, "#F4D9B0"]), 0, 60, 0.7)}${place(TOYS.car([BRICK.red, BRICK.yellow, BRICK.blue]), 150, 190, 0.6)}`),
  "7-10-years": () => svg(400, 400, `${place(TOYS.rcCar([BRICK.blue, BRICK.yellow, BRICK.red]), 20, 80, 0.9)}`),
  "11-plus-years": () => svg(400, 400, `${place(TOYS.cube(), 0, 100, 0.68)}${place(TOYS.rocket([BRICK.blue, BRICK.red, BRICK.orange]), 150, 10, 0.68)}`),
};

// ─── Fun Games category tile (matches the owner's 685 × 725 crops) ──

export function funGamesTile() {
  const defs = `<linearGradient id="tile" x1="0" x2="1" y1="0" y2="0"><stop offset="0" stop-color="#CCFED9"/><stop offset="1" stop-color="#95BAFF"/></linearGradient>`;
  return svg(685, 725, `<rect x="0" y="200" width="685" height="600" rx="76" fill="url(#tile)"/>
    ${place(TOYS.board([BRICK.orange, BRICK.red, BRICK.blue]), 110, 110, 1.15)}
    ${place(TOYS.top([BRICK.red, BRICK.yellow, BRICK.blue]), 470, 360, 0.6)}
    ${place(TOYS.ball([BRICK.orange, BRICK.blue, BRICK.green]), 0, 420, 0.62)}
    ${star(560, 140, 22, BRICK.yellow)}${star(110, 170, 16, BRICK.green)}`, defs);
}
