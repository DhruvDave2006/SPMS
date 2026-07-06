import { useForm, Controller } from 'react-hook-form';
import { useEffect, useState } from 'react';
import { userService } from '../../services/userService';
import { statusService } from '../../services/statusService';

export default function ProjectForm({ defaultValues, onSubmit, loading, isEdit = false }) {
  const { register, handleSubmit, reset, control, formState: { errors } } = useForm({ defaultValues });
  const [students, setStudents] = useState([]);
  const [faculty, setFaculty] = useState([]);
  const [statuses, setStatuses] = useState([]);

  useEffect(() => { reset(defaultValues); }, [defaultValues, reset]);

  useEffect(() => {
    userService.getAll().then(users => {
      // We'll filter by role using mockUserRoles helper
      import('../../data/mockData.js').then(({ mockUserRoles, mockRoles }) => {
        const getRole = (userId) => {
          const ur = mockUserRoles.find(u => u.UserId === userId);
          if (!ur) return null;
          return mockRoles.find(r => r.RoleId === ur.RoleId)?.RoleName;
        };
        setStudents(users.filter(u => getRole(u.UserId) === 'Student'));
        setFaculty(users.filter(u => getRole(u.UserId) === 'Faculty'));
      });
    });
    statusService.getAll().then(setStatuses);
  }, []);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      <div>
        <label className="form-label">Project Title *</label>
        <input
          {...register('ProjectTitle', { required: 'Title is required', minLength: { value: 3, message: 'Min 3 chars' } })}
          className={`form-input ${errors.ProjectTitle ? 'error' : ''}`}
          placeholder="e.g. AI-Powered Crop Disease Detection"
        />
        {errors.ProjectTitle && <p className="text-xs text-brick-400 mt-1">{errors.ProjectTitle.message}</p>}
      </div>

      <div>
        <label className="form-label">Description</label>
        <textarea
          {...register('Description')}
          className="form-input resize-none"
          rows={3}
          placeholder="Brief overview of the project…"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="form-label">Student *</label>
          <select
            {...register('StudentId', { required: 'Student is required', valueAsNumber: true })}
            className={`form-input ${errors.StudentId ? 'error' : ''}`}
          >
            <option value="">— Select Student —</option>
            {students.map(s => <option key={s.UserId} value={s.UserId}>{s.FullName}</option>)}
          </select>
          {errors.StudentId && <p className="text-xs text-brick-400 mt-1">{errors.StudentId.message}</p>}
        </div>

        <div>
          <label className="form-label">Faculty Supervisor *</label>
          <select
            {...register('FacultyId', { required: 'Faculty is required', valueAsNumber: true })}
            className={`form-input ${errors.FacultyId ? 'error' : ''}`}
          >
            <option value="">— Select Faculty —</option>
            {faculty.map(f => <option key={f.UserId} value={f.UserId}>{f.FullName}</option>)}
          </select>
          {errors.FacultyId && <p className="text-xs text-brick-400 mt-1">{errors.FacultyId.message}</p>}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div>
          <label className="form-label">Start Date *</label>
          <input
            {...register('StartDate', { required: 'Start date required' })}
            type="date"
            className={`form-input ${errors.StartDate ? 'error' : ''}`}
          />
          {errors.StartDate && <p className="text-xs text-brick-400 mt-1">{errors.StartDate.message}</p>}
        </div>

        <div>
          <label className="form-label">End Date *</label>
          <input
            {...register('EndDate', { required: 'End date required' })}
            type="date"
            className={`form-input ${errors.EndDate ? 'error' : ''}`}
          />
          {errors.EndDate && <p className="text-xs text-brick-400 mt-1">{errors.EndDate.message}</p>}
        </div>

        <div>
          <label className="form-label">Status</label>
          <select
            {...register('ProjectStatus', { valueAsNumber: true })}
            className="form-input"
          >
            {statuses.map(s => <option key={s.StatusID} value={s.StatusID}>{s.StatusName}</option>)}
          </select>
        </div>
      </div>

      <div className="flex justify-end gap-3 pt-2">
        <button type="submit" className="btn-primary" disabled={loading}>
          {loading ? 'Saving…' : isEdit ? 'Update Project' : 'Create Project'}
        </button>
      </div>
    </form>
  );
}
