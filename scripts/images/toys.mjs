// Flat, outlined toy illustrations drawn on a 400 × 400 canvas, ground line at y ≈ 330.
// Style matches the owner's category artwork: dark brown outline, solid fills, small highlights.

export const INK = "#3B2B22";
export const GLASS = "#BFE3FF";
export const CREAM = "#FFFDF8";
export const BRICK = { red: "#E8382D", blue: "#1F7FE0", yellow: "#FFC72C", green: "#3FA34D", orange: "#FF8A1E" };

const st = (w = 6) => `stroke="${INK}" stroke-width="${w}" stroke-linejoin="round" stroke-linecap="round"`;

export function shade(hex, amount = 0.2) {
  const n = parseInt(hex.slice(1), 16);
  const f = (v) => Math.max(0, Math.min(255, Math.round(v * (1 - amount))));
  return `#${[(n >> 16) & 255, (n >> 8) & 255, n & 255].map((v) => f(v).toString(16).padStart(2, "0")).join("")}`;
}

export function tint(hex, amount = 0.8) {
  const n = parseInt(hex.slice(1), 16);
  const f = (v) => Math.round(v + (255 - v) * amount);
  return `#${[(n >> 16) & 255, (n >> 8) & 255, n & 255].map((v) => f(v).toString(16).padStart(2, "0")).join("")}`;
}

/** Draws children as a single silhouette with one outer outline (no inner seams). */
function merged(shapes, fill, w = 6) {
  return `<g fill="${INK}" stroke="${INK}" stroke-width="${w * 2}" stroke-linejoin="round">${shapes}</g><g fill="${fill}">${shapes}</g>`;
}

const wheel = (cx, cy, r = 32) =>
  `<circle cx="${cx}" cy="${cy}" r="${r}" fill="#34303B" ${st()}/><circle cx="${cx}" cy="${cy}" r="${r * 0.42}" fill="#D9DDE6" ${st(4)}/>`;

const eye = (cx, cy, r = 8) =>
  `<circle cx="${cx}" cy="${cy}" r="${r}" fill="${INK}"/><circle cx="${cx + r * 0.35}" cy="${cy - r * 0.35}" r="${r * 0.35}" fill="#fff"/>`;

const cheek = (cx, cy) => `<circle cx="${cx}" cy="${cy}" r="11" fill="#F58C95" opacity=".55"/>`;

export function star(cx, cy, r, fill, w = 4) {
  const pts = [];
  for (let i = 0; i < 10; i++) {
    const a = (Math.PI / 5) * i - Math.PI / 2;
    const rr = i % 2 ? r * 0.45 : r;
    pts.push(`${(cx + rr * Math.cos(a)).toFixed(1)},${(cy + rr * Math.sin(a)).toFixed(1)}`);
  }
  return `<polygon points="${pts.join(" ")}" fill="${fill}" ${st(w)}/>`;
}

export function die(x, y, s, pips = 5) {
  const p = s / 4;
  const spots = {
    1: [[2, 2]], 2: [[1, 1], [3, 3]], 3: [[1, 1], [2, 2], [3, 3]],
    4: [[1, 1], [3, 1], [1, 3], [3, 3]], 5: [[1, 1], [3, 1], [2, 2], [1, 3], [3, 3]],
    6: [[1, 1], [3, 1], [1, 2], [3, 2], [1, 3], [3, 3]],
  }[pips];
  return `<rect x="${x}" y="${y}" width="${s}" height="${s}" rx="${s * 0.18}" fill="${CREAM}" ${st()}/>` +
    spots.map(([i, j]) => `<circle cx="${x + i * p}" cy="${y + j * p}" r="${s * 0.08}" fill="${INK}"/>`).join("");
}

// ─── Vehicles ─────────────────────────────────────────────

export function car([c1, c2, c3], wheelR = 32) {
  const body = "M60 270 Q60 225 105 220 L140 175 Q150 160 170 160 L255 160 Q275 160 288 178 L318 220 Q345 225 345 255 L345 280 Q345 292 333 292 L72 292 Q60 292 60 280Z";
  return `<path d="${body}" fill="${c1}"/>
    <rect x="62" y="244" width="282" height="14" fill="${c2}"/>
    <path d="M100 232 Q110 226 125 226" stroke="#fff" stroke-width="6" stroke-linecap="round" fill="none" opacity=".7"/>
    <path d="${body}" fill="none" ${st()}/>
    <path d="M150 215 L172 180 L210 180 L210 215Z" fill="${GLASS}" ${st(5)}/>
    <path d="M228 180 L260 180 Q268 180 274 188 L294 215 L228 215Z" fill="${GLASS}" ${st(5)}/>
    <circle cx="330" cy="238" r="9" fill="${c3}" ${st(4)}/>
    <rect x="58" y="232" width="14" height="10" rx="3" fill="${BRICK.red}" ${st(3)}/>
    ${wheel(115, 293, wheelR)}${wheel(290, 293, wheelR)}`;
}

export function rcCar([c1, c2, c3]) {
  return `<g transform="translate(-6 52) scale(0.8)">
      <line x1="250" y1="165" x2="280" y2="70" ${st(5)}/><circle cx="282" cy="64" r="10" fill="${c3}" ${st(4)}/>
      ${car([c1, c2, c3], 40)}
    </g>
    <g transform="rotate(-12 330 250)">
      <line x1="355" y1="215" x2="372" y2="160" ${st(5)}/><circle cx="373" cy="156" r="7" fill="${c1}" ${st(3)}/>
      <rect x="290" y="212" width="90" height="62" rx="16" fill="${c2}" ${st()}/>
      <circle cx="315" cy="243" r="12" fill="#34303B" ${st(4)}/><circle cx="355" cy="243" r="12" fill="#34303B" ${st(4)}/>
      <circle cx="335" cy="228" r="4" fill="${c1}"/>
    </g>`;
}

