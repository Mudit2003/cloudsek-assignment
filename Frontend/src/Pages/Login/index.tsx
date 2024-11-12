import React from "react";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { Link, useNavigate } from "react-router-dom";
import { loginUser } from "../../controllers/handleAuth";
import "./Login.css";
import { useAuth } from "../../contexts/authContext";
import { useAccessToken } from "../../contexts/tokenContext";
import { setAuthToken } from "../../controllers/apiClient";

interface LoginFormData {
  email: string;
  password: string;
}

const schema = yup.object().shape({
  email: yup.string().required("Email is required"),
  password: yup.string().required("Password is required"),
});

const Login: React.FC = () => {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: yupResolver(schema),
  });

  const { setUser } = useAuth();
  const { setAccessToken } = useAccessToken();
  // const onSubmit = (data: LoginFormData) => {
  //   console.log("User logged in:", data);
  //   navigate("/post-creation"); // Redirect to home page after login
  // };

  const onSubmit = async (data: LoginFormData) => {
    console.log("User logged in:", data);
    const response = await loginUser(data);

    if (response) {
      console.log("Login successful:", response);
      setUser(response.user);
      setAccessToken(response.accessToken);

      setAuthToken(response.accessToken);

      console.log(response.user);
      navigate("/post-creation");
    } else {
      console.error("Login failed.");
    }
  };

  return (
    <div className="login-container">
      <div className="login-content">
        <h2 className="login-title">Login</h2>
        <form onSubmit={handleSubmit(onSubmit)} className="login-form">
          <label htmlFor="username">Email</label>
          <input
            type="text"
            id="email"
            {...register("email")}
            className="login-input"
          />
          {errors.email && (
            <span className="error-text">{errors.email.message}</span>
          )}

          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            {...register("password")}
            className="login-input"
          />
          {errors.password && (
            <span className="error-text">{errors.password.message}</span>
          )}

          <button type="submit" className="login-button">
            Login
          </button>
        </form>
        <div className="login-footer">
          <p>
            Don't have an account?{" "}
            <Link to="/register" className="link-text">
              Register
            </Link>
          </p>
          <p>
            <Link to="/forgot-password" className="link-text">
              Forgot Password?
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
