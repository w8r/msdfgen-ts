/**
 * msdfgen-ts + three.js: perspective text, orbit-to-zoom, billboarded labels,
 * and lazy glyph addition. The adapter lives in ./MSDFText.ts; this file is
 * scene glue only.
 */
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { loadMSDFFont, MSDFText } from "./MSDFText";

const FONT_URL = `${import.meta.env.BASE_URL}test/fonts/PTSerif-Regular.ttf`;
const PAPER = 0xf4ecdb;
const INK = 0x1b1d24;

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setPixelRatio(window.devicePixelRatio || 1);
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.prepend(renderer.domElement);

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.001, 1000);
camera.position.set(0, 0.4, 7);

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.minDistance = 0.01; // allow flying close into the glyphs
controls.maxDistance = 200;
controls.target.set(0, 0, 0);

const font = await loadMSDFFont(FONT_URL, { pixelsPerEm: 48, pxrange: 4 });

// The corner close-up: sharp at any zoom because the distance field is
// evaluated per pixel from the screen-space derivative.
const hero = new MSDFText(font, {
  text: "M k 4 & %",
  fontSize: 1.1,
  color: PAPER,
  anchorX: 0.5,
  anchorY: 0.5,
});
scene.add(hero);

const body = new MSDFText(font, {
  text: "One shared atlas, one shader, any number of text meshes. The distance field stays crisp as the camera flies in.",
  fontSize: 0.16,
  color: PAPER,
  anchorX: 0.5,
  anchorY: 0,
  maxWidth: 3.2,
});
body.position.y = -1.2;
scene.add(body);

const editable = new MSDFText(font, {
  text: "",
  fontSize: 0.5,
  color: 0xe9b872,
  anchorX: 0.5,
  anchorY: 0.5,
});
editable.position.y = 1.7;
scene.add(editable);

// Billboarded labels around the origin, each facing the camera every frame.
const labels: MSDFText[] = [];
for (let i = 0; i < 6; i++) {
  const label = new MSDFText(font, {
    text: `label ${i + 1}`,
    fontSize: 0.22,
    color: PAPER,
    anchorX: 0.5,
    anchorY: 0.5,
  });
  const angle = (i / 6) * Math.PI * 2;
  label.position.set(Math.cos(angle) * 3.2, -0.45 + Math.sin(angle) * 0.5, Math.sin(angle) * 1.2);
  scene.add(label);
  labels.push(label);
}

// Typing adds glyphs, which repacks the shared atlas. Every mesh rebuilds
// its UVs, so the existing text stays correct.
const input = document.querySelector<HTMLInputElement>("#input")!;
const onInput = () => editable.update({ text: input.value });
input.addEventListener("input", onInput);
onInput();

const themeButton = document.querySelector<HTMLButtonElement>("#theme")!;
themeButton.addEventListener("click", () => {
  const dark = document.documentElement.dataset.theme !== "light";
  document.documentElement.dataset.theme = dark ? "light" : "dark";
  const ink = dark ? INK : PAPER;
  renderer.setClearColor(dark ? PAPER : 0x0f1117);
  for (const mesh of [hero, body, ...labels]) mesh.update({ color: ink });
});
renderer.setClearColor(0x0f1117);

window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

renderer.setAnimationLoop(() => {
  controls.update();
  for (const label of labels) label.quaternion.copy(camera.quaternion);
  renderer.render(scene, camera);
});
