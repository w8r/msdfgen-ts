/**
 * 10,000 instances of one SVG, bouncing off the edges, pulsing and spinning.
 * All motion runs in the vertex shader from `uTime` (see PLACE below): the
 * instance buffer is uploaded once, and each frame is a single draw call.
 * Drag to pan (with momentum), wheel / pinch / double-click to zoom at the
 * cursor, arrows or WASD to slide, 0 to reset, space (or the button) to pause.
 */
import { SvgRenderer } from "../svg/renderer";
import { SAMPLES } from "../svg/samples";

const COUNT = Number(new URLSearchParams(location.search).get("n")) || 10_000; // ?n=100000

// a: start position (0..1 of the free room), velocity (viewports per second)
// b: base size (device px), phase (radians), spin (radians per second)
const PLACE = `vec4 place(vec4 a, vec4 b) {
  float size = b.x * (1.0 + 0.5 * sin(uTime * 1.7 + b.y));
  vec2 box = vec2(svgWidth, 1.0) * size;
  vec2 room = max(uViewport - box, 1.0);
  vec2 p = a.xy * room + a.zw * uViewport * uTime;
  p = room - abs(mod(p, 2.0 * room) - room); // triangle wave = bouncing between 0 and room
  return vec4(p + box * 0.5, size, b.y + b.z * uTime);
}`;

const canvas = document.querySelector("canvas")!;
const status = document.querySelector("#status")!;
const pause = document.querySelector<HTMLButtonElement>("#pause")!;
const picker = document.querySelector<HTMLSelectElement>("#sample")!;
const file = document.querySelector<HTMLInputElement>("#file")!;
const resolution = document.querySelector<HTMLSelectElement>("#res")!; // MSDF texels per viewBox height
const atlas = document.querySelector<HTMLCanvasElement>("#atlas")!;
const gl = canvas.getContext("webgl2")!;
const renderer = new SvgRenderer(gl, PLACE);

// Random instances, smallest first so bigger icons draw on top.
const dpr = window.devicePixelRatio || 1;
const sizes = Array.from({ length: COUNT }, () => (10 + 50 * Math.random() ** 3) * dpr).sort(
  (a, b) => a - b,
);
const r = (): number => Math.random() - 0.5;
const instances = new Float32Array(
  sizes.flatMap((size) => [
    Math.random(),
    Math.random(),
    0.3 * r(),
    0.3 * r(),
    size,
    Math.random() * 2 * Math.PI,
    2 * r(),
    0,
  ]),
);

let current: string[] = [];
// Icon i shows SVG i % svgs.length, all in one atlas and one draw call.
function load(svgs: string[]): void {
  try {
    renderer.load((current = svgs), Number(resolution.value));
    renderer.showMsdf(atlas);
    atlas.style.width = `${atlas.width / dpr}px`; // one texel per device pixel
  } catch (e) {
    status.textContent = String(e);
  }
}

for (const name of Object.keys(SAMPLES)) picker.add(new Option(name));
picker.add(new Option("all samples"));
const pick = (): string[] =>
  SAMPLES[picker.value] ? [SAMPLES[picker.value]!] : Object.values(SAMPLES);
picker.onchange = () => load(pick());
resolution.onchange = () => load(current);
file.onchange = async () => {
  const texts = await Promise.all([...(file.files ?? [])].map((f) => f.text()));
  if (texts.length) load(texts);
};
picker.value = "all samples";
load(pick());

