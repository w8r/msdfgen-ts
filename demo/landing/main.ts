/**
 * Landing page: a live hero where visitors type text, switch fonts and zoom,
 * all rendered by msdfgen-ts. The atlas size chips regenerate the atlas at
 * 32/48/64 px/em so visitors can see the size/quality tradeoff live. 16 and
 * 24 px/em are left out on purpose: at the deep zoom this page invites they
 * show MSDF's low-resolution artifacts (identical in C++ msdfgen), which
 * would misrepresent the library at its recommended sizes.
 */
import { Atlas, Font } from "../../src/index";
import { createRenderer } from "./renderer";

const FONT_DIR = `${import.meta.env.BASE_URL}test/fonts/`;
const FONTS: Record<string, string> = {
  "PT Serif": "PTSerif-Regular.ttf",
  Roboto: "Roboto.ttf",
  "Noto Sans": "NotoSans.ttf",
  Arvo: "Arvo-Regular.ttf",
};
const MIN_PX = 8;
const MAX_PX = 2400;

const $ = <T extends HTMLElement>(sel: string): T => document.querySelector<T>(sel)!;
const hero = $("#hero");
const canvas = $<HTMLCanvasElement>("#hero-canvas");
const input = $<HTMLInputElement>("#hero-text");
const slider = $<HTMLInputElement>("#hero-size");
const autoButton = $<HTMLButtonElement>("#hero-auto");
const readout = $("#hero-readout");
const fontChips = [...document.querySelectorAll<HTMLButtonElement>("[data-font]")];
const sizeChips = [...document.querySelectorAll<HTMLButtonElement>("[data-ppem]")];

// The page headings use the same PT Serif file the hero renders.
new FontFace("PT Serif Local", `url(${FONT_DIR}PTSerif-Regular.ttf)`)
  .load()
  .then((face) => document.fonts.add(face))
  .catch(() => {});

// Copy buttons.
for (const button of document.querySelectorAll<HTMLButtonElement>("[data-copy]")) {
  button.addEventListener("click", () => {
    void navigator.clipboard.writeText(button.dataset.copy!).then(() => {
      button.classList.add("copied");
      setTimeout(() => button.classList.remove("copied"), 1200);
    });
  });
}

/** Slider position in [0, 1] -> CSS pixels per em, on a log scale. */
const sliderToPx = (v: number): number => MIN_PX * (MAX_PX / MIN_PX) ** v;

const fonts = new Map<string, Promise<Font>>();
const atlases = new Map<string, Promise<Atlas>>();
/** One parsed Font per file, one Atlas per (font, atlas size). */
function atlasFor(name: string, pixelsPerEm: number): Promise<Atlas> {
  const key = `${name}@${pixelsPerEm}`;
  let atlas = atlases.get(key);
  if (!atlas) {
    let font = fonts.get(name);
    if (!font) {
      font = fetch(FONT_DIR + FONTS[name]!)
        .then((r) => r.arrayBuffer())
        .then((buffer) => new Font(buffer));
      fonts.set(name, font);
    }
    atlas = font.then((f) => new Atlas(f, { pixelsPerEm, pxrange: 4 }));
    atlases.set(key, atlas);
  }
  return atlas;
}

async function main(): Promise<void> {
  const renderer = await createRenderer(canvas);
  if (!renderer) {
    hero.classList.add("no-gpu");
    return;
  }

  let fontName = "PT Serif";
  let pixelsPerEm = 48;
  let atlasInfo = "";
  let widthEm = 1;
  let auto = true;
  let lastUpdateMs = 0;
  let pending = 0;

  async function update(): Promise<void> {
    const ticket = ++pending;
    const atlas = await atlasFor(fontName, pixelsPerEm);
    if (ticket !== pending) return; // a newer edit or font switch superseded this one
    const t0 = performance.now();
    const { glyphs, widthEm: w } = atlas.layout(input.value || " ");
    lastUpdateMs = performance.now() - t0;
    renderer!.setText(atlas, glyphs, w);
    widthEm = Math.max(w, 0.5);
    const kb = Math.round((atlas.width * atlas.height * 4) / 1024);
    atlasInfo = `atlas ${pixelsPerEm} px/em, ${atlas.width}×${atlas.height} (${kb} KB)`;
  }

  input.addEventListener("input", () => void update());
  for (const chip of fontChips) {
    chip.addEventListener("click", () => {
      fontName = chip.dataset.font!;
      for (const c of fontChips) c.setAttribute("aria-pressed", String(c === chip));
      void update();
    });
  }
  for (const chip of sizeChips) {
    chip.addEventListener("click", () => {
      pixelsPerEm = Number(chip.dataset.ppem);
      for (const c of sizeChips) c.setAttribute("aria-pressed", String(c === chip));
      void update();
    });
  }
  slider.addEventListener("input", () => {
    auto = false;
    autoButton.setAttribute("aria-pressed", "false");
  });
  autoButton.addEventListener("click", () => {
    auto = !auto;
    autoButton.setAttribute("aria-pressed", String(auto));
  });

  await update();
  hero.classList.add("ready");

  const start = performance.now();
  function frame(now: number): void {
    if (auto) {
      // Drift from "fits the width" to deep zoom and back.
      const fitPx = (canvas.clientWidth * 0.86) / widthEm;
      const fitV = Math.log(fitPx / MIN_PX) / Math.log(MAX_PX / MIN_PX);
      const v = fitV + 0.3 * (1 - Math.cos((now - start) / 4000)) - 0.12;
      slider.value = String(Math.min(1, Math.max(0, v)));
    }
    const cssPx = sliderToPx(Number(slider.value));
    const devicePx = cssPx * (window.devicePixelRatio || 1);
    renderer!.draw(devicePx);
    readout.textContent =
      `${Math.round(cssPx)} px · ${(devicePx / pixelsPerEm).toFixed(1)}× magnified · ${atlasInfo} · ` +
      `update ${lastUpdateMs.toFixed(1)} ms · ${renderer!.api}`;
    requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);
}

void main();
