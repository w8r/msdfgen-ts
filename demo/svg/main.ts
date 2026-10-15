/**
 * SVG → MSDF demo: parse an SVG into one MSDF cell per path, then draw it
 * with its real colours and gradients at every size with WebGL2 (see
 * renderer.ts). Edit the source, pick a sample, or import your own file.
 */
import { SvgRenderer } from "./renderer";
import { SAMPLES } from "./samples";

const SIZES = [16, 32, 64, 128, 256]; // CSS px tall
const GAP = 24;

const root = document.getElementById("root")!;
const source = document.querySelector("textarea")!;
const canvas = document.querySelector<HTMLCanvasElement>("#gl")!;
const preview = document.querySelector<HTMLCanvasElement>("#msdf")!;
const native = document.querySelector("img")!;
const status = document.querySelector("#status")!;
const resolution = document.querySelector<HTMLSelectElement>("#res")!;
const file = document.querySelector<HTMLInputElement>("#file")!;

const gl = canvas.getContext("webgl2")!;
const renderer = new SvgRenderer(gl);

function render(svg: string): void {
  native.src = `data:image/svg+xml,${encodeURIComponent(svg)}`;

  // 1. SVG -> one float MSDF cell per path, packed into one texture.
  const t0 = performance.now();
  renderer.load([svg], Number(resolution.value));
  const { width: w, height: h } = renderer.msdf;
  status.textContent = `${w}×${h} px float MSDF in ${(performance.now() - t0).toFixed(0)} ms`;

  // 2. Show the raw MSDF texture itself.
  renderer.showMsdf(preview);

  // 3. Draw at every size, bottom-aligned on a row (device px, y-up).
  const dpr = window.devicePixelRatio || 1;
  canvas.style.width = `${SIZES.reduce((a, s) => a + s * renderer.widths[0]! + GAP, GAP)}px`;
  canvas.style.height = `${Math.max(...SIZES) + 2 * GAP}px`;
  canvas.width = Math.round(canvas.clientWidth * dpr);
  canvas.height = Math.round(canvas.clientHeight * dpr);
  gl.viewport(0, 0, canvas.width, canvas.height);
  gl.clearColor(0, 0, 0, 0);
  gl.clear(gl.COLOR_BUFFER_BIT);
  const instances: number[] = []; // per size: centre x, centre y, size, angle (+ 4 unused)
  let left = GAP;
  for (const size of SIZES) {
    const w = size * renderer.widths[0]!;
    instances.push((left + w / 2) * dpr, (GAP + size / 2) * dpr, size * dpr, 0, 0, 0, 0, 0);
    left += w + GAP;
  }
  renderer.draw(new Float32Array(instances));
}

function update(): void {
  try {
    render(source.value);
  } catch (e) {
    status.textContent = String(e);
  }
}

const buttons = document.querySelector("#samples")!;
for (const name of Object.keys(SAMPLES)) {
  const b = buttons.appendChild(document.createElement("button"));
  b.textContent = name;
  b.onclick = () => {
    source.value = SAMPLES[name]!;
    update();
  };
}
file.onchange = async () => {
  source.value = (await file.files?.[0]?.text()) ?? source.value;
  update();
};
source.value = SAMPLES.sunset!;
source.oninput = update;
resolution.onchange = update;
update();
root.dataset.ready = "";
