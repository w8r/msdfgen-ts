#version 300 es
// Instanced-quad vertex shader — WebGL2 twin of demo/webgpu/msdf.wgsl's
// vs_main. Test-only renderer (see demo/webgl/main.ts header): same layout
// math as the WebGPU checkpoint-1 demo, so screenshots from both are
// directly comparable once real WebGPU hardware is available.

layout(location = 0) in vec2 baseCorner; // unit quad corner, 0..1
layout(location = 1) in vec2 instPos; // pixel-space top-left
layout(location = 2) in vec2 instSize; // pixel-space width/height
layout(location = 3) in vec2 instUvMin; // atlas uv, top-left
layout(location = 4) in vec2 instUvSize; // atlas uv, width/height

uniform vec2 viewportSize;

out vec2 vUv;

void main() {
  vec2 pixelPos = instPos + baseCorner * instSize;
  vec2 ndc = vec2(
    (pixelPos.x / viewportSize.x) * 2.0 - 1.0,
    1.0 - (pixelPos.y / viewportSize.y) * 2.0
  );
  gl_Position = vec4(ndc, 0.0, 1.0);
  vUv = instUvMin + baseCorner * instUvSize;
}
