import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { BarChart3, Download, User, BookOpen } from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell,
} from 'recharts';
import { projectService } from '../../services/projectService';
import { taskService } from '../../services/taskService';
import { userService } from '../../services/userService';
import { mockUserRoles, mockRoles } from '../../data/mockData';
import ProgressBar from '../../components/common/ProgressBar';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const COLORS = ['#B8943F', '#0D9488', '#6B9C78', '#B45309', '#D97706'];

function getRole(userId) {
  const ur = mockUserRoles.find(u => u.UserId === userId);
  if (!ur) return null;
  return mockRoles.find(r => r.RoleId === ur.RoleId)?.RoleName;
}

function exportCSV(data, filename) {
  if (!data.length) return;
  const keys = Object.keys(data[0]);
  const csv  = [keys.join(','), ...data.map(r => keys.map(k => `"${r[k] ?? ''}"`).join(','))].join('\n');
  const blob = new Blob([csv], { type: 'text/csv' });
  const url  = URL.createObjectURL(blob);
  const a    = document.createElement('a');
  a.href = url; a.download = filename; a.click();
  URL.revokeObjectURL(url);
}

export default function ReportsPage() {
  const [projects, setProjects] = useState([]);
  const [tasks, setTasks]       = useState([]);
  const [users, setUsers]       = useState([]);
  const [loading, setLoading]   = useState(true);

  useEffect(() => {
    Promise.all([
      projectService.getAllEnriched(),
      taskService.getAll(),
      userService.getAll(),
    ]).then(([p, t, u]) => {
      setProjects(p); setTasks(t); setUsers(u);
    }).finally(() => setLoading(false));
  }, []);

  if (loading) return <LoadingSpinner />;

  const students = users.filter(u => getRole(u.UserId) === 'Student');
  const faculty  = users.filter(u => getRole(u.UserId) === 'Faculty');

  const studentPerf = students.map(s => {
    const myProjects = projects.filter(p => p.StudentId === s.UserId);
    const myTasks    = tasks.filter(t => myProjects.map(p => p.ProjectId).includes(t.AllocationID));
    const earned     = myTasks.reduce((sum, t) => sum + (t.EarnedScore || 0), 0);
    const total      = myTasks.reduce((sum, t) => sum + (t.AssignedScore || 0), 0);
    const pct        = total > 0 ? Math.round((earned / total) * 100) : 0;
    return { name: s.FullName, projects: myProjects.length, tasks: myTasks.length, earned, total, pct };
  });

  const facultyPerf = faculty.map(f => {
    const myProjects = projects.filter(p => p.FacultyId === f.UserId);
    const completed  = myProjects.filter(p => p.ProjectStatus === 3).length;
    const avgProg    = myProjects.length > 0
      ? Math.round(myProjects.reduce((s, p) => s + p.ProgressPercentage, 0) / myProjects.length)
      : 0;
    return { name: f.FullName, supervised: myProjects.length, completed, avgProg };
  });

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-display text-3xl font-bold flex items-center gap-2" style={{ color: 'var(--text-heading)' }}>
            <BarChart3 size={24} className="text-brass-400" /> Reports
          </h1>
          <p className="mt-1 text-sm" style={{ color: 'var(--text-muted)' }}>System-wide performance analytics</p>
        </div>
      </div>

      {/* Student Performance */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-card p-6 mb-6">
        <div className="flex items-center justify-between mb-5">
          <h2 className="font-display text-lg font-semibold flex items-center gap-2" style={{ color: 'var(--text-heading)' }}>
            <User size={18} className="text-teal-400" /> Student Performance Summary
          </h2>
          <button onClick={() => exportCSV(studentPerf, 'student_performance.csv')} className="btn-secondary text-xs px-3 py-1.5">
            <Download size={13} /> Export CSV
          </button>
        </div>

        <div className="overflow-x-auto mb-6">
          <table className="w-full data-table">
            <thead>
              <tr>
                <th>Student</th>
                <th>Projects</th>
                <th>Tasks</th>
                <th>Score Earned</th>
                <th>Total Score</th>
                <th>Performance</th>
              </tr>
            </thead>
            <tbody>
              {studentPerf.map(s => (
                <tr key={s.name}>
                  <td className="font-medium" style={{ color: 'var(--text-primary)' }}>{s.name}</td>
                  <td className="font-mono">{s.projects}</td>
                  <td className="font-mono">{s.tasks}</td>
                  <td className="font-mono text-sage-500">{s.earned}</td>
                  <td className="font-mono" style={{ color: 'var(--text-muted)' }}>{s.total}</td>
                  <td className="w-32">
                    <ProgressBar value={s.pct} showLabel={false} size="sm" />
                    <span className="text-2xs font-mono" style={{ color: 'var(--text-faint)' }}>{s.pct}%</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={studentPerf} barSize={28}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--chart-grid)" />
            <XAxis dataKey="name" tick={{ fill: 'var(--chart-tick)', fontSize: 11 }} axisLine={false} tickLine={false}
              tickFormatter={n => n.split(' ')[0]} />
            <YAxis tick={{ fill: 'var(--chart-tick)', fontSize: 11 }} axisLine={false} tickLine={false} />
            <Tooltip contentStyle={{ background: 'var(--chart-tooltip-bg)', border: '1px solid var(--chart-tooltip-border)', borderRadius: 10, color: 'var(--chart-tooltip-text)', fontSize: 12 }} />
            <Bar dataKey="pct" name="Score %" radius={[6,6,0,0]}>
              {studentPerf.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </motion.div>

      {/* Faculty Supervision */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="glass-card p-6">
        <div className="flex items-center justify-between mb-5">
          <h2 className="font-display text-lg font-semibold flex items-center gap-2" style={{ color: 'var(--text-heading)' }}>
            <BookOpen size={18} className="text-brass-400" /> Faculty Supervision Summary
          </h2>
          <button onClick={() => exportCSV(facultyPerf, 'faculty_supervision.csv')} className="btn-secondary text-xs px-3 py-1.5">
            <Download size={13} /> Export CSV
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {facultyPerf.map((f, i) => (
            <div key={f.name} className="p-4 rounded-xl surface-card">
              <div className="flex items-center gap-3 mb-3">
                <div
                  className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ background: `${COLORS[i % COLORS.length]}20`, border: `1px solid ${COLORS[i % COLORS.length]}40` }}
                >
                  <span className="font-bold text-sm" style={{ color: COLORS[i % COLORS.length] }}>{f.name.charAt(0)}</span>
                </div>
                <p className="font-semibold text-sm" style={{ color: 'var(--text-primary)' }}>{f.name}</p>
              </div>
              <div className="grid grid-cols-3 gap-2 text-center">
                <div>
                  <p className="font-mono text-xl font-bold text-brass-400">{f.supervised}</p>
                  <p className="text-2xs" style={{ color: 'var(--text-faint)' }}>Projects</p>
                </div>
                <div>
                  <p className="font-mono text-xl font-bold text-sage-500">{f.completed}</p>
                  <p className="text-2xs" style={{ color: 'var(--text-faint)' }}>Completed</p>
                </div>
                <div>
                  <p className="font-mono text-xl font-bold text-teal-400">{f.avgProg}%</p>
                  <p className="text-2xs" style={{ color: 'var(--text-faint)' }}>Avg Progress</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
