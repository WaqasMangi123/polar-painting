import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './adminlogin.css';

const LoginPageUnique = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    try {
      const response = await axios.post('https://polar-painting-backend.onrender.com/api/auth/adminlogin', { username, password });
      localStorage.setItem('adminToken', response.data.token);
      navigate('/adminpanel');
    } catch (err) {
      console.error(err);
      setError('Invalid credentials');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="unique-login-page">
      <div className="unique-login-container">
        <h2 className="unique-login-title">Admin Login</h2>
        <form onSubmit={handleLogin}>
          <div className="unique-input-group">
            <label className="unique-input-label">Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              className="unique-input-field"
            />
          </div>
          <div className="unique-input-group">
            <label className="unique-input-label">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="unique-input-field"
            />
          </div>
          {error && <p className="unique-error-message">{error}</p>}
          <button
            type="submit"
            disabled={isLoading}
            className={`unique-login-button ${isLoading ? 'unique-button-disabled' : ''}`}
          >
            {isLoading ? 'Logging in...' : 'Login'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginPageUnique;
