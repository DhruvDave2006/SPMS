import { useEffect, useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Canvas, useFrame } from '@react-three/fiber';
import { Box, MeshDistortMaterial, Float } from '@react-three/drei';
import { Link } from 'react-router-dom';
import {
  BarChart3, Users, FolderKanban, CheckSquare, TrendingUp, Clock, AlertCircle,
} from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend,
} from 'recharts';
import { projectService } from '../../services/projectService';
import { userService } from '../../services/userService';
import { taskService } from '../../services/taskService';
import { mockStatuses, mockPriorities } from '../../data/mockData';
import ProgressBar from '../../components/common/ProgressBar';
import Badge from '../../components/common/Badge';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { useTheme } from '../../context/ThemeContext';

// ── 3D Floating Geometry ────────────────────────────────────
function Floating3DBox({ position, color, speed }) {
  const ref = useRef();
  useFrame(({ clock }) => {
    ref.current.rotation.x = clock.getElapsedTime() * speed * 0.4;
    ref.current.rotation.y = clock.getElapsedTime() * speed * 0.6;
  });
  return (
    <Float speed={speed} floatIntensity={1}>
      <Box ref={ref} args={[1, 1, 1]} position={position}>
        <MeshDistortMaterial color={color} distort={0.3} speed={2} roughness={0.2} metalness={0.7} transparent opacity={0.12} />
      </Box>
    </Float>
  );
}

function Scene3D() {
  return (
    <>
      <ambientLight intensity={0.4} />
      <pointLight position={[5, 5, 5]} intensity={1.2} color="#B8943F" />
      <Floating3DBox position={[4, 2, -3]} color="#B8943F" speed={0.8} />
      <Floating3DBox position={[-4, -1, -2]} color="#0D9488" speed={1.1} />
    </>
  );
}

const STAT_COLORS = ['#B8943F', '#0D9488', '#6B9C78', '#B45309', '#D97706'];

const stagger = { hidden: {}, show: { transition: { staggerChildren: 0.08 } } };
const fadeUp  = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0, transition: { duration: 0.4 } } };

