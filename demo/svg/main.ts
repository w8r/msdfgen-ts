/**
 * SVG → MSDF demo: parse an SVG, generate ONE small MSDF cell for it, and
 * draw that cell at every size with WebGL2. Edit the source to try your own
 * (filled paths only — see src/svg/svg.ts for what's supported).
 */
import { Atlas, parseSvg } from "../../src/index";

const CELL_PX = 32; // atlas texels per viewBox height
const SIZES = [16, 32, 64, 128, 256]; // CSS px; 256 = 8× the atlas cell
const GAP = 24;

const SAMPLES: Record<string, string> = {
  heart: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M12 21C12 21 2 14.5 2 8.5A5 5 0 0 1 12 6A5 5 0 0 1 22 8.5C22 14.5 12 21 12 21Z"/></svg>`,
  play: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path fill-rule="evenodd" d="M12 2a10 10 0 1 0 0 20a10 10 0 1 0 0-20zM10 8v8l6-4z"/></svg>`,
  cloud: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M7 19a5 5 0 0 1-.5-9.98A7 7 0 0 1 19.5 9a4.5 4.5 0 0 1-1.5 10z"/></svg>`,
  wave: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M2 12Q7 2 12 12T22 12V22H2ZM4 4h4c2 0 3 1 3 2s-1 2-3 2h-4z"/></svg>`,
};

const VERT = `#version 300 es
in vec4 aVertex;    // xy: position in px, zw: atlas uv
in float aPxRange;  // screen px per distance-range unit, per quad
uniform vec2 uViewport;
out vec2 vUv;
out float vPxRange;
void main() {
  vUv = aVertex.zw;
  vPxRange = aPxRange;
  gl_Position = vec4(aVertex.xy / uViewport * 2.0 - 1.0, 0.0, 1.0);
}`;

const FRAG = `#version 300 es
precision highp float;
uniform sampler2D uAtlas;
in vec2 vUv;
in float vPxRange;
out vec4 color;
float median(float a, float b, float c) { return max(min(a, b), min(max(a, b), c)); }
void main() {
  vec3 s = texture(uAtlas, vUv).rgb;
  float opacity = clamp(vPxRange * (median(s.r, s.g, s.b) - 0.5) + 0.5, 0.0, 1.0);
  color = vec4(0.0, 0.0, 0.0, opacity);
}`;

const root = document.getElementById("root")!;
const source = document.querySelector("textarea")!;
const canvas = document.querySelector<HTMLCanvasElement>("#gl")!;
const preview = document.querySelector<HTMLCanvasElement>("#msdf")!;
const native = document.querySelector("img")!;
const status = document.querySelector("#status")!;

// WebGL2 setup: one program, one interleaved buffer [x, y, u, v, pxRange].
const gl = canvas.getContext("webgl2", { premultipliedAlpha: false })!;
const program = gl.createProgram()!;
for (const [type, src] of [
  [gl.VERTEX_SHADER, VERT],
  [gl.FRAGMENT_SHADER, FRAG],
] as const) {
  const shader = gl.createShader(type)!;
  gl.shaderSource(shader, src);
  gl.compileShader(shader);
  gl.attachShader(program, shader);
}
gl.linkProgram(program);
gl.useProgram(program);
gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
const aVertex = gl.getAttribLocation(program, "aVertex");
const aPxRange = gl.getAttribLocation(program, "aPxRange");
gl.enableVertexAttribArray(aVertex);
gl.enableVertexAttribArray(aPxRange);
gl.vertexAttribPointer(aVertex, 4, gl.FLOAT, false, 20, 0);
gl.vertexAttribPointer(aPxRange, 1, gl.FLOAT, false, 20, 16);
gl.bindTexture(gl.TEXTURE_2D, gl.createTexture());
gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
gl.enable(gl.BLEND);
gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

function render(svg: string): void {
  native.src = `data:image/svg+xml,${encodeURIComponent(svg)}`;

  // 1. SVG -> shape -> one MSDF cell in a shapes-only atlas.
  const atlas = new Atlas(null, { pixelsPerEm: CELL_PX, pxrange: 4 });
  const t0 = performance.now();
  const [g] = atlas.shapes([["icon", parseSvg(svg)]]);
  status.textContent = `${atlas.width}×${atlas.height} px MSDF in ${(performance.now() - t0).toFixed(1)} ms, drawn at ${SIZES.join(", ")} px`;
  if (!g || g.w === 0) {
    gl.clear(gl.COLOR_BUFFER_BIT);
    return;
  }

  // 2. Show the raw MSDF texture itself.
  preview.width = atlas.width;
  preview.height = atlas.height;
  preview
    .getContext("2d")!
    .putImageData(
      new ImageData(new Uint8ClampedArray(atlas.texture), atlas.width, atlas.height),
      0,
      0,
    );

  // 3. One quad per size, bottom-aligned on a row. Positions in device px, y-up.
  const dpr = window.devicePixelRatio || 1;
  canvas.style.width = `${SIZES.reduce((a, s) => a + s + GAP, GAP)}px`;
  canvas.style.height = `${Math.max(...SIZES) + 2 * GAP}px`;
  canvas.width = Math.round(canvas.clientWidth * dpr);
  canvas.height = Math.round(canvas.clientHeight * dpr);
  const [u0, u1] = [g.x / atlas.width, (g.x + g.w) / atlas.width];
  const [vTop, vBottom] = [g.y / atlas.height, (g.y + g.h) / atlas.height]; // texture is y-down
  const vertices: number[] = [];
  let left = GAP;
  for (const size of SIZES) {
    const px = size * dpr; // device px per viewBox height
    const [x0, x1] = [(left + g.planeLeft * size) * dpr, (left + g.planeRight * size) * dpr];
    const [y0, y1] = [(GAP + g.planeBottom * size) * dpr, (GAP + g.planeTop * size) * dpr];
    const r = atlas.pxrangeEm * px;
    // prettier-ignore
    vertices.push(
      x0, y0, u0, vBottom, r,  x1, y0, u1, vBottom, r,  x0, y1, u0, vTop, r,
      x0, y1, u0, vTop, r,     x1, y0, u1, vBottom, r,  x1, y1, u1, vTop, r,
    );
    left += size + GAP;
  }

  // 4. Upload + draw.
  gl.texImage2D(
    gl.TEXTURE_2D,
    0,
    gl.RGBA8,
    atlas.width,
    atlas.height,
    0,
    gl.RGBA,
    gl.UNSIGNED_BYTE,
    atlas.texture,
  );
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
  gl.viewport(0, 0, canvas.width, canvas.height);
  gl.uniform2f(gl.getUniformLocation(program, "uViewport"), canvas.width, canvas.height);
  gl.clearColor(0, 0, 0, 0);
  gl.clear(gl.COLOR_BUFFER_BIT);
  gl.drawArrays(gl.TRIANGLES, 0, vertices.length / 5);
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
source.value = SAMPLES.heart!;
source.oninput = update;
update();
root.dataset.ready = "";
