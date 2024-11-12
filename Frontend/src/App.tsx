import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./Pages/Home";
import Login from "./Pages/Login";
import Register from "./Pages/Register";
import ForgotPassword from "./Pages/ForgotPassword";
import Otp from "./Pages/Otp";
import PostCreation from "./Pages/PostCreation";
import PostPage from "./Pages/PostPage";
import NewPasswordPage from "./Pages/NewPasswordPage";
import MyPosts from "./Pages/MyPosts";
// import { AuthProvider } from "./AuthContext"; // Import AuthProvider
import { AuthProvider } from "./contexts/authContext";
import ProtectedRoute from "./ProtectedRoute"; // Import ProtectedRoute
import { userInfoPromise } from "./controllers/fetchUser";
import { AccessTokenProvider } from "./contexts/tokenContext";
import "./App.css";

const App: React.FC = () => {
  const [username, setUsername] = useState("User123"); // Example username state
  userInfoPromise
    .then((val) =>
      val != null ? setUsername(val.username) : setUsername("Mudit Rai")
    )
    .catch((err) => console.log(err));

  return (
    <AccessTokenProvider>
      <AuthProvider>
        <Router>
          <div className="app-container">
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/otp-page" element={<Otp />} />

              <Route
                path="/post-creation"
                element={<PostCreation username={username} />}
              />
              <Route path="/post-page" element={<PostPage />} />
              <Route path="/newpassword" element={<NewPasswordPage />} />
              <Route path="/myposts" element={<MyPosts />} />

              {/* Protected Routes */}

              {/* <Route
              path="/post-creation"
              element={<ProtectedRoute element={<PostCreation username={username} />} path="/post-creation" />}
            />
            <Route
              path="/post-page"
              element={<ProtectedRoute element={<PostPage />} path="/post-page" />}
            />
            <Route
              path="/newpassword"
              element={<ProtectedRoute element={<NewPasswordPage />} path="/newpassword" />}
            />
            <Route
              path="/myposts"
              element={<ProtectedRoute element={<MyPosts />} path="/myposts" />}
            /> */}
            </Routes>
          </div>
        </Router>
      </AuthProvider>
    </AccessTokenProvider>
  );
};

export default App;
