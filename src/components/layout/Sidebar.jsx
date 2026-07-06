import { NavLink, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import {
  LayoutDashboard, Users, Shield, UserCheck, FolderKanban,
  CheckSquare, BarChart3, LogOut, ChevronRight, GraduationCap, X, BookOpen,
} from 'lucide-react';

const NAV_SECTIONS = {
  Admin: [
    { label: 'Dashboard',      to: '/dashboard/admin',  icon: LayoutDashboard },
    { label: 'Users',          to: '/users',            icon: Users },
    { label: 'Roles',          to: '/roles',            icon: Shield },
    { label: 'Role Assignment', to: '/user-roles',      icon: UserCheck },
    { label: 'Projects',       to: '/projects',         icon: FolderKanban },
    { label: 'Reports',        to: '/reports',          icon: BarChart3 },
  ],
  Faculty: [
    { label: 'Dashboard', to: '/dashboard/faculty', icon: LayoutDashboard },
    { label: 'Projects',  to: '/projects',          icon: FolderKanban },
    { label: 'Reports',   to: '/reports',           icon: BarChart3 },
  ],
  Student: [
    { label: 'Dashboard', to: '/dashboard/student', icon: LayoutDashboard },
    { label: 'Projects',  to: '/projects',          icon: FolderKanban },
  ],
};

const ROLE_COLORS = {
  Admin:   'bg-brass-500/20 text-brass-400',
  Faculty: 'bg-teal-600/20 text-teal-400',
  Student: 'bg-sage-600/20 text-sage-500',
};

export default function Sidebar({ mobileOpen, onClose }) {
  const { user, role, logout } = useAuth();
  const navigate = useNavigate();
  const navItems = NAV_SECTIONS[role] || [];

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // Sidebar always keeps the navy dark look — it's the brand identity
  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="flex items-center gap-3 px-5 py-5 border-b border-navy-700/50">
        <div className="w-9 h-9 rounded-xl bg-brass-500/20 border border-brass-500/30 flex items-center justify-center flex-shrink-0">
          <GraduationCap size={18} className="text-brass-400" />
        </div>
        <div>
          <p className="font-display font-bold text-white text-base leading-tight">SPMS</p>
          <p className="text-2xs text-navy-400 font-sans tracking-wide">Project Management</p>
        </div>
        {/* Mobile close */}
        <button onClick={onClose} className="ml-auto p-1 text-navy-400 hover:text-white transition-colors lg:hidden">
          <X size={18} />
        </button>
      </div>

      {/* User pill */}
      <div className="mx-4 mt-4 p-3 rounded-xl bg-navy-800/60 border border-navy-700/40">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-brass-500/30 border border-brass-500/40 flex items-center justify-center flex-shrink-0">
            <span className="text-sm font-bold text-brass-400 font-mono">
              {user?.FullName?.charAt(0) || '?'}
            </span>
          </div>
          <div className="min-w-0">
            <p className="text-sm font-semibold text-white truncate">{user?.FullName}</p>
            <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-2xs font-semibold mt-0.5 ${ROLE_COLORS[role]}`}>
              {role}
            </span>
          </div>
        </div>
      </div>

      {/* Nav items — ledger tabs */}
      <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
        <p className="text-2xs font-semibold uppercase tracking-widest text-navy-500 px-4 mb-2">Navigation</p>
        {navItems.map(({ label, to, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            onClick={onClose}
            className={({ isActive }) =>
              `ledger-tab group ${isActive ? 'active' : ''}`
            }
          >
            {({ isActive }) => (
              <>
                <Icon
                  size={16}
                  className={`ledger-icon flex-shrink-0 transition-colors ${isActive ? 'text-brass-500' : 'text-navy-400 group-hover:text-navy-200'}`}
                />
                <span className="flex-1">{label}</span>
                {isActive && (
                  <ChevronRight size={14} className="text-brass-500/60 flex-shrink-0" />
                )}
              </>
            )}
          </NavLink>
        ))}

        <p className="text-2xs font-semibold uppercase tracking-widest text-navy-500 px-4 mt-5 mb-2">Account</p>
        <NavLink
          to="/profile"
          onClick={onClose}
          className={({ isActive }) => `ledger-tab group ${isActive ? 'active' : ''}`}
        >
          {({ isActive }) => (
            <>
              <BookOpen size={16} className={`ledger-icon flex-shrink-0 ${isActive ? 'text-brass-500' : 'text-navy-400 group-hover:text-navy-200'}`} />
              <span className="flex-1">Profile</span>
              {isActive && <ChevronRight size={14} className="text-brass-500/60 flex-shrink-0" />}
            </>
          )}
        </NavLink>
      </nav>

      {/* Logout */}
      <div className="p-3 border-t border-navy-700/50">
        <button
          onClick={handleLogout}
          className="ledger-tab w-full text-brick-400 hover:text-brick-300 hover:bg-brick-600/10 group"
          style={{ borderLeftColor: 'transparent' }}
        >
          <LogOut size={16} className="flex-shrink-0 group-hover:text-brick-300" />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop sidebar — always navy dark */}
      <aside className="hidden lg:flex flex-col w-60 flex-shrink-0 bg-navy-900 border-r border-navy-700/50 h-screen sticky top-0">
        <SidebarContent />
      </aside>

      {/* Mobile drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              key="overlay"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 z-40 lg:hidden"
              onClick={onClose}
            />
            <motion.aside
              key="drawer"
              initial={{ x: -280 }} animate={{ x: 0 }} exit={{ x: -280 }}
              transition={{ type: 'spring', damping: 28, stiffness: 300 }}
              className="fixed top-0 left-0 h-full w-64 bg-navy-900 border-r border-navy-700/50 z-50 lg:hidden"
            >
              <SidebarContent />
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
