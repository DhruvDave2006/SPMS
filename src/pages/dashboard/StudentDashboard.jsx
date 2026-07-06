import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Torus, MeshDistortMaterial, Float } from '@react-three/drei';
import { FolderKanban, CheckSquare, Clock, Target } from 'lucide-react';
import { RadarChart, Radar, PolarGrid, PolarAngleAxis, ResponsiveContainer, Tooltip } from 'recharts';
import { useAuth } from '../../context/AuthContext';
import { projectService } from '../../services/projectService';
import { taskService } from '../../services/taskService';
import ProgressBar from '../../components/common/ProgressBar';
import Badge from '../../components/common/Badge';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { mockStatuses, mockPriorities } from '../../data/mockData';

function Torus3D() {
  const ref = useRef();
  useFrame(({ clock }) => {
    ref.current.rotation.x = clock.getElapsedTime() * 0.3;
    ref.current.rotation.y = clock.getElapsedTime() * 0.5;
  });
  return (
    <Float speed={1.5} floatIntensity={1}>
      <Torus ref={ref} args={[1.2, 0.35, 32, 64]} position={[0, 0, 0]}>
        <MeshDistortMaterial color="#B8943F" distort={0.25} speed={2} roughness={0.1} metalness={0.8} transparent opacity={0.2} />
      </Torus>
    </Float>
  );
}