export function truck([c1, c2, c3]) {
  return `<rect x="58" y="250" width="294" height="30" rx="8" fill="#4B4F5C" ${st()}/>
    <path d="M52 165 L245 165 L228 252 L72 252Z" fill="${c1}" ${st()}/>
    <path d="M84 192 L228 192 M90 222 L222 222" stroke="${shade(c1, 0.22)}" stroke-width="7" stroke-linecap="round"/>
    <path d="M252 252 L252 175 Q252 160 267 160 L310 160 Q322 160 330 172 L352 210 Q358 220 358 232 L358 252Z" fill="${c2}" ${st()}/>
    <path d="M270 178 L305 178 L326 212 L270 212Z" fill="${GLASS}" ${st(5)}/>
    <rect x="344" y="228" width="16" height="13" rx="3" fill="${c3}" ${st(4)}/>
    <rect x="276" y="122" width="30" height="40" rx="4" fill="#4B4F5C" ${st(5)}/>
    ${wheel(112, 292)}${wheel(190, 292)}${wheel(312, 292)}`;
}

export function train([c1, c2, c3]) {
  return `<rect x="55" y="162" width="46" height="42" rx="6" fill="${c3}" ${st()}/>
    <rect x="108" y="170" width="54" height="34" rx="6" fill="${BRICK.yellow}" ${st()}/>
    <rect x="40" y="200" width="140" height="80" rx="10" fill="${c2}" ${st()}/>
    <rect x="58" y="218" width="104" height="22" rx="6" fill="${shade(c2, 0.2)}"/>
    <rect x="176" y="254" width="28" height="12" rx="3" fill="#4B4F5C" ${st(4)}/>
    <circle cx="242" cy="104" r="15" fill="#EEF1F6" ${st(4)}/><circle cx="268" cy="80" r="11" fill="#EEF1F6" ${st(4)}/>
    <path d="M220 202 L216 150 L252 150 L248 202Z" fill="#4B4F5C" ${st()}/>
    <rect x="208" y="136" width="52" height="18" rx="6" fill="${c3}" ${st()}/>
    <rect x="200" y="200" width="160" height="80" rx="10" fill="${c1}" ${st()}/>
    <rect x="286" y="142" width="74" height="76" rx="8" fill="${c1}" ${st()}/>
    <rect x="304" y="160" width="38" height="32" rx="6" fill="${GLASS}" ${st(5)}/>
    <rect x="278" y="128" width="90" height="20" rx="6" fill="${c2}" ${st()}/>
    <path d="M360 256 L384 282 L360 282Z" fill="${c3}" ${st(5)}/>
    <rect x="210" y="232" width="66" height="12" rx="4" fill="${shade(c1, 0.2)}"/>
    ${wheel(78, 298, 26)}${wheel(144, 298, 26)}${wheel(238, 298, 28)}${wheel(322, 298, 28)}`;
}

export function plane([c1, c2, c3]) {
  return `<path d="M72 200 L58 128 L98 128 L128 200Z" fill="${c2}" ${st()}/>
    <line x1="150" y1="240" x2="150" y2="286" ${st(6)}/><line x1="286" y1="240" x2="286" y2="286" ${st(6)}/>
    ${wheel(150, 298, 18)}${wheel(286, 298, 18)}
    <path d="M60 205 Q60 180 92 180 L300 180 Q350 180 362 214 Q350 246 300 246 L95 246 Q60 246 60 224Z" fill="${c1}" ${st()}/>
    <path d="M90 228 L330 228" stroke="${c3}" stroke-width="8" stroke-linecap="round"/>
    ${[150, 186, 222, 258].map((x) => `<circle cx="${x}" cy="204" r="11" fill="${GLASS}" ${st(4)}/>`).join("")}
    <path d="M308 190 Q338 192 348 212 L308 212Z" fill="${GLASS}" ${st(4)}/>
    <path d="M168 222 L252 222 L216 296 L180 296Z" fill="${c2}" ${st()}/>
    <rect x="360" y="166" width="14" height="96" rx="7" fill="${c3}" ${st(5)}/>
    <circle cx="364" cy="214" r="11" fill="${c3}" ${st(5)}/>`;
}

// ─── Soft toys & figures ──────────────────────────────────

export function teddy([c1, c2, c3]) {
  return `<circle cx="132" cy="96" r="38" fill="${c1}" ${st()}/><circle cx="132" cy="96" r="18" fill="${c2}"/>
    <circle cx="268" cy="96" r="38" fill="${c1}" ${st()}/><circle cx="268" cy="96" r="18" fill="${c2}"/>
    <ellipse cx="200" cy="256" rx="90" ry="78" fill="${c1}" ${st()}/>
    <ellipse cx="200" cy="268" rx="50" ry="44" fill="${c2}"/>
    <ellipse cx="116" cy="238" rx="28" ry="44" transform="rotate(28 116 238)" fill="${c1}" ${st()}/>
    <ellipse cx="284" cy="238" rx="28" ry="44" transform="rotate(-28 284 238)" fill="${c1}" ${st()}/>
    <ellipse cx="148" cy="318" rx="40" ry="26" fill="${c1}" ${st()}/><ellipse cx="148" cy="320" rx="20" ry="13" fill="${c2}"/>
    <ellipse cx="252" cy="318" rx="40" ry="26" fill="${c1}" ${st()}/><ellipse cx="252" cy="320" rx="20" ry="13" fill="${c2}"/>
    <circle cx="200" cy="150" r="80" fill="${c1}" ${st()}/>
    <ellipse cx="200" cy="180" rx="36" ry="27" fill="${c2}" ${st(4)}/>
    <ellipse cx="200" cy="168" rx="13" ry="9" fill="${INK}"/>
    <path d="M188 186 Q200 197 212 186" fill="none" ${st(4)}/>
    ${eye(170, 138)}${eye(230, 138)}${cheek(150, 170)}${cheek(250, 170)}
    <path d="M200 232 L160 212 L160 252Z" fill="${c3}" ${st(4)}/><path d="M200 232 L240 212 L240 252Z" fill="${c3}" ${st(4)}/>
    <circle cx="200" cy="232" r="11" fill="${c3}" ${st(4)}/>`;
}

