import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FolderKanban, CheckSquare, Clock, TrendingUp } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useAuth } from '../../context/AuthContext';
import { projectService } from '../../services/projectService';
import { taskService } from '../../services/taskService';
import ProgressBar from '../../components/common/ProgressBar';
import Badge from '../../components/common/Badge';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const stagger = { hidden: {}, show: { transition: { staggerChildren: 0.08 } } };
const fadeUp  = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0, transition: { duration: 0.4 } } };

export default function FacultyDashboard() {
  const { user } = useAuth();
  const [projects, setProjects] = useState([]);
  const [tasks, setTasks]       = useState([]);
  const [loading, setLoading]   = useState(true);

  useEffect(() => {
    if (!user) return;
    Promise.all([
      projectService.getAllEnriched(),
      taskService.getAll(),
    ]).then(([allProjects, allTasks]) => {
      const myProjects = allProjects.filter(p => p.FacultyId === user.UserId);
      setProjects(myProjects);
      const myProjectIds = myProjects.map(p => p.ProjectId);
      setTasks(allTasks.filter(t => myProjectIds.includes(t.AllocationID)));
    }).finally(() => setLoading(false));
  }, [user]);

  if (loading) return <LoadingSpinner />;

  const activeCount     = projects.filter(p => p.ProjectStatus === 2).length;
  const completedCount  = projects.filter(p => p.ProjectStatus === 3).length;
  const pendingTasks    = tasks.filter(t => t.TaskStatus === 1).length;

  const progressData = projects.map(p => ({
    name: p.ProjectTitle.split(' ').slice(0, 3).join(' '),
    progress: p.ProgressPercentage,
  }));

  const stats = [
    { label: 'My Projects',   value: projects.length, icon: FolderKanban, color: 'text-brass-400',  bg: 'bg-brass-500/15' },
    { label: 'Active',        value: activeCount,     icon: TrendingUp,   color: 'text-teal-400',   bg: 'bg-teal-600/15'  },
    { label: 'Completed',     value: completedCount,  icon: CheckSquare,  color: 'text-sage-500',   bg: 'bg-sage-600/15'  },
    { label: 'Pending Tasks', value: pendingTasks,    icon: Clock,        color: 'text-amber-400',  bg: 'bg-amber-500/15' },
  ];

  return (
    <div>
      <div className="mb-6">
        <h1 className="font-display text-3xl font-bold" style={{ color: 'var(--text-heading)' }}>
          Good {new Date().getHours() < 12 ? 'morning' : new Date().getHours() < 17 ? 'afternoon' : 'evening'},{' '}
          {user?.FullName?.split(' ')[0]}
        </h1>
        <p className="mt-1 text-sm" style={{ color: 'var(--text-muted)' }}>Here's your supervision overview</p>
      </div>

      <motion.div variants={stagger} initial="hidden" animate="show" className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map(({ label, value, icon: Icon, color, bg }) => (
          <motion.div key={label} variants={fadeUp} className="stat-card">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs uppercase tracking-wider font-semibold" style={{ color: 'var(--text-muted)' }}>{label}</p>
                <p className={`font-display text-4xl font-bold mt-2 ${color}`}>{value}</p>
              </div>
              <div className={`w-10 h-10 rounded-xl ${bg} flex items-center justify-center`}>
                <Icon size={18} className={color} />
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mb-6">
        {/* Project progress bars */}
        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
          className="glass-card p-6"
        >
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-display text-lg font-semibold" style={{ color: 'var(--text-heading)' }}>Project Progress</h2>
            <Link to="/projects" className="text-xs text-brass-400 hover:text-brass-300">View all →</Link>
          </div>
          <div className="space-y-5">
            {projects.map(p => (
              <div key={p.ProjectId}>
                <div className="flex items-center justify-between mb-1.5">
                  <p className="text-sm font-medium truncate max-w-[200px]" style={{ color: 'var(--text-primary)' }}>{p.ProjectTitle}</p>
                  <div className="flex items-center gap-2">
                    <Badge cssClass={p.Status?.StatusCssClass} label={p.Status?.StatusName} showDot={false} />
                  </div>
                </div>
                <ProgressBar value={p.ProgressPercentage} size="md" showLabel={false} />
                <p className="text-2xs mt-1 text-right font-mono" style={{ color: 'var(--text-faint)' }}>
                  {p.ProgressPercentage}% · {p.CompletedTasks}/{p.TotalTasks} tasks
                </p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Progress chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
          className="glass-card p-6"
        >
          <h2 className="font-display text-lg font-semibold mb-4" style={{ color: 'var(--text-heading)' }}>Completion Overview</h2>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={progressData} barSize={24} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="var(--chart-grid)" horizontal={false} />
              <XAxis type="number" domain={[0, 100]} tick={{ fill: 'var(--chart-tick)', fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={v => `${v}%`} />
              <YAxis type="category" dataKey="name" tick={{ fill: 'var(--chart-tick)', fontSize: 11 }} axisLine={false} tickLine={false} width={90} />
              <Tooltip
                contentStyle={{ background: 'var(--chart-tooltip-bg)', border: '1px solid var(--chart-tooltip-border)', borderRadius: 10, color: 'var(--chart-tooltip-text)', fontSize: 12 }}
                formatter={v => [`${v}%`, 'Progress']}
              />
              <Bar dataKey="progress" fill="#B8943F" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>
      </div>

      {/* Task breakdown */}
      <motion.div
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
        className="glass-card p-6"
      >
        <h2 className="font-display text-lg font-semibold mb-4" style={{ color: 'var(--text-heading)' }}>Task Breakdown by Project</h2>
        <div className="overflow-x-auto">
          <table className="w-full data-table">
            <thead>
              <tr>
                <th>Project</th>
                <th>Student</th>
                <th>Total Tasks</th>
                <th>Completed</th>
                <th>In Progress</th>
                <th>Progress</th>
              </tr>
            </thead>
            <tbody>
              {projects.map(p => {
                const pTasks    = tasks.filter(t => t.AllocationID === p.ProjectId);
                const completed = pTasks.filter(t => t.TaskStatus === 3).length;
                const inProg    = pTasks.filter(t => t.TaskStatus === 2).length;
                return (
                  <tr key={p.ProjectId}>
                    <td className="font-medium max-w-[180px]" style={{ color: 'var(--text-primary)' }}>
                      <span className="truncate block">{p.ProjectTitle}</span>
                    </td>
                    <td>{p.Student?.FullName || '—'}</td>
                    <td className="font-mono">{pTasks.length}</td>
                    <td><span className="text-sage-500 font-mono">{completed}</span></td>
                    <td><span className="text-teal-400 font-mono">{inProg}</span></td>
                    <td className="w-28"><ProgressBar value={p.ProgressPercentage} showLabel={false} size="sm" /></td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  );
}
