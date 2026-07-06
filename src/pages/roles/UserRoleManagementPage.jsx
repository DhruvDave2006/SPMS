import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { Plus, UserCheck, Trash2 } from 'lucide-react';
import { userRoleService } from '../../services/userRoleService';
import { userService } from '../../services/userService';
import { roleService } from '../../services/roleService';
import DataTable from '../../components/common/DataTable';
import Modal from '../../components/common/Modal';
import ConfirmDialog from '../../components/common/ConfirmDialog';

export default function UserRoleManagementPage() {
  const [assignments, setAssignments] = useState([]);
  const [users, setUsers]             = useState([]);
  const [roles, setRoles]             = useState([]);
  const [loading, setLoading]         = useState(true);
  const [modalOpen, setModalOpen]     = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [form, setForm]               = useState({ userId: '', roleId: '' });
  const [saving, setSaving]           = useState(false);
  const [deleting, setDeleting]       = useState(false);

  const load = async () => {
    setLoading(true);
    const [a, u, r] = await Promise.all([
      userRoleService.getAllEnriched(),
      userService.getAll(),
      roleService.getAll(),
    ]);
    setAssignments(a);
    setUsers(u);
    setRoles(r);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const handleAssign = async (e) => {
    e.preventDefault();
    if (!form.userId || !form.roleId) { toast.error('Select both a user and a role.'); return; }
    setSaving(true);
    try {
      await userRoleService.assign(Number(form.roleId), Number(form.userId));
      toast.success('Role assigned successfully');
      setModalOpen(false);
      setForm({ userId: '', roleId: '' });
      load();
    } catch (err) {
      toast.error(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleRevoke = async () => {
    setDeleting(true);
    try {
      await userRoleService.revoke(deleteTarget.RolePermissionId);
      toast.success('Role revoked');
      setDeleteTarget(null);
      load();
    } catch (err) {
      toast.error(err.message);
    } finally {
      setDeleting(false);
    }
  };

  const columns = [
    { key: 'RolePermissionId', label: '#', render: r => <span className="font-mono text-navy-400">#{r.RolePermissionId}</span> },
    { key: 'User', label: 'User', sortable: true, render: r => (
      <div>
        <p className="font-medium text-white">{r.User?.FullName}</p>
        <p className="text-2xs text-navy-500">{r.User?.Email}</p>
      </div>
    )},
    { key: 'Role', label: 'Assigned Role', sortable: true, render: r => (
      <span className="px-2.5 py-1 rounded-lg bg-brass-500/15 text-brass-400 text-xs font-semibold border border-brass-500/30">
        {r.Role?.RoleName}
      </span>
    )},
  ];

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-display text-3xl font-bold text-white flex items-center gap-2">
            <UserCheck size={24} className="text-brass-400" /> Role Assignment
          </h1>
          <p className="text-navy-400 mt-1 text-sm">Assign and manage user roles</p>
        </div>
        <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={() => setModalOpen(true)} className="btn-primary">
          <Plus size={16} /> Assign Role
        </motion.button>
      </div>

      <DataTable
        columns={columns}
        data={assignments}
        loading={loading}
        searchKeys={[]}
        emptyTitle="No role assignments"
        actions={{ onDelete: setDeleteTarget }}
      />

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title="Assign Role to User" size="sm">
        <form onSubmit={handleAssign} className="space-y-4">
          <div>
            <label className="form-label">User</label>
            <select
              value={form.userId}
              onChange={e => setForm(f => ({ ...f, userId: e.target.value }))}
              className="form-input"
            >
              <option value="">— Select User —</option>
              {users.map(u => <option key={u.UserId} value={u.UserId}>{u.FullName}</option>)}
            </select>
          </div>
          <div>
            <label className="form-label">Role</label>
            <select
              value={form.roleId}
              onChange={e => setForm(f => ({ ...f, roleId: e.target.value }))}
              className="form-input"
            >
              <option value="">— Select Role —</option>
              {roles.map(r => <option key={r.RoleId} value={r.RoleId}>{r.RoleName}</option>)}
            </select>
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={() => setModalOpen(false)} className="btn-secondary">Cancel</button>
            <button type="submit" className="btn-primary" disabled={saving}>
              {saving ? 'Assigning…' : 'Assign Role'}
            </button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog
        open={Boolean(deleteTarget)}
        onCancel={() => setDeleteTarget(null)}
        onConfirm={handleRevoke}
        loading={deleting}
        title="Revoke Role"
        confirmLabel="Revoke"
        message={`Revoke the ${deleteTarget?.Role?.RoleName} role from ${deleteTarget?.User?.FullName}?`}
      />
    </div>
  );
}
