/**
 * msdfgen-ts + PixiJS v8: BitmapText rendered with Pixi's own MSDF path, fed
 * from our atlas. Drag to pan, wheel to zoom about the cursor (up to 4000x).
 * The adapter lives in ./msdfBitmapFont.ts.
 */
import { Application, Container } from "pixi.js";
import { Font } from "../../src/index";
import { MSDFBitmapFont } from "./msdfBitmapFont";

const FONT_URL = `${import.meta.env.BASE_URL}test/fonts/PTSerif-Regular.ttf`;
const PAPER = 0xf4ecdb;
const AMBER = 0xe9b872;
const MIN_ZOOM = 0.02;
const MAX_ZOOM = 4000;

const app = new Application();
await app.init({
  background: 0x0f1117,
  resizeTo: window,
  antialias: true,
  resolution: window.devicePixelRatio || 1,
  autoDensity: true,
});
document.body.prepend(app.canvas);

const msdf = new MSDFBitmapFont("ptserif", new Font(await (await fetch(FONT_URL)).arrayBuffer()), {
  pixelsPerEm: 48,
  pxrange: 4,
});

const world = new Container();
world.position.set(60, 60);
app.stage.addChild(world);

// One row per size, from body text to a glyph far larger than the 48 px/em atlas.
const rows: [string, number][] = [
  ["Hello Привет 123 @#&", 24],
  ["Crisp at any size, from 24 px upward.", 48],
  ["Every scale from one atlas", 96],
  ["M k 4 & %", 280],
];
let y = 0;
for (const [text, size] of rows) {
  const node = msdf.createText(text, size);
  node.tint = PAPER;
  node.position.set(0, y);
  world.addChild(node);
  y += size * 1.35;
}

// Typing adds glyphs, which rebuilds the Pixi font. Existing rows keep rendering.
const typed = msdf.createText("Type new glyphs: ƒ ő Ж", 96);
typed.tint = AMBER;
typed.position.set(0, y);
world.addChild(typed);

const input = document.querySelector<HTMLInputElement>("#input")!;
input.addEventListener("input", () => msdf.setText(typed, input.value));
msdf.setText(typed, input.value);

const readout = document.querySelector<HTMLElement>("#zoom")!;
app.ticker.add(() => {
  readout.textContent = `zoom ${world.scale.x.toFixed(world.scale.x < 10 ? 2 : 0)}×`;
});

// Wheel zooms about the cursor. The pivot stays under the pointer.
app.canvas.addEventListener(
  "wheel",
  (e) => {
    e.preventDefault();
    const next = Math.min(
      MAX_ZOOM,
      Math.max(MIN_ZOOM, world.scale.x * Math.exp(-e.deltaY * 0.0015)),
    );
    const f = next / world.scale.x;
    world.position.set(
      e.clientX - (e.clientX - world.x) * f,
      e.clientY - (e.clientY - world.y) * f,
    );
    world.scale.set(next);
  },
  { passive: false },
);

let drag: { x: number; y: number } | null = null;
app.canvas.addEventListener("pointerdown", (e) => {
  drag = { x: e.clientX, y: e.clientY };
});
window.addEventListener("pointermove", (e) => {
  if (!drag) return;
  world.x += e.clientX - drag.x;
  world.y += e.clientY - drag.y;
  drag = { x: e.clientX, y: e.clientY };
});
window.addEventListener("pointerup", () => {
  drag = null;
});
