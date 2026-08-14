#version 300 es
precision highp float;
// Fragment shader — WebGL2 twin of demo/webgpu/msdf.wgsl's fs_main.
// Reconstruction formula matches msdfgen's reference shader exactly (see
// demo/canvas/main.ts for the CPU-side twin of this same formula):
//   sd = median(r,g,b) - 0.5
//   screenPxDistance = screenPxRange * sd
//   opacity = clamp(screenPxDistance + 0.5, 0, 1)

uniform sampler2D atlasTexture;
uniform float screenPxRange;
uniform vec4 fgColor;
uniform vec4 bgColor;

in vec2 vUv;
out vec4 fragColor;

float median3(float a, float b, float c) {
  return max(min(a, b), min(max(a, b), c));
}

void main() {
  vec3 s = texture(atlasTexture, vUv).rgb;
  float sd = median3(s.r, s.g, s.b) - 0.5;
  float screenPxDistance = screenPxRange * sd;
  float opacity = clamp(screenPxDistance + 0.5, 0.0, 1.0);
  // Coverage goes in alpha, not baked into rgb: glyph cells overlap their
  // neighbours by design (pxrange padding > advance width), drawn back to
  // front. Outputting alpha=1 everywhere (the old `mix(bgColor,fgColor,...)`
  // with implicit alpha=1) turned every cell into an opaque rectangle, so a
  // later glyph's transparent background fully overwrote the trailing edge
  // of the previous glyph instead of blending — the "cut on the right" bug.
  // bgColor is unused here; the canvas clear color supplies the background.
  fragColor = vec4(fgColor.rgb, opacity * fgColor.a);
}