export function bunny([c1, c2, c3]) {
  return `<ellipse cx="162" cy="82" rx="24" ry="64" transform="rotate(-10 162 82)" fill="${c1}" ${st()}/>
    <ellipse cx="162" cy="86" rx="11" ry="44" transform="rotate(-10 162 86)" fill="${c2}"/>
    <ellipse cx="238" cy="82" rx="24" ry="64" transform="rotate(14 238 82)" fill="${c1}" ${st()}/>
    <ellipse cx="238" cy="86" rx="11" ry="44" transform="rotate(14 238 86)" fill="${c2}"/>
    <ellipse cx="200" cy="262" rx="82" ry="72" fill="${c1}" ${st()}/>
    <ellipse cx="200" cy="272" rx="48" ry="40" fill="${c2}"/>
    <ellipse cx="124" cy="246" rx="24" ry="40" transform="rotate(25 124 246)" fill="${c1}" ${st()}/>
    <ellipse cx="276" cy="246" rx="24" ry="40" transform="rotate(-25 276 246)" fill="${c1}" ${st()}/>
    <ellipse cx="154" cy="320" rx="38" ry="22" fill="${c1}" ${st()}/><ellipse cx="246" cy="320" rx="38" ry="22" fill="${c1}" ${st()}/>
    <circle cx="200" cy="168" r="70" fill="${c1}" ${st()}/>
    ${eye(174, 158)}${eye(226, 158)}${cheek(158, 186)}${cheek(242, 186)}
    <path d="M192 180 L208 180 L200 190Z" fill="#E86A8E" ${st(3)}/>
    <path d="M200 190 Q192 202 184 196 M200 190 Q208 202 216 196" fill="none" ${st(4)}/>
    <path d="M150 182 L118 176 M150 192 L120 196 M250 182 L282 176 M250 192 L280 196" ${st(3)}/>
    <path d="M200 236 L170 220 L170 252Z" fill="${c3}" ${st(4)}/><path d="M200 236 L230 220 L230 252Z" fill="${c3}" ${st(4)}/>
    <circle cx="200" cy="236" r="9" fill="${c3}" ${st(4)}/>`;
}

export function dino([c1, c2, c3]) {
  const spikes = [[112, 214, 128, 176, 146, 205], [148, 196, 166, 156, 186, 190], [190, 190, 210, 150, 230, 192], [228, 198, 248, 160, 262, 210]]
    .map(([a, b, c, d, e, f]) => `<path d="M${a} ${b} L${c} ${d} L${e} ${f}Z" fill="${c2}" ${st(5)}/>`).join("");
  return `${spikes}
    <path d="M118 272 Q48 290 26 232 Q72 252 126 238Z" fill="${c1}" ${st()}/>
    <path d="M128 288 L126 330 L170 330 L172 292Z" fill="${c1}" ${st()}/>
    <path d="M216 292 L214 330 L258 330 L262 288Z" fill="${c1}" ${st()}/>
    <ellipse cx="190" cy="252" rx="98" ry="66" fill="${c1}" ${st()}/>
    <ellipse cx="200" cy="272" rx="60" ry="36" fill="${c3}"/>
    <path d="M238 222 Q244 142 298 120 Q362 100 368 150 Q372 190 322 194 Q298 196 288 220Z" fill="${c1}" ${st()}/>
    <path d="M272 240 Q296 246 300 262" fill="none" ${st(6)}/>
    <circle cx="330" cy="142" r="13" fill="#fff" ${st(4)}/>${eye(333, 143, 6)}
    <path d="M326 174 Q344 184 360 170" fill="none" ${st(4)}/>
    <circle cx="160" cy="232" r="9" fill="${shade(c1, 0.18)}"/><circle cx="190" cy="214" r="7" fill="${shade(c1, 0.18)}"/><circle cx="140" cy="258" r="6" fill="${shade(c1, 0.18)}"/>
    ${cheek(312, 168)}`;
}

export function robot([c1, c2, c3]) {
  return `<line x1="200" y1="62" x2="200" y2="92" ${st(6)}/><circle cx="200" cy="56" r="11" fill="${c3}" ${st(5)}/>
    <rect x="80" y="192" width="38" height="92" rx="17" fill="${c2}" ${st()}/><circle cx="99" cy="294" r="19" fill="${c3}" ${st(5)}/>
    <rect x="282" y="192" width="38" height="92" rx="17" fill="${c2}" ${st()}/><circle cx="301" cy="294" r="19" fill="${c3}" ${st(5)}/>
    <rect x="148" y="286" width="40" height="34" rx="8" fill="${c2}" ${st()}/><rect x="212" y="286" width="40" height="34" rx="8" fill="${c2}" ${st()}/>
    <rect x="134" y="316" width="62" height="20" rx="8" fill="#4B4F5C" ${st()}/><rect x="204" y="316" width="62" height="20" rx="8" fill="#4B4F5C" ${st()}/>
    <rect x="120" y="182" width="160" height="112" rx="22" fill="${c1}" ${st()}/>
    <rect x="152" y="206" width="96" height="54" rx="10" fill="${CREAM}" ${st(4)}/>
    <circle cx="176" cy="233" r="10" fill="${c3}" ${st(3)}/><circle cx="200" cy="233" r="10" fill="${BRICK.green}" ${st(3)}/><circle cx="224" cy="233" r="10" fill="${c2}" ${st(3)}/>
    <rect x="184" y="170" width="32" height="16" fill="#9AA0AE" ${st(4)}/>
    <rect x="138" y="88" width="124" height="88" rx="20" fill="${c2}" ${st()}/>
    <rect x="156" y="110" width="88" height="38" rx="14" fill="#2F2A33"/>
    <circle cx="180" cy="129" r="10" fill="${c3}"/><circle cx="220" cy="129" r="10" fill="${c3}"/>
    <path d="M182 160 L218 160" ${st(5)}/>
    <rect x="126" y="114" width="14" height="30" rx="5" fill="${c1}" ${st(4)}/><rect x="260" y="114" width="14" height="30" rx="5" fill="${c1}" ${st(4)}/>`;
}

