import { motion } from 'framer-motion';
import { Inbox } from 'lucide-react';

export default function EmptyState({ title = 'No records found', message = '', action }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center py-20 gap-4 text-center"
    >
      <div
        className="w-16 h-16 rounded-2xl flex items-center justify-center"
        style={{
          background: 'var(--glass-bg)',
          border: '1px solid var(--border-color)',
        }}
      >
        <Inbox size={28} style={{ color: 'var(--text-faint)' }} />
      </div>
      <div>
        <h3 className="font-display font-semibold text-lg" style={{ color: 'var(--text-heading)' }}>
          {title}
        </h3>
        {message && (
          <p className="text-sm mt-1 max-w-xs" style={{ color: 'var(--text-muted)' }}>
            {message}
          </p>
        )}
      </div>
      {action && (
        <button onClick={action.onClick} className="btn-primary mt-2">
          {action.label}
        </button>
      )}
    </motion.div>
  );
}
