/**
 * Landing page: a live hero where visitors type text, switch fonts and zoom,
 * all rendered by msdfgen-ts from one 48 px/em atlas per font.
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
const ATLAS_PX_PER_EM = 48;
const MIN_PX = 8;
const MAX_PX = 2400;

const $ = <T extends HTMLElement>(sel: string): T => document.querySelector<T>(sel)!;
const hero = $("#hero");
const canvas = $<HTMLCanvasElement>("#hero-canvas");
const input = $<HTMLInputElement>("#hero-text");
const slider = $<HTMLInputElement>("#hero-size");
const autoButton = $<HTMLButtonElement>("#hero-auto");
const readout = $("#hero-readout");
const chips = [...document.querySelectorAll<HTMLButtonElement>("[data-font]")];

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

const atlases = new Map<string, Promise<Atlas>>();
function atlasFor(name: string): Promise<Atlas> {
  let atlas = atlases.get(name);
  if (!atlas) {
    atlas = fetch(FONT_DIR + FONTS[name]!)
      .then((r) => r.arrayBuffer())
      .then((buffer) => new Atlas(new Font(buffer), { pixelsPerEm: ATLAS_PX_PER_EM, pxrange: 4 }));
    atlases.set(name, atlas);
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
  let widthEm = 1;
  let auto = true;
  let lastUpdateMs = 0;
  let glyphCount = 0;
  let pending = 0;

  async function update(): Promise<void> {
    const ticket = ++pending;
    const atlas = await atlasFor(fontName);
    if (ticket !== pending) return; // a newer edit or font switch superseded this one
    const t0 = performance.now();
    const { glyphs, widthEm: w } = atlas.layout(input.value || " ");
    lastUpdateMs = performance.now() - t0;
    renderer!.setText(atlas, glyphs, w);
    widthEm = Math.max(w, 0.5);
    glyphCount = new Set(input.value.replace(/\s/g, "")).size;
  }

  input.addEventListener("input", () => void update());
  for (const chip of chips) {
    chip.addEventListener("click", () => {
      fontName = chip.dataset.font!;
      for (const c of chips) c.setAttribute("aria-pressed", String(c === chip));
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
      `${Math.round(cssPx)} px · ${(devicePx / ATLAS_PX_PER_EM).toFixed(1)}× the atlas · ` +
      `${glyphCount} glyphs · atlas update ${lastUpdateMs.toFixed(1)} ms · ${renderer!.api}`;
    requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);
}

void main();
