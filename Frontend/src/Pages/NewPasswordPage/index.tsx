import React from 'react';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import './NewPasswordPage.css';

interface NewPasswordFormData {
  newPassword: string;
  confirmPassword: string;
}

const schema = yup.object().shape({
  newPassword: yup
    .string()
    .min(8, 'Password must be at least 8 characters')
    .matches(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .matches(/[a-z]/, 'Password must contain at least one lowercase letter')
    .matches(/[0-9]/, 'Password must contain at least one number')
    .matches(/[@$!%*?&]/, 'Password must contain at least one special character (@$!%*?&)')
    .required('New password is required'),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref('newPassword')], 'Passwords must match')
    .required('Please confirm your password'),
});

const NewPasswordPage: React.FC = () => {
  const { register, handleSubmit, formState: { errors } } = useForm<NewPasswordFormData>({
    resolver: yupResolver(schema),
  });

  const onSubmit = (data: NewPasswordFormData) => {
    console.log('Password reset successfully:', data);
    // Add password reset logic here, e.g., API call
  };

  return (
    <div className="new-password-container">
      <h2 className="title">Reset Your Password</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="new-password-form">
        <div className="form-section">
          <label htmlFor="newPassword" className="form-label">New Password</label>
          <input
            type="password"
            id="newPassword"
            {...register('newPassword')}
            className="input-field"
            placeholder="Enter new password"
          />
          {errors.newPassword && <span className="error-text">{errors.newPassword.message}</span>}
        </div>

        <div className="form-section">
          <label htmlFor="confirmPassword" className="form-label">Confirm Password</label>
          <input
            type="password"
            id="confirmPassword"
            {...register('confirmPassword')}
            className="input-field"
            placeholder="Re-enter new password"
          />
          {errors.confirmPassword && <span className="error-text">{errors.confirmPassword.message}</span>}
        </div>

        <button type="submit" className="submit-button">Reset Password</button>
      </form>
    </div>
  );
};

export default NewPasswordPage;
