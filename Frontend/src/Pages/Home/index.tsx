import React from 'react';
import { Link } from 'react-router-dom';
import './Home.css';

const Home: React.FC = () => {
  return (
    <div className="home-container">
      <div className="home-content">
        <h1 className="home-title">Welcome to Post and Comment Assessment</h1>
        <Link to="/login">
          <button className="home-button">Login / Register</button>
        </Link>
      </div>
    </div>
  );
};

export default Home;
