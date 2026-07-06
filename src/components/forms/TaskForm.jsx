import { useForm } from 'react-hook-form';
import { useEffect, useState } from 'react';
import { statusService } from '../../services/statusService';
import { priorityService } from '../../services/priorityService';

export default function TaskForm({ defaultValues, onSubmit, loading, isEdit = false, isStudent = false }) {
  const { register, handleSubmit, reset, formState: { errors } } = useForm({ defaultValues });
  const [statuses, setStatuses] = useState([]);
  const [priorities, setPriorities] = useState([]);

  useEffect(() => { reset(defaultValues); }, [defaultValues, reset]);
  useEffect(() => {
    statusService.getAll().then(setStatuses);
    priorityService.getAll().then(setPriorities);
  }, []);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      <div>
        <label className="form-label">Task Title *</label>
        <input
          {...register('TaskTitle', { required: 'Title is required', minLength: { value: 3, message: 'Min 3 chars' } })}
          className={`form-input ${errors.TaskTitle ? 'error' : ''}`}
          placeholder="e.g. Dataset Collection & Preprocessing"
          disabled={isStudent}
        />
        {errors.TaskTitle && <p className="text-xs text-brick-400 mt-1">{errors.TaskTitle.message}</p>}
      </div>

      <div>
        <label className="form-label">Task Description</label>
        <textarea
          {...register('TaskDescription')}
          className="form-input resize-none"
          rows={3}
          placeholder="Describe what needs to be done…"
          disabled={isStudent}
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="form-label">Priority</label>
          <select
            {...register('PriorityID', { valueAsNumber: true })}
            className="form-input"
            disabled={isStudent}
          >
            {priorities.map(p => <option key={p.PriorityID} value={p.PriorityID}>{p.PriorityName}</option>)}
          </select>
        </div>
        <div>
          <label className="form-label">Status</label>
          <select
            {...register('TaskStatus', { valueAsNumber: true })}
            className="form-input"
          >
            {statuses.map(s => <option key={s.StatusID} value={s.StatusID}>{s.StatusName}</option>)}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div>
          <label className="form-label">Start Date</label>
          <input {...register('StartDate')} type="date" className="form-input" disabled={isStudent} />
        </div>
        <div>
          <label className="form-label">Due Date *</label>
          <input
            {...register('DueDate', { required: 'Due date required' })}
            type="date"
            className={`form-input ${errors.DueDate ? 'error' : ''}`}
            disabled={isStudent}
          />
          {errors.DueDate && <p className="text-xs text-brick-400 mt-1">{errors.DueDate.message}</p>}
        </div>
        <div>
          <label className="form-label">Assigned Score</label>
          <input
            {...register('AssignedScore', { valueAsNumber: true, min: 0 })}
            type="number"
            className="form-input font-mono"
            placeholder="100"
            disabled={isStudent}
          />
        </div>
      </div>

      {/* Remarks — role-specific */}
      {!isStudent && (
        <div>
          <label className="form-label">Faculty Remarks</label>
          <textarea
            {...register('FacultyRemarks')}
            className="form-input resize-none"
            rows={2}
            placeholder="Feedback and notes for the student…"
          />
        </div>
      )}
      {isStudent && (
        <div>
          <label className="form-label">Student Remarks</label>
          <textarea
            {...register('StudentRemarks')}
            className="form-input resize-none"
            rows={2}
            placeholder="Your progress notes and comments…"
          />
        </div>
      )}

      <div className="flex justify-end gap-3 pt-2">
        <button type="submit" className="btn-primary" disabled={loading}>
          {loading ? 'Saving…' : isEdit ? 'Update Task' : 'Create Task'}
        </button>
      </div>
    </form>
  );
}
