import{F as k,A as Y}from"./atlas-CcUXf4Jh.js";const W=`// Instanced-quad MSDF text shader.
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
`,H="/msdfgen-ts/test/fonts/PTSerif-Regular.ttf",G=64,m=8,D=[16,32,64,128,256],Z="Hello Привет 123 @#&",j=[.08,.08,.08,1],C=[1,1,1,1];function J(e,i,n){const l=[];let c=0,d=-1;for(const r of n){const t=r.codePointAt(0),p=e.glyphId(t);d>=0&&(c+=e.kerning(d,p)/e.metrics.unitsPerEm);const u=i.getGlyph(t);l.push({info:u,penX:c}),c+=u.advance,d=p}return{glyphs:l,widthEm:c}}async function K(e,i,n,l,c,d,r,t,p,u,h,O){const x=Math.ceil((p+.6)*u),b=Math.ceil(1.6*u),o=document.createElement("canvas");o.width=Math.round(x*h),o.height=Math.round(b*h),o.style.width=`${x}px`,o.style.height=`${b}px`,o.className="gpu-canvas";const v=u*h,S=o.getContext("webgpu");S.configure({device:e,format:O,alphaMode:"opaque"});const P=.5/r.width,w=.5/r.height,T=G-2*m,_=m,B=G-m-.25*T,a=v/T,y=m*a,L=.3,M=.75*o.height,R=8,s=new Float32Array(t.length*R);for(let E=0;E<t.length;E++){const{info:U,penX:N}=t[E],X=(N+L)*v-_*a,$=M-B*a,z=U.size*a,f=E*R;s[f+0]=X,s[f+1]=$,s[f+2]=z,s[f+3]=z,s[f+4]=U.rect.x/r.width+P,s[f+5]=U.rect.y/r.height+w,s[f+6]=U.rect.w/r.width-2*P,s[f+7]=U.rect.h/r.height-2*w}const A=e.createBuffer({size:s.byteLength,usage:GPUBufferUsage.VERTEX|GPUBufferUsage.COPY_DST});e.queue.writeBuffer(A,0,s);const F=new Float32Array([o.width,o.height,y,0,...j,...C]),I=e.createBuffer({size:F.byteLength,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST});e.queue.writeBuffer(I,0,F);const V=e.createBindGroup({layout:n,entries:l(I)}),q=e.createCommandEncoder(),g=q.beginRenderPass({colorAttachments:[{view:S.getCurrentTexture().createView(),clearValue:{r:C[0],g:C[1],b:C[2],a:C[3]},loadOp:"clear",storeOp:"store"}]});return g.setPipeline(i),g.setBindGroup(0,V),g.setVertexBuffer(0,c),g.setVertexBuffer(1,A),g.setIndexBuffer(d,"uint16"),g.drawIndexed(6,t.length),g.end(),e.queue.submit([q.finish()]),await e.queue.onSubmittedWorkDone(),o}async function Q(){const e=document.getElementById("root");if(!navigator.gpu){e.textContent="WebGPU is not available in this browser (navigator.gpu is undefined).",e.dataset.ready="true";return}const i=await navigator.gpu.requestAdapter();if(!i){e.textContent="WebGPU adapter request failed (no compatible GPU found).",e.dataset.ready="true";return}const n=await i.requestDevice(),l=navigator.gpu.getPreferredCanvasFormat(),c=window.devicePixelRatio||1;e.textContent="Loading font…";const d=await fetch(H).then(a=>a.arrayBuffer()),r=new k(d),t=new Y(r,{size:G,pxrange:m}),{glyphs:p,widthEm:u}=J(r,t,Z),h=n.createTexture({size:[t.width,t.height],format:"rgba8unorm",usage:GPUTextureUsage.TEXTURE_BINDING|GPUTextureUsage.COPY_DST});n.queue.writeTexture({texture:h},t.texture,{bytesPerRow:t.width*4},{width:t.width,height:t.height});const O=n.createSampler({magFilter:"linear",minFilter:"linear",addressModeU:"clamp-to-edge",addressModeV:"clamp-to-edge"}),x=new Float32Array([0,0,1,0,0,1,1,1]),b=n.createBuffer({size:x.byteLength,usage:GPUBufferUsage.VERTEX|GPUBufferUsage.COPY_DST});n.queue.writeBuffer(b,0,x);const o=new Uint16Array([0,1,2,2,1,3]),v=n.createBuffer({size:o.byteLength,usage:GPUBufferUsage.INDEX|GPUBufferUsage.COPY_DST});n.queue.writeBuffer(v,0,o);const S=8,P=n.createShaderModule({code:W}),w=n.createRenderPipeline({layout:"auto",vertex:{module:P,entryPoint:"vs_main",buffers:[{arrayStride:8,stepMode:"vertex",attributes:[{shaderLocation:0,offset:0,format:"float32x2"}]},{arrayStride:S*4,stepMode:"instance",attributes:[{shaderLocation:1,offset:0,format:"float32x2"},{shaderLocation:2,offset:8,format:"float32x2"},{shaderLocation:3,offset:16,format:"float32x2"},{shaderLocation:4,offset:24,format:"float32x2"}]}]},fragment:{module:P,entryPoint:"fs_main",targets:[{format:l,blend:{color:{srcFactor:"src-alpha",dstFactor:"one-minus-src-alpha"},alpha:{srcFactor:"one",dstFactor:"one-minus-src-alpha"}}}]},primitive:{topology:"triangle-list"}}),T=w.getBindGroupLayout(0),_=a=>[{binding:0,resource:{buffer:a}},{binding:1,resource:O},{binding:2,resource:h.createView()}];e.textContent="";const B=document.createElement("p");B.textContent=`One ${G}px atlas (pxrange ${m}) via WebGPU, rendered at: ${D.join(", ")}px — same source texels every time.`,e.appendChild(B);for(const a of D){const y=document.createElement("div");y.className="label",y.textContent=`${a}px`,e.appendChild(y);const L=await K(n,w,T,_,b,v,t,p,u,a,c,l);e.appendChild(L)}e.dataset.ready="true"}Q().catch(e=>{const i=document.getElementById("root");throw i.textContent=`Error: ${String(e)}`,i.dataset.ready="true",e});
