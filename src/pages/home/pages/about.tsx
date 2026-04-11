import { useTranslation } from "react-i18next";
import { BiLogoTelegram } from "react-icons/bi";
import { SiBluesky } from "react-icons/si";
import { NavLink } from "react-router";
import imgLabel from "@/icons/label.svg";
import imgEmpty from "@/icons/empty.svg";

/**
 * About page
 * @example
 * return <About />
 */
export default function About({}) {
	const { t } = useTranslation();

	return (
		<div className="flex-1 flex justify-center flex-col items-center w-full min-h-full">
			<Meta
				title="ioy.app"
				description={t("about.description")}
				url="https://ioy.app/"
			/>
			<div className="flex flex-col justify-center gap-4 flex-1 max-w-[60%] max-md:max-w-full z-2">
				<div className="flex justify-center w-full">
					<div className="w-[60%] max-md:w-full flex justify-center items-center">
						<img src={imgLabel} className="w-full p-8" />
					</div>
				</div>
				<div className="flex justify-center w-full">
					<BackgroundScene
						model={"/resources/gltf/ufo.gltf"}
						speedY={.2}
						scale={3.5}
					/>
				</div>
				<div className="p-4 w-full text-primary">
					<p className="text-default text-2xl text-center text-text">{t("about.description")}</p>
				</div>
				<div className="flex gap-6 text-2xl w-full justify-center items-center">
					<NavLink to="mailto:support@ioy.app">
						<address className="text-2xl text-second">
							support@ioy.app
						</address>
					</NavLink>
					<NavLink to="https://t.me/wmgcat" target="_blank">
						<BiLogoTelegram className="text-second text-2xl" />
					</NavLink>
					<NavLink to="https://bsky.app/profile/wmgcat.bsky.social" target="_blank">
						<SiBluesky className="text-second text-2xl" />
					</NavLink>
				</div>
				<div className="flex justify-center w-full relative">
					<div className="absolute right-[30%] top-[10%]">
						<BackgroundScene
							model={"/resources/gltf/computer.gltf"}
							speedY={-.5}
							speedX={.2}
						/>
					</div>
					<div className="w-[40%] max-md:w-full flex justify-center items-center">
						<img src={imgEmpty} className="w-full p-8" />
					</div>
				</div>
				
			</div>
		</div>
	);
}


import React, { useEffect, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { useGLTF, Environment, ContactShadows } from '@react-three/drei';
import * as THREE from 'three';
import { Meta } from "@/components";

type ModelProps = {
  position?: [number, number, number];
  scale?: number;
  url: string;
  // Разделяем скорости для независимого контроля осей
  rotationSpeedX?: number;
  rotationSpeedY?: number;
};

const RotatingModel: React.FC<ModelProps> = ({ 
  position = [0, 0, 0], 
  scale = 1,
  url,
  rotationSpeedX = 0,
  rotationSpeedY = 0,
	rotationSpeedZ = 0,
	rotateX=0,
	rotateY=0,
	rotateZ=0
}) => {
  const meshRef = useRef<THREE.Group>(null);
  const { scene } = useGLTF(url);

	useEffect(() => {
		if (!meshRef)
			return;

		meshRef.current.rotation.x = rotateX;
		meshRef.current.rotation.y = rotateY;
		meshRef.current.rotation.z = rotateZ;
	}, [ meshRef, rotateX, rotateY, rotateZ ]);

  useFrame((state, delta) => {
    if (meshRef.current) {
      // Вращение по оси X (наклон вперед/назад)
      if (rotationSpeedX !== 0) {
        meshRef.current.rotation.x += rotationSpeedX * delta;
      }
      // Вращение по оси Y (вокруг своей оси)
      if (rotationSpeedY !== 0) {
        meshRef.current.rotation.y += rotationSpeedY * delta;
      }

			if (rotationSpeedZ !== 0) {
        meshRef.current.rotation.z += rotationSpeedZ * delta;
      }
    }
  });

  return (
    <group ref={meshRef} position={position} scale={scale}>
      <primitive object={scene} />
    </group>
  );
};

export const BackgroundScene: React.FC = ({
	model,
	speedX,
	speedY,
	speedZ,
	scale=2.5,
	rotateX=0,
	rotateY=0,
	rotateZ=0
}) => {
  return (
    <div className="inset-0 h-50 aspect-square pointer-events-none overflow-hidden">
      <Canvas
        camera={{ position: [0, 0, 5], fov: 50 }}
        dpr={[1, 2]}
        gl={{ antialias: false }}
      >
        <Environment preset="city" />
        <RotatingModel 
          url={model}
          position={[0, 0, scale]} 
          rotationSpeedX={speedX}
					rotationSpeedY={speedY}
					rotationSpeedZ={speedZ}
					rotateX={rotateX}
					rotateY={rotateY}
					rotateZ={rotateZ}
        />
        <ContactShadows resolution={800} scale={1} blur={2} opacity={0.5} far={10} color="#000000" />
      </Canvas>
    </div>
  );
};

useGLTF.preload('/resources/gltf/computer.gltf');
useGLTF.preload('/resources/gltf/ufo.gltf');