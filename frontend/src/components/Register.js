import React, { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/auth/register', {
        name,
        email,
        password,
      });
      setMessage('User registered successfully!');
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (error) {
      const errorMessage = error.response && error.response.data && error.response.data.error
        ? error.response.data.error
        : 'Error registering user.';
      setMessage(errorMessage);
    }
  };

  return (
    <div
      className="d-flex justify-content-center align-items-center min-vh-100"
      style={{ background: 'linear-gradient(to right, #4a148c, #6a1b9a)' }}
    >
      <div className="card shadow-lg border-0 rounded-4" style={{ maxWidth: '450px', width: '100%' }}>
        <div className="card-body p-5">
          <h2
            className="text-center mb-4"
            style={{
              color: 'black',
              fontFamily: 'Arial, sans-serif',
              fontWeight: '600',
              fontSize: '2.5rem',
            }}
          >
            LockItUp
          </h2>
          <form onSubmit={handleRegister}>
            <div className="mb-4">
              <input
                type="text"
                className="form-control border-0 shadow-sm p-3 rounded-3"
                placeholder="Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                style={{ backgroundColor: '#f4f4f4' }}
              />
            </div>
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
            <button
              type="submit"
              className="btn btn-primary w-100 py-2 rounded-3 shadow-lg"
              style={{ background: '#6a11cb', transition: '0.3s' }}
            >
              Register
            </button>
          </form>
          {message && (
            <div
              className="mt-4 p-3 rounded shadow-sm text-center"
              style={{
                backgroundColor: message === 'User registered successfully!' ? '#d4edda' : '#f8d7da',
                color: message === 'User registered successfully!' ? '#155724' : '#721c24',
                border: `1px solid ${
                  message === 'User registered successfully!' ? '#c3e6cb' : '#f5c6cb'
                }`,
              }}
            >
              {message}
            </div>
          )}
          <p className="text-center mt-4 text-black">
            Already have an account?{' '}
            <Link to="/login" className="text-black fw-bold">
              Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
