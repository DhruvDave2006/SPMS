import { useForm } from 'react-hook-form';
import { useEffect } from 'react';

export default function RoleForm({ defaultValues, onSubmit, loading }) {
  const { register, handleSubmit, reset, formState: { errors } } = useForm({ defaultValues });

  useEffect(() => { reset(defaultValues); }, [defaultValues, reset]);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      <div>
        <label className="form-label">Role Name *</label>
        <input
          {...register('RoleName', {
            required: 'Role name is required',
            minLength: { value: 2, message: 'Minimum 2 characters' },
            maxLength: { value: 50, message: 'Maximum 50 characters' },
          })}
          className={`form-input ${errors.RoleName ? 'error' : ''}`}
          placeholder="e.g. Moderator"
        />
        {errors.RoleName && <p className="text-xs text-brick-400 mt-1">{errors.RoleName.message}</p>}
      </div>

      <div>
        <label className="form-label">Description</label>
        <textarea
          {...register('Description', { maxLength: { value: 200, message: 'Maximum 200 characters' } })}
          className={`form-input resize-none ${errors.Description ? 'error' : ''}`}
          rows={3}
          placeholder="Brief description of this role's responsibilities…"
        />
        {errors.Description && <p className="text-xs text-brick-400 mt-1">{errors.Description.message}</p>}
      </div>

      <div className="flex justify-end gap-3 pt-2">
        <button type="submit" className="btn-primary" disabled={loading}>
          {loading ? 'Saving…' : 'Save Role'}
        </button>
      </div>
    </form>
  );
}
