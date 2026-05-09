import React, {
  useEffect,
  useRef
} from "react";
import {
  Canvas,
  useFrame
} from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";
import * as Three from "three";

interface ViewModelProps {
  /** Path to model */
  href: string;
  /** Rotate X */
  rotX?: number;
  /** Rotate Y */
  rotY?: number;
  /** Rotate Z */
  rotZ?: number;
  /** Speed X */
  spdX?: number;
  /** Speed Y */
  spdY?: number;
  /** Speed Z */
  spdZ?: number;
  /** Scale */
  scale?: number;
}

/**
 * View 3D model
 * @example
 * return <ViewModel />
*/
const ViewModel: React.FC<ViewModelProps & {
  /** Model name for ID */
  name: string;
}> = ({
  name,
  ...props
}) => {
  return (
    <div
      className="inset-0 h-50 aspect-square pointer-events-none overflow-hidden"
      key={name}
    >
      <Canvas
        camera={{
          position: [ 0, 0, 5 ],
          fov: 50
        }}
        dpr={[ 1, 2 ]}
        gl={{ antialias: false }}
      >
        <ambientLight intensity={.4} />
        <directionalLight
          position={[ 5, 5, 5 ]}
          intensity={1}
          castShadow
        />
        <Model {...props} />
      </Canvas>
    </div>
  );
}

/**
 * Model component
 * @example
 * return <Model />
*/
const Model: React.FC<ViewModelProps> = ({
  rotX=0,
  rotY=0,
  rotZ=0,
  href,
  spdX=0,
  spdY=0,
  spdZ=0,
  scale=1
}) => {
  const meshRef = useRef<Three.Group>(null);
  const { scene } = useGLTF(href);
  useGLTF.preload(href);

  useEffect(() => {
    if (!meshRef?.current)
      return;

    meshRef.current.rotation.x = rotX;
    meshRef.current.rotation.y = rotY;
    meshRef.current.rotation.z = rotZ;
  }, [
    meshRef,
    rotX,
    rotY,
    rotZ
  ]);

  useFrame((_, delta) => {
    if (!meshRef?.current)
      return;

    if (spdX)
      meshRef.current.rotation.x += spdX * delta;
    if (spdY)
      meshRef.current.rotation.y += spdY * delta;
    if (spdZ)
      meshRef.current.rotation.z += spdZ * delta;
  });

  return (
    <group
      ref={meshRef}
      position={[ 0, 0, scale ]}
      scale={scale}
    >
      <primitive object={scene} />
    </group>
  );
}

export default ViewModel;