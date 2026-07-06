import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { motion } from 'framer-motion';
import { Canvas, useFrame } from '@react-three/fiber';
import { Sphere, MeshDistortMaterial, Float } from '@react-three/drei';
import toast from 'react-hot-toast';
import { GraduationCap, Eye, EyeOff, ArrowRight, Lock, Mail } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { authService } from '../../services/authService';

// ── 3D Background Orb ──────────────────────────────────────
function AnimatedOrb({ position, scale, color, speed, distort }) {
  const meshRef = useRef();
  useFrame(({ clock }) => {
    meshRef.current.rotation.x = clock.getElapsedTime() * speed * 0.3;
    meshRef.current.rotation.y = clock.getElapsedTime() * speed * 0.5;
  });
  return (
    <Float speed={speed} rotationIntensity={0.4} floatIntensity={1.2}>
      <Sphere ref={meshRef} args={[1, 64, 64]} position={position} scale={scale}>
        <MeshDistortMaterial color={color} distort={distort} speed={2} roughness={0.1} metalness={0.8} transparent opacity={0.15} />
      </Sphere>
    </Float>
  );
}

function Scene3D() {
  return (
    <>
      <ambientLight intensity={0.3} />
      <pointLight position={[10, 10, 10]} intensity={1.5} color="#B8943F" />
      <pointLight position={[-10, -10, -5]} intensity={0.8} color="#0D9488" />
      <AnimatedOrb position={[3, 2, -2]} scale={2.5} color="#B8943F" speed={1.2} distort={0.4} />
      <AnimatedOrb position={[-3, -1, -3]} scale={1.8} color="#0D9488" speed={0.8} distort={0.3} />
      <AnimatedOrb position={[0, 3, -4]} scale={1.2} color="#1B2A4A" speed={1.5} distort={0.6} />
    </>
  );
}

// Preset credentials for quick demo
const DEMO_CREDS = [
  { label: 'Admin', email: 'admin@spms.edu', password: 'Admin@123', color: 'text-brass-400' },
  { label: 'Faculty', email: 'nvoss@spms.edu', password: 'Faculty@123', color: 'text-teal-400' },
  { label: 'Student', email: 'lcalloway@student.spms.edu', password: 'Student@123', color: 'text-sage-500' },
];