// ── Camera: pan + zoom around the viewport centre, device px, y-up (see uCamera).
// Zoom eases toward `target` around an anchor point; panning keeps a decaying velocity.
const cam = { x: 0, y: 0, zoom: 1, target: 1, vx: 0, vy: 0, ax: 0, ay: 0 };
let drag: { x: number; y: number } | null = null;
const zoomAt = (e: MouseEvent, factor: number): void => {
  cam.ax = (e.offsetX - canvas.clientWidth / 2) * dpr; // anchor, from the centre
  cam.ay = (canvas.clientHeight / 2 - e.offsetY) * dpr;
  cam.target = Math.min(Math.max(cam.target * factor, 0.1), 1000);
};
canvas.onpointerdown = (e) => {
  drag = { x: e.clientX, y: e.clientY };
  canvas.setPointerCapture(e.pointerId);
  canvas.style.cursor = "grabbing";
};
canvas.onpointermove = (e) => {
  if (!drag) return;
  const dx = ((drag.x - e.clientX) * dpr) / cam.zoom; // world px, the view follows the pointer
  const dy = ((e.clientY - drag.y) * dpr) / cam.zoom;
  [cam.x, cam.y, drag.x, drag.y] = [cam.x + dx, cam.y + dy, e.clientX, e.clientY];
  [cam.vx, cam.vy] = [0.5 * cam.vx + 0.5 * dx, 0.5 * cam.vy + 0.5 * dy]; // smoothed, for momentum
};
canvas.onpointerup = () => {
  drag = null;
  canvas.style.cursor = "";
};
canvas.onwheel = (e) => {
  e.preventDefault(); // also stops the page from pinch-zooming
  zoomAt(e, 2 ** (-(e.deltaY * (e.deltaMode === 1 ? 33 : 1)) / 100)); // one notch = 2×
};
canvas.ondblclick = (e) => zoomAt(e, 4);
const KEYS: Record<string, number[] | undefined> = {
  ArrowLeft: [-1, 0],
  KeyA: [-1, 0],
  ArrowRight: [1, 0],
  KeyD: [1, 0],
  ArrowUp: [0, 1],
  KeyW: [0, 1],
  ArrowDown: [0, -1],
  KeyS: [0, -1],
};
// Pause freezes the animation clock only: pan and zoom keep working on the frozen frame.
let paused = false;
const togglePause = (): void => {
  paused = !paused;
  pause.textContent = paused ? "Play" : "Pause";
};
pause.onclick = () => {
  togglePause();
  pause.blur(); // give the keyboard shortcuts back to the page
};
window.onkeydown = (e) => {
  if (e.target !== document.body) return; // leave the sample picker its arrow keys
  if (e.code === "Space") {
    e.preventDefault(); // no page scroll
    togglePause();
  }
  const [kx = 0, ky = 0] = KEYS[e.code] ?? [];
  if (kx || ky) [cam.vx, cam.vy] = [(kx * 20 * dpr) / cam.zoom, (ky * 20 * dpr) / cam.zoom];
  if (e.key === "0") Object.assign(cam, { x: 0, y: 0, target: 1, vx: 0, vy: 0, ax: 0, ay: 0 });
};

/** Advances momentum and eased zoom by `dt` seconds. */
function updateCamera(dt: number): void {
  const decay = 0.9 ** (dt * 60); // per-frame 0.9 at 60 fps; also bleeds off while holding still
  if (!drag) [cam.x, cam.y] = [cam.x + cam.vx * dt * 60, cam.y + cam.vy * dt * 60];
  [cam.vx, cam.vy] = [cam.vx * decay, cam.vy * decay];
  // Ease zoom in log space, keeping the world point under the anchor fixed.
  const eased = cam.zoom * (cam.target / cam.zoom) ** (1 - Math.exp(-12 * dt));
  const zoom = Math.abs(eased / cam.target - 1) < 1e-4 ? cam.target : eased; // land exactly
  cam.x += cam.ax * (1 / cam.zoom - 1 / zoom);
  cam.y += cam.ay * (1 / cam.zoom - 1 / zoom);
  cam.zoom = zoom;
}

let frames = 0;
let lastFps = performance.now();
let lastFrame = lastFps;
let time = 0; // animation clock (s), stopped while paused
function frame(now: number): void {
  const dt = Math.min((now - lastFrame) / 1000, 0.1);
  lastFrame = now;
  updateCamera(dt);
  if (!paused) time += dt;
  canvas.width = Math.round(canvas.clientWidth * dpr);
  canvas.height = Math.round(canvas.clientHeight * dpr);
  gl.viewport(0, 0, canvas.width, canvas.height);
  gl.clearColor(0.06, 0.07, 0.09, 1);
  gl.clear(gl.COLOR_BUFFER_BIT);
  renderer.draw(instances, time, [cam.x, cam.y, cam.zoom]);

  frames++;
  if (now - lastFps > 500) {
    const fps = (frames * 1000) / (now - lastFps);
    status.textContent = `${COUNT.toLocaleString()} icons of ${renderer.widths.length} SVG(s), ${renderer.layers} paths, 1 draw call · ${fps.toFixed(0)} fps · zoom ${cam.zoom.toFixed(1)}×`;
    [frames, lastFps] = [0, now];
  }
  requestAnimationFrame(frame);
}
requestAnimationFrame(frame);
document.getElementById("root")!.dataset.ready = "";
