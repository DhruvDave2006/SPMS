import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, Bell, Search, LogOut, User, ChevronDown, Sun, Moon } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';

export default function Navbar({ onMenuClick }) {
  const { user, role, logout } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const [dropOpen, setDropOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header
      className="sticky top-0 z-30 flex items-center gap-4 px-4 lg:px-6 h-14 backdrop-blur-md transition-colors duration-300"
      style={{
        backgroundColor: 'var(--navbar-bg)',
        borderBottom: '1px solid var(--border-subtle)',
      }}
    >
      {/* Mobile menu button */}
      <button
        onClick={onMenuClick}
        className="p-2 rounded-lg transition-colors lg:hidden"
        style={{ color: 'var(--text-muted)' }}
        onMouseEnter={e => { e.currentTarget.style.color = 'var(--text-primary)'; e.currentTarget.style.background = 'var(--bg-surface)'; }}
        onMouseLeave={e => { e.currentTarget.style.color = 'var(--text-muted)'; e.currentTarget.style.background = 'transparent'; }}
      >
        <Menu size={20} />
      </button>

      {/* Search */}
      <div
        className="hidden sm:flex items-center gap-2 flex-1 max-w-xs px-3 py-1.5 rounded-lg transition-colors duration-300"
        style={{
          background: 'var(--bg-surface-2)',
          border: '1px solid var(--border-subtle)',
        }}
      >
        <Search size={14} style={{ color: 'var(--text-faint)' }} className="flex-shrink-0" />
        <input
          type="text"
          placeholder="Quick search..."
          className="bg-transparent text-sm outline-none flex-1 font-sans"
          style={{ color: 'var(--text-secondary)' }}
        />
      </div>

      <div className="ml-auto flex items-center gap-2">
        {/* Theme toggle */}
        <motion.button
          whileTap={{ scale: 0.9 }}
          whileHover={{ scale: 1.05 }}
          onClick={toggleTheme}
          className="relative p-2 rounded-lg transition-all duration-200"
          style={{ color: 'var(--text-muted)' }}
          title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
        >
          <AnimatePresence mode="wait" initial={false}>
            {isDark ? (
              <motion.span
                key="sun"
                initial={{ rotate: -90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: 90, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="block"
              >
                <Sun size={18} className="text-brass-400" />
              </motion.span>
            ) : (
              <motion.span
                key="moon"
                initial={{ rotate: 90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: -90, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="block"
              >
                <Moon size={18} className="text-navy-500" />
              </motion.span>
            )}
          </AnimatePresence>
        </motion.button>

        {/* Notification bell */}
        <button
          className="relative p-2 rounded-lg transition-colors"
          style={{ color: 'var(--text-muted)' }}
        >
          <Bell size={18} />
          <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-brass-500 rounded-full" />
        </button>

        {/* User menu */}
        <div className="relative">
          <button
            onClick={() => setDropOpen(o => !o)}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg transition-colors"
          >
            <div className="w-7 h-7 rounded-full bg-brass-500/30 border border-brass-500/40 flex items-center justify-center">
              <span className="text-xs font-bold text-brass-400 font-mono">
                {user?.FullName?.charAt(0) || '?'}
              </span>
            </div>
            <span
              className="hidden sm:block text-sm font-medium max-w-[120px] truncate"
              style={{ color: 'var(--text-primary)' }}
            >
              {user?.FullName}
            </span>
            <ChevronDown
              size={14}
              style={{ color: 'var(--text-muted)' }}
              className={`transition-transform ${dropOpen ? 'rotate-180' : ''}`}
            />
          </button>

          <AnimatePresence>
            {dropOpen && (
              <motion.div
                initial={{ opacity: 0, y: -8, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -8, scale: 0.95 }}
                transition={{ duration: 0.15 }}
                className="absolute right-0 mt-2 w-52 glass-card-dark py-1 z-50"
                onMouseLeave={() => setDropOpen(false)}
              >
                <div
                  className="px-4 py-2"
                  style={{ borderBottom: '1px solid var(--border-subtle)' }}
                >
                  <p className="text-xs font-semibold truncate" style={{ color: 'var(--text-primary)' }}>
                    {user?.FullName}
                  </p>
                  <p className="text-2xs truncate" style={{ color: 'var(--text-muted)' }}>
                    {user?.Email}
                  </p>
                </div>
                <Link
                  to="/profile"
                  onClick={() => setDropOpen(false)}
                  className="flex items-center gap-2 px-4 py-2 text-sm transition-colors"
                  style={{ color: 'var(--text-secondary)' }}
                  onMouseEnter={e => { e.currentTarget.style.color = 'var(--text-primary)'; e.currentTarget.style.background = 'var(--bg-surface)'; }}
                  onMouseLeave={e => { e.currentTarget.style.color = 'var(--text-secondary)'; e.currentTarget.style.background = 'transparent'; }}
                >
                  <User size={14} /> My Profile
                </Link>
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-2 px-4 py-2 text-sm text-brick-400 hover:text-brick-300 hover:bg-brick-600/10 transition-colors"
                >
                  <LogOut size={14} /> Logout
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </header>
  );
}
