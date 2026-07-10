import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, MeshDistortMaterial, Sphere, Box, Torus } from '@react-three/drei';
import * as THREE from 'three';

function ResumeCard() {
  const meshRef = useRef();
  useFrame((state) => {
    meshRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.3) * 0.3;
    meshRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.2) * 0.1;
  });
  return (
    <Float speed={2} rotationIntensity={0.3} floatIntensity={0.5}>
      <group ref={meshRef}>
        {/* Resume card body */}
        <Box args={[2.2, 3, 0.08]} position={[0, 0, 0]}>
          <meshStandardMaterial color="#1E293B" metalness={0.6} roughness={0.3} />
        </Box>
        {/* Accent strip */}
        <Box args={[0.12, 3, 0.09]} position={[-1.04, 0, 0]}>
          <meshStandardMaterial color="#4F46E5" emissive="#4F46E5" emissiveIntensity={0.4} metalness={0.8} />
        </Box>
        {/* Lines representing text */}
        {[-0.8, -0.5, -0.2, 0.1, 0.4, 0.7, 1.0].map((y, i) => (
          <Box key={i} args={[i % 3 === 0 ? 1.2 : 1.6, 0.06, 0.09]} position={[0.1, y, 0]}>
            <meshStandardMaterial color={i === 0 ? '#7C3AED' : '#334155'} metalness={0.2} />
          </Box>
        ))}
        {/* Profile circle */}
        <Sphere args={[0.25, 32, 32]} position={[-0.6, 1.1, 0.05]}>
          <meshStandardMaterial color="#4F46E5" emissive="#4F46E5" emissiveIntensity={0.3} />
        </Sphere>
      </group>
    </Float>
  );
}

function FloatingOrb({ position, color, size = 0.3, speed = 1 }) {
  const meshRef = useRef();
  useFrame((state) => {
    meshRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * speed) * 0.3;
    meshRef.current.rotation.y += 0.01;
  });
  return (
    <mesh ref={meshRef} position={position}>
      <Sphere args={[size, 32, 32]}>
        <MeshDistortMaterial color={color} attach="material" distort={0.4} speed={2} roughness={0.1} metalness={0.8} />
      </Sphere>
    </mesh>
  );
}

function Particles() {
  const count = 80;
  const positions = useMemo(() => {
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 14;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 14;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 6;
    }
    return pos;
  }, []);

  const pointsRef = useRef();
  useFrame((state) => {
    pointsRef.current.rotation.y = state.clock.elapsedTime * 0.03;
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial size={0.04} color="#4F46E5" transparent opacity={0.7} />
    </points>
  );
}

function RingOrbit() {
  const ref = useRef();
  useFrame((state) => {
    ref.current.rotation.x = state.clock.elapsedTime * 0.15;
    ref.current.rotation.y = state.clock.elapsedTime * 0.2;
  });
  return (
    <mesh ref={ref} position={[0, 0, -1]}>
      <Torus args={[3, 0.015, 16, 100]}>
        <meshStandardMaterial color="#4F46E5" emissive="#4F46E5" emissiveIntensity={0.5} transparent opacity={0.4} />
      </Torus>
    </mesh>
  );
}

const Hero3D = () => {
  return (
    <Canvas
      camera={{ position: [0, 0, 6], fov: 50 }}
      gl={{ antialias: true, alpha: true }}
      style={{ background: 'transparent' }}
    >
      <ambientLight intensity={0.3} />
      <directionalLight position={[5, 5, 5]} intensity={1} color="#4F46E5" />
      <directionalLight position={[-5, -5, -5]} intensity={0.5} color="#7C3AED" />
      <pointLight position={[3, 3, 3]} intensity={1} color="#06B6D4" />

      <Particles />
      <ResumeCard />
      <RingOrbit />
      <FloatingOrb position={[-3.5, 1.5, -1]} color="#7C3AED" size={0.35} speed={0.8} />
      <FloatingOrb position={[3.5, -1, -1]} color="#06B6D4" size={0.25} speed={1.2} />
      <FloatingOrb position={[2.5, 2, -2]} color="#4F46E5" size={0.2} speed={0.6} />
      <FloatingOrb position={[-2.5, -1.5, -1]} color="#EC4899" size={0.15} speed={1.5} />
    </Canvas>
  );
};

export default Hero3D;
