import { motion } from 'framer-motion';

export default function LoadingSpinner({ size = 'md', fullPage = false }) {
  const sizeMap = { sm: 'w-5 h-5', md: 'w-8 h-8', lg: 'w-12 h-12' };

  const spinner = (
    <motion.div
      animate={{ rotate: 360 }}
      transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
      className={`${sizeMap[size]} rounded-full border-2 border-t-brass-500`}
      style={{ borderColor: 'var(--border-subtle)', borderTopColor: '#B8943F' }}
    />
  );

  if (fullPage) {
    return (
      <div
        className="fixed inset-0 flex items-center justify-center backdrop-blur-sm z-50"
        style={{ background: 'rgba(var(--bg-primary), 0.8)' }}
      >
        <div className="flex flex-col items-center gap-4">
          {spinner}
          <p className="text-sm font-sans animate-pulse" style={{ color: 'var(--text-muted)' }}>Loading…</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center py-16">
      {spinner}
    </div>
  );
}
