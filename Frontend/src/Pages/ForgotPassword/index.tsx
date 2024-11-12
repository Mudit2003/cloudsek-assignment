import React from 'react';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { useNavigate } from 'react-router-dom';  // Updated import
import './ForgotPassword.css';

interface ForgotPasswordFormInputs {
  email: string;
}

const forgotPasswordSchema = yup.object().shape({
  email: yup.string().email('Invalid email').required('Email is required'),
});

const ForgotPassword: React.FC = () => {
  const { register, handleSubmit, formState: { errors } } = useForm<ForgotPasswordFormInputs>({
    resolver: yupResolver(forgotPasswordSchema),
  });

  const navigate = useNavigate();  // Updated hook for navigation

  const onSubmit = (data: ForgotPasswordFormInputs) => {
    console.log(data);
    // Navigate to OTP page or another route
    navigate('/otp-page');  // Update with the correct path for the OTP page
  };

  return (
    <div className="forgot-password-container">
      <h2>Forgot Password</h2>
      <form onSubmit={handleSubmit(onSubmit)}>
        <input {...register('email')} placeholder="Email" />
        <p className="error">{errors.email?.message}</p>
        
        <button type="submit" className="button">Submit</button>
      </form>
    </div>
  );
};

export default ForgotPassword;