export default function LoginPage() {
  const { login, isAuthenticated, role } = useAuth();
  const { isDark } = useTheme();
  const navigate = useNavigate();
  const [showPw, setShowPw] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const { register, handleSubmit, setValue, formState: { errors } } = useForm();

  // Redirect if already logged in
  useEffect(() => {
    if (isAuthenticated) {
      const dest = role === 'Admin' ? '/dashboard/admin'
                 : role === 'Faculty' ? '/dashboard/faculty'
                 : '/dashboard/student';
      navigate(dest, { replace: true });
    }
  }, [isAuthenticated, role, navigate]);

  const onSubmit = async ({ email, password }) => {
    setSubmitting(true);
    try {
      const { user, role: userRole, token } = await authService.login(email, password);
      login(user, userRole, token);
      toast.success(`Welcome back, ${user.FullName.split(' ')[0]}!`);
      const dest = userRole === 'Admin' ? '/dashboard/admin'
                 : userRole === 'Faculty' ? '/dashboard/faculty'
                 : '/dashboard/student';
      navigate(dest, { replace: true });
    } catch (err) {
      toast.error(err.message || 'Login failed');
    } finally {
      setSubmitting(false);
    }
  };

  const fillDemo = ({ email, password }) => {
    setValue('email', email);
    setValue('password', password);
  };

  return (
    <div
      className="min-h-screen flex relative overflow-hidden transition-colors duration-300"
      style={{ backgroundColor: isDark ? '#070e1a' : '#d5dce9' }}
    >
      {/* 3D canvas background */}
      <div className={`absolute inset-0 ${isDark ? 'opacity-60' : 'opacity-30'}`}>
        <Canvas camera={{ position: [0, 0, 6], fov: 60 }}>
          <Scene3D />
        </Canvas>
      </div>

      {/* Gradient overlays */}
      <div
        className="absolute inset-0"
        style={{
          background: isDark
            ? 'linear-gradient(135deg, rgba(7,14,26,0.95) 0%, rgba(14,26,45,0.80) 50%, rgba(7,14,26,0.95) 100%)'
            : 'linear-gradient(135deg, rgba(213,220,233,0.92) 0%, rgba(224,235,245,0.75) 50%, rgba(213,220,233,0.92) 100%)',
        }}
      />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-brass-500/5 rounded-full blur-3xl" />
      <div className="absolute top-0 right-0 w-80 h-80 bg-teal-600/5 rounded-full blur-3xl" />

      <div className="relative z-10 flex w-full">
        {/* Left — branding panel */}
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7, ease: 'easeOut' }}
          className="hidden lg:flex flex-col justify-between w-1/2 p-12"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-brass-500/20 border border-brass-500/40 flex items-center justify-center">
              <GraduationCap size={20} className="text-brass-400" />
            </div>
            <span className="font-display font-bold text-xl" style={{ color: isDark ? '#ffffff' : '#0e1a2d' }}>SPMS</span>
          </div>

          <div>
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="font-display text-5xl font-bold leading-tight"
              style={{ color: isDark ? '#ffffff' : '#0e1a2d' }}
            >
              Student Project
              <span className="block text-brass-400">Management</span>
              <span className="block" style={{ color: isDark ? '#abb9d3' : '#243f72' }}>System</span>
            </motion.h1>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6, duration: 0.6 }}
              className="mt-6 text-lg leading-relaxed max-w-md"
              style={{ color: isDark ? '#8196bc' : '#2d5090' }}
            >
              A unified platform for students, faculty, and administrators to manage academic projects, track progress, and collaborate effectively.
            </motion.p>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 0.5 }}
              className="grid grid-cols-3 gap-4 mt-10"
            >
              {[
                { label: 'Active Projects', value: '8' },
                { label: 'Total Tasks', value: '19' },
                { label: 'Students', value: '6' },
              ].map(stat => (
                <div key={stat.label} className="glass-card p-4">
                  <p className="font-display text-2xl font-bold text-brass-400">{stat.value}</p>
                  <p className="text-xs mt-1" style={{ color: isDark ? '#8196bc' : '#2d5090' }}>{stat.label}</p>
                </div>
              ))}
            </motion.div>
          </div>

          <p className="text-2xs" style={{ color: isDark ? '#243f72' : '#5773a6' }}>© 2025 SPMS. Academic Project Management Platform.</p>
        </motion.div>

        {/* Right — login form */}
        <motion.div
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7, ease: 'easeOut' }}
          className="flex flex-col justify-center w-full lg:w-1/2 px-6 py-10 lg:px-16"
        >
          {/* Mobile logo */}
          <div className="flex items-center gap-3 mb-8 lg:hidden">
            <div className="w-9 h-9 rounded-xl bg-brass-500/20 border border-brass-500/40 flex items-center justify-center">
              <GraduationCap size={18} className="text-brass-400" />
            </div>
            <span className="font-display font-bold text-lg" style={{ color: isDark ? '#ffffff' : '#0e1a2d' }}>SPMS</span>
          </div>

          <div className="max-w-md w-full mx-auto">
            <h2 className="font-display text-3xl font-bold" style={{ color: isDark ? '#ffffff' : '#0e1a2d' }}>Welcome back</h2>
            <p className="mt-2 mb-8" style={{ color: isDark ? '#8196bc' : '#2d5090' }}>Sign in to your account to continue</p>

            {/* Demo quick-fill */}
            <div
              className="mb-6 p-4 rounded-xl"
              style={{
                background: isDark ? 'rgba(21,34,57,0.5)' : 'rgba(255,255,255,0.6)',
                border: `1px solid ${isDark ? 'rgba(27,42,74,0.5)' : 'rgba(27,42,74,0.15)'}`,
              }}
            >
              <p className="text-xs mb-2 font-semibold uppercase tracking-wide" style={{ color: isDark ? '#8196bc' : '#2d5090' }}>Demo accounts</p>
              <div className="flex gap-2 flex-wrap">
                {DEMO_CREDS.map(c => (
                  <button
                    key={c.label}
                    onClick={() => fillDemo(c)}
                    className={`text-xs px-3 py-1.5 rounded-lg transition-colors font-semibold ${c.color}`}
                    style={{
                      background: isDark ? 'rgba(27,42,74,0.6)' : 'rgba(213,220,233,0.8)',
                      border: `1px solid ${isDark ? '#243f72' : '#abb9d3'}`,
                    }}
                  >
                    {c.label}
                  </button>
                ))}
              </div>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              <div>
                <label className="form-label">Email Address</label>
                <div className="relative">
                  <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-navy-500" />
                  <input
                    {...register('email', {
                      required: 'Email is required',
                      pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: 'Invalid email' },
                    })}
                    type="email"
                    className={`form-input pl-10 ${errors.email ? 'error' : ''}`}
                    placeholder="you@spms.edu"
                    autoComplete="email"
                  />
                </div>
                {errors.email && <p className="text-xs text-brick-400 mt-1">{errors.email.message}</p>}
              </div>

              <div>
                <label className="form-label">Password</label>
                <div className="relative">
                  <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-navy-500" />
                  <input
                    {...register('password', { required: 'Password is required' })}
                    type={showPw ? 'text' : 'password'}
                    className={`form-input pl-10 pr-10 ${errors.password ? 'error' : ''}`}
                    placeholder="Your password"
                    autoComplete="current-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPw(v => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-navy-500 hover:text-navy-300"
                  >
                    {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
                {errors.password && <p className="text-xs text-brick-400 mt-1">{errors.password.message}</p>}
              </div>

              <motion.button
                type="submit"
                disabled={submitting}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="btn-primary w-full justify-center py-3 text-base mt-2"
              >
                {submitting ? (
                  <span className="flex items-center gap-2">
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                      className="w-4 h-4 border-2 border-navy-900/40 border-t-navy-900 rounded-full"
                    />
                    Signing in…
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    Sign In <ArrowRight size={16} />
                  </span>
                )}
              </motion.button>
            </form>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
