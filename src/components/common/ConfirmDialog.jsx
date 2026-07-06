import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle } from 'lucide-react';

export default function ConfirmDialog({ open, onConfirm, onCancel, title = 'Confirm Action', message, confirmLabel = 'Delete', loading = false }) {
  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/65 backdrop-blur-sm"
            onClick={onCancel}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.85, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 8 }}
            transition={{ type: 'spring', damping: 30, stiffness: 400 }}
            className="relative w-full max-w-sm glass-card-dark p-6"
            style={{ border: '1px solid rgba(180, 83, 9, 0.25)' }}
          >
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-brick-600/20 border border-brick-600/30 flex items-center justify-center flex-shrink-0">
                <AlertTriangle size={20} className="text-brick-400" />
              </div>
              <div>
                <h3 className="font-display font-semibold text-base" style={{ color: 'var(--text-heading)' }}>
                  {title}
                </h3>
                <p className="text-sm mt-1 leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                  {message}
                </p>
              </div>
            </div>
            <div className="flex gap-3 mt-6 justify-end">
              <button onClick={onCancel} className="btn-secondary" disabled={loading}>Cancel</button>
              <button onClick={onConfirm} className="btn-danger" disabled={loading}>
                {loading ? 'Processing…' : confirmLabel}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
