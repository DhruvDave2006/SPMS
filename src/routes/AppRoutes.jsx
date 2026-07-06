import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

// Lazy page imports
import LoginPage from '../pages/auth/LoginPage';
import AdminDashboard from '../pages/dashboard/AdminDashboard';
import FacultyDashboard from '../pages/dashboard/FacultyDashboard';
import StudentDashboard from '../pages/dashboard/StudentDashboard';
import ProfilePage from '../pages/profile/ProfilePage';
import RoleListPage from '../pages/roles/RoleListPage';
import UserRoleManagementPage from '../pages/roles/UserRoleManagementPage';
import UserListPage from '../pages/users/UserListPage';
import UserProfilePage from '../pages/users/UserProfilePage';
import ProjectListPage from '../pages/projects/ProjectListPage';
import ProjectDetailPage from '../pages/projects/ProjectDetailPage';
import TaskListPage from '../pages/tasks/TaskListPage';
import TaskDetailPage from '../pages/tasks/TaskDetailPage';
import ReportsPage from '../pages/reports/ReportsPage';
import NotFoundPage from '../pages/NotFoundPage';
import UnauthorizedPage from '../pages/UnauthorizedPage';
import DashboardLayout from '../components/layout/DashboardLayout';

// ── Guards ─────────────────────────────────────────────────
function ProtectedRoute({ children }) {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? children : <Navigate to="/login" replace />;
}

function RoleBasedRoute({ children, roles }) {
  const { isAuthenticated, role } = useAuth();
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (!roles.includes(role)) return <Navigate to="/unauthorized" replace />;
  return children;
}

function DashboardRedirect() {
  const { role } = useAuth();
  if (role === 'Admin') return <Navigate to="/dashboard/admin" replace />;
  if (role === 'Faculty') return <Navigate to="/dashboard/faculty" replace />;
  if (role === 'Student') return <Navigate to="/dashboard/student" replace />;
  return <Navigate to="/login" replace />;
}

// ── Route tree ─────────────────────────────────────────────
export default function AppRoutes() {
  return (
    <Routes>
      {/* Public */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/unauthorized" element={<UnauthorizedPage />} />

      {/* Protected — inside DashboardLayout */}
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<DashboardRedirect />} />
        <Route path="dashboard">
          <Route path="admin"   element={<RoleBasedRoute roles={['Admin']}><AdminDashboard /></RoleBasedRoute>} />
          <Route path="faculty" element={<RoleBasedRoute roles={['Faculty']}><FacultyDashboard /></RoleBasedRoute>} />
          <Route path="student" element={<RoleBasedRoute roles={['Student']}><StudentDashboard /></RoleBasedRoute>} />
        </Route>

        <Route path="profile" element={<ProfilePage />} />

        {/* Admin only */}
        <Route path="roles"        element={<RoleBasedRoute roles={['Admin']}><RoleListPage /></RoleBasedRoute>} />
        <Route path="user-roles"   element={<RoleBasedRoute roles={['Admin']}><UserRoleManagementPage /></RoleBasedRoute>} />
        <Route path="users"        element={<RoleBasedRoute roles={['Admin']}><UserListPage /></RoleBasedRoute>} />
        <Route path="users/:id"    element={<RoleBasedRoute roles={['Admin']}><UserProfilePage /></RoleBasedRoute>} />

        {/* Projects — Admin + Faculty */}
        <Route path="projects"     element={<RoleBasedRoute roles={['Admin','Faculty','Student']}><ProjectListPage /></RoleBasedRoute>} />
        <Route path="projects/:id" element={<RoleBasedRoute roles={['Admin','Faculty','Student']}><ProjectDetailPage /></RoleBasedRoute>} />

        {/* Tasks */}
        <Route path="projects/:projectId/tasks"     element={<RoleBasedRoute roles={['Admin','Faculty','Student']}><TaskListPage /></RoleBasedRoute>} />
        <Route path="projects/:projectId/tasks/:id" element={<RoleBasedRoute roles={['Admin','Faculty','Student']}><TaskDetailPage /></RoleBasedRoute>} />

        {/* Reports — Admin + Faculty */}
        <Route path="reports" element={<RoleBasedRoute roles={['Admin','Faculty']}><ReportsPage /></RoleBasedRoute>} />
      </Route>

      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}
