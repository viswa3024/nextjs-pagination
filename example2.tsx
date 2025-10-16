import { useGLTF } from "@react-three/drei";
import { useEffect, useMemo } from "react";

type GLBViewerProps = {
  url: string;
};

export default function GLBViewer({ url }: GLBViewerProps) {
  // ✅ Only update timestamp when `url` changes
  const cacheBustedUrl = useMemo(() => `${url}?t=${Date.now()}`, [url]);

  const { scene } = useGLTF(cacheBustedUrl);

  useEffect(() => {
    return () => {
      useGLTF.clear(cacheBustedUrl); // clear only when unmounting or url changes
    };
  }, [cacheBustedUrl]);

  return <primitive object={scene} scale={1} />;
}
