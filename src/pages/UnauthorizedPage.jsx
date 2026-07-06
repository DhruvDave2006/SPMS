import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ShieldOff } from 'lucide-react';

export default function UnauthorizedPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-navy-950 px-6">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
        transition={{ type: 'spring', damping: 20, stiffness: 300 }}
        className="text-center"
      >
        <div className="w-20 h-20 rounded-2xl bg-brick-600/20 border border-brick-600/30 flex items-center justify-center mx-auto mb-6">
          <ShieldOff size={32} className="text-brick-400" />
        </div>
        <h1 className="font-display text-3xl font-bold text-white mb-2">Access Denied</h1>
        <p className="text-navy-400 mb-8 max-w-sm">You don't have permission to view this page. Contact your administrator if you think this is an error.</p>
        <div className="flex gap-3 justify-center">
          <Link to="/" className="btn-primary">← Back to Dashboard</Link>
        </div>
      </motion.div>
    </div>
  );
}
