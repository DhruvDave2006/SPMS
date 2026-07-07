import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { ArrowLeft, Calendar, Pencil, MessageSquare, Star } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { taskService } from '../../services/taskService';
import { statusService } from '../../services/statusService';
import { projectService } from '../../services/projectService';
import Badge from '../../components/common/Badge';
import ProgressBar from '../../components/common/ProgressBar';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import Modal from '../../components/common/Modal';
import TaskForm from '../../components/forms/TaskForm';

export default function TaskDetailPage() {
  const { projectId, id } = useParams();
  const { role, user } = useAuth();
  const [task, setTask]         = useState(null);
  const [statuses, setStatuses] = useState([]);
  const [loading, setLoading]   = useState(true);
  const [editOpen, setEditOpen] = useState(false);
  const [saving, setSaving]     = useState(false);

  const load = async () => {
    setLoading(true);
    const [t, s] = await Promise.all([
      taskService.getById(Number(id)),
      statusService.getAll(),
    ]);
    if (t) {
      const proj = await projectService.getById(t.AllocationID);
      if ((role === 'Student' && proj && proj.StudentId !== user?.UserId) ||
          (role === 'Faculty' && proj && proj.FacultyId !== user?.UserId)) {
        setTask(null);
      } else {
        const { mockStatuses, mockPriorities } = await import('../../data/mockData.js');
        t.Status   = mockStatuses.find(s => s.StatusID === t.TaskStatus);
        t.Priority = mockPriorities.find(p => p.PriorityID === t.PriorityID);
        setTask(t);
      }
    } else {
      setTask(null);
    }
    setStatuses(s);
    setLoading(false);
  };
  useEffect(() => { load(); }, [id]);

  const handleSave = async (data) => {
    setSaving(true);
    try {
      if (role === 'Student' || role === 'Faculty') {
        const proj = await projectService.getById(task.AllocationID);
        if (!proj || 
            (role === 'Student' && proj.StudentId !== user?.UserId) ||
            (role === 'Faculty' && proj.FacultyId !== user?.UserId)) {
          toast.error("Unauthorized: You do not own/supervise this project.");
          return;
        }
      }
      await taskService.update(Number(id), data);
      toast.success('Task updated');
      setEditOpen(false);
      load();
    } catch (err) {
      toast.error(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleStatusChange = async (e) => {
    const newStatus = Number(e.target.value);
    try {
      if (role === 'Student' || role === 'Faculty') {
        const proj = await projectService.getById(task.AllocationID);
        if (!proj || 
            (role === 'Student' && proj.StudentId !== user?.UserId) ||
            (role === 'Faculty' && proj.FacultyId !== user?.UserId)) {
          toast.error("Unauthorized: You do not own/supervise this project.");
          return;
        }
      }
      await taskService.updateStatus(Number(id), newStatus);
      toast.success('Status updated');
      load();
    } catch (err) {
      toast.error(err.message);
    }
  };

  if (loading) return <LoadingSpinner />;
  if (!task) return (
    <div className="text-center py-20" style={{ color: 'var(--text-muted)' }}>
      Task not found. <Link to={`/projects/${projectId}/tasks`} className="text-brass-400 hover:underline">← Back to tasks</Link>
    </div>
  );

  const isStudent  = role === 'Student';
  const canManage  = role === 'Admin' || role === 'Faculty';
  const scorePercent = task.AssignedScore > 0 ? Math.round((task.EarnedScore / task.AssignedScore) * 100) : 0;

  return (
    <div className="max-w-3xl">
      <div className="flex items-center justify-between mb-6">
        <Link
          to={`/projects/${projectId}/tasks`}
          className="inline-flex items-center gap-1.5 text-sm transition-colors hover:text-brass-400"
          style={{ color: 'var(--text-muted)' }}
        >
          <ArrowLeft size={14} /> All Tasks
        </Link>
        {(canManage || isStudent) && (
          <button onClick={() => setEditOpen(true)} className="btn-secondary">
            <Pencil size={14} /> Edit Task
          </button>
        )}
      </div>

      {/* Main card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
        className="glass-card p-6 mb-4"
      >
        <div className="flex flex-wrap items-start justify-between gap-3 mb-4">
          <h1 className="font-display text-2xl font-bold" style={{ color: 'var(--text-heading)' }}>{task.TaskTitle}</h1>
          <div className="flex items-center gap-2">
            <Badge cssClass={task.Priority?.PriortyCssClass} label={task.Priority?.PriorityName} />
            <Badge cssClass={task.Status?.StatusCssClass} label={task.Status?.StatusName} />
          </div>
        </div>

        {task.TaskDescription && (
          <p className="text-sm leading-relaxed mb-5" style={{ color: 'var(--text-secondary)' }}>{task.TaskDescription}</p>
        )}

        {/* Quick status change */}
        <div className="mb-5">
          <label className="form-label">Update Status</label>
          <select
            value={task.TaskStatus}
            onChange={handleStatusChange}
            className="form-input max-w-xs"
          >
            {statuses.map(s => <option key={s.StatusID} value={s.StatusID}>{s.StatusName}</option>)}
          </select>
        </div>

        {/* Progress */}
        <ProgressBar value={task.ProgressPercentage} size="md" />

        {/* Meta */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-5">
          {[
            { icon: Calendar, label: 'Start',     value: task.StartDate ? new Date(task.StartDate).toLocaleDateString() : '—' },
            { icon: Calendar, label: 'Due',       value: task.DueDate   ? new Date(task.DueDate).toLocaleDateString()   : '—' },
            { icon: Calendar, label: 'Completed', value: task.CompletedDate ? new Date(task.CompletedDate).toLocaleDateString() : '—' },
            { icon: Star,     label: 'Score',     value: `${task.EarnedScore}/${task.AssignedScore}` },
          ].map(({ icon: Icon, label, value }) => (
            <div key={label} className="p-3 rounded-xl surface-card">
              <div className="flex items-center gap-1.5 mb-0.5">
                <Icon size={11} className="text-brass-400" />
                <p className="text-2xs uppercase tracking-wider" style={{ color: 'var(--text-faint)' }}>{label}</p>
              </div>
              <p className="text-sm font-medium font-mono" style={{ color: 'var(--text-primary)' }}>{value}</p>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Remarks */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {(canManage || isStudent) && (
          <motion.div
            initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
            className="glass-card p-5"
          >
            <h3 className="font-display text-sm font-semibold flex items-center gap-2 mb-3" style={{ color: 'var(--text-heading)' }}>
              <MessageSquare size={14} className="text-teal-400" />
              {isStudent ? 'My Remarks' : 'Student Remarks'}
            </h3>
            <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
              {task.StudentRemarks || <span className="italic" style={{ color: 'var(--text-faint)' }}>No student remarks yet.</span>}
            </p>
          </motion.div>
        )}

        {(canManage) && (
          <motion.div
            initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
            className="glass-card p-5"
          >
            <h3 className="font-display text-sm font-semibold flex items-center gap-2 mb-3" style={{ color: 'var(--text-heading)' }}>
              <MessageSquare size={14} className="text-brass-400" />
              Faculty Remarks
            </h3>
            <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
              {task.FacultyRemarks || <span className="italic" style={{ color: 'var(--text-faint)' }}>No faculty remarks yet.</span>}
            </p>
          </motion.div>
        )}

        {isStudent && task.FacultyRemarks && (
          <motion.div
            initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
            className="glass-card p-5 border-l-2 border-brass-500/50"
          >
            <h3 className="font-display text-sm font-semibold text-brass-400 flex items-center gap-2 mb-3">
              <MessageSquare size={14} /> Faculty Feedback
            </h3>
            <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{task.FacultyRemarks}</p>
          </motion.div>
        )}
      </div>

      {(canManage || isStudent) && (
        <Modal open={editOpen} onClose={() => setEditOpen(false)} title="Edit Task" size="lg">
          <TaskForm
            defaultValues={task}
            onSubmit={handleSave}
            loading={saving}
            isEdit
            isStudent={isStudent}
          />
        </Modal>
      )}
    </div>
  );
}
