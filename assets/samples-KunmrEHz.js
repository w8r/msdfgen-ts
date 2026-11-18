import{p as W}from"./svg-68QKeIWm.js";import{A as k}from"./atlas-gen-CAGEH7pT.js";const C=8,Y=128,Q=16,q=1024,E=104,{FLOAT:R,UNSIGNED_SHORT:Z,UNSIGNED_INT:M}=WebGL2RenderingContext,$=[["aCorner",R,0],["aGrad",R,16],["aCell",Z,32],["aStops0",M,40],["aStops1",M,56],["aOffsets0",R,72],["aOffsets1",R,88]],j="vec4 place(vec4 a, vec4 b) { return a; }",J=u=>`#version 300 es
precision highp float;
uniform vec2 uViewport;   // device px
uniform float uPxRangeEm;
uniform float uHardwareMax; // px per viewBox height up to which the GPU filter is used
uniform float uTime;
uniform vec3 uCamera;     // pan x, pan y (device px), zoom — around the viewport centre
uniform float svgWidth;   // this draw's viewBox width / height (readable by place())
in vec4 aA, aB;           // per-instance data, interpreted by place()
in vec4 aCorner, aGrad, aCell, aOffsets0, aOffsets1; // per-vertex template data, see VERTEX
in uvec4 aStops0, aStops1;
out vec4 vT;              // MSDF texel coordinate (centres at integers), gradient coordinates
flat out vec4 vCell;      // x, y, w - 1, h - 1
flat out vec4 vInfo;      // screen px range, gradient type (0 solid, 1 linear, 2 radial),
                          // stop count, 1 to filter the MSDF in the shader (deep zoom)
flat out uvec4 vStops0, vStops1;
flat out vec4 vOffsets0, vOffsets1;
// place() -> (centre x, centre y) in device px, size in px per viewBox height, angle in radians.
${u}
void main() {
  vec4 p = place(aA, aB);
  p.xy = (p.xy - uViewport * 0.5 - uCamera.xy) * uCamera.z + uViewport * 0.5;
  p.z *= uCamera.z;
  vec2 d = mat2(cos(p.w), sin(p.w), -sin(p.w), cos(p.w)) * (aCorner.xy - vec2(svgWidth, 1.0) * 0.5) * p.z;
  gl_Position = vec4((p.xy + d) / uViewport * 2.0 - 1.0, 0.0, 1.0);
  vT = vec4(aCorner.zw, aGrad.xy);
  vCell = vec4(aCell.xy, aCell.zw - 1.0);
  vInfo = vec4(uPxRangeEm * p.z, aGrad.zw, p.z > uHardwareMax ? 1.0 : 0.0);
  vStops0 = aStops0; vStops1 = aStops1;
  vOffsets0 = aOffsets0; vOffsets1 = aOffsets1;
}`,K=`#version 300 es
precision highp float;
uniform highp sampler2D uMsdf; // float32 RGB, the atlas's floatTexture; texelFetch only
uniform highp sampler2D uMsdfHalf; // the same in float16, bilinear
uniform vec2 uMsdfInv;         // 1 / their size
in vec4 vT;
flat in vec4 vCell, vInfo, vOffsets0, vOffsets1;
flat in uvec4 vStops0, vStops1;
out vec4 color;
vec4 stop(int i) {
  uint c = (i < 4 ? vStops0 : vStops1)[i & 3];
  return vec4(uvec4(c, c >> 8, c >> 16, c >> 24) & 0xFFu) / 255.0;
}
float offset(int i) { return (i < 4 ? vOffsets0 : vOffsets1)[i & 3]; }
float median(float a, float b, float c) { return max(min(a, b), min(max(a, b), c)); }
// One MSDF texel of this layer's cell, clamped to the cell.
vec3 texel(vec2 i) {
  return texelFetch(uMsdf, ivec2(clamp(i, vec2(0.0), vCell.zw) + vCell.xy), 0).rgb;
}
// Bilinear MSDF sample (the reconstruction msdfgen assumes; higher-order filters
// overshoot at corners, where channels have kinks), clamped to this layer's cell.
vec3 msdf() {
  if (vInfo.w == 0.0) { // GPU filter, between the cell's texel centres
    return textureLod(uMsdfHalf, (clamp(vT.xy, vec2(0.0), vCell.zw) + vCell.xy + 0.5) * uMsdfInv, 0.0).rgb;
  }
  vec2 i = floor(vT.xy), f = vT.xy - i; // deep zoom: in full float precision
  return mix(mix(texel(i), texel(i + vec2(1, 0)), f.x),
             mix(texel(i + vec2(0, 1)), texel(i + vec2(1, 1)), f.x), f.y);
}
void main() {
  vec3 s = msdf();
  float coverage = clamp(vInfo.x * (median(s.r, s.g, s.b) - 0.5) + 0.5, 0.0, 1.0);
  if (coverage == 0.0) discard; // quad padding: skip the paint and blending
  vec4 c = stop(0);
  if (vInfo.y > 0.0) {
    float t = clamp(vInfo.y == 1.0 ? vT.z : length(vT.zw), 0.0, 1.0);
    for (int i = 1; i < ${C}; i++) {
      if (float(i) >= vInfo.z) break;
      float span = max(offset(i) - offset(i - 1), 1e-6);
      c = mix(c, stop(i), clamp((t - offset(i - 1)) / span, 0.0, 1.0));
    }
  }
  color = vec4(c.rgb, c.a * coverage);
}`,T=new OffscreenCanvas(1,1).getContext("2d",{willReadFrequently:!0});function I(u,t){T.clearRect(0,0,1,1),T.fillStyle="#000",T.fillStyle=u,T.fillRect(0,0,1,1);const[a=0,i=0,e=0,o=0]=T.getImageData(0,0,1,1).data;return(a|i<<8|e<<16|Math.round(o*t)<<24)>>>0}function tt(u,t,a){const i=(e,o)=>e>>>8*o&255;for(;u.length>a;){let[e,o]=[1,1/0];for(let s=1;s<u.length-1;s++){const r=t[s+1]-t[s-1],p=r>0?(t[s]-t[s-1])/r:0;let h=0;for(let l=0;l<4;l++){const[d,v]=[i(u[s-1],l),i(u[s+1],l)];h=Math.max(h,Math.abs(d+p*(v-d)-i(u[s],l)))}h<o&&([e,o]=[s,h])}u.splice(e,1),t.splice(e,1)}}class st{constructor(t,a=j){this.msdf={width:0,height:0,data:new Float32Array(0)},this.widths=[],this.layers=0,this.drawCalls=0,this.hardwareFilterMaxTexelPx=Q,this._u=new Map,this._uploaded=null,this._pxPerEm=1,this._counts=[],this._firstQuad=[],this._ranges=[],this._gl=t;const i=this._program=t.createProgram();for(const[e,o]of[[t.VERTEX_SHADER,J(a)],[t.FRAGMENT_SHADER,K]]){const s=t.createShader(e);t.shaderSource(s,o),t.compileShader(s),t.attachShader(i,s)}t.linkProgram(i),t.useProgram(i),t.uniform1i(t.getUniformLocation(i,"uMsdf"),0),t.uniform1i(t.getUniformLocation(i,"uMsdfHalf"),1),this._msdfTex=this._texture(t.NEAREST),this._halfTex=this._texture(t.LINEAR),this._vao=t.createVertexArray(),t.bindVertexArray(this._vao),this._template=t.createBuffer(),this._indices=t.createBuffer(),this._instances=t.createBuffer(),t.bindBuffer(t.ELEMENT_ARRAY_BUFFER,this._indices),t.bindBuffer(t.ARRAY_BUFFER,this._template);for(const[e,o,s]of $){const r=t.getAttribLocation(i,e);r<0||(t.enableVertexAttribArray(r),o===M?t.vertexAttribIPointer(r,4,o,E,s):t.vertexAttribPointer(r,4,o,!1,E,s))}this._aA=t.getAttribLocation(i,"aA"),this._aB=t.getAttribLocation(i,"aB");for(const e of[this._aA,this._aB])e<0||(t.enableVertexAttribArray(e),t.vertexAttribDivisor(e,1));t.bindVertexArray(null)}_texture(t){const a=this._gl,i=a.createTexture();return a.bindTexture(a.TEXTURE_2D,i),a.texParameteri(a.TEXTURE_2D,a.TEXTURE_MIN_FILTER,t),a.texParameteri(a.TEXTURE_2D,a.TEXTURE_MAG_FILTER,t),i}_loc(t){return this._u.has(t)||this._u.set(t,this._gl.getUniformLocation(this._program,t)),this._u.get(t)??null}load(t,a){const i=t.map(W),e=new k(null,{pixelsPerEm:a,pxrange:a/8,float:!0}),o=i.flatMap((c,f)=>c.layers.map(x=>({svg:f,layer:x}))),s=e.shapes(o.map((c,f)=>[String(f),c.layer.shape])),r=o.flatMap((c,f)=>s[f].w>0?[{...c,m:s[f]}]:[]),[p,h,l]=[e.width,e.height,e.floatTexture],d=new ArrayBuffer(r.length*4*E),v=new Float32Array(d),D=new Uint16Array(d),U=new Uint32Array(d),S=new Uint32Array(r.length*6);r.forEach(({layer:c,m:f},x)=>{const m=c.gradient,F=m?.stops??[],B=m?F.map(_=>I(_.color,_.opacity*c.opacity)):[I(c.color,c.opacity)],b=F.map(_=>_.offset);m&&tt(B,b,C);const L=m?m.radial?2:1:0,[G=0,O=0,z=0,P=0,X=0,N=0]=m?.matrix??[];for(let _=0;_<4;_++){const A=(x*4+_)*E/4,w=_&1?f.planeRight:f.planeLeft,y=_>>1?f.planeTop:f.planeBottom,V=(w-f.planeLeft)*a-.5,H=(f.planeTop-y)*a-.5;v.set([w,y,V,H,G*w+z*y+X,O*w+P*y+N,L,b.length],A),D.set([f.x,f.y,f.w,f.h],(A+8)*2),U.set(B,A+10),v.set(b,A+18)}const g=x*4;S.set([g,g+1,g+2,g+2,g+1,g+3],x*6)});const n=this._gl;n.bindTexture(n.TEXTURE_2D,this._msdfTex),n.texImage2D(n.TEXTURE_2D,0,n.RGB32F,p,h,0,n.RGB,n.FLOAT,l),n.bindTexture(n.TEXTURE_2D,this._halfTex),n.texImage2D(n.TEXTURE_2D,0,n.RGB16F,p,h,0,n.RGB,n.FLOAT,l),n.bindVertexArray(this._vao),n.bindBuffer(n.ARRAY_BUFFER,this._template),n.bufferData(n.ARRAY_BUFFER,d,n.STATIC_DRAW),n.bufferData(n.ELEMENT_ARRAY_BUFFER,S,n.STATIC_DRAW),n.bindVertexArray(null),this.msdf={width:p,height:h,data:l},this._pxPerEm=a,this._counts=i.map((c,f)=>r.filter(x=>x.svg===f).length),this._firstQuad=this._counts.map((c,f)=>r.findIndex(x=>x.svg>=f)),this._uploaded=null,[this.widths,this.layers]=[i.map(c=>c.width),r.length]}showMsdf(t){const{width:a,height:i,data:e}=this.msdf;if([t.width,t.height]=[a,i],a===0)return;const o=new ImageData(a,i);for(let s=0;s<a*i;s++)o.data.set([e[s*3]*255,e[s*3+1]*255,e[s*3+2]*255,255],s*4);t.getContext("2d").putImageData(o,0,0)}draw(t,a=0,i=[0,0,1]){const e=this._gl;if(this.layers===0||t.length===0)return;e.useProgram(this._program),e.bindVertexArray(this._vao),e.bindBuffer(e.ARRAY_BUFFER,this._instances),t!==this._uploaded&&this._upload(t),e.activeTexture(e.TEXTURE1),e.bindTexture(e.TEXTURE_2D,this._halfTex),e.activeTexture(e.TEXTURE0),e.bindTexture(e.TEXTURE_2D,this._msdfTex),e.enable(e.BLEND),e.blendFuncSeparate(e.SRC_ALPHA,e.ONE_MINUS_SRC_ALPHA,e.ONE,e.ONE_MINUS_SRC_ALPHA),e.uniform2f(this._loc("uViewport"),e.drawingBufferWidth,e.drawingBufferHeight),e.uniform1f(this._loc("uPxRangeEm"),1/8);const o=Math.min(this.hardwareFilterMaxTexelPx*this._pxPerEm,q);e.uniform1f(this._loc("uHardwareMax"),o),e.uniform2f(this._loc("uMsdfInv"),1/this.msdf.width,1/this.msdf.height),e.uniform1f(this._loc("uTime"),a),e.uniform3fv(this._loc("uCamera"),i);const s=this._loc("svgWidth");for(let r=0;r<this._ranges.length;r+=3){const[p,h,l]=[this._ranges[r],this._ranges[r+1],this._ranges[r+2]];e.uniform1f(s,this.widths[p]),this._aA>=0&&e.vertexAttribPointer(this._aA,4,e.FLOAT,!1,32,h*32),this._aB>=0&&e.vertexAttribPointer(this._aB,4,e.FLOAT,!1,32,h*32+16);const[d,v]=[this._firstQuad[p],this._counts[p]];e.drawElementsInstanced(e.TRIANGLES,v*6,e.UNSIGNED_INT,d*24,l)}this.drawCalls=this._ranges.length/3,e.bindVertexArray(null)}_upload(t){const a=this._counts.length,i=t.length/8,e=a===1?1:Math.max(1,Math.min(i,Math.floor(Y/a))),o=a===1?t:new Float32Array(t.length);this._ranges=[];for(let s=0,r=0;s<e;s++){const p=Math.floor(s*i/e),h=Math.floor((s+1)*i/e);for(let l=0;l<a;l++){const d=r;for(let v=p+(l-p%a+a)%a;v<h;v+=a,r++)o!==t&&o.set(t.subarray(v*8,v*8+8),r*8);r>d&&this._counts[l]>0&&this._ranges.push(l,d,r-d)}}this._gl.bufferData(this._gl.ARRAY_BUFFER,o,this._gl.STATIC_DRAW),this._uploaded=t}}const it={heart:`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
  <linearGradient id="g" x2="0" y2="1"><stop offset="0" stop-color="#ff7aa2"/><stop offset="1" stop-color="#c8102e"/></linearGradient>
  <path fill="url(#g)" d="M12 21C12 21 2 14.5 2 8.5A5 5 0 0 1 12 6A5 5 0 0 1 22 8.5C22 14.5 12 21 12 21Z"/>
</svg>`,sunset:`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
  <linearGradient id="sky" x2="0" y2="1"><stop offset="0" stop-color="#2b1055"/><stop offset=".6" stop-color="#d53369"/><stop offset="1" stop-color="#ffcf6b"/></linearGradient>
  <radialGradient id="sun"><stop offset=".5" stop-color="#fff6c2"/><stop offset="1" stop-color="#ffb347"/></radialGradient>
  <path fill="url(#sky)" d="M4 2h16a2 2 0 0 1 2 2v16a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2z"/>
  <path fill="url(#sun)" d="M7 13a5 5 0 1 1 10 0a5 5 0 1 1-10 0z"/>
  <path fill="#5b2a86" opacity=".85" d="M2 16Q7 11 12 15T22 14V20a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2z"/>
  <path fill="#1d0b3a" d="M2 19Q9 15 14 18T22 17V20a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2z"/>
</svg>`,play:`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
  <radialGradient id="p" cx=".35" cy=".3" r=".8"><stop offset="0" stop-color="#7fd4ff"/><stop offset="1" stop-color="#0b4f9c"/></radialGradient>
  <path fill="url(#p)" fill-rule="evenodd" d="M12 2a10 10 0 1 0 0 20a10 10 0 1 0 0-20zM10 8v8l6-4z"/>
</svg>`,wave:`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
  <path fill="teal" d="M2 12Q7 2 12 12T22 12V22H2Z"/>
  <path style="fill:#ff8c00;fill-opacity:.8" d="M4 4h4c2 0 3 1 3 2s-1 2-3 2h-4z"/>
</svg>`};export{st as S,it as a};
