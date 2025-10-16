"use client";

import { Canvas, useThree } from "@react-three/fiber";
import { OrbitControls, useGLTF, Environment } from "@react-three/drei";
import React, { useEffect, useState, Suspense, useRef, useCallback } from "react";
import * as THREE from "three";
import PopupViewer from "./PopupViewer";

type GLBViewerProps = {
  fileUrl: string;
  transparentBg?: boolean;
};

const FitCameraToModel: React.FC<{ object: THREE.Object3D }> = ({ object }) => {
  const { camera, controls } = useThree() as any;

  useEffect(() => {
    if (!object) return;
    const box = new THREE.Box3().setFromObject(object);
    const size = box.getSize(new THREE.Vector3()).length();
    const center = box.getCenter(new THREE.Vector3());
    const fitOffset = 2.0;
    const maxDim = Math.max(size, 1);
    const fov = camera.fov * (Math.PI / 180);
    const cameraZ = Math.abs(maxDim / (2 * Math.tan(fov / 2))) * fitOffset;

    camera.position.set(center.x, center.y, cameraZ);
    camera.lookAt(center);
    camera.updateProjectionMatrix();

    if (controls) {
      controls.target.copy(center);
      controls.update();
    }
  }, [object, camera, controls]);

  return null;
};

const Model: React.FC<{ url: string; onLoaded: (scene: THREE.Object3D) => void }> = ({ url, onLoaded }) => {
  const { scene } = useGLTF(url);

  useEffect(() => {
    if (scene) onLoaded(scene);
  }, [scene, onLoaded]);

  return (
    <>
      <primitive object={scene} />
      <FitCameraToModel object={scene} />
    </>
  );
};

const HtmlLoader: React.FC<{ setLoading: (v: boolean) => void }> = ({ setLoading }) => {
  useEffect(() => {
    setLoading(false);
  }, [setLoading]);
  return null;
};

// Dispose function for proper cleanup
function disposeObject(obj: THREE.Object3D | null) {
  if (!obj) return;
  obj.traverse((node: any) => {
    if (!node) return;
    if (node.geometry) node.geometry.dispose();
    if (node.material) {
      const mat = node.material;
      const disposeMaterial = (m: any) => {
        for (const key in m) {
          if (!m.hasOwnProperty(key)) continue;
          const value = m[key];
          if (value && value.isTexture) value.dispose();
        }
        m.dispose && m.dispose();
      };
      Array.isArray(mat) ? mat.forEach(disposeMaterial) : disposeMaterial(mat);
    }
  });
}

export default function GLBViewer({ fileUrl, transparentBg = false }: GLBViewerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [thumbLoading, setThumbLoading] = useState(true);
  const [resolvedUrl, setResolvedUrl] = useState<string>("/models/Desk.glb");
  const [canvasKey, setCanvasKey] = useState(0);
  const sceneRef = useRef<THREE.Object3D | null>(null);

  useEffect(() => {
    setThumbLoading(true);
  }, [canvasKey]);

  // Reset and load new URL
  const resetAndLoad = useCallback(async (newUrl: string) => {
    if (sceneRef.current) {
      disposeObject(sceneRef.current);
      sceneRef.current = null;
    }

    try {
      useGLTF.clear(newUrl);
    } catch {}

    setCanvasKey((k) => k + 1);
    setThumbLoading(true);

    try {
      const res = await fetch(newUrl, { method: "HEAD", cache: "no-store" });
      if (res.ok) setResolvedUrl(newUrl);
      else setResolvedUrl("/models/Desk.glb");
    } catch {
      setResolvedUrl("/models/Desk.glb");
    }
  }, []);

  // Only reload if fileUrl is actually different from current resolvedUrl
  useEffect(() => {
    if (fileUrl && fileUrl !== resolvedUrl) resetAndLoad(fileUrl);
  }, [fileUrl, resetAndLoad, resolvedUrl]);

  const handleModelLoaded = useCallback((scene: THREE.Object3D) => {
    sceneRef.current = scene;
    setThumbLoading(false);
  }, []);

  return (
    <>
      {/* Thumbnail box */}
      <div
        className={`relative w-full h-[150px] rounded-2xl shadow-md overflow-hidden cursor-pointer ${
          transparentBg ? "bg-transparent" : "bg-white"
        }`}
        onClick={() => setIsOpen(true)}
      >
        {thumbLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-50 z-20">
            <div className="w-6 h-6 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin"></div>
          </div>
        )}

        <Canvas
          key={canvasKey}
          camera={{ position: [0, 0, 3], fov: 50 }}
          style={{ background: transparentBg ? "transparent" : "#ffffff" }}
        >
          <ambientLight intensity={0.8} />
          <directionalLight position={[5, 5, 5]} intensity={1.5} />
          <Suspense fallback={null}>
            <Model url={resolvedUrl} onLoaded={handleModelLoaded} />
            <Environment preset="city" />
            <HtmlLoader setLoading={setThumbLoading} />
          </Suspense>
          <OrbitControls makeDefault enablePan={false} enableZoom={false} enableRotate />
        </Canvas>
      </div>

      {/* Fullscreen popup */}
      {isOpen && (
        <PopupViewer
          fileUrl={resolvedUrl}
          onClose={() => {
            setIsOpen(false);
            setCanvasKey((k) => k + 1);
          }}
        />
      )}
    </>
  );
}
