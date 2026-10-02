const n=`// Instanced-quad MSDF text shader.
// Reconstruction formula matches msdfgen's reference shader exactly (see
// demo/canvas/main.ts for the CPU-side twin of this same formula):
//   sd = median(r,g,b) - 0.5
//   screenPxDistance = screenPxRange * sd
//   opacity = clamp(screenPxDistance + 0.5, 0, 1)

struct Uniforms {
  viewportSize: vec2<f32>,
  screenPxRange: f32,
  _pad: f32,
  fgColor: vec4<f32>,
  bgColor: vec4<f32>,
};

@group(0) @binding(0) var<uniform> uniforms: Uniforms;
@group(0) @binding(1) var atlasSampler: sampler;
@group(0) @binding(2) var atlasTexture: texture_2d<f32>;

struct VertexOut {
  @builtin(position) position: vec4<f32>,
  @location(0) uv: vec2<f32>,
};

@vertex
fn vs_main(
  @location(0) baseCorner: vec2<f32>, // unit quad corner, 0..1
  @location(1) instPos: vec2<f32>, // pixel-space top-left
  @location(2) instSize: vec2<f32>, // pixel-space width/height
  @location(3) instUvMin: vec2<f32>, // atlas uv, top-left
  @location(4) instUvSize: vec2<f32>, // atlas uv, width/height
) -> VertexOut {
  let pixelPos = instPos + baseCorner * instSize;
  let ndc = vec2<f32>(
    (pixelPos.x / uniforms.viewportSize.x) * 2.0 - 1.0,
    1.0 - (pixelPos.y / uniforms.viewportSize.y) * 2.0,
  );
  var out: VertexOut;
  out.position = vec4<f32>(ndc, 0.0, 1.0);
  out.uv = instUvMin + baseCorner * instUvSize;
  return out;
}

fn median3(a: f32, b: f32, c: f32) -> f32 {
  return max(min(a, b), min(max(a, b), c));
}

@fragment
fn fs_main(in: VertexOut) -> @location(0) vec4<f32> {
  let s = textureSample(atlasTexture, atlasSampler, in.uv);
  let sd = median3(s.r, s.g, s.b) - 0.5;
  let screenPxDistance = uniforms.screenPxRange * sd;
  let opacity = clamp(screenPxDistance + 0.5, 0.0, 1.0);
  // Coverage goes in alpha, not baked into rgb: glyph cells overlap their
  // neighbours by design (pxrange padding > advance width), drawn back to
  // front. Outputting alpha=1 everywhere (the old \`mix(bgColor,fgColor,...)\`
  // with implicit alpha=1) turned every cell into an opaque rectangle, so a
  // later glyph's transparent background fully overwrote the trailing edge
  // of the previous glyph instead of blending — the "cut on the right" bug.
  // uniforms.bgColor is unused here; the render pass's clear color supplies
  // the background.
  return vec4<f32>(uniforms.fgColor.rgb, opacity * uniforms.fgColor.a);
}
`;export{n as s};
