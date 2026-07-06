import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

export default function Modal({ open, onClose, title, children, size = 'md' }) {
  const sizeMap = { sm: 'max-w-md', md: 'max-w-lg', lg: 'max-w-2xl', xl: 'max-w-4xl' };

  useEffect(() => {
    if (!open) return;
    const handler = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [open, onClose]);

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={onClose}
          />
          {/* Panel */}
          <motion.div
            key="panel"
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ type: 'spring', damping: 28, stiffness: 350 }}
            className={`relative w-full ${sizeMap[size]} glass-card-dark shadow-2xl max-h-[90vh] flex flex-col`}
            style={{ border: '1px solid var(--glass-dark-border)' }}
          >
            {/* Header */}
            <div
              className="flex items-center justify-between px-6 py-4 flex-shrink-0"
              style={{ borderBottom: '1px solid var(--border-subtle)' }}
            >
              <h2 className="font-display font-semibold text-lg" style={{ color: 'var(--text-heading)' }}>
                {title}
              </h2>
              <button
                onClick={onClose}
                className="p-1.5 rounded-lg transition-colors hover:bg-brass-500/10"
                style={{ color: 'var(--text-muted)' }}
              >
                <X size={18} />
              </button>
            </div>
            {/* Body */}
            <div className="overflow-y-auto flex-1 px-6 py-5">
              {children}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
