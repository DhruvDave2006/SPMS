import { useState, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { Camera, Save, User, Mail, Phone, Shield } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { userService } from '../../services/userService';

export default function ProfilePage() {
  const { user, role, updateProfile } = useAuth();
  const [previewUrl, setPreviewUrl] = useState(user?.ProfilePicturePath || null);
  const [saving, setSaving]         = useState(false);
  const fileRef = useRef();

  const { register, handleSubmit, formState: { errors, isDirty } } = useForm({
    defaultValues: {
      FullName:     user?.FullName || '',
      Email:        user?.Email || '',
      MobileNumber: user?.MobileNumber || '',
    },
  });

  const handlePhoto = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
  };

  const onSubmit = async (data) => {
    setSaving(true);
    try {
      const updated = await userService.update(user.UserId, data);
      updateProfile(updated);
      toast.success('Profile updated successfully!');
    } catch (err) {
      toast.error(err.message);
    } finally {
      setSaving(false);
    }
  };

  const ROLE_CONFIG = {
    Admin:   { color: 'text-brass-400',  bg: 'bg-brass-500/15',  border: 'border-brass-500/30' },
    Faculty: { color: 'text-teal-400',   bg: 'bg-teal-600/15',   border: 'border-teal-600/30' },
    Student: { color: 'text-sage-500',   bg: 'bg-sage-600/15',   border: 'border-sage-600/30' },
  };
  const rc = ROLE_CONFIG[role] || ROLE_CONFIG.Student;

  return (
    <div className="max-w-3xl">
      <div className="mb-6">
        <h1 className="font-display text-3xl font-bold text-white">My Profile</h1>
        <p className="text-navy-400 mt-1 text-sm">Manage your personal information and account settings</p>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card p-6 mb-6"
      >
        {/* Avatar section */}
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 pb-6 border-b border-navy-700/50 mb-6">
          <div className="relative flex-shrink-0">
            <div className="w-24 h-24 rounded-2xl bg-navy-700 border-2 border-navy-600 overflow-hidden flex items-center justify-center">
              {previewUrl ? (
                <img src={previewUrl} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                <span className="font-display text-4xl font-bold text-brass-400">
                  {user?.FullName?.charAt(0)}
                </span>
              )}
            </div>
            <button
              onClick={() => fileRef.current?.click()}
              className="absolute -bottom-2 -right-2 w-8 h-8 rounded-full bg-brass-500 border-2 border-navy-900 flex items-center justify-center hover:bg-brass-400 transition-colors"
            >
              <Camera size={13} className="text-navy-900" />
            </button>
            <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handlePhoto} />
          </div>

          <div>
            <h2 className="font-display text-xl font-bold text-white">{user?.FullName}</h2>
            <p className="text-navy-400 text-sm mt-0.5">{user?.Email}</p>
            <div className={`inline-flex items-center gap-1.5 mt-2 px-3 py-1 rounded-full text-xs font-semibold border ${rc.bg} ${rc.color} ${rc.border}`}>
              <Shield size={11} />
              {role}
            </div>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="form-label flex items-center gap-1.5">
                <User size={12} className="text-navy-500" /> Full Name
              </label>
              <input
                {...register('FullName', { required: 'Name is required', minLength: { value: 2, message: 'Min 2 chars' } })}
                className={`form-input ${errors.FullName ? 'error' : ''}`}
              />
              {errors.FullName && <p className="text-xs text-brick-400 mt-1">{errors.FullName.message}</p>}
            </div>

            <div>
              <label className="form-label flex items-center gap-1.5">
                <Mail size={12} className="text-navy-500" /> Email Address
              </label>
              <input
                {...register('Email', {
                  required: 'Email required',
                  pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: 'Invalid email' },
                })}
                type="email"
                className={`form-input ${errors.Email ? 'error' : ''}`}
              />
              {errors.Email && <p className="text-xs text-brick-400 mt-1">{errors.Email.message}</p>}
            </div>

            <div>
              <label className="form-label flex items-center gap-1.5">
                <Phone size={12} className="text-navy-500" /> Mobile Number
              </label>
              <input
                {...register('MobileNumber', { pattern: { value: /^[0-9]{10}$/, message: '10 digits required' } })}
                className={`form-input font-mono ${errors.MobileNumber ? 'error' : ''}`}
                placeholder="9876543210"
              />
              {errors.MobileNumber && <p className="text-xs text-brick-400 mt-1">{errors.MobileNumber.message}</p>}
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button type="submit" className="btn-primary" disabled={saving || !isDirty}>
              <Save size={15} />
              {saving ? 'Saving…' : 'Save Changes'}
            </button>
          </div>
        </form>
      </motion.div>

      {/* Account info card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
        className="glass-card p-6"
      >
        <h3 className="font-display text-base font-semibold text-white mb-4">Account Information</h3>
        <div className="grid grid-cols-2 gap-4 text-sm">
          {[
            { label: 'User ID',   value: `#${user?.UserId}` },
            { label: 'Role',      value: role },
            { label: 'Status',    value: user?.IsActive ? 'Active' : 'Inactive' },
            { label: 'Account',   value: 'Standard' },
          ].map(({ label, value }) => (
            <div key={label} className="p-3 rounded-xl bg-navy-800/40">
              <p className="text-2xs text-navy-500 uppercase tracking-wider">{label}</p>
              <p className="text-white font-medium mt-0.5 font-mono">{value}</p>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
