import React, { useState } from "react";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { Link, useNavigate } from "react-router-dom";
import { registerUser } from "../../controllers/registerUser";
import "./Register.css";

interface RegisterFormData {
  username: string;
  email: string;
  password: string;
}

// Simulated API call to check if the username is unique
const checkUsernameUnique = async (username: string) => {
  const existingUsernames = ["existingUser1", "existingUser2"]; // Replace with an API call in real scenario
  return !existingUsernames.includes(username);
};

const schema = yup.object().shape({
  username: yup
    .string()
    .matches(/^[^@]+$/, 'Username should not contain "@"')
    .required("Username is required"),
  email: yup
    .string()
    .email("Invalid email format")
    .required("Email is required"),
  password: yup
    .string()
    .min(8, "Password must be at least 8 characters")
    .required("Password is required"),
});

const Register: React.FC = () => {
  const navigate = useNavigate();
  const [usernameError, setUsernameError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: yupResolver(schema),
  });

  // const onSubmit = async (data: RegisterFormData) => {
  //   const isUnique = await checkUsernameUnique(data.username);
  //   if (!isUnique) {
  //     setUsernameError('Username is already taken');
  //     return;
  //   }
  //   setUsernameError(null);
  //   console.log('User registered successfully:', data);
  //   navigate('/login');
  // };

  const onSubmit = async (data: RegisterFormData) => {
    const isUnique = await checkUsernameUnique(data.username);
    if (!isUnique) {
      setUsernameError("Username is already taken");
      console.error("username already taken");
      return;
    }
    setUsernameError(null);
    const response = await registerUser(data);

    if (response) {
      console.log("User registered successfully:", response);
      navigate("/login");
    } else {
      console.error("Registration failed.");
    }
  };

  return (
    <div className="register-container">
      <div className="register-content">
        <h2 className="register-title">Register</h2>
        <form onSubmit={handleSubmit(onSubmit)} className="register-form">
          <label htmlFor="username">Username</label>
          <input
            type="text"
            id="username"
            {...register("username")}
            className="register-input"
          />
          {errors.username && (
            <span className="error-text">{errors.username.message}</span>
          )}
          {usernameError && <span className="error-text">{usernameError}</span>}

          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            {...register("email")}
            className="register-input"
          />
          {errors.email && (
            <span className="error-text">{errors.email.message}</span>
          )}

          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            {...register("password")}
            className="register-input"
          />
          {errors.password && (
            <span className="error-text">{errors.password.message}</span>
          )}

          <button type="submit" className="register-button">
            Register
          </button>
        </form>
        <div className="register-footer">
          <p>
            Already have an account?{" "}
            <Link to="/login" className="link-text">
              Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
