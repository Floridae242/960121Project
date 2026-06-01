/* eslint-disable react/no-unknown-property -- react-three-fiber intrinsics (intensity, position, object ฯลฯ) ไม่ใช่ DOM props */
import { useRef, useMemo, Suspense } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { useTexture, useGLTF, OrbitControls } from "@react-three/drei";
import * as THREE from "three";
import { useMediaQuery } from "@/hooks/useMediaQuery";

const REDUCED_MOTION_QUERY = "(prefers-reduced-motion: reduce)";

// โมเดลห้องเบเกอรี่: geometry บีบอัดด้วย Draco (52MB OBJ → 1.9MB GLB)
// decoder โหลดจาก /draco/ ในเครื่อง (self-host) ไม่พึ่ง CDN ภายนอก
const ROOM_GLB = "/models/room/room.glb";
const DRACO_PATH = "/draco/";
useGLTF.preload(ROOM_GLB, DRACO_PATH);

function RoomModel() {
  const { scene: gltfScene } = useGLTF(ROOM_GLB, DRACO_PATH);
  const textures = useTexture({
    map: "/models/room/texture_diffuse.webp",
    normalMap: "/models/room/texture_normal.webp",
    roughnessMap: "/models/room/texture_roughness.webp",
    metalnessMap: "/models/room/texture_metallic.webp",
  });

  const scene = useMemo(() => {
    // glTF ใช้ UV origin มุมบนซ้าย → ต้อง flipY=false ให้ตรงกับ GLTFLoader
    // (useTexture ตั้ง flipY=true เป็นค่าเริ่มต้น ซึ่งจะทำให้ texture กลับหัว)
    for (const t of Object.values(textures)) t.flipY = false;
    textures.map.colorSpace = THREE.SRGBColorSpace; // baseColor เป็น sRGB, map อื่นเป็น linear

    const cloned = gltfScene.clone(true);
    const mat = new THREE.MeshStandardMaterial({
      map: textures.map,
      normalMap: textures.normalMap,
      roughnessMap: textures.roughnessMap,
      metalnessMap: textures.metalnessMap,
      metalness: 0.35,
      roughness: 0.65,
    });
    cloned.traverse((child) => {
      if (child.isMesh) {
        child.material = mat;
        child.castShadow = true;
        child.receiveShadow = true;
      }
    });
    return cloned;
  }, [gltfScene, textures]);

  const ref = useRef();
  const reduce = useMediaQuery(REDUCED_MOTION_QUERY);

  // การหมุนคุมด้วย OrbitControls (drag) แล้ว — useFrame เหลือแค่ลอยขึ้นลงเบาๆ ให้ดูมีชีวิต
  // ปิด bob เมื่อผู้ใช้เปิด reduced motion
  useFrame(({ clock }) => {
    if (!ref.current) return;
    ref.current.position.y = reduce ? 0 : Math.sin(clock.elapsedTime * 0.5) * 0.06;
  });

  return <primitive ref={ref} object={scene} scale={1.6} />;
}

export default function BakeryRoom3D({ className = "" }) {
  const reduce = useMediaQuery(REDUCED_MOTION_QUERY);
  return (
    <div className={`w-full h-full ${className}`}>
      <Canvas
        camera={{ position: [4, 3, 5], fov: 38 }}
        gl={{ antialias: true, alpha: true }}
        style={{ background: "transparent" }}
        shadows
      >
        <ambientLight intensity={0.9} color="#FFF6E5" />
        <directionalLight position={[6, 8, 6]} intensity={1.6} color="#FFF3DC" castShadow />
        <directionalLight position={[-4, 2, -4]} intensity={0.35} color="#C9943A" />
        <pointLight position={[0, 4, 0]} intensity={0.5} color="#FFE4B5" />
        <Suspense fallback={null}>
          <RoomModel />
        </Suspense>
        {/* Drag เพื่อหมุนโมเดล — ปิด zoom/pan ไว้เพื่อให้ scroll หน้าเว็บยังทำงานปกติ
            auto-rotate ช้าๆ ช่วยให้ผู้ใช้รู้ว่าหมุนได้ และจะหยุดเองตอนผู้ใช้ลากอยู่ */}
        <OrbitControls
          makeDefault
          enablePan={false}
          enableZoom={false}
          enableDamping
          dampingFactor={0.08}
          rotateSpeed={0.6}
          autoRotate={!reduce}
          autoRotateSpeed={0.6}
          minPolarAngle={Math.PI * 0.18}
          maxPolarAngle={Math.PI * 0.52}
        />
      </Canvas>
    </div>
  );
}
