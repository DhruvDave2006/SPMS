import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { Plus, Shield } from 'lucide-react';
import { roleService } from '../../services/roleService';
import DataTable from '../../components/common/DataTable';
import Modal from '../../components/common/Modal';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import RoleForm from '../../components/forms/RoleForm';

export default function RoleListPage() {
  const [roles, setRoles]         = useState([]);
  const [loading, setLoading]     = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editTarget, setEditTarget] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [saving, setSaving]       = useState(false);
  const [deleting, setDeleting]   = useState(false);

  const load = () => roleService.getAll().then(setRoles).finally(() => setLoading(false));
  useEffect(() => { load(); }, []);

  const openAdd  = () => { setEditTarget(null); setModalOpen(true); };
  const openEdit = (row) => { setEditTarget(row); setModalOpen(true); };

  const handleSave = async (data) => {
    setSaving(true);
    try {
      if (editTarget) {
        await roleService.update(editTarget.RoleId, data);
        toast.success('Role updated successfully');
      } else {
        await roleService.create(data);
        toast.success('Role created successfully');
      }
      setModalOpen(false);
      load();
    } catch (err) {
      toast.error(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await roleService.delete(deleteTarget.RoleId);
      toast.success('Role deleted');
      setDeleteTarget(null);
      load();
    } catch (err) {
      toast.error(err.message);
    } finally {
      setDeleting(false);
    }
  };

  const columns = [
    { key: 'RoleId',      label: 'ID',          sortable: true, render: r => (
      <span className="font-mono text-xs" style={{ color: 'var(--text-faint)' }}>#{r.RoleId}</span>
    )},
    { key: 'RoleName',    label: 'Role Name',   sortable: true, render: r => (
      <span className="font-semibold" style={{ color: 'var(--text-primary)' }}>{r.RoleName}</span>
    )},
    { key: 'Description', label: 'Description', render: r => (
      <span style={{ color: 'var(--text-secondary)' }}>{r.Description || '—'}</span>
    )},
  ];

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-display text-3xl font-bold flex items-center gap-2" style={{ color: 'var(--text-heading)' }}>
            <Shield size={24} className="text-brass-400" /> Role Management
          </h1>
          <p className="mt-1 text-sm" style={{ color: 'var(--text-muted)' }}>Define and manage system roles</p>
        </div>
        <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={openAdd} className="btn-primary">
          <Plus size={16} /> Add Role
        </motion.button>
      </div>

      <DataTable
        columns={columns}
        data={roles}
        loading={loading}
        searchKeys={['RoleName', 'Description']}
        emptyTitle="No roles found"
        emptyMessage="Add your first role to get started"
        actions={{ onEdit: openEdit, onDelete: setDeleteTarget }}
      />

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editTarget ? 'Edit Role' : 'Add New Role'}>
        <RoleForm
          defaultValues={editTarget || { RoleName: '', Description: '' }}
          onSubmit={handleSave}
          loading={saving}
        />
      </Modal>

      <ConfirmDialog
        open={Boolean(deleteTarget)}
        onCancel={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        loading={deleting}
        title="Delete Role"
        message={`Are you sure you want to delete the "${deleteTarget?.RoleName}" role? This action cannot be undone.`}
      />
    </div>
  );
}