export function hero([c1, c2, c3]) {
  const skin = "#F5C9A0";
  return `<path d="M152 150 L104 322 Q200 344 296 322 L248 150Z" fill="${c2}" ${st()}/>
    <rect x="164" y="248" width="32" height="70" rx="10" fill="${c1}" ${st()}/><rect x="204" y="248" width="32" height="70" rx="10" fill="${c1}" ${st()}/>
    <rect x="158" y="300" width="42" height="30" rx="10" fill="${c2}" ${st()}/><rect x="200" y="300" width="42" height="30" rx="10" fill="${c2}" ${st()}/>
    <rect x="122" y="152" width="30" height="88" rx="15" fill="${c1}" ${st()}/><circle cx="137" cy="246" r="16" fill="${skin}" ${st(5)}/>
    <rect x="252" y="80" width="30" height="88" rx="15" transform="rotate(32 267 160)" fill="${c1}" ${st()}/>
    <circle cx="310" cy="96" r="17" fill="${skin}" ${st(5)}/>
    <rect x="150" y="140" width="100" height="124" rx="24" fill="${c1}" ${st()}/>
    <rect x="150" y="226" width="100" height="16" fill="${c3}" ${st(4)}/>
    ${star(200, 186, 26, c3)}
    <circle cx="200" cy="100" r="44" fill="${skin}" ${st()}/>
    <path d="M156 96 Q156 52 200 52 Q244 52 244 96 Q228 74 200 76 Q172 74 156 96Z" fill="${INK}"/>
    <path d="M160 96 Q200 84 240 96 L238 114 Q200 104 162 114Z" fill="${c2}" ${st(4)}/>
    <ellipse cx="183" cy="102" rx="8" ry="6" fill="#fff"/><ellipse cx="217" cy="102" rx="8" ry="6" fill="#fff"/>
    <circle cx="184" cy="102" r="3.5" fill="${INK}"/><circle cx="218" cy="102" r="3.5" fill="${INK}"/>
    <path d="M186 124 Q200 134 214 124" fill="none" ${st(4)}/>`;
}

