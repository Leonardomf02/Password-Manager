import React, { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [token, setToken] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/api/auth/login', {
        email,
        password,
      });
      const token = response.data.token;
  
      localStorage.setItem('token', token);
      setToken(token);
      setMessage('Login successful!');
      navigate('/dashboard');
    } catch (error) {
      setMessage('Invalid credentials.');
    }
  };
  

  return (
    <div className="d-flex justify-content-center align-items-center min-vh-100" style={{ background: 'linear-gradient(to right, #4a148c, #6a1b9a)' }}>
      <div className="card shadow-lg border-0 rounded-4" style={{ maxWidth: '450px', width: '100%' }}>
        <div className="card-body p-5">
          <h2 className="text-center mb-4" style={{ color: 'black', fontFamily: 'Arial, sans-serif', fontWeight: '600', fontSize: '2.5rem' }}>
          LockItUp
          </h2>
          <form onSubmit={handleLogin}>
            <div className="mb-4">
              <input
                type="email"
                className="form-control border-0 shadow-sm p-3 rounded-3"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                style={{ backgroundColor: '#f4f4f4' }}
              />
            </div>
            <div className="mb-5">
              <input
                type="password"
                className="form-control border-0 shadow-sm p-3 rounded-3"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                style={{ backgroundColor: '#f4f4f4' }}
              />
            </div>
            <button type="submit" className="btn btn-primary w-100 py-2 rounded-3 shadow-lg" style={{ background: '#6a11cb', transition: '0.3s' }}>
              Login
            </button>
          </form>
          {message && <p className={`text-center mt-3 ${message === 'Invalid credentials.' ? 'text-danger' : 'text-success'}`}>{message}</p>}
          {token && <p className="text-center text-white mt-3">Token: {token}</p>}
          <p className="text-center mt-4 text-black">
            Don't have an account? <Link to="/register" className="text-black fw-bold">Register</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;