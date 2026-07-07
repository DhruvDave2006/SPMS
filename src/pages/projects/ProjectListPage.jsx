import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { Plus, FolderKanban } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { projectService } from '../../services/projectService';
import { statusService } from '../../services/statusService';
import DataTable from '../../components/common/DataTable';
import Modal from '../../components/common/Modal';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import ProjectForm from '../../components/forms/ProjectForm';
import Badge from '../../components/common/Badge';
import ProgressBar from '../../components/common/ProgressBar';

export default function ProjectListPage() {
  const { role, user } = useAuth();
  const [projects, setProjects]   = useState([]);
  const [statuses, setStatuses]   = useState([]);
  const [loading, setLoading]     = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editTarget, setEditTarget] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [saving, setSaving]       = useState(false);
  const [deleting, setDeleting]   = useState(false);

  const load = async () => {
    setLoading(true);
    let [p, s] = await Promise.all([projectService.getAllEnriched(), statusService.getAll()]);
    if (role === 'Student') {
      p = p.filter(proj => proj.StudentId === user?.UserId);
    } else if (role === 'Faculty') {
      p = p.filter(proj => proj.FacultyId === user?.UserId);
    }
    setProjects(p); setStatuses(s); setLoading(false);
  };
  useEffect(() => { load(); }, []);

  const openAdd  = () => { setEditTarget(null); setModalOpen(true); };
  const openEdit = (row) => { setEditTarget(row); setModalOpen(true); };

  const handleSave = async (data) => {
    setSaving(true);
    try {
      if (editTarget) {
        await projectService.update(editTarget.ProjectId, data);
        toast.success('Project updated');
      } else {
        await projectService.create(data);
        toast.success('Project created');
      }
      setModalOpen(false); load();
    } catch (err) { toast.error(err.message); }
    finally { setSaving(false); }
  };

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await projectService.softDelete(deleteTarget.ProjectId);
      toast.success('Project removed');
      setDeleteTarget(null); load();
    } catch (err) { toast.error(err.message); }
    finally { setDeleting(false); }
  };

  const columns = [
    { key: 'ProjectTitle', label: 'Project', sortable: true, render: r => (
      <div>
        <p className="font-semibold" style={{ color: 'var(--text-primary)' }}>{r.ProjectTitle}</p>
        <p className="text-2xs truncate max-w-[200px]" style={{ color: 'var(--text-faint)' }}>{r.Description}</p>
      </div>
    )},
    { key: 'Student', label: 'Student', sortable: true, render: r => (
      <span style={{ color: 'var(--text-secondary)' }}>{r.Student?.FullName || '—'}</span>
    )},
    { key: 'Faculty', label: 'Faculty', sortable: true, render: r => (
      <span style={{ color: 'var(--text-secondary)' }}>{r.Faculty?.FullName || '—'}</span>
    )},
    { key: 'ProjectStatus', label: 'Status', render: r => (
      <Badge cssClass={r.Status?.StatusCssClass} label={r.Status?.StatusName} />
    )},
    { key: 'ProgressPercentage', label: 'Progress', sortable: true, render: r => (
      <div className="w-28">
        <ProgressBar value={r.ProgressPercentage} showLabel={false} size="sm" />
        <p className="text-2xs text-right font-mono mt-0.5" style={{ color: 'var(--text-faint)' }}>{r.ProgressPercentage}%</p>
      </div>
    )},
    { key: 'EndDate', label: 'Deadline', sortable: true, render: r => (
      <span className="font-mono text-xs" style={{ color: 'var(--text-muted)' }}>
        {r.EndDate ? new Date(r.EndDate).toLocaleDateString() : '—'}
      </span>
    )},
  ];

  const canManage = role === 'Admin' || role === 'Faculty';

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-display text-3xl font-bold flex items-center gap-2" style={{ color: 'var(--text-heading)' }}>
            <FolderKanban size={24} className="text-brass-400" /> Projects
          </h1>
          <p className="mt-1 text-sm" style={{ color: 'var(--text-muted)' }}>
            {role === 'Student' ? 'Your assigned projects' : role === 'Faculty' ? 'Your supervised projects' : 'All academic projects'}
          </p>
        </div>
        {canManage && (
          <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={openAdd} className="btn-primary">
            <Plus size={16} /> New Project
          </motion.button>
        )}
      </div>

      <DataTable
        columns={columns}
        data={projects}
        loading={loading}
        searchKeys={['ProjectTitle', 'Description']}
        filters={[{
          key: 'ProjectStatus',
          label: 'All Statuses',
          options: statuses.map(s => ({ value: String(s.StatusID), label: s.StatusName })),
        }]}
        emptyTitle="No projects found"
        actions={{
          onView: (row) => window.location.assign(`/projects/${row.ProjectId}`),
          ...(canManage ? { onEdit: openEdit, onDelete: setDeleteTarget } : {}),
        }}
      />

      {canManage && (
        <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editTarget ? 'Edit Project' : 'New Project'} size="lg">
          <ProjectForm
            defaultValues={editTarget || { ProjectTitle: '', Description: '', StudentId: '', FacultyId: '', StartDate: '', EndDate: '', ProjectStatus: 1 }}
            onSubmit={handleSave}
            loading={saving}
            isEdit={Boolean(editTarget)}
          />
        </Modal>
      )}

      <ConfirmDialog
        open={Boolean(deleteTarget)}
        onCancel={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        loading={deleting}
        title="Remove Project"
        message={`Remove "${deleteTarget?.ProjectTitle}"? This will soft-delete the project and hide it from all users.`}
      />
    </div>
  );
}
