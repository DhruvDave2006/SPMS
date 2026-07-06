import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Torus, MeshDistortMaterial } from '@react-three/drei';

function Spin() {
  const ref = useRef();
  useFrame(({ clock }) => {
    ref.current.rotation.x = clock.getElapsedTime() * 0.5;
    ref.current.rotation.y = clock.getElapsedTime() * 0.7;
  });
  return (
    <Torus ref={ref} args={[1, 0.4, 32, 64]}>
      <MeshDistortMaterial color="#B8943F" distort={0.3} speed={2} transparent opacity={0.25} roughness={0.1} metalness={0.8} />
    </Torus>
  );
}

export default function NotFoundPage() {
  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden transition-colors duration-300"
      style={{ backgroundColor: 'var(--bg-primary)' }}
    >
      <div className="absolute inset-0 opacity-30">
        <Canvas camera={{ position: [0, 0, 4], fov: 60 }}>
          <ambientLight intensity={0.4} />
          <pointLight position={[5, 5, 5]} color="#B8943F" intensity={1.5} />
          <Spin />
        </Canvas>
      </div>
      <motion.div
        initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}
        className="relative z-10 text-center px-6"
      >
        <p className="font-mono text-brass-500 text-8xl font-bold mb-4">404</p>
        <h1 className="font-display text-4xl font-bold mb-3" style={{ color: 'var(--text-heading)' }}>Page Not Found</h1>
        <p className="mb-8" style={{ color: 'var(--text-muted)' }}>The page you're looking for doesn't exist or has been moved.</p>
        <Link to="/" className="btn-primary">← Back to Home</Link>
      </motion.div>
    </div>
  );
}
