import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { Plus, Users, ToggleLeft, ToggleRight } from 'lucide-react';
import { userService } from '../../services/userService';
import DataTable from '../../components/common/DataTable';
import Modal from '../../components/common/Modal';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import UserForm from '../../components/forms/UserForm';

export default function UserListPage() {
  const [users, setUsers]           = useState([]);
  const [loading, setLoading]       = useState(true);
  const [modalOpen, setModalOpen]   = useState(false);
  const [editTarget, setEditTarget] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [saving, setSaving]         = useState(false);
  const [deleting, setDeleting]     = useState(false);

  const load = () => userService.getAll().then(setUsers).finally(() => setLoading(false));
  useEffect(() => { load(); }, []);

  const openAdd  = () => { setEditTarget(null); setModalOpen(true); };
  const openEdit = (row) => { setEditTarget(row); setModalOpen(true); };

  const handleSave = async (data) => {
    setSaving(true);
    try {
      if (editTarget) {
        await userService.update(editTarget.UserId, data);
        toast.success('User updated');
      } else {
        await userService.create(data);
        toast.success('User created');
      }
      setModalOpen(false); load();
    } catch (err) { toast.error(err.message); }
    finally { setSaving(false); }
  };

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await userService.softDelete(deleteTarget.UserId);
      toast.success('User deactivated and removed');
      setDeleteTarget(null); load();
    } catch (err) { toast.error(err.message); }
    finally { setDeleting(false); }
  };

  const handleToggleActive = async (row) => {
    try {
      await userService.toggleActive(row.UserId);
      toast.success(row.IsActive ? 'User deactivated' : 'User activated');
      load();
    } catch (err) { toast.error(err.message); }
  };

  const columns = [
    { key: 'UserId', label: '#', sortable: true, render: r => (
      <span className="font-mono text-xs" style={{ color: 'var(--text-faint)' }}>#{r.UserId}</span>
    )},
    { key: 'FullName', label: 'Name', sortable: true, render: r => (
      <div className="flex items-center gap-2">
        <div className="w-7 h-7 rounded-full bg-brass-500/20 border border-brass-500/30 flex items-center justify-center flex-shrink-0">
          <span className="text-xs font-bold text-brass-400">{r.FullName?.charAt(0)}</span>
        </div>
        <span className="font-medium" style={{ color: 'var(--text-primary)' }}>{r.FullName}</span>
      </div>
    )},
    { key: 'Email', label: 'Email', sortable: true, render: r => (
      <span style={{ color: 'var(--text-secondary)' }}>{r.Email}</span>
    )},
    { key: 'MobileNumber', label: 'Mobile', render: r => (
      <span className="font-mono text-sm" style={{ color: 'var(--text-muted)' }}>{r.MobileNumber || '—'}</span>
    )},
    { key: 'IsActive', label: 'Status', render: r => (
      <span className={`badge border ${r.IsActive ? 'bg-sage-600/15 text-sage-500 border-sage-600/30' : 'bg-brick-600/15 text-brick-400 border-brick-600/30'}`}>
        <span className={`w-1.5 h-1.5 rounded-full ${r.IsActive ? 'bg-sage-500' : 'bg-brick-500'}`} />
        {r.IsActive ? 'Active' : 'Inactive'}
      </span>
    )},
  ];

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-display text-3xl font-bold flex items-center gap-2" style={{ color: 'var(--text-heading)' }}>
            <Users size={24} className="text-brass-400" /> User Management
          </h1>
          <p className="mt-1 text-sm" style={{ color: 'var(--text-muted)' }}>Manage system users and account status</p>
        </div>
        <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={openAdd} className="btn-primary">
          <Plus size={16} /> Add User
        </motion.button>
      </div>

      <DataTable
        columns={columns}
        data={users}
        loading={loading}
        searchKeys={['FullName', 'Email', 'MobileNumber']}
        filters={[{
          key: 'IsActive',
          label: 'All Statuses',
          options: [{ value: 'true', label: 'Active' }, { value: 'false', label: 'Inactive' }],
        }]}
        emptyTitle="No users found"
        actions={{
          onView: (row) => window.location.assign(`/users/${row.UserId}`),
          onEdit: openEdit,
          onDelete: setDeleteTarget,
          extra: [{
            icon: (row) => row.IsActive
              ? <ToggleRight size={15} className="text-sage-500" />
              : <ToggleLeft size={15} />,
            label: 'Toggle Active',
            onClick: handleToggleActive,
            color: 'hover:text-sage-500',
          }],
        }}
      />

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editTarget ? 'Edit User' : 'Add New User'} size="lg">
        <UserForm
          defaultValues={editTarget || { FullName: '', Email: '', Password: '', MobileNumber: '' }}
          onSubmit={handleSave}
          loading={saving}
          isEdit={Boolean(editTarget)}
        />
      </Modal>

      <ConfirmDialog
        open={Boolean(deleteTarget)}
        onCancel={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        loading={deleting}
        title="Delete User"
        message={`This will permanently deactivate and hide "${deleteTarget?.FullName}". Their data will be retained. Continue?`}
      />
    </div>
  );
}
