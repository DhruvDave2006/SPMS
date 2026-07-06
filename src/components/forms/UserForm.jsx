import { useForm } from 'react-hook-form';
import { useEffect } from 'react';

export default function UserForm({ defaultValues, onSubmit, loading, isEdit = false }) {
  const { register, handleSubmit, reset, formState: { errors } } = useForm({ defaultValues });

  useEffect(() => { reset(defaultValues); }, [defaultValues, reset]);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="form-label">Full Name *</label>
          <input
            {...register('FullName', { required: 'Full name is required', minLength: { value: 2, message: 'Min 2 chars' } })}
            className={`form-input ${errors.FullName ? 'error' : ''}`}
            placeholder="Alexandra Mercer"
          />
          {errors.FullName && <p className="text-xs text-brick-400 mt-1">{errors.FullName.message}</p>}
        </div>

        <div>
          <label className="form-label">Email Address *</label>
          <input
            {...register('Email', {
              required: 'Email is required',
              pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: 'Invalid email format' },
            })}
            type="email"
            className={`form-input ${errors.Email ? 'error' : ''}`}
            placeholder="user@spms.edu"
          />
          {errors.Email && <p className="text-xs text-brick-400 mt-1">{errors.Email.message}</p>}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {!isEdit && (
          <div>
            <label className="form-label">Password *</label>
            <input
              {...register('Password', {
                required: !isEdit ? 'Password is required' : false,
                minLength: { value: 8, message: 'Minimum 8 characters' },
              })}
              type="password"
              className={`form-input ${errors.Password ? 'error' : ''}`}
              placeholder="Min. 8 characters"
            />
            {errors.Password && <p className="text-xs text-brick-400 mt-1">{errors.Password.message}</p>}
          </div>
        )}

        <div>
          <label className="form-label">Mobile Number</label>
          <input
            {...register('MobileNumber', {
              pattern: { value: /^[0-9]{10}$/, message: '10-digit number required' },
            })}
            className={`form-input ${errors.MobileNumber ? 'error' : ''}`}
            placeholder="9876543210"
          />
          {errors.MobileNumber && <p className="text-xs text-brick-400 mt-1">{errors.MobileNumber.message}</p>}
        </div>
      </div>

      <div className="flex justify-end gap-3 pt-2">
        <button type="submit" className="btn-primary" disabled={loading}>
          {loading ? 'Saving…' : isEdit ? 'Update User' : 'Create User'}
        </button>
      </div>
    </form>
  );
}
