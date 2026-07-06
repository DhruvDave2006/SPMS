import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, User, Mail, Phone, Shield, CheckCircle, XCircle } from 'lucide-react';
import { userService } from '../../services/userService';
import { userRoleService } from '../../services/userRoleService';
import LoadingSpinner from '../../components/common/LoadingSpinner';

export default function UserProfilePage() {
  const { id } = useParams();
  const [user, setUser] = useState(null);
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      userService.getById(Number(id)),
      userRoleService.getByUserId(Number(id)),
    ]).then(([u, ur]) => {
      setUser(u);
      import('../../data/mockData.js').then(({ mockRoles }) => {
        setRoles(ur.map(r => mockRoles.find(mr => mr.RoleId === r.RoleId)).filter(Boolean));
      });
    }).finally(() => setLoading(false));
  }, [id]);

  if (loading) return <LoadingSpinner />;
  if (!user) return (
    <div className="text-center py-20">
      <p style={{ color: 'var(--text-muted)' }}>User not found.</p>
      <Link to="/users" className="btn-secondary mt-4 inline-flex">← Back to Users</Link>
    </div>
  );

  return (
    <div className="max-w-2xl">
      <Link
        to="/users"
        className="inline-flex items-center gap-1.5 text-sm mb-6 transition-colors hover:text-brass-400"
        style={{ color: 'var(--text-muted)' }}
      >
        <ArrowLeft size={15} /> Back to Users
      </Link>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-card p-6 mb-4">
        {/* Avatar + name */}
        <div className="flex items-center gap-5 pb-6 mb-6" style={{ borderBottom: '1px solid var(--border-subtle)' }}>
          <div
            className="w-20 h-20 rounded-2xl flex items-center justify-center flex-shrink-0"
            style={{ background: 'var(--item-bg)', border: '1px solid var(--border-color)' }}
          >
            <span className="font-display text-3xl font-bold text-brass-400">{user.FullName?.charAt(0)}</span>
          </div>
          <div>
            <h1 className="font-display text-2xl font-bold" style={{ color: 'var(--text-heading)' }}>{user.FullName}</h1>
            <p className="text-sm" style={{ color: 'var(--text-muted)' }}>{user.Email}</p>
            <div className="flex items-center gap-1.5 mt-1.5">
              {user.IsActive
                ? <span className="badge border bg-sage-600/15 text-sage-500 border-sage-600/30"><CheckCircle size={11} /> Active</span>
                : <span className="badge border bg-brick-600/15 text-brick-400 border-brick-600/30"><XCircle size={11} /> Inactive</span>
              }
            </div>
          </div>
        </div>

        {/* Details grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[
            { icon: User,   label: 'User ID', value: `#${user.UserId}` },
            { icon: Mail,   label: 'Email',   value: user.Email },
            { icon: Phone,  label: 'Mobile',  value: user.MobileNumber || '—' },
            { icon: Shield, label: 'Roles',   value: roles.map(r => r.RoleName).join(', ') || 'None' },
          ].map(({ icon: Icon, label, value }) => (
            <div key={label} className="flex items-start gap-3 p-3 rounded-xl surface-card">
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                style={{ background: 'var(--item-bg)', border: '1px solid var(--border-color)' }}
              >
                <Icon size={14} className="text-brass-400" />
              </div>
              <div>
                <p className="text-2xs uppercase tracking-wider" style={{ color: 'var(--text-faint)' }}>{label}</p>
                <p className="text-sm font-medium mt-0.5 font-mono" style={{ color: 'var(--text-primary)' }}>{value}</p>
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="flex gap-3">
        <Link to="/users" className="btn-secondary">← All Users</Link>
      </motion.div>
    </div>
  );
}
