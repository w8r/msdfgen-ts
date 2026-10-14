import{F as yg,A as Mg}from"./atlas-gen-C6JU4zlt.js";/**
 * @license
 * Copyright 2010-2026 Three.js Authors
 * SPDX-License-Identifier: MIT
 */const Rl="186",Eg={LEFT:0,MIDDLE:1,RIGHT:2,ROTATE:0,DOLLY:1,PAN:2},Sg={ROTATE:0,PAN:1,DOLLY_PAN:2,DOLLY_ROTATE:3},Dp=0,Mh=1,Pp=2,wg=3,bg=0,kr=1,Lp=2,Xs=3,Pi=0,an=1,Fn=2,jn=0,tr=1,Eh=2,Sh=3,wh=4,Fp=5,Cg=6,ss=100,Up=101,Np=102,Op=103,Gp=104,kp=200,Qp=201,zp=202,Hp=203,$h=204,jh=205,Vp=206,Wp=207,Yp=208,Xp=209,qp=210,Kp=211,Jp=212,Zp=213,$p=214,Uo=0,No=1,Oo=2,rr=3,Go=4,ko=5,Qo=6,zo=7,_a=0,jp=1,tA=2,Nn=0,tu=1,eu=2,nu=3,iu=4,su=5,ru=6,au=7,bh="attached",eA="detached",Dl=300,ti=301,Li=302,Qr=303,zr=304,pr=306,jr=1e3,Ke=1001,ta=1002,be=1003,ou=1004,Tg=1004,qs=1005,Bg=1005,xe=1006,Hr=1007,Ig=1007,Kn=1008,Rg=1008,en=1009,lu=1010,cu=1011,ar=1012,Pl=1013,Tn=1014,sn=1015,Gn=1016,Ll=1017,Fl=1018,or=1020,hu=35902,uu=35899,fu=1021,du=1022,Je=1023,ei=1026,Ii=1027,Ul=1028,va=1029,Fi=1030,Nl=1031,Dg=1032,Ol=1033,Vr=33776,Wr=33777,Yr=33778,Xr=33779,Ho=35840,Vo=35841,Wo=35842,Yo=35843,Xo=36196,qo=37492,Ko=37496,Jo=37488,Zo=37489,ea=37490,$o=37491,jo=37808,tl=37809,el=37810,nl=37811,il=37812,sl=37813,rl=37814,al=37815,ol=37816,ll=37817,cl=37818,hl=37819,ul=37820,fl=37821,dl=36492,pl=36494,Al=36495,ml=36283,gl=36284,na=36285,xl=36286,nA=2200,iA=2201,sA=2202,ia=2300,_l=2301,Bo=2302,Ch=2303,os=2400,ls=2401,sa=2402,Gl=2500,pu=2501,Pg=0,Lg=1,Fg=2,rA=3200,Ug=3201,Ng=3202,Og=3203,mi=0,aA=1,Xn="",un="srgb",ra="srgb-linear",aa="linear",pe="srgb",Gg="",kg="rg",Qg="ga",zg=0,Io=7680,Hg=7681,Vg=7682,Wg=7683,Yg=34055,Xg=34056,qg=5386,Kg=512,Jg=513,Zg=514,$g=515,jg=516,t0=517,e0=518,oA=519,lA=512,cA=513,hA=514,kl=515,uA=516,fA=517,Ql=518,dA=519,zl=35044,n0=35048,i0=35040,s0=35045,r0=35049,a0=35041,o0=35046,l0=35050,c0=35042,h0="100",Th="300 es",vn=2e3,us=2001,u0={COMPUTE:"compute",RENDER:"render"},f0={PERSPECTIVE:"perspective",LINEAR:"linear",FLAT:"flat"},d0={NORMAL:"normal",CENTROID:"centroid",SAMPLE:"sample",FIRST:"first",EITHER:"either"},p0={TEXTURE_COMPARE:"depthTextureCompare"},A0={NONE:0,SHARED:1,FULL:2};function m0(i){for(let t=i.length-1;t>=0;--t)if(i[t]>=65535)return!0;return!1}const g0={Int8Array,Uint8Array,Uint8ClampedArray,Int16Array,Uint16Array,Int32Array,Uint32Array,Float32Array,Float64Array};function Ks(i,t){return new g0[i](t)}function pA(i){return ArrayBuffer.isView(i)&&!(i instanceof DataView)}function oa(i){return document.createElementNS("http://www.w3.org/1999/xhtml",i)}function AA(){const i=oa("canvas");return i.style.display="block",i}const hf={};let Ui=null;function x0(i){Ui=i}function _0(){return Ui}function la(...i){const t="THREE."+i.shift();Ui?Ui("log",t,...i):console.log(t,...i)}function mA(i){const t=i[0];if(typeof t=="string"&&t.startsWith("TSL:")){const e=i[1];e&&e.isStackTrace?i[0]+=" "+e.getLocation():i[1]='Stack trace not available. Enable "THREE.Node.captureStackTrace" to capture stack traces.'}return i}function _t(...i){i=mA(i);const t="THREE."+i.shift();if(Ui)Ui("warn",t,...i);else{const e=i[0];e&&e.isStackTrace?console.warn(e.getError(t)):console.warn(t,...i)}}function Ht(...i){i=mA(i);const t="THREE."+i.shift();if(Ui)Ui("error",t,...i);else{const e=i[0];e&&e.isStackTrace?console.error(e.getError(t)):console.error(t,...i)}}function di(...i){const t=i.join(" ");t in hf||(hf[t]=!0,_t(...i))}function v0(i,t,e){return new Promise(function(n,s){function r(){switch(i.clientWaitSync(t,i.SYNC_FLUSH_COMMANDS_BIT,0)){case i.WAIT_FAILED:s();break;case i.TIMEOUT_EXPIRED:setTimeout(r,e);break;default:n()}}setTimeout(r,e)})}const y0={[Uo]:No,[Oo]:Qo,[Go]:zo,[rr]:ko,[No]:Uo,[Qo]:Oo,[zo]:Go,[ko]:rr};class zn{addEventListener(t,e){this._listeners===void 0&&(this._listeners={});const n=this._listeners;n[t]===void 0&&(n[t]=[]),n[t].indexOf(e)===-1&&n[t].push(e)}hasEventListener(t,e){const n=this._listeners;return n===void 0?!1:n[t]!==void 0&&n[t].indexOf(e)!==-1}removeEventListener(t,e){const n=this._listeners;if(n===void 0)return;const s=n[t];if(s!==void 0){const r=s.indexOf(e);r!==-1&&s.splice(r,1)}}dispatchEvent(t){const e=this._listeners;if(e===void 0)return;const n=e[t.type];if(n!==void 0){t.target=this;const s=n.slice(0);for(let r=0,a=s.length;r<a;r++)s[r].call(this,t);t.target=null}}}const Ve=["00","01","02","03","04","05","06","07","08","09","0a","0b","0c","0d","0e","0f","10","11","12","13","14","15","16","17","18","19","1a","1b","1c","1d","1e","1f","20","21","22","23","24","25","26","27","28","29","2a","2b","2c","2d","2e","2f","30","31","32","33","34","35","36","37","38","39","3a","3b","3c","3d","3e","3f","40","41","42","43","44","45","46","47","48","49","4a","4b","4c","4d","4e","4f","50","51","52","53","54","55","56","57","58","59","5a","5b","5c","5d","5e","5f","60","61","62","63","64","65","66","67","68","69","6a","6b","6c","6d","6e","6f","70","71","72","73","74","75","76","77","78","79","7a","7b","7c","7d","7e","7f","80","81","82","83","84","85","86","87","88","89","8a","8b","8c","8d","8e","8f","90","91","92","93","94","95","96","97","98","99","9a","9b","9c","9d","9e","9f","a0","a1","a2","a3","a4","a5","a6","a7","a8","a9","aa","ab","ac","ad","ae","af","b0","b1","b2","b3","b4","b5","b6","b7","b8","b9","ba","bb","bc","bd","be","bf","c0","c1","c2","c3","c4","c5","c6","c7","c8","c9","ca","cb","cc","cd","ce","cf","d0","d1","d2","d3","d4","d5","d6","d7","d8","d9","da","db","dc","dd","de","df","e0","e1","e2","e3","e4","e5","e6","e7","e8","e9","ea","eb","ec","ed","ee","ef","f0","f1","f2","f3","f4","f5","f6","f7","f8","f9","fa","fb","fc","fd","fe","ff"];let uf=1234567;const hs=Math.PI/180,lr=180/Math.PI;function yn(){const i=Math.random()*4294967295|0,t=Math.random()*4294967295|0,e=Math.random()*4294967295|0,n=Math.random()*4294967295|0;return(Ve[i&255]+Ve[i>>8&255]+Ve[i>>16&255]+Ve[i>>24&255]+"-"+Ve[t&255]+Ve[t>>8&255]+"-"+Ve[t>>16&15|64]+Ve[t>>24&255]+"-"+Ve[e&63|128]+Ve[e>>8&255]+"-"+Ve[e>>16&255]+Ve[e>>24&255]+Ve[n&255]+Ve[n>>8&255]+Ve[n>>16&255]+Ve[n>>24&255]).toLowerCase()}function Xt(i,t,e){return Math.max(t,Math.min(e,i))}function Au(i,t){return(i%t+t)%t}function M0(i,t,e,n,s){return n+(i-t)*(s-n)/(e-t)}function E0(i,t,e){return i!==t?(e-i)/(t-i):0}function qr(i,t,e){return(1-e)*i+e*t}function S0(i,t,e,n){return qr(i,t,1-Math.exp(-e*n))}function w0(i,t=1){return t-Math.abs(Au(i,t*2)-t)}function b0(i,t,e){return i<=t?0:i>=e?1:(i=(i-t)/(e-t),i*i*(3-2*i))}function C0(i,t,e){return i<=t?0:i>=e?1:(i=(i-t)/(e-t),i*i*i*(i*(i*6-15)+10))}function T0(i,t){return i+Math.floor(Math.random()*(t-i+1))}function B0(i,t){return i+Math.random()*(t-i)}function I0(i){return i*(.5-Math.random())}function R0(i){i!==void 0&&(uf=i);let t=uf+=1831565813;return t=Math.imul(t^t>>>15,t|1),t^=t+Math.imul(t^t>>>7,t|61),((t^t>>>14)>>>0)/4294967296}function D0(i){return i*hs}function P0(i){return i*lr}function L0(i){return i>0&&Number.isInteger(i)&&2**Math.round(Math.log2(i))===i}function F0(i){return Math.pow(2,Math.ceil(Math.log(i)/Math.LN2))}function U0(i){return Math.pow(2,Math.floor(Math.log(i)/Math.LN2))}function N0(i,t,e,n,s){const r=Math.cos,a=Math.sin,o=r(e/2),l=a(e/2),c=r((t+n)/2),h=a((t+n)/2),f=r((t-n)/2),u=a((t-n)/2),d=r((n-t)/2),p=a((n-t)/2);switch(s){case"XYX":i.set(o*h,l*f,l*u,o*c);break;case"YZY":i.set(l*u,o*h,l*f,o*c);break;case"ZXZ":i.set(l*f,l*u,o*h,o*c);break;case"XZX":i.set(o*h,l*p,l*d,o*c);break;case"YXY":i.set(l*d,o*h,l*p,o*c);break;case"ZYZ":i.set(l*p,l*d,o*h,o*c);break;default:_t("MathUtils: .setQuaternionFromProperEuler() encountered an unknown order: "+s)}}function nn(i,t){switch(t.constructor){case Float32Array:return i;case Uint32Array:return i/4294967295;case Uint16Array:return i/65535;case Uint8Array:case Uint8ClampedArray:return i/255;case Int32Array:return Math.max(i/2147483647,-1);case Int16Array:return Math.max(i/32767,-1);case Int8Array:return Math.max(i/127,-1);default:throw new Error("THREE.MathUtils: Invalid component type.")}}function ee(i,t){switch(t.constructor){case Float32Array:return i;case Uint32Array:return Math.round(i*4294967295);case Uint16Array:return Math.round(i*65535);case Uint8Array:case Uint8ClampedArray:return Math.round(i*255);case Int32Array:return Math.round(i*2147483647);case Int16Array:return Math.round(i*32767);case Int8Array:return Math.round(i*127);default:throw new Error("THREE.MathUtils: Invalid component type.")}}const O0={DEG2RAD:hs,RAD2DEG:lr,generateUUID:yn,clamp:Xt,euclideanModulo:Au,mapLinear:M0,inverseLerp:E0,lerp:qr,damp:S0,pingpong:w0,smoothstep:b0,smootherstep:C0,randInt:T0,randFloat:B0,randFloatSpread:I0,seededRandom:R0,degToRad:D0,radToDeg:P0,isPowerOfTwo:L0,ceilPowerOfTwo:F0,floorPowerOfTwo:U0,setQuaternionFromProperEuler:N0,normalize:ee,denormalize:nn};class lt{static{lt.prototype.isVector2=!0}constructor(t=0,e=0){this.x=t,this.y=e}get width(){return this.x}set width(t){this.x=t}get height(){return this.y}set height(t){this.y=t}set(t,e){return this.x=t,this.y=e,this}setScalar(t){return this.x=t,this.y=t,this}setX(t){return this.x=t,this}setY(t){return this.y=t,this}setComponent(t,e){switch(t){case 0:this.x=e;break;case 1:this.y=e;break;default:throw new Error("THREE.Vector2: index is out of range: "+t)}return this}getComponent(t){switch(t){case 0:return this.x;case 1:return this.y;default:throw new Error("THREE.Vector2: index is out of range: "+t)}}clone(){return new this.constructor(this.x,this.y)}copy(t){return this.x=t.x,this.y=t.y,this}add(t){return this.x+=t.x,this.y+=t.y,this}addScalar(t){return this.x+=t,this.y+=t,this}addVectors(t,e){return this.x=t.x+e.x,this.y=t.y+e.y,this}addScaledVector(t,e){return this.x+=t.x*e,this.y+=t.y*e,this}sub(t){return this.x-=t.x,this.y-=t.y,this}subScalar(t){return this.x-=t,this.y-=t,this}subVectors(t,e){return this.x=t.x-e.x,this.y=t.y-e.y,this}multiply(t){return this.x*=t.x,this.y*=t.y,this}multiplyScalar(t){return this.x*=t,this.y*=t,this}divide(t){return this.x/=t.x,this.y/=t.y,this}divideScalar(t){return this.multiplyScalar(1/t)}applyMatrix3(t){const e=this.x,n=this.y,s=t.elements;return this.x=s[0]*e+s[3]*n+s[6],this.y=s[1]*e+s[4]*n+s[7],this}min(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this}max(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this}clamp(t,e){return this.x=Xt(this.x,t.x,e.x),this.y=Xt(this.y,t.y,e.y),this}clampScalar(t,e){return this.x=Xt(this.x,t,e),this.y=Xt(this.y,t,e),this}clampLength(t,e){const n=this.length();return this.divideScalar(n||1).multiplyScalar(Xt(n,t,e))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this}negate(){return this.x=-this.x,this.y=-this.y,this}dot(t){return this.x*t.x+this.y*t.y}cross(t){return this.x*t.y-this.y*t.x}lengthSq(){return this.x*this.x+this.y*this.y}length(){return Math.sqrt(this.x*this.x+this.y*this.y)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)}normalize(){return this.divideScalar(this.length()||1)}angle(){return Math.atan2(-this.y,-this.x)+Math.PI}angleTo(t){const e=Math.sqrt(this.lengthSq()*t.lengthSq());if(e===0)return Math.PI/2;const n=this.dot(t)/e;return Math.acos(Xt(n,-1,1))}distanceTo(t){return Math.sqrt(this.distanceToSquared(t))}distanceToSquared(t){const e=this.x-t.x,n=this.y-t.y;return e*e+n*n}manhattanDistanceTo(t){return Math.abs(this.x-t.x)+Math.abs(this.y-t.y)}setLength(t){return this.normalize().multiplyScalar(t)}lerp(t,e){return this.x+=(t.x-this.x)*e,this.y+=(t.y-this.y)*e,this}lerpVectors(t,e,n){return this.x=t.x+(e.x-t.x)*n,this.y=t.y+(e.y-t.y)*n,this}equals(t){return t.x===this.x&&t.y===this.y}fromArray(t,e=0){return this.x=t[e],this.y=t[e+1],this}toArray(t=[],e=0){return t[e]=this.x,t[e+1]=this.y,t}fromBufferAttribute(t,e){return this.x=t.getX(e),this.y=t.getY(e),this}rotateAround(t,e){const n=Math.cos(e),s=Math.sin(e),r=this.x-t.x,a=this.y-t.y;return this.x=r*n-a*s+t.x,this.y=r*s+a*n+t.y,this}random(){return this.x=Math.random(),this.y=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y}}class on{constructor(t=0,e=0,n=0,s=1){this.isQuaternion=!0,this._x=t,this._y=e,this._z=n,this._w=s}static slerpFlat(t,e,n,s,r,a,o){let l=n[s+0],c=n[s+1],h=n[s+2],f=n[s+3],u=r[a+0],d=r[a+1],p=r[a+2],g=r[a+3];if(f!==g||l!==u||c!==d||h!==p){let m=l*u+c*d+h*p+f*g;m<0&&(u=-u,d=-d,p=-p,g=-g,m=-m);let A=1-o;if(m<.9995){const v=Math.acos(m),M=Math.sin(v);A=Math.sin(A*v)/M,o=Math.sin(o*v)/M,l=l*A+u*o,c=c*A+d*o,h=h*A+p*o,f=f*A+g*o}else{l=l*A+u*o,c=c*A+d*o,h=h*A+p*o,f=f*A+g*o;const v=1/Math.sqrt(l*l+c*c+h*h+f*f);l*=v,c*=v,h*=v,f*=v}}t[e]=l,t[e+1]=c,t[e+2]=h,t[e+3]=f}static multiplyQuaternionsFlat(t,e,n,s,r,a){const o=n[s],l=n[s+1],c=n[s+2],h=n[s+3],f=r[a],u=r[a+1],d=r[a+2],p=r[a+3];return t[e]=o*p+h*f+l*d-c*u,t[e+1]=l*p+h*u+c*f-o*d,t[e+2]=c*p+h*d+o*u-l*f,t[e+3]=h*p-o*f-l*u-c*d,t}get x(){return this._x}set x(t){this._x=t,this._onChangeCallback()}get y(){return this._y}set y(t){this._y=t,this._onChangeCallback()}get z(){return this._z}set z(t){this._z=t,this._onChangeCallback()}get w(){return this._w}set w(t){this._w=t,this._onChangeCallback()}set(t,e,n,s){return this._x=t,this._y=e,this._z=n,this._w=s,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._w)}copy(t){return this._x=t.x,this._y=t.y,this._z=t.z,this._w=t.w,this._onChangeCallback(),this}setFromEuler(t,e=!0){const n=t._x,s=t._y,r=t._z,a=t._order,o=Math.cos,l=Math.sin,c=o(n/2),h=o(s/2),f=o(r/2),u=l(n/2),d=l(s/2),p=l(r/2);switch(a){case"XYZ":this._x=u*h*f+c*d*p,this._y=c*d*f-u*h*p,this._z=c*h*p+u*d*f,this._w=c*h*f-u*d*p;break;case"YXZ":this._x=u*h*f+c*d*p,this._y=c*d*f-u*h*p,this._z=c*h*p-u*d*f,this._w=c*h*f+u*d*p;break;case"ZXY":this._x=u*h*f-c*d*p,this._y=c*d*f+u*h*p,this._z=c*h*p+u*d*f,this._w=c*h*f-u*d*p;break;case"ZYX":this._x=u*h*f-c*d*p,this._y=c*d*f+u*h*p,this._z=c*h*p-u*d*f,this._w=c*h*f+u*d*p;break;case"YZX":this._x=u*h*f+c*d*p,this._y=c*d*f+u*h*p,this._z=c*h*p-u*d*f,this._w=c*h*f-u*d*p;break;case"XZY":this._x=u*h*f-c*d*p,this._y=c*d*f-u*h*p,this._z=c*h*p+u*d*f,this._w=c*h*f+u*d*p;break;default:_t("Quaternion: .setFromEuler() encountered an unknown order: "+a)}return e===!0&&this._onChangeCallback(),this}setFromAxisAngle(t,e){const n=e/2,s=Math.sin(n);return this._x=t.x*s,this._y=t.y*s,this._z=t.z*s,this._w=Math.cos(n),this._onChangeCallback(),this}setFromRotationMatrix(t){const e=t.elements,n=e[0],s=e[4],r=e[8],a=e[1],o=e[5],l=e[9],c=e[2],h=e[6],f=e[10],u=n+o+f;if(u>0){const d=.5/Math.sqrt(u+1);this._w=.25/d,this._x=(h-l)*d,this._y=(r-c)*d,this._z=(a-s)*d}else if(n>o&&n>f){const d=2*Math.sqrt(1+n-o-f);this._w=(h-l)/d,this._x=.25*d,this._y=(s+a)/d,this._z=(r+c)/d}else if(o>f){const d=2*Math.sqrt(1+o-n-f);this._w=(r-c)/d,this._x=(s+a)/d,this._y=.25*d,this._z=(l+h)/d}else{const d=2*Math.sqrt(1+f-n-o);this._w=(a-s)/d,this._x=(r+c)/d,this._y=(l+h)/d,this._z=.25*d}return this._onChangeCallback(),this}setFromUnitVectors(t,e){let n=t.dot(e)+1;return n<1e-8?(n=0,Math.abs(t.x)>Math.abs(t.z)?(this._x=-t.y,this._y=t.x,this._z=0,this._w=n):(this._x=0,this._y=-t.z,this._z=t.y,this._w=n)):(this._x=t.y*e.z-t.z*e.y,this._y=t.z*e.x-t.x*e.z,this._z=t.x*e.y-t.y*e.x,this._w=n),this.normalize()}angleTo(t){return 2*Math.acos(Math.abs(Xt(this.dot(t),-1,1)))}rotateTowards(t,e){const n=this.angleTo(t);if(n===0)return this;const s=Math.min(1,e/n);return this.slerp(t,s),this}identity(){return this.set(0,0,0,1)}invert(){return this.conjugate()}conjugate(){return this._x*=-1,this._y*=-1,this._z*=-1,this._onChangeCallback(),this}dot(t){return this._x*t._x+this._y*t._y+this._z*t._z+this._w*t._w}lengthSq(){return this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w}length(){return Math.sqrt(this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w)}normalize(){let t=this.length();return t===0?(this._x=0,this._y=0,this._z=0,this._w=1):(t=1/t,this._x=this._x*t,this._y=this._y*t,this._z=this._z*t,this._w=this._w*t),this._onChangeCallback(),this}multiply(t){return this.multiplyQuaternions(this,t)}premultiply(t){return this.multiplyQuaternions(t,this)}multiplyQuaternions(t,e){const n=t._x,s=t._y,r=t._z,a=t._w,o=e._x,l=e._y,c=e._z,h=e._w;return this._x=n*h+a*o+s*c-r*l,this._y=s*h+a*l+r*o-n*c,this._z=r*h+a*c+n*l-s*o,this._w=a*h-n*o-s*l-r*c,this._onChangeCallback(),this}slerp(t,e){let n=t._x,s=t._y,r=t._z,a=t._w,o=this.dot(t);o<0&&(n=-n,s=-s,r=-r,a=-a,o=-o);let l=1-e;if(o<.9995){const c=Math.acos(o),h=Math.sin(c);l=Math.sin(l*c)/h,e=Math.sin(e*c)/h,this._x=this._x*l+n*e,this._y=this._y*l+s*e,this._z=this._z*l+r*e,this._w=this._w*l+a*e,this._onChangeCallback()}else this._x=this._x*l+n*e,this._y=this._y*l+s*e,this._z=this._z*l+r*e,this._w=this._w*l+a*e,this.normalize();return this}slerpQuaternions(t,e,n){return this.copy(t).slerp(e,n)}random(){const t=2*Math.PI*Math.random(),e=2*Math.PI*Math.random(),n=Math.random(),s=Math.sqrt(1-n),r=Math.sqrt(n);return this.set(s*Math.sin(t),s*Math.cos(t),r*Math.sin(e),r*Math.cos(e))}equals(t){return t._x===this._x&&t._y===this._y&&t._z===this._z&&t._w===this._w}fromArray(t,e=0){return this._x=t[e],this._y=t[e+1],this._z=t[e+2],this._w=t[e+3],this._onChangeCallback(),this}toArray(t=[],e=0){return t[e]=this._x,t[e+1]=this._y,t[e+2]=this._z,t[e+3]=this._w,t}fromBufferAttribute(t,e){return this._x=t.getX(e),this._y=t.getY(e),this._z=t.getZ(e),this._w=t.getW(e),this._onChangeCallback(),this}toJSON(){return this.toArray()}_onChange(t){return this._onChangeCallback=t,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._w}}class I{static{I.prototype.isVector3=!0}constructor(t=0,e=0,n=0){this.x=t,this.y=e,this.z=n}set(t,e,n){return n===void 0&&(n=this.z),this.x=t,this.y=e,this.z=n,this}setScalar(t){return this.x=t,this.y=t,this.z=t,this}setX(t){return this.x=t,this}setY(t){return this.y=t,this}setZ(t){return this.z=t,this}setComponent(t,e){switch(t){case 0:this.x=e;break;case 1:this.y=e;break;case 2:this.z=e;break;default:throw new Error("THREE.Vector3: index is out of range: "+t)}return this}getComponent(t){switch(t){case 0:return this.x;case 1:return this.y;case 2:return this.z;default:throw new Error("THREE.Vector3: index is out of range: "+t)}}clone(){return new this.constructor(this.x,this.y,this.z)}copy(t){return this.x=t.x,this.y=t.y,this.z=t.z,this}add(t){return this.x+=t.x,this.y+=t.y,this.z+=t.z,this}addScalar(t){return this.x+=t,this.y+=t,this.z+=t,this}addVectors(t,e){return this.x=t.x+e.x,this.y=t.y+e.y,this.z=t.z+e.z,this}addScaledVector(t,e){return this.x+=t.x*e,this.y+=t.y*e,this.z+=t.z*e,this}sub(t){return this.x-=t.x,this.y-=t.y,this.z-=t.z,this}subScalar(t){return this.x-=t,this.y-=t,this.z-=t,this}subVectors(t,e){return this.x=t.x-e.x,this.y=t.y-e.y,this.z=t.z-e.z,this}multiply(t){return this.x*=t.x,this.y*=t.y,this.z*=t.z,this}multiplyScalar(t){return this.x*=t,this.y*=t,this.z*=t,this}multiplyVectors(t,e){return this.x=t.x*e.x,this.y=t.y*e.y,this.z=t.z*e.z,this}applyEuler(t){return this.applyQuaternion(ff.setFromEuler(t))}applyAxisAngle(t,e){return this.applyQuaternion(ff.setFromAxisAngle(t,e))}applyMatrix3(t){const e=this.x,n=this.y,s=this.z,r=t.elements;return this.x=r[0]*e+r[3]*n+r[6]*s,this.y=r[1]*e+r[4]*n+r[7]*s,this.z=r[2]*e+r[5]*n+r[8]*s,this}applyNormalMatrix(t){return this.applyMatrix3(t).normalize()}applyMatrix4(t){const e=this.x,n=this.y,s=this.z,r=t.elements,a=1/(r[3]*e+r[7]*n+r[11]*s+r[15]);return this.x=(r[0]*e+r[4]*n+r[8]*s+r[12])*a,this.y=(r[1]*e+r[5]*n+r[9]*s+r[13])*a,this.z=(r[2]*e+r[6]*n+r[10]*s+r[14])*a,this}applyQuaternion(t){const e=this.x,n=this.y,s=this.z,r=t.x,a=t.y,o=t.z,l=t.w,c=2*(a*s-o*n),h=2*(o*e-r*s),f=2*(r*n-a*e);return this.x=e+l*c+a*f-o*h,this.y=n+l*h+o*c-r*f,this.z=s+l*f+r*h-a*c,this}project(t){return this.applyMatrix4(t.matrixWorldInverse).applyMatrix4(t.projectionMatrix)}unproject(t){return this.applyMatrix4(t.projectionMatrixInverse).applyMatrix4(t.matrixWorld)}transformDirection(t){const e=this.x,n=this.y,s=this.z,r=t.elements;return this.x=r[0]*e+r[4]*n+r[8]*s,this.y=r[1]*e+r[5]*n+r[9]*s,this.z=r[2]*e+r[6]*n+r[10]*s,this.normalize()}divide(t){return this.x/=t.x,this.y/=t.y,this.z/=t.z,this}divideScalar(t){return this.multiplyScalar(1/t)}min(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this.z=Math.min(this.z,t.z),this}max(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this.z=Math.max(this.z,t.z),this}clamp(t,e){return this.x=Xt(this.x,t.x,e.x),this.y=Xt(this.y,t.y,e.y),this.z=Xt(this.z,t.z,e.z),this}clampScalar(t,e){return this.x=Xt(this.x,t,e),this.y=Xt(this.y,t,e),this.z=Xt(this.z,t,e),this}clampLength(t,e){const n=this.length();return this.divideScalar(n||1).multiplyScalar(Xt(n,t,e))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this}dot(t){return this.x*t.x+this.y*t.y+this.z*t.z}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)}normalize(){return this.divideScalar(this.length()||1)}setLength(t){return this.normalize().multiplyScalar(t)}lerp(t,e){return this.x+=(t.x-this.x)*e,this.y+=(t.y-this.y)*e,this.z+=(t.z-this.z)*e,this}lerpVectors(t,e,n){return this.x=t.x+(e.x-t.x)*n,this.y=t.y+(e.y-t.y)*n,this.z=t.z+(e.z-t.z)*n,this}cross(t){return this.crossVectors(this,t)}crossVectors(t,e){const n=t.x,s=t.y,r=t.z,a=e.x,o=e.y,l=e.z;return this.x=s*l-r*o,this.y=r*a-n*l,this.z=n*o-s*a,this}projectOnVector(t){const e=t.lengthSq();if(e===0)return this.set(0,0,0);const n=t.dot(this)/e;return this.copy(t).multiplyScalar(n)}projectOnPlane(t){return yc.copy(this).projectOnVector(t),this.sub(yc)}reflect(t){return this.sub(yc.copy(t).multiplyScalar(2*this.dot(t)))}angleTo(t){const e=Math.sqrt(this.lengthSq()*t.lengthSq());if(e===0)return Math.PI/2;const n=this.dot(t)/e;return Math.acos(Xt(n,-1,1))}distanceTo(t){return Math.sqrt(this.distanceToSquared(t))}distanceToSquared(t){const e=this.x-t.x,n=this.y-t.y,s=this.z-t.z;return e*e+n*n+s*s}manhattanDistanceTo(t){return Math.abs(this.x-t.x)+Math.abs(this.y-t.y)+Math.abs(this.z-t.z)}setFromSpherical(t){return this.setFromSphericalCoords(t.radius,t.phi,t.theta)}setFromSphericalCoords(t,e,n){const s=Math.sin(e)*t;return this.x=s*Math.sin(n),this.y=Math.cos(e)*t,this.z=s*Math.cos(n),this}setFromCylindrical(t){return this.setFromCylindricalCoords(t.radius,t.theta,t.y)}setFromCylindricalCoords(t,e,n){return this.x=t*Math.sin(e),this.y=n,this.z=t*Math.cos(e),this}setFromMatrixPosition(t){const e=t.elements;return this.x=e[12],this.y=e[13],this.z=e[14],this}setFromMatrixScale(t){const e=this.setFromMatrixColumn(t,0).length(),n=this.setFromMatrixColumn(t,1).length(),s=this.setFromMatrixColumn(t,2).length();return this.x=e,this.y=n,this.z=s,this}setFromMatrixColumn(t,e){return this.fromArray(t.elements,e*4)}setFromMatrix3Column(t,e){return this.fromArray(t.elements,e*3)}setFromEuler(t){return this.x=t._x,this.y=t._y,this.z=t._z,this}setFromColor(t){return this.x=t.r,this.y=t.g,this.z=t.b,this}equals(t){return t.x===this.x&&t.y===this.y&&t.z===this.z}fromArray(t,e=0){return this.x=t[e],this.y=t[e+1],this.z=t[e+2],this}toArray(t=[],e=0){return t[e]=this.x,t[e+1]=this.y,t[e+2]=this.z,t}fromBufferAttribute(t,e){return this.x=t.getX(e),this.y=t.getY(e),this.z=t.getZ(e),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this}randomDirection(){const t=Math.random()*Math.PI*2,e=Math.random()*2-1,n=Math.sqrt(1-e*e);return this.x=n*Math.cos(t),this.y=e,this.z=n*Math.sin(t),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z}}const yc=new I,ff=new on;class jt{static{jt.prototype.isMatrix3=!0}constructor(t,e,n,s,r,a,o,l,c){this.elements=[1,0,0,0,1,0,0,0,1],t!==void 0&&this.set(t,e,n,s,r,a,o,l,c)}set(t,e,n,s,r,a,o,l,c){const h=this.elements;return h[0]=t,h[1]=s,h[2]=o,h[3]=e,h[4]=r,h[5]=l,h[6]=n,h[7]=a,h[8]=c,this}identity(){return this.set(1,0,0,0,1,0,0,0,1),this}copy(t){const e=this.elements,n=t.elements;return e[0]=n[0],e[1]=n[1],e[2]=n[2],e[3]=n[3],e[4]=n[4],e[5]=n[5],e[6]=n[6],e[7]=n[7],e[8]=n[8],this}extractBasis(t,e,n){return t.setFromMatrix3Column(this,0),e.setFromMatrix3Column(this,1),n.setFromMatrix3Column(this,2),this}setFromMatrix4(t){const e=t.elements;return this.set(e[0],e[4],e[8],e[1],e[5],e[9],e[2],e[6],e[10]),this}multiply(t){return this.multiplyMatrices(this,t)}premultiply(t){return this.multiplyMatrices(t,this)}multiplyMatrices(t,e){const n=t.elements,s=e.elements,r=this.elements,a=n[0],o=n[3],l=n[6],c=n[1],h=n[4],f=n[7],u=n[2],d=n[5],p=n[8],g=s[0],m=s[3],A=s[6],v=s[1],M=s[4],x=s[7],S=s[2],E=s[5],C=s[8];return r[0]=a*g+o*v+l*S,r[3]=a*m+o*M+l*E,r[6]=a*A+o*x+l*C,r[1]=c*g+h*v+f*S,r[4]=c*m+h*M+f*E,r[7]=c*A+h*x+f*C,r[2]=u*g+d*v+p*S,r[5]=u*m+d*M+p*E,r[8]=u*A+d*x+p*C,this}multiplyScalar(t){const e=this.elements;return e[0]*=t,e[3]*=t,e[6]*=t,e[1]*=t,e[4]*=t,e[7]*=t,e[2]*=t,e[5]*=t,e[8]*=t,this}determinant(){const t=this.elements,e=t[0],n=t[1],s=t[2],r=t[3],a=t[4],o=t[5],l=t[6],c=t[7],h=t[8];return e*a*h-e*o*c-n*r*h+n*o*l+s*r*c-s*a*l}invert(){const t=this.elements,e=t[0],n=t[1],s=t[2],r=t[3],a=t[4],o=t[5],l=t[6],c=t[7],h=t[8],f=h*a-o*c,u=o*l-h*r,d=c*r-a*l,p=e*f+n*u+s*d;if(p===0)return this.set(0,0,0,0,0,0,0,0,0);const g=1/p;return t[0]=f*g,t[1]=(s*c-h*n)*g,t[2]=(o*n-s*a)*g,t[3]=u*g,t[4]=(h*e-s*l)*g,t[5]=(s*r-o*e)*g,t[6]=d*g,t[7]=(n*l-c*e)*g,t[8]=(a*e-n*r)*g,this}transpose(){let t;const e=this.elements;return t=e[1],e[1]=e[3],e[3]=t,t=e[2],e[2]=e[6],e[6]=t,t=e[5],e[5]=e[7],e[7]=t,this}getNormalMatrix(t){return this.setFromMatrix4(t).invert().transpose()}transposeIntoArray(t){const e=this.elements;return t[0]=e[0],t[1]=e[3],t[2]=e[6],t[3]=e[1],t[4]=e[4],t[5]=e[7],t[6]=e[2],t[7]=e[5],t[8]=e[8],this}setUvTransform(t,e,n,s,r,a,o){const l=Math.cos(r),c=Math.sin(r);return this.set(n*l,n*c,-n*(l*a+c*o)+a+t,-s*c,s*l,-s*(-c*a+l*o)+o+e,0,0,1),this}scale(t,e){return di("Matrix3: .scale() is deprecated. Use .makeScale() instead."),this.premultiply(Mc.makeScale(t,e)),this}rotate(t){return di("Matrix3: .rotate() is deprecated. Use .makeRotation() instead."),this.premultiply(Mc.makeRotation(-t)),this}translate(t,e){return di("Matrix3: .translate() is deprecated. Use .makeTranslation() instead."),this.premultiply(Mc.makeTranslation(t,e)),this}makeTranslation(t,e){return t.isVector2?this.set(1,0,t.x,0,1,t.y,0,0,1):this.set(1,0,t,0,1,e,0,0,1),this}makeRotation(t){const e=Math.cos(t),n=Math.sin(t);return this.set(e,-n,0,n,e,0,0,0,1),this}makeScale(t,e){return this.set(t,0,0,0,e,0,0,0,1),this}equals(t){const e=this.elements,n=t.elements;for(let s=0;s<9;s++)if(e[s]!==n[s])return!1;return!0}fromArray(t,e=0){for(let n=0;n<9;n++)this.elements[n]=t[n+e];return this}toArray(t=[],e=0){const n=this.elements;return t[e]=n[0],t[e+1]=n[1],t[e+2]=n[2],t[e+3]=n[3],t[e+4]=n[4],t[e+5]=n[5],t[e+6]=n[6],t[e+7]=n[7],t[e+8]=n[8],t}clone(){return new this.constructor().fromArray(this.elements)}}const Mc=new jt,df=new jt().set(.4123908,.3575843,.1804808,.212639,.7151687,.0721923,.0193308,.1191948,.9505322),pf=new jt().set(3.2409699,-1.5373832,-.4986108,-.9692436,1.8759675,.0415551,.0556301,-.203977,1.0569715);function G0(){const i={enabled:!0,workingColorSpace:ra,spaces:{},convert:function(s,r,a){return this.enabled===!1||r===a||!r||!a||(this.spaces[r].transfer===pe&&(s.r=pi(s.r),s.g=pi(s.g),s.b=pi(s.b)),this.spaces[r].primaries!==this.spaces[a].primaries&&(s.applyMatrix3(this.spaces[r].toXYZ),s.applyMatrix3(this.spaces[a].fromXYZ)),this.spaces[a].transfer===pe&&(s.r=er(s.r),s.g=er(s.g),s.b=er(s.b))),s},workingToColorSpace:function(s,r){return this.convert(s,this.workingColorSpace,r)},colorSpaceToWorking:function(s,r){return this.convert(s,r,this.workingColorSpace)},getPrimaries:function(s){return this.spaces[s].primaries},getTransfer:function(s){return s===Xn?aa:this.spaces[s].transfer},getToneMappingMode:function(s){return this.spaces[s].outputColorSpaceConfig.toneMappingMode||"standard"},getLuminanceCoefficients:function(s,r=this.workingColorSpace){return s.fromArray(this.spaces[r].luminanceCoefficients)},define:function(s){Object.assign(this.spaces,s)},_getMatrix:function(s,r,a){return s.copy(this.spaces[r].toXYZ).multiply(this.spaces[a].fromXYZ)},_getDrawingBufferColorSpace:function(s){return this.spaces[s].outputColorSpaceConfig.drawingBufferColorSpace},_getUnpackColorSpace:function(s=this.workingColorSpace){return this.spaces[s].workingColorSpaceConfig.unpackColorSpace},fromWorkingColorSpace:function(s,r){return di("ColorManagement: .fromWorkingColorSpace() has been renamed to .workingToColorSpace()."),i.workingToColorSpace(s,r)},toWorkingColorSpace:function(s,r){return di("ColorManagement: .toWorkingColorSpace() has been renamed to .colorSpaceToWorking()."),i.colorSpaceToWorking(s,r)}},t=[.64,.33,.3,.6,.15,.06],e=[.2126,.7152,.0722],n=[.3127,.329];return i.define({[ra]:{primaries:t,whitePoint:n,transfer:aa,toXYZ:df,fromXYZ:pf,luminanceCoefficients:e,workingColorSpaceConfig:{unpackColorSpace:un},outputColorSpaceConfig:{drawingBufferColorSpace:un}},[un]:{primaries:t,whitePoint:n,transfer:pe,toXYZ:df,fromXYZ:pf,luminanceCoefficients:e,outputColorSpaceConfig:{drawingBufferColorSpace:un}}}),i}const ae=G0();function pi(i){return i<.04045?i*.0773993808:Math.pow(i*.9478672986+.0521327014,2.4)}function er(i){return i<.0031308?i*12.92:1.055*Math.pow(i,.41666)-.055}let Es;class gA{static getDataURL(t,e="image/png"){if(/^data:/i.test(t.src)||typeof HTMLCanvasElement>"u")return t.src;let n;if(t instanceof HTMLCanvasElement)n=t;else{Es===void 0&&(Es=oa("canvas")),Es.width=t.width,Es.height=t.height;const s=Es.getContext("2d");t instanceof ImageData?s.putImageData(t,0,0):s.drawImage(t,0,0,t.width,t.height),n=Es}return n.toDataURL(e)}static sRGBToLinear(t){if(typeof HTMLImageElement<"u"&&t instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&t instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&t instanceof ImageBitmap){const e=oa("canvas");e.width=t.width,e.height=t.height;const n=e.getContext("2d");n.drawImage(t,0,0,t.width,t.height);const s=n.getImageData(0,0,t.width,t.height),r=s.data;for(let a=0;a<r.length;a++)r[a]=pi(r[a]/255)*255;return n.putImageData(s,0,0),e}else if(t.data){const e=t.data.slice(0);for(let n=0;n<e.length;n++)e instanceof Uint8Array||e instanceof Uint8ClampedArray?e[n]=Math.floor(pi(e[n]/255)*255):e[n]=pi(e[n]);return{data:e,width:t.width,height:t.height}}else return _t("ImageUtils.sRGBToLinear(): Unsupported image type. No color space conversion applied."),t}}let k0=0;class ui{constructor(t=null){this.isTextureSource=!0,Object.defineProperty(this,"id",{value:k0++}),this.uuid=yn(),this.data=t,this.dataReady=!0,this.version=0}getSize(t){const e=this.data;return typeof HTMLVideoElement<"u"&&e instanceof HTMLVideoElement?t.set(e.videoWidth,e.videoHeight,0):typeof VideoFrame<"u"&&e instanceof VideoFrame?t.set(e.displayWidth,e.displayHeight,0):e!==null?t.set(e.width,e.height,e.depth||0):t.set(0,0,0),t}set needsUpdate(t){t===!0&&this.version++}toJSON(t){const e=t===void 0||typeof t=="string";if(!e&&t.images[this.uuid]!==void 0)return t.images[this.uuid];const n={uuid:this.uuid,url:""},s=this.data;if(s!==null){let r;if(Array.isArray(s)){r=[];for(let a=0,o=s.length;a<o;a++)s[a].isDataTexture?r.push(Ec(s[a].image)):r.push(Ec(s[a]))}else r=Ec(s);n.url=r}return e||(t.images[this.uuid]=n),n}}function Ec(i){return typeof HTMLImageElement<"u"&&i instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&i instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&i instanceof ImageBitmap?gA.getDataURL(i):i.data?{data:Array.from(i.data),width:i.width,height:i.height,type:i.data.constructor.name}:(_t("Texture: Unable to serialize Texture."),{})}class Q0 extends ui{constructor(t=null){di('Source: "Source" has been renamed to "TextureSource". Please update your code to use "THREE.TextureSource" instead.'),super(t),this.isSource=!0}}let z0=0;const Sc=new I;class Me extends zn{constructor(t=Me.DEFAULT_IMAGE,e=Me.DEFAULT_MAPPING,n=Ke,s=Ke,r=xe,a=Kn,o=Je,l=en,c=Me.DEFAULT_ANISOTROPY,h=Xn){super(),this.isTexture=!0,Object.defineProperty(this,"id",{value:z0++}),this.uuid=yn(),this.name="",this.source=new ui(t),this.mipmaps=[],this.mapping=e,this.channel=0,this.wrapS=n,this.wrapT=s,this.magFilter=r,this.minFilter=a,this.anisotropy=c,this.format=o,this.internalFormat=null,this.type=l,this.offset=new lt(0,0),this.repeat=new lt(1,1),this.center=new lt(0,0),this.rotation=0,this.matrixAutoUpdate=!0,this.matrix=new jt,this.generateMipmaps=!0,this.premultiplyAlpha=!1,this.flipY=!0,this.unpackAlignment=4,this.colorSpace=h,this.userData={},this.updateRanges=[],this.version=0,this.onUpdate=null,this.renderTarget=null,this.isRenderTargetTexture=!1,this.isArrayTexture=!!(t&&t.depth&&t.depth>1),this.pmremVersion=0,this.normalized=!1}get width(){return this.source.getSize(Sc).x}get height(){return this.source.getSize(Sc).y}get depth(){return this.source.getSize(Sc).z}get image(){return this.source.data}set image(t){this.source.data=t}updateMatrix(){this.matrix.setUvTransform(this.offset.x,this.offset.y,this.repeat.x,this.repeat.y,this.rotation,this.center.x,this.center.y)}addUpdateRange(t,e){this.updateRanges.push({start:t,count:e})}clearUpdateRanges(){this.updateRanges.length=0}clone(){return new this.constructor().copy(this)}copy(t){return this.name=t.name,this.source=t.source,this.mipmaps=t.mipmaps.slice(0),this.mapping=t.mapping,this.channel=t.channel,this.wrapS=t.wrapS,this.wrapT=t.wrapT,this.magFilter=t.magFilter,this.minFilter=t.minFilter,this.anisotropy=t.anisotropy,this.format=t.format,this.internalFormat=t.internalFormat,this.type=t.type,this.normalized=t.normalized,this.offset.copy(t.offset),this.repeat.copy(t.repeat),this.center.copy(t.center),this.rotation=t.rotation,this.matrixAutoUpdate=t.matrixAutoUpdate,this.matrix.copy(t.matrix),this.generateMipmaps=t.generateMipmaps,this.premultiplyAlpha=t.premultiplyAlpha,this.flipY=t.flipY,this.unpackAlignment=t.unpackAlignment,this.colorSpace=t.colorSpace,this.renderTarget=t.renderTarget,this.isRenderTargetTexture=t.isRenderTargetTexture,this.isArrayTexture=t.isArrayTexture,this.userData=JSON.parse(JSON.stringify(t.userData)),this.needsUpdate=!0,this}setValues(t){for(const e in t){const n=t[e];if(n===void 0){_t(`Texture.setValues(): parameter '${e}' has value of undefined.`);continue}const s=this[e];if(s===void 0){_t(`Texture.setValues(): property '${e}' does not exist.`);continue}s&&n&&s.isVector2&&n.isVector2||s&&n&&s.isVector3&&n.isVector3||s&&n&&s.isMatrix3&&n.isMatrix3?s.copy(n):this[e]=n}}toJSON(t){const e=t===void 0||typeof t=="string";if(!e&&t.textures[this.uuid]!==void 0)return t.textures[this.uuid];const n={metadata:{version:4.7,type:"Texture",generator:"Texture.toJSON"},uuid:this.uuid,name:this.name,image:this.source.toJSON(t).uuid,mapping:this.mapping,channel:this.channel,repeat:[this.repeat.x,this.repeat.y],offset:[this.offset.x,this.offset.y],center:[this.center.x,this.center.y],rotation:this.rotation,wrap:[this.wrapS,this.wrapT],format:this.format,internalFormat:this.internalFormat,type:this.type,normalized:this.normalized,colorSpace:this.colorSpace,minFilter:this.minFilter,magFilter:this.magFilter,anisotropy:this.anisotropy,flipY:this.flipY,generateMipmaps:this.generateMipmaps,premultiplyAlpha:this.premultiplyAlpha,unpackAlignment:this.unpackAlignment};return Object.keys(this.userData).length>0&&(n.userData=this.userData),e||(t.textures[this.uuid]=n),n}dispose(){this.dispatchEvent({type:"dispose"})}transformUv(t){if(this.mapping!==Dl)return t;if(t.applyMatrix3(this.matrix),t.x<0||t.x>1)switch(this.wrapS){case jr:t.x=t.x-Math.floor(t.x);break;case Ke:t.x=t.x<0?0:1;break;case ta:Math.abs(Math.floor(t.x)%2)===1?t.x=Math.ceil(t.x)-t.x:t.x=t.x-Math.floor(t.x);break}if(t.y<0||t.y>1)switch(this.wrapT){case jr:t.y=t.y-Math.floor(t.y);break;case Ke:t.y=t.y<0?0:1;break;case ta:Math.abs(Math.floor(t.y)%2)===1?t.y=Math.ceil(t.y)-t.y:t.y=t.y-Math.floor(t.y);break}return this.flipY&&(t.y=1-t.y),t}set needsUpdate(t){t===!0&&(this.version++,this.source.needsUpdate=!0)}set needsPMREMUpdate(t){t===!0&&this.pmremVersion++}}Me.DEFAULT_IMAGE=null;Me.DEFAULT_MAPPING=Dl;Me.DEFAULT_ANISOTROPY=1;class Ae{static{Ae.prototype.isVector4=!0}constructor(t=0,e=0,n=0,s=1){this.x=t,this.y=e,this.z=n,this.w=s}get width(){return this.z}set width(t){this.z=t}get height(){return this.w}set height(t){this.w=t}set(t,e,n,s){return this.x=t,this.y=e,this.z=n,this.w=s,this}setScalar(t){return this.x=t,this.y=t,this.z=t,this.w=t,this}setX(t){return this.x=t,this}setY(t){return this.y=t,this}setZ(t){return this.z=t,this}setW(t){return this.w=t,this}setComponent(t,e){switch(t){case 0:this.x=e;break;case 1:this.y=e;break;case 2:this.z=e;break;case 3:this.w=e;break;default:throw new Error("THREE.Vector4: index is out of range: "+t)}return this}getComponent(t){switch(t){case 0:return this.x;case 1:return this.y;case 2:return this.z;case 3:return this.w;default:throw new Error("THREE.Vector4: index is out of range: "+t)}}clone(){return new this.constructor(this.x,this.y,this.z,this.w)}copy(t){return this.x=t.x,this.y=t.y,this.z=t.z,this.w=t.w!==void 0?t.w:1,this}add(t){return this.x+=t.x,this.y+=t.y,this.z+=t.z,this.w+=t.w,this}addScalar(t){return this.x+=t,this.y+=t,this.z+=t,this.w+=t,this}addVectors(t,e){return this.x=t.x+e.x,this.y=t.y+e.y,this.z=t.z+e.z,this.w=t.w+e.w,this}addScaledVector(t,e){return this.x+=t.x*e,this.y+=t.y*e,this.z+=t.z*e,this.w+=t.w*e,this}sub(t){return this.x-=t.x,this.y-=t.y,this.z-=t.z,this.w-=t.w,this}subScalar(t){return this.x-=t,this.y-=t,this.z-=t,this.w-=t,this}subVectors(t,e){return this.x=t.x-e.x,this.y=t.y-e.y,this.z=t.z-e.z,this.w=t.w-e.w,this}multiply(t){return this.x*=t.x,this.y*=t.y,this.z*=t.z,this.w*=t.w,this}multiplyScalar(t){return this.x*=t,this.y*=t,this.z*=t,this.w*=t,this}applyMatrix4(t){const e=this.x,n=this.y,s=this.z,r=this.w,a=t.elements;return this.x=a[0]*e+a[4]*n+a[8]*s+a[12]*r,this.y=a[1]*e+a[5]*n+a[9]*s+a[13]*r,this.z=a[2]*e+a[6]*n+a[10]*s+a[14]*r,this.w=a[3]*e+a[7]*n+a[11]*s+a[15]*r,this}divide(t){return this.x/=t.x,this.y/=t.y,this.z/=t.z,this.w/=t.w,this}divideScalar(t){return this.multiplyScalar(1/t)}setAxisAngleFromQuaternion(t){this.w=2*Math.acos(t.w);const e=Math.sqrt(1-t.w*t.w);return e<1e-4?(this.x=1,this.y=0,this.z=0):(this.x=t.x/e,this.y=t.y/e,this.z=t.z/e),this}setAxisAngleFromRotationMatrix(t){let e,n,s,r;const l=t.elements,c=l[0],h=l[4],f=l[8],u=l[1],d=l[5],p=l[9],g=l[2],m=l[6],A=l[10];if(Math.abs(h-u)<.01&&Math.abs(f-g)<.01&&Math.abs(p-m)<.01){if(Math.abs(h+u)<.1&&Math.abs(f+g)<.1&&Math.abs(p+m)<.1&&Math.abs(c+d+A-3)<.1)return this.set(1,0,0,0),this;e=Math.PI;const M=(c+1)/2,x=(d+1)/2,S=(A+1)/2,E=(h+u)/4,C=(f+g)/4,_=(p+m)/4;return M>x&&M>S?M<.01?(n=0,s=.707106781,r=.707106781):(n=Math.sqrt(M),s=E/n,r=C/n):x>S?x<.01?(n=.707106781,s=0,r=.707106781):(s=Math.sqrt(x),n=E/s,r=_/s):S<.01?(n=.707106781,s=.707106781,r=0):(r=Math.sqrt(S),n=C/r,s=_/r),this.set(n,s,r,e),this}let v=Math.sqrt((m-p)*(m-p)+(f-g)*(f-g)+(u-h)*(u-h));return Math.abs(v)<.001&&(v=1),this.x=(m-p)/v,this.y=(f-g)/v,this.z=(u-h)/v,this.w=Math.acos((c+d+A-1)/2),this}setFromMatrixPosition(t){const e=t.elements;return this.x=e[12],this.y=e[13],this.z=e[14],this.w=e[15],this}min(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this.z=Math.min(this.z,t.z),this.w=Math.min(this.w,t.w),this}max(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this.z=Math.max(this.z,t.z),this.w=Math.max(this.w,t.w),this}clamp(t,e){return this.x=Xt(this.x,t.x,e.x),this.y=Xt(this.y,t.y,e.y),this.z=Xt(this.z,t.z,e.z),this.w=Xt(this.w,t.w,e.w),this}clampScalar(t,e){return this.x=Xt(this.x,t,e),this.y=Xt(this.y,t,e),this.z=Xt(this.z,t,e),this.w=Xt(this.w,t,e),this}clampLength(t,e){const n=this.length();return this.divideScalar(n||1).multiplyScalar(Xt(n,t,e))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this.w=Math.floor(this.w),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this.w=Math.ceil(this.w),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this.w=Math.round(this.w),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this.w=Math.trunc(this.w),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this.w=-this.w,this}dot(t){return this.x*t.x+this.y*t.y+this.z*t.z+this.w*t.w}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)+Math.abs(this.w)}normalize(){return this.divideScalar(this.length()||1)}setLength(t){return this.normalize().multiplyScalar(t)}lerp(t,e){return this.x+=(t.x-this.x)*e,this.y+=(t.y-this.y)*e,this.z+=(t.z-this.z)*e,this.w+=(t.w-this.w)*e,this}lerpVectors(t,e,n){return this.x=t.x+(e.x-t.x)*n,this.y=t.y+(e.y-t.y)*n,this.z=t.z+(e.z-t.z)*n,this.w=t.w+(e.w-t.w)*n,this}equals(t){return t.x===this.x&&t.y===this.y&&t.z===this.z&&t.w===this.w}fromArray(t,e=0){return this.x=t[e],this.y=t[e+1],this.z=t[e+2],this.w=t[e+3],this}toArray(t=[],e=0){return t[e]=this.x,t[e+1]=this.y,t[e+2]=this.z,t[e+3]=this.w,t}fromBufferAttribute(t,e){return this.x=t.getX(e),this.y=t.getY(e),this.z=t.getZ(e),this.w=t.getW(e),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this.w=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z,yield this.w}}class mu extends zn{constructor(t=1,e=1,n={}){super(),n=Object.assign({generateMipmaps:!1,internalFormat:null,minFilter:xe,depthBuffer:!0,stencilBuffer:!1,resolveColorBuffer:!0,resolveDepthBuffer:!0,resolveStencilBuffer:!0,storeMultisampledColorBuffer:!0,storeMultisampledDepthBuffer:!0,storeMultisampledStencilBuffer:!0,depthTexture:null,samples:0,count:1,depth:1,multiview:!1,useArrayDepthTexture:!1},n),this.isRenderTarget=!0,this.width=t,this.height=e,this.depth=n.depth,this.scissor=new Ae(0,0,t,e),this.scissorTest=!1,this.viewport=new Ae(0,0,t,e),this.textures=[];const s={width:t,height:e,depth:n.depth},r=new Me(s),a=n.count;for(let o=0;o<a;o++)this.textures[o]=r.clone(),this.textures[o].isRenderTargetTexture=!0,this.textures[o].renderTarget=this;this._setTextureOptions(n),this.depthBuffer=n.depthBuffer,this.stencilBuffer=n.stencilBuffer,this.resolveColorBuffer=n.resolveColorBuffer,this.resolveDepthBuffer=n.resolveDepthBuffer,this.resolveStencilBuffer=n.resolveStencilBuffer,this.storeMultisampledColorBuffer=n.storeMultisampledColorBuffer,this.storeMultisampledDepthBuffer=n.storeMultisampledDepthBuffer,this.storeMultisampledStencilBuffer=n.storeMultisampledStencilBuffer,this._depthTexture=null,this.depthTexture=n.depthTexture,this.samples=n.samples,this.multiview=n.multiview,this.useArrayDepthTexture=n.useArrayDepthTexture}_setTextureOptions(t={}){const e={minFilter:xe,generateMipmaps:!1,flipY:!1,internalFormat:null};t.mapping!==void 0&&(e.mapping=t.mapping),t.wrapS!==void 0&&(e.wrapS=t.wrapS),t.wrapT!==void 0&&(e.wrapT=t.wrapT),t.wrapR!==void 0&&(e.wrapR=t.wrapR),t.magFilter!==void 0&&(e.magFilter=t.magFilter),t.minFilter!==void 0&&(e.minFilter=t.minFilter),t.format!==void 0&&(e.format=t.format),t.type!==void 0&&(e.type=t.type),t.anisotropy!==void 0&&(e.anisotropy=t.anisotropy),t.colorSpace!==void 0&&(e.colorSpace=t.colorSpace),t.flipY!==void 0&&(e.flipY=t.flipY),t.generateMipmaps!==void 0&&(e.generateMipmaps=t.generateMipmaps),t.internalFormat!==void 0&&(e.internalFormat=t.internalFormat);for(let n=0;n<this.textures.length;n++)this.textures[n].setValues(e)}get texture(){return this.textures[0]}set texture(t){this.textures[0]=t}set depthTexture(t){this._depthTexture!==null&&this._depthTexture.renderTarget===this&&(this._depthTexture.renderTarget=null),t!==null&&t.renderTarget===null&&(t.renderTarget=this),this._depthTexture=t}get depthTexture(){return this._depthTexture}setSize(t,e,n=1){if(this.width!==t||this.height!==e||this.depth!==n){this.width=t,this.height=e,this.depth=n;for(let s=0,r=this.textures.length;s<r;s++)this.textures[s].image.width=t,this.textures[s].image.height=e,this.textures[s].image.depth=n,this.textures[s].isData3DTexture!==!0&&(this.textures[s].isArrayTexture=this.textures[s].image.depth>1);this.dispose()}this.viewport.set(0,0,t,e),this.scissor.set(0,0,t,e)}clone(){return new this.constructor().copy(this)}copy(t){this.width=t.width,this.height=t.height,this.depth=t.depth,this.scissor.copy(t.scissor),this.scissorTest=t.scissorTest,this.viewport.copy(t.viewport),this.textures.length=0;for(let e=0,n=t.textures.length;e<n;e++){this.textures[e]=t.textures[e].clone(),this.textures[e].isRenderTargetTexture=!0,this.textures[e].renderTarget=this;const s=Object.assign({},t.textures[e].image);this.textures[e].source=new ui(s)}if(this.depthBuffer=t.depthBuffer,this.stencilBuffer=t.stencilBuffer,this.resolveColorBuffer=t.resolveColorBuffer,this.resolveDepthBuffer=t.resolveDepthBuffer,this.resolveStencilBuffer=t.resolveStencilBuffer,this.storeMultisampledColorBuffer=t.storeMultisampledColorBuffer,this.storeMultisampledDepthBuffer=t.storeMultisampledDepthBuffer,this.storeMultisampledStencilBuffer=t.storeMultisampledStencilBuffer,t.depthTexture!==null)if(t.depthTexture.renderTarget===t){const e=t.depthTexture.clone();e.renderTarget=null,this.depthTexture=e}else this.depthTexture=t.depthTexture;return this.samples=t.samples,this.multiview=t.multiview,this.useArrayDepthTexture=t.useArrayDepthTexture,this}dispose(){this.dispatchEvent({type:"dispose"})}}class pn extends mu{constructor(t=1,e=1,n={}){super(t,e,n),this.isWebGLRenderTarget=!0}}class Hl extends Me{constructor(t=null,e=1,n=1,s=1){super(null),this.isDataArrayTexture=!0,this.image={data:t,width:e,height:n,depth:s},this.magFilter=be,this.minFilter=be,this.wrapR=Ke,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1,this.layerUpdates=new Set}copy(t){return super.copy(t),this.wrapR=t.wrapR,this}addLayerUpdate(t){this.layerUpdates.add(t)}clearLayerUpdates(){this.layerUpdates.clear()}}class H0 extends pn{constructor(t=1,e=1,n=1,s={}){super(t,e,s),this.isWebGLArrayRenderTarget=!0,this.depth=n,this.texture=new Hl(null,t,e,n),this._setTextureOptions(s),this.texture.isRenderTargetTexture=!0}}class Vl extends Me{constructor(t=null,e=1,n=1,s=1){super(null),this.isData3DTexture=!0,this.image={data:t,width:e,height:n,depth:s},this.magFilter=be,this.minFilter=be,this.wrapR=Ke,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}copy(t){return super.copy(t),this.wrapR=t.wrapR,this}}class V0 extends pn{constructor(t=1,e=1,n=1,s={}){super(t,e,s),this.isWebGL3DRenderTarget=!0,this.depth=n,this.texture=new Vl(null,t,e,n),this._setTextureOptions(s),this.texture.isRenderTargetTexture=!0}}class Kt{static{Kt.prototype.isMatrix4=!0}constructor(t,e,n,s,r,a,o,l,c,h,f,u,d,p,g,m){this.elements=[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1],t!==void 0&&this.set(t,e,n,s,r,a,o,l,c,h,f,u,d,p,g,m)}set(t,e,n,s,r,a,o,l,c,h,f,u,d,p,g,m){const A=this.elements;return A[0]=t,A[4]=e,A[8]=n,A[12]=s,A[1]=r,A[5]=a,A[9]=o,A[13]=l,A[2]=c,A[6]=h,A[10]=f,A[14]=u,A[3]=d,A[7]=p,A[11]=g,A[15]=m,this}identity(){return this.set(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1),this}clone(){return new Kt().fromArray(this.elements)}copy(t){const e=this.elements,n=t.elements;return e[0]=n[0],e[1]=n[1],e[2]=n[2],e[3]=n[3],e[4]=n[4],e[5]=n[5],e[6]=n[6],e[7]=n[7],e[8]=n[8],e[9]=n[9],e[10]=n[10],e[11]=n[11],e[12]=n[12],e[13]=n[13],e[14]=n[14],e[15]=n[15],this}copyPosition(t){const e=this.elements,n=t.elements;return e[12]=n[12],e[13]=n[13],e[14]=n[14],this}setFromMatrix3(t){const e=t.elements;return this.set(e[0],e[3],e[6],0,e[1],e[4],e[7],0,e[2],e[5],e[8],0,0,0,0,1),this}extractBasis(t,e,n){return this.determinantAffine()===0?(t.set(1,0,0),e.set(0,1,0),n.set(0,0,1),this):(t.setFromMatrixColumn(this,0),e.setFromMatrixColumn(this,1),n.setFromMatrixColumn(this,2),this)}makeBasis(t,e,n){return this.set(t.x,e.x,n.x,0,t.y,e.y,n.y,0,t.z,e.z,n.z,0,0,0,0,1),this}extractRotation(t){if(t.determinantAffine()===0)return this.identity();const e=this.elements,n=t.elements,s=1/Ss.setFromMatrixColumn(t,0).length(),r=1/Ss.setFromMatrixColumn(t,1).length(),a=1/Ss.setFromMatrixColumn(t,2).length();return e[0]=n[0]*s,e[1]=n[1]*s,e[2]=n[2]*s,e[3]=0,e[4]=n[4]*r,e[5]=n[5]*r,e[6]=n[6]*r,e[7]=0,e[8]=n[8]*a,e[9]=n[9]*a,e[10]=n[10]*a,e[11]=0,e[12]=0,e[13]=0,e[14]=0,e[15]=1,this}makeRotationFromEuler(t){const e=this.elements,n=t.x,s=t.y,r=t.z,a=Math.cos(n),o=Math.sin(n),l=Math.cos(s),c=Math.sin(s),h=Math.cos(r),f=Math.sin(r);if(t.order==="XYZ"){const u=a*h,d=a*f,p=o*h,g=o*f;e[0]=l*h,e[4]=-l*f,e[8]=c,e[1]=d+p*c,e[5]=u-g*c,e[9]=-o*l,e[2]=g-u*c,e[6]=p+d*c,e[10]=a*l}else if(t.order==="YXZ"){const u=l*h,d=l*f,p=c*h,g=c*f;e[0]=u+g*o,e[4]=p*o-d,e[8]=a*c,e[1]=a*f,e[5]=a*h,e[9]=-o,e[2]=d*o-p,e[6]=g+u*o,e[10]=a*l}else if(t.order==="ZXY"){const u=l*h,d=l*f,p=c*h,g=c*f;e[0]=u-g*o,e[4]=-a*f,e[8]=p+d*o,e[1]=d+p*o,e[5]=a*h,e[9]=g-u*o,e[2]=-a*c,e[6]=o,e[10]=a*l}else if(t.order==="ZYX"){const u=a*h,d=a*f,p=o*h,g=o*f;e[0]=l*h,e[4]=p*c-d,e[8]=u*c+g,e[1]=l*f,e[5]=g*c+u,e[9]=d*c-p,e[2]=-c,e[6]=o*l,e[10]=a*l}else if(t.order==="YZX"){const u=a*l,d=a*c,p=o*l,g=o*c;e[0]=l*h,e[4]=g-u*f,e[8]=p*f+d,e[1]=f,e[5]=a*h,e[9]=-o*h,e[2]=-c*h,e[6]=d*f+p,e[10]=u-g*f}else if(t.order==="XZY"){const u=a*l,d=a*c,p=o*l,g=o*c;e[0]=l*h,e[4]=-f,e[8]=c*h,e[1]=u*f+g,e[5]=a*h,e[9]=d*f-p,e[2]=p*f-d,e[6]=o*h,e[10]=g*f+u}return e[3]=0,e[7]=0,e[11]=0,e[12]=0,e[13]=0,e[14]=0,e[15]=1,this}makeRotationFromQuaternion(t){return this.compose(W0,t,Y0)}lookAt(t,e,n){const s=this.elements;return mn.subVectors(t,e),mn.lengthSq()===0&&(mn.z=1),mn.normalize(),Mi.crossVectors(n,mn),Mi.lengthSq()===0&&(Math.abs(n.z)===1?mn.x+=1e-4:mn.z+=1e-4,mn.normalize(),Mi.crossVectors(n,mn)),Mi.normalize(),La.crossVectors(mn,Mi),s[0]=Mi.x,s[4]=La.x,s[8]=mn.x,s[1]=Mi.y,s[5]=La.y,s[9]=mn.y,s[2]=Mi.z,s[6]=La.z,s[10]=mn.z,this}multiply(t){return this.multiplyMatrices(this,t)}premultiply(t){return this.multiplyMatrices(t,this)}multiplyMatrices(t,e){const n=t.elements,s=e.elements,r=this.elements,a=n[0],o=n[4],l=n[8],c=n[12],h=n[1],f=n[5],u=n[9],d=n[13],p=n[2],g=n[6],m=n[10],A=n[14],v=n[3],M=n[7],x=n[11],S=n[15],E=s[0],C=s[4],_=s[8],b=s[12],B=s[1],P=s[5],U=s[9],k=s[13],L=s[2],O=s[6],q=s[10],Y=s[14],at=s[3],Q=s[7],$=s[11],st=s[15];return r[0]=a*E+o*B+l*L+c*at,r[4]=a*C+o*P+l*O+c*Q,r[8]=a*_+o*U+l*q+c*$,r[12]=a*b+o*k+l*Y+c*st,r[1]=h*E+f*B+u*L+d*at,r[5]=h*C+f*P+u*O+d*Q,r[9]=h*_+f*U+u*q+d*$,r[13]=h*b+f*k+u*Y+d*st,r[2]=p*E+g*B+m*L+A*at,r[6]=p*C+g*P+m*O+A*Q,r[10]=p*_+g*U+m*q+A*$,r[14]=p*b+g*k+m*Y+A*st,r[3]=v*E+M*B+x*L+S*at,r[7]=v*C+M*P+x*O+S*Q,r[11]=v*_+M*U+x*q+S*$,r[15]=v*b+M*k+x*Y+S*st,this}multiplyScalar(t){const e=this.elements;return e[0]*=t,e[4]*=t,e[8]*=t,e[12]*=t,e[1]*=t,e[5]*=t,e[9]*=t,e[13]*=t,e[2]*=t,e[6]*=t,e[10]*=t,e[14]*=t,e[3]*=t,e[7]*=t,e[11]*=t,e[15]*=t,this}determinant(){const t=this.elements,e=t[0],n=t[4],s=t[8],r=t[12],a=t[1],o=t[5],l=t[9],c=t[13],h=t[2],f=t[6],u=t[10],d=t[14],p=t[3],g=t[7],m=t[11],A=t[15],v=l*d-c*u,M=o*d-c*f,x=o*u-l*f,S=a*d-c*h,E=a*u-l*h,C=a*f-o*h;return e*(g*v-m*M+A*x)-n*(p*v-m*S+A*E)+s*(p*M-g*S+A*C)-r*(p*x-g*E+m*C)}determinantAffine(){const t=this.elements,e=t[0],n=t[4],s=t[8],r=t[1],a=t[5],o=t[9],l=t[2],c=t[6],h=t[10];return e*(a*h-o*c)-n*(r*h-o*l)+s*(r*c-a*l)}transpose(){const t=this.elements;let e;return e=t[1],t[1]=t[4],t[4]=e,e=t[2],t[2]=t[8],t[8]=e,e=t[6],t[6]=t[9],t[9]=e,e=t[3],t[3]=t[12],t[12]=e,e=t[7],t[7]=t[13],t[13]=e,e=t[11],t[11]=t[14],t[14]=e,this}setPosition(t,e,n){const s=this.elements;return t.isVector3?(s[12]=t.x,s[13]=t.y,s[14]=t.z):(s[12]=t,s[13]=e,s[14]=n),this}invert(){const t=this.elements,e=t[0],n=t[1],s=t[2],r=t[3],a=t[4],o=t[5],l=t[6],c=t[7],h=t[8],f=t[9],u=t[10],d=t[11],p=t[12],g=t[13],m=t[14],A=t[15],v=e*o-n*a,M=e*l-s*a,x=e*c-r*a,S=n*l-s*o,E=n*c-r*o,C=s*c-r*l,_=h*g-f*p,b=h*m-u*p,B=h*A-d*p,P=f*m-u*g,U=f*A-d*g,k=u*A-d*m,L=v*k-M*U+x*P+S*B-E*b+C*_;if(L===0)return this.set(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0);const O=1/L;return t[0]=(o*k-l*U+c*P)*O,t[1]=(s*U-n*k-r*P)*O,t[2]=(g*C-m*E+A*S)*O,t[3]=(u*E-f*C-d*S)*O,t[4]=(l*B-a*k-c*b)*O,t[5]=(e*k-s*B+r*b)*O,t[6]=(m*x-p*C-A*M)*O,t[7]=(h*C-u*x+d*M)*O,t[8]=(a*U-o*B+c*_)*O,t[9]=(n*B-e*U-r*_)*O,t[10]=(p*E-g*x+A*v)*O,t[11]=(f*x-h*E-d*v)*O,t[12]=(o*b-a*P-l*_)*O,t[13]=(e*P-n*b+s*_)*O,t[14]=(g*M-p*S-m*v)*O,t[15]=(h*S-f*M+u*v)*O,this}scale(t){const e=this.elements,n=t.x,s=t.y,r=t.z;return e[0]*=n,e[4]*=s,e[8]*=r,e[1]*=n,e[5]*=s,e[9]*=r,e[2]*=n,e[6]*=s,e[10]*=r,e[3]*=n,e[7]*=s,e[11]*=r,this}getMaxScaleOnAxis(){const t=this.elements,e=t[0]*t[0]+t[1]*t[1]+t[2]*t[2],n=t[4]*t[4]+t[5]*t[5]+t[6]*t[6],s=t[8]*t[8]+t[9]*t[9]+t[10]*t[10];return Math.sqrt(Math.max(e,n,s))}makeTranslation(t,e,n){return t.isVector3?this.set(1,0,0,t.x,0,1,0,t.y,0,0,1,t.z,0,0,0,1):this.set(1,0,0,t,0,1,0,e,0,0,1,n,0,0,0,1),this}makeRotationX(t){const e=Math.cos(t),n=Math.sin(t);return this.set(1,0,0,0,0,e,-n,0,0,n,e,0,0,0,0,1),this}makeRotationY(t){const e=Math.cos(t),n=Math.sin(t);return this.set(e,0,n,0,0,1,0,0,-n,0,e,0,0,0,0,1),this}makeRotationZ(t){const e=Math.cos(t),n=Math.sin(t);return this.set(e,-n,0,0,n,e,0,0,0,0,1,0,0,0,0,1),this}makeRotationAxis(t,e){const n=Math.cos(e),s=Math.sin(e),r=1-n,a=t.x,o=t.y,l=t.z,c=r*a,h=r*o;return this.set(c*a+n,c*o-s*l,c*l+s*o,0,c*o+s*l,h*o+n,h*l-s*a,0,c*l-s*o,h*l+s*a,r*l*l+n,0,0,0,0,1),this}makeScale(t,e,n){return this.set(t,0,0,0,0,e,0,0,0,0,n,0,0,0,0,1),this}makeShear(t,e,n,s,r,a){return this.set(1,n,r,0,t,1,a,0,e,s,1,0,0,0,0,1),this}compose(t,e,n){const s=this.elements,r=e._x,a=e._y,o=e._z,l=e._w,c=r+r,h=a+a,f=o+o,u=r*c,d=r*h,p=r*f,g=a*h,m=a*f,A=o*f,v=l*c,M=l*h,x=l*f,S=n.x,E=n.y,C=n.z;return s[0]=(1-(g+A))*S,s[1]=(d+x)*S,s[2]=(p-M)*S,s[3]=0,s[4]=(d-x)*E,s[5]=(1-(u+A))*E,s[6]=(m+v)*E,s[7]=0,s[8]=(p+M)*C,s[9]=(m-v)*C,s[10]=(1-(u+g))*C,s[11]=0,s[12]=t.x,s[13]=t.y,s[14]=t.z,s[15]=1,this}decompose(t,e,n){const s=this.elements;t.x=s[12],t.y=s[13],t.z=s[14];const r=this.determinantAffine();if(r===0)return n.set(1,1,1),e.identity(),this;let a=Ss.set(s[0],s[1],s[2]).length();const o=Ss.set(s[4],s[5],s[6]).length(),l=Ss.set(s[8],s[9],s[10]).length();r<0&&(a=-a),In.copy(this);const c=1/a,h=1/o,f=1/l;return In.elements[0]*=c,In.elements[1]*=c,In.elements[2]*=c,In.elements[4]*=h,In.elements[5]*=h,In.elements[6]*=h,In.elements[8]*=f,In.elements[9]*=f,In.elements[10]*=f,e.setFromRotationMatrix(In),n.x=a,n.y=o,n.z=l,this}makePerspective(t,e,n,s,r,a,o=vn,l=!1){const c=this.elements,h=2*r/(e-t),f=2*r/(n-s),u=(e+t)/(e-t),d=(n+s)/(n-s);let p,g;if(l)p=r/(a-r),g=a*r/(a-r);else if(o===vn)p=-(a+r)/(a-r),g=-2*a*r/(a-r);else if(o===us)p=-a/(a-r),g=-a*r/(a-r);else throw new Error("THREE.Matrix4.makePerspective(): Invalid coordinate system: "+o);return c[0]=h,c[4]=0,c[8]=u,c[12]=0,c[1]=0,c[5]=f,c[9]=d,c[13]=0,c[2]=0,c[6]=0,c[10]=p,c[14]=g,c[3]=0,c[7]=0,c[11]=-1,c[15]=0,this}makeOrthographic(t,e,n,s,r,a,o=vn,l=!1){const c=this.elements,h=2/(e-t),f=2/(n-s),u=-(e+t)/(e-t),d=-(n+s)/(n-s);let p,g;if(l)p=1/(a-r),g=a/(a-r);else if(o===vn)p=-2/(a-r),g=-(a+r)/(a-r);else if(o===us)p=-1/(a-r),g=-r/(a-r);else throw new Error("THREE.Matrix4.makeOrthographic(): Invalid coordinate system: "+o);return c[0]=h,c[4]=0,c[8]=0,c[12]=u,c[1]=0,c[5]=f,c[9]=0,c[13]=d,c[2]=0,c[6]=0,c[10]=p,c[14]=g,c[3]=0,c[7]=0,c[11]=0,c[15]=1,this}equals(t){const e=this.elements,n=t.elements;for(let s=0;s<16;s++)if(e[s]!==n[s])return!1;return!0}fromArray(t,e=0){for(let n=0;n<16;n++)this.elements[n]=t[n+e];return this}toArray(t=[],e=0){const n=this.elements;return t[e]=n[0],t[e+1]=n[1],t[e+2]=n[2],t[e+3]=n[3],t[e+4]=n[4],t[e+5]=n[5],t[e+6]=n[6],t[e+7]=n[7],t[e+8]=n[8],t[e+9]=n[9],t[e+10]=n[10],t[e+11]=n[11],t[e+12]=n[12],t[e+13]=n[13],t[e+14]=n[14],t[e+15]=n[15],t}}const Ss=new I,In=new Kt,W0=new I(0,0,0),Y0=new I(1,1,1),Mi=new I,La=new I,mn=new I,Af=new Kt,mf=new on;class kn{constructor(t=0,e=0,n=0,s=kn.DEFAULT_ORDER){this.isEuler=!0,this._x=t,this._y=e,this._z=n,this._order=s}get x(){return this._x}set x(t){this._x=t,this._onChangeCallback()}get y(){return this._y}set y(t){this._y=t,this._onChangeCallback()}get z(){return this._z}set z(t){this._z=t,this._onChangeCallback()}get order(){return this._order}set order(t){this._order=t,this._onChangeCallback()}set(t,e,n,s=this._order){return this._x=t,this._y=e,this._z=n,this._order=s,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._order)}copy(t){return this._x=t._x,this._y=t._y,this._z=t._z,this._order=t._order,this._onChangeCallback(),this}setFromRotationMatrix(t,e=this._order,n=!0){const s=t.elements,r=s[0],a=s[4],o=s[8],l=s[1],c=s[5],h=s[9],f=s[2],u=s[6],d=s[10];switch(e){case"XYZ":this._y=Math.asin(Xt(o,-1,1)),Math.abs(o)<.9999999?(this._x=Math.atan2(-h,d),this._z=Math.atan2(-a,r)):(this._x=Math.atan2(u,c),this._z=0);break;case"YXZ":this._x=Math.asin(-Xt(h,-1,1)),Math.abs(h)<.9999999?(this._y=Math.atan2(o,d),this._z=Math.atan2(l,c)):(this._y=Math.atan2(-f,r),this._z=0);break;case"ZXY":this._x=Math.asin(Xt(u,-1,1)),Math.abs(u)<.9999999?(this._y=Math.atan2(-f,d),this._z=Math.atan2(-a,c)):(this._y=0,this._z=Math.atan2(l,r));break;case"ZYX":this._y=Math.asin(-Xt(f,-1,1)),Math.abs(f)<.9999999?(this._x=Math.atan2(u,d),this._z=Math.atan2(l,r)):(this._x=0,this._z=Math.atan2(-a,c));break;case"YZX":this._z=Math.asin(Xt(l,-1,1)),Math.abs(l)<.9999999?(this._x=Math.atan2(-h,c),this._y=Math.atan2(-f,r)):(this._x=0,this._y=Math.atan2(o,d));break;case"XZY":this._z=Math.asin(-Xt(a,-1,1)),Math.abs(a)<.9999999?(this._x=Math.atan2(u,c),this._y=Math.atan2(o,r)):(this._x=Math.atan2(-h,d),this._y=0);break;default:_t("Euler: .setFromRotationMatrix() encountered an unknown order: "+e)}return this._order=e,n===!0&&this._onChangeCallback(),this}setFromQuaternion(t,e,n){return Af.makeRotationFromQuaternion(t),this.setFromRotationMatrix(Af,e,n)}setFromVector3(t,e=this._order){return this.set(t.x,t.y,t.z,e)}reorder(t){return mf.setFromEuler(this),this.setFromQuaternion(mf,t)}equals(t){return t._x===this._x&&t._y===this._y&&t._z===this._z&&t._order===this._order}fromArray(t){return this._x=t[0],this._y=t[1],this._z=t[2],t[3]!==void 0&&(this._order=t[3]),this._onChangeCallback(),this}toArray(t=[],e=0){return t[e]=this._x,t[e+1]=this._y,t[e+2]=this._z,t[e+3]=this._order,t}_onChange(t){return this._onChangeCallback=t,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._order}}kn.DEFAULT_ORDER="XYZ";class Wl{constructor(){this.mask=1}set(t){this.mask=(1<<t|0)>>>0}enable(t){this.mask|=1<<t|0}enableAll(){this.mask=-1}toggle(t){this.mask^=1<<t|0}disable(t){this.mask&=~(1<<t|0)}disableAll(){this.mask=0}test(t){return(this.mask&t.mask)!==0}isEnabled(t){return(this.mask&(1<<t|0))!==0}}let X0=0;const gf=new I,ws=new on,ii=new Kt,Fa=new I,yr=new I,q0=new I,K0=new on,xf=new I(1,0,0),_f=new I(0,1,0),vf=new I(0,0,1),yf={type:"added"},J0={type:"removed"},bs={type:"childadded",child:null},wc={type:"childremoved",child:null};class he extends zn{constructor(){super(),this.isObject3D=!0,Object.defineProperty(this,"id",{value:X0++}),this.uuid=yn(),this.name="",this.type="Object3D",this.parent=null,this.children=[],this.up=he.DEFAULT_UP.clone();const t=new I,e=new kn,n=new on,s=new I(1,1,1);function r(){n.setFromEuler(e,!1)}function a(){e.setFromQuaternion(n,void 0,!1)}e._onChange(r),n._onChange(a),Object.defineProperties(this,{position:{configurable:!0,enumerable:!0,value:t},rotation:{configurable:!0,enumerable:!0,value:e},quaternion:{configurable:!0,enumerable:!0,value:n},scale:{configurable:!0,enumerable:!0,value:s},modelViewMatrix:{value:new Kt},normalMatrix:{value:new jt}}),this.matrix=new Kt,this.matrixWorld=new Kt,this.matrixAutoUpdate=he.DEFAULT_MATRIX_AUTO_UPDATE,this.matrixWorldAutoUpdate=he.DEFAULT_MATRIX_WORLD_AUTO_UPDATE,this.matrixWorldNeedsUpdate=!1,this.layers=new Wl,this.visible=!0,this.castShadow=!1,this.receiveShadow=!1,this.frustumCulled=!0,this.renderOrder=0,this.animations=[],this.customDepthMaterial=void 0,this.customDistanceMaterial=void 0,this.static=!1,this.userData={},this.pivot=null}onBeforeShadow(){}onAfterShadow(){}onBeforeRender(){}onAfterRender(){}applyMatrix4(t){this.matrixAutoUpdate&&this.updateMatrix(),this.matrix.premultiply(t),this.matrix.decompose(this.position,this.quaternion,this.scale)}applyQuaternion(t){return this.quaternion.premultiply(t),this}setRotationFromAxisAngle(t,e){this.quaternion.setFromAxisAngle(t,e)}setRotationFromEuler(t){this.quaternion.setFromEuler(t,!0)}setRotationFromMatrix(t){this.quaternion.setFromRotationMatrix(t)}setRotationFromQuaternion(t){this.quaternion.copy(t)}rotateOnAxis(t,e){return ws.setFromAxisAngle(t,e),this.quaternion.multiply(ws),this}rotateOnWorldAxis(t,e){return ws.setFromAxisAngle(t,e),this.quaternion.premultiply(ws),this}rotateX(t){return this.rotateOnAxis(xf,t)}rotateY(t){return this.rotateOnAxis(_f,t)}rotateZ(t){return this.rotateOnAxis(vf,t)}translateOnAxis(t,e){return gf.copy(t).applyQuaternion(this.quaternion),this.position.add(gf.multiplyScalar(e)),this}translateX(t){return this.translateOnAxis(xf,t)}translateY(t){return this.translateOnAxis(_f,t)}translateZ(t){return this.translateOnAxis(vf,t)}localToWorld(t){return this.updateWorldMatrix(!0,!1),t.applyMatrix4(this.matrixWorld)}worldToLocal(t){return this.updateWorldMatrix(!0,!1),t.applyMatrix4(ii.copy(this.matrixWorld).invert())}lookAt(t,e,n){t.isVector3?Fa.copy(t):Fa.set(t,e,n);const s=this.parent;this.updateWorldMatrix(!0,!1),yr.setFromMatrixPosition(this.matrixWorld),this.isCamera||this.isLight?ii.lookAt(yr,Fa,this.up):ii.lookAt(Fa,yr,this.up),this.quaternion.setFromRotationMatrix(ii),s&&(ii.extractRotation(s.matrixWorld),ws.setFromRotationMatrix(ii),this.quaternion.premultiply(ws.invert()))}add(t){if(arguments.length>1){for(let e=0;e<arguments.length;e++)this.add(arguments[e]);return this}return t===this?(Ht("Object3D.add: object can't be added as a child of itself.",t),this):(t&&t.isObject3D?(t.removeFromParent(),t.parent=this,this.children.push(t),t.dispatchEvent(yf),bs.child=t,this.dispatchEvent(bs),bs.child=null):Ht("Object3D.add: object not an instance of THREE.Object3D.",t),this)}remove(t){if(arguments.length>1){for(let n=0;n<arguments.length;n++)this.remove(arguments[n]);return this}const e=this.children.indexOf(t);return e!==-1&&(t.parent=null,this.children.splice(e,1),t.dispatchEvent(J0),wc.child=t,this.dispatchEvent(wc),wc.child=null),this}removeFromParent(){const t=this.parent;return t!==null&&t.remove(this),this}clear(){return this.remove(...this.children)}attach(t){return this.updateWorldMatrix(!0,!1),ii.copy(this.matrixWorld).invert(),t.parent!==null&&(t.parent.updateWorldMatrix(!0,!1),ii.multiply(t.parent.matrixWorld)),t.applyMatrix4(ii),t.removeFromParent(),t.parent=this,this.children.push(t),t.updateWorldMatrix(!1,!0),t.dispatchEvent(yf),bs.child=t,this.dispatchEvent(bs),bs.child=null,this}getObjectById(t){return this.getObjectByProperty("id",t)}getObjectByName(t){return this.getObjectByProperty("name",t)}getObjectByProperty(t,e){if(this[t]===e)return this;for(let n=0,s=this.children.length;n<s;n++){const a=this.children[n].getObjectByProperty(t,e);if(a!==void 0)return a}}getObjectsByProperty(t,e,n=[]){this[t]===e&&n.push(this);const s=this.children;for(let r=0,a=s.length;r<a;r++)s[r].getObjectsByProperty(t,e,n);return n}getWorldPosition(t){return this.updateWorldMatrix(!0,!1),t.setFromMatrixPosition(this.matrixWorld)}getWorldQuaternion(t){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(yr,t,q0),t}getWorldScale(t){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(yr,K0,t),t}getWorldDirection(t){this.updateWorldMatrix(!0,!1);const e=this.matrixWorld.elements;return t.set(e[8],e[9],e[10]).normalize()}raycast(){}intersectsFrustum(){}traverse(t){t(this);const e=this.children;for(let n=0,s=e.length;n<s;n++)e[n].traverse(t)}traverseVisible(t){if(this.visible===!1)return;t(this);const e=this.children;for(let n=0,s=e.length;n<s;n++)e[n].traverseVisible(t)}traverseAncestors(t){const e=this.parent;e!==null&&(t(e),e.traverseAncestors(t))}updateMatrix(){this.matrix.compose(this.position,this.quaternion,this.scale);const t=this.pivot;if(t!==null){const e=t.x,n=t.y,s=t.z,r=this.matrix.elements;r[12]+=e-r[0]*e-r[4]*n-r[8]*s,r[13]+=n-r[1]*e-r[5]*n-r[9]*s,r[14]+=s-r[2]*e-r[6]*n-r[10]*s}this.matrixWorldNeedsUpdate=!0}updateMatrixWorld(t){this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||t)&&(this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),this.matrixWorldNeedsUpdate=!1,t=!0);const e=this.children;for(let n=0,s=e.length;n<s;n++)e[n].updateMatrixWorld(t)}updateWorldMatrix(t,e,n=!1){const s=this.parent;if(t===!0&&s!==null&&s.updateWorldMatrix(!0,!1),this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||n)&&(this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),this.matrixWorldNeedsUpdate=!1,n=!0),e===!0){const r=this.children;for(let a=0,o=r.length;a<o;a++)r[a].updateWorldMatrix(!1,!0,n)}}toJSON(t){const e=t===void 0||typeof t=="string",n={};e&&(t={geometries:{},materials:{},textures:{},images:{},shapes:{},skeletons:{},animations:{},nodes:{}},n.metadata={version:4.7,type:"Object",generator:"Object3D.toJSON"});const s={};s.uuid=this.uuid,s.type=this.type,s.name=this.name,s.castShadow=this.castShadow,s.receiveShadow=this.receiveShadow,s.visible=this.visible,s.frustumCulled=this.frustumCulled,s.renderOrder=this.renderOrder,s.static=this.static,s.matrixAutoUpdate=this.matrixAutoUpdate,Object.keys(this.userData).length>0&&(s.userData=this.userData),s.layers=this.layers.mask,s.matrix=this.matrix.toArray(),s.up=this.up.toArray(),this.pivot!==null&&(s.pivot=this.pivot.toArray()),this.morphTargetDictionary!==void 0&&(s.morphTargetDictionary=Object.assign({},this.morphTargetDictionary)),this.morphTargetInfluences!==void 0&&(s.morphTargetInfluences=this.morphTargetInfluences.slice()),this.isInstancedMesh&&(s.type="InstancedMesh",s.count=this.count,s.instanceMatrix=this.instanceMatrix.toJSON(),this.instanceColor!==null&&(s.instanceColor=this.instanceColor.toJSON())),this.isBatchedMesh&&(s.type="BatchedMesh",s.perObjectFrustumCulled=this.perObjectFrustumCulled,s.sortObjects=this.sortObjects,s.drawRanges=this._drawRanges,s.reservedRanges=this._reservedRanges,s.geometryInfo=this._geometryInfo.map(o=>({...o,boundingBox:o.boundingBox?o.boundingBox.toJSON():void 0,boundingSphere:o.boundingSphere?o.boundingSphere.toJSON():void 0})),s.instanceInfo=this._instanceInfo.map(o=>({...o})),s.availableInstanceIds=this._availableInstanceIds.slice(),s.availableGeometryIds=this._availableGeometryIds.slice(),s.nextIndexStart=this._nextIndexStart,s.nextVertexStart=this._nextVertexStart,s.geometryCount=this._geometryCount,s.maxInstanceCount=this._maxInstanceCount,s.maxVertexCount=this._maxVertexCount,s.maxIndexCount=this._maxIndexCount,s.geometryInitialized=this._geometryInitialized,s.matricesTexture=this._matricesTexture.toJSON(t),s.indirectTexture=this._indirectTexture.toJSON(t),this._colorsTexture!==null&&(s.colorsTexture=this._colorsTexture.toJSON(t)),this.boundingSphere!==null&&(s.boundingSphere=this.boundingSphere.toJSON()),this.boundingBox!==null&&(s.boundingBox=this.boundingBox.toJSON()));function r(o,l){return o[l.uuid]===void 0&&(o[l.uuid]=l.toJSON(t)),l.uuid}if(this.isScene)this.background&&(this.background.isColor?s.background=this.background.toJSON():this.background.isTexture&&(s.background=this.background.toJSON(t).uuid)),this.environment&&this.environment.isTexture&&this.environment.isRenderTargetTexture!==!0&&(s.environment=this.environment.toJSON(t).uuid);else if(this.isMesh||this.isLine||this.isPoints){s.geometry=r(t.geometries,this.geometry);const o=this.geometry.parameters;if(o!==void 0&&o.shapes!==void 0){const l=o.shapes;if(Array.isArray(l))for(let c=0,h=l.length;c<h;c++){const f=l[c];r(t.shapes,f)}else r(t.shapes,l)}}if(this.isSkinnedMesh&&(s.bindMode=this.bindMode,s.bindMatrix=this.bindMatrix.toArray(),this.skeleton!==void 0&&(r(t.skeletons,this.skeleton),s.skeleton=this.skeleton.uuid)),this.material!==void 0)if(Array.isArray(this.material)){const o=[];for(let l=0,c=this.material.length;l<c;l++)o.push(r(t.materials,this.material[l]));s.material=o}else s.material=r(t.materials,this.material);if(this.children.length>0){s.children=[];for(let o=0;o<this.children.length;o++)s.children.push(this.children[o].toJSON(t).object)}if(this.animations.length>0){s.animations=[];for(let o=0;o<this.animations.length;o++){const l=this.animations[o];s.animations.push(r(t.animations,l))}}if(e){const o=a(t.geometries),l=a(t.materials),c=a(t.textures),h=a(t.images),f=a(t.shapes),u=a(t.skeletons),d=a(t.animations),p=a(t.nodes);o.length>0&&(n.geometries=o),l.length>0&&(n.materials=l),c.length>0&&(n.textures=c),h.length>0&&(n.images=h),f.length>0&&(n.shapes=f),u.length>0&&(n.skeletons=u),d.length>0&&(n.animations=d),p.length>0&&(n.nodes=p)}return n.object=s,n;function a(o){const l=[];for(const c in o){const h=o[c];delete h.metadata,l.push(h)}return l}}clone(t){return new this.constructor().copy(this,t)}copy(t,e=!0){if(this.name=t.name,this.up.copy(t.up),this.position.copy(t.position),this.rotation.order=t.rotation.order,this.quaternion.copy(t.quaternion),this.scale.copy(t.scale),this.pivot=t.pivot!==null?t.pivot.clone():null,this.matrix.copy(t.matrix),this.matrixWorld.copy(t.matrixWorld),this.matrixAutoUpdate=t.matrixAutoUpdate,this.matrixWorldAutoUpdate=t.matrixWorldAutoUpdate,this.matrixWorldNeedsUpdate=t.matrixWorldNeedsUpdate,this.layers.mask=t.layers.mask,this.visible=t.visible,this.castShadow=t.castShadow,this.receiveShadow=t.receiveShadow,this.frustumCulled=t.frustumCulled,this.renderOrder=t.renderOrder,this.static=t.static,this.animations=t.animations.slice(),this.userData=JSON.parse(JSON.stringify(t.userData)),e===!0)for(let n=0;n<t.children.length;n++){const s=t.children[n];this.add(s.clone())}return this}dispose(){this.dispatchEvent({type:"dispose"})}}he.DEFAULT_UP=new I(0,1,0);he.DEFAULT_MATRIX_AUTO_UPDATE=!0;he.DEFAULT_MATRIX_WORLD_AUTO_UPDATE=!0;class Js extends he{constructor(){super(),this.isGroup=!0,this.type="Group"}}const Z0={type:"move"};class Ro{constructor(){this._targetRay=null,this._grip=null,this._hand=null}getHandSpace(){return this._hand===null&&(this._hand=new Js,this._hand.matrixAutoUpdate=!1,this._hand.visible=!1,this._hand.joints={},this._hand.inputState={pinching:!1}),this._hand}getTargetRaySpace(){return this._targetRay===null&&(this._targetRay=new Js,this._targetRay.matrixAutoUpdate=!1,this._targetRay.visible=!1,this._targetRay.hasLinearVelocity=!1,this._targetRay.linearVelocity=new I,this._targetRay.hasAngularVelocity=!1,this._targetRay.angularVelocity=new I),this._targetRay}getGripSpace(){return this._grip===null&&(this._grip=new Js,this._grip.matrixAutoUpdate=!1,this._grip.visible=!1,this._grip.hasLinearVelocity=!1,this._grip.linearVelocity=new I,this._grip.hasAngularVelocity=!1,this._grip.angularVelocity=new I,this._grip.eventsEnabled=!1),this._grip}dispatchEvent(t){return this._targetRay!==null&&this._targetRay.dispatchEvent(t),this._grip!==null&&this._grip.dispatchEvent(t),this._hand!==null&&this._hand.dispatchEvent(t),this}connect(t){if(t&&t.hand){const e=this._hand;if(e)for(const n of t.hand.values())this._getHandJoint(e,n)}return this.dispatchEvent({type:"connected",data:t}),this}disconnect(t){return this.dispatchEvent({type:"disconnected",data:t}),this._targetRay!==null&&(this._targetRay.visible=!1),this._grip!==null&&(this._grip.visible=!1),this._hand!==null&&(this._hand.visible=!1),this}update(t,e,n){let s=null,r=null,a=null;const o=this._targetRay,l=this._grip,c=this._hand;if(t&&e.session.visibilityState!=="visible-blurred"){if(c&&t.hand){a=!0;for(const g of t.hand.values()){const m=e.getJointPose(g,n),A=this._getHandJoint(c,g);m!==null&&(A.matrix.fromArray(m.transform.matrix),A.matrix.decompose(A.position,A.rotation,A.scale),A.matrixWorldNeedsUpdate=!0,A.jointRadius=m.radius),A.visible=m!==null}const h=c.joints["index-finger-tip"],f=c.joints["thumb-tip"],u=h.position.distanceTo(f.position),d=.02,p=.005;c.inputState.pinching&&u>d+p?(c.inputState.pinching=!1,this.dispatchEvent({type:"pinchend",handedness:t.handedness,target:this})):!c.inputState.pinching&&u<=d-p&&(c.inputState.pinching=!0,this.dispatchEvent({type:"pinchstart",handedness:t.handedness,target:this}))}else l!==null&&t.gripSpace&&(r=e.getPose(t.gripSpace,n),r!==null&&(l.matrix.fromArray(r.transform.matrix),l.matrix.decompose(l.position,l.rotation,l.scale),l.matrixWorldNeedsUpdate=!0,r.linearVelocity?(l.hasLinearVelocity=!0,l.linearVelocity.copy(r.linearVelocity)):l.hasLinearVelocity=!1,r.angularVelocity?(l.hasAngularVelocity=!0,l.angularVelocity.copy(r.angularVelocity)):l.hasAngularVelocity=!1,l.eventsEnabled&&l.dispatchEvent({type:"gripUpdated",data:t,target:this})));o!==null&&(s=e.getPose(t.targetRaySpace,n),s===null&&r!==null&&(s=r),s!==null&&(o.matrix.fromArray(s.transform.matrix),o.matrix.decompose(o.position,o.rotation,o.scale),o.matrixWorldNeedsUpdate=!0,s.linearVelocity?(o.hasLinearVelocity=!0,o.linearVelocity.copy(s.linearVelocity)):o.hasLinearVelocity=!1,s.angularVelocity?(o.hasAngularVelocity=!0,o.angularVelocity.copy(s.angularVelocity)):o.hasAngularVelocity=!1,this.dispatchEvent(Z0)))}return o!==null&&(o.visible=s!==null),l!==null&&(l.visible=r!==null),c!==null&&(c.visible=a!==null),this}_getHandJoint(t,e){if(t.joints[e.jointName]===void 0){const n=new Js;n.matrixAutoUpdate=!1,n.visible=!1,t.joints[e.jointName]=n,t.add(n)}return t.joints[e.jointName]}}const xA={aliceblue:15792383,antiquewhite:16444375,aqua:65535,aquamarine:8388564,azure:15794175,beige:16119260,bisque:16770244,black:0,blanchedalmond:16772045,blue:255,blueviolet:9055202,brown:10824234,burlywood:14596231,cadetblue:6266528,chartreuse:8388352,chocolate:13789470,coral:16744272,cornflowerblue:6591981,cornsilk:16775388,crimson:14423100,cyan:65535,darkblue:139,darkcyan:35723,darkgoldenrod:12092939,darkgray:11119017,darkgreen:25600,darkgrey:11119017,darkkhaki:12433259,darkmagenta:9109643,darkolivegreen:5597999,darkorange:16747520,darkorchid:10040012,darkred:9109504,darksalmon:15308410,darkseagreen:9419919,darkslateblue:4734347,darkslategray:3100495,darkslategrey:3100495,darkturquoise:52945,darkviolet:9699539,deeppink:16716947,deepskyblue:49151,dimgray:6908265,dimgrey:6908265,dodgerblue:2003199,firebrick:11674146,floralwhite:16775920,forestgreen:2263842,fuchsia:16711935,gainsboro:14474460,ghostwhite:16316671,gold:16766720,goldenrod:14329120,gray:8421504,green:32768,greenyellow:11403055,grey:8421504,honeydew:15794160,hotpink:16738740,indianred:13458524,indigo:4915330,ivory:16777200,khaki:15787660,lavender:15132410,lavenderblush:16773365,lawngreen:8190976,lemonchiffon:16775885,lightblue:11393254,lightcoral:15761536,lightcyan:14745599,lightgoldenrodyellow:16448210,lightgray:13882323,lightgreen:9498256,lightgrey:13882323,lightpink:16758465,lightsalmon:16752762,lightseagreen:2142890,lightskyblue:8900346,lightslategray:7833753,lightslategrey:7833753,lightsteelblue:11584734,lightyellow:16777184,lime:65280,limegreen:3329330,linen:16445670,magenta:16711935,maroon:8388608,mediumaquamarine:6737322,mediumblue:205,mediumorchid:12211667,mediumpurple:9662683,mediumseagreen:3978097,mediumslateblue:8087790,mediumspringgreen:64154,mediumturquoise:4772300,mediumvioletred:13047173,midnightblue:1644912,mintcream:16121850,mistyrose:16770273,moccasin:16770229,navajowhite:16768685,navy:128,oldlace:16643558,olive:8421376,olivedrab:7048739,orange:16753920,orangered:16729344,orchid:14315734,palegoldenrod:15657130,palegreen:10025880,paleturquoise:11529966,palevioletred:14381203,papayawhip:16773077,peachpuff:16767673,peru:13468991,pink:16761035,plum:14524637,powderblue:11591910,purple:8388736,rebeccapurple:6697881,red:16711680,rosybrown:12357519,royalblue:4286945,saddlebrown:9127187,salmon:16416882,sandybrown:16032864,seagreen:3050327,seashell:16774638,sienna:10506797,silver:12632256,skyblue:8900331,slateblue:6970061,slategray:7372944,slategrey:7372944,snow:16775930,springgreen:65407,steelblue:4620980,tan:13808780,teal:32896,thistle:14204888,tomato:16737095,turquoise:4251856,violet:15631086,wheat:16113331,white:16777215,whitesmoke:16119285,yellow:16776960,yellowgreen:10145074},Ei={h:0,s:0,l:0},Ua={h:0,s:0,l:0};function bc(i,t,e){return e<0&&(e+=1),e>1&&(e-=1),e<1/6?i+(t-i)*6*e:e<1/2?t:e<2/3?i+(t-i)*6*(2/3-e):i}class bt{constructor(t,e,n){return this.isColor=!0,this.r=1,this.g=1,this.b=1,this.set(t,e,n)}set(t,e,n){if(e===void 0&&n===void 0){const s=t;s&&s.isColor?this.copy(s):typeof s=="number"?this.setHex(s):typeof s=="string"&&this.setStyle(s)}else this.setRGB(t,e,n);return this}setScalar(t){return this.r=t,this.g=t,this.b=t,this}setHex(t,e=un){return t=Math.floor(t),this.r=(t>>16&255)/255,this.g=(t>>8&255)/255,this.b=(t&255)/255,ae.colorSpaceToWorking(this,e),this}setRGB(t,e,n,s=ae.workingColorSpace){return this.r=t,this.g=e,this.b=n,ae.colorSpaceToWorking(this,s),this}setHSL(t,e,n,s=ae.workingColorSpace){if(t=Au(t,1),e=Xt(e,0,1),n=Xt(n,0,1),e===0)this.r=this.g=this.b=n;else{const r=n<=.5?n*(1+e):n+e-n*e,a=2*n-r;this.r=bc(a,r,t+1/3),this.g=bc(a,r,t),this.b=bc(a,r,t-1/3)}return ae.colorSpaceToWorking(this,s),this}setStyle(t,e=un){function n(r){r!==void 0&&parseFloat(r)<1&&_t("Color: Alpha component of "+t+" will be ignored.")}let s;if(s=/^(\w+)\(([^\)]*)\)/.exec(t)){let r;const a=s[1],o=s[2];switch(a){case"rgb":case"rgba":if(r=/^\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return n(r[4]),this.setRGB(Math.min(255,parseInt(r[1],10))/255,Math.min(255,parseInt(r[2],10))/255,Math.min(255,parseInt(r[3],10))/255,e);if(r=/^\s*(\d+)\%\s*,\s*(\d+)\%\s*,\s*(\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return n(r[4]),this.setRGB(Math.min(100,parseInt(r[1],10))/100,Math.min(100,parseInt(r[2],10))/100,Math.min(100,parseInt(r[3],10))/100,e);break;case"hsl":case"hsla":if(r=/^\s*(\d*\.?\d+)\s*,\s*(\d*\.?\d+)\%\s*,\s*(\d*\.?\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return n(r[4]),this.setHSL(parseFloat(r[1])/360,parseFloat(r[2])/100,parseFloat(r[3])/100,e);break;default:_t("Color: Unknown color model "+t)}}else if(s=/^\#([A-Fa-f\d]+)$/.exec(t)){const r=s[1],a=r.length;if(a===3)return this.setRGB(parseInt(r.charAt(0),16)/15,parseInt(r.charAt(1),16)/15,parseInt(r.charAt(2),16)/15,e);if(a===6)return this.setHex(parseInt(r,16),e);_t("Color: Invalid hex color "+t)}else if(t&&t.length>0)return this.setColorName(t,e);return this}setColorName(t,e=un){const n=xA[t.toLowerCase()];return n!==void 0?this.setHex(n,e):_t("Color: Unknown color "+t),this}clone(){return new this.constructor(this.r,this.g,this.b)}copy(t){return this.r=t.r,this.g=t.g,this.b=t.b,this}copySRGBToLinear(t){return this.r=pi(t.r),this.g=pi(t.g),this.b=pi(t.b),this}copyLinearToSRGB(t){return this.r=er(t.r),this.g=er(t.g),this.b=er(t.b),this}convertSRGBToLinear(){return this.copySRGBToLinear(this),this}convertLinearToSRGB(){return this.copyLinearToSRGB(this),this}getHex(t=un){return ae.workingToColorSpace(We.copy(this),t),Math.round(Xt(We.r*255,0,255))*65536+Math.round(Xt(We.g*255,0,255))*256+Math.round(Xt(We.b*255,0,255))}getHexString(t=un){return("000000"+this.getHex(t).toString(16)).slice(-6)}getHSL(t,e=ae.workingColorSpace){ae.workingToColorSpace(We.copy(this),e);const n=We.r,s=We.g,r=We.b,a=Math.max(n,s,r),o=Math.min(n,s,r);let l,c;const h=(o+a)/2;if(o===a)l=0,c=0;else{const f=a-o;switch(c=h<=.5?f/(a+o):f/(2-a-o),a){case n:l=(s-r)/f+(s<r?6:0);break;case s:l=(r-n)/f+2;break;case r:l=(n-s)/f+4;break}l/=6}return t.h=l,t.s=c,t.l=h,t}getRGB(t,e=ae.workingColorSpace){return ae.workingToColorSpace(We.copy(this),e),t.r=We.r,t.g=We.g,t.b=We.b,t}getStyle(t=un){ae.workingToColorSpace(We.copy(this),t);const e=We.r,n=We.g,s=We.b;return t!==un?`color(${t} ${e.toFixed(3)} ${n.toFixed(3)} ${s.toFixed(3)})`:`rgb(${Math.round(e*255)},${Math.round(n*255)},${Math.round(s*255)})`}offsetHSL(t,e,n){return this.getHSL(Ei),this.setHSL(Ei.h+t,Ei.s+e,Ei.l+n)}add(t){return this.r+=t.r,this.g+=t.g,this.b+=t.b,this}addColors(t,e){return this.r=t.r+e.r,this.g=t.g+e.g,this.b=t.b+e.b,this}addScalar(t){return this.r+=t,this.g+=t,this.b+=t,this}sub(t){return this.r=Math.max(0,this.r-t.r),this.g=Math.max(0,this.g-t.g),this.b=Math.max(0,this.b-t.b),this}multiply(t){return this.r*=t.r,this.g*=t.g,this.b*=t.b,this}multiplyScalar(t){return this.r*=t,this.g*=t,this.b*=t,this}lerp(t,e){return this.r+=(t.r-this.r)*e,this.g+=(t.g-this.g)*e,this.b+=(t.b-this.b)*e,this}lerpColors(t,e,n){return this.r=t.r+(e.r-t.r)*n,this.g=t.g+(e.g-t.g)*n,this.b=t.b+(e.b-t.b)*n,this}lerpHSL(t,e){this.getHSL(Ei),t.getHSL(Ua);const n=qr(Ei.h,Ua.h,e),s=qr(Ei.s,Ua.s,e),r=qr(Ei.l,Ua.l,e);return this.setHSL(n,s,r),this}setFromVector3(t){return this.r=t.x,this.g=t.y,this.b=t.z,this}applyMatrix3(t){const e=this.r,n=this.g,s=this.b,r=t.elements;return this.r=r[0]*e+r[3]*n+r[6]*s,this.g=r[1]*e+r[4]*n+r[7]*s,this.b=r[2]*e+r[5]*n+r[8]*s,this}equals(t){return t.r===this.r&&t.g===this.g&&t.b===this.b}fromArray(t,e=0){return this.r=t[e],this.g=t[e+1],this.b=t[e+2],this}toArray(t=[],e=0){return t[e]=this.r,t[e+1]=this.g,t[e+2]=this.b,t}fromBufferAttribute(t,e){return this.r=t.getX(e),this.g=t.getY(e),this.b=t.getZ(e),this}toJSON(){return this.getHex()}*[Symbol.iterator](){yield this.r,yield this.g,yield this.b}}const We=new bt;bt.NAMES=xA;class Yl{constructor(t,e=25e-5){this.isFogExp2=!0,this.name="",this.color=new bt(t),this.density=e}clone(){return new Yl(this.color,this.density)}toJSON(){return{type:"FogExp2",name:this.name,color:this.color.getHex(),density:this.density}}}class Xl{constructor(t,e=1,n=1e3){this.isFog=!0,this.name="",this.color=new bt(t),this.near=e,this.far=n}clone(){return new Xl(this.color,this.near,this.far)}toJSON(){return{type:"Fog",name:this.name,color:this.color.getHex(),near:this.near,far:this.far}}}class _A extends he{constructor(){super(),this.isScene=!0,this.type="Scene",this.background=null,this.environment=null,this.fog=null,this.backgroundBlurriness=0,this.backgroundIntensity=1,this.backgroundRotation=new kn,this.environmentIntensity=1,this.environmentRotation=new kn,this.overrideMaterial=null,typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}copy(t,e){return super.copy(t,e),t.background!==null&&(this.background=t.background.clone()),t.environment!==null&&(this.environment=t.environment.clone()),t.fog!==null&&(this.fog=t.fog.clone()),this.backgroundBlurriness=t.backgroundBlurriness,this.backgroundIntensity=t.backgroundIntensity,this.backgroundRotation.copy(t.backgroundRotation),this.environmentIntensity=t.environmentIntensity,this.environmentRotation.copy(t.environmentRotation),t.overrideMaterial!==null&&(this.overrideMaterial=t.overrideMaterial.clone()),this.matrixAutoUpdate=t.matrixAutoUpdate,this}toJSON(t){const e=super.toJSON(t);return this.fog!==null&&(e.object.fog=this.fog.toJSON()),e.object.backgroundBlurriness=this.backgroundBlurriness,e.object.backgroundIntensity=this.backgroundIntensity,e.object.backgroundRotation=this.backgroundRotation.toArray(),e.object.environmentIntensity=this.environmentIntensity,e.object.environmentRotation=this.environmentRotation.toArray(),e}}const Rn=new I,si=new I,Cc=new I,ri=new I,Cs=new I,Ts=new I,Mf=new I,Tc=new I,Bc=new I,Ic=new I,Rc=new Ae,Dc=new Ae,Pc=new Ae;class fn{constructor(t=new I,e=new I,n=new I){this.a=t,this.b=e,this.c=n}static getNormal(t,e,n,s){s.subVectors(n,e),Rn.subVectors(t,e),s.cross(Rn);const r=s.lengthSq();return r>0?s.multiplyScalar(1/Math.sqrt(r)):s.set(0,0,0)}static getBarycoord(t,e,n,s,r){Rn.subVectors(s,e),si.subVectors(n,e),Cc.subVectors(t,e);const a=Rn.dot(Rn),o=Rn.dot(si),l=Rn.dot(Cc),c=si.dot(si),h=si.dot(Cc),f=a*c-o*o;if(f===0)return r.set(0,0,0),null;const u=1/f,d=(c*l-o*h)*u,p=(a*h-o*l)*u;return r.set(1-d-p,p,d)}static containsPoint(t,e,n,s){return this.getBarycoord(t,e,n,s,ri)===null?!1:ri.x>=0&&ri.y>=0&&ri.x+ri.y<=1}static getInterpolation(t,e,n,s,r,a,o,l){return this.getBarycoord(t,e,n,s,ri)===null?(l.x=0,l.y=0,"z"in l&&(l.z=0),"w"in l&&(l.w=0),null):(l.setScalar(0),l.addScaledVector(r,ri.x),l.addScaledVector(a,ri.y),l.addScaledVector(o,ri.z),l)}static getInterpolatedAttribute(t,e,n,s,r,a){return Rc.setScalar(0),Dc.setScalar(0),Pc.setScalar(0),Rc.fromBufferAttribute(t,e),Dc.fromBufferAttribute(t,n),Pc.fromBufferAttribute(t,s),a.setScalar(0),a.addScaledVector(Rc,r.x),a.addScaledVector(Dc,r.y),a.addScaledVector(Pc,r.z),a}static isFrontFacing(t,e,n,s){return Rn.subVectors(n,e),si.subVectors(t,e),Rn.cross(si).dot(s)<0}set(t,e,n){return this.a.copy(t),this.b.copy(e),this.c.copy(n),this}setFromPointsAndIndices(t,e,n,s){return this.a.copy(t[e]),this.b.copy(t[n]),this.c.copy(t[s]),this}setFromAttributeAndIndices(t,e,n,s){return this.a.fromBufferAttribute(t,e),this.b.fromBufferAttribute(t,n),this.c.fromBufferAttribute(t,s),this}clone(){return new this.constructor().copy(this)}copy(t){return this.a.copy(t.a),this.b.copy(t.b),this.c.copy(t.c),this}getArea(){return Rn.subVectors(this.c,this.b),si.subVectors(this.a,this.b),Rn.cross(si).length()*.5}getMidpoint(t){return t.addVectors(this.a,this.b).add(this.c).multiplyScalar(1/3)}getNormal(t){return fn.getNormal(this.a,this.b,this.c,t)}getPlane(t){return t.setFromCoplanarPoints(this.a,this.b,this.c)}getBarycoord(t,e){return fn.getBarycoord(t,this.a,this.b,this.c,e)}getInterpolation(t,e,n,s,r){return fn.getInterpolation(t,this.a,this.b,this.c,e,n,s,r)}containsPoint(t){return fn.containsPoint(t,this.a,this.b,this.c)}isFrontFacing(t){return fn.isFrontFacing(this.a,this.b,this.c,t)}intersectsBox(t){return t.intersectsTriangle(this)}closestPointToPoint(t,e){const n=this.a,s=this.b,r=this.c;let a,o;Cs.subVectors(s,n),Ts.subVectors(r,n),Tc.subVectors(t,n);const l=Cs.dot(Tc),c=Ts.dot(Tc);if(l<=0&&c<=0)return e.copy(n);Bc.subVectors(t,s);const h=Cs.dot(Bc),f=Ts.dot(Bc);if(h>=0&&f<=h)return e.copy(s);const u=l*f-h*c;if(u<=0&&l>=0&&h<=0)return a=l/(l-h),e.copy(n).addScaledVector(Cs,a);Ic.subVectors(t,r);const d=Cs.dot(Ic),p=Ts.dot(Ic);if(p>=0&&d<=p)return e.copy(r);const g=d*c-l*p;if(g<=0&&c>=0&&p<=0)return o=c/(c-p),e.copy(n).addScaledVector(Ts,o);const m=h*p-d*f;if(m<=0&&f-h>=0&&d-p>=0)return Mf.subVectors(r,s),o=(f-h)/(f-h+(d-p)),e.copy(s).addScaledVector(Mf,o);const A=1/(m+g+u);return a=g*A,o=u*A,e.copy(n).addScaledVector(Cs,a).addScaledVector(Ts,o)}equals(t){return t.a.equals(this.a)&&t.b.equals(this.b)&&t.c.equals(this.c)}}class Ze{constructor(t=new I(1/0,1/0,1/0),e=new I(-1/0,-1/0,-1/0)){this.isBox3=!0,this.min=t,this.max=e}set(t,e){return this.min.copy(t),this.max.copy(e),this}setFromArray(t){this.makeEmpty();for(let e=0,n=t.length;e<n;e+=3)this.expandByPoint(Dn.fromArray(t,e));return this}setFromBufferAttribute(t){this.makeEmpty();for(let e=0,n=t.count;e<n;e++)this.expandByPoint(Dn.fromBufferAttribute(t,e));return this}setFromPoints(t){this.makeEmpty();for(let e=0,n=t.length;e<n;e++)this.expandByPoint(t[e]);return this}setFromCenterAndSize(t,e){const n=Dn.copy(e).multiplyScalar(.5);return this.min.copy(t).sub(n),this.max.copy(t).add(n),this}setFromObject(t,e=!1){return this.makeEmpty(),this.expandByObject(t,e)}clone(){return new this.constructor().copy(this)}copy(t){return this.min.copy(t.min),this.max.copy(t.max),this}makeEmpty(){return this.min.x=this.min.y=this.min.z=1/0,this.max.x=this.max.y=this.max.z=-1/0,this}isEmpty(){return this.max.x<this.min.x||this.max.y<this.min.y||this.max.z<this.min.z}getCenter(t){return this.isEmpty()?t.set(0,0,0):t.addVectors(this.min,this.max).multiplyScalar(.5)}getSize(t){return this.isEmpty()?t.set(0,0,0):t.subVectors(this.max,this.min)}expandByPoint(t){return this.min.min(t),this.max.max(t),this}expandByVector(t){return this.min.sub(t),this.max.add(t),this}expandByScalar(t){return this.min.addScalar(-t),this.max.addScalar(t),this}expandByObject(t,e=!1){t.updateWorldMatrix(!1,!1);const n=t.geometry;if(n!==void 0){const r=n.getAttribute("position");if(e===!0&&r!==void 0&&t.isInstancedMesh!==!0)for(let a=0,o=r.count;a<o;a++)t.isMesh===!0?t.getVertexPosition(a,Dn):Dn.fromBufferAttribute(r,a),Dn.applyMatrix4(t.matrixWorld),this.expandByPoint(Dn);else t.boundingBox!==void 0?(t.boundingBox===null&&t.computeBoundingBox(),Na.copy(t.boundingBox)):(n.boundingBox===null&&n.computeBoundingBox(),Na.copy(n.boundingBox)),Na.applyMatrix4(t.matrixWorld),this.union(Na)}const s=t.children;for(let r=0,a=s.length;r<a;r++)this.expandByObject(s[r],e);return this}containsPoint(t){return t.x>=this.min.x&&t.x<=this.max.x&&t.y>=this.min.y&&t.y<=this.max.y&&t.z>=this.min.z&&t.z<=this.max.z}containsBox(t){return this.min.x<=t.min.x&&t.max.x<=this.max.x&&this.min.y<=t.min.y&&t.max.y<=this.max.y&&this.min.z<=t.min.z&&t.max.z<=this.max.z}getParameter(t,e){return e.set((t.x-this.min.x)/(this.max.x-this.min.x),(t.y-this.min.y)/(this.max.y-this.min.y),(t.z-this.min.z)/(this.max.z-this.min.z))}intersectsBox(t){return t.max.x>=this.min.x&&t.min.x<=this.max.x&&t.max.y>=this.min.y&&t.min.y<=this.max.y&&t.max.z>=this.min.z&&t.min.z<=this.max.z}intersectsSphere(t){return this.clampPoint(t.center,Dn),Dn.distanceToSquared(t.center)<=t.radius*t.radius}intersectsPlane(t){let e,n;return t.normal.x>0?(e=t.normal.x*this.min.x,n=t.normal.x*this.max.x):(e=t.normal.x*this.max.x,n=t.normal.x*this.min.x),t.normal.y>0?(e+=t.normal.y*this.min.y,n+=t.normal.y*this.max.y):(e+=t.normal.y*this.max.y,n+=t.normal.y*this.min.y),t.normal.z>0?(e+=t.normal.z*this.min.z,n+=t.normal.z*this.max.z):(e+=t.normal.z*this.max.z,n+=t.normal.z*this.min.z),e<=-t.constant&&n>=-t.constant}intersectsTriangle(t){if(this.isEmpty())return!1;this.getCenter(Mr),Oa.subVectors(this.max,Mr),Bs.subVectors(t.a,Mr),Is.subVectors(t.b,Mr),Rs.subVectors(t.c,Mr),Si.subVectors(Is,Bs),wi.subVectors(Rs,Is),Vi.subVectors(Bs,Rs);let e=[0,-Si.z,Si.y,0,-wi.z,wi.y,0,-Vi.z,Vi.y,Si.z,0,-Si.x,wi.z,0,-wi.x,Vi.z,0,-Vi.x,-Si.y,Si.x,0,-wi.y,wi.x,0,-Vi.y,Vi.x,0];return!Lc(e,Bs,Is,Rs,Oa)||(e=[1,0,0,0,1,0,0,0,1],!Lc(e,Bs,Is,Rs,Oa))?!1:(Ga.crossVectors(Si,wi),e=[Ga.x,Ga.y,Ga.z],Lc(e,Bs,Is,Rs,Oa))}clampPoint(t,e){return e.copy(t).clamp(this.min,this.max)}distanceToPoint(t){return this.clampPoint(t,Dn).distanceTo(t)}getBoundingSphere(t){return this.isEmpty()?t.makeEmpty():(this.getCenter(t.center),t.radius=this.getSize(Dn).length()*.5),t}intersect(t){return this.min.max(t.min),this.max.min(t.max),this.isEmpty()&&this.makeEmpty(),this}union(t){return this.min.min(t.min),this.max.max(t.max),this}applyMatrix4(t){return this.isEmpty()?this:(ai[0].set(this.min.x,this.min.y,this.min.z).applyMatrix4(t),ai[1].set(this.min.x,this.min.y,this.max.z).applyMatrix4(t),ai[2].set(this.min.x,this.max.y,this.min.z).applyMatrix4(t),ai[3].set(this.min.x,this.max.y,this.max.z).applyMatrix4(t),ai[4].set(this.max.x,this.min.y,this.min.z).applyMatrix4(t),ai[5].set(this.max.x,this.min.y,this.max.z).applyMatrix4(t),ai[6].set(this.max.x,this.max.y,this.min.z).applyMatrix4(t),ai[7].set(this.max.x,this.max.y,this.max.z).applyMatrix4(t),this.setFromPoints(ai),this)}translate(t){return this.min.add(t),this.max.add(t),this}equals(t){return t.min.equals(this.min)&&t.max.equals(this.max)}toJSON(){return{min:this.min.toArray(),max:this.max.toArray()}}fromJSON(t){return this.min.fromArray(t.min),this.max.fromArray(t.max),this}}const ai=[new I,new I,new I,new I,new I,new I,new I,new I],Dn=new I,Na=new Ze,Bs=new I,Is=new I,Rs=new I,Si=new I,wi=new I,Vi=new I,Mr=new I,Oa=new I,Ga=new I,Wi=new I;function Lc(i,t,e,n,s){for(let r=0,a=i.length-3;r<=a;r+=3){Wi.fromArray(i,r);const o=s.x*Math.abs(Wi.x)+s.y*Math.abs(Wi.y)+s.z*Math.abs(Wi.z),l=t.dot(Wi),c=e.dot(Wi),h=n.dot(Wi);if(Math.max(-Math.max(l,c,h),Math.min(l,c,h))>o)return!1}return!0}const hi=$0();function $0(){const i=new ArrayBuffer(4),t=new Float32Array(i),e=new Uint32Array(i),n=new Uint32Array(512),s=new Uint32Array(512);for(let l=0;l<256;++l){const c=l-127;c<-27?(n[l]=0,n[l|256]=32768,s[l]=24,s[l|256]=24):c<-14?(n[l]=1024>>-c-14,n[l|256]=1024>>-c-14|32768,s[l]=-c-1,s[l|256]=-c-1):c<=15?(n[l]=c+15<<10,n[l|256]=c+15<<10|32768,s[l]=13,s[l|256]=13):c<128?(n[l]=31744,n[l|256]=64512,s[l]=24,s[l|256]=24):(n[l]=31744,n[l|256]=64512,s[l]=13,s[l|256]=13)}const r=new Uint32Array(2048),a=new Uint32Array(64),o=new Uint32Array(64);for(let l=1;l<1024;++l){let c=l<<13,h=0;for(;(c&8388608)===0;)c<<=1,h-=8388608;c&=-8388609,h+=947912704,r[l]=c|h}for(let l=1024;l<2048;++l)r[l]=939524096+(l-1024<<13);for(let l=1;l<31;++l)a[l]=l<<23;a[31]=1199570944,a[32]=2147483648;for(let l=33;l<63;++l)a[l]=2147483648+(l-32<<23);a[63]=3347054592;for(let l=1;l<64;++l)l!==32&&(o[l]=1024);return{floatView:t,uint32View:e,baseTable:n,shiftTable:s,mantissaTable:r,exponentTable:a,offsetTable:o}}function hn(i){Math.abs(i)>65504&&_t("DataUtils.toHalfFloat(): Value out of range."),i=Xt(i,-65504,65504),hi.floatView[0]=i;const t=hi.uint32View[0],e=t>>23&511;return hi.baseTable[e]+((t&8388607)>>hi.shiftTable[e])}function Nr(i){const t=i>>10;return hi.uint32View[0]=hi.mantissaTable[hi.offsetTable[t]+(i&1023)]+hi.exponentTable[t],hi.floatView[0]}class j0{static toHalfFloat(t){return hn(t)}static fromHalfFloat(t){return Nr(t)}}const Be=new I,ka=new lt;let tx=0;class fe extends zn{constructor(t,e,n=!1){if(super(),Array.isArray(t))throw new TypeError("THREE.BufferAttribute: array should be a Typed Array.");this.isBufferAttribute=!0,Object.defineProperty(this,"id",{value:tx++}),this.name="",this.array=t,this.itemSize=e,this.count=t!==void 0?t.length/e:0,this.normalized=n,this.usage=zl,this.updateRanges=[],this.gpuType=sn,this.version=0}onUploadCallback(){}set needsUpdate(t){t===!0&&this.version++}setUsage(t){return this.usage=t,this}addUpdateRange(t,e){this.updateRanges.push({start:t,count:e})}clearUpdateRanges(){this.updateRanges.length=0}copy(t){return this.name=t.name,this.array=new t.array.constructor(t.array),this.itemSize=t.itemSize,this.count=t.count,this.normalized=t.normalized,this.usage=t.usage,this.gpuType=t.gpuType,this}copyAt(t,e,n){t*=this.itemSize,n*=e.itemSize;for(let s=0,r=this.itemSize;s<r;s++)this.array[t+s]=e.array[n+s];return this}copyArray(t){return this.array.set(t),this}applyMatrix3(t){if(this.itemSize===2)for(let e=0,n=this.count;e<n;e++)ka.fromBufferAttribute(this,e),ka.applyMatrix3(t),this.setXY(e,ka.x,ka.y);else if(this.itemSize===3)for(let e=0,n=this.count;e<n;e++)Be.fromBufferAttribute(this,e),Be.applyMatrix3(t),this.setXYZ(e,Be.x,Be.y,Be.z);return this}applyMatrix4(t){for(let e=0,n=this.count;e<n;e++)Be.fromBufferAttribute(this,e),Be.applyMatrix4(t),this.setXYZ(e,Be.x,Be.y,Be.z);return this}applyNormalMatrix(t){for(let e=0,n=this.count;e<n;e++)Be.fromBufferAttribute(this,e),Be.applyNormalMatrix(t),this.setXYZ(e,Be.x,Be.y,Be.z);return this}transformDirection(t){for(let e=0,n=this.count;e<n;e++)Be.fromBufferAttribute(this,e),Be.transformDirection(t),this.setXYZ(e,Be.x,Be.y,Be.z);return this}set(t,e=0){return this.array.set(t,e),this}getComponent(t,e){let n=this.array[t*this.itemSize+e];return this.normalized&&(n=nn(n,this.array)),n}setComponent(t,e,n){return this.normalized&&(n=ee(n,this.array)),this.array[t*this.itemSize+e]=n,this}getX(t){let e=this.array[t*this.itemSize];return this.normalized&&(e=nn(e,this.array)),e}setX(t,e){return this.normalized&&(e=ee(e,this.array)),this.array[t*this.itemSize]=e,this}getY(t){let e=this.array[t*this.itemSize+1];return this.normalized&&(e=nn(e,this.array)),e}setY(t,e){return this.normalized&&(e=ee(e,this.array)),this.array[t*this.itemSize+1]=e,this}getZ(t){let e=this.array[t*this.itemSize+2];return this.normalized&&(e=nn(e,this.array)),e}setZ(t,e){return this.normalized&&(e=ee(e,this.array)),this.array[t*this.itemSize+2]=e,this}getW(t){let e=this.array[t*this.itemSize+3];return this.normalized&&(e=nn(e,this.array)),e}setW(t,e){return this.normalized&&(e=ee(e,this.array)),this.array[t*this.itemSize+3]=e,this}setXY(t,e,n){return t*=this.itemSize,this.normalized&&(e=ee(e,this.array),n=ee(n,this.array)),this.array[t+0]=e,this.array[t+1]=n,this}setXYZ(t,e,n,s){return t*=this.itemSize,this.normalized&&(e=ee(e,this.array),n=ee(n,this.array),s=ee(s,this.array)),this.array[t+0]=e,this.array[t+1]=n,this.array[t+2]=s,this}setXYZW(t,e,n,s,r){return t*=this.itemSize,this.normalized&&(e=ee(e,this.array),n=ee(n,this.array),s=ee(s,this.array),r=ee(r,this.array)),this.array[t+0]=e,this.array[t+1]=n,this.array[t+2]=s,this.array[t+3]=r,this}onUpload(t){return this.onUploadCallback=t,this}clone(){return new this.constructor(this.array,this.itemSize).copy(this)}toJSON(){const t={itemSize:this.itemSize,type:this.array.constructor.name,array:Array.from(this.array),normalized:this.normalized};return t.name=this.name,t.usage=this.usage,t.gpuType=this.gpuType,t}dispose(){this.dispatchEvent({type:"dispose"})}}class ex extends fe{constructor(t,e,n){super(new Int8Array(t),e,n)}}class nx extends fe{constructor(t,e,n){super(new Uint8Array(t),e,n)}}class ix extends fe{constructor(t,e,n){super(new Uint8ClampedArray(t),e,n)}}class sx extends fe{constructor(t,e,n){super(new Int16Array(t),e,n)}}class gu extends fe{constructor(t,e,n){super(new Uint16Array(t),e,n)}}class rx extends fe{constructor(t,e,n){super(new Int32Array(t),e,n)}}class xu extends fe{constructor(t,e,n){super(new Uint32Array(t),e,n)}}class ax extends fe{constructor(t,e,n){super(new Uint16Array(t),e,n),this.isFloat16BufferAttribute=!0}getX(t){let e=Nr(this.array[t*this.itemSize]);return this.normalized&&(e=nn(e,this.array)),e}setX(t,e){return this.normalized&&(e=ee(e,this.array)),this.array[t*this.itemSize]=hn(e),this}getY(t){let e=Nr(this.array[t*this.itemSize+1]);return this.normalized&&(e=nn(e,this.array)),e}setY(t,e){return this.normalized&&(e=ee(e,this.array)),this.array[t*this.itemSize+1]=hn(e),this}getZ(t){let e=Nr(this.array[t*this.itemSize+2]);return this.normalized&&(e=nn(e,this.array)),e}setZ(t,e){return this.normalized&&(e=ee(e,this.array)),this.array[t*this.itemSize+2]=hn(e),this}getW(t){let e=Nr(this.array[t*this.itemSize+3]);return this.normalized&&(e=nn(e,this.array)),e}setW(t,e){return this.normalized&&(e=ee(e,this.array)),this.array[t*this.itemSize+3]=hn(e),this}setXY(t,e,n){return t*=this.itemSize,this.normalized&&(e=ee(e,this.array),n=ee(n,this.array)),this.array[t+0]=hn(e),this.array[t+1]=hn(n),this}setXYZ(t,e,n,s){return t*=this.itemSize,this.normalized&&(e=ee(e,this.array),n=ee(n,this.array),s=ee(s,this.array)),this.array[t+0]=hn(e),this.array[t+1]=hn(n),this.array[t+2]=hn(s),this}setXYZW(t,e,n,s,r){return t*=this.itemSize,this.normalized&&(e=ee(e,this.array),n=ee(n,this.array),s=ee(s,this.array),r=ee(r,this.array)),this.array[t+0]=hn(e),this.array[t+1]=hn(n),this.array[t+2]=hn(s),this.array[t+3]=hn(r),this}}class Ft extends fe{constructor(t,e,n){super(new Float32Array(t),e,n)}}const ox=new Ze,Er=new I,Fc=new I;class Oe{constructor(t=new I,e=-1){this.isSphere=!0,this.center=t,this.radius=e}set(t,e){return this.center.copy(t),this.radius=e,this}setFromPoints(t,e){const n=this.center;e!==void 0?n.copy(e):ox.setFromPoints(t).getCenter(n);let s=0;for(let r=0,a=t.length;r<a;r++)s=Math.max(s,n.distanceToSquared(t[r]));return this.radius=Math.sqrt(s),this}copy(t){return this.center.copy(t.center),this.radius=t.radius,this}isEmpty(){return this.radius<0}makeEmpty(){return this.center.set(0,0,0),this.radius=-1,this}containsPoint(t){return t.distanceToSquared(this.center)<=this.radius*this.radius}distanceToPoint(t){return t.distanceTo(this.center)-this.radius}intersectsSphere(t){const e=this.radius+t.radius;return t.center.distanceToSquared(this.center)<=e*e}intersectsBox(t){return t.intersectsSphere(this)}intersectsPlane(t){return Math.abs(t.distanceToPoint(this.center))<=this.radius}clampPoint(t,e){const n=this.center.distanceToSquared(t);return e.copy(t),n>this.radius*this.radius&&(e.sub(this.center).normalize(),e.multiplyScalar(this.radius).add(this.center)),e}getBoundingBox(t){return this.isEmpty()?(t.makeEmpty(),t):(t.set(this.center,this.center),t.expandByScalar(this.radius),t)}applyMatrix4(t){return this.center.applyMatrix4(t),this.radius=this.radius*t.getMaxScaleOnAxis(),this}translate(t){return this.center.add(t),this}expandByPoint(t){if(this.isEmpty())return this.center.copy(t),this.radius=0,this;Er.subVectors(t,this.center);const e=Er.lengthSq();if(e>this.radius*this.radius){const n=Math.sqrt(e),s=(n-this.radius)*.5;this.center.addScaledVector(Er,s/n),this.radius+=s}return this}union(t){return t.isEmpty()?this:this.isEmpty()?(this.copy(t),this):(this.center.equals(t.center)===!0?this.radius=Math.max(this.radius,t.radius):(Fc.subVectors(t.center,this.center).setLength(t.radius),this.expandByPoint(Er.copy(t.center).add(Fc)),this.expandByPoint(Er.copy(t.center).sub(Fc))),this)}equals(t){return t.center.equals(this.center)&&t.radius===this.radius}clone(){return new this.constructor().copy(this)}toJSON(){return{radius:this.radius,center:this.center.toArray()}}fromJSON(t){return this.radius=t.radius,this.center.fromArray(t.center),this}}let lx=0;const bn=new Kt,Uc=new he,Ds=new I,gn=new Ze,Sr=new Ze,Pe=new I;class $t extends zn{constructor(){super(),this.isBufferGeometry=!0,Object.defineProperty(this,"id",{value:lx++}),this.uuid=yn(),this.name="",this.type="BufferGeometry",this.index=null,this.indirect=null,this.indirectOffset=0,this.attributes={},this.morphAttributes={},this.morphTargetsRelative=!1,this.groups=[],this.boundingBox=null,this.boundingSphere=null,this.drawRange={start:0,count:1/0},this.userData={},this._transformed=!1}getIndex(){return this.index}setIndex(t){return Array.isArray(t)?this.index=new(m0(t)?xu:gu)(t,1):this.index=t,this}setIndirect(t,e=0){return this.indirect=t,this.indirectOffset=e,this}getIndirect(){return this.indirect}getAttribute(t){return this.attributes[t]}setAttribute(t,e){return this.attributes[t]=e,this}deleteAttribute(t){return delete this.attributes[t],this}hasAttribute(t){return this.attributes[t]!==void 0}addGroup(t,e,n=0){this.groups.push({start:t,count:e,materialIndex:n})}clearGroups(){this.groups=[]}setDrawRange(t,e){this.drawRange.start=t,this.drawRange.count=e}applyMatrix4(t){const e=this.attributes.position;e!==void 0&&(e.applyMatrix4(t),e.needsUpdate=!0);const n=this.attributes.normal;if(n!==void 0){const r=new jt().getNormalMatrix(t);n.applyNormalMatrix(r),n.needsUpdate=!0}const s=this.attributes.tangent;return s!==void 0&&(s.transformDirection(t),s.needsUpdate=!0),this.boundingBox!==null&&this.computeBoundingBox(),this.boundingSphere!==null&&this.computeBoundingSphere(),this._transformed=!0,this}applyQuaternion(t){return bn.makeRotationFromQuaternion(t),this.applyMatrix4(bn),this}rotateX(t){return bn.makeRotationX(t),this.applyMatrix4(bn),this}rotateY(t){return bn.makeRotationY(t),this.applyMatrix4(bn),this}rotateZ(t){return bn.makeRotationZ(t),this.applyMatrix4(bn),this}translate(t,e,n){return bn.makeTranslation(t,e,n),this.applyMatrix4(bn),this}scale(t,e,n){return bn.makeScale(t,e,n),this.applyMatrix4(bn),this}lookAt(t){return Uc.lookAt(t),Uc.updateMatrix(),this.applyMatrix4(Uc.matrix),this}center(){return this.computeBoundingBox(),this.boundingBox.getCenter(Ds).negate(),this.translate(Ds.x,Ds.y,Ds.z),this}setFromPoints(t){const e=this.getAttribute("position");if(e===void 0){const n=[];for(let s=0,r=t.length;s<r;s++){const a=t[s];n.push(a.x,a.y,a.z||0)}this.setAttribute("position",new Ft(n,3))}else{const n=Math.min(t.length,e.count);for(let s=0;s<n;s++){const r=t[s];e.setXYZ(s,r.x,r.y,r.z||0)}t.length>e.count&&_t("BufferGeometry: Buffer size too small for points data. Use .dispose() and create a new geometry."),e.needsUpdate=!0}return this}computeBoundingBox(){this.boundingBox===null&&(this.boundingBox=new Ze);const t=this.attributes.position,e=this.morphAttributes.position;if(t&&t.isGLBufferAttribute){Ht("BufferGeometry.computeBoundingBox(): GLBufferAttribute requires a manual bounding box.",this),this.boundingBox.set(new I(-1/0,-1/0,-1/0),new I(1/0,1/0,1/0));return}if(t!==void 0){if(this.boundingBox.setFromBufferAttribute(t),e)for(let n=0,s=e.length;n<s;n++){const r=e[n];gn.setFromBufferAttribute(r),this.morphTargetsRelative?(Pe.addVectors(this.boundingBox.min,gn.min),this.boundingBox.expandByPoint(Pe),Pe.addVectors(this.boundingBox.max,gn.max),this.boundingBox.expandByPoint(Pe)):(this.boundingBox.expandByPoint(gn.min),this.boundingBox.expandByPoint(gn.max))}}else this.boundingBox.makeEmpty();(isNaN(this.boundingBox.min.x)||isNaN(this.boundingBox.min.y)||isNaN(this.boundingBox.min.z))&&Ht('BufferGeometry.computeBoundingBox(): Computed min/max have NaN values. The "position" attribute is likely to have NaN values.',this)}computeBoundingSphere(){this.boundingSphere===null&&(this.boundingSphere=new Oe);const t=this.attributes.position,e=this.morphAttributes.position;if(t&&t.isGLBufferAttribute){Ht("BufferGeometry.computeBoundingSphere(): GLBufferAttribute requires a manual bounding sphere.",this),this.boundingSphere.set(new I,1/0);return}if(t){const n=this.boundingSphere.center;if(gn.setFromBufferAttribute(t),e)for(let r=0,a=e.length;r<a;r++){const o=e[r];Sr.setFromBufferAttribute(o),this.morphTargetsRelative?(Pe.addVectors(gn.min,Sr.min),gn.expandByPoint(Pe),Pe.addVectors(gn.max,Sr.max),gn.expandByPoint(Pe)):(gn.expandByPoint(Sr.min),gn.expandByPoint(Sr.max))}gn.getCenter(n);let s=0;for(let r=0,a=t.count;r<a;r++)Pe.fromBufferAttribute(t,r),s=Math.max(s,n.distanceToSquared(Pe));if(e)for(let r=0,a=e.length;r<a;r++){const o=e[r],l=this.morphTargetsRelative;for(let c=0,h=o.count;c<h;c++)Pe.fromBufferAttribute(o,c),l&&(Ds.fromBufferAttribute(t,c),Pe.add(Ds)),s=Math.max(s,n.distanceToSquared(Pe))}this.boundingSphere.radius=Math.sqrt(s),isNaN(this.boundingSphere.radius)&&Ht('BufferGeometry.computeBoundingSphere(): Computed radius is NaN. The "position" attribute is likely to have NaN values.',this)}}computeTangents(){const t=this.index,e=this.attributes;if(t===null||e.position===void 0||e.normal===void 0||e.uv===void 0){Ht("BufferGeometry: .computeTangents() failed. Missing required attributes (index, position, normal or uv)");return}const n=e.position,s=e.normal,r=e.uv;let a=this.getAttribute("tangent");(a===void 0||a.count!==n.count)&&(a=new fe(new Float32Array(4*n.count),4),this.setAttribute("tangent",a));const o=[],l=[];for(let _=0;_<n.count;_++)o[_]=new I,l[_]=new I;const c=new I,h=new I,f=new I,u=new lt,d=new lt,p=new lt,g=new I,m=new I;function A(_,b,B){c.fromBufferAttribute(n,_),h.fromBufferAttribute(n,b),f.fromBufferAttribute(n,B),u.fromBufferAttribute(r,_),d.fromBufferAttribute(r,b),p.fromBufferAttribute(r,B),h.sub(c),f.sub(c),d.sub(u),p.sub(u);const P=1/(d.x*p.y-p.x*d.y);isFinite(P)&&(g.copy(h).multiplyScalar(p.y).addScaledVector(f,-d.y).multiplyScalar(P),m.copy(f).multiplyScalar(d.x).addScaledVector(h,-p.x).multiplyScalar(P),o[_].add(g),o[b].add(g),o[B].add(g),l[_].add(m),l[b].add(m),l[B].add(m))}let v=this.groups;v.length===0&&(v=[{start:0,count:t.count}]);for(let _=0,b=v.length;_<b;++_){const B=v[_],P=B.start,U=B.count;for(let k=P,L=P+U;k<L;k+=3)A(t.getX(k+0),t.getX(k+1),t.getX(k+2))}const M=new I,x=new I,S=new I,E=new I;function C(_){S.fromBufferAttribute(s,_),E.copy(S);const b=o[_];M.copy(b),M.sub(S.multiplyScalar(S.dot(b))).normalize(),x.crossVectors(E,b);const P=x.dot(l[_])<0?-1:1;a.setXYZW(_,M.x,M.y,M.z,P)}for(let _=0,b=v.length;_<b;++_){const B=v[_],P=B.start,U=B.count;for(let k=P,L=P+U;k<L;k+=3)C(t.getX(k+0)),C(t.getX(k+1)),C(t.getX(k+2))}this._transformed=!0}computeVertexNormals(){const t=this.index,e=this.getAttribute("position");if(e!==void 0){let n=this.getAttribute("normal");if(n===void 0||n.count!==e.count)n=new fe(new Float32Array(e.count*3),3),this.setAttribute("normal",n);else for(let u=0,d=n.count;u<d;u++)n.setXYZ(u,0,0,0);const s=new I,r=new I,a=new I,o=new I,l=new I,c=new I,h=new I,f=new I;if(t)for(let u=0,d=t.count;u<d;u+=3){const p=t.getX(u+0),g=t.getX(u+1),m=t.getX(u+2);s.fromBufferAttribute(e,p),r.fromBufferAttribute(e,g),a.fromBufferAttribute(e,m),h.subVectors(a,r),f.subVectors(s,r),h.cross(f),o.fromBufferAttribute(n,p),l.fromBufferAttribute(n,g),c.fromBufferAttribute(n,m),o.add(h),l.add(h),c.add(h),n.setXYZ(p,o.x,o.y,o.z),n.setXYZ(g,l.x,l.y,l.z),n.setXYZ(m,c.x,c.y,c.z)}else for(let u=0,d=e.count;u<d;u+=3)s.fromBufferAttribute(e,u+0),r.fromBufferAttribute(e,u+1),a.fromBufferAttribute(e,u+2),h.subVectors(a,r),f.subVectors(s,r),h.cross(f),n.setXYZ(u+0,h.x,h.y,h.z),n.setXYZ(u+1,h.x,h.y,h.z),n.setXYZ(u+2,h.x,h.y,h.z);this.normalizeNormals(),n.needsUpdate=!0}}normalizeNormals(){const t=this.attributes.normal;for(let e=0,n=t.count;e<n;e++)Pe.fromBufferAttribute(t,e),Pe.normalize(),t.setXYZ(e,Pe.x,Pe.y,Pe.z)}toNonIndexed(){function t(o,l){const c=o.array,h=o.itemSize,f=o.normalized,u=new c.constructor(l.length*h);let d=0,p=0;for(let g=0,m=l.length;g<m;g++){o.isInterleavedBufferAttribute?d=l[g]*o.data.stride+o.offset:d=l[g]*h;for(let A=0;A<h;A++)u[p++]=c[d++]}return new fe(u,h,f)}if(this.index===null)return _t("BufferGeometry.toNonIndexed(): BufferGeometry is already non-indexed."),this;const e=new $t,n=this.index.array,s=this.attributes;for(const o in s){const l=s[o],c=t(l,n);e.setAttribute(o,c)}const r=this.morphAttributes;for(const o in r){const l=[],c=r[o];for(let h=0,f=c.length;h<f;h++){const u=c[h],d=t(u,n);l.push(d)}e.morphAttributes[o]=l}e.morphTargetsRelative=this.morphTargetsRelative;const a=this.groups;for(let o=0,l=a.length;o<l;o++){const c=a[o];e.addGroup(c.start,c.count,c.materialIndex)}return e}toJSON(){const t={metadata:{version:4.7,type:"BufferGeometry",generator:"BufferGeometry.toJSON"}};if(t.uuid=this.uuid,t.type=this.parameters!==void 0&&this._transformed===!0?"BufferGeometry":this.type,t.name=this.name,Object.keys(this.userData).length>0&&(t.userData=this.userData),this.parameters!==void 0&&this._transformed!==!0){const l=this.parameters;for(const c in l)l[c]!==void 0&&(t[c]=l[c]);return t}t.data={attributes:{}};const e=this.index;e!==null&&(t.data.index={type:e.array.constructor.name,array:Array.prototype.slice.call(e.array)});const n=this.attributes;for(const l in n){const c=n[l];t.data.attributes[l]=c.toJSON(t.data)}const s={};let r=!1;for(const l in this.morphAttributes){const c=this.morphAttributes[l],h=[];for(let f=0,u=c.length;f<u;f++){const d=c[f];h.push(d.toJSON(t.data))}h.length>0&&(s[l]=h,r=!0)}r&&(t.data.morphAttributes=s,t.data.morphTargetsRelative=this.morphTargetsRelative);const a=this.groups;a.length>0&&(t.data.groups=JSON.parse(JSON.stringify(a)));const o=this.boundingSphere;return o!==null&&(t.data.boundingSphere=o.toJSON()),t}clone(){return new this.constructor().copy(this)}copy(t){this.index=null,this.attributes={},this.morphAttributes={},this.groups=[],this.boundingBox=null,this.boundingSphere=null;const e={};this.name=t.name;const n=t.index;n!==null&&this.setIndex(n.clone());const s=t.attributes;for(const c in s){const h=s[c];this.setAttribute(c,h.clone(e))}const r=t.morphAttributes;for(const c in r){const h=[],f=r[c];for(let u=0,d=f.length;u<d;u++)h.push(f[u].clone(e));this.morphAttributes[c]=h}this.morphTargetsRelative=t.morphTargetsRelative;const a=t.groups;for(let c=0,h=a.length;c<h;c++){const f=a[c];this.addGroup(f.start,f.count,f.materialIndex)}const o=t.boundingBox;o!==null&&(this.boundingBox=o.clone());const l=t.boundingSphere;return l!==null&&(this.boundingSphere=l.clone()),this.drawRange.start=t.drawRange.start,this.drawRange.count=t.drawRange.count,this.userData=t.userData,this._transformed=t._transformed,this}dispose(){this.dispatchEvent({type:"dispose"})}}class ql{constructor(t,e){this.isInterleavedBuffer=!0,this.array=t,this.stride=e,this.count=t!==void 0?t.length/e:0,this.usage=zl,this.updateRanges=[],this.version=0,this.uuid=yn()}onUploadCallback(){}set needsUpdate(t){t===!0&&this.version++}setUsage(t){return this.usage=t,this}addUpdateRange(t,e){this.updateRanges.push({start:t,count:e})}clearUpdateRanges(){this.updateRanges.length=0}copy(t){return this.array=new t.array.constructor(t.array),this.count=t.count,this.stride=t.stride,this.usage=t.usage,this}copyAt(t,e,n){t*=this.stride,n*=e.stride;for(let s=0,r=this.stride;s<r;s++)this.array[t+s]=e.array[n+s];return this}set(t,e=0){return this.array.set(t,e),this}clone(t){t.arrayBuffers===void 0&&(t.arrayBuffers={}),this.array.buffer._uuid===void 0&&(this.array.buffer._uuid=yn()),t.arrayBuffers[this.array.buffer._uuid]===void 0&&(t.arrayBuffers[this.array.buffer._uuid]=this.array.slice(0).buffer);const e=new this.array.constructor(t.arrayBuffers[this.array.buffer._uuid]),n=new this.constructor(e,this.stride);return n.setUsage(this.usage),n}onUpload(t){return this.onUploadCallback=t,this}toJSON(t){t.arrayBuffers===void 0&&(t.arrayBuffers={}),this.array.buffer._uuid===void 0&&(this.array.buffer._uuid=yn()),t.arrayBuffers[this.array.buffer._uuid]===void 0&&(t.arrayBuffers[this.array.buffer._uuid]=Array.from(new Uint32Array(this.array.buffer)));const e={uuid:this.uuid,buffer:this.array.buffer._uuid,type:this.array.constructor.name,stride:this.stride};return e.usage=this.usage,e}}const je=new I;class fs{constructor(t,e,n,s=!1){this.isInterleavedBufferAttribute=!0,this.name="",this.data=t,this.itemSize=e,this.offset=n,this.normalized=s}get count(){return this.data.count}get array(){return this.data.array}set needsUpdate(t){this.data.needsUpdate=t}applyMatrix4(t){for(let e=0,n=this.data.count;e<n;e++)je.fromBufferAttribute(this,e),je.applyMatrix4(t),this.setXYZ(e,je.x,je.y,je.z);return this}applyNormalMatrix(t){for(let e=0,n=this.count;e<n;e++)je.fromBufferAttribute(this,e),je.applyNormalMatrix(t),this.setXYZ(e,je.x,je.y,je.z);return this}transformDirection(t){for(let e=0,n=this.count;e<n;e++)je.fromBufferAttribute(this,e),je.transformDirection(t),this.setXYZ(e,je.x,je.y,je.z);return this}getComponent(t,e){let n=this.array[t*this.data.stride+this.offset+e];return this.normalized&&(n=nn(n,this.array)),n}setComponent(t,e,n){return this.normalized&&(n=ee(n,this.array)),this.data.array[t*this.data.stride+this.offset+e]=n,this}setX(t,e){return this.normalized&&(e=ee(e,this.array)),this.data.array[t*this.data.stride+this.offset]=e,this}setY(t,e){return this.normalized&&(e=ee(e,this.array)),this.data.array[t*this.data.stride+this.offset+1]=e,this}setZ(t,e){return this.normalized&&(e=ee(e,this.array)),this.data.array[t*this.data.stride+this.offset+2]=e,this}setW(t,e){return this.normalized&&(e=ee(e,this.array)),this.data.array[t*this.data.stride+this.offset+3]=e,this}getX(t){let e=this.data.array[t*this.data.stride+this.offset];return this.normalized&&(e=nn(e,this.array)),e}getY(t){let e=this.data.array[t*this.data.stride+this.offset+1];return this.normalized&&(e=nn(e,this.array)),e}getZ(t){let e=this.data.array[t*this.data.stride+this.offset+2];return this.normalized&&(e=nn(e,this.array)),e}getW(t){let e=this.data.array[t*this.data.stride+this.offset+3];return this.normalized&&(e=nn(e,this.array)),e}setXY(t,e,n){return t=t*this.data.stride+this.offset,this.normalized&&(e=ee(e,this.array),n=ee(n,this.array)),this.data.array[t+0]=e,this.data.array[t+1]=n,this}setXYZ(t,e,n,s){return t=t*this.data.stride+this.offset,this.normalized&&(e=ee(e,this.array),n=ee(n,this.array),s=ee(s,this.array)),this.data.array[t+0]=e,this.data.array[t+1]=n,this.data.array[t+2]=s,this}setXYZW(t,e,n,s,r){return t=t*this.data.stride+this.offset,this.normalized&&(e=ee(e,this.array),n=ee(n,this.array),s=ee(s,this.array),r=ee(r,this.array)),this.data.array[t+0]=e,this.data.array[t+1]=n,this.data.array[t+2]=s,this.data.array[t+3]=r,this}clone(t){if(t===void 0){la("InterleavedBufferAttribute.clone(): Cloning an interleaved buffer attribute will de-interleave buffer data.");const e=[];for(let n=0;n<this.count;n++){const s=n*this.data.stride+this.offset;for(let r=0;r<this.itemSize;r++)e.push(this.data.array[s+r])}return new fe(new this.array.constructor(e),this.itemSize,this.normalized)}else return t.interleavedBuffers===void 0&&(t.interleavedBuffers={}),t.interleavedBuffers[this.data.uuid]===void 0&&(t.interleavedBuffers[this.data.uuid]=this.data.clone(t)),new fs(t.interleavedBuffers[this.data.uuid],this.itemSize,this.offset,this.normalized)}toJSON(t){if(t===void 0){la("InterleavedBufferAttribute.toJSON(): Serializing an interleaved buffer attribute will de-interleave buffer data.");const e=[];for(let n=0;n<this.count;n++){const s=n*this.data.stride+this.offset;for(let r=0;r<this.itemSize;r++)e.push(this.data.array[s+r])}return{itemSize:this.itemSize,type:this.array.constructor.name,array:e,normalized:this.normalized}}else return t.interleavedBuffers===void 0&&(t.interleavedBuffers={}),t.interleavedBuffers[this.data.uuid]===void 0&&(t.interleavedBuffers[this.data.uuid]=this.data.toJSON(t)),{isInterleavedBufferAttribute:!0,itemSize:this.itemSize,data:this.data.uuid,offset:this.offset,normalized:this.normalized}}}const Nc=new I,cx=new I,hx=new jt;class ci{constructor(t=new I(1,0,0),e=0){this.isPlane=!0,this.normal=t,this.constant=e}set(t,e){return this.normal.copy(t),this.constant=e,this}setComponents(t,e,n,s){return this.normal.set(t,e,n),this.constant=s,this}setFromNormalAndCoplanarPoint(t,e){return this.normal.copy(t),this.constant=-e.dot(this.normal),this}setFromCoplanarPoints(t,e,n){const s=Nc.subVectors(n,e).cross(cx.subVectors(t,e)).normalize();return this.setFromNormalAndCoplanarPoint(s,t),this}copy(t){return this.normal.copy(t.normal),this.constant=t.constant,this}normalize(){const t=1/this.normal.length();return this.normal.multiplyScalar(t),this.constant*=t,this}negate(){return this.constant*=-1,this.normal.negate(),this}distanceToPoint(t){return this.normal.dot(t)+this.constant}distanceToSphere(t){return this.distanceToPoint(t.center)-t.radius}projectPoint(t,e){return e.copy(t).addScaledVector(this.normal,-this.distanceToPoint(t))}intersectLine(t,e,n=!0){const s=t.delta(Nc),r=this.normal.dot(s);if(r===0)return this.distanceToPoint(t.start)===0?e.copy(t.start):null;const a=-(t.start.dot(this.normal)+this.constant)/r;return n===!0&&(a<0||a>1)?null:e.copy(t.start).addScaledVector(s,a)}intersectsLine(t){const e=this.distanceToPoint(t.start),n=this.distanceToPoint(t.end);return e<0&&n>0||n<0&&e>0}intersectsBox(t){return t.intersectsPlane(this)}intersectsSphere(t){return t.intersectsPlane(this)}coplanarPoint(t){return t.copy(this.normal).multiplyScalar(-this.constant)}applyMatrix4(t,e){const n=e||hx.getNormalMatrix(t),s=this.coplanarPoint(Nc).applyMatrix4(t),r=this.normal.applyMatrix3(n).normalize();return this.constant=-s.dot(r),this}translate(t){return this.constant-=t.dot(this.normal),this}equals(t){return t.normal.equals(this.normal)&&t.constant===this.constant}clone(){return new this.constructor().copy(this)}toJSON(){return{normal:this.normal.toArray(),constant:this.constant}}fromJSON(t){return this.normal.fromArray(t.normal),this.constant=t.constant,this}}let ux=0;class ke extends zn{constructor(){super(),this.isMaterial=!0,Object.defineProperty(this,"id",{value:ux++}),this.uuid=yn(),this.name="",this.type="Material",this.blending=tr,this.side=Pi,this.vertexColors=!1,this.opacity=1,this.transparent=!1,this.alphaHash=!1,this.blendSrc=$h,this.blendDst=jh,this.blendEquation=ss,this.blendSrcAlpha=null,this.blendDstAlpha=null,this.blendEquationAlpha=null,this.blendColor=new bt(0,0,0),this.blendAlpha=0,this.depthFunc=rr,this.depthTest=!0,this.depthWrite=!0,this.stencilWriteMask=255,this.stencilFunc=oA,this.stencilRef=0,this.stencilFuncMask=255,this.stencilFail=Io,this.stencilZFail=Io,this.stencilZPass=Io,this.stencilWrite=!1,this.clippingPlanes=null,this.clipIntersection=!1,this.clipShadows=!1,this.shadowSide=null,this.colorWrite=!0,this.precision=null,this.polygonOffset=!1,this.polygonOffsetFactor=0,this.polygonOffsetUnits=0,this.dithering=!1,this.alphaToCoverage=!1,this.premultipliedAlpha=!1,this.forceSinglePass=!1,this.allowOverride=!0,this.visible=!0,this.toneMapped=!0,this.userData={},this.version=0,this._alphaTest=0}get alphaTest(){return this._alphaTest}set alphaTest(t){this._alphaTest>0!=t>0&&this.version++,this._alphaTest=t}onBeforeRender(){}onBeforeCompile(){}customProgramCacheKey(){return this.onBeforeCompile.toString()}setValues(t){if(t!==void 0)for(const e in t){const n=t[e];if(n===void 0){_t(`Material: parameter '${e}' has value of undefined.`);continue}const s=this[e];if(s===void 0){_t(`Material: '${e}' is not a property of THREE.${this.type}.`);continue}s&&s.isColor?s.set(n):s&&s.isVector2&&n&&n.isVector2||s&&s.isEuler&&n&&n.isEuler||s&&s.isVector3&&n&&n.isVector3?s.copy(n):this[e]=n}}toJSON(t){const e=t===void 0||typeof t=="string";e&&(t={textures:{},images:{}});const n={metadata:{version:4.7,type:"Material",generator:"Material.toJSON"}};n.uuid=this.uuid,n.type=this.type,n.blending=this.blending,n.side=this.side,n.shadowSide=this.shadowSide,n.vertexColors=this.vertexColors,n.opacity=this.opacity,n.transparent=this.transparent,n.blendSrc=this.blendSrc,n.blendDst=this.blendDst,n.blendEquation=this.blendEquation,n.blendSrcAlpha=this.blendSrcAlpha,n.blendDstAlpha=this.blendDstAlpha,n.blendEquationAlpha=this.blendEquationAlpha,n.blendColor=this.blendColor.getHex(),n.blendAlpha=this.blendAlpha,n.depthFunc=this.depthFunc,n.depthTest=this.depthTest,n.depthWrite=this.depthWrite,n.colorWrite=this.colorWrite,n.clipIntersection=this.clipIntersection,n.clipShadows=this.clipShadows,n.stencilWriteMask=this.stencilWriteMask,n.stencilFunc=this.stencilFunc,n.stencilRef=this.stencilRef,n.stencilFuncMask=this.stencilFuncMask,n.stencilFail=this.stencilFail,n.stencilZFail=this.stencilZFail,n.stencilZPass=this.stencilZPass,n.stencilWrite=this.stencilWrite,n.polygonOffset=this.polygonOffset,n.polygonOffsetFactor=this.polygonOffsetFactor,n.polygonOffsetUnits=this.polygonOffsetUnits,n.dithering=this.dithering,n.alphaTest=this.alphaTest,n.alphaHash=this.alphaHash,n.alphaToCoverage=this.alphaToCoverage,n.premultipliedAlpha=this.premultipliedAlpha,n.forceSinglePass=this.forceSinglePass,n.allowOverride=this.allowOverride,n.visible=this.visible,n.toneMapped=this.toneMapped,n.name=this.name,this.color&&this.color.isColor&&(n.color=this.color.getHex()),this.roughness!==void 0&&(n.roughness=this.roughness),this.metalness!==void 0&&(n.metalness=this.metalness),this.sheen!==void 0&&(n.sheen=this.sheen),this.sheenColor&&this.sheenColor.isColor&&(n.sheenColor=this.sheenColor.getHex()),this.sheenRoughness!==void 0&&(n.sheenRoughness=this.sheenRoughness),this.emissive&&this.emissive.isColor&&(n.emissive=this.emissive.getHex()),this.emissiveIntensity!==void 0&&(n.emissiveIntensity=this.emissiveIntensity),this.specular&&this.specular.isColor&&(n.specular=this.specular.getHex()),this.specularIntensity!==void 0&&(n.specularIntensity=this.specularIntensity),this.specularColor&&this.specularColor.isColor&&(n.specularColor=this.specularColor.getHex()),this.shininess!==void 0&&(n.shininess=this.shininess),this.clearcoat!==void 0&&(n.clearcoat=this.clearcoat),this.clearcoatRoughness!==void 0&&(n.clearcoatRoughness=this.clearcoatRoughness),this.clearcoatMap&&this.clearcoatMap.isTexture&&(n.clearcoatMap=this.clearcoatMap.toJSON(t).uuid),this.clearcoatRoughnessMap&&this.clearcoatRoughnessMap.isTexture&&(n.clearcoatRoughnessMap=this.clearcoatRoughnessMap.toJSON(t).uuid),this.clearcoatNormalMap&&this.clearcoatNormalMap.isTexture&&(n.clearcoatNormalMap=this.clearcoatNormalMap.toJSON(t).uuid,n.clearcoatNormalScale=this.clearcoatNormalScale.toArray()),this.sheenColorMap&&this.sheenColorMap.isTexture&&(n.sheenColorMap=this.sheenColorMap.toJSON(t).uuid),this.sheenRoughnessMap&&this.sheenRoughnessMap.isTexture&&(n.sheenRoughnessMap=this.sheenRoughnessMap.toJSON(t).uuid),this.dispersion!==void 0&&(n.dispersion=this.dispersion),this.retroreflectivity!==void 0&&(n.retroreflectivity=this.retroreflectivity),this.iridescence!==void 0&&(n.iridescence=this.iridescence),this.iridescenceIOR!==void 0&&(n.iridescenceIOR=this.iridescenceIOR),this.iridescenceThicknessRange!==void 0&&(n.iridescenceThicknessRange=this.iridescenceThicknessRange),this.iridescenceMap&&this.iridescenceMap.isTexture&&(n.iridescenceMap=this.iridescenceMap.toJSON(t).uuid),this.iridescenceThicknessMap&&this.iridescenceThicknessMap.isTexture&&(n.iridescenceThicknessMap=this.iridescenceThicknessMap.toJSON(t).uuid),this.anisotropy!==void 0&&(n.anisotropy=this.anisotropy),this.anisotropyRotation!==void 0&&(n.anisotropyRotation=this.anisotropyRotation),this.anisotropyMap&&this.anisotropyMap.isTexture&&(n.anisotropyMap=this.anisotropyMap.toJSON(t).uuid),this.map&&this.map.isTexture&&(n.map=this.map.toJSON(t).uuid),this.matcap&&this.matcap.isTexture&&(n.matcap=this.matcap.toJSON(t).uuid),this.alphaMap&&this.alphaMap.isTexture&&(n.alphaMap=this.alphaMap.toJSON(t).uuid),this.lightMap&&this.lightMap.isTexture&&(n.lightMap=this.lightMap.toJSON(t).uuid,n.lightMapIntensity=this.lightMapIntensity),this.aoMap&&this.aoMap.isTexture&&(n.aoMap=this.aoMap.toJSON(t).uuid,n.aoMapIntensity=this.aoMapIntensity),this.bumpMap&&this.bumpMap.isTexture&&(n.bumpMap=this.bumpMap.toJSON(t).uuid,n.bumpScale=this.bumpScale),this.normalMap&&this.normalMap.isTexture&&(n.normalMap=this.normalMap.toJSON(t).uuid,n.normalMapType=this.normalMapType,n.normalScale=this.normalScale.toArray()),this.displacementMap&&this.displacementMap.isTexture&&(n.displacementMap=this.displacementMap.toJSON(t).uuid,n.displacementScale=this.displacementScale,n.displacementBias=this.displacementBias),this.roughnessMap&&this.roughnessMap.isTexture&&(n.roughnessMap=this.roughnessMap.toJSON(t).uuid),this.metalnessMap&&this.metalnessMap.isTexture&&(n.metalnessMap=this.metalnessMap.toJSON(t).uuid),this.emissiveMap&&this.emissiveMap.isTexture&&(n.emissiveMap=this.emissiveMap.toJSON(t).uuid),this.specularMap&&this.specularMap.isTexture&&(n.specularMap=this.specularMap.toJSON(t).uuid),this.specularIntensityMap&&this.specularIntensityMap.isTexture&&(n.specularIntensityMap=this.specularIntensityMap.toJSON(t).uuid),this.specularColorMap&&this.specularColorMap.isTexture&&(n.specularColorMap=this.specularColorMap.toJSON(t).uuid),this.envMap&&this.envMap.isTexture&&(n.envMap=this.envMap.toJSON(t).uuid,this.combine!==void 0&&(n.combine=this.combine)),this.envMapRotation!==void 0&&(n.envMapRotation=this.envMapRotation.toArray()),this.envMapIntensity!==void 0&&(n.envMapIntensity=this.envMapIntensity),this.reflectivity!==void 0&&(n.reflectivity=this.reflectivity),this.refractionRatio!==void 0&&(n.refractionRatio=this.refractionRatio),this.gradientMap&&this.gradientMap.isTexture&&(n.gradientMap=this.gradientMap.toJSON(t).uuid),this.transmission!==void 0&&(n.transmission=this.transmission),this.transmissionMap&&this.transmissionMap.isTexture&&(n.transmissionMap=this.transmissionMap.toJSON(t).uuid),this.thickness!==void 0&&(n.thickness=this.thickness),this.thicknessMap&&this.thicknessMap.isTexture&&(n.thicknessMap=this.thicknessMap.toJSON(t).uuid),this.attenuationDistance!==void 0&&(n.attenuationDistance=this.attenuationDistance),this.attenuationColor!==void 0&&(n.attenuationColor=this.attenuationColor.getHex()),this.size!==void 0&&(n.size=this.size),this.sizeAttenuation!==void 0&&(n.sizeAttenuation=this.sizeAttenuation),Array.isArray(this.clippingPlanes)&&this.clippingPlanes.length>0&&(n.clippingPlanes=this.clippingPlanes.map(r=>r.toJSON())),this.rotation!==void 0&&(n.rotation=this.rotation),this.depthPacking!==void 0&&(n.depthPacking=this.depthPacking),this.linewidth!==void 0&&(n.linewidth=this.linewidth),this.linecap!==void 0&&(n.linecap=this.linecap),this.linejoin!==void 0&&(n.linejoin=this.linejoin),this.dashSize!==void 0&&(n.dashSize=this.dashSize),this.gapSize!==void 0&&(n.gapSize=this.gapSize),this.scale!==void 0&&(n.scale=this.scale),this.wireframe!==void 0&&(n.wireframe=this.wireframe),this.wireframeLinewidth!==void 0&&(n.wireframeLinewidth=this.wireframeLinewidth),this.wireframeLinecap!==void 0&&(n.wireframeLinecap=this.wireframeLinecap),this.wireframeLinejoin!==void 0&&(n.wireframeLinejoin=this.wireframeLinejoin),this.flatShading!==void 0&&(n.flatShading=this.flatShading),this.fog!==void 0&&(n.fog=this.fog),Object.keys(this.userData).length>0&&(n.userData=this.userData);function s(r){const a=[];for(const o in r){const l=r[o];delete l.metadata,a.push(l)}return a}if(e){const r=s(t.textures),a=s(t.images);r.length>0&&(n.textures=r),a.length>0&&(n.images=a)}return n}fromJSON(t,e){if(t.uuid!==void 0&&(this.uuid=t.uuid),t.name!==void 0&&(this.name=t.name),t.color!==void 0&&this.color!==void 0&&this.color.setHex(t.color),t.roughness!==void 0&&(this.roughness=t.roughness),t.metalness!==void 0&&(this.metalness=t.metalness),t.sheen!==void 0&&(this.sheen=t.sheen),t.sheenColor!==void 0&&(this.sheenColor=new bt().setHex(t.sheenColor)),t.sheenRoughness!==void 0&&(this.sheenRoughness=t.sheenRoughness),t.emissive!==void 0&&this.emissive!==void 0&&this.emissive.setHex(t.emissive),t.specular!==void 0&&this.specular!==void 0&&this.specular.setHex(t.specular),t.specularIntensity!==void 0&&(this.specularIntensity=t.specularIntensity),t.specularColor!==void 0&&this.specularColor!==void 0&&this.specularColor.setHex(t.specularColor),t.shininess!==void 0&&(this.shininess=t.shininess),t.clearcoat!==void 0&&(this.clearcoat=t.clearcoat),t.clearcoatRoughness!==void 0&&(this.clearcoatRoughness=t.clearcoatRoughness),t.dispersion!==void 0&&(this.dispersion=t.dispersion),t.retroreflectivity!==void 0&&(this.retroreflectivity=t.retroreflectivity),t.iridescence!==void 0&&(this.iridescence=t.iridescence),t.iridescenceIOR!==void 0&&(this.iridescenceIOR=t.iridescenceIOR),t.iridescenceThicknessRange!==void 0&&(this.iridescenceThicknessRange=t.iridescenceThicknessRange),t.transmission!==void 0&&(this.transmission=t.transmission),t.thickness!==void 0&&(this.thickness=t.thickness),t.attenuationDistance!==void 0&&(this.attenuationDistance=t.attenuationDistance),t.attenuationColor!==void 0&&this.attenuationColor!==void 0&&this.attenuationColor.setHex(t.attenuationColor),t.anisotropy!==void 0&&(this.anisotropy=t.anisotropy),t.anisotropyRotation!==void 0&&(this.anisotropyRotation=t.anisotropyRotation),t.fog!==void 0&&(this.fog=t.fog),t.flatShading!==void 0&&(this.flatShading=t.flatShading),t.blending!==void 0&&(this.blending=t.blending),t.combine!==void 0&&(this.combine=t.combine),t.side!==void 0&&(this.side=t.side),t.shadowSide!==void 0&&(this.shadowSide=t.shadowSide),t.opacity!==void 0&&(this.opacity=t.opacity),t.transparent!==void 0&&(this.transparent=t.transparent),t.alphaTest!==void 0&&(this.alphaTest=t.alphaTest),t.alphaHash!==void 0&&(this.alphaHash=t.alphaHash),t.depthFunc!==void 0&&(this.depthFunc=t.depthFunc),t.depthTest!==void 0&&(this.depthTest=t.depthTest),t.depthWrite!==void 0&&(this.depthWrite=t.depthWrite),t.colorWrite!==void 0&&(this.colorWrite=t.colorWrite),t.clippingPlanes!==void 0&&(this.clippingPlanes=t.clippingPlanes.map(n=>new ci().fromJSON(n))),t.clipIntersection!==void 0&&(this.clipIntersection=t.clipIntersection),t.clipShadows!==void 0&&(this.clipShadows=t.clipShadows),t.depthPacking!==void 0&&(this.depthPacking=t.depthPacking),t.blendSrc!==void 0&&(this.blendSrc=t.blendSrc),t.blendDst!==void 0&&(this.blendDst=t.blendDst),t.blendEquation!==void 0&&(this.blendEquation=t.blendEquation),t.blendSrcAlpha!==void 0&&(this.blendSrcAlpha=t.blendSrcAlpha),t.blendDstAlpha!==void 0&&(this.blendDstAlpha=t.blendDstAlpha),t.blendEquationAlpha!==void 0&&(this.blendEquationAlpha=t.blendEquationAlpha),t.blendColor!==void 0&&this.blendColor!==void 0&&this.blendColor.setHex(t.blendColor),t.blendAlpha!==void 0&&(this.blendAlpha=t.blendAlpha),t.stencilWriteMask!==void 0&&(this.stencilWriteMask=t.stencilWriteMask),t.stencilFunc!==void 0&&(this.stencilFunc=t.stencilFunc),t.stencilRef!==void 0&&(this.stencilRef=t.stencilRef),t.stencilFuncMask!==void 0&&(this.stencilFuncMask=t.stencilFuncMask),t.stencilFail!==void 0&&(this.stencilFail=t.stencilFail),t.stencilZFail!==void 0&&(this.stencilZFail=t.stencilZFail),t.stencilZPass!==void 0&&(this.stencilZPass=t.stencilZPass),t.stencilWrite!==void 0&&(this.stencilWrite=t.stencilWrite),t.wireframe!==void 0&&(this.wireframe=t.wireframe),t.wireframeLinewidth!==void 0&&(this.wireframeLinewidth=t.wireframeLinewidth),t.wireframeLinecap!==void 0&&(this.wireframeLinecap=t.wireframeLinecap),t.wireframeLinejoin!==void 0&&(this.wireframeLinejoin=t.wireframeLinejoin),t.rotation!==void 0&&(this.rotation=t.rotation),t.linewidth!==void 0&&(this.linewidth=t.linewidth),t.linecap!==void 0&&(this.linecap=t.linecap),t.linejoin!==void 0&&(this.linejoin=t.linejoin),t.dashSize!==void 0&&(this.dashSize=t.dashSize),t.gapSize!==void 0&&(this.gapSize=t.gapSize),t.scale!==void 0&&(this.scale=t.scale),t.polygonOffset!==void 0&&(this.polygonOffset=t.polygonOffset),t.polygonOffsetFactor!==void 0&&(this.polygonOffsetFactor=t.polygonOffsetFactor),t.polygonOffsetUnits!==void 0&&(this.polygonOffsetUnits=t.polygonOffsetUnits),t.dithering!==void 0&&(this.dithering=t.dithering),t.alphaToCoverage!==void 0&&(this.alphaToCoverage=t.alphaToCoverage),t.premultipliedAlpha!==void 0&&(this.premultipliedAlpha=t.premultipliedAlpha),t.forceSinglePass!==void 0&&(this.forceSinglePass=t.forceSinglePass),t.allowOverride!==void 0&&(this.allowOverride=t.allowOverride),t.visible!==void 0&&(this.visible=t.visible),t.toneMapped!==void 0&&(this.toneMapped=t.toneMapped),t.userData!==void 0&&(this.userData=t.userData),t.vertexColors!==void 0&&(typeof t.vertexColors=="number"?this.vertexColors=t.vertexColors>0:this.vertexColors=t.vertexColors),t.size!==void 0&&(this.size=t.size),t.sizeAttenuation!==void 0&&(this.sizeAttenuation=t.sizeAttenuation),t.map!==void 0&&(this.map=e[t.map]||null),t.matcap!==void 0&&(this.matcap=e[t.matcap]||null),t.alphaMap!==void 0&&(this.alphaMap=e[t.alphaMap]||null),t.bumpMap!==void 0&&(this.bumpMap=e[t.bumpMap]||null),t.bumpScale!==void 0&&(this.bumpScale=t.bumpScale),t.normalMap!==void 0&&(this.normalMap=e[t.normalMap]||null),t.normalMapType!==void 0&&(this.normalMapType=t.normalMapType),t.normalScale!==void 0){let n=t.normalScale;Array.isArray(n)===!1&&(n=[n,n]),this.normalScale=new lt().fromArray(n)}return t.displacementMap!==void 0&&(this.displacementMap=e[t.displacementMap]||null),t.displacementScale!==void 0&&(this.displacementScale=t.displacementScale),t.displacementBias!==void 0&&(this.displacementBias=t.displacementBias),t.roughnessMap!==void 0&&(this.roughnessMap=e[t.roughnessMap]||null),t.metalnessMap!==void 0&&(this.metalnessMap=e[t.metalnessMap]||null),t.emissiveMap!==void 0&&(this.emissiveMap=e[t.emissiveMap]||null),t.emissiveIntensity!==void 0&&(this.emissiveIntensity=t.emissiveIntensity),t.specularMap!==void 0&&(this.specularMap=e[t.specularMap]||null),t.specularIntensityMap!==void 0&&(this.specularIntensityMap=e[t.specularIntensityMap]||null),t.specularColorMap!==void 0&&(this.specularColorMap=e[t.specularColorMap]||null),t.envMap!==void 0&&(this.envMap=e[t.envMap]||null),t.envMapRotation!==void 0&&this.envMapRotation.fromArray(t.envMapRotation),t.envMapIntensity!==void 0&&(this.envMapIntensity=t.envMapIntensity),t.reflectivity!==void 0&&(this.reflectivity=t.reflectivity),t.refractionRatio!==void 0&&(this.refractionRatio=t.refractionRatio),t.lightMap!==void 0&&(this.lightMap=e[t.lightMap]||null),t.lightMapIntensity!==void 0&&(this.lightMapIntensity=t.lightMapIntensity),t.aoMap!==void 0&&(this.aoMap=e[t.aoMap]||null),t.aoMapIntensity!==void 0&&(this.aoMapIntensity=t.aoMapIntensity),t.gradientMap!==void 0&&(this.gradientMap=e[t.gradientMap]||null),t.clearcoatMap!==void 0&&(this.clearcoatMap=e[t.clearcoatMap]||null),t.clearcoatRoughnessMap!==void 0&&(this.clearcoatRoughnessMap=e[t.clearcoatRoughnessMap]||null),t.clearcoatNormalMap!==void 0&&(this.clearcoatNormalMap=e[t.clearcoatNormalMap]||null),t.clearcoatNormalScale!==void 0&&(this.clearcoatNormalScale=new lt().fromArray(t.clearcoatNormalScale)),t.iridescenceMap!==void 0&&(this.iridescenceMap=e[t.iridescenceMap]||null),t.iridescenceThicknessMap!==void 0&&(this.iridescenceThicknessMap=e[t.iridescenceThicknessMap]||null),t.transmissionMap!==void 0&&(this.transmissionMap=e[t.transmissionMap]||null),t.thicknessMap!==void 0&&(this.thicknessMap=e[t.thicknessMap]||null),t.anisotropyMap!==void 0&&(this.anisotropyMap=e[t.anisotropyMap]||null),t.sheenColorMap!==void 0&&(this.sheenColorMap=e[t.sheenColorMap]||null),t.sheenRoughnessMap!==void 0&&(this.sheenRoughnessMap=e[t.sheenRoughnessMap]||null),this}clone(){return new this.constructor().copy(this)}copy(t){this.name=t.name,this.blending=t.blending,this.side=t.side,this.vertexColors=t.vertexColors,this.opacity=t.opacity,this.transparent=t.transparent,this.blendSrc=t.blendSrc,this.blendDst=t.blendDst,this.blendEquation=t.blendEquation,this.blendSrcAlpha=t.blendSrcAlpha,this.blendDstAlpha=t.blendDstAlpha,this.blendEquationAlpha=t.blendEquationAlpha,this.blendColor.copy(t.blendColor),this.blendAlpha=t.blendAlpha,this.depthFunc=t.depthFunc,this.depthTest=t.depthTest,this.depthWrite=t.depthWrite,this.stencilWriteMask=t.stencilWriteMask,this.stencilFunc=t.stencilFunc,this.stencilRef=t.stencilRef,this.stencilFuncMask=t.stencilFuncMask,this.stencilFail=t.stencilFail,this.stencilZFail=t.stencilZFail,this.stencilZPass=t.stencilZPass,this.stencilWrite=t.stencilWrite;const e=t.clippingPlanes;let n=null;if(e!==null){const s=e.length;n=new Array(s);for(let r=0;r!==s;++r)n[r]=e[r].clone()}return this.clippingPlanes=n,this.clipIntersection=t.clipIntersection,this.clipShadows=t.clipShadows,this.shadowSide=t.shadowSide,this.colorWrite=t.colorWrite,this.precision=t.precision,this.polygonOffset=t.polygonOffset,this.polygonOffsetFactor=t.polygonOffsetFactor,this.polygonOffsetUnits=t.polygonOffsetUnits,this.dithering=t.dithering,this.alphaTest=t.alphaTest,this.alphaHash=t.alphaHash,this.alphaToCoverage=t.alphaToCoverage,this.premultipliedAlpha=t.premultipliedAlpha,this.forceSinglePass=t.forceSinglePass,this.allowOverride=t.allowOverride,this.visible=t.visible,this.toneMapped=t.toneMapped,this.userData=JSON.parse(JSON.stringify(t.userData)),this}dispose(){this.dispatchEvent({type:"dispose"})}set needsUpdate(t){t===!0&&this.version++}}class _u extends ke{constructor(t){super(),this.isSpriteMaterial=!0,this.type="SpriteMaterial",this.color=new bt(16777215),this.map=null,this.alphaMap=null,this.rotation=0,this.sizeAttenuation=!0,this.transparent=!0,this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.color.copy(t.color),this.map=t.map,this.alphaMap=t.alphaMap,this.rotation=t.rotation,this.sizeAttenuation=t.sizeAttenuation,this.fog=t.fog,this}}let Ps;const wr=new I,Ls=new I,Fs=new I,Us=new lt,br=new lt,vA=new Kt,Qa=new I,Cr=new I,za=new I,Ef=new lt,Oc=new lt,Sf=new lt;class yA extends he{constructor(t=new _u){if(super(),this.isSprite=!0,this.type="Sprite",Ps===void 0){Ps=new $t;const e=new Float32Array([-.5,-.5,0,0,0,.5,-.5,0,1,0,.5,.5,0,1,1,-.5,.5,0,0,1]),n=new ql(e,5);Ps.setIndex([0,1,2,0,2,3]),Ps.setAttribute("position",new fs(n,3,0,!1)),Ps.setAttribute("uv",new fs(n,2,3,!1))}this.geometry=Ps,this.material=t,this.center=new lt(.5,.5),this.count=1}intersectsFrustum(t){return t.intersectsSprite(this)}raycast(t,e){t.camera===null&&Ht('Sprite: "Raycaster.camera" needs to be set in order to raycast against sprites.'),Ls.setFromMatrixScale(this.matrixWorld),vA.copy(t.camera.matrixWorld),this.modelViewMatrix.multiplyMatrices(t.camera.matrixWorldInverse,this.matrixWorld),Fs.setFromMatrixPosition(this.modelViewMatrix),t.camera.isPerspectiveCamera&&this.material.sizeAttenuation===!1&&Ls.multiplyScalar(-Fs.z);const n=this.material.rotation;let s,r;n!==0&&(r=Math.cos(n),s=Math.sin(n));const a=this.center;Ha(Qa.set(-.5,-.5,0),Fs,a,Ls,s,r),Ha(Cr.set(.5,-.5,0),Fs,a,Ls,s,r),Ha(za.set(.5,.5,0),Fs,a,Ls,s,r),Ef.set(0,0),Oc.set(1,0),Sf.set(1,1);let o=t.ray.intersectTriangle(Qa,Cr,za,!1,wr);if(o===null&&(Ha(Cr.set(-.5,.5,0),Fs,a,Ls,s,r),Oc.set(0,1),o=t.ray.intersectTriangle(Qa,za,Cr,!1,wr),o===null))return;const l=t.ray.origin.distanceTo(wr);l<t.near||l>t.far||e.push({distance:l,point:wr.clone(),uv:fn.getInterpolation(wr,Qa,Cr,za,Ef,Oc,Sf,new lt),face:null,object:this})}copy(t,e){return super.copy(t,e),t.center!==void 0&&this.center.copy(t.center),this.material=t.material,this}}function Ha(i,t,e,n,s,r){Us.subVectors(i,e).addScalar(.5).multiply(n),s!==void 0?(br.x=r*Us.x-s*Us.y,br.y=s*Us.x+r*Us.y):br.copy(Us),i.copy(t),i.x+=br.x,i.y+=br.y,i.applyMatrix4(vA)}const Va=new I,wf=new I;class MA extends he{constructor(){super(),this.isLOD=!0,this._currentLevel=0,this.type="LOD",Object.defineProperties(this,{levels:{enumerable:!0,value:[]}}),this.autoUpdate=!0}copy(t){super.copy(t,!1);const e=t.levels;for(let n=0,s=e.length;n<s;n++){const r=e[n];this.addLevel(r.object.clone(),r.distance,r.hysteresis)}return this.autoUpdate=t.autoUpdate,this}addLevel(t,e=0,n=0){e=Math.abs(e);const s=this.levels;let r;for(r=0;r<s.length&&!(e<s[r].distance);r++);return s.splice(r,0,{distance:e,hysteresis:n,object:t}),this.add(t),this}removeLevel(t){const e=this.levels;for(let n=0;n<e.length;n++)if(e[n].distance===t){const s=e.splice(n,1);return this.remove(s[0].object),!0}return!1}getCurrentLevel(){return this._currentLevel}getObjectForDistance(t){const e=this.levels;if(e.length>0){let n,s;for(n=1,s=e.length;n<s;n++){let r=e[n].distance;if(e[n].object.visible&&(r-=r*e[n].hysteresis),t<r)break}return e[n-1].object}return null}raycast(t,e){if(this.levels.length>0){Va.setFromMatrixPosition(this.matrixWorld);const s=t.ray.origin.distanceTo(Va);this.getObjectForDistance(s).raycast(t,e)}}update(t){const e=this.levels;if(e.length>1){Va.setFromMatrixPosition(t.matrixWorld),wf.setFromMatrixPosition(this.matrixWorld);const n=Va.distanceTo(wf)/t.zoom;e[0].object.visible=!0;let s,r;for(s=1,r=e.length;s<r;s++){let a=e[s].distance;if(e[s].object.visible&&(a-=a*e[s].hysteresis),n>=a)e[s-1].object.visible=!1,e[s].object.visible=!0;else break}for(this._currentLevel=s-1;s<r;s++)e[s].object.visible=!1}}toJSON(t){const e=super.toJSON(t);e.object.autoUpdate=this.autoUpdate,e.object.levels=[];const n=this.levels;for(let s=0,r=n.length;s<r;s++){const a=n[s];e.object.levels.push({object:a.object.uuid,distance:a.distance,hysteresis:a.hysteresis})}return e}}const oi=new I,Gc=new I,Wa=new I,Ya=new I;class Ar{constructor(t=new I,e=new I(0,0,-1)){this.origin=t,this.direction=e}set(t,e){return this.origin.copy(t),this.direction.copy(e),this}copy(t){return this.origin.copy(t.origin),this.direction.copy(t.direction),this}at(t,e){return e.copy(this.origin).addScaledVector(this.direction,t)}lookAt(t){return this.direction.copy(t).sub(this.origin).normalize(),this}recast(t){return this.origin.copy(this.at(t,oi)),this}closestPointToPoint(t,e){e.subVectors(t,this.origin);const n=e.dot(this.direction);return n<0?e.copy(this.origin):e.copy(this.origin).addScaledVector(this.direction,n)}distanceToPoint(t){return Math.sqrt(this.distanceSqToPoint(t))}distanceSqToPoint(t){const e=oi.subVectors(t,this.origin).dot(this.direction);return e<0?this.origin.distanceToSquared(t):(oi.copy(this.origin).addScaledVector(this.direction,e),oi.distanceToSquared(t))}distanceSqToSegment(t,e,n,s){Gc.copy(t).add(e).multiplyScalar(.5),Wa.copy(e).sub(t).normalize(),Ya.copy(this.origin).sub(Gc);const r=t.distanceTo(e)*.5,a=-this.direction.dot(Wa),o=Ya.dot(this.direction),l=-Ya.dot(Wa),c=Ya.lengthSq(),h=Math.abs(1-a*a);let f,u,d,p;if(h>0)if(f=a*l-o,u=a*o-l,p=r*h,f>=0)if(u>=-p)if(u<=p){const g=1/h;f*=g,u*=g,d=f*(f+a*u+2*o)+u*(a*f+u+2*l)+c}else u=r,f=Math.max(0,-(a*u+o)),d=-f*f+u*(u+2*l)+c;else u=-r,f=Math.max(0,-(a*u+o)),d=-f*f+u*(u+2*l)+c;else u<=-p?(f=Math.max(0,-(-a*r+o)),u=f>0?-r:Math.min(Math.max(-r,-l),r),d=-f*f+u*(u+2*l)+c):u<=p?(f=0,u=Math.min(Math.max(-r,-l),r),d=u*(u+2*l)+c):(f=Math.max(0,-(a*r+o)),u=f>0?r:Math.min(Math.max(-r,-l),r),d=-f*f+u*(u+2*l)+c);else u=a>0?-r:r,f=Math.max(0,-(a*u+o)),d=-f*f+u*(u+2*l)+c;return n&&n.copy(this.origin).addScaledVector(this.direction,f),s&&s.copy(Gc).addScaledVector(Wa,u),d}intersectSphere(t,e){if(t.radius<0)return null;oi.subVectors(t.center,this.origin);const n=oi.dot(this.direction),s=oi.dot(oi)-n*n,r=t.radius*t.radius;if(s>r)return null;const a=Math.sqrt(r-s),o=n-a,l=n+a;return l<0?null:o<0?this.at(l,e):this.at(o,e)}intersectsSphere(t){return t.radius<0?!1:this.distanceSqToPoint(t.center)<=t.radius*t.radius}distanceToPlane(t){const e=t.normal.dot(this.direction);if(e===0)return t.distanceToPoint(this.origin)===0?0:null;const n=-(this.origin.dot(t.normal)+t.constant)/e;return n>=0?n:null}intersectPlane(t,e){const n=this.distanceToPlane(t);return n===null?null:this.at(n,e)}intersectsPlane(t){const e=t.distanceToPoint(this.origin);return e===0||t.normal.dot(this.direction)*e<0}intersectBox(t,e){let n,s,r,a,o,l;const c=1/this.direction.x,h=1/this.direction.y,f=1/this.direction.z,u=this.origin;return c>=0?(n=(t.min.x-u.x)*c,s=(t.max.x-u.x)*c):(n=(t.max.x-u.x)*c,s=(t.min.x-u.x)*c),h>=0?(r=(t.min.y-u.y)*h,a=(t.max.y-u.y)*h):(r=(t.max.y-u.y)*h,a=(t.min.y-u.y)*h),n>a||r>s||((r>n||isNaN(n))&&(n=r),(a<s||isNaN(s))&&(s=a),f>=0?(o=(t.min.z-u.z)*f,l=(t.max.z-u.z)*f):(o=(t.max.z-u.z)*f,l=(t.min.z-u.z)*f),n>l||o>s)||((o>n||n!==n)&&(n=o),(l<s||s!==s)&&(s=l),s<0)?null:this.at(n>=0?n:s,e)}intersectsBox(t){return this.intersectBox(t,oi)!==null}intersectTriangle(t,e,n,s,r){const a=this.origin,o=this.direction,l=o.x,c=o.y,h=o.z,f=t.x-a.x,u=t.y-a.y,d=t.z-a.z,p=e.x-a.x,g=e.y-a.y,m=e.z-a.z,A=n.x-a.x,v=n.y-a.y,M=n.z-a.z,x=Math.abs(l),S=Math.abs(c),E=Math.abs(h);let C,_,b,B,P,U,k,L,O,q,Y,at;if(x>=S&&x>=E?(b=l,U=f,O=p,at=A,l>=0?(C=c,_=h,B=u,P=d,k=g,L=m,q=v,Y=M):(C=h,_=c,B=d,P=u,k=m,L=g,q=M,Y=v)):S>=E?(b=c,U=u,O=g,at=v,c>=0?(C=h,_=l,B=d,P=f,k=m,L=p,q=M,Y=A):(C=l,_=h,B=f,P=d,k=p,L=m,q=A,Y=M)):(b=h,U=d,O=m,at=M,h>=0?(C=l,_=c,B=f,P=u,k=p,L=g,q=A,Y=v):(C=c,_=l,B=u,P=f,k=g,L=p,q=v,Y=A)),b===0)return null;const Q=C/b,$=_/b,st=1/b,Ut=B-Q*U,Tt=P-$*U,oe=k-Q*O,Zt=L-$*O,Vt=q-Q*at,K=Y-$*at,z=Vt*Zt-K*oe,nt=Ut*K-Tt*Vt,gt=oe*Tt-Zt*Ut;if(s){if(z<0||nt<0||gt<0)return null}else if((z<0||nt<0||gt<0)&&(z>0||nt>0||gt>0))return null;const ct=z+nt+gt;if(ct===0)return null;const Et=st*(z*U+nt*O+gt*at);return(ct>0?Et<0:Et>0)?null:this.at(Et/ct,r)}applyMatrix4(t){return this.origin.applyMatrix4(t),this.direction.transformDirection(t),this}equals(t){return t.origin.equals(this.origin)&&t.direction.equals(this.direction)}clone(){return new this.constructor().copy(this)}}class Oi extends ke{constructor(t){super(),this.isMeshBasicMaterial=!0,this.type="MeshBasicMaterial",this.color=new bt(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new kn,this.combine=_a,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.color.copy(t.color),this.map=t.map,this.lightMap=t.lightMap,this.lightMapIntensity=t.lightMapIntensity,this.aoMap=t.aoMap,this.aoMapIntensity=t.aoMapIntensity,this.specularMap=t.specularMap,this.alphaMap=t.alphaMap,this.envMap=t.envMap,this.envMapRotation.copy(t.envMapRotation),this.combine=t.combine,this.reflectivity=t.reflectivity,this.refractionRatio=t.refractionRatio,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.wireframeLinecap=t.wireframeLinecap,this.wireframeLinejoin=t.wireframeLinejoin,this.fog=t.fog,this}}const bf=new Kt,Yi=new Ar,Xa=new Oe,Cf=new I,qa=new I,Ka=new I,Ja=new I,kc=new I,Za=new I,Tf=new I,$a=new I;class Ce extends he{constructor(t=new $t,e=new Oi){super(),this.isMesh=!0,this.type="Mesh",this.geometry=t,this.material=e,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.count=1,this.updateMorphTargets()}copy(t,e){return super.copy(t,e),t.morphTargetInfluences!==void 0&&(this.morphTargetInfluences=t.morphTargetInfluences.slice()),t.morphTargetDictionary!==void 0&&(this.morphTargetDictionary=Object.assign({},t.morphTargetDictionary)),this.material=Array.isArray(t.material)?t.material.slice():t.material,this.geometry=t.geometry,this}updateMorphTargets(){const e=this.geometry.morphAttributes,n=Object.keys(e);if(n.length>0){const s=e[n[0]];if(s!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let r=0,a=s.length;r<a;r++){const o=s[r].name||String(r);this.morphTargetInfluences.push(0),this.morphTargetDictionary[o]=r}}}}getVertexPosition(t,e){const n=this.geometry,s=n.attributes.position,r=n.morphAttributes.position,a=n.morphTargetsRelative;e.fromBufferAttribute(s,t);const o=this.morphTargetInfluences;if(r&&o){Za.set(0,0,0);for(let l=0,c=r.length;l<c;l++){const h=o[l],f=r[l];h!==0&&(kc.fromBufferAttribute(f,t),a?Za.addScaledVector(kc,h):Za.addScaledVector(kc.sub(e),h))}e.add(Za)}return e}intersectsFrustum(t){return t.intersectsObject(this)}raycast(t,e){const n=this.geometry,s=this.material,r=this.matrixWorld;s!==void 0&&(n.boundingSphere===null&&n.computeBoundingSphere(),Xa.copy(n.boundingSphere),Xa.applyMatrix4(r),Yi.copy(t.ray).recast(t.near),!(Xa.containsPoint(Yi.origin)===!1&&(Yi.intersectSphere(Xa,Cf)===null||Yi.origin.distanceToSquared(Cf)>(t.far-t.near)**2))&&(bf.copy(r).invert(),Yi.copy(t.ray).applyMatrix4(bf),!(n.boundingBox!==null&&Yi.intersectsBox(n.boundingBox)===!1)&&this._computeIntersections(t,e,Yi)))}_computeIntersections(t,e,n){let s;const r=this.geometry,a=this.material,o=r.index,l=r.attributes.position,c=r.attributes.uv,h=r.attributes.uv1,f=r.attributes.normal,u=r.groups,d=r.drawRange;if(o!==null)if(Array.isArray(a))for(let p=0,g=u.length;p<g;p++){const m=u[p],A=a[m.materialIndex],v=Math.max(m.start,d.start),M=Math.min(o.count,Math.min(m.start+m.count,d.start+d.count));for(let x=v,S=M;x<S;x+=3){const E=o.getX(x),C=o.getX(x+1),_=o.getX(x+2);s=ja(this,A,t,n,c,h,f,E,C,_),s&&(s.faceIndex=Math.floor(x/3),s.face.materialIndex=m.materialIndex,e.push(s))}}else{const p=Math.max(0,d.start),g=Math.min(o.count,d.start+d.count);for(let m=p,A=g;m<A;m+=3){const v=o.getX(m),M=o.getX(m+1),x=o.getX(m+2);s=ja(this,a,t,n,c,h,f,v,M,x),s&&(s.faceIndex=Math.floor(m/3),e.push(s))}}else if(l!==void 0)if(Array.isArray(a))for(let p=0,g=u.length;p<g;p++){const m=u[p],A=a[m.materialIndex],v=Math.max(m.start,d.start),M=Math.min(l.count,Math.min(m.start+m.count,d.start+d.count));for(let x=v,S=M;x<S;x+=3){const E=x,C=x+1,_=x+2;s=ja(this,A,t,n,c,h,f,E,C,_),s&&(s.faceIndex=Math.floor(x/3),s.face.materialIndex=m.materialIndex,e.push(s))}}else{const p=Math.max(0,d.start),g=Math.min(l.count,d.start+d.count);for(let m=p,A=g;m<A;m+=3){const v=m,M=m+1,x=m+2;s=ja(this,a,t,n,c,h,f,v,M,x),s&&(s.faceIndex=Math.floor(m/3),e.push(s))}}}}function fx(i,t,e,n,s,r,a,o){let l;if(t.side===an?l=n.intersectTriangle(a,r,s,!0,o):l=n.intersectTriangle(s,r,a,t.side===Pi,o),l===null)return null;$a.copy(o),$a.applyMatrix4(i.matrixWorld);const c=e.ray.origin.distanceTo($a);return c<e.near||c>e.far?null:{distance:c,point:$a.clone(),object:i}}function ja(i,t,e,n,s,r,a,o,l,c){i.getVertexPosition(o,qa),i.getVertexPosition(l,Ka),i.getVertexPosition(c,Ja);const h=fx(i,t,e,n,qa,Ka,Ja,Tf);if(h){const f=new I;fn.getBarycoord(Tf,qa,Ka,Ja,f),s&&(h.uv=fn.getInterpolatedAttribute(s,o,l,c,f,new lt)),r&&(h.uv1=fn.getInterpolatedAttribute(r,o,l,c,f,new lt)),a&&(h.normal=fn.getInterpolatedAttribute(a,o,l,c,f,new I),h.normal.dot(n.direction)>0&&h.normal.multiplyScalar(-1));const u={a:o,b:l,c,normal:new I,materialIndex:0};fn.getNormal(qa,Ka,Ja,u.normal),h.face=u,h.barycoord=f}return h}const Tr=new Ae,Bf=new Ae,If=new Ae,dx=new Ae,Rf=new Kt,to=new I,Qc=new Oe,Df=new Kt,zc=new Ar;class EA extends Ce{constructor(t,e){super(t,e),this.isSkinnedMesh=!0,this.type="SkinnedMesh",this.bindMode=bh,this.bindMatrix=new Kt,this.bindMatrixInverse=new Kt,this.boundingBox=null,this.boundingSphere=null}computeBoundingBox(){const t=this.geometry;this.boundingBox===null&&(this.boundingBox=new Ze),this.boundingBox.makeEmpty();const e=t.getAttribute("position");for(let n=0;n<e.count;n++)this.getVertexPosition(n,to),this.boundingBox.expandByPoint(to)}computeBoundingSphere(){const t=this.geometry;this.boundingSphere===null&&(this.boundingSphere=new Oe),this.boundingSphere.makeEmpty();const e=t.getAttribute("position");for(let n=0;n<e.count;n++)this.getVertexPosition(n,to),this.boundingSphere.expandByPoint(to)}copy(t,e){return super.copy(t,e),this.bindMode=t.bindMode,this.bindMatrix.copy(t.bindMatrix),this.bindMatrixInverse.copy(t.bindMatrixInverse),this.skeleton=t.skeleton,t.boundingBox!==null&&(this.boundingBox=t.boundingBox.clone()),t.boundingSphere!==null&&(this.boundingSphere=t.boundingSphere.clone()),this}raycast(t,e){const n=this.material,s=this.matrixWorld;n!==void 0&&(this.boundingSphere===null&&this.computeBoundingSphere(),Qc.copy(this.boundingSphere),Qc.applyMatrix4(s),t.ray.intersectsSphere(Qc)!==!1&&(Df.copy(s).invert(),zc.copy(t.ray).applyMatrix4(Df),!(this.boundingBox!==null&&zc.intersectsBox(this.boundingBox)===!1)&&this._computeIntersections(t,e,zc)))}getVertexPosition(t,e){return super.getVertexPosition(t,e),this.applyBoneTransform(t,e),e}bind(t,e){this.skeleton=t,e===void 0&&(this.updateMatrixWorld(!0),this.skeleton.calculateInverses(),e=this.matrixWorld),this.bindMatrix.copy(e),this.bindMatrixInverse.copy(e).invert()}pose(){this.skeleton.pose()}normalizeSkinWeights(){const t=new Ae,e=this.geometry.attributes.skinWeight;for(let n=0,s=e.count;n<s;n++){t.fromBufferAttribute(e,n);const r=1/t.manhattanLength();r!==1/0?t.multiplyScalar(r):t.set(1,0,0,0),e.setXYZW(n,t.x,t.y,t.z,t.w)}}updateMatrixWorld(t){super.updateMatrixWorld(t),this.bindMode===bh?this.bindMatrixInverse.copy(this.matrixWorld).invert():this.bindMode===eA?this.bindMatrixInverse.copy(this.bindMatrix).invert():_t("SkinnedMesh: Unrecognized bindMode: "+this.bindMode)}applyBoneTransform(t,e){const n=this.skeleton,s=this.geometry;Bf.fromBufferAttribute(s.attributes.skinIndex,t),If.fromBufferAttribute(s.attributes.skinWeight,t),e.isVector4?(Tr.copy(e),e.set(0,0,0,0)):(Tr.set(...e,1),e.set(0,0,0)),Tr.applyMatrix4(this.bindMatrix);for(let r=0;r<4;r++){const a=If.getComponent(r);if(a!==0){const o=Bf.getComponent(r);Rf.multiplyMatrices(n.bones[o].matrixWorld,n.boneInverses[o]),e.addScaledVector(dx.copy(Tr).applyMatrix4(Rf),a)}}return e.isVector4&&(e.w=Tr.w),e.applyMatrix4(this.bindMatrixInverse)}}class vu extends he{constructor(){super(),this.isBone=!0,this.type="Bone"}}class Mn extends Me{constructor(t=null,e=1,n=1,s,r,a,o,l,c=be,h=be,f,u){super(null,a,o,l,c,h,s,r,f,u),this.isDataTexture=!0,this.image={data:t,width:e,height:n},this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}}const Pf=new Kt,px=new Kt;class Kl{constructor(t=[],e=[]){this.uuid=yn(),this.bones=t.slice(0),this.boneInverses=e,this.boneMatrices=null,this.boneTexture=null,this.init()}init(){const t=this.bones,e=this.boneInverses;if(this.boneMatrices=new Float32Array(t.length*16),e.length===0)this.calculateInverses();else if(t.length!==e.length){_t("Skeleton: Number of inverse bone matrices does not match amount of bones."),this.boneInverses=[];for(let n=0,s=this.bones.length;n<s;n++)this.boneInverses.push(new Kt)}}calculateInverses(){this.boneInverses.length=0;for(let t=0,e=this.bones.length;t<e;t++){const n=new Kt;this.bones[t]&&n.copy(this.bones[t].matrixWorld).invert(),this.boneInverses.push(n)}}pose(){for(let t=0,e=this.bones.length;t<e;t++){const n=this.bones[t];n&&n.matrixWorld.copy(this.boneInverses[t]).invert()}for(let t=0,e=this.bones.length;t<e;t++){const n=this.bones[t];n&&(n.parent&&n.parent.isBone?(n.matrix.copy(n.parent.matrixWorld).invert(),n.matrix.multiply(n.matrixWorld)):n.matrix.copy(n.matrixWorld),n.matrix.decompose(n.position,n.quaternion,n.scale))}}update(){const t=this.bones,e=this.boneInverses,n=this.boneMatrices,s=this.boneTexture;for(let r=0,a=t.length;r<a;r++){const o=t[r]?t[r].matrixWorld:px;Pf.multiplyMatrices(o,e[r]),Pf.toArray(n,r*16)}s!==null&&(s.needsUpdate=!0)}clone(){return new Kl(this.bones,this.boneInverses)}computeBoneTexture(){let t=Math.sqrt(this.bones.length*4);t=Math.ceil(t/4)*4,t=Math.max(t,4);const e=new Float32Array(t*t*4);e.set(this.boneMatrices);const n=new Mn(e,t,t,Je,sn);return n.needsUpdate=!0,this.boneMatrices=e,this.boneTexture=n,this}getBoneByName(t){for(let e=0,n=this.bones.length;e<n;e++){const s=this.bones[e];if(s.name===t)return s}}dispose(){this.boneTexture!==null&&(this.boneTexture.dispose(),this.boneTexture=null)}fromJSON(t,e){this.uuid=t.uuid;for(let n=0,s=t.bones.length;n<s;n++){const r=t.bones[n];let a=e[r];a===void 0&&(_t("Skeleton: No bone found with UUID:",r),a=new vu),this.bones.push(a),this.boneInverses.push(new Kt().fromArray(t.boneInverses[n]))}return this.init(),this}toJSON(){const t={metadata:{version:4.7,type:"Skeleton",generator:"Skeleton.toJSON"},bones:[],boneInverses:[]};t.uuid=this.uuid;const e=this.bones,n=this.boneInverses;for(let s=0,r=e.length;s<r;s++){const a=e[s];t.bones.push(a.uuid);const o=n[s];t.boneInverses.push(o.toArray())}return t}}class cr extends fe{constructor(t,e,n,s=1){super(t,e,n),this.isInstancedBufferAttribute=!0,this.meshPerAttribute=s}copy(t){return super.copy(t),this.meshPerAttribute=t.meshPerAttribute,this}toJSON(){const t=super.toJSON();return t.meshPerAttribute=this.meshPerAttribute,t.isInstancedBufferAttribute=!0,t}}const Ns=new Kt,Lf=new Kt,eo=[],Ff=new Ze,Ax=new Kt,Br=new Ce,Ir=new Oe;class SA extends Ce{constructor(t,e,n){super(t,e),this.isInstancedMesh=!0,this.instanceMatrix=new cr(new Float32Array(n*16),16),this.instanceColor=null,this.morphTexture=null,this.count=n,this.boundingBox=null,this.boundingSphere=null;for(let s=0;s<n;s++)this.setMatrixAt(s,Ax)}computeBoundingBox(){const t=this.geometry,e=this.count;this.boundingBox===null&&(this.boundingBox=new Ze),t.boundingBox===null&&t.computeBoundingBox(),this.boundingBox.makeEmpty();for(let n=0;n<e;n++)this.getMatrixAt(n,Ns),Ff.copy(t.boundingBox).applyMatrix4(Ns),this.boundingBox.union(Ff)}computeBoundingSphere(){const t=this.geometry,e=this.count;this.boundingSphere===null&&(this.boundingSphere=new Oe),t.boundingSphere===null&&t.computeBoundingSphere(),this.boundingSphere.makeEmpty();for(let n=0;n<e;n++)this.getMatrixAt(n,Ns),Ir.copy(t.boundingSphere).applyMatrix4(Ns),this.boundingSphere.union(Ir)}copy(t,e){return super.copy(t,e),this.instanceMatrix.copy(t.instanceMatrix),t.morphTexture!==null&&(this.morphTexture=t.morphTexture.clone()),t.instanceColor!==null&&(this.instanceColor=t.instanceColor.clone()),this.count=t.count,t.boundingBox!==null&&(this.boundingBox=t.boundingBox.clone()),t.boundingSphere!==null&&(this.boundingSphere=t.boundingSphere.clone()),this}getColorAt(t,e){return this.instanceColor===null?e.setRGB(1,1,1):e.fromArray(this.instanceColor.array,t*3)}getMatrixAt(t,e){return e.fromArray(this.instanceMatrix.array,t*16)}getMorphAt(t,e){const n=e.morphTargetInfluences,s=this.morphTexture.source.data.data,r=n.length+1,a=t*r+1;for(let o=0;o<n.length;o++)n[o]=s[a+o]}raycast(t,e){const n=this.matrixWorld,s=this.count;if(Br.geometry=this.geometry,Br.material=this.material,Br.material!==void 0&&(this.boundingSphere===null&&this.computeBoundingSphere(),Ir.copy(this.boundingSphere),Ir.applyMatrix4(n),t.ray.intersectsSphere(Ir)!==!1))for(let r=0;r<s;r++){this.getMatrixAt(r,Ns),Lf.multiplyMatrices(n,Ns),Br.matrixWorld=Lf,Br.raycast(t,eo);for(let a=0,o=eo.length;a<o;a++){const l=eo[a];l.instanceId=r,l.object=this,e.push(l)}eo.length=0}}setColorAt(t,e){return this.instanceColor===null&&(this.instanceColor=new cr(new Float32Array(this.instanceMatrix.count*3).fill(1),3)),e.toArray(this.instanceColor.array,t*3),this}setMatrixAt(t,e){return e.toArray(this.instanceMatrix.array,t*16),this}setMorphAt(t,e){const n=e.morphTargetInfluences,s=n.length+1;this.morphTexture===null&&(this.morphTexture=new Mn(new Float32Array(s*this.count),s,this.count,Ul,sn));const r=this.morphTexture.source.data.data;let a=0;for(let c=0;c<n.length;c++)a+=n[c];const o=this.geometry.morphTargetsRelative?1:1-a,l=s*t;return r[l]=o,r.set(n,l+1),this}updateMorphTargets(){}dispose(){super.dispose(),this.morphTexture!==null&&(this.morphTexture.dispose(),this.morphTexture=null)}}const Xi=new Oe,mx=new lt(.5,.5),no=new I;class ds{constructor(t=new ci,e=new ci,n=new ci,s=new ci,r=new ci,a=new ci){this.planes=[t,e,n,s,r,a]}set(t,e,n,s,r,a){const o=this.planes;return o[0].copy(t),o[1].copy(e),o[2].copy(n),o[3].copy(s),o[4].copy(r),o[5].copy(a),this}copy(t){const e=this.planes;for(let n=0;n<6;n++)e[n].copy(t.planes[n]);return this}setFromProjectionMatrix(t,e=vn,n=!1){const s=this.planes,r=t.elements,a=r[0],o=r[1],l=r[2],c=r[3],h=r[4],f=r[5],u=r[6],d=r[7],p=r[8],g=r[9],m=r[10],A=r[11],v=r[12],M=r[13],x=r[14],S=r[15];if(s[0].setComponents(c-a,d-h,A-p,S-v).normalize(),s[1].setComponents(c+a,d+h,A+p,S+v).normalize(),s[2].setComponents(c+o,d+f,A+g,S+M).normalize(),s[3].setComponents(c-o,d-f,A-g,S-M).normalize(),n)s[4].setComponents(l,u,m,x).normalize(),s[5].setComponents(c-l,d-u,A-m,S-x).normalize();else if(s[4].setComponents(c-l,d-u,A-m,S-x).normalize(),e===vn)s[5].setComponents(c+l,d+u,A+m,S+x).normalize();else if(e===us)s[5].setComponents(l,u,m,x).normalize();else throw new Error("THREE.Frustum.setFromProjectionMatrix(): Invalid coordinate system: "+e);return this}intersectsObject(t){if(t.boundingSphere!==void 0)t.boundingSphere===null&&t.computeBoundingSphere(),Xi.copy(t.boundingSphere).applyMatrix4(t.matrixWorld);else{const e=t.geometry;e.boundingSphere===null&&e.computeBoundingSphere(),Xi.copy(e.boundingSphere).applyMatrix4(t.matrixWorld)}return this.intersectsSphere(Xi)}intersectsSprite(t){Xi.center.set(0,0,0);const e=mx.distanceTo(t.center);return Xi.radius=.7071067811865476+e,Xi.applyMatrix4(t.matrixWorld),this.intersectsSphere(Xi)}intersectsSphere(t){const e=this.planes,n=t.center,s=-t.radius;for(let r=0;r<6;r++)if(e[r].distanceToPoint(n)<s)return!1;return!0}intersectsBox(t){const e=this.planes;for(let n=0;n<6;n++){const s=e[n];if(no.x=s.normal.x>0?t.max.x:t.min.x,no.y=s.normal.y>0?t.max.y:t.min.y,no.z=s.normal.z>0?t.max.z:t.min.z,s.distanceToPoint(no)<0)return!1}return!0}containsPoint(t){const e=this.planes;for(let n=0;n<6;n++)if(e[n].distanceToPoint(t)<0)return!1;return!0}clone(){return new this.constructor().copy(this)}}const Uf=new Kt;class Jl{constructor(){this.coordinateSystem=vn,this._frustums=[],this._count=0}setFromArrayCamera(t){const e=t.cameras,n=this._frustums;for(let s=0;s<e.length;s++){const r=e[s];Uf.multiplyMatrices(r.projectionMatrix,r.matrixWorldInverse),n[s]===void 0&&(n[s]=new ds),n[s].setFromProjectionMatrix(Uf,r.coordinateSystem,r.reversedDepth)}return this._count=e.length,this}intersectsObject(t){const e=this._frustums;for(let n=0;n<this._count;n++)if(e[n].intersectsObject(t))return!0;return!1}intersectsSprite(t){const e=this._frustums;for(let n=0;n<this._count;n++)if(e[n].intersectsSprite(t))return!0;return!1}intersectsSphere(t){const e=this._frustums;for(let n=0;n<this._count;n++)if(e[n].intersectsSphere(t))return!0;return!1}intersectsBox(t){const e=this._frustums;for(let n=0;n<this._count;n++)if(e[n].intersectsBox(t))return!0;return!1}containsPoint(t){const e=this._frustums;for(let n=0;n<this._count;n++)if(e[n].containsPoint(t))return!0;return!1}copy(t){this.coordinateSystem=t.coordinateSystem;const e=this._frustums,n=t._frustums;for(let s=0;s<t._count;s++)e[s]===void 0&&(e[s]=new ds),e[s].copy(n[s]);return this._count=t._count,this}clone(){return new Jl().copy(this)}}function Hc(i,t){return i-t}function gx(i,t){return i.z-t.z}function xx(i,t){return t.z-i.z}class _x{constructor(){this.index=0,this.pool=[],this.list=[]}push(t,e,n,s){const r=this.pool,a=this.list;this.index>=r.length&&r.push({start:-1,count:-1,z:-1,index:-1});const o=r[this.index];a.push(o),this.index++,o.start=t,o.count=e,o.z=n,o.index=s}reset(){this.list.length=0,this.index=0}}const cn=new Kt,vx=new bt(1,1,1),yx=new ds,Mx=new Jl,io=new Ze,qi=new Oe,Rr=new I,Nf=new I,Ex=new I,Vc=new _x,Ye=new Ce,so=[];function Sx(i,t,e=0){const n=t.itemSize;if(i.isInterleavedBufferAttribute||i.array.constructor!==t.array.constructor){const s=i.count;for(let r=0;r<s;r++)for(let a=0;a<n;a++)t.setComponent(r+e,a,i.getComponent(r,a))}else t.array.set(i.array,e*n);t.needsUpdate=!0}function Ki(i,t){if(i.constructor!==t.constructor){const e=Math.min(i.length,t.length);for(let n=0;n<e;n++)t[n]=i[n]}else{const e=Math.min(i.length,t.length);t.set(new i.constructor(i.buffer,0,e))}}class wA extends Ce{constructor(t,e,n=e*2,s){super(new $t,s),this.isBatchedMesh=!0,this.perObjectFrustumCulled=!0,this.sortObjects=!0,this.boundingBox=null,this.boundingSphere=null,this.customSort=null,this._instanceInfo=[],this._geometryInfo=[],this._availableInstanceIds=[],this._availableGeometryIds=[],this._nextIndexStart=0,this._nextVertexStart=0,this._geometryCount=0,this._visibilityChanged=!0,this._geometryInitialized=!1,this._maxInstanceCount=t,this._maxVertexCount=e,this._maxIndexCount=n,this._multiDrawCounts=new Int32Array(t),this._multiDrawStarts=new Int32Array(t),this._multiDrawCount=0,this._multiDrawBytesPerElement=1,this._matricesTexture=null,this._indirectTexture=null,this._colorsTexture=null,this._initMatricesTexture(),this._initIndirectTexture()}get maxInstanceCount(){return this._maxInstanceCount}get instanceCount(){return this._instanceInfo.length-this._availableInstanceIds.length}get unusedVertexCount(){return this._maxVertexCount-this._nextVertexStart}get unusedIndexCount(){return this._maxIndexCount-this._nextIndexStart}_initMatricesTexture(){let t=Math.sqrt(this._maxInstanceCount*4);t=Math.ceil(t/4)*4,t=Math.max(t,4);const e=new Float32Array(t*t*4),n=new Mn(e,t,t,Je,sn);this._matricesTexture=n}_initIndirectTexture(){let t=Math.sqrt(this._maxInstanceCount);t=Math.ceil(t);const e=new Uint32Array(t*t),n=new Mn(e,t,t,va,Tn);this._indirectTexture=n}_initColorsTexture(){let t=Math.sqrt(this._maxInstanceCount);t=Math.ceil(t);const e=new Float32Array(t*t*4).fill(1),n=new Mn(e,t,t,Je,sn);n.colorSpace=ae.workingColorSpace,this._colorsTexture=n}_initializeGeometry(t){const e=this.geometry,n=this._maxVertexCount,s=this._maxIndexCount;if(this._geometryInitialized===!1){for(const r in t.attributes){const a=t.getAttribute(r),{array:o,itemSize:l,normalized:c}=a,h=new o.constructor(n*l),f=new fe(h,l,c);e.setAttribute(r,f)}if(t.getIndex()!==null){const r=n>65535?new Uint32Array(s):new Uint16Array(s);e.setIndex(new fe(r,1))}this._geometryInitialized=!0}}_validateGeometry(t){const e=this.geometry;if(!!t.getIndex()!=!!e.getIndex())throw new Error('THREE.BatchedMesh: All geometries must consistently have "index".');for(const n in e.attributes){if(!t.hasAttribute(n))throw new Error(`THREE.BatchedMesh: Added geometry missing "${n}". All geometries must have consistent attributes.`);const s=t.getAttribute(n),r=e.getAttribute(n);if(s.itemSize!==r.itemSize||s.normalized!==r.normalized)throw new Error("THREE.BatchedMesh: All attributes must have a consistent itemSize and normalized value.")}}validateInstanceId(t){const e=this._instanceInfo;if(t<0||t>=e.length||e[t].active===!1)throw new Error(`THREE.BatchedMesh: Invalid instanceId ${t}. Instance is either out of range or has been deleted.`)}validateGeometryId(t){const e=this._geometryInfo;if(t<0||t>=e.length||e[t].active===!1)throw new Error(`THREE.BatchedMesh: Invalid geometryId ${t}. Geometry is either out of range or has been deleted.`)}setCustomSort(t){return this.customSort=t,this}computeBoundingBox(){this.boundingBox===null&&(this.boundingBox=new Ze);const t=this.boundingBox,e=this._instanceInfo;t.makeEmpty();for(let n=0,s=e.length;n<s;n++){if(e[n].active===!1)continue;const r=e[n].geometryIndex;this.getMatrixAt(n,cn),this.getBoundingBoxAt(r,io).applyMatrix4(cn),t.union(io)}}computeBoundingSphere(){this.boundingSphere===null&&(this.boundingSphere=new Oe);const t=this.boundingSphere,e=this._instanceInfo;t.makeEmpty();for(let n=0,s=e.length;n<s;n++){if(e[n].active===!1)continue;const r=e[n].geometryIndex;this.getMatrixAt(n,cn),this.getBoundingSphereAt(r,qi).applyMatrix4(cn),t.union(qi)}}addInstance(t){if(this._instanceInfo.length>=this.maxInstanceCount&&this._availableInstanceIds.length===0)throw new Error("THREE.BatchedMesh: Maximum item count reached.");const n={visible:!0,active:!0,geometryIndex:t};let s=null;this._availableInstanceIds.length>0?(this._availableInstanceIds.sort(Hc),s=this._availableInstanceIds.shift(),this._instanceInfo[s]=n):(s=this._instanceInfo.length,this._instanceInfo.push(n));const r=this._matricesTexture;cn.identity().toArray(r.image.data,s*16),r.needsUpdate=!0;const a=this._colorsTexture;return a&&(vx.toArray(a.image.data,s*4),a.needsUpdate=!0),this._visibilityChanged=!0,s}addGeometry(t,e=-1,n=-1){this._initializeGeometry(t),this._validateGeometry(t);const s={vertexStart:-1,vertexCount:-1,reservedVertexCount:-1,indexStart:-1,indexCount:-1,reservedIndexCount:-1,start:-1,count:-1,boundingBox:null,boundingSphere:null,active:!0},r=this._geometryInfo;s.vertexStart=this._nextVertexStart,s.reservedVertexCount=e===-1?t.getAttribute("position").count:e;const a=t.getIndex();if(a!==null&&(s.indexStart=this._nextIndexStart,s.reservedIndexCount=n===-1?a.count:n),s.indexStart!==-1&&s.indexStart+s.reservedIndexCount>this._maxIndexCount||s.vertexStart+s.reservedVertexCount>this._maxVertexCount)throw new Error("THREE.BatchedMesh: Reserved space request exceeds the maximum buffer size.");let l;return this._availableGeometryIds.length>0?(this._availableGeometryIds.sort(Hc),l=this._availableGeometryIds.shift(),r[l]=s):(l=this._geometryCount,this._geometryCount++,r.push(s)),this.setGeometryAt(l,t),this._nextIndexStart=s.indexStart+s.reservedIndexCount,this._nextVertexStart=s.vertexStart+s.reservedVertexCount,l}setGeometryAt(t,e){if(t>=this._geometryCount)throw new Error("THREE.BatchedMesh: Maximum geometry count reached.");this._validateGeometry(e);const n=this.geometry,s=n.getIndex()!==null,r=n.getIndex(),a=e.getIndex(),o=this._geometryInfo[t];if(s&&a.count>o.reservedIndexCount||e.attributes.position.count>o.reservedVertexCount)throw new Error("THREE.BatchedMesh: Reserved space not large enough for provided geometry.");const l=o.vertexStart,c=o.reservedVertexCount;o.vertexCount=e.getAttribute("position").count;for(const h in n.attributes){const f=e.getAttribute(h),u=n.getAttribute(h);Sx(f,u,l);const d=f.itemSize;for(let p=f.count,g=c;p<g;p++){const m=l+p;for(let A=0;A<d;A++)u.setComponent(m,A,0)}u.needsUpdate=!0,u.addUpdateRange(l*d,c*d)}if(s){const h=o.indexStart,f=o.reservedIndexCount;o.indexCount=e.getIndex().count;for(let u=0;u<a.count;u++)r.setX(h+u,l+a.getX(u));for(let u=a.count,d=f;u<d;u++)r.setX(h+u,l);r.needsUpdate=!0,r.addUpdateRange(h,o.reservedIndexCount)}return o.start=s?o.indexStart:o.vertexStart,o.count=s?o.indexCount:o.vertexCount,o.boundingBox=null,e.boundingBox!==null&&(o.boundingBox=e.boundingBox.clone()),o.boundingSphere=null,e.boundingSphere!==null&&(o.boundingSphere=e.boundingSphere.clone()),this._visibilityChanged=!0,t}deleteGeometry(t){const e=this._geometryInfo;if(t>=e.length||e[t].active===!1)return this;const n=this._instanceInfo;for(let s=0,r=n.length;s<r;s++)n[s].active&&n[s].geometryIndex===t&&this.deleteInstance(s);return e[t].active=!1,this._availableGeometryIds.push(t),this._visibilityChanged=!0,this}deleteInstance(t){return this.validateInstanceId(t),this._instanceInfo[t].active=!1,this._availableInstanceIds.push(t),this._visibilityChanged=!0,this}optimize(){let t=0,e=0;const n=this._geometryInfo,s=n.map((a,o)=>o).sort((a,o)=>n[a].vertexStart-n[o].vertexStart),r=this.geometry;for(let a=0,o=n.length;a<o;a++){const l=s[a],c=n[l];if(c.active!==!1){if(r.index!==null){if(c.indexStart!==e){const{indexStart:h,vertexStart:f,reservedIndexCount:u}=c,d=r.index,p=d.array,g=t-f;for(let m=h;m<h+u;m++)p[m]=p[m]+g;d.array.copyWithin(e,h,h+u),d.addUpdateRange(e,u),d.needsUpdate=!0,c.indexStart=e}e+=c.reservedIndexCount}if(c.vertexStart!==t){const{vertexStart:h,reservedVertexCount:f}=c,u=r.attributes;for(const d in u){const p=u[d],{array:g,itemSize:m}=p;g.copyWithin(t*m,h*m,(h+f)*m),p.addUpdateRange(t*m,f*m),p.needsUpdate=!0}c.vertexStart=t}t+=c.reservedVertexCount,c.start=r.index?c.indexStart:c.vertexStart}}return this._nextIndexStart=e,this._nextVertexStart=t,this._visibilityChanged=!0,this}getBoundingBoxAt(t,e){if(t>=this._geometryCount)return null;const n=this.geometry,s=this._geometryInfo[t];if(s.boundingBox===null){const r=new Ze,a=n.index,o=n.attributes.position;for(let l=s.start,c=s.start+s.count;l<c;l++){let h=l;a&&(h=a.getX(h)),r.expandByPoint(Rr.fromBufferAttribute(o,h))}s.boundingBox=r}return e.copy(s.boundingBox),e}getBoundingSphereAt(t,e){if(t>=this._geometryCount)return null;const n=this.geometry,s=this._geometryInfo[t];if(s.boundingSphere===null){const r=new Oe;this.getBoundingBoxAt(t,io),io.getCenter(r.center);const a=n.index,o=n.attributes.position;let l=0;for(let c=s.start,h=s.start+s.count;c<h;c++){let f=c;a&&(f=a.getX(f)),Rr.fromBufferAttribute(o,f),l=Math.max(l,r.center.distanceToSquared(Rr))}r.radius=Math.sqrt(l),s.boundingSphere=r}return e.copy(s.boundingSphere),e}setMatrixAt(t,e){this.validateInstanceId(t);const n=this._matricesTexture,s=this._matricesTexture.image.data;return e.toArray(s,t*16),n.needsUpdate=!0,this}getMatrixAt(t,e){return this.validateInstanceId(t),e.fromArray(this._matricesTexture.image.data,t*16)}setColorAt(t,e){return this.validateInstanceId(t),this._colorsTexture===null&&this._initColorsTexture(),e.toArray(this._colorsTexture.image.data,t*4),this._colorsTexture.needsUpdate=!0,this}getColorAt(t,e){return this.validateInstanceId(t),this._colorsTexture===null?e.isVector4?e.set(1,1,1,1):e.setRGB(1,1,1):e.fromArray(this._colorsTexture.image.data,t*4)}setVisibleAt(t,e){return this.validateInstanceId(t),this._instanceInfo[t].visible===e?this:(this._instanceInfo[t].visible=e,this._visibilityChanged=!0,this)}getVisibleAt(t){return this.validateInstanceId(t),this._instanceInfo[t].visible}setGeometryIdAt(t,e){return this.validateInstanceId(t),this.validateGeometryId(e),this._instanceInfo[t].geometryIndex=e,this._visibilityChanged=!0,this}getGeometryIdAt(t){return this.validateInstanceId(t),this._instanceInfo[t].geometryIndex}getGeometryRangeAt(t,e={}){this.validateGeometryId(t);const n=this._geometryInfo[t];return e.vertexStart=n.vertexStart,e.vertexCount=n.vertexCount,e.reservedVertexCount=n.reservedVertexCount,e.indexStart=n.indexStart,e.indexCount=n.indexCount,e.reservedIndexCount=n.reservedIndexCount,e.start=n.start,e.count=n.count,e}setInstanceCount(t){const e=this._availableInstanceIds,n=this._instanceInfo;for(e.sort(Hc);e[e.length-1]===n.length-1;)n.pop(),e.pop();if(t<n.length)throw new Error(`THREE.BatchedMesh: Instance ids outside the range ${t} are being used. Cannot shrink instance count.`);const s=new Int32Array(t),r=new Int32Array(t);Ki(this._multiDrawCounts,s),Ki(this._multiDrawStarts,r),this._multiDrawCounts=s,this._multiDrawStarts=r,this._maxInstanceCount=t;const a=this._indirectTexture,o=this._matricesTexture,l=this._colorsTexture;a.dispose(),this._initIndirectTexture(),Ki(a.image.data,this._indirectTexture.image.data),o.dispose(),this._initMatricesTexture(),Ki(o.image.data,this._matricesTexture.image.data),l&&(l.dispose(),this._initColorsTexture(),Ki(l.image.data,this._colorsTexture.image.data))}setGeometrySize(t,e){const n=[...this._geometryInfo].filter(o=>o.active);if(Math.max(...n.map(o=>o.vertexStart+o.reservedVertexCount))>t)throw new Error(`THREE.BatchedMesh: Geometry vertex values are being used outside the range ${e}. Cannot shrink further.`);if(this.geometry.index&&Math.max(...n.map(l=>l.indexStart+l.reservedIndexCount))>e)throw new Error(`THREE.BatchedMesh: Geometry index values are being used outside the range ${e}. Cannot shrink further.`);const r=this.geometry;r.dispose(),this._maxVertexCount=t,this._maxIndexCount=e,this._geometryInitialized&&(this._geometryInitialized=!1,this.geometry=new $t,this._initializeGeometry(r));const a=this.geometry;r.index&&Ki(r.index.array,a.index.array);for(const o in r.attributes)Ki(r.attributes[o].array,a.attributes[o].array)}raycast(t,e){const n=this._instanceInfo,s=this._geometryInfo,r=this.matrixWorld,a=this.geometry;Ye.material=this.material,Ye.geometry.index=a.index,Ye.geometry.attributes=a.attributes,Ye.geometry.boundingBox===null&&(Ye.geometry.boundingBox=new Ze),Ye.geometry.boundingSphere===null&&(Ye.geometry.boundingSphere=new Oe);for(let o=0,l=n.length;o<l;o++){if(!n[o].visible||!n[o].active)continue;const c=n[o].geometryIndex,h=s[c];Ye.geometry.setDrawRange(h.start,h.count),this.getMatrixAt(o,Ye.matrixWorld).premultiply(r),this.getBoundingBoxAt(c,Ye.geometry.boundingBox),this.getBoundingSphereAt(c,Ye.geometry.boundingSphere),Ye.raycast(t,so);for(let f=0,u=so.length;f<u;f++){const d=so[f];d.object=this,d.batchId=o,e.push(d)}so.length=0}Ye.material=null,Ye.geometry.index=null,Ye.geometry.attributes={},Ye.geometry.setDrawRange(0,1/0)}copy(t){return super.copy(t),this.geometry=t.geometry.clone(),this.perObjectFrustumCulled=t.perObjectFrustumCulled,this.sortObjects=t.sortObjects,this.boundingBox=t.boundingBox!==null?t.boundingBox.clone():null,this.boundingSphere=t.boundingSphere!==null?t.boundingSphere.clone():null,this._geometryInfo=t._geometryInfo.map(e=>({...e,boundingBox:e.boundingBox!==null?e.boundingBox.clone():null,boundingSphere:e.boundingSphere!==null?e.boundingSphere.clone():null})),this._instanceInfo=t._instanceInfo.map(e=>({...e})),this._availableInstanceIds=t._availableInstanceIds.slice(),this._availableGeometryIds=t._availableGeometryIds.slice(),this._nextIndexStart=t._nextIndexStart,this._nextVertexStart=t._nextVertexStart,this._geometryCount=t._geometryCount,this._maxInstanceCount=t._maxInstanceCount,this._maxVertexCount=t._maxVertexCount,this._maxIndexCount=t._maxIndexCount,this._geometryInitialized=t._geometryInitialized,this._multiDrawCounts=t._multiDrawCounts.slice(),this._multiDrawStarts=t._multiDrawStarts.slice(),this._multiDrawBytesPerElement=t._multiDrawBytesPerElement,this._indirectTexture=t._indirectTexture.clone(),this._indirectTexture.image.data=this._indirectTexture.image.data.slice(),this._matricesTexture=t._matricesTexture.clone(),this._matricesTexture.image.data=this._matricesTexture.image.data.slice(),this._colorsTexture!==null&&(this._colorsTexture=t._colorsTexture.clone(),this._colorsTexture.image.data=this._colorsTexture.image.data.slice()),this}dispose(){super.dispose(),this.geometry.dispose(),this._matricesTexture.dispose(),this._matricesTexture=null,this._indirectTexture.dispose(),this._indirectTexture=null,this._colorsTexture!==null&&(this._colorsTexture.dispose(),this._colorsTexture=null)}onBeforeRender(t,e,n,s,r){if(!this._visibilityChanged&&!this.perObjectFrustumCulled&&!this.sortObjects)return;const a=s.getIndex();let o=a===null?1:a.array.BYTES_PER_ELEMENT,l=1;r.wireframe&&(l=2,o=s.attributes.position.count>65535?4:2);const c=this._instanceInfo,h=this._multiDrawStarts,f=this._multiDrawCounts,u=this._geometryInfo,d=this.perObjectFrustumCulled,p=this._indirectTexture,g=p.image.data,m=n.isArrayCamera?Mx:yx;d&&(n.isArrayCamera?m.setFromArrayCamera(n):(cn.multiplyMatrices(n.projectionMatrix,n.matrixWorldInverse).multiply(this.matrixWorld),m.setFromProjectionMatrix(cn,n.coordinateSystem,n.reversedDepth)));let A=0;if(this.sortObjects){cn.copy(this.matrixWorld).invert(),Rr.setFromMatrixPosition(n.matrixWorld).applyMatrix4(cn),Nf.set(0,0,-1).transformDirection(n.matrixWorld).transformDirection(cn);for(let x=0,S=c.length;x<S;x++)if(c[x].visible&&c[x].active){const E=c[x].geometryIndex;this.getMatrixAt(x,cn),this.getBoundingSphereAt(E,qi).applyMatrix4(cn);let C=!1;if(d&&(C=!m.intersectsSphere(qi)),!C){const _=u[E],b=Ex.subVectors(qi.center,Rr).dot(Nf);Vc.push(_.start,_.count,b,x)}}const v=Vc.list,M=this.customSort;M===null?v.sort(r.transparent?xx:gx):M.call(this,v,n);for(let x=0,S=v.length;x<S;x++){const E=v[x];h[A]=E.start*o*l,f[A]=E.count*l,g[A]=E.index,A++}Vc.reset()}else for(let v=0,M=c.length;v<M;v++)if(c[v].visible&&c[v].active){const x=c[v].geometryIndex;let S=!1;if(d&&(this.getMatrixAt(v,cn),this.getBoundingSphereAt(x,qi).applyMatrix4(cn),S=!m.intersectsSphere(qi)),!S){const E=u[x];h[A]=E.start*o*l,f[A]=E.count*l,g[A]=v,A++}}p.needsUpdate=!0,this._multiDrawCount=A,this._multiDrawBytesPerElement=o,this._visibilityChanged=!1}onBeforeShadow(t,e,n,s,r,a){this.onBeforeRender(t,null,s,r,a)}}class ln extends ke{constructor(t){super(),this.isLineBasicMaterial=!0,this.type="LineBasicMaterial",this.color=new bt(16777215),this.map=null,this.linewidth=1,this.linecap="round",this.linejoin="round",this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.color.copy(t.color),this.map=t.map,this.linewidth=t.linewidth,this.linecap=t.linecap,this.linejoin=t.linejoin,this.fog=t.fog,this}}const vl=new I,yl=new I,Of=new Kt,Dr=new Ar,ro=new Oe,Wc=new I,Gf=new I;class Ni extends he{constructor(t=new $t,e=new ln){super(),this.isLine=!0,this.type="Line",this.geometry=t,this.material=e,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.updateMorphTargets()}copy(t,e){return super.copy(t,e),this.material=Array.isArray(t.material)?t.material.slice():t.material,this.geometry=t.geometry,this}computeLineDistances(){const t=this.geometry;if(t.index===null){const e=t.attributes.position,n=[0];for(let s=1,r=e.count;s<r;s++)vl.fromBufferAttribute(e,s-1),yl.fromBufferAttribute(e,s),n[s]=n[s-1],n[s]+=vl.distanceTo(yl);t.setAttribute("lineDistance",new Ft(n,1))}else _t("Line.computeLineDistances(): Computation only possible with non-indexed BufferGeometry.");return this}intersectsFrustum(t){return t.intersectsObject(this)}raycast(t,e){const n=this.geometry,s=this.matrixWorld,r=t.params.Line.threshold,a=n.drawRange;if(n.boundingSphere===null&&n.computeBoundingSphere(),ro.copy(n.boundingSphere),ro.applyMatrix4(s),ro.radius+=r,t.ray.intersectsSphere(ro)===!1)return;Of.copy(s).invert(),Dr.copy(t.ray).applyMatrix4(Of);const o=r/((this.scale.x+this.scale.y+this.scale.z)/3),l=o*o,c=this.isLineSegments?2:1,h=n.index,u=n.attributes.position;if(h!==null){const d=Math.max(0,a.start),p=Math.min(h.count,a.start+a.count);for(let g=d,m=p-1;g<m;g+=c){const A=h.getX(g),v=h.getX(g+1),M=ao(this,t,Dr,l,A,v,g);M&&e.push(M)}if(this.isLineLoop){const g=h.getX(p-1),m=h.getX(d),A=ao(this,t,Dr,l,g,m,p-1);A&&e.push(A)}}else{const d=Math.max(0,a.start),p=Math.min(u.count,a.start+a.count);for(let g=d,m=p-1;g<m;g+=c){const A=ao(this,t,Dr,l,g,g+1,g);A&&e.push(A)}if(this.isLineLoop){const g=ao(this,t,Dr,l,p-1,d,p-1);g&&e.push(g)}}}updateMorphTargets(){const e=this.geometry.morphAttributes,n=Object.keys(e);if(n.length>0){const s=e[n[0]];if(s!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let r=0,a=s.length;r<a;r++){const o=s[r].name||String(r);this.morphTargetInfluences.push(0),this.morphTargetDictionary[o]=r}}}}}function ao(i,t,e,n,s,r,a){const o=i.geometry.attributes.position;if(vl.fromBufferAttribute(o,s),yl.fromBufferAttribute(o,r),e.distanceSqToSegment(vl,yl,Wc,Gf)>n)return;Wc.applyMatrix4(i.matrixWorld);const c=t.ray.origin.distanceTo(Wc);if(!(c<t.near||c>t.far))return{distance:c,point:Gf.clone().applyMatrix4(i.matrixWorld),index:a,face:null,faceIndex:null,barycoord:null,object:i}}const kf=new I,Qf=new I;class ni extends Ni{constructor(t,e){super(t,e),this.isLineSegments=!0,this.type="LineSegments"}computeLineDistances(){const t=this.geometry;if(t.index===null){const e=t.attributes.position,n=[];for(let s=0,r=e.count;s<r;s+=2)kf.fromBufferAttribute(e,s),Qf.fromBufferAttribute(e,s+1),n[s]=s===0?0:n[s-1],n[s+1]=n[s]+kf.distanceTo(Qf);t.setAttribute("lineDistance",new Ft(n,1))}else _t("LineSegments.computeLineDistances(): Computation only possible with non-indexed BufferGeometry.");return this}}class bA extends Ni{constructor(t,e){super(t,e),this.isLineLoop=!0,this.type="LineLoop"}}class yu extends ke{constructor(t){super(),this.isPointsMaterial=!0,this.type="PointsMaterial",this.color=new bt(16777215),this.map=null,this.alphaMap=null,this.size=1,this.sizeAttenuation=!0,this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.color.copy(t.color),this.map=t.map,this.alphaMap=t.alphaMap,this.size=t.size,this.sizeAttenuation=t.sizeAttenuation,this.fog=t.fog,this}}const zf=new Kt,Bh=new Ar,oo=new Oe,lo=new I;class CA extends he{constructor(t=new $t,e=new yu){super(),this.isPoints=!0,this.type="Points",this.geometry=t,this.material=e,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.updateMorphTargets()}copy(t,e){return super.copy(t,e),this.material=Array.isArray(t.material)?t.material.slice():t.material,this.geometry=t.geometry,this}intersectsFrustum(t){return t.intersectsObject(this)}raycast(t,e){const n=this.geometry,s=this.matrixWorld,r=t.params.Points.threshold,a=n.drawRange;if(n.boundingSphere===null&&n.computeBoundingSphere(),oo.copy(n.boundingSphere),oo.applyMatrix4(s),oo.radius+=r,t.ray.intersectsSphere(oo)===!1)return;zf.copy(s).invert(),Bh.copy(t.ray).applyMatrix4(zf);const o=r/((this.scale.x+this.scale.y+this.scale.z)/3),l=o*o,c=n.index,f=n.attributes.position;if(c!==null){const u=Math.max(0,a.start),d=Math.min(c.count,a.start+a.count);for(let p=u,g=d;p<g;p++){const m=c.getX(p);lo.fromBufferAttribute(f,m),Hf(lo,m,l,s,t,e,this)}}else{const u=Math.max(0,a.start),d=Math.min(f.count,a.start+a.count);for(let p=u,g=d;p<g;p++)lo.fromBufferAttribute(f,p),Hf(lo,p,l,s,t,e,this)}}updateMorphTargets(){const e=this.geometry.morphAttributes,n=Object.keys(e);if(n.length>0){const s=e[n[0]];if(s!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let r=0,a=s.length;r<a;r++){const o=s[r].name||String(r);this.morphTargetInfluences.push(0),this.morphTargetDictionary[o]=r}}}}}function Hf(i,t,e,n,s,r,a){const o=Bh.distanceSqToPoint(i);if(o<e){const l=new I;Bh.closestPointToPoint(i,l),l.applyMatrix4(n);const c=s.ray.origin.distanceTo(l);if(c<s.near||c>s.far)return;r.push({distance:c,distanceToRay:Math.sqrt(o),point:l,index:t,face:null,faceIndex:null,barycoord:null,object:a})}}class TA extends Me{constructor(t,e,n,s,r=xe,a=xe,o,l,c){super(t,e,n,s,r,a,o,l,c),this.isVideoTexture=!0,this.generateMipmaps=!1,this._requestVideoFrameCallbackId=0;const h=this;function f(){h.needsUpdate=!0,h._requestVideoFrameCallbackId=t.requestVideoFrameCallback(f)}"requestVideoFrameCallback"in t&&(this._requestVideoFrameCallbackId=t.requestVideoFrameCallback(f))}clone(){return new this.constructor(this.image).copy(this)}update(){const t=this.image;"requestVideoFrameCallback"in t===!1&&t.readyState>=t.HAVE_CURRENT_DATA&&(this.needsUpdate=!0)}dispose(){this._requestVideoFrameCallbackId!==0&&(this.source.data.cancelVideoFrameCallback(this._requestVideoFrameCallbackId),this._requestVideoFrameCallbackId=0),super.dispose()}}class wx extends TA{constructor(t,e,n,s,r,a,o,l){super({},t,e,n,s,r,a,o,l),this.isVideoFrameTexture=!0}update(){}clone(){return new this.constructor().copy(this)}setFrame(t){this.image=t,this.needsUpdate=!0}}class bx extends Me{constructor(t,e){super({width:t,height:e}),this.isFramebufferTexture=!0,this.magFilter=be,this.minFilter=be,this.generateMipmaps=!1,this.needsUpdate=!0}}class Zl extends Me{constructor(t,e,n,s,r,a,o,l,c,h,f,u){super(null,a,o,l,c,h,s,r,f,u),this.isCompressedTexture=!0,this.image={width:e,height:n},this.mipmaps=t,this.flipY=!1,this.generateMipmaps=!1}}class Cx extends Zl{constructor(t,e,n,s,r,a){super(t,e,n,r,a),this.isCompressedArrayTexture=!0,this.image.depth=s,this.wrapR=Ke,this.layerUpdates=new Set}copy(t){return super.copy(t),this.wrapR=t.wrapR,this}addLayerUpdate(t){this.layerUpdates.add(t)}clearLayerUpdates(){this.layerUpdates.clear()}}class Tx extends Zl{constructor(t,e,n){super(void 0,t[0].width,t[0].height,e,n,ti),this.isCompressedCubeTexture=!0,this.isCubeTexture=!0,this.image=t}}class ya extends Me{constructor(t=[],e=ti,n,s,r,a,o,l,c,h){super(t,e,n,s,r,a,o,l,c,h),this.isCubeTexture=!0,this.flipY=!1}get images(){return this.image}set images(t){this.image=t}}class Bx extends Me{constructor(t,e,n,s,r,a,o,l,c){super(t,e,n,s,r,a,o,l,c),this.isCanvasTexture=!0,this.needsUpdate=!0}}class Ix extends Me{constructor(t,e,n,s,r,a,o,l,c){super(t,e,n,s,r,a,o,l,c),this.isHTMLTexture=!0,this.generateMipmaps=!1,this.needsUpdate=!0;const h=t?t.parentNode:null;h!==null&&"requestPaint"in h&&(h.onpaint=()=>{this.needsUpdate=!0},h.requestPaint())}dispose(){const t=this.image?this.image.parentNode:null;t!==null&&"onpaint"in t&&(t.onpaint=null),super.dispose()}}class hr extends Me{constructor(t,e,n=Tn,s,r,a,o=be,l=be,c,h=ei,f=1){if(h!==ei&&h!==Ii)throw new Error("THREE.DepthTexture: format must be either THREE.DepthFormat or THREE.DepthStencilFormat");const u={width:t,height:e,depth:f};super(u,s,r,a,o,l,h,n,c),this.isDepthTexture=!0,this.flipY=!1,this.generateMipmaps=!1,this.compareFunction=null}copy(t){return super.copy(t),this.source=new ui(Object.assign({},t.image)),this.compareFunction=t.compareFunction,this}toJSON(t){const e=super.toJSON(t);return e.compareFunction=this.compareFunction,e}}class BA extends hr{constructor(t,e=Tn,n=ti,s,r,a=be,o=be,l,c=ei){const h={width:t,height:t,depth:1},f=[h,h,h,h,h,h];super(t,t,e,n,s,r,a,o,l,c),this.image=f,this.isCubeDepthTexture=!0,this.isCubeTexture=!0}get images(){return this.image}set images(t){this.image=t}}class Mu extends Me{constructor(t=null){super(),this.sourceTexture=t,this.isExternalTexture=!0}copy(t){return super.copy(t),this.sourceTexture=t.sourceTexture,this}}class As extends $t{constructor(t=1,e=1,n=1,s=1,r=1,a=1){super(),this.type="BoxGeometry",this.parameters={width:t,height:e,depth:n,widthSegments:s,heightSegments:r,depthSegments:a};const o=this;s=Math.floor(s),r=Math.floor(r),a=Math.floor(a);const l=[],c=[],h=[],f=[];let u=0,d=0;p("z","y","x",-1,-1,n,e,t,a,r,0),p("z","y","x",1,-1,n,e,-t,a,r,1),p("x","z","y",1,1,t,n,e,s,a,2),p("x","z","y",1,-1,t,n,-e,s,a,3),p("x","y","z",1,-1,t,e,n,s,r,4),p("x","y","z",-1,-1,t,e,-n,s,r,5),this.setIndex(l),this.setAttribute("position",new Ft(c,3)),this.setAttribute("normal",new Ft(h,3)),this.setAttribute("uv",new Ft(f,2));function p(g,m,A,v,M,x,S,E,C,_,b){const B=x/C,P=S/_,U=x/2,k=S/2,L=E/2,O=C+1,q=_+1;let Y=0,at=0;const Q=new I;for(let $=0;$<q;$++){const st=$*P-k;for(let Ut=0;Ut<O;Ut++){const Tt=Ut*B-U;Q[g]=Tt*v,Q[m]=st*M,Q[A]=L,c.push(Q.x,Q.y,Q.z),Q[g]=0,Q[m]=0,Q[A]=E>0?1:-1,h.push(Q.x,Q.y,Q.z),f.push(Ut/C),f.push(1-$/_),Y+=1}}for(let $=0;$<_;$++)for(let st=0;st<C;st++){const Ut=u+st+O*$,Tt=u+st+O*($+1),oe=u+(st+1)+O*($+1),Zt=u+(st+1)+O*$;l.push(Ut,Tt,Zt),l.push(Tt,oe,Zt),at+=6}o.addGroup(d,at,b),d+=at,u+=Y}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new As(t.width,t.height,t.depth,t.widthSegments,t.heightSegments,t.depthSegments)}}class $l extends $t{constructor(t=1,e=1,n=4,s=8,r=1){super(),this.type="CapsuleGeometry",this.parameters={radius:t,height:e,capSegments:n,radialSegments:s,heightSegments:r},e=Math.max(0,e),n=Math.max(1,Math.floor(n)),s=Math.max(3,Math.floor(s)),r=Math.max(1,Math.floor(r));const a=[],o=[],l=[],c=[],h=e/2,f=Math.PI/2*t,u=e,d=2*f+u,p=n*2+r,g=s+1,m=new I,A=new I;for(let v=0;v<=p;v++){let M=0,x=0,S=0,E=0;if(v<=n){const b=v/n,B=b*Math.PI/2;x=-h-t*Math.cos(B),S=t*Math.sin(B),E=-t*Math.cos(B),M=b*f}else if(v<=n+r){const b=(v-n)/r;x=-h+b*e,S=t,E=0,M=f+b*u}else{const b=(v-n-r)/n,B=b*Math.PI/2;x=h+t*Math.sin(B),S=t*Math.cos(B),E=t*Math.sin(B),M=f+u+b*f}const C=Math.max(0,Math.min(1,M/d));let _=0;v===0?_=.5/s:v===p&&(_=-.5/s);for(let b=0;b<=s;b++){const B=b/s,P=B*Math.PI*2,U=Math.sin(P),k=Math.cos(P);A.x=-S*k,A.y=x,A.z=S*U,o.push(A.x,A.y,A.z),m.set(-S*k,E,S*U),m.normalize(),l.push(m.x,m.y,m.z),c.push(B+_,C)}if(v>0){const b=(v-1)*g;for(let B=0;B<s;B++){const P=b+B,U=b+B+1,k=v*g+B,L=v*g+B+1;a.push(P,U,k),a.push(U,L,k)}}}this.setIndex(a),this.setAttribute("position",new Ft(o,3)),this.setAttribute("normal",new Ft(l,3)),this.setAttribute("uv",new Ft(c,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new $l(t.radius,t.height,t.capSegments,t.radialSegments,t.heightSegments)}}class jl extends $t{constructor(t=1,e=32,n=0,s=Math.PI*2){super(),this.type="CircleGeometry",this.parameters={radius:t,segments:e,thetaStart:n,thetaLength:s},e=Math.max(3,e);const r=[],a=[],o=[],l=[],c=new I,h=new lt;a.push(0,0,0),o.push(0,0,1),l.push(.5,.5);for(let f=0,u=3;f<=e;f++,u+=3){const d=n+f/e*s;c.x=t*Math.cos(d),c.y=t*Math.sin(d),a.push(c.x,c.y,c.z),o.push(0,0,1),h.x=(a[u]/t+1)/2,h.y=(a[u+1]/t+1)/2,l.push(h.x,h.y)}for(let f=1;f<=e;f++)r.push(f,f+1,0);this.setIndex(r),this.setAttribute("position",new Ft(a,3)),this.setAttribute("normal",new Ft(o,3)),this.setAttribute("uv",new Ft(l,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new jl(t.radius,t.segments,t.thetaStart,t.thetaLength)}}class Ma extends $t{constructor(t=1,e=1,n=1,s=32,r=1,a=!1,o=0,l=Math.PI*2){super(),this.type="CylinderGeometry",this.parameters={radiusTop:t,radiusBottom:e,height:n,radialSegments:s,heightSegments:r,openEnded:a,thetaStart:o,thetaLength:l};const c=this;s=Math.floor(s),r=Math.floor(r);const h=[],f=[],u=[],d=[];let p=0;const g=[],m=n/2;let A=0;v(),a===!1&&(t>0&&M(!0),e>0&&M(!1)),this.setIndex(h),this.setAttribute("position",new Ft(f,3)),this.setAttribute("normal",new Ft(u,3)),this.setAttribute("uv",new Ft(d,2));function v(){const x=new I,S=new I;let E=0;const C=(e-t)/n;for(let _=0;_<=r;_++){const b=[],B=_/r,P=B*(e-t)+t;for(let U=0;U<=s;U++){const k=U/s,L=k*l+o,O=Math.sin(L),q=Math.cos(L);S.x=P*O,S.y=-B*n+m,S.z=P*q,f.push(S.x,S.y,S.z),x.set(O,C,q).normalize(),u.push(x.x,x.y,x.z),d.push(k,1-B),b.push(p++)}g.push(b)}for(let _=0;_<s;_++)for(let b=0;b<r;b++){const B=g[b][_],P=g[b+1][_],U=g[b+1][_+1],k=g[b][_+1];(t>0||b!==0)&&(h.push(B,P,k),E+=3),(e>0||b!==r-1)&&(h.push(P,U,k),E+=3)}c.addGroup(A,E,0),A+=E}function M(x){const S=p,E=new lt,C=new I;let _=0;const b=x===!0?t:e,B=x===!0?1:-1;for(let U=1;U<=s;U++)f.push(0,m*B,0),u.push(0,B,0),d.push(.5,.5),p++;const P=p;for(let U=0;U<=s;U++){const L=U/s*l+o,O=Math.cos(L),q=Math.sin(L);C.x=b*q,C.y=m*B,C.z=b*O,f.push(C.x,C.y,C.z),u.push(0,B,0),E.x=O*.5+.5,E.y=q*.5*B+.5,d.push(E.x,E.y),p++}for(let U=0;U<s;U++){const k=S+U,L=P+U;x===!0?h.push(L,L+1,k):h.push(L+1,L,k),_+=3}c.addGroup(A,_,x===!0?1:2),A+=_}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new Ma(t.radiusTop,t.radiusBottom,t.height,t.radialSegments,t.heightSegments,t.openEnded,t.thetaStart,t.thetaLength)}}class Ea extends Ma{constructor(t=1,e=1,n=32,s=1,r=!1,a=0,o=Math.PI*2){super(0,t,e,n,s,r,a,o),this.type="ConeGeometry",this.parameters={radius:t,height:e,radialSegments:n,heightSegments:s,openEnded:r,thetaStart:a,thetaLength:o}}static fromJSON(t){return new Ea(t.radius,t.height,t.radialSegments,t.heightSegments,t.openEnded,t.thetaStart,t.thetaLength)}}class Gi extends $t{constructor(t=[],e=[],n=1,s=0){super(),this.type="PolyhedronGeometry",this.parameters={vertices:t,indices:e,radius:n,detail:s};const r=[],a=[];o(s),c(n),h(),this.setAttribute("position",new Ft(r,3)),this.setAttribute("normal",new Ft(r.slice(),3)),this.setAttribute("uv",new Ft(a,2)),s===0?this.computeVertexNormals():this.normalizeNormals();function o(v){const M=new I,x=new I,S=new I;for(let E=0;E<e.length;E+=3)d(e[E+0],M),d(e[E+1],x),d(e[E+2],S),l(M,x,S,v)}function l(v,M,x,S){const E=S+1,C=[];for(let _=0;_<=E;_++){C[_]=[];const b=v.clone().lerp(x,_/E),B=M.clone().lerp(x,_/E),P=E-_;for(let U=0;U<=P;U++)U===0&&_===E?C[_][U]=b:C[_][U]=b.clone().lerp(B,U/P)}for(let _=0;_<E;_++)for(let b=0;b<2*(E-_)-1;b++){const B=Math.floor(b/2);b%2===0?(u(C[_][B+1]),u(C[_+1][B]),u(C[_][B])):(u(C[_][B+1]),u(C[_+1][B+1]),u(C[_+1][B]))}}function c(v){const M=new I;for(let x=0;x<r.length;x+=3)M.x=r[x+0],M.y=r[x+1],M.z=r[x+2],M.normalize().multiplyScalar(v),r[x+0]=M.x,r[x+1]=M.y,r[x+2]=M.z}function h(){const v=new I;for(let M=0;M<r.length;M+=3){v.x=r[M+0],v.y=r[M+1],v.z=r[M+2];const x=m(v)/2/Math.PI+.5,S=A(v)/Math.PI+.5;a.push(x,1-S)}p(),f()}function f(){for(let v=0;v<a.length;v+=6){const M=a[v+0],x=a[v+2],S=a[v+4],E=Math.max(M,x,S),C=Math.min(M,x,S);E>.9&&C<.1&&(M<.2&&(a[v+0]+=1),x<.2&&(a[v+2]+=1),S<.2&&(a[v+4]+=1))}}function u(v){r.push(v.x,v.y,v.z)}function d(v,M){const x=v*3;M.x=t[x+0],M.y=t[x+1],M.z=t[x+2]}function p(){const v=new I,M=new I,x=new I,S=new I,E=new lt,C=new lt,_=new lt;for(let b=0,B=0;b<r.length;b+=9,B+=6){v.set(r[b+0],r[b+1],r[b+2]),M.set(r[b+3],r[b+4],r[b+5]),x.set(r[b+6],r[b+7],r[b+8]),E.set(a[B+0],a[B+1]),C.set(a[B+2],a[B+3]),_.set(a[B+4],a[B+5]),S.copy(v).add(M).add(x).divideScalar(3);const P=m(S);g(E,B+0,v,P),g(C,B+2,M,P),g(_,B+4,x,P)}}function g(v,M,x,S){S<0&&v.x===1&&(a[M]=v.x-1),x.x===0&&x.z===0&&(a[M]=S/2/Math.PI+.5)}function m(v){return Math.atan2(v.z,-v.x)}function A(v){return Math.atan2(-v.y,Math.sqrt(v.x*v.x+v.z*v.z))}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new Gi(t.vertices,t.indices,t.radius,t.detail)}}class tc extends Gi{constructor(t=1,e=0){const n=(1+Math.sqrt(5))/2,s=1/n,r=[-1,-1,-1,-1,-1,1,-1,1,-1,-1,1,1,1,-1,-1,1,-1,1,1,1,-1,1,1,1,0,-s,-n,0,-s,n,0,s,-n,0,s,n,-s,-n,0,-s,n,0,s,-n,0,s,n,0,-n,0,-s,n,0,-s,-n,0,s,n,0,s],a=[3,11,7,3,7,15,3,15,13,7,19,17,7,17,6,7,6,15,17,4,8,17,8,10,17,10,6,8,0,16,8,16,2,8,2,10,0,12,1,0,1,18,0,18,16,6,10,2,6,2,13,6,13,15,2,16,18,2,18,3,2,3,13,18,1,9,18,9,11,18,11,3,4,14,12,4,12,0,4,0,8,11,9,5,11,5,19,11,19,7,19,5,14,19,14,4,19,4,17,1,12,14,1,14,5,1,5,9];super(r,a,t,e),this.type="DodecahedronGeometry",this.parameters={radius:t,detail:e}}static fromJSON(t){return new tc(t.radius,t.detail)}}const co=new I,ho=new I,Yc=new I,uo=new fn;class IA extends $t{constructor(t=null,e=1){if(super(),this.type="EdgesGeometry",this.parameters={geometry:t,thresholdAngle:e},t!==null){const s=Math.pow(10,4),r=Math.cos(hs*e),a=t.getIndex(),o=t.getAttribute("position"),l=a?a.count:o.count,c=[0,0,0],h=["a","b","c"],f=new Array(3),u={},d=[];for(let p=0;p<l;p+=3){a?(c[0]=a.getX(p),c[1]=a.getX(p+1),c[2]=a.getX(p+2)):(c[0]=p,c[1]=p+1,c[2]=p+2);const{a:g,b:m,c:A}=uo;if(g.fromBufferAttribute(o,c[0]),m.fromBufferAttribute(o,c[1]),A.fromBufferAttribute(o,c[2]),uo.getNormal(Yc),f[0]=`${Math.round(g.x*s)},${Math.round(g.y*s)},${Math.round(g.z*s)}`,f[1]=`${Math.round(m.x*s)},${Math.round(m.y*s)},${Math.round(m.z*s)}`,f[2]=`${Math.round(A.x*s)},${Math.round(A.y*s)},${Math.round(A.z*s)}`,!(f[0]===f[1]||f[1]===f[2]||f[2]===f[0]))for(let v=0;v<3;v++){const M=(v+1)%3,x=f[v],S=f[M],E=uo[h[v]],C=uo[h[M]],_=`${x}_${S}`,b=`${S}_${x}`;b in u&&u[b]?(Yc.dot(u[b].normal)<=r&&(d.push(E.x,E.y,E.z),d.push(C.x,C.y,C.z)),u[b]=null):_ in u||(u[_]={index0:c[v],index1:c[M],normal:Yc.clone()})}}for(const p in u)if(u[p]){const{index0:g,index1:m}=u[p];co.fromBufferAttribute(o,g),ho.fromBufferAttribute(o,m),d.push(co.x,co.y,co.z),d.push(ho.x,ho.y,ho.z)}this.setAttribute("position",new Ft(d,3))}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}}class Hn{constructor(){this.type="Curve",this.arcLengthDivisions=200,this.needsUpdate=!1,this.cacheArcLengths=null}getPoint(){_t("Curve: .getPoint() not implemented.")}getPointAt(t,e){const n=this.getUtoTmapping(t);return this.getPoint(n,e)}getPoints(t=5){const e=[];for(let n=0;n<=t;n++)e.push(this.getPoint(n/t));return e}getSpacedPoints(t=5){const e=[];for(let n=0;n<=t;n++)e.push(this.getPointAt(n/t));return e}getLength(){const t=this.getLengths();return t[t.length-1]}getLengths(t=this.arcLengthDivisions){if(this.cacheArcLengths&&this.cacheArcLengths.length===t+1&&!this.needsUpdate)return this.cacheArcLengths;this.needsUpdate=!1;const e=[];let n,s=this.getPoint(0),r=0;e.push(0);for(let a=1;a<=t;a++)n=this.getPoint(a/t),r+=n.distanceTo(s),e.push(r),s=n;return this.cacheArcLengths=e,e}updateArcLengths(){this.needsUpdate=!0,this.getLengths()}getUtoTmapping(t,e=null){const n=this.getLengths();let s=0;const r=n.length;let a;e?a=e:a=t*n[r-1];let o=0,l=r-1,c;for(;o<=l;)if(s=Math.floor(o+(l-o)/2),c=n[s]-a,c<0)o=s+1;else if(c>0)l=s-1;else{l=s;break}if(s=l,n[s]===a)return s/(r-1);const h=n[s],u=n[s+1]-h,d=(a-h)/u;return(s+d)/(r-1)}getTangent(t,e){let s=t-1e-4,r=t+1e-4;s<0&&(s=0),r>1&&(r=1);const a=this.getPoint(s),o=this.getPoint(r),l=e||(a.isVector2?new lt:new I);return l.copy(o).sub(a).normalize(),l}getTangentAt(t,e){const n=this.getUtoTmapping(t);return this.getTangent(n,e)}computeFrenetFrames(t,e=!1){const n=new I,s=[],r=[],a=[],o=new I,l=new Kt;for(let d=0;d<=t;d++){const p=d/t;s[d]=this.getTangentAt(p,new I)}r[0]=new I,a[0]=new I;let c=Number.MAX_VALUE;const h=Math.abs(s[0].x),f=Math.abs(s[0].y),u=Math.abs(s[0].z);h<=c&&(c=h,n.set(1,0,0)),f<=c&&(c=f,n.set(0,1,0)),u<=c&&n.set(0,0,1),o.crossVectors(s[0],n).normalize(),r[0].crossVectors(s[0],o),a[0].crossVectors(s[0],r[0]);for(let d=1;d<=t;d++){if(r[d]=r[d-1].clone(),a[d]=a[d-1].clone(),o.crossVectors(s[d-1],s[d]),o.length()>Number.EPSILON){o.normalize();const p=Math.acos(Xt(s[d-1].dot(s[d]),-1,1));r[d].applyMatrix4(l.makeRotationAxis(o,p))}a[d].crossVectors(s[d],r[d])}if(e===!0){let d=Math.acos(Xt(r[0].dot(r[t]),-1,1));d/=t,s[0].dot(o.crossVectors(r[0],r[t]))>0&&(d=-d);for(let p=1;p<=t;p++)r[p].applyMatrix4(l.makeRotationAxis(s[p],d*p)),a[p].crossVectors(s[p],r[p])}return{tangents:s,normals:r,binormals:a}}clone(){return new this.constructor().copy(this)}copy(t){return this.arcLengthDivisions=t.arcLengthDivisions,this}toJSON(){const t={metadata:{version:4.7,type:"Curve",generator:"Curve.toJSON"}};return t.arcLengthDivisions=this.arcLengthDivisions,t.type=this.type,t}fromJSON(t){return this.arcLengthDivisions=t.arcLengthDivisions,this}}class ec extends Hn{constructor(t=0,e=0,n=1,s=1,r=0,a=Math.PI*2,o=!1,l=0){super(),this.isEllipseCurve=!0,this.type="EllipseCurve",this.aX=t,this.aY=e,this.xRadius=n,this.yRadius=s,this.aStartAngle=r,this.aEndAngle=a,this.aClockwise=o,this.aRotation=l}getPoint(t,e=new lt){const n=e,s=Math.PI*2;let r=this.aEndAngle-this.aStartAngle;const a=Math.abs(r)<Number.EPSILON;for(;r<0;)r+=s;for(;r>s;)r-=s;r<Number.EPSILON&&(a?r=0:r=s),this.aClockwise===!0&&!a&&(r===s?r=-s:r=r-s);const o=this.aStartAngle+t*r;let l=this.aX+this.xRadius*Math.cos(o),c=this.aY+this.yRadius*Math.sin(o);if(this.aRotation!==0){const h=Math.cos(this.aRotation),f=Math.sin(this.aRotation),u=l-this.aX,d=c-this.aY;l=u*h-d*f+this.aX,c=u*f+d*h+this.aY}return n.set(l,c)}copy(t){return super.copy(t),this.aX=t.aX,this.aY=t.aY,this.xRadius=t.xRadius,this.yRadius=t.yRadius,this.aStartAngle=t.aStartAngle,this.aEndAngle=t.aEndAngle,this.aClockwise=t.aClockwise,this.aRotation=t.aRotation,this}toJSON(){const t=super.toJSON();return t.aX=this.aX,t.aY=this.aY,t.xRadius=this.xRadius,t.yRadius=this.yRadius,t.aStartAngle=this.aStartAngle,t.aEndAngle=this.aEndAngle,t.aClockwise=this.aClockwise,t.aRotation=this.aRotation,t}fromJSON(t){return super.fromJSON(t),this.aX=t.aX,this.aY=t.aY,this.xRadius=t.xRadius,this.yRadius=t.yRadius,this.aStartAngle=t.aStartAngle,this.aEndAngle=t.aEndAngle,this.aClockwise=t.aClockwise,this.aRotation=t.aRotation,this}}class RA extends ec{constructor(t,e,n,s,r,a){super(t,e,n,n,s,r,a),this.isArcCurve=!0,this.type="ArcCurve"}}function Eu(){let i=0,t=0,e=0,n=0;function s(r,a,o,l){i=r,t=o,e=-3*r+3*a-2*o-l,n=2*r-2*a+o+l}return{initCatmullRom:function(r,a,o,l,c){s(a,o,c*(o-r),c*(l-a))},initNonuniformCatmullRom:function(r,a,o,l,c,h,f){let u=(a-r)/c-(o-r)/(c+h)+(o-a)/h,d=(o-a)/h-(l-a)/(h+f)+(l-o)/f;u*=h,d*=h,s(a,o,u,d)},calc:function(r){const a=r*r,o=a*r;return i+t*r+e*a+n*o}}}const Vf=new I,Wf=new I,Xc=new Eu,qc=new Eu,Kc=new Eu;class DA extends Hn{constructor(t=[],e=!1,n="centripetal",s=.5){super(),this.isCatmullRomCurve3=!0,this.type="CatmullRomCurve3",this.points=t,this.closed=e,this.curveType=n,this.tension=s}getPoint(t,e=new I){const n=e,s=this.points,r=s.length,a=(r-(this.closed?0:1))*t;let o=Math.floor(a),l=a-o;this.closed?o+=o>0?0:(Math.floor(Math.abs(o)/r)+1)*r:l===0&&o===r-1&&(o=r-2,l=1);let c,h;this.closed||o>0?c=s[(o-1)%r]:(Wf.subVectors(s[0],s[1]).add(s[0]),c=Wf);const f=s[o%r],u=s[(o+1)%r];if(this.closed||o+2<r?h=s[(o+2)%r]:(Vf.subVectors(s[r-1],s[r-2]).add(s[r-1]),h=Vf),this.curveType==="centripetal"||this.curveType==="chordal"){const d=this.curveType==="chordal"?.5:.25;let p=Math.pow(c.distanceToSquared(f),d),g=Math.pow(f.distanceToSquared(u),d),m=Math.pow(u.distanceToSquared(h),d);g<1e-4&&(g=1),p<1e-4&&(p=g),m<1e-4&&(m=g),Xc.initNonuniformCatmullRom(c.x,f.x,u.x,h.x,p,g,m),qc.initNonuniformCatmullRom(c.y,f.y,u.y,h.y,p,g,m),Kc.initNonuniformCatmullRom(c.z,f.z,u.z,h.z,p,g,m)}else this.curveType==="catmullrom"&&(Xc.initCatmullRom(c.x,f.x,u.x,h.x,this.tension),qc.initCatmullRom(c.y,f.y,u.y,h.y,this.tension),Kc.initCatmullRom(c.z,f.z,u.z,h.z,this.tension));return n.set(Xc.calc(l),qc.calc(l),Kc.calc(l)),n}copy(t){super.copy(t),this.points=[];for(let e=0,n=t.points.length;e<n;e++){const s=t.points[e];this.points.push(s.clone())}return this.closed=t.closed,this.curveType=t.curveType,this.tension=t.tension,this}toJSON(){const t=super.toJSON();t.points=[];for(let e=0,n=this.points.length;e<n;e++){const s=this.points[e];t.points.push(s.toArray())}return t.closed=this.closed,t.curveType=this.curveType,t.tension=this.tension,t}fromJSON(t){super.fromJSON(t),this.points=[];for(let e=0,n=t.points.length;e<n;e++){const s=t.points[e];this.points.push(new I().fromArray(s))}return this.closed=t.closed,this.curveType=t.curveType,this.tension=t.tension,this}}function Yf(i,t,e,n,s){const r=(n-t)*.5,a=(s-e)*.5,o=i*i,l=i*o;return(2*e-2*n+r+a)*l+(-3*e+3*n-2*r-a)*o+r*i+e}function Rx(i,t){const e=1-i;return e*e*t}function Dx(i,t){return 2*(1-i)*i*t}function Px(i,t){return i*i*t}function Kr(i,t,e,n){return Rx(i,t)+Dx(i,e)+Px(i,n)}function Lx(i,t){const e=1-i;return e*e*e*t}function Fx(i,t){const e=1-i;return 3*e*e*i*t}function Ux(i,t){return 3*(1-i)*i*i*t}function Nx(i,t){return i*i*i*t}function Jr(i,t,e,n,s){return Lx(i,t)+Fx(i,e)+Ux(i,n)+Nx(i,s)}class Su extends Hn{constructor(t=new lt,e=new lt,n=new lt,s=new lt){super(),this.isCubicBezierCurve=!0,this.type="CubicBezierCurve",this.v0=t,this.v1=e,this.v2=n,this.v3=s}getPoint(t,e=new lt){const n=e,s=this.v0,r=this.v1,a=this.v2,o=this.v3;return n.set(Jr(t,s.x,r.x,a.x,o.x),Jr(t,s.y,r.y,a.y,o.y)),n}copy(t){return super.copy(t),this.v0.copy(t.v0),this.v1.copy(t.v1),this.v2.copy(t.v2),this.v3.copy(t.v3),this}toJSON(){const t=super.toJSON();return t.v0=this.v0.toArray(),t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t.v3=this.v3.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v0.fromArray(t.v0),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this.v3.fromArray(t.v3),this}}class PA extends Hn{constructor(t=new I,e=new I,n=new I,s=new I){super(),this.isCubicBezierCurve3=!0,this.type="CubicBezierCurve3",this.v0=t,this.v1=e,this.v2=n,this.v3=s}getPoint(t,e=new I){const n=e,s=this.v0,r=this.v1,a=this.v2,o=this.v3;return n.set(Jr(t,s.x,r.x,a.x,o.x),Jr(t,s.y,r.y,a.y,o.y),Jr(t,s.z,r.z,a.z,o.z)),n}copy(t){return super.copy(t),this.v0.copy(t.v0),this.v1.copy(t.v1),this.v2.copy(t.v2),this.v3.copy(t.v3),this}toJSON(){const t=super.toJSON();return t.v0=this.v0.toArray(),t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t.v3=this.v3.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v0.fromArray(t.v0),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this.v3.fromArray(t.v3),this}}class wu extends Hn{constructor(t=new lt,e=new lt){super(),this.isLineCurve=!0,this.type="LineCurve",this.v1=t,this.v2=e}getPoint(t,e=new lt){const n=e;return t===1?n.copy(this.v2):(n.copy(this.v2).sub(this.v1),n.multiplyScalar(t).add(this.v1)),n}getPointAt(t,e){return this.getPoint(t,e)}getTangent(t,e=new lt){return e.subVectors(this.v2,this.v1).normalize()}getTangentAt(t,e){return this.getTangent(t,e)}copy(t){return super.copy(t),this.v1.copy(t.v1),this.v2.copy(t.v2),this}toJSON(){const t=super.toJSON();return t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this}}class LA extends Hn{constructor(t=new I,e=new I){super(),this.isLineCurve3=!0,this.type="LineCurve3",this.v1=t,this.v2=e}getPoint(t,e=new I){const n=e;return t===1?n.copy(this.v2):(n.copy(this.v2).sub(this.v1),n.multiplyScalar(t).add(this.v1)),n}getPointAt(t,e){return this.getPoint(t,e)}getTangent(t,e=new I){return e.subVectors(this.v2,this.v1).normalize()}getTangentAt(t,e){return this.getTangent(t,e)}copy(t){return super.copy(t),this.v1.copy(t.v1),this.v2.copy(t.v2),this}toJSON(){const t=super.toJSON();return t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this}}class bu extends Hn{constructor(t=new lt,e=new lt,n=new lt){super(),this.isQuadraticBezierCurve=!0,this.type="QuadraticBezierCurve",this.v0=t,this.v1=e,this.v2=n}getPoint(t,e=new lt){const n=e,s=this.v0,r=this.v1,a=this.v2;return n.set(Kr(t,s.x,r.x,a.x),Kr(t,s.y,r.y,a.y)),n}copy(t){return super.copy(t),this.v0.copy(t.v0),this.v1.copy(t.v1),this.v2.copy(t.v2),this}toJSON(){const t=super.toJSON();return t.v0=this.v0.toArray(),t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v0.fromArray(t.v0),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this}}class Cu extends Hn{constructor(t=new I,e=new I,n=new I){super(),this.isQuadraticBezierCurve3=!0,this.type="QuadraticBezierCurve3",this.v0=t,this.v1=e,this.v2=n}getPoint(t,e=new I){const n=e,s=this.v0,r=this.v1,a=this.v2;return n.set(Kr(t,s.x,r.x,a.x),Kr(t,s.y,r.y,a.y),Kr(t,s.z,r.z,a.z)),n}copy(t){return super.copy(t),this.v0.copy(t.v0),this.v1.copy(t.v1),this.v2.copy(t.v2),this}toJSON(){const t=super.toJSON();return t.v0=this.v0.toArray(),t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v0.fromArray(t.v0),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this}}class Tu extends Hn{constructor(t=[]){super(),this.isSplineCurve=!0,this.type="SplineCurve",this.points=t}getPoint(t,e=new lt){const n=e,s=this.points,r=(s.length-1)*t,a=Math.floor(r),o=r-a,l=s[a===0?a:a-1],c=s[a],h=s[a>s.length-2?s.length-1:a+1],f=s[a>s.length-3?s.length-1:a+2];return n.set(Yf(o,l.x,c.x,h.x,f.x),Yf(o,l.y,c.y,h.y,f.y)),n}copy(t){super.copy(t),this.points=[];for(let e=0,n=t.points.length;e<n;e++){const s=t.points[e];this.points.push(s.clone())}return this}toJSON(){const t=super.toJSON();t.points=[];for(let e=0,n=this.points.length;e<n;e++){const s=this.points[e];t.points.push(s.toArray())}return t}fromJSON(t){super.fromJSON(t),this.points=[];for(let e=0,n=t.points.length;e<n;e++){const s=t.points[e];this.points.push(new lt().fromArray(s))}return this}}var Ml=Object.freeze({__proto__:null,ArcCurve:RA,CatmullRomCurve3:DA,CubicBezierCurve:Su,CubicBezierCurve3:PA,EllipseCurve:ec,LineCurve:wu,LineCurve3:LA,QuadraticBezierCurve:bu,QuadraticBezierCurve3:Cu,SplineCurve:Tu});class FA extends Hn{constructor(){super(),this.type="CurvePath",this.curves=[],this.autoClose=!1}add(t){this.curves.push(t)}closePath(){const t=this.curves[0].getPoint(0),e=this.curves[this.curves.length-1].getPoint(1);if(!t.equals(e)){const n=t.isVector2===!0?"LineCurve":"LineCurve3";this.curves.push(new Ml[n](e,t))}return this}getPoint(t,e){const n=t*this.getLength(),s=this.getCurveLengths();let r=0;for(;r<s.length;){if(s[r]>=n){const a=s[r]-n,o=this.curves[r],l=o.getLength(),c=l===0?0:1-a/l;return o.getPointAt(c,e)}r++}return null}getLength(){const t=this.getCurveLengths();return t[t.length-1]}updateArcLengths(){this.needsUpdate=!0,this.cacheLengths=null,this.getCurveLengths()}getCurveLengths(){if(this.cacheLengths&&this.cacheLengths.length===this.curves.length)return this.cacheLengths;const t=[];let e=0;for(let n=0,s=this.curves.length;n<s;n++)e+=this.curves[n].getLength(),t.push(e);return this.cacheLengths=t,t}getSpacedPoints(t=40){const e=[];for(let n=0;n<=t;n++)e.push(this.getPoint(n/t));return this.autoClose&&e.push(e[0]),e}getPoints(t=12){const e=[];let n;for(let s=0,r=this.curves;s<r.length;s++){const a=r[s],o=a.isEllipseCurve?t*2:a.isLineCurve||a.isLineCurve3?1:a.isSplineCurve?t*a.points.length:t,l=a.getPoints(o);for(let c=0;c<l.length;c++){const h=l[c];n&&n.equals(h)||(e.push(h),n=h)}}return this.autoClose&&e.length>1&&!e[e.length-1].equals(e[0])&&e.push(e[0]),e}copy(t){super.copy(t),this.curves=[];for(let e=0,n=t.curves.length;e<n;e++){const s=t.curves[e];this.curves.push(s.clone())}return this.autoClose=t.autoClose,this}toJSON(){const t=super.toJSON();t.autoClose=this.autoClose,t.curves=[];for(let e=0,n=this.curves.length;e<n;e++){const s=this.curves[e];t.curves.push(s.toJSON())}return t}fromJSON(t){super.fromJSON(t),this.autoClose=t.autoClose,this.curves=[];for(let e=0,n=t.curves.length;e<n;e++){const s=t.curves[e];this.curves.push(new Ml[s.type]().fromJSON(s))}return this}}class ca extends FA{constructor(t){super(),this.type="Path",this.currentPoint=new lt,t&&this.setFromPoints(t)}setFromPoints(t){this.moveTo(t[0].x,t[0].y);for(let e=1,n=t.length;e<n;e++)this.lineTo(t[e].x,t[e].y);return this}moveTo(t,e){return this.currentPoint.set(t,e),this}lineTo(t,e){const n=new wu(this.currentPoint.clone(),new lt(t,e));return this.curves.push(n),this.currentPoint.set(t,e),this}quadraticCurveTo(t,e,n,s){const r=new bu(this.currentPoint.clone(),new lt(t,e),new lt(n,s));return this.curves.push(r),this.currentPoint.set(n,s),this}bezierCurveTo(t,e,n,s,r,a){const o=new Su(this.currentPoint.clone(),new lt(t,e),new lt(n,s),new lt(r,a));return this.curves.push(o),this.currentPoint.set(r,a),this}splineThru(t){const e=[this.currentPoint.clone()].concat(t),n=new Tu(e);return this.curves.push(n),this.currentPoint.copy(t[t.length-1]),this}arc(t,e,n,s,r,a){const o=this.currentPoint.x,l=this.currentPoint.y;return this.absarc(t+o,e+l,n,s,r,a),this}absarc(t,e,n,s,r,a){return this.absellipse(t,e,n,n,s,r,a),this}ellipse(t,e,n,s,r,a,o,l){const c=this.currentPoint.x,h=this.currentPoint.y;return this.absellipse(t+c,e+h,n,s,r,a,o,l),this}absellipse(t,e,n,s,r,a,o,l){const c=new ec(t,e,n,s,r,a,o,l);if(this.curves.length>0){const f=c.getPoint(0);f.equals(this.currentPoint)||this.lineTo(f.x,f.y)}this.curves.push(c);const h=c.getPoint(1);return this.currentPoint.copy(h),this}copy(t){return super.copy(t),this.currentPoint.copy(t.currentPoint),this}toJSON(){const t=super.toJSON();return t.currentPoint=this.currentPoint.toArray(),t}fromJSON(t){return super.fromJSON(t),this.currentPoint.fromArray(t.currentPoint),this}}class Sa extends ca{constructor(t){super(t),this.uuid=yn(),this.type="Shape",this.holes=[]}getPointsHoles(t){const e=[];for(let n=0,s=this.holes.length;n<s;n++)e[n]=this.holes[n].getPoints(t);return e}extractPoints(t){return{shape:this.getPoints(t),holes:this.getPointsHoles(t)}}copy(t){super.copy(t),this.holes=[];for(let e=0,n=t.holes.length;e<n;e++){const s=t.holes[e];this.holes.push(s.clone())}return this}toJSON(){const t=super.toJSON();t.uuid=this.uuid,t.holes=[];for(let e=0,n=this.holes.length;e<n;e++){const s=this.holes[e];t.holes.push(s.toJSON())}return t}fromJSON(t){super.fromJSON(t),this.uuid=t.uuid,this.holes=[];for(let e=0,n=t.holes.length;e<n;e++){const s=t.holes[e];this.holes.push(new ca().fromJSON(s))}return this}}function Ox(i,t,e=2){const n=t&&t.length,s=n?t[0]*e:i.length;let r=UA(i,0,s,e,!0);const a=[];if(!r||r.next===r.prev)return a;let o,l,c;if(n&&(r=Hx(i,t,r,e)),i.length>80*e){o=i[0],l=i[1];let h=o,f=l;for(let u=e;u<s;u+=e){const d=i[u],p=i[u+1];d<o&&(o=d),p<l&&(l=p),d>h&&(h=d),p>f&&(f=p)}c=Math.max(h-o,f-l),c=c!==0?32767/c:0}return ha(r,a,e,o,l,c,0),a}function UA(i,t,e,n,s){let r;if(s===t_(i,t,e,n)>0)for(let a=t;a<e;a+=n)r=Xf(a/n|0,i[a],i[a+1],r);else for(let a=e-n;a>=t;a-=n)r=Xf(a/n|0,i[a],i[a+1],r);return r&&ur(r,r.next)&&(fa(r),r=r.next),r}function ps(i,t){if(!i)return i;t||(t=i);let e=i,n;do if(n=!1,!e.steiner&&(ur(e,e.next)||ye(e.prev,e,e.next)===0)){if(fa(e),e=t=e.prev,e===e.next)break;n=!0}else e=e.next;while(n||e!==t);return t}function ha(i,t,e,n,s,r,a){if(!i)return;!a&&r&&qx(i,n,s,r);let o=i;for(;i.prev!==i.next;){const l=i.prev,c=i.next;if(r?kx(i,n,s,r):Gx(i)){t.push(l.i,i.i,c.i),fa(i),i=c.next,o=c.next;continue}if(i=c,i===o){a?a===1?(i=Qx(ps(i),t),ha(i,t,e,n,s,r,2)):a===2&&zx(i,t,e,n,s,r):ha(ps(i),t,e,n,s,r,1);break}}}function Gx(i){const t=i.prev,e=i,n=i.next;if(ye(t,e,n)>=0)return!1;const s=t.x,r=e.x,a=n.x,o=t.y,l=e.y,c=n.y,h=Math.min(s,r,a),f=Math.min(o,l,c),u=Math.max(s,r,a),d=Math.max(o,l,c);let p=n.next;for(;p!==t;){if(p.x>=h&&p.x<=u&&p.y>=f&&p.y<=d&&Or(s,o,r,l,a,c,p.x,p.y)&&ye(p.prev,p,p.next)>=0)return!1;p=p.next}return!0}function kx(i,t,e,n){const s=i.prev,r=i,a=i.next;if(ye(s,r,a)>=0)return!1;const o=s.x,l=r.x,c=a.x,h=s.y,f=r.y,u=a.y,d=Math.min(o,l,c),p=Math.min(h,f,u),g=Math.max(o,l,c),m=Math.max(h,f,u),A=Ih(d,p,t,e,n),v=Ih(g,m,t,e,n);let M=i.prevZ,x=i.nextZ;for(;M&&M.z>=A&&x&&x.z<=v;){if(M.x>=d&&M.x<=g&&M.y>=p&&M.y<=m&&M!==s&&M!==a&&Or(o,h,l,f,c,u,M.x,M.y)&&ye(M.prev,M,M.next)>=0||(M=M.prevZ,x.x>=d&&x.x<=g&&x.y>=p&&x.y<=m&&x!==s&&x!==a&&Or(o,h,l,f,c,u,x.x,x.y)&&ye(x.prev,x,x.next)>=0))return!1;x=x.nextZ}for(;M&&M.z>=A;){if(M.x>=d&&M.x<=g&&M.y>=p&&M.y<=m&&M!==s&&M!==a&&Or(o,h,l,f,c,u,M.x,M.y)&&ye(M.prev,M,M.next)>=0)return!1;M=M.prevZ}for(;x&&x.z<=v;){if(x.x>=d&&x.x<=g&&x.y>=p&&x.y<=m&&x!==s&&x!==a&&Or(o,h,l,f,c,u,x.x,x.y)&&ye(x.prev,x,x.next)>=0)return!1;x=x.nextZ}return!0}function Qx(i,t){let e=i;do{const n=e.prev,s=e.next.next;!ur(n,s)&&OA(n,e,e.next,s)&&ua(n,s)&&ua(s,n)&&(t.push(n.i,e.i,s.i),fa(e),fa(e.next),e=i=s),e=e.next}while(e!==i);return ps(e)}function zx(i,t,e,n,s,r){let a=i;do{let o=a.next.next;for(;o!==a.prev;){if(a.i!==o.i&&Zx(a,o)){let l=GA(a,o);a=ps(a,a.next),l=ps(l,l.next),ha(a,t,e,n,s,r,0),ha(l,t,e,n,s,r,0);return}o=o.next}a=a.next}while(a!==i)}function Hx(i,t,e,n){const s=[];for(let r=0,a=t.length;r<a;r++){const o=t[r]*n,l=r<a-1?t[r+1]*n:i.length,c=UA(i,o,l,n,!1);c===c.next&&(c.steiner=!0),s.push(Jx(c))}s.sort(Vx);for(let r=0;r<s.length;r++)e=Wx(s[r],e);return e}function Vx(i,t){let e=i.x-t.x;if(e===0&&(e=i.y-t.y,e===0)){const n=(i.next.y-i.y)/(i.next.x-i.x),s=(t.next.y-t.y)/(t.next.x-t.x);e=n-s}return e}function Wx(i,t){const e=Yx(i,t);if(!e)return t;const n=GA(e,i);return ps(n,n.next),ps(e,e.next)}function Yx(i,t){let e=t;const n=i.x,s=i.y;let r=-1/0,a;if(ur(i,e))return e;do{if(ur(i,e.next))return e.next;if(s<=e.y&&s>=e.next.y&&e.next.y!==e.y){const f=e.x+(s-e.y)*(e.next.x-e.x)/(e.next.y-e.y);if(f<=n&&f>r&&(r=f,a=e.x<e.next.x?e:e.next,f===n))return a}e=e.next}while(e!==t);if(!a)return null;const o=a,l=a.x,c=a.y;let h=1/0;e=a;do{if(n>=e.x&&e.x>=l&&n!==e.x&&NA(s<c?n:r,s,l,c,s<c?r:n,s,e.x,e.y)){const f=Math.abs(s-e.y)/(n-e.x);ua(e,i)&&(f<h||f===h&&(e.x>a.x||e.x===a.x&&Xx(a,e)))&&(a=e,h=f)}e=e.next}while(e!==o);return a}function Xx(i,t){return ye(i.prev,i,t.prev)<0&&ye(t.next,i,i.next)<0}function qx(i,t,e,n){let s=i;do s.z===0&&(s.z=Ih(s.x,s.y,t,e,n)),s.prevZ=s.prev,s.nextZ=s.next,s=s.next;while(s!==i);s.prevZ.nextZ=null,s.prevZ=null,Kx(s)}function Kx(i){let t,e=1;do{let n=i,s;i=null;let r=null;for(t=0;n;){t++;let a=n,o=0;for(let c=0;c<e&&(o++,a=a.nextZ,!!a);c++);let l=e;for(;o>0||l>0&&a;)o!==0&&(l===0||!a||n.z<=a.z)?(s=n,n=n.nextZ,o--):(s=a,a=a.nextZ,l--),r?r.nextZ=s:i=s,s.prevZ=r,r=s;n=a}r.nextZ=null,e*=2}while(t>1);return i}function Ih(i,t,e,n,s){return i=(i-e)*s|0,t=(t-n)*s|0,i=(i|i<<8)&16711935,i=(i|i<<4)&252645135,i=(i|i<<2)&858993459,i=(i|i<<1)&1431655765,t=(t|t<<8)&16711935,t=(t|t<<4)&252645135,t=(t|t<<2)&858993459,t=(t|t<<1)&1431655765,i|t<<1}function Jx(i){let t=i,e=i;do(t.x<e.x||t.x===e.x&&t.y<e.y)&&(e=t),t=t.next;while(t!==i);return e}function NA(i,t,e,n,s,r,a,o){return(s-a)*(t-o)>=(i-a)*(r-o)&&(i-a)*(n-o)>=(e-a)*(t-o)&&(e-a)*(r-o)>=(s-a)*(n-o)}function Or(i,t,e,n,s,r,a,o){return!(i===a&&t===o)&&NA(i,t,e,n,s,r,a,o)}function Zx(i,t){return i.next.i!==t.i&&i.prev.i!==t.i&&!$x(i,t)&&(ua(i,t)&&ua(t,i)&&jx(i,t)&&(ye(i.prev,i,t.prev)||ye(i,t.prev,t))||ur(i,t)&&ye(i.prev,i,i.next)>0&&ye(t.prev,t,t.next)>0)}function ye(i,t,e){return(t.y-i.y)*(e.x-t.x)-(t.x-i.x)*(e.y-t.y)}function ur(i,t){return i.x===t.x&&i.y===t.y}function OA(i,t,e,n){const s=po(ye(i,t,e)),r=po(ye(i,t,n)),a=po(ye(e,n,i)),o=po(ye(e,n,t));return!!(s!==r&&a!==o||s===0&&fo(i,e,t)||r===0&&fo(i,n,t)||a===0&&fo(e,i,n)||o===0&&fo(e,t,n))}function fo(i,t,e){return t.x<=Math.max(i.x,e.x)&&t.x>=Math.min(i.x,e.x)&&t.y<=Math.max(i.y,e.y)&&t.y>=Math.min(i.y,e.y)}function po(i){return i>0?1:i<0?-1:0}function $x(i,t){let e=i;do{if(e.i!==i.i&&e.next.i!==i.i&&e.i!==t.i&&e.next.i!==t.i&&OA(e,e.next,i,t))return!0;e=e.next}while(e!==i);return!1}function ua(i,t){return ye(i.prev,i,i.next)<0?ye(i,t,i.next)>=0&&ye(i,i.prev,t)>=0:ye(i,t,i.prev)<0||ye(i,i.next,t)<0}function jx(i,t){let e=i,n=!1;const s=(i.x+t.x)/2,r=(i.y+t.y)/2;do e.y>r!=e.next.y>r&&e.next.y!==e.y&&s<(e.next.x-e.x)*(r-e.y)/(e.next.y-e.y)+e.x&&(n=!n),e=e.next;while(e!==i);return n}function GA(i,t){const e=Rh(i.i,i.x,i.y),n=Rh(t.i,t.x,t.y),s=i.next,r=t.prev;return i.next=t,t.prev=i,e.next=s,s.prev=e,n.next=e,e.prev=n,r.next=n,n.prev=r,n}function Xf(i,t,e,n){const s=Rh(i,t,e);return n?(s.next=n.next,s.prev=n,n.next.prev=s,n.next=s):(s.prev=s,s.next=s),s}function fa(i){i.next.prev=i.prev,i.prev.next=i.next,i.prevZ&&(i.prevZ.nextZ=i.nextZ),i.nextZ&&(i.nextZ.prevZ=i.prevZ)}function Rh(i,t,e){return{i,x:t,y:e,prev:null,next:null,z:0,prevZ:null,nextZ:null,steiner:!1}}function t_(i,t,e,n){let s=0;for(let r=t,a=e-n;r<e;r+=n)s+=(i[a]-i[r])*(i[r+1]+i[a+1]),a=r;return s}class e_{static triangulate(t,e,n=2){return Ox(t,e,n)}}class Un{static area(t){const e=t.length;let n=0;for(let s=e-1,r=0;r<e;s=r++)n+=t[s].x*t[r].y-t[r].x*t[s].y;return n*.5}static isClockWise(t){return Un.area(t)<0}static triangulateShape(t,e){const n=[],s=[],r=[];qf(t),Kf(n,t);let a=t.length;e.forEach(qf);for(let l=0;l<e.length;l++)s.push(a),a+=e[l].length,Kf(n,e[l]);const o=e_.triangulate(n,s);for(let l=0;l<o.length;l+=3)r.push(o.slice(l,l+3));return r}}function qf(i){const t=i.length;t>2&&i[t-1].equals(i[0])&&i.pop()}function Kf(i,t){for(let e=0;e<t.length;e++)i.push(t[e].x),i.push(t[e].y)}class nc extends $t{constructor(t=new Sa([new lt(.5,.5),new lt(-.5,.5),new lt(-.5,-.5),new lt(.5,-.5)]),e={}){super(),this.type="ExtrudeGeometry",this.parameters={shapes:t,options:e},t=Array.isArray(t)?t:[t];const n=this,s=[],r=[];for(let o=0,l=t.length;o<l;o++){const c=t[o];a(c)}this.setAttribute("position",new Ft(s,3)),this.setAttribute("uv",new Ft(r,2)),this.computeVertexNormals();function a(o){const l=[],c=e.curveSegments!==void 0?e.curveSegments:12,h=e.steps!==void 0?e.steps:1,f=e.depth!==void 0?e.depth:1;let u=e.bevelEnabled!==void 0?e.bevelEnabled:!0,d=e.bevelThickness!==void 0?e.bevelThickness:.2,p=e.bevelSize!==void 0?e.bevelSize:d-.1,g=e.bevelOffset!==void 0?e.bevelOffset:0,m=e.bevelSegments!==void 0?e.bevelSegments:3;const A=e.extrudePath,v=e.UVGenerator!==void 0?e.UVGenerator:n_;let M,x=!1,S,E,C,_;if(A){M=A.getSpacedPoints(h),x=!0,u=!1;const Z=A.isCatmullRomCurve3?A.closed:!1;S=A.computeFrenetFrames(h,Z),E=new I,C=new I,_=new I}u||(m=0,d=0,p=0,g=0);const b=o.extractPoints(c);let B=b.shape;const P=b.holes;if(!Un.isClockWise(B)){B=B.reverse();for(let Z=0,ot=P.length;Z<ot;Z++){const j=P[Z];Un.isClockWise(j)&&(P[Z]=j.reverse())}}function k(Z){const j=10000000000000001e-36;let rt=Z[0];for(let ut=1;ut<=Z.length;ut++){const Bt=ut%Z.length,vt=Z[Bt],Qt=vt.x-rt.x,Yt=vt.y-rt.y,D=Qt*Qt+Yt*Yt,Jt=Math.max(Math.abs(vt.x),Math.abs(vt.y),Math.abs(rt.x),Math.abs(rt.y)),Dt=j*Jt*Jt;if(D<=Dt){Z.splice(Bt,1),ut--;continue}rt=vt}}k(B),P.forEach(k);const L=P.length,O=B;for(let Z=0;Z<L;Z++){const ot=P[Z];B=B.concat(ot)}function q(Z,ot,j){return ot||Ht("ExtrudeGeometry: vec does not exist"),Z.clone().addScaledVector(ot,j)}const Y=B.length;function at(Z,ot,j){let rt,ut,Bt;const vt=Z.x-ot.x,Qt=Z.y-ot.y,Yt=j.x-Z.x,D=j.y-Z.y,Jt=vt*vt+Qt*Qt,Dt=vt*D-Qt*Yt;if(Math.abs(Dt)>Number.EPSILON){const T=Math.sqrt(Jt),y=Math.sqrt(Yt*Yt+D*D),G=ot.x-Qt/T,R=ot.y+vt/T,J=j.x-D/y,ft=j.y+Yt/y,pt=((J-G)*D-(ft-R)*Yt)/(vt*D-Qt*Yt);rt=G+vt*pt-Z.x,ut=R+Qt*pt-Z.y;const W=rt*rt+ut*ut;if(W<=2)return new lt(rt,ut);Bt=Math.sqrt(W/2)}else{let T=!1;vt>Number.EPSILON?Yt>Number.EPSILON&&(T=!0):vt<-Number.EPSILON?Yt<-Number.EPSILON&&(T=!0):Math.sign(Qt)===Math.sign(D)&&(T=!0),T?(rt=-Qt,ut=vt,Bt=Math.sqrt(Jt)):(rt=vt,ut=Qt,Bt=Math.sqrt(Jt/2))}return new lt(rt/Bt,ut/Bt)}const Q=[];for(let Z=0,ot=O.length,j=ot-1,rt=Z+1;Z<ot;Z++,j++,rt++)j===ot&&(j=0),rt===ot&&(rt=0),Q[Z]=at(O[Z],O[j],O[rt]);const $=[];let st,Ut=Q.concat();for(let Z=0,ot=L;Z<ot;Z++){const j=P[Z];st=[];for(let rt=0,ut=j.length,Bt=ut-1,vt=rt+1;rt<ut;rt++,Bt++,vt++)Bt===ut&&(Bt=0),vt===ut&&(vt=0),st[rt]=at(j[rt],j[Bt],j[vt]);$.push(st),Ut=Ut.concat(st)}let Tt;if(m===0)Tt=Un.triangulateShape(O,P);else{const Z=[],ot=[];for(let j=0;j<m;j++){const rt=j/m,ut=d*Math.cos(rt*Math.PI/2),Bt=p*Math.sin(rt*Math.PI/2)+g;for(let vt=0,Qt=O.length;vt<Qt;vt++){const Yt=q(O[vt],Q[vt],Bt);nt(Yt.x,Yt.y,-ut),rt===0&&Z.push(Yt)}for(let vt=0,Qt=L;vt<Qt;vt++){const Yt=P[vt];st=$[vt];const D=[];for(let Jt=0,Dt=Yt.length;Jt<Dt;Jt++){const T=q(Yt[Jt],st[Jt],Bt);nt(T.x,T.y,-ut),rt===0&&D.push(T)}rt===0&&ot.push(D)}}Tt=Un.triangulateShape(Z,ot)}const oe=Tt.length,Zt=p+g;for(let Z=0;Z<Y;Z++){const ot=u?q(B[Z],Ut[Z],Zt):B[Z];x?(C.copy(S.normals[0]).multiplyScalar(ot.x),E.copy(S.binormals[0]).multiplyScalar(ot.y),_.copy(M[0]).add(C).add(E),nt(_.x,_.y,_.z)):nt(ot.x,ot.y,0)}for(let Z=1;Z<=h;Z++)for(let ot=0;ot<Y;ot++){const j=u?q(B[ot],Ut[ot],Zt):B[ot];x?(C.copy(S.normals[Z]).multiplyScalar(j.x),E.copy(S.binormals[Z]).multiplyScalar(j.y),_.copy(M[Z]).add(C).add(E),nt(_.x,_.y,_.z)):nt(j.x,j.y,f/h*Z)}for(let Z=m-1;Z>=0;Z--){const ot=Z/m,j=d*Math.cos(ot*Math.PI/2),rt=p*Math.sin(ot*Math.PI/2)+g;for(let ut=0,Bt=O.length;ut<Bt;ut++){const vt=q(O[ut],Q[ut],rt);nt(vt.x,vt.y,f+j)}for(let ut=0,Bt=P.length;ut<Bt;ut++){const vt=P[ut];st=$[ut];for(let Qt=0,Yt=vt.length;Qt<Yt;Qt++){const D=q(vt[Qt],st[Qt],rt);x?nt(D.x,D.y+M[h-1].y,M[h-1].x+j):nt(D.x,D.y,f+j)}}}Vt(),K();function Vt(){const Z=s.length/3;if(u){let ot=0,j=Y*ot;for(let rt=0;rt<oe;rt++){const ut=Tt[rt];gt(ut[2]+j,ut[1]+j,ut[0]+j)}ot=h+m*2,j=Y*ot;for(let rt=0;rt<oe;rt++){const ut=Tt[rt];gt(ut[0]+j,ut[1]+j,ut[2]+j)}}else{for(let ot=0;ot<oe;ot++){const j=Tt[ot];gt(j[2],j[1],j[0])}for(let ot=0;ot<oe;ot++){const j=Tt[ot];gt(j[0]+Y*h,j[1]+Y*h,j[2]+Y*h)}}n.addGroup(Z,s.length/3-Z,0)}function K(){const Z=s.length/3;let ot=0;z(O,ot),ot+=O.length;for(let j=0,rt=P.length;j<rt;j++){const ut=P[j];z(ut,ot),ot+=ut.length}n.addGroup(Z,s.length/3-Z,1)}function z(Z,ot){let j=Z.length;for(;--j>=0;){const rt=j;let ut=j-1;ut<0&&(ut=Z.length-1);for(let Bt=0,vt=h+m*2;Bt<vt;Bt++){const Qt=Y*Bt,Yt=Y*(Bt+1),D=ot+rt+Qt,Jt=ot+ut+Qt,Dt=ot+ut+Yt,T=ot+rt+Yt;ct(D,Jt,Dt,T)}}}function nt(Z,ot,j){l.push(Z),l.push(ot),l.push(j)}function gt(Z,ot,j){Et(Z),Et(ot),Et(j);const rt=s.length/3,ut=v.generateTopUV(n,s,rt-3,rt-2,rt-1);Wt(ut[0]),Wt(ut[1]),Wt(ut[2])}function ct(Z,ot,j,rt){Et(Z),Et(ot),Et(rt),Et(ot),Et(j),Et(rt);const ut=s.length/3,Bt=v.generateSideWallUV(n,s,ut-6,ut-3,ut-2,ut-1);Wt(Bt[0]),Wt(Bt[1]),Wt(Bt[3]),Wt(Bt[1]),Wt(Bt[2]),Wt(Bt[3])}function Et(Z){s.push(l[Z*3+0]),s.push(l[Z*3+1]),s.push(l[Z*3+2])}function Wt(Z){r.push(Z.x),r.push(Z.y)}}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}toJSON(){const t=super.toJSON(),e=this.parameters.shapes,n=this.parameters.options;return i_(e,n,t)}static fromJSON(t,e){const n=[];for(let r=0,a=t.shapes.length;r<a;r++){const o=e[t.shapes[r]];n.push(o)}const s=t.options.extrudePath;return s!==void 0&&(t.options.extrudePath=new Ml[s.type]().fromJSON(s)),new nc(n,t.options)}}const n_={generateTopUV:function(i,t,e,n,s){const r=t[e*3],a=t[e*3+1],o=t[n*3],l=t[n*3+1],c=t[s*3],h=t[s*3+1];return[new lt(r,a),new lt(o,l),new lt(c,h)]},generateSideWallUV:function(i,t,e,n,s,r){const a=t[e*3],o=t[e*3+1],l=t[e*3+2],c=t[n*3],h=t[n*3+1],f=t[n*3+2],u=t[s*3],d=t[s*3+1],p=t[s*3+2],g=t[r*3],m=t[r*3+1],A=t[r*3+2];return Math.abs(o-h)<Math.abs(a-c)?[new lt(a,1-l),new lt(c,1-f),new lt(u,1-p),new lt(g,1-A)]:[new lt(o,1-l),new lt(h,1-f),new lt(d,1-p),new lt(m,1-A)]}};function i_(i,t,e){if(e.shapes=[],Array.isArray(i))for(let n=0,s=i.length;n<s;n++){const r=i[n];e.shapes.push(r.uuid)}else e.shapes.push(i.uuid);return e.options=Object.assign({},t),t.extrudePath!==void 0&&(e.options.extrudePath=t.extrudePath.toJSON()),e}class ic extends Gi{constructor(t=1,e=0){const n=(1+Math.sqrt(5))/2,s=[-1,n,0,1,n,0,-1,-n,0,1,-n,0,0,-1,n,0,1,n,0,-1,-n,0,1,-n,n,0,-1,n,0,1,-n,0,-1,-n,0,1],r=[0,11,5,0,5,1,0,1,7,0,7,10,0,10,11,1,5,9,5,11,4,11,10,2,10,7,6,7,1,8,3,9,4,3,4,2,3,2,6,3,6,8,3,8,9,4,9,5,2,4,11,6,2,10,8,6,7,9,8,1];super(s,r,t,e),this.type="IcosahedronGeometry",this.parameters={radius:t,detail:e}}static fromJSON(t){return new ic(t.radius,t.detail)}}class sc extends $t{constructor(t=[new lt(0,-.5),new lt(.5,0),new lt(0,.5)],e=12,n=0,s=Math.PI*2){super(),this.type="LatheGeometry",this.parameters={points:t,segments:e,phiStart:n,phiLength:s},e=Math.floor(e),s=Xt(s,0,Math.PI*2);const r=[],a=[],o=[],l=[],c=[],h=1/e,f=new I,u=new lt,d=new I,p=new I,g=new I;let m=0,A=0;for(let v=0;v<=t.length-1;v++)switch(v){case 0:m=t[v+1].x-t[v].x,A=t[v+1].y-t[v].y,d.x=A*1,d.y=-m,d.z=A*0,g.copy(d),d.normalize(),l.push(d.x,d.y,d.z);break;case t.length-1:l.push(g.x,g.y,g.z);break;default:m=t[v+1].x-t[v].x,A=t[v+1].y-t[v].y,d.x=A*1,d.y=-m,d.z=A*0,p.copy(d),d.x+=g.x,d.y+=g.y,d.z+=g.z,d.normalize(),l.push(d.x,d.y,d.z),g.copy(p)}for(let v=0;v<=e;v++){const M=n+v*h*s,x=Math.sin(M),S=Math.cos(M);for(let E=0;E<=t.length-1;E++){f.x=t[E].x*x,f.y=t[E].y,f.z=t[E].x*S,a.push(f.x,f.y,f.z),u.x=v/e,u.y=E/(t.length-1),o.push(u.x,u.y);const C=l[3*E+0]*x,_=l[3*E+1],b=l[3*E+0]*S;c.push(C,_,b)}}for(let v=0;v<e;v++)for(let M=0;M<t.length-1;M++){const x=M+v*t.length,S=x,E=x+t.length,C=x+t.length+1,_=x+1;r.push(S,E,_),r.push(C,_,E)}this.setIndex(r),this.setAttribute("position",new Ft(a,3)),this.setAttribute("uv",new Ft(o,2)),this.setAttribute("normal",new Ft(c,3))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new sc(t.points,t.segments,t.phiStart,t.phiLength)}}class wa extends Gi{constructor(t=1,e=0){const n=[1,0,0,-1,0,0,0,1,0,0,-1,0,0,0,1,0,0,-1],s=[0,2,4,0,4,3,0,3,5,0,5,2,1,2,5,1,5,3,1,3,4,1,4,2];super(n,s,t,e),this.type="OctahedronGeometry",this.parameters={radius:t,detail:e}}static fromJSON(t){return new wa(t.radius,t.detail)}}class mr extends $t{constructor(t=1,e=1,n=1,s=1){super(),this.type="PlaneGeometry",this.parameters={width:t,height:e,widthSegments:n,heightSegments:s};const r=t/2,a=e/2,o=Math.floor(n),l=Math.floor(s),c=o+1,h=l+1,f=t/o,u=e/l,d=[],p=[],g=[],m=[];for(let A=0;A<h;A++){const v=A*u-a;for(let M=0;M<c;M++){const x=M*f-r;p.push(x,-v,0),g.push(0,0,1),m.push(M/o),m.push(1-A/l)}}for(let A=0;A<l;A++)for(let v=0;v<o;v++){const M=v+c*A,x=v+c*(A+1),S=v+1+c*(A+1),E=v+1+c*A;d.push(M,x,E),d.push(x,S,E)}this.setIndex(d),this.setAttribute("position",new Ft(p,3)),this.setAttribute("normal",new Ft(g,3)),this.setAttribute("uv",new Ft(m,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new mr(t.width,t.height,t.widthSegments,t.heightSegments)}}class rc extends $t{constructor(t=.5,e=1,n=32,s=1,r=0,a=Math.PI*2){super(),this.type="RingGeometry",this.parameters={innerRadius:t,outerRadius:e,thetaSegments:n,phiSegments:s,thetaStart:r,thetaLength:a},n=Math.max(3,n),s=Math.max(1,s);const o=[],l=[],c=[],h=[];let f=t;const u=(e-t)/s,d=new I,p=new lt;for(let g=0;g<=s;g++){for(let m=0;m<=n;m++){const A=r+m/n*a;d.x=f*Math.cos(A),d.y=f*Math.sin(A),l.push(d.x,d.y,d.z),c.push(0,0,1),p.x=(d.x/e+1)/2,p.y=(d.y/e+1)/2,h.push(p.x,p.y)}f+=u}for(let g=0;g<s;g++){const m=g*(n+1);for(let A=0;A<n;A++){const v=A+m,M=v,x=v+n+1,S=v+n+2,E=v+1;o.push(M,x,E),o.push(x,S,E)}}this.setIndex(o),this.setAttribute("position",new Ft(l,3)),this.setAttribute("normal",new Ft(c,3)),this.setAttribute("uv",new Ft(h,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new rc(t.innerRadius,t.outerRadius,t.thetaSegments,t.phiSegments,t.thetaStart,t.thetaLength)}}class ac extends $t{constructor(t=new Sa([new lt(0,.5),new lt(-.5,-.5),new lt(.5,-.5)]),e=12){super(),this.type="ShapeGeometry",this.parameters={shapes:t,curveSegments:e};const n=[],s=[],r=[],a=[];let o=0,l=0;if(Array.isArray(t)===!1)c(t);else for(let h=0;h<t.length;h++)c(t[h]),this.addGroup(o,l,h),o+=l,l=0;this.setIndex(n),this.setAttribute("position",new Ft(s,3)),this.setAttribute("normal",new Ft(r,3)),this.setAttribute("uv",new Ft(a,2));function c(h){const f=s.length/3,u=h.extractPoints(e);let d=u.shape;const p=u.holes;Un.isClockWise(d)===!1&&(d=d.reverse());for(let m=0,A=p.length;m<A;m++){const v=p[m];Un.isClockWise(v)===!0&&(p[m]=v.reverse())}const g=Un.triangulateShape(d,p);for(let m=0,A=p.length;m<A;m++){const v=p[m];d=d.concat(v)}for(let m=0,A=d.length;m<A;m++){const v=d[m];s.push(v.x,v.y,0),r.push(0,0,1),a.push(v.x,v.y)}for(let m=0,A=g.length;m<A;m++){const v=g[m],M=v[0]+f,x=v[1]+f,S=v[2]+f;n.push(M,x,S),l+=3}}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}toJSON(){const t=super.toJSON(),e=this.parameters.shapes;return s_(e,t)}static fromJSON(t,e){const n=[];for(let s=0,r=t.shapes.length;s<r;s++){const a=e[t.shapes[s]];n.push(a)}return new ac(n,t.curveSegments)}}function s_(i,t){if(t.shapes=[],Array.isArray(i))for(let e=0,n=i.length;e<n;e++){const s=i[e];t.shapes.push(s.uuid)}else t.shapes.push(i.uuid);return t}class ba extends $t{constructor(t=1,e=32,n=16,s=0,r=Math.PI*2,a=0,o=Math.PI){super(),this.type="SphereGeometry",this.parameters={radius:t,widthSegments:e,heightSegments:n,phiStart:s,phiLength:r,thetaStart:a,thetaLength:o},e=Math.max(3,Math.floor(e)),n=Math.max(2,Math.floor(n));const l=Math.min(a+o,Math.PI);let c=0;const h=[],f=new I,u=new I,d=[],p=[],g=[],m=[];for(let A=0;A<=n;A++){const v=[],M=A/n,x=a+M*o,S=t*Math.cos(x),E=Math.sqrt(t*t-S*S);let C=0;A===0&&a===0?C=.5/e:A===n&&l===Math.PI&&(C=-.5/e);for(let _=0;_<=e;_++){const b=_/e,B=s+b*r;f.x=-E*Math.cos(B),f.y=S,f.z=E*Math.sin(B),p.push(f.x,f.y,f.z),u.copy(f).normalize(),g.push(u.x,u.y,u.z),m.push(b+C,1-M),v.push(c++)}h.push(v)}for(let A=0;A<n;A++)for(let v=0;v<e;v++){const M=h[A][v+1],x=h[A][v],S=h[A+1][v],E=h[A+1][v+1];(A!==0||a>0)&&d.push(M,x,E),(A!==n-1||l<Math.PI)&&d.push(x,S,E)}this.setIndex(d),this.setAttribute("position",new Ft(p,3)),this.setAttribute("normal",new Ft(g,3)),this.setAttribute("uv",new Ft(m,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new ba(t.radius,t.widthSegments,t.heightSegments,t.phiStart,t.phiLength,t.thetaStart,t.thetaLength)}}class oc extends Gi{constructor(t=1,e=0){const n=[1,1,1,-1,-1,1,-1,1,-1,1,-1,-1],s=[2,1,0,0,3,2,1,3,0,2,3,1];super(n,s,t,e),this.type="TetrahedronGeometry",this.parameters={radius:t,detail:e}}static fromJSON(t){return new oc(t.radius,t.detail)}}class lc extends $t{constructor(t=1,e=.4,n=12,s=48,r=Math.PI*2,a=0,o=Math.PI*2){super(),this.type="TorusGeometry",this.parameters={radius:t,tube:e,radialSegments:n,tubularSegments:s,arc:r,thetaStart:a,thetaLength:o},n=Math.floor(n),s=Math.floor(s);const l=[],c=[],h=[],f=[],u=new I,d=new I,p=new I;for(let g=0;g<=n;g++){const m=a+g/n*o;for(let A=0;A<=s;A++){const v=A/s*r;d.x=(t+e*Math.cos(m))*Math.cos(v),d.y=(t+e*Math.cos(m))*Math.sin(v),d.z=e*Math.sin(m),c.push(d.x,d.y,d.z),u.x=t*Math.cos(v),u.y=t*Math.sin(v),p.subVectors(d,u).normalize(),h.push(p.x,p.y,p.z),f.push(A/s),f.push(g/n)}}for(let g=1;g<=n;g++)for(let m=1;m<=s;m++){const A=(s+1)*g+m-1,v=(s+1)*(g-1)+m-1,M=(s+1)*(g-1)+m,x=(s+1)*g+m;l.push(A,v,x),l.push(v,M,x)}this.setIndex(l),this.setAttribute("position",new Ft(c,3)),this.setAttribute("normal",new Ft(h,3)),this.setAttribute("uv",new Ft(f,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new lc(t.radius,t.tube,t.radialSegments,t.tubularSegments,t.arc,t.thetaStart,t.thetaLength)}}class cc extends $t{constructor(t=1,e=.4,n=64,s=8,r=2,a=3){super(),this.type="TorusKnotGeometry",this.parameters={radius:t,tube:e,tubularSegments:n,radialSegments:s,p:r,q:a},n=Math.floor(n),s=Math.floor(s);const o=[],l=[],c=[],h=[],f=new I,u=new I,d=new I,p=new I,g=new I,m=new I,A=new I;for(let M=0;M<=n;++M){const x=M/n*r*Math.PI*2;v(x,r,a,t,d),v(x+.01,r,a,t,p),m.subVectors(p,d),A.addVectors(p,d),g.crossVectors(m,A),A.crossVectors(g,m),g.normalize(),A.normalize();for(let S=0;S<=s;++S){const E=S/s*Math.PI*2,C=-e*Math.cos(E),_=e*Math.sin(E);f.x=d.x+(C*A.x+_*g.x),f.y=d.y+(C*A.y+_*g.y),f.z=d.z+(C*A.z+_*g.z),l.push(f.x,f.y,f.z),u.subVectors(f,d).normalize(),c.push(u.x,u.y,u.z),h.push(M/n),h.push(S/s)}}for(let M=1;M<=n;M++)for(let x=1;x<=s;x++){const S=(s+1)*(M-1)+(x-1),E=(s+1)*M+(x-1),C=(s+1)*M+x,_=(s+1)*(M-1)+x;o.push(S,E,_),o.push(E,C,_)}this.setIndex(o),this.setAttribute("position",new Ft(l,3)),this.setAttribute("normal",new Ft(c,3)),this.setAttribute("uv",new Ft(h,2));function v(M,x,S,E,C){const _=Math.cos(M),b=Math.sin(M),B=S/x*M,P=Math.cos(B);C.x=E*(2+P)*.5*_,C.y=E*(2+P)*b*.5,C.z=E*Math.sin(B)*.5}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new cc(t.radius,t.tube,t.tubularSegments,t.radialSegments,t.p,t.q)}}class hc extends $t{constructor(t=new Cu(new I(-1,-1,0),new I(-1,1,0),new I(1,1,0)),e=64,n=1,s=8,r=!1){super(),this.type="TubeGeometry",this.parameters={path:t,tubularSegments:e,radius:n,radialSegments:s,closed:r};const a=t.computeFrenetFrames(e,r);this.tangents=a.tangents,this.normals=a.normals,this.binormals=a.binormals;const o=new I,l=new I,c=new lt;let h=new I;const f=[],u=[],d=[],p=[];g(),this.setIndex(p),this.setAttribute("position",new Ft(f,3)),this.setAttribute("normal",new Ft(u,3)),this.setAttribute("uv",new Ft(d,2));function g(){for(let M=0;M<e;M++)m(M);m(r===!1?e:0),v(),A()}function m(M){h=t.getPointAt(M/e,h);const x=a.normals[M],S=a.binormals[M];for(let E=0;E<=s;E++){const C=E/s*Math.PI*2,_=Math.sin(C),b=-Math.cos(C);l.x=b*x.x+_*S.x,l.y=b*x.y+_*S.y,l.z=b*x.z+_*S.z,l.normalize(),u.push(l.x,l.y,l.z),o.x=h.x+n*l.x,o.y=h.y+n*l.y,o.z=h.z+n*l.z,f.push(o.x,o.y,o.z)}}function A(){for(let M=1;M<=e;M++)for(let x=1;x<=s;x++){const S=(s+1)*(M-1)+(x-1),E=(s+1)*M+(x-1),C=(s+1)*M+x,_=(s+1)*(M-1)+x;p.push(S,E,_),p.push(E,C,_)}}function v(){for(let M=0;M<=e;M++)for(let x=0;x<=s;x++)c.x=M/e,c.y=x/s,d.push(c.x,c.y)}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}toJSON(){const t=super.toJSON();return t.path=this.parameters.path.toJSON(),t}static fromJSON(t){return new hc(new Ml[t.path.type]().fromJSON(t.path),t.tubularSegments,t.radius,t.radialSegments,t.closed)}}class kA extends $t{constructor(t=null){if(super(),this.type="WireframeGeometry",this.parameters={geometry:t},t!==null){const e=[],n=new Set,s=new I,r=new I;if(t.index!==null){const a=t.attributes.position,o=t.index;let l=t.groups;l.length===0&&(l=[{start:0,count:o.count,materialIndex:0}]);for(let c=0,h=l.length;c<h;++c){const f=l[c],u=f.start,d=f.count;for(let p=u,g=u+d;p<g;p+=3)for(let m=0;m<3;m++){const A=o.getX(p+m),v=o.getX(p+(m+1)%3);s.fromBufferAttribute(a,A),r.fromBufferAttribute(a,v),Jf(s,r,n)===!0&&(e.push(s.x,s.y,s.z),e.push(r.x,r.y,r.z))}}}else{const a=t.attributes.position;for(let o=0,l=a.count/3;o<l;o++)for(let c=0;c<3;c++){const h=3*o+c,f=3*o+(c+1)%3;s.fromBufferAttribute(a,h),r.fromBufferAttribute(a,f),Jf(s,r,n)===!0&&(e.push(s.x,s.y,s.z),e.push(r.x,r.y,r.z))}}this.setAttribute("position",new Ft(e,3))}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}}function Jf(i,t,e){const n=`${i.x},${i.y},${i.z}-${t.x},${t.y},${t.z}`,s=`${t.x},${t.y},${t.z}-${i.x},${i.y},${i.z}`;return e.has(n)===!0||e.has(s)===!0?!1:(e.add(n),e.add(s),!0)}var Zf=Object.freeze({__proto__:null,BoxGeometry:As,CapsuleGeometry:$l,CircleGeometry:jl,ConeGeometry:Ea,CylinderGeometry:Ma,DodecahedronGeometry:tc,EdgesGeometry:IA,ExtrudeGeometry:nc,IcosahedronGeometry:ic,LatheGeometry:sc,OctahedronGeometry:wa,PlaneGeometry:mr,PolyhedronGeometry:Gi,RingGeometry:rc,ShapeGeometry:ac,SphereGeometry:ba,TetrahedronGeometry:oc,TorusGeometry:lc,TorusKnotGeometry:cc,TubeGeometry:hc,WireframeGeometry:kA});class QA extends ke{constructor(t){super(),this.isShadowMaterial=!0,this.type="ShadowMaterial",this.color=new bt(0),this.transparent=!0,this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.color.copy(t.color),this.fog=t.fog,this}}function fr(i){const t={};for(const e in i){t[e]={};for(const n in i[e]){const s=i[e][n];if($f(s))s.isRenderTargetTexture?(_t("UniformsUtils: Textures of render targets cannot be cloned via cloneUniforms() or mergeUniforms()."),t[e][n]=null):t[e][n]=s.clone();else if(Array.isArray(s))if($f(s[0])){const r=[];for(let a=0,o=s.length;a<o;a++)r[a]=s[a].clone();t[e][n]=r}else t[e][n]=s.slice();else t[e][n]=s}}return t}function tn(i){const t={};for(let e=0;e<i.length;e++){const n=fr(i[e]);for(const s in n)t[s]=n[s]}return t}function $f(i){return i&&(i.isColor||i.isMatrix3||i.isMatrix4||i.isVector2||i.isVector3||i.isVector4||i.isTexture||i.isQuaternion)}function r_(i){const t=[];for(let e=0;e<i.length;e++)t.push(i[e].clone());return t}function zA(i){const t=i.getRenderTarget();return t===null?i.outputColorSpace:t.isXRRenderTarget===!0?t.texture.colorSpace:ae.workingColorSpace}const HA={clone:fr,merge:tn};var a_=`void main() {
	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}`,o_=`void main() {
	gl_FragColor = vec4( 1.0, 0.0, 0.0, 1.0 );
}`;class Sn extends ke{constructor(t){super(),this.isShaderMaterial=!0,this.type="ShaderMaterial",this.defines={},this.uniforms={},this.uniformsGroups=[],this.vertexShader=a_,this.fragmentShader=o_,this.linewidth=1,this.wireframe=!1,this.wireframeLinewidth=1,this.fog=!1,this.lights=!1,this.clipping=!1,this.forceSinglePass=!0,this.extensions={clipCullDistance:!1,multiDraw:!1},this.defaultAttributeValues={color:[1,1,1],uv:[0,0],uv1:[0,0]},this.index0AttributeName=void 0,this.uniformsNeedUpdate=!1,this.glslVersion=null,t!==void 0&&this.setValues(t)}copy(t){return super.copy(t),this.fragmentShader=t.fragmentShader,this.vertexShader=t.vertexShader,this.uniforms=fr(t.uniforms),this.uniformsGroups=r_(t.uniformsGroups),this.defines=Object.assign({},t.defines),this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.fog=t.fog,this.lights=t.lights,this.clipping=t.clipping,this.extensions=Object.assign({},t.extensions),this.glslVersion=t.glslVersion,this.defaultAttributeValues=Object.assign({},t.defaultAttributeValues),this.index0AttributeName=t.index0AttributeName,this.uniformsNeedUpdate=t.uniformsNeedUpdate,this}toJSON(t){const e=super.toJSON(t);e.glslVersion=this.glslVersion,e.uniforms={};for(const s in this.uniforms){const a=this.uniforms[s].value;a&&a.isTexture?e.uniforms[s]={type:"t",value:a.toJSON(t).uuid}:a&&a.isColor?e.uniforms[s]={type:"c",value:a.getHex()}:a&&a.isVector2?e.uniforms[s]={type:"v2",value:a.toArray()}:a&&a.isVector3?e.uniforms[s]={type:"v3",value:a.toArray()}:a&&a.isVector4?e.uniforms[s]={type:"v4",value:a.toArray()}:a&&a.isMatrix3?e.uniforms[s]={type:"m3",value:a.toArray()}:a&&a.isMatrix4?e.uniforms[s]={type:"m4",value:a.toArray()}:e.uniforms[s]={value:a}}Object.keys(this.defines).length>0&&(e.defines=this.defines),e.vertexShader=this.vertexShader,e.fragmentShader=this.fragmentShader,e.lights=this.lights,e.clipping=this.clipping;const n={};for(const s in this.extensions)this.extensions[s]===!0&&(n[s]=!0);return Object.keys(n).length>0&&(e.extensions=n),e}fromJSON(t,e){if(super.fromJSON(t,e),t.uniforms!==void 0)for(const n in t.uniforms){const s=t.uniforms[n];switch(this.uniforms[n]={},s.type){case"t":this.uniforms[n].value=e[s.value]||null;break;case"c":this.uniforms[n].value=new bt().setHex(s.value);break;case"v2":this.uniforms[n].value=new lt().fromArray(s.value);break;case"v3":this.uniforms[n].value=new I().fromArray(s.value);break;case"v4":this.uniforms[n].value=new Ae().fromArray(s.value);break;case"m3":this.uniforms[n].value=new jt().fromArray(s.value);break;case"m4":this.uniforms[n].value=new Kt().fromArray(s.value);break;default:this.uniforms[n].value=s.value}}if(t.defines!==void 0&&(this.defines=t.defines),t.vertexShader!==void 0&&(this.vertexShader=t.vertexShader),t.fragmentShader!==void 0&&(this.fragmentShader=t.fragmentShader),t.glslVersion!==void 0&&(this.glslVersion=t.glslVersion),t.extensions!==void 0)for(const n in t.extensions)this.extensions[n]=t.extensions[n];return t.lights!==void 0&&(this.lights=t.lights),t.clipping!==void 0&&(this.clipping=t.clipping),this}}class Bu extends Sn{constructor(t){super(t),this.isRawShaderMaterial=!0,this.type="RawShaderMaterial"}}class Iu extends ke{constructor(t){super(),this.isMeshStandardMaterial=!0,this.type="MeshStandardMaterial",this.defines={STANDARD:""},this.color=new bt(16777215),this.roughness=1,this.metalness=0,this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.emissive=new bt(0),this.emissiveIntensity=1,this.emissiveMap=null,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=mi,this.normalScale=new lt(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.roughnessMap=null,this.metalnessMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new kn,this.envMapIntensity=1,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.flatShading=!1,this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.defines={STANDARD:""},this.color.copy(t.color),this.roughness=t.roughness,this.metalness=t.metalness,this.map=t.map,this.lightMap=t.lightMap,this.lightMapIntensity=t.lightMapIntensity,this.aoMap=t.aoMap,this.aoMapIntensity=t.aoMapIntensity,this.emissive.copy(t.emissive),this.emissiveMap=t.emissiveMap,this.emissiveIntensity=t.emissiveIntensity,this.bumpMap=t.bumpMap,this.bumpScale=t.bumpScale,this.normalMap=t.normalMap,this.normalMapType=t.normalMapType,this.normalScale.copy(t.normalScale),this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this.roughnessMap=t.roughnessMap,this.metalnessMap=t.metalnessMap,this.alphaMap=t.alphaMap,this.envMap=t.envMap,this.envMapRotation.copy(t.envMapRotation),this.envMapIntensity=t.envMapIntensity,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.wireframeLinecap=t.wireframeLinecap,this.wireframeLinejoin=t.wireframeLinejoin,this.flatShading=t.flatShading,this.fog=t.fog,this}}class VA extends Iu{constructor(t){super(),this.isMeshPhysicalMaterial=!0,this.defines={STANDARD:"",PHYSICAL:""},this.type="MeshPhysicalMaterial",this.anisotropyRotation=0,this.anisotropyMap=null,this.clearcoatMap=null,this.clearcoatRoughness=0,this.clearcoatRoughnessMap=null,this.clearcoatNormalScale=new lt(1,1),this.clearcoatNormalMap=null,this.ior=1.5,Object.defineProperty(this,"reflectivity",{get:function(){return Xt(2.5*(this.ior-1)/(this.ior+1),0,1)},set:function(e){this.ior=(1+.4*e)/(1-.4*e)}}),this.iridescenceMap=null,this.iridescenceIOR=1.3,this.iridescenceThicknessRange=[100,400],this.iridescenceThicknessMap=null,this.sheenColor=new bt(0),this.sheenColorMap=null,this.sheenRoughness=1,this.sheenRoughnessMap=null,this.transmissionMap=null,this.thickness=0,this.thicknessMap=null,this.attenuationDistance=1/0,this.attenuationColor=new bt(1,1,1),this.specularIntensity=1,this.specularIntensityMap=null,this.specularColor=new bt(1,1,1),this.specularColorMap=null,this._anisotropy=0,this._clearcoat=0,this._dispersion=0,this._iridescence=0,this._retroreflectivity=0,this._sheen=0,this._transmission=0,this.setValues(t)}get anisotropy(){return this._anisotropy}set anisotropy(t){this._anisotropy>0!=t>0&&this.version++,this._anisotropy=t}get clearcoat(){return this._clearcoat}set clearcoat(t){this._clearcoat>0!=t>0&&this.version++,this._clearcoat=t}get iridescence(){return this._iridescence}set iridescence(t){this._iridescence>0!=t>0&&this.version++,this._iridescence=t}get dispersion(){return this._dispersion}set dispersion(t){this._dispersion>0!=t>0&&this.version++,this._dispersion=t}get retroreflectivity(){return this._retroreflectivity}set retroreflectivity(t){this._retroreflectivity>0!=t>0&&this.version++,this._retroreflectivity=t}get sheen(){return this._sheen}set sheen(t){this._sheen>0!=t>0&&this.version++,this._sheen=t}get transmission(){return this._transmission}set transmission(t){this._transmission>0!=t>0&&this.version++,this._transmission=t}copy(t){return super.copy(t),this.defines={STANDARD:"",PHYSICAL:""},this.anisotropy=t.anisotropy,this.anisotropyRotation=t.anisotropyRotation,this.anisotropyMap=t.anisotropyMap,this.clearcoat=t.clearcoat,this.clearcoatMap=t.clearcoatMap,this.clearcoatRoughness=t.clearcoatRoughness,this.clearcoatRoughnessMap=t.clearcoatRoughnessMap,this.clearcoatNormalMap=t.clearcoatNormalMap,this.clearcoatNormalScale.copy(t.clearcoatNormalScale),this.dispersion=t.dispersion,this.ior=t.ior,this.iridescence=t.iridescence,this.iridescenceMap=t.iridescenceMap,this.iridescenceIOR=t.iridescenceIOR,this.iridescenceThicknessRange=[...t.iridescenceThicknessRange],this.iridescenceThicknessMap=t.iridescenceThicknessMap,this.retroreflectivity=t.retroreflectivity,this.sheen=t.sheen,this.sheenColor.copy(t.sheenColor),this.sheenColorMap=t.sheenColorMap,this.sheenRoughness=t.sheenRoughness,this.sheenRoughnessMap=t.sheenRoughnessMap,this.transmission=t.transmission,this.transmissionMap=t.transmissionMap,this.thickness=t.thickness,this.thicknessMap=t.thicknessMap,this.attenuationDistance=t.attenuationDistance,this.attenuationColor.copy(t.attenuationColor),this.specularIntensity=t.specularIntensity,this.specularIntensityMap=t.specularIntensityMap,this.specularColor.copy(t.specularColor),this.specularColorMap=t.specularColorMap,this}}class WA extends ke{constructor(t){super(),this.isMeshPhongMaterial=!0,this.type="MeshPhongMaterial",this.color=new bt(16777215),this.specular=new bt(1118481),this.shininess=30,this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.emissive=new bt(0),this.emissiveIntensity=1,this.emissiveMap=null,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=mi,this.normalScale=new lt(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new kn,this.combine=_a,this.reflectivity=1,this.envMapIntensity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.flatShading=!1,this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.color.copy(t.color),this.specular.copy(t.specular),this.shininess=t.shininess,this.map=t.map,this.lightMap=t.lightMap,this.lightMapIntensity=t.lightMapIntensity,this.aoMap=t.aoMap,this.aoMapIntensity=t.aoMapIntensity,this.emissive.copy(t.emissive),this.emissiveMap=t.emissiveMap,this.emissiveIntensity=t.emissiveIntensity,this.bumpMap=t.bumpMap,this.bumpScale=t.bumpScale,this.normalMap=t.normalMap,this.normalMapType=t.normalMapType,this.normalScale.copy(t.normalScale),this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this.specularMap=t.specularMap,this.alphaMap=t.alphaMap,this.envMap=t.envMap,this.envMapRotation.copy(t.envMapRotation),this.combine=t.combine,this.reflectivity=t.reflectivity,this.envMapIntensity=t.envMapIntensity,this.refractionRatio=t.refractionRatio,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.wireframeLinecap=t.wireframeLinecap,this.wireframeLinejoin=t.wireframeLinejoin,this.flatShading=t.flatShading,this.fog=t.fog,this}}class YA extends ke{constructor(t){super(),this.isMeshToonMaterial=!0,this.defines={TOON:""},this.type="MeshToonMaterial",this.color=new bt(16777215),this.map=null,this.gradientMap=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.emissive=new bt(0),this.emissiveIntensity=1,this.emissiveMap=null,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=mi,this.normalScale=new lt(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.alphaMap=null,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.color.copy(t.color),this.map=t.map,this.gradientMap=t.gradientMap,this.lightMap=t.lightMap,this.lightMapIntensity=t.lightMapIntensity,this.aoMap=t.aoMap,this.aoMapIntensity=t.aoMapIntensity,this.emissive.copy(t.emissive),this.emissiveMap=t.emissiveMap,this.emissiveIntensity=t.emissiveIntensity,this.bumpMap=t.bumpMap,this.bumpScale=t.bumpScale,this.normalMap=t.normalMap,this.normalMapType=t.normalMapType,this.normalScale.copy(t.normalScale),this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this.alphaMap=t.alphaMap,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.wireframeLinecap=t.wireframeLinecap,this.wireframeLinejoin=t.wireframeLinejoin,this.fog=t.fog,this}}class XA extends ke{constructor(t){super(),this.isMeshNormalMaterial=!0,this.type="MeshNormalMaterial",this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=mi,this.normalScale=new lt(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.wireframe=!1,this.wireframeLinewidth=1,this.flatShading=!1,this.setValues(t)}copy(t){return super.copy(t),this.bumpMap=t.bumpMap,this.bumpScale=t.bumpScale,this.normalMap=t.normalMap,this.normalMapType=t.normalMapType,this.normalScale.copy(t.normalScale),this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.flatShading=t.flatShading,this}}class qA extends ke{constructor(t){super(),this.isMeshLambertMaterial=!0,this.type="MeshLambertMaterial",this.color=new bt(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.emissive=new bt(0),this.emissiveIntensity=1,this.emissiveMap=null,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=mi,this.normalScale=new lt(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new kn,this.combine=_a,this.reflectivity=1,this.envMapIntensity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.flatShading=!1,this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.color.copy(t.color),this.map=t.map,this.lightMap=t.lightMap,this.lightMapIntensity=t.lightMapIntensity,this.aoMap=t.aoMap,this.aoMapIntensity=t.aoMapIntensity,this.emissive.copy(t.emissive),this.emissiveMap=t.emissiveMap,this.emissiveIntensity=t.emissiveIntensity,this.bumpMap=t.bumpMap,this.bumpScale=t.bumpScale,this.normalMap=t.normalMap,this.normalMapType=t.normalMapType,this.normalScale.copy(t.normalScale),this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this.specularMap=t.specularMap,this.alphaMap=t.alphaMap,this.envMap=t.envMap,this.envMapRotation.copy(t.envMapRotation),this.combine=t.combine,this.reflectivity=t.reflectivity,this.envMapIntensity=t.envMapIntensity,this.refractionRatio=t.refractionRatio,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.wireframeLinecap=t.wireframeLinecap,this.wireframeLinejoin=t.wireframeLinejoin,this.flatShading=t.flatShading,this.fog=t.fog,this}}class Ru extends ke{constructor(t){super(),this.isMeshDepthMaterial=!0,this.type="MeshDepthMaterial",this.depthPacking=rA,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.wireframe=!1,this.wireframeLinewidth=1,this.setValues(t)}copy(t){return super.copy(t),this.depthPacking=t.depthPacking,this.map=t.map,this.alphaMap=t.alphaMap,this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this}}class Du extends ke{constructor(t){super(),this.isMeshDistanceMaterial=!0,this.type="MeshDistanceMaterial",this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.setValues(t)}copy(t){return super.copy(t),this.map=t.map,this.alphaMap=t.alphaMap,this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this}}class KA extends ke{constructor(t){super(),this.isMeshMatcapMaterial=!0,this.defines={MATCAP:""},this.type="MeshMatcapMaterial",this.color=new bt(16777215),this.matcap=null,this.map=null,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=mi,this.normalScale=new lt(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.alphaMap=null,this.wireframe=!1,this.wireframeLinewidth=1,this.flatShading=!1,this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.defines={MATCAP:""},this.color.copy(t.color),this.matcap=t.matcap,this.map=t.map,this.bumpMap=t.bumpMap,this.bumpScale=t.bumpScale,this.normalMap=t.normalMap,this.normalMapType=t.normalMapType,this.normalScale.copy(t.normalScale),this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this.alphaMap=t.alphaMap,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.flatShading=t.flatShading,this.fog=t.fog,this}}class JA extends ln{constructor(t){super(),this.isLineDashedMaterial=!0,this.type="LineDashedMaterial",this.scale=1,this.dashSize=3,this.gapSize=1,this.setValues(t)}copy(t){return super.copy(t),this.scale=t.scale,this.dashSize=t.dashSize,this.gapSize=t.gapSize,this}}function Pn(i,t){return!i||i.constructor===t?i:typeof t.BYTES_PER_ELEMENT=="number"?new t(i):Array.prototype.slice.call(i)}function Zr(i){return i!==void 0&&i.inTangents!==void 0&&i.outTangents!==void 0}function ZA(i){function t(s,r){return i[s]-i[r]}const e=i.length,n=new Array(e);for(let s=0;s!==e;++s)n[s]=s;return n.sort(t),n}function Dh(i,t,e){const n=i.length,s=new i.constructor(n);for(let r=0,a=0;a!==n;++r){const o=e[r]*t;for(let l=0;l!==t;++l)s[a++]=i[o+l]}return s}function $A(i,t,e,n){let s=1,r=i[0];for(;r!==void 0&&r[n]===void 0;)r=i[s++];if(r===void 0)return;let a=r[n];if(a!==void 0)if(Array.isArray(a))do a=r[n],a!==void 0&&(t.push(r.time),e.push(...a)),r=i[s++];while(r!==void 0);else if(a.toArray!==void 0)do a=r[n],a!==void 0&&(t.push(r.time),a.toArray(e,e.length)),r=i[s++];while(r!==void 0);else do a=r[n],a!==void 0&&(t.push(r.time),e.push(a)),r=i[s++];while(r!==void 0)}function l_(i,t,e,n,s=30){const r=i.clone();r.name=t;const a=[];for(let l=0;l<r.tracks.length;++l){const c=r.tracks[l],h=c.getValueSize(),f=[],u=[];for(let d=0;d<c.times.length;++d){const p=c.times[d]*s;if(!(p<e||p>=n)){f.push(c.times[d]);for(let g=0;g<h;++g)u.push(c.values[d*h+g])}}f.length!==0&&(c.times=Pn(f,c.times.constructor),c.values=Pn(u,c.values.constructor),a.push(c))}r.tracks=a;let o=1/0;for(let l=0;l<r.tracks.length;++l)o>r.tracks[l].times[0]&&(o=r.tracks[l].times[0]);for(let l=0;l<r.tracks.length;++l)r.tracks[l].shift(-1*o);return r.resetDuration(),r}function c_(i,t=0,e=i,n=30){n<=0&&(n=30);const s=e.tracks.length,r=t/n;for(let a=0;a<s;++a){const o=e.tracks[a],l=o.ValueTypeName;if(l==="bool"||l==="string")continue;const c=i.tracks.find(function(A){return A.name===o.name&&A.ValueTypeName===l});if(c===void 0)continue;let h=0;const f=o.getValueSize();o.createInterpolant.isInterpolantFactoryMethodGLTFCubicSpline&&(h=f/3);let u=0;const d=c.getValueSize();c.createInterpolant.isInterpolantFactoryMethodGLTFCubicSpline&&(u=d/3);const p=o.times.length-1;let g;if(r<=o.times[0]){const A=h,v=f-h;g=o.values.slice(A,v)}else if(r>=o.times[p]){const A=p*f+h,v=A+f-h;g=o.values.slice(A,v)}else{const A=o.createInterpolant(),v=h,M=f-h;A.evaluate(r),g=A.resultBuffer.slice(v,M)}l==="quaternion"&&new on().fromArray(g).normalize().conjugate().toArray(g);const m=c.times.length;for(let A=0;A<m;++A){const v=A*d+u;if(l==="quaternion")on.multiplyQuaternionsFlat(c.values,v,g,0,c.values,v);else{const M=d-u*2;for(let x=0;x<M;++x)c.values[v+x]-=g[x]}}}return i.blendMode=pu,i}class h_{static convertArray(t,e){return Pn(t,e)}static isTypedArray(t){return pA(t)}static hasTangents(t){return Zr(t)}static getKeyframeOrder(t){return ZA(t)}static sortedArray(t,e,n){return Dh(t,e,n)}static flattenJSON(t,e,n,s){$A(t,e,n,s)}static subclip(t,e,n,s,r=30){return l_(t,e,n,s,r)}static makeClipAdditive(t,e=0,n=t,s=30){return c_(t,e,n,s)}}class gr{constructor(t,e,n,s){this.parameterPositions=t,this._cachedIndex=0,this.resultBuffer=s!==void 0?s:new e.constructor(n),this.sampleValues=e,this.valueSize=n,this.settings=null,this.DefaultSettings_={}}evaluate(t){const e=this.parameterPositions;let n=this._cachedIndex,s=e[n],r=e[n-1];t:{e:{let a;n:{i:if(!(t<s)){for(let o=n+2;;){if(s===void 0){if(t<r)break i;return n=e.length,this._cachedIndex=n,this.copySampleValue_(n-1)}if(n===o)break;if(r=s,s=e[++n],t<s)break e}a=e.length;break n}if(!(t>=r)){const o=e[1];t<o&&(n=2,r=o);for(let l=n-2;;){if(r===void 0)return this._cachedIndex=0,this.copySampleValue_(0);if(n===l)break;if(s=r,r=e[--n-1],t>=r)break e}a=n,n=0;break n}break t}for(;n<a;){const o=n+a>>>1;t<e[o]?a=o:n=o+1}if(s=e[n],r=e[n-1],r===void 0)return this._cachedIndex=0,this.copySampleValue_(0);if(s===void 0)return n=e.length,this._cachedIndex=n,this.copySampleValue_(n-1)}this._cachedIndex=n,this.intervalChanged_(n,r,s)}return this.interpolate_(n,r,t,s)}getSettings_(){return this.settings||this.DefaultSettings_}copySampleValue_(t){const e=this.resultBuffer,n=this.sampleValues,s=this.valueSize,r=t*s;for(let a=0;a!==s;++a)e[a]=n[r+a];return e}interpolate_(){throw new Error("THREE.Interpolant: Call to abstract method.")}intervalChanged_(){}}class jA extends gr{constructor(t,e,n,s){super(t,e,n,s),this._weightPrev=-0,this._offsetPrev=-0,this._weightNext=-0,this._offsetNext=-0,this.DefaultSettings_={endingStart:os,endingEnd:os}}intervalChanged_(t,e,n){const s=this.parameterPositions;let r=t-2,a=t+1,o=s[r],l=s[a];if(o===void 0)switch(this.getSettings_().endingStart){case ls:r=t,o=2*e-n;break;case sa:r=s.length-2,o=e+s[r]-s[r+1];break;default:r=t,o=n}if(l===void 0)switch(this.getSettings_().endingEnd){case ls:a=t,l=2*n-e;break;case sa:a=1,l=n+s[1]-s[0];break;default:a=t-1,l=e}const c=(n-e)*.5,h=this.valueSize;this._weightPrev=c/(e-o),this._weightNext=c/(l-n),this._offsetPrev=r*h,this._offsetNext=a*h}interpolate_(t,e,n,s){const r=this.resultBuffer,a=this.sampleValues,o=this.valueSize,l=t*o,c=l-o,h=this._offsetPrev,f=this._offsetNext,u=this._weightPrev,d=this._weightNext,p=(n-e)/(s-e),g=p*p,m=g*p,A=-u*m+2*u*g-u*p,v=(1+u)*m+(-1.5-2*u)*g+(-.5+u)*p+1,M=(-1-d)*m+(1.5+d)*g+.5*p,x=d*m-d*g;for(let S=0;S!==o;++S)r[S]=A*a[h+S]+v*a[c+S]+M*a[l+S]+x*a[f+S];return r}}class Pu extends gr{constructor(t,e,n,s){super(t,e,n,s)}interpolate_(t,e,n,s){const r=this.resultBuffer,a=this.sampleValues,o=this.valueSize,l=t*o,c=l-o,h=(n-e)/(s-e),f=1-h;for(let u=0;u!==o;++u)r[u]=a[c+u]*f+a[l+u]*h;return r}}class tm extends gr{constructor(t,e,n,s){super(t,e,n,s)}interpolate_(t){return this.copySampleValue_(t-1)}}class em extends gr{interpolate_(t,e,n,s){const r=this.resultBuffer,a=this.sampleValues,o=this.valueSize,l=t*o,c=l-o,h=this.inTangents,f=this.outTangents;if(!h||!f){const p=(n-e)/(s-e),g=1-p;for(let m=0;m!==o;++m)r[m]=a[c+m]*g+a[l+m]*p;return r}const u=o*2,d=t-1;for(let p=0;p!==o;++p){const g=a[c+p],m=a[l+p],A=d*u+p*2,v=f[A],M=f[A+1],x=t*u+p*2,S=h[x],E=h[x+1],C=f_(n,e,v,S,s);r[p]=nm(C,g,M,E,m)}return r}}function nm(i,t,e,n,s){const r=1-i;return r*r*r*t+3*r*r*i*e+3*r*i*i*n+i*i*i*s}function u_(i,t,e,n,s){const r=1-i;return 3*r*r*(e-t)+6*r*i*(n-e)+3*i*i*(s-n)}function f_(i,t,e,n,s){let r=(i-t)/(s-t);for(let a=0;a<8;a++){const o=nm(r,t,e,n,s)-i;if(Math.abs(o)<1e-10)break;const l=u_(r,t,e,n,s);if(Math.abs(l)<1e-10)break;r=Math.max(0,Math.min(1,r-o/l))}return r}class Bn{constructor(t,e,n,s){if(t===void 0)throw new Error("THREE.KeyframeTrack: track name is undefined");if(e===void 0||e.length===0)throw new Error("THREE.KeyframeTrack: no keyframes in track named "+t);this.name=t,this.times=Pn(e,this.TimeBufferType),this.values=Pn(n,this.ValueBufferType),this.setInterpolation(s||this.DefaultInterpolation)}static toJSON(t){const e=t.constructor;let n;if(e.toJSON!==this.toJSON)n=e.toJSON(t);else{n={name:t.name,times:Pn(t.times,Array),values:Pn(t.values,Array)};const s=t.getInterpolation();s!==t.DefaultInterpolation&&(n.interpolation=s),Zr(t.settings)&&(n.settings={inTangents:Pn(t.settings.inTangents,Array),outTangents:Pn(t.settings.outTangents,Array)})}return n.type=t.ValueTypeName,n}InterpolantFactoryMethodDiscrete(t){return new tm(this.times,this.values,this.getValueSize(),t)}InterpolantFactoryMethodLinear(t){return new Pu(this.times,this.values,this.getValueSize(),t)}InterpolantFactoryMethodSmooth(t){return new jA(this.times,this.values,this.getValueSize(),t)}InterpolantFactoryMethodBezier(t){const e=new em(this.times,this.values,this.getValueSize(),t);return this.settings&&(e.inTangents=this.settings.inTangents,e.outTangents=this.settings.outTangents),e}setInterpolation(t){let e;switch(t){case ia:e=this.InterpolantFactoryMethodDiscrete;break;case _l:e=this.InterpolantFactoryMethodLinear;break;case Bo:e=this.InterpolantFactoryMethodSmooth;break;case Ch:e=this.InterpolantFactoryMethodBezier;break}if(e===void 0){const n="unsupported interpolation for "+this.ValueTypeName+" keyframe track named "+this.name;if(this.createInterpolant===void 0)if(t!==this.DefaultInterpolation)this.setInterpolation(this.DefaultInterpolation);else throw new Error(n);return _t("KeyframeTrack:",n),this}return this.createInterpolant=e,this}getInterpolation(){switch(this.createInterpolant){case this.InterpolantFactoryMethodDiscrete:return ia;case this.InterpolantFactoryMethodLinear:return _l;case this.InterpolantFactoryMethodSmooth:return Bo;case this.InterpolantFactoryMethodBezier:return Ch}}getValueSize(){return this.values.length/this.times.length}shift(t){if(t!==0){const e=this.times;for(let n=0,s=e.length;n!==s;++n)e[n]+=t}return this}scale(t){if(t!==1){const e=this.times;for(let n=0,s=e.length;n!==s;++n)e[n]*=t;Zr(this.settings)&&(jf(this.settings.inTangents,t),jf(this.settings.outTangents,t))}return this}trim(t,e){const n=this.times,s=n.length;let r=0,a=s-1;for(;r!==s&&n[r]<t;)++r;for(;a!==-1&&n[a]>e;)--a;if(++a,r!==0||a!==s){r>=a&&(a=Math.max(a,1),r=a-1);const o=this.getValueSize();this.times=n.slice(r,a),this.values=this.values.slice(r*o,a*o)}return this}validate(){let t=!0;const e=this.getValueSize();e-Math.floor(e)!==0&&(Ht("KeyframeTrack: Invalid value size in track.",this),t=!1);const n=this.times,s=this.values,r=n.length;r===0&&(Ht("KeyframeTrack: Track is empty.",this),t=!1);let a=null;for(let o=0;o!==r;o++){const l=n[o];if(typeof l=="number"&&isNaN(l)){Ht("KeyframeTrack: Time is not a valid number.",this,o,l),t=!1;break}if(a!==null&&a>l){Ht("KeyframeTrack: Out of order keys.",this,o,l,a),t=!1;break}a=l}if(s!==void 0&&pA(s))for(let o=0,l=s.length;o!==l;++o){const c=s[o];if(isNaN(c)){Ht("KeyframeTrack: Value is not a valid number.",this,o,c),t=!1;break}}return t}optimize(){const t=this.times.slice(),e=this.values.slice(),n=this.getValueSize(),s=this.getInterpolation()===Bo,r=t.length-1;let a=1;for(let o=1;o<r;++o){let l=!1;const c=t[o],h=t[o+1];if(c!==h&&(o!==1||c!==t[0]))if(s)l=!0;else{const f=o*n,u=f-n,d=f+n;for(let p=0;p!==n;++p){const g=e[f+p];if(g!==e[u+p]||g!==e[d+p]){l=!0;break}}}if(l){if(o!==a){t[a]=t[o];const f=o*n,u=a*n;for(let d=0;d!==n;++d)e[u+d]=e[f+d]}++a}}if(r>0){t[a]=t[r];for(let o=r*n,l=a*n,c=0;c!==n;++c)e[l+c]=e[o+c];++a}return a!==t.length?(this.times=t.slice(0,a),this.values=e.slice(0,a*n)):(this.times=t,this.values=e),this}clone(){const t=this.times.slice(),e=this.values.slice(),n=this.constructor,s=new n(this.name,t,e);return s.createInterpolant=this.createInterpolant,Zr(this.settings)&&(s.settings={inTangents:this.settings.inTangents.slice(),outTangents:this.settings.outTangents.slice()}),s}}function jf(i,t){for(let e=0,n=i.length;e!==n;e+=2)i[e]*=t}Bn.prototype.ValueTypeName="";Bn.prototype.TimeBufferType=Float32Array;Bn.prototype.ValueBufferType=Float32Array;Bn.prototype.DefaultInterpolation=_l;class ms extends Bn{constructor(t,e,n){super(t,e,n)}}ms.prototype.ValueTypeName="bool";ms.prototype.ValueBufferType=Array;ms.prototype.DefaultInterpolation=ia;ms.prototype.InterpolantFactoryMethodLinear=void 0;ms.prototype.InterpolantFactoryMethodSmooth=void 0;class Lu extends Bn{constructor(t,e,n,s){super(t,e,n,s)}}Lu.prototype.ValueTypeName="color";class uc extends Bn{constructor(t,e,n,s){super(t,e,n,s)}}uc.prototype.ValueTypeName="number";class im extends gr{constructor(t,e,n,s){super(t,e,n,s)}interpolate_(t,e,n,s){const r=this.resultBuffer,a=this.sampleValues,o=this.valueSize,l=(n-e)/(s-e);let c=t*o;for(let h=c+o;c!==h;c+=4)on.slerpFlat(r,0,a,c-o,a,c,l);return r}}class fc extends Bn{constructor(t,e,n,s){super(t,e,n,s)}InterpolantFactoryMethodLinear(t){return new im(this.times,this.values,this.getValueSize(),t)}}fc.prototype.ValueTypeName="quaternion";fc.prototype.InterpolantFactoryMethodSmooth=void 0;class gs extends Bn{constructor(t,e,n){super(t,e,n)}}gs.prototype.ValueTypeName="string";gs.prototype.ValueBufferType=Array;gs.prototype.DefaultInterpolation=ia;gs.prototype.InterpolantFactoryMethodLinear=void 0;gs.prototype.InterpolantFactoryMethodSmooth=void 0;class Fu extends Bn{constructor(t,e,n,s){super(t,e,n,s)}}Fu.prototype.ValueTypeName="vector";class da{constructor(t="",e=-1,n=[],s=Gl){this.name=t,this.tracks=n,this.duration=e,this.blendMode=s,this.uuid=yn(),this.userData={},this.duration<0&&this.resetDuration()}static parse(t){const e=[],n=t.tracks,s=1/(t.fps||1);for(let a=0,o=n.length;a!==o;++a)e.push(p_(n[a]).scale(s));const r=new this(t.name,t.duration,e,t.blendMode);return r.uuid=t.uuid,r.userData=JSON.parse(t.userData||"{}"),r}static toJSON(t){const e=[],n=t.tracks,s={name:t.name,duration:t.duration,tracks:e,uuid:t.uuid,blendMode:t.blendMode,userData:JSON.stringify(t.userData)};for(let r=0,a=n.length;r!==a;++r)e.push(Bn.toJSON(n[r]));return s}static CreateFromMorphTargetSequence(t,e,n,s){const r=e.length,a=[];for(let o=0;o<r;o++){let l=[],c=[];l.push((o+r-1)%r,o,(o+1)%r),c.push(0,1,0);const h=ZA(l);l=Dh(l,1,h),c=Dh(c,1,h),!s&&l[0]===0&&(l.push(r),c.push(c[0])),a.push(new uc(".morphTargetInfluences["+e[o].name+"]",l,c).scale(1/n))}return new this(t,-1,a)}static findByName(t,e){let n=t;if(!Array.isArray(t)){const s=t;n=s.geometry&&s.geometry.animations||s.animations}for(let s=0;s<n.length;s++)if(n[s].name===e)return n[s];return null}static CreateClipsFromMorphTargetSequences(t,e,n){const s={},r=/^([\w-]*?)([\d]+)$/;for(let o=0,l=t.length;o<l;o++){const c=t[o],h=c.name.match(r);if(h&&h.length>1){const f=h[1];let u=s[f];u||(s[f]=u=[]),u.push(c)}}const a=[];for(const o in s)a.push(this.CreateFromMorphTargetSequence(o,s[o],e,n));return a}resetDuration(){const t=this.tracks;let e=0;for(let n=0,s=t.length;n!==s;++n){const r=this.tracks[n];e=Math.max(e,r.times[r.times.length-1])}return this.duration=e,this}trim(){for(let t=0;t<this.tracks.length;t++)this.tracks[t].trim(0,this.duration);return this}validate(){let t=!0;for(let e=0;e<this.tracks.length;e++)t=t&&this.tracks[e].validate();return t}optimize(){for(let t=0;t<this.tracks.length;t++)this.tracks[t].optimize();return this}clone(){const t=[];for(let n=0;n<this.tracks.length;n++)t.push(this.tracks[n].clone());const e=new this.constructor(this.name,this.duration,t,this.blendMode);return e.userData=JSON.parse(JSON.stringify(this.userData)),e}toJSON(){return this.constructor.toJSON(this)}}function d_(i){switch(i.toLowerCase()){case"scalar":case"double":case"float":case"number":case"integer":return uc;case"vector":case"vector2":case"vector3":case"vector4":return Fu;case"color":return Lu;case"quaternion":return fc;case"bool":case"boolean":return ms;case"string":return gs}throw new Error("THREE.KeyframeTrack: Unsupported typeName: "+i)}function p_(i){if(i.type===void 0)throw new Error("THREE.KeyframeTrack: track type undefined, can not parse");const t=d_(i.type);if(i.times===void 0){const n=[],s=[];$A(i.keys,n,s,"value"),i.times=n,i.values=s}let e;return t.parse!==void 0?e=t.parse(i):e=new t(i.name,i.times,i.values,i.interpolation),Zr(i.settings)&&(e.settings={inTangents:Pn(i.settings.inTangents,Float32Array),outTangents:Pn(i.settings.outTangents,Float32Array)}),e}const Jn={enabled:!1,files:{},add:function(i,t){this.enabled!==!1&&(td(i)||(this.files[i]=t))},get:function(i){if(this.enabled!==!1&&!td(i))return this.files[i]},remove:function(i){delete this.files[i]},clear:function(){this.files={}}};function td(i){try{const t=i.slice(i.indexOf(":")+1);return new URL(t).protocol==="blob:"}catch{return!1}}class Uu{constructor(t,e,n){const s=this;let r=!1,a=0,o=0,l;const c=[];this.onStart=void 0,this.onLoad=t,this.onProgress=e,this.onError=n,this._abortController=null,this.itemStart=function(h){o++,r===!1&&s.onStart!==void 0&&s.onStart(h,a,o),r=!0},this.itemEnd=function(h){a++,s.onProgress!==void 0&&s.onProgress(h,a,o),a===o&&(r=!1,s.onLoad!==void 0&&s.onLoad())},this.itemError=function(h){s.onError!==void 0&&s.onError(h)},this.resolveURL=function(h){return h=h.normalize("NFC"),l?l(h):h},this.setURLModifier=function(h){return l=h,this},this.addHandler=function(h,f){return c.push(h,f),this},this.removeHandler=function(h){const f=c.indexOf(h);return f!==-1&&c.splice(f,2),this},this.getHandler=function(h){for(let f=0,u=c.length;f<u;f+=2){const d=c[f],p=c[f+1];if(d.global&&(d.lastIndex=0),d.test(h))return p}return null},this.abort=function(){return this.abortController.abort(),this._abortController=null,this}}get abortController(){return this._abortController||(this._abortController=new AbortController),this._abortController}}const sm=new Uu;class An{constructor(t){this.manager=t!==void 0?t:sm,this.crossOrigin="anonymous",this.withCredentials=!1,this.path="",this.resourcePath="",this.requestHeader={},typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}load(){}loadAsync(t,e){const n=this;return new Promise(function(s,r){n.load(t,s,e,r)})}parse(){}setCrossOrigin(t){return this.crossOrigin=t,this}setWithCredentials(t){return this.withCredentials=t,this}setPath(t){return this.path=t,this}setResourcePath(t){return this.resourcePath=t,this}setRequestHeader(t){return this.requestHeader=t,this}abort(){return this}}An.DEFAULT_MATERIAL_NAME="__DEFAULT";const li={};class A_ extends Error{constructor(t,e){super(t),this.response=e}}class gi extends An{constructor(t){super(t),this.mimeType="",this.responseType="",this._abortController=new AbortController}load(t,e,n,s){t===void 0&&(t=""),this.path!==void 0&&(t=this.path+t),t=this.manager.resolveURL(t);const r=Jn.get(`file:${t}`);if(r!==void 0){this.manager.itemStart(t),setTimeout(()=>{e&&e(r),this.manager.itemEnd(t)},0);return}if(li[t]!==void 0){li[t].push({onLoad:e,onProgress:n,onError:s});return}li[t]=[],li[t].push({onLoad:e,onProgress:n,onError:s});const a=new Request(t,{headers:new Headers(this.requestHeader),credentials:this.withCredentials?"include":"same-origin",signal:typeof AbortSignal.any=="function"?AbortSignal.any([this._abortController.signal,this.manager.abortController.signal]):this._abortController.signal}),o=this.mimeType,l=this.responseType;fetch(a).then(c=>{if(c.status===200||c.status===0){if(c.status===0&&_t("FileLoader: HTTP Status 0 received."),typeof ReadableStream>"u"||c.body===void 0||c.body.getReader===void 0)return c;const h=li[t],f=c.body.getReader(),u=c.headers.get("X-File-Size")||c.headers.get("Content-Length"),d=u?parseInt(u):0,p=d!==0;let g=0;const m=new ReadableStream({start(A){v();function v(){f.read().then(({done:M,value:x})=>{if(M)A.close();else{g+=x.byteLength;const S=new ProgressEvent("progress",{lengthComputable:p,loaded:g,total:d});for(let E=0,C=h.length;E<C;E++){const _=h[E];_.onProgress&&_.onProgress(S)}A.enqueue(x),v()}},M=>{A.error(M)})}}});return new Response(m)}else throw new A_(`fetch for "${c.url}" responded with ${c.status}: ${c.statusText}`,c)}).then(c=>{switch(l){case"arraybuffer":return c.arrayBuffer();case"blob":return c.blob();case"document":return c.text().then(h=>new DOMParser().parseFromString(h,o));case"json":return c.json();default:if(o==="")return c.text();{const f=/charset="?([^;"\s]*)"?/i.exec(o),u=f&&f[1]?f[1].toLowerCase():void 0,d=new TextDecoder(u);return c.arrayBuffer().then(p=>d.decode(p))}}}).then(c=>{Jn.add(`file:${t}`,c);const h=li[t];delete li[t];for(let f=0,u=h.length;f<u;f++){const d=h[f];d.onLoad&&d.onLoad(c)}}).catch(c=>{const h=li[t];if(h===void 0)throw this.manager.itemError(t),c;delete li[t];for(let f=0,u=h.length;f<u;f++){const d=h[f];d.onError&&d.onError(c)}this.manager.itemError(t)}).finally(()=>{this.manager.itemEnd(t)}),this.manager.itemStart(t)}setResponseType(t){return this.responseType=t,this}setMimeType(t){return this.mimeType=t,this}abort(){return this._abortController.abort(),this._abortController=new AbortController,this}}class m_ extends An{constructor(t){super(t)}load(t,e,n,s){const r=this,a=new gi(this.manager);a.setPath(this.path),a.setRequestHeader(this.requestHeader),a.setWithCredentials(this.withCredentials),a.load(t,function(o){try{e(r.parse(JSON.parse(o)))}catch(l){s?s(l):Ht(l),r.manager.itemError(t)}},n,s)}parse(t){const e=[];for(let n=0;n<t.length;n++){const s=da.parse(t[n]);e.push(s)}return e}}class g_ extends An{constructor(t){super(t)}load(t,e,n,s){const r=this,a=[],o=new Zl,l=new gi(this.manager);l.setPath(this.path),l.setResponseType("arraybuffer"),l.setRequestHeader(this.requestHeader),l.setWithCredentials(r.withCredentials);let c=0;function h(f){l.load(t[f],function(u){const d=r.parse(u,!0);a[f]={width:d.width,height:d.height,format:d.format,mipmaps:d.mipmaps},c+=1,c===6&&(d.mipmapCount===1&&(o.minFilter=xe),o.image=a,o.format=d.format,o.needsUpdate=!0,e&&e(o))},n,s)}if(Array.isArray(t))for(let f=0,u=t.length;f<u;++f)h(f);else l.load(t,function(f){const u=r.parse(f,!0);if(u.isCubemap){const d=u.mipmaps.length/u.mipmapCount;for(let p=0;p<d;p++){a[p]={mipmaps:[]};for(let g=0;g<u.mipmapCount;g++)a[p].mipmaps.push(u.mipmaps[p*u.mipmapCount+g]),a[p].format=u.format,a[p].width=u.width,a[p].height=u.height}o.image=a}else o.image.width=u.width,o.image.height=u.height,o.mipmaps=u.mipmaps;u.mipmapCount===1&&(o.minFilter=xe),o.format=u.format,o.needsUpdate=!0,e&&e(o)},n,s);return o}}const Os=new WeakMap;class pa extends An{constructor(t){super(t)}load(t,e,n,s){this.path!==void 0&&(t=this.path+t),t=this.manager.resolveURL(t);const r=this,a=Jn.get(`image:${t}`);if(a!==void 0){if(a.complete===!0)r.manager.itemStart(t),setTimeout(function(){e&&e(a),r.manager.itemEnd(t)},0);else{let f=Os.get(a);f===void 0&&(f=[],Os.set(a,f)),f.push({onLoad:e,onError:s})}return a}const o=oa("img");function l(){h(),e&&e(this);const f=Os.get(this)||[];for(let u=0;u<f.length;u++){const d=f[u];d.onLoad&&d.onLoad(this)}Os.delete(this),r.manager.itemEnd(t)}function c(f){h(),s&&s(f),Jn.remove(`image:${t}`);const u=Os.get(this)||[];for(let d=0;d<u.length;d++){const p=u[d];p.onError&&p.onError(f)}Os.delete(this),r.manager.itemError(t),r.manager.itemEnd(t)}function h(){o.removeEventListener("load",l,!1),o.removeEventListener("error",c,!1)}return o.addEventListener("load",l,!1),o.addEventListener("error",c,!1),t.slice(0,5)!=="data:"&&this.crossOrigin!==void 0&&(o.crossOrigin=this.crossOrigin),Jn.add(`image:${t}`,o),r.manager.itemStart(t),o.src=t,o}}class x_ extends An{constructor(t){super(t)}load(t,e,n,s){const r=new ya;r.colorSpace=un;const a=new pa(this.manager);a.setCrossOrigin(this.crossOrigin),a.setPath(this.path);let o=0;function l(c){a.load(t[c],function(h){r.images[c]=h,o++,o===6&&(r.needsUpdate=!0,e&&e(r))},void 0,s)}for(let c=0;c<t.length;++c)l(c);return r}}class __ extends An{constructor(t){super(t)}load(t,e,n,s){const r=this,a=new Mn,o=new gi(this.manager);return o.setResponseType("arraybuffer"),o.setRequestHeader(this.requestHeader),o.setPath(this.path),o.setWithCredentials(r.withCredentials),o.load(t,function(l){let c;try{c=r.parse(l)}catch(h){s!==void 0?s(h):Ht(h);return}r._applyTexData(a,c),e&&e(a,c)},n,s),a}createDataTexture(t){const e=new Mn;return this._applyTexData(e,this.parse(t)),e}_applyTexData(t,e){e.image!==void 0?t.image=e.image:e.data!==void 0&&(t.image.width=e.width,t.image.height=e.height,t.image.data=e.data),t.wrapS=e.wrapS!==void 0?e.wrapS:Ke,t.wrapT=e.wrapT!==void 0?e.wrapT:Ke,t.magFilter=e.magFilter!==void 0?e.magFilter:xe,t.minFilter=e.minFilter!==void 0?e.minFilter:xe,t.anisotropy=e.anisotropy!==void 0?e.anisotropy:1,e.colorSpace!==void 0&&(t.colorSpace=e.colorSpace),e.flipY!==void 0&&(t.flipY=e.flipY),e.format!==void 0&&(t.format=e.format),e.type!==void 0&&(t.type=e.type),e.mipmaps!==void 0&&(t.mipmaps=e.mipmaps,t.minFilter=Kn),e.mipmapCount===1&&(t.minFilter=xe),e.generateMipmaps!==void 0&&(t.generateMipmaps=e.generateMipmaps),t.needsUpdate=!0}}class v_ extends An{constructor(t){super(t)}load(t,e,n,s){const r=new Me,a=new pa(this.manager);return a.setCrossOrigin(this.crossOrigin),a.setPath(this.path),a.load(t,function(o){r.image=o,r.needsUpdate=!0,e!==void 0&&e(r)},n,s),r}}class ki extends he{constructor(t,e=1){super(),this.isLight=!0,this.type="Light",this.color=new bt(t),this.intensity=e}copy(t,e){return super.copy(t,e),this.color.copy(t.color),this.intensity=t.intensity,this}toJSON(t){const e=super.toJSON(t);return e.object.color=this.color.getHex(),e.object.intensity=this.intensity,e}}class rm extends ki{constructor(t,e,n){super(t,n),this.isHemisphereLight=!0,this.type="HemisphereLight",this.position.copy(he.DEFAULT_UP),this.updateMatrix(),this.groundColor=new bt(e)}copy(t,e){return super.copy(t,e),this.groundColor.copy(t.groundColor),this}toJSON(t){const e=super.toJSON(t);return e.object.groundColor=this.groundColor.getHex(),e}}const Jc=new Kt,ed=new I,nd=new I;class dc{constructor(t){this.camera=t,this.intensity=1,this.bias=0,this.biasNode=null,this.normalBias=0,this.radius=1,this.blurSamples=8,this.mapSize=new lt(512,512),this.mapType=en,this.map=null,this.mapPass=null,this.matrix=new Kt,this.autoUpdate=!0,this.needsUpdate=!1,this._frustum=new ds,this._frameExtents=new lt(1,1),this._viewportCount=1,this._viewports=[new Ae(0,0,1,1)]}getViewportCount(){return this._viewportCount}getCamera(){return this.camera}getFrustum(){return this._frustum}updateMatrices(t){const e=this.camera;ed.setFromMatrixPosition(t.matrixWorld),e.position.copy(ed),nd.setFromMatrixPosition(t.target.matrixWorld),e.lookAt(nd),e.updateMatrixWorld(),this._updateMatrix(e,this.matrix,this._frustum)}_updateMatrix(t,e,n,s){Jc.multiplyMatrices(t.projectionMatrix,t.matrixWorldInverse),n.setFromProjectionMatrix(Jc,t.coordinateSystem,t.reversedDepth);const r=this._frameExtents,a=s?s.z/r.x:1,o=s?s.w/r.y:1,l=s?s.x/r.x:0,c=s?s.y/r.y:0;t.coordinateSystem===us||t.reversedDepth?e.set(.5*a,0,0,.5*a+l,0,.5*o,0,.5*o+c,0,0,1,0,0,0,0,1):e.set(.5*a,0,0,.5*a+l,0,.5*o,0,.5*o+c,0,0,.5,.5,0,0,0,1),e.multiply(Jc)}getViewport(t){return this._viewports[t]}getFrameExtents(){return this._frameExtents}dispose(){this.map&&this.map.dispose(),this.mapPass&&this.mapPass.dispose()}copy(t){return this.camera=t.camera.clone(),this.intensity=t.intensity,this.bias=t.bias,this.radius=t.radius,this.autoUpdate=t.autoUpdate,this.needsUpdate=t.needsUpdate,this.normalBias=t.normalBias,this.blurSamples=t.blurSamples,this.mapSize.copy(t.mapSize),this.biasNode=t.biasNode,this}clone(){return new this.constructor().copy(this)}toJSON(){const t={};return t.intensity=this.intensity,t.bias=this.bias,t.normalBias=this.normalBias,t.radius=this.radius,t.blurSamples=this.blurSamples,t.mapSize=this.mapSize.toArray(),t.camera=this.camera.toJSON(!1).object,delete t.camera.matrix,t}}const Ao=new I,mo=new on,Wn=new I;class pc extends he{constructor(){super(),this.isCamera=!0,this.type="Camera",this.matrixWorldInverse=new Kt,this.projectionMatrix=new Kt,this.projectionMatrixInverse=new Kt,this.coordinateSystem=vn,this._reversedDepth=!1}get reversedDepth(){return this._reversedDepth}copy(t,e){return super.copy(t,e),this.matrixWorldInverse.copy(t.matrixWorldInverse),this.projectionMatrix.copy(t.projectionMatrix),this.projectionMatrixInverse.copy(t.projectionMatrixInverse),this.coordinateSystem=t.coordinateSystem,this}getWorldDirection(t){return super.getWorldDirection(t).negate()}updateMatrixWorld(t){super.updateMatrixWorld(t),this.matrixWorld.decompose(Ao,mo,Wn),Wn.x===1&&Wn.y===1&&Wn.z===1?this.matrixWorldInverse.copy(this.matrixWorld).invert():this.matrixWorldInverse.compose(Ao,mo,Wn.set(1,1,1)).invert()}updateWorldMatrix(t,e,n=!1){super.updateWorldMatrix(t,e,n),this.matrixWorld.decompose(Ao,mo,Wn),Wn.x===1&&Wn.y===1&&Wn.z===1?this.matrixWorldInverse.copy(this.matrixWorld).invert():this.matrixWorldInverse.compose(Ao,mo,Wn.set(1,1,1)).invert()}clone(){return new this.constructor().copy(this)}}const bi=new I,id=new lt,sd=new lt;class Ue extends pc{constructor(t=50,e=1,n=.1,s=2e3){super(),this.isPerspectiveCamera=!0,this.type="PerspectiveCamera",this.fov=t,this.zoom=1,this.near=n,this.far=s,this.focus=10,this.aspect=e,this.view=null,this.filmGauge=35,this.filmOffset=0,this.updateProjectionMatrix()}copy(t,e){return super.copy(t,e),this.fov=t.fov,this.zoom=t.zoom,this.near=t.near,this.far=t.far,this.focus=t.focus,this.aspect=t.aspect,this.view=t.view===null?null:Object.assign({},t.view),this.filmGauge=t.filmGauge,this.filmOffset=t.filmOffset,this}setFocalLength(t){const e=.5*this.getFilmHeight()/t;this.fov=lr*2*Math.atan(e),this.updateProjectionMatrix()}getFocalLength(){const t=Math.tan(hs*.5*this.fov);return .5*this.getFilmHeight()/t}getEffectiveFOV(){return lr*2*Math.atan(Math.tan(hs*.5*this.fov)/this.zoom)}getFilmWidth(){return this.filmGauge*Math.min(this.aspect,1)}getFilmHeight(){return this.filmGauge/Math.max(this.aspect,1)}getViewBounds(t,e,n){bi.set(-1,-1,.5).applyMatrix4(this.projectionMatrixInverse),e.set(bi.x,bi.y).multiplyScalar(-t/bi.z),bi.set(1,1,.5).applyMatrix4(this.projectionMatrixInverse),n.set(bi.x,bi.y).multiplyScalar(-t/bi.z)}getViewSize(t,e){return this.getViewBounds(t,id,sd),e.subVectors(sd,id)}setViewOffset(t,e,n,s,r,a){this.aspect=t/e,this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=t,this.view.fullHeight=e,this.view.offsetX=n,this.view.offsetY=s,this.view.width=r,this.view.height=a,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const t=this.near;let e=t*Math.tan(hs*.5*this.fov)/this.zoom,n=2*e,s=this.aspect*n,r=-.5*s;const a=this.view;if(this.view!==null&&this.view.enabled){const l=a.fullWidth,c=a.fullHeight;r+=a.offsetX*s/l,e-=a.offsetY*n/c,s*=a.width/l,n*=a.height/c}const o=this.filmOffset;o!==0&&(r+=t*o/this.getFilmWidth()),this.projectionMatrix.makePerspective(r,r+s,e,e-n,t,this.far,this.coordinateSystem,this.reversedDepth),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(t){const e=super.toJSON(t);return e.object.fov=this.fov,e.object.zoom=this.zoom,e.object.near=this.near,e.object.far=this.far,e.object.focus=this.focus,e.object.aspect=this.aspect,this.view!==null&&(e.object.view=Object.assign({},this.view)),e.object.filmGauge=this.filmGauge,e.object.filmOffset=this.filmOffset,e}}class y_ extends dc{constructor(){super(new Ue(50,1,.5,500)),this.isSpotLightShadow=!0,this.focus=1,this.aspect=1}updateMatrices(t){const e=this.camera,n=lr*2*t.angle*this.focus,s=this.mapSize.width/this.mapSize.height*this.aspect,r=t.distance||e.far;(n!==e.fov||s!==e.aspect||r!==e.far)&&(e.fov=n,e.aspect=s,e.far=r,e.updateProjectionMatrix()),super.updateMatrices(t)}copy(t){return super.copy(t),this.focus=t.focus,this.aspect=t.aspect,this}toJSON(){const t=super.toJSON();return t.focus=this.focus,t.aspect=this.aspect,t}}class am extends ki{constructor(t,e,n=0,s=Math.PI/3,r=0,a=2){super(t,e),this.isSpotLight=!0,this.type="SpotLight",this.position.copy(he.DEFAULT_UP),this.updateMatrix(),this.target=new he,this.distance=n,this.angle=s,this.penumbra=r,this.decay=a,this.map=null,this.shadow=new y_}get power(){return this.intensity*Math.PI}set power(t){this.intensity=t/Math.PI}dispose(){super.dispose(),this.shadow.dispose()}copy(t,e){return super.copy(t,e),this.distance=t.distance,this.angle=t.angle,this.penumbra=t.penumbra,this.decay=t.decay,this.target=t.target.clone(),this.map=t.map,this.shadow=t.shadow.clone(),this}toJSON(t){const e=super.toJSON(t);return e.object.distance=this.distance,e.object.angle=this.angle,e.object.decay=this.decay,e.object.penumbra=this.penumbra,e.object.target=this.target.uuid,this.map&&this.map.isTexture&&(e.object.map=this.map.toJSON(t).uuid),e.object.shadow=this.shadow.toJSON(),e}}class M_ extends dc{constructor(){super(new Ue(90,1,.5,500)),this.isPointLightShadow=!0}}class om extends ki{constructor(t,e,n=0,s=2){super(t,e),this.isPointLight=!0,this.type="PointLight",this.distance=n,this.decay=s,this.shadow=new M_}get power(){return this.intensity*4*Math.PI}set power(t){this.intensity=t/(4*Math.PI)}dispose(){super.dispose(),this.shadow.dispose()}copy(t,e){return super.copy(t,e),this.distance=t.distance,this.decay=t.decay,this.shadow=t.shadow.clone(),this}toJSON(t){const e=super.toJSON(t);return e.object.distance=this.distance,e.object.decay=this.decay,e.object.shadow=this.shadow.toJSON(),e}}class Ca extends pc{constructor(t=-1,e=1,n=1,s=-1,r=.1,a=2e3){super(),this.isOrthographicCamera=!0,this.type="OrthographicCamera",this.zoom=1,this.view=null,this.left=t,this.right=e,this.top=n,this.bottom=s,this.near=r,this.far=a,this.updateProjectionMatrix()}copy(t,e){return super.copy(t,e),this.left=t.left,this.right=t.right,this.top=t.top,this.bottom=t.bottom,this.near=t.near,this.far=t.far,this.zoom=t.zoom,this.view=t.view===null?null:Object.assign({},t.view),this}setViewOffset(t,e,n,s,r,a){this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=t,this.view.fullHeight=e,this.view.offsetX=n,this.view.offsetY=s,this.view.width=r,this.view.height=a,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const t=(this.right-this.left)/(2*this.zoom),e=(this.top-this.bottom)/(2*this.zoom),n=(this.right+this.left)/2,s=(this.top+this.bottom)/2;let r=n-t,a=n+t,o=s+e,l=s-e;if(this.view!==null&&this.view.enabled){const c=(this.right-this.left)/this.view.fullWidth/this.zoom,h=(this.top-this.bottom)/this.view.fullHeight/this.zoom;r+=c*this.view.offsetX,a=r+c*this.view.width,o-=h*this.view.offsetY,l=o-h*this.view.height}this.projectionMatrix.makeOrthographic(r,a,o,l,this.near,this.far,this.coordinateSystem,this.reversedDepth),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(t){const e=super.toJSON(t);return e.object.zoom=this.zoom,e.object.left=this.left,e.object.right=this.right,e.object.top=this.top,e.object.bottom=this.bottom,e.object.near=this.near,e.object.far=this.far,this.view!==null&&(e.object.view=Object.assign({},this.view)),e}}class E_ extends dc{constructor(){super(new Ca(-5,5,5,-5,.5,500)),this.isDirectionalLightShadow=!0}}class lm extends ki{constructor(t,e){super(t,e),this.isDirectionalLight=!0,this.type="DirectionalLight",this.position.copy(he.DEFAULT_UP),this.updateMatrix(),this.target=new he,this.shadow=new E_}dispose(){super.dispose(),this.shadow.dispose()}copy(t){return super.copy(t),this.target=t.target.clone(),this.shadow=t.shadow.clone(),this}toJSON(t){const e=super.toJSON(t);return e.object.shadow=this.shadow.toJSON(),e.object.target=this.target.uuid,e}}class cm extends ki{constructor(t,e){super(t,e),this.isAmbientLight=!0,this.type="AmbientLight"}}class hm extends ki{constructor(t,e,n=10,s=10){super(t,e),this.isRectAreaLight=!0,this.type="RectAreaLight",this.width=n,this.height=s}get power(){return this.intensity*this.width*this.height*Math.PI}set power(t){this.intensity=t/(this.width*this.height*Math.PI)}copy(t){return super.copy(t),this.width=t.width,this.height=t.height,this}toJSON(t){const e=super.toJSON(t);return e.object.width=this.width,e.object.height=this.height,e}}class Nu{constructor(){this.isSphericalHarmonics3=!0,this.coefficients=[];for(let t=0;t<9;t++)this.coefficients.push(new I)}set(t){for(let e=0;e<9;e++)this.coefficients[e].copy(t[e]);return this}zero(){for(let t=0;t<9;t++)this.coefficients[t].set(0,0,0);return this}getAt(t,e){const n=t.x,s=t.y,r=t.z,a=this.coefficients;return e.copy(a[0]).multiplyScalar(.282095),e.addScaledVector(a[1],.488603*s),e.addScaledVector(a[2],.488603*r),e.addScaledVector(a[3],.488603*n),e.addScaledVector(a[4],1.092548*(n*s)),e.addScaledVector(a[5],1.092548*(s*r)),e.addScaledVector(a[6],.315392*(3*r*r-1)),e.addScaledVector(a[7],1.092548*(n*r)),e.addScaledVector(a[8],.546274*(n*n-s*s)),e}getIrradianceAt(t,e){const n=t.x,s=t.y,r=t.z,a=this.coefficients;return e.copy(a[0]).multiplyScalar(.886227),e.addScaledVector(a[1],2*.511664*s),e.addScaledVector(a[2],2*.511664*r),e.addScaledVector(a[3],2*.511664*n),e.addScaledVector(a[4],2*.429043*n*s),e.addScaledVector(a[5],2*.429043*s*r),e.addScaledVector(a[6],.743125*r*r-.247708),e.addScaledVector(a[7],2*.429043*n*r),e.addScaledVector(a[8],.429043*(n*n-s*s)),e}add(t){for(let e=0;e<9;e++)this.coefficients[e].add(t.coefficients[e]);return this}addScaledSH(t,e){for(let n=0;n<9;n++)this.coefficients[n].addScaledVector(t.coefficients[n],e);return this}scale(t){for(let e=0;e<9;e++)this.coefficients[e].multiplyScalar(t);return this}lerp(t,e){for(let n=0;n<9;n++)this.coefficients[n].lerp(t.coefficients[n],e);return this}equals(t){for(let e=0;e<9;e++)if(!this.coefficients[e].equals(t.coefficients[e]))return!1;return!0}copy(t){return this.set(t.coefficients)}clone(){return new this.constructor().copy(this)}fromArray(t,e=0){const n=this.coefficients;for(let s=0;s<9;s++)n[s].fromArray(t,e+s*3);return this}toArray(t=[],e=0){const n=this.coefficients;for(let s=0;s<9;s++)n[s].toArray(t,e+s*3);return t}static getBasisAt(t,e){const n=t.x,s=t.y,r=t.z;e[0]=.282095,e[1]=.488603*s,e[2]=.488603*r,e[3]=.488603*n,e[4]=1.092548*n*s,e[5]=1.092548*s*r,e[6]=.315392*(3*r*r-1),e[7]=1.092548*n*r,e[8]=.546274*(n*n-s*s)}}class um extends ki{constructor(t=new Nu,e=1){super(void 0,e),this.isLightProbe=!0,this.sh=t}copy(t){return super.copy(t),this.sh.copy(t.sh),this}toJSON(t){const e=super.toJSON(t);return e.object.sh=this.sh.toArray(),e}}const rd={};class Ac extends An{constructor(t){super(t),this.textures={}}load(t,e,n,s){const r=this,a=new gi(r.manager);a.setPath(r.path),a.setRequestHeader(r.requestHeader),a.setWithCredentials(r.withCredentials),a.load(t,function(o){try{e(r.parse(JSON.parse(o)))}catch(l){s?s(l):Ht(l),r.manager.itemError(t)}},n,s)}parse(t){const e=this.createMaterialFromType(t.type);return e.fromJSON(t,this.textures),e}setTextures(t){return this.textures=t,this}createMaterialFromType(t){return Ac.createMaterialFromType(t)}static createMaterialFromType(t){const n={ShadowMaterial:QA,SpriteMaterial:_u,RawShaderMaterial:Bu,ShaderMaterial:Sn,PointsMaterial:yu,MeshPhysicalMaterial:VA,MeshStandardMaterial:Iu,MeshPhongMaterial:WA,MeshToonMaterial:YA,MeshNormalMaterial:XA,MeshLambertMaterial:qA,MeshDepthMaterial:Ru,MeshDistanceMaterial:Du,MeshBasicMaterial:Oi,MeshMatcapMaterial:KA,LineDashedMaterial:JA,LineBasicMaterial:ln,Material:ke,...rd}[t];let s;return n===void 0?(di(`MaterialLoader: Unknown material type "${t}". Use .registerMaterial() before starting the deserialization process.`),s=new ke):s=new n,s}static registerMaterial(t,e){rd[t]=e}}class Ph{static extractUrlBase(t){const e=t.lastIndexOf("/");return e===-1?"./":t.slice(0,e+1)}static resolveURL(t,e){return typeof t!="string"||t===""?"":(/^https?:\/\//i.test(e)&&/^\//.test(t)&&(e=e.replace(/(^https?:\/\/[^\/]+).*/i,"$1")),/^(https?:)?\/\//i.test(t)||/^data:.*,.*$/i.test(t)||/^blob:.*$/i.test(t)?t:e+t)}}class fm extends $t{constructor(){super(),this.isInstancedBufferGeometry=!0,this.type="InstancedBufferGeometry",this.instanceCount=1/0}copy(t){return super.copy(t),this.instanceCount=t.instanceCount,this}toJSON(){const t=super.toJSON();return t.instanceCount=this.instanceCount,t.isInstancedBufferGeometry=!0,t}}class dm extends An{constructor(t){super(t)}load(t,e,n,s){const r=this,a=new gi(r.manager);a.setPath(r.path),a.setRequestHeader(r.requestHeader),a.setWithCredentials(r.withCredentials),a.load(t,function(o){try{e(r.parse(JSON.parse(o)))}catch(l){s?s(l):Ht(l),r.manager.itemError(t)}},n,s)}parse(t){const e={},n={};function s(d,p){if(e[p]!==void 0)return e[p];const m=d.interleavedBuffers[p],A=r(d,m.buffer),v=Ks(m.type,A),M=new ql(v,m.stride);return M.uuid=m.uuid,m.usage!==void 0&&M.setUsage(m.usage),e[p]=M,M}function r(d,p){if(n[p]!==void 0)return n[p];const m=d.arrayBuffers[p],A=new Uint32Array(m).buffer;return n[p]=A,A}const a=t.isInstancedBufferGeometry?new fm:new $t,o=t.data.index;if(o!==void 0){const d=Ks(o.type,o.array);a.setIndex(new fe(d,1))}const l=t.data.attributes;for(const d in l){const p=l[d];let g;if(p.isInterleavedBufferAttribute){const m=s(t.data,p.data);g=new fs(m,p.itemSize,p.offset,p.normalized)}else{const m=Ks(p.type,p.array),A=p.isInstancedBufferAttribute?cr:fe;g=new A(m,p.itemSize,p.normalized)}p.name!==void 0&&(g.name=p.name),p.usage!==void 0&&g.setUsage(p.usage),p.gpuType!==void 0&&(g.gpuType=p.gpuType),a.setAttribute(d,g)}const c=t.data.morphAttributes;if(c)for(const d in c){const p=c[d],g=[];for(let m=0,A=p.length;m<A;m++){const v=p[m];let M;if(v.isInterleavedBufferAttribute){const x=s(t.data,v.data);M=new fs(x,v.itemSize,v.offset,v.normalized)}else{const x=Ks(v.type,v.array);M=new fe(x,v.itemSize,v.normalized)}v.name!==void 0&&(M.name=v.name),v.usage!==void 0&&M.setUsage(v.usage),v.gpuType!==void 0&&(M.gpuType=v.gpuType),g.push(M)}a.morphAttributes[d]=g}t.data.morphTargetsRelative&&(a.morphTargetsRelative=!0);const f=t.data.groups||t.data.drawcalls||t.data.offsets;if(f!==void 0)for(let d=0,p=f.length;d!==p;++d){const g=f[d];a.addGroup(g.start,g.count,g.materialIndex)}const u=t.data.boundingSphere;return u!==void 0&&(a.boundingSphere=new Oe().fromJSON(u)),t.name&&(a.name=t.name),t.userData&&(a.userData=t.userData),a}}const Zc={};class S_ extends An{constructor(t){super(t)}load(t,e,n,s){const r=this,a=this.path===""?Ph.extractUrlBase(t):this.path;this.resourcePath=this.resourcePath||a;const o=new gi(this.manager);o.setPath(this.path),o.setRequestHeader(this.requestHeader),o.setWithCredentials(this.withCredentials),o.load(t,function(l){let c=null;try{c=JSON.parse(l)}catch(f){s!==void 0&&s(f),Ht("ObjectLoader: Can't parse "+t+".",f.message);return}const h=c.metadata;if(h===void 0||h.type===void 0||h.type.toLowerCase()==="geometry"){s!==void 0&&s(new Error("THREE.ObjectLoader: Can't load "+t)),Ht("ObjectLoader: Can't load "+t);return}r.parse(c,e)},n,s)}async loadAsync(t,e){const n=this,s=this.path===""?Ph.extractUrlBase(t):this.path;this.resourcePath=this.resourcePath||s;const r=new gi(this.manager);r.setPath(this.path),r.setRequestHeader(this.requestHeader),r.setWithCredentials(this.withCredentials);const a=await r.loadAsync(t,e);let o;try{o=JSON.parse(a)}catch(c){throw new Error("THREE.ObjectLoader: Can't parse "+t+". "+c.message)}const l=o.metadata;if(l===void 0||l.type===void 0||l.type.toLowerCase()==="geometry")throw new Error("THREE.ObjectLoader: Can't load "+t);return await n.parseAsync(o)}parse(t,e){const n=this.parseAnimations(t.animations),s=this.parseShapes(t.shapes),r=this.parseGeometries(t.geometries,s),a=this.parseImages(t.images,function(){e!==void 0&&e(c)}),o=this.parseTextures(t.textures,a),l=this.parseMaterials(t.materials,o),c=this.parseObject(t.object,r,l,o,n),h=this.parseSkeletons(t.skeletons,c);if(this.bindSkeletons(c,h),this.bindLightTargets(c),e!==void 0){let f=!1;for(const u in a)if(a[u].data instanceof HTMLImageElement){f=!0;break}f===!1&&e(c)}return c}async parseAsync(t){const e=this.parseAnimations(t.animations),n=this.parseShapes(t.shapes),s=this.parseGeometries(t.geometries,n),r=await this.parseImagesAsync(t.images),a=this.parseTextures(t.textures,r),o=this.parseMaterials(t.materials,a),l=this.parseObject(t.object,s,o,a,e),c=this.parseSkeletons(t.skeletons,l);return this.bindSkeletons(l,c),this.bindLightTargets(l),l}static registerGeometry(t,e){Zc[t]=e}parseShapes(t){const e={};if(t!==void 0)for(let n=0,s=t.length;n<s;n++){const r=new Sa().fromJSON(t[n]);e[r.uuid]=r}return e}parseSkeletons(t,e){const n={},s={};if(e.traverse(function(r){r.isBone&&(s[r.uuid]=r)}),t!==void 0)for(let r=0,a=t.length;r<a;r++){const o=new Kl().fromJSON(t[r],s);n[o.uuid]=o}return n}parseGeometries(t,e){const n={};if(t!==void 0){const s=new dm;for(let r=0,a=t.length;r<a;r++){let o;const l=t[r];switch(l.type){case"BufferGeometry":case"InstancedBufferGeometry":o=s.parse(l);break;default:l.type in Zf?o=Zf[l.type].fromJSON(l,e):l.type in Zc?o=Zc[l.type].fromJSON(l,e):_t(`ObjectLoader: Unknown geometry type "${l.type}". Use .registerGeometry() before starting the deserialization process.`)}o.uuid=l.uuid,l.name!==void 0&&(o.name=l.name),l.userData!==void 0&&(o.userData=l.userData),n[l.uuid]=o}}return n}parseMaterials(t,e){const n={},s={};if(t!==void 0){const r=new Ac;r.setTextures(e);for(let a=0,o=t.length;a<o;a++){const l=t[a];n[l.uuid]===void 0&&(n[l.uuid]=r.parse(l)),s[l.uuid]=n[l.uuid]}}return s}parseAnimations(t){const e={};if(t!==void 0)for(let n=0;n<t.length;n++){const s=t[n],r=da.parse(s);e[r.uuid]=r}return e}parseImages(t,e){const n=this,s={};let r;function a(l){return l=n.manager.resolveURL(l),n.manager.itemStart(l),r.load(l,function(){n.manager.itemEnd(l)},void 0,function(){n.manager.itemError(l),n.manager.itemEnd(l)})}function o(l){if(typeof l=="string"){const c=l,h=/^(\/\/)|([a-z]+:(\/\/)?)/i.test(c)?c:n.resourcePath+c;return a(h)}else return l.data?{data:Ks(l.type,l.data),width:l.width,height:l.height}:null}if(t!==void 0&&t.length>0){const l=new Uu(e);r=new pa(l),r.setCrossOrigin(this.crossOrigin);for(let c=0,h=t.length;c<h;c++){const f=t[c],u=f.url;if(Array.isArray(u)){const d=[];for(let p=0,g=u.length;p<g;p++){const m=u[p],A=o(m);A!==null&&(A instanceof HTMLImageElement?d.push(A):d.push(new Mn(A.data,A.width,A.height)))}s[f.uuid]=new ui(d)}else{const d=o(f.url);s[f.uuid]=new ui(d)}}}return s}async parseImagesAsync(t){const e=this,n={};let s;async function r(a){if(typeof a=="string"){const o=a,l=/^(\/\/)|([a-z]+:(\/\/)?)/i.test(o)?o:e.resourcePath+o;return await s.loadAsync(l)}else return a.data?{data:Ks(a.type,a.data),width:a.width,height:a.height}:null}if(t!==void 0&&t.length>0){s=new pa(this.manager),s.setCrossOrigin(this.crossOrigin);for(let a=0,o=t.length;a<o;a++){const l=t[a],c=l.url;if(Array.isArray(c)){const h=[];for(let f=0,u=c.length;f<u;f++){const d=c[f],p=await r(d);p!==null&&(p instanceof HTMLImageElement?h.push(p):h.push(new Mn(p.data,p.width,p.height)))}n[l.uuid]=new ui(h)}else{const h=await r(l.url);n[l.uuid]=new ui(h)}}}return n}parseTextures(t,e){function n(r,a){return typeof r=="number"?r:(_t("ObjectLoader.parseTexture: Constant should be in numeric form.",r),a[r])}const s={};if(t!==void 0)for(let r=0,a=t.length;r<a;r++){const o=t[r];o.image===void 0&&_t('ObjectLoader: No "image" specified for',o.uuid),e[o.image]===void 0&&_t("ObjectLoader: Undefined image",o.image);const l=e[o.image],c=l.data;let h;Array.isArray(c)?(h=new ya,c.length===6&&(h.needsUpdate=!0)):(c&&c.data?h=new Mn:h=new Me,c&&(h.needsUpdate=!0)),h.source=l,h.uuid=o.uuid,o.name!==void 0&&(h.name=o.name),o.mapping!==void 0&&(h.mapping=n(o.mapping,w_)),o.channel!==void 0&&(h.channel=o.channel),o.offset!==void 0&&h.offset.fromArray(o.offset),o.repeat!==void 0&&h.repeat.fromArray(o.repeat),o.center!==void 0&&h.center.fromArray(o.center),o.rotation!==void 0&&(h.rotation=o.rotation),o.wrap!==void 0&&(h.wrapS=n(o.wrap[0],ad),h.wrapT=n(o.wrap[1],ad)),o.format!==void 0&&(h.format=o.format),o.internalFormat!==void 0&&(h.internalFormat=o.internalFormat),o.type!==void 0&&(h.type=o.type),o.colorSpace!==void 0&&(h.colorSpace=o.colorSpace),o.minFilter!==void 0&&(h.minFilter=n(o.minFilter,od)),o.magFilter!==void 0&&(h.magFilter=n(o.magFilter,od)),o.anisotropy!==void 0&&(h.anisotropy=o.anisotropy),o.flipY!==void 0&&(h.flipY=o.flipY),o.generateMipmaps!==void 0&&(h.generateMipmaps=o.generateMipmaps),o.premultiplyAlpha!==void 0&&(h.premultiplyAlpha=o.premultiplyAlpha),o.unpackAlignment!==void 0&&(h.unpackAlignment=o.unpackAlignment),o.compareFunction!==void 0&&(h.compareFunction=o.compareFunction),o.normalized!==void 0&&(h.normalized=o.normalized),o.userData!==void 0&&(h.userData=o.userData),s[o.uuid]=h}return s}parseObject(t,e,n,s,r){let a;function o(u){return e[u]===void 0&&_t("ObjectLoader: Undefined geometry",u),e[u]}function l(u){if(u!==void 0){if(Array.isArray(u)){const d=[];for(let p=0,g=u.length;p<g;p++){const m=u[p];n[m]===void 0&&_t("ObjectLoader: Undefined material",m),d.push(n[m])}return d}return n[u]===void 0&&_t("ObjectLoader: Undefined material",u),n[u]}}function c(u){return s[u]===void 0&&_t("ObjectLoader: Undefined texture",u),s[u]}let h,f;switch(t.type){case"Scene":a=new _A,t.background!==void 0&&(Number.isInteger(t.background)?a.background=new bt(t.background):a.background=c(t.background)),t.environment!==void 0&&(a.environment=c(t.environment)),t.fog!==void 0&&(t.fog.type==="Fog"?a.fog=new Xl(t.fog.color,t.fog.near,t.fog.far):t.fog.type==="FogExp2"&&(a.fog=new Yl(t.fog.color,t.fog.density)),t.fog.name!==""&&(a.fog.name=t.fog.name)),t.backgroundBlurriness!==void 0&&(a.backgroundBlurriness=t.backgroundBlurriness),t.backgroundIntensity!==void 0&&(a.backgroundIntensity=t.backgroundIntensity),t.backgroundRotation!==void 0&&a.backgroundRotation.fromArray(t.backgroundRotation),t.environmentIntensity!==void 0&&(a.environmentIntensity=t.environmentIntensity),t.environmentRotation!==void 0&&a.environmentRotation.fromArray(t.environmentRotation);break;case"PerspectiveCamera":a=new Ue(t.fov,t.aspect,t.near,t.far),t.focus!==void 0&&(a.focus=t.focus),t.zoom!==void 0&&(a.zoom=t.zoom),t.filmGauge!==void 0&&(a.filmGauge=t.filmGauge),t.filmOffset!==void 0&&(a.filmOffset=t.filmOffset),t.view!==void 0&&(a.view=Object.assign({},t.view));break;case"OrthographicCamera":a=new Ca(t.left,t.right,t.top,t.bottom,t.near,t.far),t.zoom!==void 0&&(a.zoom=t.zoom),t.view!==void 0&&(a.view=Object.assign({},t.view));break;case"AmbientLight":a=new cm(t.color,t.intensity);break;case"DirectionalLight":a=new lm(t.color,t.intensity),a.target=t.target||"";break;case"PointLight":a=new om(t.color,t.intensity,t.distance,t.decay);break;case"RectAreaLight":a=new hm(t.color,t.intensity,t.width,t.height);break;case"SpotLight":a=new am(t.color,t.intensity,t.distance,t.angle,t.penumbra,t.decay),a.target=t.target||"";break;case"HemisphereLight":a=new rm(t.color,t.groundColor,t.intensity);break;case"LightProbe":const u=new Nu().fromArray(t.sh);a=new um(u,t.intensity);break;case"SkinnedMesh":h=o(t.geometry),f=l(t.material),a=new EA(h,f),t.bindMode!==void 0&&(a.bindMode=t.bindMode),t.bindMatrix!==void 0&&a.bindMatrix.fromArray(t.bindMatrix),t.skeleton!==void 0&&(a.skeleton=t.skeleton);break;case"Mesh":h=o(t.geometry),f=l(t.material),a=new Ce(h,f);break;case"InstancedMesh":h=o(t.geometry),f=l(t.material);const d=t.count,p=t.instanceMatrix,g=t.instanceColor;a=new SA(h,f,d),a.instanceMatrix=new cr(new Float32Array(p.array),16),g!==void 0&&(a.instanceColor=new cr(new Float32Array(g.array),g.itemSize));break;case"BatchedMesh":h=o(t.geometry),f=l(t.material),a=new wA(t.maxInstanceCount,t.maxVertexCount,t.maxIndexCount,f),a.geometry=h,a.perObjectFrustumCulled=t.perObjectFrustumCulled,a.sortObjects=t.sortObjects,a._drawRanges=t.drawRanges,a._reservedRanges=t.reservedRanges,a._geometryInfo=t.geometryInfo.map(m=>{let A=null,v=null;return m.boundingBox!==void 0&&(A=new Ze().fromJSON(m.boundingBox)),m.boundingSphere!==void 0&&(v=new Oe().fromJSON(m.boundingSphere)),{...m,boundingBox:A,boundingSphere:v}}),a._instanceInfo=t.instanceInfo,a._availableInstanceIds=t._availableInstanceIds,a._availableGeometryIds=t._availableGeometryIds,a._nextIndexStart=t.nextIndexStart,a._nextVertexStart=t.nextVertexStart,a._geometryCount=t.geometryCount,a._maxInstanceCount=t.maxInstanceCount,a._maxVertexCount=t.maxVertexCount,a._maxIndexCount=t.maxIndexCount,a._geometryInitialized=t.geometryInitialized,a._matricesTexture=c(t.matricesTexture.uuid),a._indirectTexture=c(t.indirectTexture.uuid),t.colorsTexture!==void 0&&(a._colorsTexture=c(t.colorsTexture.uuid)),t.boundingSphere!==void 0&&(a.boundingSphere=new Oe().fromJSON(t.boundingSphere)),t.boundingBox!==void 0&&(a.boundingBox=new Ze().fromJSON(t.boundingBox));break;case"LOD":a=new MA;break;case"Line":a=new Ni(o(t.geometry),l(t.material));break;case"LineLoop":a=new bA(o(t.geometry),l(t.material));break;case"LineSegments":a=new ni(o(t.geometry),l(t.material));break;case"PointCloud":case"Points":a=new CA(o(t.geometry),l(t.material));break;case"Sprite":a=new yA(l(t.material));break;case"Group":a=new Js;break;case"Bone":a=new vu;break;default:a=new he}if(a.uuid=t.uuid,t.name!==void 0&&(a.name=t.name),t.matrix!==void 0?(a.matrix.fromArray(t.matrix),t.matrixAutoUpdate!==void 0&&(a.matrixAutoUpdate=t.matrixAutoUpdate),a.matrixAutoUpdate&&a.matrix.decompose(a.position,a.quaternion,a.scale)):(t.position!==void 0&&a.position.fromArray(t.position),t.rotation!==void 0&&a.rotation.fromArray(t.rotation),t.quaternion!==void 0&&a.quaternion.fromArray(t.quaternion),t.scale!==void 0&&a.scale.fromArray(t.scale)),t.up!==void 0&&a.up.fromArray(t.up),t.pivot!==void 0&&(a.pivot=new I().fromArray(t.pivot)),t.morphTargetDictionary!==void 0&&(a.morphTargetDictionary=Object.assign({},t.morphTargetDictionary)),t.morphTargetInfluences!==void 0&&(a.morphTargetInfluences=t.morphTargetInfluences.slice()),t.castShadow!==void 0&&(a.castShadow=t.castShadow),t.receiveShadow!==void 0&&(a.receiveShadow=t.receiveShadow),t.shadow&&(t.shadow.intensity!==void 0&&(a.shadow.intensity=t.shadow.intensity),t.shadow.bias!==void 0&&(a.shadow.bias=t.shadow.bias),t.shadow.normalBias!==void 0&&(a.shadow.normalBias=t.shadow.normalBias),t.shadow.radius!==void 0&&(a.shadow.radius=t.shadow.radius),t.shadow.blurSamples!==void 0&&(a.shadow.blurSamples=t.shadow.blurSamples),t.shadow.focus!==void 0&&(a.shadow.focus=t.shadow.focus),t.shadow.aspect!==void 0&&(a.shadow.aspect=t.shadow.aspect),t.shadow.mapSize!==void 0&&a.shadow.mapSize.fromArray(t.shadow.mapSize),t.shadow.camera!==void 0&&(a.shadow.camera=this.parseObject(t.shadow.camera))),t.visible!==void 0&&(a.visible=t.visible),t.frustumCulled!==void 0&&(a.frustumCulled=t.frustumCulled),t.renderOrder!==void 0&&(a.renderOrder=t.renderOrder),t.static!==void 0&&(a.static=t.static),t.userData!==void 0&&(a.userData=t.userData),t.layers!==void 0&&(a.layers.mask=t.layers),t.children!==void 0){const u=t.children;for(let d=0;d<u.length;d++)a.add(this.parseObject(u[d],e,n,s,r))}if(t.animations!==void 0){const u=t.animations;for(let d=0;d<u.length;d++){const p=u[d];a.animations.push(r[p])}}if(t.type==="LOD"){t.autoUpdate!==void 0&&(a.autoUpdate=t.autoUpdate);const u=t.levels;for(let d=0;d<u.length;d++){const p=u[d],g=a.getObjectByProperty("uuid",p.object);g!==void 0&&a.addLevel(g,p.distance,p.hysteresis)}}return a}bindSkeletons(t,e){Object.keys(e).length!==0&&t.traverse(function(n){if(n.isSkinnedMesh===!0&&n.skeleton!==void 0){const s=e[n.skeleton];s===void 0?_t("ObjectLoader: No skeleton found with UUID:",n.skeleton):n.bind(s,n.bindMatrix)}})}bindLightTargets(t){t.traverse(function(e){if(e.isDirectionalLight||e.isSpotLight){const n=e.target,s=t.getObjectByProperty("uuid",n);s!==void 0?e.target=s:e.target=new he}})}}const w_={UVMapping:Dl,CubeReflectionMapping:ti,CubeRefractionMapping:Li,EquirectangularReflectionMapping:Qr,EquirectangularRefractionMapping:zr,CubeUVReflectionMapping:pr},ad={RepeatWrapping:jr,ClampToEdgeWrapping:Ke,MirroredRepeatWrapping:ta},od={NearestFilter:be,NearestMipmapNearestFilter:ou,NearestMipmapLinearFilter:qs,LinearFilter:xe,LinearMipmapNearestFilter:Hr,LinearMipmapLinearFilter:Kn},$c=new WeakMap;class b_ extends An{constructor(t){super(t),this.isImageBitmapLoader=!0,typeof createImageBitmap>"u"&&_t("ImageBitmapLoader: createImageBitmap() not supported."),typeof fetch>"u"&&_t("ImageBitmapLoader: fetch() not supported."),this.options={premultiplyAlpha:"none"},this._abortController=new AbortController}setOptions(t){return this.options=t,this}load(t,e,n,s){t===void 0&&(t=""),this.path!==void 0&&(t=this.path+t),t=this.manager.resolveURL(t);const r=this,a=Jn.get(`image-bitmap:${t}`);if(a!==void 0){if(r.manager.itemStart(t),a.then){a.then(c=>{$c.has(a)===!0?(s&&s($c.get(a)),r.manager.itemError(t),r.manager.itemEnd(t)):(e&&e(c),r.manager.itemEnd(t))});return}setTimeout(function(){e&&e(a),r.manager.itemEnd(t)},0);return}const o={};o.credentials=this.crossOrigin==="anonymous"?"same-origin":"include",o.headers=this.requestHeader,o.signal=typeof AbortSignal.any=="function"?AbortSignal.any([this._abortController.signal,this.manager.abortController.signal]):this._abortController.signal;const l=fetch(t,o).then(function(c){return c.blob()}).then(function(c){return createImageBitmap(c,Object.assign({},r.options,{colorSpaceConversion:"none"}))}).then(function(c){return Jn.add(`image-bitmap:${t}`,c),e&&e(c),r.manager.itemEnd(t),c}).catch(function(c){s&&s(c),$c.set(l,c),Jn.remove(`image-bitmap:${t}`),r.manager.itemError(t),r.manager.itemEnd(t)});Jn.add(`image-bitmap:${t}`,l),r.manager.itemStart(t)}abort(){return this._abortController.abort(),this._abortController=new AbortController,this}}let go;class Ou{static getContext(){return go===void 0&&(go=new(window.AudioContext||window.webkitAudioContext)),go}static setContext(t){go=t}}class C_ extends An{constructor(t){super(t)}load(t,e,n,s){const r=this,a=new gi(this.manager);a.setResponseType("arraybuffer"),a.setPath(this.path),a.setRequestHeader(this.requestHeader),a.setWithCredentials(this.withCredentials),a.load(t,function(l){try{const c=l.slice(0),h=Ou.getContext(),f=t+"#decode";r.manager.itemStart(f),h.decodeAudioData(c,function(u){e(u),r.manager.itemEnd(f)}).catch(function(u){o(u),r.manager.itemEnd(f)})}catch(c){o(c)}},n,s);function o(l){s?s(l):Ht(l),r.manager.itemError(t)}}}const ld=new Kt,cd=new Kt,Ji=new Kt;class T_{constructor(){this.type="StereoCamera",this.aspect=1,this.eyeSep=.064,this.cameraL=new Ue,this.cameraL.layers.enable(1),this.cameraL.matrixAutoUpdate=!1,this.cameraR=new Ue,this.cameraR.layers.enable(2),this.cameraR.matrixAutoUpdate=!1,this._cache={focus:null,fov:null,aspect:null,near:null,far:null,zoom:null,eyeSep:null}}update(t){const e=this._cache;if(e.focus!==t.focus||e.fov!==t.fov||e.aspect!==t.aspect*this.aspect||e.near!==t.near||e.far!==t.far||e.zoom!==t.zoom||e.eyeSep!==this.eyeSep){e.focus=t.focus,e.fov=t.fov,e.aspect=t.aspect*this.aspect,e.near=t.near,e.far=t.far,e.zoom=t.zoom,e.eyeSep=this.eyeSep,Ji.copy(t.projectionMatrix);const s=e.eyeSep/2,r=s*e.near/e.focus,a=e.near*Math.tan(hs*e.fov*.5)/e.zoom;let o,l;cd.elements[12]=-s,ld.elements[12]=s,o=-a*e.aspect+r,l=a*e.aspect+r,Ji.elements[0]=2*e.near/(l-o),Ji.elements[8]=(l+o)/(l-o),this.cameraL.projectionMatrix.copy(Ji),o=-a*e.aspect-r,l=a*e.aspect-r,Ji.elements[0]=2*e.near/(l-o),Ji.elements[8]=(l+o)/(l-o),this.cameraR.projectionMatrix.copy(Ji)}this.cameraL.matrix.copy(t.matrixWorld).multiply(cd),this.cameraL.matrixWorldNeedsUpdate=!0,this.cameraR.matrix.copy(t.matrixWorld).multiply(ld),this.cameraR.matrixWorldNeedsUpdate=!0}}const Gs=-90,ks=1;class pm extends he{constructor(t,e,n){super(),this.type="CubeCamera",this.renderTarget=n,this.coordinateSystem=null,this.activeMipmapLevel=0;const s=new Ue(Gs,ks,t,e);s.layers=this.layers,this.add(s);const r=new Ue(Gs,ks,t,e);r.layers=this.layers,this.add(r);const a=new Ue(Gs,ks,t,e);a.layers=this.layers,this.add(a);const o=new Ue(Gs,ks,t,e);o.layers=this.layers,this.add(o);const l=new Ue(Gs,ks,t,e);l.layers=this.layers,this.add(l);const c=new Ue(Gs,ks,t,e);c.layers=this.layers,this.add(c)}updateCoordinateSystem(){const t=this.coordinateSystem,e=this.children.concat(),[n,s,r,a,o,l]=e;for(const c of e)this.remove(c);if(t===vn)n.up.set(0,1,0),n.lookAt(1,0,0),s.up.set(0,1,0),s.lookAt(-1,0,0),r.up.set(0,0,-1),r.lookAt(0,1,0),a.up.set(0,0,1),a.lookAt(0,-1,0),o.up.set(0,1,0),o.lookAt(0,0,1),l.up.set(0,1,0),l.lookAt(0,0,-1);else if(t===us)n.up.set(0,-1,0),n.lookAt(-1,0,0),s.up.set(0,-1,0),s.lookAt(1,0,0),r.up.set(0,0,1),r.lookAt(0,1,0),a.up.set(0,0,-1),a.lookAt(0,-1,0),o.up.set(0,-1,0),o.lookAt(0,0,1),l.up.set(0,-1,0),l.lookAt(0,0,-1);else throw new Error("THREE.CubeCamera.updateCoordinateSystem(): Invalid coordinate system: "+t);for(const c of e)this.add(c),c.updateMatrixWorld()}update(t,e){this.parent===null&&this.updateMatrixWorld();const{renderTarget:n,activeMipmapLevel:s}=this;this.coordinateSystem!==t.coordinateSystem&&(this.coordinateSystem=t.coordinateSystem,this.updateCoordinateSystem());const[r,a,o,l,c,h]=this.children,f=t.getRenderTarget(),u=t.getActiveCubeFace(),d=t.getActiveMipmapLevel(),p=t.xr.enabled;t.xr.enabled=!1;const g=n.texture.generateMipmaps;n.texture.generateMipmaps=!1;let m=!1;t.isWebGLRenderer===!0?m=t.state.buffers.depth.getReversed():m=t.reversedDepthBuffer,t.setRenderTarget(n,0,s),m&&t.autoClear===!1&&t.clearDepth(),t.render(e,r),t.setRenderTarget(n,1,s),m&&t.autoClear===!1&&t.clearDepth(),t.render(e,a),t.setRenderTarget(n,2,s),m&&t.autoClear===!1&&t.clearDepth(),t.render(e,o),t.setRenderTarget(n,3,s),m&&t.autoClear===!1&&t.clearDepth(),t.render(e,l),t.setRenderTarget(n,4,s),m&&t.autoClear===!1&&t.clearDepth(),t.render(e,c),n.texture.generateMipmaps=g,t.setRenderTarget(n,5,s),m&&t.autoClear===!1&&t.clearDepth(),t.render(e,h),t.setRenderTarget(f,u,d),t.xr.enabled=p,n.texture.needsPMREMUpdate=!0}}class Am extends Ue{constructor(t=[]){super(),this.isArrayCamera=!0,this.isMultiViewCamera=!1,this.cameras=t}}class mm{constructor(){this._previousTime=0,this._currentTime=0,this._startTime=performance.now(),this._delta=0,this._elapsed=0,this._timescale=1,this._document=null,this._pageVisibilityHandler=null}connect(t){this._document=t,t.hidden!==void 0&&(this._pageVisibilityHandler=B_.bind(this),t.addEventListener("visibilitychange",this._pageVisibilityHandler,!1))}disconnect(){this._pageVisibilityHandler!==null&&(this._document.removeEventListener("visibilitychange",this._pageVisibilityHandler),this._pageVisibilityHandler=null),this._document=null}getDelta(){return this._delta/1e3}getElapsed(){return this._elapsed/1e3}getTimescale(){return this._timescale}setTimescale(t){return this._timescale=t,this}reset(){return this._currentTime=performance.now()-this._startTime,this}dispose(){this.disconnect()}update(t){return this._pageVisibilityHandler!==null&&this._document.hidden===!0?this._delta=0:(this._previousTime=this._currentTime,this._currentTime=(t!==void 0?t:performance.now())-this._startTime,this._delta=(this._currentTime-this._previousTime)*this._timescale,this._elapsed+=this._delta),this}}function B_(){this._document.hidden===!1&&this.reset()}const Zi=new I,jc=new on,I_=new I,$i=new I,ji=new I;class R_ extends he{constructor(){super(),this.type="AudioListener",this.context=Ou.getContext(),this.gain=this.context.createGain(),this.gain.connect(this.context.destination),this.filter=null,this.timeDelta=0,this._timer=new mm}getInput(){return this.gain}removeFilter(){return this.filter!==null&&(this.gain.disconnect(this.filter),this.filter.disconnect(this.context.destination),this.gain.connect(this.context.destination),this.filter=null),this}getFilter(){return this.filter}setFilter(t){return this.filter!==null?(this.gain.disconnect(this.filter),this.filter.disconnect(this.context.destination)):this.gain.disconnect(this.context.destination),this.filter=t,this.gain.connect(this.filter),this.filter.connect(this.context.destination),this}getMasterVolume(){return this.gain.gain.value}setMasterVolume(t){return this.gain.gain.setTargetAtTime(t,this.context.currentTime,.01),this}updateMatrixWorld(t){super.updateMatrixWorld(t),this._timer.update();const e=this.context.listener;if(this.timeDelta=this._timer.getDelta(),this.matrixWorld.decompose(Zi,jc,I_),$i.set(0,0,-1).applyQuaternion(jc),ji.set(0,1,0).applyQuaternion(jc),e.positionX){const n=this.context.currentTime+this.timeDelta;e.positionX.linearRampToValueAtTime(Zi.x,n),e.positionY.linearRampToValueAtTime(Zi.y,n),e.positionZ.linearRampToValueAtTime(Zi.z,n),e.forwardX.linearRampToValueAtTime($i.x,n),e.forwardY.linearRampToValueAtTime($i.y,n),e.forwardZ.linearRampToValueAtTime($i.z,n),e.upX.linearRampToValueAtTime(ji.x,n),e.upY.linearRampToValueAtTime(ji.y,n),e.upZ.linearRampToValueAtTime(ji.z,n)}else e.setPosition(Zi.x,Zi.y,Zi.z),e.setOrientation($i.x,$i.y,$i.z,ji.x,ji.y,ji.z)}}class gm extends he{constructor(t){super(),this.type="Audio",this.listener=t,this.context=t.context,this.gain=this.context.createGain(),this.gain.connect(t.getInput()),this.autoplay=!1,this.buffer=null,this.detune=0,this.loop=!1,this.loopStart=0,this.loopEnd=0,this.offset=0,this.duration=void 0,this.playbackRate=1,this.isPlaying=!1,this.hasPlaybackControl=!0,this.source=null,this.sourceType="empty",this._startedAt=0,this._progress=0,this._connected=!1,this.filters=[]}getOutput(){return this.gain}setNodeSource(t){return this.hasPlaybackControl=!1,this.sourceType="audioNode",this.source=t,this.connect(),this}setMediaElementSource(t){return this.hasPlaybackControl=!1,this.sourceType="mediaNode",this.source=this.context.createMediaElementSource(t),this.connect(),this}setMediaStreamSource(t){return this.hasPlaybackControl=!1,this.sourceType="mediaStreamNode",this.source=this.context.createMediaStreamSource(t),this.connect(),this}setBuffer(t){return this.buffer=t,this.sourceType="buffer",this.autoplay&&this.play(),this}play(t=0){if(this.isPlaying===!0){_t("Audio: Audio is already playing.");return}if(this.hasPlaybackControl===!1){_t("Audio: this Audio has no playback control.");return}this._startedAt=this.context.currentTime+t;const e=this.context.createBufferSource();return e.buffer=this.buffer,e.loop=this.loop,e.loopStart=this.loopStart,e.loopEnd=this.loopEnd,e.onended=this.onEnded.bind(this),e.start(this._startedAt,this._progress+this.offset,this.duration),this.isPlaying=!0,this.source=e,this.setDetune(this.detune),this.setPlaybackRate(this.playbackRate),this.connect()}pause(){if(this.hasPlaybackControl===!1){_t("Audio: this Audio has no playback control.");return}return this.isPlaying===!0&&(this._progress+=Math.max(this.context.currentTime-this._startedAt,0)*this.playbackRate,this.loop===!0&&(this._progress=this._progress%(this.duration||this.buffer.duration)),this.source.stop(),this.source.onended=null,this.isPlaying=!1),this}stop(t=0){if(this.hasPlaybackControl===!1){_t("Audio: this Audio has no playback control.");return}return this._progress=0,this.source!==null&&(this.source.stop(this.context.currentTime+t),this.source.onended=null),this.isPlaying=!1,this}connect(){if(this.filters.length>0){this.source.connect(this.filters[0]);for(let t=1,e=this.filters.length;t<e;t++)this.filters[t-1].connect(this.filters[t]);this.filters[this.filters.length-1].connect(this.getOutput())}else this.source.connect(this.getOutput());return this._connected=!0,this}disconnect(){if(this._connected!==!1){if(this.filters.length>0){this.source.disconnect(this.filters[0]);for(let t=1,e=this.filters.length;t<e;t++)this.filters[t-1].disconnect(this.filters[t]);this.filters[this.filters.length-1].disconnect(this.getOutput())}else this.source.disconnect(this.getOutput());return this._connected=!1,this}}getFilters(){return this.filters}setFilters(t){return t||(t=[]),this._connected===!0?(this.disconnect(),this.filters=t.slice(),this.connect()):this.filters=t.slice(),this}setDetune(t){return this.detune=t,this.isPlaying===!0&&this.source.detune!==void 0&&this.source.detune.setTargetAtTime(this.detune,this.context.currentTime,.01),this}getDetune(){return this.detune}getFilter(){return this.getFilters()[0]}setFilter(t){return this.setFilters(t?[t]:[])}setPlaybackRate(t){if(this.hasPlaybackControl===!1){_t("Audio: this Audio has no playback control.");return}return this.playbackRate=t,this.isPlaying===!0&&this.source.playbackRate.setTargetAtTime(this.playbackRate,this.context.currentTime,.01),this}getPlaybackRate(){return this.playbackRate}onEnded(){this.isPlaying=!1,this._progress=0}getLoop(){return this.hasPlaybackControl===!1?(_t("Audio: this Audio has no playback control."),!1):this.loop}setLoop(t){if(this.hasPlaybackControl===!1){_t("Audio: this Audio has no playback control.");return}return this.loop=t,this.isPlaying===!0&&(this.source.loop=this.loop),this}setLoopStart(t){return this.loopStart=t,this}setLoopEnd(t){return this.loopEnd=t,this}getVolume(){return this.gain.gain.value}setVolume(t){return this.gain.gain.setTargetAtTime(t,this.context.currentTime,.01),this}copy(t,e){return super.copy(t,e),t.sourceType!=="buffer"?(_t("Audio: Audio source type cannot be copied."),this):(this.autoplay=t.autoplay,this.buffer=t.buffer,this.detune=t.detune,this.loop=t.loop,this.loopStart=t.loopStart,this.loopEnd=t.loopEnd,this.offset=t.offset,this.duration=t.duration,this.playbackRate=t.playbackRate,this.hasPlaybackControl=t.hasPlaybackControl,this.sourceType=t.sourceType,this.filters=t.filters.slice(),this)}clone(t){return new this.constructor(this.listener).copy(this,t)}}const ts=new I,hd=new on,D_=new I,es=new I;class P_ extends gm{constructor(t){super(t),this.panner=this.context.createPanner(),this.panner.panningModel="HRTF",this.panner.connect(this.gain)}connect(){return super.connect(),this.panner.connect(this.gain),this}disconnect(){return super.disconnect(),this.panner.disconnect(this.gain),this}getOutput(){return this.panner}getRefDistance(){return this.panner.refDistance}setRefDistance(t){return this.panner.refDistance=t,this}getRolloffFactor(){return this.panner.rolloffFactor}setRolloffFactor(t){return this.panner.rolloffFactor=t,this}getDistanceModel(){return this.panner.distanceModel}setDistanceModel(t){return this.panner.distanceModel=t,this}getMaxDistance(){return this.panner.maxDistance}setMaxDistance(t){return this.panner.maxDistance=t,this}setDirectionalCone(t,e,n){return this.panner.coneInnerAngle=t,this.panner.coneOuterAngle=e,this.panner.coneOuterGain=n,this}updateMatrixWorld(t){if(super.updateMatrixWorld(t),this.hasPlaybackControl===!0&&this.isPlaying===!1)return;this.matrixWorld.decompose(ts,hd,D_),es.set(0,0,1).applyQuaternion(hd);const e=this.panner;if(e.positionX){const n=this.context.currentTime+this.listener.timeDelta;e.positionX.linearRampToValueAtTime(ts.x,n),e.positionY.linearRampToValueAtTime(ts.y,n),e.positionZ.linearRampToValueAtTime(ts.z,n),e.orientationX.linearRampToValueAtTime(es.x,n),e.orientationY.linearRampToValueAtTime(es.y,n),e.orientationZ.linearRampToValueAtTime(es.z,n)}else e.setPosition(ts.x,ts.y,ts.z),e.setOrientation(es.x,es.y,es.z)}}class L_{constructor(t,e=2048){this.analyser=t.context.createAnalyser(),this.analyser.fftSize=e,this.data=new Uint8Array(this.analyser.frequencyBinCount),t.getOutput().connect(this.analyser)}getFrequencyData(){return this.analyser.getByteFrequencyData(this.data),this.data}getAverageFrequency(){let t=0;const e=this.getFrequencyData();for(let n=0;n<e.length;n++)t+=e[n];return t/e.length}}class xm{constructor(t,e,n){this.binding=t,this.valueSize=n;let s,r,a;switch(e){case"quaternion":s=this._slerp,r=this._slerpAdditive,a=this._setAdditiveIdentityQuaternion,this.buffer=new Float64Array(n*6),this._workIndex=5;break;case"string":case"bool":s=this._select,r=this._select,a=this._setAdditiveIdentityOther,this.buffer=new Array(n*5);break;default:s=this._lerp,r=this._lerpAdditive,a=this._setAdditiveIdentityNumeric,this.buffer=new Float64Array(n*5)}this._mixBufferRegion=s,this._mixBufferRegionAdditive=r,this._setIdentity=a,this._origIndex=3,this._addIndex=4,this.cumulativeWeight=0,this.cumulativeWeightAdditive=0,this.useCount=0,this.referenceCount=0}accumulate(t,e){const n=this.buffer,s=this.valueSize,r=t*s+s;let a=this.cumulativeWeight;if(a===0){for(let o=0;o!==s;++o)n[r+o]=n[o];a=e}else{a+=e;const o=e/a;this._mixBufferRegion(n,r,0,o,s)}this.cumulativeWeight=a}accumulateAdditive(t){const e=this.buffer,n=this.valueSize,s=n*this._addIndex;this.cumulativeWeightAdditive===0&&this._setIdentity(),this._mixBufferRegionAdditive(e,s,0,t,n),this.cumulativeWeightAdditive+=t}apply(t){const e=this.valueSize,n=this.buffer,s=t*e+e,r=this.cumulativeWeight,a=this.cumulativeWeightAdditive,o=this.binding;if(this.cumulativeWeight=0,this.cumulativeWeightAdditive=0,r<1){const l=e*this._origIndex;this._mixBufferRegion(n,s,l,1-r,e)}a>0&&this._mixBufferRegionAdditive(n,s,this._addIndex*e,1,e);for(let l=e,c=e+e;l!==c;++l)if(n[l]!==n[l+e]){o.setValue(n,s);break}}saveOriginalState(){const t=this.binding,e=this.buffer,n=this.valueSize,s=n*this._origIndex;t.getValue(e,s);for(let r=n,a=s;r!==a;++r)e[r]=e[s+r%n];this._setIdentity(),this.cumulativeWeight=0,this.cumulativeWeightAdditive=0}restoreOriginalState(){const t=this.valueSize*3;this.binding.setValue(this.buffer,t)}_setAdditiveIdentityNumeric(){const t=this._addIndex*this.valueSize,e=t+this.valueSize;for(let n=t;n<e;n++)this.buffer[n]=0}_setAdditiveIdentityQuaternion(){this._setAdditiveIdentityNumeric(),this.buffer[this._addIndex*this.valueSize+3]=1}_setAdditiveIdentityOther(){const t=this._origIndex*this.valueSize,e=this._addIndex*this.valueSize;for(let n=0;n<this.valueSize;n++)this.buffer[e+n]=this.buffer[t+n]}_select(t,e,n,s,r){if(s>=.5)for(let a=0;a!==r;++a)t[e+a]=t[n+a]}_slerp(t,e,n,s){on.slerpFlat(t,e,t,e,t,n,s)}_slerpAdditive(t,e,n,s,r){const a=this._workIndex*r;on.multiplyQuaternionsFlat(t,a,t,e,t,n),on.slerpFlat(t,e,t,e,t,a,s)}_lerp(t,e,n,s,r){const a=1-s;for(let o=0;o!==r;++o){const l=e+o;t[l]=t[l]*a+t[n+o]*s}}_lerpAdditive(t,e,n,s,r){for(let a=0;a!==r;++a){const o=e+a;t[o]=t[o]+t[n+a]*s}}}const Gu="\\[\\]\\.:\\/",F_=new RegExp("["+Gu+"]","g"),ku="[^"+Gu+"]",U_="[^"+Gu.replace("\\.","")+"]",N_=/((?:WC+[\/:])*)/.source.replace("WC",ku),O_=/(WCOD+)?/.source.replace("WCOD",U_),G_=/(?:\.(WC+)(?:\[(.+)\])?)?/.source.replace("WC",ku),k_=/\.(WC+)(?:\[(.+)\])?/.source.replace("WC",ku),Q_=new RegExp("^"+N_+O_+G_+k_+"$"),z_=["material","materials","bones","map"];class H_{constructor(t,e,n){const s=n||ce.parseTrackName(e);this._targetGroup=t,this._bindings=t.subscribe_(e,s)}getValue(t,e){this.bind();const n=this._targetGroup.nCachedObjects_,s=this._bindings[n];s!==void 0&&s.getValue(t,e)}setValue(t,e){const n=this._bindings;for(let s=this._targetGroup.nCachedObjects_,r=n.length;s!==r;++s)n[s].setValue(t,e)}bind(){const t=this._bindings;for(let e=this._targetGroup.nCachedObjects_,n=t.length;e!==n;++e)t[e].bind()}unbind(){const t=this._bindings;for(let e=this._targetGroup.nCachedObjects_,n=t.length;e!==n;++e)t[e].unbind()}}class ce{constructor(t,e,n){this.path=e,this.parsedPath=n||ce.parseTrackName(e),this.node=ce.findNode(t,this.parsedPath.nodeName),this.rootNode=t,this.getValue=this._getValue_unbound,this.setValue=this._setValue_unbound}static create(t,e,n){return t&&t.isAnimationObjectGroup?new ce.Composite(t,e,n):new ce(t,e,n)}static sanitizeNodeName(t){return t.replace(/\s/g,"_").replace(F_,"")}static parseTrackName(t){const e=Q_.exec(t);if(e===null)throw new Error("THREE.PropertyBinding: Cannot parse trackName: "+t);const n={nodeName:e[2],objectName:e[3],objectIndex:e[4],propertyName:e[5],propertyIndex:e[6]},s=n.nodeName&&n.nodeName.lastIndexOf(".");if(s!==void 0&&s!==-1){const r=n.nodeName.substring(s+1);z_.indexOf(r)!==-1&&(n.nodeName=n.nodeName.substring(0,s),n.objectName=r)}if(n.propertyName===null||n.propertyName.length===0)throw new Error("THREE.PropertyBinding: can not parse propertyName from trackName: "+t);return n}static findNode(t,e){if(e===void 0||e===""||e==="."||e===-1||e===t.name||e===t.uuid)return t;if(t.skeleton){const n=t.skeleton.getBoneByName(e);if(n!==void 0)return n}if(t.children){const n=function(r){for(let a=0;a<r.length;a++){const o=r[a];if(o.name===e||o.uuid===e)return o;const l=n(o.children);if(l)return l}return null},s=n(t.children);if(s)return s}return null}_getValue_unavailable(){}_setValue_unavailable(){}_getValue_direct(t,e){t[e]=this.targetObject[this.propertyName]}_getValue_array(t,e){const n=this.resolvedProperty;for(let s=0,r=n.length;s!==r;++s)t[e++]=n[s]}_getValue_arrayElement(t,e){t[e]=this.resolvedProperty[this.propertyIndex]}_getValue_toArray(t,e){this.resolvedProperty.toArray(t,e)}_setValue_direct(t,e){this.targetObject[this.propertyName]=t[e]}_setValue_direct_setNeedsUpdate(t,e){this.targetObject[this.propertyName]=t[e],this.targetObject.needsUpdate=!0}_setValue_direct_setMatrixWorldNeedsUpdate(t,e){this.targetObject[this.propertyName]=t[e],this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_array(t,e){const n=this.resolvedProperty;for(let s=0,r=n.length;s!==r;++s)n[s]=t[e++]}_setValue_array_setNeedsUpdate(t,e){const n=this.resolvedProperty;for(let s=0,r=n.length;s!==r;++s)n[s]=t[e++];this.targetObject.needsUpdate=!0}_setValue_array_setMatrixWorldNeedsUpdate(t,e){const n=this.resolvedProperty;for(let s=0,r=n.length;s!==r;++s)n[s]=t[e++];this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_arrayElement(t,e){this.resolvedProperty[this.propertyIndex]=t[e]}_setValue_arrayElement_setNeedsUpdate(t,e){this.resolvedProperty[this.propertyIndex]=t[e],this.targetObject.needsUpdate=!0}_setValue_arrayElement_setMatrixWorldNeedsUpdate(t,e){this.resolvedProperty[this.propertyIndex]=t[e],this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_fromArray(t,e){this.resolvedProperty.fromArray(t,e)}_setValue_fromArray_setNeedsUpdate(t,e){this.resolvedProperty.fromArray(t,e),this.targetObject.needsUpdate=!0}_setValue_fromArray_setMatrixWorldNeedsUpdate(t,e){this.resolvedProperty.fromArray(t,e),this.targetObject.matrixWorldNeedsUpdate=!0}_getValue_unbound(t,e){this.bind(),this.getValue(t,e)}_setValue_unbound(t,e){this.bind(),this.setValue(t,e)}bind(){let t=this.node;const e=this.parsedPath,n=e.objectName,s=e.propertyName;let r=e.propertyIndex;if(t||(t=ce.findNode(this.rootNode,e.nodeName),this.node=t),this.getValue=this._getValue_unavailable,this.setValue=this._setValue_unavailable,!t){_t("PropertyBinding: No target node found for track: "+this.path+".");return}if(n){let c=e.objectIndex;switch(n){case"materials":if(!t.material){Ht("PropertyBinding: Can not bind to material as node does not have a material.",this);return}if(!t.material.materials){Ht("PropertyBinding: Can not bind to material.materials as node.material does not have a materials array.",this);return}t=t.material.materials;break;case"bones":if(!t.skeleton){Ht("PropertyBinding: Can not bind to bones as node does not have a skeleton.",this);return}t=t.skeleton.bones;for(let h=0;h<t.length;h++)if(t[h].name===c){c=h;break}break;case"map":if("map"in t){t=t.map;break}if(!t.material){Ht("PropertyBinding: Can not bind to material as node does not have a material.",this);return}if(!t.material.map){Ht("PropertyBinding: Can not bind to material.map as node.material does not have a map.",this);return}t=t.material.map;break;default:if(t[n]===void 0){Ht("PropertyBinding: Can not bind to objectName of node undefined.",this);return}t=t[n]}if(c!==void 0){if(t[c]===void 0){Ht("PropertyBinding: Trying to bind to objectIndex of objectName, but is undefined.",this,t);return}t=t[c]}}const a=t[s];if(a===void 0){const c=e.nodeName;Ht("PropertyBinding: Trying to update property for track: "+c+"."+s+" but it wasn't found.",t);return}let o=this.Versioning.None;this.targetObject=t,t.isMaterial===!0?o=this.Versioning.NeedsUpdate:t.isObject3D===!0&&(o=this.Versioning.MatrixWorldNeedsUpdate);let l=this.BindingType.Direct;if(r!==void 0){if(s==="morphTargetInfluences"){if(!t.geometry){Ht("PropertyBinding: Can not bind to morphTargetInfluences because node does not have a geometry.",this);return}if(!t.geometry.morphAttributes){Ht("PropertyBinding: Can not bind to morphTargetInfluences because node does not have a geometry.morphAttributes.",this);return}t.morphTargetDictionary[r]!==void 0&&(r=t.morphTargetDictionary[r])}l=this.BindingType.ArrayElement,this.resolvedProperty=a,this.propertyIndex=r}else a.fromArray!==void 0&&a.toArray!==void 0?(l=this.BindingType.HasFromToArray,this.resolvedProperty=a):Array.isArray(a)?(l=this.BindingType.EntireArray,this.resolvedProperty=a):this.propertyName=s;this.getValue=this.GetterByBindingType[l],this.setValue=this.SetterByBindingTypeAndVersioning[l][o]}unbind(){this.node=null,this.getValue=this._getValue_unbound,this.setValue=this._setValue_unbound}}ce.Composite=H_;ce.prototype.BindingType={Direct:0,EntireArray:1,ArrayElement:2,HasFromToArray:3};ce.prototype.Versioning={None:0,NeedsUpdate:1,MatrixWorldNeedsUpdate:2};ce.prototype.GetterByBindingType=[ce.prototype._getValue_direct,ce.prototype._getValue_array,ce.prototype._getValue_arrayElement,ce.prototype._getValue_toArray];ce.prototype.SetterByBindingTypeAndVersioning=[[ce.prototype._setValue_direct,ce.prototype._setValue_direct_setNeedsUpdate,ce.prototype._setValue_direct_setMatrixWorldNeedsUpdate],[ce.prototype._setValue_array,ce.prototype._setValue_array_setNeedsUpdate,ce.prototype._setValue_array_setMatrixWorldNeedsUpdate],[ce.prototype._setValue_arrayElement,ce.prototype._setValue_arrayElement_setNeedsUpdate,ce.prototype._setValue_arrayElement_setMatrixWorldNeedsUpdate],[ce.prototype._setValue_fromArray,ce.prototype._setValue_fromArray_setNeedsUpdate,ce.prototype._setValue_fromArray_setMatrixWorldNeedsUpdate]];class V_{constructor(){this.isAnimationObjectGroup=!0,this.uuid=yn(),this._objects=Array.prototype.slice.call(arguments),this.nCachedObjects_=0;const t={};this._indicesByUUID=t;for(let n=0,s=arguments.length;n!==s;++n)t[arguments[n].uuid]=n;this._paths=[],this._parsedPaths=[],this._bindings=[],this._bindingsIndicesByPath={};const e=this;this.stats={objects:{get total(){return e._objects.length},get inUse(){return this.total-e.nCachedObjects_}},get bindingsPerObject(){return e._bindings.length}}}add(){const t=this._objects,e=this._indicesByUUID,n=this._paths,s=this._parsedPaths,r=this._bindings,a=r.length;let o,l=t.length,c=this.nCachedObjects_;for(let h=0,f=arguments.length;h!==f;++h){const u=arguments[h],d=u.uuid;let p=e[d];if(p===void 0){p=l++,e[d]=p,t.push(u);for(let g=0,m=a;g!==m;++g)r[g].push(new ce(u,n[g],s[g]))}else if(p<c){o=t[p];const g=--c,m=t[g];e[m.uuid]=p,t[p]=m,e[d]=g,t[g]=u;for(let A=0,v=a;A!==v;++A){const M=r[A],x=M[g];let S=M[p];M[p]=x,S===void 0&&(S=new ce(u,n[A],s[A])),M[g]=S}}else t[p]!==o&&Ht("AnimationObjectGroup: Different objects with the same UUID detected. Clean the caches or recreate your infrastructure when reloading scenes.")}this.nCachedObjects_=c}remove(){const t=this._objects,e=this._indicesByUUID,n=this._bindings,s=n.length;let r=this.nCachedObjects_;for(let a=0,o=arguments.length;a!==o;++a){const l=arguments[a],c=l.uuid,h=e[c];if(h!==void 0&&h>=r){const f=r++,u=t[f];e[u.uuid]=h,t[h]=u,e[c]=f,t[f]=l;for(let d=0,p=s;d!==p;++d){const g=n[d],m=g[f],A=g[h];g[h]=m,g[f]=A}}}this.nCachedObjects_=r}uncache(){const t=this._objects,e=this._indicesByUUID,n=this._bindings,s=n.length;let r=this.nCachedObjects_,a=t.length;for(let o=0,l=arguments.length;o!==l;++o){const c=arguments[o],h=c.uuid,f=e[h];if(f!==void 0)if(delete e[h],f<r){const u=--r,d=t[u],p=--a,g=t[p];f!==u&&(e[d.uuid]=f),t[f]=d,u!==p&&(e[g.uuid]=u),t[u]=g,t.pop();for(let m=0,A=s;m!==A;++m){const v=n[m],M=v[u],x=v[p];v[f]=M,v[u]=x,v.pop()}}else{const u=--a,d=t[u];f!==u&&(e[d.uuid]=f),t[f]=d,t.pop();for(let p=0,g=s;p!==g;++p){const m=n[p];m[f]=m[u],m.pop()}}}this.nCachedObjects_=r}subscribe_(t,e){const n=this._bindingsIndicesByPath;let s=n[t];const r=this._bindings;if(s!==void 0)return r[s];const a=this._paths,o=this._parsedPaths,l=this._objects,c=l.length,h=this.nCachedObjects_,f=new Array(c);s=r.length,n[t]=s,a.push(t),o.push(e),r.push(f);for(let u=h,d=l.length;u!==d;++u){const p=l[u];f[u]=new ce(p,t,e)}return f}unsubscribe_(t){const e=this._bindingsIndicesByPath,n=e[t];if(n!==void 0){const s=this._paths,r=this._parsedPaths,a=this._bindings,o=a.length-1,l=a[o],c=s[o];e[c]=n,a[n]=l,a.pop(),r[n]=r[o],r.pop(),s[n]=s[o],s.pop()}}}class _m{constructor(t,e,n=null,s=e.blendMode){this._mixer=t,this._clip=e,this._localRoot=n,this.blendMode=s;const r=e.tracks,a=r.length,o=new Array(a),l={endingStart:os,endingEnd:os};for(let c=0;c!==a;++c){const h=r[c].createInterpolant(null);o[c]=h,h.settings=l}this._interpolantSettings=l,this._interpolants=o,this._propertyBindings=new Array(a),this._cacheIndex=null,this._byClipCacheIndex=null,this._timeScaleInterpolant=null,this._restoreTimeScale=null,this._weightInterpolant=null,this.loop=iA,this._loopCount=-1,this._startTime=null,this.time=0,this.timeScale=1,this._effectiveTimeScale=1,this.weight=1,this._effectiveWeight=1,this.repetitions=1/0,this.paused=!1,this.enabled=!0,this.clampWhenFinished=!1,this.zeroSlopeAtStart=!0,this.zeroSlopeAtEnd=!0}play(){return this._mixer._activateAction(this),this}stop(){return this._mixer._deactivateAction(this),this.reset()}reset(){return this.paused=!1,this.enabled=!0,this.time=0,this._loopCount=-1,this._startTime=null,this.stopFading().stopWarping()}isRunning(){return this.enabled&&!this.paused&&this.timeScale!==0&&this._startTime===null&&this._mixer._isActiveAction(this)}isScheduled(){return this._mixer._isActiveAction(this)}startAt(t){return this._startTime=t,this}setLoop(t,e){return this.loop=t,this.repetitions=e,this}setEffectiveWeight(t){return this.weight=t,this._effectiveWeight=this.enabled?t:0,this.stopFading()}getEffectiveWeight(){return this._effectiveWeight}fadeIn(t){return this._scheduleFading(t,0,1)}fadeOut(t){return this._scheduleFading(t,1,0)}crossFadeFrom(t,e,n=!1){if(t.fadeOut(e),this.fadeIn(e),n===!0){const s=this._clip.duration,r=t._clip.duration,a=r/s,o=s/r;t._restoreTimeScale=t.timeScale,this._restoreTimeScale=this.timeScale,t.warp(1,a,e),this.warp(o,1,e)}return this}crossFadeTo(t,e,n=!1){return t.crossFadeFrom(this,e,n)}stopFading(){const t=this._weightInterpolant;return t!==null&&(this._weightInterpolant=null,this._mixer._takeBackControlInterpolant(t)),this}setEffectiveTimeScale(t){return this.timeScale=t,this._effectiveTimeScale=this.paused?0:t,this.stopWarping()}getEffectiveTimeScale(){return this._effectiveTimeScale}setDuration(t){return this.timeScale=this._clip.duration/t,this.stopWarping()}syncWith(t){return this.time=t.time,this.timeScale=t.timeScale,this.stopWarping()}halt(t){return this.warp(this._effectiveTimeScale,0,t)}warp(t,e,n){const s=this._mixer,r=s.time,a=this.timeScale;let o=this._timeScaleInterpolant;o===null&&(o=s._lendControlInterpolant(),this._timeScaleInterpolant=o);const l=o.parameterPositions,c=o.sampleValues;return l[0]=r,l[1]=r+n,c[0]=t/a,c[1]=e/a,this}stopWarping(){const t=this._timeScaleInterpolant;return t!==null&&(this._timeScaleInterpolant=null,this._mixer._takeBackControlInterpolant(t)),this._restoreTimeScale=null,this}getMixer(){return this._mixer}getClip(){return this._clip}getRoot(){return this._localRoot||this._mixer._root}_update(t,e,n,s){if(!this.enabled){this._updateWeight(t);return}const r=this._startTime;if(r!==null){const l=(t-r)*n;l<0||n===0?e=0:(this._startTime=null,e=n*l)}e*=this._updateTimeScale(t);const a=this._updateTime(e),o=this._updateWeight(t);if(o>0){const l=this._interpolants,c=this._propertyBindings;switch(this.blendMode){case pu:for(let h=0,f=l.length;h!==f;++h)l[h].evaluate(a),c[h].accumulateAdditive(o);break;case Gl:default:for(let h=0,f=l.length;h!==f;++h)l[h].evaluate(a),c[h].accumulate(s,o)}}}_updateWeight(t){let e=0;if(this.enabled){e=this.weight;const n=this._weightInterpolant;if(n!==null){const s=n.evaluate(t)[0];e*=s,t>n.parameterPositions[1]&&(this.stopFading(),s===0&&(this.enabled=!1))}}return this._effectiveWeight=e,e}_updateTimeScale(t){let e=0;if(!this.paused){e=this.timeScale;const n=this._timeScaleInterpolant;if(n!==null){const s=n.evaluate(t)[0];e*=s,t>n.parameterPositions[1]&&(e===0?this.paused=!0:(this._restoreTimeScale!==null&&(e=this._restoreTimeScale),this.timeScale=e),this.stopWarping())}}return this._effectiveTimeScale=e,e}_updateTime(t){const e=this._clip.duration,n=this.loop;let s=this.time+t,r=this._loopCount;const a=n===sA;if(t===0)return r===-1?s:a&&(r&1)===1?e-s:s;if(n===nA){r===-1&&(this._loopCount=0,this._setEndings(!0,!0,!1));t:{if(s>=e)s=e;else if(s<0)s=0;else{this.time=s;break t}this.clampWhenFinished?this.paused=!0:this.enabled=!1,this.time=s,this._mixer.dispatchEvent({type:"finished",action:this,direction:t<0?-1:1})}}else{if(r===-1&&(t>=0?(r=0,this._setEndings(!0,this.repetitions===0,a)):this._setEndings(this.repetitions===0,!0,a)),s>=e||s<0){const o=Math.floor(s/e);s-=e*o,r+=Math.abs(o);const l=this.repetitions-r;if(l<=0)this.clampWhenFinished?this.paused=!0:this.enabled=!1,s=t>0?e:0,this.time=s,this._mixer.dispatchEvent({type:"finished",action:this,direction:t>0?1:-1});else{if(l===1){const c=t<0;this._setEndings(c,!c,a)}else this._setEndings(!1,!1,a);this._loopCount=r,this.time=s,this._mixer.dispatchEvent({type:"loop",action:this,loopDelta:o})}}else this._loopCount=r,this.time=s;if(a&&(r&1)===1)return e-s}return s}_setEndings(t,e,n){const s=this._interpolantSettings;n?(s.endingStart=ls,s.endingEnd=ls):(t?s.endingStart=this.zeroSlopeAtStart?ls:os:s.endingStart=sa,e?s.endingEnd=this.zeroSlopeAtEnd?ls:os:s.endingEnd=sa)}_scheduleFading(t,e,n){const s=this._mixer,r=s.time;let a=this._weightInterpolant;a===null&&(a=s._lendControlInterpolant(),this._weightInterpolant=a);const o=a.parameterPositions,l=a.sampleValues;return o[0]=r,l[0]=e,o[1]=r+t,l[1]=n,this}}const W_=new Float32Array(1);class Y_ extends zn{constructor(t){super(),this._root=t,this._initMemoryManager(),this._accuIndex=0,this.time=0,this.timeScale=1,typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}_bindAction(t,e){const n=t._localRoot||this._root,s=t._clip.tracks,r=s.length,a=t._propertyBindings,o=t._interpolants,l=n.uuid,c=this._bindingsByRootAndName;let h=c[l];h===void 0&&(h={},c[l]=h);for(let f=0;f!==r;++f){const u=s[f],d=u.name;let p=h[d];if(p!==void 0)++p.referenceCount,a[f]=p;else{if(p=a[f],p!==void 0){p._cacheIndex===null&&(++p.referenceCount,this._addInactiveBinding(p,l,d));continue}const g=e&&e._propertyBindings[f].binding.parsedPath;p=new xm(ce.create(n,d,g),u.ValueTypeName,u.getValueSize()),++p.referenceCount,this._addInactiveBinding(p,l,d),a[f]=p}o[f].resultBuffer=p.buffer}}_activateAction(t){if(!this._isActiveAction(t)){if(t._cacheIndex===null){const n=(t._localRoot||this._root).uuid,s=t._clip.uuid,r=this._actionsByClip[s];this._bindAction(t,r&&r.knownActions[0]),this._addInactiveAction(t,s,n)}const e=t._propertyBindings;for(let n=0,s=e.length;n!==s;++n){const r=e[n];r.useCount++===0&&(this._lendBinding(r),r.saveOriginalState())}this._lendAction(t)}}_deactivateAction(t){if(this._isActiveAction(t)){const e=t._propertyBindings;for(let n=0,s=e.length;n!==s;++n){const r=e[n];--r.useCount===0&&(r.restoreOriginalState(),this._takeBackBinding(r))}this._takeBackAction(t)}}_initMemoryManager(){this._actions=[],this._nActiveActions=0,this._actionsByClip={},this._bindings=[],this._nActiveBindings=0,this._bindingsByRootAndName={},this._controlInterpolants=[],this._nActiveControlInterpolants=0;const t=this;this.stats={actions:{get total(){return t._actions.length},get inUse(){return t._nActiveActions}},bindings:{get total(){return t._bindings.length},get inUse(){return t._nActiveBindings}},controlInterpolants:{get total(){return t._controlInterpolants.length},get inUse(){return t._nActiveControlInterpolants}}}}_isActiveAction(t){const e=t._cacheIndex;return e!==null&&e<this._nActiveActions}_addInactiveAction(t,e,n){const s=this._actions,r=this._actionsByClip;let a=r[e];if(a===void 0)a={knownActions:[t],actionByRoot:{}},t._byClipCacheIndex=0,r[e]=a;else{const o=a.knownActions;t._byClipCacheIndex=o.length,o.push(t)}t._cacheIndex=s.length,s.push(t),a.actionByRoot[n]=t}_removeInactiveAction(t){const e=this._actions,n=e[e.length-1],s=t._cacheIndex;n._cacheIndex=s,e[s]=n,e.pop(),t._cacheIndex=null;const r=t._clip.uuid,a=this._actionsByClip,o=a[r],l=o.knownActions,c=l[l.length-1],h=t._byClipCacheIndex;c._byClipCacheIndex=h,l[h]=c,l.pop(),t._byClipCacheIndex=null;const f=o.actionByRoot,u=(t._localRoot||this._root).uuid;delete f[u],l.length===0&&delete a[r],this._removeInactiveBindingsForAction(t)}_removeInactiveBindingsForAction(t){const e=t._propertyBindings;for(let n=0,s=e.length;n!==s;++n){const r=e[n];--r.referenceCount===0&&this._removeInactiveBinding(r)}}_lendAction(t){const e=this._actions,n=t._cacheIndex,s=this._nActiveActions++,r=e[s];t._cacheIndex=s,e[s]=t,r._cacheIndex=n,e[n]=r}_takeBackAction(t){const e=this._actions,n=t._cacheIndex,s=--this._nActiveActions,r=e[s];t._cacheIndex=s,e[s]=t,r._cacheIndex=n,e[n]=r}_addInactiveBinding(t,e,n){const s=this._bindingsByRootAndName,r=this._bindings;let a=s[e];a===void 0&&(a={},s[e]=a),a[n]=t,t._cacheIndex=r.length,r.push(t)}_removeInactiveBinding(t){const e=this._bindings,n=t.binding,s=n.rootNode.uuid,r=n.path,a=this._bindingsByRootAndName,o=a[s],l=e[e.length-1],c=t._cacheIndex;l._cacheIndex=c,e[c]=l,e.pop(),delete o[r],Object.keys(o).length===0&&delete a[s]}_lendBinding(t){const e=this._bindings,n=t._cacheIndex,s=this._nActiveBindings++,r=e[s];t._cacheIndex=s,e[s]=t,r._cacheIndex=n,e[n]=r}_takeBackBinding(t){const e=this._bindings,n=t._cacheIndex,s=--this._nActiveBindings,r=e[s];t._cacheIndex=s,e[s]=t,r._cacheIndex=n,e[n]=r}_lendControlInterpolant(){const t=this._controlInterpolants,e=this._nActiveControlInterpolants++;let n=t[e];return n===void 0&&(n=new Pu(new Float32Array(2),new Float32Array(2),1,W_),n.__cacheIndex=e,t[e]=n),n}_takeBackControlInterpolant(t){const e=this._controlInterpolants,n=t.__cacheIndex,s=--this._nActiveControlInterpolants,r=e[s];t.__cacheIndex=s,e[s]=t,r.__cacheIndex=n,e[n]=r}clipAction(t,e,n){const s=e||this._root,r=s.uuid;let a=typeof t=="string"?da.findByName(s,t):t;const o=a!==null?a.uuid:t,l=this._actionsByClip[o];let c=null;if(n===void 0&&(a!==null?n=a.blendMode:n=Gl),l!==void 0){const f=l.actionByRoot[r];if(f!==void 0&&f.blendMode===n)return f;c=l.knownActions[0],a===null&&(a=c._clip)}if(a===null)return null;const h=new _m(this,a,e,n);return this._bindAction(h,c),this._addInactiveAction(h,o,r),h}existingAction(t,e){const n=e||this._root,s=n.uuid,r=typeof t=="string"?da.findByName(n,t):t,a=r?r.uuid:t,o=this._actionsByClip[a];return o!==void 0&&o.actionByRoot[s]||null}stopAllAction(){const t=this._actions,e=this._nActiveActions;for(let n=e-1;n>=0;--n)t[n].stop();return this}update(t){t*=this.timeScale;const e=this._actions,n=this._nActiveActions,s=this.time+=t,r=Math.sign(t),a=this._accuIndex^=1;for(let c=0;c!==n;++c)e[c]._update(s,t,r,a);const o=this._bindings,l=this._nActiveBindings;for(let c=0;c!==l;++c)o[c].apply(a);return this}setTime(t){this.time=0;for(let e=0;e<this._actions.length;e++)this._actions[e].time=0;return this.update(t)}getRoot(){return this._root}uncacheClip(t){const e=this._actions,n=t.uuid,s=this._actionsByClip,r=s[n];if(r!==void 0){const a=r.knownActions;for(let o=0,l=a.length;o!==l;++o){const c=a[o];this._deactivateAction(c);const h=c._cacheIndex,f=e[e.length-1];c._cacheIndex=null,c._byClipCacheIndex=null,f._cacheIndex=h,e[h]=f,e.pop(),this._removeInactiveBindingsForAction(c)}delete s[n]}}uncacheRoot(t){const e=t.uuid,n=this._actionsByClip;for(const a in n){const o=n[a].actionByRoot,l=o[e];l!==void 0&&(this._deactivateAction(l),this._removeInactiveAction(l))}const s=this._bindingsByRootAndName,r=s[e];if(r!==void 0)for(const a in r){const o=r[a];o.restoreOriginalState(),this._removeInactiveBinding(o)}}uncacheAction(t,e){const n=this.existingAction(t,e);n!==null&&(this._deactivateAction(n),this._removeInactiveAction(n))}}class X_ extends mu{constructor(t=1,e=1,n=1,s={}){super(t,e,s),this.isRenderTarget3D=!0,this.depth=n;for(let r=0;r<this.textures.length;r++){const a=new Vl(null,t,e,n);a.isRenderTargetTexture=!0,a.renderTarget=this,this.textures[r]=a}this._setTextureOptions(s)}}class Qu{constructor(t){this.value=t}clone(){return new Qu(this.value.clone===void 0?this.value:this.value.clone())}}let q_=0;class K_ extends zn{constructor(){super(),this.isUniformsGroup=!0,Object.defineProperty(this,"id",{value:q_++}),this.name="",this.usage=zl,this.uniforms=[]}add(t){return this.uniforms.push(t),this}remove(t){const e=this.uniforms.indexOf(t);return e!==-1&&this.uniforms.splice(e,1),this}setName(t){return this.name=t,this}setUsage(t){return this.usage=t,this}dispose(){this.dispatchEvent({type:"dispose"})}copy(t){this.name=t.name,this.usage=t.usage;const e=t.uniforms;this.uniforms.length=0;for(let n=0,s=e.length;n<s;n++){const r=Array.isArray(e[n])?e[n]:[e[n]];for(let a=0;a<r.length;a++)this.uniforms.push(r[a].clone())}return this}clone(){return new this.constructor().copy(this)}}class J_ extends ql{constructor(t,e,n=1){super(t,e),this.isInstancedInterleavedBuffer=!0,this.meshPerAttribute=n}copy(t){return super.copy(t),this.meshPerAttribute=t.meshPerAttribute,this}clone(t){const e=super.clone(t);return e.meshPerAttribute=this.meshPerAttribute,e}toJSON(t){const e=super.toJSON(t);return e.isInstancedInterleavedBuffer=!0,e.meshPerAttribute=this.meshPerAttribute,e}}class Z_{constructor(t,e,n,s,r,a=!1){this.isGLBufferAttribute=!0,this.name="",this.buffer=t,this.type=e,this.itemSize=n,this.elementSize=s,this.count=r,this.normalized=a,this.version=0}set needsUpdate(t){t===!0&&this.version++}setBuffer(t){return this.buffer=t,this}setType(t,e){return this.type=t,this.elementSize=e,this}setItemSize(t){return this.itemSize=t,this}setCount(t){return this.count=t,this}}const ud=new Kt;class $_{constructor(t,e,n=0,s=1/0){this.ray=new Ar(t,e),this.near=n,this.far=s,this.camera=null,this.layers=new Wl,this.params={Mesh:{},Line:{threshold:1},LOD:{},Points:{threshold:1},Sprite:{}}}set(t,e){this.ray.set(t,e)}setFromCamera(t,e){e.isPerspectiveCamera?(this.ray.origin.setFromMatrixPosition(e.matrixWorld),this.ray.direction.set(t.x,t.y,.5).unproject(e).sub(this.ray.origin).normalize(),this.camera=e):e.isOrthographicCamera?(this.ray.origin.set(t.x,t.y,e.projectionMatrix.elements[14]).unproject(e),this.ray.direction.set(0,0,-1).transformDirection(e.matrixWorld),this.camera=e):Ht("Raycaster: Unsupported camera type: "+e.type)}setFromXRController(t){return ud.identity().extractRotation(t.matrixWorld),this.ray.origin.setFromMatrixPosition(t.matrixWorld),this.ray.direction.set(0,0,-1).applyMatrix4(ud),this}intersectObject(t,e=!0,n=[]){return Lh(t,this,n,e),n.sort(fd),n}intersectObjects(t,e=!0,n=[]){for(let s=0,r=t.length;s<r;s++)Lh(t[s],this,n,e);return n.sort(fd),n}}function fd(i,t){return i.distance-t.distance}function Lh(i,t,e,n){let s=!0;if(i.layers.test(t.layers)&&i.raycast(t,e)===!1&&(s=!1),s===!0&&n===!0){const r=i.children;for(let a=0,o=r.length;a<o;a++)Lh(r[a],t,e,!0)}}class j_{constructor(t=!0){this.autoStart=t,this.startTime=0,this.oldTime=0,this.elapsedTime=0,this.running=!1,_t("Clock: This module has been deprecated. Please use THREE.Timer instead.")}start(){this.startTime=performance.now(),this.oldTime=this.startTime,this.elapsedTime=0,this.running=!0}stop(){this.getElapsedTime(),this.running=!1,this.autoStart=!1}getElapsedTime(){return this.getDelta(),this.elapsedTime}getDelta(){let t=0;if(this.autoStart&&!this.running)return this.start(),0;if(this.running){const e=performance.now();t=(e-this.oldTime)/1e3,this.oldTime=e,this.elapsedTime+=t}return t}}class tv{constructor(t=1,e=0,n=0){this.radius=t,this.phi=e,this.theta=n}set(t,e,n){return this.radius=t,this.phi=e,this.theta=n,this}copy(t){return this.radius=t.radius,this.phi=t.phi,this.theta=t.theta,this}makeSafe(){return this.phi=Xt(this.phi,1e-6,Math.PI-1e-6),this}setFromVector3(t){return this.setFromCartesianCoords(t.x,t.y,t.z)}setFromCartesianCoords(t,e,n){return this.radius=Math.sqrt(t*t+e*e+n*n),this.radius===0?(this.theta=0,this.phi=0):(this.theta=Math.atan2(t,n),this.phi=Math.acos(Xt(e/this.radius,-1,1))),this}clone(){return new this.constructor().copy(this)}}class ev{constructor(t=1,e=0,n=0){this.radius=t,this.theta=e,this.y=n}set(t,e,n){return this.radius=t,this.theta=e,this.y=n,this}copy(t){return this.radius=t.radius,this.theta=t.theta,this.y=t.y,this}setFromVector3(t){return this.setFromCartesianCoords(t.x,t.y,t.z)}setFromCartesianCoords(t,e,n){return this.radius=Math.sqrt(t*t+n*n),this.theta=Math.atan2(t,n),this.y=e,this}clone(){return new this.constructor().copy(this)}}class zu{static{zu.prototype.isMatrix2=!0}constructor(t,e,n,s){this.elements=[1,0,0,1],t!==void 0&&this.set(t,e,n,s)}identity(){return this.set(1,0,0,1),this}fromArray(t,e=0){for(let n=0;n<4;n++)this.elements[n]=t[n+e];return this}set(t,e,n,s){const r=this.elements;return r[0]=t,r[2]=e,r[1]=n,r[3]=s,this}}const dd=new lt;class vm{constructor(t=new lt(1/0,1/0),e=new lt(-1/0,-1/0)){this.isBox2=!0,this.min=t,this.max=e}set(t,e){return this.min.copy(t),this.max.copy(e),this}setFromPoints(t){this.makeEmpty();for(let e=0,n=t.length;e<n;e++)this.expandByPoint(t[e]);return this}setFromCenterAndSize(t,e){const n=dd.copy(e).multiplyScalar(.5);return this.min.copy(t).sub(n),this.max.copy(t).add(n),this}clone(){return new this.constructor().copy(this)}copy(t){return this.min.copy(t.min),this.max.copy(t.max),this}makeEmpty(){return this.min.x=this.min.y=1/0,this.max.x=this.max.y=-1/0,this}isEmpty(){return this.max.x<this.min.x||this.max.y<this.min.y}getCenter(t){return this.isEmpty()?t.set(0,0):t.addVectors(this.min,this.max).multiplyScalar(.5)}getSize(t){return this.isEmpty()?t.set(0,0):t.subVectors(this.max,this.min)}expandByPoint(t){return this.min.min(t),this.max.max(t),this}expandByVector(t){return this.min.sub(t),this.max.add(t),this}expandByScalar(t){return this.min.addScalar(-t),this.max.addScalar(t),this}containsPoint(t){return t.x>=this.min.x&&t.x<=this.max.x&&t.y>=this.min.y&&t.y<=this.max.y}containsBox(t){return this.min.x<=t.min.x&&t.max.x<=this.max.x&&this.min.y<=t.min.y&&t.max.y<=this.max.y}getParameter(t,e){return e.set((t.x-this.min.x)/(this.max.x-this.min.x),(t.y-this.min.y)/(this.max.y-this.min.y))}intersectsBox(t){return t.max.x>=this.min.x&&t.min.x<=this.max.x&&t.max.y>=this.min.y&&t.min.y<=this.max.y}clampPoint(t,e){return e.copy(t).clamp(this.min,this.max)}distanceToPoint(t){return this.clampPoint(t,dd).distanceTo(t)}intersect(t){return this.min.max(t.min),this.max.min(t.max),this.isEmpty()&&this.makeEmpty(),this}union(t){return this.min.min(t.min),this.max.max(t.max),this}translate(t){return this.min.add(t),this.max.add(t),this}equals(t){return t.min.equals(this.min)&&t.max.equals(this.max)}}const pd=new I,xo=new I,Qs=new I,zs=new I,th=new I,nv=new I,iv=new I;class sv{constructor(t=new I,e=new I){this.start=t,this.end=e}set(t,e){return this.start.copy(t),this.end.copy(e),this}copy(t){return this.start.copy(t.start),this.end.copy(t.end),this}getCenter(t){return t.addVectors(this.start,this.end).multiplyScalar(.5)}delta(t){return t.subVectors(this.end,this.start)}distanceSq(){return this.start.distanceToSquared(this.end)}distance(){return this.start.distanceTo(this.end)}at(t,e){return this.delta(e).multiplyScalar(t).add(this.start)}closestPointToPointParameter(t,e){pd.subVectors(t,this.start),xo.subVectors(this.end,this.start);const n=xo.dot(xo);if(n===0)return 0;let r=xo.dot(pd)/n;return e&&(r=Xt(r,0,1)),r}closestPointToPoint(t,e,n){const s=this.closestPointToPointParameter(t,e);return this.delta(n).multiplyScalar(s).add(this.start)}distanceSqToLine3(t,e=nv,n=iv){const s=10000000000000001e-32;let r,a;const o=this.start,l=t.start,c=this.end,h=t.end;Qs.subVectors(c,o),zs.subVectors(h,l),th.subVectors(o,l);const f=Qs.dot(Qs),u=zs.dot(zs),d=zs.dot(th);if(f<=s&&u<=s)return e.copy(o),n.copy(l),e.sub(n),e.dot(e);if(f<=s)r=0,a=d/u,a=Xt(a,0,1);else{const p=Qs.dot(th);if(u<=s)a=0,r=Xt(-p/f,0,1);else{const g=Qs.dot(zs),m=f*u-g*g;m!==0?r=Xt((g*d-p*u)/m,0,1):r=0,a=(g*r+d)/u,a<0?(a=0,r=Xt(-p/f,0,1)):a>1&&(a=1,r=Xt((g-p)/f,0,1))}}return e.copy(o).addScaledVector(Qs,r),n.copy(l).addScaledVector(zs,a),e.distanceToSquared(n)}applyMatrix4(t){return this.start.applyMatrix4(t),this.end.applyMatrix4(t),this}equals(t){return t.start.equals(this.start)&&t.end.equals(this.end)}clone(){return new this.constructor().copy(this)}}const Ad=new I;class rv extends he{constructor(t,e){super(),this.light=t,this.matrixAutoUpdate=!1,this.color=e,this.type="SpotLightHelper";const n=new $t,s=[0,0,0,0,0,1,0,0,0,1,0,1,0,0,0,-1,0,1,0,0,0,0,1,1,0,0,0,0,-1,1];for(let a=0,o=1,l=32;a<l;a++,o++){const c=a/l*Math.PI*2,h=o/l*Math.PI*2;s.push(Math.cos(c),Math.sin(c),1,Math.cos(h),Math.sin(h),1)}n.setAttribute("position",new Ft(s,3));const r=new ln({fog:!1,toneMapped:!1});this.cone=new ni(n,r),this.add(this.cone),this.update()}dispose(){super.dispose(),this.cone.geometry.dispose(),this.cone.material.dispose()}update(){this.light.updateWorldMatrix(!0,!1),this.light.target.updateWorldMatrix(!0,!1),this.parent?(this.parent.updateWorldMatrix(!0),this.matrix.copy(this.parent.matrixWorld).invert().multiply(this.light.matrixWorld)):this.matrix.copy(this.light.matrixWorld),this.matrixWorldNeedsUpdate=!0;const t=this.light.distance?this.light.distance:1e3,e=t*Math.tan(this.light.angle);this.cone.scale.set(e,e,t),Ad.setFromMatrixPosition(this.light.target.matrixWorld),this.cone.lookAt(Ad),this.color!==void 0?this.cone.material.color.set(this.color):this.cone.material.color.copy(this.light.color)}}const Ci=new I,_o=new Kt,eh=new Kt;class av extends ni{constructor(t){const e=ym(t),n=new $t,s=[],r=[];for(let c=0;c<e.length;c++){const h=e[c];h.parent&&h.parent.isBone&&(s.push(0,0,0),s.push(0,0,0),r.push(0,0,0),r.push(0,0,0))}n.setAttribute("position",new Ft(s,3)),n.setAttribute("color",new Ft(r,3));const a=new ln({vertexColors:!0,depthTest:!1,depthWrite:!1,toneMapped:!1,transparent:!0});super(n,a),this.isSkeletonHelper=!0,this.type="SkeletonHelper",this.root=t,this.bones=e,this.matrix=t.matrixWorld,this.matrixAutoUpdate=!1;const o=new bt(255),l=new bt(65280);this.setColors(o,l)}updateMatrixWorld(t){const e=this.bones,n=this.geometry,s=n.getAttribute("position");eh.copy(this.root.matrixWorld).invert();for(let r=0,a=0;r<e.length;r++){const o=e[r];o.parent&&o.parent.isBone&&(_o.multiplyMatrices(eh,o.matrixWorld),Ci.setFromMatrixPosition(_o),s.setXYZ(a,Ci.x,Ci.y,Ci.z),_o.multiplyMatrices(eh,o.parent.matrixWorld),Ci.setFromMatrixPosition(_o),s.setXYZ(a+1,Ci.x,Ci.y,Ci.z),a+=2)}n.getAttribute("position").needsUpdate=!0,super.updateMatrixWorld(t)}setColors(t,e){const s=this.geometry.getAttribute("color");for(let r=0;r<s.count;r+=2)s.setXYZ(r,t.r,t.g,t.b),s.setXYZ(r+1,e.r,e.g,e.b);return s.needsUpdate=!0,this}dispose(){super.dispose(),this.geometry.dispose(),this.material.dispose()}}function ym(i){const t=[];i.isBone===!0&&t.push(i);for(let e=0;e<i.children.length;e++)t.push(...ym(i.children[e]));return t}class ov extends Ce{constructor(t,e,n){const s=new ba(e,4,2),r=new Oi({wireframe:!0,fog:!1,toneMapped:!1});super(s,r),this.light=t,this.color=n,this.type="PointLightHelper",this.matrix=this.light.matrixWorld,this.matrixAutoUpdate=!1,this.update()}dispose(){super.dispose(),this.geometry.dispose(),this.material.dispose()}update(){this.matrixWorldNeedsUpdate=!0,this.light.updateWorldMatrix(!0,!1),this.color!==void 0?this.material.color.set(this.color):this.material.color.copy(this.light.color)}}const lv=new I,md=new bt,gd=new bt;class cv extends he{constructor(t,e,n){super(),this.light=t,this.matrix=t.matrixWorld,this.matrixAutoUpdate=!1,this.color=n,this.type="HemisphereLightHelper";const s=new wa(e);s.rotateY(Math.PI*.5),this.material=new Oi({wireframe:!0,fog:!1,toneMapped:!1}),this.color===void 0&&(this.material.vertexColors=!0);const r=s.getAttribute("position"),a=new Float32Array(r.count*3);s.setAttribute("color",new fe(a,3)),this.add(new Ce(s,this.material)),this.update()}dispose(){super.dispose(),this.children[0].geometry.dispose(),this.children[0].material.dispose()}update(){const t=this.children[0];if(this.color!==void 0)this.material.color.set(this.color);else{const e=t.geometry.getAttribute("color");md.copy(this.light.color),gd.copy(this.light.groundColor);for(let n=0,s=e.count;n<s;n++){const r=n<s/2?md:gd;e.setXYZ(n,r.r,r.g,r.b)}e.needsUpdate=!0}this.matrixWorldNeedsUpdate=!0,this.light.updateWorldMatrix(!0,!1),t.lookAt(lv.setFromMatrixPosition(this.light.matrixWorld).negate())}}class hv extends ni{constructor(t=10,e=10,n=4473924,s=8947848){n=new bt(n),s=new bt(s);const r=e/2,a=t/e,o=t/2,l=[],c=[];for(let u=0,d=0,p=-o;u<=e;u++,p+=a){l.push(-o,0,p,o,0,p),l.push(p,0,-o,p,0,o);const g=u===r?n:s;g.toArray(c,d),d+=3,g.toArray(c,d),d+=3,g.toArray(c,d),d+=3,g.toArray(c,d),d+=3}const h=new $t;h.setAttribute("position",new Ft(l,3)),h.setAttribute("color",new Ft(c,3));const f=new ln({vertexColors:!0,toneMapped:!1});super(h,f),this.type="GridHelper"}dispose(){super.dispose(),this.geometry.dispose(),this.material.dispose()}}class uv extends ni{constructor(t=10,e=16,n=8,s=64,r=4473924,a=8947848){r=new bt(r),a=new bt(a);const o=[],l=[];if(e>1)for(let f=0;f<e;f++){const u=f/e*(Math.PI*2),d=Math.sin(u)*t,p=Math.cos(u)*t;o.push(0,0,0),o.push(d,0,p);const g=f&1?r:a;l.push(g.r,g.g,g.b),l.push(g.r,g.g,g.b)}for(let f=0;f<n;f++){const u=f&1?r:a,d=t-t/n*f;for(let p=0;p<s;p++){let g=p/s*(Math.PI*2),m=Math.sin(g)*d,A=Math.cos(g)*d;o.push(m,0,A),l.push(u.r,u.g,u.b),g=(p+1)/s*(Math.PI*2),m=Math.sin(g)*d,A=Math.cos(g)*d,o.push(m,0,A),l.push(u.r,u.g,u.b)}}const c=new $t;c.setAttribute("position",new Ft(o,3)),c.setAttribute("color",new Ft(l,3));const h=new ln({vertexColors:!0,toneMapped:!1});super(c,h),this.type="PolarGridHelper"}dispose(){super.dispose(),this.geometry.dispose(),this.material.dispose()}}const xd=new I,vo=new I,_d=new I;class fv extends he{constructor(t,e,n){super(),this.light=t,this.matrix=t.matrixWorld,this.matrixAutoUpdate=!1,this.color=n,this.type="DirectionalLightHelper",e===void 0&&(e=1);let s=new $t;s.setAttribute("position",new Ft([-e,e,0,e,e,0,e,-e,0,-e,-e,0,-e,e,0],3));const r=new ln({fog:!1,toneMapped:!1});this.lightPlane=new Ni(s,r),this.add(this.lightPlane),s=new $t,s.setAttribute("position",new Ft([0,0,0,0,0,1],3)),this.targetLine=new Ni(s,r),this.add(this.targetLine),this.update()}dispose(){super.dispose(),this.lightPlane.geometry.dispose(),this.lightPlane.material.dispose(),this.targetLine.geometry.dispose(),this.targetLine.material.dispose()}update(){this.matrixWorldNeedsUpdate=!0,this.light.updateWorldMatrix(!0,!1),this.light.target.updateWorldMatrix(!0,!1),xd.setFromMatrixPosition(this.light.matrixWorld),vo.setFromMatrixPosition(this.light.target.matrixWorld),_d.subVectors(vo,xd),this.lightPlane.lookAt(vo),this.color!==void 0?(this.lightPlane.material.color.set(this.color),this.targetLine.material.color.set(this.color)):(this.lightPlane.material.color.copy(this.light.color),this.targetLine.material.color.copy(this.light.color)),this.targetLine.lookAt(vo),this.targetLine.scale.z=_d.length()}}const yo=new I,Ee=new pc;class dv extends ni{constructor(t){const e=new $t,n=new ln({color:16777215,vertexColors:!0,toneMapped:!1}),s=[],r=[],a={};o("n1","n2"),o("n2","n4"),o("n4","n3"),o("n3","n1"),o("f1","f2"),o("f2","f4"),o("f4","f3"),o("f3","f1"),o("n1","f1"),o("n2","f2"),o("n3","f3"),o("n4","f4"),o("p","n1"),o("p","n2"),o("p","n3"),o("p","n4"),o("u1","u2"),o("u2","u3"),o("u3","u1"),o("c","t"),o("p","c"),o("cn1","cn2"),o("cn3","cn4"),o("cf1","cf2"),o("cf3","cf4");function o(p,g){l(p),l(g)}function l(p){s.push(0,0,0),r.push(0,0,0),a[p]===void 0&&(a[p]=[]),a[p].push(s.length/3-1)}e.setAttribute("position",new Ft(s,3)),e.setAttribute("color",new Ft(r,3)),super(e,n),this.type="CameraHelper",this.camera=t,this.camera.updateProjectionMatrix&&this.camera.updateProjectionMatrix(),this.matrix=t.matrixWorld,this.matrixAutoUpdate=!1,this.pointMap=a,this.update();const c=new bt(16755200),h=new bt(16711680),f=new bt(43775),u=new bt(16777215),d=new bt(3355443);this.setColors(c,h,f,u,d)}setColors(t,e,n,s,r){const o=this.geometry.getAttribute("color");return o.setXYZ(0,t.r,t.g,t.b),o.setXYZ(1,t.r,t.g,t.b),o.setXYZ(2,t.r,t.g,t.b),o.setXYZ(3,t.r,t.g,t.b),o.setXYZ(4,t.r,t.g,t.b),o.setXYZ(5,t.r,t.g,t.b),o.setXYZ(6,t.r,t.g,t.b),o.setXYZ(7,t.r,t.g,t.b),o.setXYZ(8,t.r,t.g,t.b),o.setXYZ(9,t.r,t.g,t.b),o.setXYZ(10,t.r,t.g,t.b),o.setXYZ(11,t.r,t.g,t.b),o.setXYZ(12,t.r,t.g,t.b),o.setXYZ(13,t.r,t.g,t.b),o.setXYZ(14,t.r,t.g,t.b),o.setXYZ(15,t.r,t.g,t.b),o.setXYZ(16,t.r,t.g,t.b),o.setXYZ(17,t.r,t.g,t.b),o.setXYZ(18,t.r,t.g,t.b),o.setXYZ(19,t.r,t.g,t.b),o.setXYZ(20,t.r,t.g,t.b),o.setXYZ(21,t.r,t.g,t.b),o.setXYZ(22,t.r,t.g,t.b),o.setXYZ(23,t.r,t.g,t.b),o.setXYZ(24,e.r,e.g,e.b),o.setXYZ(25,e.r,e.g,e.b),o.setXYZ(26,e.r,e.g,e.b),o.setXYZ(27,e.r,e.g,e.b),o.setXYZ(28,e.r,e.g,e.b),o.setXYZ(29,e.r,e.g,e.b),o.setXYZ(30,e.r,e.g,e.b),o.setXYZ(31,e.r,e.g,e.b),o.setXYZ(32,n.r,n.g,n.b),o.setXYZ(33,n.r,n.g,n.b),o.setXYZ(34,n.r,n.g,n.b),o.setXYZ(35,n.r,n.g,n.b),o.setXYZ(36,n.r,n.g,n.b),o.setXYZ(37,n.r,n.g,n.b),o.setXYZ(38,s.r,s.g,s.b),o.setXYZ(39,s.r,s.g,s.b),o.setXYZ(40,r.r,r.g,r.b),o.setXYZ(41,r.r,r.g,r.b),o.setXYZ(42,r.r,r.g,r.b),o.setXYZ(43,r.r,r.g,r.b),o.setXYZ(44,r.r,r.g,r.b),o.setXYZ(45,r.r,r.g,r.b),o.setXYZ(46,r.r,r.g,r.b),o.setXYZ(47,r.r,r.g,r.b),o.setXYZ(48,r.r,r.g,r.b),o.setXYZ(49,r.r,r.g,r.b),o.needsUpdate=!0,this}update(){const t=this.geometry,e=this.pointMap,n=1,s=1;let r,a;if(Ee.projectionMatrixInverse.copy(this.camera.projectionMatrixInverse),this.camera.reversedDepth===!0)r=1,a=0;else if(this.camera.coordinateSystem===vn)r=-1,a=1;else if(this.camera.coordinateSystem===us)r=0,a=1;else throw new Error("THREE.CameraHelper.update(): Invalid coordinate system: "+this.camera.coordinateSystem);we("c",e,t,Ee,0,0,r),we("t",e,t,Ee,0,0,a),we("n1",e,t,Ee,-n,-s,r),we("n2",e,t,Ee,n,-s,r),we("n3",e,t,Ee,-n,s,r),we("n4",e,t,Ee,n,s,r),we("f1",e,t,Ee,-n,-s,a),we("f2",e,t,Ee,n,-s,a),we("f3",e,t,Ee,-n,s,a),we("f4",e,t,Ee,n,s,a),we("u1",e,t,Ee,n*.7,s*1.1,r),we("u2",e,t,Ee,-n*.7,s*1.1,r),we("u3",e,t,Ee,0,s*2,r),we("cf1",e,t,Ee,-n,0,a),we("cf2",e,t,Ee,n,0,a),we("cf3",e,t,Ee,0,-s,a),we("cf4",e,t,Ee,0,s,a),we("cn1",e,t,Ee,-n,0,r),we("cn2",e,t,Ee,n,0,r),we("cn3",e,t,Ee,0,-s,r),we("cn4",e,t,Ee,0,s,r),t.getAttribute("position").needsUpdate=!0}dispose(){super.dispose(),this.geometry.dispose(),this.material.dispose()}}function we(i,t,e,n,s,r,a){yo.set(s,r,a).unproject(n);const o=t[i];if(o!==void 0){const l=e.getAttribute("position");for(let c=0,h=o.length;c<h;c++)l.setXYZ(o[c],yo.x,yo.y,yo.z)}}const Mo=new Ze;class pv extends ni{constructor(t,e=16776960){const n=new Uint16Array([0,1,1,2,2,3,3,0,4,5,5,6,6,7,7,4,0,4,1,5,2,6,3,7]),s=new Float32Array(24),r=new $t;r.setIndex(new fe(n,1)),r.setAttribute("position",new fe(s,3)),super(r,new ln({color:e,toneMapped:!1})),this.object=t,this.type="BoxHelper",this.matrixAutoUpdate=!1,this.update()}update(){if(this.object!==void 0&&Mo.setFromObject(this.object),Mo.isEmpty())return;const t=Mo.min,e=Mo.max,n=this.geometry.attributes.position,s=n.array;s[0]=e.x,s[1]=e.y,s[2]=e.z,s[3]=t.x,s[4]=e.y,s[5]=e.z,s[6]=t.x,s[7]=t.y,s[8]=e.z,s[9]=e.x,s[10]=t.y,s[11]=e.z,s[12]=e.x,s[13]=e.y,s[14]=t.z,s[15]=t.x,s[16]=e.y,s[17]=t.z,s[18]=t.x,s[19]=t.y,s[20]=t.z,s[21]=e.x,s[22]=t.y,s[23]=t.z,n.needsUpdate=!0,this.geometry.computeBoundingSphere()}setFromObject(t){return this.object=t,this.update(),this}copy(t,e){return super.copy(t,e),this.object=t.object,this}dispose(){super.dispose(),this.geometry.dispose(),this.material.dispose()}}class Av extends ni{constructor(t,e=16776960){const n=new Uint16Array([0,1,1,2,2,3,3,0,4,5,5,6,6,7,7,4,0,4,1,5,2,6,3,7]),s=[1,1,1,-1,1,1,-1,-1,1,1,-1,1,1,1,-1,-1,1,-1,-1,-1,-1,1,-1,-1],r=new $t;r.setIndex(new fe(n,1)),r.setAttribute("position",new Ft(s,3)),super(r,new ln({color:e,toneMapped:!1})),this.box=t,this.type="Box3Helper",this.geometry.computeBoundingSphere()}updateMatrixWorld(t){const e=this.box;e.isEmpty()||(e.getCenter(this.position),e.getSize(this.scale),this.scale.multiplyScalar(.5),super.updateMatrixWorld(t))}dispose(){super.dispose(),this.geometry.dispose(),this.material.dispose()}}class mv extends Ni{constructor(t,e=1,n=16776960){const s=n,r=[1,-1,0,-1,1,0,-1,-1,0,1,1,0,-1,1,0,-1,-1,0,1,-1,0,1,1,0],a=new $t;a.setAttribute("position",new Ft(r,3)),a.computeBoundingSphere(),super(a,new ln({color:s,toneMapped:!1})),this.type="PlaneHelper",this.plane=t,this.size=e;const o=[1,1,0,-1,1,0,-1,-1,0,1,1,0,-1,-1,0,1,-1,0],l=new $t;l.setAttribute("position",new Ft(o,3)),l.computeBoundingSphere(),this.add(new Ce(l,new Oi({color:s,opacity:.2,transparent:!0,depthWrite:!1,toneMapped:!1})))}updateMatrixWorld(t){this.position.set(0,0,0),this.scale.set(.5*this.size,.5*this.size,1),this.lookAt(this.plane.normal),this.translateZ(-this.plane.constant),super.updateMatrixWorld(t)}dispose(){super.dispose(),this.geometry.dispose(),this.material.dispose(),this.children[0].geometry.dispose(),this.children[0].material.dispose()}}const vd=new I;let Eo,nh;class gv extends he{constructor(t=new I(0,0,1),e=new I(0,0,0),n=1,s=16776960,r=n*.2,a=r*.2){super(),this.type="ArrowHelper",Eo===void 0&&(Eo=new $t,Eo.setAttribute("position",new Ft([0,0,0,0,1,0],3)),nh=new Ea(.5,1,5,1),nh.translate(0,-.5,0)),this.position.copy(e),this.line=new Ni(Eo,new ln({color:s,toneMapped:!1})),this.line.matrixAutoUpdate=!1,this.add(this.line),this.cone=new Ce(nh,new Oi({color:s,toneMapped:!1})),this.cone.matrixAutoUpdate=!1,this.add(this.cone),this.setDirection(t),this.setLength(n,r,a)}setDirection(t){if(t.y>.99999)this.quaternion.set(0,0,0,1);else if(t.y<-.99999)this.quaternion.set(1,0,0,0);else{vd.set(t.z,0,-t.x).normalize();const e=Math.acos(t.y);this.quaternion.setFromAxisAngle(vd,e)}}setLength(t,e=t*.2,n=e*.2){this.line.scale.set(1,Math.max(1e-4,t-e),1),this.line.updateMatrix(),this.cone.scale.set(n,e,n),this.cone.position.y=t,this.cone.updateMatrix()}setColor(t){this.line.material.color.set(t),this.cone.material.color.set(t)}copy(t){return super.copy(t,!1),this.line.copy(t.line),this.cone.copy(t.cone),this}dispose(){super.dispose(),this.line.geometry.dispose(),this.line.material.dispose(),this.cone.geometry.dispose(),this.cone.material.dispose()}}class xv extends ni{constructor(t=1){const e=[0,0,0,t,0,0,0,0,0,0,t,0,0,0,0,0,0,t],n=[1,0,0,1,.6,0,0,1,0,.6,1,0,0,0,1,0,.6,1],s=new $t;s.setAttribute("position",new Ft(e,3)),s.setAttribute("color",new Ft(n,3));const r=new ln({vertexColors:!0,toneMapped:!1});super(s,r),this.type="AxesHelper"}setColors(t,e,n){const s=new bt,r=this.geometry.attributes.color.array;return s.set(t),s.toArray(r,0),s.toArray(r,3),s.set(e),s.toArray(r,6),s.toArray(r,9),s.set(n),s.toArray(r,12),s.toArray(r,15),this.geometry.attributes.color.needsUpdate=!0,this}dispose(){super.dispose(),this.geometry.dispose(),this.material.dispose()}}class _v{constructor(){this.type="ShapePath",this.color=new bt,this.subPaths=[],this.currentPath=null,this.userData={}}moveTo(t,e){return this.currentPath=new ca,this.subPaths.push(this.currentPath),this.currentPath.moveTo(t,e),this}lineTo(t,e){return this.currentPath.lineTo(t,e),this}quadraticCurveTo(t,e,n,s){return this.currentPath.quadraticCurveTo(t,e,n,s),this}bezierCurveTo(t,e,n,s,r,a){return this.currentPath.bezierCurveTo(t,e,n,s,r,a),this}splineThru(t){return this.currentPath.splineThru(t),this}toShapes(){function t(l,c){let h=!1;const f=c.length;for(let u=0,d=f-1;u<f;d=u++){const p=c[u],g=c[d];p.y>l.y!=g.y>l.y&&l.x<(g.x-p.x)*(l.y-p.y)/(g.y-p.y)+p.x&&(h=!h)}return h}function e(l,c){const h=c.getCenter(new lt);if(t(h,l))return h;const f=h.y,u=[],d=l.length;for(let p=0;p<d;p++){const g=l[p],m=l[(p+1)%d];if(g.y>f!=m.y>f){const A=g.x+(f-g.y)*(m.x-g.x)/(m.y-g.y);u.push(A)}}return u.length>1&&(u.sort((p,g)=>p-g),h.x=(u[0]+u[1])/2),h}let n=this.userData.style&&this.userData.style.fillRule||"nonzero";n!=="nonzero"&&n!=="evenodd"&&(_t('Fill-rule "'+n+'" is not supported, falling back to "nonzero".'),n="nonzero");const s=n==="nonzero"?(l=>l!==0):(l=>(l&1)!==0),r=[];for(const l of this.subPaths){const c=l.getPoints();if(c.length<3)continue;const h=Un.area(c);if(h===0)continue;const f=new vm;for(let u=0;u<c.length;u++)f.expandByPoint(c[u]);r.push({subPath:l,points:c,boundingBox:f,interiorPoint:e(c,f),absArea:Math.abs(h),winding:h<0?-1:1,container:null,exclude:!1,role:null})}r.sort((l,c)=>c.absArea-l.absArea);for(let l=0;l<r.length;l++){const c=r[l];let h=0;for(let f=l-1;f>=0;f--){const u=r[f];if(u.boundingBox.containsBox(c.boundingBox)&&t(c.interiorPoint,u.points)){c.container=u.exclude?u.container:u,h=u.winding,c.winding+=h;break}}s(c.winding)===s(h)&&(c.exclude=!0)}for(const l of r)l.exclude||(l.role=l.container===null||l.container.role==="hole"?"outer":"hole");const a=[],o=new Map;for(const l of r){if(l.exclude||l.role!=="outer")continue;const c=new Sa;c.curves=l.subPath.curves,a.push(c),o.set(l,c)}for(const l of r){if(l.exclude||l.role!=="hole")continue;const c=o.get(l.container);if(!c)continue;const h=new ca;h.curves=l.subPath.curves,c.holes.push(h)}return a}}class vv extends zn{constructor(t,e=null){super(),this.object=t,this.domElement=e,this.enabled=!0,this.state=-1,this.keys={},this.mouseButtons={LEFT:null,MIDDLE:null,RIGHT:null},this.touches={ONE:null,TWO:null}}connect(t){this.domElement!==null&&this.disconnect(),this.domElement=t}disconnect(){}dispose(){}update(){}}function yv(i,t){const e=i.image&&i.image.width?i.image.width/i.image.height:1;return e>t?(i.repeat.x=1,i.repeat.y=e/t,i.offset.x=0,i.offset.y=(1-i.repeat.y)/2):(i.repeat.x=t/e,i.repeat.y=1,i.offset.x=(1-i.repeat.x)/2,i.offset.y=0),i}function Mv(i,t){const e=i.image&&i.image.width?i.image.width/i.image.height:1;return e>t?(i.repeat.x=t/e,i.repeat.y=1,i.offset.x=(1-i.repeat.x)/2,i.offset.y=0):(i.repeat.x=1,i.repeat.y=e/t,i.offset.x=0,i.offset.y=(1-i.repeat.y)/2),i}function Ev(i){return i.repeat.x=1,i.repeat.y=1,i.offset.x=0,i.offset.y=0,i}function Fh(i,t,e,n){const s=Sv(n);switch(e){case fu:return i*t;case Ul:return i*t/s.components*s.byteLength;case va:return i*t/s.components*s.byteLength;case Fi:return i*t*2/s.components*s.byteLength;case Nl:return i*t*2/s.components*s.byteLength;case du:return i*t*3/s.components*s.byteLength;case Je:return i*t*4/s.components*s.byteLength;case Ol:return i*t*4/s.components*s.byteLength;case Vr:case Wr:return Math.floor((i+3)/4)*Math.floor((t+3)/4)*8;case Yr:case Xr:return Math.floor((i+3)/4)*Math.floor((t+3)/4)*16;case Vo:case Yo:return Math.max(i,16)*Math.max(t,8)/4;case Ho:case Wo:return Math.max(i,8)*Math.max(t,8)/2;case Xo:case qo:case Jo:case Zo:return Math.floor((i+3)/4)*Math.floor((t+3)/4)*8;case Ko:case ea:case $o:return Math.floor((i+3)/4)*Math.floor((t+3)/4)*16;case jo:return Math.floor((i+3)/4)*Math.floor((t+3)/4)*16;case tl:return Math.floor((i+4)/5)*Math.floor((t+3)/4)*16;case el:return Math.floor((i+4)/5)*Math.floor((t+4)/5)*16;case nl:return Math.floor((i+5)/6)*Math.floor((t+4)/5)*16;case il:return Math.floor((i+5)/6)*Math.floor((t+5)/6)*16;case sl:return Math.floor((i+7)/8)*Math.floor((t+4)/5)*16;case rl:return Math.floor((i+7)/8)*Math.floor((t+5)/6)*16;case al:return Math.floor((i+7)/8)*Math.floor((t+7)/8)*16;case ol:return Math.floor((i+9)/10)*Math.floor((t+4)/5)*16;case ll:return Math.floor((i+9)/10)*Math.floor((t+5)/6)*16;case cl:return Math.floor((i+9)/10)*Math.floor((t+7)/8)*16;case hl:return Math.floor((i+9)/10)*Math.floor((t+9)/10)*16;case ul:return Math.floor((i+11)/12)*Math.floor((t+9)/10)*16;case fl:return Math.floor((i+11)/12)*Math.floor((t+11)/12)*16;case dl:case pl:case Al:return Math.ceil(i/4)*Math.ceil(t/4)*16;case ml:case gl:return Math.ceil(i/4)*Math.ceil(t/4)*8;case na:case xl:return Math.ceil(i/4)*Math.ceil(t/4)*16}throw new Error(`Unable to determine texture byte length for ${e} format.`)}function Sv(i){switch(i){case en:case lu:return{byteLength:1,components:1};case ar:case cu:case Gn:return{byteLength:2,components:1};case Ll:case Fl:return{byteLength:2,components:4};case Tn:case Pl:case sn:return{byteLength:4,components:1};case hu:case uu:return{byteLength:4,components:3}}throw new Error(`THREE.TextureUtils: Unknown texture type ${i}.`)}class wv{static contain(t,e){return yv(t,e)}static cover(t,e){return Mv(t,e)}static fill(t){return Ev(t)}static getByteLength(t,e,n,s){return Fh(t,e,n,s)}}typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("register",{detail:{revision:Rl}}));typeof window<"u"&&(window.__THREE__?_t("WARNING: Multiple instances of Three.js being imported."):window.__THREE__=Rl);/**
 * @license
 * Copyright 2010-2026 Three.js Authors
 * SPDX-License-Identifier: MIT
 */function Mm(){let i=null,t=!1,e=null,n=null;function s(r,a){n=i.requestAnimationFrame(s),e(r,a)}return{start:function(){t!==!0&&e!==null&&i!==null&&(n=i.requestAnimationFrame(s),t=!0)},stop:function(){i!==null&&i.cancelAnimationFrame(n),t=!1},setAnimationLoop:function(r){e=r},setContext:function(r){i=r}}}function bv(i){const t=new WeakMap;function e(o,l){const c=o.array,h=o.usage,f=c.byteLength,u=i.createBuffer();i.bindBuffer(l,u),i.bufferData(l,c,h),o.onUploadCallback();let d;if(c instanceof Float32Array)d=i.FLOAT;else if(typeof Float16Array<"u"&&c instanceof Float16Array)d=i.HALF_FLOAT;else if(c instanceof Uint16Array)o.isFloat16BufferAttribute?d=i.HALF_FLOAT:d=i.UNSIGNED_SHORT;else if(c instanceof Int16Array)d=i.SHORT;else if(c instanceof Uint32Array)d=i.UNSIGNED_INT;else if(c instanceof Int32Array)d=i.INT;else if(c instanceof Int8Array)d=i.BYTE;else if(c instanceof Uint8Array)d=i.UNSIGNED_BYTE;else if(c instanceof Uint8ClampedArray)d=i.UNSIGNED_BYTE;else throw new Error("THREE.WebGLAttributes: Unsupported buffer data format: "+c);return{buffer:u,type:d,bytesPerElement:c.BYTES_PER_ELEMENT,version:o.version,size:f}}function n(o,l,c){const h=l.array,f=l.updateRanges;if(i.bindBuffer(c,o),f.length===0)i.bufferSubData(c,0,h);else{f.sort((d,p)=>d.start-p.start);let u=0;for(let d=1;d<f.length;d++){const p=f[u],g=f[d];g.start<=p.start+p.count+1?p.count=Math.max(p.count,g.start+g.count-p.start):(++u,f[u]=g)}f.length=u+1;for(let d=0,p=f.length;d<p;d++){const g=f[d];i.bufferSubData(c,g.start*h.BYTES_PER_ELEMENT,h,g.start,g.count)}l.clearUpdateRanges()}l.onUploadCallback()}function s(o){return o.isInterleavedBufferAttribute&&(o=o.data),t.get(o)}function r(o){o.isInterleavedBufferAttribute&&(o=o.data);const l=t.get(o);l&&(i.deleteBuffer(l.buffer),t.delete(o))}function a(o,l){if(o.isInterleavedBufferAttribute&&(o=o.data),o.isGLBufferAttribute){const h=t.get(o);(!h||h.version<o.version)&&t.set(o,{buffer:o.buffer,type:o.type,bytesPerElement:o.elementSize,version:o.version});return}const c=t.get(o);if(c===void 0)t.set(o,e(o,l));else if(c.version<o.version){if(c.size!==o.array.byteLength)throw new Error("THREE.WebGLAttributes: The size of the buffer attribute's array buffer does not match the original size. Resizing buffer attributes is not supported.");n(c.buffer,o,l),c.version=o.version}}return{get:s,remove:r,update:a}}var Cv=`#ifdef USE_ALPHAHASH
	if ( diffuseColor.a < getAlphaHashThreshold( vPosition ) ) discard;
#endif`,Tv=`#ifdef USE_ALPHAHASH
	const float ALPHA_HASH_SCALE = 0.05;
	float hash2D( vec2 value ) {
		return fract( 1.0e4 * sin( 17.0 * value.x + 0.1 * value.y ) * ( 0.1 + abs( sin( 13.0 * value.y + value.x ) ) ) );
	}
	float hash3D( vec3 value ) {
		return hash2D( vec2( hash2D( value.xy ), value.z ) );
	}
	float getAlphaHashThreshold( vec3 position ) {
		float maxDeriv = max(
			length( dFdx( position.xyz ) ),
			length( dFdy( position.xyz ) )
		);
		float pixScale = 1.0 / ( ALPHA_HASH_SCALE * maxDeriv );
		vec2 pixScales = vec2(
			exp2( floor( log2( pixScale ) ) ),
			exp2( ceil( log2( pixScale ) ) )
		);
		vec2 alpha = vec2(
			hash3D( floor( pixScales.x * position.xyz ) ),
			hash3D( floor( pixScales.y * position.xyz ) )
		);
		float lerpFactor = fract( log2( pixScale ) );
		float x = ( 1.0 - lerpFactor ) * alpha.x + lerpFactor * alpha.y;
		float a = min( lerpFactor, 1.0 - lerpFactor );
		vec3 cases = vec3(
			x * x / ( 2.0 * a * ( 1.0 - a ) ),
			( x - 0.5 * a ) / ( 1.0 - a ),
			1.0 - ( ( 1.0 - x ) * ( 1.0 - x ) / ( 2.0 * a * ( 1.0 - a ) ) )
		);
		float threshold = ( x < ( 1.0 - a ) )
			? ( ( x < a ) ? cases.x : cases.y )
			: cases.z;
		return clamp( threshold , 1.0e-6, 1.0 );
	}
#endif`,Bv=`#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, vAlphaMapUv ).g;
#endif`,Iv=`#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,Rv=`#ifdef USE_ALPHATEST
	#ifdef ALPHA_TO_COVERAGE
	diffuseColor.a = smoothstep( alphaTest, alphaTest + fwidth( diffuseColor.a ), diffuseColor.a );
	if ( diffuseColor.a == 0.0 ) discard;
	#else
	if ( diffuseColor.a < alphaTest ) discard;
	#endif
#endif`,Dv=`#ifdef USE_ALPHATEST
	uniform float alphaTest;
#endif`,Pv=`#ifdef USE_AOMAP
	float ambientOcclusion = ( texture2D( aoMap, vAoMapUv ).r - 1.0 ) * aoMapIntensity + 1.0;
	reflectedLight.indirectDiffuse *= ambientOcclusion;
	#if defined( USE_CLEARCOAT ) 
		clearcoatSpecularIndirect *= ambientOcclusion;
	#endif
	#if defined( USE_SHEEN ) 
		sheenSpecularIndirect *= ambientOcclusion;
	#endif
	#if defined( USE_ENVMAP ) && defined( STANDARD )
		float dotNV = saturate( dot( geometryNormal, geometryViewDir ) );
		reflectedLight.indirectSpecular *= computeSpecularOcclusion( dotNV, ambientOcclusion, material.roughness );
	#endif
#endif`,Lv=`#ifdef USE_AOMAP
	uniform sampler2D aoMap;
	uniform float aoMapIntensity;
#endif`,Fv=`#ifdef USE_BATCHING
	#if ! defined( GL_ANGLE_multi_draw )
	#define gl_DrawID _gl_DrawID
	uniform int _gl_DrawID;
	#endif
	uniform highp sampler2D batchingTexture;
	uniform highp usampler2D batchingIdTexture;
	mat4 getBatchingMatrix( const in float i ) {
		int size = textureSize( batchingTexture, 0 ).x;
		int j = int( i ) * 4;
		int x = j % size;
		int y = j / size;
		vec4 v1 = texelFetch( batchingTexture, ivec2( x, y ), 0 );
		vec4 v2 = texelFetch( batchingTexture, ivec2( x + 1, y ), 0 );
		vec4 v3 = texelFetch( batchingTexture, ivec2( x + 2, y ), 0 );
		vec4 v4 = texelFetch( batchingTexture, ivec2( x + 3, y ), 0 );
		return mat4( v1, v2, v3, v4 );
	}
	float getIndirectIndex( const in int i ) {
		int size = textureSize( batchingIdTexture, 0 ).x;
		int x = i % size;
		int y = i / size;
		return float( texelFetch( batchingIdTexture, ivec2( x, y ), 0 ).r );
	}
#endif
#ifdef USE_BATCHING_COLOR
	uniform sampler2D batchingColorTexture;
	vec4 getBatchingColor( const in float i ) {
		int size = textureSize( batchingColorTexture, 0 ).x;
		int j = int( i );
		int x = j % size;
		int y = j / size;
		return texelFetch( batchingColorTexture, ivec2( x, y ), 0 );
	}
#endif`,Uv=`#ifdef USE_BATCHING
	mat4 batchingMatrix = getBatchingMatrix( getIndirectIndex( gl_DrawID ) );
#endif`,Nv=`vec3 transformed = vec3( position );
#ifdef USE_ALPHAHASH
	vPosition = vec3( position );
#endif`,Ov=`vec3 objectNormal = vec3( normal );
#ifdef USE_TANGENT
	vec3 objectTangent = vec3( tangent.xyz );
#endif`,Gv=`float G_BlinnPhong_Implicit( ) {
	return 0.25;
}
float D_BlinnPhong( const in float shininess, const in float dotNH ) {
	return RECIPROCAL_PI * ( shininess * 0.5 + 1.0 ) * pow( dotNH, shininess );
}
vec3 BRDF_BlinnPhong( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in vec3 specularColor, const in float shininess ) {
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNH = saturate( dot( normal, halfDir ) );
	float dotVH = saturate( dot( viewDir, halfDir ) );
	vec3 F = F_Schlick( specularColor, 1.0, dotVH );
	float G = G_BlinnPhong_Implicit( );
	float D = D_BlinnPhong( shininess, dotNH );
	return F * ( G * D );
} // validated`,kv=`#ifdef USE_IRIDESCENCE
	const mat3 XYZ_TO_REC709 = mat3(
		 3.2404542, -0.9692660,  0.0556434,
		-1.5371385,  1.8760108, -0.2040259,
		-0.4985314,  0.0415560,  1.0572252
	);
	vec3 Fresnel0ToIor( vec3 fresnel0 ) {
		vec3 sqrtF0 = sqrt( fresnel0 );
		return ( vec3( 1.0 ) + sqrtF0 ) / ( vec3( 1.0 ) - sqrtF0 );
	}
	vec3 IorToFresnel0( vec3 transmittedIor, float incidentIor ) {
		return pow2( ( transmittedIor - vec3( incidentIor ) ) / ( transmittedIor + vec3( incidentIor ) ) );
	}
	float IorToFresnel0( float transmittedIor, float incidentIor ) {
		return pow2( ( transmittedIor - incidentIor ) / ( transmittedIor + incidentIor ));
	}
	vec3 evalSensitivity( float OPD, vec3 shift ) {
		float phase = 2.0 * PI * OPD * 1.0e-9;
		vec3 val = vec3( 5.4856e-13, 4.4201e-13, 5.2481e-13 );
		vec3 pos = vec3( 1.6810e+06, 1.7953e+06, 2.2084e+06 );
		vec3 var = vec3( 4.3278e+09, 9.3046e+09, 6.6121e+09 );
		vec3 xyz = val * sqrt( 2.0 * PI * var ) * cos( pos * phase + shift ) * exp( - pow2( phase ) * var );
		xyz.x += 9.7470e-14 * sqrt( 2.0 * PI * 4.5282e+09 ) * cos( 2.2399e+06 * phase + shift[ 0 ] ) * exp( - 4.5282e+09 * pow2( phase ) );
		xyz /= 1.0685e-7;
		vec3 rgb = XYZ_TO_REC709 * xyz;
		return rgb;
	}
	vec3 evalIridescence( float outsideIOR, float eta2, float cosTheta1, float thinFilmThickness, vec3 baseF0 ) {
		vec3 I;
		float iridescenceIOR = mix( outsideIOR, eta2, smoothstep( 0.0, 0.03, thinFilmThickness ) );
		float sinTheta2Sq = pow2( outsideIOR / iridescenceIOR ) * ( 1.0 - pow2( cosTheta1 ) );
		float cosTheta2Sq = 1.0 - sinTheta2Sq;
		if ( cosTheta2Sq < 0.0 ) {
			return vec3( 1.0 );
		}
		float cosTheta2 = sqrt( cosTheta2Sq );
		float R0 = IorToFresnel0( iridescenceIOR, outsideIOR );
		float R12 = F_Schlick( R0, 1.0, cosTheta1 );
		float T121 = 1.0 - R12;
		float phi12 = 0.0;
		if ( iridescenceIOR < outsideIOR ) phi12 = PI;
		float phi21 = PI - phi12;
		vec3 baseIOR = Fresnel0ToIor( clamp( baseF0, 0.0, 0.9999 ) );		vec3 R1 = IorToFresnel0( baseIOR, iridescenceIOR );
		vec3 R23 = F_Schlick( R1, 1.0, cosTheta2 );
		vec3 phi23 = vec3( 0.0 );
		if ( baseIOR[ 0 ] < iridescenceIOR ) phi23[ 0 ] = PI;
		if ( baseIOR[ 1 ] < iridescenceIOR ) phi23[ 1 ] = PI;
		if ( baseIOR[ 2 ] < iridescenceIOR ) phi23[ 2 ] = PI;
		float OPD = 2.0 * iridescenceIOR * thinFilmThickness * cosTheta2;
		vec3 phi = vec3( phi21 ) + phi23;
		vec3 R123 = clamp( R12 * R23, 1e-5, 0.9999 );
		vec3 r123 = sqrt( R123 );
		vec3 Rs = pow2( T121 ) * R23 / ( vec3( 1.0 ) - R123 );
		vec3 C0 = R12 + Rs;
		I = C0;
		vec3 Cm = Rs - T121;
		for ( int m = 1; m <= 2; ++ m ) {
			Cm *= r123;
			vec3 Sm = 2.0 * evalSensitivity( float( m ) * OPD, float( m ) * phi );
			I += Cm * Sm;
		}
		return max( I, vec3( 0.0 ) );
	}
#endif`,Qv=`#ifdef USE_BUMPMAP
	uniform sampler2D bumpMap;
	uniform float bumpScale;
	vec2 dHdxy_fwd() {
		vec2 dSTdx = dFdx( vBumpMapUv );
		vec2 dSTdy = dFdy( vBumpMapUv );
		float Hll = bumpScale * texture2D( bumpMap, vBumpMapUv ).x;
		float dBx = bumpScale * texture2D( bumpMap, vBumpMapUv + dSTdx ).x - Hll;
		float dBy = bumpScale * texture2D( bumpMap, vBumpMapUv + dSTdy ).x - Hll;
		return vec2( dBx, dBy );
	}
	vec3 perturbNormalArb( vec3 surf_pos, vec3 surf_norm, vec2 dHdxy, float faceDirection ) {
		vec3 vSigmaX = normalize( dFdx( surf_pos.xyz ) );
		vec3 vSigmaY = normalize( dFdy( surf_pos.xyz ) );
		vec3 vN = surf_norm;
		vec3 R1 = cross( vSigmaY, vN );
		vec3 R2 = cross( vN, vSigmaX );
		float fDet = dot( vSigmaX, R1 ) * faceDirection;
		vec3 vGrad = sign( fDet ) * ( dHdxy.x * R1 + dHdxy.y * R2 );
		return normalize( abs( fDet ) * surf_norm - vGrad );
	}
#endif`,zv=`#if NUM_CLIPPING_PLANES > 0
	vec4 plane;
	#ifdef ALPHA_TO_COVERAGE
		float distanceToPlane, distanceGradient;
		float clipOpacity = 1.0;
		#pragma unroll_loop_start
		for ( int i = 0; i < UNION_CLIPPING_PLANES; i ++ ) {
			plane = clippingPlanes[ i ];
			distanceToPlane = - dot( vClipPosition, plane.xyz ) + plane.w;
			distanceGradient = fwidth( distanceToPlane ) / 2.0;
			clipOpacity *= smoothstep( - distanceGradient, distanceGradient, distanceToPlane );
			if ( clipOpacity == 0.0 ) discard;
		}
		#pragma unroll_loop_end
		#if UNION_CLIPPING_PLANES < NUM_CLIPPING_PLANES
			float unionClipOpacity = 1.0;
			#pragma unroll_loop_start
			for ( int i = UNION_CLIPPING_PLANES; i < NUM_CLIPPING_PLANES; i ++ ) {
				plane = clippingPlanes[ i ];
				distanceToPlane = - dot( vClipPosition, plane.xyz ) + plane.w;
				distanceGradient = fwidth( distanceToPlane ) / 2.0;
				unionClipOpacity *= 1.0 - smoothstep( - distanceGradient, distanceGradient, distanceToPlane );
			}
			#pragma unroll_loop_end
			clipOpacity *= 1.0 - unionClipOpacity;
		#endif
		diffuseColor.a *= clipOpacity;
		if ( diffuseColor.a == 0.0 ) discard;
	#else
		#pragma unroll_loop_start
		for ( int i = 0; i < UNION_CLIPPING_PLANES; i ++ ) {
			plane = clippingPlanes[ i ];
			if ( dot( vClipPosition, plane.xyz ) > plane.w ) discard;
		}
		#pragma unroll_loop_end
		#if UNION_CLIPPING_PLANES < NUM_CLIPPING_PLANES
			bool clipped = true;
			#pragma unroll_loop_start
			for ( int i = UNION_CLIPPING_PLANES; i < NUM_CLIPPING_PLANES; i ++ ) {
				plane = clippingPlanes[ i ];
				clipped = ( dot( vClipPosition, plane.xyz ) > plane.w ) && clipped;
			}
			#pragma unroll_loop_end
			if ( clipped ) discard;
		#endif
	#endif
#endif`,Hv=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
	uniform vec4 clippingPlanes[ NUM_CLIPPING_PLANES ];
#endif`,Vv=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
#endif`,Wv=`#if NUM_CLIPPING_PLANES > 0
	vClipPosition = - mvPosition.xyz;
#endif`,Yv=`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA )
	diffuseColor *= vColor;
#endif`,Xv=`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#endif`,qv=`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	varying vec4 vColor;
#endif`,Kv=`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	vColor = vec4( 1.0 );
#endif
#ifdef USE_COLOR_ALPHA
	vColor *= color;
#elif defined( USE_COLOR )
	vColor.rgb *= color;
#endif
#ifdef USE_INSTANCING_COLOR
	vColor.rgb *= instanceColor.rgb;
#endif
#ifdef USE_BATCHING_COLOR
	vColor *= getBatchingColor( getIndirectIndex( gl_DrawID ) );
#endif`,Jv=`#define PI 3.141592653589793
#define PI2 6.283185307179586
#define PI_HALF 1.5707963267948966
#define RECIPROCAL_PI 0.3183098861837907
#define RECIPROCAL_PI2 0.15915494309189535
#define EPSILON 1e-6
#ifndef saturate
#define saturate( a ) clamp( a, 0.0, 1.0 )
#endif
#define whiteComplement( a ) ( 1.0 - saturate( a ) )
float pow2( const in float x ) { return x*x; }
vec3 pow2( const in vec3 x ) { return x*x; }
float pow3( const in float x ) { return x*x*x; }
float pow4( const in float x ) { float x2 = x*x; return x2*x2; }
float max3( const in vec3 v ) { return max( max( v.x, v.y ), v.z ); }
float average( const in vec3 v ) { return dot( v, vec3( 0.3333333 ) ); }
highp float rand( const in vec2 uv ) {
	const highp float a = 12.9898, b = 78.233, c = 43758.5453;
	highp float dt = dot( uv.xy, vec2( a,b ) ), sn = mod( dt, PI );
	return fract( sin( sn ) * c );
}
#ifdef HIGH_PRECISION
	float precisionSafeLength( vec3 v ) { return length( v ); }
#else
	float precisionSafeLength( vec3 v ) {
		float maxComponent = max3( abs( v ) );
		return length( v / maxComponent ) * maxComponent;
	}
#endif
struct IncidentLight {
	vec3 color;
	vec3 direction;
	bool visible;
};
struct ReflectedLight {
	vec3 directDiffuse;
	vec3 directSpecular;
	vec3 indirectDiffuse;
	vec3 indirectSpecular;
};
#ifdef USE_ALPHAHASH
	varying vec3 vPosition;
#endif
vec3 transformDirection( in vec3 dir, in mat4 matrix ) {
	return normalize( ( matrix * vec4( dir, 0.0 ) ).xyz );
}
#define inverseTransformDirection transformDirectionByInverseViewMatrix
vec3 transformNormalByInverseViewMatrix( in vec3 normal, in mat4 viewMatrix ) {
	return normalize( ( vec4( normal, 0.0 ) * viewMatrix ).xyz );
}
vec3 transformDirectionByInverseViewMatrix( in vec3 dir, in mat4 viewMatrix ) {
	return normalize( ( vec4( dir, 0.0 ) * viewMatrix ).xyz );
}
bool isPerspectiveMatrix( mat4 m ) {
	return m[ 2 ][ 3 ] == - 1.0;
}
vec2 equirectUv( in vec3 dir ) {
	float u = atan( dir.z, dir.x ) * RECIPROCAL_PI2 + 0.5;
	float v = asin( clamp( dir.y, - 1.0, 1.0 ) ) * RECIPROCAL_PI + 0.5;
	return vec2( u, v );
}
vec3 BRDF_Lambert( const in vec3 diffuseColor ) {
	return RECIPROCAL_PI * diffuseColor;
}
vec3 F_Schlick( const in vec3 f0, const in float f90, const in float dotVH ) {
	float fresnel = exp2( ( - 5.55473 * dotVH - 6.98316 ) * dotVH );
	return f0 * ( 1.0 - fresnel ) + ( f90 * fresnel );
}
float F_Schlick( const in float f0, const in float f90, const in float dotVH ) {
	float fresnel = exp2( ( - 5.55473 * dotVH - 6.98316 ) * dotVH );
	return f0 * ( 1.0 - fresnel ) + ( f90 * fresnel );
} // validated`,Zv=`#ifdef ENVMAP_TYPE_CUBE_UV
	#define cubeUV_minMipLevel 4.0
	#define cubeUV_minTileSize 16.0
	float getFace( vec3 direction ) {
		vec3 absDirection = abs( direction );
		float face = - 1.0;
		if ( absDirection.x > absDirection.z ) {
			if ( absDirection.x > absDirection.y )
				face = direction.x > 0.0 ? 0.0 : 3.0;
			else
				face = direction.y > 0.0 ? 1.0 : 4.0;
		} else {
			if ( absDirection.z > absDirection.y )
				face = direction.z > 0.0 ? 2.0 : 5.0;
			else
				face = direction.y > 0.0 ? 1.0 : 4.0;
		}
		return face;
	}
	vec2 getUV( vec3 direction, float face ) {
		vec2 uv;
		if ( face == 0.0 ) {
			uv = vec2( direction.z, direction.y ) / abs( direction.x );
		} else if ( face == 1.0 ) {
			uv = vec2( - direction.x, - direction.z ) / abs( direction.y );
		} else if ( face == 2.0 ) {
			uv = vec2( - direction.x, direction.y ) / abs( direction.z );
		} else if ( face == 3.0 ) {
			uv = vec2( - direction.z, direction.y ) / abs( direction.x );
		} else if ( face == 4.0 ) {
			uv = vec2( - direction.x, direction.z ) / abs( direction.y );
		} else {
			uv = vec2( direction.x, direction.y ) / abs( direction.z );
		}
		return 0.5 * ( uv + 1.0 );
	}
	vec3 bilinearCubeUV( sampler2D envMap, vec3 direction, float mipInt ) {
		float face = getFace( direction );
		float filterInt = max( cubeUV_minMipLevel - mipInt, 0.0 );
		mipInt = max( mipInt, cubeUV_minMipLevel );
		float faceSize = exp2( mipInt );
		highp vec2 uv = getUV( direction, face ) * ( faceSize - 2.0 ) + 1.0;
		if ( face > 2.0 ) {
			uv.y += faceSize;
			face -= 3.0;
		}
		uv.x += face * faceSize;
		uv.x += filterInt * 3.0 * cubeUV_minTileSize;
		uv.y += 4.0 * ( exp2( CUBEUV_MAX_MIP ) - faceSize );
		uv.x *= CUBEUV_TEXEL_WIDTH;
		uv.y *= CUBEUV_TEXEL_HEIGHT;
		#ifdef texture2DGradEXT
			return texture2DGradEXT( envMap, uv, vec2( 0.0 ), vec2( 0.0 ) ).rgb;
		#else
			return texture2D( envMap, uv ).rgb;
		#endif
	}
	#define cubeUV_r0 1.0
	#define cubeUV_m0 - 2.0
	#define cubeUV_r1 0.8
	#define cubeUV_m1 - 1.0
	#define cubeUV_r4 0.4
	#define cubeUV_m4 2.0
	#define cubeUV_r5 0.305
	#define cubeUV_m5 3.0
	#define cubeUV_r6 0.21
	#define cubeUV_m6 4.0
	float roughnessToMip( float roughness ) {
		float mip = 0.0;
		if ( roughness >= cubeUV_r1 ) {
			mip = ( cubeUV_r0 - roughness ) * ( cubeUV_m1 - cubeUV_m0 ) / ( cubeUV_r0 - cubeUV_r1 ) + cubeUV_m0;
		} else if ( roughness >= cubeUV_r4 ) {
			mip = ( cubeUV_r1 - roughness ) * ( cubeUV_m4 - cubeUV_m1 ) / ( cubeUV_r1 - cubeUV_r4 ) + cubeUV_m1;
		} else if ( roughness >= cubeUV_r5 ) {
			mip = ( cubeUV_r4 - roughness ) * ( cubeUV_m5 - cubeUV_m4 ) / ( cubeUV_r4 - cubeUV_r5 ) + cubeUV_m4;
		} else if ( roughness >= cubeUV_r6 ) {
			mip = ( cubeUV_r5 - roughness ) * ( cubeUV_m6 - cubeUV_m5 ) / ( cubeUV_r5 - cubeUV_r6 ) + cubeUV_m5;
		} else {
			mip = - 2.0 * log2( 1.16 * roughness );		}
		return mip;
	}
	vec4 textureCubeUV( sampler2D envMap, vec3 sampleDir, float roughness ) {
		float mip = clamp( roughnessToMip( roughness ), cubeUV_m0, CUBEUV_MAX_MIP );
		float mipF = fract( mip );
		float mipInt = floor( mip );
		vec3 color0 = bilinearCubeUV( envMap, sampleDir, mipInt );
		if ( mipF == 0.0 ) {
			return vec4( color0, 1.0 );
		} else {
			vec3 color1 = bilinearCubeUV( envMap, sampleDir, mipInt + 1.0 );
			return vec4( mix( color0, color1, mipF ), 1.0 );
		}
	}
#endif`,$v=`vec3 transformedNormal = objectNormal;
#ifdef USE_TANGENT
	vec3 transformedTangent = objectTangent;
#endif
#ifdef USE_BATCHING
	mat3 bm = mat3( batchingMatrix );
	transformedNormal /= vec3( dot( bm[ 0 ], bm[ 0 ] ), dot( bm[ 1 ], bm[ 1 ] ), dot( bm[ 2 ], bm[ 2 ] ) );
	transformedNormal = bm * transformedNormal;
	#ifdef USE_TANGENT
		transformedTangent = bm * transformedTangent;
	#endif
#endif
#ifdef USE_INSTANCING
	mat3 im = mat3( instanceMatrix );
	transformedNormal /= vec3( dot( im[ 0 ], im[ 0 ] ), dot( im[ 1 ], im[ 1 ] ), dot( im[ 2 ], im[ 2 ] ) );
	transformedNormal = im * transformedNormal;
	#ifdef USE_TANGENT
		transformedTangent = im * transformedTangent;
	#endif
#endif
transformedNormal = normalMatrix * transformedNormal;
#ifdef FLIP_SIDED
	transformedNormal = - transformedNormal;
#endif
#ifdef USE_TANGENT
	transformedTangent = ( modelViewMatrix * vec4( transformedTangent, 0.0 ) ).xyz;
#endif`,jv=`#ifdef USE_DISPLACEMENTMAP
	uniform sampler2D displacementMap;
	uniform float displacementScale;
	uniform float displacementBias;
#endif`,ty=`#ifdef USE_DISPLACEMENTMAP
	transformed += normalize( objectNormal ) * ( texture2D( displacementMap, vDisplacementMapUv ).x * displacementScale + displacementBias );
#endif`,ey=`#ifdef USE_EMISSIVEMAP
	vec4 emissiveColor = texture2D( emissiveMap, vEmissiveMapUv );
	#ifdef DECODE_VIDEO_TEXTURE_EMISSIVE
		emissiveColor = sRGBTransferEOTF( emissiveColor );
	#endif
	totalEmissiveRadiance *= emissiveColor.rgb;
#endif`,ny=`#ifdef USE_EMISSIVEMAP
	uniform sampler2D emissiveMap;
#endif`,iy="gl_FragColor = linearToOutputTexel( gl_FragColor );",sy=`vec4 LinearTransferOETF( in vec4 value ) {
	return value;
}
vec4 sRGBTransferEOTF( in vec4 value ) {
	return vec4( mix( pow( value.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), value.rgb * 0.0773993808, vec3( lessThanEqual( value.rgb, vec3( 0.04045 ) ) ) ), value.a );
}
vec4 sRGBTransferOETF( in vec4 value ) {
	return vec4( mix( pow( value.rgb, vec3( 0.41666 ) ) * 1.055 - vec3( 0.055 ), value.rgb * 12.92, vec3( lessThanEqual( value.rgb, vec3( 0.0031308 ) ) ) ), value.a );
}`,ry=`#ifdef USE_ENVMAP
	#ifdef ENV_WORLDPOS
		vec3 cameraToFrag;
		if ( isOrthographic ) {
			cameraToFrag = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );
		} else {
			cameraToFrag = normalize( vWorldPosition - cameraPosition );
		}
		vec3 worldNormal = transformNormalByInverseViewMatrix( normal, viewMatrix );
		#ifdef ENVMAP_MODE_REFLECTION
			vec3 reflectVec = reflect( cameraToFrag, worldNormal );
		#else
			vec3 reflectVec = refract( cameraToFrag, worldNormal, refractionRatio );
		#endif
	#else
		vec3 reflectVec = vReflect;
	#endif
	#ifdef ENVMAP_TYPE_CUBE
		vec4 envColor = textureCube( envMap, envMapRotation * reflectVec );
		#ifdef ENVMAP_BLENDING_MULTIPLY
			outgoingLight = mix( outgoingLight, outgoingLight * envColor.xyz, specularStrength * reflectivity );
		#elif defined( ENVMAP_BLENDING_MIX )
			outgoingLight = mix( outgoingLight, envColor.xyz, specularStrength * reflectivity );
		#elif defined( ENVMAP_BLENDING_ADD )
			outgoingLight += envColor.xyz * specularStrength * reflectivity;
		#endif
	#endif
#endif`,ay=`#ifdef USE_ENVMAP
	uniform float envMapIntensity;
	uniform mat3 envMapRotation;
	#ifdef ENVMAP_TYPE_CUBE
		uniform samplerCube envMap;
	#else
		uniform sampler2D envMap;
	#endif
#endif`,oy=`#ifdef USE_ENVMAP
	uniform float reflectivity;
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		varying vec3 vWorldPosition;
		uniform float refractionRatio;
	#else
		varying vec3 vReflect;
	#endif
#endif`,ly=`#ifdef USE_ENVMAP
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		
		varying vec3 vWorldPosition;
	#else
		varying vec3 vReflect;
		uniform float refractionRatio;
	#endif
#endif`,cy=`#ifdef USE_ENVMAP
	#ifdef ENV_WORLDPOS
		vWorldPosition = worldPosition.xyz;
	#else
		vec3 cameraToVertex;
		if ( isOrthographic ) {
			cameraToVertex = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );
		} else {
			cameraToVertex = normalize( worldPosition.xyz - cameraPosition );
		}
		vec3 worldNormal = transformNormalByInverseViewMatrix( transformedNormal, viewMatrix );
		#ifdef ENVMAP_MODE_REFLECTION
			vReflect = reflect( cameraToVertex, worldNormal );
		#else
			vReflect = refract( cameraToVertex, worldNormal, refractionRatio );
		#endif
	#endif
#endif`,hy=`#ifdef USE_FOG
	vFogDepth = - mvPosition.z;
#endif`,uy=`#ifdef USE_FOG
	varying float vFogDepth;
#endif`,fy=`#ifdef USE_FOG
	#ifdef FOG_EXP2
		float fogFactor = 1.0 - exp( - fogDensity * fogDensity * vFogDepth * vFogDepth );
	#else
		float fogFactor = smoothstep( fogNear, fogFar, vFogDepth );
	#endif
	gl_FragColor.rgb = mix( gl_FragColor.rgb, fogColor, fogFactor );
#endif`,dy=`#ifdef USE_FOG
	uniform vec3 fogColor;
	varying float vFogDepth;
	#ifdef FOG_EXP2
		uniform float fogDensity;
	#else
		uniform float fogNear;
		uniform float fogFar;
	#endif
#endif`,py=`#ifdef USE_GRADIENTMAP
	uniform sampler2D gradientMap;
#endif
vec3 getGradientIrradiance( vec3 normal, vec3 lightDirection ) {
	float dotNL = dot( normal, lightDirection );
	vec2 coord = vec2( dotNL * 0.5 + 0.5, 0.0 );
	#ifdef USE_GRADIENTMAP
		return vec3( texture2D( gradientMap, coord ).r );
	#else
		vec2 fw = fwidth( coord ) * 0.5;
		return mix( vec3( 0.7 ), vec3( 1.0 ), smoothstep( 0.7 - fw.x, 0.7 + fw.x, coord.x ) );
	#endif
}`,Ay=`#ifdef USE_LIGHTMAP
	uniform sampler2D lightMap;
	uniform float lightMapIntensity;
#endif`,my=`LambertMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularStrength = specularStrength;`,gy=`varying vec3 vViewPosition;
struct LambertMaterial {
	vec3 diffuseColor;
	float specularStrength;
};
void RE_Direct_Lambert( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in LambertMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Lambert( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in LambertMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_Lambert
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Lambert`,xy=`uniform bool receiveShadow;
uniform vec3 ambientLightColor;
#if defined( USE_LIGHT_PROBES )
	uniform vec3 lightProbe[ 9 ];
#endif
vec3 shGetIrradianceAt( in vec3 normal, in vec3 shCoefficients[ 9 ] ) {
	float x = normal.x, y = normal.y, z = normal.z;
	vec3 result = shCoefficients[ 0 ] * 0.886227;
	result += shCoefficients[ 1 ] * 2.0 * 0.511664 * y;
	result += shCoefficients[ 2 ] * 2.0 * 0.511664 * z;
	result += shCoefficients[ 3 ] * 2.0 * 0.511664 * x;
	result += shCoefficients[ 4 ] * 2.0 * 0.429043 * x * y;
	result += shCoefficients[ 5 ] * 2.0 * 0.429043 * y * z;
	result += shCoefficients[ 6 ] * ( 0.743125 * z * z - 0.247708 );
	result += shCoefficients[ 7 ] * 2.0 * 0.429043 * x * z;
	result += shCoefficients[ 8 ] * 0.429043 * ( x * x - y * y );
	return result;
}
vec3 getLightProbeIrradiance( const in vec3 lightProbe[ 9 ], const in vec3 normal ) {
	vec3 worldNormal = transformNormalByInverseViewMatrix( normal, viewMatrix );
	vec3 irradiance = shGetIrradianceAt( worldNormal, lightProbe );
	return irradiance;
}
vec3 getAmbientLightIrradiance( const in vec3 ambientLightColor ) {
	vec3 irradiance = ambientLightColor;
	return irradiance;
}
float getDistanceAttenuation( const in float lightDistance, const in float cutoffDistance, const in float decayExponent ) {
	float distanceFalloff = 1.0 / max( pow( lightDistance, decayExponent ), 0.01 );
	if ( cutoffDistance > 0.0 ) {
		distanceFalloff *= pow2( saturate( 1.0 - pow4( lightDistance / cutoffDistance ) ) );
	}
	return distanceFalloff;
}
float getSpotAttenuation( const in float coneCosine, const in float penumbraCosine, const in float angleCosine ) {
	return smoothstep( coneCosine, penumbraCosine, angleCosine );
}
#if NUM_SUN_LIGHTS > 0
	struct SunLight {
		vec3 direction;
		vec3 color;
	};
	uniform SunLight sunLights[ NUM_SUN_LIGHTS ];
	void getSunLightInfo( const in SunLight sunLight, out IncidentLight light ) {
		light.color = sunLight.color;
		light.direction = sunLight.direction;
		light.visible = true;
	}
#endif
#if NUM_DIR_LIGHTS > 0
	struct DirectionalLight {
		vec3 direction;
		vec3 color;
	};
	uniform DirectionalLight directionalLights[ NUM_DIR_LIGHTS ];
	void getDirectionalLightInfo( const in DirectionalLight directionalLight, out IncidentLight light ) {
		light.color = directionalLight.color;
		light.direction = directionalLight.direction;
		light.visible = true;
	}
#endif
#if NUM_POINT_LIGHTS > 0
	struct PointLight {
		vec3 position;
		vec3 color;
		float distance;
		float decay;
	};
	uniform PointLight pointLights[ NUM_POINT_LIGHTS ];
	void getPointLightInfo( const in PointLight pointLight, const in vec3 geometryPosition, out IncidentLight light ) {
		vec3 lVector = pointLight.position - geometryPosition;
		light.direction = normalize( lVector );
		float lightDistance = length( lVector );
		light.color = pointLight.color;
		light.color *= getDistanceAttenuation( lightDistance, pointLight.distance, pointLight.decay );
		light.visible = ( light.color != vec3( 0.0 ) );
	}
#endif
#if NUM_SPOT_LIGHTS > 0
	struct SpotLight {
		vec3 position;
		vec3 direction;
		vec3 color;
		float distance;
		float decay;
		float coneCos;
		float penumbraCos;
	};
	uniform SpotLight spotLights[ NUM_SPOT_LIGHTS ];
	void getSpotLightInfo( const in SpotLight spotLight, const in vec3 geometryPosition, out IncidentLight light ) {
		vec3 lVector = spotLight.position - geometryPosition;
		light.direction = normalize( lVector );
		float angleCos = dot( light.direction, spotLight.direction );
		float spotAttenuation = getSpotAttenuation( spotLight.coneCos, spotLight.penumbraCos, angleCos );
		if ( spotAttenuation > 0.0 ) {
			float lightDistance = length( lVector );
			light.color = spotLight.color * spotAttenuation;
			light.color *= getDistanceAttenuation( lightDistance, spotLight.distance, spotLight.decay );
			light.visible = ( light.color != vec3( 0.0 ) );
		} else {
			light.color = vec3( 0.0 );
			light.visible = false;
		}
	}
#endif
#if NUM_RECT_AREA_LIGHTS > 0
	struct RectAreaLight {
		vec3 color;
		vec3 position;
		vec3 halfWidth;
		vec3 halfHeight;
	};
	uniform sampler2D ltc_1;	uniform sampler2D ltc_2;
	uniform RectAreaLight rectAreaLights[ NUM_RECT_AREA_LIGHTS ];
#endif
#if NUM_HEMI_LIGHTS > 0
	struct HemisphereLight {
		vec3 direction;
		vec3 skyColor;
		vec3 groundColor;
	};
	uniform HemisphereLight hemisphereLights[ NUM_HEMI_LIGHTS ];
	vec3 getHemisphereLightIrradiance( const in HemisphereLight hemiLight, const in vec3 normal ) {
		float dotNL = dot( normal, hemiLight.direction );
		float hemiDiffuseWeight = 0.5 * dotNL + 0.5;
		vec3 irradiance = mix( hemiLight.groundColor, hemiLight.skyColor, hemiDiffuseWeight );
		return irradiance;
	}
#endif
#include <lightprobes_pars_fragment>`,_y=`#ifdef USE_ENVMAP
	vec3 getIBLIrradiance( const in vec3 normal ) {
		#ifdef ENVMAP_TYPE_CUBE_UV
			vec3 worldNormal = transformNormalByInverseViewMatrix( normal, viewMatrix );
			vec4 envMapColor = textureCubeUV( envMap, envMapRotation * worldNormal, 1.0 );
			return PI * envMapColor.rgb * envMapIntensity;
		#else
			return vec3( 0.0 );
		#endif
	}
	vec3 getIBLRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness ) {
		#ifdef ENVMAP_TYPE_CUBE_UV
			vec3 reflectVec = reflect( - viewDir, normal );
			reflectVec = normalize( mix( reflectVec, normal, pow4( roughness ) ) );
			reflectVec = transformDirectionByInverseViewMatrix( reflectVec, viewMatrix );
			vec4 envMapColor = textureCubeUV( envMap, envMapRotation * reflectVec, roughness );
			return envMapColor.rgb * envMapIntensity;
		#else
			return vec3( 0.0 );
		#endif
	}
	#ifdef USE_RETROREFLECTION
		vec3 getIBLRetroRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness ) {
			#ifdef ENVMAP_TYPE_CUBE_UV
				vec3 retroVec = normalize( mix( viewDir, normal, pow4( roughness ) ) );
				retroVec = transformDirectionByInverseViewMatrix( retroVec, viewMatrix );
				vec4 envMapColor = textureCubeUV( envMap, envMapRotation * retroVec, roughness );
				return envMapColor.rgb * envMapIntensity;
			#else
				return vec3( 0.0 );
			#endif
		}
	#endif
	#ifdef USE_ANISOTROPY
		vec3 getIBLAnisotropyRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness, const in vec3 bitangent, const in float anisotropy ) {
			#ifdef ENVMAP_TYPE_CUBE_UV
				vec3 bentNormal = cross( bitangent, viewDir );
				bentNormal = normalize( cross( bentNormal, bitangent ) );
				bentNormal = normalize( mix( bentNormal, normal, pow2( pow2( 1.0 - anisotropy * ( 1.0 - roughness ) ) ) ) );
				return getIBLRadiance( viewDir, bentNormal, roughness );
			#else
				return vec3( 0.0 );
			#endif
		}
		#ifdef USE_RETROREFLECTION
			vec3 getIBLAnisotropyRetroRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness, const in vec3 bitangent, const in float anisotropy ) {
				#ifdef ENVMAP_TYPE_CUBE_UV
					vec3 bentNormal = cross( bitangent, viewDir );
					bentNormal = normalize( cross( bentNormal, bitangent ) );
					bentNormal = normalize( mix( bentNormal, normal, pow2( pow2( 1.0 - anisotropy * ( 1.0 - roughness ) ) ) ) );
					return getIBLRetroRadiance( viewDir, bentNormal, roughness );
				#else
					return vec3( 0.0 );
				#endif
			}
		#endif
	#endif
#endif`,vy=`ToonMaterial material;
material.diffuseColor = diffuseColor.rgb;`,yy=`varying vec3 vViewPosition;
struct ToonMaterial {
	vec3 diffuseColor;
};
void RE_Direct_Toon( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in ToonMaterial material, inout ReflectedLight reflectedLight ) {
	vec3 irradiance = getGradientIrradiance( geometryNormal, directLight.direction ) * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Toon( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in ToonMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_Toon
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Toon`,My=`BlinnPhongMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularColor = specular;
material.specularShininess = shininess;
material.specularStrength = specularStrength;`,Ey=`varying vec3 vViewPosition;
struct BlinnPhongMaterial {
	vec3 diffuseColor;
	vec3 specularColor;
	float specularShininess;
	float specularStrength;
};
void RE_Direct_BlinnPhong( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in BlinnPhongMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
	reflectedLight.directSpecular += irradiance * BRDF_BlinnPhong( directLight.direction, geometryViewDir, geometryNormal, material.specularColor, material.specularShininess ) * material.specularStrength;
}
void RE_IndirectDiffuse_BlinnPhong( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in BlinnPhongMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_BlinnPhong
#define RE_IndirectDiffuse		RE_IndirectDiffuse_BlinnPhong`,Sy=`PhysicalMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.diffuseContribution = diffuseColor.rgb * ( 1.0 - metalnessFactor );
material.metalness = metalnessFactor;
vec3 dxy = max( abs( dFdx( nonPerturbedNormal ) ), abs( dFdy( nonPerturbedNormal ) ) );
float geometryRoughness = max( max( dxy.x, dxy.y ), dxy.z );
material.roughness = max( roughnessFactor, 0.0525 );material.roughness += geometryRoughness;
material.roughness = min( material.roughness, 1.0 );
#ifdef IOR
	material.ior = ior;
	#ifdef USE_SPECULAR
		float specularIntensityFactor = specularIntensity;
		vec3 specularColorFactor = specularColor;
		#ifdef USE_SPECULAR_COLORMAP
			specularColorFactor *= texture2D( specularColorMap, vSpecularColorMapUv ).rgb;
		#endif
		#ifdef USE_SPECULAR_INTENSITYMAP
			specularIntensityFactor *= texture2D( specularIntensityMap, vSpecularIntensityMapUv ).a;
		#endif
		material.specularF90 = mix( specularIntensityFactor, 1.0, metalnessFactor );
	#else
		float specularIntensityFactor = 1.0;
		vec3 specularColorFactor = vec3( 1.0 );
		material.specularF90 = 1.0;
	#endif
	material.specularColor = min( pow2( ( material.ior - 1.0 ) / ( material.ior + 1.0 ) ) * specularColorFactor, vec3( 1.0 ) ) * specularIntensityFactor;
	material.specularColorBlended = mix( material.specularColor, diffuseColor.rgb, metalnessFactor );
#else
	material.specularColor = vec3( 0.04 );
	material.specularColorBlended = mix( material.specularColor, diffuseColor.rgb, metalnessFactor );
	material.specularF90 = 1.0;
#endif
#ifdef USE_CLEARCOAT
	material.clearcoat = clearcoat;
	material.clearcoatRoughness = clearcoatRoughness;
	material.clearcoatF0 = vec3( 0.04 );
	material.clearcoatF90 = 1.0;
	#ifdef USE_CLEARCOATMAP
		material.clearcoat *= texture2D( clearcoatMap, vClearcoatMapUv ).x;
	#endif
	#ifdef USE_CLEARCOAT_ROUGHNESSMAP
		material.clearcoatRoughness *= texture2D( clearcoatRoughnessMap, vClearcoatRoughnessMapUv ).y;
	#endif
	material.clearcoat = saturate( material.clearcoat );	material.clearcoatRoughness = max( material.clearcoatRoughness, 0.0525 );
	material.clearcoatRoughness += geometryRoughness;
	material.clearcoatRoughness = min( material.clearcoatRoughness, 1.0 );
#endif
#ifdef USE_DISPERSION
	material.dispersion = dispersion;
#endif
#ifdef USE_RETROREFLECTION
	material.retroreflectivity = retroreflectivity;
#endif
#ifdef USE_IRIDESCENCE
	material.iridescence = iridescence;
	material.iridescenceIOR = iridescenceIOR;
	#ifdef USE_IRIDESCENCEMAP
		material.iridescence *= texture2D( iridescenceMap, vIridescenceMapUv ).r;
	#endif
	#ifdef USE_IRIDESCENCE_THICKNESSMAP
		material.iridescenceThickness = (iridescenceThicknessMaximum - iridescenceThicknessMinimum) * texture2D( iridescenceThicknessMap, vIridescenceThicknessMapUv ).g + iridescenceThicknessMinimum;
	#else
		material.iridescenceThickness = iridescenceThicknessMaximum;
	#endif
#endif
#ifdef USE_SHEEN
	material.sheenColor = sheenColor;
	#ifdef USE_SHEEN_COLORMAP
		material.sheenColor *= texture2D( sheenColorMap, vSheenColorMapUv ).rgb;
	#endif
	material.sheenRoughness = clamp( sheenRoughness, 0.0001, 1.0 );
	#ifdef USE_SHEEN_ROUGHNESSMAP
		material.sheenRoughness *= texture2D( sheenRoughnessMap, vSheenRoughnessMapUv ).a;
	#endif
#endif
#ifdef USE_ANISOTROPY
	#ifdef USE_ANISOTROPYMAP
		mat2 anisotropyMat = mat2( anisotropyVector.x, anisotropyVector.y, - anisotropyVector.y, anisotropyVector.x );
		vec3 anisotropyPolar = texture2D( anisotropyMap, vAnisotropyMapUv ).rgb;
		vec2 anisotropyV = anisotropyMat * normalize( 2.0 * anisotropyPolar.rg - vec2( 1.0 ) ) * anisotropyPolar.b;
	#else
		vec2 anisotropyV = anisotropyVector;
	#endif
	material.anisotropy = length( anisotropyV );
	if( material.anisotropy == 0.0 ) {
		anisotropyV = vec2( 1.0, 0.0 );
	} else {
		anisotropyV /= material.anisotropy;
		material.anisotropy = saturate( material.anisotropy );
	}
	material.alphaT = mix( pow2( material.roughness ), 1.0, pow2( material.anisotropy ) );
	material.anisotropyT = tbn[ 0 ] * anisotropyV.x + tbn[ 1 ] * anisotropyV.y;
	material.anisotropyB = tbn[ 1 ] * anisotropyV.x - tbn[ 0 ] * anisotropyV.y;
#endif`,wy=`uniform sampler2D dfgLUT;
struct PhysicalMaterial {
	vec3 diffuseColor;
	vec3 diffuseContribution;
	vec3 specularColor;
	vec3 specularColorBlended;
	float roughness;
	float metalness;
	float specularF90;
	float dispersion;
	vec2 dfg;
	vec3 multiScatteringCompensation;
	#ifdef USE_RETROREFLECTION
		float retroreflectivity;
	#endif
	#ifdef USE_CLEARCOAT
		float clearcoat;
		float clearcoatRoughness;
		vec3 clearcoatF0;
		float clearcoatF90;
	#endif
	#ifdef USE_IRIDESCENCE
		float iridescence;
		float iridescenceIOR;
		float iridescenceThickness;
		vec3 iridescenceFresnel;
		vec3 iridescenceF0Dielectric;
		vec3 iridescenceF0Metallic;
	#endif
	#ifdef USE_SHEEN
		vec3 sheenColor;
		float sheenRoughness;
	#endif
	#ifdef IOR
		float ior;
	#endif
	#ifdef USE_TRANSMISSION
		float transmission;
		float transmissionAlpha;
		float thickness;
		float attenuationDistance;
		vec3 attenuationColor;
	#endif
	#ifdef USE_ANISOTROPY
		float anisotropy;
		float alphaT;
		vec3 anisotropyT;
		vec3 anisotropyB;
	#endif
};
vec3 clearcoatSpecularDirect = vec3( 0.0 );
vec3 clearcoatSpecularIndirect = vec3( 0.0 );
vec3 sheenSpecularDirect = vec3( 0.0 );
vec3 sheenSpecularIndirect = vec3(0.0 );
vec3 Schlick_to_F0( const in vec3 f, const in float f90, const in float dotVH ) {
    float x = clamp( 1.0 - dotVH, 0.0, 1.0 );
    float x2 = x * x;
    float x5 = clamp( x * x2 * x2, 0.0, 0.9999 );
    return ( f - vec3( f90 ) * x5 ) / ( 1.0 - x5 );
}
float V_GGX_SmithCorrelated( const in float alpha, const in float dotNL, const in float dotNV ) {
	float a2 = pow2( alpha );
	float gv = dotNL * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNV ) );
	float gl = dotNV * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNL ) );
	return 0.5 / max( gv + gl, EPSILON );
}
float D_GGX( const in float alpha, const in float dotNH ) {
	float a2 = pow2( alpha );
	float denom = pow2( dotNH ) * ( a2 - 1.0 ) + 1.0;
	return RECIPROCAL_PI * a2 / pow2( denom );
}
#ifdef USE_ANISOTROPY
	float V_GGX_SmithCorrelated_Anisotropic( const in float alphaT, const in float alphaB, const in float dotTV, const in float dotBV, const in float dotTL, const in float dotBL, const in float dotNV, const in float dotNL ) {
		float gv = dotNL * length( vec3( alphaT * dotTV, alphaB * dotBV, dotNV ) );
		float gl = dotNV * length( vec3( alphaT * dotTL, alphaB * dotBL, dotNL ) );
		return 0.5 / max( gv + gl, EPSILON );
	}
	float D_GGX_Anisotropic( const in float alphaT, const in float alphaB, const in float dotNH, const in float dotTH, const in float dotBH ) {
		float a2 = alphaT * alphaB;
		highp vec3 v = vec3( alphaB * dotTH, alphaT * dotBH, a2 * dotNH );
		highp float v2 = dot( v, v );
		float w2 = a2 / v2;
		return RECIPROCAL_PI * a2 * pow2 ( w2 );
	}
#endif
#ifdef USE_CLEARCOAT
	vec3 BRDF_GGX_Clearcoat( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material) {
		vec3 f0 = material.clearcoatF0;
		float f90 = material.clearcoatF90;
		float roughness = material.clearcoatRoughness;
		float alpha = pow2( roughness );
		vec3 halfDir = normalize( lightDir + viewDir );
		float dotNL = saturate( dot( normal, lightDir ) );
		float dotNV = saturate( dot( normal, viewDir ) );
		float dotNH = saturate( dot( normal, halfDir ) );
		float dotVH = saturate( dot( viewDir, halfDir ) );
		vec3 F = F_Schlick( f0, f90, dotVH );
		float V = V_GGX_SmithCorrelated( alpha, dotNL, dotNV );
		float D = D_GGX( alpha, dotNH );
		return F * ( V * D );
	}
#endif
vec3 BRDF_GGX( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material ) {
	vec3 f0 = material.specularColorBlended;
	float f90 = material.specularF90;
	float roughness = material.roughness;
	float alpha = pow2( roughness );
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	float dotNH = saturate( dot( normal, halfDir ) );
	float dotVH = saturate( dot( viewDir, halfDir ) );
	vec3 F = F_Schlick( f0, f90, dotVH );
	#ifdef USE_IRIDESCENCE
		F = mix( F, material.iridescenceFresnel, material.iridescence );
	#endif
	#ifdef USE_ANISOTROPY
		float dotTL = dot( material.anisotropyT, lightDir );
		float dotTV = dot( material.anisotropyT, viewDir );
		float dotTH = dot( material.anisotropyT, halfDir );
		float dotBL = dot( material.anisotropyB, lightDir );
		float dotBV = dot( material.anisotropyB, viewDir );
		float dotBH = dot( material.anisotropyB, halfDir );
		float V = V_GGX_SmithCorrelated_Anisotropic( material.alphaT, alpha, dotTV, dotBV, dotTL, dotBL, dotNV, dotNL );
		float D = D_GGX_Anisotropic( material.alphaT, alpha, dotNH, dotTH, dotBH );
	#else
		float V = V_GGX_SmithCorrelated( alpha, dotNL, dotNV );
		float D = D_GGX( alpha, dotNH );
	#endif
	return F * ( V * D );
}
vec2 LTC_Uv( const in vec3 N, const in vec3 V, const in float roughness ) {
	const float LUT_SIZE = 64.0;
	const float LUT_SCALE = ( LUT_SIZE - 1.0 ) / LUT_SIZE;
	const float LUT_BIAS = 0.5 / LUT_SIZE;
	float dotNV = saturate( dot( N, V ) );
	vec2 uv = vec2( roughness, sqrt( 1.0 - dotNV ) );
	uv = uv * LUT_SCALE + LUT_BIAS;
	return uv;
}
float LTC_ClippedSphereFormFactor( const in vec3 f ) {
	float l = length( f );
	return max( ( l * l + f.z ) / ( l + 1.0 ), 0.0 );
}
vec3 LTC_EdgeVectorFormFactor( const in vec3 v1, const in vec3 v2 ) {
	float x = dot( v1, v2 );
	float y = abs( x );
	float a = 0.8543985 + ( 0.4965155 + 0.0145206 * y ) * y;
	float b = 3.4175940 + ( 4.1616724 + y ) * y;
	float v = a / b;
	float theta_sintheta = ( x > 0.0 ) ? v : 0.5 * inversesqrt( max( 1.0 - x * x, 1e-7 ) ) - v;
	return cross( v1, v2 ) * theta_sintheta;
}
vec3 LTC_Evaluate( const in vec3 N, const in vec3 V, const in vec3 P, const in mat3 mInv, const in vec3 rectCoords[ 4 ] ) {
	vec3 v1 = rectCoords[ 1 ] - rectCoords[ 0 ];
	vec3 v2 = rectCoords[ 3 ] - rectCoords[ 0 ];
	vec3 lightNormal = cross( v1, v2 );
	if( dot( lightNormal, P - rectCoords[ 0 ] ) < 0.0 ) return vec3( 0.0 );
	vec3 T1, T2;
	T1 = normalize( V - N * dot( V, N ) );
	T2 = - cross( N, T1 );
	mat3 mat = mInv * transpose( mat3( T1, T2, N ) );
	vec3 coords[ 4 ];
	coords[ 0 ] = mat * ( rectCoords[ 0 ] - P );
	coords[ 1 ] = mat * ( rectCoords[ 1 ] - P );
	coords[ 2 ] = mat * ( rectCoords[ 2 ] - P );
	coords[ 3 ] = mat * ( rectCoords[ 3 ] - P );
	coords[ 0 ] = normalize( coords[ 0 ] );
	coords[ 1 ] = normalize( coords[ 1 ] );
	coords[ 2 ] = normalize( coords[ 2 ] );
	coords[ 3 ] = normalize( coords[ 3 ] );
	vec3 vectorFormFactor = vec3( 0.0 );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 0 ], coords[ 1 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 1 ], coords[ 2 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 2 ], coords[ 3 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 3 ], coords[ 0 ] );
	float result = LTC_ClippedSphereFormFactor( vectorFormFactor );
	return vec3( result );
}
#if defined( USE_SHEEN )
float D_Charlie( float roughness, float dotNH ) {
	float alpha = pow2( roughness );
	float invAlpha = 1.0 / alpha;
	float cos2h = dotNH * dotNH;
	float sin2h = max( 1.0 - cos2h, 0.0078125 );
	return ( 2.0 + invAlpha ) * pow( sin2h, invAlpha * 0.5 ) / ( 2.0 * PI );
}
float V_Neubelt( float dotNV, float dotNL ) {
	return saturate( 1.0 / ( 4.0 * ( dotNL + dotNV - dotNL * dotNV ) ) );
}
vec3 BRDF_Sheen( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, vec3 sheenColor, const in float sheenRoughness ) {
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	float dotNH = saturate( dot( normal, halfDir ) );
	float D = D_Charlie( sheenRoughness, dotNH );
	float V = V_Neubelt( dotNV, dotNL );
	return sheenColor * ( D * V );
}
#endif
float IBLSheenBRDF( const in vec3 normal, const in vec3 viewDir, const in float roughness ) {
	float dotNV = saturate( dot( normal, viewDir ) );
	float r2 = roughness * roughness;
	float rInv = 1.0 / ( roughness + 0.1 );
	float a = -1.9362 + 1.0678 * roughness + 0.4573 * r2 - 0.8469 * rInv;
	float b = -0.6014 + 0.5538 * roughness - 0.4670 * r2 - 0.1255 * rInv;
	float DG = exp( a * dotNV + b );
	return saturate( DG );
}
vec3 EnvironmentBRDF( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float roughness ) {
	float dotNV = saturate( dot( normal, viewDir ) );
	vec2 fab = texture2D( dfgLUT, vec2( roughness, dotNV ) ).rg;
	return specularColor * fab.x + specularF90 * fab.y;
}
#ifdef USE_IRIDESCENCE
void computeMultiscatteringIridescence( const in vec2 fab, const in vec3 specularColor, const in float specularF90, const in float iridescence, const in vec3 iridescenceF0, inout vec3 singleScatter, inout vec3 multiScatter ) {
#else
void computeMultiscattering( const in vec2 fab, const in vec3 specularColor, const in float specularF90, inout vec3 singleScatter, inout vec3 multiScatter ) {
#endif
	#ifdef USE_IRIDESCENCE
		vec3 Fr = mix( specularColor, iridescenceF0, iridescence );
	#else
		vec3 Fr = specularColor;
	#endif
	vec3 FssEss = Fr * fab.x + specularF90 * fab.y;
	float Ess = fab.x + fab.y;
	float Ems = 1.0 - Ess;
	vec3 Favg = Fr + ( 1.0 - Fr ) * 0.047619;	vec3 Fms = FssEss * Favg / ( 1.0 - Ems * Favg );
	singleScatter += FssEss;
	multiScatter += Fms * Ems;
}
#if NUM_RECT_AREA_LIGHTS > 0
	void RE_Direct_RectArea_Physical( const in RectAreaLight rectAreaLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
		vec3 normal = geometryNormal;
		vec3 viewDir = geometryViewDir;
		vec3 position = geometryPosition;
		vec3 lightPos = rectAreaLight.position;
		vec3 halfWidth = rectAreaLight.halfWidth;
		vec3 halfHeight = rectAreaLight.halfHeight;
		vec3 lightColor = rectAreaLight.color;
		float roughness = material.roughness;
		vec3 rectCoords[ 4 ];
		rectCoords[ 0 ] = lightPos + halfWidth - halfHeight;		rectCoords[ 1 ] = lightPos - halfWidth - halfHeight;
		rectCoords[ 2 ] = lightPos - halfWidth + halfHeight;
		rectCoords[ 3 ] = lightPos + halfWidth + halfHeight;
		vec2 uv = LTC_Uv( normal, viewDir, roughness );
		vec4 t1 = texture2D( ltc_1, uv );
		vec4 t2 = texture2D( ltc_2, uv );
		mat3 mInv = mat3(
			vec3( t1.x, 0, t1.y ),
			vec3(    0, 1,    0 ),
			vec3( t1.z, 0, t1.w )
		);
		vec3 fresnel = ( material.specularColorBlended * t2.x + ( material.specularF90 - material.specularColorBlended ) * t2.y );
		reflectedLight.directSpecular += lightColor * fresnel * LTC_Evaluate( normal, viewDir, position, mInv, rectCoords );
		reflectedLight.directDiffuse += lightColor * material.diffuseContribution * LTC_Evaluate( normal, viewDir, position, mat3( 1.0 ), rectCoords );
		#ifdef USE_CLEARCOAT
			vec3 Ncc = geometryClearcoatNormal;
			vec2 uvClearcoat = LTC_Uv( Ncc, viewDir, material.clearcoatRoughness );
			vec4 t1Clearcoat = texture2D( ltc_1, uvClearcoat );
			vec4 t2Clearcoat = texture2D( ltc_2, uvClearcoat );
			mat3 mInvClearcoat = mat3(
				vec3( t1Clearcoat.x, 0, t1Clearcoat.y ),
				vec3(             0, 1,             0 ),
				vec3( t1Clearcoat.z, 0, t1Clearcoat.w )
			);
			vec3 fresnelClearcoat = material.clearcoatF0 * t2Clearcoat.x + ( material.clearcoatF90 - material.clearcoatF0 ) * t2Clearcoat.y;
			clearcoatSpecularDirect += lightColor * fresnelClearcoat * LTC_Evaluate( Ncc, viewDir, position, mInvClearcoat, rectCoords );
		#endif
	}
#endif
void RE_Direct_Physical( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	#ifdef USE_CLEARCOAT
		float dotNLcc = saturate( dot( geometryClearcoatNormal, directLight.direction ) );
		vec3 ccIrradiance = dotNLcc * directLight.color;
		clearcoatSpecularDirect += ccIrradiance * BRDF_GGX_Clearcoat( directLight.direction, geometryViewDir, geometryClearcoatNormal, material );
	#endif
	#ifdef USE_SHEEN
 
 		sheenSpecularDirect += irradiance * BRDF_Sheen( directLight.direction, geometryViewDir, geometryNormal, material.sheenColor, material.sheenRoughness );
 
 		float sheenAlbedoV = IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness );
 		float sheenAlbedoL = IBLSheenBRDF( geometryNormal, directLight.direction, material.sheenRoughness );
 
 		float sheenEnergyComp = 1.0 - max3( material.sheenColor ) * max( sheenAlbedoV, sheenAlbedoL );
 
 		irradiance *= sheenEnergyComp;
 
 	#endif
	vec3 specularBRDF = BRDF_GGX( directLight.direction, geometryViewDir, geometryNormal, material );
	#ifdef USE_RETROREFLECTION
		vec3 retroViewDir = reflect( - geometryViewDir, geometryNormal );
		vec3 retroSpecularBRDF = BRDF_GGX( directLight.direction, retroViewDir, geometryNormal, material );
		specularBRDF = mix( specularBRDF, retroSpecularBRDF, saturate( material.retroreflectivity ) );
	#endif
	reflectedLight.directSpecular += irradiance * specularBRDF * material.multiScatteringCompensation;
	vec3 halfDir = normalize( directLight.direction + geometryViewDir );
	float dotVH = saturate( dot( geometryViewDir, halfDir ) );
	vec3 F = F_Schlick( material.specularColor, material.specularF90, dotVH );
	#ifdef USE_RETROREFLECTION
		vec3 retroHalfDir = normalize( directLight.direction + retroViewDir );
		float dotRetroVH = saturate( dot( retroViewDir, retroHalfDir ) );
		vec3 retroF = F_Schlick( material.specularColor, material.specularF90, dotRetroVH );
		F = mix( F, retroF, saturate( material.retroreflectivity ) );
	#endif
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseContribution ) * ( 1.0 - F );
}
void RE_IndirectDiffuse_Physical( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
	vec3 singleScattering = vec3( 0.0 );
	vec3 multiScattering = vec3( 0.0 );
	#ifdef USE_IRIDESCENCE
		computeMultiscatteringIridescence( material.dfg, material.specularColor, material.specularF90, material.iridescence, material.iridescenceF0Dielectric, singleScattering, multiScattering );
	#else
		computeMultiscattering( material.dfg, material.specularColor, material.specularF90, singleScattering, multiScattering );
	#endif
	vec3 diffuse = irradiance * BRDF_Lambert( material.diffuseContribution ) * ( 1.0 - singleScattering - multiScattering );
	#ifdef USE_SHEEN
		float sheenAlbedo = IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness );
		sheenSpecularIndirect += irradiance * material.sheenColor * sheenAlbedo * RECIPROCAL_PI;
		float sheenEnergyComp = 1.0 - max3( material.sheenColor ) * sheenAlbedo;
		diffuse *= sheenEnergyComp;
	#endif
	reflectedLight.indirectDiffuse += diffuse;
}
void RE_IndirectSpecular_Physical( const in vec3 radiance, const in vec3 irradiance, const in vec3 clearcoatRadiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight) {
	#ifdef USE_CLEARCOAT
		clearcoatSpecularIndirect += clearcoatRadiance * EnvironmentBRDF( geometryClearcoatNormal, geometryViewDir, material.clearcoatF0, material.clearcoatF90, material.clearcoatRoughness );
	#endif
	#ifdef USE_SHEEN
		sheenSpecularIndirect += irradiance * material.sheenColor * IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness ) * RECIPROCAL_PI;
 	#endif
	vec3 singleScatteringDielectric = vec3( 0.0 );
	vec3 multiScatteringDielectric = vec3( 0.0 );
	vec3 singleScatteringMetallic = vec3( 0.0 );
	vec3 multiScatteringMetallic = vec3( 0.0 );
	#ifdef USE_IRIDESCENCE
		computeMultiscatteringIridescence( material.dfg, material.specularColor, material.specularF90, material.iridescence, material.iridescenceF0Dielectric, singleScatteringDielectric, multiScatteringDielectric );
		computeMultiscatteringIridescence( material.dfg, material.diffuseColor, material.specularF90, material.iridescence, material.iridescenceF0Metallic, singleScatteringMetallic, multiScatteringMetallic );
	#else
		computeMultiscattering( material.dfg, material.specularColor, material.specularF90, singleScatteringDielectric, multiScatteringDielectric );
		computeMultiscattering( material.dfg, material.diffuseColor, material.specularF90, singleScatteringMetallic, multiScatteringMetallic );
	#endif
	vec3 singleScattering = mix( singleScatteringDielectric, singleScatteringMetallic, material.metalness );
	vec3 multiScattering = mix( multiScatteringDielectric, multiScatteringMetallic, material.metalness );
	vec3 totalScatteringDielectric = singleScatteringDielectric + multiScatteringDielectric;
	vec3 diffuse = material.diffuseContribution * ( 1.0 - totalScatteringDielectric );
	vec3 cosineWeightedIrradiance = irradiance * RECIPROCAL_PI;
	vec3 indirectSpecular = radiance * singleScattering;
	indirectSpecular += multiScattering * cosineWeightedIrradiance;
	vec3 indirectDiffuse = diffuse * cosineWeightedIrradiance;
	#ifdef USE_SHEEN
		float sheenAlbedo = IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness );
		float sheenEnergyComp = 1.0 - max3( material.sheenColor ) * sheenAlbedo;
		indirectSpecular *= sheenEnergyComp;
		indirectDiffuse *= sheenEnergyComp;
	#endif
	reflectedLight.indirectSpecular += indirectSpecular;
	reflectedLight.indirectDiffuse += indirectDiffuse;
}
#define RE_Direct				RE_Direct_Physical
#define RE_Direct_RectArea		RE_Direct_RectArea_Physical
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Physical
#define RE_IndirectSpecular		RE_IndirectSpecular_Physical
float computeSpecularOcclusion( const in float dotNV, const in float ambientOcclusion, const in float roughness ) {
	return saturate( pow( dotNV + ambientOcclusion, exp2( - 16.0 * roughness - 1.0 ) ) - 1.0 + ambientOcclusion );
}`,by=`
vec3 geometryPosition = - vViewPosition;
vec3 geometryNormal = normal;
vec3 geometryViewDir = ( isOrthographic ) ? vec3( 0, 0, 1 ) : normalize( vViewPosition );
vec3 geometryClearcoatNormal = vec3( 0.0 );
#ifdef USE_CLEARCOAT
	geometryClearcoatNormal = clearcoatNormal;
#endif
#ifdef USE_IRIDESCENCE
	float dotNVi = saturate( dot( normal, geometryViewDir ) );
	if ( material.iridescenceThickness == 0.0 ) {
		material.iridescence = 0.0;
	} else {
		material.iridescence = saturate( material.iridescence );
	}
	if ( material.iridescence > 0.0 ) {
		vec3 iridescenceFresnelDielectric = evalIridescence( 1.0, material.iridescenceIOR, dotNVi, material.iridescenceThickness, material.specularColor );
		vec3 iridescenceFresnelMetallic = evalIridescence( 1.0, material.iridescenceIOR, dotNVi, material.iridescenceThickness, material.diffuseColor );
		material.iridescenceFresnel = mix( iridescenceFresnelDielectric, iridescenceFresnelMetallic, material.metalness );
		material.iridescenceF0Dielectric = Schlick_to_F0( iridescenceFresnelDielectric, 1.0, dotNVi );
		material.iridescenceF0Metallic = Schlick_to_F0( iridescenceFresnelMetallic, 1.0, dotNVi );
	}
#endif
#ifdef STANDARD
	float dotNVms = saturate( dot( geometryNormal, geometryViewDir ) );
	material.dfg = texture2D( dfgLUT, vec2( material.roughness, dotNVms ) ).rg;
	#if ( NUM_SUN_LIGHTS > 0 || NUM_DIR_LIGHTS > 0 || NUM_POINT_LIGHTS > 0 || NUM_SPOT_LIGHTS > 0 )
		float EssMs = material.dfg.x + material.dfg.y;
		material.multiScatteringCompensation = 1.0 + material.specularColorBlended * ( 1.0 / EssMs - 1.0 );
	#endif
#endif
IncidentLight directLight;
#if ( NUM_POINT_LIGHTS > 0 ) && defined( RE_Direct )
	PointLight pointLight;
	#if defined( USE_SHADOWMAP ) && NUM_POINT_LIGHT_SHADOWS > 0
	PointLightShadow pointLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_POINT_LIGHTS; i ++ ) {
		pointLight = pointLights[ i ];
		getPointLightInfo( pointLight, geometryPosition, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_POINT_LIGHT_SHADOWS ) && ( defined( SHADOWMAP_TYPE_PCF ) || defined( SHADOWMAP_TYPE_BASIC ) )
		pointLightShadow = pointLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getPointShadow( pointShadowMap[ i ], pointLightShadow.shadowMapSize, pointLightShadow.shadowIntensity, pointLightShadow.shadowBias, pointLightShadow.shadowRadius, vPointShadowCoord[ i ], pointLightShadow.shadowCameraNear, pointLightShadow.shadowCameraFar ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_SPOT_LIGHTS > 0 ) && defined( RE_Direct )
	SpotLight spotLight;
	vec4 spotColor;
	vec3 spotLightCoord;
	bool inSpotLightMap;
	#if defined( USE_SHADOWMAP ) && NUM_SPOT_LIGHT_SHADOWS > 0
	SpotLightShadow spotLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHTS; i ++ ) {
		spotLight = spotLights[ i ];
		getSpotLightInfo( spotLight, geometryPosition, directLight );
		#if ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS )
		#define SPOT_LIGHT_MAP_INDEX UNROLLED_LOOP_INDEX
		#elif ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
		#define SPOT_LIGHT_MAP_INDEX NUM_SPOT_LIGHT_MAPS
		#else
		#define SPOT_LIGHT_MAP_INDEX ( UNROLLED_LOOP_INDEX - NUM_SPOT_LIGHT_SHADOWS + NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS )
		#endif
		#if ( SPOT_LIGHT_MAP_INDEX < NUM_SPOT_LIGHT_MAPS )
			spotLightCoord = vSpotLightCoord[ i ].xyz / vSpotLightCoord[ i ].w;
			inSpotLightMap = all( lessThan( abs( spotLightCoord * 2. - 1. ), vec3( 1.0 ) ) );
			spotColor = texture2D( spotLightMap[ SPOT_LIGHT_MAP_INDEX ], spotLightCoord.xy );
			directLight.color = inSpotLightMap ? directLight.color * spotColor.rgb : directLight.color;
		#endif
		#undef SPOT_LIGHT_MAP_INDEX
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
		spotLightShadow = spotLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( spotShadowMap[ i ], spotLightShadow.shadowMapSize, spotLightShadow.shadowIntensity, spotLightShadow.shadowBias, spotLightShadow.shadowRadius, vSpotLightCoord[ i ] ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_SUN_LIGHTS > 0 ) && defined( RE_Direct )
	SunLight sunLight;
	#if defined( USE_SHADOWMAP ) && NUM_SUN_LIGHT_SHADOWS > 0
	SunLightShadow sunLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SUN_LIGHTS; i ++ ) {
		sunLight = sunLights[ i ];
		getSunLightInfo( sunLight, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_SUN_LIGHT_SHADOWS )
		sunLightShadow = sunLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getSunShadow( sunShadowMap[ i ], sunLightShadow, UNROLLED_LOOP_INDEX ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_DIR_LIGHTS > 0 ) && defined( RE_Direct )
	DirectionalLight directionalLight;
	#if defined( USE_SHADOWMAP ) && NUM_DIR_LIGHT_SHADOWS > 0
	DirectionalLightShadow directionalLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_DIR_LIGHTS; i ++ ) {
		directionalLight = directionalLights[ i ];
		getDirectionalLightInfo( directionalLight, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_DIR_LIGHT_SHADOWS )
		directionalLightShadow = directionalLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( directionalShadowMap[ i ], directionalLightShadow.shadowMapSize, directionalLightShadow.shadowIntensity, directionalLightShadow.shadowBias, directionalLightShadow.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_RECT_AREA_LIGHTS > 0 ) && defined( RE_Direct_RectArea )
	RectAreaLight rectAreaLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_RECT_AREA_LIGHTS; i ++ ) {
		rectAreaLight = rectAreaLights[ i ];
		RE_Direct_RectArea( rectAreaLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if defined( RE_IndirectDiffuse )
	vec3 iblIrradiance = vec3( 0.0 );
	vec3 irradiance = getAmbientLightIrradiance( ambientLightColor );
	#if defined( USE_LIGHT_PROBES )
		irradiance += getLightProbeIrradiance( lightProbe, geometryNormal );
	#endif
	#if ( NUM_HEMI_LIGHTS > 0 )
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_HEMI_LIGHTS; i ++ ) {
			irradiance += getHemisphereLightIrradiance( hemisphereLights[ i ], geometryNormal );
		}
		#pragma unroll_loop_end
	#endif
	#ifdef USE_LIGHT_PROBES_GRID
		vec3 probeWorldPos = ( ( vec4( geometryPosition, 1.0 ) - viewMatrix[ 3 ] ) * viewMatrix ).xyz;
		vec3 probeWorldNormal = transformNormalByInverseViewMatrix( geometryNormal, viewMatrix );
		irradiance += getLightProbeGridIrradiance( probeWorldPos, probeWorldNormal );
	#endif
#endif
#if defined( RE_IndirectSpecular )
	vec3 radiance = vec3( 0.0 );
	vec3 clearcoatRadiance = vec3( 0.0 );
#endif`,Cy=`#if defined( RE_IndirectDiffuse )
	#ifdef USE_LIGHTMAP
		vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
		vec3 lightMapIrradiance = lightMapTexel.rgb * lightMapIntensity;
		irradiance += lightMapIrradiance;
	#endif
	#if defined( USE_ENVMAP ) && defined( ENVMAP_TYPE_CUBE_UV )
		#if defined( STANDARD ) || defined( LAMBERT ) || defined( PHONG )
			iblIrradiance += getIBLIrradiance( geometryNormal );
		#endif
	#endif
#endif
#if defined( USE_ENVMAP ) && defined( RE_IndirectSpecular )
	#ifdef USE_ANISOTROPY
		vec3 iblRadiance = getIBLAnisotropyRadiance( geometryViewDir, geometryNormal, material.roughness, material.anisotropyB, material.anisotropy );
	#else
		vec3 iblRadiance = getIBLRadiance( geometryViewDir, geometryNormal, material.roughness );
	#endif
	#ifdef USE_RETROREFLECTION
		#ifdef USE_ANISOTROPY
			vec3 retroIBLRadiance = getIBLAnisotropyRetroRadiance( geometryViewDir, geometryNormal, material.roughness, material.anisotropyB, material.anisotropy );
		#else
			vec3 retroIBLRadiance = getIBLRetroRadiance( geometryViewDir, geometryNormal, material.roughness );
		#endif
		iblRadiance = mix( iblRadiance, retroIBLRadiance, saturate( material.retroreflectivity ) );
	#endif
	radiance += iblRadiance;
	#ifdef USE_CLEARCOAT
		clearcoatRadiance += getIBLRadiance( geometryViewDir, geometryClearcoatNormal, material.clearcoatRoughness );
	#endif
#endif`,Ty=`#if defined( RE_IndirectDiffuse )
	#if defined( LAMBERT ) || defined( PHONG )
		irradiance += iblIrradiance;
	#endif
	RE_IndirectDiffuse( irradiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif
#if defined( RE_IndirectSpecular )
	RE_IndirectSpecular( radiance, iblIrradiance, clearcoatRadiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif`,By=`#ifdef USE_LIGHT_PROBES_GRID
uniform highp sampler3D probesSH;
uniform vec3 probesMin;
uniform vec3 probesMax;
uniform vec3 probesResolution;
vec3 getLightProbeGridIrradiance( vec3 worldPos, vec3 worldNormal ) {
	vec3 res = probesResolution;
	vec3 gridRange = probesMax - probesMin;
	vec3 resMinusOne = res - 1.0;
	vec3 probeSpacing = gridRange / resMinusOne;
	vec3 samplePos = worldPos + worldNormal * probeSpacing * 0.5;
	vec3 uvw = clamp( ( samplePos - probesMin ) / gridRange, 0.0, 1.0 );
	uvw = uvw * resMinusOne / res + 0.5 / res;
	float nz          = res.z;
	float paddedSlices = nz + 2.0;
	float atlasDepth  = 7.0 * paddedSlices;
	float uvZBase     = uvw.z * nz + 1.0;
	vec4 s0 = texture( probesSH, vec3( uvw.xy, ( uvZBase                       ) / atlasDepth ) );
	vec4 s1 = texture( probesSH, vec3( uvw.xy, ( uvZBase +       paddedSlices   ) / atlasDepth ) );
	vec4 s2 = texture( probesSH, vec3( uvw.xy, ( uvZBase + 2.0 * paddedSlices   ) / atlasDepth ) );
	vec4 s3 = texture( probesSH, vec3( uvw.xy, ( uvZBase + 3.0 * paddedSlices   ) / atlasDepth ) );
	vec4 s4 = texture( probesSH, vec3( uvw.xy, ( uvZBase + 4.0 * paddedSlices   ) / atlasDepth ) );
	vec4 s5 = texture( probesSH, vec3( uvw.xy, ( uvZBase + 5.0 * paddedSlices   ) / atlasDepth ) );
	vec4 s6 = texture( probesSH, vec3( uvw.xy, ( uvZBase + 6.0 * paddedSlices   ) / atlasDepth ) );
	vec3 c0 = s0.xyz;
	vec3 c1 = vec3( s0.w, s1.xy );
	vec3 c2 = vec3( s1.zw, s2.x );
	vec3 c3 = s2.yzw;
	vec3 c4 = s3.xyz;
	vec3 c5 = vec3( s3.w, s4.xy );
	vec3 c6 = vec3( s4.zw, s5.x );
	vec3 c7 = s5.yzw;
	vec3 c8 = s6.xyz;
	float x = worldNormal.x, y = worldNormal.y, z = worldNormal.z;
	vec3 result = c0 * 0.886227;
	result += c1 * 2.0 * 0.511664 * y;
	result += c2 * 2.0 * 0.511664 * z;
	result += c3 * 2.0 * 0.511664 * x;
	result += c4 * 2.0 * 0.429043 * x * y;
	result += c5 * 2.0 * 0.429043 * y * z;
	result += c6 * ( 0.743125 * z * z - 0.247708 );
	result += c7 * 2.0 * 0.429043 * x * z;
	result += c8 * 0.429043 * ( x * x - y * y );
	return max( result, vec3( 0.0 ) );
}
#endif`,Iy=`#if defined( USE_LOGARITHMIC_DEPTH_BUFFER )
	gl_FragDepth = vIsPerspective == 0.0 ? gl_FragCoord.z : log2( vFragDepth ) * logDepthBufFC * 0.5;
#endif`,Ry=`#if defined( USE_LOGARITHMIC_DEPTH_BUFFER )
	uniform float logDepthBufFC;
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,Dy=`#ifdef USE_LOGARITHMIC_DEPTH_BUFFER
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,Py=`#ifdef USE_LOGARITHMIC_DEPTH_BUFFER
	vFragDepth = 1.0 + gl_Position.w;
	vIsPerspective = float( isPerspectiveMatrix( projectionMatrix ) );
#endif`,Ly=`#ifdef USE_MAP
	vec4 sampledDiffuseColor = texture2D( map, vMapUv );
	#ifdef DECODE_VIDEO_TEXTURE
		sampledDiffuseColor = sRGBTransferEOTF( sampledDiffuseColor );
	#endif
	diffuseColor *= sampledDiffuseColor;
#endif`,Fy=`#ifdef USE_MAP
	uniform sampler2D map;
#endif`,Uy=`#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
	#if defined( USE_POINTS_UV )
		vec2 uv = vUv;
	#else
		vec2 uv = ( uvTransform * vec3( gl_PointCoord.x, 1.0 - gl_PointCoord.y, 1 ) ).xy;
	#endif
#endif
#ifdef USE_MAP
	diffuseColor *= texture2D( map, uv );
#endif
#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, uv ).g;
#endif`,Ny=`#if defined( USE_POINTS_UV )
	varying vec2 vUv;
#else
	#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
		uniform mat3 uvTransform;
	#endif
#endif
#ifdef USE_MAP
	uniform sampler2D map;
#endif
#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,Oy=`float metalnessFactor = metalness;
#ifdef USE_METALNESSMAP
	vec4 texelMetalness = texture2D( metalnessMap, vMetalnessMapUv );
	metalnessFactor *= texelMetalness.b;
#endif`,Gy=`#ifdef USE_METALNESSMAP
	uniform sampler2D metalnessMap;
#endif`,ky=`#ifdef USE_INSTANCING_MORPH
	float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	float morphTargetBaseInfluence = texelFetch( morphTexture, ivec2( 0, gl_InstanceID ), 0 ).r;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		morphTargetInfluences[i] =  texelFetch( morphTexture, ivec2( i + 1, gl_InstanceID ), 0 ).r;
	}
#endif`,Qy=`#if defined( USE_MORPHCOLORS )
	vColor *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		#if defined( USE_COLOR_ALPHA )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ) * morphTargetInfluences[ i ];
		#elif defined( USE_COLOR )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ).rgb * morphTargetInfluences[ i ];
		#endif
	}
#endif`,zy=`#ifdef USE_MORPHNORMALS
	objectNormal *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) objectNormal += getMorph( gl_VertexID, i, 1 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,Hy=`#ifdef USE_MORPHTARGETS
	#ifndef USE_INSTANCING_MORPH
		uniform float morphTargetBaseInfluence;
		uniform float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	#endif
	uniform sampler2DArray morphTargetsTexture;
	uniform ivec2 morphTargetsTextureSize;
	vec4 getMorph( const in int vertexIndex, const in int morphTargetIndex, const in int offset ) {
		int texelIndex = vertexIndex * MORPHTARGETS_TEXTURE_STRIDE + offset;
		int y = texelIndex / morphTargetsTextureSize.x;
		int x = texelIndex - y * morphTargetsTextureSize.x;
		ivec3 morphUV = ivec3( x, y, morphTargetIndex );
		return texelFetch( morphTargetsTexture, morphUV, 0 );
	}
#endif`,Vy=`#ifdef USE_MORPHTARGETS
	transformed *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) transformed += getMorph( gl_VertexID, i, 0 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,Wy=`float faceDirection = gl_FrontFacing ? 1.0 : - 1.0;
#ifdef FLAT_SHADED
	vec3 fdx = dFdx( vViewPosition );
	vec3 fdy = dFdy( vViewPosition );
	vec3 normal = normalize( cross( fdx, fdy ) );
#else
	vec3 normal = normalize( vNormal );
	#ifdef DOUBLE_SIDED
		normal *= faceDirection;
	#endif
#endif
#if defined( USE_NORMALMAP_TANGENTSPACE ) || defined( USE_CLEARCOAT_NORMALMAP ) || defined( USE_ANISOTROPY )
	#ifdef USE_TANGENT
		mat3 tbn = mat3( normalize( vTangent ), normalize( vBitangent ), normal );
	#else
		mat3 tbn = getTangentFrame( - vViewPosition, normal,
		#if defined( USE_NORMALMAP )
			vNormalMapUv
		#elif defined( USE_CLEARCOAT_NORMALMAP )
			vClearcoatNormalMapUv
		#else
			vUv
		#endif
		);
	#endif
	#ifdef DOUBLE_SIDED
		tbn[0] *= faceDirection;
		tbn[1] *= faceDirection;
	#endif
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	#ifdef USE_TANGENT
		mat3 tbn2 = mat3( normalize( vTangent ), normalize( vBitangent ), normal );
	#else
		mat3 tbn2 = getTangentFrame( - vViewPosition, normal, vClearcoatNormalMapUv );
	#endif
	#ifdef DOUBLE_SIDED
		tbn2[0] *= faceDirection;
		tbn2[1] *= faceDirection;
	#endif
#endif
vec3 nonPerturbedNormal = normal;`,Yy=`#ifdef USE_NORMALMAP_OBJECTSPACE
	normal = texture2D( normalMap, vNormalMapUv ).xyz * 2.0 - 1.0;
	#ifdef FLIP_SIDED
		normal = - normal;
	#endif
	#ifdef DOUBLE_SIDED
		normal = normal * faceDirection;
	#endif
	normal = normalize( normalMatrix * normal );
#elif defined( USE_NORMALMAP_TANGENTSPACE )
	vec3 mapN = texture2D( normalMap, vNormalMapUv ).xyz * 2.0 - 1.0;
	#if defined( USE_PACKED_NORMALMAP )
		mapN = vec3( mapN.xy, sqrt( saturate( 1.0 - dot( mapN.xy, mapN.xy ) ) ) );
	#endif
	mapN.xy *= normalScale;
	normal = normalize( tbn * mapN );
#elif defined( USE_BUMPMAP )
	normal = perturbNormalArb( - vViewPosition, normal, dHdxy_fwd(), faceDirection );
#endif`,Xy=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,qy=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,Ky=`#ifndef FLAT_SHADED
	vNormal = normalize( transformedNormal );
	#ifdef USE_TANGENT
		vTangent = normalize( transformedTangent );
		vBitangent = normalize( cross( vNormal, vTangent ) * tangent.w );
		#ifdef FLIP_SIDED
			vBitangent = - vBitangent;
		#endif
	#endif
#endif`,Jy=`#ifdef USE_NORMALMAP
	uniform sampler2D normalMap;
	uniform vec2 normalScale;
#endif
#ifdef USE_NORMALMAP_OBJECTSPACE
	uniform mat3 normalMatrix;
#endif
#if ! defined ( USE_TANGENT ) && ( defined ( USE_NORMALMAP_TANGENTSPACE ) || defined ( USE_CLEARCOAT_NORMALMAP ) || defined( USE_ANISOTROPY ) )
	mat3 getTangentFrame( vec3 eye_pos, vec3 surf_norm, vec2 uv ) {
		vec3 q0 = dFdx( eye_pos.xyz );
		vec3 q1 = dFdy( eye_pos.xyz );
		vec2 st0 = dFdx( uv.st );
		vec2 st1 = dFdy( uv.st );
		vec3 N = surf_norm;
		vec3 q1perp = cross( q1, N );
		vec3 q0perp = cross( N, q0 );
		vec3 T = q1perp * st0.x + q0perp * st1.x;
		vec3 B = q1perp * st0.y + q0perp * st1.y;
		float det = max( dot( T, T ), dot( B, B ) );
		float scale = ( det == 0.0 ) ? 0.0 : inversesqrt( det );
		return mat3( T * scale, B * scale, N );
	}
#endif`,Zy=`#ifdef USE_CLEARCOAT
	vec3 clearcoatNormal = nonPerturbedNormal;
#endif`,$y=`#ifdef USE_CLEARCOAT_NORMALMAP
	vec3 clearcoatMapN = texture2D( clearcoatNormalMap, vClearcoatNormalMapUv ).xyz * 2.0 - 1.0;
	clearcoatMapN.xy *= clearcoatNormalScale;
	clearcoatNormal = normalize( tbn2 * clearcoatMapN );
#endif`,jy=`#ifdef USE_CLEARCOATMAP
	uniform sampler2D clearcoatMap;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform sampler2D clearcoatNormalMap;
	uniform vec2 clearcoatNormalScale;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform sampler2D clearcoatRoughnessMap;
#endif`,tM=`#ifdef USE_IRIDESCENCEMAP
	uniform sampler2D iridescenceMap;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform sampler2D iridescenceThicknessMap;
#endif`,eM=`#ifdef OPAQUE
diffuseColor.a = 1.0;
#endif
#ifdef USE_TRANSMISSION
diffuseColor.a *= material.transmissionAlpha;
#endif
gl_FragColor = vec4( outgoingLight, diffuseColor.a );`,nM=`vec3 packNormalToRGB( const in vec3 normal ) {
	return normalize( normal ) * 0.5 + 0.5;
}
vec3 unpackRGBToNormal( const in vec3 rgb ) {
	return 2.0 * rgb.xyz - 1.0;
}
const float PackUpscale = 256. / 255.;const float UnpackDownscale = 255. / 256.;const float ShiftRight8 = 1. / 256.;
const float Inv255 = 1. / 255.;
const vec4 PackFactors = vec4( 1.0, 256.0, 256.0 * 256.0, 256.0 * 256.0 * 256.0 );
const vec2 UnpackFactors2 = vec2( UnpackDownscale, 1.0 / PackFactors.g );
const vec3 UnpackFactors3 = vec3( UnpackDownscale / PackFactors.rg, 1.0 / PackFactors.b );
const vec4 UnpackFactors4 = vec4( UnpackDownscale / PackFactors.rgb, 1.0 / PackFactors.a );
vec4 packDepthToRGBA( const in float v ) {
	if( v <= 0.0 )
		return vec4( 0., 0., 0., 0. );
	if( v >= 1.0 )
		return vec4( 1., 1., 1., 1. );
	float vuf;
	float af = modf( v * PackFactors.a, vuf );
	float bf = modf( vuf * ShiftRight8, vuf );
	float gf = modf( vuf * ShiftRight8, vuf );
	return vec4( vuf * Inv255, gf * PackUpscale, bf * PackUpscale, af );
}
vec3 packDepthToRGB( const in float v ) {
	if( v <= 0.0 )
		return vec3( 0., 0., 0. );
	if( v >= 1.0 )
		return vec3( 1., 1., 1. );
	float vuf;
	float bf = modf( v * PackFactors.b, vuf );
	float gf = modf( vuf * ShiftRight8, vuf );
	return vec3( vuf * Inv255, gf * PackUpscale, bf );
}
vec2 packDepthToRG( const in float v ) {
	if( v <= 0.0 )
		return vec2( 0., 0. );
	if( v >= 1.0 )
		return vec2( 1., 1. );
	float vuf;
	float gf = modf( v * 256., vuf );
	return vec2( vuf * Inv255, gf );
}
float unpackRGBAToDepth( const in vec4 v ) {
	return dot( v, UnpackFactors4 );
}
float unpackRGBToDepth( const in vec3 v ) {
	return dot( v, UnpackFactors3 );
}
float unpackRGToDepth( const in vec2 v ) {
	return v.r * UnpackFactors2.r + v.g * UnpackFactors2.g;
}
vec4 pack2HalfToRGBA( const in vec2 v ) {
	vec4 r = vec4( v.x, fract( v.x * 255.0 ), v.y, fract( v.y * 255.0 ) );
	return vec4( r.x - r.y / 255.0, r.y, r.z - r.w / 255.0, r.w );
}
vec2 unpackRGBATo2Half( const in vec4 v ) {
	return vec2( v.x + ( v.y / 255.0 ), v.z + ( v.w / 255.0 ) );
}
float viewZToOrthographicDepth( const in float viewZ, const in float near, const in float far ) {
	return ( viewZ + near ) / ( near - far );
}
float orthographicDepthToViewZ( const in float depth, const in float near, const in float far ) {
	#ifdef USE_REVERSED_DEPTH_BUFFER
	
		return depth * ( far - near ) - far;
	#else
		return depth * ( near - far ) - near;
	#endif
}
float viewZToPerspectiveDepth( const in float viewZ, const in float near, const in float far ) {
	return ( ( near + viewZ ) * far ) / ( ( far - near ) * viewZ );
}
float perspectiveDepthToViewZ( const in float depth, const in float near, const in float far ) {
	
	#ifdef USE_REVERSED_DEPTH_BUFFER
		return ( near * far ) / ( ( near - far ) * depth - near );
	#else
		return ( near * far ) / ( ( far - near ) * depth - far );
	#endif
}`,iM=`#ifdef PREMULTIPLIED_ALPHA
	gl_FragColor.rgb *= gl_FragColor.a;
#endif`,sM=`vec4 mvPosition = vec4( transformed, 1.0 );
#ifdef USE_BATCHING
	mvPosition = batchingMatrix * mvPosition;
#endif
#ifdef USE_INSTANCING
	mvPosition = instanceMatrix * mvPosition;
#endif
mvPosition = modelViewMatrix * mvPosition;
gl_Position = projectionMatrix * mvPosition;`,rM=`#ifdef DITHERING
	gl_FragColor.rgb = dithering( gl_FragColor.rgb );
#endif`,aM=`#ifdef DITHERING
	vec3 dithering( vec3 color ) {
		float grid_position = rand( gl_FragCoord.xy );
		vec3 dither_shift_RGB = vec3( 0.25 / 255.0, -0.25 / 255.0, 0.25 / 255.0 );
		dither_shift_RGB = mix( 2.0 * dither_shift_RGB, -2.0 * dither_shift_RGB, grid_position );
		return color + dither_shift_RGB;
	}
#endif`,oM=`float roughnessFactor = roughness;
#ifdef USE_ROUGHNESSMAP
	vec4 texelRoughness = texture2D( roughnessMap, vRoughnessMapUv );
	roughnessFactor *= texelRoughness.g;
#endif`,lM=`#ifdef USE_ROUGHNESSMAP
	uniform sampler2D roughnessMap;
#endif`,cM=`#if NUM_SPOT_LIGHT_COORDS > 0
	varying vec4 vSpotLightCoord[ NUM_SPOT_LIGHT_COORDS ];
#endif
#if NUM_SPOT_LIGHT_MAPS > 0
	uniform sampler2D spotLightMap[ NUM_SPOT_LIGHT_MAPS ];
#endif
#ifdef USE_SHADOWMAP
	#if NUM_SUN_LIGHT_SHADOWS > 0
		#define SUN_LIGHT_CASCADES 2
		#if defined( SHADOWMAP_TYPE_PCF )
			uniform sampler2DShadow sunShadowMap[ NUM_SUN_LIGHT_SHADOWS ];
		#else
			uniform sampler2D sunShadowMap[ NUM_SUN_LIGHT_SHADOWS ];
		#endif
		uniform mat4 sunShadowMatrix[ NUM_SUN_LIGHT_SHADOWS * SUN_LIGHT_CASCADES ];
		uniform vec4 sunShadowCascade[ NUM_SUN_LIGHT_SHADOWS * SUN_LIGHT_CASCADES ];
		varying vec4 vSunShadowWorldPosition;
		varying vec3 vSunShadowWorldNormal;
		struct SunLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SunLightShadow sunLightShadows[ NUM_SUN_LIGHT_SHADOWS ];
	#endif
	#if NUM_DIR_LIGHT_SHADOWS > 0
		#if defined( SHADOWMAP_TYPE_PCF )
			uniform sampler2DShadow directionalShadowMap[ NUM_DIR_LIGHT_SHADOWS ];
		#else
			uniform sampler2D directionalShadowMap[ NUM_DIR_LIGHT_SHADOWS ];
		#endif
		varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHT_SHADOWS ];
		struct DirectionalLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform DirectionalLightShadow directionalLightShadows[ NUM_DIR_LIGHT_SHADOWS ];
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
		#if defined( SHADOWMAP_TYPE_PCF )
			uniform sampler2DShadow spotShadowMap[ NUM_SPOT_LIGHT_SHADOWS ];
		#else
			uniform sampler2D spotShadowMap[ NUM_SPOT_LIGHT_SHADOWS ];
		#endif
		struct SpotLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SpotLightShadow spotLightShadows[ NUM_SPOT_LIGHT_SHADOWS ];
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		#if defined( SHADOWMAP_TYPE_PCF )
			uniform samplerCubeShadow pointShadowMap[ NUM_POINT_LIGHT_SHADOWS ];
		#elif defined( SHADOWMAP_TYPE_BASIC )
			uniform samplerCube pointShadowMap[ NUM_POINT_LIGHT_SHADOWS ];
		#endif
		varying vec4 vPointShadowCoord[ NUM_POINT_LIGHT_SHADOWS ];
		struct PointLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
			float shadowCameraNear;
			float shadowCameraFar;
		};
		uniform PointLightShadow pointLightShadows[ NUM_POINT_LIGHT_SHADOWS ];
	#endif
	#if defined( SHADOWMAP_TYPE_PCF )
		float interleavedGradientNoise( vec2 position ) {
			return fract( 52.9829189 * fract( dot( position, vec2( 0.06711056, 0.00583715 ) ) ) );
		}
		vec2 vogelDiskSample( int sampleIndex, int samplesCount, float phi ) {
			const float goldenAngle = 2.399963229728653;
			float r = sqrt( ( float( sampleIndex ) + 0.5 ) / float( samplesCount ) );
			float theta = float( sampleIndex ) * goldenAngle + phi;
			return vec2( cos( theta ), sin( theta ) ) * r;
		}
	#endif
	#if defined( SHADOWMAP_TYPE_PCF )
		float getShadow( sampler2DShadow shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord ) {
			float shadow = 1.0;
			shadowCoord.xyz /= shadowCoord.w;
			shadowCoord.z += shadowBias;
			bool inFrustum = shadowCoord.x >= 0.0 && shadowCoord.x <= 1.0 && shadowCoord.y >= 0.0 && shadowCoord.y <= 1.0;
			bool frustumTest = inFrustum && shadowCoord.z <= 1.0;
			if ( frustumTest ) {
				vec2 texelSize = vec2( 1.0 ) / shadowMapSize;
				float radius = shadowRadius * texelSize.x;
				float phi = interleavedGradientNoise( gl_FragCoord.xy ) * PI2;
				shadow = (
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 0, 5, phi ) * radius, shadowCoord.z ) ) +
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 1, 5, phi ) * radius, shadowCoord.z ) ) +
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 2, 5, phi ) * radius, shadowCoord.z ) ) +
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 3, 5, phi ) * radius, shadowCoord.z ) ) +
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 4, 5, phi ) * radius, shadowCoord.z ) )
				) * 0.2;
			}
			return mix( 1.0, shadow, shadowIntensity );
		}
	#elif defined( SHADOWMAP_TYPE_VSM )
		float getShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord ) {
			float shadow = 1.0;
			shadowCoord.xyz /= shadowCoord.w;
			#ifdef USE_REVERSED_DEPTH_BUFFER
				shadowCoord.z -= shadowBias;
			#else
				shadowCoord.z += shadowBias;
			#endif
			bool inFrustum = shadowCoord.x >= 0.0 && shadowCoord.x <= 1.0 && shadowCoord.y >= 0.0 && shadowCoord.y <= 1.0;
			bool frustumTest = inFrustum && shadowCoord.z <= 1.0;
			if ( frustumTest ) {
				vec2 distribution = texture2D( shadowMap, shadowCoord.xy ).rg;
				float mean = distribution.x;
				float variance = distribution.y * distribution.y;
				#ifdef USE_REVERSED_DEPTH_BUFFER
					float hard_shadow = step( mean, shadowCoord.z );
				#else
					float hard_shadow = step( shadowCoord.z, mean );
				#endif
				
				if ( hard_shadow == 1.0 ) {
					shadow = 1.0;
				} else {
					variance = max( variance, 0.0000001 );
					float d = shadowCoord.z - mean;
					float p_max = variance / ( variance + d * d );
					p_max = clamp( ( p_max - 0.3 ) / 0.65, 0.0, 1.0 );
					shadow = max( hard_shadow, p_max );
				}
			}
			return mix( 1.0, shadow, shadowIntensity );
		}
	#else
		float getShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord ) {
			float shadow = 1.0;
			shadowCoord.xyz /= shadowCoord.w;
			#ifdef USE_REVERSED_DEPTH_BUFFER
				shadowCoord.z -= shadowBias;
			#else
				shadowCoord.z += shadowBias;
			#endif
			bool inFrustum = shadowCoord.x >= 0.0 && shadowCoord.x <= 1.0 && shadowCoord.y >= 0.0 && shadowCoord.y <= 1.0;
			bool frustumTest = inFrustum && shadowCoord.z <= 1.0;
			if ( frustumTest ) {
				float depth = texture2D( shadowMap, shadowCoord.xy ).r;
				#ifdef USE_REVERSED_DEPTH_BUFFER
					shadow = step( depth, shadowCoord.z );
				#else
					shadow = step( shadowCoord.z, depth );
				#endif
			}
			return mix( 1.0, shadow, shadowIntensity );
		}
	#endif
	#if NUM_SUN_LIGHT_SHADOWS > 0
		float getSunShadow(
			#if defined( SHADOWMAP_TYPE_PCF )
				sampler2DShadow shadowMap,
			#else
				sampler2D shadowMap,
			#endif
			SunLightShadow sunLightShadow,
			int shadowIndex
		) {
			vec4 shadowWorldPosition = vec4( vSunShadowWorldPosition.xyz + vSunShadowWorldNormal * sunLightShadow.shadowNormalBias, 1.0 );
			float viewDepth = vSunShadowWorldPosition.w;
			int cascadeOffset = shadowIndex * SUN_LIGHT_CASCADES;
			float shadow = 1.0;
			for ( int i = SUN_LIGHT_CASCADES - 1; i >= 0; i -- ) {
				vec4 cascade = sunShadowCascade[ cascadeOffset + i ];
				if ( viewDepth >= cascade.x && viewDepth < cascade.y ) {
					float cascadeShadow = getShadow(
						shadowMap,
						sunLightShadow.shadowMapSize,
						sunLightShadow.shadowIntensity,
						sunLightShadow.shadowBias,
						sunLightShadow.shadowRadius,
						sunShadowMatrix[ cascadeOffset + i ] * shadowWorldPosition
					);
					shadow = mix( cascadeShadow, shadow, smoothstep( cascade.z, cascade.y, viewDepth ) );
				}
			}
			return shadow;
		}
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
	#if defined( SHADOWMAP_TYPE_PCF )
	float getPointShadow( samplerCubeShadow shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord, float shadowCameraNear, float shadowCameraFar ) {
		float shadow = 1.0;
		vec3 lightToPosition = shadowCoord.xyz;
		vec3 bd3D = normalize( lightToPosition );
		vec3 absVec = abs( lightToPosition );
		float viewSpaceZ = max( max( absVec.x, absVec.y ), absVec.z );
		if ( viewSpaceZ - shadowCameraFar <= 0.0 && viewSpaceZ - shadowCameraNear >= 0.0 ) {
			#ifdef USE_REVERSED_DEPTH_BUFFER
				float dp = ( shadowCameraNear * ( shadowCameraFar - viewSpaceZ ) ) / ( viewSpaceZ * ( shadowCameraFar - shadowCameraNear ) );
				dp -= shadowBias;
			#else
				float dp = ( shadowCameraFar * ( viewSpaceZ - shadowCameraNear ) ) / ( viewSpaceZ * ( shadowCameraFar - shadowCameraNear ) );
				dp += shadowBias;
			#endif
			float texelSize = shadowRadius / shadowMapSize.x;
			vec3 absDir = abs( bd3D );
			vec3 tangent = absDir.x > absDir.z ? vec3( 0.0, 1.0, 0.0 ) : vec3( 1.0, 0.0, 0.0 );
			tangent = normalize( cross( bd3D, tangent ) );
			vec3 bitangent = cross( bd3D, tangent );
			float phi = interleavedGradientNoise( gl_FragCoord.xy ) * PI2;
			vec2 sample0 = vogelDiskSample( 0, 5, phi );
			vec2 sample1 = vogelDiskSample( 1, 5, phi );
			vec2 sample2 = vogelDiskSample( 2, 5, phi );
			vec2 sample3 = vogelDiskSample( 3, 5, phi );
			vec2 sample4 = vogelDiskSample( 4, 5, phi );
			shadow = (
				texture( shadowMap, vec4( bd3D + ( tangent * sample0.x + bitangent * sample0.y ) * texelSize, dp ) ) +
				texture( shadowMap, vec4( bd3D + ( tangent * sample1.x + bitangent * sample1.y ) * texelSize, dp ) ) +
				texture( shadowMap, vec4( bd3D + ( tangent * sample2.x + bitangent * sample2.y ) * texelSize, dp ) ) +
				texture( shadowMap, vec4( bd3D + ( tangent * sample3.x + bitangent * sample3.y ) * texelSize, dp ) ) +
				texture( shadowMap, vec4( bd3D + ( tangent * sample4.x + bitangent * sample4.y ) * texelSize, dp ) )
			) * 0.2;
		}
		return mix( 1.0, shadow, shadowIntensity );
	}
	#elif defined( SHADOWMAP_TYPE_BASIC )
	float getPointShadow( samplerCube shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord, float shadowCameraNear, float shadowCameraFar ) {
		float shadow = 1.0;
		vec3 lightToPosition = shadowCoord.xyz;
		vec3 absVec = abs( lightToPosition );
		float viewSpaceZ = max( max( absVec.x, absVec.y ), absVec.z );
		if ( viewSpaceZ - shadowCameraFar <= 0.0 && viewSpaceZ - shadowCameraNear >= 0.0 ) {
			float dp = ( shadowCameraFar * ( viewSpaceZ - shadowCameraNear ) ) / ( viewSpaceZ * ( shadowCameraFar - shadowCameraNear ) );
			dp += shadowBias;
			vec3 bd3D = normalize( lightToPosition );
			float depth = textureCube( shadowMap, bd3D ).r;
			#ifdef USE_REVERSED_DEPTH_BUFFER
				depth = 1.0 - depth;
			#endif
			shadow = step( dp, depth );
		}
		return mix( 1.0, shadow, shadowIntensity );
	}
	#endif
	#endif
#endif`,hM=`#if NUM_SPOT_LIGHT_COORDS > 0
	uniform mat4 spotLightMatrix[ NUM_SPOT_LIGHT_COORDS ];
	varying vec4 vSpotLightCoord[ NUM_SPOT_LIGHT_COORDS ];
#endif
#ifdef USE_SHADOWMAP
	#if NUM_SUN_LIGHT_SHADOWS > 0
		varying vec4 vSunShadowWorldPosition;
		varying vec3 vSunShadowWorldNormal;
	#endif
	#if NUM_DIR_LIGHT_SHADOWS > 0
		uniform mat4 directionalShadowMatrix[ NUM_DIR_LIGHT_SHADOWS ];
		varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHT_SHADOWS ];
		struct DirectionalLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform DirectionalLightShadow directionalLightShadows[ NUM_DIR_LIGHT_SHADOWS ];
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
		struct SpotLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SpotLightShadow spotLightShadows[ NUM_SPOT_LIGHT_SHADOWS ];
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		uniform mat4 pointShadowMatrix[ NUM_POINT_LIGHT_SHADOWS ];
		varying vec4 vPointShadowCoord[ NUM_POINT_LIGHT_SHADOWS ];
		struct PointLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
			float shadowCameraNear;
			float shadowCameraFar;
		};
		uniform PointLightShadow pointLightShadows[ NUM_POINT_LIGHT_SHADOWS ];
	#endif
#endif`,uM=`#if ( defined( USE_SHADOWMAP ) && ( NUM_DIR_LIGHT_SHADOWS > 0 || NUM_SUN_LIGHT_SHADOWS > 0 || NUM_POINT_LIGHT_SHADOWS > 0 ) ) || ( NUM_SPOT_LIGHT_COORDS > 0 )
	#ifdef HAS_NORMAL
		vec3 shadowWorldNormal = transformNormalByInverseViewMatrix( transformedNormal, viewMatrix );
	#else
		vec3 shadowWorldNormal = vec3( 0.0 );
	#endif
	vec4 shadowWorldPosition;
#endif
#if defined( USE_SHADOWMAP )
	#if NUM_SUN_LIGHT_SHADOWS > 0
		vSunShadowWorldPosition = vec4( worldPosition.xyz, - mvPosition.z );
		vSunShadowWorldNormal = shadowWorldNormal;
	#endif
	#if NUM_DIR_LIGHT_SHADOWS > 0
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_DIR_LIGHT_SHADOWS; i ++ ) {
			shadowWorldPosition = worldPosition + vec4( shadowWorldNormal * directionalLightShadows[ i ].shadowNormalBias, 0 );
			vDirectionalShadowCoord[ i ] = directionalShadowMatrix[ i ] * shadowWorldPosition;
		}
		#pragma unroll_loop_end
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_POINT_LIGHT_SHADOWS; i ++ ) {
			shadowWorldPosition = worldPosition + vec4( shadowWorldNormal * pointLightShadows[ i ].shadowNormalBias, 0 );
			vPointShadowCoord[ i ] = pointShadowMatrix[ i ] * shadowWorldPosition;
		}
		#pragma unroll_loop_end
	#endif
#endif
#if NUM_SPOT_LIGHT_COORDS > 0
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHT_COORDS; i ++ ) {
		shadowWorldPosition = worldPosition;
		#if ( defined( USE_SHADOWMAP ) && UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
			shadowWorldPosition.xyz += shadowWorldNormal * spotLightShadows[ i ].shadowNormalBias;
		#endif
		vSpotLightCoord[ i ] = spotLightMatrix[ i ] * shadowWorldPosition;
	}
	#pragma unroll_loop_end
#endif`,fM=`float getShadowMask() {
	float shadow = 1.0;
	#ifdef USE_SHADOWMAP
	#if NUM_SUN_LIGHT_SHADOWS > 0
	SunLightShadow sunLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SUN_LIGHT_SHADOWS; i ++ ) {
		sunLight = sunLightShadows[ i ];
		shadow *= receiveShadow ? getSunShadow( sunShadowMap[ i ], sunLight, UNROLLED_LOOP_INDEX ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_DIR_LIGHT_SHADOWS > 0
	DirectionalLightShadow directionalLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_DIR_LIGHT_SHADOWS; i ++ ) {
		directionalLight = directionalLightShadows[ i ];
		shadow *= receiveShadow ? getShadow( directionalShadowMap[ i ], directionalLight.shadowMapSize, directionalLight.shadowIntensity, directionalLight.shadowBias, directionalLight.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
	SpotLightShadow spotLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHT_SHADOWS; i ++ ) {
		spotLight = spotLightShadows[ i ];
		shadow *= receiveShadow ? getShadow( spotShadowMap[ i ], spotLight.shadowMapSize, spotLight.shadowIntensity, spotLight.shadowBias, spotLight.shadowRadius, vSpotLightCoord[ i ] ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0 && ( defined( SHADOWMAP_TYPE_PCF ) || defined( SHADOWMAP_TYPE_BASIC ) )
	PointLightShadow pointLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_POINT_LIGHT_SHADOWS; i ++ ) {
		pointLight = pointLightShadows[ i ];
		shadow *= receiveShadow ? getPointShadow( pointShadowMap[ i ], pointLight.shadowMapSize, pointLight.shadowIntensity, pointLight.shadowBias, pointLight.shadowRadius, vPointShadowCoord[ i ], pointLight.shadowCameraNear, pointLight.shadowCameraFar ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#endif
	return shadow;
}`,dM=`#ifdef USE_SKINNING
	mat4 boneMatX = getBoneMatrix( skinIndex.x );
	mat4 boneMatY = getBoneMatrix( skinIndex.y );
	mat4 boneMatZ = getBoneMatrix( skinIndex.z );
	mat4 boneMatW = getBoneMatrix( skinIndex.w );
#endif`,pM=`#ifdef USE_SKINNING
	uniform mat4 bindMatrix;
	uniform mat4 bindMatrixInverse;
	uniform highp sampler2D boneTexture;
	mat4 getBoneMatrix( const in float i ) {
		int size = textureSize( boneTexture, 0 ).x;
		int j = int( i ) * 4;
		int x = j % size;
		int y = j / size;
		vec4 v1 = texelFetch( boneTexture, ivec2( x, y ), 0 );
		vec4 v2 = texelFetch( boneTexture, ivec2( x + 1, y ), 0 );
		vec4 v3 = texelFetch( boneTexture, ivec2( x + 2, y ), 0 );
		vec4 v4 = texelFetch( boneTexture, ivec2( x + 3, y ), 0 );
		return mat4( v1, v2, v3, v4 );
	}
#endif`,AM=`#ifdef USE_SKINNING
	vec4 skinVertex = bindMatrix * vec4( transformed, 1.0 );
	vec4 skinned = vec4( 0.0 );
	skinned += boneMatX * skinVertex * skinWeight.x;
	skinned += boneMatY * skinVertex * skinWeight.y;
	skinned += boneMatZ * skinVertex * skinWeight.z;
	skinned += boneMatW * skinVertex * skinWeight.w;
	transformed = ( bindMatrixInverse * skinned ).xyz;
#endif`,mM=`#ifdef USE_SKINNING
	mat4 skinMatrix = mat4( 0.0 );
	skinMatrix += skinWeight.x * boneMatX;
	skinMatrix += skinWeight.y * boneMatY;
	skinMatrix += skinWeight.z * boneMatZ;
	skinMatrix += skinWeight.w * boneMatW;
	skinMatrix = bindMatrixInverse * skinMatrix * bindMatrix;
	objectNormal = vec4( skinMatrix * vec4( objectNormal, 0.0 ) ).xyz;
	#ifdef USE_TANGENT
		objectTangent = vec4( skinMatrix * vec4( objectTangent, 0.0 ) ).xyz;
	#endif
#endif`,gM=`float specularStrength;
#ifdef USE_SPECULARMAP
	vec4 texelSpecular = texture2D( specularMap, vSpecularMapUv );
	specularStrength = texelSpecular.r;
#else
	specularStrength = 1.0;
#endif`,xM=`#ifdef USE_SPECULARMAP
	uniform sampler2D specularMap;
#endif`,_M=`#if defined( TONE_MAPPING )
	gl_FragColor.rgb = toneMapping( gl_FragColor.rgb );
#endif`,vM=`#ifndef saturate
#define saturate( a ) clamp( a, 0.0, 1.0 )
#endif
uniform float toneMappingExposure;
vec3 LinearToneMapping( vec3 color ) {
	return saturate( toneMappingExposure * color );
}
vec3 ReinhardToneMapping( vec3 color ) {
	color *= toneMappingExposure;
	return saturate( color / ( vec3( 1.0 ) + color ) );
}
vec3 CineonToneMapping( vec3 color ) {
	color *= toneMappingExposure;
	color = max( vec3( 0.0 ), color - 0.004 );
	return pow( ( color * ( 6.2 * color + 0.5 ) ) / ( color * ( 6.2 * color + 1.7 ) + 0.06 ), vec3( 2.2 ) );
}
vec3 RRTAndODTFit( vec3 v ) {
	vec3 a = v * ( v + 0.0245786 ) - 0.000090537;
	vec3 b = v * ( 0.983729 * v + 0.4329510 ) + 0.238081;
	return a / b;
}
vec3 ACESFilmicToneMapping( vec3 color ) {
	const mat3 ACESInputMat = mat3(
		vec3( 0.59719, 0.07600, 0.02840 ),		vec3( 0.35458, 0.90834, 0.13383 ),
		vec3( 0.04823, 0.01566, 0.83777 )
	);
	const mat3 ACESOutputMat = mat3(
		vec3(  1.60475, -0.10208, -0.00327 ),		vec3( -0.53108,  1.10813, -0.07276 ),
		vec3( -0.07367, -0.00605,  1.07602 )
	);
	color *= toneMappingExposure / 0.6;
	color = ACESInputMat * color;
	color = RRTAndODTFit( color );
	color = ACESOutputMat * color;
	return saturate( color );
}
const mat3 LINEAR_REC2020_TO_LINEAR_SRGB = mat3(
	vec3( 1.6605, - 0.1246, - 0.0182 ),
	vec3( - 0.5876, 1.1329, - 0.1006 ),
	vec3( - 0.0728, - 0.0083, 1.1187 )
);
const mat3 LINEAR_SRGB_TO_LINEAR_REC2020 = mat3(
	vec3( 0.6274, 0.0691, 0.0164 ),
	vec3( 0.3293, 0.9195, 0.0880 ),
	vec3( 0.0433, 0.0113, 0.8956 )
);
vec3 agxDefaultContrastApprox( vec3 x ) {
	vec3 x2 = x * x;
	vec3 x4 = x2 * x2;
	return + 15.5 * x4 * x2
		- 40.14 * x4 * x
		+ 31.96 * x4
		- 6.868 * x2 * x
		+ 0.4298 * x2
		+ 0.1191 * x
		- 0.00232;
}
vec3 AgXToneMapping( vec3 color ) {
	const mat3 AgXInsetMatrix = mat3(
		vec3( 0.856627153315983, 0.137318972929847, 0.11189821299995 ),
		vec3( 0.0951212405381588, 0.761241990602591, 0.0767994186031903 ),
		vec3( 0.0482516061458583, 0.101439036467562, 0.811302368396859 )
	);
	const mat3 AgXOutsetMatrix = mat3(
		vec3( 1.1271005818144368, - 0.1413297634984383, - 0.14132976349843826 ),
		vec3( - 0.11060664309660323, 1.157823702216272, - 0.11060664309660294 ),
		vec3( - 0.016493938717834573, - 0.016493938717834257, 1.2519364065950405 )
	);
	const float AgxMinEv = - 12.47393;	const float AgxMaxEv = 4.026069;
	color *= toneMappingExposure;
	color = LINEAR_SRGB_TO_LINEAR_REC2020 * color;
	color = AgXInsetMatrix * color;
	color = max( color, 1e-10 );	color = log2( color );
	color = ( color - AgxMinEv ) / ( AgxMaxEv - AgxMinEv );
	color = clamp( color, 0.0, 1.0 );
	color = agxDefaultContrastApprox( color );
	color = AgXOutsetMatrix * color;
	color = pow( max( vec3( 0.0 ), color ), vec3( 2.2 ) );
	color = LINEAR_REC2020_TO_LINEAR_SRGB * color;
	color = clamp( color, 0.0, 1.0 );
	return color;
}
vec3 NeutralToneMapping( vec3 color ) {
	const float StartCompression = 0.8 - 0.04;
	const float Desaturation = 0.15;
	color *= toneMappingExposure;
	float x = min( color.r, min( color.g, color.b ) );
	float offset = x < 0.08 ? x - 6.25 * x * x : 0.04;
	color -= offset;
	float peak = max( color.r, max( color.g, color.b ) );
	if ( peak < StartCompression ) return color;
	float d = 1. - StartCompression;
	float newPeak = 1. - d * d / ( peak + d - StartCompression );
	color *= newPeak / peak;
	float g = 1. - 1. / ( Desaturation * ( peak - newPeak ) + 1. );
	return mix( color, vec3( newPeak ), g );
}
vec3 CustomToneMapping( vec3 color ) { return color; }`,yM=`#ifdef USE_TRANSMISSION
	material.transmission = transmission;
	material.transmissionAlpha = 1.0;
	material.thickness = thickness;
	material.attenuationDistance = attenuationDistance;
	material.attenuationColor = attenuationColor;
	#ifdef USE_TRANSMISSIONMAP
		material.transmission *= texture2D( transmissionMap, vTransmissionMapUv ).r;
	#endif
	#ifdef USE_THICKNESSMAP
		material.thickness *= texture2D( thicknessMap, vThicknessMapUv ).g;
	#endif
	vec3 pos = vWorldPosition;
	vec3 v = normalize( cameraPosition - pos );
	vec3 n = transformNormalByInverseViewMatrix( normal, viewMatrix );
	vec4 transmitted = getIBLVolumeRefraction(
		n, v, material.roughness, material.diffuseContribution, material.specularColorBlended, material.specularF90,
		pos, modelMatrix, viewMatrix, projectionMatrix, material.dispersion, material.ior, material.thickness,
		material.attenuationColor, material.attenuationDistance );
	material.transmissionAlpha = mix( material.transmissionAlpha, transmitted.a, material.transmission );
	totalDiffuse = mix( totalDiffuse, transmitted.rgb, material.transmission );
#endif`,MM=`#ifdef USE_TRANSMISSION
	uniform float transmission;
	uniform float thickness;
	uniform float attenuationDistance;
	uniform vec3 attenuationColor;
	#ifdef USE_TRANSMISSIONMAP
		uniform sampler2D transmissionMap;
	#endif
	#ifdef USE_THICKNESSMAP
		uniform sampler2D thicknessMap;
	#endif
	uniform vec2 transmissionSamplerSize;
	uniform sampler2D transmissionSamplerMap;
	uniform mat4 modelMatrix;
	uniform mat4 projectionMatrix;
	varying vec3 vWorldPosition;
	float w0( float a ) {
		return ( 1.0 / 6.0 ) * ( a * ( a * ( - a + 3.0 ) - 3.0 ) + 1.0 );
	}
	float w1( float a ) {
		return ( 1.0 / 6.0 ) * ( a *  a * ( 3.0 * a - 6.0 ) + 4.0 );
	}
	float w2( float a ){
		return ( 1.0 / 6.0 ) * ( a * ( a * ( - 3.0 * a + 3.0 ) + 3.0 ) + 1.0 );
	}
	float w3( float a ) {
		return ( 1.0 / 6.0 ) * ( a * a * a );
	}
	float g0( float a ) {
		return w0( a ) + w1( a );
	}
	float g1( float a ) {
		return w2( a ) + w3( a );
	}
	float h0( float a ) {
		return - 1.0 + w1( a ) / ( w0( a ) + w1( a ) );
	}
	float h1( float a ) {
		return 1.0 + w3( a ) / ( w2( a ) + w3( a ) );
	}
	vec4 bicubic( sampler2D tex, vec2 uv, vec4 texelSize, float lod ) {
		uv = uv * texelSize.zw + 0.5;
		vec2 iuv = floor( uv );
		vec2 fuv = fract( uv );
		float g0x = g0( fuv.x );
		float g1x = g1( fuv.x );
		float h0x = h0( fuv.x );
		float h1x = h1( fuv.x );
		float h0y = h0( fuv.y );
		float h1y = h1( fuv.y );
		vec2 p0 = ( vec2( iuv.x + h0x, iuv.y + h0y ) - 0.5 ) * texelSize.xy;
		vec2 p1 = ( vec2( iuv.x + h1x, iuv.y + h0y ) - 0.5 ) * texelSize.xy;
		vec2 p2 = ( vec2( iuv.x + h0x, iuv.y + h1y ) - 0.5 ) * texelSize.xy;
		vec2 p3 = ( vec2( iuv.x + h1x, iuv.y + h1y ) - 0.5 ) * texelSize.xy;
		return g0( fuv.y ) * ( g0x * textureLod( tex, p0, lod ) + g1x * textureLod( tex, p1, lod ) ) +
			g1( fuv.y ) * ( g0x * textureLod( tex, p2, lod ) + g1x * textureLod( tex, p3, lod ) );
	}
	vec4 textureBicubic( sampler2D sampler, vec2 uv, float lod ) {
		vec2 fLodSize = vec2( textureSize( sampler, int( lod ) ) );
		vec2 cLodSize = vec2( textureSize( sampler, int( lod + 1.0 ) ) );
		vec2 fLodSizeInv = 1.0 / fLodSize;
		vec2 cLodSizeInv = 1.0 / cLodSize;
		vec4 fSample = bicubic( sampler, uv, vec4( fLodSizeInv, fLodSize ), floor( lod ) );
		vec4 cSample = bicubic( sampler, uv, vec4( cLodSizeInv, cLodSize ), ceil( lod ) );
		return mix( fSample, cSample, fract( lod ) );
	}
	vec3 getVolumeTransmissionRay( const in vec3 n, const in vec3 v, const in float thickness, const in float ior, const in mat4 modelMatrix ) {
		vec3 refractionVector = refract( - v, normalize( n ), 1.0 / ior );
		vec3 modelScale;
		modelScale.x = length( vec3( modelMatrix[ 0 ].xyz ) );
		modelScale.y = length( vec3( modelMatrix[ 1 ].xyz ) );
		modelScale.z = length( vec3( modelMatrix[ 2 ].xyz ) );
		return normalize( refractionVector ) * thickness * modelScale;
	}
	float applyIorToRoughness( const in float roughness, const in float ior ) {
		return roughness * clamp( ior * 2.0 - 2.0, 0.0, 1.0 );
	}
	vec4 getTransmissionSample( const in vec2 fragCoord, const in float roughness, const in float ior ) {
		float lod = log2( transmissionSamplerSize.x ) * applyIorToRoughness( roughness, ior );
		return textureBicubic( transmissionSamplerMap, fragCoord.xy, lod );
	}
	vec3 volumeAttenuation( const in float transmissionDistance, const in vec3 attenuationColor, const in float attenuationDistance ) {
		if ( isinf( attenuationDistance ) ) {
			return vec3( 1.0 );
		} else {
			vec3 attenuationCoefficient = -log( attenuationColor ) / attenuationDistance;
			vec3 transmittance = exp( - attenuationCoefficient * transmissionDistance );			return transmittance;
		}
	}
	vec4 getIBLVolumeRefraction( const in vec3 n, const in vec3 v, const in float roughness, const in vec3 diffuseColor,
		const in vec3 specularColor, const in float specularF90, const in vec3 position, const in mat4 modelMatrix,
		const in mat4 viewMatrix, const in mat4 projMatrix, const in float dispersion, const in float ior, const in float thickness,
		const in vec3 attenuationColor, const in float attenuationDistance ) {
		vec4 transmittedLight;
		vec3 transmittance;
		#ifdef USE_DISPERSION
			float halfSpread = ( ior - 1.0 ) * 0.025 * dispersion;
			vec3 iors = vec3( ior - halfSpread, ior, ior + halfSpread );
			for ( int i = 0; i < 3; i ++ ) {
				vec3 transmissionRay = getVolumeTransmissionRay( n, v, thickness, iors[ i ], modelMatrix );
				vec3 refractedRayExit = position + transmissionRay;
				vec4 ndcPos = projMatrix * viewMatrix * vec4( refractedRayExit, 1.0 );
				vec2 refractionCoords = ndcPos.xy / ndcPos.w;
				refractionCoords += 1.0;
				refractionCoords /= 2.0;
				vec4 transmissionSample = getTransmissionSample( refractionCoords, roughness, iors[ i ] );
				transmittedLight[ i ] = transmissionSample[ i ];
				transmittedLight.a += transmissionSample.a;
				transmittance[ i ] = diffuseColor[ i ] * volumeAttenuation( length( transmissionRay ), attenuationColor, attenuationDistance )[ i ];
			}
			transmittedLight.a /= 3.0;
		#else
			vec3 transmissionRay = getVolumeTransmissionRay( n, v, thickness, ior, modelMatrix );
			vec3 refractedRayExit = position + transmissionRay;
			vec4 ndcPos = projMatrix * viewMatrix * vec4( refractedRayExit, 1.0 );
			vec2 refractionCoords = ndcPos.xy / ndcPos.w;
			refractionCoords += 1.0;
			refractionCoords /= 2.0;
			transmittedLight = getTransmissionSample( refractionCoords, roughness, ior );
			transmittance = diffuseColor * volumeAttenuation( length( transmissionRay ), attenuationColor, attenuationDistance );
		#endif
		vec3 attenuatedColor = transmittance * transmittedLight.rgb;
		vec3 F = EnvironmentBRDF( n, v, specularColor, specularF90, roughness );
		float transmittanceFactor = ( transmittance.r + transmittance.g + transmittance.b ) / 3.0;
		return vec4( ( 1.0 - F ) * attenuatedColor, 1.0 - ( 1.0 - transmittedLight.a ) * transmittanceFactor );
	}
#endif`,EM=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	varying vec2 vUv;
#endif
#ifdef USE_MAP
	varying vec2 vMapUv;
#endif
#ifdef USE_ALPHAMAP
	varying vec2 vAlphaMapUv;
#endif
#ifdef USE_LIGHTMAP
	varying vec2 vLightMapUv;
#endif
#ifdef USE_AOMAP
	varying vec2 vAoMapUv;
#endif
#ifdef USE_BUMPMAP
	varying vec2 vBumpMapUv;
#endif
#ifdef USE_NORMALMAP
	varying vec2 vNormalMapUv;
#endif
#ifdef USE_EMISSIVEMAP
	varying vec2 vEmissiveMapUv;
#endif
#ifdef USE_METALNESSMAP
	varying vec2 vMetalnessMapUv;
#endif
#ifdef USE_ROUGHNESSMAP
	varying vec2 vRoughnessMapUv;
#endif
#ifdef USE_ANISOTROPYMAP
	varying vec2 vAnisotropyMapUv;
#endif
#ifdef USE_CLEARCOATMAP
	varying vec2 vClearcoatMapUv;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	varying vec2 vClearcoatNormalMapUv;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	varying vec2 vClearcoatRoughnessMapUv;
#endif
#ifdef USE_IRIDESCENCEMAP
	varying vec2 vIridescenceMapUv;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	varying vec2 vIridescenceThicknessMapUv;
#endif
#ifdef USE_SHEEN_COLORMAP
	varying vec2 vSheenColorMapUv;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	varying vec2 vSheenRoughnessMapUv;
#endif
#ifdef USE_SPECULARMAP
	varying vec2 vSpecularMapUv;
#endif
#ifdef USE_SPECULAR_COLORMAP
	varying vec2 vSpecularColorMapUv;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	varying vec2 vSpecularIntensityMapUv;
#endif
#ifdef USE_TRANSMISSIONMAP
	uniform mat3 transmissionMapTransform;
	varying vec2 vTransmissionMapUv;
#endif
#ifdef USE_THICKNESSMAP
	uniform mat3 thicknessMapTransform;
	varying vec2 vThicknessMapUv;
#endif`,SM=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	varying vec2 vUv;
#endif
#ifdef USE_MAP
	uniform mat3 mapTransform;
	varying vec2 vMapUv;
#endif
#ifdef USE_ALPHAMAP
	uniform mat3 alphaMapTransform;
	varying vec2 vAlphaMapUv;
#endif
#ifdef USE_LIGHTMAP
	uniform mat3 lightMapTransform;
	varying vec2 vLightMapUv;
#endif
#ifdef USE_AOMAP
	uniform mat3 aoMapTransform;
	varying vec2 vAoMapUv;
#endif
#ifdef USE_BUMPMAP
	uniform mat3 bumpMapTransform;
	varying vec2 vBumpMapUv;
#endif
#ifdef USE_NORMALMAP
	uniform mat3 normalMapTransform;
	varying vec2 vNormalMapUv;
#endif
#ifdef USE_DISPLACEMENTMAP
	uniform mat3 displacementMapTransform;
	varying vec2 vDisplacementMapUv;
#endif
#ifdef USE_EMISSIVEMAP
	uniform mat3 emissiveMapTransform;
	varying vec2 vEmissiveMapUv;
#endif
#ifdef USE_METALNESSMAP
	uniform mat3 metalnessMapTransform;
	varying vec2 vMetalnessMapUv;
#endif
#ifdef USE_ROUGHNESSMAP
	uniform mat3 roughnessMapTransform;
	varying vec2 vRoughnessMapUv;
#endif
#ifdef USE_ANISOTROPYMAP
	uniform mat3 anisotropyMapTransform;
	varying vec2 vAnisotropyMapUv;
#endif
#ifdef USE_CLEARCOATMAP
	uniform mat3 clearcoatMapTransform;
	varying vec2 vClearcoatMapUv;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform mat3 clearcoatNormalMapTransform;
	varying vec2 vClearcoatNormalMapUv;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform mat3 clearcoatRoughnessMapTransform;
	varying vec2 vClearcoatRoughnessMapUv;
#endif
#ifdef USE_SHEEN_COLORMAP
	uniform mat3 sheenColorMapTransform;
	varying vec2 vSheenColorMapUv;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	uniform mat3 sheenRoughnessMapTransform;
	varying vec2 vSheenRoughnessMapUv;
#endif
#ifdef USE_IRIDESCENCEMAP
	uniform mat3 iridescenceMapTransform;
	varying vec2 vIridescenceMapUv;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform mat3 iridescenceThicknessMapTransform;
	varying vec2 vIridescenceThicknessMapUv;
#endif
#ifdef USE_SPECULARMAP
	uniform mat3 specularMapTransform;
	varying vec2 vSpecularMapUv;
#endif
#ifdef USE_SPECULAR_COLORMAP
	uniform mat3 specularColorMapTransform;
	varying vec2 vSpecularColorMapUv;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	uniform mat3 specularIntensityMapTransform;
	varying vec2 vSpecularIntensityMapUv;
#endif
#ifdef USE_TRANSMISSIONMAP
	uniform mat3 transmissionMapTransform;
	varying vec2 vTransmissionMapUv;
#endif
#ifdef USE_THICKNESSMAP
	uniform mat3 thicknessMapTransform;
	varying vec2 vThicknessMapUv;
#endif`,wM=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	vUv = vec3( uv, 1 ).xy;
#endif
#ifdef USE_MAP
	vMapUv = ( mapTransform * vec3( MAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ALPHAMAP
	vAlphaMapUv = ( alphaMapTransform * vec3( ALPHAMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_LIGHTMAP
	vLightMapUv = ( lightMapTransform * vec3( LIGHTMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_AOMAP
	vAoMapUv = ( aoMapTransform * vec3( AOMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_BUMPMAP
	vBumpMapUv = ( bumpMapTransform * vec3( BUMPMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_NORMALMAP
	vNormalMapUv = ( normalMapTransform * vec3( NORMALMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_DISPLACEMENTMAP
	vDisplacementMapUv = ( displacementMapTransform * vec3( DISPLACEMENTMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_EMISSIVEMAP
	vEmissiveMapUv = ( emissiveMapTransform * vec3( EMISSIVEMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_METALNESSMAP
	vMetalnessMapUv = ( metalnessMapTransform * vec3( METALNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ROUGHNESSMAP
	vRoughnessMapUv = ( roughnessMapTransform * vec3( ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ANISOTROPYMAP
	vAnisotropyMapUv = ( anisotropyMapTransform * vec3( ANISOTROPYMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOATMAP
	vClearcoatMapUv = ( clearcoatMapTransform * vec3( CLEARCOATMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	vClearcoatNormalMapUv = ( clearcoatNormalMapTransform * vec3( CLEARCOAT_NORMALMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	vClearcoatRoughnessMapUv = ( clearcoatRoughnessMapTransform * vec3( CLEARCOAT_ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_IRIDESCENCEMAP
	vIridescenceMapUv = ( iridescenceMapTransform * vec3( IRIDESCENCEMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	vIridescenceThicknessMapUv = ( iridescenceThicknessMapTransform * vec3( IRIDESCENCE_THICKNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SHEEN_COLORMAP
	vSheenColorMapUv = ( sheenColorMapTransform * vec3( SHEEN_COLORMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	vSheenRoughnessMapUv = ( sheenRoughnessMapTransform * vec3( SHEEN_ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULARMAP
	vSpecularMapUv = ( specularMapTransform * vec3( SPECULARMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULAR_COLORMAP
	vSpecularColorMapUv = ( specularColorMapTransform * vec3( SPECULAR_COLORMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	vSpecularIntensityMapUv = ( specularIntensityMapTransform * vec3( SPECULAR_INTENSITYMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_TRANSMISSIONMAP
	vTransmissionMapUv = ( transmissionMapTransform * vec3( TRANSMISSIONMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_THICKNESSMAP
	vThicknessMapUv = ( thicknessMapTransform * vec3( THICKNESSMAP_UV, 1 ) ).xy;
#endif`,bM=`#if defined( USE_ENVMAP ) || defined( DISTANCE ) || defined ( USE_SHADOWMAP ) || defined ( USE_TRANSMISSION ) || NUM_SPOT_LIGHT_COORDS > 0
	vec4 worldPosition = vec4( transformed, 1.0 );
	#ifdef USE_BATCHING
		worldPosition = batchingMatrix * worldPosition;
	#endif
	#ifdef USE_INSTANCING
		worldPosition = instanceMatrix * worldPosition;
	#endif
	worldPosition = modelMatrix * worldPosition;
#endif`;const CM=`varying vec2 vUv;
uniform mat3 uvTransform;
void main() {
	vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	gl_Position = vec4( position.xy, 1.0, 1.0 );
}`,TM=`uniform sampler2D t2D;
uniform float backgroundIntensity;
varying vec2 vUv;
void main() {
	vec4 texColor = texture2D( t2D, vUv );
	#ifdef DECODE_VIDEO_TEXTURE
		texColor = vec4( mix( pow( texColor.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), texColor.rgb * 0.0773993808, vec3( lessThanEqual( texColor.rgb, vec3( 0.04045 ) ) ) ), texColor.w );
	#endif
	texColor.rgb *= backgroundIntensity;
	gl_FragColor = texColor;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,BM=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,IM=`#ifdef ENVMAP_TYPE_CUBE
	uniform samplerCube envMap;
#elif defined( ENVMAP_TYPE_CUBE_UV )
	uniform sampler2D envMap;
#endif
uniform float backgroundBlurriness;
uniform float backgroundIntensity;
uniform mat3 backgroundRotation;
varying vec3 vWorldDirection;
#include <cube_uv_reflection_fragment>
void main() {
	#ifdef ENVMAP_TYPE_CUBE
		vec4 texColor = textureCube( envMap, backgroundRotation * vWorldDirection );
	#elif defined( ENVMAP_TYPE_CUBE_UV )
		vec4 texColor = textureCubeUV( envMap, backgroundRotation * vWorldDirection, backgroundBlurriness );
	#else
		vec4 texColor = vec4( 0.0, 0.0, 0.0, 1.0 );
	#endif
	texColor.rgb *= backgroundIntensity;
	gl_FragColor = texColor;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,RM=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,DM=`uniform samplerCube tCube;
uniform float tFlip;
uniform float opacity;
varying vec3 vWorldDirection;
void main() {
	vec4 texColor = textureCube( tCube, vec3( tFlip * vWorldDirection.x, vWorldDirection.yz ) );
	gl_FragColor = texColor;
	gl_FragColor.a *= opacity;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,PM=`#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
varying vec2 vHighPrecisionZW;
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <skinbase_vertex>
	#include <morphinstance_vertex>
	#ifdef USE_DISPLACEMENTMAP
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vHighPrecisionZW = gl_Position.zw;
}`,LM=`#if DEPTH_PACKING == 3200
	uniform float opacity;
#endif
#include <common>
#include <packing>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
varying vec2 vHighPrecisionZW;
void main() {
	vec4 diffuseColor = vec4( 1.0 );
	#include <clipping_planes_fragment>
	#if DEPTH_PACKING == 3200
		diffuseColor.a = opacity;
	#endif
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <logdepthbuf_fragment>
	#ifdef USE_REVERSED_DEPTH_BUFFER
		float fragCoordZ = vHighPrecisionZW[ 0 ] / vHighPrecisionZW[ 1 ];
	#else
		float fragCoordZ = 0.5 * vHighPrecisionZW[ 0 ] / vHighPrecisionZW[ 1 ] + 0.5;
	#endif
	#if DEPTH_PACKING == 3200
		gl_FragColor = vec4( vec3( 1.0 - fragCoordZ ), opacity );
	#elif DEPTH_PACKING == 3201
		gl_FragColor = packDepthToRGBA( fragCoordZ );
	#elif DEPTH_PACKING == 3202
		gl_FragColor = vec4( packDepthToRGB( fragCoordZ ), 1.0 );
	#elif DEPTH_PACKING == 3203
		gl_FragColor = vec4( packDepthToRG( fragCoordZ ), 0.0, 1.0 );
	#endif
}`,FM=`#define DISTANCE
varying vec3 vWorldPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <skinbase_vertex>
	#include <morphinstance_vertex>
	#ifdef USE_DISPLACEMENTMAP
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <worldpos_vertex>
	#include <clipping_planes_vertex>
	vWorldPosition = worldPosition.xyz;
}`,UM=`#define DISTANCE
uniform vec3 referencePosition;
uniform float nearDistance;
uniform float farDistance;
varying vec3 vWorldPosition;
#include <common>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( 1.0 );
	#include <clipping_planes_fragment>
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	float dist = length( vWorldPosition - referencePosition );
	dist = ( dist - nearDistance ) / ( farDistance - nearDistance );
	dist = saturate( dist );
	gl_FragColor = vec4( dist, 0.0, 0.0, 1.0 );
}`,NM=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
}`,OM=`uniform sampler2D tEquirect;
varying vec3 vWorldDirection;
#include <common>
void main() {
	vec3 direction = normalize( vWorldDirection );
	vec2 sampleUV = equirectUv( direction );
	gl_FragColor = texture2D( tEquirect, sampleUV );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,GM=`uniform float scale;
attribute float lineDistance;
varying float vLineDistance;
#include <common>
#include <uv_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	vLineDistance = scale * lineDistance;
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
}`,kM=`uniform vec3 diffuse;
uniform float opacity;
uniform float dashSize;
uniform float totalSize;
varying float vLineDistance;
#include <common>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	if ( mod( vLineDistance, totalSize ) > dashSize ) {
		discard;
	}
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,QM=`#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#if defined ( USE_ENVMAP ) || defined ( USE_SKINNING )
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinbase_vertex>
		#include <skinnormal_vertex>
		#include <defaultnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <fog_vertex>
}`,zM=`uniform vec3 diffuse;
uniform float opacity;
#ifndef FLAT_SHADED
	varying vec3 vNormal;
#endif
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	#ifdef USE_LIGHTMAP
		vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
		reflectedLight.indirectDiffuse += lightMapTexel.rgb * lightMapIntensity * RECIPROCAL_PI;
	#else
		reflectedLight.indirectDiffuse += vec3( 1.0 );
	#endif
	#include <aomap_fragment>
	reflectedLight.indirectDiffuse *= diffuseColor.rgb;
	vec3 outgoingLight = reflectedLight.indirectDiffuse;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,HM=`#define LAMBERT
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,VM=`#define LAMBERT
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float opacity;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <cube_uv_reflection_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <envmap_physical_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_lambert_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_lambert_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,WM=`#define MATCAP
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <color_pars_vertex>
#include <displacementmap_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
	vViewPosition = - mvPosition.xyz;
}`,YM=`#define MATCAP
uniform vec3 diffuse;
uniform float opacity;
uniform sampler2D matcap;
varying vec3 vViewPosition;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <normal_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	vec3 viewDir = normalize( vViewPosition );
	vec3 x = normalize( vec3( viewDir.z, 0.0, - viewDir.x ) );
	vec3 y = cross( viewDir, x );
	vec2 uv = vec2( dot( x, normal ), dot( y, normal ) ) * 0.495 + 0.5;
	#ifdef USE_MATCAP
		vec4 matcapColor = texture2D( matcap, uv );
	#else
		vec4 matcapColor = vec4( vec3( mix( 0.2, 0.8, uv.y ) ), 1.0 );
	#endif
	vec3 outgoingLight = diffuseColor.rgb * matcapColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,XM=`#define NORMAL
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	varying vec3 vViewPosition;
#endif
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	vViewPosition = - mvPosition.xyz;
#endif
}`,qM=`#define NORMAL
uniform float opacity;
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	varying vec3 vViewPosition;
#endif
#include <uv_pars_fragment>
#include <normal_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( 0.0, 0.0, 0.0, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	gl_FragColor = vec4( normalize( normal ) * 0.5 + 0.5, diffuseColor.a );
	#ifdef OPAQUE
		gl_FragColor.a = 1.0;
	#endif
}`,KM=`#define PHONG
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,JM=`#define PHONG
uniform vec3 diffuse;
uniform vec3 emissive;
uniform vec3 specular;
uniform float shininess;
uniform float opacity;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <cube_uv_reflection_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <envmap_physical_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_phong_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_phong_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + reflectedLight.directSpecular + reflectedLight.indirectSpecular + totalEmissiveRadiance;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,ZM=`#define STANDARD
varying vec3 vViewPosition;
#ifdef USE_TRANSMISSION
	varying vec3 vWorldPosition;
#endif
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
#ifdef USE_TRANSMISSION
	vWorldPosition = worldPosition.xyz;
#endif
}`,$M=`#define STANDARD
#ifdef PHYSICAL
	#define IOR
	#define USE_SPECULAR
#endif
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float roughness;
uniform float metalness;
uniform float opacity;
#ifdef IOR
	uniform float ior;
#endif
#ifdef USE_SPECULAR
	uniform float specularIntensity;
	uniform vec3 specularColor;
	#ifdef USE_SPECULAR_COLORMAP
		uniform sampler2D specularColorMap;
	#endif
	#ifdef USE_SPECULAR_INTENSITYMAP
		uniform sampler2D specularIntensityMap;
	#endif
#endif
#ifdef USE_CLEARCOAT
	uniform float clearcoat;
	uniform float clearcoatRoughness;
#endif
#ifdef USE_DISPERSION
	uniform float dispersion;
#endif
#ifdef USE_RETROREFLECTION
	uniform float retroreflectivity;
#endif
#ifdef USE_IRIDESCENCE
	uniform float iridescence;
	uniform float iridescenceIOR;
	uniform float iridescenceThicknessMinimum;
	uniform float iridescenceThicknessMaximum;
#endif
#ifdef USE_SHEEN
	uniform vec3 sheenColor;
	uniform float sheenRoughness;
	#ifdef USE_SHEEN_COLORMAP
		uniform sampler2D sheenColorMap;
	#endif
	#ifdef USE_SHEEN_ROUGHNESSMAP
		uniform sampler2D sheenRoughnessMap;
	#endif
#endif
#ifdef USE_ANISOTROPY
	uniform vec2 anisotropyVector;
	#ifdef USE_ANISOTROPYMAP
		uniform sampler2D anisotropyMap;
	#endif
#endif
varying vec3 vViewPosition;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <iridescence_fragment>
#include <cube_uv_reflection_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_physical_pars_fragment>
#include <fog_pars_fragment>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_physical_pars_fragment>
#include <transmission_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <clearcoat_pars_fragment>
#include <iridescence_pars_fragment>
#include <roughnessmap_pars_fragment>
#include <metalnessmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <roughnessmap_fragment>
	#include <metalnessmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <clearcoat_normal_fragment_begin>
	#include <clearcoat_normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_physical_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 totalDiffuse = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse;
	vec3 totalSpecular = reflectedLight.directSpecular + reflectedLight.indirectSpecular;
	#include <transmission_fragment>
	vec3 outgoingLight = totalDiffuse + totalSpecular + totalEmissiveRadiance;
	#ifdef USE_SHEEN
 
		outgoingLight = outgoingLight + sheenSpecularDirect + sheenSpecularIndirect;
 
 	#endif
	#ifdef USE_CLEARCOAT
		float dotNVcc = saturate( dot( geometryClearcoatNormal, geometryViewDir ) );
		vec3 Fcc = F_Schlick( material.clearcoatF0, material.clearcoatF90, dotNVcc );
		outgoingLight = outgoingLight * ( 1.0 - material.clearcoat * Fcc ) + ( clearcoatSpecularDirect + clearcoatSpecularIndirect ) * material.clearcoat;
	#endif
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,jM=`#define TOON
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,tE=`#define TOON
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float opacity;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <gradientmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_toon_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_toon_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,eE=`uniform float size;
uniform float scale;
#include <common>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
#ifdef USE_POINTS_UV
	varying vec2 vUv;
	uniform mat3 uvTransform;
#endif
void main() {
	#ifdef USE_POINTS_UV
		vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	#endif
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <project_vertex>
	gl_PointSize = size;
	#ifdef USE_SIZEATTENUATION
		bool isPerspective = isPerspectiveMatrix( projectionMatrix );
		if ( isPerspective ) gl_PointSize *= ( scale / - mvPosition.z );
	#endif
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <worldpos_vertex>
	#include <fog_vertex>
}`,nE=`uniform vec3 diffuse;
uniform float opacity;
#include <common>
#include <color_pars_fragment>
#include <map_particle_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_particle_fragment>
	#include <color_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,iE=`#include <common>
#include <batching_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <shadowmap_pars_vertex>
void main() {
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,sE=`uniform vec3 color;
uniform float opacity;
#include <common>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <logdepthbuf_pars_fragment>
#include <shadowmap_pars_fragment>
#include <shadowmask_pars_fragment>
void main() {
	#include <logdepthbuf_fragment>
	gl_FragColor = vec4( color, opacity * ( 1.0 - getShadowMask() ) );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,rE=`uniform float rotation;
uniform vec2 center;
#include <common>
#include <uv_pars_vertex>
#include <fog_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	vec4 mvPosition = modelViewMatrix[ 3 ];
	vec2 scale = vec2( length( modelMatrix[ 0 ].xyz ), length( modelMatrix[ 1 ].xyz ) );
	#ifndef USE_SIZEATTENUATION
		bool isPerspective = isPerspectiveMatrix( projectionMatrix );
		if ( isPerspective ) scale *= - mvPosition.z;
	#endif
	vec2 alignedPosition = ( position.xy - ( center - vec2( 0.5 ) ) ) * scale;
	vec2 rotatedPosition;
	rotatedPosition.x = cos( rotation ) * alignedPosition.x - sin( rotation ) * alignedPosition.y;
	rotatedPosition.y = sin( rotation ) * alignedPosition.x + cos( rotation ) * alignedPosition.y;
	mvPosition.xy += rotatedPosition;
	gl_Position = projectionMatrix * mvPosition;
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
}`,aE=`uniform vec3 diffuse;
uniform float opacity;
#include <common>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
}`,ie={alphahash_fragment:Cv,alphahash_pars_fragment:Tv,alphamap_fragment:Bv,alphamap_pars_fragment:Iv,alphatest_fragment:Rv,alphatest_pars_fragment:Dv,aomap_fragment:Pv,aomap_pars_fragment:Lv,batching_pars_vertex:Fv,batching_vertex:Uv,begin_vertex:Nv,beginnormal_vertex:Ov,bsdfs:Gv,iridescence_fragment:kv,bumpmap_pars_fragment:Qv,clipping_planes_fragment:zv,clipping_planes_pars_fragment:Hv,clipping_planes_pars_vertex:Vv,clipping_planes_vertex:Wv,color_fragment:Yv,color_pars_fragment:Xv,color_pars_vertex:qv,color_vertex:Kv,common:Jv,cube_uv_reflection_fragment:Zv,defaultnormal_vertex:$v,displacementmap_pars_vertex:jv,displacementmap_vertex:ty,emissivemap_fragment:ey,emissivemap_pars_fragment:ny,colorspace_fragment:iy,colorspace_pars_fragment:sy,envmap_fragment:ry,envmap_common_pars_fragment:ay,envmap_pars_fragment:oy,envmap_pars_vertex:ly,envmap_physical_pars_fragment:_y,envmap_vertex:cy,fog_vertex:hy,fog_pars_vertex:uy,fog_fragment:fy,fog_pars_fragment:dy,gradientmap_pars_fragment:py,lightmap_pars_fragment:Ay,lights_lambert_fragment:my,lights_lambert_pars_fragment:gy,lights_pars_begin:xy,lights_toon_fragment:vy,lights_toon_pars_fragment:yy,lights_phong_fragment:My,lights_phong_pars_fragment:Ey,lights_physical_fragment:Sy,lights_physical_pars_fragment:wy,lights_fragment_begin:by,lights_fragment_maps:Cy,lights_fragment_end:Ty,lightprobes_pars_fragment:By,logdepthbuf_fragment:Iy,logdepthbuf_pars_fragment:Ry,logdepthbuf_pars_vertex:Dy,logdepthbuf_vertex:Py,map_fragment:Ly,map_pars_fragment:Fy,map_particle_fragment:Uy,map_particle_pars_fragment:Ny,metalnessmap_fragment:Oy,metalnessmap_pars_fragment:Gy,morphinstance_vertex:ky,morphcolor_vertex:Qy,morphnormal_vertex:zy,morphtarget_pars_vertex:Hy,morphtarget_vertex:Vy,normal_fragment_begin:Wy,normal_fragment_maps:Yy,normal_pars_fragment:Xy,normal_pars_vertex:qy,normal_vertex:Ky,normalmap_pars_fragment:Jy,clearcoat_normal_fragment_begin:Zy,clearcoat_normal_fragment_maps:$y,clearcoat_pars_fragment:jy,iridescence_pars_fragment:tM,opaque_fragment:eM,packing:nM,premultiplied_alpha_fragment:iM,project_vertex:sM,dithering_fragment:rM,dithering_pars_fragment:aM,roughnessmap_fragment:oM,roughnessmap_pars_fragment:lM,shadowmap_pars_fragment:cM,shadowmap_pars_vertex:hM,shadowmap_vertex:uM,shadowmask_pars_fragment:fM,skinbase_vertex:dM,skinning_pars_vertex:pM,skinning_vertex:AM,skinnormal_vertex:mM,specularmap_fragment:gM,specularmap_pars_fragment:xM,tonemapping_fragment:_M,tonemapping_pars_fragment:vM,transmission_fragment:yM,transmission_pars_fragment:MM,uv_pars_fragment:EM,uv_pars_vertex:SM,uv_vertex:wM,worldpos_vertex:bM,background_vert:CM,background_frag:TM,backgroundCube_vert:BM,backgroundCube_frag:IM,cube_vert:RM,cube_frag:DM,depth_vert:PM,depth_frag:LM,distance_vert:FM,distance_frag:UM,equirect_vert:NM,equirect_frag:OM,linedashed_vert:GM,linedashed_frag:kM,meshbasic_vert:QM,meshbasic_frag:zM,meshlambert_vert:HM,meshlambert_frag:VM,meshmatcap_vert:WM,meshmatcap_frag:YM,meshnormal_vert:XM,meshnormal_frag:qM,meshphong_vert:KM,meshphong_frag:JM,meshphysical_vert:ZM,meshphysical_frag:$M,meshtoon_vert:jM,meshtoon_frag:tE,points_vert:eE,points_frag:nE,shadow_vert:iE,shadow_frag:sE,sprite_vert:rE,sprite_frag:aE},Mt={common:{diffuse:{value:new bt(16777215)},opacity:{value:1},map:{value:null},mapTransform:{value:new jt},alphaMap:{value:null},alphaMapTransform:{value:new jt},alphaTest:{value:0}},specularmap:{specularMap:{value:null},specularMapTransform:{value:new jt}},envmap:{envMap:{value:null},envMapRotation:{value:new jt},reflectivity:{value:1},ior:{value:1.5},refractionRatio:{value:.98},dfgLUT:{value:null}},aomap:{aoMap:{value:null},aoMapIntensity:{value:1},aoMapTransform:{value:new jt}},lightmap:{lightMap:{value:null},lightMapIntensity:{value:1},lightMapTransform:{value:new jt}},bumpmap:{bumpMap:{value:null},bumpMapTransform:{value:new jt},bumpScale:{value:1}},normalmap:{normalMap:{value:null},normalMapTransform:{value:new jt},normalScale:{value:new lt(1,1)}},displacementmap:{displacementMap:{value:null},displacementMapTransform:{value:new jt},displacementScale:{value:1},displacementBias:{value:0}},emissivemap:{emissiveMap:{value:null},emissiveMapTransform:{value:new jt}},metalnessmap:{metalnessMap:{value:null},metalnessMapTransform:{value:new jt}},roughnessmap:{roughnessMap:{value:null},roughnessMapTransform:{value:new jt}},gradientmap:{gradientMap:{value:null}},fog:{fogDensity:{value:25e-5},fogNear:{value:1},fogFar:{value:2e3},fogColor:{value:new bt(16777215)}},lights:{ambientLightColor:{value:[]},lightProbe:{value:[]},sunLights:{value:[],properties:{direction:{},color:{}}},sunLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},sunShadowMatrix:{value:[]},sunShadowCascade:{value:[]},directionalLights:{value:[],properties:{direction:{},color:{}}},directionalLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},directionalShadowMatrix:{value:[]},spotLights:{value:[],properties:{color:{},position:{},direction:{},distance:{},coneCos:{},penumbraCos:{},decay:{}}},spotLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},spotLightMap:{value:[]},spotLightMatrix:{value:[]},pointLights:{value:[],properties:{color:{},position:{},decay:{},distance:{}}},pointLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{},shadowCameraNear:{},shadowCameraFar:{}}},pointShadowMatrix:{value:[]},hemisphereLights:{value:[],properties:{direction:{},skyColor:{},groundColor:{}}},rectAreaLights:{value:[],properties:{color:{},position:{},width:{},height:{}}},ltc_1:{value:null},ltc_2:{value:null},probesSH:{value:null},probesMin:{value:new I},probesMax:{value:new I},probesResolution:{value:new I}},points:{diffuse:{value:new bt(16777215)},opacity:{value:1},size:{value:1},scale:{value:1},map:{value:null},alphaMap:{value:null},alphaMapTransform:{value:new jt},alphaTest:{value:0},uvTransform:{value:new jt}},sprite:{diffuse:{value:new bt(16777215)},opacity:{value:1},center:{value:new lt(.5,.5)},rotation:{value:0},map:{value:null},mapTransform:{value:new jt},alphaMap:{value:null},alphaMapTransform:{value:new jt},alphaTest:{value:0}}},Ln={basic:{uniforms:tn([Mt.common,Mt.specularmap,Mt.envmap,Mt.aomap,Mt.lightmap,Mt.fog]),vertexShader:ie.meshbasic_vert,fragmentShader:ie.meshbasic_frag},lambert:{uniforms:tn([Mt.common,Mt.specularmap,Mt.envmap,Mt.aomap,Mt.lightmap,Mt.emissivemap,Mt.bumpmap,Mt.normalmap,Mt.displacementmap,Mt.fog,Mt.lights,{emissive:{value:new bt(0)},envMapIntensity:{value:1}}]),vertexShader:ie.meshlambert_vert,fragmentShader:ie.meshlambert_frag},phong:{uniforms:tn([Mt.common,Mt.specularmap,Mt.envmap,Mt.aomap,Mt.lightmap,Mt.emissivemap,Mt.bumpmap,Mt.normalmap,Mt.displacementmap,Mt.fog,Mt.lights,{emissive:{value:new bt(0)},specular:{value:new bt(1118481)},shininess:{value:30},envMapIntensity:{value:1}}]),vertexShader:ie.meshphong_vert,fragmentShader:ie.meshphong_frag},standard:{uniforms:tn([Mt.common,Mt.envmap,Mt.aomap,Mt.lightmap,Mt.emissivemap,Mt.bumpmap,Mt.normalmap,Mt.displacementmap,Mt.roughnessmap,Mt.metalnessmap,Mt.fog,Mt.lights,{emissive:{value:new bt(0)},roughness:{value:1},metalness:{value:0},envMapIntensity:{value:1}}]),vertexShader:ie.meshphysical_vert,fragmentShader:ie.meshphysical_frag},toon:{uniforms:tn([Mt.common,Mt.aomap,Mt.lightmap,Mt.emissivemap,Mt.bumpmap,Mt.normalmap,Mt.displacementmap,Mt.gradientmap,Mt.fog,Mt.lights,{emissive:{value:new bt(0)}}]),vertexShader:ie.meshtoon_vert,fragmentShader:ie.meshtoon_frag},matcap:{uniforms:tn([Mt.common,Mt.bumpmap,Mt.normalmap,Mt.displacementmap,Mt.fog,{matcap:{value:null}}]),vertexShader:ie.meshmatcap_vert,fragmentShader:ie.meshmatcap_frag},points:{uniforms:tn([Mt.points,Mt.fog]),vertexShader:ie.points_vert,fragmentShader:ie.points_frag},dashed:{uniforms:tn([Mt.common,Mt.fog,{scale:{value:1},dashSize:{value:1},totalSize:{value:2}}]),vertexShader:ie.linedashed_vert,fragmentShader:ie.linedashed_frag},depth:{uniforms:tn([Mt.common,Mt.displacementmap]),vertexShader:ie.depth_vert,fragmentShader:ie.depth_frag},normal:{uniforms:tn([Mt.common,Mt.bumpmap,Mt.normalmap,Mt.displacementmap,{opacity:{value:1}}]),vertexShader:ie.meshnormal_vert,fragmentShader:ie.meshnormal_frag},sprite:{uniforms:tn([Mt.sprite,Mt.fog]),vertexShader:ie.sprite_vert,fragmentShader:ie.sprite_frag},background:{uniforms:{uvTransform:{value:new jt},t2D:{value:null},backgroundIntensity:{value:1}},vertexShader:ie.background_vert,fragmentShader:ie.background_frag},backgroundCube:{uniforms:{envMap:{value:null},backgroundBlurriness:{value:0},backgroundIntensity:{value:1},backgroundRotation:{value:new jt}},vertexShader:ie.backgroundCube_vert,fragmentShader:ie.backgroundCube_frag},cube:{uniforms:{tCube:{value:null},tFlip:{value:-1},opacity:{value:1}},vertexShader:ie.cube_vert,fragmentShader:ie.cube_frag},equirect:{uniforms:{tEquirect:{value:null}},vertexShader:ie.equirect_vert,fragmentShader:ie.equirect_frag},distance:{uniforms:tn([Mt.common,Mt.displacementmap,{referencePosition:{value:new I},nearDistance:{value:1},farDistance:{value:1e3}}]),vertexShader:ie.distance_vert,fragmentShader:ie.distance_frag},shadow:{uniforms:tn([Mt.lights,Mt.fog,{color:{value:new bt(0)},opacity:{value:1}}]),vertexShader:ie.shadow_vert,fragmentShader:ie.shadow_frag}};Ln.physical={uniforms:tn([Ln.standard.uniforms,{clearcoat:{value:0},clearcoatMap:{value:null},clearcoatMapTransform:{value:new jt},clearcoatNormalMap:{value:null},clearcoatNormalMapTransform:{value:new jt},clearcoatNormalScale:{value:new lt(1,1)},clearcoatRoughness:{value:0},clearcoatRoughnessMap:{value:null},clearcoatRoughnessMapTransform:{value:new jt},dispersion:{value:0},retroreflectivity:{value:0},iridescence:{value:0},iridescenceMap:{value:null},iridescenceMapTransform:{value:new jt},iridescenceIOR:{value:1.3},iridescenceThicknessMinimum:{value:100},iridescenceThicknessMaximum:{value:400},iridescenceThicknessMap:{value:null},iridescenceThicknessMapTransform:{value:new jt},sheen:{value:0},sheenColor:{value:new bt(0)},sheenColorMap:{value:null},sheenColorMapTransform:{value:new jt},sheenRoughness:{value:1},sheenRoughnessMap:{value:null},sheenRoughnessMapTransform:{value:new jt},transmission:{value:0},transmissionMap:{value:null},transmissionMapTransform:{value:new jt},transmissionSamplerSize:{value:new lt},transmissionSamplerMap:{value:null},thickness:{value:0},thicknessMap:{value:null},thicknessMapTransform:{value:new jt},attenuationDistance:{value:0},attenuationColor:{value:new bt(0)},specularColor:{value:new bt(1,1,1)},specularColorMap:{value:null},specularColorMapTransform:{value:new jt},specularIntensity:{value:1},specularIntensityMap:{value:null},specularIntensityMapTransform:{value:new jt},anisotropyVector:{value:new lt},anisotropyMap:{value:null},anisotropyMapTransform:{value:new jt}}]),vertexShader:ie.meshphysical_vert,fragmentShader:ie.meshphysical_frag};const So={r:0,b:0,g:0},oE=new Kt,Em=new jt;Em.set(-1,0,0,0,1,0,0,0,1);function lE(i,t,e,n,s,r){const a=new bt(0);let o=s===!0?0:1,l,c,h=null,f=0,u=null;function d(v){let M=v.isScene===!0?v.background:null;if(M&&M.isTexture){const x=v.backgroundBlurriness>0;M=t.get(M,x)}return M}function p(v){let M=!1;const x=d(v);x===null?m(a,o):x&&x.isColor&&(m(x,1),M=!0);const S=i.xr.getEnvironmentBlendMode();S==="additive"?e.buffers.color.setClear(0,0,0,1,r):S==="alpha-blend"&&e.buffers.color.setClear(0,0,0,0,r),(i.autoClear||M)&&(e.buffers.depth.setTest(!0),e.buffers.depth.setMask(!0),e.buffers.color.setMask(!0),i.clear(i.autoClearColor,i.autoClearDepth,i.autoClearStencil))}function g(v,M){const x=d(M);x&&(x.isCubeTexture||x.mapping===pr)?(c===void 0&&(c=new Ce(new As(1,1,1),new Sn({name:"BackgroundCubeMaterial",uniforms:fr(Ln.backgroundCube.uniforms),vertexShader:Ln.backgroundCube.vertexShader,fragmentShader:Ln.backgroundCube.fragmentShader,side:an,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1})),c.geometry.deleteAttribute("normal"),c.geometry.deleteAttribute("uv"),c.onBeforeRender=function(S,E,C){this.matrixWorld.copyPosition(C.matrixWorld)},Object.defineProperty(c.material,"envMap",{get:function(){return this.uniforms.envMap.value}}),n.update(c)),c.material.uniforms.envMap.value=x,c.material.uniforms.backgroundBlurriness.value=M.backgroundBlurriness,c.material.uniforms.backgroundIntensity.value=M.backgroundIntensity,c.material.uniforms.backgroundRotation.value.setFromMatrix4(oE.makeRotationFromEuler(M.backgroundRotation)).transpose(),x.isCubeTexture&&x.isRenderTargetTexture===!1&&c.material.uniforms.backgroundRotation.value.premultiply(Em),c.material.toneMapped=ae.getTransfer(x.colorSpace)!==pe,(h!==x||f!==x.version||u!==i.toneMapping)&&(c.material.needsUpdate=!0,h=x,f=x.version,u=i.toneMapping),c.layers.enableAll(),v.unshift(c,c.geometry,c.material,0,0,null)):x&&x.isTexture&&(l===void 0&&(l=new Ce(new mr(2,2),new Sn({name:"BackgroundMaterial",uniforms:fr(Ln.background.uniforms),vertexShader:Ln.background.vertexShader,fragmentShader:Ln.background.fragmentShader,side:Pi,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1})),l.geometry.deleteAttribute("normal"),Object.defineProperty(l.material,"map",{get:function(){return this.uniforms.t2D.value}}),n.update(l)),l.material.uniforms.t2D.value=x,l.material.uniforms.backgroundIntensity.value=M.backgroundIntensity,l.material.toneMapped=ae.getTransfer(x.colorSpace)!==pe,x.matrixAutoUpdate===!0&&x.updateMatrix(),l.material.uniforms.uvTransform.value.copy(x.matrix),(h!==x||f!==x.version||u!==i.toneMapping)&&(l.material.needsUpdate=!0,h=x,f=x.version,u=i.toneMapping),l.layers.enableAll(),v.unshift(l,l.geometry,l.material,0,0,null))}function m(v,M){v.getRGB(So,zA(i)),e.buffers.color.setClear(So.r,So.g,So.b,M,r)}function A(){c!==void 0&&(c.geometry.dispose(),c.material.dispose(),c=void 0),l!==void 0&&(l.geometry.dispose(),l.material.dispose(),l=void 0)}return{getClearColor:function(){return a},setClearColor:function(v,M=1){a.set(v),o=M,m(a,o)},getClearAlpha:function(){return o},setClearAlpha:function(v){o=v,m(a,o)},render:p,addToRenderList:g,dispose:A}}function cE(i,t){const e=i.getParameter(i.MAX_VERTEX_ATTRIBS),n={},s=u(null);let r=s,a=!1;function o(P,U,k,L,O){let q=!1;const Y=f(P,L,k,U);r!==Y&&(r=Y,c(r.object)),q=d(P,L,k,O),q&&p(P,L,k,O),O!==null&&t.update(O,i.ELEMENT_ARRAY_BUFFER),(q||a)&&(a=!1,x(P,U,k,L),O!==null&&i.bindBuffer(i.ELEMENT_ARRAY_BUFFER,t.get(O).buffer))}function l(){return i.createVertexArray()}function c(P){return i.bindVertexArray(P)}function h(P){return i.deleteVertexArray(P)}function f(P,U,k,L){const O=L.wireframe===!0;let q=n[U.id];q===void 0&&(q={},n[U.id]=q);const Y=P.isInstancedMesh===!0?P.id:0;let at=q[Y];at===void 0&&(at={},q[Y]=at);let Q=at[k.id];Q===void 0&&(Q={},at[k.id]=Q);let $=Q[O];return $===void 0&&($=u(l()),Q[O]=$),$}function u(P){const U=[],k=[],L=[];for(let O=0;O<e;O++)U[O]=0,k[O]=0,L[O]=0;return{geometry:null,program:null,wireframe:!1,newAttributes:U,enabledAttributes:k,attributeDivisors:L,object:P,attributes:{},index:null}}function d(P,U,k,L){const O=r.attributes,q=U.attributes;let Y=0;const at=k.getAttributes();for(const Q in at)if(at[Q].location>=0){const st=O[Q];let Ut=q[Q];if(Ut===void 0&&(Q==="instanceMatrix"&&P.instanceMatrix&&(Ut=P.instanceMatrix),Q==="instanceColor"&&P.instanceColor&&(Ut=P.instanceColor)),st===void 0||st.attribute!==Ut||Ut&&st.data!==Ut.data)return!0;Y++}return r.attributesNum!==Y||r.index!==L}function p(P,U,k,L){const O={},q=U.attributes;let Y=0;const at=k.getAttributes();for(const Q in at)if(at[Q].location>=0){let st=q[Q];st===void 0&&(Q==="instanceMatrix"&&P.instanceMatrix&&(st=P.instanceMatrix),Q==="instanceColor"&&P.instanceColor&&(st=P.instanceColor));const Ut={};Ut.attribute=st,st&&st.data&&(Ut.data=st.data),O[Q]=Ut,Y++}r.attributes=O,r.attributesNum=Y,r.index=L}function g(){const P=r.newAttributes;for(let U=0,k=P.length;U<k;U++)P[U]=0}function m(P){A(P,0)}function A(P,U){const k=r.newAttributes,L=r.enabledAttributes,O=r.attributeDivisors;k[P]=1,L[P]===0&&(i.enableVertexAttribArray(P),L[P]=1),O[P]!==U&&(i.vertexAttribDivisor(P,U),O[P]=U)}function v(){const P=r.newAttributes,U=r.enabledAttributes;for(let k=0,L=U.length;k<L;k++)U[k]!==P[k]&&(i.disableVertexAttribArray(k),U[k]=0)}function M(P,U,k,L,O,q,Y){Y===!0?i.vertexAttribIPointer(P,U,k,O,q):i.vertexAttribPointer(P,U,k,L,O,q)}function x(P,U,k,L){g();const O=L.attributes,q=k.getAttributes(),Y=U.defaultAttributeValues;for(const at in q){const Q=q[at];if(Q.location>=0){let $=O[at];if($===void 0&&(at==="instanceMatrix"&&P.instanceMatrix&&($=P.instanceMatrix),at==="instanceColor"&&P.instanceColor&&($=P.instanceColor)),$!==void 0){const st=$.normalized,Ut=$.itemSize,Tt=t.get($);if(Tt===void 0)continue;const oe=Tt.buffer,Zt=Tt.type,Vt=Tt.bytesPerElement,K=Zt===i.INT||Zt===i.UNSIGNED_INT||$.gpuType===Pl;if($.isInterleavedBufferAttribute){const z=$.data,nt=z.stride,gt=$.offset;if(z.isInstancedInterleavedBuffer){for(let ct=0;ct<Q.locationSize;ct++)A(Q.location+ct,z.meshPerAttribute);P.isInstancedMesh!==!0&&L._maxInstanceCount===void 0&&(L._maxInstanceCount=z.meshPerAttribute*z.count)}else for(let ct=0;ct<Q.locationSize;ct++)m(Q.location+ct);i.bindBuffer(i.ARRAY_BUFFER,oe);for(let ct=0;ct<Q.locationSize;ct++)M(Q.location+ct,Ut/Q.locationSize,Zt,st,nt*Vt,(gt+Ut/Q.locationSize*ct)*Vt,K)}else{if($.isInstancedBufferAttribute){for(let z=0;z<Q.locationSize;z++)A(Q.location+z,$.meshPerAttribute);P.isInstancedMesh!==!0&&L._maxInstanceCount===void 0&&(L._maxInstanceCount=$.meshPerAttribute*$.count)}else for(let z=0;z<Q.locationSize;z++)m(Q.location+z);i.bindBuffer(i.ARRAY_BUFFER,oe);for(let z=0;z<Q.locationSize;z++)M(Q.location+z,Ut/Q.locationSize,Zt,st,Ut*Vt,Ut/Q.locationSize*z*Vt,K)}}else if(Y!==void 0){const st=Y[at];if(st!==void 0)switch(st.length){case 2:i.vertexAttrib2fv(Q.location,st);break;case 3:i.vertexAttrib3fv(Q.location,st);break;case 4:i.vertexAttrib4fv(Q.location,st);break;default:i.vertexAttrib1fv(Q.location,st)}}}}v()}function S(){b();for(const P in n){const U=n[P];for(const k in U){const L=U[k];for(const O in L){const q=L[O];for(const Y in q)h(q[Y].object),delete q[Y];delete L[O]}}delete n[P]}}function E(P){if(n[P.id]===void 0)return;const U=n[P.id];for(const k in U){const L=U[k];for(const O in L){const q=L[O];for(const Y in q)h(q[Y].object),delete q[Y];delete L[O]}}delete n[P.id]}function C(P){for(const U in n){const k=n[U];for(const L in k){const O=k[L];if(O[P.id]===void 0)continue;const q=O[P.id];for(const Y in q)h(q[Y].object),delete q[Y];delete O[P.id]}}}function _(P){for(const U in n){const k=n[U],L=P.isInstancedMesh===!0?P.id:0,O=k[L];if(O!==void 0){for(const q in O){const Y=O[q];for(const at in Y)h(Y[at].object),delete Y[at];delete O[q]}delete k[L],Object.keys(k).length===0&&delete n[U]}}}function b(){B(),a=!0,r!==s&&(r=s,c(r.object))}function B(){s.geometry=null,s.program=null,s.wireframe=!1}return{setup:o,reset:b,resetDefaultState:B,dispose:S,releaseStatesOfGeometry:E,releaseStatesOfObject:_,releaseStatesOfProgram:C,initAttributes:g,enableAttribute:m,disableUnusedAttributes:v}}function hE(i,t,e){let n;function s(l){n=l}function r(l,c){i.drawArrays(n,l,c),e.update(c,n,1)}function a(l,c,h){h!==0&&(i.drawArraysInstanced(n,l,c,h),e.update(c,n,h))}function o(l,c,h){if(h===0)return;t.get("WEBGL_multi_draw").multiDrawArraysWEBGL(n,l,0,c,0,h);let u=0;for(let d=0;d<h;d++)u+=c[d];e.update(u,n,1)}this.setMode=s,this.render=r,this.renderInstances=a,this.renderMultiDraw=o}function uE(i,t,e,n){let s;function r(){if(s!==void 0)return s;if(t.has("EXT_texture_filter_anisotropic")===!0){const C=t.get("EXT_texture_filter_anisotropic");s=i.getParameter(C.MAX_TEXTURE_MAX_ANISOTROPY_EXT)}else s=0;return s}function a(C){return!(C!==Je&&n.convert(C)!==i.getParameter(i.IMPLEMENTATION_COLOR_READ_FORMAT))}function o(C){const _=C===Gn&&(t.has("EXT_color_buffer_half_float")||t.has("EXT_color_buffer_float"));return!(C!==en&&C!==sn&&!_&&n.convert(C)!==i.getParameter(i.IMPLEMENTATION_COLOR_READ_TYPE))}function l(C){if(C==="highp"){if(i.getShaderPrecisionFormat(i.VERTEX_SHADER,i.HIGH_FLOAT).precision>0&&i.getShaderPrecisionFormat(i.FRAGMENT_SHADER,i.HIGH_FLOAT).precision>0)return"highp";C="mediump"}return C==="mediump"&&i.getShaderPrecisionFormat(i.VERTEX_SHADER,i.MEDIUM_FLOAT).precision>0&&i.getShaderPrecisionFormat(i.FRAGMENT_SHADER,i.MEDIUM_FLOAT).precision>0?"mediump":"lowp"}let c=e.precision!==void 0?e.precision:"highp";const h=l(c);h!==c&&(_t("WebGLRenderer:",c,"not supported, using",h,"instead."),c=h);const f=e.logarithmicDepthBuffer===!0,u=e.reversedDepthBuffer===!0&&t.has("EXT_clip_control");e.reversedDepthBuffer===!0&&u===!1&&_t("WebGLRenderer: Unable to use reversed depth buffer due to missing EXT_clip_control extension. Fallback to default depth buffer.");const d=i.getParameter(i.MAX_TEXTURE_IMAGE_UNITS),p=i.getParameter(i.MAX_VERTEX_TEXTURE_IMAGE_UNITS),g=i.getParameter(i.MAX_TEXTURE_SIZE),m=i.getParameter(i.MAX_CUBE_MAP_TEXTURE_SIZE),A=i.getParameter(i.MAX_VERTEX_ATTRIBS),v=i.getParameter(i.MAX_VERTEX_UNIFORM_VECTORS),M=i.getParameter(i.MAX_VARYING_VECTORS),x=i.getParameter(i.MAX_FRAGMENT_UNIFORM_VECTORS),S=i.getParameter(i.MAX_SAMPLES),E=i.getParameter(i.SAMPLES);return{isWebGL2:!0,getMaxAnisotropy:r,getMaxPrecision:l,textureFormatReadable:a,textureTypeReadable:o,precision:c,logarithmicDepthBuffer:f,reversedDepthBuffer:u,maxTextures:d,maxVertexTextures:p,maxTextureSize:g,maxCubemapSize:m,maxAttributes:A,maxVertexUniforms:v,maxVaryings:M,maxFragmentUniforms:x,maxSamples:S,samples:E}}function fE(i){const t=this;let e=null,n=0,s=!1,r=!1;const a=new ci,o=new jt,l={value:null,needsUpdate:!1};this.uniform=l,this.numPlanes=0,this.numIntersection=0,this.init=function(f,u){const d=f.length!==0||u||n!==0||s;return s=u,n=f.length,d},this.beginShadows=function(){r=!0,h(null)},this.endShadows=function(){r=!1},this.setGlobalState=function(f,u){e=h(f,u,0)},this.setState=function(f,u,d){const p=f.clippingPlanes,g=f.clipIntersection,m=f.clipShadows,A=i.get(f);if(!s||p===null||p.length===0||r&&!m)r?h(null):c();else{const v=r?0:n,M=v*4;let x=A.clippingState||null;l.value=x,x=h(p,u,M,d);for(let S=0;S!==M;++S)x[S]=e[S];A.clippingState=x,this.numIntersection=g?this.numPlanes:0,this.numPlanes+=v}};function c(){l.value!==e&&(l.value=e,l.needsUpdate=n>0),t.numPlanes=n,t.numIntersection=0}function h(f,u,d,p){const g=f!==null?f.length:0;let m=null;if(g!==0){if(m=l.value,p!==!0||m===null){const A=d+g*4,v=u.matrixWorldInverse;o.getNormalMatrix(v),(m===null||m.length<A)&&(m=new Float32Array(A));for(let M=0,x=d;M!==g;++M,x+=4)a.copy(f[M]).applyMatrix4(v,o),a.normal.toArray(m,x),m[x+3]=a.constant}l.value=m,l.needsUpdate=!0}return t.numPlanes=g,t.numIntersection=0,m}}const Zs=4,dE=6,pE=20,AE=256,Pr=new Ca,yd=new bt;let ih=null,sh=0,rh=0,ah=!1;const mE=new I,ns=new I;class Uh{constructor(t){this._renderer=t,this._pingPongRenderTarget=null,this._lodMax=0,this._cubeSize=0,this._sizeLods=[],this._lodMeshes=[],this._backgroundBox=null,this._cubemapMaterial=null,this._equirectMaterial=null,this._blurMaterial=null,this._ggxMaterial=null}fromScene(t,e=0,n=.1,s=100,r={}){const{size:a=256,position:o=mE}=r;ih=this._renderer.getRenderTarget(),sh=this._renderer.getActiveCubeFace(),rh=this._renderer.getActiveMipmapLevel(),ah=this._renderer.xr.enabled,this._renderer.xr.enabled=!1,this._setSize(a);const l=this._allocateTargets();return l.depthBuffer=!0,this._sceneToCubeUV(t,n,s,l,o),e>0&&this._blur(l,0,0,e),this._applyPMREM(l),this._cleanup(l),l}fromEquirectangular(t,e=null){return this._fromTexture(t,e)}fromCubemap(t,e=null){return this._fromTexture(t,e)}compileCubemapShader(){this._cubemapMaterial===null&&(this._cubemapMaterial=Sd(),this._compileMaterial(this._cubemapMaterial))}compileEquirectangularShader(){this._equirectMaterial===null&&(this._equirectMaterial=Ed(),this._compileMaterial(this._equirectMaterial))}dispose(){this._dispose(),this._cubemapMaterial!==null&&this._cubemapMaterial.dispose(),this._equirectMaterial!==null&&this._equirectMaterial.dispose(),this._backgroundBox!==null&&(this._backgroundBox.geometry.dispose(),this._backgroundBox.material.dispose())}_setSize(t){this._lodMax=Math.floor(Math.log2(t)),this._cubeSize=Math.pow(2,this._lodMax)}_dispose(){this._blurMaterial!==null&&this._blurMaterial.dispose(),this._ggxMaterial!==null&&this._ggxMaterial.dispose(),this._pingPongRenderTarget!==null&&this._pingPongRenderTarget.dispose();for(let t=0;t<this._lodMeshes.length;t++)this._lodMeshes[t].geometry.dispose()}_cleanup(t){this._renderer.setRenderTarget(ih,sh,rh),this._renderer.xr.enabled=ah,t.scissorTest=!1,Hs(t,0,0,t.width,t.height)}_fromTexture(t,e){t.mapping===ti||t.mapping===Li?this._setSize(t.image.length===0?16:t.image[0].width||t.image[0].image.width):this._setSize(t.image.width/4),ih=this._renderer.getRenderTarget(),sh=this._renderer.getActiveCubeFace(),rh=this._renderer.getActiveMipmapLevel(),ah=this._renderer.xr.enabled,this._renderer.xr.enabled=!1;const n=e||this._allocateTargets();return this._textureToCubeUV(t,n),this._applyPMREM(n),this._cleanup(n),n}_allocateTargets(){const t=3*Math.max(this._cubeSize,112),e=4*this._cubeSize,n={magFilter:xe,minFilter:xe,generateMipmaps:!1,type:Gn,format:Je,colorSpace:ra,depthBuffer:!1},s=Md(t,e,n);if(this._pingPongRenderTarget===null||this._pingPongRenderTarget.width!==t||this._pingPongRenderTarget.height!==e){this._pingPongRenderTarget!==null&&this._dispose(),this._pingPongRenderTarget=Md(t,e,n);const{_lodMax:r}=this;({lodMeshes:this._lodMeshes,sizeLods:this._sizeLods}=gE(r)),this._blurMaterial=_E(r,t,e),this._ggxMaterial=xE(r,t,e)}return s}_compileMaterial(t){const e=new Ce(new $t,t);this._renderer.compile(e,Pr)}_sceneToCubeUV(t,e,n,s,r){const l=new Ue(90,1,e,n),c=[1,-1,1,1,1,1],h=[1,1,1,-1,-1,-1],f=this._renderer,u=f.autoClear,d=f.toneMapping;f.getClearColor(yd),f.toneMapping=Nn,f.autoClear=!1,f.state.buffers.depth.getReversed()&&(f.setRenderTarget(s),f.clearDepth(),f.setRenderTarget(null)),this._backgroundBox===null&&(this._backgroundBox=new Ce(new As,new Oi({name:"PMREM.Background",side:an,depthWrite:!1,depthTest:!1})));const g=this._backgroundBox,m=g.material;let A=!1;const v=t.background;v?v.isColor&&(m.color.copy(v),t.background=null,A=!0):(m.color.copy(yd),A=!0);for(let M=0;M<6;M++){const x=M%3;x===0?(l.up.set(0,c[M],0),l.position.set(r.x,r.y,r.z),l.lookAt(r.x+h[M],r.y,r.z)):x===1?(l.up.set(0,0,c[M]),l.position.set(r.x,r.y,r.z),l.lookAt(r.x,r.y+h[M],r.z)):(l.up.set(0,c[M],0),l.position.set(r.x,r.y,r.z),l.lookAt(r.x,r.y,r.z+h[M]));const S=this._cubeSize;Hs(s,x*S,M>2?S:0,S,S),f.setRenderTarget(s),A&&f.render(g,l),f.render(t,l)}f.toneMapping=d,f.autoClear=u,t.background=v}_textureToCubeUV(t,e){const n=this._renderer,s=t.mapping===ti||t.mapping===Li;s?(this._cubemapMaterial===null&&(this._cubemapMaterial=Sd()),this._cubemapMaterial.uniforms.flipEnvMap.value=t.isRenderTargetTexture===!1?-1:1):this._equirectMaterial===null&&(this._equirectMaterial=Ed());const r=s?this._cubemapMaterial:this._equirectMaterial,a=this._lodMeshes[0];a.material=r;const o=r.uniforms;o.envMap.value=t;const l=this._cubeSize;Hs(e,0,0,3*l,2*l),n.setRenderTarget(e),n.render(a,Pr)}_applyPMREM(t){const e=this._renderer,n=e.autoClear;e.autoClear=!1;const s=this._lodMeshes.length;for(let r=1;r<s;r++)this._applyGGXFilter(t,r-1,r);e.autoClear=n}_applyGGXFilter(t,e,n){const s=this._renderer,r=this._pingPongRenderTarget,a=this._ggxMaterial,o=this._lodMeshes[n];o.material=a;const l=a.uniforms,c=n/(this._lodMeshes.length-1),h=e/(this._lodMeshes.length-1),f=Math.sqrt(c*c-h*h),u=c*1.25,d=f*u,{_lodMax:p}=this,g=this._sizeLods[n],m=3*g*(n>p-Zs?n-p+Zs:0),A=4*(this._cubeSize-g);l.envMap.value=t.texture,l.roughness.value=d,l.mipInt.value=p-e,Hs(r,m,A,3*g,2*g),s.setRenderTarget(r),s.render(o,Pr),l.envMap.value=r.texture,l.roughness.value=0,l.mipInt.value=p-n,Hs(t,m,A,3*g,2*g),s.setRenderTarget(t),s.render(o,Pr)}_blur(t,e,n,s){const r=this._pingPongRenderTarget,a=Math.min(s,Math.PI)/Math.SQRT2;this._blurPass(t,r,e,n,a),this._blurPass(r,t,n,n,a)}_blurPass(t,e,n,s,r){const a=this._renderer,o=this._blurMaterial,l=this._lodMeshes[s];l.material=o;const c=o.uniforms;c.envMap.value=t.texture,c.sigma.value=r,c.mipInt.value=this._lodMax-n;const h=this._sizeLods[s],f=3*h*(s>this._lodMax-Zs?s-this._lodMax+Zs:0),u=4*(this._cubeSize-h);Hs(e,f,u,3*h,2*h),a.setRenderTarget(e),a.render(l,Pr)}}function gE(i){const t=[],e=[];let n=i;const s=i-Zs+1+dE;for(let r=0;r<s;r++){const a=Math.pow(2,n);t.push(a);const o=1/(a-2),l=-o,c=1+o,h=[l,l,c,l,c,c,l,l,c,c,l,c],f=6,u=6,d=3,p=new Float32Array(d*u*f),g=new Float32Array(d*u*f);for(let A=0;A<f;A++){const v=A%3*2/3-1,M=A>2?0:-1,x=[v,M,0,v+2/3,M,0,v+2/3,M+1,0,v,M,0,v+2/3,M+1,0,v,M+1,0];p.set(x,d*u*A);for(let S=0;S<u;S++){const E=h[S*2]*2-1,C=h[S*2+1]*2-1;A===0?ns.set(1,C,E):A===1?ns.set(-E,1,-C):A===2?ns.set(-E,C,1):A===3?ns.set(-1,C,-E):A===4?ns.set(-E,-1,C):ns.set(E,C,-1),ns.toArray(g,(A*u+S)*d)}}const m=new $t;m.setAttribute("position",new fe(p,d)),m.setAttribute("outputDirection",new fe(g,d)),e.push(new Ce(m,null)),n>Zs&&n--}return{lodMeshes:e,sizeLods:t}}function Md(i,t,e){const n=new pn(i,t,e);return n.texture.mapping=pr,n.texture.name="PMREM.cubeUv",n.scissorTest=!0,n}function Hs(i,t,e,n,s){i.viewport.set(t,e,n,s),i.scissor.set(t,e,n,s)}function xE(i,t,e){return new Sn({name:"PMREMGGXConvolution",defines:{GGX_SAMPLES:AE,CUBEUV_TEXEL_WIDTH:1/t,CUBEUV_TEXEL_HEIGHT:1/e,CUBEUV_MAX_MIP:`${i}.0`},uniforms:{envMap:{value:null},roughness:{value:0},mipInt:{value:0}},vertexShader:mc(),fragmentShader:`

			precision highp float;
			precision highp int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;
			uniform float roughness;
			uniform float mipInt;

			#define ENVMAP_TYPE_CUBE_UV
			#include <cube_uv_reflection_fragment>

			#define PI 3.14159265359

			// Van der Corput radical inverse
			float radicalInverse_VdC(uint bits) {
				bits = (bits << 16u) | (bits >> 16u);
				bits = ((bits & 0x55555555u) << 1u) | ((bits & 0xAAAAAAAAu) >> 1u);
				bits = ((bits & 0x33333333u) << 2u) | ((bits & 0xCCCCCCCCu) >> 2u);
				bits = ((bits & 0x0F0F0F0Fu) << 4u) | ((bits & 0xF0F0F0F0u) >> 4u);
				bits = ((bits & 0x00FF00FFu) << 8u) | ((bits & 0xFF00FF00u) >> 8u);
				return float(bits) * 2.3283064365386963e-10; // / 0x100000000
			}

			// Hammersley sequence
			vec2 hammersley(uint i, uint N) {
				return vec2(float(i) / float(N), radicalInverse_VdC(i));
			}

			// GGX VNDF importance sampling (Eric Heitz 2018)
			// "Sampling the GGX Distribution of Visible Normals"
			// https://jcgt.org/published/0007/04/01/
			vec3 importanceSampleGGX_VNDF(vec2 Xi, vec3 V, float roughness) {
				float alpha = roughness * roughness;

				// Section 4.1: Orthonormal basis
				vec3 T1 = vec3(1.0, 0.0, 0.0);
				vec3 T2 = cross(V, T1);

				// Section 4.2: Parameterization of projected area
				float r = sqrt(Xi.x);
				float phi = 2.0 * PI * Xi.y;
				float t1 = r * cos(phi);
				float t2 = r * sin(phi);
				float s = 0.5 * (1.0 + V.z);
				t2 = (1.0 - s) * sqrt(1.0 - t1 * t1) + s * t2;

				// Section 4.3: Reprojection onto hemisphere
				vec3 Nh = t1 * T1 + t2 * T2 + sqrt(max(0.0, 1.0 - t1 * t1 - t2 * t2)) * V;

				// Section 3.4: Transform back to ellipsoid configuration
				return normalize(vec3(alpha * Nh.x, alpha * Nh.y, max(0.0, Nh.z)));
			}

			void main() {
				vec3 N = normalize(vOutputDirection);
				vec3 V = N; // Assume view direction equals normal for pre-filtering

				vec3 prefilteredColor = vec3(0.0);
				float totalWeight = 0.0;

				// For very low roughness, just sample the environment directly
				if (roughness < 0.001) {
					gl_FragColor = vec4(bilinearCubeUV(envMap, N, mipInt), 1.0);
					return;
				}

				// Tangent space basis for VNDF sampling
				vec3 up = abs(N.z) < 0.999 ? vec3(0.0, 0.0, 1.0) : vec3(1.0, 0.0, 0.0);
				vec3 tangent = normalize(cross(up, N));
				vec3 bitangent = cross(N, tangent);

				for(uint i = 0u; i < uint(GGX_SAMPLES); i++) {
					vec2 Xi = hammersley(i, uint(GGX_SAMPLES));

					// For PMREM, V = N, so in tangent space V is always (0, 0, 1)
					vec3 H_tangent = importanceSampleGGX_VNDF(Xi, vec3(0.0, 0.0, 1.0), roughness);

					// Transform H back to world space
					vec3 H = normalize(tangent * H_tangent.x + bitangent * H_tangent.y + N * H_tangent.z);
					vec3 L = normalize(2.0 * dot(V, H) * H - V);

					float NdotL = max(dot(N, L), 0.0);

					if(NdotL > 0.0) {
						// Sample environment at fixed mip level
						// VNDF importance sampling handles the distribution filtering
						vec3 sampleColor = bilinearCubeUV(envMap, L, mipInt);

						// Weight by NdotL for the split-sum approximation
						// VNDF PDF naturally accounts for the visible microfacet distribution
						prefilteredColor += sampleColor * NdotL;
						totalWeight += NdotL;
					}
				}

				if (totalWeight > 0.0) {
					prefilteredColor = prefilteredColor / totalWeight;
				}

				gl_FragColor = vec4(prefilteredColor, 1.0);
			}
		`,blending:jn,depthTest:!1,depthWrite:!1})}function _E(i,t,e){return new Sn({name:"SphericalGaussianBlur",defines:{SAMPLES:pE,CUBEUV_TEXEL_WIDTH:1/t,CUBEUV_TEXEL_HEIGHT:1/e,CUBEUV_MAX_MIP:`${i}.0`},uniforms:{envMap:{value:null},sigma:{value:0},mipInt:{value:0}},vertexShader:mc(),fragmentShader:`

			precision highp float;
			precision highp int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;
			uniform float sigma;
			uniform float mipInt;

			#define ENVMAP_TYPE_CUBE_UV
			#include <cube_uv_reflection_fragment>

			#define PI 3.14159265359
			#define GOLDEN_ANGLE 2.39996322973

			void main() {

				if ( sigma == 0.0 ) {

					gl_FragColor = vec4( bilinearCubeUV( envMap, vOutputDirection, mipInt ), 1.0 );
					return;

				}

				vec3 outputDirection = normalize( vOutputDirection );

				vec3 up = abs( outputDirection.z ) < 0.999 ? vec3( 0.0, 0.0, 1.0 ) : vec3( 1.0, 0.0, 0.0 );
				vec3 tangent = normalize( cross( up, outputDirection ) );
				vec3 bitangent = cross( outputDirection, tangent );

				// Truncate the kernel at three standard deviations or at the antipode.
				float thetaMax = min( 3.0 * sigma, PI );
				float truncation = 1.0 - exp( - 0.5 * thetaMax * thetaMax / ( sigma * sigma ) );

				vec3 accumColor = vec3( 0.0 );
				float accumWeight = 0.0;

				for ( int i = 0; i < SAMPLES; i ++ ) {

					// Stratified inverse-CDF sampling of the Gaussian, placed on a golden-angle spiral.
					float stratum = ( float( i ) + 0.5 ) / float( SAMPLES );
					float theta = sigma * sqrt( - 2.0 * log( 1.0 - stratum * truncation ) );
					float phi = float( i ) * GOLDEN_ANGLE;

					vec3 offset = cos( phi ) * tangent + sin( phi ) * bitangent;
					vec3 sampleDirection = cos( theta ) * outputDirection + sin( theta ) * offset;

					// Correct the planar sample density to solid angle.
					float weight = sin( theta ) / theta;

					accumColor += weight * bilinearCubeUV( envMap, sampleDirection, mipInt );
					accumWeight += weight;

				}

				gl_FragColor = vec4( accumColor / accumWeight, 1.0 );

			}
		`,blending:jn,depthTest:!1,depthWrite:!1})}function Ed(){return new Sn({name:"EquirectangularToCubeUV",uniforms:{envMap:{value:null}},vertexShader:mc(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;

			#include <common>

			void main() {

				vec3 outputDirection = normalize( vOutputDirection );
				vec2 uv = equirectUv( outputDirection );

				gl_FragColor = vec4( texture2D ( envMap, uv ).rgb, 1.0 );

			}
		`,blending:jn,depthTest:!1,depthWrite:!1})}function Sd(){return new Sn({name:"CubemapToCubeUV",uniforms:{envMap:{value:null},flipEnvMap:{value:-1}},vertexShader:mc(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			uniform float flipEnvMap;

			varying vec3 vOutputDirection;

			uniform samplerCube envMap;

			void main() {

				gl_FragColor = textureCube( envMap, vec3( flipEnvMap * vOutputDirection.x, vOutputDirection.yz ) );

			}
		`,blending:jn,depthTest:!1,depthWrite:!1})}function mc(){return`

		precision mediump float;
		precision mediump int;

		attribute vec3 outputDirection;

		varying vec3 vOutputDirection;

		void main() {

			vOutputDirection = outputDirection;
			gl_Position = vec4( position, 1.0 );

		}
	`}class Hu extends pn{constructor(t=1,e={}){super(t,t,e),this.isWebGLCubeRenderTarget=!0;const n={width:t,height:t,depth:1},s=[n,n,n,n,n,n];this.texture=new ya(s),this._setTextureOptions(e),this.texture.isRenderTargetTexture=!0}fromEquirectangularTexture(t,e){this.texture.type=e.type,this.texture.colorSpace=e.colorSpace,this.texture.generateMipmaps=e.generateMipmaps,this.texture.minFilter=e.minFilter,this.texture.magFilter=e.magFilter;const n={uniforms:{tEquirect:{value:null}},vertexShader:`

				varying vec3 vWorldDirection;

				vec3 transformDirection( in vec3 dir, in mat4 matrix ) {

					return normalize( ( matrix * vec4( dir, 0.0 ) ).xyz );

				}

				void main() {

					vWorldDirection = transformDirection( position, modelMatrix );

					#include <begin_vertex>
					#include <project_vertex>

				}
			`,fragmentShader:`

				uniform sampler2D tEquirect;

				varying vec3 vWorldDirection;

				#include <common>

				void main() {

					vec3 direction = normalize( vWorldDirection );

					vec2 sampleUV = equirectUv( direction );

					gl_FragColor = texture2D( tEquirect, sampleUV );

				}
			`},s=new As(5,5,5),r=new Sn({name:"CubemapFromEquirect",uniforms:fr(n.uniforms),vertexShader:n.vertexShader,fragmentShader:n.fragmentShader,side:an,blending:jn});r.uniforms.tEquirect.value=e;const a=new Ce(s,r),o=e.minFilter;return e.minFilter===Kn&&(e.minFilter=xe),new pm(1,10,this).update(t,a),e.minFilter=o,a.geometry.dispose(),a.material.dispose(),this}clear(t,e=!0,n=!0,s=!0){const r=t.getRenderTarget();for(let a=0;a<6;a++)t.setRenderTarget(this,a),t.clear(e,n,s);t.setRenderTarget(r)}}function vE(i){let t=new WeakMap,e=new WeakMap,n=null;function s(u,d=!1){return u==null?null:d?a(u):r(u)}function r(u){if(u&&u.isTexture){const d=u.mapping;if(d===Qr||d===zr)if(t.has(u)){const p=t.get(u).texture;return o(p,u.mapping)}else{const p=u.image;if(p&&p.height>0){const g=new Hu(p.height);return g.fromEquirectangularTexture(i,u),t.set(u,g),u.addEventListener("dispose",c),o(g.texture,u.mapping)}else return null}}return u}function a(u){if(u&&u.isTexture){const d=u.mapping,p=d===Qr||d===zr,g=d===ti||d===Li;if(p||g){let m=e.get(u);const A=m!==void 0?m.texture.pmremVersion:0;if(u.isRenderTargetTexture&&u.pmremVersion!==A)return n===null&&(n=new Uh(i)),m=p?n.fromEquirectangular(u,m):n.fromCubemap(u,m),m.texture.pmremVersion=u.pmremVersion,e.set(u,m),m.texture;if(m!==void 0)return m.texture;{const v=u.image;return p&&v&&v.height>0||g&&v&&l(v)?(n===null&&(n=new Uh(i)),m=p?n.fromEquirectangular(u):n.fromCubemap(u),m.texture.pmremVersion=u.pmremVersion,e.set(u,m),u.addEventListener("dispose",h),m.texture):null}}}return u}function o(u,d){return d===Qr?u.mapping=ti:d===zr&&(u.mapping=Li),u}function l(u){let d=0;const p=6;for(let g=0;g<p;g++)u[g]!==void 0&&d++;return d===p}function c(u){const d=u.target;d.removeEventListener("dispose",c);const p=t.get(d);p!==void 0&&(t.delete(d),p.dispose())}function h(u){const d=u.target;d.removeEventListener("dispose",h);const p=e.get(d);p!==void 0&&(e.delete(d),p.dispose())}function f(){t=new WeakMap,e=new WeakMap,n!==null&&(n.dispose(),n=null)}return{get:s,dispose:f}}function yE(i){const t={};function e(n){if(t[n]!==void 0)return t[n];const s=i.getExtension(n);return t[n]=s,s}return{has:function(n){return e(n)!==null},init:function(){e("EXT_color_buffer_float"),e("WEBGL_clip_cull_distance"),e("OES_texture_float_linear"),e("EXT_color_buffer_half_float"),e("WEBGL_multisampled_render_to_texture"),e("WEBGL_render_shared_exponent")},get:function(n){const s=e(n);return s===null&&di("WebGLRenderer: "+n+" extension not supported."),s}}}function ME(i,t,e,n){const s={},r=new WeakMap;function a(f){const u=f.target;u.index!==null&&t.remove(u.index);for(const p in u.attributes)t.remove(u.attributes[p]);u.removeEventListener("dispose",a),delete s[u.id];const d=r.get(u);d&&(t.remove(d),r.delete(u)),n.releaseStatesOfGeometry(u),u.isInstancedBufferGeometry===!0&&delete u._maxInstanceCount,e.memory.geometries--}function o(f,u){return s[u.id]===!0||(u.addEventListener("dispose",a),s[u.id]=!0,e.memory.geometries++),u}function l(f){const u=f.attributes;for(const d in u)t.update(u[d],i.ARRAY_BUFFER)}function c(f){const u=[],d=f.index,p=f.attributes.position;let g=0;if(p===void 0)return;if(d!==null){const v=d.array;g=d.version;for(let M=0,x=v.length;M<x;M+=3){const S=v[M+0],E=v[M+1],C=v[M+2];u.push(S,E,E,C,C,S)}}else{const v=p.array;g=p.version;for(let M=0,x=v.length/3-1;M<x;M+=3){const S=M+0,E=M+1,C=M+2;u.push(S,E,E,C,C,S)}}const m=new(p.count>=65535?xu:gu)(u,1);m.version=g;const A=r.get(f);A&&t.remove(A),r.set(f,m)}function h(f){const u=r.get(f);if(u){const d=f.index;d!==null&&u.version<d.version&&c(f)}else c(f);return r.get(f)}return{get:o,update:l,getWireframeAttribute:h}}function EE(i,t,e){let n;function s(f){n=f}let r,a;function o(f){r=f.type,a=f.bytesPerElement}function l(f,u){i.drawElements(n,u,r,f*a),e.update(u,n,1)}function c(f,u,d){d!==0&&(i.drawElementsInstanced(n,u,r,f*a,d),e.update(u,n,d))}function h(f,u,d){if(d===0)return;t.get("WEBGL_multi_draw").multiDrawElementsWEBGL(n,u,0,r,f,0,d);let g=0;for(let m=0;m<d;m++)g+=u[m];e.update(g,n,1)}this.setMode=s,this.setIndex=o,this.render=l,this.renderInstances=c,this.renderMultiDraw=h}function SE(i){const t={geometries:0,textures:0},e={frame:0,calls:0,triangles:0,points:0,lines:0};function n(r,a,o){switch(e.calls++,a){case i.TRIANGLES:e.triangles+=o*(r/3);break;case i.LINES:e.lines+=o*(r/2);break;case i.LINE_STRIP:e.lines+=o*(r-1);break;case i.LINE_LOOP:e.lines+=o*r;break;case i.POINTS:e.points+=o*r;break;default:Ht("WebGLInfo: Unknown draw mode:",a);break}}function s(){e.calls=0,e.triangles=0,e.points=0,e.lines=0}return{memory:t,render:e,programs:null,autoReset:!0,reset:s,update:n}}function wE(i,t,e){const n=new WeakMap,s=new Ae;function r(a,o,l){const c=a.morphTargetInfluences,h=o.morphAttributes.position||o.morphAttributes.normal||o.morphAttributes.color,f=h!==void 0?h.length:0;let u=n.get(o);if(u===void 0||u.count!==f){let b=function(){C.dispose(),n.delete(o),o.removeEventListener("dispose",b)};u!==void 0&&u.texture.dispose();const d=o.morphAttributes.position!==void 0,p=o.morphAttributes.normal!==void 0,g=o.morphAttributes.color!==void 0,m=o.morphAttributes.position||[],A=o.morphAttributes.normal||[],v=o.morphAttributes.color||[];let M=0;d===!0&&(M=1),p===!0&&(M=2),g===!0&&(M=3);let x=o.attributes.position.count*M,S=1;x>t.maxTextureSize&&(S=Math.ceil(x/t.maxTextureSize),x=t.maxTextureSize);const E=new Float32Array(x*S*4*f),C=new Hl(E,x,S,f);C.type=sn,C.needsUpdate=!0;const _=M*4;for(let B=0;B<f;B++){const P=m[B],U=A[B],k=v[B],L=x*S*4*B;for(let O=0;O<P.count;O++){const q=O*_;d===!0&&(s.fromBufferAttribute(P,O),E[L+q+0]=s.x,E[L+q+1]=s.y,E[L+q+2]=s.z,E[L+q+3]=0),p===!0&&(s.fromBufferAttribute(U,O),E[L+q+4]=s.x,E[L+q+5]=s.y,E[L+q+6]=s.z,E[L+q+7]=0),g===!0&&(s.fromBufferAttribute(k,O),E[L+q+8]=s.x,E[L+q+9]=s.y,E[L+q+10]=s.z,E[L+q+11]=k.itemSize===4?s.w:1)}}u={count:f,texture:C,size:new lt(x,S)},n.set(o,u),o.addEventListener("dispose",b)}if(a.isInstancedMesh===!0&&a.morphTexture!==null)l.getUniforms().setValue(i,"morphTexture",a.morphTexture,e);else{let d=0;for(let g=0;g<c.length;g++)d+=c[g];const p=o.morphTargetsRelative?1:1-d;l.getUniforms().setValue(i,"morphTargetBaseInfluence",p),l.getUniforms().setValue(i,"morphTargetInfluences",c)}l.getUniforms().setValue(i,"morphTargetsTexture",u.texture,e),l.getUniforms().setValue(i,"morphTargetsTextureSize",u.size)}return{update:r}}function bE(i,t,e,n,s){let r=new WeakMap;function a(c){const h=s.render.frame,f=c.geometry,u=t.get(c,f);if(r.get(u)!==h&&(t.update(u),r.set(u,h)),c.isInstancedMesh&&(c.hasEventListener("dispose",l)===!1&&c.addEventListener("dispose",l),r.get(c)!==h&&(e.update(c.instanceMatrix,i.ARRAY_BUFFER),c.instanceColor!==null&&e.update(c.instanceColor,i.ARRAY_BUFFER),r.set(c,h))),c.isSkinnedMesh){const d=c.skeleton;r.get(d)!==h&&(d.update(),r.set(d,h))}return u}function o(){r=new WeakMap}function l(c){const h=c.target;h.removeEventListener("dispose",l),n.releaseStatesOfObject(h),e.remove(h.instanceMatrix),h.instanceColor!==null&&e.remove(h.instanceColor)}return{update:a,dispose:o}}const CE={[tu]:"LINEAR_TONE_MAPPING",[eu]:"REINHARD_TONE_MAPPING",[nu]:"CINEON_TONE_MAPPING",[iu]:"ACES_FILMIC_TONE_MAPPING",[ru]:"AGX_TONE_MAPPING",[au]:"NEUTRAL_TONE_MAPPING",[su]:"CUSTOM_TONE_MAPPING"};function TE(i,t,e,n,s,r){const a=new pn(t,e,{type:i,depthBuffer:s,stencilBuffer:r,samples:n?4:0,storeMultisampledDepthBuffer:!1,storeMultisampledStencilBuffer:!1,resolveDepthBuffer:!1,resolveStencilBuffer:!1});let o=null,l=null;const c=new $t;c.setAttribute("position",new Ft([-1,3,0,-1,-1,0,3,-1,0],3)),c.setAttribute("uv",new Ft([0,2,0,0,2,0],2));const h=new Bu({uniforms:{tDiffuse:{value:null}},vertexShader:`
			precision highp float;

			uniform mat4 modelViewMatrix;
			uniform mat4 projectionMatrix;

			attribute vec3 position;
			attribute vec2 uv;

			varying vec2 vUv;

			void main() {
				vUv = uv;
				gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
			}`,fragmentShader:`
			precision highp float;

			uniform sampler2D tDiffuse;

			varying vec2 vUv;

			#include <tonemapping_pars_fragment>
			#include <colorspace_pars_fragment>

			void main() {
				gl_FragColor = texture2D( tDiffuse, vUv );

				#ifdef LINEAR_TONE_MAPPING
					gl_FragColor.rgb = LinearToneMapping( gl_FragColor.rgb );
				#elif defined( REINHARD_TONE_MAPPING )
					gl_FragColor.rgb = ReinhardToneMapping( gl_FragColor.rgb );
				#elif defined( CINEON_TONE_MAPPING )
					gl_FragColor.rgb = CineonToneMapping( gl_FragColor.rgb );
				#elif defined( ACES_FILMIC_TONE_MAPPING )
					gl_FragColor.rgb = ACESFilmicToneMapping( gl_FragColor.rgb );
				#elif defined( AGX_TONE_MAPPING )
					gl_FragColor.rgb = AgXToneMapping( gl_FragColor.rgb );
				#elif defined( NEUTRAL_TONE_MAPPING )
					gl_FragColor.rgb = NeutralToneMapping( gl_FragColor.rgb );
				#elif defined( CUSTOM_TONE_MAPPING )
					gl_FragColor.rgb = CustomToneMapping( gl_FragColor.rgb );
				#endif

				#ifdef SRGB_TRANSFER
					gl_FragColor = sRGBTransferOETF( gl_FragColor );
				#endif
			}`,depthTest:!1,depthWrite:!1}),f=new Ce(c,h),u=new Ca(-1,1,1,-1,0,1);let d=null,p=null,g=!1,m,A=null,v=[],M=!1;this.setSize=function(x,S){a.setSize(x,S),o!==null&&o.setSize(x,S),l!==null&&l.setSize(x,S);for(let E=0;E<v.length;E++){const C=v[E];C.setSize&&C.setSize(x,S)}},this.setEffects=function(x){v=x,M=v.length>0&&v[0].isRenderPass===!0;const S=a.width,E=a.height;v.length>0&&o===null&&(o=new pn(S,E,{type:Gn,depthBuffer:!1,stencilBuffer:!1}),l=new pn(S,E,{type:Gn,depthBuffer:!1,stencilBuffer:!1}));for(let C=0;C<v.length;C++){const _=v[C];_.setSize&&_.setSize(S,E)}},this.begin=function(x,S){if(g||x.toneMapping===Nn&&v.length===0)return!1;if(A=S,S!==null){const E=S.width,C=S.height;(a.width!==E||a.height!==C)&&this.setSize(E,C)}return M===!1&&x.setRenderTarget(a),m=x.toneMapping,x.toneMapping=Nn,!0},this.hasRenderPass=function(){return M},this.end=function(x,S){x.toneMapping=m,g=!0;let E=a,C=o;for(let _=0;_<v.length;_++){const b=v[_];b.enabled!==!1&&(b.render(x,C,E,S),b.needsSwap!==!1&&(E=C,C=C===o?l:o))}if(d!==x.outputColorSpace||p!==x.toneMapping){d=x.outputColorSpace,p=x.toneMapping,h.defines={},ae.getTransfer(d)===pe&&(h.defines.SRGB_TRANSFER="");const _=CE[p];_&&(h.defines[_]=""),h.needsUpdate=!0}h.uniforms.tDiffuse.value=E.texture,x.setRenderTarget(A),x.render(f,u),A=null,g=!1},this.isCompositing=function(){return g},this.dispose=function(){a.dispose(),o!==null&&o.dispose(),l!==null&&l.dispose(),c.dispose(),h.dispose()}}const Sm=new Me,Nh=new hr(1,1),wm=new Hl,bm=new Vl,Cm=new ya,wd=[],bd=[],Cd=new Float32Array(16),Td=new Float32Array(9),Bd=new Float32Array(4);function xr(i,t,e){const n=i[0];if(n<=0||n>0)return i;const s=t*e;let r=wd[s];if(r===void 0&&(r=new Float32Array(s),wd[s]=r),t!==0){n.toArray(r,0);for(let a=1,o=0;a!==t;++a)o+=e,i[a].toArray(r,o)}return r}function Re(i,t){if(i.length!==t.length)return!1;for(let e=0,n=i.length;e<n;e++)if(i[e]!==t[e])return!1;return!0}function De(i,t){for(let e=0,n=t.length;e<n;e++)i[e]=t[e]}function gc(i,t){let e=bd[t];e===void 0&&(e=new Int32Array(t),bd[t]=e);for(let n=0;n!==t;++n)e[n]=i.allocateTextureUnit();return e}function BE(i,t){const e=this.cache;e[0]!==t&&(i.uniform1f(this.addr,t),e[0]=t)}function IE(i,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y)&&(i.uniform2f(this.addr,t.x,t.y),e[0]=t.x,e[1]=t.y);else{if(Re(e,t))return;i.uniform2fv(this.addr,t),De(e,t)}}function RE(i,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z)&&(i.uniform3f(this.addr,t.x,t.y,t.z),e[0]=t.x,e[1]=t.y,e[2]=t.z);else if(t.r!==void 0)(e[0]!==t.r||e[1]!==t.g||e[2]!==t.b)&&(i.uniform3f(this.addr,t.r,t.g,t.b),e[0]=t.r,e[1]=t.g,e[2]=t.b);else{if(Re(e,t))return;i.uniform3fv(this.addr,t),De(e,t)}}function DE(i,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z||e[3]!==t.w)&&(i.uniform4f(this.addr,t.x,t.y,t.z,t.w),e[0]=t.x,e[1]=t.y,e[2]=t.z,e[3]=t.w);else{if(Re(e,t))return;i.uniform4fv(this.addr,t),De(e,t)}}function PE(i,t){const e=this.cache,n=t.elements;if(n===void 0){if(Re(e,t))return;i.uniformMatrix2fv(this.addr,!1,t),De(e,t)}else{if(Re(e,n))return;Bd.set(n),i.uniformMatrix2fv(this.addr,!1,Bd),De(e,n)}}function LE(i,t){const e=this.cache,n=t.elements;if(n===void 0){if(Re(e,t))return;i.uniformMatrix3fv(this.addr,!1,t),De(e,t)}else{if(Re(e,n))return;Td.set(n),i.uniformMatrix3fv(this.addr,!1,Td),De(e,n)}}function FE(i,t){const e=this.cache,n=t.elements;if(n===void 0){if(Re(e,t))return;i.uniformMatrix4fv(this.addr,!1,t),De(e,t)}else{if(Re(e,n))return;Cd.set(n),i.uniformMatrix4fv(this.addr,!1,Cd),De(e,n)}}function UE(i,t){const e=this.cache;e[0]!==t&&(i.uniform1i(this.addr,t),e[0]=t)}function NE(i,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y)&&(i.uniform2i(this.addr,t.x,t.y),e[0]=t.x,e[1]=t.y);else{if(Re(e,t))return;i.uniform2iv(this.addr,t),De(e,t)}}function OE(i,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z)&&(i.uniform3i(this.addr,t.x,t.y,t.z),e[0]=t.x,e[1]=t.y,e[2]=t.z);else{if(Re(e,t))return;i.uniform3iv(this.addr,t),De(e,t)}}function GE(i,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z||e[3]!==t.w)&&(i.uniform4i(this.addr,t.x,t.y,t.z,t.w),e[0]=t.x,e[1]=t.y,e[2]=t.z,e[3]=t.w);else{if(Re(e,t))return;i.uniform4iv(this.addr,t),De(e,t)}}function kE(i,t){const e=this.cache;e[0]!==t&&(i.uniform1ui(this.addr,t),e[0]=t)}function QE(i,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y)&&(i.uniform2ui(this.addr,t.x,t.y),e[0]=t.x,e[1]=t.y);else{if(Re(e,t))return;i.uniform2uiv(this.addr,t),De(e,t)}}function zE(i,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z)&&(i.uniform3ui(this.addr,t.x,t.y,t.z),e[0]=t.x,e[1]=t.y,e[2]=t.z);else{if(Re(e,t))return;i.uniform3uiv(this.addr,t),De(e,t)}}function HE(i,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z||e[3]!==t.w)&&(i.uniform4ui(this.addr,t.x,t.y,t.z,t.w),e[0]=t.x,e[1]=t.y,e[2]=t.z,e[3]=t.w);else{if(Re(e,t))return;i.uniform4uiv(this.addr,t),De(e,t)}}function VE(i,t,e){const n=this.cache,s=e.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s);let r;this.type===i.SAMPLER_2D_SHADOW?(Nh.compareFunction=e.isReversedDepthBuffer()?Ql:kl,r=Nh):r=Sm,e.setTexture2D(t||r,s)}function WE(i,t,e){const n=this.cache,s=e.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s),e.setTexture3D(t||bm,s)}function YE(i,t,e){const n=this.cache,s=e.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s),e.setTextureCube(t||Cm,s)}function XE(i,t,e){const n=this.cache,s=e.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s),e.setTexture2DArray(t||wm,s)}function qE(i){switch(i){case 5126:return BE;case 35664:return IE;case 35665:return RE;case 35666:return DE;case 35674:return PE;case 35675:return LE;case 35676:return FE;case 5124:case 35670:return UE;case 35667:case 35671:return NE;case 35668:case 35672:return OE;case 35669:case 35673:return GE;case 5125:return kE;case 36294:return QE;case 36295:return zE;case 36296:return HE;case 35678:case 36198:case 36298:case 36306:case 35682:return VE;case 35679:case 36299:case 36307:return WE;case 35680:case 36300:case 36308:case 36293:return YE;case 36289:case 36303:case 36311:case 36292:return XE}}function KE(i,t){i.uniform1fv(this.addr,t)}function JE(i,t){const e=xr(t,this.size,2);i.uniform2fv(this.addr,e)}function ZE(i,t){const e=xr(t,this.size,3);i.uniform3fv(this.addr,e)}function $E(i,t){const e=xr(t,this.size,4);i.uniform4fv(this.addr,e)}function jE(i,t){const e=xr(t,this.size,4);i.uniformMatrix2fv(this.addr,!1,e)}function tS(i,t){const e=xr(t,this.size,9);i.uniformMatrix3fv(this.addr,!1,e)}function eS(i,t){const e=xr(t,this.size,16);i.uniformMatrix4fv(this.addr,!1,e)}function nS(i,t){i.uniform1iv(this.addr,t)}function iS(i,t){i.uniform2iv(this.addr,t)}function sS(i,t){i.uniform3iv(this.addr,t)}function rS(i,t){i.uniform4iv(this.addr,t)}function aS(i,t){i.uniform1uiv(this.addr,t)}function oS(i,t){i.uniform2uiv(this.addr,t)}function lS(i,t){i.uniform3uiv(this.addr,t)}function cS(i,t){i.uniform4uiv(this.addr,t)}function hS(i,t,e){const n=this.cache,s=t.length,r=gc(e,s);Re(n,r)||(i.uniform1iv(this.addr,r),De(n,r));let a;this.type===i.SAMPLER_2D_SHADOW?a=Nh:a=Sm;for(let o=0;o!==s;++o)e.setTexture2D(t[o]||a,r[o])}function uS(i,t,e){const n=this.cache,s=t.length,r=gc(e,s);Re(n,r)||(i.uniform1iv(this.addr,r),De(n,r));for(let a=0;a!==s;++a)e.setTexture3D(t[a]||bm,r[a])}function fS(i,t,e){const n=this.cache,s=t.length,r=gc(e,s);Re(n,r)||(i.uniform1iv(this.addr,r),De(n,r));for(let a=0;a!==s;++a)e.setTextureCube(t[a]||Cm,r[a])}function dS(i,t,e){const n=this.cache,s=t.length,r=gc(e,s);Re(n,r)||(i.uniform1iv(this.addr,r),De(n,r));for(let a=0;a!==s;++a)e.setTexture2DArray(t[a]||wm,r[a])}function pS(i){switch(i){case 5126:return KE;case 35664:return JE;case 35665:return ZE;case 35666:return $E;case 35674:return jE;case 35675:return tS;case 35676:return eS;case 5124:case 35670:return nS;case 35667:case 35671:return iS;case 35668:case 35672:return sS;case 35669:case 35673:return rS;case 5125:return aS;case 36294:return oS;case 36295:return lS;case 36296:return cS;case 35678:case 36198:case 36298:case 36306:case 35682:return hS;case 35679:case 36299:case 36307:return uS;case 35680:case 36300:case 36308:case 36293:return fS;case 36289:case 36303:case 36311:case 36292:return dS}}class AS{constructor(t,e,n){this.id=t,this.addr=n,this.cache=[],this.type=e.type,this.setValue=qE(e.type)}}class mS{constructor(t,e,n){this.id=t,this.addr=n,this.cache=[],this.type=e.type,this.size=e.size,this.setValue=pS(e.type)}}class gS{constructor(t){this.id=t,this.seq=[],this.map={}}setValue(t,e,n){const s=this.seq;for(let r=0,a=s.length;r!==a;++r){const o=s[r];o.setValue(t,e[o.id],n)}}}const oh=/(\w+)(\])?(\[|\.)?/g;function Id(i,t){i.seq.push(t),i.map[t.id]=t}function xS(i,t,e){const n=i.name,s=n.length;for(oh.lastIndex=0;;){const r=oh.exec(n),a=oh.lastIndex;let o=r[1];const l=r[2]==="]",c=r[3];if(l&&(o=o|0),c===void 0||c==="["&&a+2===s){Id(e,c===void 0?new AS(o,i,t):new mS(o,i,t));break}else{let f=e.map[o];f===void 0&&(f=new gS(o),Id(e,f)),e=f}}}class Do{constructor(t,e){this.seq=[],this.map={};const n=t.getProgramParameter(e,t.ACTIVE_UNIFORMS);for(let a=0;a<n;++a){const o=t.getActiveUniform(e,a),l=t.getUniformLocation(e,o.name);xS(o,l,this)}const s=[],r=[];for(const a of this.seq)a.type===t.SAMPLER_2D_SHADOW||a.type===t.SAMPLER_CUBE_SHADOW||a.type===t.SAMPLER_2D_ARRAY_SHADOW?s.push(a):r.push(a);s.length>0&&(this.seq=s.concat(r))}setValue(t,e,n,s){const r=this.map[e];r!==void 0&&r.setValue(t,n,s)}setOptional(t,e,n){const s=e[n];s!==void 0&&this.setValue(t,n,s)}static upload(t,e,n,s){for(let r=0,a=e.length;r!==a;++r){const o=e[r],l=n[o.id];l.needsUpdate!==!1&&o.setValue(t,l.value,s)}}static seqWithValue(t,e){const n=[];for(let s=0,r=t.length;s!==r;++s){const a=t[s];a.id in e&&n.push(a)}return n}}function Rd(i,t,e){const n=i.createShader(t);return i.shaderSource(n,e),i.compileShader(n),n}const _S=37297;let vS=0;function yS(i,t){const e=i.split(`
`),n=[],s=Math.max(t-6,0),r=Math.min(t+6,e.length);for(let a=s;a<r;a++){const o=a+1;n.push(`${o===t?">":" "} ${o}: ${e[a]}`)}return n.join(`
`)}const Dd=new jt;function MS(i){ae._getMatrix(Dd,ae.workingColorSpace,i);const t=`mat3( ${Dd.elements.map(e=>e.toFixed(4))} )`;switch(ae.getTransfer(i)){case aa:return[t,"LinearTransferOETF"];case pe:return[t,"sRGBTransferOETF"];default:return _t("WebGLProgram: Unsupported color space: ",i),[t,"LinearTransferOETF"]}}function Pd(i,t,e){const n=i.getShaderParameter(t,i.COMPILE_STATUS),r=(i.getShaderInfoLog(t)||"").trim();if(n&&r==="")return"";const a=/ERROR: 0:(\d+)/.exec(r);if(a){const o=parseInt(a[1]);return e.toUpperCase()+`

`+r+`

`+yS(i.getShaderSource(t),o)}else return r}function ES(i,t){const e=MS(t);return[`vec4 ${i}( vec4 value ) {`,`	return ${e[1]}( vec4( value.rgb * ${e[0]}, value.a ) );`,"}"].join(`
`)}const SS={[tu]:"Linear",[eu]:"Reinhard",[nu]:"Cineon",[iu]:"ACESFilmic",[ru]:"AgX",[au]:"Neutral",[su]:"Custom"};function wS(i,t){const e=SS[t];return e===void 0?(_t("WebGLProgram: Unsupported toneMapping:",t),"vec3 "+i+"( vec3 color ) { return LinearToneMapping( color ); }"):"vec3 "+i+"( vec3 color ) { return "+e+"ToneMapping( color ); }"}const wo=new I;function bS(){ae.getLuminanceCoefficients(wo);const i=wo.x.toFixed(4),t=wo.y.toFixed(4),e=wo.z.toFixed(4);return["float luminance( const in vec3 rgb ) {",`	const vec3 weights = vec3( ${i}, ${t}, ${e} );`,"	return dot( weights, rgb );","}"].join(`
`)}function CS(i){return[i.extensionClipCullDistance?"#extension GL_ANGLE_clip_cull_distance : require":"",i.extensionMultiDraw?"#extension GL_ANGLE_multi_draw : require":""].filter(Gr).join(`
`)}function TS(i){const t=[];for(const e in i){const n=i[e];n!==!1&&t.push("#define "+e+" "+n)}return t.join(`
`)}function BS(i,t){const e={},n=i.getProgramParameter(t,i.ACTIVE_ATTRIBUTES);for(let s=0;s<n;s++){const r=i.getActiveAttrib(t,s),a=r.name;let o=1;r.type===i.FLOAT_MAT2&&(o=2),r.type===i.FLOAT_MAT3&&(o=3),r.type===i.FLOAT_MAT4&&(o=4),e[a]={type:r.type,location:i.getAttribLocation(t,a),locationSize:o}}return e}function Gr(i){return i!==""}function Ld(i,t){const e=t.numSpotLightShadows+t.numSpotLightMaps-t.numSpotLightShadowsWithMaps;return i.replace(/NUM_SUN_LIGHTS/g,t.numSunLights).replace(/NUM_DIR_LIGHTS/g,t.numDirLights).replace(/NUM_SPOT_LIGHTS/g,t.numSpotLights).replace(/NUM_SPOT_LIGHT_MAPS/g,t.numSpotLightMaps).replace(/NUM_SPOT_LIGHT_COORDS/g,e).replace(/NUM_RECT_AREA_LIGHTS/g,t.numRectAreaLights).replace(/NUM_POINT_LIGHTS/g,t.numPointLights).replace(/NUM_HEMI_LIGHTS/g,t.numHemiLights).replace(/NUM_SUN_LIGHT_SHADOWS/g,t.numSunLightShadows).replace(/NUM_DIR_LIGHT_SHADOWS/g,t.numDirLightShadows).replace(/NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS/g,t.numSpotLightShadowsWithMaps).replace(/NUM_SPOT_LIGHT_SHADOWS/g,t.numSpotLightShadows).replace(/NUM_POINT_LIGHT_SHADOWS/g,t.numPointLightShadows)}function Fd(i,t){return i.replace(/NUM_CLIPPING_PLANES/g,t.numClippingPlanes).replace(/UNION_CLIPPING_PLANES/g,t.numClippingPlanes-t.numClipIntersection)}const IS=/^[ \t]*#include +<([\w\d./]+)>/gm;function Oh(i){return i.replace(IS,DS)}const RS=new Map;function DS(i,t){let e=ie[t];if(e===void 0){const n=RS.get(t);if(n!==void 0)e=ie[n],_t('WebGLRenderer: Shader chunk "%s" has been deprecated. Use "%s" instead.',t,n);else throw new Error("THREE.WebGLProgram: Can not resolve #include <"+t+">")}return Oh(e)}const PS=/#pragma unroll_loop_start\s+for\s*\(\s*int\s+i\s*=\s*(\d+)\s*;\s*i\s*<\s*(\d+)\s*;\s*i\s*\+\+\s*\)\s*{([\s\S]+?)}\s+#pragma unroll_loop_end/g;function Ud(i){return i.replace(PS,LS)}function LS(i,t,e,n){let s="";for(let r=parseInt(t);r<parseInt(e);r++)s+=n.replace(/\[\s*i\s*\]/g,"[ "+r+" ]").replace(/UNROLLED_LOOP_INDEX/g,r);return s}function Nd(i){let t=`precision ${i.precision} float;
	precision ${i.precision} int;
	precision ${i.precision} sampler2D;
	precision ${i.precision} samplerCube;
	precision ${i.precision} sampler3D;
	precision ${i.precision} sampler2DArray;
	precision ${i.precision} sampler2DShadow;
	precision ${i.precision} samplerCubeShadow;
	precision ${i.precision} sampler2DArrayShadow;
	precision ${i.precision} isampler2D;
	precision ${i.precision} isampler3D;
	precision ${i.precision} isamplerCube;
	precision ${i.precision} isampler2DArray;
	precision ${i.precision} usampler2D;
	precision ${i.precision} usampler3D;
	precision ${i.precision} usamplerCube;
	precision ${i.precision} usampler2DArray;
	`;return i.precision==="highp"?t+=`
#define HIGH_PRECISION`:i.precision==="mediump"?t+=`
#define MEDIUM_PRECISION`:i.precision==="lowp"&&(t+=`
#define LOW_PRECISION`),t}const FS={[kr]:"SHADOWMAP_TYPE_PCF",[Xs]:"SHADOWMAP_TYPE_VSM"};function US(i){return FS[i.shadowMapType]||"SHADOWMAP_TYPE_BASIC"}const NS={[ti]:"ENVMAP_TYPE_CUBE",[Li]:"ENVMAP_TYPE_CUBE",[pr]:"ENVMAP_TYPE_CUBE_UV"};function OS(i){return i.envMap===!1?"ENVMAP_TYPE_CUBE":NS[i.envMapMode]||"ENVMAP_TYPE_CUBE"}const GS={[Li]:"ENVMAP_MODE_REFRACTION"};function kS(i){return i.envMap===!1?"ENVMAP_MODE_REFLECTION":GS[i.envMapMode]||"ENVMAP_MODE_REFLECTION"}const QS={[_a]:"ENVMAP_BLENDING_MULTIPLY",[jp]:"ENVMAP_BLENDING_MIX",[tA]:"ENVMAP_BLENDING_ADD"};function zS(i){return i.envMap===!1?"ENVMAP_BLENDING_NONE":QS[i.combine]||"ENVMAP_BLENDING_NONE"}function HS(i){const t=i.envMapCubeUVHeight;if(t===null)return null;const e=Math.log2(t)-2,n=1/t;return{texelWidth:1/(3*Math.max(Math.pow(2,e),112)),texelHeight:n,maxMip:e}}function VS(i,t,e,n){const s=i.getContext(),r=e.defines;let a=e.vertexShader,o=e.fragmentShader;const l=US(e),c=OS(e),h=kS(e),f=zS(e),u=HS(e),d=CS(e),p=TS(r),g=s.createProgram();let m,A,v=e.glslVersion?"#version "+e.glslVersion+`
`:"";e.isRawShaderMaterial?(m=["#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,p].filter(Gr).join(`
`),m.length>0&&(m+=`
`),A=["#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,p].filter(Gr).join(`
`),A.length>0&&(A+=`
`)):(m=[Nd(e),"#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,p,e.extensionClipCullDistance?"#define USE_CLIP_DISTANCE":"",e.batching?"#define USE_BATCHING":"",e.batchingColor?"#define USE_BATCHING_COLOR":"",e.instancing?"#define USE_INSTANCING":"",e.instancingColor?"#define USE_INSTANCING_COLOR":"",e.instancingMorph?"#define USE_INSTANCING_MORPH":"",e.useFog&&e.fog?"#define USE_FOG":"",e.useFog&&e.fogExp2?"#define FOG_EXP2":"",e.map?"#define USE_MAP":"",e.envMap?"#define USE_ENVMAP":"",e.envMap?"#define "+h:"",e.lightMap?"#define USE_LIGHTMAP":"",e.aoMap?"#define USE_AOMAP":"",e.bumpMap?"#define USE_BUMPMAP":"",e.normalMap?"#define USE_NORMALMAP":"",e.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",e.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",e.displacementMap?"#define USE_DISPLACEMENTMAP":"",e.emissiveMap?"#define USE_EMISSIVEMAP":"",e.anisotropy?"#define USE_ANISOTROPY":"",e.anisotropyMap?"#define USE_ANISOTROPYMAP":"",e.clearcoatMap?"#define USE_CLEARCOATMAP":"",e.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",e.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",e.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",e.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",e.specularMap?"#define USE_SPECULARMAP":"",e.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",e.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",e.roughnessMap?"#define USE_ROUGHNESSMAP":"",e.metalnessMap?"#define USE_METALNESSMAP":"",e.alphaMap?"#define USE_ALPHAMAP":"",e.alphaHash?"#define USE_ALPHAHASH":"",e.transmission?"#define USE_TRANSMISSION":"",e.transmissionMap?"#define USE_TRANSMISSIONMAP":"",e.thicknessMap?"#define USE_THICKNESSMAP":"",e.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",e.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",e.mapUv?"#define MAP_UV "+e.mapUv:"",e.alphaMapUv?"#define ALPHAMAP_UV "+e.alphaMapUv:"",e.lightMapUv?"#define LIGHTMAP_UV "+e.lightMapUv:"",e.aoMapUv?"#define AOMAP_UV "+e.aoMapUv:"",e.emissiveMapUv?"#define EMISSIVEMAP_UV "+e.emissiveMapUv:"",e.bumpMapUv?"#define BUMPMAP_UV "+e.bumpMapUv:"",e.normalMapUv?"#define NORMALMAP_UV "+e.normalMapUv:"",e.displacementMapUv?"#define DISPLACEMENTMAP_UV "+e.displacementMapUv:"",e.metalnessMapUv?"#define METALNESSMAP_UV "+e.metalnessMapUv:"",e.roughnessMapUv?"#define ROUGHNESSMAP_UV "+e.roughnessMapUv:"",e.anisotropyMapUv?"#define ANISOTROPYMAP_UV "+e.anisotropyMapUv:"",e.clearcoatMapUv?"#define CLEARCOATMAP_UV "+e.clearcoatMapUv:"",e.clearcoatNormalMapUv?"#define CLEARCOAT_NORMALMAP_UV "+e.clearcoatNormalMapUv:"",e.clearcoatRoughnessMapUv?"#define CLEARCOAT_ROUGHNESSMAP_UV "+e.clearcoatRoughnessMapUv:"",e.iridescenceMapUv?"#define IRIDESCENCEMAP_UV "+e.iridescenceMapUv:"",e.iridescenceThicknessMapUv?"#define IRIDESCENCE_THICKNESSMAP_UV "+e.iridescenceThicknessMapUv:"",e.sheenColorMapUv?"#define SHEEN_COLORMAP_UV "+e.sheenColorMapUv:"",e.sheenRoughnessMapUv?"#define SHEEN_ROUGHNESSMAP_UV "+e.sheenRoughnessMapUv:"",e.specularMapUv?"#define SPECULARMAP_UV "+e.specularMapUv:"",e.specularColorMapUv?"#define SPECULAR_COLORMAP_UV "+e.specularColorMapUv:"",e.specularIntensityMapUv?"#define SPECULAR_INTENSITYMAP_UV "+e.specularIntensityMapUv:"",e.transmissionMapUv?"#define TRANSMISSIONMAP_UV "+e.transmissionMapUv:"",e.thicknessMapUv?"#define THICKNESSMAP_UV "+e.thicknessMapUv:"",e.vertexTangents&&e.flatShading===!1?"#define USE_TANGENT":"",e.vertexNormals?"#define HAS_NORMAL":"",e.vertexColors?"#define USE_COLOR":"",e.vertexAlphas?"#define USE_COLOR_ALPHA":"",e.vertexUv1s?"#define USE_UV1":"",e.vertexUv2s?"#define USE_UV2":"",e.vertexUv3s?"#define USE_UV3":"",e.pointsUvs?"#define USE_POINTS_UV":"",e.flatShading?"#define FLAT_SHADED":"",e.skinning?"#define USE_SKINNING":"",e.morphTargets?"#define USE_MORPHTARGETS":"",e.morphNormals&&e.flatShading===!1?"#define USE_MORPHNORMALS":"",e.morphColors?"#define USE_MORPHCOLORS":"",e.morphTargetsCount>0?"#define MORPHTARGETS_TEXTURE_STRIDE "+e.morphTextureStride:"",e.morphTargetsCount>0?"#define MORPHTARGETS_COUNT "+e.morphTargetsCount:"",e.doubleSided?"#define DOUBLE_SIDED":"",e.flipSided?"#define FLIP_SIDED":"",e.shadowMapEnabled?"#define USE_SHADOWMAP":"",e.shadowMapEnabled?"#define "+l:"",e.sizeAttenuation?"#define USE_SIZEATTENUATION":"",e.numLightProbes>0?"#define USE_LIGHT_PROBES":"",e.logarithmicDepthBuffer?"#define USE_LOGARITHMIC_DEPTH_BUFFER":"",e.reversedDepthBuffer?"#define USE_REVERSED_DEPTH_BUFFER":"","uniform mat4 modelMatrix;","uniform mat4 modelViewMatrix;","uniform mat4 projectionMatrix;","uniform mat4 viewMatrix;","uniform mat3 normalMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;","#ifdef USE_INSTANCING","	attribute mat4 instanceMatrix;","#endif","#ifdef USE_INSTANCING_COLOR","	attribute vec3 instanceColor;","#endif","#ifdef USE_INSTANCING_MORPH","	uniform sampler2D morphTexture;","#endif","attribute vec3 position;","attribute vec3 normal;","attribute vec2 uv;","#ifdef USE_UV1","	attribute vec2 uv1;","#endif","#ifdef USE_UV2","	attribute vec2 uv2;","#endif","#ifdef USE_UV3","	attribute vec2 uv3;","#endif","#ifdef USE_TANGENT","	attribute vec4 tangent;","#endif","#if defined( USE_COLOR_ALPHA )","	attribute vec4 color;","#elif defined( USE_COLOR )","	attribute vec3 color;","#endif","#ifdef USE_SKINNING","	attribute vec4 skinIndex;","	attribute vec4 skinWeight;","#endif",`
`].filter(Gr).join(`
`),A=[Nd(e),"#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,p,e.useFog&&e.fog?"#define USE_FOG":"",e.useFog&&e.fogExp2?"#define FOG_EXP2":"",e.alphaToCoverage?"#define ALPHA_TO_COVERAGE":"",e.map?"#define USE_MAP":"",e.matcap?"#define USE_MATCAP":"",e.envMap?"#define USE_ENVMAP":"",e.envMap?"#define "+c:"",e.envMap?"#define "+h:"",e.envMap?"#define "+f:"",u?"#define CUBEUV_TEXEL_WIDTH "+u.texelWidth:"",u?"#define CUBEUV_TEXEL_HEIGHT "+u.texelHeight:"",u?"#define CUBEUV_MAX_MIP "+u.maxMip+".0":"",e.lightMap?"#define USE_LIGHTMAP":"",e.aoMap?"#define USE_AOMAP":"",e.bumpMap?"#define USE_BUMPMAP":"",e.normalMap?"#define USE_NORMALMAP":"",e.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",e.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",e.packedNormalMap?"#define USE_PACKED_NORMALMAP":"",e.emissiveMap?"#define USE_EMISSIVEMAP":"",e.anisotropy?"#define USE_ANISOTROPY":"",e.anisotropyMap?"#define USE_ANISOTROPYMAP":"",e.clearcoat?"#define USE_CLEARCOAT":"",e.clearcoatMap?"#define USE_CLEARCOATMAP":"",e.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",e.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",e.dispersion?"#define USE_DISPERSION":"",e.retroreflection?"#define USE_RETROREFLECTION":"",e.iridescence?"#define USE_IRIDESCENCE":"",e.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",e.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",e.specularMap?"#define USE_SPECULARMAP":"",e.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",e.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",e.roughnessMap?"#define USE_ROUGHNESSMAP":"",e.metalnessMap?"#define USE_METALNESSMAP":"",e.alphaMap?"#define USE_ALPHAMAP":"",e.alphaTest?"#define USE_ALPHATEST":"",e.alphaHash?"#define USE_ALPHAHASH":"",e.sheen?"#define USE_SHEEN":"",e.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",e.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",e.transmission?"#define USE_TRANSMISSION":"",e.transmissionMap?"#define USE_TRANSMISSIONMAP":"",e.thicknessMap?"#define USE_THICKNESSMAP":"",e.vertexTangents&&e.flatShading===!1?"#define USE_TANGENT":"",e.vertexColors||e.instancingColor?"#define USE_COLOR":"",e.vertexAlphas||e.batchingColor?"#define USE_COLOR_ALPHA":"",e.vertexUv1s?"#define USE_UV1":"",e.vertexUv2s?"#define USE_UV2":"",e.vertexUv3s?"#define USE_UV3":"",e.pointsUvs?"#define USE_POINTS_UV":"",e.gradientMap?"#define USE_GRADIENTMAP":"",e.flatShading?"#define FLAT_SHADED":"",e.doubleSided?"#define DOUBLE_SIDED":"",e.flipSided?"#define FLIP_SIDED":"",e.shadowMapEnabled?"#define USE_SHADOWMAP":"",e.shadowMapEnabled?"#define "+l:"",e.premultipliedAlpha?"#define PREMULTIPLIED_ALPHA":"",e.numLightProbes>0?"#define USE_LIGHT_PROBES":"",e.numLightProbeGrids>0?"#define USE_LIGHT_PROBES_GRID":"",e.decodeVideoTexture?"#define DECODE_VIDEO_TEXTURE":"",e.decodeVideoTextureEmissive?"#define DECODE_VIDEO_TEXTURE_EMISSIVE":"",e.logarithmicDepthBuffer?"#define USE_LOGARITHMIC_DEPTH_BUFFER":"",e.reversedDepthBuffer?"#define USE_REVERSED_DEPTH_BUFFER":"","uniform mat4 viewMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;",e.toneMapping!==Nn?"#define TONE_MAPPING":"",e.toneMapping!==Nn?ie.tonemapping_pars_fragment:"",e.toneMapping!==Nn?wS("toneMapping",e.toneMapping):"",e.dithering?"#define DITHERING":"",e.opaque?"#define OPAQUE":"",ie.colorspace_pars_fragment,ES("linearToOutputTexel",e.outputColorSpace),bS(),e.useDepthPacking?"#define DEPTH_PACKING "+e.depthPacking:"",`
`].filter(Gr).join(`
`)),a=Oh(a),a=Ld(a,e),a=Fd(a,e),o=Oh(o),o=Ld(o,e),o=Fd(o,e),a=Ud(a),o=Ud(o),e.isRawShaderMaterial!==!0&&(v=`#version 300 es
`,m=[d,"#define attribute in","#define varying out","#define texture2D texture"].join(`
`)+`
`+m,A=["#define varying in",e.glslVersion===Th?"":"layout(location = 0) out highp vec4 pc_fragColor;",e.glslVersion===Th?"":"#define gl_FragColor pc_fragColor","#define gl_FragDepthEXT gl_FragDepth","#define texture2D texture","#define textureCube texture","#define texture2DProj textureProj","#define texture2DLodEXT textureLod","#define texture2DProjLodEXT textureProjLod","#define textureCubeLodEXT textureLod","#define texture2DGradEXT textureGrad","#define texture2DProjGradEXT textureProjGrad","#define textureCubeGradEXT textureGrad"].join(`
`)+`
`+A);const M=v+m+a,x=v+A+o,S=Rd(s,s.VERTEX_SHADER,M),E=Rd(s,s.FRAGMENT_SHADER,x);s.attachShader(g,S),s.attachShader(g,E),e.index0AttributeName!==void 0?s.bindAttribLocation(g,0,e.index0AttributeName):e.hasPositionAttribute===!0&&s.bindAttribLocation(g,0,"position"),s.linkProgram(g);function C(P){if(i.debug.checkShaderErrors){const U=s.getProgramInfoLog(g)||"",k=s.getShaderInfoLog(S)||"",L=s.getShaderInfoLog(E)||"",O=U.trim(),q=k.trim(),Y=L.trim();let at=!0,Q=!0;if(s.getProgramParameter(g,s.LINK_STATUS)===!1)if(at=!1,typeof i.debug.onShaderError=="function")i.debug.onShaderError(s,g,S,E);else{const $=Pd(s,S,"vertex"),st=Pd(s,E,"fragment");Ht("WebGLProgram: Shader Error "+s.getError()+" - VALIDATE_STATUS "+s.getProgramParameter(g,s.VALIDATE_STATUS)+`

Material Name: `+P.name+`
Material Type: `+P.type+`

Program Info Log: `+O+`
`+$+`
`+st)}else O!==""?_t("WebGLProgram: Program Info Log:",O):(q===""||Y==="")&&(Q=!1);Q&&(P.diagnostics={runnable:at,programLog:O,vertexShader:{log:q,prefix:m},fragmentShader:{log:Y,prefix:A}})}s.deleteShader(S),s.deleteShader(E),_=new Do(s,g),b=BS(s,g)}let _;this.getUniforms=function(){return _===void 0&&C(this),_};let b;this.getAttributes=function(){return b===void 0&&C(this),b};let B=e.rendererExtensionParallelShaderCompile===!1;return this.isReady=function(){return B===!1&&(B=s.getProgramParameter(g,_S)),B},this.destroy=function(){n.releaseStatesOfProgram(this),s.deleteProgram(g),this.program=void 0},this.type=e.shaderType,this.name=e.shaderName,this.id=vS++,this.cacheKey=t,this.usedTimes=1,this.program=g,this.vertexShader=S,this.fragmentShader=E,this}let WS=0;class YS{constructor(){this.shaderCache=new Map,this.materialCache=new Map}update(t,e,n){const s=this._getShaderCacheForMaterial(t);return s.has(e)===!1&&(s.add(e),e.usedTimes++),s.has(n)===!1&&(s.add(n),n.usedTimes++),this}remove(t){const e=this.materialCache.get(t);for(const n of e)n.usedTimes--,n.usedTimes===0&&this.shaderCache.delete(n.code);return this.materialCache.delete(t),this}getVertexShaderStage(t){return this._getShaderStage(t.vertexShader)}getFragmentShaderStage(t){return this._getShaderStage(t.fragmentShader)}dispose(){this.shaderCache.clear(),this.materialCache.clear()}_getShaderCacheForMaterial(t){const e=this.materialCache;let n=e.get(t);return n===void 0&&(n=new Set,e.set(t,n)),n}_getShaderStage(t){const e=this.shaderCache;let n=e.get(t);return n===void 0&&(n=new XS(t),e.set(t,n)),n}}class XS{constructor(t){this.id=WS++,this.code=t,this.usedTimes=0}}function qS(i){return i===Fi||i===ea||i===na}function KS(i,t,e,n,s,r){const a=new Wl,o=new YS,l=new Set,c=[],h=new Map,f=n.logarithmicDepthBuffer;let u=n.precision;const d={MeshDepthMaterial:"depth",MeshDistanceMaterial:"distance",MeshNormalMaterial:"normal",MeshBasicMaterial:"basic",MeshLambertMaterial:"lambert",MeshPhongMaterial:"phong",MeshToonMaterial:"toon",MeshStandardMaterial:"physical",MeshPhysicalMaterial:"physical",MeshMatcapMaterial:"matcap",LineBasicMaterial:"basic",LineDashedMaterial:"dashed",PointsMaterial:"points",ShadowMaterial:"shadow",SpriteMaterial:"sprite"};function p(_){return l.add(_),_===0?"uv":`uv${_}`}function g(_,b,B,P,U,k){const L=P.fog,O=U.geometry,q=_.isMeshStandardMaterial||_.isMeshLambertMaterial||_.isMeshPhongMaterial?P.environment:null,Y=_.isMeshStandardMaterial||_.isMeshLambertMaterial&&!_.envMap||_.isMeshPhongMaterial&&!_.envMap,at=t.get(_.envMap||q,Y),Q=at&&at.mapping===pr?at.image.height:null,$=d[_.type];_.precision!==null&&(u=n.getMaxPrecision(_.precision),u!==_.precision&&_t("WebGLProgram.getParameters:",_.precision,"not supported, using",u,"instead."));const st=O.morphAttributes.position||O.morphAttributes.normal||O.morphAttributes.color,Ut=st!==void 0?st.length:0;let Tt=0;O.morphAttributes.position!==void 0&&(Tt=1),O.morphAttributes.normal!==void 0&&(Tt=2),O.morphAttributes.color!==void 0&&(Tt=3);let oe,Zt,Vt,K;if($){const ue=Ln[$];oe=ue.vertexShader,Zt=ue.fragmentShader}else{oe=_.vertexShader,Zt=_.fragmentShader;const ue=o.getVertexShaderStage(_),ne=o.getFragmentShaderStage(_);o.update(_,ue,ne),Vt=ue.id,K=ne.id}const z=i.getRenderTarget(),nt=i.state.buffers.depth.getReversed(),gt=U.isInstancedMesh===!0,ct=U.isBatchedMesh===!0,Et=!!_.map,Wt=!!_.matcap,Z=!!at,ot=!!_.aoMap,j=!!_.lightMap,rt=!!_.bumpMap&&_.wireframe===!1,ut=!!_.normalMap,Bt=!!_.displacementMap,vt=!!_.emissiveMap,Qt=!!_.metalnessMap,Yt=!!_.roughnessMap,D=_.anisotropy>0,Jt=_.clearcoat>0,Dt=_.dispersion>0,T=_.retroreflectivity>0,y=_.iridescence>0,G=_.sheen>0,R=_.transmission>0,J=D&&!!_.anisotropyMap,ft=Jt&&!!_.clearcoatMap,pt=Jt&&!!_.clearcoatNormalMap,W=Jt&&!!_.clearcoatRoughnessMap,et=y&&!!_.iridescenceMap,At=y&&!!_.iridescenceThicknessMap,Gt=G&&!!_.sheenColorMap,yt=G&&!!_.sheenRoughnessMap,mt=!!_.specularMap,It=!!_.specularColorMap,kt=!!_.specularIntensityMap,qt=R&&!!_.transmissionMap,F=R&&!!_.thicknessMap,dt=!!_.gradientMap,tt=!!_.alphaMap,xt=_.alphaTest>0,ht=!!_.alphaHash,it=!!_.extensions;let Ct=Nn;_.toneMapped&&(z===null||z.isXRRenderTarget===!0)&&(Ct=i.toneMapping);const Pt={shaderID:$,shaderType:_.type,shaderName:_.name,vertexShader:oe,fragmentShader:Zt,defines:_.defines,customVertexShaderID:Vt,customFragmentShaderID:K,isRawShaderMaterial:_.isRawShaderMaterial===!0,glslVersion:_.glslVersion,precision:u,batching:ct,batchingColor:ct&&U._colorsTexture!==null,instancing:gt,instancingColor:gt&&U.instanceColor!==null,instancingMorph:gt&&U.morphTexture!==null,outputColorSpace:z===null?i.outputColorSpace:z.isXRRenderTarget===!0?z.texture.colorSpace:ae.workingColorSpace,alphaToCoverage:!!_.alphaToCoverage,map:Et,matcap:Wt,envMap:Z,envMapMode:Z&&at.mapping,envMapCubeUVHeight:Q,aoMap:ot,lightMap:j,bumpMap:rt,normalMap:ut,displacementMap:Bt,emissiveMap:vt,normalMapObjectSpace:ut&&_.normalMapType===aA,normalMapTangentSpace:ut&&_.normalMapType===mi,packedNormalMap:ut&&_.normalMapType===mi&&qS(_.normalMap.format),metalnessMap:Qt,roughnessMap:Yt,anisotropy:D,anisotropyMap:J,clearcoat:Jt,clearcoatMap:ft,clearcoatNormalMap:pt,clearcoatRoughnessMap:W,dispersion:Dt,retroreflection:T,iridescence:y,iridescenceMap:et,iridescenceThicknessMap:At,sheen:G,sheenColorMap:Gt,sheenRoughnessMap:yt,specularMap:mt,specularColorMap:It,specularIntensityMap:kt,transmission:R,transmissionMap:qt,thicknessMap:F,gradientMap:dt,opaque:_.transparent===!1&&_.blending===tr&&_.alphaToCoverage===!1,alphaMap:tt,alphaTest:xt,alphaHash:ht,combine:_.combine,mapUv:Et&&p(_.map.channel),aoMapUv:ot&&p(_.aoMap.channel),lightMapUv:j&&p(_.lightMap.channel),bumpMapUv:rt&&p(_.bumpMap.channel),normalMapUv:ut&&p(_.normalMap.channel),displacementMapUv:Bt&&p(_.displacementMap.channel),emissiveMapUv:vt&&p(_.emissiveMap.channel),metalnessMapUv:Qt&&p(_.metalnessMap.channel),roughnessMapUv:Yt&&p(_.roughnessMap.channel),anisotropyMapUv:J&&p(_.anisotropyMap.channel),clearcoatMapUv:ft&&p(_.clearcoatMap.channel),clearcoatNormalMapUv:pt&&p(_.clearcoatNormalMap.channel),clearcoatRoughnessMapUv:W&&p(_.clearcoatRoughnessMap.channel),iridescenceMapUv:et&&p(_.iridescenceMap.channel),iridescenceThicknessMapUv:At&&p(_.iridescenceThicknessMap.channel),sheenColorMapUv:Gt&&p(_.sheenColorMap.channel),sheenRoughnessMapUv:yt&&p(_.sheenRoughnessMap.channel),specularMapUv:mt&&p(_.specularMap.channel),specularColorMapUv:It&&p(_.specularColorMap.channel),specularIntensityMapUv:kt&&p(_.specularIntensityMap.channel),transmissionMapUv:qt&&p(_.transmissionMap.channel),thicknessMapUv:F&&p(_.thicknessMap.channel),alphaMapUv:tt&&p(_.alphaMap.channel),vertexTangents:!!O.attributes.tangent&&(ut||D),vertexNormals:!!O.attributes.normal,vertexColors:_.vertexColors,vertexAlphas:_.vertexColors===!0&&!!O.attributes.color&&O.attributes.color.itemSize===4,pointsUvs:U.isPoints===!0&&!!O.attributes.uv&&(Et||tt),fog:!!L,useFog:_.fog===!0,fogExp2:!!L&&L.isFogExp2,flatShading:_.wireframe===!1&&(_.flatShading===!0||O.attributes.normal===void 0&&ut===!1&&(_.isMeshLambertMaterial||_.isMeshPhongMaterial||_.isMeshStandardMaterial||_.isMeshPhysicalMaterial)),sizeAttenuation:_.sizeAttenuation===!0,logarithmicDepthBuffer:f,reversedDepthBuffer:nt,skinning:U.isSkinnedMesh===!0,hasPositionAttribute:O.attributes.position!==void 0,morphTargets:O.morphAttributes.position!==void 0,morphNormals:O.morphAttributes.normal!==void 0,morphColors:O.morphAttributes.color!==void 0,morphTargetsCount:Ut,morphTextureStride:Tt,numSunLights:b.sun.length,numDirLights:b.directional.length,numPointLights:b.point.length,numSpotLights:b.spot.length,numSpotLightMaps:b.spotLightMap.length,numRectAreaLights:b.rectArea.length,numHemiLights:b.hemi.length,numSunLightShadows:b.sunShadowMap.length,numDirLightShadows:b.directionalShadowMap.length,numPointLightShadows:b.pointShadowMap.length,numSpotLightShadows:b.spotShadowMap.length,numSpotLightShadowsWithMaps:b.numSpotLightShadowsWithMaps,numLightProbes:b.numLightProbes,numLightProbeGrids:k.length,numClippingPlanes:r.numPlanes,numClipIntersection:r.numIntersection,dithering:_.dithering,shadowMapEnabled:i.shadowMap.enabled&&B.length>0,shadowMapType:i.shadowMap.type,toneMapping:Ct,decodeVideoTexture:Et&&_.map.isVideoTexture===!0&&ae.getTransfer(_.map.colorSpace)===pe,decodeVideoTextureEmissive:vt&&_.emissiveMap.isVideoTexture===!0&&ae.getTransfer(_.emissiveMap.colorSpace)===pe,premultipliedAlpha:_.premultipliedAlpha,doubleSided:_.side===Fn,flipSided:_.side===an,useDepthPacking:_.depthPacking>=0,depthPacking:_.depthPacking||0,index0AttributeName:_.index0AttributeName,extensionClipCullDistance:it&&_.extensions.clipCullDistance===!0&&e.has("WEBGL_clip_cull_distance"),extensionMultiDraw:(it&&_.extensions.multiDraw===!0||ct)&&e.has("WEBGL_multi_draw"),rendererExtensionParallelShaderCompile:e.has("KHR_parallel_shader_compile"),customProgramCacheKey:_.customProgramCacheKey()};return Pt.vertexUv1s=l.has(1),Pt.vertexUv2s=l.has(2),Pt.vertexUv3s=l.has(3),l.clear(),Pt}function m(_){const b=[];if(_.shaderID?b.push(_.shaderID):(b.push(_.customVertexShaderID),b.push(_.customFragmentShaderID)),_.defines!==void 0)for(const B in _.defines)b.push(B),b.push(_.defines[B]);return _.isRawShaderMaterial===!1&&(A(b,_),v(b,_),b.push(i.outputColorSpace)),b.push(_.customProgramCacheKey),b.join()}function A(_,b){_.push(b.precision),_.push(b.outputColorSpace),_.push(b.envMapMode),_.push(b.envMapCubeUVHeight),_.push(b.mapUv),_.push(b.alphaMapUv),_.push(b.lightMapUv),_.push(b.aoMapUv),_.push(b.bumpMapUv),_.push(b.normalMapUv),_.push(b.displacementMapUv),_.push(b.emissiveMapUv),_.push(b.metalnessMapUv),_.push(b.roughnessMapUv),_.push(b.anisotropyMapUv),_.push(b.clearcoatMapUv),_.push(b.clearcoatNormalMapUv),_.push(b.clearcoatRoughnessMapUv),_.push(b.iridescenceMapUv),_.push(b.iridescenceThicknessMapUv),_.push(b.sheenColorMapUv),_.push(b.sheenRoughnessMapUv),_.push(b.specularMapUv),_.push(b.specularColorMapUv),_.push(b.specularIntensityMapUv),_.push(b.transmissionMapUv),_.push(b.thicknessMapUv),_.push(b.combine),_.push(b.fogExp2),_.push(b.sizeAttenuation),_.push(b.morphTargetsCount),_.push(b.morphAttributeCount),_.push(b.numSunLights),_.push(b.numDirLights),_.push(b.numPointLights),_.push(b.numSpotLights),_.push(b.numSpotLightMaps),_.push(b.numHemiLights),_.push(b.numRectAreaLights),_.push(b.numSunLightShadows),_.push(b.numDirLightShadows),_.push(b.numPointLightShadows),_.push(b.numSpotLightShadows),_.push(b.numSpotLightShadowsWithMaps),_.push(b.numLightProbes),_.push(b.shadowMapType),_.push(b.toneMapping),_.push(b.numClippingPlanes),_.push(b.numClipIntersection),_.push(b.depthPacking)}function v(_,b){a.disableAll(),b.instancing&&a.enable(0),b.instancingColor&&a.enable(1),b.instancingMorph&&a.enable(2),b.matcap&&a.enable(3),b.envMap&&a.enable(4),b.normalMapObjectSpace&&a.enable(5),b.normalMapTangentSpace&&a.enable(6),b.clearcoat&&a.enable(7),b.iridescence&&a.enable(8),b.alphaTest&&a.enable(9),b.vertexColors&&a.enable(10),b.vertexAlphas&&a.enable(11),b.vertexUv1s&&a.enable(12),b.vertexUv2s&&a.enable(13),b.vertexUv3s&&a.enable(14),b.vertexTangents&&a.enable(15),b.anisotropy&&a.enable(16),b.alphaHash&&a.enable(17),b.batching&&a.enable(18),b.dispersion&&a.enable(19),b.retroreflection&&a.enable(24),b.batchingColor&&a.enable(20),b.gradientMap&&a.enable(21),b.packedNormalMap&&a.enable(22),b.vertexNormals&&a.enable(23),_.push(a.mask),a.disableAll(),b.fog&&a.enable(0),b.useFog&&a.enable(1),b.flatShading&&a.enable(2),b.logarithmicDepthBuffer&&a.enable(3),b.reversedDepthBuffer&&a.enable(4),b.skinning&&a.enable(5),b.morphTargets&&a.enable(6),b.morphNormals&&a.enable(7),b.morphColors&&a.enable(8),b.premultipliedAlpha&&a.enable(9),b.shadowMapEnabled&&a.enable(10),b.doubleSided&&a.enable(11),b.flipSided&&a.enable(12),b.useDepthPacking&&a.enable(13),b.dithering&&a.enable(14),b.transmission&&a.enable(15),b.sheen&&a.enable(16),b.opaque&&a.enable(17),b.pointsUvs&&a.enable(18),b.decodeVideoTexture&&a.enable(19),b.decodeVideoTextureEmissive&&a.enable(20),b.alphaToCoverage&&a.enable(21),b.numLightProbeGrids>0&&a.enable(22),b.hasPositionAttribute&&a.enable(23),_.push(a.mask)}function M(_){const b=d[_.type];let B;if(b){const P=Ln[b];B=HA.clone(P.uniforms)}else B=_.uniforms;return B}function x(_,b){let B=h.get(b);return B!==void 0?++B.usedTimes:(B=new VS(i,b,_,s),c.push(B),h.set(b,B)),B}function S(_){if(--_.usedTimes===0){const b=c.indexOf(_);c[b]=c[c.length-1],c.pop(),h.delete(_.cacheKey),_.destroy()}}function E(_){o.remove(_)}function C(){o.dispose()}return{getParameters:g,getProgramCacheKey:m,getUniforms:M,acquireProgram:x,releaseProgram:S,releaseShaderCache:E,programs:c,dispose:C}}function JS(){let i=new WeakMap;function t(a){return i.has(a)}function e(a){let o=i.get(a);return o===void 0&&(o={},i.set(a,o)),o}function n(a){i.delete(a)}function s(a,o,l){i.get(a)[o]=l}function r(){i=new WeakMap}return{has:t,get:e,remove:n,update:s,dispose:r}}function ZS(i,t){return i.groupOrder!==t.groupOrder?i.groupOrder-t.groupOrder:i.renderOrder!==t.renderOrder?i.renderOrder-t.renderOrder:i.material.id!==t.material.id?i.material.id-t.material.id:i.materialVariant!==t.materialVariant?i.materialVariant-t.materialVariant:i.z!==t.z?i.z-t.z:i.id-t.id}function Od(i,t){return i.groupOrder!==t.groupOrder?i.groupOrder-t.groupOrder:i.renderOrder!==t.renderOrder?i.renderOrder-t.renderOrder:i.z!==t.z?t.z-i.z:i.id-t.id}function Gd(){const i=[];let t=0;const e=[],n=[],s=[];function r(){t=0,e.length=0,n.length=0,s.length=0}function a(u){let d=0;return u.isInstancedMesh&&(d+=2),u.isSkinnedMesh&&(d+=1),d}function o(u,d,p,g,m,A){let v=i[t];return v===void 0?(v={id:u.id,object:u,geometry:d,material:p,materialVariant:a(u),groupOrder:g,renderOrder:u.renderOrder,z:m,group:A},i[t]=v):(v.id=u.id,v.object=u,v.geometry=d,v.material=p,v.materialVariant=a(u),v.groupOrder=g,v.renderOrder=u.renderOrder,v.z=m,v.group=A),t++,v}function l(u,d,p,g,m,A,v){v.reversedDepth===!0&&(m=-m);const M=o(u,d,p,g,m,A);p.transmission>0?n.push(M):p.transparent===!0?s.push(M):e.push(M)}function c(u,d,p,g,m,A){const v=o(u,d,p,g,m,A);p.transmission>0?n.unshift(v):p.transparent===!0?s.unshift(v):e.unshift(v)}function h(u,d){e.length>1&&e.sort(u||ZS),n.length>1&&n.sort(d||Od),s.length>1&&s.sort(d||Od)}function f(){for(let u=t,d=i.length;u<d;u++){const p=i[u];if(p.id===null)break;p.id=null,p.object=null,p.geometry=null,p.material=null,p.group=null}}return{opaque:e,transmissive:n,transparent:s,init:r,push:l,unshift:c,finish:f,sort:h}}function $S(){let i=new WeakMap;function t(n,s){const r=i.get(n);let a;return r===void 0?(a=new Gd,i.set(n,[a])):s>=r.length?(a=new Gd,r.push(a)):a=r[s],a}function e(){i=new WeakMap}return{get:t,dispose:e}}function jS(){const i={};return{get:function(t){if(i[t.id]!==void 0)return i[t.id];let e;switch(t.type){case"SunLight":case"DirectionalLight":e={direction:new I,color:new bt};break;case"SpotLight":e={position:new I,direction:new I,color:new bt,distance:0,coneCos:0,penumbraCos:0,decay:0};break;case"PointLight":e={position:new I,color:new bt,distance:0,decay:0};break;case"HemisphereLight":e={direction:new I,skyColor:new bt,groundColor:new bt};break;case"RectAreaLight":e={color:new bt,position:new I,halfWidth:new I,halfHeight:new I};break}return i[t.id]=e,e}}}function tw(){const i={};return{get:function(t){if(i[t.id]!==void 0)return i[t.id];let e;switch(t.type){case"SunLight":case"DirectionalLight":e={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new lt};break;case"SpotLight":e={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new lt};break;case"PointLight":e={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new lt,shadowCameraNear:1,shadowCameraFar:1e3};break}return i[t.id]=e,e}}}let ew=0;function nw(i,t){return(t.castShadow?2:0)-(i.castShadow?2:0)+(t.map?1:0)-(i.map?1:0)}function iw(i){const t=new jS,e=tw(),n={version:0,hash:{sunLength:-1,directionalLength:-1,pointLength:-1,spotLength:-1,rectAreaLength:-1,hemiLength:-1,numSunShadows:-1,numDirectionalShadows:-1,numPointShadows:-1,numSpotShadows:-1,numSpotMaps:-1,numLightProbes:-1},ambient:[0,0,0],probe:[],sun:[],sunShadow:[],sunShadowMap:[],sunShadowMatrix:[],sunShadowCascade:[],directional:[],directionalShadow:[],directionalShadowMap:[],directionalShadowMatrix:[],spot:[],spotLightMap:[],spotShadow:[],spotShadowMap:[],spotLightMatrix:[],rectArea:[],rectAreaLTC1:null,rectAreaLTC2:null,point:[],pointShadow:[],pointShadowMap:[],pointShadowMatrix:[],hemi:[],numSpotLightShadowsWithMaps:0,numLightProbes:0};for(let c=0;c<9;c++)n.probe.push(new I);const s=new I,r=new Kt,a=new Kt;function o(c){let h=0,f=0,u=0;for(let U=0;U<9;U++)n.probe[U].set(0,0,0);let d=0,p=0,g=0,m=0,A=0,v=0,M=0,x=0,S=0,E=0,C=0,_=0,b=0,B=0;c.sort(nw);for(let U=0,k=c.length;U<k;U++){const L=c[U],O=L.color,q=L.intensity,Y=L.distance;let at=null;if(L.shadow&&L.shadow.map&&(L.shadow.map.texture.format===Fi?at=L.shadow.map.texture:at=L.shadow.map.depthTexture||L.shadow.map.texture),L.isAmbientLight)h+=O.r*q,f+=O.g*q,u+=O.b*q;else if(L.isLightProbe){for(let Q=0;Q<9;Q++)n.probe[Q].addScaledVector(L.sh.coefficients[Q],q);B++}else if(L.isSunLight){const Q=t.get(L);if(Q.color.copy(L.color).multiplyScalar(L.intensity),L.castShadow){const $=L.shadow,st=e.get(L);st.shadowIntensity=$.intensity,st.shadowBias=$.bias,st.shadowNormalBias=$.normalBias,st.shadowRadius=$.radius,st.shadowMapSize.copy($.mapSize).multiply($.getFrameExtents()),n.sunShadow[p]=st,n.sunShadowMap[p]=at;const Ut=$.getViewportCount();for(let Tt=0;Tt<Ut;Tt++)n.sunShadowMatrix[g+Tt]=$.getMatrix(Tt),n.sunShadowCascade[g+Tt]=$._cascadeData[Tt];g+=Ut,p++}n.sun[d]=Q,d++}else if(L.isDirectionalLight){const Q=t.get(L);if(Q.color.copy(L.color).multiplyScalar(L.intensity),L.castShadow){const $=L.shadow,st=e.get(L);st.shadowIntensity=$.intensity,st.shadowBias=$.bias,st.shadowNormalBias=$.normalBias,st.shadowRadius=$.radius,st.shadowMapSize=$.mapSize,n.directionalShadow[m]=st,n.directionalShadowMap[m]=at,n.directionalShadowMatrix[m]=L.shadow.matrix,S++}n.directional[m]=Q,m++}else if(L.isSpotLight){const Q=t.get(L);Q.position.setFromMatrixPosition(L.matrixWorld),Q.color.copy(O).multiplyScalar(q),Q.distance=Y,Q.coneCos=Math.cos(L.angle),Q.penumbraCos=Math.cos(L.angle*(1-L.penumbra)),Q.decay=L.decay,n.spot[v]=Q;const $=L.shadow;if(L.map&&(n.spotLightMap[_]=L.map,_++,$.updateMatrices(L),L.castShadow&&b++),n.spotLightMatrix[v]=$.matrix,L.castShadow){const st=e.get(L);st.shadowIntensity=$.intensity,st.shadowBias=$.bias,st.shadowNormalBias=$.normalBias,st.shadowRadius=$.radius,st.shadowMapSize=$.mapSize,n.spotShadow[v]=st,n.spotShadowMap[v]=at,C++}v++}else if(L.isRectAreaLight){const Q=t.get(L);Q.color.copy(O).multiplyScalar(q),Q.halfWidth.set(L.width*.5,0,0),Q.halfHeight.set(0,L.height*.5,0),n.rectArea[M]=Q,M++}else if(L.isPointLight){const Q=t.get(L);if(Q.color.copy(L.color).multiplyScalar(L.intensity),Q.distance=L.distance,Q.decay=L.decay,L.castShadow){const $=L.shadow,st=e.get(L);st.shadowIntensity=$.intensity,st.shadowBias=$.bias,st.shadowNormalBias=$.normalBias,st.shadowRadius=$.radius,st.shadowMapSize=$.mapSize,st.shadowCameraNear=$.camera.near,st.shadowCameraFar=$.camera.far,n.pointShadow[A]=st,n.pointShadowMap[A]=at,n.pointShadowMatrix[A]=L.shadow.matrix,E++}n.point[A]=Q,A++}else if(L.isHemisphereLight){const Q=t.get(L);Q.skyColor.copy(L.color).multiplyScalar(q),Q.groundColor.copy(L.groundColor).multiplyScalar(q),n.hemi[x]=Q,x++}}M>0&&(i.has("OES_texture_float_linear")===!0?(n.rectAreaLTC1=Mt.LTC_FLOAT_1,n.rectAreaLTC2=Mt.LTC_FLOAT_2):(n.rectAreaLTC1=Mt.LTC_HALF_1,n.rectAreaLTC2=Mt.LTC_HALF_2)),n.ambient[0]=h,n.ambient[1]=f,n.ambient[2]=u;const P=n.hash;(P.sunLength!==d||P.directionalLength!==m||P.pointLength!==A||P.spotLength!==v||P.rectAreaLength!==M||P.hemiLength!==x||P.numSunShadows!==p||P.numDirectionalShadows!==S||P.numPointShadows!==E||P.numSpotShadows!==C||P.numSpotMaps!==_||P.numLightProbes!==B)&&(n.sun.length=d,n.directional.length=m,n.spot.length=v,n.rectArea.length=M,n.point.length=A,n.hemi.length=x,n.sunShadow.length=p,n.sunShadowMap.length=p,n.sunShadowMatrix.length=g,n.sunShadowCascade.length=g,n.directionalShadow.length=S,n.directionalShadowMap.length=S,n.directionalShadowMatrix.length=S,n.pointShadow.length=E,n.pointShadowMap.length=E,n.pointShadowMatrix.length=E,n.spotShadow.length=C,n.spotShadowMap.length=C,n.spotLightMatrix.length=C+_-b,n.spotLightMap.length=_,n.numSpotLightShadowsWithMaps=b,n.numLightProbes=B,P.sunLength=d,P.directionalLength=m,P.pointLength=A,P.spotLength=v,P.rectAreaLength=M,P.hemiLength=x,P.numSunShadows=p,P.numDirectionalShadows=S,P.numPointShadows=E,P.numSpotShadows=C,P.numSpotMaps=_,P.numLightProbes=B,n.version=ew++)}function l(c,h){let f=0,u=0,d=0,p=0,g=0,m=0;const A=h.matrixWorldInverse;for(let v=0,M=c.length;v<M;v++){const x=c[v];if(x.isSunLight){const S=n.sun[f];S.direction.setFromMatrixPosition(x.matrixWorld),S.direction.transformDirection(A),f++}else if(x.isDirectionalLight){const S=n.directional[u];S.direction.setFromMatrixPosition(x.matrixWorld),s.setFromMatrixPosition(x.target.matrixWorld),S.direction.sub(s),S.direction.transformDirection(A),u++}else if(x.isSpotLight){const S=n.spot[p];S.position.setFromMatrixPosition(x.matrixWorld),S.position.applyMatrix4(A),S.direction.setFromMatrixPosition(x.matrixWorld),s.setFromMatrixPosition(x.target.matrixWorld),S.direction.sub(s),S.direction.transformDirection(A),p++}else if(x.isRectAreaLight){const S=n.rectArea[g];S.position.setFromMatrixPosition(x.matrixWorld),S.position.applyMatrix4(A),a.identity(),r.copy(x.matrixWorld),r.premultiply(A),a.extractRotation(r),S.halfWidth.set(x.width*.5,0,0),S.halfHeight.set(0,x.height*.5,0),S.halfWidth.applyMatrix4(a),S.halfHeight.applyMatrix4(a),g++}else if(x.isPointLight){const S=n.point[d];S.position.setFromMatrixPosition(x.matrixWorld),S.position.applyMatrix4(A),d++}else if(x.isHemisphereLight){const S=n.hemi[m];S.direction.setFromMatrixPosition(x.matrixWorld),S.direction.transformDirection(A),m++}}}return{setup:o,setupView:l,state:n}}function kd(i){const t=new iw(i),e=[],n=[],s=[];function r(u){f.camera=u,e.length=0,n.length=0,s.length=0}function a(u){e.push(u)}function o(u){n.push(u)}function l(u){s.push(u)}function c(){t.setup(e)}function h(u){t.setupView(e,u)}const f={lightsArray:e,shadowsArray:n,lightProbeGridArray:s,camera:null,lights:t,transmissionRenderTarget:{},textureUnits:0};return{init:r,state:f,setupLights:c,setupLightsView:h,pushLight:a,pushShadow:o,pushLightProbeGrid:l}}function sw(i){let t=new WeakMap;function e(s,r=0){const a=t.get(s);let o;return a===void 0?(o=new kd(i),t.set(s,[o])):r>=a.length?(o=new kd(i),a.push(o)):o=a[r],o}function n(){t=new WeakMap}return{get:e,dispose:n}}const rw=`void main() {
	gl_Position = vec4( position, 1.0 );
}`,aw=`uniform sampler2D shadow_pass;
uniform vec2 resolution;
uniform float radius;
void main() {
	const float samples = float( VSM_SAMPLES );
	float mean = 0.0;
	float squared_mean = 0.0;
	float uvStride = samples <= 1.0 ? 0.0 : 2.0 / ( samples - 1.0 );
	float uvStart = samples <= 1.0 ? 0.0 : - 1.0;
	for ( float i = 0.0; i < samples; i ++ ) {
		float uvOffset = uvStart + i * uvStride;
		#ifdef HORIZONTAL_PASS
			vec2 distribution = texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( uvOffset, 0.0 ) * radius ) / resolution ).rg;
			mean += distribution.x;
			squared_mean += distribution.y * distribution.y + distribution.x * distribution.x;
		#else
			float depth = texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( 0.0, uvOffset ) * radius ) / resolution ).r;
			mean += depth;
			squared_mean += depth * depth;
		#endif
	}
	mean = mean / samples;
	squared_mean = squared_mean / samples;
	float std_dev = sqrt( max( 0.0, squared_mean - mean * mean ) );
	gl_FragColor = vec4( mean, std_dev, 0.0, 1.0 );
}`,ow=[new I(1,0,0),new I(-1,0,0),new I(0,1,0),new I(0,-1,0),new I(0,0,1),new I(0,0,-1)],lw=[new I(0,-1,0),new I(0,-1,0),new I(0,0,1),new I(0,0,-1),new I(0,-1,0),new I(0,-1,0)],Qd=new Kt,Lr=new I,lh=new I;function cw(i,t,e){let n=new ds;const s=new lt,r=new lt,a=new Ae,o=new Ru,l=new Du,c={},h=e.maxTextureSize,f={[Pi]:an,[an]:Pi,[Fn]:Fn},u=new Sn({defines:{VSM_SAMPLES:8},uniforms:{shadow_pass:{value:null},resolution:{value:new lt},radius:{value:4}},vertexShader:rw,fragmentShader:aw}),d=u.clone();d.defines.HORIZONTAL_PASS=1;const p=new $t;p.setAttribute("position",new fe(new Float32Array([-1,-1,.5,3,-1,.5,-1,3,.5]),3));const g=new Ce(p,u),m=this;this.enabled=!1,this.autoUpdate=!0,this.needsUpdate=!1,this.type=kr;let A=this.type;this.render=function(E,C,_){if(m.enabled===!1||m.autoUpdate===!1&&m.needsUpdate===!1||E.length===0)return;this.type===Lp&&(_t("WebGLShadowMap: PCFSoftShadowMap has been removed. Using PCFShadowMap instead."),this.type=kr);const b=i.getRenderTarget(),B=i.getActiveCubeFace(),P=i.getActiveMipmapLevel(),U=i.state;U.setBlending(jn),U.buffers.depth.getReversed()===!0?U.buffers.color.setClear(0,0,0,0):U.buffers.color.setClear(1,1,1,1),U.buffers.depth.setTest(!0),U.setScissorTest(!1);const k=A!==this.type;k&&C.traverse(function(L){L.material&&(Array.isArray(L.material)?L.material.forEach(O=>O.needsUpdate=!0):L.material.needsUpdate=!0)});for(let L=0,O=E.length;L<O;L++){const q=E[L],Y=q.shadow;if(Y===void 0){_t("WebGLShadowMap:",q,"has no shadow.");continue}if(Y.autoUpdate===!1&&Y.needsUpdate===!1)continue;s.copy(Y.mapSize);const at=Y.getFrameExtents();s.multiply(at),r.copy(Y.mapSize),(s.x>h||s.y>h)&&(s.x>h&&(r.x=Math.floor(h/at.x),s.x=r.x*at.x,Y.mapSize.x=r.x),s.y>h&&(r.y=Math.floor(h/at.y),s.y=r.y*at.y,Y.mapSize.y=r.y));const Q=i.state.buffers.depth.getReversed();if(Y.camera._reversedDepth=Q,Y.map===null||k===!0){if(Y.map!==null&&(Y.map.depthTexture!==null&&(Y.map.depthTexture.dispose(),Y.map.depthTexture=null),Y.map.dispose()),this.type===Xs){if(q.isPointLight){_t("WebGLShadowMap: VSM shadow maps are not supported for PointLights. Use PCF or BasicShadowMap instead.");continue}Y.map=new pn(s.x,s.y,{format:Fi,type:Gn,minFilter:xe,magFilter:xe,generateMipmaps:!1}),Y.map.texture.name=q.name+".shadowMap",Y.map.depthTexture=new hr(s.x,s.y,sn),Y.map.depthTexture.name=q.name+".shadowMapDepth",Y.map.depthTexture.format=ei,Y.map.depthTexture.compareFunction=null,Y.map.depthTexture.minFilter=be,Y.map.depthTexture.magFilter=be}else q.isPointLight?(Y.map=new Hu(s.x),Y.map.depthTexture=new BA(s.x,Tn)):(Y.map=new pn(s.x,s.y),Y.map.depthTexture=new hr(s.x,s.y,Tn)),Y.map.depthTexture.name=q.name+".shadowMap",Y.map.depthTexture.format=ei,this.type===kr?(Y.map.depthTexture.compareFunction=Q?Ql:kl,Y.map.depthTexture.minFilter=xe,Y.map.depthTexture.magFilter=xe):(Y.map.depthTexture.compareFunction=null,Y.map.depthTexture.minFilter=be,Y.map.depthTexture.magFilter=be);Y.camera.updateProjectionMatrix()}Y.map.isWebGLCubeRenderTarget!==!0&&(Y.map.width!==s.x||Y.map.height!==s.y)&&Y.map.setSize(s.x,s.y);const $=Y.map.isWebGLCubeRenderTarget?6:Y.getViewportCount();q.isPointLight!==!0&&Y.updateMatrices(q,_);for(let st=0;st<$;st++){const Ut=Y.getCamera(st);if(q.isPointLight){const Tt=Y.camera,oe=Y.matrix,Zt=q.distance||Tt.far;Zt!==Tt.far&&(Tt.far=Zt,Tt.updateProjectionMatrix()),Lr.setFromMatrixPosition(q.matrixWorld),Tt.position.copy(Lr),lh.copy(Tt.position),lh.add(ow[st]),Tt.up.copy(lw[st]),Tt.lookAt(lh),Tt.updateMatrixWorld(),oe.makeTranslation(-Lr.x,-Lr.y,-Lr.z),Qd.multiplyMatrices(Tt.projectionMatrix,Tt.matrixWorldInverse),Y._frustum.setFromProjectionMatrix(Qd,Tt.coordinateSystem,Tt.reversedDepth)}if(Y.map.isWebGLCubeRenderTarget)i.setRenderTarget(Y.map,st),i.clear();else{st===0&&(i.setRenderTarget(Y.map),i.clear());const Tt=Y.getViewport(st);a.set(r.x*Tt.x,r.y*Tt.y,r.x*Tt.z,r.y*Tt.w),U.viewport(a)}n=Y.getFrustum(st),x(C,_,Ut,q,this.type)}Y.isPointLightShadow!==!0&&this.type===Xs&&v(Y,_),Y.needsUpdate=!1}A=this.type,m.needsUpdate=!1,i.setRenderTarget(b,B,P)};function v(E,C){const _=t.update(g);u.defines.VSM_SAMPLES!==E.blurSamples&&(u.defines.VSM_SAMPLES=E.blurSamples,d.defines.VSM_SAMPLES=E.blurSamples,u.needsUpdate=!0,d.needsUpdate=!0),E.mapPass===null?E.mapPass=new pn(s.x,s.y,{format:Fi,type:Gn}):(E.mapPass.width!==E.map.width||E.mapPass.height!==E.map.height)&&E.mapPass.setSize(E.map.width,E.map.height),u.uniforms.shadow_pass.value=E.map.depthTexture,u.uniforms.resolution.value.set(E.map.width,E.map.height),u.uniforms.radius.value=E.radius,i.setRenderTarget(E.mapPass),i.clear(),i.renderBufferDirect(C,null,_,u,g,null),d.uniforms.shadow_pass.value=E.mapPass.texture,d.uniforms.resolution.value.set(E.map.width,E.map.height),d.uniforms.radius.value=E.radius,i.setRenderTarget(E.map),i.clear(),i.renderBufferDirect(C,null,_,d,g,null)}function M(E,C,_,b){let B=null;const P=_.isPointLight===!0?E.customDistanceMaterial:E.customDepthMaterial;if(P!==void 0)B=P;else if(B=_.isPointLight===!0?l:o,i.localClippingEnabled&&C.clipShadows===!0&&Array.isArray(C.clippingPlanes)&&C.clippingPlanes.length!==0||C.displacementMap&&C.displacementScale!==0||C.alphaMap&&C.alphaTest>0||C.map&&C.alphaTest>0||C.alphaToCoverage===!0){const U=B.uuid,k=C.uuid;let L=c[U];L===void 0&&(L={},c[U]=L);let O=L[k];O===void 0&&(O=B.clone(),L[k]=O,C.addEventListener("dispose",S)),B=O}if(B.visible=C.visible,B.wireframe=C.wireframe,b===Xs?B.side=C.shadowSide!==null?C.shadowSide:C.side:B.side=C.shadowSide!==null?C.shadowSide:f[C.side],B.alphaMap=C.alphaMap,B.alphaTest=C.alphaToCoverage===!0?.5:C.alphaTest,B.map=C.map,B.clipShadows=C.clipShadows,B.clippingPlanes=C.clippingPlanes,B.clipIntersection=C.clipIntersection,B.displacementMap=C.displacementMap,B.displacementScale=C.displacementScale,B.displacementBias=C.displacementBias,B.wireframeLinewidth=C.wireframeLinewidth,B.linewidth=C.linewidth,_.isPointLight===!0&&B.isMeshDistanceMaterial===!0){const U=i.properties.get(B);U.light=_}return B}function x(E,C,_,b,B){if(E.visible===!1)return;if(E.layers.test(C.layers)&&(E.isMesh||E.isLine||E.isPoints)&&(E.castShadow||E.receiveShadow&&B===Xs)&&(!E.frustumCulled||E.intersectsFrustum(n))){E.modelViewMatrix.multiplyMatrices(_.matrixWorldInverse,E.matrixWorld);const k=t.update(E),L=E.material;if(Array.isArray(L)){const O=k.groups;for(let q=0,Y=O.length;q<Y;q++){const at=O[q],Q=L[at.materialIndex];if(Q&&Q.visible){const $=M(E,Q,b,B);E.onBeforeShadow(i,E,C,_,k,$,at),i.renderBufferDirect(_,null,k,$,E,at),E.onAfterShadow(i,E,C,_,k,$,at)}}}else if(L.visible){const O=M(E,L,b,B);E.onBeforeShadow(i,E,C,_,k,O,null),i.renderBufferDirect(_,null,k,O,E,null),E.onAfterShadow(i,E,C,_,k,O,null)}}const U=E.children;for(let k=0,L=U.length;k<L;k++)x(U[k],C,_,b,B)}function S(E){E.target.removeEventListener("dispose",S);for(const _ in c){const b=c[_],B=E.target.uuid;B in b&&(b[B].dispose(),delete b[B])}}}function hw(i,t){function e(){let F=!1;const dt=new Ae;let tt=null;const xt=new Ae(0,0,0,0);return{setMask:function(ht){tt!==ht&&!F&&(i.colorMask(ht,ht,ht,ht),tt=ht)},setLocked:function(ht){F=ht},setClear:function(ht,it,Ct,Pt,ue){ue===!0&&(ht*=Pt,it*=Pt,Ct*=Pt),dt.set(ht,it,Ct,Pt),xt.equals(dt)===!1&&(i.clearColor(ht,it,Ct,Pt),xt.copy(dt))},reset:function(){F=!1,tt=null,xt.set(-1,0,0,0)}}}function n(){let F=!1,dt=!1,tt=null,xt=null,ht=null;return{setReversed:function(it){if(dt!==it){const Ct=t.get("EXT_clip_control");it?Ct.clipControlEXT(Ct.LOWER_LEFT_EXT,Ct.ZERO_TO_ONE_EXT):Ct.clipControlEXT(Ct.LOWER_LEFT_EXT,Ct.NEGATIVE_ONE_TO_ONE_EXT),dt=it;const Pt=ht;ht=null,this.setClear(Pt)}},getReversed:function(){return dt},setTest:function(it){it?z(i.DEPTH_TEST):nt(i.DEPTH_TEST)},setMask:function(it){tt!==it&&!F&&(i.depthMask(it),tt=it)},setFunc:function(it){if(dt&&(it=y0[it]),xt!==it){switch(it){case Uo:i.depthFunc(i.NEVER);break;case No:i.depthFunc(i.ALWAYS);break;case Oo:i.depthFunc(i.LESS);break;case rr:i.depthFunc(i.LEQUAL);break;case Go:i.depthFunc(i.EQUAL);break;case ko:i.depthFunc(i.GEQUAL);break;case Qo:i.depthFunc(i.GREATER);break;case zo:i.depthFunc(i.NOTEQUAL);break;default:i.depthFunc(i.LEQUAL)}xt=it}},setLocked:function(it){F=it},setClear:function(it){ht!==it&&(ht=it,dt&&(it=1-it),i.clearDepth(it))},reset:function(){F=!1,tt=null,xt=null,ht=null,dt=!1}}}function s(){let F=!1,dt=null,tt=null,xt=null,ht=null,it=null,Ct=null,Pt=null,ue=null;return{setTest:function(ne){F||(ne?z(i.STENCIL_TEST):nt(i.STENCIL_TEST))},setMask:function(ne){dt!==ne&&!F&&(i.stencilMask(ne),dt=ne)},setFunc:function(ne,Qe,ze){(tt!==ne||xt!==Qe||ht!==ze)&&(i.stencilFunc(ne,Qe,ze),tt=ne,xt=Qe,ht=ze)},setOp:function(ne,Qe,ze){(it!==ne||Ct!==Qe||Pt!==ze)&&(i.stencilOp(ne,Qe,ze),it=ne,Ct=Qe,Pt=ze)},setLocked:function(ne){F=ne},setClear:function(ne){ue!==ne&&(i.clearStencil(ne),ue=ne)},reset:function(){F=!1,dt=null,tt=null,xt=null,ht=null,it=null,Ct=null,Pt=null,ue=null}}}const r=new e,a=new n,o=new s,l=new WeakMap,c=new WeakMap;let h={},f={},u={},d=new WeakMap,p=[],g=null,m=!1,A=null,v=null,M=null,x=null,S=null,E=null,C=null,_=new bt(0,0,0),b=0,B=!1,P=null,U=null,k=null,L=null,O=null;const q=i.getParameter(i.MAX_COMBINED_TEXTURE_IMAGE_UNITS);let Y=!1,at=0;const Q=i.getParameter(i.VERSION);Q.indexOf("WebGL")!==-1?(at=parseFloat(/^WebGL (\d)/.exec(Q)[1]),Y=at>=1):Q.indexOf("OpenGL ES")!==-1&&(at=parseFloat(/^OpenGL ES (\d)/.exec(Q)[1]),Y=at>=2);let $=null,st={};const Ut=i.getParameter(i.SCISSOR_BOX),Tt=i.getParameter(i.VIEWPORT),oe=new Ae().fromArray(Ut),Zt=new Ae().fromArray(Tt);function Vt(F,dt,tt,xt){const ht=new Uint8Array(4),it=i.createTexture();i.bindTexture(F,it),i.texParameteri(F,i.TEXTURE_MIN_FILTER,i.NEAREST),i.texParameteri(F,i.TEXTURE_MAG_FILTER,i.NEAREST);for(let Ct=0;Ct<tt;Ct++)F===i.TEXTURE_3D||F===i.TEXTURE_2D_ARRAY?i.texImage3D(dt,0,i.RGBA,1,1,xt,0,i.RGBA,i.UNSIGNED_BYTE,ht):i.texImage2D(dt+Ct,0,i.RGBA,1,1,0,i.RGBA,i.UNSIGNED_BYTE,ht);return it}const K={};K[i.TEXTURE_2D]=Vt(i.TEXTURE_2D,i.TEXTURE_2D,1),K[i.TEXTURE_CUBE_MAP]=Vt(i.TEXTURE_CUBE_MAP,i.TEXTURE_CUBE_MAP_POSITIVE_X,6),K[i.TEXTURE_2D_ARRAY]=Vt(i.TEXTURE_2D_ARRAY,i.TEXTURE_2D_ARRAY,1,1),K[i.TEXTURE_3D]=Vt(i.TEXTURE_3D,i.TEXTURE_3D,1,1),r.setClear(0,0,0,1),a.setClear(1),o.setClear(0),z(i.DEPTH_TEST),a.setFunc(rr),rt(!1),ut(Mh),z(i.CULL_FACE),ot(jn);function z(F){h[F]!==!0&&(i.enable(F),h[F]=!0)}function nt(F){h[F]!==!1&&(i.disable(F),h[F]=!1)}function gt(F,dt){return u[F]!==dt?(i.bindFramebuffer(F,dt),u[F]=dt,F===i.DRAW_FRAMEBUFFER&&(u[i.FRAMEBUFFER]=dt),F===i.FRAMEBUFFER&&(u[i.DRAW_FRAMEBUFFER]=dt),!0):!1}function ct(F,dt){let tt=p,xt=!1;if(F){tt=d.get(dt),tt===void 0&&(tt=[],d.set(dt,tt));const ht=F.textures;if(tt.length!==ht.length||tt[0]!==i.COLOR_ATTACHMENT0){for(let it=0,Ct=ht.length;it<Ct;it++)tt[it]=i.COLOR_ATTACHMENT0+it;tt.length=ht.length,xt=!0}}else tt[0]!==i.BACK&&(tt[0]=i.BACK,xt=!0);xt&&i.drawBuffers(tt)}function Et(F){return g!==F?(i.useProgram(F),g=F,!0):!1}const Wt={[ss]:i.FUNC_ADD,[Up]:i.FUNC_SUBTRACT,[Np]:i.FUNC_REVERSE_SUBTRACT};Wt[Op]=i.MIN,Wt[Gp]=i.MAX;const Z={[kp]:i.ZERO,[Qp]:i.ONE,[zp]:i.SRC_COLOR,[$h]:i.SRC_ALPHA,[qp]:i.SRC_ALPHA_SATURATE,[Yp]:i.DST_COLOR,[Vp]:i.DST_ALPHA,[Hp]:i.ONE_MINUS_SRC_COLOR,[jh]:i.ONE_MINUS_SRC_ALPHA,[Xp]:i.ONE_MINUS_DST_COLOR,[Wp]:i.ONE_MINUS_DST_ALPHA,[Kp]:i.CONSTANT_COLOR,[Jp]:i.ONE_MINUS_CONSTANT_COLOR,[Zp]:i.CONSTANT_ALPHA,[$p]:i.ONE_MINUS_CONSTANT_ALPHA};function ot(F,dt,tt,xt,ht,it,Ct,Pt,ue,ne){if(F===jn){m===!0&&(nt(i.BLEND),m=!1);return}if(m===!1&&(z(i.BLEND),m=!0),F!==Fp){if(F!==A||ne!==B){if((v!==ss||S!==ss)&&(i.blendEquation(i.FUNC_ADD),v=ss,S=ss),ne)switch(F){case tr:i.blendFuncSeparate(i.ONE,i.ONE_MINUS_SRC_ALPHA,i.ONE,i.ONE_MINUS_SRC_ALPHA);break;case Eh:i.blendFunc(i.ONE,i.ONE);break;case Sh:i.blendFuncSeparate(i.ZERO,i.ONE_MINUS_SRC_COLOR,i.ZERO,i.ONE);break;case wh:i.blendFuncSeparate(i.DST_COLOR,i.ONE_MINUS_SRC_ALPHA,i.ZERO,i.ONE);break;default:Ht("WebGLState: Invalid blending: ",F);break}else switch(F){case tr:i.blendFuncSeparate(i.SRC_ALPHA,i.ONE_MINUS_SRC_ALPHA,i.ONE,i.ONE_MINUS_SRC_ALPHA);break;case Eh:i.blendFuncSeparate(i.SRC_ALPHA,i.ONE,i.ONE,i.ONE);break;case Sh:Ht("WebGLState: SubtractiveBlending requires material.premultipliedAlpha = true");break;case wh:Ht("WebGLState: MultiplyBlending requires material.premultipliedAlpha = true");break;default:Ht("WebGLState: Invalid blending: ",F);break}M=null,x=null,E=null,C=null,_.set(0,0,0),b=0,A=F,B=ne}return}ht=ht||dt,it=it||tt,Ct=Ct||xt,(dt!==v||ht!==S)&&(i.blendEquationSeparate(Wt[dt],Wt[ht]),v=dt,S=ht),(tt!==M||xt!==x||it!==E||Ct!==C)&&(i.blendFuncSeparate(Z[tt],Z[xt],Z[it],Z[Ct]),M=tt,x=xt,E=it,C=Ct),(Pt.equals(_)===!1||ue!==b)&&(i.blendColor(Pt.r,Pt.g,Pt.b,ue),_.copy(Pt),b=ue),A=F,B=!1}function j(F,dt){F.side===Fn?nt(i.CULL_FACE):z(i.CULL_FACE);let tt=F.side===an;dt&&(tt=!tt),rt(tt),F.blending===tr&&F.transparent===!1?ot(jn):ot(F.blending,F.blendEquation,F.blendSrc,F.blendDst,F.blendEquationAlpha,F.blendSrcAlpha,F.blendDstAlpha,F.blendColor,F.blendAlpha,F.premultipliedAlpha),a.setFunc(F.depthFunc),a.setTest(F.depthTest),a.setMask(F.depthWrite),r.setMask(F.colorWrite);const xt=F.stencilWrite;o.setTest(xt),xt&&(o.setMask(F.stencilWriteMask),o.setFunc(F.stencilFunc,F.stencilRef,F.stencilFuncMask),o.setOp(F.stencilFail,F.stencilZFail,F.stencilZPass)),vt(F.polygonOffset,F.polygonOffsetFactor,F.polygonOffsetUnits),F.alphaToCoverage===!0?z(i.SAMPLE_ALPHA_TO_COVERAGE):nt(i.SAMPLE_ALPHA_TO_COVERAGE)}function rt(F){P!==F&&(F?i.frontFace(i.CW):i.frontFace(i.CCW),P=F)}function ut(F){F!==Dp?(z(i.CULL_FACE),F!==U&&(F===Mh?i.cullFace(i.BACK):F===Pp?i.cullFace(i.FRONT):i.cullFace(i.FRONT_AND_BACK))):nt(i.CULL_FACE),U=F}function Bt(F){F!==k&&(Y&&i.lineWidth(F),k=F)}function vt(F,dt,tt){F?(z(i.POLYGON_OFFSET_FILL),(L!==dt||O!==tt)&&(L=dt,O=tt,a.getReversed()&&(dt=-dt),i.polygonOffset(dt,tt))):nt(i.POLYGON_OFFSET_FILL)}function Qt(F){F?z(i.SCISSOR_TEST):nt(i.SCISSOR_TEST)}function Yt(F){F===void 0&&(F=i.TEXTURE0+q-1),$!==F&&(i.activeTexture(F),$=F)}function D(F,dt,tt){tt===void 0&&($===null?tt=i.TEXTURE0+q-1:tt=$);let xt=st[tt];xt===void 0&&(xt={type:void 0,texture:void 0},st[tt]=xt),(xt.type!==F||xt.texture!==dt)&&($!==tt&&(i.activeTexture(tt),$=tt),i.bindTexture(F,dt||K[F]),xt.type=F,xt.texture=dt)}function Jt(){const F=st[$];F!==void 0&&F.type!==void 0&&(i.bindTexture(F.type,null),F.type=void 0,F.texture=void 0)}function Dt(){try{i.compressedTexImage2D(...arguments)}catch(F){Ht("WebGLState:",F)}}function T(){try{i.compressedTexImage3D(...arguments)}catch(F){Ht("WebGLState:",F)}}function y(){try{i.texSubImage2D(...arguments)}catch(F){Ht("WebGLState:",F)}}function G(){try{i.texSubImage3D(...arguments)}catch(F){Ht("WebGLState:",F)}}function R(){try{i.compressedTexSubImage2D(...arguments)}catch(F){Ht("WebGLState:",F)}}function J(){try{i.compressedTexSubImage3D(...arguments)}catch(F){Ht("WebGLState:",F)}}function ft(){try{i.texStorage2D(...arguments)}catch(F){Ht("WebGLState:",F)}}function pt(){try{i.texStorage3D(...arguments)}catch(F){Ht("WebGLState:",F)}}function W(){try{i.texImage2D(...arguments)}catch(F){Ht("WebGLState:",F)}}function et(){try{i.texImage3D(...arguments)}catch(F){Ht("WebGLState:",F)}}function At(F){return f[F]!==void 0?f[F]:i.getParameter(F)}function Gt(F,dt){f[F]!==dt&&(i.pixelStorei(F,dt),f[F]=dt)}function yt(F){oe.equals(F)===!1&&(i.scissor(F.x,F.y,F.z,F.w),oe.copy(F))}function mt(F){Zt.equals(F)===!1&&(i.viewport(F.x,F.y,F.z,F.w),Zt.copy(F))}function It(F,dt){let tt=c.get(dt);tt===void 0&&(tt=new WeakMap,c.set(dt,tt));let xt=tt.get(F);xt===void 0&&(xt=i.getUniformBlockIndex(dt,F.name),tt.set(F,xt))}function kt(F,dt){const xt=c.get(dt).get(F);l.get(dt)!==xt&&(i.uniformBlockBinding(dt,xt,F.__bindingPointIndex),l.set(dt,xt))}function qt(){i.disable(i.BLEND),i.disable(i.CULL_FACE),i.disable(i.DEPTH_TEST),i.disable(i.POLYGON_OFFSET_FILL),i.disable(i.SCISSOR_TEST),i.disable(i.STENCIL_TEST),i.disable(i.SAMPLE_ALPHA_TO_COVERAGE),i.blendEquation(i.FUNC_ADD),i.blendFunc(i.ONE,i.ZERO),i.blendFuncSeparate(i.ONE,i.ZERO,i.ONE,i.ZERO),i.blendColor(0,0,0,0),i.colorMask(!0,!0,!0,!0),i.clearColor(0,0,0,0),i.depthMask(!0),i.depthFunc(i.LESS),a.setReversed(!1),i.clearDepth(1),i.stencilMask(4294967295),i.stencilFunc(i.ALWAYS,0,4294967295),i.stencilOp(i.KEEP,i.KEEP,i.KEEP),i.clearStencil(0),i.cullFace(i.BACK),i.frontFace(i.CCW),i.polygonOffset(0,0),i.activeTexture(i.TEXTURE0),i.bindFramebuffer(i.FRAMEBUFFER,null),i.bindFramebuffer(i.DRAW_FRAMEBUFFER,null),i.bindFramebuffer(i.READ_FRAMEBUFFER,null),i.useProgram(null),i.lineWidth(1),i.scissor(0,0,i.canvas.width,i.canvas.height),i.viewport(0,0,i.canvas.width,i.canvas.height),i.pixelStorei(i.PACK_ALIGNMENT,4),i.pixelStorei(i.UNPACK_ALIGNMENT,4),i.pixelStorei(i.UNPACK_FLIP_Y_WEBGL,!1),i.pixelStorei(i.UNPACK_PREMULTIPLY_ALPHA_WEBGL,!1),i.pixelStorei(i.UNPACK_COLORSPACE_CONVERSION_WEBGL,i.BROWSER_DEFAULT_WEBGL),i.pixelStorei(i.PACK_ROW_LENGTH,0),i.pixelStorei(i.PACK_SKIP_PIXELS,0),i.pixelStorei(i.PACK_SKIP_ROWS,0),i.pixelStorei(i.UNPACK_ROW_LENGTH,0),i.pixelStorei(i.UNPACK_IMAGE_HEIGHT,0),i.pixelStorei(i.UNPACK_SKIP_PIXELS,0),i.pixelStorei(i.UNPACK_SKIP_ROWS,0),i.pixelStorei(i.UNPACK_SKIP_IMAGES,0),h={},f={},$=null,st={},u={},d=new WeakMap,p=[],g=null,m=!1,A=null,v=null,M=null,x=null,S=null,E=null,C=null,_=new bt(0,0,0),b=0,B=!1,P=null,U=null,k=null,L=null,O=null,oe.set(0,0,i.canvas.width,i.canvas.height),Zt.set(0,0,i.canvas.width,i.canvas.height),r.reset(),a.reset(),o.reset()}return{buffers:{color:r,depth:a,stencil:o},enable:z,disable:nt,bindFramebuffer:gt,drawBuffers:ct,useProgram:Et,setBlending:ot,setMaterial:j,setFlipSided:rt,setCullFace:ut,setLineWidth:Bt,setPolygonOffset:vt,setScissorTest:Qt,activeTexture:Yt,bindTexture:D,unbindTexture:Jt,compressedTexImage2D:Dt,compressedTexImage3D:T,texImage2D:W,texImage3D:et,pixelStorei:Gt,getParameter:At,updateUBOMapping:It,uniformBlockBinding:kt,texStorage2D:ft,texStorage3D:pt,texSubImage2D:y,texSubImage3D:G,compressedTexSubImage2D:R,compressedTexSubImage3D:J,scissor:yt,viewport:mt,reset:qt}}function uw(i,t,e,n,s,r,a){const o=t.has("WEBGL_multisampled_render_to_texture")?t.get("WEBGL_multisampled_render_to_texture"):null,l=typeof navigator>"u"?!1:/OculusBrowser/g.test(navigator.userAgent),c=new lt,h=new WeakMap,f=new Set;let u;const d=new WeakMap;let p=!1;try{p=typeof OffscreenCanvas<"u"&&new OffscreenCanvas(1,1).getContext("2d")!==null}catch{}function g(T,y){return p?new OffscreenCanvas(T,y):oa("canvas")}function m(T,y,G){let R=1;const J=Dt(T);if((J.width>G||J.height>G)&&(R=G/Math.max(J.width,J.height)),R<1)if(typeof HTMLImageElement<"u"&&T instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&T instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&T instanceof ImageBitmap||typeof VideoFrame<"u"&&T instanceof VideoFrame){const ft=Math.floor(R*J.width),pt=Math.floor(R*J.height);u===void 0&&(u=g(ft,pt));const W=y?g(ft,pt):u;return W.width=ft,W.height=pt,W.getContext("2d").drawImage(T,0,0,ft,pt),_t("WebGLRenderer: Texture has been resized from ("+J.width+"x"+J.height+") to ("+ft+"x"+pt+")."),W}else return"data"in T&&_t("WebGLRenderer: Image in DataTexture is too big ("+J.width+"x"+J.height+")."),T;return T}function A(T){return T.generateMipmaps}function v(T){i.generateMipmap(T)}function M(T){return T.isWebGLCubeRenderTarget?i.TEXTURE_CUBE_MAP:T.isWebGL3DRenderTarget?i.TEXTURE_3D:T.isWebGLArrayRenderTarget||T.isCompressedArrayTexture?i.TEXTURE_2D_ARRAY:i.TEXTURE_2D}function x(T,y,G,R,J,ft=!1){if(T!==null){if(i[T]!==void 0)return i[T];_t("WebGLRenderer: Attempt to use non-existing WebGL internal format '"+T+"'")}let pt;R&&(pt=t.get("EXT_texture_norm16"),pt||_t("WebGLRenderer: Unable to use normalized textures without EXT_texture_norm16 extension"));let W=y;if(y===i.RED&&(G===i.FLOAT&&(W=i.R32F),G===i.HALF_FLOAT&&(W=i.R16F),G===i.UNSIGNED_BYTE&&(W=i.R8),G===i.UNSIGNED_SHORT&&pt&&(W=pt.R16_EXT),G===i.SHORT&&pt&&(W=pt.R16_SNORM_EXT)),y===i.RED_INTEGER&&(G===i.UNSIGNED_BYTE&&(W=i.R8UI),G===i.UNSIGNED_SHORT&&(W=i.R16UI),G===i.UNSIGNED_INT&&(W=i.R32UI),G===i.BYTE&&(W=i.R8I),G===i.SHORT&&(W=i.R16I),G===i.INT&&(W=i.R32I)),y===i.RG&&(G===i.FLOAT&&(W=i.RG32F),G===i.HALF_FLOAT&&(W=i.RG16F),G===i.UNSIGNED_BYTE&&(W=i.RG8),G===i.UNSIGNED_SHORT&&pt&&(W=pt.RG16_EXT),G===i.SHORT&&pt&&(W=pt.RG16_SNORM_EXT)),y===i.RG_INTEGER&&(G===i.UNSIGNED_BYTE&&(W=i.RG8UI),G===i.UNSIGNED_SHORT&&(W=i.RG16UI),G===i.UNSIGNED_INT&&(W=i.RG32UI),G===i.BYTE&&(W=i.RG8I),G===i.SHORT&&(W=i.RG16I),G===i.INT&&(W=i.RG32I)),y===i.RGB_INTEGER&&(G===i.UNSIGNED_BYTE&&(W=i.RGB8UI),G===i.UNSIGNED_SHORT&&(W=i.RGB16UI),G===i.UNSIGNED_INT&&(W=i.RGB32UI),G===i.BYTE&&(W=i.RGB8I),G===i.SHORT&&(W=i.RGB16I),G===i.INT&&(W=i.RGB32I)),y===i.RGBA_INTEGER&&(G===i.UNSIGNED_BYTE&&(W=i.RGBA8UI),G===i.UNSIGNED_SHORT&&(W=i.RGBA16UI),G===i.UNSIGNED_INT&&(W=i.RGBA32UI),G===i.BYTE&&(W=i.RGBA8I),G===i.SHORT&&(W=i.RGBA16I),G===i.INT&&(W=i.RGBA32I)),y===i.RGB&&(G===i.UNSIGNED_SHORT&&pt&&(W=pt.RGB16_EXT),G===i.SHORT&&pt&&(W=pt.RGB16_SNORM_EXT),G===i.UNSIGNED_INT_5_9_9_9_REV&&(W=i.RGB9_E5),G===i.UNSIGNED_INT_10F_11F_11F_REV&&(W=i.R11F_G11F_B10F)),y===i.RGBA){const et=ft?aa:ae.getTransfer(J);G===i.FLOAT&&(W=i.RGBA32F),G===i.HALF_FLOAT&&(W=i.RGBA16F),G===i.UNSIGNED_BYTE&&(W=et===pe?i.SRGB8_ALPHA8:i.RGBA8),G===i.UNSIGNED_SHORT&&pt&&(W=pt.RGBA16_EXT),G===i.SHORT&&pt&&(W=pt.RGBA16_SNORM_EXT),G===i.UNSIGNED_SHORT_4_4_4_4&&(W=i.RGBA4),G===i.UNSIGNED_SHORT_5_5_5_1&&(W=i.RGB5_A1)}return(W===i.R16F||W===i.R32F||W===i.RG16F||W===i.RG32F||W===i.RGBA16F||W===i.RGBA32F)&&t.get("EXT_color_buffer_float"),W}function S(T,y){let G;return T?y===null||y===Tn||y===or?G=i.DEPTH24_STENCIL8:y===sn?G=i.DEPTH32F_STENCIL8:y===ar&&(G=i.DEPTH24_STENCIL8,_t("DepthTexture: 16 bit depth attachment is not supported with stencil. Using 24-bit attachment.")):y===null||y===Tn||y===or?G=i.DEPTH_COMPONENT24:y===sn?G=i.DEPTH_COMPONENT32F:y===ar&&(G=i.DEPTH_COMPONENT16),G}function E(T,y){return A(T)===!0||T.isFramebufferTexture&&T.minFilter!==be&&T.minFilter!==xe?Math.log2(Math.max(y.width,y.height))+1:T.mipmaps!==void 0&&T.mipmaps.length>0?T.mipmaps.length:T.isCompressedTexture&&Array.isArray(T.image)?y.mipmaps.length:1}function C(T){const y=T.target;y.removeEventListener("dispose",C),b(y),y.isVideoTexture&&h.delete(y),y.isHTMLTexture&&f.delete(y)}function _(T){const y=T.target;y.removeEventListener("dispose",_),P(y)}function b(T){const y=n.get(T);if(y.__webglInit===void 0)return;const G=T.source,R=d.get(G);if(R){const J=R[y.__cacheKey];J.usedTimes--,J.usedTimes===0&&B(T),Object.keys(R).length===0&&d.delete(G)}n.remove(T)}function B(T){const y=n.get(T);i.deleteTexture(y.__webglTexture);const G=T.source,R=d.get(G);delete R[y.__cacheKey],a.memory.textures--}function P(T){const y=n.get(T);if(T.depthTexture&&(T.depthTexture.dispose(),n.remove(T.depthTexture)),T.isWebGLCubeRenderTarget)for(let R=0;R<6;R++){if(Array.isArray(y.__webglFramebuffer[R]))for(let J=0;J<y.__webglFramebuffer[R].length;J++)i.deleteFramebuffer(y.__webglFramebuffer[R][J]);else i.deleteFramebuffer(y.__webglFramebuffer[R]);y.__webglDepthbuffer&&i.deleteRenderbuffer(y.__webglDepthbuffer[R])}else{if(Array.isArray(y.__webglFramebuffer))for(let R=0;R<y.__webglFramebuffer.length;R++)i.deleteFramebuffer(y.__webglFramebuffer[R]);else i.deleteFramebuffer(y.__webglFramebuffer);if(y.__webglDepthbuffer&&i.deleteRenderbuffer(y.__webglDepthbuffer),y.__webglMultisampledFramebuffer&&i.deleteFramebuffer(y.__webglMultisampledFramebuffer),y.__webglColorRenderbuffer)for(let R=0;R<y.__webglColorRenderbuffer.length;R++)y.__webglColorRenderbuffer[R]&&i.deleteRenderbuffer(y.__webglColorRenderbuffer[R]);y.__webglDepthRenderbuffer&&i.deleteRenderbuffer(y.__webglDepthRenderbuffer)}const G=T.textures;for(let R=0,J=G.length;R<J;R++){const ft=n.get(G[R]);ft.__webglTexture&&(i.deleteTexture(ft.__webglTexture),a.memory.textures--),n.remove(G[R])}n.remove(T)}let U=0;function k(){U=0}function L(){return U}function O(T){U=T}function q(){const T=U;return T>=s.maxTextures&&_t("WebGLTextures: Trying to use "+(T+1)+" texture units while this GPU supports only "+s.maxTextures),U+=1,T}function Y(T){const y=[];return y.push(T.wrapS),y.push(T.wrapT),y.push(T.wrapR||0),y.push(T.magFilter),y.push(T.minFilter),y.push(T.anisotropy),y.push(T.internalFormat),y.push(T.format),y.push(T.type),y.push(T.generateMipmaps),y.push(T.premultiplyAlpha),y.push(T.flipY),y.push(T.unpackAlignment),y.push(T.colorSpace),y.join()}function at(T,y){const G=n.get(T);if(T.isVideoTexture&&D(T),T.isRenderTargetTexture===!1&&T.isExternalTexture!==!0&&T.version>0&&G.__version!==T.version){const R=T.image;if(R===null)_t("WebGLRenderer: Texture marked for update but no image data found.");else if(R.complete===!1)_t("WebGLRenderer: Texture marked for update but image is incomplete");else{nt(G,T,y);return}}else T.isExternalTexture&&(G.__webglTexture=T.sourceTexture?T.sourceTexture:null);e.bindTexture(i.TEXTURE_2D,G.__webglTexture,i.TEXTURE0+y)}function Q(T,y){const G=n.get(T);if(T.isRenderTargetTexture===!1&&T.version>0&&G.__version!==T.version){nt(G,T,y);return}else T.isExternalTexture&&(G.__webglTexture=T.sourceTexture?T.sourceTexture:null);e.bindTexture(i.TEXTURE_2D_ARRAY,G.__webglTexture,i.TEXTURE0+y)}function $(T,y){const G=n.get(T);if(T.isRenderTargetTexture===!1&&T.version>0&&G.__version!==T.version){nt(G,T,y);return}e.bindTexture(i.TEXTURE_3D,G.__webglTexture,i.TEXTURE0+y)}function st(T,y){const G=n.get(T);if(T.isCubeDepthTexture!==!0&&T.version>0&&G.__version!==T.version){gt(G,T,y);return}e.bindTexture(i.TEXTURE_CUBE_MAP,G.__webglTexture,i.TEXTURE0+y)}const Ut={[jr]:i.REPEAT,[Ke]:i.CLAMP_TO_EDGE,[ta]:i.MIRRORED_REPEAT},Tt={[be]:i.NEAREST,[ou]:i.NEAREST_MIPMAP_NEAREST,[qs]:i.NEAREST_MIPMAP_LINEAR,[xe]:i.LINEAR,[Hr]:i.LINEAR_MIPMAP_NEAREST,[Kn]:i.LINEAR_MIPMAP_LINEAR},oe={[lA]:i.NEVER,[dA]:i.ALWAYS,[cA]:i.LESS,[kl]:i.LEQUAL,[hA]:i.EQUAL,[Ql]:i.GEQUAL,[uA]:i.GREATER,[fA]:i.NOTEQUAL};function Zt(T,y){if(y.type===sn&&t.has("OES_texture_float_linear")===!1&&(y.magFilter===xe||y.magFilter===Hr||y.magFilter===qs||y.magFilter===Kn||y.minFilter===xe||y.minFilter===Hr||y.minFilter===qs||y.minFilter===Kn)&&_t("WebGLRenderer: Unable to use linear filtering with floating point textures. OES_texture_float_linear not supported on this device."),i.texParameteri(T,i.TEXTURE_WRAP_S,Ut[y.wrapS]),i.texParameteri(T,i.TEXTURE_WRAP_T,Ut[y.wrapT]),(T===i.TEXTURE_3D||T===i.TEXTURE_2D_ARRAY)&&i.texParameteri(T,i.TEXTURE_WRAP_R,Ut[y.wrapR]),i.texParameteri(T,i.TEXTURE_MAG_FILTER,Tt[y.magFilter]),i.texParameteri(T,i.TEXTURE_MIN_FILTER,Tt[y.minFilter]),y.compareFunction&&(i.texParameteri(T,i.TEXTURE_COMPARE_MODE,i.COMPARE_REF_TO_TEXTURE),i.texParameteri(T,i.TEXTURE_COMPARE_FUNC,oe[y.compareFunction])),t.has("EXT_texture_filter_anisotropic")===!0){if(y.magFilter===be||y.minFilter!==qs&&y.minFilter!==Kn||y.type===sn&&t.has("OES_texture_float_linear")===!1)return;if(y.anisotropy>1||n.get(y).__currentAnisotropy){const G=t.get("EXT_texture_filter_anisotropic");i.texParameterf(T,G.TEXTURE_MAX_ANISOTROPY_EXT,Math.min(y.anisotropy,s.getMaxAnisotropy())),n.get(y).__currentAnisotropy=y.anisotropy}}}function Vt(T,y){let G=!1;T.__webglInit===void 0&&(T.__webglInit=!0,y.addEventListener("dispose",C));const R=y.source;let J=d.get(R);J===void 0&&(J={},d.set(R,J));const ft=Y(y);if(ft!==T.__cacheKey){J[ft]===void 0&&(J[ft]={texture:i.createTexture(),usedTimes:0},a.memory.textures++,G=!0),J[ft].usedTimes++;const pt=J[T.__cacheKey];pt!==void 0&&(J[T.__cacheKey].usedTimes--,pt.usedTimes===0&&B(y)),T.__cacheKey=ft,T.__webglTexture=J[ft].texture}return G}function K(T,y,G){return Math.floor(Math.floor(T/G)/y)}function z(T,y,G,R){const ft=T.updateRanges;if(ft.length===0)e.texSubImage2D(i.TEXTURE_2D,0,0,0,y.width,y.height,G,R,y.data);else{ft.sort((Gt,yt)=>Gt.start-yt.start);let pt=0;for(let Gt=1;Gt<ft.length;Gt++){const yt=ft[pt],mt=ft[Gt],It=yt.start+yt.count,kt=K(mt.start,y.width,4),qt=K(yt.start,y.width,4);mt.start<=It+1&&kt===qt&&K(mt.start+mt.count-1,y.width,4)===kt?yt.count=Math.max(yt.count,mt.start+mt.count-yt.start):(++pt,ft[pt]=mt)}ft.length=pt+1;const W=e.getParameter(i.UNPACK_ROW_LENGTH),et=e.getParameter(i.UNPACK_SKIP_PIXELS),At=e.getParameter(i.UNPACK_SKIP_ROWS);e.pixelStorei(i.UNPACK_ROW_LENGTH,y.width);for(let Gt=0,yt=ft.length;Gt<yt;Gt++){const mt=ft[Gt],It=Math.floor(mt.start/4),kt=Math.ceil(mt.count/4),qt=It%y.width,F=Math.floor(It/y.width),dt=kt,tt=1;e.pixelStorei(i.UNPACK_SKIP_PIXELS,qt),e.pixelStorei(i.UNPACK_SKIP_ROWS,F),e.texSubImage2D(i.TEXTURE_2D,0,qt,F,dt,tt,G,R,y.data)}T.clearUpdateRanges(),e.pixelStorei(i.UNPACK_ROW_LENGTH,W),e.pixelStorei(i.UNPACK_SKIP_PIXELS,et),e.pixelStorei(i.UNPACK_SKIP_ROWS,At)}}function nt(T,y,G){let R=i.TEXTURE_2D;(y.isDataArrayTexture||y.isCompressedArrayTexture)&&(R=i.TEXTURE_2D_ARRAY),y.isData3DTexture&&(R=i.TEXTURE_3D);const J=Vt(T,y),ft=y.source;e.bindTexture(R,T.__webglTexture,i.TEXTURE0+G);const pt=n.get(ft);if(ft.version!==pt.__version||J===!0){if(e.activeTexture(i.TEXTURE0+G),(typeof ImageBitmap<"u"&&y.image instanceof ImageBitmap)===!1){const tt=ae.getPrimaries(ae.workingColorSpace),xt=y.colorSpace===Xn?null:ae.getPrimaries(y.colorSpace),ht=y.colorSpace===Xn||tt===xt?i.NONE:i.BROWSER_DEFAULT_WEBGL;e.pixelStorei(i.UNPACK_FLIP_Y_WEBGL,y.flipY),e.pixelStorei(i.UNPACK_PREMULTIPLY_ALPHA_WEBGL,y.premultiplyAlpha),e.pixelStorei(i.UNPACK_COLORSPACE_CONVERSION_WEBGL,ht)}e.pixelStorei(i.UNPACK_ALIGNMENT,y.unpackAlignment);let et=m(y.image,!1,s.maxTextureSize);et=Jt(y,et);const At=r.convert(y.format,y.colorSpace),Gt=r.convert(y.type);let yt=x(y.internalFormat,At,Gt,y.normalized,y.colorSpace,y.isVideoTexture);Zt(R,y);let mt;const It=y.mipmaps,kt=y.isVideoTexture!==!0,qt=pt.__version===void 0||J===!0,F=ft.dataReady,dt=E(y,et);if(y.isDepthTexture)yt=S(y.format===Ii,y.type),qt&&(kt?e.texStorage2D(i.TEXTURE_2D,1,yt,et.width,et.height):e.texImage2D(i.TEXTURE_2D,0,yt,et.width,et.height,0,At,Gt,null));else if(y.isDataTexture)if(It.length>0){kt&&qt&&e.texStorage2D(i.TEXTURE_2D,dt,yt,It[0].width,It[0].height);for(let tt=0,xt=It.length;tt<xt;tt++)mt=It[tt],kt?F&&e.texSubImage2D(i.TEXTURE_2D,tt,0,0,mt.width,mt.height,At,Gt,mt.data):e.texImage2D(i.TEXTURE_2D,tt,yt,mt.width,mt.height,0,At,Gt,mt.data);y.generateMipmaps=!1}else kt?(qt&&e.texStorage2D(i.TEXTURE_2D,dt,yt,et.width,et.height),F&&z(y,et,At,Gt)):e.texImage2D(i.TEXTURE_2D,0,yt,et.width,et.height,0,At,Gt,et.data);else if(y.isCompressedTexture)if(y.isCompressedArrayTexture){kt&&qt&&e.texStorage3D(i.TEXTURE_2D_ARRAY,dt,yt,It[0].width,It[0].height,et.depth);for(let tt=0,xt=It.length;tt<xt;tt++)if(mt=It[tt],y.format!==Je)if(At!==null)if(kt){if(F)if(y.layerUpdates.size>0){const ht=Fh(mt.width,mt.height,y.format,y.type);for(const it of y.layerUpdates){const Ct=mt.data.subarray(it*ht/mt.data.BYTES_PER_ELEMENT,(it+1)*ht/mt.data.BYTES_PER_ELEMENT);e.compressedTexSubImage3D(i.TEXTURE_2D_ARRAY,tt,0,0,it,mt.width,mt.height,1,At,Ct)}}else e.compressedTexSubImage3D(i.TEXTURE_2D_ARRAY,tt,0,0,0,mt.width,mt.height,et.depth,At,mt.data)}else e.compressedTexImage3D(i.TEXTURE_2D_ARRAY,tt,yt,mt.width,mt.height,et.depth,0,mt.data,0,0);else _t("WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()");else kt?F&&e.texSubImage3D(i.TEXTURE_2D_ARRAY,tt,0,0,0,mt.width,mt.height,et.depth,At,Gt,mt.data):e.texImage3D(i.TEXTURE_2D_ARRAY,tt,yt,mt.width,mt.height,et.depth,0,At,Gt,mt.data);y.layerUpdates.size>0&&y.clearLayerUpdates()}else{kt&&qt&&e.texStorage2D(i.TEXTURE_2D,dt,yt,It[0].width,It[0].height);for(let tt=0,xt=It.length;tt<xt;tt++)mt=It[tt],y.format!==Je?At!==null?kt?F&&e.compressedTexSubImage2D(i.TEXTURE_2D,tt,0,0,mt.width,mt.height,At,mt.data):e.compressedTexImage2D(i.TEXTURE_2D,tt,yt,mt.width,mt.height,0,mt.data):_t("WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()"):kt?F&&e.texSubImage2D(i.TEXTURE_2D,tt,0,0,mt.width,mt.height,At,Gt,mt.data):e.texImage2D(i.TEXTURE_2D,tt,yt,mt.width,mt.height,0,At,Gt,mt.data)}else if(y.isDataArrayTexture)if(kt){if(qt&&e.texStorage3D(i.TEXTURE_2D_ARRAY,dt,yt,et.width,et.height,et.depth),F)if(y.layerUpdates.size>0){const tt=Fh(et.width,et.height,y.format,y.type);for(const xt of y.layerUpdates){const ht=et.data.subarray(xt*tt/et.data.BYTES_PER_ELEMENT,(xt+1)*tt/et.data.BYTES_PER_ELEMENT);e.texSubImage3D(i.TEXTURE_2D_ARRAY,0,0,0,xt,et.width,et.height,1,At,Gt,ht)}y.clearLayerUpdates()}else e.texSubImage3D(i.TEXTURE_2D_ARRAY,0,0,0,0,et.width,et.height,et.depth,At,Gt,et.data)}else e.texImage3D(i.TEXTURE_2D_ARRAY,0,yt,et.width,et.height,et.depth,0,At,Gt,et.data);else if(y.isData3DTexture)kt?(qt&&e.texStorage3D(i.TEXTURE_3D,dt,yt,et.width,et.height,et.depth),F&&e.texSubImage3D(i.TEXTURE_3D,0,0,0,0,et.width,et.height,et.depth,At,Gt,et.data)):e.texImage3D(i.TEXTURE_3D,0,yt,et.width,et.height,et.depth,0,At,Gt,et.data);else if(y.isFramebufferTexture){if(qt)if(kt)e.texStorage2D(i.TEXTURE_2D,dt,yt,et.width,et.height);else{let tt=et.width,xt=et.height;for(let ht=0;ht<dt;ht++)e.texImage2D(i.TEXTURE_2D,ht,yt,tt,xt,0,At,Gt,null),tt>>=1,xt>>=1}}else if(y.isHTMLTexture){if("texElementImage2D"in i){const tt=i.canvas;if(tt.hasAttribute("layoutsubtree")||tt.setAttribute("layoutsubtree","true"),et.parentNode!==tt){tt.appendChild(et),f.add(y),tt.onpaint=xt=>{const ht=xt.changedElements;for(const it of f)ht.includes(it.image)&&(it.needsUpdate=!0)},tt.requestPaint();return}if(i.texElementImage2D.length===3)i.texElementImage2D(i.TEXTURE_2D,i.RGBA8,et);else{const ht=i.RGBA,it=i.RGBA,Ct=i.UNSIGNED_BYTE;i.texElementImage2D(i.TEXTURE_2D,0,ht,it,Ct,et)}i.texParameteri(i.TEXTURE_2D,i.TEXTURE_MIN_FILTER,i.LINEAR),i.texParameteri(i.TEXTURE_2D,i.TEXTURE_WRAP_S,i.CLAMP_TO_EDGE),i.texParameteri(i.TEXTURE_2D,i.TEXTURE_WRAP_T,i.CLAMP_TO_EDGE)}}else if(It.length>0){if(kt&&qt){const tt=Dt(It[0]);e.texStorage2D(i.TEXTURE_2D,dt,yt,tt.width,tt.height)}for(let tt=0,xt=It.length;tt<xt;tt++)mt=It[tt],kt?F&&e.texSubImage2D(i.TEXTURE_2D,tt,0,0,At,Gt,mt):e.texImage2D(i.TEXTURE_2D,tt,yt,At,Gt,mt);y.generateMipmaps=!1}else if(kt){if(qt){const tt=Dt(et);e.texStorage2D(i.TEXTURE_2D,dt,yt,tt.width,tt.height)}F&&e.texSubImage2D(i.TEXTURE_2D,0,0,0,At,Gt,et)}else e.texImage2D(i.TEXTURE_2D,0,yt,At,Gt,et);A(y)&&v(R),pt.__version=ft.version,y.onUpdate&&y.onUpdate(y)}T.__version=y.version}function gt(T,y,G){if(y.image.length!==6)return;const R=Vt(T,y),J=y.source;e.bindTexture(i.TEXTURE_CUBE_MAP,T.__webglTexture,i.TEXTURE0+G);const ft=n.get(J);if(J.version!==ft.__version||R===!0){e.activeTexture(i.TEXTURE0+G);const pt=ae.getPrimaries(ae.workingColorSpace),W=y.colorSpace===Xn?null:ae.getPrimaries(y.colorSpace),et=y.colorSpace===Xn||pt===W?i.NONE:i.BROWSER_DEFAULT_WEBGL;e.pixelStorei(i.UNPACK_FLIP_Y_WEBGL,y.flipY),e.pixelStorei(i.UNPACK_PREMULTIPLY_ALPHA_WEBGL,y.premultiplyAlpha),e.pixelStorei(i.UNPACK_ALIGNMENT,y.unpackAlignment),e.pixelStorei(i.UNPACK_COLORSPACE_CONVERSION_WEBGL,et);const At=y.isCompressedTexture||y.image[0].isCompressedTexture,Gt=y.image[0]&&y.image[0].isDataTexture,yt=[];for(let it=0;it<6;it++)!At&&!Gt?yt[it]=m(y.image[it],!0,s.maxCubemapSize):yt[it]=Gt?y.image[it].image:y.image[it],yt[it]=Jt(y,yt[it]);const mt=yt[0],It=r.convert(y.format,y.colorSpace),kt=r.convert(y.type),qt=x(y.internalFormat,It,kt,y.normalized,y.colorSpace),F=y.isVideoTexture!==!0,dt=ft.__version===void 0||R===!0,tt=J.dataReady;let xt=E(y,mt);Zt(i.TEXTURE_CUBE_MAP,y);let ht;if(At){F&&dt&&e.texStorage2D(i.TEXTURE_CUBE_MAP,xt,qt,mt.width,mt.height);for(let it=0;it<6;it++){ht=yt[it].mipmaps;for(let Ct=0;Ct<ht.length;Ct++){const Pt=ht[Ct];y.format!==Je?It!==null?F?tt&&e.compressedTexSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+it,Ct,0,0,Pt.width,Pt.height,It,Pt.data):e.compressedTexImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+it,Ct,qt,Pt.width,Pt.height,0,Pt.data):_t("WebGLRenderer: Attempt to load unsupported compressed texture format in .setTextureCube()"):F?tt&&e.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+it,Ct,0,0,Pt.width,Pt.height,It,kt,Pt.data):e.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+it,Ct,qt,Pt.width,Pt.height,0,It,kt,Pt.data)}}}else{if(ht=y.mipmaps,F&&dt){ht.length>0&&xt++;const it=Dt(yt[0]);e.texStorage2D(i.TEXTURE_CUBE_MAP,xt,qt,it.width,it.height)}for(let it=0;it<6;it++)if(Gt){F?tt&&e.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+it,0,0,0,yt[it].width,yt[it].height,It,kt,yt[it].data):e.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+it,0,qt,yt[it].width,yt[it].height,0,It,kt,yt[it].data);for(let Ct=0;Ct<ht.length;Ct++){const ue=ht[Ct].image[it].image;F?tt&&e.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+it,Ct+1,0,0,ue.width,ue.height,It,kt,ue.data):e.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+it,Ct+1,qt,ue.width,ue.height,0,It,kt,ue.data)}}else{F?tt&&e.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+it,0,0,0,It,kt,yt[it]):e.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+it,0,qt,It,kt,yt[it]);for(let Ct=0;Ct<ht.length;Ct++){const Pt=ht[Ct];F?tt&&e.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+it,Ct+1,0,0,It,kt,Pt.image[it]):e.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+it,Ct+1,qt,It,kt,Pt.image[it])}}}A(y)&&v(i.TEXTURE_CUBE_MAP),ft.__version=J.version,y.onUpdate&&y.onUpdate(y)}T.__version=y.version}function ct(T,y,G,R,J,ft){const pt=r.convert(G.format,G.colorSpace),W=r.convert(G.type),et=x(G.internalFormat,pt,W,G.normalized,G.colorSpace),At=n.get(y),Gt=n.get(G);if(Gt.__renderTarget=y,!At.__hasExternalTextures){const yt=Math.max(1,y.width>>ft),mt=Math.max(1,y.height>>ft);J===i.TEXTURE_3D||J===i.TEXTURE_2D_ARRAY?e.texImage3D(J,ft,et,yt,mt,y.depth,0,pt,W,null):e.texImage2D(J,ft,et,yt,mt,0,pt,W,null)}e.bindFramebuffer(i.FRAMEBUFFER,T),Yt(y)?o.framebufferTexture2DMultisampleEXT(i.FRAMEBUFFER,R,J,Gt.__webglTexture,0,Qt(y)):(J===i.TEXTURE_2D||J>=i.TEXTURE_CUBE_MAP_POSITIVE_X&&J<=i.TEXTURE_CUBE_MAP_NEGATIVE_Z)&&i.framebufferTexture2D(i.FRAMEBUFFER,R,J,Gt.__webglTexture,ft),e.bindFramebuffer(i.FRAMEBUFFER,null)}function Et(T,y,G){if(i.bindRenderbuffer(i.RENDERBUFFER,T),y.depthBuffer){const R=y.depthTexture,J=R&&R.isDepthTexture?R.type:null,ft=S(y.stencilBuffer,J),pt=y.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT;Yt(y)?o.renderbufferStorageMultisampleEXT(i.RENDERBUFFER,Qt(y),ft,y.width,y.height):G?i.renderbufferStorageMultisample(i.RENDERBUFFER,Qt(y),ft,y.width,y.height):i.renderbufferStorage(i.RENDERBUFFER,ft,y.width,y.height),i.framebufferRenderbuffer(i.FRAMEBUFFER,pt,i.RENDERBUFFER,T)}else{const R=y.textures;for(let J=0;J<R.length;J++){const ft=R[J],pt=r.convert(ft.format,ft.colorSpace),W=r.convert(ft.type),et=x(ft.internalFormat,pt,W,ft.normalized,ft.colorSpace);Yt(y)?o.renderbufferStorageMultisampleEXT(i.RENDERBUFFER,Qt(y),et,y.width,y.height):G?i.renderbufferStorageMultisample(i.RENDERBUFFER,Qt(y),et,y.width,y.height):i.renderbufferStorage(i.RENDERBUFFER,et,y.width,y.height)}}i.bindRenderbuffer(i.RENDERBUFFER,null)}function Wt(T,y,G){const R=y.isWebGLCubeRenderTarget===!0;if(e.bindFramebuffer(i.FRAMEBUFFER,T),!(y.depthTexture&&y.depthTexture.isDepthTexture))throw new Error("THREE.WebGLTextures: renderTarget.depthTexture must be an instance of THREE.DepthTexture.");const J=n.get(y.depthTexture);if(J.__renderTarget=y,(!J.__webglTexture||y.depthTexture.image.width!==y.width||y.depthTexture.image.height!==y.height)&&(y.depthTexture.image.width=y.width,y.depthTexture.image.height=y.height,y.depthTexture.needsUpdate=!0),R){if(J.__webglInit===void 0&&(J.__webglInit=!0,y.depthTexture.addEventListener("dispose",C)),J.__webglTexture===void 0){J.__webglTexture=i.createTexture(),e.bindTexture(i.TEXTURE_CUBE_MAP,J.__webglTexture),Zt(i.TEXTURE_CUBE_MAP,y.depthTexture);const At=r.convert(y.depthTexture.format),Gt=r.convert(y.depthTexture.type);let yt;y.depthTexture.format===ei?yt=i.DEPTH_COMPONENT24:y.depthTexture.format===Ii&&(yt=i.DEPTH24_STENCIL8);for(let mt=0;mt<6;mt++)i.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+mt,0,yt,y.width,y.height,0,At,Gt,null)}}else at(y.depthTexture,0);const ft=J.__webglTexture,pt=Qt(y),W=R?i.TEXTURE_CUBE_MAP_POSITIVE_X+G:i.TEXTURE_2D,et=y.depthTexture.format===Ii?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT;if(y.depthTexture.format===ei)Yt(y)?o.framebufferTexture2DMultisampleEXT(i.FRAMEBUFFER,et,W,ft,0,pt):i.framebufferTexture2D(i.FRAMEBUFFER,et,W,ft,0);else if(y.depthTexture.format===Ii)Yt(y)?o.framebufferTexture2DMultisampleEXT(i.FRAMEBUFFER,et,W,ft,0,pt):i.framebufferTexture2D(i.FRAMEBUFFER,et,W,ft,0);else throw new Error("THREE.WebGLTextures: Unknown depthTexture format.")}function Z(T){const y=n.get(T),G=T.isWebGLCubeRenderTarget===!0;if(y.__boundDepthTexture!==T.depthTexture){const R=T.depthTexture;if(y.__depthDisposeCallback&&y.__depthDisposeCallback(),R){const J=()=>{delete y.__boundDepthTexture,delete y.__depthDisposeCallback,R.removeEventListener("dispose",J)};R.addEventListener("dispose",J),y.__depthDisposeCallback=J}y.__boundDepthTexture=R}if(T.depthTexture&&!y.__autoAllocateDepthBuffer)if(G)for(let R=0;R<6;R++)Wt(y.__webglFramebuffer[R],T,R);else{const R=T.texture.mipmaps;R&&R.length>0?Wt(y.__webglFramebuffer[0],T,0):Wt(y.__webglFramebuffer,T,0)}else if(G){y.__webglDepthbuffer=[];for(let R=0;R<6;R++)if(e.bindFramebuffer(i.FRAMEBUFFER,y.__webglFramebuffer[R]),y.__webglDepthbuffer[R]===void 0)y.__webglDepthbuffer[R]=i.createRenderbuffer(),Et(y.__webglDepthbuffer[R],T,!1);else{const J=T.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,ft=y.__webglDepthbuffer[R];i.bindRenderbuffer(i.RENDERBUFFER,ft),i.framebufferRenderbuffer(i.FRAMEBUFFER,J,i.RENDERBUFFER,ft)}}else{const R=T.texture.mipmaps;if(R&&R.length>0?e.bindFramebuffer(i.FRAMEBUFFER,y.__webglFramebuffer[0]):e.bindFramebuffer(i.FRAMEBUFFER,y.__webglFramebuffer),y.__webglDepthbuffer===void 0)y.__webglDepthbuffer=i.createRenderbuffer(),Et(y.__webglDepthbuffer,T,!1);else{const J=T.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,ft=y.__webglDepthbuffer;i.bindRenderbuffer(i.RENDERBUFFER,ft),i.framebufferRenderbuffer(i.FRAMEBUFFER,J,i.RENDERBUFFER,ft)}}e.bindFramebuffer(i.FRAMEBUFFER,null)}function ot(T,y,G){const R=n.get(T);y!==void 0&&ct(R.__webglFramebuffer,T,T.texture,i.COLOR_ATTACHMENT0,i.TEXTURE_2D,0),G!==void 0&&Z(T)}function j(T){const y=T.texture,G=n.get(T),R=n.get(y);T.addEventListener("dispose",_);const J=T.textures,ft=T.isWebGLCubeRenderTarget===!0,pt=J.length>1;if(pt||(R.__webglTexture===void 0&&(R.__webglTexture=i.createTexture()),R.__version=y.version,a.memory.textures++),ft){G.__webglFramebuffer=[];for(let W=0;W<6;W++)if(y.mipmaps&&y.mipmaps.length>0){G.__webglFramebuffer[W]=[];for(let et=0;et<y.mipmaps.length;et++)G.__webglFramebuffer[W][et]=i.createFramebuffer()}else G.__webglFramebuffer[W]=i.createFramebuffer()}else{if(y.mipmaps&&y.mipmaps.length>0){G.__webglFramebuffer=[];for(let W=0;W<y.mipmaps.length;W++)G.__webglFramebuffer[W]=i.createFramebuffer()}else G.__webglFramebuffer=i.createFramebuffer();if(pt)for(let W=0,et=J.length;W<et;W++){const At=n.get(J[W]);At.__webglTexture===void 0&&(At.__webglTexture=i.createTexture(),a.memory.textures++)}if(T.samples>0&&Yt(T)===!1){G.__webglMultisampledFramebuffer=i.createFramebuffer(),G.__webglColorRenderbuffer=[],e.bindFramebuffer(i.FRAMEBUFFER,G.__webglMultisampledFramebuffer);for(let W=0;W<J.length;W++){const et=J[W];G.__webglColorRenderbuffer[W]=i.createRenderbuffer(),i.bindRenderbuffer(i.RENDERBUFFER,G.__webglColorRenderbuffer[W]);const At=r.convert(et.format,et.colorSpace),Gt=r.convert(et.type),yt=x(et.internalFormat,At,Gt,et.normalized,et.colorSpace,T.isXRRenderTarget===!0),mt=Qt(T);i.renderbufferStorageMultisample(i.RENDERBUFFER,mt,yt,T.width,T.height),i.framebufferRenderbuffer(i.FRAMEBUFFER,i.COLOR_ATTACHMENT0+W,i.RENDERBUFFER,G.__webglColorRenderbuffer[W])}i.bindRenderbuffer(i.RENDERBUFFER,null),T.depthBuffer&&(G.__webglDepthRenderbuffer=i.createRenderbuffer(),Et(G.__webglDepthRenderbuffer,T,!0)),e.bindFramebuffer(i.FRAMEBUFFER,null)}}if(ft){e.bindTexture(i.TEXTURE_CUBE_MAP,R.__webglTexture),Zt(i.TEXTURE_CUBE_MAP,y);for(let W=0;W<6;W++)if(y.mipmaps&&y.mipmaps.length>0)for(let et=0;et<y.mipmaps.length;et++)ct(G.__webglFramebuffer[W][et],T,y,i.COLOR_ATTACHMENT0,i.TEXTURE_CUBE_MAP_POSITIVE_X+W,et);else ct(G.__webglFramebuffer[W],T,y,i.COLOR_ATTACHMENT0,i.TEXTURE_CUBE_MAP_POSITIVE_X+W,0);A(y)&&v(i.TEXTURE_CUBE_MAP),e.unbindTexture()}else if(pt){for(let W=0,et=J.length;W<et;W++){const At=J[W],Gt=n.get(At);let yt=i.TEXTURE_2D;(T.isWebGL3DRenderTarget||T.isWebGLArrayRenderTarget)&&(yt=T.isWebGL3DRenderTarget?i.TEXTURE_3D:i.TEXTURE_2D_ARRAY),e.bindTexture(yt,Gt.__webglTexture),Zt(yt,At),ct(G.__webglFramebuffer,T,At,i.COLOR_ATTACHMENT0+W,yt,0),A(At)&&v(yt)}e.unbindTexture()}else{let W=i.TEXTURE_2D;if((T.isWebGL3DRenderTarget||T.isWebGLArrayRenderTarget)&&(W=T.isWebGL3DRenderTarget?i.TEXTURE_3D:i.TEXTURE_2D_ARRAY),e.bindTexture(W,R.__webglTexture),Zt(W,y),y.mipmaps&&y.mipmaps.length>0)for(let et=0;et<y.mipmaps.length;et++)ct(G.__webglFramebuffer[et],T,y,i.COLOR_ATTACHMENT0,W,et);else ct(G.__webglFramebuffer,T,y,i.COLOR_ATTACHMENT0,W,0);A(y)&&v(W),e.unbindTexture()}T.depthBuffer&&Z(T)}function rt(T){const y=T.textures;for(let G=0,R=y.length;G<R;G++){const J=y[G];if(A(J)){const ft=M(T),pt=n.get(J).__webglTexture;e.bindTexture(ft,pt),v(ft),e.unbindTexture()}}}const ut=[],Bt=[];function vt(T){if(T.samples>0){if(Yt(T)===!1){const y=T.textures,G=T.width,R=T.height;let J=i.COLOR_BUFFER_BIT;const ft=T.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,pt=n.get(T),W=y.length>1;if(W)for(let At=0;At<y.length;At++)e.bindFramebuffer(i.FRAMEBUFFER,pt.__webglMultisampledFramebuffer),i.framebufferRenderbuffer(i.FRAMEBUFFER,i.COLOR_ATTACHMENT0+At,i.RENDERBUFFER,null),e.bindFramebuffer(i.FRAMEBUFFER,pt.__webglFramebuffer),i.framebufferTexture2D(i.DRAW_FRAMEBUFFER,i.COLOR_ATTACHMENT0+At,i.TEXTURE_2D,null,0);e.bindFramebuffer(i.READ_FRAMEBUFFER,pt.__webglMultisampledFramebuffer);const et=T.texture.mipmaps;et&&et.length>0?e.bindFramebuffer(i.DRAW_FRAMEBUFFER,pt.__webglFramebuffer[0]):e.bindFramebuffer(i.DRAW_FRAMEBUFFER,pt.__webglFramebuffer);for(let At=0;At<y.length;At++){if(T.resolveDepthBuffer&&(T.depthBuffer&&(J|=i.DEPTH_BUFFER_BIT),T.stencilBuffer&&T.resolveStencilBuffer&&(J|=i.STENCIL_BUFFER_BIT)),W){i.framebufferRenderbuffer(i.READ_FRAMEBUFFER,i.COLOR_ATTACHMENT0,i.RENDERBUFFER,pt.__webglColorRenderbuffer[At]);const Gt=n.get(y[At]).__webglTexture;i.framebufferTexture2D(i.DRAW_FRAMEBUFFER,i.COLOR_ATTACHMENT0,i.TEXTURE_2D,Gt,0)}i.blitFramebuffer(0,0,G,R,0,0,G,R,J,i.NEAREST),l===!0&&(ut.length=0,Bt.length=0,ut.push(i.COLOR_ATTACHMENT0+At),T.depthBuffer&&T.storeMultisampledDepthBuffer===!1&&(ut.push(ft),Bt.push(ft),i.invalidateFramebuffer(i.DRAW_FRAMEBUFFER,Bt)),i.invalidateFramebuffer(i.READ_FRAMEBUFFER,ut))}if(e.bindFramebuffer(i.READ_FRAMEBUFFER,null),e.bindFramebuffer(i.DRAW_FRAMEBUFFER,null),W)for(let At=0;At<y.length;At++){e.bindFramebuffer(i.FRAMEBUFFER,pt.__webglMultisampledFramebuffer),i.framebufferRenderbuffer(i.FRAMEBUFFER,i.COLOR_ATTACHMENT0+At,i.RENDERBUFFER,pt.__webglColorRenderbuffer[At]);const Gt=n.get(y[At]).__webglTexture;e.bindFramebuffer(i.FRAMEBUFFER,pt.__webglFramebuffer),i.framebufferTexture2D(i.DRAW_FRAMEBUFFER,i.COLOR_ATTACHMENT0+At,i.TEXTURE_2D,Gt,0)}e.bindFramebuffer(i.DRAW_FRAMEBUFFER,pt.__webglMultisampledFramebuffer)}else if(T.depthBuffer&&T.storeMultisampledDepthBuffer===!1&&l){const y=T.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT;i.invalidateFramebuffer(i.DRAW_FRAMEBUFFER,[y])}}}function Qt(T){return Math.min(s.maxSamples,T.samples)}function Yt(T){const y=n.get(T);return T.samples>0&&t.has("WEBGL_multisampled_render_to_texture")===!0&&y.__useRenderToTexture!==!1}function D(T){const y=a.render.frame;h.get(T)!==y&&(h.set(T,y),T.update())}function Jt(T,y){const G=T.colorSpace,R=T.format,J=T.type;return T.isCompressedTexture===!0||T.isVideoTexture===!0||G!==ra&&G!==Xn&&(ae.getTransfer(G)===pe?(R!==Je||J!==en)&&_t("WebGLTextures: sRGB encoded textures have to use RGBAFormat and UnsignedByteType."):Ht("WebGLTextures: Unsupported texture color space:",G)),y}function Dt(T){return typeof HTMLImageElement<"u"&&T instanceof HTMLImageElement?(c.width=T.naturalWidth||T.width,c.height=T.naturalHeight||T.height):typeof VideoFrame<"u"&&T instanceof VideoFrame?(c.width=T.displayWidth,c.height=T.displayHeight):(c.width=T.width,c.height=T.height),c}this.allocateTextureUnit=q,this.resetTextureUnits=k,this.getTextureUnits=L,this.setTextureUnits=O,this.setTexture2D=at,this.setTexture2DArray=Q,this.setTexture3D=$,this.setTextureCube=st,this.rebindTextures=ot,this.setupRenderTarget=j,this.updateRenderTargetMipmap=rt,this.updateMultisampleRenderTarget=vt,this.setupDepthRenderbuffer=Z,this.setupFrameBufferTexture=ct,this.useMultisampledRTT=Yt,this.isReversedDepthBuffer=function(){return e.buffers.depth.getReversed()}}function Tm(i,t){function e(n,s=Xn){let r;const a=ae.getTransfer(s);if(n===en)return i.UNSIGNED_BYTE;if(n===Ll)return i.UNSIGNED_SHORT_4_4_4_4;if(n===Fl)return i.UNSIGNED_SHORT_5_5_5_1;if(n===hu)return i.UNSIGNED_INT_5_9_9_9_REV;if(n===uu)return i.UNSIGNED_INT_10F_11F_11F_REV;if(n===lu)return i.BYTE;if(n===cu)return i.SHORT;if(n===ar)return i.UNSIGNED_SHORT;if(n===Pl)return i.INT;if(n===Tn)return i.UNSIGNED_INT;if(n===sn)return i.FLOAT;if(n===Gn)return i.HALF_FLOAT;if(n===fu)return i.ALPHA;if(n===du)return i.RGB;if(n===Je)return i.RGBA;if(n===ei)return i.DEPTH_COMPONENT;if(n===Ii)return i.DEPTH_STENCIL;if(n===Ul)return i.RED;if(n===va)return i.RED_INTEGER;if(n===Fi)return i.RG;if(n===Nl)return i.RG_INTEGER;if(n===Ol)return i.RGBA_INTEGER;if(n===Vr||n===Wr||n===Yr||n===Xr)if(a===pe)if(r=t.get("WEBGL_compressed_texture_s3tc_srgb"),r!==null){if(n===Vr)return r.COMPRESSED_SRGB_S3TC_DXT1_EXT;if(n===Wr)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT;if(n===Yr)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT;if(n===Xr)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT}else return null;else if(r=t.get("WEBGL_compressed_texture_s3tc"),r!==null){if(n===Vr)return r.COMPRESSED_RGB_S3TC_DXT1_EXT;if(n===Wr)return r.COMPRESSED_RGBA_S3TC_DXT1_EXT;if(n===Yr)return r.COMPRESSED_RGBA_S3TC_DXT3_EXT;if(n===Xr)return r.COMPRESSED_RGBA_S3TC_DXT5_EXT}else return null;if(n===Ho||n===Vo||n===Wo||n===Yo)if(r=t.get("WEBGL_compressed_texture_pvrtc"),r!==null){if(n===Ho)return r.COMPRESSED_RGB_PVRTC_4BPPV1_IMG;if(n===Vo)return r.COMPRESSED_RGB_PVRTC_2BPPV1_IMG;if(n===Wo)return r.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG;if(n===Yo)return r.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG}else return null;if(n===Xo||n===qo||n===Ko||n===Jo||n===Zo||n===ea||n===$o)if(r=t.get("WEBGL_compressed_texture_etc"),r!==null){if(n===Xo||n===qo)return a===pe?r.COMPRESSED_SRGB8_ETC2:r.COMPRESSED_RGB8_ETC2;if(n===Ko)return a===pe?r.COMPRESSED_SRGB8_ALPHA8_ETC2_EAC:r.COMPRESSED_RGBA8_ETC2_EAC;if(n===Jo)return r.COMPRESSED_R11_EAC;if(n===Zo)return r.COMPRESSED_SIGNED_R11_EAC;if(n===ea)return r.COMPRESSED_RG11_EAC;if(n===$o)return r.COMPRESSED_SIGNED_RG11_EAC}else return null;if(n===jo||n===tl||n===el||n===nl||n===il||n===sl||n===rl||n===al||n===ol||n===ll||n===cl||n===hl||n===ul||n===fl)if(r=t.get("WEBGL_compressed_texture_astc"),r!==null){if(n===jo)return a===pe?r.COMPRESSED_SRGB8_ALPHA8_ASTC_4x4_KHR:r.COMPRESSED_RGBA_ASTC_4x4_KHR;if(n===tl)return a===pe?r.COMPRESSED_SRGB8_ALPHA8_ASTC_5x4_KHR:r.COMPRESSED_RGBA_ASTC_5x4_KHR;if(n===el)return a===pe?r.COMPRESSED_SRGB8_ALPHA8_ASTC_5x5_KHR:r.COMPRESSED_RGBA_ASTC_5x5_KHR;if(n===nl)return a===pe?r.COMPRESSED_SRGB8_ALPHA8_ASTC_6x5_KHR:r.COMPRESSED_RGBA_ASTC_6x5_KHR;if(n===il)return a===pe?r.COMPRESSED_SRGB8_ALPHA8_ASTC_6x6_KHR:r.COMPRESSED_RGBA_ASTC_6x6_KHR;if(n===sl)return a===pe?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x5_KHR:r.COMPRESSED_RGBA_ASTC_8x5_KHR;if(n===rl)return a===pe?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x6_KHR:r.COMPRESSED_RGBA_ASTC_8x6_KHR;if(n===al)return a===pe?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x8_KHR:r.COMPRESSED_RGBA_ASTC_8x8_KHR;if(n===ol)return a===pe?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x5_KHR:r.COMPRESSED_RGBA_ASTC_10x5_KHR;if(n===ll)return a===pe?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x6_KHR:r.COMPRESSED_RGBA_ASTC_10x6_KHR;if(n===cl)return a===pe?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x8_KHR:r.COMPRESSED_RGBA_ASTC_10x8_KHR;if(n===hl)return a===pe?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x10_KHR:r.COMPRESSED_RGBA_ASTC_10x10_KHR;if(n===ul)return a===pe?r.COMPRESSED_SRGB8_ALPHA8_ASTC_12x10_KHR:r.COMPRESSED_RGBA_ASTC_12x10_KHR;if(n===fl)return a===pe?r.COMPRESSED_SRGB8_ALPHA8_ASTC_12x12_KHR:r.COMPRESSED_RGBA_ASTC_12x12_KHR}else return null;if(n===dl||n===pl||n===Al)if(r=t.get("EXT_texture_compression_bptc"),r!==null){if(n===dl)return a===pe?r.COMPRESSED_SRGB_ALPHA_BPTC_UNORM_EXT:r.COMPRESSED_RGBA_BPTC_UNORM_EXT;if(n===pl)return r.COMPRESSED_RGB_BPTC_SIGNED_FLOAT_EXT;if(n===Al)return r.COMPRESSED_RGB_BPTC_UNSIGNED_FLOAT_EXT}else return null;if(n===ml||n===gl||n===na||n===xl)if(r=t.get("EXT_texture_compression_rgtc"),r!==null){if(n===ml)return r.COMPRESSED_RED_RGTC1_EXT;if(n===gl)return r.COMPRESSED_SIGNED_RED_RGTC1_EXT;if(n===na)return r.COMPRESSED_RED_GREEN_RGTC2_EXT;if(n===xl)return r.COMPRESSED_SIGNED_RED_GREEN_RGTC2_EXT}else return null;return n===or?i.UNSIGNED_INT_24_8:i[n]!==void 0?i[n]:null}return{convert:e}}const fw=`
void main() {

	gl_Position = vec4( position, 1.0 );

}`,dw=`
uniform sampler2DArray depthColor;
uniform float depthWidth;
uniform float depthHeight;

void main() {

	vec2 coord = vec2( gl_FragCoord.x / depthWidth, gl_FragCoord.y / depthHeight );

	if ( coord.x >= 1.0 ) {

		gl_FragDepth = texture( depthColor, vec3( coord.x - 1.0, coord.y, 1 ) ).r;

	} else {

		gl_FragDepth = texture( depthColor, vec3( coord.x, coord.y, 0 ) ).r;

	}

}`;class pw{constructor(){this.texture=null,this.mesh=null,this.depthNear=0,this.depthFar=0}init(t,e){if(this.texture===null){const n=new Mu(t.texture);(t.depthNear!==e.depthNear||t.depthFar!==e.depthFar)&&(this.depthNear=t.depthNear,this.depthFar=t.depthFar),this.texture=n}}getMesh(t){if(this.texture!==null&&this.mesh===null){const e=t.cameras[0].viewport,n=new Sn({vertexShader:fw,fragmentShader:dw,uniforms:{depthColor:{value:this.texture},depthWidth:{value:e.z},depthHeight:{value:e.w}}});this.mesh=new Ce(new mr(20,20),n)}return this.mesh}reset(){this.texture=null,this.mesh=null}getDepthTexture(){return this.texture}}class Aw extends zn{constructor(t,e){super();const n=this;let s=null,r=1,a=null,o="local-floor",l=1,c=null,h=null,f=null,u=null,d=null,p=null;const g=typeof XRWebGLBinding<"u",m=new pw,A={},v=e.getContextAttributes();let M=null,x=null;const S=[],E=[],C=new lt;let _=null,b=null;const B=new Ue;B.viewport=new Ae;const P=new Ue;P.viewport=new Ae;const U=[B,P],k=new Am;let L=null,O=null;this.cameraAutoUpdate=!0,this.enabled=!1,this.isPresenting=!1,this.getController=function(K){let z=S[K];return z===void 0&&(z=new Ro,S[K]=z),z.getTargetRaySpace()},this.getControllerGrip=function(K){let z=S[K];return z===void 0&&(z=new Ro,S[K]=z),z.getGripSpace()},this.getHand=function(K){let z=S[K];return z===void 0&&(z=new Ro,S[K]=z),z.getHandSpace()};function q(K){const z=E.indexOf(K.inputSource);if(z===-1)return;const nt=S[z];nt!==void 0&&(nt.update(K.inputSource,K.frame,c||a),nt.dispatchEvent({type:K.type,data:K.inputSource}))}function Y(){s.removeEventListener("select",q),s.removeEventListener("selectstart",q),s.removeEventListener("selectend",q),s.removeEventListener("squeeze",q),s.removeEventListener("squeezestart",q),s.removeEventListener("squeezeend",q),s.removeEventListener("end",Y),s.removeEventListener("inputsourceschange",at);for(let K=0;K<S.length;K++){const z=E[K];z!==null&&(E[K]=null,S[K].disconnect(z))}L=null,O=null,m.reset();for(const K in A)delete A[K];if(t.setRenderTarget(M),d=null,u=null,f=null,s=null,x=null,Vt.stop(),n.isPresenting=!1,t.setPixelRatio(_),t.setSize(C.width,C.height,!1),b!==null){const K=b.camera;K.fov=b.fov,K.zoom=b.zoom,K.updateProjectionMatrix(),b=null}n.dispatchEvent({type:"sessionend"})}this.setFramebufferScaleFactor=function(K){r=K,n.isPresenting===!0&&_t("WebXRManager: Cannot change framebuffer scale while presenting.")},this.setReferenceSpaceType=function(K){o=K,n.isPresenting===!0&&_t("WebXRManager: Cannot change reference space type while presenting.")},this.getReferenceSpace=function(){return c||a},this.setReferenceSpace=function(K){c=K},this.getBaseLayer=function(){return u!==null?u:d},this.getBinding=function(){return f===null&&g&&(f=new XRWebGLBinding(s,e)),f},this.getFrame=function(){return p},this.getSession=function(){return s},this.setSession=async function(K){if(s=K,s!==null){if(M=t.getRenderTarget(),s.addEventListener("select",q),s.addEventListener("selectstart",q),s.addEventListener("selectend",q),s.addEventListener("squeeze",q),s.addEventListener("squeezestart",q),s.addEventListener("squeezeend",q),s.addEventListener("end",Y),s.addEventListener("inputsourceschange",at),v.xrCompatible!==!0&&await e.makeXRCompatible(),_=t.getPixelRatio(),t.getSize(C),g&&"createProjectionLayer"in XRWebGLBinding.prototype){let nt=null,gt=null,ct=null;v.depth&&(ct=v.stencil?e.DEPTH24_STENCIL8:e.DEPTH_COMPONENT24,nt=v.stencil?Ii:ei,gt=v.stencil?or:Tn);const Et={colorFormat:e.RGBA8,depthFormat:ct,scaleFactor:r};f=this.getBinding(),u=f.createProjectionLayer(Et),s.updateRenderState({layers:[u]}),t.setPixelRatio(1),t.setSize(u.textureWidth,u.textureHeight,!1),x=new pn(u.textureWidth,u.textureHeight,{format:Je,type:en,depthTexture:new hr(u.textureWidth,u.textureHeight,gt,void 0,void 0,void 0,void 0,void 0,void 0,nt),stencilBuffer:v.stencil,colorSpace:t.outputColorSpace,samples:v.antialias?4:0,resolveDepthBuffer:u.ignoreDepthValues===!1,resolveStencilBuffer:u.ignoreDepthValues===!1,storeMultisampledDepthBuffer:u.ignoreDepthValues===!1,storeMultisampledStencilBuffer:u.ignoreDepthValues===!1})}else{const nt={antialias:v.antialias,alpha:!0,depth:v.depth,stencil:v.stencil,framebufferScaleFactor:r};d=new XRWebGLLayer(s,e,nt),s.updateRenderState({baseLayer:d}),t.setPixelRatio(1),t.setSize(d.framebufferWidth,d.framebufferHeight,!1),x=new pn(d.framebufferWidth,d.framebufferHeight,{format:Je,type:en,colorSpace:t.outputColorSpace,stencilBuffer:v.stencil,resolveDepthBuffer:d.ignoreDepthValues===!1,resolveStencilBuffer:d.ignoreDepthValues===!1,storeMultisampledDepthBuffer:d.ignoreDepthValues===!1,storeMultisampledStencilBuffer:d.ignoreDepthValues===!1})}x.isXRRenderTarget=!0,this.setFoveation(l),c=null,a=await s.requestReferenceSpace(o),Vt.setContext(s),Vt.start(),n.isPresenting=!0,n.dispatchEvent({type:"sessionstart"})}},this.getEnvironmentBlendMode=function(){if(s!==null)return s.environmentBlendMode},this.getDepthTexture=function(){return m.getDepthTexture()};function at(K){for(let z=0;z<K.removed.length;z++){const nt=K.removed[z],gt=E.indexOf(nt);gt>=0&&(E[gt]=null,S[gt].disconnect(nt))}for(let z=0;z<K.added.length;z++){const nt=K.added[z];let gt=E.indexOf(nt);if(gt===-1){for(let Et=0;Et<S.length;Et++)if(Et>=E.length){E.push(nt),gt=Et;break}else if(E[Et]===null){E[Et]=nt,gt=Et;break}if(gt===-1)break}const ct=S[gt];ct&&ct.connect(nt)}}const Q=new I,$=new I;function st(K,z,nt){Q.setFromMatrixPosition(z.matrixWorld),$.setFromMatrixPosition(nt.matrixWorld);const gt=Q.distanceTo($),ct=z.projectionMatrix.elements,Et=nt.projectionMatrix.elements,Wt=ct[14]/(ct[10]-1),Z=ct[14]/(ct[10]+1),ot=(ct[9]+1)/ct[5],j=(ct[9]-1)/ct[5],rt=(ct[8]-1)/ct[0],ut=(Et[8]+1)/Et[0],Bt=Wt*rt,vt=Wt*ut,Qt=gt/(-rt+ut),Yt=Qt*-rt;if(z.matrixWorld.decompose(K.position,K.quaternion,K.scale),K.translateX(Yt),K.translateZ(Qt),K.matrixWorld.compose(K.position,K.quaternion,K.scale),K.matrixWorldInverse.copy(K.matrixWorld).invert(),ct[10]===-1)K.projectionMatrix.copy(z.projectionMatrix),K.projectionMatrixInverse.copy(z.projectionMatrixInverse);else{const D=Wt+Qt,Jt=Z+Qt,Dt=Bt-Yt,T=vt+(gt-Yt),y=ot*Z/Jt*D,G=j*Z/Jt*D;K.projectionMatrix.makePerspective(Dt,T,y,G,D,Jt),K.projectionMatrixInverse.copy(K.projectionMatrix).invert()}}function Ut(K,z){z===null?K.matrixWorld.copy(K.matrix):K.matrixWorld.multiplyMatrices(z.matrixWorld,K.matrix),K.matrixWorldInverse.copy(K.matrixWorld).invert()}this.updateCamera=function(K){if(s===null)return;let z=K.near,nt=K.far;m.texture!==null&&(m.depthNear>0&&(z=m.depthNear),m.depthFar>0&&(nt=m.depthFar)),k.near=P.near=B.near=z,k.far=P.far=B.far=nt,(L!==k.near||O!==k.far)&&(s.updateRenderState({depthNear:k.near,depthFar:k.far}),L=k.near,O=k.far),k.layers.mask=K.layers.mask|6,B.layers.mask=k.layers.mask&-5,P.layers.mask=k.layers.mask&-3;const gt=K.parent,ct=k.cameras;Ut(k,gt);for(let Et=0;Et<ct.length;Et++)Ut(ct[Et],gt);ct.length===2?st(k,B,P):k.projectionMatrix.copy(B.projectionMatrix),b===null&&K.isPerspectiveCamera&&(b={camera:K,fov:K.fov,zoom:K.zoom}),Tt(K,k,gt)};function Tt(K,z,nt){nt===null?K.matrix.copy(z.matrixWorld):(K.matrix.copy(nt.matrixWorld),K.matrix.invert(),K.matrix.multiply(z.matrixWorld)),K.matrix.decompose(K.position,K.quaternion,K.scale),K.updateMatrixWorld(!0),K.projectionMatrix.copy(z.projectionMatrix),K.projectionMatrixInverse.copy(z.projectionMatrixInverse),K.isPerspectiveCamera&&(K.fov=lr*2*Math.atan(1/K.projectionMatrix.elements[5]),K.zoom=1)}this.getCamera=function(){return k},this.getFoveation=function(){if(!(u===null&&d===null))return l},this.setFoveation=function(K){l=K,u!==null&&(u.fixedFoveation=K),d!==null&&d.fixedFoveation!==void 0&&(d.fixedFoveation=K)},this.hasDepthSensing=function(){return m.texture!==null},this.getDepthSensingMesh=function(){return m.getMesh(k)},this.getCameraTexture=function(K){return A[K]};let oe=null;function Zt(K,z){if(h=z.getViewerPose(c||a),p=z,h!==null){const nt=h.views;d!==null&&(t.setRenderTargetFramebuffer(x,d.framebuffer),t.setRenderTarget(x));let gt=!1;nt.length!==k.cameras.length&&(k.cameras.length=0,gt=!0);for(let Z=0;Z<nt.length;Z++){const ot=nt[Z];let j=null;if(d!==null)j=d.getViewport(ot);else{const ut=f.getViewSubImage(u,ot);j=ut.viewport,Z===0&&(t.setRenderTargetTextures(x,ut.colorTexture,ut.depthStencilTexture),t.setRenderTarget(x))}let rt=U[Z];rt===void 0&&(rt=new Ue,rt.layers.enable(Z),rt.viewport=new Ae,U[Z]=rt),rt.matrix.fromArray(ot.transform.matrix),rt.matrix.decompose(rt.position,rt.quaternion,rt.scale),rt.projectionMatrix.fromArray(ot.projectionMatrix),rt.projectionMatrixInverse.copy(rt.projectionMatrix).invert(),rt.viewport.set(j.x,j.y,j.width,j.height),Z===0&&(k.matrix.copy(rt.matrix),k.matrix.decompose(k.position,k.quaternion,k.scale)),gt===!0&&k.cameras.push(rt)}const ct=s.enabledFeatures;if(ct&&ct.includes("depth-sensing")&&s.depthUsage=="gpu-optimized"&&g){f=n.getBinding();const Z=f.getDepthInformation(nt[0]);Z&&Z.isValid&&Z.texture&&m.init(Z,s.renderState)}if(ct&&ct.includes("camera-access")&&g){t.state.unbindTexture(),f=n.getBinding();for(let Z=0;Z<nt.length;Z++){const ot=nt[Z].camera;if(ot){let j=A[ot];j||(j=new Mu,A[ot]=j);const rt=f.getCameraImage(ot);j.sourceTexture=rt}}}}for(let nt=0;nt<S.length;nt++){const gt=E[nt],ct=S[nt];gt!==null&&ct!==void 0&&ct.update(gt,z,c||a)}oe&&oe(K,z),z.detectedPlanes&&n.dispatchEvent({type:"planesdetected",data:z}),p=null}const Vt=new Mm;Vt.setAnimationLoop(Zt),this.setAnimationLoop=function(K){oe=K},this.dispose=function(){}}}const mw=new Kt,Bm=new jt;Bm.set(-1,0,0,0,1,0,0,0,1);function gw(i,t){function e(m,A){m.matrixAutoUpdate===!0&&m.updateMatrix(),A.value.copy(m.matrix)}function n(m,A){A.color.getRGB(m.fogColor.value,zA(i)),A.isFog?(m.fogNear.value=A.near,m.fogFar.value=A.far):A.isFogExp2&&(m.fogDensity.value=A.density)}function s(m,A,v,M,x){A.isNodeMaterial?A.uniformsNeedUpdate=!1:A.isMeshBasicMaterial?r(m,A):A.isMeshLambertMaterial?(r(m,A),A.envMap&&(m.envMapIntensity.value=A.envMapIntensity)):A.isMeshToonMaterial?(r(m,A),f(m,A)):A.isMeshPhongMaterial?(r(m,A),h(m,A),A.envMap&&(m.envMapIntensity.value=A.envMapIntensity)):A.isMeshStandardMaterial?(r(m,A),u(m,A),A.isMeshPhysicalMaterial&&d(m,A,x)):A.isMeshMatcapMaterial?(r(m,A),p(m,A)):A.isMeshDepthMaterial?r(m,A):A.isMeshDistanceMaterial?(r(m,A),g(m,A)):A.isMeshNormalMaterial?r(m,A):A.isLineBasicMaterial?(a(m,A),A.isLineDashedMaterial&&o(m,A)):A.isPointsMaterial?l(m,A,v,M):A.isSpriteMaterial?c(m,A):A.isShadowMaterial?(m.color.value.copy(A.color),m.opacity.value=A.opacity):A.isShaderMaterial&&(A.uniformsNeedUpdate=!1)}function r(m,A){m.opacity.value=A.opacity,A.color&&m.diffuse.value.copy(A.color),A.emissive&&m.emissive.value.copy(A.emissive).multiplyScalar(A.emissiveIntensity),A.map&&(m.map.value=A.map,e(A.map,m.mapTransform)),A.alphaMap&&(m.alphaMap.value=A.alphaMap,e(A.alphaMap,m.alphaMapTransform)),A.bumpMap&&(m.bumpMap.value=A.bumpMap,e(A.bumpMap,m.bumpMapTransform),m.bumpScale.value=A.bumpScale,A.side===an&&(m.bumpScale.value*=-1)),A.normalMap&&(m.normalMap.value=A.normalMap,e(A.normalMap,m.normalMapTransform),m.normalScale.value.copy(A.normalScale),A.side===an&&m.normalScale.value.negate()),A.displacementMap&&(m.displacementMap.value=A.displacementMap,e(A.displacementMap,m.displacementMapTransform),m.displacementScale.value=A.displacementScale,m.displacementBias.value=A.displacementBias),A.emissiveMap&&(m.emissiveMap.value=A.emissiveMap,e(A.emissiveMap,m.emissiveMapTransform)),A.specularMap&&(m.specularMap.value=A.specularMap,e(A.specularMap,m.specularMapTransform)),A.alphaTest>0&&(m.alphaTest.value=A.alphaTest);const v=t.get(A),M=v.envMap,x=v.envMapRotation;M&&(m.envMap.value=M,m.envMapRotation.value.setFromMatrix4(mw.makeRotationFromEuler(x)).transpose(),M.isCubeTexture&&M.isRenderTargetTexture===!1&&m.envMapRotation.value.premultiply(Bm),m.reflectivity.value=A.reflectivity,m.ior.value=A.ior,m.refractionRatio.value=A.refractionRatio),A.lightMap&&(m.lightMap.value=A.lightMap,m.lightMapIntensity.value=A.lightMapIntensity,e(A.lightMap,m.lightMapTransform)),A.aoMap&&(m.aoMap.value=A.aoMap,m.aoMapIntensity.value=A.aoMapIntensity,e(A.aoMap,m.aoMapTransform))}function a(m,A){m.diffuse.value.copy(A.color),m.opacity.value=A.opacity,A.map&&(m.map.value=A.map,e(A.map,m.mapTransform))}function o(m,A){m.dashSize.value=A.dashSize,m.totalSize.value=A.dashSize+A.gapSize,m.scale.value=A.scale}function l(m,A,v,M){m.diffuse.value.copy(A.color),m.opacity.value=A.opacity,m.size.value=A.size*v,m.scale.value=M*.5,A.map&&(m.map.value=A.map,e(A.map,m.uvTransform)),A.alphaMap&&(m.alphaMap.value=A.alphaMap,e(A.alphaMap,m.alphaMapTransform)),A.alphaTest>0&&(m.alphaTest.value=A.alphaTest)}function c(m,A){m.diffuse.value.copy(A.color),m.opacity.value=A.opacity,m.rotation.value=A.rotation,A.map&&(m.map.value=A.map,e(A.map,m.mapTransform)),A.alphaMap&&(m.alphaMap.value=A.alphaMap,e(A.alphaMap,m.alphaMapTransform)),A.alphaTest>0&&(m.alphaTest.value=A.alphaTest)}function h(m,A){m.specular.value.copy(A.specular),m.shininess.value=Math.max(A.shininess,1e-4)}function f(m,A){A.gradientMap&&(m.gradientMap.value=A.gradientMap)}function u(m,A){m.metalness.value=A.metalness,A.metalnessMap&&(m.metalnessMap.value=A.metalnessMap,e(A.metalnessMap,m.metalnessMapTransform)),m.roughness.value=A.roughness,A.roughnessMap&&(m.roughnessMap.value=A.roughnessMap,e(A.roughnessMap,m.roughnessMapTransform)),A.envMap&&(m.envMapIntensity.value=A.envMapIntensity)}function d(m,A,v){m.ior.value=A.ior,A.sheen>0&&(m.sheenColor.value.copy(A.sheenColor).multiplyScalar(A.sheen),m.sheenRoughness.value=A.sheenRoughness,A.sheenColorMap&&(m.sheenColorMap.value=A.sheenColorMap,e(A.sheenColorMap,m.sheenColorMapTransform)),A.sheenRoughnessMap&&(m.sheenRoughnessMap.value=A.sheenRoughnessMap,e(A.sheenRoughnessMap,m.sheenRoughnessMapTransform))),A.clearcoat>0&&(m.clearcoat.value=A.clearcoat,m.clearcoatRoughness.value=A.clearcoatRoughness,A.clearcoatMap&&(m.clearcoatMap.value=A.clearcoatMap,e(A.clearcoatMap,m.clearcoatMapTransform)),A.clearcoatRoughnessMap&&(m.clearcoatRoughnessMap.value=A.clearcoatRoughnessMap,e(A.clearcoatRoughnessMap,m.clearcoatRoughnessMapTransform)),A.clearcoatNormalMap&&(m.clearcoatNormalMap.value=A.clearcoatNormalMap,e(A.clearcoatNormalMap,m.clearcoatNormalMapTransform),m.clearcoatNormalScale.value.copy(A.clearcoatNormalScale),A.side===an&&m.clearcoatNormalScale.value.negate())),A.dispersion>0&&(m.dispersion.value=A.dispersion),A.retroreflectivity>0&&(m.retroreflectivity.value=A.retroreflectivity),A.iridescence>0&&(m.iridescence.value=A.iridescence,m.iridescenceIOR.value=A.iridescenceIOR,m.iridescenceThicknessMinimum.value=A.iridescenceThicknessRange[0],m.iridescenceThicknessMaximum.value=A.iridescenceThicknessRange[1],A.iridescenceMap&&(m.iridescenceMap.value=A.iridescenceMap,e(A.iridescenceMap,m.iridescenceMapTransform)),A.iridescenceThicknessMap&&(m.iridescenceThicknessMap.value=A.iridescenceThicknessMap,e(A.iridescenceThicknessMap,m.iridescenceThicknessMapTransform))),A.transmission>0&&(m.transmission.value=A.transmission,m.transmissionSamplerMap.value=v.texture,m.transmissionSamplerSize.value.set(v.width,v.height),A.transmissionMap&&(m.transmissionMap.value=A.transmissionMap,e(A.transmissionMap,m.transmissionMapTransform)),m.thickness.value=A.thickness,A.thicknessMap&&(m.thicknessMap.value=A.thicknessMap,e(A.thicknessMap,m.thicknessMapTransform)),m.attenuationDistance.value=A.attenuationDistance,m.attenuationColor.value.copy(A.attenuationColor)),A.anisotropy>0&&(m.anisotropyVector.value.set(A.anisotropy*Math.cos(A.anisotropyRotation),A.anisotropy*Math.sin(A.anisotropyRotation)),A.anisotropyMap&&(m.anisotropyMap.value=A.anisotropyMap,e(A.anisotropyMap,m.anisotropyMapTransform))),m.specularIntensity.value=A.specularIntensity,m.specularColor.value.copy(A.specularColor),A.specularColorMap&&(m.specularColorMap.value=A.specularColorMap,e(A.specularColorMap,m.specularColorMapTransform)),A.specularIntensityMap&&(m.specularIntensityMap.value=A.specularIntensityMap,e(A.specularIntensityMap,m.specularIntensityMapTransform))}function p(m,A){A.matcap&&(m.matcap.value=A.matcap)}function g(m,A){const v=t.get(A).light;m.referencePosition.value.setFromMatrixPosition(v.matrixWorld),m.nearDistance.value=v.shadow.camera.near,m.farDistance.value=v.shadow.camera.far}return{refreshFogUniforms:n,refreshMaterialUniforms:s}}function xw(i,t,e,n){let s={},r={},a=[];const o=i.getParameter(i.MAX_UNIFORM_BUFFER_BINDINGS);function l(x,S){const E=S.program;n.uniformBlockBinding(x,E)}function c(x,S){let E=s[x.id];E===void 0&&(m(x),E=h(x),s[x.id]=E,x.addEventListener("dispose",v));const C=S.program;n.updateUBOMapping(x,C);const _=t.render.frame;r[x.id]!==_&&(u(x),r[x.id]=_)}function h(x){const S=f();x.__bindingPointIndex=S;const E=i.createBuffer(),C=x.__size,_=x.usage;return i.bindBuffer(i.UNIFORM_BUFFER,E),i.bufferData(i.UNIFORM_BUFFER,C,_),i.bindBuffer(i.UNIFORM_BUFFER,null),i.bindBufferBase(i.UNIFORM_BUFFER,S,E),E}function f(){for(let x=0;x<o;x++)if(a.indexOf(x)===-1)return a.push(x),x;return Ht("WebGLRenderer: Maximum number of simultaneously usable uniforms groups reached."),0}function u(x){const S=s[x.id],E=x.uniforms,C=x.__cache;i.bindBuffer(i.UNIFORM_BUFFER,S);for(let _=0,b=E.length;_<b;_++){const B=E[_];if(Array.isArray(B))for(let P=0,U=B.length;P<U;P++)d(B[P],_,P,C);else d(B,_,0,C)}i.bindBuffer(i.UNIFORM_BUFFER,null)}function d(x,S,E,C){if(g(x,S,E,C)===!0){const _=x.__offset,b=x.value;if(Array.isArray(b)){let B=0;for(let P=0;P<b.length;P++){const U=b[P],k=A(U);p(U,x.__data,B),typeof U!="number"&&typeof U!="boolean"&&!U.isMatrix3&&!ArrayBuffer.isView(U)&&(B+=k.storage/Float32Array.BYTES_PER_ELEMENT)}}else p(b,x.__data,0);i.bufferSubData(i.UNIFORM_BUFFER,_,x.__data)}}function p(x,S,E){typeof x=="number"||typeof x=="boolean"?S[0]=x:x.isMatrix3?(S[0]=x.elements[0],S[1]=x.elements[1],S[2]=x.elements[2],S[3]=0,S[4]=x.elements[3],S[5]=x.elements[4],S[6]=x.elements[5],S[7]=0,S[8]=x.elements[6],S[9]=x.elements[7],S[10]=x.elements[8],S[11]=0):ArrayBuffer.isView(x)?S.set(new x.constructor(x.buffer,x.byteOffset,S.length)):x.toArray(S,E)}function g(x,S,E,C){const _=x.value,b=S+"_"+E;if(C[b]===void 0)return typeof _=="number"||typeof _=="boolean"?C[b]=_:ArrayBuffer.isView(_)?C[b]=_.slice():C[b]=_.clone(),!0;{const B=C[b];if(typeof _=="number"||typeof _=="boolean"){if(B!==_)return C[b]=_,!0}else{if(ArrayBuffer.isView(_))return!0;if(B.equals(_)===!1)return B.copy(_),!0}}return!1}function m(x){const S=x.uniforms;let E=0;const C=16;for(let b=0,B=S.length;b<B;b++){const P=Array.isArray(S[b])?S[b]:[S[b]];for(let U=0,k=P.length;U<k;U++){const L=P[U],O=Array.isArray(L.value)?L.value:[L.value];for(let q=0,Y=O.length;q<Y;q++){const at=O[q],Q=A(at),$=E%C,st=$%Q.boundary,Ut=$+st;E+=st,Ut!==0&&C-Ut<Q.storage&&(E+=C-Ut),L.__data=new Float32Array(Q.storage/Float32Array.BYTES_PER_ELEMENT),L.__offset=E,E+=Q.storage}}}const _=E%C;return _>0&&(E+=C-_),x.__size=E,x.__cache={},this}function A(x){const S={boundary:0,storage:0};return typeof x=="number"||typeof x=="boolean"?(S.boundary=4,S.storage=4):x.isVector2?(S.boundary=8,S.storage=8):x.isVector3||x.isColor?(S.boundary=16,S.storage=12):x.isVector4?(S.boundary=16,S.storage=16):x.isMatrix3?(S.boundary=48,S.storage=48):x.isMatrix4?(S.boundary=64,S.storage=64):x.isTexture?_t("WebGLRenderer: Texture samplers can not be part of an uniforms group."):ArrayBuffer.isView(x)?(S.boundary=16,S.storage=x.byteLength):_t("WebGLRenderer: Unsupported uniform value type.",x),S}function v(x){const S=x.target;S.removeEventListener("dispose",v);const E=a.indexOf(S.__bindingPointIndex);a.splice(E,1),i.deleteBuffer(s[S.id]),delete s[S.id],delete r[S.id]}function M(){for(const x in s)i.deleteBuffer(s[x]);a=[],s={},r={}}return{bind:l,update:c,dispose:M}}const _w=new Uint16Array([12469,15057,12620,14925,13266,14620,13807,14376,14323,13990,14545,13625,14713,13328,14840,12882,14931,12528,14996,12233,15039,11829,15066,11525,15080,11295,15085,10976,15082,10705,15073,10495,13880,14564,13898,14542,13977,14430,14158,14124,14393,13732,14556,13410,14702,12996,14814,12596,14891,12291,14937,11834,14957,11489,14958,11194,14943,10803,14921,10506,14893,10278,14858,9960,14484,14039,14487,14025,14499,13941,14524,13740,14574,13468,14654,13106,14743,12678,14818,12344,14867,11893,14889,11509,14893,11180,14881,10751,14852,10428,14812,10128,14765,9754,14712,9466,14764,13480,14764,13475,14766,13440,14766,13347,14769,13070,14786,12713,14816,12387,14844,11957,14860,11549,14868,11215,14855,10751,14825,10403,14782,10044,14729,9651,14666,9352,14599,9029,14967,12835,14966,12831,14963,12804,14954,12723,14936,12564,14917,12347,14900,11958,14886,11569,14878,11247,14859,10765,14828,10401,14784,10011,14727,9600,14660,9289,14586,8893,14508,8533,15111,12234,15110,12234,15104,12216,15092,12156,15067,12010,15028,11776,14981,11500,14942,11205,14902,10752,14861,10393,14812,9991,14752,9570,14682,9252,14603,8808,14519,8445,14431,8145,15209,11449,15208,11451,15202,11451,15190,11438,15163,11384,15117,11274,15055,10979,14994,10648,14932,10343,14871,9936,14803,9532,14729,9218,14645,8742,14556,8381,14461,8020,14365,7603,15273,10603,15272,10607,15267,10619,15256,10631,15231,10614,15182,10535,15118,10389,15042,10167,14963,9787,14883,9447,14800,9115,14710,8665,14615,8318,14514,7911,14411,7507,14279,7198,15314,9675,15313,9683,15309,9712,15298,9759,15277,9797,15229,9773,15166,9668,15084,9487,14995,9274,14898,8910,14800,8539,14697,8234,14590,7790,14479,7409,14367,7067,14178,6621,15337,8619,15337,8631,15333,8677,15325,8769,15305,8871,15264,8940,15202,8909,15119,8775,15022,8565,14916,8328,14804,8009,14688,7614,14569,7287,14448,6888,14321,6483,14088,6171,15350,7402,15350,7419,15347,7480,15340,7613,15322,7804,15287,7973,15229,8057,15148,8012,15046,7846,14933,7611,14810,7357,14682,7069,14552,6656,14421,6316,14251,5948,14007,5528,15356,5942,15356,5977,15353,6119,15348,6294,15332,6551,15302,6824,15249,7044,15171,7122,15070,7050,14949,6861,14818,6611,14679,6349,14538,6067,14398,5651,14189,5311,13935,4958,15359,4123,15359,4153,15356,4296,15353,4646,15338,5160,15311,5508,15263,5829,15188,6042,15088,6094,14966,6001,14826,5796,14678,5543,14527,5287,14377,4985,14133,4586,13869,4257,15360,1563,15360,1642,15358,2076,15354,2636,15341,3350,15317,4019,15273,4429,15203,4732,15105,4911,14981,4932,14836,4818,14679,4621,14517,4386,14359,4156,14083,3795,13808,3437,15360,122,15360,137,15358,285,15355,636,15344,1274,15322,2177,15281,2765,15215,3223,15120,3451,14995,3569,14846,3567,14681,3466,14511,3305,14344,3121,14037,2800,13753,2467,15360,0,15360,1,15359,21,15355,89,15346,253,15325,479,15287,796,15225,1148,15133,1492,15008,1749,14856,1882,14685,1886,14506,1783,14324,1608,13996,1398,13702,1183]);let Yn=null;function vw(){return Yn===null&&(Yn=new Mn(_w,16,16,Fi,Gn),Yn.name="DFG_LUT",Yn.minFilter=xe,Yn.magFilter=xe,Yn.wrapS=Ke,Yn.wrapT=Ke,Yn.generateMipmaps=!1,Yn.needsUpdate=!0),Yn}class yw{constructor(t={}){const{canvas:e=AA(),context:n=null,depth:s=!0,stencil:r=!1,alpha:a=!1,antialias:o=!1,premultipliedAlpha:l=!0,preserveDrawingBuffer:c=!1,powerPreference:h="default",failIfMajorPerformanceCaveat:f=!1,reversedDepthBuffer:u=!1,outputBufferType:d=en}=t;this.isWebGLRenderer=!0;let p;if(n!==null){if(typeof WebGLRenderingContext<"u"&&n instanceof WebGLRenderingContext)throw new Error("THREE.WebGLRenderer: WebGL 1 is not supported since r163.");p=n.getContextAttributes().alpha}else p=a;const g=d,m=new Set([Ol,Nl,va]),A=new Set([en,Tn,ar,or,Ll,Fl]),v=new Uint32Array(4),M=new Int32Array(4),x=new I;let S=null,E=null;const C=[],_=[];let b=null;this.domElement=e,this.debug={checkShaderErrors:!0,diagnostics:{keywords:!1},onShaderError:null},this.autoClear=!0,this.autoClearColor=!0,this.autoClearDepth=!0,this.autoClearStencil=!0,this.sortObjects=!0,this.clippingPlanes=[],this.localClippingEnabled=!1,this.toneMapping=Nn,this.toneMappingExposure=1,this.transmissionResolutionScale=1;const B=this;let P=!1,U=null,k=null,L=null,O=null;this._outputColorSpace=un;let q=0,Y=0,at=null,Q=-1,$=null;const st=new Ae,Ut=new Ae;let Tt=null;const oe=new bt(0);let Zt=0,Vt=e.width,K=e.height,z=1,nt=null,gt=null;const ct=new Ae(0,0,Vt,K),Et=new Ae(0,0,Vt,K);let Wt=!1;const Z=new ds;let ot=!1,j=!1;const rt=new Kt,ut=new I,Bt=new Ae,vt={background:null,fog:null,environment:null,overrideMaterial:null,isScene:!0};let Qt=!1;function Yt(){return at===null?z:1}let D=n;function Jt(w,N){return e.getContext(w,N)}let Dt,T,y,G,R,J,ft,pt,W,et,At,Gt,yt,mt,It,kt,qt,F,dt,tt,xt,ht,it;try{const w={alpha:!0,depth:s,stencil:r,antialias:o,premultipliedAlpha:l,preserveDrawingBuffer:c,powerPreference:h,failIfMajorPerformanceCaveat:f};if("setAttribute"in e&&e.setAttribute("data-engine",`three.js r${Rl}`),e.addEventListener("webglcontextlost",ue,!1),e.addEventListener("webglcontextrestored",ne,!1),e.addEventListener("webglcontextcreationerror",Qe,!1),D===null){const N="webgl2";if(D=Jt(N,w),D===null)throw Jt(N)?new Error("THREE.WebGLRenderer: Error creating WebGL context with your selected attributes."):new Error("THREE.WebGLRenderer: Error creating WebGL context.")}Ct()}catch(w){throw e.removeEventListener("webglcontextlost",ue,!1),e.removeEventListener("webglcontextrestored",ne,!1),e.removeEventListener("webglcontextcreationerror",Qe,!1),Ht("WebGLRenderer: "+w.message),w}function Ct(){Dt=new yE(D),Dt.init(),xt=new Tm(D,Dt),T=new uE(D,Dt,t,xt),y=new hw(D,Dt),T.reversedDepthBuffer&&u&&y.buffers.depth.setReversed(!0),k=D.createFramebuffer(),L=D.createFramebuffer(),O=D.createFramebuffer(),G=new SE(D),R=new JS,J=new uw(D,Dt,y,R,T,xt,G),ft=new vE(B),pt=new bv(D),ht=new cE(D,pt),W=new ME(D,pt,G,ht),et=new bE(D,W,pt,ht,G),F=new wE(D,T,J),It=new fE(R),At=new KS(B,ft,Dt,T,ht,It),Gt=new gw(B,R),yt=new $S,mt=new sw(Dt),qt=new lE(B,ft,y,et,p,l),kt=new cw(B,et,T),it=new xw(D,G,T,y),dt=new hE(D,Dt,G),tt=new EE(D,Dt,G),G.programs=At.programs,B.capabilities=T,B.extensions=Dt,B.properties=R,B.renderLists=yt,B.shadowMap=kt,B.state=y,B.info=G}g!==en&&(b=new TE(g,e.width,e.height,o,s,r));const Pt=new Aw(B,D);this.xr=Pt,this.getContext=function(){return D},this.getContextAttributes=function(){return D.getContextAttributes()},this.forceContextLoss=function(){const w=Dt.get("WEBGL_lose_context");w&&w.loseContext()},this.forceContextRestore=function(){const w=Dt.get("WEBGL_lose_context");w&&w.restoreContext()},this.getPixelRatio=function(){return z},this.setPixelRatio=function(w){w!==void 0&&(z=w,this.setSize(Vt,K,!1))},this.getSize=function(w){return w.set(Vt,K)},this.setSize=function(w,N,X=!0){if(Pt.isPresenting){_t("WebGLRenderer: Can't change size while VR device is presenting.");return}Vt=w,K=N,e.width=Math.floor(w*z),e.height=Math.floor(N*z),X===!0&&(e.style.width=w+"px",e.style.height=N+"px"),b!==null&&b.setSize(e.width,e.height),this.setViewport(0,0,w,N)},this.getDrawingBufferSize=function(w){return w.set(Vt*z,K*z).floor()},this.setDrawingBufferSize=function(w,N,X){Vt=w,K=N,z=X,e.width=Math.floor(w*X),e.height=Math.floor(N*X),this.setViewport(0,0,w,N)},this.setEffects=function(w){if(g===en){Ht("WebGLRenderer: setEffects() requires outputBufferType set to HalfFloatType or FloatType.");return}if(w){for(let N=0;N<w.length;N++)if(w[N].isOutputPass===!0){_t("WebGLRenderer: OutputPass is not needed in setEffects(). Tone mapping and color space conversion are applied automatically.");break}}b.setEffects(w||[])},this.getCurrentViewport=function(w){return w.copy(st)},this.getViewport=function(w){return w.copy(ct)},this.setViewport=function(w,N,X,H){w.isVector4?ct.set(w.x,w.y,w.z,w.w):ct.set(w,N,X,H),y.viewport(st.copy(ct).multiplyScalar(z).round())},this.getScissor=function(w){return w.copy(Et)},this.setScissor=function(w,N,X,H){w.isVector4?Et.set(w.x,w.y,w.z,w.w):Et.set(w,N,X,H),y.scissor(Ut.copy(Et).multiplyScalar(z).round())},this.getScissorTest=function(){return Wt},this.setScissorTest=function(w){y.setScissorTest(Wt=w)},this.setOpaqueSort=function(w){nt=w},this.setTransparentSort=function(w){gt=w},this.getClearColor=function(w){return w.copy(qt.getClearColor())},this.setClearColor=function(){qt.setClearColor(...arguments)},this.getClearAlpha=function(){return qt.getClearAlpha()},this.setClearAlpha=function(){qt.setClearAlpha(...arguments)},this.clear=function(w=!0,N=!0,X=!0){let H=0;if(w){let V=!1;if(at!==null){const wt=at.texture.format;V=m.has(wt)}if(V){const wt=at.texture.type,Lt=A.has(wt),St=qt.getClearColor(),Nt=qt.getClearAlpha(),zt=St.r,se=St.g,re=St.b;Lt?(v[0]=zt,v[1]=se,v[2]=re,v[3]=Nt,D.clearBufferuiv(D.COLOR,0,v)):(M[0]=zt,M[1]=se,M[2]=re,M[3]=Nt,D.clearBufferiv(D.COLOR,0,M))}else H|=D.COLOR_BUFFER_BIT}N&&(H|=D.DEPTH_BUFFER_BIT,this.state.buffers.depth.setMask(!0)),X&&(H|=D.STENCIL_BUFFER_BIT,this.state.buffers.stencil.setMask(4294967295)),H!==0&&D.clear(H)},this.clearColor=function(){this.clear(!0,!1,!1)},this.clearDepth=function(){this.clear(!1,!0,!1)},this.clearStencil=function(){this.clear(!1,!1,!0)},this.setNodesHandler=function(w){w.setRenderer(this),U=w},this.dispose=function(){e.removeEventListener("webglcontextlost",ue,!1),e.removeEventListener("webglcontextrestored",ne,!1),e.removeEventListener("webglcontextcreationerror",Qe,!1),qt.dispose(),yt.dispose(),mt.dispose(),R.dispose(),ft.dispose(),et.dispose(),ht.dispose(),it.dispose(),At.dispose(),Pt.dispose(),Pt.removeEventListener("sessionstart",tf),Pt.removeEventListener("sessionend",ef),Hi.stop()};function ue(w){w.preventDefault(),la("WebGLRenderer: Context Lost."),P=!0}function ne(){la("WebGLRenderer: Context Restored."),P=!1;const w=G.autoReset,N=kt.enabled,X=kt.autoUpdate,H=kt.needsUpdate,V=kt.type;Ct(),G.autoReset=w,kt.enabled=N,kt.autoUpdate=X,kt.needsUpdate=H,kt.type=V}function Qe(w){Ht("WebGLRenderer: A WebGL context could not be created. Reason: ",w.statusMessage)}function ze(w){const N=w.target;N.removeEventListener("dispose",ze),Ra(N)}function Ra(w){_s(w),R.remove(w)}function _s(w){const N=R.get(w).programs;N!==void 0&&(N.forEach(function(X){At.releaseProgram(X)}),w.isShaderMaterial&&At.releaseShaderCache(w))}this.renderBufferDirect=function(w,N,X,H,V,wt){N===null&&(N=vt);const Lt=V.isMesh&&V.matrixWorld.determinantAffine()<0,St=xg(w,N,X,H,V);y.setMaterial(H,Lt);let Nt=X.index,zt=1;if(H.wireframe===!0){if(Nt=W.getWireframeAttribute(X),Nt===void 0)return;zt=2}const se=X.drawRange,re=X.attributes.position;let Ot=se.start*zt,de=(se.start+se.count)*zt;wt!==null&&(Ot=Math.max(Ot,wt.start*zt),de=Math.min(de,(wt.start+wt.count)*zt)),Nt!==null?(Ot=Math.max(Ot,0),de=Math.min(de,Nt.count)):re!=null&&(Ot=Math.max(Ot,0),de=Math.min(de,re.count));const Te=de-Ot;if(Te<0||Te===1/0)return;ht.setup(V,H,St,X,Nt);let ve,ge=dt;if(Nt!==null&&(ve=pt.get(Nt),ge=tt,ge.setIndex(ve)),V.isMesh)H.wireframe===!0?(y.setLineWidth(H.wireframeLinewidth*Yt()),ge.setMode(D.LINES)):ge.setMode(D.TRIANGLES);else if(V.isLine){let He=H.linewidth;He===void 0&&(He=1),y.setLineWidth(He*Yt()),V.isLineSegments?ge.setMode(D.LINES):V.isLineLoop?ge.setMode(D.LINE_LOOP):ge.setMode(D.LINE_STRIP)}else V.isPoints?ge.setMode(D.POINTS):V.isSprite&&ge.setMode(D.TRIANGLES);if(V.isBatchedMesh)if(Dt.get("WEBGL_multi_draw"))ge.renderMultiDraw(V._multiDrawStarts,V._multiDrawCounts,V._multiDrawCount);else{const He=V._multiDrawStarts,Rt=V._multiDrawCounts,$e=V._multiDrawCount,le=Nt?pt.get(Nt).bytesPerElement:1,wn=R.get(H).currentProgram.getUniforms();for(let Vn=0;Vn<$e;Vn++)wn.setValue(D,"_gl_DrawID",Vn),ge.render(He[Vn]/le,Rt[Vn])}else if(V.isInstancedMesh)ge.renderInstances(Ot,Te,V.count);else if(X.isInstancedBufferGeometry){const He=X._maxInstanceCount!==void 0?X._maxInstanceCount:1/0,Rt=Math.min(X.instanceCount,He);ge.renderInstances(Ot,Te,Rt)}else ge.render(Ot,Te)};function vr(w,N,X,H){U!==null&&w.isNodeMaterial&&U.setObject(H,w),ot===!0&&It.setState(w,X,!1),w.transparent===!0&&w.side===Fn&&w.forceSinglePass===!1?(w.side=an,w.needsUpdate=!0,Pa(w,N,H),w.side=Pi,w.needsUpdate=!0,Pa(w,N,H),w.side=Fn):Pa(w,N,H)}this.compile=function(w,N,X=null){X===null&&(X=w),U!==null&&U.renderStart(w,N,X),E=mt.get(X),E.init(N),_.push(E),X.traverseVisible(function(V){V.isLight&&V.layers.test(N.layers)&&(E.pushLight(V),V.castShadow&&E.pushShadow(V))}),w!==X&&w.traverseVisible(function(V){V.isLight&&V.layers.test(N.layers)&&(E.pushLight(V),V.castShadow&&E.pushShadow(V))}),E.setupLights(),U!==null&&U.updateLights(E.state.lightsArray),j=this.localClippingEnabled,ot=It.init(this.clippingPlanes,j),ot===!0&&It.setGlobalState(this.clippingPlanes,N),U!==null&&kt.render(E.state.shadowsArray,X,N);const H=new Set;return w.traverse(function(V){if(!(V.isMesh||V.isPoints||V.isLine||V.isSprite))return;const wt=V.material;if(wt)if(Array.isArray(wt))for(let Lt=0;Lt<wt.length;Lt++){const St=wt[Lt];vr(St,X,N,V),H.add(St)}else vr(wt,X,N,V),H.add(wt)}),E=_.pop(),U!==null&&U.renderEnd(),H},this.compileAsync=function(w,N,X=null){const H=this.compile(w,N,X);return new Promise(V=>{function wt(){if(H.forEach(function(Lt){const Nt=R.get(Lt).currentProgram;(Nt===void 0||Nt.isReady())&&H.delete(Lt)}),H.size===0){V(w);return}setTimeout(wt,10)}Dt.get("KHR_parallel_shader_compile")!==null?wt():setTimeout(wt,10)})};let vs=null;function _c(w){vs&&vs(w)}function tf(){Hi.stop()}function ef(){Hi.start()}const Hi=new Mm;Hi.setAnimationLoop(_c),typeof self<"u"&&Hi.setContext(self),this.setAnimationLoop=function(w){vs=w,Pt.setAnimationLoop(w),w===null?Hi.stop():Hi.start()},Pt.addEventListener("sessionstart",tf),Pt.addEventListener("sessionend",ef),this.render=function(w,N){if(N!==void 0&&N.isCamera!==!0){Ht("WebGLRenderer.render: camera is not an instance of THREE.Camera.");return}if(P===!0)return;U!==null&&U.renderStart(w,N);const X=Pt.enabled===!0&&Pt.isPresenting===!0,H=b!==null&&(at===null||X)&&b.begin(B,at);if(w.matrixWorldAutoUpdate===!0&&w.updateMatrixWorld(),N.parent===null&&N.matrixWorldAutoUpdate===!0&&N.updateMatrixWorld(),Pt.enabled===!0&&Pt.isPresenting===!0&&(b===null||b.isCompositing()===!1)&&(Pt.cameraAutoUpdate===!0&&Pt.updateCamera(N),N=Pt.getCamera()),w.isScene===!0&&w.onBeforeRender(B,w,N,at),E=mt.get(w,_.length),E.init(N),E.state.textureUnits=J.getTextureUnits(),_.push(E),rt.multiplyMatrices(N.projectionMatrix,N.matrixWorldInverse),Z.setFromProjectionMatrix(rt,vn,N.reversedDepth),j=this.localClippingEnabled,ot=It.init(this.clippingPlanes,j),S=yt.get(w,C.length),S.init(),C.push(S),Pt.enabled===!0&&Pt.isPresenting===!0){const Lt=B.xr.getDepthSensingMesh();Lt!==null&&vc(Lt,N,-1/0,B.sortObjects)}vc(w,N,0,B.sortObjects),S.finish(),U!==null&&U.updateLights(E.state.lightsArray),B.sortObjects===!0&&S.sort(nt,gt),Qt=Pt.enabled===!1||Pt.isPresenting===!1||Pt.hasDepthSensing()===!1,Qt&&qt.addToRenderList(S,w),this.info.render.frame++,this.info.autoReset===!0&&this.info.reset(),ot===!0&&It.beginShadows();const V=E.state.shadowsArray;if(kt.render(V,w,N),ot===!0&&It.endShadows(),(H&&b.hasRenderPass())===!1){const Lt=S.opaque,St=S.transmissive;if(E.setupLights(),N.isArrayCamera){const Nt=N.cameras;if(St.length>0)for(let zt=0,se=Nt.length;zt<se;zt++){const re=Nt[zt];sf(Lt,St,w,re)}Qt&&qt.render(w);for(let zt=0,se=Nt.length;zt<se;zt++){const re=Nt[zt];nf(S,w,re,re.viewport)}}else St.length>0&&sf(Lt,St,w,N),Qt&&qt.render(w),nf(S,w,N)}at!==null&&Y===0&&(J.updateMultisampleRenderTarget(at),J.updateRenderTargetMipmap(at)),H&&b.end(B),w.isScene===!0&&w.onAfterRender(B,w,N),ht.resetDefaultState(),Q=-1,$=null,_.pop(),_.length>0?(E=_[_.length-1],J.setTextureUnits(E.state.textureUnits),ot===!0&&It.setGlobalState(B.clippingPlanes,E.state.camera)):E=null,C.pop(),C.length>0?S=C[C.length-1]:S=null,U!==null&&U.renderEnd()};function vc(w,N,X,H){if(w.visible===!1)return;if(w.layers.test(N.layers)){if(w.isGroup)X=w.renderOrder;else if(w.isLOD)w.autoUpdate===!0&&w.update(N);else if(w.isLightProbeGrid)E.pushLightProbeGrid(w);else if(w.isLight)E.pushLight(w),w.castShadow&&E.pushShadow(w);else if(w.isSprite){if(!w.frustumCulled||w.intersectsFrustum(Z)){H&&Bt.setFromMatrixPosition(w.matrixWorld).applyMatrix4(rt);const Lt=et.update(w),St=w.material;St.visible&&S.push(w,Lt,St,X,Bt.z,null,N)}}else if((w.isMesh||w.isLine||w.isPoints)&&(!w.frustumCulled||w.intersectsFrustum(Z))){const Lt=et.update(w),St=w.material;if(H&&(w.boundingSphere!==void 0?(w.boundingSphere===null&&w.computeBoundingSphere(),Bt.copy(w.boundingSphere.center)):(Lt.boundingSphere===null&&Lt.computeBoundingSphere(),Bt.copy(Lt.boundingSphere.center)),Bt.applyMatrix4(w.matrixWorld).applyMatrix4(rt)),Array.isArray(St)){const Nt=Lt.groups;for(let zt=0,se=Nt.length;zt<se;zt++){const re=Nt[zt],Ot=St[re.materialIndex];Ot&&Ot.visible&&S.push(w,Lt,Ot,X,Bt.z,re,N)}}else St.visible&&S.push(w,Lt,St,X,Bt.z,null,N)}}const wt=w.children;for(let Lt=0,St=wt.length;Lt<St;Lt++)vc(wt[Lt],N,X,H)}function nf(w,N,X,H){const{opaque:V,transmissive:wt,transparent:Lt}=w;E.setupLightsView(X),ot===!0&&It.setGlobalState(B.clippingPlanes,X),H&&y.viewport(st.copy(H)),V.length>0&&Da(V,N,X),wt.length>0&&Da(wt,N,X),Lt.length>0&&Da(Lt,N,X),y.buffers.depth.setTest(!0),y.buffers.depth.setMask(!0),y.buffers.color.setMask(!0),y.setPolygonOffset(!1)}function sf(w,N,X,H){if((X.isScene===!0?X.overrideMaterial:null)!==null)return;if(E.state.transmissionRenderTarget[H.id]===void 0){const Ot=Dt.has("EXT_color_buffer_half_float")||Dt.has("EXT_color_buffer_float");E.state.transmissionRenderTarget[H.id]=new pn(1,1,{generateMipmaps:!0,type:Ot?Gn:en,minFilter:Kn,samples:Math.max(4,T.samples),stencilBuffer:r,resolveDepthBuffer:!1,resolveStencilBuffer:!1,storeMultisampledDepthBuffer:!1,storeMultisampledStencilBuffer:!1,colorSpace:ae.workingColorSpace})}const wt=E.state.transmissionRenderTarget[H.id],Lt=H.viewport||st;wt.setSize(Lt.z*B.transmissionResolutionScale,Lt.w*B.transmissionResolutionScale);const St=B.getRenderTarget(),Nt=B.getActiveCubeFace(),zt=B.getActiveMipmapLevel();B.setRenderTarget(wt),B.getClearColor(oe),Zt=B.getClearAlpha(),Zt<1&&B.setClearColor(16777215,.5),B.clear(),Qt&&qt.render(X);const se=B.toneMapping;B.toneMapping=Nn;const re=H.viewport;if(H.viewport!==void 0&&(H.viewport=void 0),E.setupLightsView(H),ot===!0&&It.setGlobalState(B.clippingPlanes,H),Da(w,X,H),J.updateMultisampleRenderTarget(wt),J.updateRenderTargetMipmap(wt),Dt.has("WEBGL_multisampled_render_to_texture")===!1){let Ot=!1;for(let de=0,Te=N.length;de<Te;de++){const ve=N[de],{object:ge,geometry:He,material:Rt,group:$e}=ve;if(Rt.side===Fn&&ge.layers.test(H.layers)){const le=Rt.side;Rt.side=an,Rt.needsUpdate=!0,rf(ge,X,H,He,Rt,$e),Rt.side=le,Rt.needsUpdate=!0,Ot=!0}}Ot===!0&&(J.updateMultisampleRenderTarget(wt),J.updateRenderTargetMipmap(wt))}B.setRenderTarget(St,Nt,zt),B.setClearColor(oe,Zt),re!==void 0&&(H.viewport=re),B.toneMapping=se}function Da(w,N,X){const H=N.isScene===!0?N.overrideMaterial:null;for(let V=0,wt=w.length;V<wt;V++){const Lt=w[V],{object:St,geometry:Nt,group:zt}=Lt;let se=Lt.material;se.allowOverride===!0&&H!==null&&(se=H),St.layers.test(X.layers)&&rf(St,N,X,Nt,se,zt)}}function rf(w,N,X,H,V,wt){U!==null&&V.isNodeMaterial&&U.setObject(w,V),w.onBeforeRender(B,N,X,H,V,wt),w.modelViewMatrix.multiplyMatrices(X.matrixWorldInverse,w.matrixWorld),w.normalMatrix.getNormalMatrix(w.modelViewMatrix),V.onBeforeRender(B,N,X,H,w,wt),V.transparent===!0&&V.side===Fn&&V.forceSinglePass===!1?(V.side=an,V.needsUpdate=!0,B.renderBufferDirect(X,N,H,V,w,wt),V.side=Pi,V.needsUpdate=!0,B.renderBufferDirect(X,N,H,V,w,wt),V.side=Fn):B.renderBufferDirect(X,N,H,V,w,wt),w.onAfterRender(B,N,X,H,V,wt)}function Pa(w,N,X){N.isScene!==!0&&(N=vt);const H=R.get(w),V=E.state.lights,wt=E.state.shadowsArray,Lt=V.state.version,St=At.getParameters(w,V.state,wt,N,X,E.state.lightProbeGridArray),Nt=At.getProgramCacheKey(St);let zt=H.programs;H.environment=w.isMeshStandardMaterial||w.isMeshLambertMaterial||w.isMeshPhongMaterial?N.environment:null,H.fog=N.fog;const se=w.isMeshStandardMaterial||w.isMeshLambertMaterial&&!w.envMap||w.isMeshPhongMaterial&&!w.envMap;H.envMap=ft.get(w.envMap||H.environment,se),H.envMapRotation=H.environment!==null&&w.envMap===null?N.environmentRotation:w.envMapRotation,zt===void 0&&(w.addEventListener("dispose",ze),zt=new Map,H.programs=zt);let re=zt.get(Nt);if(re!==void 0){if(H.currentProgram===re&&H.lightsStateVersion===Lt)return of(w,St),re}else St.uniforms=At.getUniforms(w),U!==null&&w.isNodeMaterial&&U.build(w,X,St),w.onBeforeCompile(St,B),re=At.acquireProgram(St,Nt),zt.set(Nt,re),H.uniforms=St.uniforms;const Ot=H.uniforms;return(!w.isShaderMaterial&&!w.isRawShaderMaterial||w.clipping===!0)&&(Ot.clippingPlanes=It.uniform),of(w,St),H.needsLights=vg(w),H.lightsStateVersion=Lt,H.needsLights&&(Ot.ambientLightColor.value=V.state.ambient,Ot.lightProbe.value=V.state.probe,Ot.sunLights.value=V.state.sun,Ot.sunLightShadows.value=V.state.sunShadow,Ot.directionalLights.value=V.state.directional,Ot.directionalLightShadows.value=V.state.directionalShadow,Ot.spotLights.value=V.state.spot,Ot.spotLightShadows.value=V.state.spotShadow,Ot.rectAreaLights.value=V.state.rectArea,Ot.ltc_1.value=V.state.rectAreaLTC1,Ot.ltc_2.value=V.state.rectAreaLTC2,Ot.pointLights.value=V.state.point,Ot.pointLightShadows.value=V.state.pointShadow,Ot.hemisphereLights.value=V.state.hemi,Ot.sunShadowMatrix.value=V.state.sunShadowMatrix,Ot.sunShadowCascade.value=V.state.sunShadowCascade,Ot.directionalShadowMatrix.value=V.state.directionalShadowMatrix,Ot.spotLightMatrix.value=V.state.spotLightMatrix,Ot.spotLightMap.value=V.state.spotLightMap,Ot.pointShadowMatrix.value=V.state.pointShadowMatrix),H.lightProbeGrid=E.state.lightProbeGridArray.length>0,H.currentProgram=re,H.uniformsList=null,re}function af(w){if(w.uniformsList===null){const N=w.currentProgram.getUniforms();w.uniformsList=Do.seqWithValue(N.seq,w.uniforms)}return w.uniformsList}function of(w,N){const X=R.get(w);X.outputColorSpace=N.outputColorSpace,X.batching=N.batching,X.batchingColor=N.batchingColor,X.instancing=N.instancing,X.instancingColor=N.instancingColor,X.instancingMorph=N.instancingMorph,X.skinning=N.skinning,X.morphTargets=N.morphTargets,X.morphNormals=N.morphNormals,X.morphColors=N.morphColors,X.morphTargetsCount=N.morphTargetsCount,X.numClippingPlanes=N.numClippingPlanes,X.numIntersection=N.numClipIntersection,X.vertexAlphas=N.vertexAlphas,X.vertexTangents=N.vertexTangents,X.toneMapping=N.toneMapping}function gg(w,N){if(w.length===0)return null;if(w.length===1)return w[0].texture!==null?w[0]:null;x.setFromMatrixPosition(N.matrixWorld);for(let X=0,H=w.length;X<H;X++){const V=w[X];if(V.texture!==null&&V.boundingBox.containsPoint(x))return V}return null}function xg(w,N,X,H,V){N.isScene!==!0&&(N=vt),J.resetTextureUnits();const wt=N.fog,Lt=H.isMeshStandardMaterial||H.isMeshLambertMaterial||H.isMeshPhongMaterial?N.environment:null,St=at===null?B.outputColorSpace:at.isXRRenderTarget===!0?at.texture.colorSpace:ae.workingColorSpace,Nt=H.isMeshStandardMaterial||H.isMeshLambertMaterial&&!H.envMap||H.isMeshPhongMaterial&&!H.envMap,zt=ft.get(H.envMap||Lt,Nt),se=H.vertexColors===!0&&!!X.attributes.color&&X.attributes.color.itemSize===4,re=!!X.attributes.tangent&&(!!H.normalMap||H.anisotropy>0),Ot=!!X.morphAttributes.position,de=!!X.morphAttributes.normal,Te=!!X.morphAttributes.color;let ve=Nn;H.toneMapped&&(at===null||at.isXRRenderTarget===!0)&&(ve=B.toneMapping);const ge=X.morphAttributes.position||X.morphAttributes.normal||X.morphAttributes.color,He=ge!==void 0?ge.length:0,Rt=R.get(H),$e=E.state.lights;if(ot===!0&&(j===!0||w!==$)){const _e=w===$&&H.id===Q;It.setState(H,w,_e)}let le=!1;H.version===Rt.__version?(Rt.needsLights&&Rt.lightsStateVersion!==$e.state.version||Rt.outputColorSpace!==St||V.isBatchedMesh&&Rt.batching===!1||!V.isBatchedMesh&&Rt.batching===!0||V.isBatchedMesh&&Rt.batchingColor===!0&&V._colorsTexture===null||V.isBatchedMesh&&Rt.batchingColor===!1&&V._colorsTexture!==null||V.isInstancedMesh&&Rt.instancing===!1||!V.isInstancedMesh&&Rt.instancing===!0||V.isSkinnedMesh&&Rt.skinning===!1||!V.isSkinnedMesh&&Rt.skinning===!0||V.isInstancedMesh&&Rt.instancingColor===!0&&V.instanceColor===null||V.isInstancedMesh&&Rt.instancingColor===!1&&V.instanceColor!==null||V.isInstancedMesh&&Rt.instancingMorph===!0&&V.morphTexture===null||V.isInstancedMesh&&Rt.instancingMorph===!1&&V.morphTexture!==null||Rt.envMap!==zt||H.fog===!0&&Rt.fog!==wt||Rt.numClippingPlanes!==void 0&&(Rt.numClippingPlanes!==It.numPlanes||Rt.numIntersection!==It.numIntersection)||Rt.vertexAlphas!==se||Rt.vertexTangents!==re||Rt.morphTargets!==Ot||Rt.morphNormals!==de||Rt.morphColors!==Te||Rt.toneMapping!==ve||Rt.morphTargetsCount!==He||!!Rt.lightProbeGrid!=E.state.lightProbeGridArray.length>0)&&(le=!0):(le=!0,Rt.__version=H.version);let wn=Rt.currentProgram;le===!0&&(wn=Pa(H,N,V),U&&H.isNodeMaterial&&U.onUpdateProgram(H,wn,Rt));let Vn=!1,_i=!1,ys=!1;const me=wn.getUniforms(),Se=Rt.uniforms;if(y.useProgram(wn.program)&&(Vn=!0,_i=!0,ys=!0),H.id!==Q&&(Q=H.id,_i=!0),Rt.needsLights){const _e=gg(E.state.lightProbeGridArray,V);Rt.lightProbeGrid!==_e&&(Rt.lightProbeGrid=_e,_i=!0)}if(Vn||$!==w){y.buffers.depth.getReversed()&&w.reversedDepth!==!0&&(w._reversedDepth=!0,w.updateProjectionMatrix()),me.setValue(D,"projectionMatrix",w.projectionMatrix),me.setValue(D,"viewMatrix",w.matrixWorldInverse);const yi=me.map.cameraPosition;yi!==void 0&&yi.setValue(D,ut.setFromMatrixPosition(w.matrixWorld)),T.logarithmicDepthBuffer&&me.setValue(D,"logDepthBufFC",2/(Math.log(w.far+1)/Math.LN2)),(H.isMeshPhongMaterial||H.isMeshToonMaterial||H.isMeshLambertMaterial||H.isMeshBasicMaterial||H.isMeshStandardMaterial||H.isShaderMaterial)&&me.setValue(D,"isOrthographic",w.isOrthographicCamera===!0),$!==w&&($=w,_i=!0,ys=!0)}if(Rt.needsLights&&($e.state.sunShadowMap.length>0&&me.setValue(D,"sunShadowMap",$e.state.sunShadowMap,J),$e.state.directionalShadowMap.length>0&&me.setValue(D,"directionalShadowMap",$e.state.directionalShadowMap,J),$e.state.spotShadowMap.length>0&&me.setValue(D,"spotShadowMap",$e.state.spotShadowMap,J),$e.state.pointShadowMap.length>0&&me.setValue(D,"pointShadowMap",$e.state.pointShadowMap,J)),V.isSkinnedMesh){me.setOptional(D,V,"bindMatrix"),me.setOptional(D,V,"bindMatrixInverse");const _e=V.skeleton;_e&&(_e.boneTexture===null&&_e.computeBoneTexture(),me.setValue(D,"boneTexture",_e.boneTexture,J))}V.isBatchedMesh&&(me.setOptional(D,V,"batchingTexture"),me.setValue(D,"batchingTexture",V._matricesTexture,J),me.setOptional(D,V,"batchingIdTexture"),me.setValue(D,"batchingIdTexture",V._indirectTexture,J),me.setOptional(D,V,"batchingColorTexture"),V._colorsTexture!==null&&me.setValue(D,"batchingColorTexture",V._colorsTexture,J));const vi=X.morphAttributes;if((vi.position!==void 0||vi.normal!==void 0||vi.color!==void 0)&&F.update(V,X,wn),(_i||Rt.receiveShadow!==V.receiveShadow)&&(Rt.receiveShadow=V.receiveShadow,me.setValue(D,"receiveShadow",V.receiveShadow)),(H.isMeshStandardMaterial||H.isMeshLambertMaterial||H.isMeshPhongMaterial)&&H.envMap===null&&N.environment!==null&&(Se.envMapIntensity.value=N.environmentIntensity),Se.dfgLUT!==void 0&&(Se.dfgLUT.value=vw()),_i){if(me.setValue(D,"toneMappingExposure",B.toneMappingExposure),Rt.needsLights&&_g(Se,ys),wt&&H.fog===!0&&Gt.refreshFogUniforms(Se,wt),Gt.refreshMaterialUniforms(Se,H,z,K,E.state.transmissionRenderTarget[w.id]),Rt.needsLights&&Rt.lightProbeGrid){const _e=Rt.lightProbeGrid;Se.probesSH.value=_e.texture,Se.probesMin.value.copy(_e.boundingBox.min),Se.probesMax.value.copy(_e.boundingBox.max),Se.probesResolution.value.copy(_e.resolution)}Do.upload(D,af(Rt),Se,J)}if(H.isShaderMaterial&&H.uniformsNeedUpdate===!0&&(Do.upload(D,af(Rt),Se,J),H.uniformsNeedUpdate=!1),H.isSpriteMaterial&&me.setValue(D,"center",V.center),me.setValue(D,"modelViewMatrix",V.modelViewMatrix),me.setValue(D,"normalMatrix",V.normalMatrix),me.setValue(D,"modelMatrix",V.matrixWorld),H.uniformsGroups!==void 0){const _e=H.uniformsGroups;for(let yi=0,Ms=_e.length;yi<Ms;yi++){const cf=_e[yi];it.update(cf,wn),it.bind(cf,wn)}}return wn}function _g(w,N){w.ambientLightColor.needsUpdate=N,w.lightProbe.needsUpdate=N,w.sunLights.needsUpdate=N,w.sunLightShadows.needsUpdate=N,w.directionalLights.needsUpdate=N,w.directionalLightShadows.needsUpdate=N,w.pointLights.needsUpdate=N,w.pointLightShadows.needsUpdate=N,w.spotLights.needsUpdate=N,w.spotLightShadows.needsUpdate=N,w.rectAreaLights.needsUpdate=N,w.hemisphereLights.needsUpdate=N}function vg(w){return w.isMeshLambertMaterial||w.isMeshToonMaterial||w.isMeshPhongMaterial||w.isMeshStandardMaterial||w.isShadowMaterial||w.isShaderMaterial&&w.lights===!0}this.getActiveCubeFace=function(){return q},this.getActiveMipmapLevel=function(){return Y},this.getRenderTarget=function(){return at},this.setRenderTargetTextures=function(w,N,X){const H=R.get(w);H.__autoAllocateDepthBuffer=w.resolveDepthBuffer===!1,H.__autoAllocateDepthBuffer===!1&&(H.__useRenderToTexture=!1),R.get(w.texture).__webglTexture=N,R.get(w.depthTexture).__webglTexture=H.__autoAllocateDepthBuffer?void 0:X,H.__hasExternalTextures=!0},this.setRenderTargetFramebuffer=function(w,N){const X=R.get(w);X.__webglFramebuffer=N,X.__useDefaultFramebuffer=N===void 0},this.setRenderTarget=function(w,N=0,X=0){at=w,q=N,Y=X;let H=null,V=!1,wt=!1;if(w){const St=R.get(w);if(St.__useDefaultFramebuffer!==void 0){y.bindFramebuffer(D.FRAMEBUFFER,St.__webglFramebuffer),st.copy(w.viewport),Ut.copy(w.scissor),Tt=w.scissorTest,y.viewport(st),y.scissor(Ut),y.setScissorTest(Tt),Q=-1;return}else if(St.__webglFramebuffer===void 0)J.setupRenderTarget(w);else if(St.__hasExternalTextures)J.rebindTextures(w,R.get(w.texture).__webglTexture,R.get(w.depthTexture).__webglTexture);else if(w.depthBuffer){const se=w.depthTexture;if(St.__boundDepthTexture!==se){if(se!==null&&R.has(se)&&(w.width!==se.image.width||w.height!==se.image.height))throw new Error("THREE.WebGLRenderer: Attached DepthTexture is initialized to the incorrect size.");J.setupDepthRenderbuffer(w)}}const Nt=w.texture;(Nt.isData3DTexture||Nt.isDataArrayTexture||Nt.isCompressedArrayTexture)&&(wt=!0);const zt=R.get(w).__webglFramebuffer;w.isWebGLCubeRenderTarget?(Array.isArray(zt[N])?H=zt[N][X]:H=zt[N],V=!0):w.samples>0&&J.useMultisampledRTT(w)===!1?H=R.get(w).__webglMultisampledFramebuffer:Array.isArray(zt)?H=zt[X]:H=zt,st.copy(w.viewport),Ut.copy(w.scissor),Tt=w.scissorTest}else st.copy(ct).multiplyScalar(z).floor(),Ut.copy(Et).multiplyScalar(z).floor(),Tt=Wt;if(X!==0&&(H=k),y.bindFramebuffer(D.FRAMEBUFFER,H)&&y.drawBuffers(w,H),y.viewport(st),y.scissor(Ut),y.setScissorTest(Tt),V){const St=R.get(w.texture);D.framebufferTexture2D(D.FRAMEBUFFER,D.COLOR_ATTACHMENT0,D.TEXTURE_CUBE_MAP_POSITIVE_X+N,St.__webglTexture,X)}else if(wt){const St=N;for(let Nt=0;Nt<w.textures.length;Nt++){const zt=R.get(w.textures[Nt]);D.framebufferTextureLayer(D.FRAMEBUFFER,D.COLOR_ATTACHMENT0+Nt,zt.__webglTexture,X,St)}}else if(w!==null&&X!==0){const St=R.get(w.texture);D.framebufferTexture2D(D.FRAMEBUFFER,D.COLOR_ATTACHMENT0,D.TEXTURE_2D,St.__webglTexture,X)}Q=-1};function lf(w){const N=R.get(w);return(N.__readFormat!==w.format||N.__readType!==w.type)&&(N.__readFormat=w.format,N.__readType=w.type,N.__formatReadable=T.textureFormatReadable(w.format),N.__typeReadable=T.textureTypeReadable(w.type)),N}this.readRenderTargetPixels=function(w,N,X,H,V,wt,Lt,St=0){if(!(w&&w.isWebGLRenderTarget)){Ht("WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");return}let Nt=R.get(w).__webglFramebuffer;if(w.isWebGLCubeRenderTarget&&Lt!==void 0&&(Nt=Nt[Lt]),Nt){y.bindFramebuffer(D.FRAMEBUFFER,Nt);try{const zt=w.textures[St],se=zt.format,re=zt.type;w.textures.length>1&&D.readBuffer(D.COLOR_ATTACHMENT0+St);const Ot=lf(zt);if(Ot.__formatReadable===!1){Ht("WebGLRenderer.readRenderTargetPixels: renderTarget is not in RGBA or implementation defined format.");return}if(Ot.__typeReadable===!1){Ht("WebGLRenderer.readRenderTargetPixels: renderTarget is not in UnsignedByteType or implementation defined type.");return}N>=0&&N<=w.width-H&&X>=0&&X<=w.height-V&&D.readPixels(N,X,H,V,xt.convert(se),xt.convert(re),wt)}finally{const zt=at!==null?R.get(at).__webglFramebuffer:null;y.bindFramebuffer(D.FRAMEBUFFER,zt)}}},this.readRenderTargetPixelsAsync=async function(w,N,X,H,V,wt,Lt,St=0){if(!(w&&w.isWebGLRenderTarget))throw new Error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");let Nt=R.get(w).__webglFramebuffer;if(w.isWebGLCubeRenderTarget&&Lt!==void 0&&(Nt=Nt[Lt]),Nt)if(N>=0&&N<=w.width-H&&X>=0&&X<=w.height-V){y.bindFramebuffer(D.FRAMEBUFFER,Nt);const zt=w.textures[St],se=zt.format,re=zt.type;w.textures.length>1&&D.readBuffer(D.COLOR_ATTACHMENT0+St);const Ot=lf(zt);if(Ot.__formatReadable===!1)throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in RGBA or implementation defined format.");if(Ot.__typeReadable===!1)throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in UnsignedByteType or implementation defined type.");const de=D.createBuffer();D.bindBuffer(D.PIXEL_PACK_BUFFER,de),D.bufferData(D.PIXEL_PACK_BUFFER,wt.byteLength,D.STREAM_READ),D.readPixels(N,X,H,V,xt.convert(se),xt.convert(re),0),D.bindBuffer(D.PIXEL_PACK_BUFFER,null);const Te=at!==null?R.get(at).__webglFramebuffer:null;y.bindFramebuffer(D.FRAMEBUFFER,Te);const ve=D.fenceSync(D.SYNC_GPU_COMMANDS_COMPLETE,0);return D.flush(),await v0(D,ve,4),D.bindBuffer(D.PIXEL_PACK_BUFFER,de),D.getBufferSubData(D.PIXEL_PACK_BUFFER,0,wt),D.bindBuffer(D.PIXEL_PACK_BUFFER,null),D.deleteBuffer(de),D.deleteSync(ve),wt}else throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: requested read bounds are out of range.")},this.copyFramebufferToTexture=function(w,N=null,X=0){const H=Math.pow(2,-X),V=Math.floor(w.image.width*H),wt=Math.floor(w.image.height*H),Lt=N!==null?N.x:0,St=N!==null?N.y:0;J.setTexture2D(w,0),D.copyTexSubImage2D(D.TEXTURE_2D,X,0,0,Lt,St,V,wt),y.unbindTexture()},this.copyTextureToTexture=function(w,N,X=null,H=null,V=0,wt=0){let Lt,St,Nt,zt,se,re,Ot,de,Te;const ve=w.isCompressedTexture?w.mipmaps[wt]:w.image;if(X!==null)Lt=X.max.x-X.min.x,St=X.max.y-X.min.y,Nt=X.isBox3?X.max.z-X.min.z:1,zt=X.min.x,se=X.min.y,re=X.isBox3?X.min.z:0;else{const Se=Math.pow(2,-V);Lt=Math.floor(ve.width*Se),St=Math.floor(ve.height*Se),w.isDataArrayTexture?Nt=ve.depth:w.isData3DTexture?Nt=Math.floor(ve.depth*Se):Nt=1,zt=0,se=0,re=0}H!==null?(Ot=H.x,de=H.y,Te=H.z):(Ot=0,de=0,Te=0);const ge=xt.convert(N.format),He=xt.convert(N.type);let Rt;N.isData3DTexture?(J.setTexture3D(N,0),Rt=D.TEXTURE_3D):N.isDataArrayTexture||N.isCompressedArrayTexture?(J.setTexture2DArray(N,0),Rt=D.TEXTURE_2D_ARRAY):(J.setTexture2D(N,0),Rt=D.TEXTURE_2D),y.activeTexture(D.TEXTURE0),y.pixelStorei(D.UNPACK_FLIP_Y_WEBGL,N.flipY),y.pixelStorei(D.UNPACK_PREMULTIPLY_ALPHA_WEBGL,N.premultiplyAlpha),y.pixelStorei(D.UNPACK_ALIGNMENT,N.unpackAlignment);const $e=y.getParameter(D.UNPACK_ROW_LENGTH),le=y.getParameter(D.UNPACK_IMAGE_HEIGHT),wn=y.getParameter(D.UNPACK_SKIP_PIXELS),Vn=y.getParameter(D.UNPACK_SKIP_ROWS),_i=y.getParameter(D.UNPACK_SKIP_IMAGES);y.pixelStorei(D.UNPACK_ROW_LENGTH,ve.width),y.pixelStorei(D.UNPACK_IMAGE_HEIGHT,ve.height),y.pixelStorei(D.UNPACK_SKIP_PIXELS,zt),y.pixelStorei(D.UNPACK_SKIP_ROWS,se),y.pixelStorei(D.UNPACK_SKIP_IMAGES,re);const ys=w.isDataArrayTexture||w.isData3DTexture,me=N.isDataArrayTexture||N.isData3DTexture;if(w.isDepthTexture){const Se=R.get(w),vi=R.get(N),_e=R.get(Se.__renderTarget),yi=R.get(vi.__renderTarget);y.bindFramebuffer(D.READ_FRAMEBUFFER,_e.__webglFramebuffer),y.bindFramebuffer(D.DRAW_FRAMEBUFFER,yi.__webglFramebuffer);for(let Ms=0;Ms<Nt;Ms++)ys&&(D.framebufferTextureLayer(D.READ_FRAMEBUFFER,D.COLOR_ATTACHMENT0,R.get(w).__webglTexture,V,re+Ms),D.framebufferTextureLayer(D.DRAW_FRAMEBUFFER,D.COLOR_ATTACHMENT0,R.get(N).__webglTexture,wt,Te+Ms)),D.blitFramebuffer(zt,se,Lt,St,Ot,de,Lt,St,D.DEPTH_BUFFER_BIT,D.NEAREST);y.bindFramebuffer(D.READ_FRAMEBUFFER,null),y.bindFramebuffer(D.DRAW_FRAMEBUFFER,null)}else if(V!==0||w.isRenderTargetTexture||R.has(w)){const Se=R.get(w),vi=R.get(N);y.bindFramebuffer(D.READ_FRAMEBUFFER,L),y.bindFramebuffer(D.DRAW_FRAMEBUFFER,O);for(let _e=0;_e<Nt;_e++)ys?D.framebufferTextureLayer(D.READ_FRAMEBUFFER,D.COLOR_ATTACHMENT0,Se.__webglTexture,V,re+_e):D.framebufferTexture2D(D.READ_FRAMEBUFFER,D.COLOR_ATTACHMENT0,D.TEXTURE_2D,Se.__webglTexture,V),me?D.framebufferTextureLayer(D.DRAW_FRAMEBUFFER,D.COLOR_ATTACHMENT0,vi.__webglTexture,wt,Te+_e):D.framebufferTexture2D(D.DRAW_FRAMEBUFFER,D.COLOR_ATTACHMENT0,D.TEXTURE_2D,vi.__webglTexture,wt),V!==0?D.blitFramebuffer(zt,se,Lt,St,Ot,de,Lt,St,D.COLOR_BUFFER_BIT,D.NEAREST):me?D.copyTexSubImage3D(Rt,wt,Ot,de,Te+_e,zt,se,Lt,St):D.copyTexSubImage2D(Rt,wt,Ot,de,zt,se,Lt,St);y.bindFramebuffer(D.READ_FRAMEBUFFER,null),y.bindFramebuffer(D.DRAW_FRAMEBUFFER,null)}else me?w.isDataTexture||w.isData3DTexture?D.texSubImage3D(Rt,wt,Ot,de,Te,Lt,St,Nt,ge,He,ve.data):N.isCompressedArrayTexture?D.compressedTexSubImage3D(Rt,wt,Ot,de,Te,Lt,St,Nt,ge,ve.data):D.texSubImage3D(Rt,wt,Ot,de,Te,Lt,St,Nt,ge,He,ve):w.isDataTexture?D.texSubImage2D(D.TEXTURE_2D,wt,Ot,de,Lt,St,ge,He,ve.data):w.isCompressedTexture?D.compressedTexSubImage2D(D.TEXTURE_2D,wt,Ot,de,ve.width,ve.height,ge,ve.data):D.texSubImage2D(D.TEXTURE_2D,wt,Ot,de,Lt,St,ge,He,ve);y.pixelStorei(D.UNPACK_ROW_LENGTH,$e),y.pixelStorei(D.UNPACK_IMAGE_HEIGHT,le),y.pixelStorei(D.UNPACK_SKIP_PIXELS,wn),y.pixelStorei(D.UNPACK_SKIP_ROWS,Vn),y.pixelStorei(D.UNPACK_SKIP_IMAGES,_i),wt===0&&N.generateMipmaps&&D.generateMipmap(Rt),y.unbindTexture()},this.initRenderTarget=function(w){R.get(w).__webglFramebuffer===void 0&&J.setupRenderTarget(w)},this.initTexture=function(w){w.isCubeTexture?J.setTextureCube(w,0):w.isData3DTexture?J.setTexture3D(w,0):w.isDataArrayTexture||w.isCompressedArrayTexture?J.setTexture2DArray(w,0):J.setTexture2D(w,0),y.unbindTexture()},this.resetState=function(){q=0,Y=0,at=null,y.reset(),ht.reset()},typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}get coordinateSystem(){return vn}get outputColorSpace(){return this._outputColorSpace}set outputColorSpace(t){this._outputColorSpace=t;const e=this.getContext();e.drawingBufferColorSpace=ae._getDrawingBufferColorSpace(t),e.unpackColorSpace=ae._getUnpackColorSpace()}}const bC=Object.freeze(Object.defineProperty({__proto__:null,ACESFilmicToneMapping:iu,AddEquation:ss,AddOperation:tA,AdditiveAnimationBlendMode:pu,AdditiveBlending:Eh,AgXToneMapping:ru,AlphaFormat:fu,AlwaysCompare:dA,AlwaysDepth:No,AlwaysStencilFunc:oA,AmbientLight:cm,AnimationAction:_m,AnimationClip:da,AnimationLoader:m_,AnimationMixer:Y_,AnimationObjectGroup:V_,AnimationUtils:h_,ArcCurve:RA,ArrayCamera:Am,ArrowHelper:gv,AttachedBindMode:bh,Audio:gm,AudioAnalyser:L_,AudioContext:Ou,AudioListener:R_,AudioLoader:C_,AxesHelper:xv,BackSide:an,BasicDepthPacking:rA,BasicShadowMap:bg,BatchedMesh:wA,BezierInterpolant:em,Bone:vu,BooleanKeyframeTrack:ms,Box2:vm,Box3:Ze,Box3Helper:Av,BoxGeometry:As,BoxHelper:pv,BufferAttribute:fe,BufferGeometry:$t,BufferGeometryLoader:dm,ByteType:lu,Cache:Jn,Camera:pc,CameraHelper:dv,CanvasTexture:Bx,CapsuleGeometry:$l,CatmullRomCurve3:DA,CineonToneMapping:nu,CircleGeometry:jl,ClampToEdgeWrapping:Ke,Clock:j_,Color:bt,ColorKeyframeTrack:Lu,ColorManagement:ae,Compatibility:p0,CompressedArrayTexture:Cx,CompressedCubeTexture:Tx,CompressedTexture:Zl,CompressedTextureLoader:g_,ConeGeometry:Ea,ConstantAlphaFactor:Zp,ConstantColorFactor:Kp,Controls:vv,CubeCamera:pm,CubeDepthTexture:BA,CubeReflectionMapping:ti,CubeRefractionMapping:Li,CubeTexture:ya,CubeTextureLoader:x_,CubeUVReflectionMapping:pr,CubicBezierCurve:Su,CubicBezierCurve3:PA,CubicInterpolant:jA,CullFaceBack:Mh,CullFaceFront:Pp,CullFaceFrontBack:wg,CullFaceNone:Dp,Curve:Hn,CurvePath:FA,CustomBlending:Fp,CustomToneMapping:su,CylinderGeometry:Ma,Cylindrical:ev,Data3DTexture:Vl,DataArrayTexture:Hl,DataTexture:Mn,DataTextureLoader:__,DataUtils:j0,DecrementStencilOp:Wg,DecrementWrapStencilOp:Xg,DefaultLoadingManager:sm,DepthFormat:ei,DepthStencilFormat:Ii,DepthTexture:hr,DetachedBindMode:eA,DirectionalLight:lm,DirectionalLightHelper:fv,DiscreteInterpolant:tm,DodecahedronGeometry:tc,DoubleSide:Fn,DstAlphaFactor:Vp,DstColorFactor:Yp,DynamicCopyUsage:l0,DynamicDrawUsage:n0,DynamicReadUsage:r0,EdgesGeometry:IA,EllipseCurve:ec,EqualCompare:hA,EqualDepth:Go,EqualStencilFunc:Zg,EquirectangularReflectionMapping:Qr,EquirectangularRefractionMapping:zr,Euler:kn,EventDispatcher:zn,ExternalTexture:Mu,ExtrudeGeometry:nc,FileLoader:gi,Float16BufferAttribute:ax,Float32BufferAttribute:Ft,FloatType:sn,Fog:Xl,FogExp2:Yl,FramebufferTexture:bx,FrontSide:Pi,Frustum:ds,FrustumArray:Jl,GLBufferAttribute:Z_,GLSL1:h0,GLSL3:Th,GreaterCompare:uA,GreaterDepth:Qo,GreaterEqualCompare:Ql,GreaterEqualDepth:ko,GreaterEqualStencilFunc:e0,GreaterStencilFunc:jg,GridHelper:hv,Group:Js,HTMLTexture:Ix,HalfFloatType:Gn,HemisphereLight:rm,HemisphereLightHelper:cv,IcosahedronGeometry:ic,ImageBitmapLoader:b_,ImageLoader:pa,ImageUtils:gA,IncrementStencilOp:Vg,IncrementWrapStencilOp:Yg,InstancedBufferAttribute:cr,InstancedBufferGeometry:fm,InstancedInterleavedBuffer:J_,InstancedMesh:SA,Int16BufferAttribute:sx,Int32BufferAttribute:rx,Int8BufferAttribute:ex,IntType:Pl,InterleavedBuffer:ql,InterleavedBufferAttribute:fs,Interpolant:gr,InterpolateBezier:Ch,InterpolateDiscrete:ia,InterpolateLinear:_l,InterpolateSmooth:Bo,InterpolationSamplingMode:d0,InterpolationSamplingType:f0,InvertStencilOp:qg,KeepStencilOp:Io,KeyframeTrack:Bn,LOD:MA,LatheGeometry:sc,Layers:Wl,LessCompare:cA,LessDepth:Oo,LessEqualCompare:kl,LessEqualDepth:rr,LessEqualStencilFunc:$g,LessStencilFunc:Jg,Light:ki,LightProbe:um,LightShadow:dc,Line:Ni,Line3:sv,LineBasicMaterial:ln,LineCurve:wu,LineCurve3:LA,LineDashedMaterial:JA,LineLoop:bA,LineSegments:ni,LinearFilter:xe,LinearInterpolant:Pu,LinearMipMapLinearFilter:Rg,LinearMipMapNearestFilter:Ig,LinearMipmapLinearFilter:Kn,LinearMipmapNearestFilter:Hr,LinearSRGBColorSpace:ra,LinearToneMapping:tu,LinearTransfer:aa,Loader:An,LoaderUtils:Ph,LoadingManager:Uu,LoopOnce:nA,LoopPingPong:sA,LoopRepeat:iA,MOUSE:Eg,Material:ke,MaterialBlending:Cg,MaterialLoader:Ac,MathUtils:O0,Matrix2:zu,Matrix3:jt,Matrix4:Kt,MaxEquation:Gp,Mesh:Ce,MeshBasicMaterial:Oi,MeshDepthMaterial:Ru,MeshDistanceMaterial:Du,MeshLambertMaterial:qA,MeshMatcapMaterial:KA,MeshNormalMaterial:XA,MeshPhongMaterial:WA,MeshPhysicalMaterial:VA,MeshStandardMaterial:Iu,MeshToonMaterial:YA,MinEquation:Op,MirroredRepeatWrapping:ta,MixOperation:jp,MultiplyBlending:wh,MultiplyOperation:_a,NearestFilter:be,NearestMipMapLinearFilter:Bg,NearestMipMapNearestFilter:Tg,NearestMipmapLinearFilter:qs,NearestMipmapNearestFilter:ou,NeutralToneMapping:au,NeverCompare:lA,NeverDepth:Uo,NeverStencilFunc:Kg,NoBlending:jn,NoColorSpace:Xn,NoNormalPacking:Gg,NoToneMapping:Nn,NormalAnimationBlendMode:Gl,NormalBlending:tr,NormalGAPacking:Qg,NormalRGPacking:kg,NotEqualCompare:fA,NotEqualDepth:zo,NotEqualStencilFunc:t0,NumberKeyframeTrack:uc,Object3D:he,ObjectLoader:S_,ObjectSpaceNormalMap:aA,OctahedronGeometry:wa,OneFactor:Qp,OneMinusConstantAlphaFactor:$p,OneMinusConstantColorFactor:Jp,OneMinusDstAlphaFactor:Wp,OneMinusDstColorFactor:Xp,OneMinusSrcAlphaFactor:jh,OneMinusSrcColorFactor:Hp,OrthographicCamera:Ca,PCFShadowMap:kr,PCFSoftShadowMap:Lp,PMREMGenerator:Uh,Path:ca,PerspectiveCamera:Ue,Plane:ci,PlaneGeometry:mr,PlaneHelper:mv,PointLight:om,PointLightHelper:ov,Points:CA,PointsMaterial:yu,PolarGridHelper:uv,PolyhedronGeometry:Gi,PositionalAudio:P_,PropertyBinding:ce,PropertyMixer:xm,QuadraticBezierCurve:bu,QuadraticBezierCurve3:Cu,Quaternion:on,QuaternionKeyframeTrack:fc,QuaternionLinearInterpolant:im,R11_EAC_Format:Jo,RED_GREEN_RGTC2_Format:na,RED_RGTC1_Format:ml,REVISION:Rl,RG11_EAC_Format:ea,RGBADepthPacking:Ug,RGBAFormat:Je,RGBAIntegerFormat:Ol,RGBA_ASTC_10x10_Format:hl,RGBA_ASTC_10x5_Format:ol,RGBA_ASTC_10x6_Format:ll,RGBA_ASTC_10x8_Format:cl,RGBA_ASTC_12x10_Format:ul,RGBA_ASTC_12x12_Format:fl,RGBA_ASTC_4x4_Format:jo,RGBA_ASTC_5x4_Format:tl,RGBA_ASTC_5x5_Format:el,RGBA_ASTC_6x5_Format:nl,RGBA_ASTC_6x6_Format:il,RGBA_ASTC_8x5_Format:sl,RGBA_ASTC_8x6_Format:rl,RGBA_ASTC_8x8_Format:al,RGBA_BPTC_Format:dl,RGBA_ETC2_EAC_Format:Ko,RGBA_PVRTC_2BPPV1_Format:Yo,RGBA_PVRTC_4BPPV1_Format:Wo,RGBA_S3TC_DXT1_Format:Wr,RGBA_S3TC_DXT3_Format:Yr,RGBA_S3TC_DXT5_Format:Xr,RGBDepthPacking:Ng,RGBFormat:du,RGBIntegerFormat:Dg,RGB_BPTC_SIGNED_Format:pl,RGB_BPTC_UNSIGNED_Format:Al,RGB_ETC1_Format:Xo,RGB_ETC2_Format:qo,RGB_PVRTC_2BPPV1_Format:Vo,RGB_PVRTC_4BPPV1_Format:Ho,RGB_S3TC_DXT1_Format:Vr,RGDepthPacking:Og,RGFormat:Fi,RGIntegerFormat:Nl,RawShaderMaterial:Bu,Ray:Ar,Raycaster:$_,RectAreaLight:hm,RedFormat:Ul,RedIntegerFormat:va,ReinhardToneMapping:eu,RenderObjectRefreshType:A0,RenderTarget:mu,RenderTarget3D:X_,RepeatWrapping:jr,ReplaceStencilOp:Hg,ReverseSubtractEquation:Np,RingGeometry:rc,SIGNED_R11_EAC_Format:Zo,SIGNED_RED_GREEN_RGTC2_Format:xl,SIGNED_RED_RGTC1_Format:gl,SIGNED_RG11_EAC_Format:$o,SRGBColorSpace:un,SRGBTransfer:pe,Scene:_A,ShaderChunk:ie,ShaderLib:Ln,ShaderMaterial:Sn,ShadowMaterial:QA,Shape:Sa,ShapeGeometry:ac,ShapePath:_v,ShapeUtils:Un,ShortType:cu,Skeleton:Kl,SkeletonHelper:av,SkinnedMesh:EA,Source:Q0,Sphere:Oe,SphereGeometry:ba,Spherical:tv,SphericalHarmonics3:Nu,SplineCurve:Tu,SpotLight:am,SpotLightHelper:rv,Sprite:yA,SpriteMaterial:_u,SrcAlphaFactor:$h,SrcAlphaSaturateFactor:qp,SrcColorFactor:zp,StaticCopyUsage:o0,StaticDrawUsage:zl,StaticReadUsage:s0,StereoCamera:T_,StreamCopyUsage:c0,StreamDrawUsage:i0,StreamReadUsage:a0,StringKeyframeTrack:gs,SubtractEquation:Up,SubtractiveBlending:Sh,TOUCH:Sg,TangentSpaceNormalMap:mi,TetrahedronGeometry:oc,Texture:Me,TextureLoader:v_,TextureSource:ui,TextureUtils:wv,Timer:mm,TimestampQuery:u0,TorusGeometry:lc,TorusKnotGeometry:cc,Triangle:fn,TriangleFanDrawMode:Fg,TriangleStripDrawMode:Lg,TrianglesDrawMode:Pg,TubeGeometry:hc,UVMapping:Dl,Uint16BufferAttribute:gu,Uint32BufferAttribute:xu,Uint8BufferAttribute:nx,Uint8ClampedBufferAttribute:ix,Uniform:Qu,UniformsGroup:K_,UniformsLib:Mt,UniformsUtils:HA,UnsignedByteType:en,UnsignedInt101111Type:uu,UnsignedInt248Type:or,UnsignedInt5999Type:hu,UnsignedIntType:Tn,UnsignedShort4444Type:Ll,UnsignedShort5551Type:Fl,UnsignedShortType:ar,VSMShadowMap:Xs,Vector2:lt,Vector3:I,Vector4:Ae,VectorKeyframeTrack:Fu,VideoFrameTexture:wx,VideoTexture:TA,WebGL3DRenderTarget:V0,WebGLArrayRenderTarget:H0,WebGLCoordinateSystem:vn,WebGLCubeRenderTarget:Hu,WebGLRenderTarget:pn,WebGLRenderer:yw,WebGLUtils:Tm,WebGPUCoordinateSystem:us,WebXRController:Ro,WireframeGeometry:kA,WrapAroundEnding:sa,ZeroCurvatureEnding:os,ZeroFactor:kp,ZeroSlopeEnding:ls,ZeroStencilOp:zg,createCanvasElement:AA,error:Ht,getConsoleFunction:_0,log:la,setConsoleFunction:x0,warn:_t,warnOnce:di},Symbol.toStringTag,{value:"Module"})),Mw={"chromium/line_normal":[0,182],"chromium/line_normal_cj":[1,182],"apple/line_normal":[2,183],"apple/line":[3,183],"apple/line_cj":[4,183],"chromium/char":[5,148],"apple/char":[6,149],"gecko/line":[7,196],"gecko/east_asian_width":[8,38],"chromium/script":[9,80]},Ew=248,Sw="CC0AgAEAogEBgQEAowERLQCkAQBNADwABQAiACUABQA8AA8ApQEABQAiAE4ApgEATgCnAQlpAU4CBQBNAAUZEwAPACIAqAECBRkTAA8AIACpAQAFBS0AqgEZLQBqAEUAJQAiAFUAIgAFAQcAEAAwAC4ABQCAAQAQAAUARgBVAQcAVgAFAAcAqwEBBwAwADQCBwBFFhMABx4TAAfAAxMCBQCsAQkFADAAVgIwAFYAMAEFAAcFBQATAAcAMAEHAAUABwAFAFYEEwQFAQETBQFXAE8AJgBXACYAVwAmAFcBJgBPAiYAGAAmAE8AGACtAQ4YAiYGGAEmABgBJg8YAGsBGABrCBgArgEHGAAmAhgBWACvAQNYDCYHFAEAAxQATgAUAwAAFAAFABQABQIUAAAAFAAAExQAAD4UDQEPFIIBNQE6AU8COqUBNQAAJQEBAC8BALABAFkBAAEBAD0AACwEAFkABAABAQQAAQEEADYABAcAGjEDAAMxAQEKAASCAQBsAgoCbQCxAQCDAQEKCh0AbgCyAQFQAG4fCgBvCQoKWgkdCUcAbQFHAgoAWmIKAFAACgYdAGwACgUdAQoBHQAKAx0BCglHEwoAAACzAQAKAB0dChodAQAyCiUBCgQAAQ0ACUcgCggdAwoAgwEAUAAKAQAAHQG0ARUBAwQAAQgEAAECBAABBAQBAA4BAAAYCgIdAQAACgAACgoEAB4KAEgBggEEAACEAQcdKQoXHQBsHB0CBAAGEAEkEQAEAAYABAABAgYHBAMGACkBBgABASYBGAIEBxEBAQEEAQkJDgcBBxEAAQAEAQYAAAcBAQABAQEAAQETEQAABhEAAAARAgADEQEAAAQAAQAEAQYDBAEAAQYBAAEGACkAAQcAAAQDAAERAAAAEQEBAQQBAAkOAREBUQQBAFEAAQA9AQEABAEAAQQABgAABQEDAAEBAQAVAQAABgEAAAEBAAABAQAAAQEBAAAEAAACBgEEAwABBAEAAgQCAAAEBgADAQAAAAEGAAkOAQQCAQAEAAEJAAEEAAYAAAgBAAACAQAAAQETEQAABhEAAAERAAAEEQEAAAQAAQIGBAQAAAEEAAYAAAEGACkBAAABDgABAQEEAQAJDgABAD0GAAARBQQAAAAEAQYAAAcBAQABAQEAAQETEQAABhEAAAERAAAEEQEAAAQAAQEEAAYDBAEAAQYBAAEGACkGAAIEAwABEQAAABEBAQEEAQAJDgABABEFAQkAAAQAAQAABQECAAIBAAADAQIAAQEAAAABAAABAQIAAQECAAIBAgALAQMAAAQABgAEAQYCAAIGAAACBgAEAQAAAQUAAAQNAAkOCAEAPQABBAAABAIGAAQHAQAAAgEAAAIBExEAAA8RAQAABAABAgQDBgAAAgQAAAIEACkGAAEEAAACEQEAAAEBAAEBAQQBAAkOBgAAIQgBAAQBBgAhBwEAAAIBAAAWAQAACQEAAAQBAQAABAABAAYBBAAGAAQBBgAAAgQAAAMEBgABBAUAAQEAAAEBAQQBAAkOAAABAQAGCwABBAEGCAEAAAIBAAACASURAQQAAQAEAQYDBAAAAgYAAAIGACkAWwABAwACAQAECQEBBAEACQ4IAQBRBQEAAAAEAQYAABEBAgAXAQAACAEAAAABAQAGAQIAAAQDAAAEAQYCBAAAAAQAAAYGAAQFAAkOAQABBgABCwAvFQASABUAhQEGEgMAACIGFQcSAAEJDgEJJAABFQAAABUAAAQVAAAXFQAAABUAAAkVABIAFQCFAQgSABUBAAQVAAAAFQAABhIAAAkOAQADFR8AAAEDIQABASEAXAEhAAkAXAQ2AFwAAQA2AgEBBAUBCQ4JAQAJAAQAAQAEAAEABABwAHEAcABxAQYHAQAAIwEDAA0EALUBBAQACQEEBAEKBAAAIwQAAAEJBQEABAUBAAABAQEhAAkAIQABAwUBXCQAKh8BJwMSACoFEgAnAHIAEgEqARIAHwkOAQkDAQUfASoBEgMfAhIAHwInAR8GJwIfAxIMHwASACcAKgESBScAEgAfACcJDgInABIBFSUBAAAAAQQAAAEBACoBABMDAV+GAUeHAVeIAUgBAAADAQEABgEAAAABAAADAQEAKAEAAAMBAQAgAQAAAwEBAAYBAAAAAQAAAwEBAA4BAAA4AQAAAwEBAEIBAQACBAABAAkaAQIAGQEFAFUBAQAFAQEAAFn+BAEACRkBAHAAcQIASgECIAoBBgARAQMECAASAQIEAQkIABEBAQQLAAwBAAACAQAAAQQLADMfARIAKgYSByoAEgEqCBIAcgASAQkAtgEAFQAJAAEACQA9ABUAEgEACQ4FAAkBBQABCgFuALcBAIkBAHMACgFQAAoCHQC4AQAdCUcFAFgKBgAECgEdIQoAHQAKBABFAQkAHgEAAAIEAwYBBAIGAwABBgAEBQYCBAMAAAECAAE2CQ4dFQEABBUKACsVAwAZFQUACQ4AuQECAAEVNgEBBAEGAAQBAAEBNB8AKgASACoGEgAAAHIAJwASAScHEgUqCRIBAAAECQ4FAAkOBQANFQEAHhgOigEBAAqKAQC6ARMAAwQABgUkASsFJCArCQQDBgEEAF0HKwAAAXQJXgEJADIDCQkyCAQIMgEJAHQBBAAGHREABgMEAQYCBAApAQQBEQkOAAECEQEBJT4ABAAGAQQCBgAEAAYCBAG7AQcAJwEHBgcEAQYBBAIABAkJDgIAAgEJDiMBAQkINQG8AQQAKgEBAAoBBwACPwABDD8ABgY/AgEABQA/AwUBAQA/AQEAvQEBPwAFBAAlEwQUADUwEwQUAxMEFAwTADVFEwAUAWsKGABYKRgATwAYAFoAGABYAhj/ARMVFAEABRQBACUUAQAFFAEABxQAAAAUAAAAFAAAABQAAB4UAQA0FAAADhQAAA0UAQAFFAAAEhQBAAIUAAAGFAC+AQAUAAAGIABqAiAAvwEAwAEAwQEBLQBfAGoBXwCLAQEHAAUALgA0AEUALgDCAQDDAQBFAC4BBwEFAowBACABgQEELQDEAQBGACUBRgAlAEYBJQAFAC4ANAAHAI0BAHUFBQBOAA8AFwF1AI0BBAUAbwUFACAAJQEgAAkAIAAFAMUBASAAjgEDxgEASQktAAUAEwEAAAcHBQAPABcAMAAFAwcHBQAPABcAAAwTAgAGIgAlACIAxwEBIgBVCCIAJQMiACUBIgAlACIAJQAiDT0fGAAmDgACBQBGAAUABwIFAEYIBQAHAQUAVQkFAAcAIwIFABQCBQATADAFBQATBQUAEBMFABMEBQEHBAUABwEFAAcABQswAxMJMA4TAAcBBQMAAwcFIw4FARAmBQAHAAUAByoFAAcABQEHAgUBBwEFAAcCBQAHAAUABwEiAAUABwMFAAcBBQMHAQUABwAFAAcABQUHAAUABwQFAwcDBQEHCQUABwIFAAcEBQAHDAUBBwEFAwcBBQEHAQUBBxEFAQcBBQEHDAUABwIFAAcKBQAHGAUABy4FAIwBFwUADwAXAA8AFwUFAAcGBQEICwUAEABgAGGjAQUAEBgFAxwCEAAIAQsACAMFAhArBQI3FQAKBRQAYQcAIzsHAAVLBwMFJAcKBQ8HAQUDBwkFAQcABQYHARAFBQEHAQUAIwAHAwUBBwEFACMABwMFAgcBBQAHAMgBAAUDBw8FAwcIBQAHCgUBEAEcAAUDCwAQAQcBBQAHAwUAIwAHAAUAEAEFAQgBBwALAAUCDABKAQwAEAAFARABBQAQAgUAEAIFARAHUgAQAQsADAMFACMABQAjBAULHAoFABAAIwAHAAUAIwAHACMAEAAHAAsBBwAFAQcABQAHCgUAEAEFABAACAkFBVIBBQAQABwDEAAFABAABQEQAAUBBwAQABwEBQAQAQUBHAMFARAKBQEIBAwBCAEMAAsDBwAMABwACwAMAAsABwALAAgCBwEMAQcADAEHAgwABQAHAwUABwAjAAgEBwAjAAsBCAALAAgABwELAEoACAEHAAgDDAALAQwAHAEFAQsBFgFKAAUAEAEFABAABQAQAAUAEAUFABACBQAQBQUAHAkFARAOBQAQAQUAEAMFABwABQAcAwUCHAAFAGICBQU8AAUATQDJAQALAgUADwAXAA8AFwAPABcADwAXAA8AFwAPABcADwAXHQcABQIcCAUAEA0FABwNBQAcBAUADwAXHgUADwAXAA8AFwAPABcADwAXAA8AFw8FAMoB/gEBMwUBEEwFAA8AFwAPABcADwAXAA8AFwAPABcADwDLAQAPAMwBAA8AFwAPABcADwAXAA8AFz4FAA8AFwAPABcfBQAPABeGAgUCEBIFARwyBQAcAwUAYgMHGQUBAB8FADdoBV8BHxNuAQIEAQEEAAA2AgkAAQA2AAklAQAAAAEEAAABAQA3AQYAAAEACQ0AAAQWAQgABgEAAAYBAAAGAQAABgEAAAYBAAAGAQAABgEAAAYBAAAfOgE8AC4ANAAuADQCPAAuADQAPAAuADQHIAAFAM0BAEUAIAEFAC4ANAEFAC4ANAAPABcADwAXAA8AFwAPABcDIABNAAUBCQAFASAEBQGLAQIgAAUAXwCJAQBFAM4BBiAABQAgAAUBIAIFAU0ADwBjAA8AYwAPAGMADwBjAF8hABkNAABYDQsA1QENGQAPDQDPAQGPAQANABkAQAAZAA0AOAA5ADgAOQA4ADkAOAA5ADgAOQAZAA0AOAA5ADgAOQA4ADkAOAA5AJABANABAY8BABkIDQORAQGSAQCTAQMNANEBABkDDQFAAJMBABkADAAAABoADQAaAA0AGgANABoADQAaGA0AGh4NABoADQAaAA0AGgUNABoFDQEaAQABkQEDQAANAJABABoADQAaAA0AGgANABoADQAaGA0AGh4NABoADQAaAA0AGgUNABoFDQEaAw0AQAAaAUAADQQAKg0AAF0NAAAPGR8NIxkB0gEIAAANDxoeDQAAJxkHBw8ZHg0XGQAIABkACDUZLg0AGVcNpwEZvzMNP1KUpAENAED2CA0CADYNCAAtAQEJjAIBAAkANgAJDwEJDgEBEwAuNQM6ADUJOh81ATpPAQEEAAEECQcABxMZBWUTAgU/EwRTARMAUwATAFMEEwJTEwAAUw0TAQEABAIBAAQDAQAEFgEBBgEEAAYDAQAEAgAHAQBRAAEFADMKAXMBUAcAAQYxAQ8GAQQHAAEJCQ4FABEECQEAIQEBAAQJDhsBBwQA0wEACRYBCgQABgAECgAAARyGAQIAAgQABgQkAisCJCMrAAQBBgMEAQYBBAEGAF0FMgIJAzIAAAAJCV4DAAEyBB8AEgAVCB8JDgQfAAAoPgUEAQYBBAEGAQQIAAIJAAQHCQAEAAYBAAleAQAAMgIJDx8AFQIfBRUAHwAnABIAJwEfLxUAEgAVAhIBFQESBBUBEgAVABIAFRcABBUKEQAGAQQBBgEJAgEABgApCQAFAQEABQEBAAUBCAAGAQAABgEAACoTAAUIEwAUAxMBBQMATwEaEQcBAQYABAEGAAQBBgAJAAYABAEACQ4FAAACGgMAAhoDAAIaAwACGgMAAhoDAAIaAwACGgMAAhoDAAIaAwACGgMAAhoDAAIaAwACGgMAAhoDAAIaAwACGgMAAhoDAAIaAwACGgMAAhoDAAIaAwACGgMAAhoDAAIaAwACGgMAAhoDAAIaAwACGgMAAhoDAAIaAwACGgMAAhoDAAIaAwACGgMAAhoDAAIaAwACGgMAAhoDAAIaAwACGgMAAhoDAAIaAwACGgMAAhoDAAIaAwACGgMAAhoDAAIaAwACGgMAAhoDAAIaAwACGgMAAhoDAAIaAwACGgMAAhoDAAIaAwACGgMAAhoDAAIaAwACGgMAAhoDAAIaAwACGgMAAhoDAAIaAwACGgMAAhoDAAIaAwACGgMAAhoDAAIaAwACGgMAAhoDAAIaAwACGgMAAhoDAAIaAwACGgMAAhoDAAIaAwACGgMAAhoDAAIaAwACGgMAAhoDAAIaAwACGgMAAhoDAAIaAwACGgMAAhoDAAIaAwACGgMAAhoDAAIaAwACGgMAAhoDAAIaAwACGgMAAhoDAAIaAwACGgMAAhoDAAIaAwACGgMAAhoDAAIaAwACGgMAAhoDAAIaAwACGgMAAhoDAAIaAwACGgMAAhoDAAIaAwACGgMAAhoDAAIaAwACGgMAAhoDAAIaAwACGgMAAhoDAAIaAwACGgMAAhoDAAIaAwACGgMAAhoDAAIaAwACGgMAAhoDAAIaAwACGgMAAhoDAAIaAwACGgMAAhoDAAIaAwACGgMAAhoDAAIaAwACGgMAAhoDAAIaAwACGgMAAhoDAAIaAwACGgMAAhoDAAIaAwACGgMAAhoDAAIaAwACGgMAAhoDAAIaAwACGgMAAhoDAAIaAwACGgMAAhoDAAIaAwACGgMAAhoDAAIaAwACGgMAAhoDAAIaAwACGgMAAhoDAAIaAwACGgMAAhoDAAIaAwACGgMAAhoDAAIaAwACGgMAAhoDAAIaAwACGgMAAhoDAAIaAwACGgMAAhoDAAIaAwACGgMAAhoDAAIaAwACGgMAAhoDAAIaAwACGgMAAhoDAAIaAwACGgMAAhoDAAIaAwACGgMAAhoDAAIaAwACGgMAAhoDAAIaAwACGgMAAhoDAAIaAwACGgMAAhoDAAIaAwACGgMAAhoDAAIaAwACGgMAAhoDAAIaAwACGgMAAhoDAAIaAwACGgMAAhoDAAIaAwACGgMAAhoDAAIaAwACGgMAAhoDAAIaAwACGgMAAhoDAAIaAwACGgMAAhoDAAIaAwACGgMAAhoDAAIaAwACGgMAAhoDAAIaAwACGgMAAhoDAAIaAwACGgMAAhoDAAIaAwACGgMAAhoDAAIaAwACGgMAAhoDAAIaAwACGgMAAhoDAAIaAwACGgMAAhoDAAIaAwACGgMAAhoDAAIaAwACGgMAAhoDAAIaAwACGgMAAhoDAAIaAwACGgMAAhoDAAIaAwACGgMAAhoDAAIaAwACGgMAAhoDAAIaAwACGgMAAhoDAAIaAwACGgMAAhoDAAIaAwACGgMAAhoDAAIaAwACGgMAAhoDAAIaAwACGgMAAhoDAAIaAwACGgMAAhoDAAIaAwACGgMAAhoDAAIaAwACGgMAAhoDAAIaAwACGgMAAhoDAAIaAwACGgMAAhoDAAIaAwACGgMAAhoDAAIaAwACGgMAAhoDAAIaAwACGgMAAhoDAAIaAwACGgMAAhoDAAIaAwACGgMAAhoDAAIaAwACGgMAAhoDAAIaAwACGgMAAhoDAAIaAwACGgMAAhoDAAIaAwACGgMAAhoDAAIaAwACGgMAAhoDAAIaAwACGgMAAhoDAAIaAwACGgMAAhoDAAIaAwACGgMAAhoDAAIaAwACGgMAAhoDAAIaAwACGgMAAhoDAAIaAwACGgMAAhoDAAIaAwACGgMAAhoDAAIaAwACGgMAAhoDAAIaAwACGgMAAhoDAAIaAwACGgMAAhoDAAIaAwACGgMAAhoDAAIaAwACGgMAAhoDAAIaAwACGgMAAhoDAAIaAwACGgMAAhoDAAIaAwACGgMAAhoDAAIaAwACGgMAAhoDAAIaAwACGgMAAhoDAAIaAwACGgMAAhoDAAIaAwACGgMAAhoDAAIaAwACGgMAAhoDAAIaAwsAFocBAwAwiAEDAP8PAe8wAA92AXcBABV2BAAAdgDUARJ3ApQBAHgAeQDVAQB5AHcAeADWAQDXAQCUAQB4FXkoAP8DDQYTCwAEAQQAADEABAkxAAEMMQAABDEAAAAxAAABMQAAATEAAAkxcgoPSOoCCgDYAQDZAU8KAUg1CgZIAAofAAsKAG0CCg8YANoBASgB2wEBlQEAMwAoANwBBQAAQQAYAEEAGABBABgBQQAYAEEAGABBABgAQQDdAQA6BBkAMwAoADMAKAAzACgAMwAoADMAKAAzACgAMwAoADMAKAENADMAKAYZACgAGQAoAAAB3gEBlQEAGQBgAGEAYABhAGAAYQcZAAAAGQDfAQDgAQAZAwAECgAAhgEKAQAAjgEAAACWAQEsAHoAlwEBLABkAJgBASwAmQEALACZAQosAeEBAiwAlgEALBmaAQBkACwAmwECLBmaAQBkACwAmwEALABkAJgBAJwBAOIBAOMBAJwBAOQBAEIJ5QEsQgHmAR5CAgAFQgEABUIBAAVCAQACQgIAAJcBAHoCLAF6AAAG5wEAAAhJAi0A6AEABwEACwEAABkBAAASAQAAAQEAAA4BAQANASEAegEEAAIJAwAsAQIACAFOFAAADAUCAAAULgAsBQAYgQEAHAECADABDgAAWhpvAwAjAQgAHQEEACUBBAQEAB0BAAAACSMBAwAHAQAJBAEpAJ0BAQEACQ4FACMBAwAjAQMAJwEHADMBCgALAQAADgEAAAYBAAABAQAACgEAAA4BAAAGAQAAAQFCALYCAQgAFQEJAAcBFwAFEwAAKRMAAAgTRAAFAQEAAAEAACsBAAABAQIAAAEBABYBAAAACUYBBwAIAS8AEgEAAAEBBAAgAQIAAAkZAQQAAAE/ADcBAwATAQEALQEAEQIEAAABBAQAAwQDEQAAAhEAABwRAQACBAMAACkIAQYABwkAAQYAPwEfACQBAQQDAAQBBQkA6QEIADUBAgAGCRUBAQAaAQQAGQEGAAMBCwAGAU8ASAE2ADIBDAAyAQYABQEjCgMdBwAJRwUACUseAAQeAOoB8AEAHgoAACkBAAABBABZAQABAQ8ABUgHAADrAQdIIAAChAECHScBBwAVAQoECAEVABEBAwQDASUAGwETABYBCAAABgAEAAYB7AEyJA0EAJ0BAQkEMgMAEzIJPgAEASQBBAAkCAAA7QEBBAAGLAECBgMEAQYBBAEBAJ4BAwkABAkAAJ4BAQAYAQYACQ4FAAIEIxEEBAAGBQQAKQAEAAAJDgMJABEBBgARBwAiAQAEAAEAIQABCAABBAAGLwECBggEAAYABAABAVsAAQEJAAEACQMEAAEABgAECQ4AAQAhAAECCQAAEwEKABEBAAAYAQIGAgQBBgMEAQkAAQEJAAEABAEBAAQ9AAYBAAAAAQAAAwEAAA4BAAAJAQAJBQAuAQAEAgYHBAQACQ4FAAEEAQYAAAckAQABJAEAFSQAAAYkAAABJAAABCQAAAA/AAQACQAEAAYABAMGAQABBgEAAQYAnQEBAAA+BQAABAQAAAkBPgEkAQYBAAYEAgAEBAoACWUAAABlAQAAZQAAAWUj7gEAAAB7AB4BQwUeAAAAHgEAAB4AAAIeAEMAAAFDAR4A7wEA8AEAHgJ7AAABewcAAR4cADQBAgYHBAEGAgQABgAEAwEDCQABCQ4BCQAAAAEABAIBHQAvAQAEAQYFBAAGAAQBBgAEAAYBBAAGAQQDAQcACQ6lAQAuAQAEAQYDBAEAAwYBBAAGAQQAIQEJATYCAQ4JAwEBBCEALwECBgcEAQYABAAGAQQBCQEBCgAJDgUADHMSACoBAAQABgAEAQYHBAEBBQAJDgUAE0sbABoVAQAAEgAqABIBJwMSACoEEgMACQ4BFQIJBxW4AQArAQIGCAQABgEEAAFjAD8BCQ4IAQsAAAEGKwEAACsBAAcrAAABKwAAFysABAQGAAABBgEAAgQAXQB8AAYAfAAGAAQCCQgACV5FAAcBAQAmAQIGAwQBAAEEAwYABAABACEAAQAGGgAAEQkEJxEFBAAGAAEDBAAhAAEDCQAhAAEAKQcAABEFBAEGAgQnEQVbDAQABgAEACkCCQABAiEBCQwASAEGAAkhVQAAHgBDAh4AQwAeAEOHAQAJSwUACAEAACQBAAYGBAAABQQABgAEAAEECQkACQ4SAQIAACEANh0BAQAVBAAAAAYGBAAGAQQABgEESAAGAQAAAQEAACUBBQQCAAAEAAABBAAABgQAWwAEBwAJDgUABQEAAAEBAAAfAQQGAAABBAAAAQYABAAGAAQAAQYACQ41AAlL9QEAET4ACQEEAQYBCQYAAQQAfAAGDCsAACErAQYEBAIAAQYBBABdAQkKMgk+AB5UAAABDgAcAQNREAEMAAAJmQcBZQBuAQAABAkKAMMBAcsUAGIBDADXBAECRAJMIwEATAIBAEQATABEAEzuAQEARAFMsgEBAEQGnwEAfQB+Ap8BAH0AfgB9AH4ABAUBDgSpHwDNAwEARABMdgG4NQAdoAELHgJDAh4JoAHFDQC4BAEGAB4BAAAJDgMAAQlOAQAACQ4FAB0BAQAEBAAJCQAvAQYEAgkJAQAJAAEJAAkOAAAGAQAAFAEEABIB0gMAAKEBAgADoQECAAF0CUvFAQBWAQEJAQFkAEoBAwAABAABNgYGAAMEDAE/AANAAPEBCgABkgEB8gECZggA9y8NB2b/BQ3VA2coAADzAQgNFWZgAHJm/EMAA2cAAAZnAAABZwAAogINDgAAGhwAAhoBAAAaDQADGgcAiwMNgxIAagEEAAwBAgAIAQYACQEBAAABAQQACQMt2x4A7wE3CfQBAjcCALMDNwUAFjcOABA3DgAtGAEAFhgIAHMFOwD1AQUJACYFAQA7BQF/AhgCBQV/By0HGAEFBhgdBQMYPAUUAEEUAvUBABR5ABMFCwATBQsAVlIIABZSAQWGAQBUBQAARgUAAAEFAQAABQEAAQUBAAMFAAALBQAAAAUAAAYFAABABQAAAwUBAAcFAAAGBQAAGwUAAAMFAAAEBQAAAAUCAAYFAADTAgUBAKMCBQEAMWn/AwE2BAMBMQQHAQAEDQEABAEBAwkAAQ4ABAQAAA4EzwgAHhMFAAUT1AEABgQAABAEAQAGBAAAAQQAAAQEBAA9NSAAADpvACwBAgAGBAYBAQAJDgMAAQG/AgAdAQAEEAArAQMECQ4EAAA9zwMAGwEDBAkO8wEAAR4AAAlL5wEAAB4BAAAeBgABHgQAAB7pAQAGAQAAAwEAAAEBAAAOAQAAxAEBAQAIAQYEKABDAQYEAAEDAAkOAwABRJAGADoFACUCBQAlAwVLADwFwQEAAwoAABoKAAABCgAAAAoBAAAKAAAJCgAAAwoAAAAKAAAACgUAAAoDAAAKAAAACgAAAAoAAAIKAAABCgAAAAoBAAAKAAAACgAAAAoAAAAKAAAACgAAAQoAAAAKAQADCgAABgoAAAMKAAADCgAAAAoAAAkKAAAQCgQAAgoAAAQKAAAQCjMAAQqNAgADDAAIJgwDG2MMCxsODAEbDgwAGw0MAAgAGyQMCRsMBwJoHQcBBTkHAgUCaAEjCwcBIw0HAGIBBwliEQcAaDcbGfYBAA0BCAwbCRkACBMZAAgBGQgIABkDGwgZBhsBCA0bBRmZARsgCAALAQwICwgIAAtFCAALBggAFg0IAQwBCwAMAgsBBQELFAgBHAQIABwECAIWAQgAFgEIABYBSgELBAgLCxAIAQwACwAIAAsADAALAggE9wE+CAALAAgACwEWAQgKFhQIEhYCCAAWAwgCFgAIAhYGCAAWAAgAFg0IABwACAAcAAgAHAQIABYDCAAcAAgBHEkIAAsADAAIBhwPCA0cDAgLHAoFABAACwMIAAwXCAYMAQsBDAALAUoDCwAWCwwACwEMAwsBDABKAwwBFgwMAAgACwEMAAsHDAELCAwACwQMAgsLDAILBwUCCwEMAAsADAALAwwACwUMAAsCDAALBQUAC0kIAhYCCAQWJQUCPAJ1AwUiCAAWDwgCFggIABYECAQMAAsAFgILAggBDAIIAC8CGwMIBQsCDAALAAwBCAIbAAsBDAALCAgCG3MFAgwDVAQMVAUEDAUbCwgDGwAIDhsLBQM7NwUHOwkFBTsnBQc7HQUBOwFoCVQDOwFUDTsIVCY7CwUAFgEIABYHCAcWBQgAFggICRYACAAMAhYGCAAMLwgAFjwIARYACAEWAAgAFhAIAhYACAwWIQhTBQNUBxsNDAEbDAgCGwgIAS8CGwEvLQgALwMIAhYALwAbAC8DGwAvDQgALwEbAC8ICAEvAxsALwgWBhuSAQUAADYFJDcJaQA3BAD9BxsBAP3/Aw0BAP3/Aw2BgCgAAEkALR1JX39/Se8BGI8cSf/fCwA=",ww="sBPUAQsLMzQDCwMLKgQLIiIqEw4LC0ALCz8wFAMqKjstAwM/BBcMCx8NA0AsA0AfKgMWKgsaIisYCwkLKywDPgoMIQMyFSoDDg4NEwsLLxMUCRADCQ0tCwsMFwMVGQMLFSAhGSssLQ8rISotCxMVAxMNCQsOFEAXBB4LCwsLKSI5DhQDBAYTEAM/GxwdBAMmJx4oLDIDAyoLNTU3LCwqLCwgExUhCwUHCA8REg8UBgsLAwMVEBADCwwEHgQVExUjCwMXJAMlFhgVBAspLgkEFBQZBDErAyoEAF4kFA4sMjYVMik3MissMioyLTgnGQQ5FR8gOToyLRMDPD0LCzQ1CvgBBEELC0AB+AEFPC0DA0AD+AEEQSwDQQz4AQE/MvgBAUEF+AEBOgT4AQFABvgBATMA+AEDNjY4JvgBAg4UFPgBBTcVMik4A/gBCjknGQQ6FR8gOjsA+AECPT5y8AMEAy0qMhbwAwMsNjY58AMEDDE1KwD4AQE1GfADABT4AQEyxgH4AQEy0AH4AQAO6AUAIPgBCgYGEhMIBgoGBwYAAwUGBgcLCAAGCQYIBgYHBwgICwENAAAOBQwKCwYDAiQAAgEBCAAMAggGAD0AAAEBAwEbAQgEHQcIBggJBgwGAj8BCwIUAQkBBwEMBUINCQMDCAMDCQYICg0ODwFyAQMAOgAGZAcICQMGDgQFAg0AARwFCAYGAwkAcgEDAGMFCgYDEBEDHAAHmgEABkAACwkECAsMCQALAwgUCHL4AQEQffgB1AE0AxUWDgMOARkIAxkZGSMlAwMuAwMuEQ0OGQwaAw40LggJKAECJg4uDQ4uAhkOLBoBFxkkKwMTNCQNDhoqKAYOIg4ZNCUlJyM0NBE0DRMcDhMmAzQaKQkOFAgOAxQyGQgkDQENJDQ0AxkjFA4jJhMDJQ0uCTQiNDQ0NCk0BSUNDggKIxw0Lh0fHgg0BxsiMw0iDg4ZNBMTJw0NGQ0NMiMUNDQgEC8PGDAPDSEBAw4UFBwcDgMoCCIIFC40MTQOCTUONiwrFAgDKAQTAw0NCAgIJA40CABeGQ0lHBwbDiIpJyIkDSIMIgMLGzQ0BRQ0NDQABAsOLRIAAAUFAAAAAAYFAAMJAgUFBg8AAxsBAwIHAAIrAQUEGAICAAoBAQUKDgQFBQADBS4ACAEBAxA0AQUAAQMABQMBAQICACUBAAQrAgMFBWsAAUkEBQUDAgEBAAmRAQQAAAUHAAEZAAcAAAcQAAAHBwEABwcDDgcAAgsABwcAEAMbBAAKBwAAJwAAWQAABwYPBwATFA8AFAMVBwsBGQIQEAAOBQAACRAHAdEBBAgLBxIBWgUWAgACFgI8CA0AEBERExQHASsBBwMFAAA7ARAACgIRCwBfAABSAAEWBwIAAwQHBwcEDQsABAQABQYMCwoHEQEwDxAQBwsHDwAOAAsLAAADDgE7BBcYAw8AhQEBAwFPBREAAAAPABgCExQBRQQHBxAHAwEEAA4AAA==",bw=[1055,5151,25631,8,42015,12,10,1,479,351,287,31,415,159,4,2,2064,16,543,4097,24577,63,5121,-7137,58399],Im={"chromium/line_normal":[65,63,11,365,null,"AQA+BgIAAwAEAAQABQAGAAcACAAJAAoACwAMAA0ADgAPABAAEQASABMAFAAVAAgAFgAXABgAGQAaAAcAGwAHABsAHAAHAB0AHgAfAAcAIAAhACIAIwAkACUAJgAnACgAKQAqACsALAAqACoALQAuAC8AMAAxADIAIgAzAAkAAgABGgABEzQECAAAADUAAwEAAAAAAAEAAAAAAAAAAAACAAMAAAADAAAAAgAAAAMAAAABAAAAAAAAARIGNgcAAAAAAAAABAABAAI3AQAKOAMAAwAAAAgAAgADAAAAADYAAAIAAQECAAEBCAQAAQ4CAAYEAAUABgAHBQ0AOQEQARIDOgsdAyADJAgqAAQFBjsREw88FDAFOwAHCAABBT0NNAQ+ATcAAws9Gj0ABwQGPxQ3DEAaPwACEwZBCAAAAABCBwgAAAcAAAAAAAEAAUMAAAIAAUILAAAAAAACAANBAAIJBkQIAAAAAEIWRQMAAUILAAhEAAQEBkYERxxGGkYAAgYGSARJBQAWSgUAFEgAAQQGSwQGHEwaSwABBQZNEQAPThQABU0ACQQGTxYXClAaTwAICAZRC1IAUwFUAVUQVgZXE1EACwQGWARJHFkaWAALBQZaDVsHXAtaGloACAUGXQReDV8OXRpdAA0FBmASCA5hEgAHYAAHBAZiDwARYxpiAA4FBmQNZQdmC2caZAARDAECBGgJCwhpAWoCGAAZCGsNKwAsAi0IaAASBwZsCQsOGQAaB20RLQhsAAEEBm4YAAhvGm4AFAgGcBtxAHIAcQEHAXMIcRFwAAIEBnQZAAd1GnQAATsBAwR2AHYDdwB2AHYAdgB2AHYAdgB2AHYAdgB2AHYAdgB2AHYAdgB2AHYAdgB2AHYAdgB2AHYAdgB2AHYAdgF2AHYAdgB2AHYAdgB2AHYAdgB2AHYAdgB2AHYAdgB2AHYAdgB2AHYAdgB2AHYAdgB2AHYAdgB2AAkFBgIUNQweEi4HAgANBQZ4BHkcegAfGXgAAgQGexQ3DHsaewAXBgECBHwSaQFqDH0afAAGBgECBH4SaQFqDH8afgAXBAaAARRqDIABGoABAAIGBoEBBEkEABeCAREACIEBABwGAQIEgwESaQFqDIQBGoMBAB0HBoUBG3EAcgBxAQcBhgEahQEACwQGhwEhiAEXIgKHAQAGBAaJASGKARciAokBAAUGBosBBAYMAA+MARQABYsBAAYEBo0BBAYcjgEajQEACQUGjwEYGQAaB5ABGo8BAAEEBpEBGAAIkgEakQEAIgYBAgSTARJpAWoMlAEakwEAKAkGlQEGCAUOBBMACAE3DJYBFDAFlQEAKAYGlwEbGwEbA5gBCCYRlwEAHQQGmQEUagyZARqZAQAKAwaaASGbARqaAQArBAacASGdARaeAQOcAQAqBAafASGgARciAp8BADEEBqEBDxERogEaoQEAFQUEowEBpAESpQEOpAEapAEAMwEbpgEAAgQGpwESqAEOpwEapwEAGAQGNhSmAQw4GjYAASIAAAAEAqMBAakBCKoBAKoBAKoBBAADqgEACAKqAQCqAQCqAQGqAQCqAQCqAQCqAQCqAQGrAQCqAQKqAQCqAQCqAQOqAQCqAQKqAQCqAQKqAQCqAQCqAQGqAQCqAQCqAQKpAQAMBwAAA6MBAToSrAEBCAw6GjoANAEbpgEABAMGOyE8GjsANQEbpgEAMgQGrQEErgEcrQEarQEANgEbpgEABAMGPyFAGj8ANwEbpgEAAAUGQgyvAQIREUIaQgADAwZBIUMaQQA5ARumAQACAwZEIUUaRAA6ARumAQABBwawAQyxAQCyAQazAQC0AQu1ARqwAQA7ARumAQBDAwtJFQcTKgAFBAZIBEkcShpIAD0BG6YBAAcDBkshTBpLAD4BG6YBAAIDBk0hThpNAD8BG6YBAAIDBk8hUBpPAEABG6YBAEkFBrYBBEkFABa3ARq2AQBCBAa4AQoAFrkBGrgBAAEIBroBBwAZuwEHAAAADwAAAAC6AQA5Bga8AQRJAwoYvQEDIRa8AQAGCAZRC1IAUwFUAVUQVgZXE1EAAgYBAgS+ARJpAWoMvwEavgEARgEbpgEADwMGWCFZGlgARwEbpgEATAMGwAEhwQEawAEARgMGwgEhwwEawgEASQEbpgEAFwcGxAEEXgjFAQQUAsYBC8cBGsQBAEsEBsgBBMkBHMgBGsgBAEsBG6YBAAEBOy4ATAEbpgEAAgMGYiFjGmIATQEbpgEAUAQGygEWAArLARrKAQABAwbMASHNARrMAQAEBQZkDWUHZgtnGmQAUAMBBRfOAQHPAQBhEwbQARfRAQnQAQPSAQDTAQDUAQDVAQDWAQLXAQDYAQDZAQDaAQDbAQDZAQDZAQDcAQLdAQLTAQLQAQAzDgEGBN4BF98BCeABA+EBAOIBAOMBAeQBAuUBAuYBAOcBAugBBeIBAt4BAAgEBmgUzwEMaxpoAFMBG6YBAAoDBmwhbRpsAFQBG6YBAAIDBm4hbxpuAFUBG6YBAAAEBnEfBwFxGnEAQwQG6QEdAAPqARrpAQAEBAZwHHIEcxpwAFgBG6YBAAYDBnQhdRp0AAABAAMAWgkM6wEF7AEA7QEB7gEB7wED8AEP8QED8gEI8wEAWQEbpgEAcwILeR0fAAUEBngEeRx6GngAWwEbpgEAWwMBBRfOAQHPAQASAwZ8IX0afABcAwEFF84BAc8BAAIDBn4hfxp+AF0BG88BAF0DAQUXzgEBzwEAAwQGgQEESRyCARqBAQBeAwEFF84BAc8BAAUDBoMBIYQBGoMBAF8BG6YBABMDBoUBIYYBGoUBAGABG6YBAA0DBocBIYgBGocBAGEDAQUXzgEBzwEABgMGiQEhigEaiQEAYgMBBRfOAQHPAQACAwaLASGMARqLAQBjAwEFF84BAc8BAAIDBo0BIY4BGo0BAGQDAQUXzgEBzwEAAgMGjwEhkAEajwEAZQMBBRfOAQHPAQACAwaRASGSARqRAQBmAwEFF84BAc8BAAIDBpMBIZQBGpMBAGcBG6YBAA4FBpUBDfQBB/UBC5YBGpUBAGgBG6YBABADBpcBIZgBGpcBAGkBG88BAGkBG6YBAAMDBpoBIZsBGpoBAGoBG6YBAAIEBpwBIZ0BFvYBA5wBAGUlAQcE9wEH+AEA+AEA+AEA+AEE+AED+AEC+AEA+AEA+AEA+AEB+AEA+AEA+AEA+AEA+AEB+QEA+AEC+AEA+AEA+AEB+AEA+AEA+AEA+AEC+AEA+AEC+AEA+AEA+AEB+AEA+AEA+AEA+AEA+AEA9wEAbAEbpgEABQMGnwEhoAEanwEAbQEbpgEAAgMGoQEhogEaoQEAAAEAAQBvARumAQBGBQb6AQT7AQ2lAQ76ARr6AQBvBAb8ARL9AQ78ARr8AQBwARumAQADBQb+AQT/AQ2oAQ7+ARr+AQBwGwEIDYACAIACAIACCIACA4ACAIACAIACAYACAIACAIACAIACAIACAoACAoACAIACAIACA4ACAIACAoACAIACAoACAIACAIACAYACAIACAIACAAABAAQABAcAAAWpAQ8AAggBCAyrARqpAQAEBQaBAgSCAg2DAg6BAhqBAgBvARumAQBnBgaEAgSuAQiFAgeGAguHAhqEAgAABAavAQ8REa8BGq8BAHEEBrABFAgMtQEasAEAeAYAAQWIAg8RBDcMiQIaiAIAVwMGigIhiwIaigIADQQGjAISgwIOjAIajAIAWAMGjQIhjgIajQIAEwQGsAEUCAy1ARqwAQBkARumAQBeAwa2ASG3ARq2AQBlARumAQBjAwa4ASG5ARq4AQBmARumAQACAwa6ASG7ARq6AQBnARumAQAGAwa8ASG9ARq8AQBnAwEFF84BAc8BAD0DBr4BIb8BGr4BAGUBG6YBAB8DBsABIcEBGsABAGYBG6YBAAIDBsIBIcMBGsIBABQDBsQBIccBGsQBABMDBo8CIZACGo8CABIDBpECIZICGpECABIDBsQBIccBGsQBAGkBG6YBAAEHBpMCDLEBAJQCBrMBAJUCC5YCGpMCAGUBG6YBAAECHRcdLgBmARumAQABAh0XHS4AZRMGlwIXmAIJlwIDmQIAmgIAmwIAnAIAnQICngIAnwIAoAIAoQIAogIAoAIAoAIAowICpAICmgIClwIAZQQGpQIS/QEOpgIapQIAZwEbpgEAuQEBAAIAsQEBAAIAsQEBAAIAsQEBAAIAsQEBAAIAsQEBAAIArwEBAAIArwEBAAIArwEBAAIArwEBAAIArwEBAAIArwEBAAIArQEBAAIAdAwBCRmmAQKnAg2oAgCpAgCqAgGrAgKsAgKtAgCuAgKvAgWpAgAOAQAGADkDBt4BIeABGt4BAA8BAAYADwEABgAPAQAGAA4BAAYADgEABgAMAQAGAAwBAAYADAEABgB3ARumAQAdAwbpASHqARrpAQDkAQEAAwDfAQEAAwC0AQEAAwDeAQEAAwDdAQEAAwC2AQEAAwDRAQEAAwAdAQADABoBAAMALwMGsAIhsQIasAIALwMGsgIhswIasgIAWAYAAQW0AhQ3DLUCFrYCA7QCAFkiAQoMtwIAtwIAtwIAtwIEtwIDtwICtwIAtwIAtwIAtwIBtwIAtwIAtwIAtwIAtwICtwICtwIAtwIAtwIBtwIAtwIAtwIAtwICtwIAtwICtwIAtwIAtwIBtwIAtwIAtwIAtwIAtwIAAAEABwAyBASjAQH3ASH5ARr3AQBVARumAQABBwa4AgyxAQC5AgazAQC6Agu7Ahq4AgBWARumAQBRBQa8AgS9Ag39AQ68Ahq8AgBWARumAQABBwa+AgyxAQC/AgazAQDAAgvBAhq+AgAAAQAIAFUBG6YBAAMHBsICBIICCMMCBKwBAsQCC8UCGsICAFcEBsYCBMcCHMYCGsYCAEADBoQCIYcCGoQCABEDBsgCIckCGsgCABEDBsoCIcsCGsoCAEADBoQCIYcCGoQCAF8GAAEFiAIPEQSmAQyJAhqIAgANBAaIAhIIDokCGogCAFgBG6YBACEDBooCIYsCGooCAFkBG6YBAFkBG6YBAAMDBo0CIY4CGo0CAEoBG6YBAAIDBo8CIZACGo8CAEsBG6YBAAIDBpECIZICGpECAA8DBpMCIZYCGpMCAA8DBswCIc0CGswCAA8DBs4CIc8CGs4CAA8DBpMCIZYCGpMCAEkBG6YBADkBAAUAOAEABQA4AQAFADgBAAUAKgEABQA5AQAFADkBAAUARwEABQAtAQAFADsBAAUAOwEABQA7AQAFAEcBAAUARwQGpQIS/QEOpgIapQIAKgMGpQIhpgIapQIADwEACQAPAQAJAA8BAAkADwEACQAOAQAJAA4BAAkADAEACQAMAQAJAAwBAAkAPAEbpgEAHwMGsAIhsQIasAIAPQEbpgEAAgMGsgIhswIasgIAPQYAAQW0AhSmAQy1AhbQAgO0AgAsBAa0AiG1Ahb2AQO0AgCYAQEABwAAAQAKACUDBrgCIbsCGrgCACUDBtECIdICGtECACUDBtMCIdQCGtMCACUDBrgCIbsCGrgCAD8BG6YBAAEHBtUCDLEBANYCBrMBANcCC9gCGtUCAAYDBr4CIcECGr4CAAYDBtkCIdoCGtkCAAYDBtsCIdwCGtsCAAYDBr4CIcECGr4CAAQDBsICIcUCGsICAAQDBt0CId4CGt0CAAQDBt8CIeACGt8CAAQDBsICIcUCGsICAEMBG6YBAAEHBuECDLEBAOICBrMBAOMCC+QCGuECAEMBG6YBABYDBsgCIckCGsgCAEQBG6YBAAIDBsoCIcsCGsoCADgBG6YBAAIDBswCIc0CGswCADkBG6YBAAIDBs4CIc8CGs4CABoBAAoAGAEbpgEAAwMG0QIh0gIa0QIAGQEbpgEAAgMG0wIh1AIa0wIAEwMG1QIh2AIa1QIAEwMG5QIh5gIa5QIAEwMG5wIh6AIa5wIAEwMG1QIh2AIa1QIAGgEbpgEABgMG2QIh2gIa2QIAGwEbpgEAAgMG2wIh3AIa2wIAGgEbpgEAAgMG3QIh3gIa3QIAGwEbpgEAAgMG3wIh4AIa3wIADAMG4QIh5AIa4QIADAMG6QIh6gIa6QIADAMG6wIh7AIa6wIADAMG4QIh5AIa4QIADwEbpgEABgMG5QIh5gIa5QIAEAEbpgEAAgMG5wIh6AIa5wIABwEbpgEAAgMG6QIh6gIa6QIACAEbpgEAAgMG6wIh7AIa6wI="],"chromium/line_normal_cj":[66,64,11,367,null,"AQA/BgIAAwAEAAQABQAGAAcACAAJAAoACwAMAA0ADgAPABAAEQASABMAFAAVAAgAFgAXABgAGQAaAAcAGwAHABsAHAAHAB0AHgAfAAcAIAAhACIAIwAkACUAJgAnACgAKQAqACoAKwAsACoAKgAtAC4ALwAwADEAMgAiADMACQACAAEbAAETNAQIAAAANQADAQAAAAAAAQAAAAAAAAAAAAIAAwAAAAMAAAACAAAAAAADAAAAAQAAAAAAAAESBjYHAAAAAAAAAAQAAQACNwEACjgDAAMAAAAJAAIAAwAAAAA2AAACAAEBAgABAQgEAAEOAgAGBAAFAAYABwUNADkBEAESAzoLHQMgAyQJKgAEBQY7ERMPPBUwBTsABwgAAQU9DTQEPgE3AAMLPRs9AAcEBj8UNwxAGz8AARQGQQgAAAAAQgwYABkAGgQcAkMDAAAiAEIDJwAoAysALAIAAzEBIgJBAAIJBkQIAAAAAEIWRQMAAUIMAAhEAAQEBkYERxxGG0YAAgYGSARJBQAWSgUAFUgAAQQGSwQGHEwbSwABBQZNEQAPThUABU0ACQQGTxYXClAbTwAICAZRC1IAUwFUAVUQVgZXFFEACwQGWARJHFkbWAALBQZaDVsHXAtaG1oACAUGXQReDV8OXRtdAA0FBmASCA5hEwAHYAAHBAZiDwARYxtiAA4FBmQNZQdmC2cbZAARDAECBGgJCwhpAWoCGAAZCGsOKwAsAi0IaAASBwZsCQsOGQAaB20SLQhsAAEEBm4YAAhvG24AFAgGcBtxAHIAcQEHAXMIcRJwAAIEBnQZAAd1G3QAATwBAwR2AHYDdwB2AHYAdgB2AHYAdgB2AHYAdgB2AHYAdgB2AHYAdgB2AHYAdgB2AHYAdgB2AHYAdgB2AHYAdgF2AHYAdgB2AHYAdgB2AHYAdgB2AHYAdgB2AHYAdgB2AHYAdgB2AHYAdgB2AHYAdgB2AHYAdgB2AHYACQUGAhQ1DB4TLgcCAA0FBngEeRx6AB8aeAACBAZ7FDcMext7ABcGAQIEfBJpAWoMfRt8AAYGAQIEfhJpAWoMfxt+ABcEBoABFGoMgAEbgAEAAgYGgQEESQQAF4IBEgAIgQEAHAYBAgSDARJpAWoMhAEbgwEAHQcGhQEbcQByAHEBBwGGARuFAQALBAaHASGIARgiAocBAAYEBokBIYoBGCICiQEABQYGiwEEBgwAD4wBFQAFiwEABgQGjQEEBhyOARuNAQAJBQaPARgZABoHkAEbjwEAAQQGkQEYAAiSARuRAQAiBgECBJMBEmkBagyUARuTAQAoCQaVAQYIBQ4EEwAIATcMlgEVMAWVAQAoBgaXARsbARsDmAEIJhKXAQAdBAaZARRqDJkBG5kBAAoDBpoBIZsBG5oBACsEBpwBIZ0BF54BA5wBACoEBp8BIaABGCICnwEAMQQGoQEPERGiARuhAQAVBQSjAQGkARKlAQ6kARukAQAzARumAQACBAanARKoAQ6nARunAQAYBAY2FKYBDDgbNgABIwAAAAQCowEBqQEIqgEAqgEAqgEEAAOqAQAIAqoBAKoBAKoBAaoBAKoBAKoBAKoBAKoBAasBAKoBAqoBAKoBAKoBA6oBAKoBAqoBAKoBAKoBAqoBAKoBAKoBAaoBAKoBAKoBAqkBAAwHAAADowEBOhKsAQEIDDobOgA0ARumAQAEAwY7ITwbOwA1ARumAQAyBAatAQSuARytARutAQA2ARumAQAEAwY/IUAbPwA3ARumAQAABQZCDK8BAhERQhtCAAMDBkEhQxtBADkBG6YBAAIDBkQhRRtEADoBG6YBAAEHBrABDLEBALIBBrMBALQBC7UBG7ABADsBG6YBAEMDC0kVBxMqAAUEBkgESRxKG0gAPQEbpgEABwMGSyFMG0sAPgEbpgEAAgMGTSFOG00APwEbpgEAAgMGTyFQG08AQAEbpgEASQUGtgEESQUAFrcBG7YBAEIEBrgBCgAWuQEbuAEAAQgGugEHABm7AQcAAAAQAAAAALoBADkGBrwBBEkDChi9AQMhF7wBAAYIBlELUgBTAVQBVRBWBlcUUQACBgECBL4BEmkBagy/ARu+AQBGARumAQAPAwZYIVkbWABHARumAQBMAwbAASHBARvAAQBGAwbCASHDARvCAQBJARumAQAXBwbEAQReCMUBBBQCxgELxwEbxAEASwQGyAEEyQEcyAEbyAEASwEbpgEAAQE8LgBMARumAQACAwZiIWMbYgBNARumAQBQBAbKARYACssBG8oBAAEDBswBIc0BG8wBAAQFBmQNZQdmC2cbZABQAwEFF84BAc8BAGEUBtABF9EBCdABA9IBANMBANQBANUBANYBAtcBANgBANkBANkBANoBANsBANkBANkBANwBAt0BAtMBAtABADMPAQYE3gEX3wEJ4AED4QEA4gEA4wEB5AEC5QEC5gEA5wEA6AEC6QEF4gEC3gEACAQGaBTPAQxrG2gAUwEbpgEACgMGbCFtG2wAVAEbpgEAAgMGbiFvG24AVQEbpgEAAAQGcR8HAXEbcQBDBAbqAR0AA+sBG+oBAAQEBnAccgRzG3AAWAEbpgEABgMGdCF1G3QAAAEAAwBaCQzsAQXtAQDuAQHvAQHwAQPxAQ/yAQPzAQn0AQBZARumAQBzAgt5HR8ABQQGeAR5HHobeABbARumAQBbAwEFF84BAc8BABIDBnwhfRt8AFwDAQUXzgEBzwEAAgMGfiF/G34AXQEbzwEAXQMBBRfOAQHPAQADBAaBAQRJHIIBG4EBAF4DAQUXzgEBzwEABQMGgwEhhAEbgwEAXwEbpgEAEwMGhQEhhgEbhQEAYAEbpgEADQMGhwEhiAEbhwEAYQMBBRfOAQHPAQAGAwaJASGKARuJAQBiAwEFF84BAc8BAAIDBosBIYwBG4sBAGMDAQUXzgEBzwEAAgMGjQEhjgEbjQEAZAMBBRfOAQHPAQACAwaPASGQARuPAQBlAwEFF84BAc8BAAIDBpEBIZIBG5EBAGYDAQUXzgEBzwEAAgMGkwEhlAEbkwEAZwEbpgEADgUGlQEN9QEH9gELlgEblQEAaAEbpgEAEAMGlwEhmAEblwEAaQEbzwEAaQEbpgEAAwMGmgEhmwEbmgEAagEbpgEAAgQGnAEhnQEX9wEDnAEAZSYBBwT4AQf5AQD5AQD5AQD5AQT5AQP5AQL5AQD5AQD5AQD5AQH5AQD5AQD5AQD5AQD5AQH6AQD5AQL5AQD5AQD5AQH5AQD5AQD5AQD5AQL5AQD5AQD5AQL5AQD5AQD5AQH5AQD5AQD5AQD5AQD5AQD4AQBsARumAQAFAwafASGgARufAQBtARumAQACAwahASGiARuhAQAAAQABAG8BG6YBAEYFBvsBBPwBDaUBDvsBG/sBAG8EBv0BEv4BDv0BG/0BAHABG6YBAAMFBv8BBIACDagBDv8BG/8BAHAcAQgNgQIAgQIAgQIIgQIDgQIAgQIAgQIBgQIAgQIAgQIAgQIAgQICgQICgQIAgQIAgQIDgQIAgQICgQIAgQIAgQICgQIAgQIAgQIBgQIAgQIAgQIAAAEABAAEBwAABakBDwACCAEIDKsBG6kBAAQFBoICBIMCDYQCDoICG4ICAG8BG6YBAGcGBoUCBK4BCIYCB4cCC4gCG4UCAAAEBq8BDxERrwEbrwEAcQQGsAEUCAy1ARuwAQB4BgABBYkCDxEENwyKAhuJAgBXAwaLAiGMAhuLAgANBAaNAhKEAg6NAhuNAgBYAwaOAiGPAhuOAgATBAawARQIDLUBG7ABAGQBG6YBAF4DBrYBIbcBG7YBAGUBG6YBAGMDBrgBIbkBG7gBAGYBG6YBAAIDBroBIbsBG7oBAGcBG6YBAAYDBrwBIb0BG7wBAGcDAQUXzgEBzwEAPQMGvgEhvwEbvgEAZQEbpgEAHwMGwAEhwQEbwAEAZgEbpgEAAgMGwgEhwwEbwgEAFAMGxAEhxwEbxAEAEwMGkAIhkQIbkAIAEgMGkgIhkwIbkgIAEgMGxAEhxwEbxAEAaQEbpgEAAQcGlAIMsQEAlQIGswEAlgILlwIblAIAZQEbpgEAAQIdFx4uAGYBG6YBAAECHRceLgBlFAaYAheZAgmYAgOaAgCbAgCcAgCdAgCeAgKfAgCgAgChAgChAgCiAgCjAgChAgChAgCkAgKlAgKbAgKYAgBlBAamAhL+AQ6nAhumAgBnARumAQC5AQEAAgCxAQEAAgCxAQEAAgCxAQEAAgCxAQEAAgCxAQEAAgCvAQEAAgCvAQEAAgCvAQEAAgCvAQEAAgCvAQEAAgCvAQEAAgCtAQEAAgB0DQEJGaYBAqgCDakCAKoCAKsCAawCAq0CAq4CAK8CALACArECBaoCAA4BAAYAOQMG3gEh4AEb3gEADwEABgAPAQAGAA8BAAYADgEABgAOAQAGAA0BAAYADQEABgANAQAGAA0BAAYAeAEbpgEAHgMG6gEh6wEb6gEA5QEBAAMA4AEBAAMAtQEBAAMA3wEBAAMA3gEBAAMAtwEBAAMA0gEBAAMAHgEAAwAOAQADADADBrICIbMCG7ICADADBrQCIbUCG7QCAFkGAAEFtgIUNwy3Ahe4AgO2AgBaIwEKDLkCALkCALkCALkCBLkCA7kCArkCALkCALkCALkCAbkCALkCALkCALkCALkCArkCArkCALkCALkCAbkCALkCALkCALkCArkCALkCALkCArkCALkCALkCAbkCALkCALkCALkCALkCAAABAAcAMwQEowEB+AEh+gEb+AEAVgEbpgEAAQcGugIMsQEAuwIGswEAvAILvQIbugIAVwEbpgEAUgUGvgIEvwIN/gEOvgIbvgIAVwEbpgEAAQcGwAIMsQEAwQIGswEAwgILwwIbwAIAAAEACABWARumAQADBwbEAgSDAgjFAgSsAQLGAgvHAhvEAgBYBAbIAgTJAhzIAhvIAgBBAwaFAiGIAhuFAgARAwbKAiHLAhvKAgARAwbMAiHNAhvMAgBBAwaFAiGIAhuFAgBgBgABBYkCDxEEpgEMigIbiQIADQQGiQISCA6KAhuJAgBZARumAQAhAwaLAiGMAhuLAgBaARumAQBaARumAQADAwaOAiGPAhuOAgBLARumAQACAwaQAiGRAhuQAgBMARumAQACAwaSAiGTAhuSAgAPAwaUAiGXAhuUAgAPAwbOAiHPAhvOAgAPAwbQAiHRAhvQAgAPAwaUAiGXAhuUAgBKARumAQA6AQAFADkBAAUAOQEABQA5AQAFACoBAAUAOgEABQA6AQAFAEgBAAUALQEABQA7AQAFADsBAAUAOwEABQBIAQAFAEgEBqYCEv4BDqcCG6YCACoDBqYCIacCG6YCAA8BAAkADwEACQAPAQAJAA8BAAkADgEACQAOAQAJAA0BAAkADQEACQANAQAJAA0BAAkAPQEbpgEAIAMGsgIhswIbsgIAPgEbpgEAAgMGtAIhtQIbtAIAPgYAAQW2AhSmAQy3AhfSAgO2AgAtBAa2AiG3Ahf3AQO2AgCaAQEABwAAAQAKACYDBroCIb0CG7oCACYDBtMCIdQCG9MCACYDBtUCIdYCG9UCACYDBroCIb0CG7oCAEABG6YBAAEHBtcCDLEBANgCBrMBANkCC9oCG9cCAAYDBsACIcMCG8ACAAYDBtsCIdwCG9sCAAYDBt0CId4CG90CAAYDBsACIcMCG8ACAAQDBsQCIccCG8QCAAQDBt8CIeACG98CAAQDBuECIeICG+ECAAQDBsQCIccCG8QCAEQBG6YBAAEHBuMCDLEBAOQCBrMBAOUCC+YCG+MCAEQBG6YBABYDBsoCIcsCG8oCAEUBG6YBAAIDBswCIc0CG8wCADkBG6YBAAIDBs4CIc8CG84CADoBG6YBAAIDBtACIdECG9ACABoBAAoAGAEbpgEAAwMG0wIh1AIb0wIAGQEbpgEAAgMG1QIh1gIb1QIAEwMG1wIh2gIb1wIAEwMG5wIh6AIb5wIAEwMG6QIh6gIb6QIAEwMG1wIh2gIb1wIAGgEbpgEABgMG2wIh3AIb2wIAGwEbpgEAAgMG3QIh3gIb3QIAGgEbpgEAAgMG3wIh4AIb3wIAGwEbpgEAAgMG4QIh4gIb4QIADAMG4wIh5gIb4wIADAMG6wIh7AIb6wIADAMG7QIh7gIb7QIADAMG4wIh5gIb4wIADwEbpgEABgMG5wIh6AIb5wIAEAEbpgEAAgMG6QIh6gIb6QIABwEbpgEAAgMG6wIh7AIb6wIACAEbpgEAAgMG7QIh7gIb7QI="],"apple/line_normal":[65,63,11,365,"chromium/line_normal","BgACOAAAKicAAjgAACoLAAI4AAAqDgACOAAAKi0AAjh2APMBAQACOAAAKhtnARumAVq2AQEAAw=="],"apple/line":[65,63,11,365,"apple/line_normal",""],"apple/line_cj":[65,63,11,365,"apple/line_normal",""],"chromium/char":[21,21,3,16,null,"AQASBgIAAgADAAQABQAEAAYABAAHAAQACAAJAAoABAAEAAkACgALAAABAAEAAQEHAgACBQsEAQQBBAMEAAQAAQQLBQMFAwUADAAFBAABBQAAAAAAAAMDCwcDDQQHAAQEEAgACQMJAAoABQIRCQAKAAEBEQAABwEXDgAIAQoFAAYDCw0CBwUNAAMCAQIVDwAAAQAC"],"apple/char":[21,21,3,16,"chromium/char",""]},Cw="5DAIgAAACAAAAAQDBAYA/+v/+/8CAQF/DBwACAEADhwCCAAUAQQfgAlAFDgAGBwAGFQAJAEANHAAKDgACBwM9hYAuP///+////9vACsAJDgADAEACIgDAA4eABiYAgDmARwANKQDAChUACQcBLyW/7kH+AMAoQLAAwDqAxwBAFm4BwCeBhwAFYAHAYAY9BMAGpAUAK4BmAIB/xYBAX/wBYwIABgBAZgC5gcBDBCMDwBQHAC2AbQCAAeIGAGGBYgYAScM3AoANIwBAH7QAgEA2wH0BQDAAXAAlg0cAA==",Rm="5DAIgAAACAAAAAQDBAYA/+v/+/8CAQF/DBwACAEADhwCCAAUAQQfgAlAFDgAGBwAGFQAJAEANHAAKDgACBwE/1cA/gTAAgAAKwQfgAnAAxAB/xg4AAwBAAiIAwAOHgAYmAIA5gEcADSkAwAoVAAkHAy8lv+5////7////2+kAsADAOoDHAEAWbgHAJ4GHAAVgAcBgBj0EwAakBQArgGYAgH/FgEBf/AFjAgAGAEBmALmBwEMEIwPAFAcALYBtAIAB4gYAYYFiBgBJwzcCgA0jAEAftACAQDbAfQFAMABcACWDRwA",zd={"":[8220,0,8221,1,8216,0],agq:[8221,1],am:[171,0,187,1,8249,0,8250,1],ar:[],ast:[171,0,187,1,8220,0,8221,1],bas:[171,0,187,1,8221,1],be:[171,0,187,1,8221,1],bg:[8221,1,8221,1],blo:[171,0,187,1,8220,0,8221,1],bm:[171,0,187,1,8220,0,8221,1],br:[171,0,187,1,8220,0,8221,1],bs:[8221,1,8216,0],bua:[171,0,187,1,8221,1],ca:[171,0,187,1,8220,0,8221,1],cs:[8221,1],cv:[171,0,187,1,8220,0,8221,1],da:[],de:[8221,1],dsb:[8221,1],dua:[171,0,187,1,8216,0],dyo:[171,0,187,1,8220,0,8221,1],el:[171,0,187,1,8220,0,8221,1],eo:[8220,0,8221,1,171,0,187,1],et:[8221,1],eu:[171,0,187,1,8220,0,8221,1],ewo:[171,0,187,1,8220,0,8221,1],fa:[171,0,187,1,8249,0,8250,1],ff:[8221,1],fi:[],fr:[171,0,187,1,171,0,187,1],fur:[8216,0,8220,0,8221,1],gsw:[171,0,187,1,8249,0,8250,1],he:[],hr:[8221,1],hsb:[8221,1],hu:[8221,1,187,0,171,1],hy:[171,0,187,1,171,0,187,1],ia:[8216,0,8220,0,8221,1],ie:[171,0,187,1,8220,0,8221,1],is:[8221,1],it:[171,0,187,1,8220,0,8221,1],ja:[],jgo:[171,0,187,1,8249,0,8250,1],ka:[8221,1,171,0,187,1],kab:[171,0,187,1,8220,0,8221,1],kk:[171,0,187,1,8220,0,8221,1],kkj:[171,0,187,1,8249,0,8250,1],ksf:[171,0,187,1,8216,0],ksh:[8221,1],ky:[171,0,187,1,8221,1],lag:[],lb:[8221,1],lij:[171,0,187,1,8220,0,8221,1],lt:[8221,1,8221,1],luy:[8221,1],mg:[171,0,187,1,8220,0,8221,1],mk:[8221,1],mua:[171,0,187,1,8220,0,8221,1],mzn:[171,0,187,1,8249,0,8250,1],nb:[171,0,187,1,8216,0],nds:[8221,1],nl:[8216,0,8216,0],nmg:[8221,1,171,0,187,1],nn:[171,0,187,1,8216,0],nnh:[171,0,187,1,8220,0,8221,1],no:[171,0,187,1,8216,0],oc:[171,0,187,1,171,0,187,1],os:[171,0,187,1,8221,1],pl:[8221,1,171,0,187,1],pms:[171,0,187,1,8220,0,8221,1],prg:[8221,1,8221,1],rm:[171,0,187,1,8249,0,8250,1],rn:[],ro:[8221,1,171,0,187,1],ru:[171,0,187,1,8221,1],rw:[171,0,187,1,8216,0],sah:[171,0,187,1,8221,1],sc:[171,0,187,1,8220,0,8221,1],se:[],sg:[171,0,187,1,8220,0,8221,1],shi:[171,0,187,1,8221,1],sk:[8221,1],sl:[8221,1],sn:[],sr:[8221,1],ss:[8216,0,8220,0,8221,1],st:[8216,0,8220,0,8221,1],sv:[],syr:[],szl:[8221,1,187,0,171,1],ti:[171,0,187,1,8220,0,8221,1],tk:[8220,0,8221,1,8220,0,8221,1],tn:[8216,0,8220,0,8221,1],ts:[8216,0,8220,0,8221,1],tyv:[171,0,187,1,8221,1],ug:[187,0,171,1,8250,0,8249,1],uk:[171,0,187,1,8221,1],ur:[],uz:[8220,0,8221,1],ve:[8216,0,8220,0,8221,1],wae:[171,0,187,1,8249,0,8250,1],yav:[171,0,187,1,171,0,187,1],yi:[],yue:[],zgh:[171,0,187,1,8221,1],az_Cyrl:[171,0,187,1,8249,0,8250,1],bs_Cyrl:[8221,1],ff_Adlm:[8220,0,8221,1,8216,0],fr_CA:[171,0,187,1],fr_CH:[171,0,187,1,8249,0,8250,1],kk_Arab:[187,0,171,1,8250,0,8249,1],ms_Arab:[],pt_AO:[171,0,187,1,8220,0,8221,1],pt_CH:[171,0,187,1,8220,0,8221,1],pt_CV:[171,0,187,1,8220,0,8221,1],pt_FR:[171,0,187,1,8220,0,8221,1],pt_GQ:[171,0,187,1,8220,0,8221,1],pt_GW:[171,0,187,1,8220,0,8221,1],pt_LU:[171,0,187,1,8220,0,8221,1],pt_MO:[171,0,187,1,8220,0,8221,1],pt_MZ:[171,0,187,1,8220,0,8221,1],pt_PT:[171,0,187,1,8220,0,8221,1],pt_ST:[171,0,187,1,8220,0,8221,1],pt_TL:[171,0,187,1,8220,0,8221,1],ti_ER:[8216,0,8220,0,8221,1],uz_Arab:[8220,0,8221,1,8216,0],uz_Cyrl:[8220,0,8221,1,8216,0],zh_Hant:[]},ch=68,Hd=54,Tw=67,Bw="kCQB/QMBAf8AAgABAwABBAH9BQgAAQYB/QQKAAEEAf0EEwAHPQH/DkQB/wdEAf8BBQT///8qBEgADEQC/T8BAgAgiAEBKgEPAT5SiAEE/z//QA6IAQAWRAL/Pg/MAQH/BgIAIMwBABDUAgBAkAIABCEAIkQBPBKIAQAOoAQB/SvMAQH/BgEACAwAEQEBKhIXAf1KAQH/BKwEAAa+AQH9Bw0D/f+yFpgDACawBgA6RAAE5AQC/TtV9AYAIEQABYgBAv87ErgHAB3qAgAnLAAEiAEB/xGQAgBA1AIAPkQAJewFADQBABuIAQAEJAA4zAEB/yKQAgADoAQBPQugBAE9KdgLAB3ACAH/RLAGACpEAf9xoAQAIvQGAAREACbUAgABiwMAAiwAZqAEAEeoBQCEAQEAXdwDABuwBgArrAgBNxDACABARAAgzAEAArwBADrgDAAtRAAVswoAWkQAQNgLAAoPASs/RAEsHDABOC7gDAAL7AUBQVj0FwAOkBMB/RGQEwP9Of0qhAkB/07gDABeRAAoiQQAFagWAEyYAwAPxBMACzABNRIlAGmMCgErQ4wKABGwBgH+BQEB/wADAf8ABgH/BhIABg0C/v8EHAT//v/+CAEASZgUAf0LzBIABrAGAAUPArH9FLgYAAfxBgAb9AYAAEQBPFbQGwACVwA4sAYB/iwBAf8OEwATogIB/xAOASoFtwIAVsAIAHwBAA==",dn=1,Dm=2,Vu=4,El=8,$s=16;function Wu(i){if(i===null||i.length<2||i.length>2&&i.charCodeAt(2)!==45&&i.charCodeAt(2)!==95)return"root";const t=i.charCodeAt(0)|32,e=i.charCodeAt(1)|32;return t===106&&e===97?"ja":t===107&&e===111?"ko":t===122&&e===104?"zh":"root"}function Ta(i){const t=atob(i);let e=0;const n=()=>{let a=0,o=1,l;do l=t.charCodeAt(e++),a+=(l&127)*o,o*=128;while(l>=128);return a},s=new Uint8Array(n());let r=0;for(;e<t.length;){for(let l=n();l>0;l--)s[r++]=t.charCodeAt(e++);if(e>=t.length)break;const a=n()+4,o=r-n();if(o+a<=r)s.copyWithin(r,o,o+a);else for(let l=0;l<a;l++)s[r+l]=s[o+l];r+=a}if(r!==s.length)throw new Error("A packed table unpacked to the wrong length");return s}function Pm(i){const t=atob(i),e=new Int32Array(t.length);let n=0;for(let s=0;s<t.length;){let r=t.charCodeAt(s++),a=r&127;for(let o=7;r>=128;o+=7)r=t.charCodeAt(s++),a|=(r&127)<<o;e[n++]=a}return e.subarray(0,n)}function xi(i,t){return i.values[i.index[t>>8]<<8|t&255]}function Iw(i,t,e){const n=new Uint16Array(4352),s=new Uint8Array(e<<8),r=new Int32Array(256).fill(-1);let a=0,o=0,l=0,c=-1;for(let h=0;h<=i.length;h+=2){const f=h<i.length?t[i[h+1]]:-1;if(f!==c){for(;o<l;){const u=o>>8;if((o&255)===0&&l-o>=256)r[c]<0&&(r[c]=a,s.fill(c,a<<8,++a<<8)),n.fill(r[c],u,l>>8),o=l&-256;else{(o&255)===0&&(n[u]=a++);const d=Math.min(l,u+1<<8),p=n[u]-u<<8;s.fill(c,o+p,d+p),o=d}}c=f}h<i.length&&(l+=i[h]+1)}if(l!==1114112)throw new Error("The class runs don't cover U+0000..U+10FFFF");return{index:n,values:s}}let Vd=null,Wd=null;function xc(i){const[t,e]=Mw[i];return Vd??=Pm(Sw),Wd??=Ta(ww),Iw(Vd,Wd.subarray(t*Ew),e)}function Bi(i,t){let e=null;return()=>e??=new RegExp(i,t)}const Rw=[Bi(String.raw`^[\p{L}\p{N}]$`,"u"),Bi(String.raw`^\p{M}$`,"u"),Bi(String.raw`^\p{P}$`,"u"),Bi(String.raw`^[\p{Ps}\p{Pe}\p{Pi}\p{Pf}\p{Po}]$`,"u"),Bi(String.raw`^\p{Default_Ignorable_Code_Point}$`,"u"),Bi(String.raw`^\p{Emoji}$`,"u"),Bi(String.raw`^\p{sc=Hangul}$`,"u")],Yd=0,Ba=1,Lm=2,Dw=3,Aa=4,Pw=5,Lw=6;let Fw=null;const Xd=new Map;function Ge(i,t){const e=Fw??=new Uint16Array(65536),n=1<<t*2;let s=i<65536?e[i]:Xd.get(i)??0;return(s&n<<1)===0&&(s|=n<<1|(Rw[t]().test(String.fromCodePoint(i))?n:0),i<65536?e[i]=s:Xd.set(i,s)),(s&n)!==0}let Uw=null;function Fm(){return Uw??=new Intl.Segmenter(void 0,{granularity:"word"})}const Sl=1,Nw=0,hh=1;function Ow(i,t,e,n){const s=new Uint16Array(t*i);e!==null&&s.set(e);for(let r=0,a=-i;r<n.length;){a+=(n[r++]+1)*i;const o=n[r++]*i;o>0&&s.copyWithin(a,a-o,a-o+i);let l=a-1;for(let c=n[r++];c>0;c--)l+=1+n[r++],s[l]=n[r++]}return s}function Um(i){const[t,,,e,n,s]=Im[i];return Ow(t+3,e,n===null?null:Um(n),Pm(s))}const qd={};function Yu(i){let t=qd[i];if(t===void 0){const[e,n,s]=Im[i];t=qd[i]={catCount:e,dictCategoriesStart:n,rowWidth:e+3,rows:Um(i),lookAheadResultsSize:s,classes:xc(i)}}return t}const Gw={chars:[],categories:[]};function Nm(i,t,e,n=Gw){const s=i.rows,r=i.rowWidth,a=i.dictCategoriesStart,o=t.length,l=new Int32Array(i.lookAheadResultsSize).fill(-1),c=n.chars,h=c.length;for(let f=0;f<o;){let u=0,d=f,p=-1,g=f,m=t.charCodeAt(g++);if((m&64512)===55296&&g<o){const S=t.charCodeAt(g);(S&64512)===56320&&(g++,m=(m-55296<<10)+S-56320+65536)}let A=!1,v=!1,M=Sl*r,x=0;for(;;){if(A){if(v)break;v=!0,x=1}else{let _=!1;for(let b=0;b<h;b++)if(m===c[b]){x=n.categories[b],_=!0;break}_||(x=xi(i.classes,m),x>=a&&u++)}const S=s[M+3+x];M=S*r;const E=s[M];if(E===hh)d=g;else if(E>hh&&l[E]>=0){p=l[E];break}const C=s[M+1];if(C>hh&&(l[C]=g),S===Nw)break;if(!v){if(g>=o)A=!0;else if(m=t.charCodeAt(g++),(m&64512)===55296&&g<o){const _=t.charCodeAt(g);(_&64512)===56320&&(g++,m=(m-55296<<10)+_-56320+65536)}}}p<0&&(p=d,d===f&&(p=f+1,(t.charCodeAt(f)&64512)===55296&&p<o&&(t.charCodeAt(p)&64512)===56320&&p++)),e[p]=1,u>0&&kw(i,t,f,p,e),f=p}}function Gh(i,t){return xi(i.classes,t)>=i.dictCategoriesStart}function kw(i,t,e,n,s){let r=-1;for(let a=e;a<=n;){let o=!1,l=1;if(a<n){let c=t.charCodeAt(a);(c&64512)===55296&&a+1<t.length&&(t.charCodeAt(a+1)&64512)===56320&&(c=(c-55296<<10)+t.charCodeAt(a+1)-56320+65536,l=2),o=Gh(i,c)}if(o)r<0&&(r=a);else if(r>=0){if(a-r>1)for(const c of Fm().segment(t.slice(r,a)))c.index>0&&(s[r+c.index]=1);r=-1}a+=l}}const ma=32,ga=9,nr=10,Qw=8203,Xu=8232,qu=8233,zw=12288;let Hw=null,Vw;function Ww(){return Vw??=new Intl.DateTimeFormat().resolvedOptions().locale}const Po=0,kh=1,Kd=2;function Jd(i){return i===ma||i===ga||i===nr}function Yw(i,t,e,n){if(e<33||n<33)return Po;if(e===45)if(n<=127){if(n>=48&&n<=57){const s=t|32;return t>=48&&t<=57||s>=97&&s<=122?kh:Po}}else return Kd;if(e<=255&&n<=255){const s=n-33;return(i[(e-33)*28+(s>>3)]&1<<(s&7))!==0?kh:Po}return Kd}function Xw(i,t,e,n){const s=Ge(e,Ba)?t:e;return Ge(s,Yd)&&!Gh(i,s)&&Ge(n,Yd)&&!Gh(i,n)}function qw(i,t,e){const n=i.length,s=new Uint8Array(n+1);if(n<2)return s;const r=Hw??=Ta(Cw),a=Wu(e)==="zh"?"line_normal_cj":"line_normal",o=Yu(`chromium/${a}`);let l=null,c=0,h=i.charCodeAt(0);for(let f=1;f<n;c=h,h=i.charCodeAt(f),f++){const u=i.charCodeAt(f);if(Jd(u))continue;if(Jd(h)){s[f]=1;continue}const d=Yw(r,c,h,u);if(d===kh){s[f]=1;continue}t&&Xw(o,c,h,u)||d!==Po&&(l===null&&(l=new Uint8Array(n+1),Nm(o,i,l)),l[f]===1&&(s[f]=1))}return s}const Xe=1,ir=2,Ws=4,rs=8,wl=16,bl=32,Qh=64,as=128,Kw=256,zh=512,Hh=1024,Fe=32768;let Om=null;const Zd=new Map;function Vh(i){return i===ma||i===nr||i===ga||i===Xu||i===qu}function $d(i){return i>=48&&i<=57}function jd(i){const t=i|32;return t>=97&&t<=122}function tp(i){switch(i>>7){case 0:switch(i>>4){case 0:return Fe;case 1:return Ws;case 2:return i===32?Kw:i===34||i===39?as:i===40?rs:i===41?wl:Fe;case 3:return i<=57?Xe:Fe;case 4:return Xe;case 5:return i<=90?Xe:i===91?rs:i===93?wl:Fe;case 6:return Xe;default:return i<=122?Xe:i===123?rs:i===125?bl:Fe}case 1:return i===160?Qh:i>192?Xe:i===161||i===191?rs:i===171?as|zh:i===187?as|Hh:Fe;case 2:case 3:case 4:return Xe;case 5:return i===712||i===716||i===735?Fe:Xe;case 6:return i===847||i>=860&&i<=866?Qh:i<880?Ws:i===894?Fe:Xe;case 7:case 8:case 10:return Xe;case 9:return i>=1155&&i<=1161?Ws:Xe;case 11:return i<=1416||i>=1480?Xe:i>=1425&&i<=1469||i===1471||i===1473||i===1474||i===1476||i===1477||i===1479?Ws:Fe;case 64:return i===8216||i===8220?as|zh:i===8217||i===8221?as|Hh:Fe;default:if(i>=11904&&i<=42191){if((i&65280)===12288){if(i<=12351)switch(i&31){case 1:case 2:case 9:case 11:case 13:case 15:case 17:case 21:case 23:case 25:case 27:case 30:case 31:return bl;case 8:case 10:case 12:case 14:case 16:case 22:case 20:case 24:case 26:case 29:return rs;default:return Fe}return Fe}return(i&65520)===12784?Fe:(i&65528)===12872||(i&65472)===19904?Xe:i===40981?Fe:ir}return i>=44032&&i<=55215||i>=63744&&i<=64255?ir:Fe}}function Gm(i,t){return{text:i,secondToLast:0,last:0,priorLength:0,line:t,nextBoundary:null}}function Jw(i,t){let e=i.nextBoundary;if(e===null){const a=(i.priorLength===2?String.fromCharCode(i.secondToLast,i.last):i.priorLength===1?String.fromCharCode(i.last):"")+i.text,o=new Uint8Array(a.length+1);Nm(i.line.rules,a,o,i.line.overrides),e=new Int32Array(a.length+2),e[a.length+1]=-1;for(let l=a.length;l>=0;l--)e[l]=o[l]===1?l:e[l+1];i.nextBoundary=e}const n=t+i.priorLength+1;if(n>=e.length)return-1;const s=e[n];return s<0?-1:s-i.priorLength}function km(i,t,e){const n=t.text,s=n.length;if(e===0&&t.priorLength===0){if(s<=1)return s;e++}let r=e>1?n.charCodeAt(e-2):t.secondToLast,a=e>0?n.charCodeAt(e-1):t.last,o=0,l=0,c=0,h=-1;for(let f=e;f<s;r=a,a=l,o=c,f++){if(l=n.charCodeAt(f),c=0,Vh(l))return f;if(a===45&&$d(l)){if($d(r)||jd(r))return f;continue}if(a<=255&&l<=255){if(a>=33&&l>=33){const d=l-33;if((i[(a-33)*28+(d>>3)]&1<<(d&7))!==0)return f}continue}o===0&&(o=tp(a)),c=tp(l);const u=o|c;if((u&-1922)!==0){if((u|Xe)===(ir|Xe))return f;if((u&(Qh|as))!==0&&(u&Fe)===0){if((u&ir)!==0&&(u&as)!==0&&((c&zh)!==0||(o&Hh)!==0))return f;continue}if(c===Ws){c=o;continue}if((u&Fe)===0&&(u&(bl|wl|rs))!==0){if(c===bl||c===wl||o===rs)continue;if((u&ir)!==0)return f}if(h<f&&(h=Jw(t,f-1)),h>=0&&f<h)for(const d=Math.min(h,s-1);f<d;r=a,a=l,o=c,f++){const p=n.charCodeAt(f+1);if(p<=255&&!jd(p))break}if(f===h&&!Vh(a))return f}}return s}function Qm(i,t,e){for(let n=t;n<i.length;n++){const s=i.charCodeAt(n);if(Vh(s)||s===Qw)return n;if(s===zw||e&&Ge(s,Dw)&&n+1<i.length)return n+1}return i.length}function zm(i){const t=i??"";let e=Zd.get(t);if(e!==void 0)return e;const n=Wu(t),s=Yu(n==="ja"||n==="ko"?"apple/line_normal":n==="zh"?"apple/line_cj":"apple/line"),r=t.split(/[-_]/);let a=r[0].toLowerCase();for(let h=1;h<r.length;h++){const f=r[h];a+="_"+(f.length===4?f[0].toUpperCase()+f.slice(1).toLowerCase():f.toUpperCase())}let o=zd[a];for(;o===void 0;){const h=a.lastIndexOf("_");a=h<0?"":a.slice(0,h),o=zd[a]}const l=[],c=[];for(let h=0;h<o.length;h+=2)l.push(o[h]),c.push(xi(s.classes,o[h+1]===0?123:125));return e={rules:s,overrides:{chars:l,categories:c}},Zd.set(t,e),e}const Zw=0,$w=1,uh=2;function Hm(i,t,e,n){const s=Om??=Ta(Rm),r=Gm(i,zm(n)),a=i.length,o=new Uint8Array(a+1);let l=!1;for(let h=0;e&&h<a&&!l;h++)l=i.charCodeAt(h)>255;let c=-1;for(let h=0;h<a;){let f=$w,u=h;const d=i.charCodeAt(h);if(d===Xu||d===qu||t&&d===nr)f=uh,u++,d!==nr&&(o[u]=Vu);else{for(;u<a;u++){const p=i.charCodeAt(u);if(p!==ma&&p!==ga&&(t||p!==nr))break}if(u===h){f=Zw,u=a;for(let p=h;p<a;p++){const g=e?Qm(i,p,l):km(s,r,p);if(g!==h){u=g;break}}}}c>=0&&c!==uh&&f!==uh&&(o[h]=1),c=f,h=u}return o}function jw(i,t,e,n){const s=i.charCodeAt(i.length-1),r=t.charCodeAt(0);if(r===nr||r===Xu||r===qu)return!1;if(s===ma||s===ga||r===ma||r===ga)return!0;if(e)return Qm(t,0,!1)===0;const a=Om??=Ta(Rm),o=Gm(t,zm(n)),l=i.length;return o.secondToLast=l>1?i.charCodeAt(l-2):0,o.last=l>0?i.charCodeAt(l-1):0,o.priorLength=o.last===0?0:o.secondToLast===0?1:2,km(a,o,0)===0}const Wh=128;function tb(i){const t=Yu(i==="gecko/char"?"chromium/char":i),e=t.rowWidth,n=t.rows,s=n.length/e,r=new Uint8Array(s*t.catCount);for(let a=0;a<s;a++)for(let o=0;o<t.catCount;o++){const l=n[a*e+3+o];r[a*t.catCount+o]=l===0||n[l*e]>1?Wh|n[Sl*e+3+o]:l}return{rules:t,transitions:r,skipped:i==="gecko/char"?xi(t.classes,173):-1}}const ep={};function _r(i){return(i&65280)===8192&&(i>=8234&&i<=8238||i>=8294&&i<=8297||(i&-2)===8206)||i===1564}function xs(i,t,e,n,s){const{rules:r,transitions:a,skipped:o}=ep[i]??(ep[i]=tb(i)),l=r.catCount;let c=Sl,h=0;for(let f=e;f<n;){let u=t.charCodeAt(f),d=f+1;if((u&64512)===55296&&d<n){const m=t.charCodeAt(d);(m&64512)===56320&&(d++,u=(u-55296<<10)+m-56320+65536)}const p=xi(r.classes,u);if(p===o&&(u===173||_r(u))){f=d;continue}const g=a[c*l+p];(g&Wh)!==0&&(s!==null&&(s[h]=f),h++),c=g&~Wh,f=d}return c!==Sl&&(s!==null&&(s[h]=n),h++),h}const js=173,Vm=(i,t)=>(i&64512)===55296&&(t&64512)===56320,Wm=(i,t)=>65536+(i-55296<<10)+(t-56320);let eb=null;function Ym(i){return i>=768&&(Ge(i,Ba)||i===8204||i===8205||i>=65438&&i<=65439||i>=127995&&i<=127999||i>=917536&&i<=917631)}function nb(i){return i>=768&&(Ge(i,Ba)||i>=65438&&i<=65439||i>=127995&&i<=127999||i>=917536&&i<=917631)}function ib(i,t){const e=xi(i,t);return e===2||e===3||e===5&&!Ge(t,Pw)}function np(i,t){return ib(i,t)&&!Ge(t,Lw)&&t!==8361}function ip(i,t){return xi(i,t)!==0&&(Ge(t,Lm)&&t!==8361||t===65374||t===12288)}function sb(i){return i>=32&&i<127?!1:i<=159?!0:(i&65280)===8192&&(i===8203||i===8232||i===8233||i===8288)||i===65279||_r(i)}function xn(i,t){return i===js||!t&&_r(i)}const sp=i=>i===32||i===9,$r=i=>i===32||i===9||i===10;function Ku(i,t){for(let e=t;e<i.length;e++){const n=i.charCodeAt(e);if(nb(n))return!0;if(!_r(n))return!1}return!1}function rb(i){const t=Wu(i);return(t==="ja"||t==="zh")&&i.charCodeAt(2)!==95}function ab(i,t,e,n){if(t===0||e>=i.length)return!1;const s=eb??=xc("gecko/east_asian_width");let r,a=t;do{const l=i.charCodeAt(a-1),c=a>1?i.charCodeAt(a-2):0;Vm(c,l)?(r=Wm(c,l),a-=2):(r=l,a--)}while(Ge(r,Aa)&&a>0);let o;a=e;do o=i.codePointAt(a),a+=o>65535?2:1;while(Ge(o,Aa)&&a<i.length);return np(s,r)&&np(s,o)||n&&(ip(s,r)||ip(s,o))}function ob(i,t,e,n){const s=i.length,r=new Int32Array(s),a=new Uint8Array(s);let o=null,l=0,c=!1;if(e)for(let d=0;d<s;d++){const p=i.charCodeAt(d);xn(p,t)?(a[d]=1,c||=p!==js):r[l++]=d}else{let d=!1,p=0,g=0,m=n===null?s:0;for(;p<s;){const A=i.charCodeAt(p);if(!$r(A)&&!xn(A,t)){(A===12||A===13&&i.charCodeAt(p+1)!==10)&&((o??=new Uint8Array(s))[p]=1),r[l++]=p,d=!1,p++;continue}if($r(A)){if(p>=m){for(;g<n.length&&n[g]<=p;)g++;m=g<n.length?n[g]:s}let v=!1,M=A===10,x=0,S=0;const E=d&&p>0&&xn(i.charCodeAt(p-1),t);let C=p+1;for(;C<m;C++){const _=i.charCodeAt(C);if(_===10)M=!0;else if(xn(_,t))S++;else if(!sp(_))break}for(;xn(i.charCodeAt(C-1),t);)C--,x++;!t&&i.charCodeAt(C-1)===32&&C<m&&Ku(i,C)&&(v=!0,C--);for(let _=p;_<C;_++){const b=i.charCodeAt(_);xn(b,t)?(a[_]=1,c||=b!==js):d||M&&sp(b)?(a[_]=1,(S>x||E)&&((o??=new Uint8Array(s))[_]=1)):(r[l++]=_,d=!0)}v&&(r[l++]=C++);for(let _=0;_<x;_++)c||=i.charCodeAt(C)!==js,a[C++]=1;p=C;continue}a[p]=1,c||=A!==js,d=!1,p++}}let h="",f=0,u=0;for(let d=0;d<l;d++){const p=r[d],g=i.charCodeAt(p);!e&&(g===9||g===10)?(h+=i.slice(f,u)+" ",f=u=p+1):p!==u?(h+=i.slice(f,u),f=p,u=p+1):u++}return h+=i.slice(f,u),{text:h,orig:r.subarray(0,l),skipped:a,leftOut:o,dropsBidiControl:c}}function lb(i,t,e){switch(i.charCodeAt(t)){case 32:case 5760:return e||!Ku(i,t+1);case 10:case 9:case 13:case 12:return!0;default:return!1}}function cb(i,t,e,n){if(n||t[0]===0)return!1;for(let s=0;s<i.length&&t[s]===1;s++)if(lb(i,s,e))return!0;return!1}function fh(i,t){i.clusterStart[t]=0,i.isSpace[t]=0}function rp(i,t,e,n,s,r){let a=t.charCodeAt(e);n-e>1&&Vm(a,t.charCodeAt(e+1))&&(a=Wm(a,t.charCodeAt(e+1))),Ym(a)&&fh(i,e);let o=e;for(;o<n&&t.charCodeAt(o)<768;)o++;const l=o===n?0:xs(s,t,e,n,r);for(let c=0,h=e;h<n;c++){const f=t.charCodeAt(h);f===32||f===12288?i.isSpace[h]=1:f===2479&&h>e&&t.charCodeAt(h-1)===2509&&fh(i,h);const u=l===0?h+1:r[c];for(h++;h<u;h++)fh(i,h)}}function hb(i,t,e,n){const s=t.length;let r=0;for(let a=0;a<s;a++){const o=t.charCodeAt(a);!((o===32||o===160)&&!(a+1<s&&Ym(t.charCodeAt(a+1))))&&!sb(o)||(a>r&&rp(i,t,r,a,e,n),o===32&&(i.isSpace[a]=1),r=a+1)}s>r&&rp(i,t,r,s,e,n)}let ub=null;function Fr(i,t){return t>1114111?0:xi(i.classes,t)}const fb=1,db=3,ap=10,pb=12,op=14,lp=16,Ab=21,mb=22,gb=24,xb=25,_b=29,vb=30,yb=31,cp=32,hp=33,Mb=35,dh=46,up=47,fp=53,Ur=54,dp=253,ph=254,pp=255,bo=120;function Ap(i){return i>=3585&&i<=3711?1:i>=3712&&i<=3839?2:i>=4096&&i<=4255||i>=43488&&i<=43519||i>=43616&&i<=43647?3:i>=6016&&i<=6143||i>=6624&&i<=6655?4:0}function Eb(i){const t=[];for(let e=0;e<i.length;){const n=Ap(i[e]);let s=e+1;for(;s<i.length&&Ap(i[s])===n;)s++;if(n!==0){let r="";for(let a=e;a<s;a+=4096)r+=String.fromCharCode(...i.slice(a,Math.min(s,a+4096)));for(const a of Fm().segment(r))a.index>0&&t.push(e+a.index)}t.push(s),e=s}return t}function mp(i){return i===fb||i===db||i===xb||i===Mb||i===gb||i===Ab||i===mb||i===_b||i===yb||i===vb||i===pb}function Vs(i,t,e){const n=i.charCodeAt(t);if((n&64512)===55296&&t+1<e){const s=i.charCodeAt(t+1);if((s&64512)===56320)return((n&1023)<<10)+(s&1023)+65536}return n}function Sb(i,t,e,n,s,r){const a=n-e,o=i.states;let l=0,c=Vs(t,e,n),h=c>65535?2:1,f=[],u=0,d=0;for(;;){if(u<f.length){const m=f[u++]-d;let A=0;for(;A!==m;){if(A+=c>65535?2:1,l=h,l>=a)return;c=Vs(t,e+l,n),h+=c>65535?2:1}d+=A,r[e+l]=1;continue}let p=-1,g=!1;t:for(;;){const m=c,A=p>=0?p:Fr(i,m),v=g||p<0&&A===Ur;if(l=h,l>=a)return;c=Vs(t,e+l,n),h+=c>65535?2:1;const M=Fr(i,c);if((M===op||M===Ur)&&A!==ap&&A!==lp&&A!==cp&&A!==hp&&A!==up&&A!==fp){p=A,g=M===Ur;continue}if(p=-1,g=!1,s&&mp(A)&&mp(M))continue;if(Fr(i,m)===dh&&M===dh){const U=[m&65535];for(let L=l,O=c;U.push(O&65535),L+=O>65535?2:1,!(L>=a||(O=Vs(t,e+L,n),Fr(i,O)!==dh)););f=Eb(U),u=1;let k=1;for(;k!==f[0];){if(k++,l=h,l>=a)return;c=Vs(t,e+l,n),h+=c>65535?2:1}d=k;break}const x=o[A*ch+M];if(x===dp||x===ph){if(v)continue;break}if(x===pp)continue;let S=x>=bo?x-bo:x,E=h,C=l,_=c,b=v,B=M;const P=S>Hd;for(;;){const U=B===Ur,k=S<=Hd;if(l=h,l>=a){if(o[S*ch+Tw]!==ph)return;if(h=E,l=C,c=_,b)continue t;break t}c=Vs(t,e+l,n),h+=c>65535?2:1;const L=Fr(i,c);if((L===op||L===Ur)&&B!==ap&&B!==lp&&B!==cp&&B!==hp&&B!==up&&B!==fp){B=L;continue}const O=o[S*ch+L];if(O===pp)continue t;if(O===ph){if(h=E,l=C,c=_,U){if(P&&!b)break t;continue t}if(b)continue t;break t}if(O===dp){if(U)continue t;break t}O>=bo?(S=O-bo,E=h,C=l,_=c,b=U):(S=O,k&&(E=h,C=l,_=c,b=U)),B=L}}r[e+l]=1}}const wb=new Uint8Array([0,0,1,1,0,0,1,1,0,0,1,0,1,0,1,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,1,0]);function bb(i,t,e,n,s){const r=t.length,a=new Uint8Array(r);let o=n,l=0,c=!1;for(let h=0;h<=r;h++){const f=h<r?t.charCodeAt(h):-1,u=f===32||f===9||f===13;if(o&&!u&&f>=0&&(a[h]=1),o=u,f>=0&&!u&&(e||f!==10)){f>=32&&f<=127&&wb[f-32]===1||(c=!0);continue}h>l&&c&&Sb(i,t,l,h,s,a),c=!1,l=h+1}return a}function Cb(i,t,e,n,s=null){const r=i.length,a=new Uint8Array(r+1);if(r===0)return{breaks:a,leftOut:null,dropsBidiControl:!1};let o=!0;for(let d=0;d<r&&o;d++)o=i.charCodeAt(d)<256;const l=ob(i,o,t,s),c=l.text.length;if(c===0)return{breaks:a,leftOut:null,dropsBidiControl:l.dropsBidiControl};const h={clusterStart:new Uint8Array(c).fill(1),isSpace:new Uint8Array(c)};hb(h,l.text,n,new Int32Array(c));const f=ub??={classes:xc("gecko/line"),states:Ta(Bw)},u=bb(f,l.text,o,cb(i,l.skipped,o,t),e);for(let d=1;d<c;d++){const p=l.orig[d],g=u[d]===1&&(h.clusterStart[d]===1||h.isSpace[d-1]===1),m=l.skipped[p-1]===1&&i.charCodeAt(p-1)===js;g||m?a[p]=g&&m?dn|El:dn:h.clusterStart[d]===1&&(a[p]=Dm)}return{breaks:a,leftOut:l.leftOut,dropsBidiControl:l.dropsBidiControl}}const Ie=0,Qn=1,rn=2,En=3,On=4,qe=5,xa=6,qn=7,Ne=8,Cn=9,te=15,sr=16,Ri=32,Xm=64,Cl=128,Tb=["text","space","zero-width-break","soft-hyphen","preserved-space","tab","zero-width-glue","control","hard-break"],Bb=/[ \t\n\r\f]{2,}|[\t\n\r\f]/g,Ib=/[\t\n\r\f]| {2,}|^ | $/;function Ah(i,t){return i===32||i===9||i===10||i===13&&t==="blink"}function qm(i,t,e=null){const n=t.lineBreakScan;if(n==="webkit"||!i.includes(`
`))return i;const s=n==="gecko"&&Db.test(i);if(!s&&!i.includes("​"))return i;const r=s&&rb(e);let a="",o=0;for(let l=i.indexOf(`
`);l!==-1;){let c=l;for(let u=l-1;u>=0;u--){const d=i.charCodeAt(u);if(Ah(d,n))c=u;else if(!(n==="gecko"&&xn(d,!1)))break}let h=l+1,f=h;for(;f<i.length;f++){const u=i.charCodeAt(f);if(Ah(u,n))h=f+1;else if(!(n==="gecko"&&xn(u,!1)))break}if(l=i.indexOf(`
`,f),n==="gecko"&&i.charCodeAt(h-1)===32&&Ku(i,h)&&h--,!(i.charCodeAt(c-1)!==8203&&i.charCodeAt(h)!==8203&&!(s&&ab(i,c,h,r)))){a+=i.slice(o,c);for(let u=c;u<h;u++)Ah(i.charCodeAt(u),n)||(a+=i[u]);o=h}}return o===0?i:a+i.slice(o)}function Rb(i,t,e){let n=i.length;for(let s=i.length-1;s>=t;s--){const r=i.charCodeAt(s);if(Di(r))n=s;else if(!(e.lineBreakScan==="gecko"&&_r(r)))break}return n}const Db=/[\u1100-\uFFFF]/;function mh(i){if(!Ib.test(i))return i;let t=i.replace(Bb," ");return t.charCodeAt(0)===32&&(t=t.slice(1)),t.length>0&&t.charCodeAt(t.length-1)===32&&(t=t.slice(0,-1)),t}function Pb(i){return/[\r\f]/.test(i)?i.replace(/\r\n/g,`
`).replace(/[\r\f]/g,`
`):i}const gp=/\p{M}/u;function Lb(i,t,e){if(t==="pre-wrap"){if(i===32)return On;if(i===9)return qe;if(i===10)return Ne}return i===32?Qn:i===8203?rn:i===173?En:i===133&&e==="webkit"?qn:Ie}function Di(i){return i===32||i===9||i===10||i===13||i===12}function Fb(i,t,e,n,s){const r=new Uint8Array(t+1);let a=0;if(n==="pre-wrap"){for(let l=0;l<i.length;l++,a++)r[a]=e[l],i.charCodeAt(l)===13&&i.charCodeAt(l+1)===10&&(l++,(e[l]&dn)!==0&&(r[a]=e[l]));return r[t]=e[i.length],r}let o=0;for(;o<i.length&&Di(i.charCodeAt(o));)o++;for(;o<i.length;){let l=o+1;if(Di(i.charCodeAt(o))){for(;l<i.length&&Di(i.charCodeAt(l));)l++;if(l===i.length)break}(e[o]&dn)===0&&r[a]===0&&(r[a]=e[o]),s!==null&&(s[a]=i.charCodeAt(o));const c=o;for(;o<l;o++)(e[o]&dn)!==0&&(r[o===c?a:a+1]=e[o]);a++}return r[t]=(e[o]&dn)===0?e[o]:e[o]&Vu,r}function xp(i,t,e,n,s,r){return(n===8232||n===8233)&&(t[e+1]&Vu)!==0?Ne:n===173&&(t[e+1]&El)!==0&&Ub(i,e)?rn:Lb(n,s,r)}function Ub(i,t){let e=t-1;for(;e>=0&&i.charCodeAt(e)===173;)e--;return e>=0&&i.charCodeAt(e)!==10}function Nb(i){return i===Ie||i===Qn||i===On||i===En}function Ob(i){return i<32||i>=127&&i<=159||i===8232||i===8233}function Gb(i,t,e,n,s,r,a){const o=s==="gecko"?Cl:0,l=[],c=[];let h=!1,f=!1,u=-1,d=-1;for(let A=0;A<i.length;A++){const v=i.charCodeAt(A);if(a&&A<u)continue;if(a&&xn(v,!1)&&(A===0||(e[A]&$s)!==0||!xn(i.charCodeAt(A-1),!1))){let E=A,C=-1;for(;E<i.length&&xn(i.charCodeAt(E),!1)&&(E===A||(e[E]&$s)===0);E++)_r(i.charCodeAt(E))&&(C=E+1);if(C>0){const _=d>=0&&d!==Ne&&(e[A]&$s)!==0,b=d<0||d===Ne||_;if(b){const B=E===i.length||xp(i,e,E,i.charCodeAt(E),n,s)===Ne;if(B||(_&&(e[A]=e[A]|e[E]&dn),e[E]=e[E]&-10),u=E,B&&d>=0)continue}else u=C;(b||h||f)&&(l.push(A),c.push(Ie|o),d=Ie,h=!1,f=!1);continue}}const M=xp(i,e,A,v,n,s),x=M===Ie&&Ob(v),S=(e[A]&dn)===0;if((e[A]&(dn|$s))===0&&!x&&!h&&!(f&&!gp.test(i[A]))&&M===d&&Nb(M)){(e[A]&Dm)!==0&&(c[c.length-1]=c[c.length-1]&~Cl);continue}f=S&&M===Ie&&gp.test(i[A])&&(h||d===rn||d===En||d===qn),l.push(A),c.push(M|o),d=M,h=x}let p=!1;const g=c.length;for(let A=g-2;A>=0;A--){const v=c[A]&te,M=c[A+1]&te;if(!((e[l[A+1]]&dn)!==0||v===Ne)){if(!r&&(M===qe||M===On&&v===qe)){if(v===En)continue}else if(M===Ie||M===xa||M===qn)(v===rn||v===En)&&(c[A]=c[A]&~te|xa);else continue;c[A+1]=c[A+1]|Ri,p=!0}}if(p)for(let A=0;A<g;A++)(c[A]&Ri)===0&&(c[A]=c[A]|Xm);const m=[];for(let A=0;A<g;A++)m.push(i.slice(l[A],A+1<g?l[A+1]:i.length));return{normalized:i,spaceSources:t,texts:m,starts:l,flags:c,hasUnbroken:p}}function kb(i,t,e="normal",n="normal",s=null,r=null){const a=e==="pre-wrap",o=r===null?null:[];let l=a?i:r!==null&&r.ownSegmentBreaks?Qb(i,r.starts,t,s,o):qm(i,t,s);if(r!==null&&o.length===0)for(let p=0;p<r.starts.length;p++)o.push(r.starts[p]);let c=a?Pb(i):mh(l);const h=n==="keep-all";let f,u=null,d=!1;if(t.lineBreakScan==="blink")f=qw(c,h,s);else{let p;if(t.lineBreakScan==="webkit"){if(p=r===null?Hm(l,a,h,s):Vb(l,r,a,h,s),!a&&l!==c&&/\r(?!\n)/.test(l)){let g=0;for(let m=0;m<l.length;m++)l.charCodeAt(m)!==13||l.charCodeAt(m+1)===10?p[g++]=p[m]:p[m+1]=p[m+1]|p[m];p[g]=p[l.length],l=l.replace(/\r(?!\n)/g,""),c=mh(l)}}else{const g=Cb(l,a,h,t.graphemeTable,o);if(d=g.dropsBidiControl,p=g.breaks,r!==null)for(let v=0;v<r.atomic.length;v++){if(!r.atomic[v])continue;let M=o[v]+1;for(;M<l.length&&xn(l.charCodeAt(M),!1);)M++;p[M]=p[M]&~El}const m=g.leftOut,A=!a&&(d||m!==null)?Rb(l,0,t):l.length;if(m!==null||A<l.length){let v=-1;if(m!==null&&A<l.length)for(let _=A-1;_>=0;_--){const b=l.charCodeAt(_);if(!$r(b)&&!xn(b,!1))break;if($r(b)&&m[_]!==1){v=-1;break}$r(b)&&(v=_)}const M=m===null?A:0;let x="",S=0,E=M,C=M-1;for(let _=M;_<l.length;_++){if(_<A?m!==null&&m[_]===1&&_!==v:Di(l.charCodeAt(_))){x+=l.slice(S,_),S=_+1;continue}const b=p[_];p[E++]=C>=0&&C<_-1&&(b&dn)!==0&&l.charCodeAt(C)===173?b|El:b,C=_}p[E]=p[l.length],l=x+l.slice(S),c=mh(l)}}t.lineBreakScan==="webkit"&&!a&&l!==c&&(u=new Uint16Array(c.length)),f=l===c?p:Fb(l,c.length,p,e,u)}return r!==null&&Hb(i,c,f,r,t.lineBreakScan),Gb(c,u,f,e,t.lineBreakScan,t.hangTabs,d)}function Qb(i,t,e,n,s){if(e.lineBreakScan==="webkit"||!i.includes(`
`))return i;let r="",a=0,o=i.indexOf(`
`);for(let l=0;l<t.length;l++){const c=t[l],h=l+1<t.length?t[l+1]:i.length;if(s.push(r.length+c-a),o<0||o>=h)continue;const f=i.slice(c,h),u=qm(f,e,n);u.length!==f.length&&(r+=i.slice(a,c)+u,a=h),o=i.indexOf(`
`,h)}return a===0?i:r+i.slice(a)}function zb(i,t,e){const n=new Int32Array(t.length),s=e==="blink"?-1:13,r=e==="gecko"?12:-1;let a=0;for(let o=0;o<t.length;o++){const l=t.charCodeAt(o);for(;a<i.length;){const c=i.charCodeAt(a);if(c===l||Di(c)&&(l===32?c!==s&&c!==r:l===10))break;a++}n[o]=a++,l===10&&i.charCodeAt(a-1)===13&&i.charCodeAt(a)===10&&a++}return n}function Hb(i,t,e,n,s){const r=n.sourceOffsets=zb(i,t,s),{starts:a,atomic:o}=n;for(let l=0,c=0;l<a.length;l++){for(;c<t.length&&r[c]<a[l];)c++;if(c===t.length)break;e[c]=e[c]|$s,o[l]&&r[c]===a[l]&&(e[c]=e[c]|dn,e[c+1]=e[c+1]|dn|$s)}}function Vb(i,t,e,n,s){const{items:r,starts:a,atomic:o}=t,l=new Uint8Array(i.length+1);let c=-1;for(let h=0;h<a.length;h++){const f=a[h],u=h+1<a.length?a[h+1]:i.length;if(f===u)continue;const d=i.charCodeAt(f);if(u-f>1||d===8232||d===8233){const p=Hm(r[h].text,e,n,s);for(let g=1;g<=u-f;g++)l[f+g]=p[g]}if(c>=0&&!o[h]&&!o[c]){const p=i.charCodeAt(f-1);(!e&&(d!==13&&Di(d)||p!==13&&Di(p))||jw(r[c].text,r[h].text,n,s))&&(l[f]=l[f]|dn)}c=h}return l}const Wb=" aa ab ady af ak am ar as ast av ay az ba be bg bi bn bo bs ca ce ceb ch chk cs cy da de dv dz ee efi el en es et eu fa fi fil fj fo fr fur fy ga gaa gd gil gl gn gsw gu ha haw he hi hil ho hr ht hu hy id ig ii ilo inh is it iu ja jv ka kaj kam kbd kha kk kl km kn ko kok kos kpe krc ks ku kum ky la lah lb lez ln lo lt lv mai mdf mg mh mi mk ml mn mr ms mt my myv na nb ne niu nl nn nr nso ny oc om or os pa pag pap pau pl pon ps pt qu rm rn ro ru rw sa sah sat sd se sg si sid sk sl sm so sq sr ss st su sv sw ta te tet tg th ti tig tk tkl tl tn to tpi tr trv ts tt tvl tw ty tyv udm ug uk und ur uz ve vi wal war wo xh yap yo za zh zh-hk zh-tw zu ",Yb=" arab armn bali batk beng blis bopo brah brai bugi buhd cans cham cher cirt copt cprt cyrl cyrs deva dsrt egyd egyh egyp ethi geok geor glag goth grek gujr guru hang hani hano hans hant hebr hira hmng hrkt hung inds ital java jpan kali kana khar khmr knda kore laoo latf latg latn lepc limb lina linb mand maya mero mlym mong mymr nkoo ogam orkh orya osma perm phag phnx plrd qaai roro runr sara shaw sinh sylo syrc syre syrj syrn tagb tale talu taml telu teng tfng tglg thaa thai tibt ugar vaii visp xpeo xsux yiii zxxx ",Xb=["","Zapfino","Menlo","Kefa III","Geeza Pro","Snell Roundhand","Kohinoor Bangla","Kokonor|Kailasa","Kailasa","Galvji","Noto Sans Tagalog","Kohinoor Gujarati","Lucida Grande|Arial Hebrew","Apple Chancery|Arial Hebrew","Courier New","ITF Devanagari|Kohinoor Devanagari","Kohinoor Devanagari","Noto Sans Armenian","Euphemia UCAS","Hiragino Mincho ProN","Hiragino Sans","Helvetica","Khmer MN|Khmer Sangam MN","Khmer Sangam MN","Kannada MN|Noto Sans Kannada","Noto Sans Kannada","AppleMyungjo|Apple SD Gothic Neo","Apple SD Gothic Neo","Noto Nastaliq Urdu","Lao MN|Lao Sangam MN","Lao Sangam MN","Malayalam MN|Malayalam Sangam MN","Malayalam Sangam MN","Noto Serif Myanmar|Noto Sans Myanmar","Noto Sans Myanmar","Oriya MN|Noto Sans Oriya","Noto Sans Oriya","Mukta Mahee","Sinhala MN|Sinhala Sangam MN","Sinhala Sangam MN","Tamil Sangam MN","Kohinoor Telugu","Thonburi","Songti TC|PingFang HK","PingFang HK","Songti SC|PingFang SC","PingFang SC","Songti TC|PingFang TC","PingFang TC","Songti TC|PingFang MO","PingFang MO"],_p={"":[0,0,0,1,2],am:[3,3,3,3,2],ar:[4,4,4,4,2],bg:[0,0,5,5,2],bn:[6,6,6,6,2],bo:[7,8,7,7,2],chr:[9,9,9,9,2],ckb:[4,4,4,4,2],fa:[4,4,4,4,2],fil:[10,10,10,10,2],gu:[11,11,11,11,2],he:[0,12,13,0,14],hi:[15,16,16,16,2],hy:[17,17,17,17,2],iu:[18,18,18,18,2],ja:[19,20,19,19,2],ka:[21,0,21,21,2],km:[22,23,22,22,2],kn:[24,25,24,24,2],ko:[26,27,26,26,2],ks:[28,28,28,28,2],lo:[29,30,29,29,2],lrc:[4,4,4,4,2],ml:[31,32,31,31,2],my:[33,34,33,33,2],mzn:[4,4,4,4,2],or:[35,36,35,35,2],pa:[37,37,37,37,2],ps:[4,4,4,4,2],ro:[0,0,5,5,2],ru:[0,0,5,5,2],sd:[4,4,4,4,2],si:[38,39,38,38,2],sr:[0,0,5,5,2],ta:[40,40,40,40,2],te:[41,41,41,41,2],th:[42,42,42,42,2],tr:[0,0,5,5,2],ug:[4,4,4,4,2],uk:[0,0,5,5,2],ur:[28,28,28,28,2],yi:[0,12,13,0,14],yue:[43,44,43,43,2],zh:[45,46,45,45,2],"kk-arab":[4,4,4,4,2],"ks-arab":[4,4,4,4,2],"ks-deva":[0,0,0,1,2],"ms-arab":[4,4,4,4,2],"pa-arab":[4,4,4,4,2],"sd-deva":[0,0,0,1,2],"ur-arab":[4,4,4,4,2],"uz-arab":[4,4,4,4,2],"yue-hans":[45,46,45,45,2],"zh-hant":[47,48,47,47,2],"zh-hk":[43,44,43,43,2],"zh-mo":[49,50,49,49,2],"zh-tw":[47,48,47,47,2],"pa-aran-pk":[28,28,28,28,2],"yue-hant-mo":[49,50,49,49,2],"zh-hant-hk":[43,44,43,43,2],"zh-hant-mo":[49,50,49,49,2]};let Zn=null,qb=null;const Yh=96,Km="0.000001px",Kb=1<<18,Jb=/\p{Emoji_Presentation}|\p{Extended_Pictographic}|\p{Emoji}\uFE0F/u,Zb=/[\p{Emoji_Presentation}\p{Extended_Pictographic}\p{Regional_Indicator}\uFE0F\u20E3]/u,$b=["serif","sans-serif","cursive","fantasy","monospace"],jb=/("[^"]*"|'[^']*')|(^|,)(\s*)(serif|sans-serif|cursive|fantasy|monospace)(?=\s*(?:,|$))/gi,Ju=/\dpx(?:\s*\/\s*\S+)?\s+/,Jm=/(?:"[^"]*"|'[^']*'|[^,])+/g;function t1(i,t){let e=i.toLowerCase().replaceAll("_","-"),n=null;for(let a=e;n===null;)if(Wb.includes(` ${a} `))n=a==="zh";else{const o=a.lastIndexOf("-");if(o<0||a.endsWith("-zyyy"))return null;Yb.includes(` ${a.slice(o+1)} `)&&(n=a.endsWith("-hani")),a=a.slice(0,o)}n&&(e="zh-hans");let s=_p[e];for(;s===void 0;)e=e.slice(0,Math.max(0,e.lastIndexOf("-"))),s=_p[e];const r=[];for(let a=0;a<s.length;a++){const o=s.indexOf(s[a]);if(o<a){r.push(r[o]);continue}const l=Xb[s[a]],c=l.indexOf("|"),h=c<0?l:e1(t,l.slice(0,c))?l.slice(0,c):l.slice(c+1);r.push(h===""?"":`"${h}"`)}return r}const vp="Hamburg 한中 नम សួ ನಮ ສະ നമ မင ନମ ආය བཀ";function e1(i,t){for(const e of["monospace","serif"]){i.font=`16px ${e}`;const n=i.measureText(vp).width;if(i.font=`16px "${t}", ${e}`,i.measureText(vp).width!==n)return!0}return!1}function n1(i,t){const e=Ju.exec(i);if(e===null)return i;const n=e.index+e[0].length;return i.slice(0,n)+i.slice(n).replace(jb,(s,r,a,o,l)=>{const c=r===void 0?t[$b.indexOf(l.toLowerCase())]:"";return c===""?s:a+o+c})}function i1(i){if(i.hyphenText!==null)return i.hyphenText;const t=i.canvasFont,e=Ju.exec(t);let n="-";if(e!==null&&Le("‐",i).width!==Le("-",i).width){const s=zi(i),r=e.index+e[0].length,a=t.slice(0,r),o=t.slice(r).match(Jm)??[],l=a+"monospace",c=a+"serif";if(Ti(s,l," ")!==Ti(s,c," ")&&Ti(s,l,"‐")!==Ti(s,c,"‐"))for(let h=0;h<o.length;h++){const f=`${a}${o[h]}, monospace`,u=`${a}${o[h]}, serif`;if(Ti(s,f," ")===Ti(s,u," ")){Ti(s,f,"‐")===Ti(s,u,"‐")&&(n="‐");break}}s.font=t}return i.hyphenText=n,n}function Ti(i,t,e){return i.font=t,i.measureText(e).width}function s1(i){Zn!==null&&Zn.segments>Kb&&D1();let t=null;if(typeof document<"u"){const e=document.documentElement?.lang;typeof e=="string"&&(t=e)}return t===""&&i.laysOutUnderDefaultLocale?Ww():t}const r1=(1<<30)-1;function a1(i,t){if(!Number.isFinite(0))throw new RangeError("letterSpacing must be a finite number of CSS px, not 0");if(!t.letterSpacingInAppUnits)return 0;const n=Math.fround(Math.fround(0)*60);return Math.min(Math.round(Math.abs(n)),r1)*Math.sign(n)/60}function fi(i){const t=[];for(let e=0;e<i;e++)t.push(0);return t}const yp=2**20,Tl=[];function o1(i,t){if(!t.state.takesLetterSpacing)return Tl;const e=new Int32Array(i.length),n=xs(Qi().graphemeTable,i,0,i.length,e),s=n<=Yh,r=t.glyphCounts;let a=null,o=Tl;try{let l=0;for(let c=0,h=0;c<n;h=e[c++]){const f=i.slice(s?0:h,e[c]);let u=r.get(f);u===void 0&&(a===null&&(a=zi(t),a.letterSpacing=`${yp}px`),u=Math.round(a.measureText(f).width/yp),r.set(f,u));const d=u-(s?l:0)-1;l=u,!(d===0&&o.length===0)&&(o.length===0&&(o=fi(n)),o[c]=d)}}finally{a!==null&&(a.letterSpacing=t.letterSpacing)}return o}function Le(i,t){return t.metrics.get(i)??$m(t.metrics,i,i,t)}function Zm(i,t){return t.followingSpaceMetrics.get(i)??$m(t.followingSpaceMetrics,i,i+" ",t)}function $m(i,t,e,n){const s={width:zi(n).measureText(e).width,emojiCount:-1,fit:null,spaceKerning:null,extraSpacings:null};return i.set(t,s),n.state.segments++,!n.measuredKana&&l1.test(t)&&(n.measuredKana=!0),s}const l1=/[\u3041-\u30FF]/,jm=/[\u3041-\u30FF]{2}/,Xh=191,tg={after:0,before:0};function Lo(i){return i>=12353&&i<=12438||i>=12449&&i<=12538||i>=13312&&i<=40959||i>=63744&&i<=64255}function c1(i){return Ge(i,Ba)||(i&63488)===55296||Lo(i)||i>=44032&&i<=55203}function h1(i){if(i.spaceKerning===void 0){const t=zi(i);let e="\u2028";for(let r=33;r<=126;r++)e+=String.fromCharCode(r)+"\u2028";const n=t.measureText(e).width;t.fontKerning="none";const s=t.measureText(e).width;t.fontKerning="auto",i.spaceKerning=n!==s&&t.measureText("\u2028").width===Le(" ",i).width?new Map:null}return i.spaceKerning}function Mp(i,t,e,n){const s=i<<1|(t?1:0);let r=n.get(s);if(r===void 0){if(r=0,!c1(i)){const a=String.fromCharCode(i),o=zi(e).measureText(t?"\u2028"+a:a+"\u2028").width;r=o-Le(a,e).width-Le(" ",e).width,Math.abs(r)<=o/4194304&&(r=0)}n.set(s,r)}return r}function u1(i,t,e,n){let s=0,r=i.length-1;for(;s<r&&Ge(i.charCodeAt(s),Aa);)s++;for(;r>s&&Ge(i.charCodeAt(r),Aa);)r--;const a=s<r&&Ge(i.charCodeAt(s+1),Ba)?0:Mp(i.charCodeAt(s),!0,e,n),o=Mp(i.charCodeAt(r),!1,e,n);return t.spaceKerning=o===0&&a===0?tg:{after:o,before:a}}function f1(i){return i.spaceWidth??=Le(" ",i).width}const Ep="プダグタノムブイメえずぺ";function qh(i){const t=i.state;return t.wholeRunContext===null&&(t.wholeRunContext=ig(t.language),t.wholeRunContext.textRendering="optimizeLegibility"),t.wholeRunFont!==i.kanaFont&&(t.wholeRunContext.font=t.wholeRunFont=i.kanaFont),t.wholeRunContext}function d1(i,t){const e=i.width/4194304;return Math.abs(i.width-t.width)<=e&&Math.abs(i.actualBoundingBoxLeft-t.actualBoundingBoxLeft)<=e&&Math.abs(i.actualBoundingBoxRight-t.actualBoundingBoxRight)<=e}function eg(i){if(i.kanaKerning===void 0){i.kanaKerning=null;const t=i.canvasFont,e=Ju.exec(t),n=e===null?0:e.index+e[0].length,s=e===null?null:t.slice(n).match(Jm),r=s===null?1:s.length;let a=null;for(let o=0;o<r;o++){const l=o===0?t:t.slice(0,n)+s.slice(o).join(",");i.kanaFont=l;const c=qh(i),h=c.measureText(Ep).width;c.fontKerning="none";const f=c.measureText(Ep);if(c.fontKerning="auto",a===null)a=f;else if(!d1(a,f))break;if(h!==f.width){if(o>0){let u="";for(let A=12353;A<=12438;A++)u+=String.fromCharCode(A,12290);const d=c.measureText(u).width;i.kanaFont=t;const p=qh(i),g=p.measureText(u).width;p.fontKerning="none";const m=p.measureText(u).width;if(p.fontKerning="auto",g===m||Math.abs(d-g)>g/4194304)break;i.kanaFont=l}i.kanaKerning=new Float64Array(Xh*Xh).fill(NaN);break}}i.kanaKerning===null&&(i.kanaFont=t)}return i.kanaKerning}function ng(i,t,e,n,s){const r=i.charCodeAt(e);if(r<12353||r>12543)return 0;const a=i.charCodeAt(e-1);if(a<12353||a>12543)return 0;if(e>t){if(!Lo(r))return 0;let c=e-1,h=a;for(;h>=12353&&h<=12543&&!Lo(h);){if(c===t)return 0;h=i.charCodeAt(--c)}if(h>=11904&&!Lo(h))return 0}const o=(a-12353)*Xh+r-12353,l=s[o];return Number.isNaN(l)?s[o]=p1(i.slice(e-1,e+1),n):l}function p1(i,t){const e=qh(t).measureText(i).width,n=e-Le(i[0],t).width-Le(i[1],t).width;return Math.abs(n)<=e/4194304?0:n}function $n(i,t,e){return Ia(i,Le(i,t),t,e)}function A1(i){return i.includes("Firefox/")?"gecko":i.includes("AppleWebKit/537.36")?i.includes("Chrome/")||i.includes("Chromium/")?"blink":null:i.includes("AppleWebKit/")?"webkit":null}function Qi(){return qb??=m1()}function m1(){const i=typeof navigator>"u"?"":navigator.userAgent??"",t=A1(i)??"blink";return{lineBreakScan:t,graphemeTable:t==="webkit"?"apple/char":t==="gecko"?"gecko/char":"chromium/char",lineFitEpsilon:t==="webkit"?1/64:.005,cutWordFit:t==="blink"?"reshaped-lines":"segment-prefixes",prefixFitMinWidth:t==="webkit"?0:80,cutWordKeepsLigatures:t==="gecko",measureTextWithFollowingSpace:t==="webkit",kernsAcrossCanvasWords:t==="blink",letterSpaceDiscretionaryHyphen:t!=="blink",letterSpacingInAppUnits:t==="gecko",canvasLetterSpacingDropsLigatures:t!=="webkit",unspacedCursive:t==="blink"?"run":t==="gecko"?"cluster":"none",letterSpacesGlyphs:t==="webkit",unfitHyphenRetreat:t==="blink"?"reduced-width":t==="gecko"?"full-width":"full-width-or-first",hyphenFromPrimaryFont:t!=="gecko",letterSpaceTabStops:t!=="webkit",letterSpaceTabs:t==="webkit",tabMinimumCharacter:t==="gecko"?"0":" ",tabsInAppUnits:t==="gecko",hangTabs:t!=="gecko",zeroWidthGlueTakesLine:t!=="gecko",hidesControlCharacters:t==="gecko",hanKerning:t==="blink",hangsIdeographicSpace:t!=="webkit",laysOutUnderDefaultLocale:t==="blink",namesGenericFamiliesByLanguage:t==="webkit"&&!/^(?:Linux|Win32|Haiku|$)/.test(navigator.platform),hardBreakItemRetreat:t==="blink"?"item":t==="webkit"?"fit":"last-grapheme",paddedOpeningFit:t==="blink"?"start":t==="webkit"?"placed":"both",emptyAtomicAlwaysFits:t==="gecko",hangsSpacesPerTextFrame:t==="gecko",testsHyphenBeforeAtomic:t!=="webkit",transformsSegmentBreaksAcrossItems:t==="blink"}}function g1(i){const t=i.match(/(?:^|\D)(\d+(?:\.\d+)?)\s*px/);return t?parseFloat(t[1]):16}function x1(i){return Zb.test(i)}function _1(i,t){let e=t.emojiCorrection;if(e!==null)return e;const n=g1(i),s=t.emojiWidth!==0,r=t.emojiWidth=zi(t).measureText("😀").width;if(e=0,r>n+.5&&typeof document<"u"){const a=v1(i);if(Number.isNaN(a))return 0;if(r-a>.5&&(e=r-a,s)){for(const o of t.metrics.values())o.fit=null;for(const o of t.followingSpaceMetrics.values())o.fit=null}}return t.emojiCorrection=e,e}function v1(i){const t=document.body;if(t===null&&document.head===null)return NaN;const e=document.createElement("span");e.style.cssText="all:initial!important;-webkit-locale:inherit!important;display:inline-block!important;visibility:hidden!important;position:absolute!important",e.style.setProperty("font",i,"important"),e.textContent="😀";let n=t===null?NaN:Sp(t,e);return Number.isNaN(n)&&(n=Sp(document.documentElement,e)),n}function Sp(i,t){i.appendChild(t);const e=t.getBoundingClientRect().width,n=parseFloat(getComputedStyle(t).width);return i.removeChild(t),Math.abs(e-n)<=n*1e-5?e:n}const y1=2**-20,M1=2**-17;function E1(i,t){const e=Le(i,t).width,n=Math.round(e/t.emojiWidth);return Math.abs(e-n*t.emojiWidth)<=e*y1?n:0}const S1=/[\p{Extended_Pictographic}\p{Emoji_Component}\uFE0E]+/gu;function w1(i,t){const e=new Int32Array(i.length),n=xs(Qi().graphemeTable,i,0,i.length,e);let s=0;for(let r=0,a=0;r<n;a=e[r++]){const o=i.slice(a,e[r]);if(!Jb.test(o))continue;const l=o.match(S1);for(let c=0;c<l.length;c++)s+=E1(l[c],t)}return s}function Ia(i,t,e,n){return n===0?t.width:(t.emojiCount<0&&(t.emojiCount=w1(i,e)),t.width-t.emojiCount*n)}function b1(i,t,e,n,s,r=null){if(t.fit!==null&&t.fit.mode===s)return t.fit;const a=Qi(),o=new Int32Array(i.length),l=xs(a.graphemeTable,i,0,i.length,o);if(l<=1)return t.fit={mode:s,advances:null,lineStartExtras:null};let c,h=null,f=!1;if(s==="reshaped-lines"){const u=Ia(i,t,e,n)-(r??0),d=Co(i,o,l,"sum-graphemes",t,e,n,r);if(c=d,!wp(d,u)){c=Co(i,o,l,"pair-context",t,e,n,r),f=l>Yh||wp(c,u),f||(c=Co(i,o,l,"segment-prefixes",t,e,n,r)),h=[0];for(let p=1;p<l;p++)h.push(d[p]-c[p])}}else{const u=s==="segment-prefixes"&&l<=Yh;f=s!=="sum-graphemes"&&!u,c=Co(i,o,l,f?"pair-context":s,t,e,n,r),u&&a.cutWordKeepsLigatures&&C1(i,o,c,e,n)}if(a.kernsAcrossCanvasWords&&e.kanaKerning!==null&&jm.test(i)){const u=eg(e);if(u!==null)for(let d=1;d<l;d++){const p=ng(i,f&&d>1?o[d-2]:0,o[d-1],e,u);p>0?c[d-1]=c[d-1]+p:p<0&&(c[d]=c[d]+p,h??=fi(l),h[d]=h[d]-p)}}return t.fit={mode:s,advances:c,lineStartExtras:h}}function C1(i,t,e,n,s){if(!n.state.shapesLetterSpaced||n.letterSpacing!=="0px")return;let r=0;for(let a=1;a<e.length;a++){const o=t[a-1],l=$n(i.slice(o,t[a]),n,s);Math.round((e[a]-l)*60)!==0&&T1(i.slice(a===1?0:t[a-2],t[a]),n)?(e[r]=e[r]+e[a],e[a]=0):r=a}}function T1(i,t){let e=t.ligaturePairs.get(i);if(e===void 0){const n=zi(t),s=Le(i,t).width;n.letterSpacing=Km,e=n.measureText(i).width!==s,n.letterSpacing="0px",t.ligaturePairs.set(i,e)}return e}function wp(i,t){let e=0;for(let n=0;n<i.length;n++)e+=i[n];return Math.abs(e-t)<=t*M1}function Co(i,t,e,n,s,r,a,o){const l=n==="segment-prefixes",c=n==="pair-context",h=[];let f=0,u=0;for(let d=0,p=0;d<e;p=t[d++]){const g=t[d];if(l){const A=o!==null&&d===e-1?Ia(i,s,r,a)-o:$n(i.slice(0,g),r,a);h.push(A-u),u=A;continue}const m=$n(i.slice(p,g),r,a);h.push(c&&d>0?$n(i.slice(f,g),r,a)-u:m),f=p,u=m}return o!==null&&!l&&(h[e-1]=h[e-1]+s.width-Le(i,r).width-o),h}function B1(i,t,e){(Zn===null||Zn.language!==t)&&(Zn=R1(t));const n=Zn,s=e&&n.shapesLetterSpaced,r=s?n.letterSpacedFonts:n.fonts;n.font="";let a=r.get(i);if(a===void 0){const o=n.genericFamilies===null?i:n1(i,n.genericFamilies);if(!I1(n.context,o))throw new RangeError(`font must be a font string Canvas takes, a size in px then a family, such as 16px Inter, not "${i}"`);a={state:n,canvasFont:o,letterSpacing:s?Km:"0px",metrics:new Map,followingSpaceMetrics:new Map,spaceKerning:void 0,measuredKana:!1,kanaKerning:void 0,kanaFont:o,emojiCorrection:null,emojiWidth:0,hyphenText:null,spaceWidth:null,hanKerning:void 0,ligaturePairs:new Map,glyphCounts:new Map},r.set(i,a)}return a}function I1(i,t){return i.font="1px serif",i.font=t,i.font!=="1px serif"?!0:(i.font="2px serif",i.font=t,i.font!=="2px serif")}function zi(i){const t=i.state;return t.font!==i.canvasFont&&(t.context.font=t.font=i.canvasFont),t.letterSpacing!==i.letterSpacing&&(t.context.letterSpacing=t.letterSpacing=i.letterSpacing),t.context}function ig(i){let t=null;if(typeof OffscreenCanvas<"u"?t=new OffscreenCanvas(1,1).getContext("2d"):typeof document<"u"&&(t=document.createElement("canvas").getContext("2d")),t===null)throw new Error("Text measurement requires OffscreenCanvas or a DOM canvas context.");return i!==null&&"lang"in t&&(t.lang=i),t}function R1(i){const t=ig(i),e=Qi(),n=typeof t.letterSpacing=="string";return{language:i,context:t,font:"",letterSpacing:"0px",wholeRunContext:null,wholeRunFont:"",genericFamilies:i!==null&&e.namesGenericFamiliesByLanguage?t1(i,t):null,takesLetterSpacing:n,shapesLetterSpaced:n&&e.canvasLetterSpacingDropsLigatures,fonts:new Map,letterSpacedFonts:new Map,segments:0}}function D1(){Zn!==null&&(Zn.fonts.clear(),Zn.letterSpacedFonts.clear(),Zn.segments=0)}const cs=0,dr=1,Ai=2,Bl=3,Zu=4,$u=5,sg=6,rg=7,ag=8,og=9,ju=10,bp=/\p{Ps}/uy,Cp=/\p{Pe}/uy,P1=/[\u2018-\u301F\uFF08-\uFF60]/;function To(i){return i>=8216&&i<=12319||i>=65288&&i<=65376}function L1(i){return P1.test(i)}function lg(i,t){const e=i.charCodeAt(t);switch(e){case 8216:case 8220:return og;case 8217:case 8221:return ju;case 12289:case 12290:case 65292:case 65294:return sg;case 65306:return rg;case 65307:return ag;case 183:case 8231:case 12288:case 12539:return Bl;default:{if(e<40||!Ge(e,Lm))return cs;const n=e>=12288&&e<=12351||e>=65281&&e<=65376||e>=65504&&e<=65510;return bp.lastIndex=Cp.lastIndex=t,bp.test(i)?n?dr:Zu:Cp.test(i)?n?Ai:$u:cs}}}function F1(i,t,e){const n=String.fromCharCode(t);let s,r,a;if(Kh(t)){const c=i.measureText("中"+n);s=c.width-e,a=c.actualBoundingBoxRight-e,r=-i.measureText(n+"中").actualBoundingBoxLeft}else{const c=i.measureText(n);s=c.width,r=-c.actualBoundingBoxLeft,a=c.actualBoundingBoxRight}const o=s/2,l=a<=o?Ai:r>=o?dr:a-r<=o&&r>=o/2?Bl:cs;return{advance:s,type:l}}function Ys(i,t,e){let n=i.trims.get(t);if(n===void 0){const s=String.fromCharCode(t);n=2*Le(s,e).width-Le(s+s,e).width,i.trims.set(t,n)}return n}function U1(i){if(i.hanKerning!==void 0)return i.hanKerning;const t={typeForDot:cs,typeForColon:cs,typeForSemicolon:cs,quoteFullwidth:!1,trims:new Map};if(Ys(t,12300,i)<=.001)return i.hanKerning=null,null;const e=Le("中",i).width,n=zi(i),s=[12289,12290,65292,65294,65306,65307,8220,8216,8221,8217].map(a=>F1(n,a,e)),r=(a,o)=>{for(let l=a+1;l<o;l++)if(s[l].advance!==s[a].advance||s[l].type!==s[a].type)return cs;return s[a].type};return t.typeForDot=r(0,4),t.typeForColon=s[4].type,t.typeForSemicolon=s[5].type,t.quoteFullwidth=r(6,8)===dr&&r(8,10)===Ai,i.hanKerning=t,t}function is(i,t,e){const n=lg(t,e);switch(n){case sg:return i.typeForDot;case rg:return i.typeForColon;case ag:return i.typeForSemicolon;case og:return i.quoteFullwidth?dr:Zu;case ju:return i.quoteFullwidth?Ai:$u;default:return n}}function gh(i,t){return t===dr&&(i===dr||i===Bl||i===Ai||i===Zu)?1:i===Ai&&(t===Ai||t===Bl||t===$u)?-1:0}function Kh(i){return i>=12288&&i<=12543||i>=65072&&i<=65135||i>=65280&&i<=65519&&i!==65307}function N1(i,t,e,n){const s={widthTrims:null,lineStartExtras:null,lineEndTrims:null,overflowLineEndTrims:null},r=U1(i);if(r===null)return s;const{flags:a,starts:o,normalized:l}=t,c=a.length,h=(f,u)=>{s.widthTrims??=fi(n-e),s.widthTrims[f-e]=s.widthTrims[f-e]+u};for(let f=e;f<n;f++){if((a[f]&te)!==Ie)continue;const u=o[f],d=f+1<c?o[f+1]:l.length,p=l.charCodeAt(u);if(f>0&&To(p)&&gh(is(r,l,u-1),is(r,l,u))===1){const v=Ys(r,p,i);s.lineStartExtras??=fi(n-e),s.lineStartExtras[f-e]=v,h(f,v)}for(let v=u+1;v<d;v++){const M=l.charCodeAt(v-1),x=l.charCodeAt(v);if(!(To(M)||To(x))||Kh(M)===Kh(x))continue;const S=gh(is(r,l,v-1),is(r,l,v));S!==0&&h(f,Ys(r,S===1?x:M,i))}const g=l.charCodeAt(d-1);if(!To(g))continue;const m=f+1===c;if(!m&&gh(is(r,l,d-1),is(r,l,d))===-1){h(f,Ys(r,g,i));continue}const A=lg(l,d-1);A!==Ai&&A!==ju||is(r,l,d-1)!==Ai||(m||(a[f+1]&te)===Ie&&(a[f+1]&Ri)===0?(s.lineEndTrims??=fi(n-e),s.lineEndTrims[f-e]=Ys(r,g,i)):(s.overflowLineEndTrims??=fi(n-e),s.overflowLineEndTrims[f-e]=Ys(r,g,i)))}return s}function Tp(i,t,e){return t===rn?0:xs(e,i,0,i.length,null)}function O1(i,t,e){return t>1?i+(t-1)*e:i}const xh=[741,745,768,879,1425,1469,1471,1487,1536,4255,4352,4607,4957,4959,5888,6319,6400,6479,6528,6623,6656,7423,7616,7679,8400,8447,9977,9977,11503,11505,12330,12335,12441,12444,42620,42621,42736,42737,43008,44031,55216,55295,65024,65039,65056,65071,68096,68191,69632,69839,69888,70111,70144,70223,70320,70527,70656,70879,71040,71263,71296,71375,71424,72895,92928,93071,125184,125279,127462,127487,127995,127999,917504,917631,917760,917999],G1=/\p{Extended_Pictographic}/u,k1=Bi(String.raw`^\p{M}`,"u"),Q1=/^[\p{Nd}:\-/×,.+\u2013\u2014]+$/u,z1=/^[\p{Cc}\u2028\u2029]$/u;function _h(i){let t=!1;for(let e=0;e<i.length;){const n=i.codePointAt(e);if(e+=n>65535?2:1,n===8205&&t)return!0;t=n>65535&&G1.test(String.fromCodePoint(n));for(let s=0;s<xh.length&&n>=xh[s];s+=2)if(n<=xh[s+1])return!0}return!1}const H1=/[\u0590-\u08FF\uFB1D-\uFDFF\uFE70-\uFEFF\u200F\u{10800}-\u{10FFF}\u{1E800}-\u{1EFFF}\u202A-\u202E\u2066-\u2069]/u;function Bp(i){return i===Qn||i===On}const Jh=16,_n=31,cg=5,V1=1024,W1=2048,Y1=4096,hg=8192,X1=14;let q1=null;function Il(i){return bw[xi(q1??=xc("chromium/script"),i)]}function Fo(i,t){const e=i.codePointAt(t),n=Il(e),s=t+(e>65535?2:1);if((n&V1)!==0&&s<i.length){const r=Il(i.codePointAt(s))>>cg&_n;if(r!==0)return n&~_n|r}return n}function K1(i){for(let t=0;t<i.length;t++){if(i.charCodeAt(t)<128)continue;const e=Il(i.codePointAt(t));if((e&_n)===Jh||(e>>cg&_n)===Jh)return!0}return!1}function ug(i,t,e){const{openBrackets:n}=i;for(;i.read<e||i.scripts===_n&&i.read<t.length;){const s=t.codePointAt(i.read),r=Fo(t,i.read);let a=r&_n;const o=(r&hg)!==0?n.lastIndexOf(s-(r>>X1)):-1;if(o>=0&&(n[o+1]!==0&&(a=n[o+1]),n.length=o+2),(i.scripts&a)!==0)i.scripts&=a;else{for(let l=n.length-1;l>0&&n[l]===0;l-=2)n[l]=i.scripts&-i.scripts;i.scripts=a}(r&Y1)!==0&&(n.length===64&&n.splice(0,2),n.push(s,0)),i.read+=s>65535?2:1}return i.scripts}function J1(i,t,e,n){let s=Fo(t,e)&_n;for(let r=e;s===_n&&r+1<n&&Ge(t.charCodeAt(r),Aa);r++)s=Fo(t,r+1)&_n;if(s===_n)return!0;for(let r=e-2;r>=0;r--){(t.charCodeAt(r)&64512)===56320&&r>0&&r--;const a=Fo(t,r);if((a&hg)!==0)break;const o=a&_n;if(o!==_n){if((o&o-1)===0)return(o&s)!==0;break}}return(ug(i,t,e)&s)!==0}function Z1(i,t,e,n,s){const r=new Int32Array(e-t),a=xs(n,i,t,e,r);let o=null;for(let l=0,c=t;l<a;c=r[l++])(s===null?(Il(i.codePointAt(c))&W1)!==0:ug(s,i,c+1)===Jh&&i.charCodeAt(c)!==160)&&(o??=[]).push(l);return o}function $1(i,t,e){const{normalized:n,spaceSources:s,starts:r,flags:a}=i;let o=t+1;for(;o<e&&(a[o]&te)===rn;)o++;if(o>=e)return null;const l=a[o]&te,c=r[o];return l!==Qn&&l!==On||(s===null?n.charCodeAt(c):s[c])!==32?null:n.slice(r[t+1],c)}function j1(i,t,e){return Zm(i,t).width-Le(i,t).width-e}function tC(i,t,e,n,s,r,a,o){if(n===null)return 0;const{texts:l,flags:c}=i;let h=t+1;for(;h<e&&(c[h]&te)===En;)h++;if(h>=e||(c[h]&te)!==Ie)return 0;const f=l[h],u=Ia(n,s,r,a)+$n(f,r,a),d=$n(n+f,r,a);return u-d>o?u-d:0}function eC(i,t,e,n,s,r){return Ia(i,t,e,n)-s+r}function nC(i,t,e,n,s,r,a,o,l,c){const{normalized:h,texts:f,starts:u,flags:d}=i,p=0,g=e===d.length?h:e===t+1?f[t]:h.slice(p,e<d.length?u[e]:h.length),m=c===null?[]:c.widths,A=c===null?new Uint8Array(e-t):c.segmentFlags,v=[],M=[],x=m.length,S=r!==0,E=B1(n,o,S),C=x1(g)?_1(n,E):0,_=g.includes(" "),b=_||g.includes("	")?f1(E):0,B=a.letterSpaceTabStops?r:0,P=a.tabsInAppUnits?(Math.round(b*60)+Math.round(B*60))*8/60:(b+B)*8;let U=0,k=a.kernsAcrossCanvasWords&&g.includes(" ")?h1(E):null;k!==null&&H1.test(g)&&(k=null);const L={read:0,scripts:_n,openBrackets:[]};let O=0;const q=S&&a.unspacedCursive!=="none"&&K1(g);let Y=!S,at=null,Q=null,$=null,st=null;const Ut=a.unfitHyphenRetreat==="full-width-or-first";for(let nt=t,gt=x;nt<e;nt++,gt++){const ct=f[nt],Et=d[nt],Wt=Et&te;let Z=0,ot=0,j=null;switch(Wt){case Ie:{if(a.hidesControlCharacters&&z1.test(ct)){ot=1;break}const rt=a.measureTextWithFollowingSpace&&_?$1(i,nt,e):null,ut=rt==="",Bt=ut?Zm(ct,E):Le(ct,E);$=ct,st=Bt;let vt=rt===null||ut?0:j1(ct+rt,E,b);if(k!==null&&Bt.spaceKerning!==tg){const Dt=nt>t&&Bp(d[nt-1]&te),T=nt+1<e&&Bp(d[nt+1]&te);if(Dt||T){const y=Bt.spaceKerning??u1(ct,Bt,E,k);T&&(vt=Math.max(y.after,0),O=Math.min(y.after,0)),Dt&&y.before!==0&&!((d[nt-1]&te)===On&&(nt===t+1||(d[nt-2]&te)===Ne))&&J1(L,g,u[nt]-p,u[nt]-p+ct.length)&&(m[gt-1]=m[gt-1]+y.before)}}Z=eC(ct,Bt,E,C,ut?b:0,vt);let Qt=null,Yt=Tl;if(S&&(ot=Tp(ct,Wt,a.graphemeTable),q&&(Qt=Z1(g,u[nt]-p,u[nt]-p+ct.length,a.graphemeTable,a.unspacedCursive==="run"?L:null),Qt!==null&&(Z-=Qt.length*r)),a.letterSpacesGlyphs)){Yt=Bt.extraSpacings??=_h(ct)?o1(ct,E):Tl;for(let Dt=0;Dt<Yt.length;Dt++)Z+=Yt[Dt]*r}if((Et&Cl)!==0||ct.length===1)break;const D=r!==0?"segment-prefixes":Q1.test(ct)?"pair-context":Bt.width<a.prefixFitMinWidth?"sum-graphemes":a.cutWordFit,Jt=b1(ct,Bt,E,C,D,ut?b:null);if(j=Jt.advances,j===null)break;if(Jt.lineStartExtras!==null&&((at??=new Array(e-t).fill(null))[nt-t]=Jt.lineStartExtras),vt!==0&&(j=j.slice(),j[j.length-1]=j[j.length-1]+vt),Yt.length!==0){j=j.slice();for(let Dt=0;Dt<Yt.length;Dt++)j[Dt]=j[Dt]+Yt[Dt]*r}if(Qt!==null){j=j.slice();for(let Dt=0;Dt<Qt.length;Dt++)j[Qt[Dt]]=j[Qt[Dt]]-r}break}case Qn:case On:case rn:Z=$n(ct,E,C)+O,O=0,S&&(ot=Tp(ct,Wt,a.graphemeTable));break;case qe:a.letterSpaceTabs&&(ot=1),U===0&&(U=$n(a.tabMinimumCharacter,E,C)/2);break;case qn:{Z=$n(ct,E,C);const rt=nt+1<e?f[nt+1]:"";S&&(nt>t&&(d[nt-1]&te)===Ie&&_h(f[nt-1])||k1().test(rt)&&_h(rt))&&(ot=1);break}}Wt!==Ie&&Wt!==Qn&&Wt!==rn&&(Y=!1),Wt!==Ie&&Wt!==En&&($=null),A[gt]=Et&~Cl|(S&&ot>0?sr:0),m[gt]=O1(Z,ot,r),v[gt]=j,M!==null&&(M[nt-t]=ct),Wt!==Ie&&ct.charCodeAt(0)===173?(Q??=fi(nt-t),Q[nt-t]=Ut?0:tC(i,nt,e,$,st,E,C,a.lineFitEpsilon)):Q!==null&&(Q[nt-t]=0)}const Tt=Q===null?"-":a.hyphenFromPrimaryFont?i1(E):"‐",oe=$n(Tt,E,C)+(r===0?0:r*(a.letterSpaceDiscretionaryHyphen?2:1));let Zt={widthTrims:null,lineStartExtras:null,lineEndTrims:null,overflowLineEndTrims:null};if(a.hanKerning&&L1(g)){Zt=N1(E,i,t,e);const nt=Zt.widthTrims;if(nt!==null)for(let gt=0;gt<nt.length;gt++)m[x+gt]=m[x+gt]-nt[gt]}let Vt=Zt.lineStartExtras;if(a.kernsAcrossCanvasWords&&E.measuredKana&&E.kanaKerning!==null&&jm.test(g)){const nt=eg(E);nt!==null&&(Vt=iC(Vt,m,x,i,t,e,E,nt))}let K=Zt.lineEndTrims;a.hangsIdeographicSpace&&g.includes("　")&&(K=sC(K,i,E,r,oe,t,e));const z={widths:m,segmentFlags:A,simpleLineWalkFastPath:Y&&!i.hasUnbroken,simpleLineCountFastPath:Y,breakableFitAdvances:v,letterSpacing:r,discretionaryHyphenWidth:oe,discretionaryHyphenContexts:Q,breakableLineStartExtras:at,lineStartExtras:Vt,lineEndTrims:K,overflowLineEndTrims:Zt.overflowLineEndTrims,tabStopAdvance:P,minimumTabAdvance:U};return M!==null&&(z.segments=M),z}function iC(i,t,e,n,s,r,a,o){const{normalized:l,starts:c,flags:h}=n;for(let f=s;f<r;f++){if((h[f]&te)!==Ie)continue;const u=c[f],d=f+1<h.length?c[f+1]:l.length,p=e+f-s;for(let g=f>s?u:u+1;g<d;g++){const m=ng(l,u,g,a,o);m!==0&&(g>u?t[p]=t[p]+m:m>0?t[p-1]=t[p-1]+m:(t[p]=t[p]+m,i??=fi(r-s),i[f-s]=i[f-s]-m))}}return i}function sC(i,t,e,n,s,r,a){const{normalized:o,starts:l,flags:c}=t;for(let h=r;h<a;h++){const f=h+1<c.length?l[h+1]:o.length;if((c[h]&te)!==Ie||o.charCodeAt(f-1)!==12288)continue;if(h+1<a){const m=c[h+1]&te;if(m!==Ne&&m!==Qn&&!(m===Ie&&(c[h+1]&Ri)===0))continue}let u=f-1;for(;u>l[h]&&o.charCodeAt(u-1)===12288;)u--;const d=o.slice(u,f),p=h>0&&u===l[h]&&o.charCodeAt(u-1)===173,g=Le(d,e).width+d.length*n-(p?s:0);g<=0||(i??=fi(a-r),i[h-r]=i[h-r]+g)}return i}const fg=1<<Qn|1<<rn|1<<En|1<<On|1<<qe;function Zh(i){return(1<<i&fg)!==0}function dg(i,t,e,n){return n===0&&e>0&&e<t&&(i[e-1]&te)===En}function pg(i,t){return i===Qn||i===En||i===rn&&!t}function Ag(i,t,e,n){if(n){const a=Math.round(t*60);if(a<=0)return 0;const o=Math.round(i*60);return(Math.ceil((o+Math.round(e*120)/2)/a)*a-o)/60}if(t<=0)return 0;const s=i-Math.floor(i/t)*t,r=t-s;return r<e?r+t:r}function rC(i,t,e,n,s){const r=t.tabStopAdvances===null?i.tabStopAdvance:t.tabStopAdvances[e],a=t.minimumTabAdvances===null?i.minimumTabAdvance:t.minimumTabAdvances[e],o=t.insideExtras===null?0:t.insideExtras[e]/2;return Ag(n-o,r,a,s)+i.widths[e]}function aC(i,t,e,n,s,r,a){const{letterSpacing:o,segmentFlags:l}=i;if(o===0)return 0;if(a>0)return(l[r]&sr)!==0?o:0;const c=i.widths.length;if(dg(l,c,r,a)||r>n&&r<c&&(l[r]&te)!==Ne&&(1<<(l[r-1]&te)&e)!==0)return 0;for(let h=r-1;h>=n;h--){const f=l[h],u=f&te;if(!(u===Qn||u!==qn&&u!==qe&&(f&sr)===0&&u!==Cn&&(t===null||t[h]===0)))return h===n&&s>0||(f&sr)!==0?o:0}return 0}function oC(i){return i<=1/0?i:1/0}function mg(i,t){const{segmentFlags:e}=i,n=i.widths.length;let s=t.segmentIndex;if(s>=n)return!1;if(t.graphemeIndex>0)return!0;let r=s===0||(e[s-1]&te)===Ne;for(;;){const a=e[s]&te;if(a===Ne){if(r)return t.segmentIndex=s,t.graphemeIndex=0,!0;if(++s>=n)return!1;t.segmentIndex=s,t.graphemeIndex=0,r=!0}else if(pg(a,r)){if(++s>=n)return!1}else return t.segmentIndex=s,t.graphemeIndex=0,!0}}function lC(i,t,e,n={lineCount:0,maxLineWidth:0}){const s={segmentIndex:0,graphemeIndex:0};if(!i.simpleLineWalkFastPath)return mg(i,s)&&uC(i,s,t,e,n),n.lineCount;const{segmentFlags:r}=i,a=i.widths.length;for(;;){let o=s.segmentIndex;const l=o===0;for(;o<a&&pg(r[o]&te,l);)o++;if(o>=a)return n.lineCount;const c=s.graphemeIndex;s.segmentIndex=o;const h=fC(i,s,t);n.lineCount++,h>n.maxLineWidth&&(n.maxLineWidth=h),e?.(h,o,c,s.segmentIndex,s.graphemeIndex)}}function cC(i,t,e,n){let s=e+1;for(;s<t&&(1<<(i[s]&te)&n)!==0;)s++;return s===t||(i[s]&te)!==qe}function hC(i,t,e,n,s,r){const{discretionaryHyphenContexts:a,segmentFlags:o}=i,l=e-1;if(l<t||(o[l]&te)!==En||n<=s)return!1;const c=n-s;let h=0;const f=r?l:l-1;if(a!==null)for(let u=t;u<=f;u++)h+=a[u];return h<c}function uC(i,t,e,n,s,r=!1){const{widths:a,segmentFlags:o,breakableFitAdvances:l,discretionaryHyphenWidth:c,letterSpacing:h,lineStartExtras:f,lineEndTrims:u,overflowLineEndTrims:d,tabStopAdvance:p,minimumTabAdvance:g}=i,m=a.length,A=i.items,v=A===void 0?null:A.hyphenWidths,M=A===void 0?null:A.hyphenRooms,x=A===void 0?null:A.itemEndHalts,S=A===void 0?null:A.insideExtras,E=A===void 0?null:A.fillExtras,C=A===void 0?null:A.openingEdges,_=A===void 0?null:A.emptyObjectSpaces,b=A===void 0?null:A.emptyObjectReturns,B=Qi(),P=1<<On|(B.hangTabs?1<<qe:0),U=A!==void 0&&B.hangsSpacesPerTextFrame,k=B.testsHyphenBeforeAtomic,L=B.zeroWidthGlueTakesLine,O=B.tabsInAppUnits,q=B.paddedOpeningFit,Y=B.hardBreakItemRetreat,at=Math.max(0,e),Q=at+B.lineFitEpsilon,$=i.discretionaryHyphenContexts!==null,st=B.unfitHyphenRetreat==="reduced-width",Ut=st?c:0,Tt=$&&B.unfitHyphenRetreat==="full-width-or-first",oe=B.unfitHyphenRetreat==="full-width";let Zt=null;for(;;){const Vt=t.segmentIndex,K=t.graphemeIndex;let z=0,nt=!1,gt=Vt,ct=K,Et=-1,Wt=0,Z=-1,ot=0,j=-1,rt=0,ut=!1,Bt=0,vt=0,Qt=!0,Yt=!1,D=-1,Jt=0,Dt=0,T=!1,y=null;if((o[Vt]&te)===Ne)t.segmentIndex=Vt+1,t.graphemeIndex=0,y=f===null?0:f[Vt];else{t:{let G;for(let R=Vt;;R++){if(R>=m){G=m;break}let J,ft=0;const pt=o[R],W=pt&te;if(W===Ne){G=R+1;break}const et=(pt&sr)!==0,At=(1<<W&fg)!==0,Gt=R===Vt?K:0,yt=h!==0&&nt&&!Qt&&!Yt?h:0;let mt=0;h!==0&&(et||W===qn||W===qe||W===Cn||C!==null&&C[R]!==0)&&(mt=yt,Yt=!et),W!==rn&&W!==xa&&(Qt=!1);const It=W!==qe?a[R]:A===void 0?Ag(z+mt,p,g,O):rC(i,A,R,nt?z+mt:f===null?0:f[R],O),kt=mt+It,qt=u===null?0:u[R];if(W===En&&Gt===0){if(nt){let ht=c,it=!0;A!==void 0&&($&&R>Vt&&(o[R-1]&te)===Cn&&(Z=R,ot=z),U&&j===R&&(j=R+1,rt=Math.max(rt,Math.min(z,at))),v!==null&&(ht=v[R]),it=k||R+1===m||(o[R+1]&te)!==Cn||C!==null&&C[R+1]!==0),gt=R+1,ct=0,R+1<m&&(o[R+1]&te)!==Ne&&(Et=R+1,Wt=z+ht,$&&((it?Wt:z)<=Q||Tt&&Z<0)&&(Z=Et,ot=Wt))}continue}let F=0;if(h!==0&&!et&&!At&&W!==qn)F=yt+It;else if(At?W===qe:It!==0||W===qn){const ht=It+(et?h:0);ht!==0&&(F=mt+ht)}let dt=(1<<W&P)!==0;if(U&&W===rn&&j===R&&(dt=!0),dt&&(j!==R&&(rt=z-vt+mt,ut=!1,A!==void 0&&R>Vt&&(o[R-1]&te)===Cn&&(ut=cC(o,m,R,P),ut||(Et=R,Wt=z-vt)),Bt=0),j=R+1,C!==null&&(rt+=C[R],Bt+=C[R])),!nt&&W===xa&&!L){gt=R+1,ct=0;continue}if(nt){const ht=dt?rt-Bt:z+F;let it=ht-qt>Q;if(A!==void 0){let Ct=!1;if(_!==null&&W===Cn&&It===0&&ht>Q){const ue=j===R?rt:z,ne=_[R];Ct=ue<=Q||!(ne>=0&&ue-ne>Q||b[R]===1)}const Pt=F<0&&z-vt>Q;it=(it||Pt)&&!(dt&&ut)&&!Ct,U&&!it&&j===R&&W===Cn&&It===0&&(j=R+1,rt=Math.max(rt,Math.min(z+kt,at)))}if(it){const Ct=z-vt;if(At&&(dt||W!==qe)&&(Ct<=Q||Et<0&&(W===Qn||W===rn)||W===rn&&(o[R-1]&te)===Cn)){Dt=dt?rt:Ct,z+=kt,D=R+1,Jt=0;break t}if(W===qe&&!dt&&Et<0){D=R,Jt=0,Dt=j===R&&R>Vt?rt:Ct;break t}const Pt=(pt&Ri)!==0;if(W===Cn&&Pt&&j===R&&(q==="start"?rt-Bt/2<=Q&&z-Bt/2>Q:q==="placed"&&rt-Bt+It-qt<=Q)){j=R+1,rt+=It,Bt+=It,z+=kt,gt=R+1,ct=0;continue}if(Pt&&Et>=0&&(gt=Et,ct=0),!Pt||Et>=0){T=!0;break t}if(d!==null&&ht-d[R]<=Q){z+=kt,gt=R+1,ct=0,vt=d[R],x!==null&&x[R]!==0&&(z-=vt,vt=0);continue}if(W===Cn&&Y!=="item"&&R+1<m&&(o[R+1]&te)===Ne){const ue=o[R-1],ne=ue&te,Qe=ne===On?l[R-1]:null;if(Qe!==null){const _s=Qe.length,vr=Qe[0],vs=Y!=="fit"||z<=Q?1:vr>0?Math.min(_s,Math.ceil((z-Q)/vr)):_s,_c=C!==null&&C[Vt]!==0?Vt+1:Vt;if(R-1>_c||_s-vs>K){D=R-1,Jt=_s-vs,Dt=rt;break t}}const ze=ne===Ie||ne===qn?l[R-1]:null,Ra=(ue&sr)!==0?h:0;if(ze!==null&&(R-1>Vt||ze.length-1>K)){D=R-1,Jt=ze.length-1,Dt=z-ze[Jt]-Ra;break t}if(ze===null&&(ne===Ie||ne===qn)&&R-1>Vt){D=R-1,Jt=0,Dt=z-a[R-1]-Ra;break t}if(Qe!==null||ne!==On&&ne!==qe){z+=kt,gt=R+1,ct=0,vt=0;continue}}if(l[R]===null){T=!0;break t}J=0,ft=mt}else{(pt&Xm)!==0&&!At&&Et!==R&&(Et=R,Wt=z),$&&!At&&(pt&Ri)===0&&R>Vt&&!Zh(o[R-1]&te)&&(!st||z+(M===null?c:M[R])<=Q)&&(Z=R,ot=z),gt=R+1,ct=0,x!==null&&ht>Q&&x[R]!==0?(z+=kt-qt,vt=0):(z+=kt,F!==0&&!dt&&(vt=ht>Q&&W!==Cn?qt:0)),At&&(R+1===m||(o[R+1]&Ri)===0)&&(Et=R+1,Wt=dt?rt:W===qe?z:z-kt-vt),$&&At&&Wt+(M===null||Et<0?Ut:M[Et])<=Q&&(Z=Et,ot=Wt);continue}}else if(Gt>0)J=Gt;else{const ht=f===null?0:f[R],it=d!==null&&F+ht-d[R]<=Q?d[R]:qt;if(F+ht-it>Q&&l[R]!==null&&!dt)J=0;else{nt=!0,gt=R+1,ct=0,z=It+ht,dt&&(rt+=ht),vt=F+ht>Q&&W!==Cn?it:0,x!==null&&vt!==0&&x[R]!==0&&(z-=vt,vt=0),At&&(R+1===m||(o[R+1]&Ri)===0)&&(Et=R+1,Wt=dt?rt:W===qe?z:z-kt),$&&At&&Wt+(M===null||Et<0?Ut:M[Et])<=Q&&(Z=Et,ot=Wt);continue}}const tt=l[R],xt=tt.length;for(let ht=J;ht<xt;ht++){const it=tt[ht];if(nt){const Ct=z+(it+(ht>J?h:ft));if(Ct+h>Q)break t;z=Ct,gt=R,ct=ht+1}else{nt=!0,gt=R,ct=ht+1;const Ct=i.breakableLineStartExtras?.[R]??null;z=Ct===null?it:it+Ct[ht],(ht>0?S!==null:E!==null)&&(z+=ht>0?S[R]:E[R])}}nt&&gt===R&&ct===xt&&(gt=R+1,ct=0)}D=G,Jt=0,Et===G&&ct===0?(Dt=Wt,T=!0):Dt=z-vt}if(nt){T&&Z>=0&&Et===gt&&ct===0&&hC(i,Vt,gt,Wt,Q,oe)?(D=Z,Jt=0,Dt=ot):D<0&&(D=gt,Jt=ct,Dt=Et===gt&&ct===0?Wt:A!==void 0&&j===gt&&ct===0?rt:z-vt),t.segmentIndex=D,t.graphemeIndex=Jt;const G=Jt===0&&j>=0&&(D===j||D===j+1)&&(j===m||(o[j]&te)===Ne),R=(G?z-vt:Dt)+aC(i,C,P,Vt,K,D,Jt);y=G?Math.max(rt,Math.min(R,at)):R}}if(y===null||(Zt=y,s!==null&&(s.lineCount++,y>s.maxLineWidth&&(s.maxLineWidth=y)),n?.(y,Vt,K,t.segmentIndex,t.graphemeIndex),r||!mg(i,t)))break}return Zt}function fC(i,t,e){const{widths:n,segmentFlags:s,breakableFitAdvances:r,lineStartExtras:a,lineEndTrims:o,overflowLineEndTrims:l}=i,c=Math.max(0,e)+Qi().lineFitEpsilon,h=t.segmentIndex,f=r[h],u=a===null?n[h]:n[h]+a[h],d=o===null?0:o[h],p=l!==null&&u-l[h]<=c?l[h]:d;let g,m=0;if(t.graphemeIndex>0||u-p>c&&f!==null){const A=f,v=i.breakableLineStartExtras?.[h]??null;let M=t.graphemeIndex+1;g=v===null?A[M-1]:A[M-1]+v[M-1];const x=i.items;for(x!==void 0&&(M>1?x.insideExtras!==null:x.fillExtras!==null)&&(g+=M>1?x.insideExtras[h]:x.fillExtras[h]);M<A.length;M++){if(g+A[M]>c)return t.graphemeIndex=M,g;g+=A[M]}}else g=u,u>c&&(m=p);for(let A=h+1;A<n.length;A++){const v=n[A],M=o===null?0:o[A];if(g+v-M>c){const x=Zh(s[A]&te);return t.segmentIndex=x?A+1:A,t.graphemeIndex=0,!x&&Zh(s[A-1]&te)?g-n[A-1]:g-m}g+=v,m=g>c?M:0}return t.segmentIndex=n.length,t.graphemeIndex=0,g-m}const Ip=new WeakMap;function dC(i,t){let e=Ip.get(i);e===void 0&&(e=new Map,Ip.set(i,e));let n=e.get(t);if(n===void 0){const s=i.segments[t];n=new Int32Array(s.length),xs(Qi().graphemeTable,s,0,s.length,n),e.set(t,n)}return n}function vh(i,t,e){return e===0?0:dC(i,t)[e-1]}function pC(i,t,e,n,s){const{segmentFlags:r}=i,a=i.segments.length,o=n<a?n:a;let l="";for(let c=t;c<o;c++){const h=r[c]&te;h===En||h===Ne||(h===xa||h===rn)&&i.segments[c].charCodeAt(0)===173||(c===t&&e>0?l+=i.segments[c].slice(vh(i,c,e)):l+=i.segments[c])}return s>0&&n<a&&(l+=i.segments[n].slice(vh(i,n,t===n?e:0),vh(i,n,s))),l}function AC(i,t,e,n,s){const r=pC(i,t,e,n,s);return dg(i.segmentFlags,i.widths.length,n,s)?r+"-":r}function mC(i,t,e,n){const s="normal",r=Qi(),a=a1(n?.letterSpacing,r),o=s1(r),l=kb(i,r,n?.whiteSpace,s,o);return nC(l,0,l.flags.length,t,e,a,r,o,!0,null)}function gC(i,t,e){const n=mC(i,t,!0,e),s=[];for(let r=0;r<n.segmentFlags.length;r++)s.push(Tb[n.segmentFlags[r]&te]);return n.kinds=s,n}function xC(i,t,e,n,s,r){return{text:AC(i,e,n,s,r),width:Math.max(0,t),start:{segmentIndex:e,graphemeIndex:n},end:{segmentIndex:s,graphemeIndex:r}}}function _C(i,t,e){const n=[],s=lC(i,oC(t),(r,a,o,l,c)=>{n.push(xC(i,r,a,o,l,c))});return{lineCount:s,height:s*e,lines:n}}const vC=`
attribute vec3 aColor;
varying vec2 vUv;
varying vec3 vColor;
void main() {
  vUv = uv;
  vColor = aColor;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}`,yC=`
uniform sampler2D uMap;
uniform vec2 uAtlasSize;
uniform float uPxRange;
varying vec2 vUv;
varying vec3 vColor;

float median(float r, float g, float b) {
  return max(min(r, g), min(max(r, g), b));
}

// Screen-pixel distance range from the UV derivative, so the edge stays
// one pixel wide at any perspective distance.
float screenPxRange() {
  vec2 unitRange = vec2(uPxRange) / uAtlasSize;
  vec2 screenTexSize = vec2(1.0) / fwidth(vUv);
  return max(0.5 * dot(unitRange, screenTexSize), 1.0);
}

void main() {
  vec3 s = texture2D(uMap, vUv).rgb;
  float sd = median(s.r, s.g, s.b);
  float alpha = clamp(screenPxRange() * (sd - 0.5) + 0.5, 0.0, 1.0);
  if (alpha < 0.001) discard;
  gl_FragColor = vec4(vColor, alpha);
}`;class MC{constructor(t,e,n={}){this._users=new Set,this.atlas=new Mg(t,n),this.family=e,this._pxrange=n.pxrange??4,this._texture=this._upload(),this.material=new Sn({vertexShader:vC,fragmentShader:yC,uniforms:{uMap:{value:this._texture},uAtlasSize:{value:new lt(this.atlas.width,this.atlas.height)},uPxRange:{value:this._pxrange}},transparent:!0,depthWrite:!1,side:Fn})}ensure(t){const e=this.atlas.texture;if(this.atlas.glyphs(Array.from(t,n=>n.codePointAt(0))),this.atlas.texture!==e){this._texture.dispose(),this._texture=this._upload(),this.material.uniforms.uMap.value=this._texture,this.material.uniforms.uAtlasSize.value.set(this.atlas.width,this.atlas.height);for(const n of this._users)n.rebuild()}}_register(t){this._users.add(t)}_unregister(t){this._users.delete(t)}dispose(){this._texture.dispose(),this.material.dispose()}_upload(){const{texture:t,width:e,height:n}=this.atlas,s=new Mn(t,e,n,Je,en);return s.minFilter=xe,s.magFilter=xe,s.generateMipmaps=!1,s.wrapS=Ke,s.wrapT=Ke,s.colorSpace=Xn,s.needsUpdate=!0,s}}const Rp=new Map;let EC=0;function CC(i,t){let e=Rp.get(i);return e||(e=fetch(i).then(n=>n.arrayBuffer()).then(async n=>{const s=`msdf-${++EC}`,r=new FontFace(s,n);return document.fonts.add(await r.load()),new MC(new yg(n),s,t)}),Rp.set(i,e)),e}class TC extends Ce{constructor(t,e={}){super(new $t,t.material),this._props={text:"",fontSize:1,color:16777215,anchorX:0,anchorY:0},this._font=t,t._register(this),this.update(e)}update(t){const e={...this._props,...t},n=Object.keys(t).some(s=>t[s]!==this._props[s]);this._props=e,n&&this.rebuild()}rebuild(){const{text:t,fontSize:e,color:n,anchorX:s,anchorY:r,maxWidth:a}=this._props,o=this._font.atlas;this._font.ensure(t);const l=a===void 0?t.split(`
`):SC(this._font.family,t,a/e),{glyphs:c,widthEm:h,heightEm:f}=o.layoutMultiline(l.join(`
`)),u=-s*h,d=r*f,p=new bt(n),g=c.filter(({glyph:C})=>C.w>0),m=new Float32Array(g.length*12),A=new Float32Array(g.length*8),v=new Float32Array(g.length*12),M=new Uint32Array(g.length*6),x=o.width,S=o.height;g.forEach(({glyph:C,penX:_,penY:b},B)=>{const P=(_+C.planeLeft+u)*e,U=(_+C.planeRight+u)*e,k=(b+C.planeBottom+d)*e,L=(b+C.planeTop+d)*e,O=(C.x+.5)/x,q=(C.x+C.w-.5)/x,Y=(C.y+.5)/S,at=(C.y+C.h-.5)/S;m.set([P,k,0,U,k,0,P,L,0,U,L,0],B*12),A.set([O,at,q,at,O,Y,q,Y],B*8);for(let $=0;$<4;$++)v.set([p.r,p.g,p.b],(B*4+$)*3);const Q=B*4;M.set([Q,Q+1,Q+2,Q+2,Q+1,Q+3],B*6)}),this.geometry.dispose();const E=new $t;E.setAttribute("position",new fe(m,3)),E.setAttribute("uv",new fe(A,2)),E.setAttribute("aColor",new fe(v,3)),E.setIndex(new fe(M,1)),this.geometry=E}dispose(){this._font._unregister(this),this.geometry.dispose(),super.dispose()}}const yh=100;function SC(i,t,e){const n=gC(t,`${yh}px "${i}"`),{lines:s}=_C(n,e*yh,yh);return s.map(r=>r.text.trimEnd())}export{iu as A,bg as B,vv as C,ra as L,Eg as M,Nn as N,Ca as O,ci as P,on as Q,Ar as R,tv as S,Sg as T,en as U,I as V,yw as W,lt as a,O0 as b,_A as c,Ue as d,TC as e,j_ as f,$_ as g,Lp as h,Xs as i,kr as j,ae as k,CC as l,un as m,Wl as n,bt as o,Sn as p,Je as q,bC as r};
