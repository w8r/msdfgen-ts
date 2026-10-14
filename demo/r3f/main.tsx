/**
 * msdfgen-ts + react-three-fiber: the same scene as demo/three, expressed as
 * React state. The adapter lives in ./MSDFText.tsx and ../three/MSDFText.ts.
 * Hover and click labels change colour and text, which exercises geometry
 * rebuilds through props.
 */
import { Suspense, useState } from "react";
import { createRoot } from "react-dom/client";
import { Canvas } from "@react-three/fiber";
import { Billboard, OrbitControls } from "@react-three/drei";
import { MSDFText } from "./MSDFText";
import { useMSDFFont } from "./useMSDFFont";

const FONT_URL = `${import.meta.env.BASE_URL}test/fonts/PTSerif-Regular.ttf`;
const PAPER = 0xf4ecdb;
const AMBER = 0xe9b872;
const LABEL_POSITIONS: [number, number, number][] = [
  [2.9, -0.2, 1.2],
  [-2.9, -0.2, -1.2],
  [1.6, -0.6, -2.4],
  [-1.6, -0.75, 2.4],
  [-3.4, -0.6, 0],
  [3.4, 0.2, 0],
];

function Scene({ typed }: { typed: string }) {
  const font = useMSDFFont(FONT_URL, { pixelsPerEm: 48, pxrange: 4 });
  const [hot, setHot] = useState<number | null>(null);
  const [clicks, setClicks] = useState<Record<number, number>>({});

  return (
    <>
      <OrbitControls enableDamping minDistance={0.01} maxDistance={200} />

      <MSDFText
        font={font}
        text="M k 4 & %"
        fontSize={1.1}
        color={PAPER}
        anchorX={0.5}
        anchorY={0.5}
      />

      <MSDFText
        font={font}
        text="One shared atlas, one shader, any number of text meshes. The distance field stays crisp as the camera flies in."
        fontSize={0.16}
        color={PAPER}
        anchorX={0.5}
        anchorY={0}
        maxWidth={3.2}
        position={[0, -1.2, 0]}
      />

      <MSDFText
        font={font}
        text={typed}
        fontSize={0.42}
        color={AMBER}
        anchorX={0.5}
        anchorY={0.5}
        position={[0, 1.7, 0]}
      />

      {LABEL_POSITIONS.map((position, i) => {
        const count = clicks[i] ?? 0;
        return (
          <Billboard key={i} position={position}>
            <MSDFText
              font={font}
              text={count ? `clicked ${count}×` : `label ${i + 1}`}
              fontSize={0.22}
              color={hot === i ? AMBER : PAPER}
              anchorX={0.5}
              anchorY={0.5}
              onPointerOver={() => setHot(i)}
              onPointerOut={() => setHot(null)}
              onClick={() => setClicks((c) => ({ ...c, [i]: (c[i] ?? 0) + 1 }))}
            />
          </Billboard>
        );
      })}
    </>
  );
}

function App() {
  const [typed, setTyped] = useState("Type new glyphs: ƒ ő Ж");
  return (
    <>
      <div className="controls">
        <input value={typed} onChange={(e) => setTyped(e.target.value)} aria-label="Text" />
      </div>
      <div id="stage">
        <Canvas
          camera={{ position: [0, 0.4, 7], fov: 45, near: 0.001, far: 1000 }}
          gl={{ antialias: true }}
          onCreated={({ gl }) => gl.setClearColor(0x0f1117)}
        >
          <Suspense fallback={null}>
            <Scene typed={typed} />
          </Suspense>
        </Canvas>
      </div>
    </>
  );
}

createRoot(document.getElementById("root")!).render(<App />);