export default function StudentDashboard() {
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
      const myProjects = allProjects.filter(p => p.StudentId === user.UserId);
      setProjects(myProjects);
      const myIds = myProjects.map(p => p.ProjectId);
      setTasks(allTasks.filter(t => myIds.includes(t.AllocationID)));
    }).finally(() => setLoading(false));
  }, [user]);

  if (loading) return <LoadingSpinner />;

  const completedTasks = tasks.filter(t => t.TaskStatus === 3);
  const pendingTasks   = tasks.filter(t => t.TaskStatus === 1);
  const inProgTasks    = tasks.filter(t => t.TaskStatus === 2);
  const totalEarned    = completedTasks.reduce((s, t) => s + (t.EarnedScore || 0), 0);
  const totalAssigned  = tasks.reduce((s, t) => s + (t.AssignedScore || 0), 0);

  const radarData = mockPriorities.map(p => ({
    subject: p.PriorityName,
    Tasks: tasks.filter(t => t.PriorityID === p.PriorityID).length,
    Done: tasks.filter(t => t.PriorityID === p.PriorityID && t.TaskStatus === 3).length,
  }));

  const stats = [
    { label: 'My Projects', value: projects.length,      icon: FolderKanban, color: 'text-brass-400', bg: 'bg-brass-500/15' },
    { label: 'Tasks Done',  value: completedTasks.length, icon: CheckSquare,  color: 'text-sage-500',  bg: 'bg-sage-600/15'  },
    { label: 'In Progress', value: inProgTasks.length,    icon: Target,       color: 'text-teal-400',  bg: 'bg-teal-600/15'  },
    { label: 'Pending',     value: pendingTasks.length,   icon: Clock,        color: 'text-amber-400', bg: 'bg-amber-500/15' },
  ];

  return (
    <div>
      {/* Hero banner */}
      <div className="relative glass-card p-6 mb-6 overflow-hidden">
        <div className="absolute right-4 top-0 w-32 h-32 opacity-40 pointer-events-none">
          <Canvas camera={{ position: [0, 0, 4], fov: 60 }}>
            <ambientLight intensity={0.4} />
            <pointLight position={[5, 5, 5]} color="#B8943F" intensity={1.5} />
            <Torus3D />
          </Canvas>
        </div>
        <div className="relative z-10">
          <p className="text-sm" style={{ color: 'var(--text-muted)' }}>Welcome back,</p>
          <h1 className="font-display text-3xl font-bold mt-0.5" style={{ color: 'var(--text-heading)' }}>{user?.FullName}</h1>
          <div className="flex items-center gap-4 mt-4">
            <div>
              <p className="text-2xs uppercase tracking-wide" style={{ color: 'var(--text-muted)' }}>Total Score</p>
              <p className="font-mono text-2xl font-bold text-brass-400">
                {totalEarned}<span className="text-sm" style={{ color: 'var(--text-muted)' }}>/{totalAssigned}</span>
              </p>
            </div>
            <div className="flex-1 max-w-xs">
              <p className="text-2xs mb-1" style={{ color: 'var(--text-muted)' }}>Overall Progress</p>
              <ProgressBar value={totalAssigned > 0 ? Math.round((totalEarned / totalAssigned) * 100) : 0} size="md" showLabel={false} />
            </div>
          </div>
        </div>
      </div>

      {/* Stat cards */}
      <motion.div
        initial="hidden" animate="show"
        variants={{ hidden: {}, show: { transition: { staggerChildren: 0.08 } } }}
        className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6"
      >
        {stats.map(({ label, value, icon: Icon, color, bg }) => (
          <motion.div
            key={label}
            variants={{ hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } }}
            className="stat-card"
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs uppercase tracking-wider font-semibold" style={{ color: 'var(--text-muted)' }}>{label}</p>
                <p className={`font-display text-3xl font-bold mt-2 ${color}`}>{value}</p>
              </div>
              <div className={`w-9 h-9 rounded-xl ${bg} flex items-center justify-center`}>
                <Icon size={16} className={color} />
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* My projects */}
        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
          className="glass-card p-6 xl:col-span-2"
        >
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-display text-lg font-semibold" style={{ color: 'var(--text-heading)' }}>My Projects</h2>
            <Link to="/projects" className="text-xs text-brass-400 hover:text-brass-300">View all →</Link>
          </div>
          <div className="space-y-4">
            {projects.map(p => (
              <Link
                key={p.ProjectId}
                to={`/projects/${p.ProjectId}`}
                className="block p-4 rounded-xl surface-card hover:border-brass-500/30 transition-all group"
              >
                <div className="flex items-start justify-between mb-2">
                  <p className="text-sm font-semibold group-hover:text-brass-400 transition-colors" style={{ color: 'var(--text-primary)' }}>
                    {p.ProjectTitle}
                  </p>
                  <Badge cssClass={p.Status?.StatusCssClass} label={p.Status?.StatusName} />
                </div>
                <p className="text-xs mb-3 line-clamp-1" style={{ color: 'var(--text-muted)' }}>{p.Description}</p>
                <ProgressBar value={p.ProgressPercentage} size="sm" showLabel={false} />
                <div className="flex justify-between mt-1">
                  <span className="text-2xs" style={{ color: 'var(--text-faint)' }}>Supervised by {p.Faculty?.FullName}</span>
                  <span className="text-2xs font-mono" style={{ color: 'var(--text-muted)' }}>{p.CompletedTasks}/{p.TotalTasks} tasks</span>
                </div>
              </Link>
            ))}
          </div>
        </motion.div>

        {/* Performance radar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
          className="glass-card p-6"
        >
          <h2 className="font-display text-lg font-semibold mb-4" style={{ color: 'var(--text-heading)' }}>Task Performance</h2>
          <ResponsiveContainer width="100%" height={220}>
            <RadarChart data={radarData}>
              <PolarGrid stroke="var(--chart-grid)" />
              <PolarAngleAxis dataKey="subject" tick={{ fill: 'var(--chart-tick)', fontSize: 12 }} />
              <Radar name="Assigned" dataKey="Tasks" stroke="#B8943F" fill="#B8943F" fillOpacity={0.15} />
              <Radar name="Completed" dataKey="Done" stroke="#6B9C78" fill="#6B9C78" fillOpacity={0.2} />
              <Tooltip contentStyle={{ background: 'var(--chart-tooltip-bg)', border: '1px solid var(--chart-tooltip-border)', borderRadius: 10, color: 'var(--chart-tooltip-text)', fontSize: 12 }} />
            </RadarChart>
          </ResponsiveContainer>

          <div className="mt-4">
            <p className="text-xs uppercase tracking-wide font-semibold mb-2" style={{ color: 'var(--text-muted)' }}>Next Due Tasks</p>
            {tasks
              .filter(t => t.TaskStatus !== 3 && t.DueDate)
              .sort((a, b) => new Date(a.DueDate) - new Date(b.DueDate))
              .slice(0, 3)
              .map(t => (
                <div key={t.TaskId} className="flex items-center gap-2 py-1.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-amber-400 flex-shrink-0" />
                  <p className="text-xs truncate flex-1" style={{ color: 'var(--text-secondary)' }}>{t.TaskTitle}</p>
                  <span className="text-2xs font-mono" style={{ color: 'var(--text-faint)' }}>
                    {new Date(t.DueDate).toLocaleDateString()}
                  </span>
                </div>
              ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
