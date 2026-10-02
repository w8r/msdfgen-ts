import{F as R,A as O}from"./atlas-gen-DqDNe1YC.js";const S="/msdfgen-ts/test/fonts/PTSerif-Regular.ttf",q="Crisp at any size",A=[.96,.93,.86,1],C=`
struct Uniforms { scale: vec2f, screenPxRange: f32, color: vec4f }
@group(0) @binding(0) var<uniform> u: Uniforms;
@group(0) @binding(1) var atlasTexture: texture_2d<f32>;
@group(0) @binding(2) var atlasSampler: sampler;

struct VertexOut { @builtin(position) position: vec4f, @location(0) uv: vec2f }

@vertex
fn vs(@location(0) vertex: vec4f) -> VertexOut { // xy: position in em, zw: atlas uv
  return VertexOut(vec4f(vertex.xy * u.scale, 0.0, 1.0), vertex.zw);
}

fn median(a: f32, b: f32, c: f32) -> f32 { return max(min(a, b), min(max(a, b), c)); }

@fragment
fn fs(in: VertexOut) -> @location(0) vec4f {
  let s = textureSample(atlasTexture, atlasSampler, in.uv).rgb;
  let opacity = clamp(u.screenPxRange * (median(s.r, s.g, s.b) - 0.5) + 0.5, 0.0, 1.0);
  return vec4f(u.color.rgb, u.color.a * opacity);
}`,V=new R(await(await fetch(S)).arrayBuffer()),r=new O(V,{pixelsPerEm:48,pxrange:4}),{glyphs:L,widthEm:h}=r.layout(q),w=.7,x=L.filter(({glyph:e})=>e.w>0),v=new Float32Array(x.length*24);x.forEach(({glyph:e,penX:i,penY:u},c)=>{const o=i+e.planeLeft-h/2,a=i+e.planeRight-h/2,f=u+e.planeBottom-w/2,l=u+e.planeTop-w/2,d=(e.x+.5)/r.width,m=(e.x+e.w-.5)/r.width,p=(e.y+.5)/r.height,g=(e.y+e.h-.5)/r.height;v.set([o,f,d,g,a,f,m,g,o,l,d,p,o,l,d,p,a,f,m,g,a,l,m,p],c*24)});const P=await navigator.gpu?.requestAdapter();if(!P)throw document.body.insertAdjacentHTML("beforeend",'<p class="fallback">WebGPU is not available in this browser.</p>'),new Error("WebGPU is not available");const t=await P.requestDevice(),n=document.querySelector("canvas"),y=n.getContext("webgpu"),T=navigator.gpu.getPreferredCanvasFormat();y.configure({device:t,format:T,alphaMode:"opaque"});const U=t.createBuffer({size:v.byteLength,usage:GPUBufferUsage.VERTEX|GPUBufferUsage.COPY_DST});t.queue.writeBuffer(U,0,v);const B=t.createTexture({size:[r.width,r.height],format:"rgba8unorm",usage:GPUTextureUsage.TEXTURE_BINDING|GPUTextureUsage.COPY_DST});t.queue.writeTexture({texture:B},r.texture,{bytesPerRow:r.width*4},[r.width,r.height]);const s=new Float32Array(8);s.set(A,4);const E=t.createBuffer({size:s.byteLength,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST}),b=t.createShaderModule({code:C}),F=t.createRenderPipeline({layout:"auto",vertex:{module:b,buffers:[{arrayStride:16,attributes:[{shaderLocation:0,offset:0,format:"float32x4"}]}]},fragment:{module:b,targets:[{format:T,blend:{color:{srcFactor:"src-alpha",dstFactor:"one-minus-src-alpha"},alpha:{srcFactor:"one",dstFactor:"one-minus-src-alpha"}}}]}}),M=t.createBindGroup({layout:F.getBindGroupLayout(0),entries:[{binding:0,resource:{buffer:E}},{binding:1,resource:B.createView()},{binding:2,resource:t.createSampler({magFilter:"linear",minFilter:"linear"})}]});function G(e){const i=window.devicePixelRatio||1;n.width=Math.round(n.clientWidth*i),n.height=Math.round(n.clientHeight*i);const c=n.width*.9/h*2**(-2*(1-Math.cos(e/2500)));s[0]=2*c/n.width,s[1]=2*c/n.height,s[2]=r.pxrangeEm*c,t.queue.writeBuffer(E,0,s);const o=t.createCommandEncoder(),a=o.beginRenderPass({colorAttachments:[{view:y.getCurrentTexture().createView(),clearValue:{r:.06,g:.07,b:.09,a:1},loadOp:"clear",storeOp:"store"}]});a.setPipeline(F),a.setBindGroup(0,M),a.setVertexBuffer(0,U),a.draw(x.length*6),a.end(),t.queue.submit([o.finish()]),requestAnimationFrame(G)}requestAnimationFrame(G);