export default function AdminDashboard() {
  const { isDark } = useTheme();
  const [projects, setProjects] = useState([]);
  const [users, setUsers]       = useState([]);
  const [tasks, setTasks]       = useState([]);
  const [loading, setLoading]   = useState(true);

  useEffect(() => {
    Promise.all([
      projectService.getAllEnriched(),
      userService.getAll(),
      taskService.getAll(),
    ]).then(([p, u, t]) => {
      setProjects(p); setUsers(u); setTasks(t);
    }).finally(() => setLoading(false));
  }, []);

  if (loading) return <LoadingSpinner />;

  const activeProjects    = projects.filter(p => p.ProjectStatus === 2).length;
  const completedProjects = projects.filter(p => p.ProjectStatus === 3).length;
  const pendingTasks      = tasks.filter(t => t.TaskStatus === 1).length;
  const activeTasks       = tasks.filter(t => t.TaskStatus === 2).length;

  const projectStatusData = mockStatuses.map(s => ({
    name: s.StatusName,
    count: projects.filter(p => p.ProjectStatus === s.StatusID).length,
  })).filter(d => d.count > 0);

  const taskPriorityData = mockPriorities.map(p => ({
    name: p.PriorityName,
    value: tasks.filter(t => t.PriorityID === p.PriorityID).length,
  })).filter(d => d.value > 0);

  const today = new Date();
  const upcoming = projects
    .filter(p => p.ProjectStatus !== 3 && p.EndDate)
    .map(p => ({ ...p, daysLeft: Math.ceil((new Date(p.EndDate) - today) / 86400000) }))
    .filter(p => p.daysLeft <= 30 && p.daysLeft > 0)
    .sort((a, b) => a.daysLeft - b.daysLeft)
    .slice(0, 5);

  const stats = [
    { label: 'Total Projects',  value: projects.length,   icon: FolderKanban, color: 'text-brass-400',  bg: 'bg-brass-500/15' },
    { label: 'Active Projects', value: activeProjects,    icon: TrendingUp,   color: 'text-teal-400',   bg: 'bg-teal-600/15'  },
    { label: 'Completed',       value: completedProjects, icon: CheckSquare,  color: 'text-sage-500',   bg: 'bg-sage-600/15'  },
    { label: 'Pending Tasks',   value: pendingTasks,      icon: Clock,        color: 'text-amber-400',  bg: 'bg-amber-500/15' },
    { label: 'Active Tasks',    value: activeTasks,       icon: AlertCircle,  color: 'text-brick-400',  bg: 'bg-brick-600/15' },
    { label: 'Total Users',     value: users.length,      icon: Users,        color: 'text-navy-300',   bg: 'bg-navy-600/30'  },
  ];

  // Chart styles adapted to theme
  const chartTooltip = {
    contentStyle: {
      background: 'var(--chart-tooltip-bg)',
      border: '1px solid var(--chart-tooltip-border)',
      borderRadius: 10,
      color: 'var(--chart-tooltip-text)',
      fontSize: 13,
    },
    cursor: { fill: isDark ? 'rgba(255,255,255,0.03)' : 'rgba(27,42,74,0.04)' },
  };

  return (
    <div className="relative">
      {/* 3D hero accent */}
      <div className="absolute top-0 right-0 w-80 h-64 opacity-30 pointer-events-none -z-10">
        <Canvas camera={{ position: [0, 0, 5], fov: 60 }}><Scene3D /></Canvas>
      </div>

      {/* Page header */}
      <div className="mb-6">
        <h1 className="font-display text-3xl font-bold" style={{ color: 'var(--text-heading)' }}>Admin Dashboard</h1>
        <p className="mt-1 text-sm" style={{ color: 'var(--text-muted)' }}>
          System-wide overview — {new Date().toLocaleDateString('en-IN', { dateStyle: 'long' })}
        </p>
      </div>

      {/* Stat cards */}
      <motion.div variants={stagger} initial="hidden" animate="show" className="grid grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        {stats.map(({ label, value, icon: Icon, color, bg }) => (
          <motion.div key={label} variants={fadeUp} className="stat-card">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs uppercase tracking-wider font-semibold" style={{ color: 'var(--text-muted)' }}>{label}</p>
                <p className={`font-display text-4xl font-bold mt-2 ${color}`}>{value}</p>
              </div>
              <div className={`w-10 h-10 rounded-xl ${bg} flex items-center justify-center flex-shrink-0`}>
                <Icon size={18} className={color} />
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mb-6">
        {/* Bar chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
          className="glass-card p-6 xl:col-span-2"
        >
          <h2 className="font-display text-lg font-semibold mb-4 flex items-center gap-2" style={{ color: 'var(--text-heading)' }}>
            <BarChart3 size={18} className="text-brass-400" /> Project Status Distribution
          </h2>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={projectStatusData} barSize={32}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--chart-grid)" />
              <XAxis dataKey="name" tick={{ fill: 'var(--chart-tick)', fontSize: 12 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: 'var(--chart-tick)', fontSize: 12 }} axisLine={false} tickLine={false} allowDecimals={false} />
              <Tooltip {...chartTooltip} />
              <Bar dataKey="count" fill="#B8943F" radius={[6,6,0,0]} />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Pie chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
          className="glass-card p-6"
        >
          <h2 className="font-display text-lg font-semibold mb-4" style={{ color: 'var(--text-heading)' }}>Task Priority</h2>
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie data={taskPriorityData} cx="50%" cy="50%" innerRadius={55} outerRadius={80} paddingAngle={4} dataKey="value">
                {taskPriorityData.map((_, idx) => (
                  <Cell key={idx} fill={STAT_COLORS[idx]} />
                ))}
              </Pie>
              <Tooltip contentStyle={{ background: 'var(--chart-tooltip-bg)', border: '1px solid var(--chart-tooltip-border)', borderRadius: 10, color: 'var(--chart-tooltip-text)', fontSize: 13 }} />
              <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 12, color: 'var(--chart-tick)' }} />
            </PieChart>
          </ResponsiveContainer>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* Recent projects */}
        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
          className="glass-card p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-display text-lg font-semibold" style={{ color: 'var(--text-heading)' }}>Recent Projects</h2>
            <Link to="/projects" className="text-xs text-brass-400 hover:text-brass-300 transition-colors">View all →</Link>
          </div>
          <div className="space-y-4">
            {projects.slice(0, 5).map(project => (
              <div key={project.ProjectId} className="flex items-center gap-3">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate" style={{ color: 'var(--text-primary)' }}>{project.ProjectTitle}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge cssClass={project.Status?.StatusCssClass} label={project.Status?.StatusName} />
                    <span className="text-2xs font-mono" style={{ color: 'var(--text-faint)' }}>{project.ProgressPercentage}%</span>
                  </div>
                </div>
                <div className="w-20 flex-shrink-0">
                  <ProgressBar value={project.ProgressPercentage} showLabel={false} size="sm" />
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Upcoming deadlines */}
        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}
          className="glass-card p-6"
        >
          <h2 className="font-display text-lg font-semibold mb-4 flex items-center gap-2" style={{ color: 'var(--text-heading)' }}>
            <Clock size={18} className="text-amber-400" /> Upcoming Deadlines
          </h2>
          {upcoming.length === 0 ? (
            <p className="text-sm" style={{ color: 'var(--text-muted)' }}>No deadlines in the next 30 days.</p>
          ) : (
            <div className="space-y-3">
              {upcoming.map(p => (
                <div
                  key={p.ProjectId}
                  className="flex items-center gap-3 p-3 rounded-xl surface-card"
                >
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 font-mono font-bold text-sm
                    ${p.daysLeft <= 7 ? 'bg-brick-600/20 text-brick-400' : p.daysLeft <= 14 ? 'bg-amber-500/20 text-amber-400' : 'bg-navy-700/40 text-navy-300'}`}>
                    {p.daysLeft}d
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-medium truncate" style={{ color: 'var(--text-primary)' }}>{p.ProjectTitle}</p>
                    <p className="text-2xs" style={{ color: 'var(--text-faint)' }}>Due {new Date(p.EndDate).toLocaleDateString()}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