export function doll([c1, c2, c3]) {
  const skin = "#FBD3B4";
  return `<path d="M128 132 Q126 50 200 48 Q274 50 272 132 L284 236 Q200 256 116 236Z" fill="${c2}" ${st()}/>
    <rect x="126" y="190" width="24" height="84" rx="12" transform="rotate(18 138 190)" fill="${skin}" ${st(5)}/>
    <rect x="250" y="190" width="24" height="84" rx="12" transform="rotate(-18 262 190)" fill="${skin}" ${st(5)}/>
    <rect x="174" y="300" width="20" height="30" fill="${skin}" ${st(5)}/><rect x="206" y="300" width="20" height="30" fill="${skin}" ${st(5)}/>
    <ellipse cx="180" cy="332" rx="18" ry="9" fill="${c3}" ${st(4)}/><ellipse cx="220" cy="332" rx="18" ry="9" fill="${c3}" ${st(4)}/>
    <path d="M166 182 L234 182 L292 312 Q200 334 108 312Z" fill="${c1}" ${st()}/>
    ${[[160, 250], [200, 236], [240, 252], [150, 292], [196, 284], [246, 294]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="7" fill="${CREAM}" opacity=".85"/>`).join("")}
    <path d="M172 182 L200 204 L228 182" fill="${CREAM}" ${st(4)}/>
    <circle cx="200" cy="126" r="60" fill="${skin}" ${st()}/>
    <path d="M140 122 Q140 66 200 66 Q260 66 260 122 Q236 92 204 98 Q170 92 140 122Z" fill="${c2}"/>
    ${eye(178, 132, 10)}${eye(222, 132, 10)}${cheek(162, 152)}${cheek(238, 152)}
    <path d="M188 158 Q200 168 212 158" fill="none" ${st(4)}/>
    <path d="M248 74 L276 58 L272 90Z" fill="${c3}" ${st(4)}/><path d="M248 74 L246 44 L222 66Z" fill="${c3}" ${st(4)}/>
    <circle cx="248" cy="72" r="8" fill="${c3}" ${st(4)}/>`;
}

export function dollhouse([c1, c2, c3]) {
  return `<rect x="268" y="74" width="28" height="56" fill="${c2}" ${st()}/>
    <rect x="78" y="150" width="244" height="182" rx="6" fill="${c1}" ${st()}/>
    <path d="M56 162 L200 58 L344 162Z" fill="${c2}" ${st()}/>
    <circle cx="200" cy="124" r="17" fill="${GLASS}" ${st(5)}/>
    <path d="M78 240 L322 240 M200 150 L200 332" ${st()}/>
    <rect x="94" y="168" width="90" height="56" fill="${tint(c1, 0.55)}"/>
    <rect x="216" y="168" width="90" height="56" fill="${tint(c3, 0.6)}"/>
    <rect x="94" y="256" width="90" height="62" fill="${tint(c3, 0.6)}"/>
    <rect x="216" y="256" width="90" height="62" fill="${tint(c1, 0.55)}"/>
    <rect x="108" y="176" width="46" height="34" rx="4" fill="${GLASS}" ${st(4)}/><path d="M131 176 L131 210 M108 193 L154 193" ${st(3)}/>
    <circle cx="170" cy="190" r="9" fill="${CREAM}" ${st(3)}/>
    <rect x="228" y="198" width="56" height="20" rx="6" fill="${c2}" ${st(4)}/><rect x="228" y="186" width="18" height="16" rx="4" fill="${CREAM}" ${st(3)}/>
    <path d="M270 168 L262 186 L278 186Z" fill="${c3}" ${st(3)}/><line x1="270" y1="186" x2="270" y2="198" ${st(3)}/>
    <rect x="108" y="290" width="56" height="10" rx="4" fill="${c2}" ${st(3)}/><path d="M116 300 L116 318 M156 300 L156 318" ${st(3)}/>
    <path d="M236 318 L236 280 Q236 262 256 262 Q276 262 276 280 L276 318Z" fill="${c3}" ${st(4)}/><circle cx="268" cy="292" r="3" fill="${INK}"/>`;
}

// ─── Games & learning ─────────────────────────────────────

export function board([c1, , c3]) {
  const home = (x, y, c) => `<rect x="${x}" y="${y}" width="74" height="74" rx="8" fill="${c}" ${st(4)}/><circle cx="${x + 37}" cy="${y + 37}" r="20" fill="${CREAM}" ${st(3)}/>`;
  return `<g transform="rotate(-8 200 210)">
      <rect x="78" y="90" width="244" height="244" rx="16" fill="${c1}" ${st()}/>
      <rect x="96" y="108" width="208" height="208" rx="8" fill="${CREAM}" ${st(4)}/>
      ${home(100, 112, BRICK.red)}${home(226, 112, BRICK.green)}${home(100, 238, BRICK.blue)}${home(226, 238, BRICK.yellow)}
      <path d="M174 186 L226 186 L226 238 L174 238Z" fill="${CREAM}" ${st(4)}/>
      <path d="M174 186 L200 212 L226 186Z" fill="${BRICK.green}" ${st(3)}/><path d="M226 186 L200 212 L226 238Z" fill="${BRICK.yellow}" ${st(3)}/>
      <path d="M226 238 L200 212 L174 238Z" fill="${BRICK.blue}" ${st(3)}/><path d="M174 238 L200 212 L174 186Z" fill="${BRICK.red}" ${st(3)}/>
    </g>
    <g transform="rotate(14 318 290)">${die(284, 256, 66, 5)}</g>
    <g transform="rotate(-10 92 300)">${die(64, 276, 52, 3)}</g>
    <path d="M330 120 Q330 92 348 92 Q366 92 366 120 L374 160 L322 160Z" fill="${c3}" ${st(5)}/><circle cx="348" cy="86" r="14" fill="${c3}" ${st(5)}/>`;
}

export function top([c1, c2, c3]) {
  return `<path d="M88 214 Q72 230 88 246 M312 214 Q328 230 312 246" fill="none" ${st(5)}/>
    <path d="M60 200 Q40 230 60 260 M340 200 Q360 230 340 260" fill="none" ${st(4)} opacity=".6"/>
    <path d="M200 334 L118 232 Q116 186 200 180 Q284 186 282 232Z" fill="${c1}" ${st()}/>
    <path d="M126 232 Q200 262 274 232 L262 254 Q200 282 138 254Z" fill="${c2}"/>
    <path d="M150 276 Q200 296 250 276 L238 292 Q200 308 162 292Z" fill="${c3}"/>
    <path d="M200 334 L118 232 Q116 186 200 180 Q284 186 282 232Z" fill="none" ${st()}/>
    <ellipse cx="200" cy="196" rx="70" ry="16" fill="${shade(c1, 0.15)}" ${st(4)}/>
    <rect x="186" y="120" width="28" height="70" rx="9" fill="${c3}" ${st()}/>
    <circle cx="200" cy="116" r="17" fill="${c2}" ${st()}/>
    <path d="M150 212 Q160 206 172 206" stroke="#fff" stroke-width="6" stroke-linecap="round" fill="none" opacity=".7"/>`;
}

export function ball([c1, c2, c3]) {
  const cx = 200, cy = 214, r = 112;
  const cols = [c1, CREAM, c2, CREAM, c3, CREAM];
  const wedges = cols.map((c, i) => {
    const a0 = (Math.PI / 3) * i - Math.PI / 2, a1 = a0 + Math.PI / 3;
    const p = (a) => `${(cx + r * Math.cos(a)).toFixed(1)} ${(cy + r * Math.sin(a)).toFixed(1)}`;
    return `<path d="M${cx} ${cy} L${p(a0)} A${r} ${r} 0 0 1 ${p(a1)}Z" fill="${c}"/>`;
  }).join("");
  return `${wedges}<circle cx="${cx}" cy="${cy}" r="${r}" fill="none" ${st()}/>
    <circle cx="${cx}" cy="${cy}" r="18" fill="${CREAM}" ${st(4)}/>
    <path d="M128 168 Q140 140 170 126" stroke="#fff" stroke-width="10" stroke-linecap="round" fill="none" opacity=".6"/>`;
}

export function rocket([c1, c2, c3]) {
  return `<g transform="rotate(28 200 200)">
      <path d="M172 268 Q200 368 228 268Z" fill="${c3}" ${st(5)}/><path d="M186 268 Q200 330 214 268Z" fill="${BRICK.yellow}"/>
      <path d="M150 210 L102 286 L160 272Z" fill="${c2}" ${st()}/><path d="M250 210 L298 286 L240 272Z" fill="${c2}" ${st()}/>
      <path d="M200 46 Q276 108 262 262 L138 262 Q124 108 200 46Z" fill="${c1}"/>
      <path d="M200 46 Q236 74 250 116 L150 116 Q164 74 200 46Z" fill="${c2}"/>
      <path d="M200 46 Q276 108 262 262 L138 262 Q124 108 200 46Z" fill="none" ${st()}/>
      <path d="M150 116 L250 116" ${st(5)}/>
      <circle cx="200" cy="170" r="30" fill="${CREAM}" ${st()}/><circle cx="200" cy="170" r="19" fill="${GLASS}" ${st(4)}/>
      <rect x="164" y="258" width="72" height="20" rx="6" fill="#4B4F5C" ${st()}/>
      <path d="M200 210 L200 262" stroke="${c2}" stroke-width="10"/>
      <path d="M160 140 Q162 120 172 104" stroke="#fff" stroke-width="7" stroke-linecap="round" fill="none" opacity=".65"/>
    </g>
    ${star(68, 88, 16, BRICK.yellow)}${star(338, 300, 12, BRICK.orange)}${star(96, 300, 9, BRICK.green, 3)}`;
}

export function stacker([c1]) {
  const rings = [[170, BRICK.red], [146, BRICK.orange], [122, BRICK.yellow], [98, BRICK.green], [76, BRICK.blue]];
  return `<rect x="188" y="110" width="24" height="200" rx="6" fill="#E8C9A0" ${st()}/>
    ${rings.map(([w, c], i) => `<rect x="${200 - w / 2}" y="${270 - i * 36}" width="${w}" height="38" rx="19" fill="${c}" ${st()}/><path d="M${214 - w / 2} ${280 - i * 36} Q${224 - w / 2} ${276 - i * 36} ${236 - w / 2} ${276 - i * 36}" stroke="#fff" stroke-width="5" stroke-linecap="round" fill="none" opacity=".6"/>`).join("")}
    <rect x="106" y="304" width="188" height="28" rx="14" fill="${c1}" ${st()}/>
    <circle cx="200" cy="108" r="24" fill="${c1}" ${st()}/>`;
}

function puzzlePiece(x, y, s, fill, knobs) {
  const k = s * 0.2;
  const shapes = `<rect x="${x}" y="${y}" width="${s}" height="${s}" rx="10"/>` +
    (knobs.includes("r") ? `<circle cx="${x + s + k * 0.6}" cy="${y + s / 2}" r="${k}"/>` : "") +
    (knobs.includes("b") ? `<circle cx="${x + s / 2}" cy="${y + s + k * 0.6}" r="${k}"/>` : "");
  return merged(shapes, fill, 4);
}

export function puzzle([c1, c2, c3]) {
  return `${puzzlePiece(206, 96, 100, c2, "b")}
    ${puzzlePiece(100, 96, 100, c1, "rb")}
    ${puzzlePiece(100, 202, 100, c3, "r")}
    <g transform="rotate(18 268 262)">${puzzlePiece(222, 214, 100, BRICK.blue === c1 ? BRICK.red : BRICK.blue, "")}</g>
    <path d="M118 120 Q126 110 140 108" stroke="#fff" stroke-width="7" stroke-linecap="round" fill="none" opacity=".6"/>`;
}

export function cube() {
  const s = 44, dx = 0.866 * s, dy = 0.5 * s;
  const A = [200, 66];
  const pal = [BRICK.red, BRICK.blue, BRICK.yellow, BRICK.green, BRICK.orange, CREAM];
  let seed = 7;
  const pick = () => pal[(seed = (seed * 31 + 11) % 97) % pal.length];
  const quad = (p, a, b) => `<polygon points="${[p, [p[0] + a[0], p[1] + a[1]], [p[0] + a[0] + b[0], p[1] + a[1] + b[1]], [p[0] + b[0], p[1] + b[1]]].map((q) => q.map((v) => v.toFixed(1)).join(",")).join(" ")}"`;
  const face = (origin, a, b, darken) => {
    let out = "";
    for (let i = 0; i < 3; i++) for (let j = 0; j < 3; j++) {
      const p = [origin[0] + i * a[0] + j * b[0], origin[1] + i * a[1] + j * b[1]];
      out += `${quad(p, a, b)} fill="${shade(pick(), darken)}" ${st(5)}/>`;
    }
    return out;
  };
  const r = [dx, dy], l = [-dx, dy], d = [0, s], u = [dx, -dy];
  const L = [A[0] + 3 * l[0], A[1] + 3 * l[1]];
  const F = [A[0] + 3 * r[0] + 3 * l[0], A[1] + 3 * r[1] + 3 * l[1]];
  return face(A, r, l, 0) + face(L, r, d, 0.12) + face(F, u, d, 0.24);
}

export function abacus([c1]) {
  const rows = [BRICK.red, BRICK.orange, BRICK.yellow, BRICK.green, BRICK.blue];
  const leg = (x1, x2) => `<line x1="${x1}" y1="84" x2="${x2}" y2="334" stroke="${INK}" stroke-width="22" stroke-linecap="round"/><line x1="${x1}" y1="84" x2="${x2}" y2="334" stroke="${c1}" stroke-width="12" stroke-linecap="round"/>`;
  return `${leg(112, 82)}${leg(288, 318)}
    ${rows.map((_, i) => `<line x1="104" y1="${128 + i * 33}" x2="296" y2="${128 + i * 33}" stroke="#9AA0AE" stroke-width="5"/>`).join("")}
    ${rows.map((c, i) => [0, 1, 2, 3, 6, 7].map((k) => `<ellipse cx="${124 + k * 22}" cy="${128 + i * 33}" rx="12" ry="13" fill="${c}" ${st(4)}/>`).join("")).join("")}
    <rect x="94" y="84" width="212" height="24" rx="8" fill="${c1}" ${st()}/>
    <rect x="94" y="290" width="212" height="24" rx="8" fill="${c1}" ${st()}/>`;
}

function block(x, y, s, c, symbol) {
  const d = s * 0.22;
  const sym = {
    star: star(x + s / 2, y + s / 2, s * 0.3, CREAM, 4),
    heart: `<path d="M${x + s / 2} ${y + s * 0.78} C${x + s * 0.1} ${y + s * 0.5} ${x + s * 0.24} ${y + s * 0.16} ${x + s / 2} ${y + s * 0.36} C${x + s * 0.76} ${y + s * 0.16} ${x + s * 0.9} ${y + s * 0.5} ${x + s / 2} ${y + s * 0.78}Z" fill="${CREAM}" ${st(4)}/>`,
    circle: `<circle cx="${x + s / 2}" cy="${y + s / 2}" r="${s * 0.26}" fill="${CREAM}" ${st(4)}/>`,
    tri: `<path d="M${x + s / 2} ${y + s * 0.2} L${x + s * 0.8} ${y + s * 0.76} L${x + s * 0.2} ${y + s * 0.76}Z" fill="${CREAM}" ${st(4)}/>`,
  }[symbol];
  return `<path d="M${x} ${y} L${x + d} ${y - d} L${x + s + d} ${y - d} L${x + s} ${y}Z" fill="${tint(c, 0.3)}" ${st()}/>
    <path d="M${x + s} ${y} L${x + s + d} ${y - d} L${x + s + d} ${y + s - d} L${x + s} ${y + s}Z" fill="${shade(c, 0.22)}" ${st()}/>
    <rect x="${x}" y="${y}" width="${s}" height="${s}" fill="${c}" ${st()}/>${sym}`;
}

export function blocks([c1, c2, c3]) {
  return block(70, 214, 116, c1, "star") + block(196, 214, 116, c2, "heart") + block(134, 92, 116, c3, "circle");
}

// ─── Music ────────────────────────────────────────────────

export function xylophone([, c2, c3]) {
  const bars = [BRICK.red, BRICK.orange, BRICK.yellow, BRICK.green, "#22B3A6", BRICK.blue, "#3F51B5", "#F06EA9"];
  return `<path d="M64 172 L336 206" stroke="${INK}" stroke-width="24" stroke-linecap="round"/><path d="M64 172 L336 206" stroke="${c2}" stroke-width="14" stroke-linecap="round"/>
    <path d="M64 300 L336 262" stroke="${INK}" stroke-width="24" stroke-linecap="round"/><path d="M64 300 L336 262" stroke="${c2}" stroke-width="14" stroke-linecap="round"/>
    ${bars.map((c, i) => {
      const x = 80 + i * 31, t = 150 + i * 7, b = 318 - i * 7;
      return `<rect x="${x}" y="${t}" width="25" height="${b - t}" rx="7" fill="${c}" ${st(5)}/><circle cx="${x + 12.5}" cy="${t + 22}" r="3.5" fill="${CREAM}"/><circle cx="${x + 12.5}" cy="${b - 22}" r="3.5" fill="${CREAM}"/>`;
    }).join("")}
    <line x1="250" y1="120" x2="350" y2="60" ${st(10)}/><line x1="250" y1="120" x2="350" y2="60" stroke="${c2}" stroke-width="4"/>
    <circle cx="246" cy="122" r="17" fill="${c3}" ${st(5)}/>
    <line x1="296" y1="132" x2="376" y2="104" ${st(10)}/><line x1="296" y1="132" x2="376" y2="104" stroke="${c2}" stroke-width="4"/>
    <circle cx="292" cy="134" r="17" fill="${c3}" ${st(5)}/>`;
}

export function guitar([c1, c2, c3]) {
  const body = `<circle cx="200" cy="268" r="74"/><circle cx="200" cy="176" r="56"/><rect x="160" y="170" width="80" height="80"/>`;
  return `<g transform="rotate(-32 200 210)">
      <rect x="188" y="34" width="24" height="150" fill="${c2}" ${st()}/>
      ${merged(body, c1)}
      <circle cx="200" cy="228" r="26" fill="${c3}" ${st(4)}/><circle cx="200" cy="228" r="16" fill="${INK}"/>
      <rect x="172" y="284" width="56" height="14" rx="4" fill="${c2}" ${st(4)}/>
      <rect x="180" y="8" width="40" height="40" rx="9" fill="${c2}" ${st()}/>
      <circle cx="174" cy="20" r="5" fill="${CREAM}" ${st(3)}/><circle cx="174" cy="38" r="5" fill="${CREAM}" ${st(3)}/>
      <circle cx="226" cy="20" r="5" fill="${CREAM}" ${st(3)}/><circle cx="226" cy="38" r="5" fill="${CREAM}" ${st(3)}/>
      ${[193, 198, 202, 207].map((x) => `<line x1="${x}" y1="40" x2="${x}" y2="290" stroke="#F3E7D3" stroke-width="2"/>`).join("")}
      <path d="M148 196 Q150 176 166 162" stroke="#fff" stroke-width="7" stroke-linecap="round" fill="none" opacity=".55"/>
    </g>`;
}

export function drum([c1, c2, c3]) {
  const zig = Array.from({ length: 8 }, (_, i) => `${100 + i * 28},${i % 2 ? 288 : 206}`).join(" ");
  return `<ellipse cx="200" cy="300" rx="106" ry="32" fill="${shade(c1, 0.15)}" ${st()}/>
    <rect x="94" y="190" width="212" height="110" fill="${c1}"/>
    <path d="M94 190 L94 300 M306 190 L306 300" ${st()}/>
    <polyline points="${zig}" fill="none" stroke="${c3}" stroke-width="7" stroke-linejoin="round"/>
    <path d="M94 296 Q200 344 306 296" fill="none" stroke="${c2}" stroke-width="16"/>
    <path d="M94 296 Q200 344 306 296" fill="none" ${st()}/>
    <ellipse cx="200" cy="190" rx="110" ry="34" fill="${c2}" ${st()}/>
    <ellipse cx="200" cy="186" rx="96" ry="26" fill="${CREAM}" ${st(4)}/>
    <line x1="120" y1="70" x2="196" y2="168" stroke="${INK}" stroke-width="12" stroke-linecap="round"/><line x1="120" y1="70" x2="196" y2="168" stroke="#E8C9A0" stroke-width="6" stroke-linecap="round"/>
    <circle cx="116" cy="64" r="13" fill="${c3}" ${st(5)}/>
    <line x1="292" y1="76" x2="220" y2="166" stroke="${INK}" stroke-width="12" stroke-linecap="round"/><line x1="292" y1="76" x2="220" y2="166" stroke="#E8C9A0" stroke-width="6" stroke-linecap="round"/>
    <circle cx="296" cy="70" r="13" fill="${c3}" ${st(5)}/>`;
}

export function keyboard([c1, c2, c3]) {
  const whites = Array.from({ length: 13 }, (_, i) => `<line x1="${80 + i * 20}" y1="222" x2="${80 + i * 20}" y2="286" ${st(3)}/>`).join("");
  const blackIdx = [0, 1, 3, 4, 5, 7, 8, 10, 11, 12];
  const blacks = blackIdx.map((i) => `<rect x="${73 + i * 20}" y="222" width="13" height="38" rx="3" fill="#2F2A33"/>`).join("");
  return `<rect x="36" y="150" width="328" height="150" rx="20" fill="${c1}" ${st()}/>
    <rect x="58" y="166" width="120" height="40" rx="8" fill="#2F2A33"/>
    ${[0, 1, 2, 3, 4].map((i) => `<line x1="${70 + i * 22}" y1="176" x2="${70 + i * 22}" y2="196" stroke="#5B5866" stroke-width="5" stroke-linecap="round"/>`).join("")}
    <circle cx="214" cy="186" r="12" fill="${c2}" ${st(4)}/><circle cx="248" cy="186" r="12" fill="${c3}" ${st(4)}/><circle cx="282" cy="186" r="12" fill="${BRICK.green}" ${st(4)}/>
    <rect x="306" y="174" width="40" height="24" rx="6" fill="${GLASS}" ${st(4)}/>
    <rect x="60" y="220" width="280" height="68" rx="6" fill="${CREAM}" ${st(4)}/>
    ${whites}${blacks}
    <rect x="60" y="220" width="280" height="68" rx="6" fill="none" ${st(4)}/>`;
}

// ─── Blasters ─────────────────────────────────────────────

export function blaster([c1, c2, c3]) {
  return `<path d="M120 228 L100 318 Q98 332 112 332 L150 332 Q162 332 164 320 L180 228Z" fill="${c1}" ${st()}/>
    <path d="M176 230 Q170 278 206 278 L220 230" fill="none" ${st(6)}/>
    <rect x="196" y="230" width="14" height="30" rx="6" fill="${c2}" ${st(4)}/>
    <rect x="234" y="222" width="96" height="34" rx="14" fill="${c2}" ${st()}/>
    <rect x="128" y="104" width="104" height="64" rx="28" fill="${c3}" fill-opacity=".85" ${st()}/>
    <path d="M136 146 Q182 132 224 146 L224 150 Q224 160 210 160 L148 160 Q136 160 136 150Z" fill="${shade(c3, 0.25)}"/>
    <rect x="166" y="94" width="28" height="16" rx="5" fill="${c2}" ${st(4)}/>
    <path d="M72 172 L302 172 Q334 172 334 202 L334 214 Q334 232 314 232 L72 232 Q54 232 54 212 L54 192 Q54 172 72 172Z" fill="${c1}" ${st()}/>
    <path d="M82 186 L170 186" stroke="#fff" stroke-width="7" stroke-linecap="round" opacity=".55"/>
    <rect x="330" y="186" width="34" height="30" rx="8" fill="${c2}" ${st()}/>
    <path d="M372 194 Q384 200 372 208 M386 186 Q404 200 386 214" fill="none" stroke="#7CC8FF" stroke-width="6" stroke-linecap="round"/>
    <circle cx="396" cy="232" r="6" fill="#7CC8FF"/>`;
}

export function dart([c1, c2, c3]) {
  return `<path d="M96 222 L76 318 Q74 332 88 332 L128 332 Q140 332 142 320 L160 222Z" fill="${c1}" ${st()}/>
    <path d="M154 226 Q150 274 186 274 L198 226" fill="none" ${st(6)}/>
    <rect x="174" y="226" width="14" height="28" rx="6" fill="${c2}" ${st(4)}/>
    <rect x="186" y="150" width="174" height="44" rx="12" fill="${c1}" ${st()}/>
    <rect x="352" y="156" width="22" height="32" rx="6" fill="${c2}" ${st()}/>
    <rect x="50" y="138" width="190" height="94" rx="24" fill="${c1}" ${st()}/>
    <rect x="186" y="132" width="110" height="18" rx="6" fill="${c2}" ${st(5)}/>
    <circle cx="232" cy="212" r="40" fill="${c2}" ${st()}/>
    ${[0, 1, 2, 3, 4, 5].map((i) => { const a = (Math.PI / 3) * i; return `<circle cx="${(232 + 24 * Math.cos(a)).toFixed(1)}" cy="${(212 + 24 * Math.sin(a)).toFixed(1)}" r="7" fill="${shade(c2, 0.3)}"/>`; }).join("")}
    <path d="M68 160 L150 160" stroke="#fff" stroke-width="7" stroke-linecap="round" opacity=".55"/>
    <rect x="252" y="290" width="94" height="18" rx="9" fill="${c3}" ${st(5)}/><path d="M346 290 Q370 299 346 308Z" fill="${c2}" ${st(4)}/>
    <rect x="262" y="318" width="94" height="18" rx="9" fill="${c3}" ${st(5)}/><path d="M356 318 Q380 327 356 336Z" fill="${c2}" ${st(4)}/>`;
}

// ─── Gifts ────────────────────────────────────────────────

export function gift([c1, c2, c3]) {
  return `<rect x="96" y="176" width="208" height="152" rx="10" fill="${c1}"/>
    ${[[126, 206], [270, 214], [134, 296], [264, 296], [132, 254], [272, 258]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="9" fill="${c3}"/>`).join("")}
    <rect x="184" y="176" width="32" height="152" fill="${c2}"/>
    <rect x="96" y="176" width="208" height="152" rx="10" fill="none" ${st()}/>
    <path d="M184 176 L184 328 M216 176 L216 328" ${st(4)}/>
    <path d="M200 138 C150 72 104 108 154 140Z" fill="${c2}" ${st()}/>
    <path d="M200 138 C250 72 296 108 246 140Z" fill="${c2}" ${st()}/>
    <rect x="80" y="134" width="240" height="48" rx="10" fill="${shade(c1, 0.08)}" ${st()}/>
    <rect x="184" y="134" width="32" height="48" fill="${c2}" ${st(4)}/>
    <circle cx="200" cy="134" r="16" fill="${c2}" ${st()}/>
    <path d="M110 150 L150 150" stroke="#fff" stroke-width="6" stroke-linecap="round" opacity=".6"/>`;
}

export function balloons([c1, c2, c3]) {
  const balloon = (cx, cy, c, sx) => `<path d="M${cx} ${cy + 60} Q${cx + 10} ${cy + 130} ${sx} 300" fill="none" ${st(3)}/>
    <ellipse cx="${cx}" cy="${cy}" rx="50" ry="60" fill="${c}" ${st()}/>
    <path d="M${cx - 8} ${cy + 66} L${cx + 8} ${cy + 66} L${cx} ${cy + 56}Z" fill="${c}" ${st(4)}/>
    <ellipse cx="${cx - 18}" cy="${cy - 22}" rx="10" ry="16" fill="#fff" opacity=".55"/>`;
  return `${balloon(130, 112, c1, 196)}${balloon(270, 104, c2, 204)}${balloon(200, 154, c3, 200)}
    <g transform="translate(140 270) scale(0.3)">${gift([BRICK.yellow, BRICK.red, BRICK.blue])}</g>
    ${star(60, 220, 12, BRICK.yellow)}${star(345, 228, 10, BRICK.green, 3)}`;
}

export function carton(x, y, w, h, c = "#D9A066") {
  const d = w * 0.22;
  return `<path d="M${x} ${y} L${x + d} ${y - d * 0.7} L${x + w + d} ${y - d * 0.7} L${x + w} ${y}Z" fill="${tint(c, 0.25)}" ${st()}/>
    <path d="M${x + w} ${y} L${x + w + d} ${y - d * 0.7} L${x + w + d} ${y + h - d * 0.7} L${x + w} ${y + h}Z" fill="${shade(c, 0.18)}" ${st()}/>
    <rect x="${x}" y="${y}" width="${w}" height="${h}" fill="${c}" ${st()}/>
    <rect x="${x + w / 2 - 12}" y="${y}" width="24" height="${h * 0.4}" fill="${tint(c, 0.45)}" ${st(4)}/>
    <circle cx="${x + w * 0.3}" cy="${y + h * 0.62}" r="${Math.min(w, h) * 0.16}" fill="${CREAM}" ${st(4)}/>
    <circle cx="${x + w * 0.3}" cy="${y + h * 0.62}" r="${Math.min(w, h) * 0.08}" fill="${BRICK.red}"/>`;
}

export const TOYS = {
  car, rcCar, truck, train, plane, teddy, bunny, dino, doll, dollhouse, robot, hero,
  board, top, ball, rocket, stacker, puzzle, cube, abacus, blocks, xylophone, guitar, drum, keyboard,
  blaster, dart, gift, balloons,
};
