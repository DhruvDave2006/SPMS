import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Calendar, User, CheckSquare, Pencil } from 'lucide-react';
import { projectService } from '../../services/projectService';
import { taskService } from '../../services/taskService';
import { useAuth } from '../../context/AuthContext';
import Badge from '../../components/common/Badge';
import ProgressBar from '../../components/common/ProgressBar';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import Modal from '../../components/common/Modal';
import ProjectForm from '../../components/forms/ProjectForm';
import toast from 'react-hot-toast';

export default function ProjectDetailPage() {
  const { id } = useParams();
  const { role, user } = useAuth();
  const [project, setProject] = useState(null);
  const [tasks, setTasks]     = useState([]);
  const [loading, setLoading] = useState(true);
  const [editOpen, setEditOpen] = useState(false);
  const [saving, setSaving]   = useState(false);

  const load = async () => {
    setLoading(true);
    const [p, t] = await Promise.all([
      projectService.getAllEnriched().then(list => list.find(pr => pr.ProjectId === Number(id))),
      taskService.getByProjectEnriched(Number(id)),
    ]);
    if ((role === 'Student' && p && p.StudentId !== user?.UserId) ||
        (role === 'Faculty' && p && p.FacultyId !== user?.UserId)) {
      setProject(null);
      setTasks([]);
    } else {
      setProject(p || null);
      setTasks(t);
    }
    setLoading(false);
  };
  useEffect(() => { load(); }, [id]);

  const handleSave = async (data) => {
    setSaving(true);
    try {
      await projectService.update(Number(id), data);
      toast.success('Project updated');
      setEditOpen(false);
      load();
    } catch (err) {
      toast.error(err.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <LoadingSpinner />;
  if (!project) return (
    <div className="text-center py-20">
      <p style={{ color: 'var(--text-muted)' }}>Project not found.</p>
      <Link to="/projects" className="btn-secondary mt-4 inline-flex">← Projects</Link>
    </div>
  );

  const completedT = tasks.filter(t => t.TaskStatus === 3).length;
  const inProgT    = tasks.filter(t => t.TaskStatus === 2).length;
  const pendingT   = tasks.filter(t => t.TaskStatus === 1).length;
  const canManage  = role === 'Admin' || role === 'Faculty';

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <Link
          to="/projects"
          className="inline-flex items-center gap-1.5 text-sm transition-colors hover:text-brass-400"
          style={{ color: 'var(--text-muted)' }}
        >
          <ArrowLeft size={15} /> {role === 'Student' ? 'My Projects' : role === 'Faculty' ? 'Supervised Projects' : 'All Projects'}
        </Link>
        {canManage && (
          <button onClick={() => setEditOpen(true)} className="btn-secondary">
            <Pencil size={14} /> Edit Project
          </button>
        )}
      </div>

      {/* Project header */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-card p-6 mb-6">
        <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
          <div>
            <h1 className="font-display text-2xl font-bold" style={{ color: 'var(--text-heading)' }}>{project.ProjectTitle}</h1>
            <p className="mt-1 max-w-xl" style={{ color: 'var(--text-muted)' }}>{project.Description}</p>
          </div>
          <Badge cssClass={project.Status?.StatusCssClass} label={project.Status?.StatusName} />
        </div>

        <div className="mb-6">
          <ProgressBar value={project.ProgressPercentage} size="lg" />
        </div>

        {/* Meta grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { icon: User,     label: 'Student',  value: project.Student?.FullName },
            { icon: User,     label: 'Faculty',  value: project.Faculty?.FullName },
            { icon: Calendar, label: 'Start',    value: project.StartDate ? new Date(project.StartDate).toLocaleDateString() : '—' },
            { icon: Calendar, label: 'Deadline', value: project.EndDate   ? new Date(project.EndDate).toLocaleDateString()   : '—' },
          ].map(({ icon: Icon, label, value }) => (
            <div key={label} className="p-3 rounded-xl surface-card">
              <div className="flex items-center gap-1.5 mb-1">
                <Icon size={12} className="text-brass-400" />
                <p className="text-2xs uppercase tracking-wider" style={{ color: 'var(--text-faint)' }}>{label}</p>
              </div>
              <p className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>{value}</p>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Task summary */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        {[
          { label: 'Completed',   value: completedT, color: 'text-sage-500',  bg: 'bg-sage-600/15'  },
          { label: 'In Progress', value: inProgT,    color: 'text-teal-400',  bg: 'bg-teal-600/15'  },
          { label: 'Pending',     value: pendingT,   color: 'text-amber-400', bg: 'bg-amber-500/15' },
        ].map(({ label, value, color }) => (
          <motion.div
            key={label}
            initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
            className="glass-card p-4 text-center"
          >
            <p className={`font-display text-3xl font-bold ${color}`}>{value}</p>
            <p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>{label}</p>
          </motion.div>
        ))}
      </div>

      {/* Task list */}
      <motion.div
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
        className="glass-card p-6"
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-display text-lg font-semibold flex items-center gap-2" style={{ color: 'var(--text-heading)' }}>
            <CheckSquare size={18} className="text-brass-400" /> Tasks
          </h2>
          <Link to={`/projects/${id}/tasks`} className="text-xs text-brass-400 hover:text-brass-300 transition-colors">
            Manage tasks →
          </Link>
        </div>

        {tasks.length === 0 ? (
          <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
            No tasks yet.{' '}
            <Link to={`/projects/${id}/tasks`} className="text-brass-400 hover:underline">Add the first task →</Link>
          </p>
        ) : (
          <div className="space-y-2">
            {tasks.map(t => (
              <Link
                key={t.TaskId}
                to={`/projects/${id}/tasks/${t.TaskId}`}
                className="flex items-center gap-3 p-3 rounded-xl transition-all surface-card hover:border-brass-500/30"
              >
                <div className="w-2 h-2 rounded-full bg-brass-500/50 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate" style={{ color: 'var(--text-primary)' }}>{t.TaskTitle}</p>
                  <p className="text-2xs" style={{ color: 'var(--text-faint)' }}>
                    Due {t.DueDate ? new Date(t.DueDate).toLocaleDateString() : '—'}
                  </p>
                </div>
                <Badge cssClass={t.Status?.StatusCssClass} label={t.Status?.StatusName} showDot={false} />
                <Badge cssClass={t.Priority?.PriortyCssClass} label={t.Priority?.PriorityName} showDot={false} />
              </Link>
            ))}
          </div>
        )}
      </motion.div>

      {canManage && (
        <Modal open={editOpen} onClose={() => setEditOpen(false)} title="Edit Project" size="lg">
          <ProjectForm defaultValues={project} onSubmit={handleSave} loading={saving} isEdit />
        </Modal>
      )}
    </div>
  );
}
