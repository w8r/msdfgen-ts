/**
 * SVG → MSDF demo: parse an SVG into one MSDF cell per path, then draw it
 * with its real colours and gradients at every size with WebGL2 (see
 * renderer.ts). Edit the source, pick a sample, or import your own file.
 */
import { SvgRenderer } from "./renderer";

const SIZES = [16, 32, 64, 128, 256]; // CSS px tall
const GAP = 24;

const SAMPLES: Record<string, string> = {
  heart: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
  <linearGradient id="g" x2="0" y2="1"><stop offset="0" stop-color="#ff7aa2"/><stop offset="1" stop-color="#c8102e"/></linearGradient>
  <path fill="url(#g)" d="M12 21C12 21 2 14.5 2 8.5A5 5 0 0 1 12 6A5 5 0 0 1 22 8.5C22 14.5 12 21 12 21Z"/>
</svg>`,
  sunset: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
  <linearGradient id="sky" x2="0" y2="1"><stop offset="0" stop-color="#2b1055"/><stop offset=".6" stop-color="#d53369"/><stop offset="1" stop-color="#ffcf6b"/></linearGradient>
  <radialGradient id="sun"><stop offset=".5" stop-color="#fff6c2"/><stop offset="1" stop-color="#ffb347"/></radialGradient>
  <path fill="url(#sky)" d="M4 2h16a2 2 0 0 1 2 2v16a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2z"/>
  <path fill="url(#sun)" d="M7 13a5 5 0 1 1 10 0a5 5 0 1 1-10 0z"/>
  <path fill="#5b2a86" opacity=".85" d="M2 16Q7 11 12 15T22 14V20a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2z"/>
  <path fill="#1d0b3a" d="M2 19Q9 15 14 18T22 17V20a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2z"/>
</svg>`,
  play: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
  <radialGradient id="p" cx=".35" cy=".3" r=".8"><stop offset="0" stop-color="#7fd4ff"/><stop offset="1" stop-color="#0b4f9c"/></radialGradient>
  <path fill="url(#p)" fill-rule="evenodd" d="M12 2a10 10 0 1 0 0 20a10 10 0 1 0 0-20zM10 8v8l6-4z"/>
</svg>`,
  wave: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
  <path fill="teal" d="M2 12Q7 2 12 12T22 12V22H2Z"/>
  <path style="fill:#ff8c00;fill-opacity:.8" d="M4 4h4c2 0 3 1 3 2s-1 2-3 2h-4z"/>
</svg>`,
};

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

  // 1. SVG -> one MSDF cell per path, packed into one atlas.
  const t0 = performance.now();
  const atlas = renderer.load(svg, Number(resolution.value));
  status.textContent = `${atlas.width}×${atlas.height} px atlas in ${(performance.now() - t0).toFixed(0)} ms`;

  // 2. Show the raw MSDF texture itself.
  preview.width = atlas.width;
  preview.height = atlas.height;
  if (atlas.width > 0) {
    const pixels = new ImageData(new Uint8ClampedArray(atlas.texture), atlas.width, atlas.height);
    preview.getContext("2d")!.putImageData(pixels, 0, 0);
  }

  // 3. Draw at every size, bottom-aligned on a row (device px, y-up).
  const dpr = window.devicePixelRatio || 1;
  canvas.style.width = `${SIZES.reduce((a, s) => a + s * renderer.width + GAP, GAP)}px`;
  canvas.style.height = `${Math.max(...SIZES) + 2 * GAP}px`;
  canvas.width = Math.round(canvas.clientWidth * dpr);
  canvas.height = Math.round(canvas.clientHeight * dpr);
  gl.viewport(0, 0, canvas.width, canvas.height);
  gl.clearColor(0, 0, 0, 0);
  gl.clear(gl.COLOR_BUFFER_BIT);
  let left = GAP;
  for (const size of SIZES) {
    renderer.draw(left * dpr, GAP * dpr, size * dpr);
    left += size * renderer.width + GAP;
  }
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
