import{F as P,A as g}from"./atlas-gen-DqDNe1YC.js";const S="/msdfgen-ts/test/fonts/PTSerif-Regular.ttf",p="Crisp at any size",w=[.96,.93,.86,1],U=`#version 300 es
in vec4 aVertex;     // xy: position in em, zw: atlas uv
uniform vec2 uScale; // em -> clip space
out vec2 vUv;
void main() {
  vUv = aVertex.zw;
  gl_Position = vec4(aVertex.xy * uScale, 0.0, 1.0);
}`,L=`#version 300 es
precision highp float;
uniform sampler2D uAtlas;
uniform float uScreenPxRange;
uniform vec4 uColor;
in vec2 vUv;
out vec4 color;
float median(float a, float b, float c) { return max(min(a, b), min(max(a, b), c)); }
void main() {
  vec3 s = texture(uAtlas, vUv).rgb;
  float opacity = clamp(uScreenPxRange * (median(s.r, s.g, s.b) - 0.5) + 0.5, 0.0, 1.0);
  color = vec4(uColor.rgb, uColor.a * opacity);
}`,b=new P(await(await fetch(S)).arrayBuffer()),a=new g(b,{pixelsPerEm:48,pxrange:4}),{glyphs:y,widthEm:T}=a.layout(p),_=.7,A=y.filter(({glyph:t})=>t.w>0),x=new Float32Array(A.length*24);A.forEach(({glyph:t,penX:r,penY:n},c)=>{const s=r+t.planeLeft-T/2,l=r+t.planeRight-T/2,E=n+t.planeBottom-_/2,u=n+t.planeTop-_/2,m=(t.x+.5)/a.width,f=(t.x+t.w-.5)/a.width,R=(t.y+.5)/a.height,h=(t.y+t.h-.5)/a.height;x.set([s,E,m,h,l,E,f,h,s,u,m,R,s,u,m,R,l,E,f,h,l,u,f,R],c*24)});const o=document.querySelector("canvas"),e=o.getContext("webgl2");if(!e)throw new Error("WebGL2 is not available in this browser");const i=e.createProgram();for(const[t,r]of[[e.VERTEX_SHADER,U],[e.FRAGMENT_SHADER,L]]){const n=e.createShader(t);e.shaderSource(n,r),e.compileShader(n),e.attachShader(i,n)}e.linkProgram(i);e.useProgram(i);e.bindBuffer(e.ARRAY_BUFFER,e.createBuffer());e.bufferData(e.ARRAY_BUFFER,x,e.STATIC_DRAW);const d=e.getAttribLocation(i,"aVertex");e.enableVertexAttribArray(d);e.vertexAttribPointer(d,4,e.FLOAT,!1,0,0);e.bindTexture(e.TEXTURE_2D,e.createTexture());e.texImage2D(e.TEXTURE_2D,0,e.RGBA8,a.width,a.height,0,e.RGBA,e.UNSIGNED_BYTE,a.texture);e.texParameteri(e.TEXTURE_2D,e.TEXTURE_MIN_FILTER,e.LINEAR);e.texParameteri(e.TEXTURE_2D,e.TEXTURE_MAG_FILTER,e.LINEAR);e.texParameteri(e.TEXTURE_2D,e.TEXTURE_WRAP_S,e.CLAMP_TO_EDGE);e.texParameteri(e.TEXTURE_2D,e.TEXTURE_WRAP_T,e.CLAMP_TO_EDGE);e.enable(e.BLEND);e.blendFuncSeparate(e.SRC_ALPHA,e.ONE_MINUS_SRC_ALPHA,e.ONE,e.ONE_MINUS_SRC_ALPHA);const F=e.getUniformLocation(i,"uScale"),C=e.getUniformLocation(i,"uScreenPxRange");e.uniform4fv(e.getUniformLocation(i,"uColor"),w);function v(t){const r=window.devicePixelRatio||1;o.width=Math.round(o.clientWidth*r),o.height=Math.round(o.clientHeight*r),e.viewport(0,0,o.width,o.height);const c=o.width*.9/T*2**(-2*(1-Math.cos(t/2500)));e.uniform2f(F,2*c/o.width,2*c/o.height),e.uniform1f(C,a.pxrangeEm*c),e.clearColor(.06,.07,.09,1),e.clear(e.COLOR_BUFFER_BIT),e.drawArrays(e.TRIANGLES,0,A.length*6),requestAnimationFrame(v)}requestAnimationFrame(v);
