import{A as C}from"./atlas-gen-CAGEH7pT.js";import{p as L}from"./svg-68QKeIWm.js";const D={heart:`<svg viewBox="0 0 24 24">
    <path fill="#e5484d" d="M12 21 3.5 12.5A5 5 0 0 1 12 6a5 5 0 0 1 8.5 6.5Z"/>
    <ellipse fill="white" opacity="0.5" cx="7.5" cy="10" rx="2" ry="1.4"/></svg>`,star:`<svg viewBox="0 0 24 24">
    <polygon fill="hsl(40 92% 52%)" points="12 2 15 9 22 9.5 16.5 14 18.5 21 12 17 5.5 21 7.5 14 2 9.5 9 9"/></svg>`,ring:`<svg viewBox="0 0 24 24">
    <path fill="#12a594" fill-rule="evenodd" d="M12 2a10 10 0 1 0 0 20a10 10 0 1 0 0-20zm0 5a5 5 0 1 1 0 10a5 5 0 1 1 0-10z"/>
    <circle fill="#f4ecdb" cx="12" cy="12" r="2.5"/></svg>`,arrow:`<svg viewBox="0 0 36 24">
    <path fill="#3e63dd" d="M2 10h20V4l12 8-12 8v-6H2z"/>
    <rect fill="rgb(141 164 239)" x="2" y="10" width="20" height="2"/></svg>`},T=.25,h=new OffscreenCanvas(1,1).getContext("2d",{willReadFrequently:!0});function F(t,a){h.clearRect(0,0,1,1),h.fillStyle="#000",h.fillStyle=t,h.fillRect(0,0,1,1);const[o=0,n=0,v=0,l=0]=h.getImageData(0,0,1,1).data;return[o/255,n/255,v/255,l/255*a]}const B=`#version 300 es
in vec4 aVertex;     // xy: position in icon heights, zw: atlas uv
in vec4 aColor;      // the layer's fill colour and opacity
uniform vec2 uScale; // icon heights -> clip space
out vec2 vUv;
out vec4 vColor;
void main() {
  vUv = aVertex.zw;
  vColor = aColor;
  gl_Position = vec4(aVertex.xy * uScale, 0.0, 1.0);
}`,M=`#version 300 es
precision highp float;
uniform sampler2D uAtlas;
uniform float uScreenPxRange;
in vec2 vUv;
in vec4 vColor;
out vec4 color;
float median(float a, float b, float c) { return max(min(a, b), min(max(a, b), c)); }
void main() {
  vec3 s = texture(uAtlas, vUv).rgb;
  float opacity = clamp(uScreenPxRange * (median(s.r, s.g, s.b) - 0.5) + 0.5, 0.0, 1.0);
  color = vec4(vColor.rgb, vColor.a * opacity);
}`,A=Object.entries(D).map(([t,a])=>({name:t,...L(a)})),i=new C(null,{pixelsPerEm:64,pxrange:8}),_=A.reduce((t,a)=>t+a.width,0)+T*(A.length-1);let p=-_/2;const w=A.flatMap(t=>{const a=p;return p+=t.width+T,t.layers.map((o,n)=>({key:`${t.name}:${n}`,layer:o,x:a}))}),R=i.shapes(w.map(t=>[t.key,t.layer.shape])),y=new Float32Array(R.length*48);R.forEach((t,a)=>{const{layer:o,x:n}=w[a],v=F(o.color,o.opacity),l=n+t.planeLeft,f=n+t.planeRight,u=t.planeBottom-.5,x=t.planeTop-.5,m=t.x/i.width,E=(t.x+t.w)/i.width,d=t.y/i.height,g=(t.y+t.h)/i.height,U=[l,u,m,g,f,u,E,g,l,x,m,d,l,x,m,d,f,u,E,g,f,x,E,d];for(let s=0;s<6;s++)y.set([...U.slice(s*4,s*4+4),...v],(a*6+s)*8)});const r=document.querySelector("canvas"),e=r.getContext("webgl2");if(!e)throw new Error("WebGL2 is not available in this browser");const c=e.createProgram();for(const[t,a]of[[e.VERTEX_SHADER,B],[e.FRAGMENT_SHADER,M]]){const o=e.createShader(t);e.shaderSource(o,a),e.compileShader(o),e.attachShader(c,o)}e.linkProgram(c);e.useProgram(c);e.bindBuffer(e.ARRAY_BUFFER,e.createBuffer());e.bufferData(e.ARRAY_BUFFER,y,e.STATIC_DRAW);const S=e.getAttribLocation(c,"aVertex");e.enableVertexAttribArray(S);e.vertexAttribPointer(S,4,e.FLOAT,!1,32,0);const b=e.getAttribLocation(c,"aColor");e.enableVertexAttribArray(b);e.vertexAttribPointer(b,4,e.FLOAT,!1,32,16);e.bindTexture(e.TEXTURE_2D,e.createTexture());e.texImage2D(e.TEXTURE_2D,0,e.RGBA8,i.width,i.height,0,e.RGBA,e.UNSIGNED_BYTE,i.texture);e.texParameteri(e.TEXTURE_2D,e.TEXTURE_MIN_FILTER,e.LINEAR);e.texParameteri(e.TEXTURE_2D,e.TEXTURE_MAG_FILTER,e.LINEAR);e.texParameteri(e.TEXTURE_2D,e.TEXTURE_WRAP_S,e.CLAMP_TO_EDGE);e.texParameteri(e.TEXTURE_2D,e.TEXTURE_WRAP_T,e.CLAMP_TO_EDGE);e.enable(e.BLEND);e.blendFuncSeparate(e.SRC_ALPHA,e.ONE_MINUS_SRC_ALPHA,e.ONE,e.ONE_MINUS_SRC_ALPHA);const I=e.getUniformLocation(c,"uScale"),N=e.getUniformLocation(c,"uScreenPxRange");function P(t){const a=window.devicePixelRatio||1;r.width=Math.round(r.clientWidth*a),r.height=Math.round(r.clientHeight*a),e.viewport(0,0,r.width,r.height);const n=Math.min(r.width*.9/_,r.height*.8)*2**(-2*(1-Math.cos(t/2500)));e.uniform2f(I,2*n/r.width,2*n/r.height),e.uniform1f(N,i.pxrangeEm*n),e.clearColor(.06,.07,.09,1),e.clear(e.COLOR_BUFFER_BIT),e.drawArrays(e.TRIANGLES,0,R.length*6),requestAnimationFrame(P)}requestAnimationFrame(P);
