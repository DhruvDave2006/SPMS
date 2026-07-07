import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { ArrowLeft, Plus, CheckSquare } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { taskService } from '../../services/taskService';
import { projectService } from '../../services/projectService';
import DataTable from '../../components/common/DataTable';
import Modal from '../../components/common/Modal';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import TaskForm from '../../components/forms/TaskForm';
import Badge from '../../components/common/Badge';
import ProgressBar from '../../components/common/ProgressBar';

export default function TaskListPage() {
  const { projectId } = useParams();
  const { role, user } = useAuth();
  const [tasks, setTasks]           = useState([]);
  const [project, setProject]       = useState(null);
  const [loading, setLoading]       = useState(true);
  const [modalOpen, setModalOpen]   = useState(false);
  const [editTarget, setEditTarget] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [saving, setSaving]         = useState(false);
  const [deleting, setDeleting]     = useState(false);

  const load = async () => {
    setLoading(true);
    const [t, p] = await Promise.all([
      taskService.getByProjectEnriched(Number(projectId)),
      projectService.getAllEnriched().then(list => list.find(pr => pr.ProjectId === Number(projectId))),
    ]);
    if ((role === 'Student' && p && p.StudentId !== user?.UserId) ||
        (role === 'Faculty' && p && p.FacultyId !== user?.UserId)) {
      setTasks([]);
      setProject(null);
    } else {
      setTasks(t);
      setProject(p || null);
    }
    setLoading(false);
  };
  useEffect(() => { load(); }, [projectId]);

  const openAdd  = () => { setEditTarget(null); setModalOpen(true); };
  const openEdit = (row) => { setEditTarget(row); setModalOpen(true); };

  const handleSave = async (data) => {
    setSaving(true);
    try {
      if (role === 'Student' || role === 'Faculty') {
        const proj = await projectService.getById(Number(projectId));
        if (!proj || 
            (role === 'Student' && proj.StudentId !== user?.UserId) ||
            (role === 'Faculty' && proj.FacultyId !== user?.UserId)) {
          toast.error("Unauthorized: You do not own/supervise this project.");
          return;
        }
      }
      if (editTarget) {
        await taskService.update(editTarget.TaskId, data);
        toast.success('Task updated');
      } else {
        await taskService.create({ ...data, AllocationID: Number(projectId) });
        toast.success('Task created');
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
      await taskService.softDelete(deleteTarget.TaskId);
      toast.success('Task removed');
      setDeleteTarget(null);
      load();
    } catch (err) {
      toast.error(err.message);
    } finally {
      setDeleting(false);
    }
  };

  const canManage = role === 'Admin' || role === 'Faculty';
  const isStudent = role === 'Student';

  const columns = [
    { key: 'TaskTitle', label: 'Task', sortable: true, render: r => (
      <div>
        <p className="font-medium" style={{ color: 'var(--text-primary)' }}>{r.TaskTitle}</p>
        <p className="text-2xs truncate max-w-[180px]" style={{ color: 'var(--text-faint)' }}>{r.TaskDescription}</p>
      </div>
    )},
    { key: 'TaskStatus', label: 'Status', render: r => <Badge cssClass={r.Status?.StatusCssClass} label={r.Status?.StatusName} /> },
    { key: 'PriorityID', label: 'Priority', render: r => <Badge cssClass={r.Priority?.PriortyCssClass} label={r.Priority?.PriorityName} /> },
    { key: 'AssignedScore', label: 'Score', render: r => (
      <span className="font-mono text-sm">
        <span className={r.EarnedScore > 0 ? 'text-sage-500' : ''} style={r.EarnedScore <= 0 ? { color: 'var(--text-muted)' } : {}}>{r.EarnedScore}</span>
        <span style={{ color: 'var(--text-faint)' }}>/{r.AssignedScore}</span>
      </span>
    )},
    { key: 'ProgressPercentage', label: 'Progress', render: r => (
      <div className="w-24"><ProgressBar value={r.ProgressPercentage} showLabel={false} size="sm" /></div>
    )},
    { key: 'DueDate', label: 'Due', sortable: true, render: r => (
      <span className="font-mono text-xs" style={{ color: 'var(--text-muted)' }}>
        {r.DueDate ? new Date(r.DueDate).toLocaleDateString() : '—'}
      </span>
    )},
  ];

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <Link
            to={`/projects/${projectId}`}
            className="inline-flex items-center gap-1.5 text-sm mb-1 transition-colors hover:text-brass-400"
            style={{ color: 'var(--text-muted)' }}
          >
            <ArrowLeft size={14} /> {project?.ProjectTitle || 'Project'}
          </Link>
          <h1 className="font-display text-3xl font-bold flex items-center gap-2" style={{ color: 'var(--text-heading)' }}>
            <CheckSquare size={22} className="text-brass-400" /> Task Management
          </h1>
        </div>
        {canManage && (
          <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={openAdd} className="btn-primary">
            <Plus size={16} /> Add Task
          </motion.button>
        )}
      </div>

      <DataTable
        columns={columns}
        data={tasks}
        loading={loading}
        searchKeys={['TaskTitle', 'TaskDescription']}
        emptyTitle="No tasks yet"
        emptyMessage={canManage ? "Click 'Add Task' to create the first task for this project." : "No tasks have been assigned yet."}
        actions={{
          onView: (row) => window.location.assign(`/projects/${projectId}/tasks/${row.TaskId}`),
          ...(canManage || isStudent ? { onEdit: openEdit } : {}),
          ...(canManage ? { onDelete: setDeleteTarget } : {}),
        }}
      />

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editTarget ? 'Edit Task' : 'Add Task'} size="lg">
        <TaskForm
          defaultValues={editTarget || { TaskTitle: '', TaskDescription: '', PriorityID: 1, TaskStatus: 1, StartDate: '', DueDate: '', AssignedScore: 10 }}
          onSubmit={handleSave}
          loading={saving}
          isEdit={Boolean(editTarget)}
          isStudent={isStudent}
        />
      </Modal>

      <ConfirmDialog
        open={Boolean(deleteTarget)}
        onCancel={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        loading={deleting}
        title="Remove Task"
        message={`Remove "${deleteTarget?.TaskTitle}"?`}
      />
    </div>
  );
}
